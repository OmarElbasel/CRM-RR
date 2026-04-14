"""
Resend email client wrapper (Phase 10 — Transactional Emails).
No-op when RESEND_API_KEY is not configured.
"""
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, html: str, from_address: str | None = None) -> bool:
    """
    Send a transactional email via Resend.

    Args:
        to:           Recipient email address.
        subject:      Email subject line.
        html:         HTML body content.
        from_address: Sender address. Defaults to RESEND_FROM_EMAIL setting.

    Returns:
        True if the email was queued successfully, False otherwise.
    """
    api_key = getattr(settings, 'RESEND_API_KEY', '')
    if not api_key:
        logger.debug('RESEND_API_KEY not configured — email to %s skipped', to)
        return False

    sender = from_address or getattr(settings, 'RESEND_FROM_EMAIL', 'noreply@rawaj.app')

    try:
        import resend
        resend.api_key = api_key
        resend.Emails.send({
            'from': sender,
            'to': [to],
            'subject': subject,
            'html': html,
        })
        logger.info('Email sent: subject=%r to=%s', subject, to)
        return True
    except ImportError:
        logger.warning('resend package not installed — email skipped')
        return False
    except Exception:
        logger.exception('Resend send failed: subject=%r to=%s', subject, to)
        return False
