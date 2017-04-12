from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

from api.permissions import IsOwnerOrReadOnly
from api.serializers import UserSerializer, OcorrenciaSerializer
from models import Ocorrencia


class UserViewSet(viewsets.ModelViewSet):
    # Viewset que detalha e lista usuarios
    queryset = User.objects.all()
    serializer_class = UserSerializer


class OcorrenciaViewSet(viewsets.ModelViewSet):
    # Viewset que lista, cria, retorna, atualiza e deleta ocorrencias
    queryset = Ocorrencia.objects.all()
    serializer_class = OcorrenciaSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


