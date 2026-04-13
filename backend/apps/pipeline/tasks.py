import json
import logging
from datetime import timedelta

from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(name='apps.pipeline.tasks.check_stale_deals', bind=True, max_retries=1)
def check_stale_deals(self):
    """
    Periodic task (every 6 hours) to detect stale deals and create notifications.
    - PRICE_SENT deals inactive > 48h → HIGH priority alert + AI follow-up draft
    - ENGAGED deals inactive > 7 days → LOW priority reminder
    """
    from apps.pipeline.models import Deal
    from apps.pipeline.services.notifications import create_stale_alert

    now = timezone.now()
    stale_price_sent_threshold = now - timedelta(hours=48)
    stale_engaged_threshold = now - timedelta(days=7)

    # PRICE_SENT stale deals
    price_sent_deals = Deal.objects.filter(
        stage='PRICE_SENT',
        last_customer_message_at__lt=stale_price_sent_threshold,
    ).select_related('org', 'contact')

    created_count = 0
    for deal in price_sent_deals:
        draft_en = ''
        draft_ar = ''

        # Generate follow-up drafts via AI if contact exists
        if deal.contact:
            try:
                draft_en, draft_ar = _generate_followup_drafts(deal)
            except Exception as exc:
                logger.error('Draft generation failed for deal=%d: %s', deal.pk, exc)

        result = create_stale_alert(
            org=deal.org,
            deal=deal,
            notification_type='STALE_PRICE_SENT',
            priority='HIGH',
            title=f'Follow up on {deal.title}',
            body=f'No reply after 48 hours in Price Sent.',
            body_ar='لا يوجد رد بعد 48 ساعة في مرحلة إرسال السعر.',
            draft_en=draft_en,
            draft_ar=draft_ar,
            window_start=now,
        )
        if result:
            created_count += 1

    # ENGAGED stale deals
    engaged_deals = Deal.objects.filter(
        stage='ENGAGED',
        last_customer_message_at__lt=stale_engaged_threshold,
    ).select_related('org', 'contact')

    for deal in engaged_deals:
        result = create_stale_alert(
            org=deal.org,
            deal=deal,
            notification_type='STALE_ENGAGED',
            priority='LOW',
            title=f'Review quiet engaged lead',
            body=f'This lead has been inactive for 7 days.',
            body_ar='هذا العميل المحتمل غير نشط منذ 7 أيام.',
            window_start=now,
        )
        if result:
            created_count += 1

    logger.info('check_stale_deals completed: created=%d alerts', created_count)


FOLLOWUP_SYSTEM_PROMPT = """You are a bilingual follow-up message assistant for a Gulf e-commerce merchant.
Write a polite, professional follow-up message for a customer who has gone quiet after receiving a price quote.
Return ONLY valid JSON: {"draft_en": "...", "draft_ar": "..."}
The Arabic should be in Gulf dialect. Keep messages concise (1-3 sentences)."""


def _generate_followup_drafts(deal):
    """Generate bilingual follow-up drafts for a stale PRICE_SENT deal."""
    from apps.generate.ai_client import get_ai_client
    from apps.generate.models import AIUsage

    client = get_ai_client()
    contact_name = deal.contact.name if deal.contact else 'Customer'

    prompt = (
        f'Customer name: "{contact_name}"\n'
        f'Deal title: "{deal.title}"\n'
        f'Stage: PRICE_SENT\n'
        f'Days since last message: {_days_since(deal.last_customer_message_at)}\n'
    )

    response = client.generate(prompt, FOLLOWUP_SYSTEM_PROMPT, max_tokens=512)

    AIUsage.objects.create(
        org=deal.org,
        model=response.model,
        tokens_in=response.tokens_in,
        tokens_out=response.tokens_out,
        cost_usd=response.cost_usd,
        language='bilingual',
        category='other',
        tone='professional',
        cache_hit=False,
        success=True,
    )

    raw = response.content.strip()
    if raw.startswith('```'):
        lines = raw.split('\n')
        json_lines = [l for l in lines[1:] if not l.startswith('```')]
        raw = '\n'.join(json_lines)

    data = json.loads(raw)
    return data.get('draft_en', ''), data.get('draft_ar', '')


def _days_since(dt):
    """Return integer days since a datetime, or 'unknown'."""
    if not dt:
        return 'unknown'
    delta = timezone.now() - dt
    return max(0, delta.days)
