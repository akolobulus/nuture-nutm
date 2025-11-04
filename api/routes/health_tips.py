from flask import Blueprint, jsonify, request
from database import get_db, dict_from_row

bp = Blueprint('health_tips', __name__)

@bp.route('', methods=['GET'])
def list_health_tips():
    category = request.args.get('category')
    limit = request.args.get('limit', 10, type=int)
    
    with get_db() as conn:
        cursor = conn.cursor()
        if category:
            cursor.execute('SELECT * FROM health_tips WHERE published = 1 AND category = ? ORDER BY created_at DESC LIMIT ?', (category, limit))
        else:
            cursor.execute('SELECT * FROM health_tips WHERE published = 1 ORDER BY created_at DESC LIMIT ?', (limit,))
        
        tips = [dict_from_row(row) for row in cursor.fetchall()]
        
        return jsonify({
            'tips': [{
                'id': t['id'],
                'title': t['title'],
                'content': t['content'],
                'category': t['category'],
                'published': bool(t['published'])
            } for t in tips]
        }), 200
