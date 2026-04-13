from decimal import Decimal
from typing import Generator

import anthropic
from django.conf import settings

from ..base import AIClient, AIResponse
from ..exceptions import AIProviderUnavailableError

# Pricing: Claude Sonnet — input $3.00/M tokens, output $15.00/M tokens
INPUT_COST_PER_TOKEN = Decimal('3.00') / Decimal('1000000')
OUTPUT_COST_PER_TOKEN = Decimal('15.00') / Decimal('1000000')
MODEL = 'claude-sonnet-4-20250514'


class ClaudeAdapter(AIClient):

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    def generate(self, prompt: str, system: str, max_tokens: int = 2048) -> AIResponse:
        try:
            response = self.client.messages.create(
                model=MODEL,
                max_tokens=max_tokens,
                system=system,
                messages=[{'role': 'user', 'content': prompt}],
            )
        except anthropic.APIError as e:
            raise AIProviderUnavailableError(str(e)) from e

        tokens_in = response.usage.input_tokens
        tokens_out = response.usage.output_tokens
        cost = (Decimal(tokens_in) * INPUT_COST_PER_TOKEN) + (Decimal(tokens_out) * OUTPUT_COST_PER_TOKEN)

        return AIResponse(
            content=response.content[0].text,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            model=MODEL,
            cost_usd=cost,
        )

    def stream(self, prompt: str, system: str, max_tokens: int = 2048) -> Generator[str, None, AIResponse]:
        try:
            tokens_in = 0
            tokens_out = 0
            with self.client.messages.stream(
                model=MODEL,
                max_tokens=max_tokens,
                system=system,
                messages=[{'role': 'user', 'content': prompt}],
            ) as stream:
                for event in stream:
                    if hasattr(event, 'type') and event.type == 'content_block_delta':
                        if hasattr(event.delta, 'text'):
                            yield event.delta.text
                final_message = stream.get_final_message()
                tokens_in = final_message.usage.input_tokens
                tokens_out = final_message.usage.output_tokens
        except anthropic.APIError as e:
            raise AIProviderUnavailableError(str(e)) from e

        cost = (Decimal(tokens_in) * INPUT_COST_PER_TOKEN) + (Decimal(tokens_out) * OUTPUT_COST_PER_TOKEN)
        return AIResponse(
            content='',
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            model=MODEL,
            cost_usd=cost,
        )