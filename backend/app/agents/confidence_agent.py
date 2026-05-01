from app.agents.types import AgentContext
from app.agents.base import BaseAgent

class ConfidenceAgent(BaseAgent):
    name = "confidence_agent"

    async def run(self, ctx: AgentContext) -> dict:
        # Align with the SentinelSupport metrics framework
        safety_comp = ctx.safety.get("safety_compliance", 1.0)
        risk_score = ctx.safety.get("risk_score", 0.0)
        retrieval_conf = ctx.retrieval.get("retrieval_confidence", 0.0)
        
        # Final grounding is a weighted balance of safety and retrieval
        final_confidence = (safety_comp * 0.4) + (retrieval_conf * 0.6)
        if risk_score > 0.8:
            final_confidence *= 0.2 # Drastic drop for high risk
            
        result = {
            "retrieval_confidence": round(retrieval_conf, 4),
            "safety_confidence": round(safety_comp, 4),
            "escalation_confidence": round(1.0 if ctx.escalation.get("escalated") else 0.8, 4),
            "final_confidence": round(min(1.0, final_confidence), 4)
        }
        ctx.confidence = result
        return result
