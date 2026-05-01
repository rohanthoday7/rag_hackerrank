from app.agents.types import AgentContext


class SafetyAgent:
    name = "safety_agent"

    async def run(self, ctx: AgentContext) -> dict:
        text = f"{ctx.subject} {ctx.body}".lower()
        flags = []
        if any(k in text for k in ["fraud", "stolen card", "unauthorized", "chargeback"]):
            flags.append("fraud_risk")
        if any(k in text for k in ["lawsuit", "legal advice", "regulatory"]):
            flags.append("policy_sensitive")
        if "password reset link me directly" in text:
            flags.append("social_engineering_pattern")
        if any(k in text for k in ["full card number", "cvv", "ssn", "otp"]):
            flags.append("sensitive_data_request")
        requested_product = ctx.classification.get("product", "unknown")
        top_hit_product = (ctx.retrieval.get("hits", [{}])[0].get("metadata", {}).get("product") if ctx.retrieval.get("hits") else None)
        if requested_product != "unknown" and top_hit_product and requested_product not in str(top_hit_product):
            flags.append("product_context_mismatch")
        if ctx.retrieval.get("retrieval_confidence", 0.0) < 0.4:
            flags.append("low_retrieval_grounding")
        hard_block = any(f in flags for f in ["fraud_risk", "policy_sensitive", "social_engineering_pattern", "sensitive_data_request"])
        safety_confidence = max(0.0, 1.0 - (len(flags) * 0.15))
        result = {"flags": flags, "safe_to_answer": (len(flags) == 0) and not hard_block, "safety_confidence": round(safety_confidence, 4)}
        ctx.safety = result
        return result
