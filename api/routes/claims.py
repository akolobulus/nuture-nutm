from flask import Blueprint, jsonify, request
from auth import require_auth, get_current_user_id
from database import get_db, dict_from_row
import uuid
import json

bp = Blueprint('claims', __name__)

@bp.route('', methods=['POST'])
@require_auth
def submit_claim():
    user_id = get_current_user_id()
    data = request.json
    claim_id = str(uuid.uuid4())
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO claims (id, user_id, subscription_id, amount, description, category, status, receipt_urls)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
        ''', (
            claim_id,
            user_id,
            data['subscriptionID'],
            data['amount'],
            data['description'],
            data['category'],
            json.dumps(data.get('receiptURLs', []))
        ))
        conn.commit()
        return jsonify({'id': claim_id}), 201

@bp.route('/me', methods=['GET'])
@require_auth
def list_user_claims():
    user_id = get_current_user_id()
    status = request.args.get('status')
    
    with get_db() as conn:
        cursor = conn.cursor()
        if status:
            cursor.execute('SELECT * FROM claims WHERE user_id = ? AND status = ? ORDER BY created_at DESC', (user_id, status))
        else:
            cursor.execute('SELECT * FROM claims WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
        
        claims = [dict_from_row(row) for row in cursor.fetchall()]
        
        return jsonify({
            'claims': [{
                'id': c['id'],
                'userID': c['user_id'],
                'subscriptionID': c['subscription_id'],
                'amount': c['amount'],
                'description': c['description'],
                'category': c['category'],
                'status': c['status'],
                'rejectionReason': c['rejection_reason'],
                'receiptURLs': json.loads(c['receipt_urls']) if c['receipt_urls'] else [],
                'submittedAt': c['submitted_at'],
                'processedAt': c['processed_at']
            } for c in claims]
        }), 200

@bp.route('/update-status', methods=['POST'])
@require_auth
def update_claim_status():
    data = request.json
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE claims 
            SET status = ?, rejection_reason = ?, processed_at = datetime("now"), updated_at = datetime("now")
            WHERE id = ?
        ''', (data['status'], data.get('rejectionReason'), data['claimID']))
        conn.commit()
        return jsonify({'success': True}), 200

@bp.route('/upload-url', methods=['POST'])
@require_auth
def get_upload_url():
    data = request.json
    return jsonify({
        'uploadURL': f'https://api.example.com/upload/{data["filename"]}',
        'publicURL': f'https://cdn.example.com/{data["filename"]}'
    }), 200
