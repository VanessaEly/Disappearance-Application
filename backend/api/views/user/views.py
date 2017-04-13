from rest_framework.authtoken.models import Token
from rest_framework import viewsets
from api.serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class UserViewSet(viewsets.ModelViewSet):
    # Viewset que detalha e lista usuarios
    # permission_classes = [
    #     permissions.AllowAny  # Or anon users can't register
    # ]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            token, created = Token.objects.get_or_create(user=serializer.instance)
            response = {'token': token.key, 'data': serializer.data}
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
