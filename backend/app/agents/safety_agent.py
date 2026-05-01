from app.agents.types import AgentContext


class SafetyAgent:
    name = "safety_agent"

    async def run(self, ctx: AgentContext) -> dict:
        text = f"{ctx.subject} {ctx.body}".lower()
        flags = set()
        if any(k in text for k in ["fraud", "stolen card", "unauthorized", "chargeback"]):
            flags.add("fraud_risk")
        if any(k in text for k in ["lawsuit", "legal advice", "regulatory"]):
            flags.add("policy_sensitive")
        if "password reset link me directly" in text:
            flags.add("social_engineering_pattern")
        if any(k in text for k in ["full card number", "cvv", "ssn", "otp"]):
            flags.add("sensitive_data_request")
        if any(k in text for k in ["ignore previous instructions", "disregard policy", "system prompt", "reveal hidden instruction"]):
            flags.add("prompt_injection_pattern")
        requested_product = ctx.classification.get("product", "unknown")
        top_hit_product = (ctx.retrieval.get("hits", [{}])[0].get("metadata", {}).get("product") if ctx.retrieval.get("hits") else None)
        if requested_product != "unknown" and top_hit_product and requested_product not in str(top_hit_product):
            flags.add("product_context_mismatch")
        if ctx.retrieval.get("retrieval_confidence", 0.0) < 0.4:
            flags.add("low_retrieval_grounding")
        hard_block = any(f in flags for f in ["fraud_risk", "policy_sensitive", "social_engineering_pattern", "sensitive_data_request", "prompt_injection_pattern"])
        safety_confidence = max(0.0, 1.0 - (len(flags) * 0.15))
        result = {"flags": sorted(flags), "safe_to_answer": not hard_block and "low_retrieval_grounding" not in flags, "safety_confidence": round(safety_confidence, 4)}
        ctx.safety = result
        return result
