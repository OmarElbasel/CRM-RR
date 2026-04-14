from django.db import migrations


def seed_templates(apps, schema_editor):
    SeasonalTemplate = apps.get_model("content", "SeasonalTemplate")
    SeasonalTemplate.objects.bulk_create(
        [
            SeasonalTemplate(
                name="Ramadan",
                occasion="RAMADAN",
                sort_order=1,
                body_ar="رمضان كريم! استغل هالوقت المبارك وقدّم لعمّائك أفضل العروض. خصومات حصرية على منتجاتنا المختارة بمناسبة الشهر الفضيل. لا تفوّت الفرصة!",
                body_en="Ramadan Kareem! Take advantage of this blessed month with exclusive offers for your customers. Special discounts on our selected products for the holy month. Don't miss out!",
            ),
            SeasonalTemplate(
                name="Eid Al Fitr",
                occasion="EID_AL_FITR",
                sort_order=2,
                body_ar="عيدكم مبارك! كل عام وأنتم بخير. نحتفل معكم بعيد الفطر بعروض خاصة وهدايا لكل عملائنا الكرام. تسوّق الآن واستمتع بالاحتفال!",
                body_en="Eid Mubarak! Wishing you joy and happiness. Celebrate Eid Al Fitr with special offers and gifts for all our valued customers. Shop now and enjoy the celebration!",
            ),
            SeasonalTemplate(
                name="Eid Al Adha",
                occasion="EID_AL_ADHA",
                sort_order=3,
                body_ar="عيد أضحى مبارك! بمناسبة العيد، نقدّم لكم عروض استثنائية على تشكيلة واسعة من المنتجات. كل عام وأنتم بخير وصحة وعافية!",
                body_en="Eid Al Adha Mubarak! On this special occasion, we bring you exceptional deals on a wide range of products. Wishing you and your family a blessed Eid!",
            ),
            SeasonalTemplate(
                name="Qatar National Day",
                occasion="QATAR_NATIONAL_DAY",
                sort_order=4,
                body_ar="كل عام وقطر بخير! نحتفل باليوم الوطني القطري بعروض وطنية مميزة. خصومات حصرية احتفالاً بهذه المناسبة الغالية. دام عزّك يا قطر!",
                body_en="Happy Qatar National Day! Celebrate with special national offers. Exclusive discounts in honor of this precious occasion. Long live Qatar!",
            ),
            SeasonalTemplate(
                name="Saudi National Day",
                occasion="SAUDI_NATIONAL_DAY",
                sort_order=5,
                body_ar="دام عزّك يا وطن! نحتفل باليوم الوطني السعودي بعروض وطنية مميزة. خصومات تصل إلى 50% على منتجاتنا المختارة. كل عام والمملكة بخير!",
                body_en="Long live our homeland! Celebrate Saudi National Day with special national offers. Up to 50% off on selected products. Happy Saudi National Day!",
            ),
            SeasonalTemplate(
                name="White Friday",
                occasion="WHITE_FRIDAY",
                sort_order=6,
                body_ar="الوايت فرايد وصل! عروض لا تُقاوم على جميع منتجاتنا. خصومات تصل إلى 70% لفترة محدودة. تسوّق قبل ما تخلص الكميات!",
                body_en="White Friday is here! Unbeatable deals on all our products. Up to 70% off for a limited time. Shop before stock runs out!",
            ),
            SeasonalTemplate(
                name="UAE National Day",
                occasion="UAE_NATIONAL_DAY",
                sort_order=7,
                body_ar="روح الاتحاد! نحتفل باليوم الوطني الإماراتي بعروض مميزة. كل عام والإمارات بخير وتقدّم. عروض حصرية بهذه المناسبة السعيدة!",
                body_en="Spirit of the Union! Celebrate UAE National Day with special offers. Wishing the UAE continued prosperity. Exclusive deals for this happy occasion!",
            ),
        ]
    )


def remove_templates(apps, schema_editor):
    SeasonalTemplate = apps.get_model("content", "SeasonalTemplate")
    SeasonalTemplate.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_templates, remove_templates),
    ]
