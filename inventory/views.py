from django.shortcuts import render
from django.db.models import ProtectedError
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import Fabric_Scrap, Fabric_Type
from .serializers import FabricScrapSerializer,FabricTypeSerializer
from .permissions import IsAdministrator, IsSaleswoman
from rest_framework.permissions import IsAuthenticated

class FabricScrapViewSet(viewsets.ModelViewSet):
    queryset = Fabric_Scrap.objects.all() 
    serializer_class = FabricScrapSerializer

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

    def perform_create(self, serializer):
        user = self.request.user

        serializer.save(
            created_by=user,
            created_by_role=getattr(user, 'role', 'no_role') 
        )

class FabricTypeViewSet(viewsets.ModelViewSet):
    queryset = Fabric_Type.objects.all()
    serializer_class = FabricTypeSerializer

    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update', 'create']:
            return [IsAdministrator()]
        return [(IsAuthenticated & (IsAdministrator | IsSaleswoman))()] 
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            # Intentamos realizar el borrado normal
            self.perform_destroy(instance)
            return Response(
                {"message": "Tipo de tela eliminado correctamente."},
                status=status.HTTP_204_NO_CONTENT
            )
        except ProtectedError as e:
            # Capturamos el error de protección
            return Response(
                {
                    "error": "No se puede eliminar este tipo de tela porque tiene retazos asociados.",
                    "details": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )