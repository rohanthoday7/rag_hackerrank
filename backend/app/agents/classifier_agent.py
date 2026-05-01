from app.agents.types import AgentContext


class ClassifierAgent:
    name = "classifier_agent"

    async def run(self, ctx: AgentContext) -> dict:
        text = f"{ctx.subject} {ctx.body}".lower()
        issue_type = "general"
        urgency = "normal"
        if any(k in text for k in ["fraud", "scam", "chargeback", "unauthorized"]):
            issue_type = "fraud"
            urgency = "high"
        elif any(k in text for k in ["billing", "invoice", "payment", "refund"]):
            issue_type = "billing"
        elif any(k in text for k in ["account locked", "password", "login", "compromise"]):
            issue_type = "account_access"
            urgency = "high"

        product = "unknown"
        if "hackerrank" in text:
            product = "hackerrank"
        elif "claude" in text:
            product = "claude"
        elif "visa" in text:
            product = "visa"

        result = {"issue_type": issue_type, "product": product, "intent": "support_request", "urgency": urgency}
        ctx.classification = result
        return result
