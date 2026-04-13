"""
Celery tasks for billing.
reset_monthly_usage runs at 00:00 UTC on the 1st of every month
(configured in CELERY_BEAT_SCHEDULE in settings/base.py).
"""
import logging
from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(name='apps.billing.tasks.reset_monthly_usage', bind=True, max_retries=3)
def reset_monthly_usage(self):
    """
    Reset generations_used_this_month to 0 for ALL organizations.
    Idempotent: safe to run multiple times — result is always 0.
    """
    from apps.orgs.models import Organization

    try:
        count = Organization.objects.update(generations_used_this_month=0)
        logger.info('Monthly usage reset: %d organizations reset.', count)
        return f'Reset {count} organizations'
    except Exception as exc:
        logger.exception('Monthly usage reset failed: %s', exc)
        raise self.retry(exc=exc, countdown=60)
