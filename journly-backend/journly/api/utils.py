# from .models import User  # Import your user model
from django.contrib.auth.models import User

def validate_token(token):
  # Implement your token validation logic here
  # This is a simple example, replace with a more secure method
  try:
    user_id = int(token.split('.')[1])
    user = User.objects.get(id=user_id)
    # You can add additional checks like token expiration or blacklist
    return True
  except (ValueError, User.DoesNotExist):
    return False
