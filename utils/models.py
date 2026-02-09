from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings
from decimal import Decimal

class Dollar_Rate(models.Model):
    origin = models.CharField(max_length=100, unique=True, help_text="Fuente de la tasa de cambio")
    rate = models.DecimalField(max_digits=10, decimal_places=4, validators=[MinValueValidator(Decimal("0.0001"))], help_text="Tasa de cambio del dólar")
    last_updated = models.DateTimeField(auto_now=True, help_text="Fecha y hora de la última actualización de la tasa")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Fecha y hora de creación del registro")

    def __str__(self):
        return f"{self.origin} - {self.rate}"