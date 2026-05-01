from app.agents.types import AgentContext
from app.retrieval.vector_store import InMemoryVectorStore
from app.core.config import get_settings


class RetrievalAgent:
    name = "retrieval_agent"

    def __init__(self, store: InMemoryVectorStore):
        self.store = store
        self.settings = get_settings()

    async def run(self, ctx: AgentContext) -> dict:
        query = f'{ctx.classification.get("product", "")} {ctx.classification.get("issue_type", "")} {ctx.subject} {ctx.body}'
        hits = self.store.search(query, top_k=self.settings.retrieval_top_k)
        expected_source = ctx.source
        source_scoped = [h for h in hits if h.get("source") == expected_source]
        candidates = source_scoped if source_scoped else hits
        filtered = [h for h in candidates if h["score"] >= self.settings.retrieval_min_score]
        avg_score = sum(h["score"] for h in filtered) / len(filtered) if filtered else 0.0
        compressed_context = " ".join(h["chunk"][:220] for h in filtered[:3])[: self.settings.max_context_chars]
        result = {
            "query": query,
            "hits": filtered,
            "compressed_context": compressed_context,
            "retrieval_confidence": round(avg_score, 4),
            "grounded_only": True,
        }
        ctx.retrieval = result
        return result
