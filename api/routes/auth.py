from flask import Blueprint, jsonify, request
from auth import require_auth, get_current_user_id
from database import get_db, dict_from_row

bp = Blueprint('auth', __name__)

@bp.route('/me', methods=['GET'])
@require_auth
def get_me():
    user_id = get_current_user_id()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = dict_from_row(cursor.fetchone())
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'userID': user['id'],
            'email': user['email'],
            'fullName': user['full_name'],
            'nutmID': user['nutm_id'],
            'phoneNumber': user['phone_number'],
            'profilePictureUrl': user['profile_picture_url'],
            'verified': bool(user['verified'])
        }), 200
