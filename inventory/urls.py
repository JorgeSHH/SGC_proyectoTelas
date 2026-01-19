from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FabricScrapViewSet, FabricTypeViewSet

# Creamos el router
router = DefaultRouter()


# Registramos los dos endpoints basados en el análisis de tus colegas
router.register(r'types', FabricTypeViewSet, basename='material-type')
router.register(r'scraps', FabricScrapViewSet, basename='fabric-scrap')


urlpatterns = [
    path('', include(router.urls)),
]