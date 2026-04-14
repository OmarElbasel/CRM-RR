"""
Celery tasks for organization-level operations (Phase 10 — Abuse Detection).
detect_abuse runs hourly (configured in CELERY_BEAT_SCHEDULE in settings/base.py).
Constitution Principle I — all queries scoped to org.
"""
import logging
from datetime import timedelta

from celery import shared_task
from django.db.models import Count
from django.utils import timezone

from apps.core.flags import is_enabled

logger = logging.getLogger(__name__)


@shared_task(name='apps.orgs.tasks.detect_abuse')
def detect_abuse():
    """
    Hourly task. Scans all orgs for anomalous 24-hour inbound message volume.
    Flags orgs where count_24h > 5x trailing_30d_avg AND count_24h >= 50.
    Uses update_or_create on FlaggedOrg — skips orgs already in pending/suspended state.
    """
    if not is_enabled('ABUSE_DETECTION'):
        return 'ABUSE_DETECTION flag disabled — skipped'

    from apps.inbox.models import Message
    from apps.orgs.models import Organization, FlaggedOrg

    now = timezone.now()
    window_24h = now - timedelta(hours=24)
    window_30d = now - timedelta(days=30)

    THRESHOLD_MULTIPLIER = 5
    MIN_VOLUME = 50  # ignore very low-traffic orgs

    # Per-org 24h inbound message count
    orgs_24h = (
        Message.objects.filter(direction='INBOUND', sent_at__gte=window_24h)
        .values('org_id')
        .annotate(count_24h=Count('id'))
    )

    # Per-org 30-day inbound count (for daily average computation)
    orgs_30d = (
        Message.objects.filter(direction='INBOUND', sent_at__gte=window_30d)
        .values('org_id')
        .annotate(count_30d=Count('id'))
    )
    avg_by_org = {r['org_id']: r['count_30d'] / 30.0 for r in orgs_30d}

    flagged_count = 0
    for row in orgs_24h:
        org_id = row['org_id']
        count_24h = row['count_24h']
        avg_30d = avg_by_org.get(org_id, 0.0)

        if count_24h < MIN_VOLUME:
            continue
        if avg_30d > 0 and count_24h < THRESHOLD_MULTIPLIER * avg_30d:
            continue

        # Skip orgs already flagged with a non-cleared status
        existing = FlaggedOrg.objects.filter(org_id=org_id).first()
        if existing and existing.status != 'cleared':
            continue

        org = Organization.objects.filter(pk=org_id, is_active=True).first()
        if not org:
            continue

        FlaggedOrg.objects.update_or_create(
            org=org,
            defaults={
                'message_volume_24h': count_24h,
                'trailing_30d_avg': avg_30d,
                'status': 'pending',
            },
        )
        flagged_count += 1
        logger.warning(
            'Abuse flag: org=%s name=%r volume_24h=%d avg_30d=%.1f',
            org_id, org.name, count_24h, avg_30d,
        )

    logger.info('detect_abuse complete: %d org(s) newly flagged', flagged_count)
    return f'Flagged {flagged_count} org(s)'
