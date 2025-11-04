from flask import Blueprint, jsonify, request
from auth import require_auth, get_current_user_id
from database import get_db, dict_from_row
import uuid
from datetime import datetime, timedelta

bp = Blueprint('subscriptions', __name__)

@bp.route('', methods=['POST'])
@require_auth
def create_subscription():
    user_id = get_current_user_id()
    data = request.json
    sub_id = str(uuid.uuid4())
    
    start_date = datetime.now()
    end_date = start_date + timedelta(days=30)
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO subscriptions (id, user_id, plan_id, status, start_date, end_date, auto_renew)
            VALUES (?, ?, ?, 'active', ?, ?, ?)
        ''', (sub_id, user_id, data['planID'], start_date, end_date, data.get('autoRenew', True)))
        conn.commit()
        
        return jsonify({'id': sub_id}), 201

@bp.route('/me', methods=['GET'])
@require_auth
def get_user_subscription():
    user_id = get_current_user_id()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT s.*, p.name as plan_name, p.tier, p.coverage_limit, p.monthly_price
            FROM subscriptions s
            JOIN insurance_plans p ON s.plan_id = p.id
            WHERE s.user_id = ? AND s.status = 'active'
            ORDER BY s.created_at DESC LIMIT 1
        ''', (user_id,))
        sub = dict_from_row(cursor.fetchone())
        
        if not sub:
            return jsonify({'subscription': None}), 200
        
        return jsonify({
            'id': sub['id'],
            'userID': sub['user_id'],
            'planID': sub['plan_id'],
            'planName': sub['plan_name'],
            'tier': sub['tier'],
            'coverageLimit': sub['coverage_limit'],
            'monthlyPrice': sub['monthly_price'],
            'status': sub['status'],
            'startDate': sub['start_date'],
            'endDate': sub['end_date'],
            'autoRenew': bool(sub['auto_renew'])
        }), 200

@bp.route('/cancel', methods=['POST'])
@require_auth
def cancel_subscription():
    user_id = get_current_user_id()
    data = request.json
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE subscriptions 
            SET status = 'cancelled', updated_at = datetime("now")
            WHERE id = ? AND user_id = ?
        ''', (data['subscriptionID'], user_id))
        conn.commit()
        return jsonify({'success': True}), 200

@bp.route('/transfer', methods=['POST'])
@require_auth
def transfer_subscription():
    user_id = get_current_user_id()
    data = request.json
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE subscriptions 
            SET user_id = ?, updated_at = datetime("now")
            WHERE id = ? AND user_id = ?
        ''', (data['newUserID'], data['subscriptionID'], user_id))
        conn.commit()
        return jsonify({'success': True}), 200
