from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import NodeSerializer, EdgeSerializer, MapSerializer,MapManySerializer
from .models import Node, Edge, Map

class ListCreateNodeAPIView(ListCreateAPIView):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer

class DetailCreateNodeAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer

class ListCreateEdgeAPIView(ListCreateAPIView):
    queryset = Edge.objects.all()
    serializer_class = EdgeSerializer

class DetailCreateEdgeAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Edge.objects.all()
    serializer_class = EdgeSerializer

class ListCreateMapAPIView(ListCreateAPIView):
    queryset = Map.objects.all()
    serializer_class = MapManySerializer

class DetailCreateMapAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Map.objects.all()
    serializer_class = MapSerializer