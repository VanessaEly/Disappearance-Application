from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
#
# class ObtainExpiringAuthToken(ObtainAuthToken):
#     def post(self, request):
#         serializer = self.serializer_class(data=request.DATA)
#         if serializer.is_valid():
#             token, created =  Token.objects.get_or_create(user=serializer.object['user'])
#
#             if not created:
#                 # update the created time of the token to keep it valid
#                 token.created = datetime.datetime.utcnow().replace(tzinfo=utc)
#                 token.save()
#
#             return Response({'token': token.key})
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)