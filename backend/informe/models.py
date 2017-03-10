from __future__ import unicode_literals

from django.db import models


class Informe (models.Model):
    owner = models.ForeignKey('auth.User', related_name='informes', on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True)
    titulo = models.CharField(max_length=100, blank=True, default='')
    descricao = models.CharField(max_length=400, blank=True, default='')
    coordenadas = models.CharField(max_length=30, blank=True, default='')

    class Meta:
        ordering = ('titulo',)