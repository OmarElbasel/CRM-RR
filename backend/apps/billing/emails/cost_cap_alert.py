"""Cost cap alert email template — Arabic-first, English secondary."""
from decimal import Decimal


def render_cost_cap_alert(org_name: str, cap_usd: Decimal, spent_usd: Decimal) -> str:
    cap_str = f"${float(cap_usd):.2f}"
    spent_str = f"${float(spent_usd):.2f}"
    return f"""
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تنبيه: تجاوز حد التكلفة</title>
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 40px 32px; text-align: center; }}
    .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; }}
    .body {{ padding: 32px; }}
    .body h2 {{ color: #1f2937; font-size: 20px; margin-top: 0; }}
    .body p {{ color: #4b5563; line-height: 1.7; font-size: 15px; }}
    .stats {{ background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }}
    .stats p {{ margin: 4px 0; color: #991b1b; font-size: 14px; }}
    .cta {{ text-align: center; margin: 32px 0; }}
    .cta a {{ background: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; }}
    .divider {{ border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }}
    .footer {{ padding: 0 32px 32px; color: #9ca3af; font-size: 13px; text-align: center; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ تنبيه: تجاوز حد تكلفة الذكاء الاصطناعي</h1>
    </div>
    <div class="body">
      <h2>منظمتك وصلت إلى حد الإنفاق الشهري، {org_name}</h2>
      <p>
        تم تعليق ميزات الذكاء الاصطناعي مؤقتاً حتى بداية الشهر القادم للحفاظ على حدود الإنفاق المحددة.
      </p>
      <div class="stats">
        <p><strong>الحد الشهري:</strong> {cap_str}</p>
        <p><strong>الإنفاق الحالي:</strong> {spent_str}</p>
      </div>
      <p>
        يمكنك ترقية خطتك للحصول على حد إنفاق أعلى، أو انتظار بداية الشهر القادم لاستئناف الوصول تلقائياً.
      </p>
      <div class="cta">
        <a href="https://app.rawaj.io/dashboard/upgrade">ترقية الخطة</a>
      </div>
      <hr class="divider">
      <p style="color:#6b7280; font-size:13px;">
        Your organization ({org_name}) has reached its monthly AI cost cap ({cap_str}).
        AI features are suspended until the next billing month resets.
        Spent: {spent_str}. Upgrade your plan for a higher limit.
      </p>
    </div>
    <div class="footer">
      <p>© 2026 Rawaj · <a href="https://rawaj.io" style="color:#9ca3af;">rawaj.io</a></p>
    </div>
  </div>
</body>
</html>
"""
