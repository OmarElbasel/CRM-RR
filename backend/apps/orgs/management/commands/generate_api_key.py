import secrets

from django.core.management.base import BaseCommand, CommandError

from apps.orgs.models import Organization


class Command(BaseCommand):
    help = 'Generate a public API key for an organization'

    def add_arguments(self, parser):
        parser.add_argument('clerk_org_id', type=str, help='Clerk organization ID')
        parser.add_argument(
            '--env',
            type=str,
            choices=['test', 'live'],
            default='test',
            help='Key environment: test or live (default: test)',
        )

    def handle(self, *args, **options):
        clerk_org_id = options['clerk_org_id']
        env = options['env']

        try:
            org = Organization.objects.get(clerk_org_id=clerk_org_id)
        except Organization.DoesNotExist:
            raise CommandError(f'Organization with clerk_org_id="{clerk_org_id}" not found.')

        key = f'pk_{env}_{secrets.token_hex(16)}'
        org.api_key_public = key
        org.save(update_fields=['api_key_public'])

        self.stdout.write(self.style.SUCCESS(f'Generated key for "{org.name}": {key}'))
