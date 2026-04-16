import hashlib
import hmac
import json
import logging
import secrets
import time
from datetime import timedelta

import jwt as pyjwt
import redis as redis_lib
from cryptography.fernet import Fernet
from django.conf import settings
from django.db import IntegrityError
from django.db.models import Count, Max, Q, Subquery, OuterRef
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.shortcuts import redirect
from django.utils import timezone
from django.utils.decorators import method_decorator
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.flags import require_flag, is_enabled
from apps.core.platform_credentials import get_credential
from apps.core.ratelimit import org_key, rate_limited_response, safe_ratelimit
from .models import SocialChannel, Contact, Message
from .serializers import (
    ChannelSerializer,
    ContactSummarySerializer,
    MessageSerializer,
    ReplySerializer,
)
from .services.meta import MetaClient, MetaClientError
from .services.whatsapp import WhatsAppClient, WhatsAppClientError
from .tasks import process_inbox_message
from apps.shopify.models import ShopifyIntegration

logger = logging.getLogger(__name__)

# --- Helpers ----------------------------------------------------------------

PLATFORM_SCOPES = {
    "instagram": [
        "instagram_basic",
        "instagram_manage_messages",
        "pages_messaging",
    ],
    "facebook": [
        "pages_messaging",
        "pages_read_engagement",
    ],
    "whatsapp": [
        "whatsapp_business_management",
        "whatsapp_business_messaging",
    ],
}

PLATFORM_MAP = {
    "instagram": "INSTAGRAM",
    "facebook": "FACEBOOK",
    "whatsapp": "WHATSAPP",
}

META_OBJECT_PLATFORM = {
    "instagram": "INSTAGRAM",
    "whatsapp_business_account": "WHATSAPP",
    "page": "FACEBOOK",
}


def _encrypt_token(token_str: str) -> bytes:
    """Fernet-encrypt an access token string."""
    f = Fernet(settings.FERNET_KEY)
    return f.encrypt(token_str.encode())


def _decrypt_token(token_bytes: bytes) -> str:
    """Fernet-decrypt an access token."""
    f = Fernet(settings.FERNET_KEY)
    return f.decrypt(bytes(token_bytes)).decode()


def _sign_state(org_id: int, platform: str) -> str:
    """Create a signed JWT state token for OAuth CSRF protection."""
    payload = {
        "org_id": org_id,
        "platform": platform,
        "nonce": secrets.token_hex(16),
        "exp": timezone.now() + timedelta(minutes=10),
    }
    return pyjwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def _verify_state(state: str) -> dict:
    """Verify and decode the OAuth state JWT."""
    return pyjwt.decode(state, settings.SECRET_KEY, algorithms=["HS256"])


# --- Channel OAuth Views (US1: T014, T015, T016) ---------------------------


