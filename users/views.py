from django.shortcuts import render
from rest_framework import viewsets
from .models import Saleswoman
from .serialeizers import SaleswomanSerialeizer


# Create your views here.

class SaleswomanViewset(viewsets.ModelViewSet):
    queryset = Saleswoman.objects.all()
    serializer_class = SaleswomanSerialeizer
