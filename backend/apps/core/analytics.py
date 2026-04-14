"""
PostHog analytics wrapper (Constitution Principle III — observability).
Fires server-side events scoped to the authenticated Organization.
No-op when POSTHOG_API_KEY is not configured.
"""
import logging

from django.conf import settings

logger = logging.getLogger(__name__)

_client = None


def _get_client():
    """Return a cached PostHog client, or None if API key is not configured."""
    global _client
    if _client is not None:
        return _client

    api_key = getattr(settings, 'POSTHOG_API_KEY', '')
    if not api_key:
        return None

    try:
        import posthog as ph
        ph.api_key = api_key
        ph.host = getattr(settings, 'POSTHOG_HOST', 'https://app.posthog.com')
        ph.on_error = lambda error, items: logger.warning('PostHog error: %s', error)
        _client = ph
        return _client
    except ImportError:
        logger.warning('posthog package not installed — analytics disabled')
        return None


def capture(event_name: str, org, properties: dict | None = None) -> None:
    """
    Fire a named analytics event scoped to an Organization.

    Args:
        event_name: Snake-case event name (e.g. 'message_received').
        org:        Organization instance. Uses clerk_org_id as distinct_id.
        properties: Optional dict of additional properties.
    """
    client = _get_client()
    if client is None:
        return

    try:
        client.capture(
            distinct_id=org.clerk_org_id,
            event=event_name,
            properties={
                'org_id': str(org.pk),
                'org_plan': org.plan,
                **(properties or {}),
            },
        )
    except Exception:
        logger.exception('PostHog capture failed for event %s', event_name)
