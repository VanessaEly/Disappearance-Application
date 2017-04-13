from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

from api.permissions import IsOwnerOrReadOnly
from api.serializers import UserSerializer, OcorrenciaSerializer
from models import Ocorrencia
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework import exceptions


class UserViewSet(viewsets.ModelViewSet):
    # Viewset que detalha e lista usuarios
    # permission_classes = [
    #     permissions.AllowAny  # Or anon users can't register
    # ]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        token, created = Token.objects.get_or_create(user=serializer.instance)
        return Response({'token': token.key, 'id': serializer.instance.id}, status=status.HTTP_201_CREATED, headers=headers)


class OcorrenciaViewSet(viewsets.ModelViewSet):
    # Viewset que lista, cria, retorna, atualiza e deleta ocorrencias
    queryset = Ocorrencia.objects.all()
    serializer_class = OcorrenciaSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


