import logging
from datetime import timedelta

import requests
from cryptography.fernet import Fernet
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


class TikTokClientError(Exception):
    pass


class TikTokClient:
    BASE_URL = "https://open.tiktokapis.com/v2"

    def get_auth_url(self, org_id: int) -> str:
        import jwt as pyjwt
        import secrets

        state_payload = {
            "org_id": org_id,
            "nonce": secrets.token_hex(16),
            "exp": timezone.now() + timedelta(minutes=10),
        }
        state = pyjwt.encode(state_payload, settings.SECRET_KEY, algorithm="HS256")

        redirect_uri = f"{settings.BACKEND_BASE_URL}/api/channels/callback/tiktok/"
        params = {
            "client_key": settings.TIKTOK_CLIENT_KEY,
            "redirect_uri": redirect_uri,
            "scope": "user.info.basic,video.list,video.comment.list,video.comment.reply.create,video.upload",
            "state": state,
            "response_type": "code",
        }
        query = "&".join(
            f"{k}={requests.utils.quote(str(v))}" for k, v in params.items()
        )
        return f"https://www.tiktok.com/v2/auth/authorize/?{query}"

    def exchange_code(self, code: str, org_id: int) -> dict:
        redirect_uri = f"{settings.BACKEND_BASE_URL}/api/channels/callback/tiktok/"
        try:
            resp = requests.post(
                f"{self.BASE_URL}/oauth/token/",
                json={
                    "client_key": settings.TIKTOK_CLIENT_KEY,
                    "client_secret": settings.TIKTOK_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri,
                },
                timeout=30,
            )
        except requests.RequestException as exc:
            raise TikTokClientError(
                f"Network error during token exchange: {exc}"
            ) from exc

        if resp.status_code != 200:
            raise TikTokClientError(
                f"Token exchange failed (HTTP {resp.status_code}): {resp.text}"
            )

        data = resp.json()
        if "error" in data:
            raise TikTokClientError(
                f"TikTok API error: {data.get('error_description', data['error'])}"
            )

        return {
            "access_token": data["access_token"],
            "refresh_token": data.get("refresh_token", ""),
            "open_id": data.get("open_id", ""),
            "expires_in": data.get("expires_in", 3600),
        }

    def refresh_access_token(self, channel) -> None:
        fernet = Fernet(settings.FERNET_KEY)
        try:
            resp = requests.post(
                f"{self.BASE_URL}/oauth/token/",
                json={
                    "client_key": settings.TIKTOK_CLIENT_KEY,
                    "client_secret": settings.TIKTOK_CLIENT_SECRET,
                    "grant_type": "refresh_token",
                    "refresh_token": fernet.decrypt(
                        bytes(channel.access_token)
                    ).decode(),
                },
                timeout=30,
            )
        except requests.RequestException as exc:
            raise TikTokClientError(
                f"Network error during token refresh: {exc}"
            ) from exc

        if resp.status_code != 200:
            raise TikTokClientError(
                f"Token refresh failed (HTTP {resp.status_code}): {resp.text}"
            )

        data = resp.json()
        if "error" in data:
            raise TikTokClientError(
                f"TikTok API error: {data.get('error_description', data['error'])}"
            )

        new_token = data["access_token"]
        expires_in = data.get("expires_in", 3600)
        channel.access_token = fernet.encrypt(new_token.encode())
        channel.token_expires_at = (
            timezone.now() + timedelta(seconds=expires_in) - timedelta(days=3)
        )
        channel.save(update_fields=["access_token", "token_expires_at"])

    def _get_headers(self, channel) -> dict:
        fernet = Fernet(settings.FERNET_KEY)
        token = fernet.decrypt(bytes(channel.access_token)).decode()
        return {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    def list_recent_comments(self, channel, days: int = 7) -> list[dict]:
        headers = self._get_headers(channel)
        cutoff = timezone.now() - timedelta(days=days)

        try:
            videos_resp = requests.get(
                f"{self.BASE_URL}/video/list/",
                headers=headers,
                params={
                    "fields": "id,title,create_time",
                    "max_count": 20,
                },
                timeout=30,
            )
        except requests.RequestException as exc:
            raise TikTokClientError(
                f"Network error fetching video list: {exc}"
            ) from exc

        if videos_resp.status_code != 200:
            raise TikTokClientError(
                f"Video list failed (HTTP {videos_resp.status_code}): {videos_resp.text}"
            )

        videos_data = videos_resp.json()
        if "error" in videos_data:
            raise TikTokClientError(
                f"TikTok API error: {videos_data.get('error_description', videos_data['error'])}"
            )

        videos = videos_data.get("data", {}).get("videos", [])
        all_comments = []

        for video in videos:
            video_id = video.get("id", "")
            create_time_str = video.get("create_time", "")
            if create_time_str:
                try:
                    create_ts = int(create_time_str)
                    video_date = timezone.datetime.fromtimestamp(
                        create_ts, tz=timezone.utc
                    )
                    if video_date < cutoff:
                        continue
                except (ValueError, OSError):
                    pass

            try:
                comments_resp = requests.get(
                    f"{self.BASE_URL}/video/comment/list/",
                    headers=headers,
                    params={"video_id": video_id, "count": 50},
                    timeout=30,
                )
            except requests.RequestException as exc:
                logger.warning(
                    "Failed to fetch comments for video %s: %s", video_id, exc
                )
                continue

            if comments_resp.status_code != 200:
                logger.warning(
                    "Comment list failed for video %s (HTTP %d)",
                    video_id,
                    comments_resp.status_code,
                )
                continue

            comments_data = comments_resp.json()
            if "error" in comments_data:
                continue

            for comment in comments_data.get("data", {}).get("comments", []):
                created_at_str = comment.get("create_time", "")
                created_at = None
                if created_at_str:
                    try:
                        created_at = timezone.datetime.fromtimestamp(
                            int(created_at_str), tz=timezone.utc
                        )
                    except (ValueError, OSError):
                        pass

                all_comments.append(
                    {
                        "video_id": video_id,
                        "comment_id": comment.get("comment_id", ""),
                        "text": comment.get("text", ""),
                        "author_name": comment.get("user", {}).get("display_name", ""),
                        "author_open_id": comment.get("user", {}).get("open_id", ""),
                        "created_at": created_at,
                    }
                )

        return all_comments

    def reply_to_comment(
        self, channel, video_id: str, comment_id: str, text: str
    ) -> str:
        headers = self._get_headers(channel)
        try:
            resp = requests.post(
                f"{self.BASE_URL}/video/comment/reply/create/",
                headers=headers,
                json={
                    "video_id": video_id,
                    "comment_id": comment_id,
                    "text": text,
                },
                timeout=30,
            )
        except requests.RequestException as exc:
            raise TikTokClientError(
                f"Network error replying to comment: {exc}"
            ) from exc

        if resp.status_code != 200:
            raise TikTokClientError(
                f"Reply failed (HTTP {resp.status_code}): {resp.text}"
            )

        data = resp.json()
        if "error" in data:
            raise TikTokClientError(
                f"TikTok API error: {data.get('error_description', data['error'])}"
            )

        return data.get("data", {}).get("comment_id", "")
