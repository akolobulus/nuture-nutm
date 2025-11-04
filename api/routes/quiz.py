from flask import Blueprint, jsonify, request
from auth import require_auth, get_current_user_id
from database import get_db, dict_from_row
import uuid
from datetime import datetime
import calendar

bp = Blueprint('quiz', __name__)

def get_current_week():
    now = datetime.now()
    week_number = now.isocalendar()[1]
    year = now.year
    return week_number, year

@bp.route('/questions', methods=['GET'])
@require_auth
def get_quiz_questions():
    week_number, year = get_current_week()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM quiz_questions 
            WHERE week_number = ? AND year = ?
            ORDER BY RANDOM()
        ''', (week_number, year))
        questions = [dict_from_row(row) for row in cursor.fetchall()]
        
        return jsonify({
            'questions': [{
                'id': q['id'],
                'question': q['question'],
                'options': {
                    'A': q['option_a'],
                    'B': q['option_b'],
                    'C': q['option_c'],
                    'D': q['option_d']
                },
                'category': q['category']
            } for q in questions],
            'weekNumber': week_number,
            'year': year
        }), 200

@bp.route('/submit', methods=['POST'])
@require_auth
def submit_quiz():
    user_id = get_current_user_id()
    data = request.json
    week_number, year = get_current_week()
    
    answers = data.get('answers', {})
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, correct_answer FROM quiz_questions 
            WHERE week_number = ? AND year = ?
        ''', (week_number, year))
        questions = {row['id']: row['correct_answer'] for row in cursor.fetchall()}
        
        score = sum(1 for q_id, answer in answers.items() if questions.get(q_id) == answer)
        total = len(questions)
        
        submission_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO quiz_submissions (id, user_id, week_number, year, score, total_questions)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (submission_id, user_id, week_number, year, score, total))
        
        cursor.execute('''
            INSERT INTO gamification_activities (id, user_id, activity_type, points)
            VALUES (?, ?, 'quiz_completed', ?)
        ''', (str(uuid.uuid4()), user_id, score * 10))
        
        conn.commit()
        
        return jsonify({
            'id': submission_id,
            'score': score,
            'total': total,
            'percentage': round((score / total) * 100, 2) if total > 0 else 0
        }), 201

@bp.route('/leaderboard', methods=['GET'])
@require_auth
def get_leaderboard():
    week_number, year = get_current_week()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT 
                u.id,
                u.full_name,
                u.profile_picture_url,
                qs.score,
                qs.total_questions,
                CAST(qs.score AS FLOAT) / qs.total_questions * 100 as percentage,
                qs.submitted_at
            FROM quiz_submissions qs
            JOIN users u ON qs.user_id = u.id
            WHERE qs.week_number = ? AND qs.year = ?
            ORDER BY percentage DESC, qs.submitted_at ASC
            LIMIT 50
        ''', (week_number, year))
        
        leaderboard = []
        for idx, row in enumerate(cursor.fetchall(), 1):
            leaderboard.append({
                'rank': idx,
                'userID': row[0],
                'name': row[1],
                'avatar': row[2],
                'score': row[3],
                'total': row[4],
                'percentage': round(row[5], 2),
                'submittedAt': row[6]
            })
        
        return jsonify({
            'leaderboard': leaderboard,
            'weekNumber': week_number,
            'year': year
        }), 200

@bp.route('/my-stats', methods=['GET'])
@require_auth
def get_my_stats():
    user_id = get_current_user_id()
    week_number, year = get_current_week()
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT score, total_questions, submitted_at 
            FROM quiz_submissions
            WHERE user_id = ? AND week_number = ? AND year = ?
            ORDER BY submitted_at DESC LIMIT 1
        ''', (user_id, week_number, year))
        current_week = dict_from_row(cursor.fetchone())
        
        cursor.execute('''
            SELECT 
                COUNT(*) as total_attempts,
                AVG(CAST(score AS FLOAT) / total_questions * 100) as avg_score
            FROM quiz_submissions
            WHERE user_id = ?
        ''', (user_id,))
        overall = dict_from_row(cursor.fetchone())
        
        return jsonify({
            'currentWeek': {
                'score': current_week['score'],
                'total': current_week['total_questions'],
                'percentage': round((current_week['score'] / current_week['total_questions']) * 100, 2) if current_week else None,
                'submittedAt': current_week['submitted_at']
            } if current_week else None,
            'overall': {
                'totalAttempts': overall['total_attempts'] or 0,
                'averageScore': round(overall['avg_score'], 2) if overall['avg_score'] else 0
            }
        }), 200
