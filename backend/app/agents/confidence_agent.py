from app.agents.types import AgentContext


class ConfidenceAgent:
    name = "confidence_agent"

    async def run(self, ctx: AgentContext) -> dict:
        retrieval = float(ctx.retrieval.get("retrieval_confidence", 0.0))
        safety = float(ctx.safety.get("safety_confidence", 0.0))
        escalation_signal = 1.0 - float(ctx.escalation.get("risk_score", 0.0))
        final_score = (0.45 * retrieval) + (0.35 * safety) + (0.20 * escalation_signal)
        result = {
            "retrieval_confidence": round(retrieval, 4),
            "safety_confidence": round(safety, 4),
            "escalation_confidence": round(escalation_signal, 4),
            "final_confidence": round(final_score, 4),
        }
        ctx.confidence = result
        return result
