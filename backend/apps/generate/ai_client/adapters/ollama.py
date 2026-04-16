from decimal import Decimal
from typing import Generator
import logging

import openai
from django.conf import settings

from ..base import AIClient, AIResponse
from ..exceptions import AIProviderUnavailableError

logger = logging.getLogger(__name__)

# Ollama runs locally — no cost
ZERO = Decimal('0')


class OllamaAdapter(AIClient):
    """
    Ollama local model adapter using Ollama's OpenAI-compatible API.

    Env vars:
        OLLAMA_BASE_URL  — default: http://localhost:11434/v1
        OLLAMA_MODEL     — default: llama3.2
    """

    def __init__(self):
        self.model = getattr(settings, 'OLLAMA_MODEL', 'llama3.2')
        base_url = getattr(settings, 'OLLAMA_BASE_URL', 'http://localhost:11434/v1')
        # Ollama doesn't require a real API key but the openai client needs a non-empty string
        self.client = openai.OpenAI(api_key='ollama', base_url=base_url)

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
            logger.error("Ollama API error in generate(): %s %s", type(e).__name__, e)
            raise AIProviderUnavailableError(str(e)) from e

        tokens_in = response.usage.prompt_tokens if response.usage else 0
        tokens_out = response.usage.completion_tokens if response.usage else 0

        return AIResponse(
            content=response.choices[0].message.content,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            model=self.model,
            cost_usd=ZERO,
        )

    def stream(self, prompt: str, system: str, max_tokens: int = 2048) -> Generator[str, None, AIResponse]:
        tokens_in = 0
        tokens_out = 0
        collected = []

        try:
            response_stream = self.client.chat.completions.create(
                model=self.model,
                max_tokens=max_tokens,
                messages=[
                    {'role': 'system', 'content': system},
                    {'role': 'user', 'content': prompt},
                ],
                stream=True,
            )
            for chunk in response_stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    text = chunk.choices[0].delta.content
                    collected.append(text)
                    yield text
                if chunk.usage:
                    tokens_in = chunk.usage.prompt_tokens
                    tokens_out = chunk.usage.completion_tokens
        except openai.APIError as e:
            logger.error("Ollama API error in stream(): %s %s", type(e).__name__, e)
            raise AIProviderUnavailableError(str(e)) from e

        return AIResponse(
            content=''.join(collected),
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            model=self.model,
            cost_usd=ZERO,
        )
