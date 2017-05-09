from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from ocorrencia import views as ocorrenciaviews
from api.views.user import views as userviews

# Cria um router e registra os viewsets com ele
router = DefaultRouter()
router.register(r'ocorrencia', ocorrenciaviews.OcorrenciaViewSet, 'ocorrencia')
router.register(r'novoitem', ocorrenciaviews.ItemViewSet)
router.register(r'novoobjeto', ocorrenciaviews.ObjetoViewSet)
router.register(r'novoanimal', ocorrenciaviews.AnimalViewSet)
router.register(r'novapessoa', ocorrenciaviews.PessoaViewSet)
router.register(r'users', userviews.UserViewSet)

# Os URLs da API sao determinados automaticamente pelo router
urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
