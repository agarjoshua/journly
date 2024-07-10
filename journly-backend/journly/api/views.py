from django.shortcuts import render

# Create your views here.
from django.contrib.auth import get_user_model
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.views import APIView
from api.serializers import CreateUserSerializer

from django.http import JsonResponse

from api.utils import validate_token  # Assuming you have a validate_token function

from .models import Category, JournalEntry
from .serializers import CategorySerializer, JournalEntrySerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

class CreateUserAPIView(CreateAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # We create a token than will be used for future auth
        token = Token.objects.create(user=serializer.instance)
        token_data = {"token": token.key}
        return Response(
            {**serializer.data, **token_data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class LogoutUserAPIView(APIView):
    queryset = get_user_model().objects.all()

    def get(self, request, format=None):
        # simply delete the token to force a login
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)



class CheckTokenView(APIView):
  def get(self, request):
    # Get token from the request header (replace with your token retrieval logic)
    print('------------------------I have been called')
    token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1] if 'HTTP_AUTHORIZATION' in request.META else None

    if not token:
      return Response({'message': 'No token provided'}, status=status.HTTP_401_UNAUTHORIZED)

    # Validate the token using your custom logic
    if validate_token(token):
      return Response({'message': 'Token is valid!'})
    else:
      return Response({'message': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)



# from rest_framework.response import JsonResponse

@api_view(['GET'])  # Only allow GET requests
@permission_classes([IsAuthenticated])  # Require authentication
def all_journals(request):
    all_journals = JournalEntry.objects.all()
    data = {
        "message": "Hello from the protected API!",
        "data": [1, 2, 3, 4],
    }
    # return data
    return JsonResponse(all_journals, safe=False)

class CategoryListCreateView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

  def post(self, request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=201)  # Created
    return Response(serializer.errors, status=400)  # Bad request

class JournalEntryListCreateView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    entries = JournalEntry.objects.filter(user=request.user)  # Filter by logged-in user
    serializer = JournalEntrySerializer(entries, many=True)
    return Response(serializer.data)

  def post(self, request):
    serializer = JournalEntrySerializer(data=request.data)
    if serializer.is_valid():
      serializer.save(user=request.user)  # Associate entry with logged-in user
      return Response(serializer.data, status=201)  # Created
    return Response(serializer.errors, status=400)  # Bad request

class JournalEntryDetailView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk):
    try:
      entry = JournalEntry.objects.get(pk=pk)
      if entry.user != request.user:
        return Response({'message': 'Unauthorized access'}, status=403)  # Forbidden
      serializer = JournalEntrySerializer(entry)
      return Response(serializer.data)
    except JournalEntry.DoesNotExist:
      return Response({'message': 'Entry not found'}, status=404)  # Not found

  def put(self, request, pk):
    try:
      entry = JournalEntry.objects.get(pk=pk)
      if entry.user != request.user:
        return Response({'message': 'Unauthorized access'}, status=403)  # Forbidden
      serializer = JournalEntrySerializer(entry, data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
      return Response(serializer.errors, status=400)  # Bad request
    except JournalEntry.DoesNotExist:
      return Response({'message': 'Entry not found'}, status=404)  # Not found

  def delete(self, request, pk):
    try:
      entry = JournalEntry.objects.get(pk=pk)
      if entry.user != request.user:
        return Response({'message': 'Unauthorized access'}, status=403)  # Forbidden
      entry.delete()
      return Response({'message': 'Entry deleted successfully'}, status=204)  # No Content
    except JournalEntry.DoesNotExist:
      return Response({'message': 'Entry not found'}, status=404)
