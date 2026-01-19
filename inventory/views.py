from django.shortcuts import render
from rest_framework import viewsets
from .models import Fabric_Scrap, Fabric_Type
from .serializers import FabricScrapSerializer,FabricTypeSerializer
# Create your views here.

class FabricScrapViewSet(viewsets.ModelViewSet):
    queryset = Fabric_Scrap.objects.all() 
    serializer_class = FabricScrapSerializer

    def perform_create(self, serializer):
        user = self.request.user

        serializer.save(
            created_by=user,
            created_by_role=getattr(user, 'role', 'no_role') 
        )

class FabricTypeViewSet(viewsets.ModelViewSet):
    queryset = Fabric_Type.objects.all()
    serializer_class = FabricTypeSerializer