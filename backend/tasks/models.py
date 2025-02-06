from django.db import models
from django.utils import timezone


class Task(models.Model):
    text = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.text
