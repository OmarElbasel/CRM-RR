import logging
from datetime import datetime

from django.db import IntegrityError

from apps.pipeline.models import PipelineNotification

logger = logging.getLogger(__name__)


def make_dedupe_key(deal_id, notification_type, window_start: datetime):
    """Generate a deterministic dedupe key for a stale-deal alert."""
    window_iso = window_start.strftime('%Y-%m-%dT%H')
    return f'{deal_id}:{notification_type.lower()}:{window_iso}'


def create_stale_alert(org, deal, notification_type, priority, title, body, body_ar='',
                       draft_en='', draft_ar='', window_start=None):
    """
    Create a stale-deal notification with deduplication.
    Returns the notification if created, None if dedupe hit.
    """
    from django.utils import timezone
    window_start = window_start or timezone.now()
    dedupe_key = make_dedupe_key(deal.pk, notification_type, window_start)

    try:
        notification = PipelineNotification.objects.create(
            org=org,
            deal=deal,
            notification_type=notification_type,
            priority=priority,
            title=title,
            body=body,
            body_ar=body_ar,
            draft_en=draft_en,
            draft_ar=draft_ar,
            dedupe_key=dedupe_key,
        )
        logger.info('Created %s notification=%d for deal=%d', notification_type, notification.pk, deal.pk)
        return notification
    except IntegrityError:
        logger.info('Dedupe hit for key=%s, skipping', dedupe_key)
        return None
