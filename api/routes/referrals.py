from flask import Blueprint, jsonify, request
from auth import require_auth, get_current_user_id
from database import get_db, dict_from_row
import uuid

bp = Blueprint('referrals', __name__)

@bp.route('', methods=['POST'])
@require_auth
def create_referral():
    user_id = get_current_user_id()
    data = request.json
    referral_id = str(uuid.uuid4())
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO referrals (id, referrer_id, referred_email, reward_amount, status)
            VALUES (?, ?, ?, ?, 'pending')
        ''', (referral_id, user_id, data['email'], data.get('rewardAmount', 500000)))
        conn.commit()
        return jsonify({'id': referral_id}), 201

@bp.route('/me', methods=['GET'])
@require_auth
def list_user_referrals():
    user_id = get_current_user_id()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM referrals WHERE referrer_id = ? ORDER BY created_at DESC', (user_id,))
        referrals = [dict_from_row(row) for row in cursor.fetchall()]
        
        return jsonify({
            'referrals': [{
                'id': r['id'],
                'referrerID': r['referrer_id'],
                'referredEmail': r['referred_email'],
                'referredID': r['referred_id'],
                'rewardAmount': r['reward_amount'],
                'status': r['status'],
                'createdAt': r['created_at'],
                'completedAt': r['completed_at']
            } for r in referrals]
        }), 200

@bp.route('/complete', methods=['POST'])
@require_auth
def complete_referral():
    data = request.json
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE referrals 
            SET referred_id = ?, status = 'completed', completed_at = datetime("now")
            WHERE id = ?
        ''', (data['referredUserID'], data['referralID']))
        conn.commit()
        return jsonify({'success': True}), 200
