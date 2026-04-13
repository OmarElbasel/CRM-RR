from abc import ABC, abstractmethod
from dataclasses import dataclass
from decimal import Decimal
from typing import Generator


@dataclass
class AIResponse:
    """Standardized response from any AI provider."""
    content: str          # raw text/JSON string from provider
    tokens_in: int
    tokens_out: int
    model: str            # e.g. "claude-3-5-sonnet-20241022"
    cost_usd: Decimal


class AIClient(ABC):
    """
    Provider-agnostic AI client interface (Constitution Principle II).
    Each provider implements generate() (sync) and stream() (SSE tokens).
    """

    @abstractmethod
    def generate(self, prompt: str, system: str, max_tokens: int = 2048) -> AIResponse:
        """Send a prompt and return the full response."""
        ...

    @abstractmethod
    def stream(self, prompt: str, system: str, max_tokens: int = 2048) -> Generator[str, None, AIResponse]:
        """
        Yield partial tokens as strings. After the generator is exhausted,
        the final AIResponse with token counts is available via generator.value
        (use `return ai_response` at end of generator).
        """
        ...