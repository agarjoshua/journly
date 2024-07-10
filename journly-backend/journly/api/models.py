from django.db import models
from django.contrib.auth.models import User 

class Category(models.Model):
  name = models.CharField(max_length=50, unique=True)

  def __str__(self):
    return self.name

class JournalEntry(models.Model):
  title = models.CharField(max_length=255)
  content = models.TextField()
  category = models.ForeignKey(Category, on_delete=models.CASCADE)
  user = models.ForeignKey(User, on_delete=models.CASCADE) 
  date = models.DateField()
  

  def __str__(self):
    return self.title
