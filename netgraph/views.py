from rest_framework.generics import ListCreateAPIView
from .serializers import NodeSerializer
from .models import Node

class ListCreateNodeAPIView(ListCreateAPIView):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer