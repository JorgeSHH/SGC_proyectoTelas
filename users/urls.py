from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleswomanViewSet #AdministratorViewSet

router = DefaultRouter()
router.register(r'saleswoman', SaleswomanViewSet, basename='vendedora')
#router.register(r'administrators', AdministratorViewSet, basename='administrador')



urlpatterns = [
    path('', include(router.urls)),
]
    
