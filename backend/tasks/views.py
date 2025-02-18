from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('order')
    serializer_class = TaskSerializer

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            # Récupérer uniquement les champs fournis dans la requête
            for key, value in request.data.items():
                setattr(instance, key, value)
            instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error updating task: {str(e)}")  # Pour le débogage
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['delete'])
    def delete_completed(self, request):
        Task.objects.filter(completed=True).delete()
        return Response({"message": "Completed tasks deleted."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['patch'])
    def reorder(self, request):
        task_ids = request.data.get('tasks', [])
        for index, task_id in enumerate(task_ids):
            Task.objects.filter(id=task_id).update(order=index)
        return Response({"message": "Tasks reordered."}, status=status.HTTP_200_OK)

    def get_queryset(self):
        return Task.objects.all().order_by('order')

    @action(detail=True, methods=['patch'])
    def archive(self, request, pk=None):
        try:
            task = self.get_object()
            # Toggle l'état d'archivage
            task.archived = not task.archived
            task.save()

            # Sérialiser et renvoyer la tâche mise à jour
            serializer = self.get_serializer(task)
            return Response(serializer.data)
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
