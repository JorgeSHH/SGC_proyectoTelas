# tasks/urls.py
from rest_framework.routers import DefaultRouter
from tasks import views
from django.urls import path, include

router = DefaultRouter()
router.register(r'tasks', views.TaskView, basename='tasks')  # ✅ usar TaskView

urlpatterns = [
    path('api/v1/', include(router.urls))
]


