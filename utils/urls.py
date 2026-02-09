from django.urls import path, include
from .views import UploadPDFView
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('upload-pdf/', UploadPDFView.as_view(), name='upload-pdf'),
]