from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer
from .permissions import IsOwnerOrReadOnly

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all() 
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        # Chaque utilisateur ne voit que ses propres tâches
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Associer la tâche à l'utilisateur connecté
        serializer.save(user=self.request.user)