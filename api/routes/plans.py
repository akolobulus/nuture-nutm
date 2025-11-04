from flask import Blueprint, jsonify
from database import get_db, dict_from_row
import json

bp = Blueprint('plans', __name__)

@bp.route('', methods=['GET'])
def list_plans():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM insurance_plans WHERE active = 1')
        plans = [dict_from_row(row) for row in cursor.fetchall()]
        
        return jsonify({
            'plans': [{
                'id': p['id'],
                'name': p['name'],
                'tier': p['tier'],
                'coverageLimit': p['coverage_limit'],
                'monthlyPrice': p['monthly_price'],
                'description': p['description'],
                'features': json.loads(p['features']) if p['features'] else [],
                'active': bool(p['active'])
            } for p in plans]
        }), 200

@bp.route('/<plan_id>', methods=['GET'])
def get_plan(plan_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM insurance_plans WHERE id = ?', (plan_id,))
        plan = dict_from_row(cursor.fetchone())
        
        if not plan:
            return jsonify({'error': 'Plan not found'}), 404
        
        return jsonify({
            'id': plan['id'],
            'name': plan['name'],
            'tier': plan['tier'],
            'coverageLimit': plan['coverage_limit'],
            'monthlyPrice': plan['monthly_price'],
            'description': plan['description'],
            'features': json.loads(plan['features']) if plan['features'] else [],
            'active': bool(plan['active'])
        }), 200
