from flask import Blueprint, jsonify, request
from auth import require_auth
from database import get_db, dict_from_row
import json

bp = Blueprint('admin', __name__)

@bp.route('/claims', methods=['GET'])
@require_auth
def list_all_claims():
    status = request.args.get('status')
    limit = request.args.get('limit', 50, type=int)
    
    with get_db() as conn:
        cursor = conn.cursor()
        if status:
            cursor.execute('SELECT * FROM claims WHERE status = ? ORDER BY created_at DESC LIMIT ?', (status, limit))
        else:
            cursor.execute('SELECT * FROM claims ORDER BY created_at DESC LIMIT ?', (limit,))
        
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

@bp.route('/policies', methods=['GET'])
@require_auth
def list_policies():
    status = request.args.get('status')
    limit = request.args.get('limit', 50, type=int)
    
    with get_db() as conn:
        cursor = conn.cursor()
        if status:
            cursor.execute('''
                SELECT s.*, p.name as plan_name, u.full_name as user_name
                FROM subscriptions s
                JOIN insurance_plans p ON s.plan_id = p.id
                JOIN users u ON s.user_id = u.id
                WHERE s.status = ?
                ORDER BY s.created_at DESC LIMIT ?
            ''', (status, limit))
        else:
            cursor.execute('''
                SELECT s.*, p.name as plan_name, u.full_name as user_name
                FROM subscriptions s
                JOIN insurance_plans p ON s.plan_id = p.id
                JOIN users u ON s.user_id = u.id
                ORDER BY s.created_at DESC LIMIT ?
            ''', (limit,))
        
        policies = [dict_from_row(row) for row in cursor.fetchall()]
        
        return jsonify({
            'policies': [{
                'id': p['id'],
                'userID': p['user_id'],
                'userName': p['user_name'],
                'planID': p['plan_id'],
                'planName': p['plan_name'],
                'status': p['status'],
                'startDate': p['start_date'],
                'endDate': p['end_date'],
                'autoRenew': bool(p['auto_renew'])
            } for p in policies]
        }), 200

@bp.route('/dashboard-stats', methods=['GET'])
@require_auth
def dashboard_stats():
    with get_db() as conn:
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) FROM users')
        total_users = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM subscriptions WHERE status = "active"')
        active_policies = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM claims WHERE status = "pending"')
        pending_claims = cursor.fetchone()[0]
        
        cursor.execute('SELECT SUM(amount) FROM payments WHERE status = "completed"')
        total_revenue = cursor.fetchone()[0] or 0
        
        return jsonify({
            'totalUsers': total_users,
            'activePolicies': active_policies,
            'pendingClaims': pending_claims,
            'totalRevenue': total_revenue
        }), 200

@bp.route('/analytics', methods=['GET'])
@require_auth
def analytics():
    with get_db() as conn:
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM users
            GROUP BY DATE(created_at)
            ORDER BY date DESC LIMIT 30
        ''')
        user_growth = [{'date': row[0], 'count': row[1]} for row in cursor.fetchall()]
        
        cursor.execute('''
            SELECT status, COUNT(*) as count
            FROM claims
            GROUP BY status
        ''')
        claims_by_status = [{'status': row[0], 'count': row[1]} for row in cursor.fetchall()]
        
        return jsonify({
            'userGrowth': user_growth,
            'claimsByStatus': claims_by_status
        }), 200
