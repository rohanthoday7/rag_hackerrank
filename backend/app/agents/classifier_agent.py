from app.agents.types import AgentContext
from app.agents.base import BaseAgent
import json

class ClassifierAgent(BaseAgent):
    name = "classifier_agent"

    async def run(self, ctx: AgentContext) -> dict:
        prompt = f"""
        Analyze this ticket and classify it.
        Subject: {ctx.subject}
        Body: {ctx.body}
        
        Return JSON with:
        - product: "visa", "claude", "hackerrank", or "unknown"
        - intent: brief string
        - urgency: "normal", "high"
        - issue_type: "billing", "fraud", "account_access", or "general"
        """
        
        result = self.llm.generate_json(self.system_prompt, prompt)
        ctx.classification = result
        return result
