from api.serializers import *
from models import *
from rest_framework import viewsets
from rest_framework.parsers import FormParser,MultiPartParser


class OcorrenciaViewSet(viewsets.ModelViewSet):
    serializer_class = OcorrenciaSerializer
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)

    def get_queryset(self):
        queryset = Ocorrencia.objects.all()
        ocorrencia = self.request.query_params.get('id', None)
        if ocorrencia is not None:
            queryset = queryset.filter(id=ocorrencia)
        return queryset

    def create(self, serializer):
        # serializer.save(owner=self.request.user)
        serializer.save()


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ObjetoViewSet(viewsets.ModelViewSet):
    queryset = Objeto.objects.all()
    serializer_class = ObjetoSerializer

    def perform_create(self, serializer):
        serializer.save()


class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

    def perform_create(self, serializer):
        serializer.save()


class PessoaViewSet(viewsets.ModelViewSet):
    queryset = Pessoa.objects.all()
    serializer_class = PessoaSerializer

    def perform_create(self, serializer):
        serializer.save()
