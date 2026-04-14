from pydantic import BaseModel, Field
from rest_framework import serializers


class ProductContentOutput(BaseModel):
    title: str = Field(..., min_length=1)
    short_description: str = Field(..., max_length=160)
    long_description: str = Field(..., max_length=500)
    keywords: list[str] = Field(..., min_length=3, max_length=10)
    seo_meta: str = Field(..., max_length=155)


class ProductGenerationInputSerializer(serializers.Serializer):
    CATEGORY_CHOICES = [
        "fashion",
        "food",
        "electronics",
        "beauty",
        "home",
        "content",
        "other",
    ]
    TONE_CHOICES = ["professional", "casual", "luxury", "exciting", "informative"]
    LANGUAGE_CHOICES = ["ar", "en", "bilingual"]

    product_name = serializers.CharField(max_length=500)
    category = serializers.ChoiceField(choices=CATEGORY_CHOICES)
    price = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, allow_null=True
    )
    target_audience = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default=""
    )
    tone = serializers.ChoiceField(choices=TONE_CHOICES)
    language = serializers.ChoiceField(choices=LANGUAGE_CHOICES)


class ProductContentResponseSerializer(serializers.Serializer):
    title = serializers.CharField()
    short_description = serializers.CharField()
    long_description = serializers.CharField()
    keywords = serializers.ListField(child=serializers.CharField())
    seo_meta = serializers.CharField()
    session_id = serializers.UUIDField()
    cached = serializers.BooleanField()
