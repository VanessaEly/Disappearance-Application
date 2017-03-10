from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    # Permissao personalizada para permitir que apenas os proprietarios de um objeto para edita-lo
    def has_object_permission(self, request, view, obj):
        # Permissoes de leitura sao permitidas para qualquer requisicao
        # sempre permitir requisicoes GET, HEAD ou OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True

        # As permissoes de gravacao so sao permitidas ao proprietario do objeto
        return obj.owner == request.user
