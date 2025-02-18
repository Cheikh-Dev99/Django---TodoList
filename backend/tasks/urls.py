from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('tasks/', TaskViewSet.as_view({'get': 'list',
         'post': 'create'}), name='task-list-create'),
    path('tasks/<int:pk>/', TaskViewSet.as_view({
        'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}
    ), name='task-detail'),
    path('', include(router.urls)),
    path('tasks/reorder/',
         TaskViewSet.as_view({'patch': 'reorder'}), name='task-reorder'),
    path('tasks/delete_completed/',
         TaskViewSet.as_view({'delete': 'delete_completed'}), name='task-delete-completed'),
    path('tasks/<int:pk>/archive/',
         TaskViewSet.as_view({'patch': 'archive'}),
         name='task-archive'),
]
