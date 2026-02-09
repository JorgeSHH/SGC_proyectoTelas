from django.urls import path, include
from .views import UploadPDFView
from rest_framework.routers import DefaultRouter
from .views import DollarRateViewSet


# Creamos el router
router = DefaultRouter()

# Registramos el endpoint para las tasas de dólar
router.register(r'dollar', DollarRateViewSet, basename='dollar')

urlpatterns = [
    path('upload-pdf/', UploadPDFView.as_view(), name='upload-pdf'),
    path('', include(router.urls)),
]