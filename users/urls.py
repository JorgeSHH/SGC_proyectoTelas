from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleswomanViewSet, AdministratorViewSet, LoginConCookiesView, LogoutView, RefreshTokenCookiesView
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView

router = DefaultRouter()
router.register(r'saleswoman', SaleswomanViewSet, basename='vendedora')
router.register(r'administrators', AdministratorViewSet, basename='administrador')

urlpatterns = [
    path('', include(router.urls)),
    # rutas para autenticacion
    path('login/', LoginConCookiesView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', RefreshTokenCookiesView.as_view() , name = 'token_refresh'),
    # path('login/', csrf_exempt(TokenObtainPairView.as_view(serializer_class=MiTokenObtainPairSerialeizer)), name='obtener_token'), #csrf_exempt quita el problema de los CSRF
    # path('login/refrescar/', csrf_exempt(TokenRefreshView.as_view()), name='refrescar_token'),
]
    
