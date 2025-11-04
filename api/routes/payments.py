from flask import Blueprint, jsonify, request
from auth import require_auth, get_current_user_id
from database import get_db, dict_from_row
import uuid

bp = Blueprint('payments', __name__)

@bp.route('', methods=['POST'])
@require_auth
def create_payment():
    user_id = get_current_user_id()
    data = request.json
    payment_id = str(uuid.uuid4())
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO payments (id, user_id, subscription_id, amount, status, payment_method, transaction_id)
            VALUES (?, ?, ?, ?, 'completed', ?, ?)
        ''', (
            payment_id,
            user_id,
            data.get('subscriptionID'),
            data['amount'],
            data['paymentMethod'],
            f'TXN-{payment_id[:8]}'
        ))
        conn.commit()
        return jsonify({'id': payment_id, 'status': 'completed'}), 201

@bp.route('/me', methods=['GET'])
@require_auth
def list_user_payments():
    user_id = get_current_user_id()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
        payments = [dict_from_row(row) for row in cursor.fetchall()]
        
        return jsonify({
            'payments': [{
                'id': p['id'],
                'userID': p['user_id'],
                'subscriptionID': p['subscription_id'],
                'amount': p['amount'],
                'status': p['status'],
                'paymentMethod': p['payment_method'],
                'transactionID': p['transaction_id'],
                'paymentDate': p['payment_date']
            } for p in payments]
        }), 200
