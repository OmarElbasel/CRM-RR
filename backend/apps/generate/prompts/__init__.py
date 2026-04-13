from .arabic import SYSTEM_PROMPTS as AR_SYSTEM_PROMPTS, USER_PROMPT_TEMPLATE as AR_USER_TEMPLATE
from .english import SYSTEM_PROMPTS as EN_SYSTEM_PROMPTS, USER_PROMPT_TEMPLATE as EN_USER_TEMPLATE


def get_prompts(language: str, tone: str, product_name: str, category: str,
                price=None, target_audience: str = '') -> tuple[str, str]:
    """
    Return (system_prompt, user_prompt) for the given language and tone.
    For 'bilingual', return Arabic prompts with a bilingual instruction appended.
    """
    if language == 'ar':
        system = AR_SYSTEM_PROMPTS[tone]
        user = AR_USER_TEMPLATE.format(
            product_name=product_name, category=category,
            price=price if price is not None else 'غير محدد',
            target_audience=target_audience or 'غير محدد',
        )
    elif language == 'en':
        system = EN_SYSTEM_PROMPTS[tone]
        user = EN_USER_TEMPLATE.format(
            product_name=product_name, category=category,
            price=price if price is not None else 'N/A',
            target_audience=target_audience or 'General audience',
        )
    elif language == 'bilingual':
        system = AR_SYSTEM_PROMPTS[tone] + (
            '\n\nIMPORTANT: For each field, provide BOTH Arabic (Gulf dialect) and English, '
            'separated by a newline. Arabic first, then English.'
        )
        user = AR_USER_TEMPLATE.format(
            product_name=product_name, category=category,
            price=price if price is not None else 'غير محدد',
            target_audience=target_audience or 'غير محدد',
        )
    else:
        raise ValueError(f"Unsupported language: {language}")

    return system, user