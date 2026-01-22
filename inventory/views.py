from django.shortcuts import render
from django.db.models import ProtectedError
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import Fabric_Scrap, Fabric_Type
from .serializers import FabricScrapSerializer,FabricTypeSerializer
from .permissions import IsAdministrator, IsSaleswoman
from rest_framework.permissions import IsAuthenticated
from django.forms.models import model_to_dict
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from audit.mixins import AuditMixins
from users.models import Administrator

class FabricScrapViewSet(viewsets.ModelViewSet, AuditMixins):
    queryset = Fabric_Scrap.objects.all() 
    serializer_class = FabricScrapSerializer

    #filtros de busqueda

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['fabric_scrap_id']
    search_fields = ['description', 'fabric_scrap_id', 'active']
    ordering_fields = ['fabric_scrap_id']

    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update']:
            return [IsAdministrator()]
        return [(IsAuthenticated & (IsAdministrator | IsSaleswoman ))()]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_authenticated and (user.role == 'admin' or user.role == 'saleswoman'):
            return Fabric_Scrap.objects.all()
        #filter(created_by=user)   
        return Fabric_Scrap.objects.none()

    # respuestas personalizadas

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "message": "Datos del retazo inválidos.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        return Response({
            "status": "success",
            "message": "Retazo registrado exitosamente.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "message": "No se pudo actualizar el retazo.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
     
        self.perform_update(serializer)
        return Response({
            "status": "success",
            "message": "Datos del retazo actualizados.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        id_retazo = instance.fabric_scrap_id
        self.perform_destroy(instance)
        
        return Response({
            "status": "success",
            "message": f"El retazo con ID {id_retazo} ha sido eliminado del inventario."
        }, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        user = self.request.user

        serializer.save(
            created_by=user,
            created_by_role=getattr(user, 'role', 'no_role') 
        )

    # ganchos para guardar en el log 

    # def perform_update(self, serializer):
    #     instance = self.get_object()
    #     old_data = model_to_dict(instance)

    #     try:
    #         admin_profile = Administrator.objects.get(email=self.request.user.email)
    #     except Administrator.DoesNotExist:
    #         raise serializers.ValidationError({"detail": "El usuario logueado no tiene un perfil de administrador válido."})
        
    #     updated_instance = serializer.save()

    #     self.log_action(
    #         admin=admin_profile, 
    #         action_type='UPDATE', 
    #         instance=updated_instance, 
    #         old_data=old_data
    #     )

    # def perform_destroy(self, instance):
    #     user = self.request.user
    #     old_data = model_to_dict(instance)

    #     self.log_action(admin=user, action_type='DELETE', instance=instance, old_data=old_data)
        
    #     instance.delete()



class FabricTypeViewSet(viewsets.ModelViewSet):
    queryset = Fabric_Type.objects.all()
    serializer_class = FabricTypeSerializer

    #filtros de busqueda

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['Fabric_Type_id', 'name', 'material_type']
    search_fields = ['name', 'material_type']
    ordering_fields = ['name', 'Fabric_Type_id']
    ordering = ['name']


    #  permisos
    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update', 'create']:
            return [IsAdministrator()]
        return [(IsAuthenticated & (IsAdministrator | IsSaleswoman))()] 
    
    # respuestas personalizadas
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "message": "Nombre de tipo de tela inválido o duplicado",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response({
            "status": "success",
            "message": "Nuevo tipo de tela creado",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)


    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "message": "No se pudo actualizar el tipo de tela.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)
        return Response({
            "status": "success",
            "message": "Tipo de tela actualizado exitosamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            nombre_tela = instance.name
            # Intentamos realizar el borrado normal
            self.perform_destroy(instance)
            return Response({
                "status": "success",
                "message": f"Tipo de tela '{nombre_tela}' eliminado correctamente."
            }, status=status.HTTP_200_OK)
        except ProtectedError as e:
            # Capturamos el error de protección
            return Response({
                    "status": "error",
                    "message": "Acción bloqueada, No se puede eliminar porque existen retazos asociados a este tipo de tela.",
                    "errors": {"detail": str(e)}
                }, status=status.HTTP_400_BAD_REQUEST)