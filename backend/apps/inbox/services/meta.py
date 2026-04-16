import logging
from urllib.parse import urlencode

import requests

logger = logging.getLogger(__name__)

GRAPH_API_BASE = 'https://graph.facebook.com/v21.0'


class MetaClientError(Exception):
    """Raised when a Meta Graph API call fails."""
    pass


class MetaClient:
    """
    Client for Meta Graph API v21.0 — Instagram, Facebook Messenger.
    Constitution Principle II: This is a service-layer wrapper, not called directly from views.
    """

    def send_dm(self, page_id: str, recipient_id: str, text: str, access_token: str) -> dict:
        """Send a DM via Instagram or Facebook Messenger."""
        url = f'{GRAPH_API_BASE}/{page_id}/messages'
        payload = {
            'recipient': {'id': recipient_id},
            'message': {'text': text},
        }
        resp = requests.post(
            url,
            json=payload,
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=15,
        )
        if not resp.ok:
            logger.error('MetaClient.send_dm failed: %s %s', resp.status_code, resp.text)
            raise MetaClientError(f'send_dm failed: {resp.status_code}')
        return resp.json()

    def send_comment_reply(self, comment_id: str, text: str, access_token: str) -> dict:
        """Reply to an Instagram/Facebook comment."""
        url = f'{GRAPH_API_BASE}/{comment_id}/replies'
        payload = {'message': text}
        resp = requests.post(
            url,
            json=payload,
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=15,
        )
        if not resp.ok:
            logger.error('MetaClient.send_comment_reply failed: %s %s', resp.status_code, resp.text)
            raise MetaClientError(f'send_comment_reply failed: {resp.status_code}')
        return resp.json()

    def exchange_code_for_token(self, code: str, app_id: str, app_secret: str, redirect_uri: str) -> str:
        """
        Exchange an OAuth authorization code for a short-lived user access token.
        This is step 1 of the Meta OAuth flow.
        """
        url = f'{GRAPH_API_BASE}/oauth/access_token'
        params = {
            'client_id': app_id,
            'client_secret': app_secret,
            'redirect_uri': redirect_uri,
            'code': code,
        }
        resp = requests.get(url, params=params, timeout=15)
        if not resp.ok:
            logger.error('MetaClient.exchange_code_for_token failed: %s %s', resp.status_code, resp.text)
            raise MetaClientError(f'exchange_code_for_token failed: {resp.status_code} {resp.text}')
        return resp.json()['access_token']

    def exchange_token(self, short_lived_token: str, app_id: str, app_secret: str) -> tuple[str, int]:
        """
        Exchange a short-lived user token for a long-lived token (~60 days).
        Returns (long_lived_token, expires_in_seconds). This is step 2 of the Meta OAuth flow.
        """
        url = f'{GRAPH_API_BASE}/oauth/access_token'
        params = {
            'grant_type': 'fb_exchange_token',
            'client_id': app_id,
            'client_secret': app_secret,
            'fb_exchange_token': short_lived_token,
        }
        resp = requests.get(url, params=params, timeout=15)
        if not resp.ok:
            logger.error('MetaClient.exchange_token failed: %s %s', resp.status_code, resp.text)
            raise MetaClientError(f'exchange_token failed: {resp.status_code}')
        data = resp.json()
        return data['access_token'], data.get('expires_in', 5184000)

    def get_user_pages(self, user_access_token: str) -> list[dict]:
        """
        Fetch all Facebook Pages the user manages.
        Returns list of dicts with id, name, access_token (page-scoped token).
        """
        url = f'{GRAPH_API_BASE}/me/accounts'
        resp = requests.get(
            url,
            params={'access_token': user_access_token, 'fields': 'id,name,access_token'},
            timeout=15,
        )
        if not resp.ok:
            logger.error('MetaClient.get_user_pages failed: %s %s', resp.status_code, resp.text)
            raise MetaClientError(f'get_user_pages failed: {resp.status_code}')
        return resp.json().get('data', [])

    def get_instagram_account_id(self, page_id: str, page_access_token: str) -> str | None:
        """
        Get the Instagram Business Account ID linked to a Facebook Page.
        Returns the Instagram account ID, or None if not linked.
        """
        url = f'{GRAPH_API_BASE}/{page_id}'
        resp = requests.get(
            url,
            params={'fields': 'instagram_business_account', 'access_token': page_access_token},
            timeout=15,
        )
        if not resp.ok:
            return None
        iba = resp.json().get('instagram_business_account', {})
        return iba.get('id')

    def revoke_token(self, access_token: str) -> None:
        """Revoke a Meta access token."""
        url = f'{GRAPH_API_BASE}/me/permissions'
        resp = requests.delete(
            url,
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=15,
        )
        if not resp.ok:
            logger.warning('MetaClient.revoke_token failed: %s %s', resp.status_code, resp.text)

    @staticmethod
    def build_oauth_url(app_id: str, redirect_uri: str, state: str, scopes: list[str]) -> str:
        """Build the Meta OAuth authorization URL."""
        params = {
            'client_id': app_id,
            'redirect_uri': redirect_uri,
            'state': state,
            'scope': ','.join(scopes),
            'response_type': 'code',
        }
        return f'https://www.facebook.com/v21.0/dialog/oauth?{urlencode(params)}'
