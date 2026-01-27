from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings
from decimal import Decimal
# Create your models here.

class Fabric_Type(models.Model):

    Fabric_Type_id = models.AutoField(unique=True, primary_key=True)

    name = models.CharField(max_length=150, unique=True)
    material_type = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    price_unit = models.DecimalField(max_digits=5, decimal_places=2, default=0.0 ,validators=[MinValueValidator(0.01)], help_text="Precio por metro")
    qr = models.CharField(max_length=250, blank=True, null=True, help_text="Código QR asociado al tipo de tela")
    last_update_at = models.DateTimeField(auto_now=True, help_text="Se actualiza cuando hay una modificación")
    registered_at = models.DateTimeField(auto_now_add=True, help_text="Se actualiza cuando se agrega un nuevo registro")

    def __str__(self):
        return self.name    

class Fabric_Scrap(models.Model):

    fabric_scrap_id = models.AutoField(unique=True, primary_key=True)
    fabric_type = models.ForeignKey('Fabric_Type', on_delete=models.PROTECT, related_name="scraps_type")
    length_meters = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(Decimal("0.15"))])
    width_meters = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(Decimal("0.15"))])
    description = models.TextField(blank=True, help_text="Descripción opcional del retazo")
    active = models.BooleanField(default=True, help_text="Indica si el retazo está disponible")

    qr = models.CharField(max_length=250, blank=True, null=True, help_text="Código QR asociado al retazo")

    created_by_role = models.CharField(max_length=50, editable=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,   # <--- Permite que registros viejos no tengan autor
        blank=True,
        related_name="created_scraps"
    )

    historial_price = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, validators=[MinValueValidator(0.01)], help_text="Precio histórico al momento de la creación del retazo")
    sale_date = models.DateTimeField(null=True, blank=True, help_text="Fecha en que se vendió el retazo")
    last_update_at = models.DateTimeField(auto_now=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Retazo {self.fabric_scrap_id} - {self.length_meters}m x {self.width_meters}m"
