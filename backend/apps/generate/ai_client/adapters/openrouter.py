from decimal import Decimal
from typing import Generator

import openai
from django.conf import settings

from ..base import AIClient, AIResponse
from ..exceptions import AIProviderUnavailableError

# OpenRouter charges vary per model — use a conservative default.
# Cost is approximated from token counts; update via AdminConfig cost rates.
INPUT_COST_PER_TOKEN = Decimal('0.00000035')   # $0.35 / 1M (Gemma 3 27B estimate)
OUTPUT_COST_PER_TOKEN = Decimal('0.00000035')


class OpenRouterAdapter(AIClient):
    """
    OpenAI-compatible adapter for OpenRouter (openrouter.ai).
    Supports any model available on OpenRouter — set OPENROUTER_MODEL in env.
    Default model: google/gemma-3-27b-it

    Env vars required:
        OPENROUTER_API_KEY  — from openrouter.ai/keys
        OPENROUTER_MODEL    — e.g. google/gemma-3-27b-it, meta-llama/llama-3.3-70b-instruct
    """

    def __init__(self):
        self.model = getattr(settings, 'OPENROUTER_MODEL', 'google/gemma-3-27b-it')
        self.client = openai.OpenAI(
            api_key=settings.OPENROUTER_API_KEY,
            base_url='https://openrouter.ai/api/v1',
            default_headers={
                'HTTP-Referer': getattr(settings, 'SITE_URL', 'https://rawaj.io'),
                'X-Title': 'Rawaj AI',
            },
        )

    def generate(self, prompt: str, system: str, max_tokens: int = 2048) -> AIResponse:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                max_tokens=max_tokens,
                messages=[
                    {'role': 'system', 'content': system},
                    {'role': 'user', 'content': prompt},
                ],
            )
        except openai.APIError as e:
            raise AIProviderUnavailableError(str(e)) from e

        tokens_in = response.usage.prompt_tokens if response.usage else 0
        tokens_out = response.usage.completion_tokens if response.usage else 0
        cost = (Decimal(tokens_in) * INPUT_COST_PER_TOKEN) + (Decimal(tokens_out) * OUTPUT_COST_PER_TOKEN)

        return AIResponse(
            content=response.choices[0].message.content,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            model=self.model,
            cost_usd=cost,
        )

    def stream(self, prompt: str, system: str, max_tokens: int = 2048) -> Generator[str, None, AIResponse]:
        tokens_in = 0
        tokens_out = 0
        collected_content = []

        try:
            response_stream = self.client.chat.completions.create(
                model=self.model,
                max_tokens=max_tokens,
                messages=[
                    {'role': 'system', 'content': system},
                    {'role': 'user', 'content': prompt},
                ],
                stream=True,
                stream_options={'include_usage': True},
            )
            for chunk in response_stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    text = chunk.choices[0].delta.content
                    collected_content.append(text)
                    yield text
                if chunk.usage:
                    tokens_in = chunk.usage.prompt_tokens
                    tokens_out = chunk.usage.completion_tokens
        except openai.APIError as e:
            raise AIProviderUnavailableError(str(e)) from e

        cost = (Decimal(tokens_in) * INPUT_COST_PER_TOKEN) + (Decimal(tokens_out) * OUTPUT_COST_PER_TOKEN)
        return AIResponse(
            content=''.join(collected_content),
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            model=self.model,
            cost_usd=cost,
        )
