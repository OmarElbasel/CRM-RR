import hashlib
import hmac
import base64
import requests
from django.conf import settings


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
        """Exchange OAuth code for permanent access token."""
        resp = requests.post(
            f'https://{self.shop}/admin/oauth/access_token',
            json={
                'client_id': settings.SHOPIFY_CLIENT_ID,
                'client_secret': settings.SHOPIFY_CLIENT_SECRET,
                'code': code,
            },
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json()['access_token']

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
