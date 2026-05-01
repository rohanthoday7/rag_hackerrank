from __future__ import annotations
from dataclasses import dataclass
import os
import hashlib
import numpy as np
from google import genai
from app.core.config import get_settings

try:
    import faiss  # type: ignore
except Exception:  # pragma: no cover
    faiss = None

try:
    from sentence_transformers import SentenceTransformer
except Exception:  # pragma: no cover
    SentenceTransformer = None


@dataclass
class VectorDoc:
    document_id: str
    source: str
    chunk: str
    metadata: dict
    embedding: np.ndarray


class InMemoryVectorStore:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.docs: list[VectorDoc] = []
        self._index = None
        self._model = None
        if SentenceTransformer is not None:
            self._model = SentenceTransformer(self.settings.embedding_model)

    def _embed(self, text: str) -> np.ndarray:
        if self._model is not None:
            vec = self._model.encode(text, normalize_embeddings=True)
            return np.asarray(vec, dtype=np.float32)
        if not self.settings.embedding_fallback_to_hash:
            raise RuntimeError("Embedding model unavailable and fallback disabled")
        
        try:
            api_key = os.getenv("GEMINI_API_KEY", "dummy-key")
            client = genai.Client(api_key=api_key)
            result = client.models.embed_content(
                model='text-embedding-004',
                contents=text
            )
            vec = np.asarray(result.embeddings[0].values, dtype=np.float32)
        except Exception as e:
            print(f"Fallback embedding failed: {e}")
            vec = np.zeros(768, dtype=np.float32)
            
        norm = np.linalg.norm(vec) or 1.0
        return vec / norm

    def upsert(self, document_id: str, source: str, chunk: str, metadata: dict) -> None:
        emb = self._embed(chunk)
        self.docs.append(VectorDoc(document_id=document_id, source=source, chunk=chunk, metadata=metadata, embedding=emb))
        self._rebuild_index()

    def upsert_many(self, records: list[dict]) -> None:
        for record in records:
            emb = self._embed(record["chunk"])
            self.docs.append(
                VectorDoc(
                    document_id=record["document_id"],
                    source=record["source"],
                    chunk=record["chunk"],
                    metadata=record["metadata"],
                    embedding=emb,
                )
            )
        self._rebuild_index()

    def _rebuild_index(self) -> None:
        if not self.docs:
            self._index = None
            return
        matrix = np.vstack([doc.embedding for doc in self.docs]).astype(np.float32)
        if faiss is not None:
            self._index = faiss.IndexFlatIP(matrix.shape[1])
            self._index.add(matrix)
        else:
            self._index = matrix

    @staticmethod
    def _keyword_overlap(query: str, text: str) -> float:
        q = {w for w in query.lower().split() if len(w) > 2}
        t = {w for w in text.lower().split() if len(w) > 2}
        if not q:
            return 0.0
        return len(q.intersection(t)) / len(q)

    def search(self, query: str, top_k: int = 6) -> list[dict]:
        if not self.docs or self._index is None:
            return []
        q = self._embed(query).reshape(1, -1).astype(np.float32)
        if faiss is not None and hasattr(self._index, "search"):
            scores, indices = self._index.search(q, min(top_k * 3, len(self.docs)))
            pairs = list(zip(indices[0].tolist(), scores[0].tolist()))
        else:
            matrix = self._index
            sims = (q @ matrix.T)[0]
            ranked_idx = np.argsort(-sims)[: min(top_k * 3, len(self.docs))]
            pairs = [(int(i), float(sims[i])) for i in ranked_idx]

        alpha = self.settings.retrieval_hybrid_alpha
        reranked = []
        for idx, vec_score in pairs:
            if idx < 0:
                continue
            doc = self.docs[idx]
            lexical = self._keyword_overlap(query, f"{doc.chunk} {doc.metadata.get('title', '')}")
            score = (alpha * float(vec_score)) + ((1.0 - alpha) * lexical)
            reranked.append((idx, score))
        reranked.sort(key=lambda x: x[1], reverse=True)
        ranked_idx = [i for i, _ in reranked[:top_k]]
        score_map = {i: s for i, s in reranked}
        results = [
            {
                "document_id": self.docs[i].document_id,
                "source": self.docs[i].source,
                "chunk": self.docs[i].chunk,
                "score": float(score_map[i]),
                "metadata": self.docs[i].metadata,
            }
            for i in ranked_idx
        ]
        seen = set()
        deduped = []
        for result in results:
            key = (result["source"], result["chunk"][:120])
            if key in seen:
                continue
            seen.add(key)
            deduped.append(result)
        return deduped
