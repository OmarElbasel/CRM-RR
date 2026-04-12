"""
Organization views.
All views here require authentication (ClerkJWTAuthentication sets request.org).
"""
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response


@extend_schema(
    summary='Get current organization',
    description='Returns the authenticated organization. Requires a valid Clerk JWT with org_id claim.',
    responses={
        200: inline_serializer(
            name='OrgMeResponse',
            fields={
                'id': serializers.IntegerField(),
                'name': serializers.CharField(),
                'plan': serializers.CharField(),
                'clerk_org_id': serializers.CharField(),
            },
        ),
        401: inline_serializer(
            name='UnauthorizedResponse',
            fields={
                'error': serializers.CharField(),
                'error_ar': serializers.CharField(),
            },
        ),
    },
    tags=['Organizations'],
)
@api_view(['GET'])
def org_me(request):
    """
    Return the current authenticated organization.
    request.org is set by ClerkJWTAuthentication.
    This endpoint is the canonical "am I authenticated?" check.
    """
    org = request.org
    return Response({
        'id': org.id,
        'name': org.name,
        'plan': org.plan,
        'clerk_org_id': org.clerk_org_id,
    })
