import sqlite3
import os
from contextlib import contextmanager

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'nuture.db')

def init_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.executescript('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        nutm_id TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        phone_number TEXT,
        profile_picture_url TEXT,
        verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS insurance_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tier TEXT NOT NULL CHECK (tier IN ('basic', 'standard', 'premium')),
        coverage_limit INTEGER NOT NULL,
        monthly_price INTEGER NOT NULL,
        description TEXT,
        features TEXT,
        active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        auto_renew INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (plan_id) REFERENCES insurance_plans(id)
    );

    CREATE TABLE IF NOT EXISTS claims (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        subscription_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
        rejection_reason TEXT,
        receipt_urls TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        subscription_id TEXT,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
        payment_method TEXT,
        transaction_id TEXT,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
    );

    CREATE TABLE IF NOT EXISTS referrals (
        id TEXT PRIMARY KEY,
        referrer_id TEXT NOT NULL,
        referred_email TEXT NOT NULL,
        referred_id TEXT,
        reward_amount INTEGER DEFAULT 0,
        status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'expired')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        FOREIGN KEY (referrer_id) REFERENCES users(id),
        FOREIGN KEY (referred_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS health_tips (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        published INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quiz_questions (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
        category TEXT,
        week_number INTEGER NOT NULL,
        year INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quiz_submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        week_number INTEGER NOT NULL,
        year INTEGER NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS gamification_activities (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        activity_type TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    ''')
    
    conn.commit()
    conn.close()
    seed_data()

def seed_data():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM insurance_plans")
    if cursor.fetchone()[0] == 0:
        plans = [
            ('plan-1', 'Basic Student Plan', 'basic', 50000000, 500000, 
             'Essential coverage for students', '["Emergency Care", "Basic Medication", "Doctor Visits"]', 1),
            ('plan-2', 'Standard Student Plan', 'standard', 100000000, 1000000,
             'Comprehensive coverage with dental', '["Emergency Care", "Medication", "Doctor Visits", "Dental Care", "Lab Tests"]', 1),
            ('plan-3', 'Premium Student Plan', 'premium', 200000000, 1500000,
             'Full coverage with mental health', '["Emergency Care", "Full Medication", "Specialist Visits", "Dental Care", "Mental Health", "Lab Tests"]', 1)
        ]
        cursor.executemany(
            'INSERT INTO insurance_plans VALUES (?, ?, ?, ?, ?, ?, ?, ?datetime("now"))',
            plans
        )
    
    cursor.execute("SELECT COUNT(*) FROM health_tips")
    if cursor.fetchone()[0] == 0:
        tips = [
            ('tip-1', 'Stay Hydrated', 'Drink at least 8 glasses of water daily to maintain optimal health.', 'General', 1),
            ('tip-2', 'Regular Exercise', 'Aim for 30 minutes of physical activity most days of the week.', 'Fitness', 1),
            ('tip-3', 'Balanced Diet', 'Eat a variety of fruits, vegetables, whole grains, and lean proteins.', 'Nutrition', 1),
            ('tip-4', 'Mental Health', 'Take time for activities that reduce stress and promote relaxation.', 'Mental Health', 1),
            ('tip-5', 'Sleep Well', 'Get 7-9 hours of quality sleep each night for better health.', 'General', 1)
        ]
        cursor.executemany(
            'INSERT INTO health_tips VALUES (?, ?, ?, ?, ?, datetime("now"))',
            tips
        )
    
    conn.commit()
    conn.close()

@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def dict_from_row(row):
    return dict(zip(row.keys(), row)) if row else None