@method_decorator(require_flag("INBOX_ENABLED"), name="dispatch")
class ConnectView(APIView):
    """GET /api/channels/connect/<platform>/ — Initiate Meta OAuth."""

    @extend_schema(
        operation_id="channel_connect", tags=["Channels"], responses={302: None}
    )
    def get(self, request, platform):
        platform_lower = platform.lower()
        if platform_lower not in PLATFORM_SCOPES:
            return Response(
                {
                    "error": f"Unsupported platform: {platform}",
                    "error_ar": f"المنصة غير مدعومة: {platform}",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        meta_app_id = get_credential("META", "app_id")
        meta_app_secret = get_credential("META", "app_secret")
        if not meta_app_id or not meta_app_secret:
            return Response(
                {
                    "error": "Meta integration is not configured. Go to Admin → Integrations and enter your Meta App credentials.",
                    "error_ar": "لم يتم إعداد تكامل Meta. انتقل إلى لوحة الإدارة وأدخل بيانات تطبيق Meta.",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        state = _sign_state(request.org.pk, platform_lower)
        redirect_uri = f"{settings.BACKEND_BASE_URL}/api/channels/callback/meta/"
        scopes = PLATFORM_SCOPES[platform_lower]

        oauth_url = MetaClient.build_oauth_url(
            app_id=meta_app_id,
            redirect_uri=redirect_uri,
            state=state,
            scopes=scopes,
        )
        return Response({"url": oauth_url})


class CallbackView(APIView):
    """GET /api/channels/callback/meta/ — OAuth callback from Meta."""

    @extend_schema(
        operation_id="channel_callback", tags=["Channels"], responses={302: None}
    )
    def get(self, request):
        code = request.query_params.get("code")
        state = request.query_params.get("state")

        if not code or not state:
            return Response(
                {
                    "error": "Missing code or state parameter.",
                    "error_ar": "معلمات الطلب ناقصة.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate state JWT
        try:
            state_data = _verify_state(state)
        except pyjwt.ExpiredSignatureError:
            return Response(
                {
                    "error": "OAuth state expired. Please try again.",
                    "error_ar": "انتهت صلاحية طلب الربط. يرجى المحاولة مرة أخرى.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except pyjwt.InvalidTokenError:
            return Response(
                {
                    "error": "Invalid OAuth state.",
                    "error_ar": "حالة المصادقة غير صالحة.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        platform_lower = state_data["platform"]
        platform_upper = PLATFORM_MAP[platform_lower]
        redirect_uri = f"{settings.BACKEND_BASE_URL}/api/channels/callback/meta/"

        meta_client = MetaClient()

        meta_app_id = get_credential("META", "app_id")
        meta_app_secret = get_credential("META", "app_secret")

        # Step 1: Exchange auth code for short-lived user access token
        try:
            short_lived_token = meta_client.exchange_code_for_token(
                code=code,
                app_id=meta_app_id,
                app_secret=meta_app_secret,
                redirect_uri=redirect_uri,
            )
        except MetaClientError as exc:
            logger.error(
                "Code exchange failed for org=%s platform=%s: %s",
                state_data.get("org_id"),
                platform_lower,
                exc,
            )
            return redirect(
                f"{settings.FRONTEND_URL}/channels?error=token_exchange_failed&platform={platform_lower}"
            )

        # Step 2: Exchange short-lived token for long-lived token (~60 days)
        try:
            long_token, expires_in = meta_client.exchange_token(
                short_lived_token=short_lived_token,
                app_id=meta_app_id,
                app_secret=meta_app_secret,
            )
        except MetaClientError as exc:
            logger.error(
                "Long-lived token exchange failed for org=%s platform=%s: %s",
                state_data.get("org_id"),
                platform_lower,
                exc,
            )
            return redirect(
                f"{settings.FRONTEND_URL}/channels?error=token_exchange_failed&platform={platform_lower}"
            )

        # Step 3: Fetch pages/accounts to get page_id and page-scoped access token
        page_id = None
        stored_token = long_token  # default to user token; overridden by page token below
        try:
            pages = meta_client.get_user_pages(long_token)
            if pages:
                if platform_upper == "INSTAGRAM":
                    # Find the Instagram Business Account linked to the first page
                    for page in pages:
                        ig_id = meta_client.get_instagram_account_id(
                            page["id"], page["access_token"]
                        )
                        if ig_id:
                            page_id = ig_id
                            stored_token = page["access_token"]
                            break
                    if not page_id:
                        # No IG business account found — fall back to page ID
                        page_id = pages[0]["id"]
                        stored_token = pages[0]["access_token"]
                elif platform_upper == "FACEBOOK":
                    page_id = pages[0]["id"]
                    stored_token = pages[0]["access_token"]
                # WhatsApp uses phone_number_id (set separately via Business API, not pages)
        except MetaClientError as exc:
            logger.warning(
                "Failed to fetch pages for org=%s platform=%s: %s — storing without page_id",
                state_data.get("org_id"),
                platform_lower,
                exc,
            )

        encrypted_token = _encrypt_token(stored_token)
        # 3-day buffer per research.md Decision 4
        token_expires_at = (
            timezone.now() + timedelta(seconds=expires_in) - timedelta(days=3)
        )

        SocialChannel.objects.update_or_create(
            org=request.org,
            platform=platform_upper,
            defaults={
                "access_token": encrypted_token,
                "token_expires_at": token_expires_at,
                "page_id": page_id,
                "is_active": True,
            },
        )

        return redirect(
            f"{settings.FRONTEND_URL}/channels?connected={platform_lower}"
        )


@method_decorator(require_flag("INBOX_ENABLED"), name="dispatch")
class ChannelListView(APIView):
    """GET /api/channels/ — List all channels for the org."""

    @extend_schema(
        operation_id="channel_list",
        tags=["Channels"],
        responses={200: ChannelSerializer(many=True)},
    )
    def get(self, request):
        channels = SocialChannel.objects.filter(org=request.org)
        serializer = ChannelSerializer(channels, many=True)
        data = serializer.data

        # Add Shopify status (US1: T013)
        shopify = ShopifyIntegration.objects.filter(org=request.org, is_active=True).first()
        if shopify:
            data.append({
                "id": shopify.pk,
                "platform": "SHOPIFY",
                "is_active": True,
                "connected_at": shopify.installed_at,
                "token_expires_at": None,
                "page_id": shopify.shop_domain,
                "phone_number_id": None,
            })
        
        return Response(data)


# --- Webhook Views (US1: T018) ---------------------------------------------


class WebhookView(APIView):
    """
    GET /api/webhooks/meta/ — Verify webhook challenge.
    POST /api/webhooks/meta/ — Receive Meta events (HMAC-verified).
    """

    authentication_classes = []
    permission_classes = []

    def get(self, request):
        """Webhook verification challenge."""
        mode = request.query_params.get("hub.mode")
        token = request.query_params.get("hub.verify_token")
        challenge = request.query_params.get("hub.challenge")

        verify_token = get_credential("META", "verify_token")

        if mode == "subscribe" and token == verify_token:
            return HttpResponse(challenge, content_type="text/plain")
        return JsonResponse({"error": "Forbidden"}, status=403)

    def post(self, request):
        """Inbound event ingestion with HMAC-SHA256 verification."""
        # Verify signature
        signature = request.META.get("HTTP_X_HUB_SIGNATURE_256", "")
        if not self._verify_signature(request.body, signature):
            return JsonResponse({"error": "Invalid signature"}, status=403)

        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        obj_type = body.get("object", "")
        platform = META_OBJECT_PLATFORM.get(obj_type)
        if not platform:
            return JsonResponse({"status": "ok"})

        entries = body.get("entry", [])
        for entry in entries:
            page_id = entry.get("id", "")
            messaging = entry.get("messaging", []) or entry.get("changes", [])

            for event in messaging:
                self._process_event(event, platform, page_id)

        return JsonResponse({"status": "ok"})

    def _verify_signature(self, payload: bytes, signature: str) -> bool:
        """Verify X-Hub-Signature-256 HMAC."""
        app_secret = get_credential("META", "app_secret")
        if not app_secret:
            return settings.DEBUG  # Allow in dev if no secret configured

        if not signature.startswith("sha256="):
            return False

        expected = (
            "sha256="
            + hmac.new(
                app_secret.encode(),
                payload,
                hashlib.sha256,
            ).hexdigest()
        )

        return hmac.compare_digest(expected, signature)

    def _process_event(self, event: dict, platform: str, page_id: str):
        """Extract message from event and save to DB."""
        # Instagram / Facebook Messenger format
        sender = event.get("sender", {})
        sender_id = sender.get("id", "")
        message_data = event.get("message", {})
        msg_id = message_data.get("mid", "")
        text = message_data.get("text", "")

        # WhatsApp format
        if not sender_id and "value" in event:
            value = event["value"]
            messages = value.get("messages", [])
            if messages:
                wa_msg = messages[0]
                sender_id = wa_msg.get("from", "")
                msg_id = wa_msg.get("id", "")
                text = (
                    wa_msg.get("text", {}).get("body", "")
                    if wa_msg.get("type") == "text"
                    else ""
                )
            metadata = value.get("metadata", {})
            page_id = metadata.get("phone_number_id", page_id)

        if not sender_id or not msg_id or not text:
            return

        # Resolve channel
        channel = None
        if platform == "WHATSAPP":
            channel = SocialChannel.objects.filter(
                phone_number_id=page_id,
                platform=platform,
                is_active=True,
            ).first()
        else:
            channel = SocialChannel.objects.filter(
                page_id=page_id,
                platform=platform,
                is_active=True,
            ).first()

        if not channel:
            logger.warning(
                "No active channel found for platform=%s page_id=%s", platform, page_id
            )
            return

        # Get or create contact
        contact, _ = Contact.objects.get_or_create(
            org=channel.org,
            platform=platform,
            platform_id=sender_id,
            defaults={"name": sender.get("name", "")},
        )

        # Deduplicate message
        try:
            msg, created = Message.objects.get_or_create(
                platform=platform,
                platform_msg_id=msg_id,
                defaults={
                    "org": channel.org,
                    "contact": contact,
                    "channel": channel,
                    "direction": "INBOUND",
                    "content": text,
                    "sent_at": timezone.now(),
                },
            )
        except IntegrityError:
            # Race condition — duplicate webhook delivery
            logger.info(
                "Duplicate message ignored: platform=%s msg_id=%s", platform, msg_id
            )
            return

        if created:
            # Publish new_message event immediately (before AI processing)
            from .tasks import _publish_redis_event

            _publish_redis_event(
                channel.org.pk,
                "new_message",
                {
                    "message_id": msg.pk,
                    "contact_id": contact.pk,
                    "contact_name": contact.name,
                    "platform": platform,
                    "content": text[:200],
                    "intent": None,
                },
            )
            process_inbox_message.delay(msg.pk)


# --- Inbox API Views (US2: T025-T030) --------------------------------------


class InboxPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = "page_size"
    max_page_size = 100


@method_decorator(safe_ratelimit(key=org_key, rate="60/m", method="ALL", block=False), name="dispatch")
@method_decorator(require_flag("INBOX_ENABLED"), name="dispatch")
class InboxListView(APIView):
    """GET /api/inbox/ — Paginated contact list with unread counts."""

    @extend_schema(
        operation_id="inbox_list",
        tags=["Inbox"],
        parameters=[
            OpenApiParameter(name="platform", type=str, required=False),
            OpenApiParameter(name="intent", type=str, required=False),
            OpenApiParameter(name="unread", type=bool, required=False),
        ],
    )
    def get(self, request):
        if is_enabled('RATE_LIMITING') and getattr(request, 'limited', False):
            return rate_limited_response()
        org = request.org
        qs = Contact.objects.filter(org=org)

        # Filters
        platform = request.query_params.get("platform")
        if platform:
            qs = qs.filter(platform=platform.upper())

        intent = request.query_params.get("intent")
        if intent:
            qs = qs.filter(messages__intent=intent.upper()).distinct()

        unread_only = request.query_params.get("unread")
        if unread_only == "true":
            qs = qs.filter(
                messages__read=False, messages__direction="INBOUND"
            ).distinct()

        # Annotate
        qs = qs.annotate(
            unread_count=Count(
                "messages",
                filter=Q(messages__read=False, messages__direction="INBOUND"),
            ),
            latest_sent_at=Max("messages__sent_at"),
        ).order_by("-ai_score", "-unread_count", "-latest_sent_at")

        # Paginate
        paginator = InboxPagination()
        page = paginator.paginate_queryset(qs, request)

        # Attach latest_message to each contact
        results = []
        for contact in page:
            latest_msg = (
                Message.objects.filter(
                    contact=contact,
                )
                .order_by("-sent_at", "-created_at")
                .first()
            )

            contact_data = {
                "id": contact.pk,
                "name": contact.name,
                "platform": contact.platform,
                "ai_score": contact.ai_score,
                "unread_count": contact.unread_count,
                "latest_message": {
                    "id": latest_msg.pk,
                    "content": latest_msg.content,
                    "intent": latest_msg.intent,
                    "sent_at": latest_msg.sent_at,
                    "direction": latest_msg.direction,
                }
                if latest_msg
                else None,
            }
            results.append(contact_data)

        return paginator.get_paginated_response(results)


@method_decorator(safe_ratelimit(key=org_key, rate="60/m", method="ALL", block=False), name="dispatch")
@method_decorator(require_flag("INBOX_ENABLED"), name="dispatch")
class ThreadView(APIView):
    """GET /api/inbox/<int:contact_id>/messages/ — Full thread."""

    @extend_schema(operation_id="thread_messages", tags=["Inbox"])
    def get(self, request, contact_id):
        if is_enabled('RATE_LIMITING') and getattr(request, 'limited', False):
            return rate_limited_response()
        org = request.org
        try:
            contact = Contact.objects.get(pk=contact_id, org=org)
        except Contact.DoesNotExist:
            return Response(
                {"error": "Contact not found.", "error_ar": "جهة الاتصال غير موجودة."},
                status=status.HTTP_404_NOT_FOUND,
            )

        messages = Message.objects.filter(
            contact=contact,
            org=org,
        ).order_by("sent_at", "created_at")

        # Mark unread inbound messages as read
        messages.filter(direction="INBOUND", read=False).update(read=True)

        serializer = MessageSerializer(messages, many=True)
        return Response(
            {
                "contact": {
                    "id": contact.pk,
                    "name": contact.name,
                    "platform": contact.platform,
                    "ai_score": contact.ai_score,
                },
                "messages": serializer.data,
            }
        )


@method_decorator(safe_ratelimit(key=org_key, rate="60/m", method="ALL", block=False), name="dispatch")
@method_decorator(require_flag("INBOX_ENABLED"), name="dispatch")
class ReplyView(APIView):
    """POST /api/messages/<int:message_id>/reply/ — Send a reply."""

    @extend_schema(
        operation_id="message_reply",
        tags=["Inbox"],
        request=ReplySerializer,
        responses={201: MessageSerializer},
    )
    def post(self, request, message_id):
        if is_enabled('RATE_LIMITING') and getattr(request, 'limited', False):
            return rate_limited_response()
        org = request.org
        try:
            original = Message.objects.select_related("contact", "channel").get(
                pk=message_id,
                org=org,
            )
        except Message.DoesNotExist:
            return Response(
                {"error": "Message not found.", "error_ar": "الرسالة غير موجودة."},
                status=status.HTTP_404_NOT_FOUND,
            )

        ser = ReplySerializer(data=request.data)
        if not ser.is_valid():
            return Response(
                {"error": "Content is required.", "error_ar": "المحتوى مطلوب."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reply_text = ser.validated_data["content"]
        channel = original.channel

        if not channel or not channel.is_active:
            return Response(
                {
                    "error": "Channel is disconnected.",
                    "error_ar": "القناة غير متصلة.",
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        access_token = _decrypt_token(channel.access_token)

        # Route to correct platform client
        platform_msg_id_override = None
        try:
            if original.platform == "WHATSAPP":
                wa = WhatsAppClient()
                wa.send_message(
                    phone_number_id=channel.phone_number_id,
                    recipient_wa_id=original.contact.platform_id,
                    text=reply_text,
                    access_token=access_token,
                )
            elif original.platform == "TIKTOK":
                from apps.inbox.services.tiktok import TikTokClient, TikTokClientError

                video_id, comment_id = original.platform_msg_id.split(":", 1)
                try:
                    reply_id = TikTokClient().reply_to_comment(
                        channel,
                        video_id,
                        comment_id,
                        reply_text,
                    )
                except TikTokClientError as exc:
                    return Response(
                        {"detail": str(exc), "detail_ar": "فشل الرد على التعليق"},
                        status=status.HTTP_502_BAD_GATEWAY,
                    )
                platform_msg_id_override = f"{video_id}:{reply_id}"
            else:
                meta = MetaClient()
                meta.send_dm(
                    page_id=channel.page_id,
                    recipient_id=original.contact.platform_id,
                    text=reply_text,
                    access_token=access_token,
                )
        except (MetaClientError, WhatsAppClientError) as exc:
            logger.error("Reply send failed: %s", exc)
            return Response(
                {
                    "error": "Failed to send reply.",
                    "error_ar": "فشل إرسال الرد.",
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        # Create outbound message record
        outbound = Message.objects.create(
            org=org,
            contact=original.contact,
            channel=channel,
            platform=original.platform,
            platform_msg_id=platform_msg_id_override
            or f"out_{int(time.time() * 1000)}_{original.pk}",
            direction="OUTBOUND",
            content=reply_text,
            read=True,
            sent_at=timezone.now(),
        )

        try:
            from apps.core.analytics import capture
            capture('reply_sent', org, {
                'channel': original.channel.platform if original.channel else 'unknown',
            })
        except Exception:
            pass

        return Response(
            MessageSerializer(outbound).data,
            status=status.HTTP_201_CREATED,
        )


@method_decorator(require_flag("INBOX_ENABLED"), name="dispatch")
class ReadView(APIView):
    """POST /api/messages/<int:message_id>/read/ — Mark as read."""

    @extend_schema(operation_id="message_read", tags=["Inbox"])
    def post(self, request, message_id):
        try:
            msg = Message.objects.get(pk=message_id, org=request.org)
        except Message.DoesNotExist:
            return Response(
                {"error": "Message not found.", "error_ar": "الرسالة غير موجودة."},
                status=status.HTTP_404_NOT_FOUND,
            )
        msg.read = True
        msg.save(update_fields=["read"])
        return Response({"read": True})


@method_decorator(require_flag("INBOX_ENABLED"), name="dispatch")
class UnreadView(APIView):
    """POST /api/messages/<int:message_id>/unread/ — Mark as unread."""

    @extend_schema(operation_id="message_unread", tags=["Inbox"])
    def post(self, request, message_id):
        try:
            msg = Message.objects.get(pk=message_id, org=request.org)
        except Message.DoesNotExist:
            return Response(
                {"error": "Message not found.", "error_ar": "الرسالة غير موجودة."},
                status=status.HTTP_404_NOT_FOUND,
            )
        msg.read = False
        msg.save(update_fields=["read"])
        return Response({"read": False})


@method_decorator(require_flag("INBOX_ENABLED"), name="dispatch")
class SSEStreamView(APIView):
    """GET /api/inbox/stream/ — Server-Sent Events for real-time updates."""

    @extend_schema(operation_id="inbox_stream", tags=["Inbox"], responses={200: None})
    def get(self, request):
        org_id = request.org.pk
        redis_url = getattr(settings, "CELERY_BROKER_URL", "redis://localhost:6379/0")

        def event_stream():
            r = redis_lib.from_url(redis_url)
            pubsub = r.pubsub()
            pubsub.subscribe(f"inbox:{org_id}")
            last_heartbeat = time.time()

            try:
                while True:
                    message = pubsub.get_message(timeout=1.0)
                    if message and message["type"] == "message":
                        data = message["data"]
                        if isinstance(data, bytes):
                            data = data.decode()
                        try:
                            payload = json.loads(data)
                            event_type = payload.get("event", "new_message")
                            yield f"event: {event_type}\ndata: {json.dumps(payload)}\n\n"
                        except json.JSONDecodeError:
                            pass

                    # Heartbeat every 25 seconds
                    now = time.time()
                    if now - last_heartbeat >= 25:
                        yield "event: heartbeat\ndata: {}\n\n"
                        last_heartbeat = now
            finally:
                pubsub.unsubscribe()
                pubsub.close()

        response = StreamingHttpResponse(
            event_stream(),
            content_type="text/event-stream",
        )
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"
        return response


# --- Channel Disconnect View (US4: T040) ------------------------------------


@method_decorator(require_flag("INBOX_ENABLED"), name="dispatch")
class DisconnectView(APIView):
    """POST /api/channels/disconnect/ — Disconnect a channel."""

    @extend_schema(operation_id="channel_disconnect", tags=["Channels"])
    def post(self, request):
        platform = request.data.get("platform", "").upper()
        if platform not in ("INSTAGRAM", "WHATSAPP", "FACEBOOK", "TIKTOK", "SHOPIFY"):
            return Response(
                {
                    "error": "Invalid platform.",
                    "error_ar": "المنصة غير صالحة.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Handle Shopify separately — it lives in a different model
        if platform == "SHOPIFY":
            try:
                integration = ShopifyIntegration.objects.get(org=request.org, is_active=True)
            except ShopifyIntegration.DoesNotExist:
                return Response(
                    {
                        "error": "Shopify is not connected.",
                        "error_ar": "Shopify غير متصل.",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            integration.is_active = False
            integration.save(update_fields=["is_active"])
            return Response(
                {
                    "message": "Shopify disconnected successfully.",
                    "message_ar": "تم فصل Shopify بنجاح.",
                }
            )

        try:
            channel = SocialChannel.objects.get(org=request.org, platform=platform)
        except SocialChannel.DoesNotExist:
            return Response(
                {
                    "error": "Channel not found.",
                    "error_ar": "القناة غير موجودة.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Revoke token (best-effort — do not block disconnect on failure)
        try:
            access_token = _decrypt_token(channel.access_token)
            meta = MetaClient()
            meta.revoke_token(access_token)
        except Exception as exc:
            logger.warning(
                "Token revocation failed for channel=%s: %s", channel.pk, exc
            )

        channel.is_active = False
        channel.save(update_fields=["is_active"])

        return Response(
            {
                "message": f"{channel.get_platform_display()} disconnected successfully.",
                "message_ar": f"تم فصل {channel.get_platform_display()} بنجاح.",
            }
        )
