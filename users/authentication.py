from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        raw_token = None

        # obtener el token del Header de forma normal  esto es mas que todo para las pruebas que estaba haciendo en el thunder
        if header is not None:
            raw_token = self.get_raw_token(header)

        #intentar obtenerlo de la Cookie
        if raw_token is None:
            raw_token = request.COOKIES.get('access_token')

        # retornar None (DRF dirá "No provisto")
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except Exception:
            return None