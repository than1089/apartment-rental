# Generated by Django 3.1 on 2020-08-18 03:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='apartment',
            name='image',
            field=models.ImageField(null=True, upload_to='apartments'),
        ),
    ]