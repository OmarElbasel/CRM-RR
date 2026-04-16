from django.http import JsonResponse
from apps.core.flags import is_enabled
from apps.orgs.models import Organization


class TokenBudgetMiddleware:
    _jwks_client = None

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.path.startswith('/api/generate/') or not is_enabled('AI_GENERATION'):
            return self.get_response(request)

        org = self._resolve_org(request)
        if org is None:
            # Auth failure handled by DRF permission classes — don't block here
            return self.get_response(request)

        # Enterprise orgs have no generation limit (Constitution Principle VI)
        if org.plan == 'enterprise':
            return self.get_response(request)

        # Phase 10 — Enforce monthly USD cost cap (Constitution Principle VI)
        if is_enabled("COST_CAP_USD"):
            if org.ai_suspended:
                self._log_rate_limit(org, "COST_CAP_EXCEEDED")
                return JsonResponse(
                    {
                        "error": "Monthly AI cost cap reached. AI access suspended until next month.",
                        "error_ar": "تم تجاوز حد التكلفة الشهري للذكاء الاصطناعي. تم تعليق الوصول حتى الشهر القادم.",
                        "code": "COST_CAP_EXCEEDED",
                        "upgrade_url": "/dashboard",
                    },
                    status=429,
                )
            if org.monthly_cost_usd >= org.monthly_cost_cap_usd:
                # Mark org as suspended and trigger alert email asynchronously
                Organization.objects.filter(pk=org.pk).update(ai_suspended=True)
                try:
                    from apps.billing.tasks import send_cost_cap_alert

                    send_cost_cap_alert.delay(org.pk)
                except Exception:
                    pass
                self._log_rate_limit(org, "COST_CAP_EXCEEDED")
                return JsonResponse(
                    {
                        "error": "Monthly AI cost cap reached. AI access suspended until next month.",
                        "error_ar": "تم تجاوز حد التكلفة الشهري للذكاء الاصطناعي. تم تعليق الوصول حتى الشهر القادم.",
                        "code": "COST_CAP_EXCEEDED",
                        "upgrade_url": "/dashboard",
                    },
                    status=429,
                )

        # Enforce monthly generation limit for all other plans
        if org.generations_used_this_month >= org.monthly_generation_limit:
            self._log_rate_limit(org, "BUDGET_EXCEEDED")
            return JsonResponse(
                {
                    "error": "Monthly generation limit reached. Please upgrade your plan.",
                    "error_ar": "لقد استنفدت حصتك الشهرية. يرجى ترقية خطتك.",
                    "code": "BUDGET_EXCEEDED",
                    "upgrade_url": "/dashboard",
                },
                status=429,
            )

        return self.get_response(request)

    def _log_rate_limit(self, org, reason):
        """Log a rate limit event to the database. Non-blocking."""
        try:
            from apps.admin_panel.models import RateLimitEvent

            RateLimitEvent.objects.create(org=org, reason=reason)
        except Exception:
            # Never let admin logging break a generation request
            pass

    @classmethod
    def _get_jwks_client(cls):
        if cls._jwks_client is None:
            from django.conf import settings
            from jwt import PyJWKClient
            cls._jwks_client = PyJWKClient(settings.CLERK_JWKS_URL, cache_keys=True)
        return cls._jwks_client

    def _resolve_org(self, request):
        """Extract org from JWT or X-API-Key without full DRF auth. Returns None if unresolvable."""
        # Try X-API-Key first (widget embed requests)
        api_key = request.headers.get('X-API-Key', '')
        if api_key.startswith('pk_'):
            org = Organization.objects.filter(api_key_public=api_key, is_active=True).first()
            if org:
                request.org = org
                return org

        # Fall through to JWT-based resolution
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None
        token = auth_header.split(' ', 1)[1].strip()
        if not token:
            return None
        try:
            import jwt as pyjwt
            from django.conf import settings
            client = self._get_jwks_client()
            signing_key = client.get_signing_key_from_jwt(token)
            claims = pyjwt.decode(
                token, signing_key.key, algorithms=['RS256'],
                options={'verify_exp': True, 'verify_iss': bool(settings.CLERK_ISSUER)},
                issuer=settings.CLERK_ISSUER if settings.CLERK_ISSUER else None,
            )
            clerk_org_id = claims.get('org_id')
            if not clerk_org_id:
                return None
            return Organization.objects.filter(clerk_org_id=clerk_org_id, is_active=True).first()
        except Exception:
            return None