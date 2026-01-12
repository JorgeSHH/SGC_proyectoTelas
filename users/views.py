from django.shortcuts import render
from rest_framework import viewsets
from .models import User, Saleswoman,Administrator
from .serialeizers import SaleswomanSerialeizer #AdministratorSerialeizer
from django.contrib.auth import get_user_model
from django.db import transaction


# Create your views here.

class SaleswomanViewSet(viewsets.ModelViewSet):
    queryset = Saleswoman.objects.all()
    serializer_class = SaleswomanSerialeizer

    def perform_destroy(self, instance):
        User = get_user_model()
        with transaction.atomic():
            User.objects.filter(email = instance.email).delete()
            instance.delete()

# class AdministratorViewSet(viewsets.ModelViewSet):
#     queryset = Administrator.objects.all()
#     serializer_class = AdministratorSerialeizer