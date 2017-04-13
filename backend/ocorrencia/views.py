from api.permissions import IsOwnerOrReadOnly
from api.serializers import OcorrenciaSerializer
from models import Ocorrencia
from rest_framework import viewsets, permissions


class OcorrenciaViewSet(viewsets.ModelViewSet):
    # Viewset que lista, cria, retorna, atualiza e deleta ocorrencias
    queryset = Ocorrencia.objects.all()
    serializer_class = OcorrenciaSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


