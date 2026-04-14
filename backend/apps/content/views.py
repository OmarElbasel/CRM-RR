import json
import logging

from django.utils.decorators import method_decorator
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.flags import require_flag
from apps.generate.ai_client import get_ai_client
from apps.generate.ai_client.exceptions import AIProviderUnavailableError
from apps.generate.models import AIUsage

from .models import SeasonalTemplate
from .prompts.caption_ar import CAPTION_AR_SYSTEM
from .prompts.caption_en import CAPTION_EN_SYSTEM
from .prompts.ad_copy_ar import AD_COPY_AR_SYSTEM
from .prompts.ad_copy_en import AD_COPY_EN_SYSTEM
from .prompts.broadcast_ar import BROADCAST_AR_SYSTEM
from .prompts.broadcast_en import BROADCAST_EN_SYSTEM
from .serializers import (
    CaptionInputSerializer,
    AdCopyInputSerializer,
    BroadcastDraftInputSerializer,
    SeasonalTemplateSerializer,
)

logger = logging.getLogger(__name__)


def _call_ai(
    client,
    prompt: str,
    system: str,
    max_tokens: int,
    org,
    language: str,
    category: str = "content",
    tone: str = "",
):
    """Call AI and parse JSON response with retry on JSONDecodeError.
    Only records AIUsage after successful JSON parsing."""
    response = client.generate(prompt, system, max_tokens=max_tokens)
    raw = response.content.strip()
    if raw.startswith("```"):
        lines = raw.split("\n")
        json_lines = [l for l in lines[1:] if not l.startswith("```")]
        raw = "\n".join(json_lines)
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        response2 = client.generate(prompt, system, max_tokens=max_tokens)
        raw2 = response2.content.strip()
        if raw2.startswith("```"):
            lines2 = raw2.split("\n")
            json_lines2 = [l for l in lines2[1:] if not l.startswith("```")]
            raw2 = "\n".join(json_lines2)
        try:
            parsed = json.loads(raw2)
        except json.JSONDecodeError:
            AIUsage.objects.create(
                org=org,
                model=response2.model,
                tokens_in=response2.tokens_in,
                tokens_out=response2.tokens_out,
                cost_usd=response2.cost_usd,
                language=language,
                category=category,
                tone=tone.lower() if tone else "professional",
                cache_hit=False,
                success=False,
            )
            raise
    AIUsage.objects.create(
        org=org,
        model=response.model,
        tokens_in=response.tokens_in,
        tokens_out=response.tokens_out,
        cost_usd=response.cost_usd,
        language=language,
        category=category,
        tone=tone.lower() if tone else "professional",
        cache_hit=False,
        success=True,
    )
    return parsed


def _handle_ai_error(exc: Exception) -> Response:
    """Convert AI provider errors into clean API responses."""
    if isinstance(exc, AIProviderUnavailableError):
        return Response(
            {
                "error": "AI service is temporarily unavailable. Please try again.",
                "error_ar": "خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى المحاولة مرة أخرى.",
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    if isinstance(exc, json.JSONDecodeError):
        return Response(
            {
                "error": "AI response could not be parsed. Please try again.",
                "error_ar": "تعذر تحليل رد الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )
    logger.error("Unexpected AI error: %s", exc)
    return Response(
        {
            "error": "An unexpected error occurred. Please try again.",
            "error_ar": "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@method_decorator(require_flag("CONTENT_ASSISTANT"), name="dispatch")
@extend_schema(tags=["Content"])
class CaptionView(APIView):
    def post(self, request):
        ser = CaptionInputSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        data = ser.validated_data
        prompt = f"Product: {data['product_description']}\nTone: {data['tone']}"
        client = get_ai_client()

        try:
            ar_result = _call_ai(
                client,
                prompt,
                CAPTION_AR_SYSTEM,
                512,
                request.org,
                "ar",
                tone=data["tone"],
            )
            en_result = _call_ai(
                client,
                prompt,
                CAPTION_EN_SYSTEM,
                512,
                request.org,
                "en",
                tone=data["tone"],
            )
        except (AIProviderUnavailableError, json.JSONDecodeError) as exc:
            return _handle_ai_error(exc)

        return Response(
            {
                "caption_ar": ar_result.get("caption_ar", ""),
                "caption_en": en_result.get("caption_en", ""),
                "hashtags_ar": ar_result.get("hashtags_ar", []),
                "hashtags_en": en_result.get("hashtags_en", []),
            }
        )


@method_decorator(require_flag("CONTENT_ASSISTANT"), name="dispatch")
@extend_schema(tags=["Content"])
class AdCopyView(APIView):
    def post(self, request):
        ser = AdCopyInputSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        data = ser.validated_data
        prompt = f"Product: {data['product_description']}\nTone: {data['tone']}\nPlatform: {data['platform']}"
        client = get_ai_client()

        try:
            ar_result = _call_ai(
                client,
                prompt,
                AD_COPY_AR_SYSTEM,
                512,
                request.org,
                "ar",
                tone=data["tone"],
            )
            en_result = _call_ai(
                client,
                prompt,
                AD_COPY_EN_SYSTEM,
                512,
                request.org,
                "en",
                tone=data["tone"],
            )
        except (AIProviderUnavailableError, json.JSONDecodeError) as exc:
            return _handle_ai_error(exc)

        return Response(
            {
                "headline_ar": ar_result.get("headline_ar", ""),
                "headline_en": en_result.get("headline_en", ""),
                "body_ar": ar_result.get("body_ar", ""),
                "body_en": en_result.get("body_en", ""),
            }
        )


@method_decorator(require_flag("CONTENT_ASSISTANT"), name="dispatch")
@extend_schema(tags=["Content"])
class BroadcastDraftView(APIView):
    def post(self, request):
        ser = BroadcastDraftInputSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        data = ser.validated_data
        prompt = f"Campaign: {data['campaign_type']}\nAudience: {data['audience_description']}"
        client = get_ai_client()

        try:
            ar_result = _call_ai(
                client, prompt, BROADCAST_AR_SYSTEM, 512, request.org, "ar"
            )
            en_result = _call_ai(
                client, prompt, BROADCAST_EN_SYSTEM, 512, request.org, "en"
            )
        except (AIProviderUnavailableError, json.JSONDecodeError) as exc:
            return _handle_ai_error(exc)

        return Response(
            {
                "message_ar": ar_result.get("message_ar", ""),
                "message_en": en_result.get("message_en", ""),
            }
        )


@method_decorator(require_flag("CONTENT_ASSISTANT"), name="dispatch")
@extend_schema(tags=["Content"])
class SeasonalTemplatesView(APIView):
    def get(self, request):
        qs = SeasonalTemplate.objects.filter(is_active=True)
        return Response(SeasonalTemplateSerializer(qs, many=True).data)
