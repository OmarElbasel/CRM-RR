"""
Load test for Rawaj AI — Phase 10 Launch Hardening.

Run against staging:
    locust -f locustfile.py \
      --host=https://your-staging-url.railway.app \
      --users=100 --spawn-rate=1 --run-time=5m \
      --headless --html=load-test-report.html

Pass-criteria (from spec):
  - p95 response time < 3000 ms for all tasks
  - error rate < 1%
"""
import os
from locust import HttpUser, task, between

BEARER_TOKEN = os.environ.get('TEST_JWT_TOKEN', 'replace-with-valid-jwt')

class RawajUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        self.client.headers.update({'Authorization': f'Bearer {BEARER_TOKEN}'})

    @task(3)
    def list_inbox(self):
        """GET /api/inbox/conversations/ — highest traffic endpoint."""
        self.client.get('/api/inbox/', name='inbox_list')

    @task(2)
    def view_thread(self):
        """GET /api/inbox/conversations/1/messages/ — thread view."""
        self.client.get('/api/inbox/1/messages/', name='inbox_thread')

    @task(1)
    def ai_generate(self):
        """POST /api/generate/ — AI generation (lowest weight, most expensive)."""
        self.client.post(
            '/api/generate/',
            json={
                'product_name': 'Load test product',
                'platform': 'shopify',
                'language': 'ar',
            },
            name='ai_generate',
        )
