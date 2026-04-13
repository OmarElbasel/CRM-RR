import pytest
from pydantic import ValidationError as PydanticValidationError

from apps.generate.serializers import (
    ProductContentOutput,
    ProductGenerationInputSerializer,
)


class TestProductContentOutput:
    def test_valid_output(self):
        data = ProductContentOutput(
            title='Test Title',
            short_description='Short desc',
            long_description='Long description here',
            keywords=['a', 'b', 'c'],
            seo_meta='SEO meta text',
        )
        assert data.title == 'Test Title'
        assert len(data.keywords) == 3

    def test_short_description_too_long(self):
        with pytest.raises(PydanticValidationError):
            ProductContentOutput(
                title='Test',
                short_description='x' * 161,
                long_description='desc',
                keywords=['a', 'b', 'c'],
                seo_meta='meta',
            )

    def test_long_description_too_long(self):
        with pytest.raises(PydanticValidationError):
            ProductContentOutput(
                title='Test',
                short_description='short',
                long_description='x' * 501,
                keywords=['a', 'b', 'c'],
                seo_meta='meta',
            )

    def test_seo_meta_too_long(self):
        with pytest.raises(PydanticValidationError):
            ProductContentOutput(
                title='Test',
                short_description='short',
                long_description='long',
                keywords=['a', 'b', 'c'],
                seo_meta='x' * 156,
            )

    def test_too_few_keywords(self):
        with pytest.raises(PydanticValidationError):
            ProductContentOutput(
                title='Test',
                short_description='short',
                long_description='long',
                keywords=['a', 'b'],
                seo_meta='meta',
            )

    def test_too_many_keywords(self):
        with pytest.raises(PydanticValidationError):
            ProductContentOutput(
                title='Test',
                short_description='short',
                long_description='long',
                keywords=['a'] * 11,
                seo_meta='meta',
            )

    def test_empty_title_rejected(self):
        with pytest.raises(PydanticValidationError):
            ProductContentOutput(
                title='',
                short_description='short',
                long_description='long',
                keywords=['a', 'b', 'c'],
                seo_meta='meta',
            )


class TestProductGenerationInputSerializer:
    def test_valid_input(self):
        data = {
            'product_name': 'تمر مجدول',
            'category': 'food',
            'tone': 'professional',
            'language': 'ar',
        }
        s = ProductGenerationInputSerializer(data=data)
        assert s.is_valid(), s.errors

    def test_missing_required_fields(self):
        s = ProductGenerationInputSerializer(data={})
        assert not s.is_valid()
        assert 'product_name' in s.errors
        assert 'category' in s.errors
        assert 'tone' in s.errors
        assert 'language' in s.errors

    def test_invalid_category(self):
        data = {
            'product_name': 'test',
            'category': 'invalid',
            'tone': 'casual',
            'language': 'en',
        }
        s = ProductGenerationInputSerializer(data=data)
        assert not s.is_valid()
        assert 'category' in s.errors

    def test_invalid_tone(self):
        data = {
            'product_name': 'test',
            'category': 'food',
            'tone': 'invalid',
            'language': 'en',
        }
        s = ProductGenerationInputSerializer(data=data)
        assert not s.is_valid()
        assert 'tone' in s.errors

    def test_invalid_language(self):
        data = {
            'product_name': 'test',
            'category': 'food',
            'tone': 'casual',
            'language': 'fr',
        }
        s = ProductGenerationInputSerializer(data=data)
        assert not s.is_valid()
        assert 'language' in s.errors

    def test_optional_fields(self):
        data = {
            'product_name': 'test',
            'category': 'food',
            'tone': 'casual',
            'language': 'en',
            'price': '29.99',
            'target_audience': 'Young adults',
        }
        s = ProductGenerationInputSerializer(data=data)
        assert s.is_valid(), s.errors
