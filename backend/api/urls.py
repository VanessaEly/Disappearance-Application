from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from ocorrencia import views

# Cria um router e registra os viewsets com ele
router = DefaultRouter()
router.register(r'novaocorrencia', views.OcorrenciaViewSet)
router.register(r'users', views.UserViewSet)

# Os URLs da API sao determinados automaticamente pelo router
urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
