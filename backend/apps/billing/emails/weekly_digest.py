"""Weekly activity digest email template — Arabic-first, English secondary."""


def render_weekly_digest(org_name: str, stats: dict) -> str:
    messages = stats.get('messages', 0)
    ai_generations = stats.get('ai_generations', 0)
    ai_cost = stats.get('ai_cost_usd', 0.0)
    return f"""
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ملخص أسبوعي</title>
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 32px; text-align: center; }}
    .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; }}
    .body {{ padding: 32px; }}
    .body h2 {{ color: #1f2937; font-size: 20px; margin-top: 0; }}
    .body p {{ color: #4b5563; line-height: 1.7; font-size: 15px; }}
    .stats-grid {{ display: flex; gap: 12px; margin: 20px 0; flex-wrap: wrap; }}
    .stat-card {{ flex: 1; min-width: 140px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; text-align: center; }}
    .stat-card .value {{ font-size: 28px; font-weight: 700; color: #4f46e5; }}
    .stat-card .label {{ font-size: 12px; color: #6b7280; margin-top: 4px; }}
    .cta {{ text-align: center; margin: 32px 0; }}
    .cta a {{ background: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; }}
    .divider {{ border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }}
    .footer {{ padding: 0 32px 32px; color: #9ca3af; font-size: 13px; text-align: center; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 ملخصك الأسبوعي</h1>
    </div>
    <div class="body">
      <h2>أداء الأسبوع الماضي، {org_name}</h2>
      <p>إليك ملخص نشاطك خلال الأسبوع الماضي:</p>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value">{messages:,}</div>
          <div class="label">رسائل واردة</div>
        </div>
        <div class="stat-card">
          <div class="value">{ai_generations:,}</div>
          <div class="label">توليدات ذكاء اصطناعي</div>
        </div>
        <div class="stat-card">
          <div class="value">${ai_cost:.2f}</div>
          <div class="label">تكلفة الذكاء الاصطناعي</div>
        </div>
      </div>
      <div class="cta">
        <a href="https://app.rawaj.io/analytics">عرض التحليلات الكاملة</a>
      </div>
      <hr class="divider">
      <p style="color:#6b7280; font-size:13px;">
        Weekly summary for {org_name}:
        {messages:,} messages received · {ai_generations:,} AI generations · ${ai_cost:.2f} AI cost.
      </p>
    </div>
    <div class="footer">
      <p>© 2026 Rawaj · <a href="https://rawaj.io" style="color:#9ca3af;">rawaj.io</a></p>
    </div>
  </div>
</body>
</html>
"""
