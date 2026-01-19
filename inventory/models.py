from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings
# Create your models here.

class Fabric_Type(models.Model):

    Fabric_Type_id = models.AutoField(unique=True, primary_key=True)

    name = models.CharField(max_length=150, unique=True)
    material_type = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    price_unit = models.DecimalField(max_digits=5, decimal_places=2, default=0.0 ,validators=[MinValueValidator(0.01)], help_text="Precio por metro")

    last_update_at = models.DateTimeField(auto_now=True, help_text="Se actualiza cuando hay una modificación")
    registered_at = models.DateTimeField(auto_now_add=True, help_text="Se actualiza cuando se agrega un nuevo registro")

    def __str__(self):
        return self.name    

class Fabric_Scrap(models.Model):

    fabric_scrap_id = models.AutoField(unique=True, primary_key=True)
    fabric_type = models.ForeignKey('Fabric_Type', on_delete=models.CASCADE, related_name="scraps_type")
    #administrator = models.ForeignKey('users.Administrator', on_delete=models.CASCADE, related_name="administered_scraps")
    #saleswoman = models.ForeignKey('users.Saleswoman', on_delete=models.CASCADE, related_name="sales_scraps")

    length_meters = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0.01)])
    width_meters = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0.01)])
    description = models.TextField(blank=True)
    historial_price = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, validators=[MinValueValidator(0.01)])
    active = models.BooleanField(default=True)

    created_by_role = models.CharField(max_length=50, editable=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,   # <--- Permite que registros viejos no tengan autor
        blank=True,
        related_name="created_scraps"
    )

    sale_date = models.DateTimeField(null=True, blank=True)
    last_update_at = models.DateTimeField(auto_now=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Retazo {self.id} - {self.length_meters}m x {self.width_meters}m"
    

#
#Creas el retazo → registered_at se llena solo, sale_date queda vacío (NULL).
#
#Vendes el retazo → Tu API actualiza active=False y envía la fecha actual a sale_date.
#