# Generated by Django 5.1.6 on 2025-02-06 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='order',
            field=models.IntegerField(default=0),
        ),
    ]
