from __future__ import unicode_literals

from django.db import models


class Item (models.Model):
    # owner = models.ForeignKey('auth.User', related_name='pessoas', on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True)
    categoria = models.CharField(max_length=100, default='')


class Ocorrencia (models.Model):
    # owner = models.ForeignKey('auth.User', related_name='ocorrencias', on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True)
    dataehora = models.DateTimeField(blank=True)
    titulo = models.CharField(max_length=100, default='')
    tipo = models.CharField(max_length=100, default='')
    detalhes = models.CharField(max_length=100, blank=True)
    recompensa = models.CharField(max_length=100, blank=True, default='')
    latitude = models.CharField(max_length=100, default='')
    longitude = models.CharField(max_length=100, default='')
    item = models.ForeignKey(Item)

    class Meta:
        ordering = ('titulo',)


class Objeto (models.Model):
    tipo = models.CharField(max_length=100, default='')
    cor_primaria = models.CharField(max_length=100, blank=True)
    item = models.ForeignKey(Item)


class Animal (models.Model):
    nome = models.CharField(max_length=100, default='')
    sexo = models.CharField(max_length=100, default='')
    idade = models.FloatField(blank=True)
    especie = models.CharField(max_length=100, default='')
    raca = models.CharField(max_length=100, default='')
    cor_primaria = models.CharField(max_length=100, default='')
    item = models.ForeignKey(Item)


class Pessoa (models.Model):
    nome = models.CharField(max_length=100, default='')
    sexo = models.CharField(max_length=100, default='')
    idade = models.FloatField(blank=True)
    etnia = models.CharField(max_length=100, default='')
    altura = models.CharField(max_length=100, blank=True)
    peculiaridades = models.CharField(max_length=100, blank=True)
    item = models.ForeignKey(Item)

