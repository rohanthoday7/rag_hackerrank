from app.agents.types import AgentContext
from app.agents.base import BaseAgent

class GapAnalysisAgent(BaseAgent):
    name = "gap_analysis_agent"

    async def run(self, ctx: AgentContext) -> dict:
        # Only trigger if we had low retrieval confidence or no hits
        retrieval_conf = ctx.retrieval.get("retrieval_confidence", 0.0)
        
        if retrieval_conf > 0.6:
            return {"gap_detected": False}

        prompt = f"""
        Analyze this support ticket which could NOT be answered by the current knowledge base.
        
        Ticket Subject: {ctx.subject}
        Ticket Body: {ctx.body}
        
        Identify the SPECIFIC piece of information that is missing from our documentation.
        
        Return JSON with:
        - gap_detected: true
        - missing_topic: string (the title of the missing info)
        - suggested_content: string (a brief draft of what the documentation should cover)
        - impact_score: float (0.0 to 1.0, how critical it is to fix this gap)
        """
        
        result = self.llm.generate_json(self.system_prompt, prompt)
        ctx.gap_analysis = result
        return result
