from django.contrib import admin

# Register your models here.
from .models import Category, JournalEntry

admin.site.register(Category)
admin.site.register(JournalEntry)
