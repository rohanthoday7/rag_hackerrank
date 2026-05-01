from app.agents.types import AgentContext
from app.agents.base import BaseAgent
import json

class SafetyAgent(BaseAgent):
    name = "safety_agent"

    async def run(self, ctx: AgentContext) -> dict:
        hits = ctx.retrieval.get("hits", [])
        context = "\n".join([f"DOC {i}: {h['chunk']}" for i, h in enumerate(hits)])
        
        prompt = f"""
        Perform a Safety Audit (Stage 2 & 3 of the framework).
        
        Ticket Subject: {ctx.subject}
        Ticket Body: {ctx.body}
        
        Retrieved Context:
        {context}
        
        Analyze for:
        1. Redline triggers (Skip 2FA, Unauthorized access, etc.)
        2. Semantic Divergence between request and policy.
        
        Return JSON with:
        - risk_score: float (0.0 to 1.0)
        - safety_compliance: float (0.0 to 1.0)
        - flags: list of strings (e.g., "social_engineering", "policy_divergence")
        - safe_to_answer: boolean
        - explanation: technical justification for the decision.
        """
        
        result = self.llm.generate_json(self.system_prompt, prompt)
        # Ensure schema compliance
        result.setdefault("risk_score", 0.0)
        result.setdefault("safety_compliance", 1.0)
        result.setdefault("flags", [])
        result.setdefault("safe_to_answer", True)
        
        ctx.safety = result
        return result
