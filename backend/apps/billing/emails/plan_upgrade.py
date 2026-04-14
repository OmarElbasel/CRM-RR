"""Plan upgrade confirmation email template — Arabic-first, English secondary."""

PLAN_LABELS_AR = {
    'starter': 'المبتدئ',
    'pro': 'الاحترافي',
    'enterprise': 'المؤسسي',
    'free': 'المجاني',
}

PLAN_LABELS_EN = {
    'starter': 'Starter',
    'pro': 'Pro',
    'enterprise': 'Enterprise',
    'free': 'Free',
}


def render_plan_upgrade(org_name: str, new_plan: str) -> str:
    plan_ar = PLAN_LABELS_AR.get(new_plan, new_plan)
    plan_en = PLAN_LABELS_EN.get(new_plan, new_plan)
    return f"""
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تم ترقية خطتك</title>
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #059669, #047857); padding: 40px 32px; text-align: center; }}
    .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; }}
    .body {{ padding: 32px; }}
    .body h2 {{ color: #1f2937; font-size: 20px; margin-top: 0; }}
    .body p {{ color: #4b5563; line-height: 1.7; font-size: 15px; }}
    .badge {{ display: inline-block; background: #d1fae5; color: #065f46; padding: 6px 16px; border-radius: 20px; font-size: 18px; font-weight: 700; margin: 16px 0; }}
    .cta {{ text-align: center; margin: 32px 0; }}
    .cta a {{ background: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; }}
    .divider {{ border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }}
    .footer {{ padding: 0 32px 32px; color: #9ca3af; font-size: 13px; text-align: center; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ تم ترقية خطتك بنجاح</h1>
    </div>
    <div class="body">
      <h2>تهانينا، {org_name}!</h2>
      <p>تمت ترقية خطتك بنجاح إلى:</p>
      <div style="text-align:center;">
        <span class="badge">خطة {plan_ar}</span>
      </div>
      <p>
        يمكنك الآن الاستفادة من جميع مميزات الخطة الجديدة مباشرةً. شكراً لثقتك في رواج!
      </p>
      <div class="cta">
        <a href="https://app.rawaj.io/dashboard">الذهاب إلى لوحة التحكم</a>
      </div>
      <hr class="divider">
      <p style="color:#6b7280; font-size:13px;">
        Congratulations, {org_name}! Your plan has been successfully upgraded to <strong>{plan_en}</strong>.
        All new features are available immediately.
      </p>
    </div>
    <div class="footer">
      <p>© 2026 Rawaj · <a href="https://rawaj.io" style="color:#9ca3af;">rawaj.io</a></p>
    </div>
  </div>
</body>
</html>
"""
