"""
Celery tasks for billing.
reset_monthly_usage runs at 00:00 UTC on the 1st of every month
(configured in CELERY_BEAT_SCHEDULE in settings/base.py).
"""
import logging
from decimal import Decimal

from celery import shared_task

from apps.core.flags import is_enabled

logger = logging.getLogger(__name__)


@shared_task(name='apps.billing.tasks.reset_monthly_usage', bind=True, max_retries=3)
def reset_monthly_usage(self):
    """
    Reset generation counters and USD cost fields to 0 for ALL organizations.
    Also clears ai_suspended flag so orgs regain AI access at month start.
    Idempotent: safe to run multiple times.
    """
    from apps.orgs.models import Organization

    try:
        count = Organization.objects.update(
            generations_used_this_month=0,
            monthly_cost_usd=Decimal('0.00'),
            ai_suspended=False,
        )
        logger.info('Monthly usage reset: %d organizations reset.', count)
        return f'Reset {count} organizations'
    except Exception as exc:
        logger.exception('Monthly usage reset failed: %s', exc)
        raise self.retry(exc=exc, countdown=60)


# ── Transactional Emails (Phase 10) ─────────────────────────────────────────

@shared_task(name='apps.billing.tasks.send_welcome_email', bind=True, max_retries=3)
def send_welcome_email(self, org_id: int):
    """Send welcome email to a newly created organization owner."""
    if not is_enabled('TRANSACTIONAL_EMAIL'):
        return
    from apps.orgs.models import Organization
    from apps.billing.email_client import send_email
    from apps.billing.emails.welcome import render_welcome

    try:
        org = Organization.objects.get(pk=org_id)
        if not org.owner_email:
            logger.warning('send_welcome_email: org %d has no owner_email', org_id)
            return
        send_email(
            to=org.owner_email,
            subject='مرحباً بك في رواج | Welcome to Rawaj',
            html=render_welcome(org.name),
        )
        logger.info('Welcome email sent to org %d', org_id)
    except Exception as exc:
        logger.exception('send_welcome_email failed for org %d: %s', org_id, exc)
        raise self.retry(exc=exc, countdown=60)


@shared_task(name='apps.billing.tasks.send_cost_cap_alert', bind=True, max_retries=3)
def send_cost_cap_alert(self, org_id: int):
    """Send AI cost cap alert email when an org's monthly spend exceeds their cap."""
    if not is_enabled('TRANSACTIONAL_EMAIL'):
        return
    from apps.orgs.models import Organization
    from apps.billing.email_client import send_email
    from apps.billing.emails.cost_cap_alert import render_cost_cap_alert

    try:
        org = Organization.objects.get(pk=org_id)
        if not org.owner_email:
            logger.warning('send_cost_cap_alert: org %d has no owner_email', org_id)
            return
        send_email(
            to=org.owner_email,
            subject='تنبيه: تجاوز حد تكلفة الذكاء الاصطناعي | AI Cost Cap Alert',
            html=render_cost_cap_alert(org.name, org.monthly_cost_cap_usd, org.monthly_cost_usd),
        )
        logger.info('Cost cap alert sent to org %d', org_id)
    except Exception as exc:
        logger.exception('send_cost_cap_alert failed for org %d: %s', org_id, exc)
        raise self.retry(exc=exc, countdown=60)


@shared_task(name='apps.billing.tasks.send_plan_upgrade_confirmation', bind=True, max_retries=3)
def send_plan_upgrade_confirmation(self, org_id: int, new_plan: str):
    """Send plan upgrade confirmation email after a successful Stripe checkout."""
    if not is_enabled('TRANSACTIONAL_EMAIL'):
        return
    from apps.orgs.models import Organization
    from apps.billing.email_client import send_email
    from apps.billing.emails.plan_upgrade import render_plan_upgrade

    try:
        org = Organization.objects.get(pk=org_id)
        if not org.owner_email:
            logger.warning('send_plan_upgrade_confirmation: org %d has no owner_email', org_id)
            return
        send_email(
            to=org.owner_email,
            subject='تم ترقية خطتك | Plan Upgraded',
            html=render_plan_upgrade(org.name, new_plan),
        )
        logger.info('Plan upgrade email sent to org %d (plan=%s)', org_id, new_plan)
    except Exception as exc:
        logger.exception('send_plan_upgrade_confirmation failed for org %d: %s', org_id, exc)
        raise self.retry(exc=exc, countdown=60)


@shared_task(name='apps.billing.tasks.send_weekly_digest', bind=True, max_retries=3)
def send_weekly_digest(self, org_id: int):
    """Send weekly activity digest to an organization owner."""
    if not is_enabled('TRANSACTIONAL_EMAIL'):
        return
    from datetime import timedelta

    from django.db.models import Count, Sum
    from django.utils import timezone

    from apps.orgs.models import Organization
    from apps.inbox.models import Message
    from apps.billing.email_client import send_email
    from apps.billing.emails.weekly_digest import render_weekly_digest

    try:
        org = Organization.objects.get(pk=org_id)
        if not org.owner_email:
            return

        one_week_ago = timezone.now() - timedelta(days=7)
        message_count = Message.objects.filter(org=org, sent_at__gte=one_week_ago).count()
        ai_usage = org.aiusage_set.filter(
            created_at__gte=one_week_ago, success=True
        ).aggregate(total_cost=Sum('cost_usd'), total_count=Count('id'))

        stats = {
            'messages': message_count,
            'ai_generations': ai_usage['total_count'] or 0,
            'ai_cost_usd': float(ai_usage['total_cost'] or 0),
        }
        send_email(
            to=org.owner_email,
            subject='ملخص أسبوعي | Weekly Digest',
            html=render_weekly_digest(org.name, stats),
        )
        logger.info('Weekly digest sent to org %d', org_id)
    except Exception as exc:
        logger.exception('send_weekly_digest failed for org %d: %s', org_id, exc)
        raise self.retry(exc=exc, countdown=60)


@shared_task(name='apps.billing.tasks.send_weekly_digest_all_orgs')
def send_weekly_digest_all_orgs():
    """Dispatch individual weekly digest tasks for all active orgs with an owner email."""
    from apps.orgs.models import Organization

    org_ids = list(
        Organization.objects.filter(is_active=True, owner_email__isnull=False)
        .exclude(owner_email='')
        .values_list('pk', flat=True)
    )
    for org_id in org_ids:
        send_weekly_digest.delay(org_id)
    logger.info('Dispatched weekly digest for %d orgs', len(org_ids))
    return f'Dispatched {len(org_ids)} digests'
