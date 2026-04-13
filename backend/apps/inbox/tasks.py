import json
import logging

import redis as redis_lib
from celery import shared_task
from django.conf import settings

logger = logging.getLogger(__name__)

INTENT_SYSTEM_PROMPT = """You are a message intent classifier for a Gulf e-commerce CRM.
Classify the customer message into exactly one intent and suggest a score adjustment.
Return ONLY valid JSON: {"intent": "<LABEL>", "score_delta": <int>}

Possible intents:
- READY_TO_BUY: Customer wants to purchase (score_delta: +15 to +25)
- PRICE_INQUIRY: Asking about price/discounts (score_delta: +5 to +10)
- INFO_REQUEST: Asking about product details, shipping, etc. (score_delta: +3 to +5)
- COMPLAINT: Negative feedback or issue (score_delta: -5 to -10)
- BROWSING: General browsing, greeting, or unclear intent (score_delta: 0 to +2)
"""

DRAFT_SYSTEM_PROMPT = """You are a bilingual customer support assistant for a Gulf e-commerce merchant.
Write a professional, helpful reply in both Gulf Arabic dialect and English.
Return ONLY valid JSON: {"draft_ar": "...", "draft_en": "..."}
Keep replies concise (1-3 sentences). Be polite and action-oriented."""


def _publish_redis_event(org_id: int, event_type: str, payload: dict):
    """Publish an event to the org's inbox Redis pub/sub channel."""
    redis_url = getattr(settings, 'CELERY_BROKER_URL', 'redis://localhost:6379/0')
    r = redis_lib.from_url(redis_url)
    event = {'event': event_type, **payload}
    r.publish(f'inbox:{org_id}', json.dumps(event, default=str))


@shared_task(name='apps.inbox.tasks.process_inbox_message', bind=True, max_retries=2)
def process_inbox_message(self, message_id: int):
    """
    Process a new inbound message through the AI pipeline.
    1. Classify intent + score_delta
    2. Generate bilingual reply draft
    3. Update message and contact
    4. Publish message_updated event via Redis
    """
    from apps.generate.ai_client import get_ai_client
    from apps.generate.ai_client.base import AIResponse
    from apps.generate.models import AIUsage
    from apps.inbox.models import Message, Contact
    from apps.pipeline.services.deals import sync_deal_from_message
    from apps.pipeline.services.scoring import build_score_prompt, sync_scores, SCORE_SYSTEM_PROMPT

    try:
        msg = Message.objects.select_related('contact', 'channel').get(pk=message_id)
    except Message.DoesNotExist:
        logger.warning('process_inbox_message: message_id=%s not found', message_id)
        return

    if msg.intent is not None:
        logger.info('process_inbox_message: message_id=%s already processed', message_id)
        return

    org = msg.org
    client = get_ai_client()

    # Step 1: Intent classification
    intent = None
    score_delta = 0
    try:
        intent_prompt = f'Customer message: "{msg.content}"'
        intent_response: AIResponse = client.generate(intent_prompt, INTENT_SYSTEM_PROMPT, max_tokens=256)

        # Record AI usage
        AIUsage.objects.create(
            org=org,
            model=intent_response.model,
            tokens_in=intent_response.tokens_in,
            tokens_out=intent_response.tokens_out,
            cost_usd=intent_response.cost_usd,
            language='en',
            category='other',
            tone='professional',
            cache_hit=False,
            success=True,
        )

        # Parse response — retry once on malformed JSON
        raw = intent_response.content.strip()
        if raw.startswith('```'):
            lines = raw.split('\n')
            json_lines = [l for l in lines[1:] if not l.startswith('```')]
            raw = '\n'.join(json_lines)

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            # Retry once
            intent_response2 = client.generate(intent_prompt, INTENT_SYSTEM_PROMPT, max_tokens=256)
            raw2 = intent_response2.content.strip()
            if raw2.startswith('```'):
                lines2 = raw2.split('\n')
                json_lines2 = [l for l in lines2[1:] if not l.startswith('```')]
                raw2 = '\n'.join(json_lines2)
            parsed = json.loads(raw2)

        valid_intents = {'READY_TO_BUY', 'PRICE_INQUIRY', 'INFO_REQUEST', 'COMPLAINT', 'BROWSING'}
        intent = parsed.get('intent', 'BROWSING')
        if intent not in valid_intents:
            intent = 'BROWSING'
        score_delta = int(parsed.get('score_delta', 0))

    except Exception as exc:
        logger.error('Intent classification failed for message_id=%s: %s', message_id, exc)
        intent = 'BROWSING'
        score_delta = 0

    # Step 2: Bilingual draft generation
    draft_en = ''
    draft_ar = ''
    try:
        draft_prompt = f'Customer message: "{msg.content}"\nDetected intent: {intent}'
        draft_response: AIResponse = client.generate(draft_prompt, DRAFT_SYSTEM_PROMPT, max_tokens=512)

        AIUsage.objects.create(
            org=org,
            model=draft_response.model,
            tokens_in=draft_response.tokens_in,
            tokens_out=draft_response.tokens_out,
            cost_usd=draft_response.cost_usd,
            language='bilingual',
            category='other',
            tone='professional',
            cache_hit=False,
            success=True,
        )

        raw_draft = draft_response.content.strip()
        if raw_draft.startswith('```'):
            lines = raw_draft.split('\n')
            json_lines = [l for l in lines[1:] if not l.startswith('```')]
            raw_draft = '\n'.join(json_lines)

        draft_data = json.loads(raw_draft)
        draft_ar = draft_data.get('draft_ar', '')
        draft_en = draft_data.get('draft_en', '')

    except Exception as exc:
        logger.error('Draft generation failed for message_id=%s: %s', message_id, exc)

    # Step 3: Update message
    msg.intent = intent
    msg.ai_draft = draft_en
    msg.ai_draft_ar = draft_ar
    msg.save(update_fields=['intent', 'ai_draft', 'ai_draft_ar'])

    # Step 4: Auto-create or update pipeline deal
    contact = msg.contact
    deal = None
    try:
        deal = sync_deal_from_message(org, contact, msg)
    except Exception as exc:
        logger.error('Deal sync failed for message_id=%s: %s', message_id, exc)

    # Step 5: Absolute AI lead scoring (Phase 6 upgrade — replaces score delta)
    new_score = contact.ai_score  # preserve existing on failure
    try:
        engagement_count = Message.objects.filter(contact=contact, org=org).count()
        last_merchant_msg = Message.objects.filter(
            contact=contact, org=org, direction='OUTBOUND',
        ).order_by('-sent_at').first()
        lag_hours = 0
        if last_merchant_msg and last_merchant_msg.sent_at:
            from django.utils import timezone
            lag_hours = int((timezone.now() - last_merchant_msg.sent_at).total_seconds() / 3600)

        score_prompt = build_score_prompt(contact, msg, engagement_count, lag_hours)
        score_response: AIResponse = client.generate(score_prompt, SCORE_SYSTEM_PROMPT, max_tokens=256)

        AIUsage.objects.create(
            org=org,
            model=score_response.model,
            tokens_in=score_response.tokens_in,
            tokens_out=score_response.tokens_out,
            cost_usd=score_response.cost_usd,
            language='en',
            category='other',
            tone='professional',
            cache_hit=False,
            success=True,
        )

        raw_score = score_response.content.strip()
        if raw_score.startswith('```'):
            lines_s = raw_score.split('\n')
            json_lines_s = [l for l in lines_s[1:] if not l.startswith('```')]
            raw_score = '\n'.join(json_lines_s)
        score_data = json.loads(raw_score)
        new_score = int(score_data.get('score', contact.ai_score))
        new_score = sync_scores(contact, deal, new_score)
    except Exception as exc:
        logger.error('AI scoring failed for message_id=%s: %s', message_id, exc)
        # Preserve existing score on failure — no provider call
        if score_delta:
            new_score = max(0, min(100, contact.ai_score + score_delta))
            Contact.objects.filter(pk=contact.pk).update(ai_score=new_score)

    # Step 6: Publish message_updated event
    _publish_redis_event(org.pk, 'message_updated', {
        'message_id': msg.pk,
        'contact_id': msg.contact_id,
        'intent': intent,
        'ai_score': new_score,
    })

    logger.info('process_inbox_message completed: message_id=%s intent=%s score=%d', message_id, intent, new_score)


