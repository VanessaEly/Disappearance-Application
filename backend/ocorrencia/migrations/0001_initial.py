# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-22 05:48
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Animal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(default='', max_length=100)),
                ('sexo', models.CharField(default='', max_length=20)),
                ('idade', models.FloatField(blank=True)),
                ('especie', models.CharField(default='', max_length=30)),
                ('raca', models.CharField(default='', max_length=30)),
                ('cor_primaria', models.CharField(default='', max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Imagem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('datafile', models.FileField(upload_to='media/')),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_criacao', models.DateTimeField(auto_now_add=True)),
                ('categoria', models.IntegerField(default='')),
                ('fileId', models.IntegerField(default='')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itens', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Objeto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(default='', max_length=50)),
                ('cor_primaria', models.CharField(blank=True, max_length=30)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ocorrencia.Item')),
            ],
        ),
        migrations.CreateModel(
            name='Ocorrencia',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_criacao', models.DateTimeField(auto_now_add=True)),
                ('dataehora', models.DateTimeField(blank=True)),
                ('titulo', models.CharField(default='', max_length=100)),
                ('tipo', models.CharField(default='', max_length=20)),
                ('detalhes', models.CharField(blank=True, max_length=250)),
                ('recompensa', models.FloatField(blank=True, default=0)),
                ('latitude', models.CharField(default='', max_length=50)),
                ('longitude', models.CharField(default='', max_length=50)),
                ('endereco', models.CharField(default='', max_length=300)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ocorrencia.Item')),
            ],
            options={
                'ordering': ('titulo',),
            },
        ),
        migrations.CreateModel(
            name='Pessoa',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(default='', max_length=20)),
                ('sexo', models.CharField(default='', max_length=20)),
                ('idade', models.FloatField(blank=True)),
                ('etnia', models.CharField(default='', max_length=30)),
                ('altura', models.FloatField(blank=True)),
                ('peculiaridades', models.CharField(blank=True, max_length=200)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ocorrencia.Item')),
            ],
        ),
        migrations.AddField(
            model_name='animal',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ocorrencia.Item'),
        ),
    ]
