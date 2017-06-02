from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from ocorrencia import views as ocorrenciaviews
from api.views.user import views as userviews
from rest_framework.authtoken import views
from django.conf import settings
from django.conf.urls.static import static

# Cria um router e registra os viewsets com ele
router = DefaultRouter()
router.register(r'ocorrencia', ocorrenciaviews.OcorrenciaViewSet, 'ocorrencia')
router.register(r'item', ocorrenciaviews.ItemViewSet, 'item')
router.register(r'objeto', ocorrenciaviews.ObjetoViewSet, 'objeto')
router.register(r'animal', ocorrenciaviews.AnimalViewSet, 'animal')
router.register(r'pessoa', ocorrenciaviews.PessoaViewSet, 'pessoa')
router.register(r'imagem', ocorrenciaviews.ImagemViewSet, 'imagem')
router.register(r'contato', ocorrenciaviews.ContatoViewSet, 'contato')
router.register(r'solucionado', ocorrenciaviews.SolucionadoViewSet, 'encontrado')
router.register(r'users', userviews.UserViewSet)

# Os URLs da API sao determinados automaticamente pelo router
urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api-token-auth/', views.obtain_auth_token)
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)