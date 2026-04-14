from decimal import Decimal
from typing import Generator

import google.generativeai as genai
from google.api_core.exceptions import GoogleAPIError
from django.conf import settings

from ..base import AIClient, AIResponse
from ..exceptions import AIProviderUnavailableError

# Pricing: Gemini 1.5 Pro — input $1.25/M tokens, output $5.00/M tokens
INPUT_COST_PER_TOKEN = Decimal("1.25") / Decimal("1000000")
OUTPUT_COST_PER_TOKEN = Decimal("5.00") / Decimal("1000000")
MODEL_NAME = "gemini-1.5-pro"


class GeminiAdapter(AIClient):
    def __init__(self):
        genai.configure(api_key=settings.GOOGLE_AI_API_KEY)
        self.model = genai.GenerativeModel(MODEL_NAME)

    def generate(self, prompt: str, system: str, max_tokens: int = 2048) -> AIResponse:
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=max_tokens,
                    system_instruction=system,
                ),
            )
        except GoogleAPIError as e:
            raise AIProviderUnavailableError(str(e)) from e

        tokens_in = response.usage_metadata.prompt_token_count
        tokens_out = response.usage_metadata.candidates_token_count
        cost = (Decimal(tokens_in) * INPUT_COST_PER_TOKEN) + (
            Decimal(tokens_out) * OUTPUT_COST_PER_TOKEN
        )

        return AIResponse(
            content=response.text,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            model=MODEL_NAME,
            cost_usd=cost,
        )

    def stream(
        self, prompt: str, system: str, max_tokens: int = 2048
    ) -> Generator[str, None, AIResponse]:
        tokens_in = 0
        tokens_out = 0
        collected_content = []

        try:
            response_stream = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=max_tokens,
                    system_instruction=system,
                ),
                stream=True,
            )
            for chunk in response_stream:
                if chunk.text:
                    collected_content.append(chunk.text)
                    yield chunk.text
                if hasattr(chunk, "usage_metadata") and chunk.usage_metadata:
                    tokens_in = (
                        getattr(chunk.usage_metadata, "prompt_token_count", 0) or 0
                    )
                    tokens_out = (
                        getattr(chunk.usage_metadata, "candidates_token_count", 0) or 0
                    )
        except GoogleAPIError as e:
            raise AIProviderUnavailableError(str(e)) from e

        cost = (Decimal(tokens_in) * INPUT_COST_PER_TOKEN) + (
            Decimal(tokens_out) * OUTPUT_COST_PER_TOKEN
        )
        return AIResponse(
            content="".join(collected_content),
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            model=MODEL_NAME,
            cost_usd=cost,
        )
