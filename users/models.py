from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):
    class Rol(models.TextChoices):
        ADMIN = "ADMIN", "administrador"
        VENDEDORA = "VENDEDORA", "vendedora"
    role = models.CharField(max_length=25, choices=Rol.choices, default="VENDEDORA")


class Saleswoman(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vendedora_info')
    phone = models.CharField(max_length=16)
    created_at = models.DateTimeField(auto_now_add=True)
    registered_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='vendedora_registrada')


class Administrator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_info')
    created_at = models.DateTimeField(auto_now_add=True)

