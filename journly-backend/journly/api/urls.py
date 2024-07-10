from django.urls import path  # Modern import for URL patterns
from rest_framework.authtoken.views import obtain_auth_token
from .views import CategoryListCreateView, CheckTokenView, CreateUserAPIView, JournalEntryDetailView, JournalEntryListCreateView, LogoutUserAPIView, all_journals

urlpatterns = [
    path('auth/login/', obtain_auth_token, name='auth_user_login'),  # Clearer path definition
    path('auth/register/', CreateUserAPIView.as_view(), name='auth_user_create'),
    path('auth/logout/', LogoutUserAPIView.as_view(), name='auth_user_logout'),
    path('check-token/', CheckTokenView.as_view(), name='check-token'),
    path('journals/', all_journals, name='home'),
    path('categories/', CategoryListCreateView.as_view(), name='category-list'),
    path('entries/', JournalEntryListCreateView.as_view(), name='entry-list'),
    path('entries/<int:pk>/', JournalEntryDetailView.as_view(), name='entry-detail'),
    # path('summary/', SummaryView.as_view(), name='summary'),
]
