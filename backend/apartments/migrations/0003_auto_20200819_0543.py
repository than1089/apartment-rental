# Generated by Django 3.1 on 2020-08-19 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartments', '0002_apartment_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apartment',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='apartments'),
        ),
    ]
