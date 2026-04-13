"""
Plan limits and pricing constants for Phase 4 billing.
PLAN_LIMITS drives both middleware enforcement and org field updates on plan change.
"""
from typing import Optional

# Monthly generation limits per plan. None = unlimited (Enterprise bypass in middleware).
PLAN_LIMITS: dict[str, Optional[int]] = {
    'free': 20,
    'starter': 200,
    'pro': 2000,
    'enterprise': None,  # unlimited — PlanGatingMiddleware MUST bypass check
}

# Fixed currency conversion rates (reviewed quarterly, updated as code change).
CURRENCY_RATES: dict[str, float] = {
    'QAR': 3.64,
    'SAR': 3.75,
}

# Monthly prices in USD per plan. None = custom Enterprise pricing.
PLAN_PRICES_USD: dict[str, Optional[float]] = {
    'free': 0,
    'starter': 14,
    'pro': 41,
    'enterprise': None,
}

# Stripe Price IDs are loaded from settings (env vars), not hardcoded here.
# Access via: from django.conf import settings; settings.STRIPE_PRICE_STARTER

# Redis key prefix for Stripe event idempotency (TTL: 48 hours = 172800 seconds)
STRIPE_EVENT_CACHE_KEY = 'billing:stripe_event:{event_id}'
STRIPE_EVENT_CACHE_TTL = 172800  # 48 hours in seconds
