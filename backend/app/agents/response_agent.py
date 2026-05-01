from app.agents.types import AgentContext
from app.agents.base import BaseAgent
import json

class ResponseAgent(BaseAgent):
    name = "response_agent"

    async def run(self, ctx: AgentContext) -> dict:
        if ctx.escalation.get("escalated"):
            text = (
                "Your request has been escalated to a human specialist because it involves high-risk or policy-sensitive "
                "signals. We have attached the relevant knowledge-base context to speed up resolution."
            )
            citations = []
            grounded = True
        else:
            hits = ctx.retrieval.get("hits", [])
            context = "\n".join([f"DOC {i}: {h['chunk']}" for i, h in enumerate(hits)])
            
            prompt = f"""
            Generate a grounded response for the customer (Stage 4).
            
            Subject: {ctx.subject}
            Body: {ctx.body}
            
            Retrieved Docs:
            {context}
            
            Rules:
            - Strictly use the provided docs.
            - If info is missing, say you cannot provide a grounded answer.
            
            Return JSON with:
            - response_text: string
            - grounded: boolean
            """
            
            llm_res = self.llm.generate_json(self.system_prompt, prompt)
            text = llm_res.get("response_text", "I cannot provide a grounded answer for this request.")
            grounded = llm_res.get("grounded", False)
            citations = [{"document_id": h["document_id"], "score": h["score"], "source": h["source"]} for h in hits[:3]]
            
        result = {"response_text": text, "citations": citations, "grounded": grounded}
        ctx.response = result
        return result
