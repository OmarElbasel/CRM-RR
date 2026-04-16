from django.conf import settings
from .base import AIClient


def get_ai_client() -> AIClient:
    """
    Return the AI client configured by AI_PROVIDER env var.
    Default: claude. Options: claude, openai, gemini.
    Raises ValueError for unknown providers.
    """
    provider = getattr(settings, 'AI_PROVIDER', 'claude').lower()

    if provider == 'claude':
        from .adapters.claude import ClaudeAdapter
        return ClaudeAdapter()
    elif provider == 'openai':
        from .adapters.openai import OpenAIAdapter
        return OpenAIAdapter()
    elif provider == 'gemini':
        from .adapters.gemini import GeminiAdapter
        return GeminiAdapter()
    elif provider == 'openrouter':
        from .adapters.openrouter import OpenRouterAdapter
        return OpenRouterAdapter()
    elif provider == 'alibaba':
        from .adapters.alibaba import AlibabaAdapter
        return AlibabaAdapter()
    elif provider == 'ollama':
        from .adapters.ollama import OllamaAdapter
        return OllamaAdapter()
    else:
        raise ValueError(f"Unknown AI_PROVIDER: '{provider}'. Must be one of: claude, openai, gemini, openrouter, alibaba, ollama.")