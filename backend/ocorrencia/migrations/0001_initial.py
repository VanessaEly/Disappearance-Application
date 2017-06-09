# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-09 01:11
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
            name='Objeto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(default='', max_length=50)),
                ('cor_primaria', models.CharField(max_length=30, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Ocorrencia',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_criacao', models.DateTimeField(auto_now_add=True)),
                ('categoria', models.IntegerField(default=0)),
                ('fileId', models.IntegerField(default=0)),
                ('oldfileId', models.IntegerField(blank=True, null=True)),
                ('pin', models.CharField(default='', max_length=100)),
                ('datafile', models.CharField(max_length=250, null=True)),
                ('telefone', models.CharField(max_length=16, null=True, validators=[django.core.validators.RegexValidator(message="Telefone deve possuir o formato '+999999999' com menos de 15 digitos.", regex='^\\+?1?\\d{9,15}$')])),
                ('bo', models.BooleanField(default='False')),
                ('solucionado', models.BooleanField(default='False')),
                ('dataSolucao', models.DateTimeField(null=True)),
                ('dataehora', models.DateTimeField(null=True)),
                ('titulo', models.CharField(default='', max_length=100)),
                ('tipo', models.CharField(default='', max_length=20)),
                ('detalhes', models.CharField(max_length=500, null=True)),
                ('recompensa', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10)),
                ('latitude', models.FloatField(default=0)),
                ('longitude', models.FloatField(default=0)),
                ('endereco', models.CharField(default='', max_length=400)),
                ('cidade', models.CharField(max_length=100, null=True)),
                ('estado', models.CharField(max_length=100, null=True)),
                ('pais', models.CharField(max_length=100, null=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itens', to=settings.AUTH_USER_MODEL)),
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
                ('ocorrencia', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ocorrencia.Ocorrencia')),
            ],
        ),
        migrations.AddField(
            model_name='objeto',
            name='ocorrencia',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ocorrencia.Ocorrencia'),
        ),
        migrations.AddField(
            model_name='animal',
            name='ocorrencia',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ocorrencia.Ocorrencia'),
        ),
    ]
