from app.agents.types import AgentContext
from app.agents.base import BaseAgent
from app.core.config import get_settings

class EscalationAgent(BaseAgent):
    name = "escalation_agent"

    def __init__(self):
        super().__init__()
        self.settings = get_settings()

    async def run(self, ctx: AgentContext) -> dict:
        risk_score = ctx.safety.get("risk_score", 0.0)
        reasons = ctx.safety.get("flags", [])
        
        # Enforce escalation based on LLM risk score and safety compliance
        escalated = risk_score > 0.6 or not ctx.safety.get("safe_to_answer", True)
        
        if escalated and not reasons:
            reasons.append("high_risk_threshold_breach")
            
        result = {
            "escalated": escalated,
            "risk_score": risk_score,
            "reasons": reasons,
            "explanation": ctx.safety.get("explanation", "Escalated due to safety/risk signals.")
        }
        ctx.escalation = result
        return result
