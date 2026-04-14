from rest_framework import serializers

from .models import SeasonalTemplate


class CaptionInputSerializer(serializers.Serializer):
    product_description = serializers.CharField(max_length=500)
    tone = serializers.ChoiceField(
        choices=["CASUAL", "PROFESSIONAL", "EXCITING", "INFORMATIVE"]
    )


class AdCopyInputSerializer(serializers.Serializer):
    product_description = serializers.CharField(max_length=500)
    tone = serializers.ChoiceField(
        choices=["CASUAL", "PROFESSIONAL", "EXCITING", "INFORMATIVE"]
    )
    platform = serializers.ChoiceField(choices=["META", "TIKTOK"])


class BroadcastDraftInputSerializer(serializers.Serializer):
    campaign_type = serializers.ChoiceField(
        choices=["PROMOTION", "ANNOUNCEMENT", "SEASONAL", "RESTOCK"]
    )
    audience_description = serializers.CharField(max_length=300)


class SeasonalTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeasonalTemplate
        fields = ["id", "name", "occasion", "body_ar", "body_en", "sort_order"]
