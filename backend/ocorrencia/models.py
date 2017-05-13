from __future__ import unicode_literals

from django.db import models


class Item (models.Model):
    # owner = models.ForeignKey('auth.User', related_name='pessoas', on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True)
    categoria = models.IntegerField(default='')


class Ocorrencia (models.Model):
    # owner = models.ForeignKey('auth.User', related_name='ocorrencias', on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True)
    dataehora = models.DateTimeField(blank=True)
    titulo = models.CharField(max_length=100, default='')
    tipo = models.CharField(max_length=20, default='')
    detalhes = models.CharField(max_length=250, blank=True)
    recompensa = models.FloatField(blank=True, default=0)
    latitude = models.CharField(max_length=50, default='')
    longitude = models.CharField(max_length=50, default='')
    endereco = models.CharField(max_length=300, default='')
    item = models.ForeignKey(Item)

    class Meta:
        ordering = ('titulo',)


class Objeto (models.Model):
    tipo = models.CharField(max_length=50, default='')
    cor_primaria = models.CharField(max_length=30, blank=True)
    item = models.ForeignKey(Item)


class Animal (models.Model):
    nome = models.CharField(max_length=100, default='')
    sexo = models.CharField(max_length=20, default='')
    idade = models.FloatField(blank=True)
    especie = models.CharField(max_length=30, default='')
    raca = models.CharField(max_length=30, default='')
    cor_primaria = models.CharField(max_length=30, default='')
    item = models.ForeignKey(Item)


class Pessoa (models.Model):
    nome = models.CharField(max_length=20, default='')
    sexo = models.CharField(max_length=20, default='')
    idade = models.FloatField(blank=True)
    etnia = models.CharField(max_length=30, default='')
    altura = models.FloatField(blank=True)
    peculiaridades = models.CharField(max_length=200, blank=True)
    item = models.ForeignKey(Item)

