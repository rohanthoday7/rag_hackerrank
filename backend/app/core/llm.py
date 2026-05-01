import os
import json
from google import genai
from app.core.config import get_settings

settings = get_settings()

class LLMService:
    def __init__(self):
        api_key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=api_key)
        self.model_id = "gemini-2.0-flash"

    def generate_json(self, system_instruction: str, prompt: str) -> dict:
        """
        Synchronous wrapper for generate_content with JSON response.
        Note: google-genai 1.x client is primarily synchronous for simple calls.
        """
        response = self.client.models.generate_content(
            model=self.model_id,
            contents=prompt,
            config={
                "system_instruction": system_instruction,
                "response_mime_type": "application/json"
            }
        )
        try:
            return json.loads(response.text)
        except Exception:
            # Fallback if parsing fails
            return {}

llm_service = LLMService()
