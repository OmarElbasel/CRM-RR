from decimal import Decimal
from typing import Generator

import openai
from django.conf import settings

from ..base import AIClient, AIResponse
from ..exceptions import AIProviderUnavailableError

# Pricing: GPT-4o — input $2.50/M tokens, output $10.00/M tokens
INPUT_COST_PER_TOKEN = Decimal('2.50') / Decimal('1000000')
OUTPUT_COST_PER_TOKEN = Decimal('10.00') / Decimal('1000000')
MODEL = 'gpt-4o'


class OpenAIAdapter(AIClient):

    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

    def generate(self, prompt: str, system: str, max_tokens: int = 2048) -> AIResponse:
        try:
            response = self.client.chat.completions.create(
                model=MODEL,
                max_tokens=max_tokens,
                messages=[
                    {'role': 'system', 'content': system},
                    {'role': 'user', 'content': prompt},
                ],
            )
        except openai.APIError as e:
            raise AIProviderUnavailableError(str(e)) from e

        tokens_in = response.usage.prompt_tokens
        tokens_out = response.usage.completion_tokens
        cost = (Decimal(tokens_in) * INPUT_COST_PER_TOKEN) + (Decimal(tokens_out) * OUTPUT_COST_PER_TOKEN)

        return AIResponse(
            content=response.choices[0].message.content,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            model=MODEL,
            cost_usd=cost,
        )

    def stream(self, prompt: str, system: str, max_tokens: int = 2048) -> Generator[str, None, AIResponse]:
        tokens_in = 0
        tokens_out = 0
        collected_content = []

        try:
            response_stream = self.client.chat.completions.create(
                model=MODEL,
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
            model=MODEL,
            cost_usd=cost,
        )