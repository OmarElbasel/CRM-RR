import pytest

from apps.generate.prompts import get_prompts


class TestGetPrompts:
    @pytest.mark.parametrize('language', ['ar', 'en', 'bilingual'])
    @pytest.mark.parametrize('tone', ['professional', 'casual', 'luxury'])
    def test_returns_tuple_of_strings(self, language, tone):
        system, user = get_prompts(
            language=language, tone=tone,
            product_name='Test Product', category='food',
        )
        assert isinstance(system, str)
        assert isinstance(user, str)
        assert len(system) > 0
        assert len(user) > 0

    def test_arabic_prompt_contains_arabic(self):
        system, user = get_prompts(
            language='ar', tone='professional',
            product_name='تمر', category='food',
        )
        assert 'JSON' in system
        assert 'تمر' in user

    def test_english_prompt_contains_english(self):
        system, user = get_prompts(
            language='en', tone='casual',
            product_name='Dates', category='food',
        )
        assert 'JSON' in system
        assert 'Dates' in user

    def test_bilingual_adds_instruction(self):
        system, user = get_prompts(
            language='bilingual', tone='luxury',
            product_name='عباية', category='fashion',
        )
        assert 'Arabic' in system and 'English' in system

    def test_invalid_language_raises(self):
        with pytest.raises(ValueError, match="Unsupported language"):
            get_prompts(language='fr', tone='casual', product_name='x', category='food')

    def test_price_none_uses_default(self):
        _, user_ar = get_prompts(
            language='ar', tone='casual',
            product_name='test', category='food', price=None,
        )
        assert 'غير محدد' in user_ar

        _, user_en = get_prompts(
            language='en', tone='casual',
            product_name='test', category='food', price=None,
        )
        assert 'N/A' in user_en

    def test_price_included_when_provided(self):
        _, user = get_prompts(
            language='en', tone='professional',
            product_name='test', category='food', price=29.99,
        )
        assert '29.99' in user
