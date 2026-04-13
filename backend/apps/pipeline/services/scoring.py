import logging

logger = logging.getLogger(__name__)

SCORE_SYSTEM_PROMPT = """You are a lead scoring engine for a Gulf e-commerce CRM.
Given the customer context, return an absolute lead score from 0 to 100.
Return ONLY valid JSON: {"score": <int>}

Scoring factors:
- Message urgency / buying language (high weight)
- Engagement count (number of messages exchanged)
- Time since last merchant reply (stale = lower score)
- Available spend / order history signals
- Intent classification of latest message

Score ranges:
- 80-100: Hot lead, ready to buy
- 60-79: Warm lead, actively engaged
- 40-59: Interested but needs nurturing
- 20-39: Cold lead, low engagement
- 0-19: Minimal interest or lost
"""


def build_score_prompt(contact, message, engagement_count, last_merchant_reply_lag_hours):
    """Build the scoring prompt with available context signals."""
    return (
        f'Customer: "{contact.name}"\n'
        f'Platform: {contact.platform}\n'
        f'Latest message: "{message.content[:500]}"\n'
        f'Latest intent: {message.intent or "UNKNOWN"}\n'
        f'Engagement count: {engagement_count}\n'
        f'Hours since last merchant reply: {last_merchant_reply_lag_hours}\n'
        f'Total spend (QAR): {contact.total_spend}\n'
        f'Current score: {contact.ai_score}\n'
    )


def sync_scores(contact, deal, new_score):
    """Persist the new absolute score to both contact and deal."""
    clamped = max(0, min(100, new_score))
    from apps.inbox.models import Contact
    Contact.objects.filter(pk=contact.pk).update(ai_score=clamped)
    if deal:
        from apps.pipeline.models import Deal
        Deal.objects.filter(pk=deal.pk).update(ai_score=clamped)
    return clamped
