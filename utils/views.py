# views.py
from rest_framework import viewsets, mixins
from .serializers import DollarRateSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Dollar_Rate

class DollarRateViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated] 

    queryset = Dollar_Rate.objects.all()
    serializer_class = DollarRateSerializer
    
    def list(self, request, *args, **kwargs):
        instance = self.get_queryset().first() # Tomamos el único valor
        if instance:
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        return Response({"error": "No hay tasa registrada"}, status=404)