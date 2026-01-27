from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FabricScrapViewSet, FabricTypeViewSet, ServeQRView, InventarioDashboardViewSet

# Creamos el router
router = DefaultRouter()


# Registramos los dos endpoints basados en el análisis de tus colegas
router.register(r'types', FabricTypeViewSet, basename='material-type')
router.register(r'scraps', FabricScrapViewSet, basename='fabric-scrap')
router.register(r'dashboard', InventarioDashboardViewSet, basename='inventory-dashboar' )


urlpatterns = [
    path('', include(router.urls)),
    path('qrs/<str:tipo>/<int:pk>/', ServeQRView.as_view(), name='serve_qr'),
]