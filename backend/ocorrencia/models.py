from __future__ import unicode_literals

from django.db import models


class Imagem(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    datafile = models.ImageField(upload_to="imagens/", blank=False, null=False, default='settings.MEDIA_ROOT/default.jpg')


class Item (models.Model):
    owner = models.ForeignKey('auth.User', related_name='itens', on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True)
    categoria = models.IntegerField(default='')
    fileId = models.IntegerField(default='')
    pin = models.CharField(max_length=100, default='')
    datafile = models.CharField(max_length=100, blank=True)


class Ocorrencia (models.Model):
    data_criacao = models.DateTimeField(auto_now_add=True)
    dataehora = models.DateTimeField(blank=True)
    titulo = models.CharField(max_length=100, default='')
    tipo = models.CharField(max_length=20, default='')
    detalhes = models.CharField(max_length=250, blank=True)
    recompensa = models.DecimalField(blank=True, default=0, decimal_places=2, max_digits=10)
    latitude = models.CharField(max_length=50, default='')
    longitude = models.CharField(max_length=50, default='')
    endereco = models.CharField(max_length=300, default='')
    cidade = models.CharField(max_length=100, blank=True)
    estado = models.CharField(max_length=20, blank=True)
    pais = models.CharField(max_length=100, blank=True)
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
    idade = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)
    especie = models.CharField(max_length=30, default='')
    raca = models.CharField(max_length=30, default='')
    cor_primaria = models.CharField(max_length=30, default='')
    item = models.ForeignKey(Item)


class Pessoa (models.Model):
    nome = models.CharField(max_length=20, default='')
    sexo = models.CharField(max_length=20, default='')
    idade = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)
    etnia = models.CharField(max_length=30, default='')
    altura = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)
    peculiaridades = models.CharField(max_length=200, blank=True)
    item = models.ForeignKey(Item)

