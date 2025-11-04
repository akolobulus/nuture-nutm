from functools import wraps
from flask import request, jsonify
import jwt
import os
import requests

CLERK_SECRET_KEY = os.getenv('CLERK_SECRET_KEY', '')

def verify_clerk_token(token):
    try:
        headers = {'Authorization': f'Bearer {CLERK_SECRET_KEY}'}
        response = requests.get(
            f'https://api.clerk.com/v1/sessions/verify',
            headers=headers,
            json={'token': token}
        )
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        session_cookie = request.cookies.get('session')
        
        token = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        elif session_cookie:
            token = session_cookie
        
        if not token:
            return jsonify({'error': 'Missing authentication token'}), 401
        
        user_data = verify_clerk_token(token)
        if not user_data:
            return jsonify({'error': 'Invalid authentication token'}), 401
        
        request.user_id = user_data.get('userId', user_data.get('sub'))
        return f(*args, **kwargs)
    
    return decorated_function

def get_current_user_id():
    return getattr(request, 'user_id', None)
