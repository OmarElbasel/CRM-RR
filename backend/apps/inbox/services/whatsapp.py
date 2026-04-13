import logging

import requests

logger = logging.getLogger(__name__)

WHATSAPP_API_BASE = 'https://graph.facebook.com/v21.0'


class WhatsAppClientError(Exception):
    """Raised when a WhatsApp Business API call fails."""
    pass


class WhatsAppClient:
    """
    Client for WhatsApp Business Cloud API (via Meta Graph API v21.0).
    """

    def send_message(self, phone_number_id: str, recipient_wa_id: str, text: str, access_token: str) -> dict:
        """Send a text message to a WhatsApp user."""
        url = f'{WHATSAPP_API_BASE}/{phone_number_id}/messages'
        payload = {
            'messaging_product': 'whatsapp',
            'to': recipient_wa_id,
            'type': 'text',
            'text': {'body': text},
        }
        resp = requests.post(
            url,
            json=payload,
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=15,
        )
        if not resp.ok:
            logger.error('WhatsAppClient.send_message failed: %s %s', resp.status_code, resp.text)
            raise WhatsAppClientError(f'send_message failed: {resp.status_code}')
        return resp.json()

    def send_template(self, phone_number_id: str, recipient_wa_id: str, template_name: str, access_token: str) -> dict:
        """Send a template message to a WhatsApp user."""
        url = f'{WHATSAPP_API_BASE}/{phone_number_id}/messages'
        payload = {
            'messaging_product': 'whatsapp',
            'to': recipient_wa_id,
            'type': 'template',
            'template': {
                'name': template_name,
                'language': {'code': 'en'},
            },
        }
        resp = requests.post(
            url,
            json=payload,
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=15,
        )
        if not resp.ok:
            logger.error('WhatsAppClient.send_template failed: %s %s', resp.status_code, resp.text)
            raise WhatsAppClientError(f'send_template failed: {resp.status_code}')
        return resp.json()
