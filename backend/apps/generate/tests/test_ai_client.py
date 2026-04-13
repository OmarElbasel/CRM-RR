from decimal import Decimal
from unittest.mock import patch

import pytest

from apps.generate.ai_client import get_ai_client
from apps.generate.ai_client.base import AIResponse


@pytest.mark.django_db
class TestGetAIClient:
    def test_returns_claude_adapter_by_default(self, settings):
        settings.AI_PROVIDER = 'claude'
        settings.ANTHROPIC_API_KEY = 'test-key'
        client = get_ai_client()
        from apps.generate.ai_client.adapters.claude import ClaudeAdapter
        assert isinstance(client, ClaudeAdapter)

    def test_returns_openai_adapter(self, settings):
        settings.AI_PROVIDER = 'openai'
        settings.OPENAI_API_KEY = 'test-key'
        client = get_ai_client()
        from apps.generate.ai_client.adapters.openai import OpenAIAdapter
        assert isinstance(client, OpenAIAdapter)

    def test_returns_gemini_adapter(self, settings):
        settings.AI_PROVIDER = 'gemini'
        settings.GOOGLE_AI_API_KEY = 'test-key'
        with patch('google.generativeai.configure'):
            with patch('google.generativeai.GenerativeModel'):
                client = get_ai_client()
        from apps.generate.ai_client.adapters.gemini import GeminiAdapter
        assert isinstance(client, GeminiAdapter)

    def test_raises_for_unknown_provider(self, settings):
        settings.AI_PROVIDER = 'unknown'
        with pytest.raises(ValueError, match="Unknown AI_PROVIDER"):
            get_ai_client()

    def test_case_insensitive_provider(self, settings):
        settings.AI_PROVIDER = 'Claude'
        settings.ANTHROPIC_API_KEY = 'test-key'
        client = get_ai_client()
        from apps.generate.ai_client.adapters.claude import ClaudeAdapter
        assert isinstance(client, ClaudeAdapter)


class TestAIResponse:
    def test_construction(self):
        resp = AIResponse(
            content='{"title": "test"}',
            tokens_in=100,
            tokens_out=50,
            model='test-model',
            cost_usd=Decimal('0.001'),
        )
        assert resp.content == '{"title": "test"}'
        assert resp.tokens_in == 100
        assert resp.tokens_out == 50
        assert resp.model == 'test-model'
        assert resp.cost_usd == Decimal('0.001')
