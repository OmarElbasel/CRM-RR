import hashlib
import hmac
import base64
import requests
from django.conf import settings
from apps.core.platform_credentials import get_credential


class ShopifyClientError(Exception):
    pass


class ShopifyClient:
    BASE = 'https://{shop}/admin/api/{version}'

    def __init__(self, shop_domain: str, access_token: str):
        self.shop = shop_domain
        self.token = access_token
        self.base_url = self.BASE.format(shop=shop_domain, version=settings.SHOPIFY_API_VERSION)
        self.headers = {
            'X-Shopify-Access-Token': access_token,
            'Content-Type': 'application/json',
        }

    def _get(self, path: str, params: dict = None) -> dict:
        resp = requests.get(f'{self.base_url}{path}', headers=self.headers, params=params, timeout=15)
        if resp.status_code == 401:
            raise ShopifyClientError('Token revoked or invalid')
        resp.raise_for_status()
        return resp.json()

    def _post(self, path: str, body: dict) -> dict:
        resp = requests.post(f'{self.base_url}{path}', headers=self.headers, json=body, timeout=15)
        resp.raise_for_status()
        return resp.json()

    def exchange_access_token(self, code: str) -> str:
        """Exchange OAuth code for permanent access token (3-legged OAuth)."""
        resp = requests.post(
            f'https://{self.shop}/admin/oauth/access_token',
            json={
                'client_id': get_credential("SHOPIFY", "app_id"),
                'client_secret': get_credential("SHOPIFY", "app_secret"),
                'code': code,
            },
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json()['access_token']

    @classmethod
    def exchange_client_credentials(cls, shop: str, client_id: str, client_secret: str) -> dict:
        """
        Exchange client_id + client_secret for a short-lived access token.
        Uses the client_credentials grant — no redirect/browser flow needed.
        Returns: {'access_token': 'shpat_...', 'scope': '...', 'expires_in': 86399}
        Token is valid for ~24 hours.
        """
        resp = requests.post(
            f'https://{shop}/admin/oauth/access_token',
            json={
                'grant_type': 'client_credentials',
                'client_id': client_id,
                'client_secret': client_secret,
            },
            timeout=15,
        )
        if resp.status_code == 401:
            raise ShopifyClientError('Invalid client_id or client_secret')
        resp.raise_for_status()
        return resp.json()

    @classmethod
    def from_integration(cls, integration) -> 'ShopifyClient':
        """
        Build a ShopifyClient from a ShopifyIntegration, refreshing the token
        if it has expired or is within 5 minutes of expiry.
        Saves the refreshed token back to the integration.
        """
        from django.utils import timezone
        from datetime import timedelta
        from cryptography.fernet import Fernet

        fernet = Fernet(settings.FERNET_KEY)
        needs_refresh = (
            integration.token_expires_at is not None
            and integration.token_expires_at - timezone.now() < timedelta(minutes=5)
        )

        if needs_refresh and integration.client_id and integration.client_secret:
            client_secret = fernet.decrypt(bytes(integration.client_secret)).decode()
            try:
                result = cls.exchange_client_credentials(
                    integration.shop_domain,
                    integration.client_id,
                    client_secret,
                )
                access_token = result['access_token']
                expires_in = result.get('expires_in', 86399)
                integration.access_token = fernet.encrypt(access_token.encode())
                integration.token_expires_at = timezone.now() + timedelta(seconds=expires_in)
                integration.save(update_fields=['access_token', 'token_expires_at'])
            except ShopifyClientError:
                integration.is_active = False
                integration.save(update_fields=['is_active'])
                raise

        access_token = fernet.decrypt(bytes(integration.access_token)).decode()
        return cls(integration.shop_domain, access_token)

    def get_orders(self, created_at_min: str = None, page_info: str = None, limit: int = 50) -> dict:
        """Fetch orders page. Returns full response dict including pagination headers."""
        params = {'limit': limit, 'status': 'any'}
        if created_at_min:
            params['created_at_min'] = created_at_min
        if page_info:
            params = {'limit': limit, 'page_info': page_info}
        resp = requests.get(f'{self.base_url}/orders.json', headers=self.headers, params=params, timeout=30)
        resp.raise_for_status()
        return {'orders': resp.json().get('orders', []), 'link_header': resp.headers.get('Link', '')}

    def get_customers(self, page_info: str = None, limit: int = 50) -> dict:
        """Fetch customers page. Returns full response dict including pagination headers."""
        params = {'limit': limit}
        if page_info:
            params = {'limit': limit, 'page_info': page_info}
        resp = requests.get(f'{self.base_url}/customers.json', headers=self.headers, params=params, timeout=30)
        resp.raise_for_status()
        return {'customers': resp.json().get('customers', []), 'link_header': resp.headers.get('Link', '')}

    def register_webhooks(self, base_url: str) -> list:
        """Register orders/create, orders/updated, carts/create webhooks. Returns list of created webhook IDs."""
        topics = ['orders/create', 'orders/updated', 'carts/create']
        ids = []
        for topic in topics:
            try:
                data = self._post('/webhooks.json', {'webhook': {
                    'topic': topic,
                    'address': f'{base_url}/api/webhooks/shopify/',
                    'format': 'json',
                }})
                ids.append(data['webhook']['id'])
            except Exception:
                pass  # Log but don't fail install on webhook registration error
        return ids

    @staticmethod
    def verify_webhook_hmac(body: bytes, hmac_header: str) -> bool:
        """Verify Shopify webhook HMAC-SHA256 signature."""
        digest = hmac.new(
            settings.SHOPIFY_WEBHOOK_SECRET.encode(),
            body,
            hashlib.sha256,
        ).digest()
        computed = base64.b64encode(digest).decode()
        return hmac.compare_digest(computed, hmac_header)
