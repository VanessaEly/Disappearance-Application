from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions

from api.permissions import IsOwnerOrReadOnly
from api.serializers import UserSerializer, GroupSerializer, OcorrenciaSerializer
from models import Ocorrencia


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    # Viewset que detalha e lista usuarios
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    # Viewset que detalha e lista grupos
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class OcorrenciaViewSet(viewsets.ModelViewSet):
    # Viewset que lista, cria, retorna, atualiza e deleta ocorrencias
    queryset = Ocorrencia.objects.all()
    serializer_class = OcorrenciaSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


