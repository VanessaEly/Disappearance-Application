from api.serializers import *
from models import *
from rest_framework import viewsets
from rest_framework.parsers import FormParser,MultiPartParser
from itertools import chain


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

        # se recebe item_id como parametro, filtra por id, como default retorna objects.all
        if item is not None:
            queryset = Item.objects.filter(id=item)
            ocorrencia = Ocorrencia.objects.filter(item=queryset)
            imagem = Imagem.objects.filter(id=queryset[0].id)
            if queryset[0].categoria == 1:
                details = Pessoa.objects.filter(item=queryset)
            elif queryset[0].categoria == 2:
                details = Animal.objects.filter(item=queryset)
            else:
                details = Objeto.objects.filter(item=queryset)
            return list(chain(queryset, ocorrencia, details, imagem))
        else:
            queryset = Item.objects.all()
            ocorrencia = Ocorrencia.objects.all()
            imagem = Imagem.objects.all()
            pessoa = Pessoa.objects.all()
            animal = Animal.objects.all()
            objeto = Objeto.objects.all()
            return list(chain(queryset, ocorrencia, pessoa, animal, objeto, imagem))

    # def get_queryset(self):
    #     queryset = Item.objects.all()
    #     print queryset
    #     ocorrencia = Ocorrencia.objects.filter(item=queryset)
    #     print ocorrencia
    #     return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)   # datafile=self.request.data.get('datafile'


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
        serializer.save(datafile=self.request.data.get('datafile'))


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
