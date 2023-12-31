# Generated by Django 3.1.8 on 2023-08-27 06:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('netgraph', '0002_auto_20230827_1345'),
    ]

    operations = [
        migrations.AlterField(
            model_name='node',
            name='hostname',
            field=models.CharField(blank=True, default=None, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='node',
            name='mac',
            field=models.CharField(blank=True, default=None, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='node',
            name='name',
            field=models.CharField(blank=True, default=None, max_length=100),
        ),
        migrations.AlterField(
            model_name='node',
            name='ro_community',
            field=models.CharField(blank=True, default=None, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='node',
            name='rw_community',
            field=models.CharField(blank=True, default=None, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='node',
            name='uplink',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
