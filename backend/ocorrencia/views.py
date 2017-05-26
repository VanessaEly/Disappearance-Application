from api.serializers import *
from models import *
from rest_framework import viewsets, status
from rest_framework.parsers import FormParser, MultiPartParser
from itertools import chain
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from disapp import settings
import os


class OcorrenciaViewSet(viewsets.ModelViewSet):
    serializer_class = OcorrenciaSerializer
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)

    def get_queryset(self):
        queryset = Ocorrencia.objects.all()
        ocorrencia = self.request.query_params.get('item_id', None)

        # se recebe item_id como parametro, filtra por id, como default retorna objects.all
        if ocorrencia is not None:
            queryset = queryset.filter(item_id=ocorrencia)
        return queryset

    def create(self, serializer):
        # serializer.save(owner=self.request.user)
        serializer.save()


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        item = self.request.query_params.get('id', None)
        auth = self.request.auth
        # se recebe item_id como parametro, filtra por id, como default retorna objects.all
        if item is not None:
            queryset = Item.objects.filter(id=item)
        else:
            # se recebe token, busca apenas itens do user que fez a requisicao
            if auth is not None:
                queryset = Item.objects.filter(owner=self.request.user)
            # busca todas as requests
            else:
                queryset = Item.objects.all()
                ocorrencia = Ocorrencia.objects.all()
                imagem = Imagem.objects.all()
                pessoa = Pessoa.objects.all()
                animal = Animal.objects.all()
                objeto = Objeto.objects.all()
                return list(chain(queryset, ocorrencia, pessoa, animal, objeto, imagem))
        if not queryset:
            return []
        ocorrencia = Ocorrencia.objects.filter(item=queryset)
        imagem = Imagem.objects.filter(id=queryset[0].id)
        if queryset[0].categoria == 1:
            details = Pessoa.objects.filter(item=queryset)
        elif queryset[0].categoria == 2:
            details = Animal.objects.filter(item=queryset)
        else:
            details = Objeto.objects.filter(item=queryset)
        return list(chain(queryset, ocorrencia, details, imagem))

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)   # datafile=self.request.data.get('datafile'

    def delete(self, request):

        item_id = self.request.query_params.get('id', None)
        item = Item.objects.get(id=item_id)
        if self.request.user == item.owner:
            # deleta imagem
            try:
                imagem = Imagem.objects.get(id=item.fileId)
                try:
                    os.remove(imagem.datafile.path)
                except OSError:
                    pass
                    # return Response("Arquivo" + imagem.datafile.path + " nao encontrado")
                Imagem.delete(imagem)

            except ObjectDoesNotExist:
                return Response("Imagem nao existe")

            # deleta ocorrencia
            try:
                ocorrencia = Ocorrencia.objects.get(item_id=item.id)
                Ocorrencia.delete(ocorrencia)
            except ObjectDoesNotExist:
                return Response("Ocorrencia nao existe")

            # deleta detalhes
            if item.categoria == 1:
                try:
                    pessoa = Pessoa.objects.get(item_id=item.id)
                    Pessoa.delete(pessoa)
                except ObjectDoesNotExist:
                    return Response("Pessoa nao existe")
            elif item.categoria == 2:
                try:
                    animal = Animal.objects.get(item_id=item.id)
                    Animal.delete(animal)
                except ObjectDoesNotExist:
                    return Response("Animal nao existe")
            else:
                try:
                    objeto = Objeto.objects.get(item_id=item.id)
                    Objeto.delete(objeto)
                except ObjectDoesNotExist:
                    return Response("Objeto nao existe")

            # deleta item
            try:
                Item.delete(item)
            except ObjectDoesNotExist:
                return Response("Item nao existe")

            return Response("Deletada com sucesso!", status=status.HTTP_200_OK)
        else:
            return Response("Apenas o criador da ocorrencia pode efetuar isto!", status=status.HTTP_401_UNAUTHORIZED)


class ImagemViewSet(viewsets.ModelViewSet):
    queryset = Imagem.objects.all()
    serializer_class = ImagemSerializer
    parser_classes = (MultiPartParser, FormParser,)

    def get_queryset(self):
        queryset = Imagem.objects.all()
        imagem = self.request.query_params.get('id', None)
        if imagem is not None:
            queryset = queryset.filter(id=imagem)
        return queryset

    def perform_create(self, serializer):
        file = self.request.data.get('datafile')
        if file is not None:
            serializer.save(datafile=file)
        else:
            serializer.save(datafile=settings.MEDIA_URL+'default.jpg')


class ObjetoViewSet(viewsets.ModelViewSet):
    queryset = Objeto.objects.all()
    serializer_class = ObjetoSerializer

    def get_queryset(self):
        queryset = Objeto.objects.all()
        objeto = self.request.query_params.get('item_id', None)
        if objeto is not None:
            queryset = queryset.filter(item_id=objeto)
        return queryset

    def perform_create(self, serializer):
        serializer.save()


class AnimalViewSet(viewsets.ModelViewSet):
    serializer_class = AnimalSerializer

    def get_queryset(self):
        queryset = Animal.objects.all()
        animal = self.request.query_params.get('item_id', None)
        if animal is not None:
            queryset = queryset.filter(item_id=animal)
        return queryset

    def perform_create(self, serializer):
        serializer.save()


class PessoaViewSet(viewsets.ModelViewSet):
    serializer_class = PessoaSerializer

    def get_queryset(self):
        queryset = Pessoa.objects.all()
        pessoa = self.request.query_params.get('item_id', None)
        if pessoa is not None:
            queryset = queryset.filter(item_id=pessoa)
        return queryset

    def perform_create(self, serializer):
        serializer.save()
