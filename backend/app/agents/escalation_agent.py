from app.agents.types import AgentContext
from app.core.config import get_settings


class EscalationAgent:
    name = "escalation_agent"

    def __init__(self):
        self.settings = get_settings()

    async def run(self, ctx: AgentContext) -> dict:
        reasons = []
        risk = 0.0
        if ctx.classification.get("urgency") == "high":
            reasons.append("high_urgency")
            risk += 0.25
        if ctx.classification.get("issue_type") in {"fraud", "billing"}:
            reasons.append("sensitive_issue_type")
            risk += 0.25
        if not ctx.safety.get("safe_to_answer", True):
            reasons.append("safety_flags_present")
            risk += 0.35
        if ctx.retrieval.get("retrieval_confidence", 0.0) < self.settings.retrieval_min_score:
            reasons.append("insufficient_grounding")
            risk += 0.35
        if not ctx.retrieval.get("hits"):
            reasons.append("no_grounded_sources")
            risk += 0.4
        escalated = risk >= self.settings.escalation_threshold
        result = {"escalated": escalated, "risk_score": round(min(1.0, risk), 4), "reasons": reasons}
        ctx.escalation = result
        return result
