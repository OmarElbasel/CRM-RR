import logging
from decimal import Decimal
from typing import Generator

import openai
from django.conf import settings

from ..base import AIClient, AIResponse
from ..exceptions import AIProviderUnavailableError

logger = logging.getLogger(__name__)

# DashScope Qwen model pricing (est. $0.002 / 1k tokens for Qwen-Plus)
# These are placeholders; adjust as needed.
INPUT_COST_PER_TOKEN = Decimal('0.000002')
OUTPUT_COST_PER_TOKEN = Decimal('0.000002')


class AlibabaAdapter(AIClient):
    """
    Alibaba Cloud DashScope adapter using OpenAI-compatible API.
    
    Env vars required:
        ALIBABA_API_KEY      — from Alibaba Cloud Model Studio
        ALIBABA_MODEL        — default: qwen-plus
        ALIBABA_BASE_URL     — default: Singapore endpoint
    """

    def __init__(self):
        self.model = getattr(settings, 'ALIBABA_MODEL', 'qwen-plus')
        base_url = getattr(settings, 'ALIBABA_BASE_URL', 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1')
        
        self.client = openai.OpenAI(
            api_key=settings.ALIBABA_API_KEY,
            base_url=base_url,
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
            logger.error("Alibaba API error in generate(): %s %s", type(e).__name__, e)
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
