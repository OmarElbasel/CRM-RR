"""
Core views: health check.
All endpoints in this file must use @extend_schema (Constitution Principle V).
"""
from drf_spectacular.utils import extend_schema, OpenApiResponse, inline_serializer
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection, OperationalError


@extend_schema(
    summary='Health check',
    description='Returns service health status and database connectivity. Public endpoint — no authentication required.',
    responses={
        200: inline_serializer(
            name='HealthCheckResponse',
            fields={
                'status': serializers.ChoiceField(choices=['ok', 'degraded']),
                'database': serializers.ChoiceField(choices=['ok', 'error']),
                'version': serializers.CharField(),
            },
        ),
        503: inline_serializer(
            name='HealthCheckDegradedResponse',
            fields={
                'status': serializers.ChoiceField(choices=['ok', 'degraded']),
                'database': serializers.ChoiceField(choices=['ok', 'error']),
                'version': serializers.CharField(),
            },
        ),
    },
    tags=['Health'],
)
@api_view(['GET'])
@authentication_classes([])   # No auth — public endpoint
@permission_classes([AllowAny])
def health_check(request):
    """
    Public health check endpoint. Used by Railway health probes.
    Returns 200 when healthy, 503 when database is unreachable.
    """
    db_ok = True
    try:
        connection.ensure_connection()
    except OperationalError:
        db_ok = False

    status_code = 200 if db_ok else 503
    return Response(
        {
            'status': 'ok' if db_ok else 'degraded',
            'database': 'ok' if db_ok else 'error',
            'version': '1.0.0',
        },
        status=status_code,
    )
