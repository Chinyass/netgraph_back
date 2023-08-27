from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListCreateNodeAPIView.as_view(), name='get_all_nodes'),
]