# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-31 04:31
from __future__ import unicode_literals

from django.conf import settings
import django.core.validators
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
                ('idade', models.IntegerField(blank=True, null=True)),
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
                ('datafile', models.ImageField(default='settings.MEDIA_ROOT/default.jpg', upload_to='imagens/')),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_criacao', models.DateTimeField(auto_now_add=True)),
                ('categoria', models.IntegerField(default=0)),
                ('fileId', models.IntegerField(default=0)),
                ('oldfileId', models.IntegerField(blank=True, null=True)),
                ('pin', models.CharField(default='', max_length=100)),
                ('datafile', models.CharField(blank=True, max_length=250)),
                ('telefone', models.CharField(blank=True, max_length=16, validators=[django.core.validators.RegexValidator(message="Telefone deve possuir o formato '+999999999' com menos de 15 digitos.", regex='^\\+?1?\\d{9,15}$')])),
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
                ('detalhes', models.CharField(blank=True, max_length=500)),
                ('recompensa', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10)),
                ('latitude', models.FloatField(default=0)),
                ('longitude', models.FloatField(default=0)),
                ('endereco', models.CharField(default='', max_length=300)),
                ('cidade', models.CharField(blank=True, max_length=100)),
                ('estado', models.CharField(blank=True, max_length=20)),
                ('pais', models.CharField(blank=True, max_length=100)),
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
                ('idade', models.IntegerField(blank=True, null=True)),
                ('etnia', models.CharField(default='', max_length=30)),
                ('altura', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('peculiaridades', models.CharField(blank=True, max_length=300)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ocorrencia.Item')),
            ],
        ),
        migrations.AddField(
            model_name='animal',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ocorrencia.Item'),
        ),
    ]
