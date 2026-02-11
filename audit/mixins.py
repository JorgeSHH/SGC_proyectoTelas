from django.forms.models import model_to_dict
from .models import  record
from rest_framework import permissions

class AuditMixins:
    """
    Mixin para registrar automaticamente cambios en los modelos.
    """
    def log_action(self, admin, action_type, instance, old_data=None):
        tipos_con_datos = ['CREATE', 'UPDATE', 'DELETE']
        if action_type in tipos_con_datos: 
            new_data = model_to_dict(instance) 
        else:
            new_data = None
        
        record.objects.create(
            administrator = admin,
            action_type = action_type,
            model_name = instance.__class__.__name__,
            object_id = instance.pk,
            old_data = old_data,
            new_data = new_data
        )

class filtroDePermisos(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Admin puede todo
        if request.user.role == 'admin':
            return True
        
        # Vendedora solo puede VER (GET) o CREAR (POST)
        if request.user.role == 'saleswoman':
            return request.method in ['GET', 'POST', 'HEAD', 'OPTIONS']
            
        return False
