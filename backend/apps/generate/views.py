import json
import uuid
import time
from decimal import Decimal

from django.core.cache import cache
from django.db.models import F
from django.http import StreamingHttpResponse
from django.utils.decorators import method_decorator
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from pydantic import ValidationError as PydanticValidationError
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.core.flags import require_flag, is_enabled
from apps.core.ratelimit import org_key, rate_limited_response
from apps.orgs.models import Organization
from django_ratelimit.decorators import ratelimit
from .ai_client import get_ai_client
from .ai_client.exceptions import AIProviderUnavailableError
from .models import AIUsage
from .prompts import get_prompts
from .cache import get_cached_result, set_cached_result
from .serializers import (
    ProductContentOutput,
    ProductGenerationInputSerializer,
    ProductContentResponseSerializer,
)


@method_decorator(require_flag('AI_GENERATION'), name='dispatch')
@method_decorator(ratelimit(key=org_key, rate='10/m', method='POST', block=False), name='dispatch')
class GenerateProductContentView(APIView):

    @extend_schema(
        tags=['Generation'],
        request=ProductGenerationInputSerializer,
        responses={200: ProductContentResponseSerializer},
        summary='Generate AI-powered product content',
        description='Accepts product details and returns structured marketing copy in Arabic, English, or bilingual.',
    )
    def post(self, request):
        # Rate limiting check (Phase 10 — Constitution Principle IV)
        if is_enabled('RATE_LIMITING') and getattr(request, 'limited', False):
            return rate_limited_response()

        # 1. Deserialize & validate input
        serializer = ProductGenerationInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': 'Invalid input data',
                'error_ar': 'بيانات الإدخال غير صالحة',
                'code': 'VALIDATION_ERROR',
                'details': serializer.errors,
            }, status=400)

        validated = serializer.validated_data
        language = validated['language']
        tone = validated['tone']
        product_name = validated['product_name']
        category = validated['category']
        price = validated.get('price')
        target_audience = validated.get('target_audience', '')

        # 2. Check cache
        cache_inputs = {
            'product_name': product_name,
            'category': category,
            'price': str(price) if price is not None else None,
            'target_audience': target_audience,
            'tone': tone,
            'language': language,
        }
        cached = get_cached_result(request.org.pk, cache_inputs)
        if cached is not None:
            # Cache hit — record usage, increment counter, return cached result
            AIUsage.objects.create(
                org=request.org,
                model='cached',
                tokens_in=0,
                tokens_out=0,
                cost_usd=0,
                language=language,
                category=category,
                tone=tone,
                cache_hit=True,
                success=True,
            )
            Organization.objects.filter(pk=request.org.pk).update(
                generations_used_this_month=F('generations_used_this_month') + 1
            )
            session_id = uuid.uuid4()
            session_data = json.dumps({
                'org_id': request.org.pk,
                'inputs': cache_inputs,
                'expires_at': time.time() + 300,
            })
            cache.set(f'stream_session:{session_id}', session_data, timeout=300)
            return Response({
                **cached,
                'session_id': str(session_id),
                'cached': True,
            })

        # Build prompts
        system_prompt, user_prompt = get_prompts(
            language=language, tone=tone, product_name=product_name,
            category=category, price=price, target_audience=target_audience,
        )

        # 3. Call AI provider with retry on invalid JSON
        client = get_ai_client()
        ai_response = None
        content_dict = None
        total_tokens_in = 0
        total_tokens_out = 0
        total_cost = Decimal('0')
        for attempt in range(2):
            try:
                ai_response = client.generate(user_prompt, system_prompt, max_tokens=2048)
            except AIProviderUnavailableError:
                return Response({
                    'error': 'AI provider is currently unavailable',
                    'error_ar': 'مزود الذكاء الاصطناعي غير متاح حالياً',
                    'code': 'AI_PROVIDER_UNAVAILABLE',
                }, status=503)

            total_tokens_in += ai_response.tokens_in
            total_tokens_out += ai_response.tokens_out
            total_cost += ai_response.cost_usd

            # 4. Validate AI response
            try:
                raw_content = ai_response.content.strip()
                # Try to extract JSON if wrapped in markdown code block
                if raw_content.startswith('```'):
                    lines = raw_content.split('\n')
                    json_lines = []
                    in_block = False
                    for line in lines:
                        if line.startswith('```') and not in_block:
                            in_block = True
                            continue
                        elif line.startswith('```') and in_block:
                            break
                        elif in_block:
                            json_lines.append(line)
                    raw_content = '\n'.join(json_lines)

                parsed_json = json.loads(raw_content)
                validated_output = ProductContentOutput(**parsed_json)
                content_dict = validated_output.model_dump()
                break  # success
            except (json.JSONDecodeError, PydanticValidationError):
                if attempt == 1:
                    # Second failure — record cumulative cost and return 422
                    AIUsage.objects.create(
                        org=request.org,
                        model=ai_response.model,
                        tokens_in=total_tokens_in,
                        tokens_out=total_tokens_out,
                        cost_usd=total_cost,
                        language=language,
                        category=category,
                        tone=tone,
                        cache_hit=False,
                        success=False,
                    )
                    return Response({
                        'error': 'AI returned invalid content after retry',
                        'error_ar': 'أعاد الذكاء الاصطناعي محتوى غير صالح بعد إعادة المحاولة',
                        'code': 'AI_RESPONSE_INVALID',
                    }, status=422)

        # 5. Write to cache
        set_cached_result(request.org.pk, cache_inputs, content_dict)

        # 6. Create streaming session in Redis
        session_id = uuid.uuid4()
        session_data = json.dumps({
            'org_id': request.org.pk,
            'inputs': cache_inputs,
            'expires_at': time.time() + 300,
        })
        cache.set(f'stream_session:{session_id}', session_data, timeout=300)

        # 7. Record AIUsage (cumulative across retries)
        AIUsage.objects.create(
            org=request.org,
            model=ai_response.model,
            tokens_in=total_tokens_in,
            tokens_out=total_tokens_out,
            cost_usd=total_cost,
            language=language,
            category=category,
            tone=tone,
            cache_hit=False,
            success=True,
        )

        # 8. Increment counter and cost atomically
        Organization.objects.filter(pk=request.org.pk).update(
            generations_used_this_month=F('generations_used_this_month') + 1,
            monthly_cost_usd=F('monthly_cost_usd') + total_cost,
        )

        # 9. Return response
        return Response({
            **content_dict,
            'session_id': str(session_id),
            'cached': False,
        })


