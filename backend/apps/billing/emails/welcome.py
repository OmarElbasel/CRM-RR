"""Welcome email template — Arabic-first, English secondary."""


def render_welcome(org_name: str) -> str:
    return f"""
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مرحباً بك في رواج</title>
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 32px; text-align: center; }}
    .header h1 {{ color: #ffffff; margin: 0; font-size: 28px; }}
    .body {{ padding: 32px; }}
    .body h2 {{ color: #1f2937; font-size: 22px; margin-top: 0; }}
    .body p {{ color: #4b5563; line-height: 1.7; font-size: 15px; }}
    .cta {{ text-align: center; margin: 32px 0; }}
    .cta a {{ background: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; }}
    .divider {{ border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }}
    .footer {{ padding: 0 32px 32px; color: #9ca3af; font-size: 13px; text-align: center; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>رواج</h1>
    </div>
    <div class="body">
      <h2>مرحباً بك في رواج، {org_name}!</h2>
      <p>
        يسعدنا انضمامك إلى منصة رواج — الحل الذكي لتحويل رسائل إنستغرام وواتساب إلى مبيعات حقيقية.
      </p>
      <p>
        يمكنك الآن ربط قنواتك الاجتماعية، وإدارة رسائل عملائك، وتوليد محتوى تسويقي باستخدام الذكاء الاصطناعي — كل ذلك من مكان واحد.
      </p>
      <div class="cta">
        <a href="https://app.rawaj.io/dashboard">ابدأ الآن</a>
      </div>
      <hr class="divider">
      <p style="color:#6b7280; font-size:13px;">
        Welcome to Rawaj, {org_name}! Your account is ready. Connect your social channels and start converting messages into sales.
      </p>
    </div>
    <div class="footer">
      <p>© 2026 Rawaj · <a href="https://rawaj.io" style="color:#9ca3af;">rawaj.io</a></p>
    </div>
  </div>
</body>
</html>
"""
