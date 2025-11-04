from flask import Blueprint, jsonify, request
from auth import require_auth, get_current_user_id
from database import get_db, dict_from_row
import uuid

bp = Blueprint('users', __name__)

@bp.route('', methods=['POST'])
def create_user():
    data = request.json
    user_id = data.get('id') or str(uuid.uuid4())
    
    with get_db() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute('''
                INSERT INTO users (id, email, nutm_id, full_name, phone_number, verified)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                user_id,
                data['email'],
                data.get('nutmID', f'NUTM-{user_id[:8]}'),
                data['fullName'],
                data.get('phoneNumber'),
                data.get('verified', False)
            ))
            conn.commit()
            return jsonify({'id': user_id}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400

@bp.route('/<user_id>', methods=['GET'])
@require_auth
def get_user(user_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = dict_from_row(cursor.fetchone())
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': user['id'],
            'email': user['email'],
            'nutmID': user['nutm_id'],
            'fullName': user['full_name'],
            'phoneNumber': user['phone_number'],
            'profilePictureUrl': user['profile_picture_url'],
            'verified': bool(user['verified'])
        }), 200

@bp.route('/profile', methods=['PUT'])
@require_auth
def update_profile():
    user_id = get_current_user_id()
    data = request.json
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE users 
            SET full_name = ?, phone_number = ?, updated_at = datetime("now")
            WHERE id = ?
        ''', (data.get('fullName'), data.get('phoneNumber'), user_id))
        conn.commit()
        return jsonify({'success': True}), 200

@bp.route('/verify', methods=['POST'])
@require_auth
def verify_user():
    user_id = get_current_user_id()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET verified = 1 WHERE id = ?', (user_id,))
        conn.commit()
        return jsonify({'success': True}), 200
