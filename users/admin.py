from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Saleswoman, Administrator

# Registramos el User personalizado
admin.site.register(User, UserAdmin)
admin.site.register(Saleswoman)
admin.site.register(Administrator)