@shared_task(name='apps.inbox.tasks.refresh_meta_tokens', bind=True, max_retries=3)
def refresh_meta_tokens(self):
    """
    Refresh expiring Meta access tokens for active channels.
    Runs daily via Celery beat. Refreshes tokens expiring within 7 days.
    """
    from datetime import timedelta
    from cryptography.fernet import Fernet
    from django.utils import timezone
    from apps.inbox.models import SocialChannel
    from apps.inbox.services.meta import MetaClient, MetaClientError

    threshold = timezone.now() + timedelta(days=7)
    channels = SocialChannel.objects.filter(
        is_active=True,
        token_expires_at__lt=threshold,
    )

    if not channels.exists():
        logger.info('refresh_meta_tokens: no tokens expiring soon')
        return

    meta = MetaClient()
    fernet = Fernet(settings.FERNET_KEY)
    refreshed = 0
    failed = 0

    for channel in channels:
        try:
            old_token = fernet.decrypt(bytes(channel.access_token)).decode()
            new_token, expires_in = meta.exchange_token(
                short_lived_token=old_token,
                app_id=settings.META_APP_ID,
                app_secret=settings.META_APP_SECRET,
            )
            channel.access_token = fernet.encrypt(new_token.encode())
            # 3-day buffer per research.md Decision 4
            channel.token_expires_at = timezone.now() + timedelta(seconds=expires_in) - timedelta(days=3)
            channel.save(update_fields=['access_token', 'token_expires_at'])
            refreshed += 1
        except MetaClientError as exc:
            logger.error('Token refresh failed for channel=%s: %s', channel.pk, exc)
            failed += 1
        except Exception as exc:
            logger.error('Unexpected error refreshing channel=%s: %s', channel.pk, exc)
            failed += 1

    logger.info('refresh_meta_tokens completed: refreshed=%d failed=%d', refreshed, failed)
