from django.db import models
from users.models import Administrator

# Create your models here.

class record(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Creacion'),
        ('UPDATE', 'Actualización'),
        ('DELETE', 'Eliminacion'),
    ]
    record_id = models.AutoField(primary_key=True)
    administrator = models.ForeignKey(Administrator, on_delete=models.SET_NULL, null=True, related_name='auditoria_acciones')
    model_name = models.CharField(max_length=50)  # Ej: 'FabricScrap', 'Saleswoman'
    object_id = models.IntegerField()
    action_type = models.CharField(max_length= 50)
    old_data = models.JSONField(null=True, blank=True)
    new_data = models.JSONField(null=True, blank=True)
    action_timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-action_timestamp']

    def __str__(self):
        return f"{self.action_type} - {self.model_name} (ID: {self.object_id})"