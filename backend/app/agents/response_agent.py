from app.agents.types import AgentContext


class ResponseAgent:
    name = "response_agent"

    async def run(self, ctx: AgentContext) -> dict:
        if ctx.escalation.get("escalated"):
            text = (
                "Your request has been escalated to a human specialist because it involves high-risk or policy-sensitive "
                "signals. We have attached the relevant knowledge-base context to speed up resolution."
            )
            citations = []
        else:
            hits = ctx.retrieval.get("hits", [])
            if not hits:
                text = (
                    "I cannot provide a grounded answer from the approved support corpus for this request. "
                    "To prevent hallucinations, this case should be escalated to a human specialist."
                )
                citations = []
            else:
                support_points = ctx.retrieval.get("compressed_context", "")
                text = (
                    "Based on approved support documentation, here are the safest next steps: "
                    f"{support_points} If this does not resolve the issue, reply and I will escalate immediately."
                )
                citations = [{"document_id": h["document_id"], "score": h["score"], "source": h["source"]} for h in hits[:3]]
        result = {"response_text": text, "citations": citations, "grounded": len(citations) > 0 or ctx.escalation.get("escalated", False)}
        ctx.response = result
        return result
