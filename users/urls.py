from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleswomanViewset

router = DefaultRouter()
router.register(r'vendedoras', SaleswomanViewset, basename='vendedoras')


urlpatterns = [
    path('', include(router.urls)),
]
    
