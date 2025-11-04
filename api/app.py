from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from database import init_db, get_db
from auth import require_auth
import routes.auth as auth_routes
import routes.users as users_routes
import routes.plans as plans_routes
import routes.subscriptions as subscriptions_routes
import routes.claims as claims_routes
import routes.payments as payments_routes
import routes.referrals as referrals_routes
import routes.health_tips as health_tips_routes
import routes.quiz as quiz_routes
import routes.admin as admin_routes

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True)

init_db()

app.register_blueprint(auth_routes.bp, url_prefix='/auth')
app.register_blueprint(users_routes.bp, url_prefix='/users')
app.register_blueprint(plans_routes.bp, url_prefix='/plans')
app.register_blueprint(subscriptions_routes.bp, url_prefix='/subscriptions')
app.register_blueprint(claims_routes.bp, url_prefix='/claims')
app.register_blueprint(payments_routes.bp, url_prefix='/payments')
app.register_blueprint(referrals_routes.bp, url_prefix='/referrals')
app.register_blueprint(health_tips_routes.bp, url_prefix='/health-tips')
app.register_blueprint(quiz_routes.bp, url_prefix='/quiz')
app.register_blueprint(admin_routes.bp, url_prefix='/admin')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(host='localhost', port=4000, debug=True)
