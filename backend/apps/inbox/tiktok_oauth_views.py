import logging

import jwt as pyjwt
from cryptography.fernet import Fernet
from django.conf import settings
from django.http import HttpResponseRedirect
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.core.flags import require_flag
from apps.orgs.models import Organization
from apps.inbox.models import SocialChannel
from apps.inbox.services.tiktok import TikTokClient, TikTokClientError

logger = logging.getLogger(__name__)


@require_flag("TIKTOK_INBOX")
class TikTokConnectView(APIView):
    """GET /api/channels/connect/tiktok/ — Initiate TikTok OAuth2 connect."""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Channels"],
        summary="Initiate TikTok OAuth2 connect",
        responses={302: None},
    )
    def get(self, request):
        url = TikTokClient().get_auth_url(request.org.pk)
        from rest_framework.response import Response
        return Response({"url": url})


class TikTokCallbackView(APIView):
    """GET /api/channels/callback/tiktok/ — TikTok OAuth2 callback."""

    permission_classes = [AllowAny]

    @extend_schema(
        tags=["Channels"],
        summary="TikTok OAuth2 callback",
        parameters=[
            OpenApiParameter("code", str),
            OpenApiParameter("state", str),
        ],
        responses={302: None},
    )
    def get(self, request):
        code = request.GET.get("code")
        state = request.GET.get("state")

        if not code or not state:
            return HttpResponseRedirect(
                f"{settings.FRONTEND_URL}/settings/channels?error=tiktok_oauth_failed"
            )

        try:
            state_data = pyjwt.decode(state, settings.SECRET_KEY, algorithms=["HS256"])
            org_id = state_data["org_id"]
        except (pyjwt.ExpiredSignatureError, pyjwt.InvalidTokenError) as exc:
            logger.error("Invalid TikTok OAuth state: %s", exc)
            return HttpResponseRedirect(
                f"{settings.FRONTEND_URL}/settings/channels?error=tiktok_oauth_failed"
            )

        try:
            org = Organization.objects.get(pk=org_id)
        except Organization.DoesNotExist:
            logger.error("TikTok callback: org_id=%s not found", org_id)
            return HttpResponseRedirect(
                f"{settings.FRONTEND_URL}/settings/channels?error=tiktok_oauth_failed"
            )

        try:
            result = TikTokClient().exchange_code(code, org_id)
        except TikTokClientError as exc:
            logger.error("TikTok token exchange failed for org=%s: %s", org_id, exc)
            return HttpResponseRedirect(
                f"{settings.FRONTEND_URL}/settings/channels?error=tiktok_oauth_failed"
            )

        fernet = Fernet(settings.FERNET_KEY)
        encrypted_token = fernet.encrypt(result["access_token"].encode())
        token_expires_at = (
            timezone.now()
            + timezone.timedelta(seconds=result["expires_in"])
            - timezone.timedelta(days=3)
        )

        SocialChannel.objects.update_or_create(
            org=org,
            platform="TIKTOK",
            defaults={
                "access_token": encrypted_token,
                "tiktok_open_id": result["open_id"],
                "token_expires_at": token_expires_at,
                "is_active": True,
            },
        )

        return HttpResponseRedirect(
            f"{settings.FRONTEND_URL}/settings/channels?connected=tiktok"
        )
