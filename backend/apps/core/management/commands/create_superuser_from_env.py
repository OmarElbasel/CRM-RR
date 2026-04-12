"""
Management command: create a superuser from environment variables.
Idempotent — skips creation if the superuser already exists.
Run in Railway Procfile release process alongside `migrate`.
"""
import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Create a superuser from DJANGO_SUPERUSER_EMAIL and DJANGO_SUPERUSER_PASSWORD env vars'

    def handle(self, *args, **kwargs):
        User = get_user_model()

        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '').strip()
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '').strip()

        if not email or not password:
            self.stdout.write(
                self.style.WARNING('DJANGO_SUPERUSER_EMAIL or DJANGO_SUPERUSER_PASSWORD not set — skipping superuser creation')
            )
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.SUCCESS(f'Superuser {email} already exists — skipping'))
            return

        User.objects.create_superuser(username=email, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f'Superuser {email} created successfully'))
