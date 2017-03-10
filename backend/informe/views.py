from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions

from api.permissions import IsOwnerOrReadOnly
from api.serializers import UserSerializer, GroupSerializer, InformeSerializer
from models import Informe


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    # Viewset que detalha e lista usuarios
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    # Viewset que detalha e lista grupos
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class InformeViewSet(viewsets.ModelViewSet):
    # Viewset que lista, cria, retorna, atualiza e deleta informes
    queryset = Informe.objects.all()
    serializer_class = InformeSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