@method_decorator(require_flag('AI_GENERATION'), name='dispatch')
class StreamGenerateView(APIView):

    @extend_schema(
        tags=['Generation'],
        parameters=[OpenApiParameter('session_id', str, OpenApiParameter.QUERY, required=True)],
        responses={200: OpenApiTypes.STR},
        summary='Stream AI-generated tokens (SSE)',
        description='Streams tokens as server-sent events for a pending generation session.',
    )
    def get(self, request):
        # 1. Read session_id from query params
        session_id = request.query_params.get('session_id')
        if not session_id:
            return Response({
                'error': 'session_id query parameter is required',
                'error_ar': 'معرف الجلسة مطلوب',
                'code': 'VALIDATION_ERROR',
            }, status=400)

        # 2. Fetch session from Redis
        session_key = f'stream_session:{session_id}'
        session_raw = cache.get(session_key)
        if session_raw is None:
            return Response({
                'error': 'Session not found',
                'error_ar': 'الجلسة غير موجودة',
                'code': 'SESSION_NOT_FOUND',
            }, status=404)

        session = json.loads(session_raw) if isinstance(session_raw, str) else session_raw

        # Check expiry
        if time.time() > session.get('expires_at', 0):
            return Response({
                'error': 'Session has expired',
                'error_ar': 'انتهت صلاحية الجلسة',
                'code': 'SESSION_EXPIRED',
            }, status=410)

        # 3. Validate org
        if session['org_id'] != request.org.pk:
            return Response({
                'error': 'Forbidden',
                'error_ar': 'غير مصرح',
                'code': 'FORBIDDEN',
            }, status=403)

        # 4. Build prompts
        inputs = session['inputs']
        price = inputs.get('price')
        if price is not None:
            price = Decimal(price)

        system_prompt, user_prompt = get_prompts(
            language=inputs['language'], tone=inputs['tone'],
            product_name=inputs['product_name'], category=inputs['category'],
            price=price, target_audience=inputs.get('target_audience', ''),
        )

        # 5. Stream tokens
        org = request.org
        language = inputs['language']
        category = inputs['category']
        tone = inputs['tone']

        def event_stream():
            ai_response = None
            client = get_ai_client()
            gen = client.stream(user_prompt, system_prompt)
            try:
                while True:
                    token = next(gen)
                    yield f"data: {json.dumps({'token': token})}\n\n"
            except StopIteration as e:
                ai_response = e.value
            except AIProviderUnavailableError:
                yield f"data: {json.dumps({'error': 'AI provider unavailable', 'error_ar': 'مزود الذكاء الاصطناعي غير متاح'})}\n\n"
                yield "data: [DONE]\n\n"
                return
            yield "data: [DONE]\n\n"

            # 7. Record AIUsage after stream completes
            if ai_response:
                AIUsage.objects.create(
                    org=org,
                    model=ai_response.model,
                    tokens_in=ai_response.tokens_in,
                    tokens_out=ai_response.tokens_out,
                    cost_usd=ai_response.cost_usd,
                    language=language,
                    category=category,
                    tone=tone,
                    cache_hit=False,
                    success=True,
                )
                Organization.objects.filter(pk=org.pk).update(
                    generations_used_this_month=F('generations_used_this_month') + 1,
                    monthly_cost_usd=F('monthly_cost_usd') + ai_response.cost_usd,
                )

        # 6. Return StreamingHttpResponse
        response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response