import json
from pathlib import Path
from app.retrieval.vector_store import InMemoryVectorStore


def chunk_text(text: str, max_chars: int = 450, overlap: int = 80) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = min(len(text), start + max_chars)
        chunks.append(text[start:end])
        start += max_chars - overlap
    return chunks


def load_corpus(dataset_path: Path, store: InMemoryVectorStore) -> int:
    raw = json.loads(dataset_path.read_text(encoding="utf-8"))
    inserted = 0
    records = []
    for doc in raw:
        for idx, chunk in enumerate(chunk_text(doc["content"])):
            records.append(
                {
                    "document_id": f'{doc["id"]}::chunk-{idx}',
                    "source": doc["source"],
                    "chunk": chunk,
                    "metadata": {"title": doc.get("title", ""), "product": doc.get("product", "general")},
                }
            )
            inserted += 1
    store.upsert_many(records)
    return inserted
