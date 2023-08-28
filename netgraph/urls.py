from django.urls import path
from . import views

urlpatterns = [
    path('nodes/', views.ListCreateNodeAPIView.as_view(), name='get_all_nodes'),
    path('nodes/<int:pk>', views.DetailCreateNodeAPIView.as_view(), name="node_detail"),
    path('edges/', views.ListCreateEdgeAPIView.as_view(), name='get_all_edges'),
    path('edges/<int:pk>', views.DetailCreateEdgeAPIView.as_view(), name='edges_detail'),
    path('maps/', views.ListCreateMapAPIView.as_view(), name="get_all_maps"),
    path('maps/<int:pk>', views.DetailCreateMapAPIView.as_view(), name="map_detail")
]