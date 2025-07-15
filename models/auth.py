"""
User authentication models and database operations
"""
import sqlite3
import hashlib
import secrets
from datetime import datetime, timedelta
from functools import wraps
from flask import session, redirect, url_for, flash
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, db_path='fardi.db'):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        """Get database connection with row factory"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Initialize database tables"""
        conn = self.get_connection()
        try:
            # Users table
            conn.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    first_name TEXT,
                    last_name TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_login TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1,
                    email_verified BOOLEAN DEFAULT 0,
                    profile_picture TEXT,
                    preferred_language TEXT DEFAULT 'en',
                    timezone TEXT DEFAULT 'UTC'
                )
            ''')
            
            # User sessions table for enhanced session management
            conn.execute('''
                CREATE TABLE IF NOT EXISTS user_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    session_token TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP NOT NULL,
                    ip_address TEXT,
                    user_agent TEXT,
                    is_active BOOLEAN DEFAULT 1,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # Assessment results table
            conn.execute('''
                CREATE TABLE IF NOT EXISTS assessment_results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    session_id TEXT NOT NULL,
                    overall_level TEXT NOT NULL,
                    xp_earned INTEGER DEFAULT 0,
                    time_taken INTEGER, -- in seconds
                    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    skill_levels TEXT, -- JSON string
                    achievements TEXT, -- JSON string
                    responses TEXT, -- JSON string
                    assessments TEXT, -- JSON string
                    ai_usage_percentage REAL DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
                )
            ''')
            
            # Password reset tokens
            conn.execute('''
                CREATE TABLE IF NOT EXISTS password_reset_tokens (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    token TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP NOT NULL,
                    used BOOLEAN DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # Email verification tokens
            conn.execute('''
                CREATE TABLE IF NOT EXISTS email_verification_tokens (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    token TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP NOT NULL,
                    used BOOLEAN DEFAULT 0,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            # User preferences
            conn.execute('''
                CREATE TABLE IF NOT EXISTS user_preferences (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER UNIQUE NOT NULL,
                    email_notifications BOOLEAN DEFAULT 1,
                    progress_reminders BOOLEAN DEFAULT 1,
                    difficulty_level TEXT DEFAULT 'adaptive',
                    theme_preference TEXT DEFAULT 'auto',
                    language_goals TEXT, -- JSON string
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            ''')
            
            conn.commit()
            logger.info("Database tables initialized successfully")
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error initializing database: {str(e)}")
            raise
        finally:
            conn.close()

class User:
    def __init__(self, db_manager):
        self.db = db_manager
    
    @staticmethod
    def hash_password(password):
        """Hash password using SHA-256 with salt"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}:{password_hash}"
    
    @staticmethod
    def verify_password(password, stored_hash):
        """Verify password against stored hash"""
        try:
            salt, hash_value = stored_hash.split(':')
            password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
            return hash_value == password_hash
        except ValueError:
            return False
    
    def create_user(self, username, email, password, first_name=None, last_name=None):
        """Create a new user"""
        conn = self.db.get_connection()
        try:
            # Check if user already exists
            existing = conn.execute(
                'SELECT id FROM users WHERE username = ? OR email = ?',
                (username, email)
            ).fetchone()
            
            if existing:
                return None, "Username or email already exists"
            
            # Hash password
            password_hash = self.hash_password(password)
            
            # Insert user
            cursor = conn.execute('''
                INSERT INTO users (username, email, password_hash, first_name, last_name)
                VALUES (?, ?, ?, ?, ?)
            ''', (username, email, password_hash, first_name, last_name))
            
            user_id = cursor.lastrowid
            
            # Create default preferences
            conn.execute('''
                INSERT INTO user_preferences (user_id)
                VALUES (?)
            ''', (user_id,))
            
            conn.commit()
            
            # Return user data
            user_data = self.get_user_by_id(user_id)
            return user_data, None
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error creating user: {str(e)}")
            return None, "An error occurred while creating the account"
        finally:
            conn.close()
    
    def authenticate_user(self, username_or_email, password):
        """Authenticate user with username/email and password"""
        conn = self.db.get_connection()
        try:
            user = conn.execute('''
                SELECT * FROM users 
                WHERE (username = ? OR email = ?) AND is_active = 1
            ''', (username_or_email, username_or_email)).fetchone()
            
            if user and self.verify_password(password, user['password_hash']):
                # Update last login
                conn.execute(
                    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                    (user['id'],)
                )
                conn.commit()
                
                return dict(user)
            
            return None
            
        except Exception as e:
            logger.error(f"Error authenticating user: {str(e)}")
            return None
        finally:
            conn.close()
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        conn = self.db.get_connection()
        try:
            user = conn.execute(
                'SELECT * FROM users WHERE id = ? AND is_active = 1',
                (user_id,)
            ).fetchone()
            
            return dict(user) if user else None
            
        except Exception as e:
            logger.error(f"Error getting user by ID: {str(e)}")
            return None
        finally:
            conn.close()
    
    def get_user_by_email(self, email):
        """Get user by email"""
        conn = self.db.get_connection()
        try:
            user = conn.execute(
                'SELECT * FROM users WHERE email = ? AND is_active = 1',
                (email,)
            ).fetchone()
            
            return dict(user) if user else None
            
        except Exception as e:
            logger.error(f"Error getting user by email: {str(e)}")
            return None
        finally:
            conn.close()
    
    def update_user(self, user_id, **kwargs):
        """Update user information"""
        conn = self.db.get_connection()
        try:
            # Build dynamic update query
            allowed_fields = ['first_name', 'last_name', 'email', 'preferred_language', 'timezone', 'profile_picture']
            updates = []
            values = []
            
            for field, value in kwargs.items():
                if field in allowed_fields:
                    updates.append(f"{field} = ?")
                    values.append(value)
            
            if not updates:
                return False
            
            values.append(user_id)
            query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
            
            conn.execute(query, values)
            conn.commit()
            
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error updating user: {str(e)}")
            return False
        finally:
            conn.close()
    
    def change_password(self, user_id, old_password, new_password):
        """Change user password"""
        conn = self.db.get_connection()
        try:
            # Verify old password
            user = conn.execute(
                'SELECT password_hash FROM users WHERE id = ?',
                (user_id,)
            ).fetchone()
            
            if not user or not self.verify_password(old_password, user['password_hash']):
                return False, "Current password is incorrect"
            
            # Hash new password
            new_hash = self.hash_password(new_password)
            
            # Update password
            conn.execute(
                'UPDATE users SET password_hash = ? WHERE id = ?',
                (new_hash, user_id)
            )
            conn.commit()
            
            return True, "Password updated successfully"
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error changing password: {str(e)}")
            return False, "An error occurred while updating the password"
        finally:
            conn.close()
    
    def deactivate_user(self, user_id):
        """Deactivate user account"""
        conn = self.db.get_connection()
        try:
            conn.execute(
                'UPDATE users SET is_active = 0 WHERE id = ?',
                (user_id,)
            )
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error deactivating user: {str(e)}")
            return False
        finally:
            conn.close()

class AssessmentHistory:
    def __init__(self, db_manager):
        self.db = db_manager
    
    def save_assessment(self, user_id, session_id, assessment_data):
        """Save assessment results to database"""
        conn = self.db.get_connection()
        try:
            import json
            
            conn.execute('''
                INSERT INTO assessment_results (
                    user_id, session_id, overall_level, xp_earned, time_taken,
                    skill_levels, achievements, responses, assessments, ai_usage_percentage
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id,
                session_id,
                assessment_data.get('overall_level'),
                assessment_data.get('xp_earned', 0),
                assessment_data.get('time_taken', 0),
                json.dumps(assessment_data.get('skill_levels', {})),
                json.dumps(assessment_data.get('achievements', [])),
                json.dumps(assessment_data.get('responses', [])),
                json.dumps(assessment_data.get('assessments', [])),
                assessment_data.get('ai_usage_percentage', 0)
            ))
            
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error saving assessment: {str(e)}")
            return False
        finally:
            conn.close()
    
    def get_user_assessments(self, user_id, limit=10):
        """Get user's assessment history"""
        conn = self.db.get_connection()
        try:
            assessments = conn.execute('''
                SELECT * FROM assessment_results 
                WHERE user_id = ? 
                ORDER BY completed_at DESC 
                LIMIT ?
            ''', (user_id, limit)).fetchall()
            
            return [dict(assessment) for assessment in assessments]
            
        except Exception as e:
            logger.error(f"Error getting user assessments: {str(e)}")
            return []
        finally:
            conn.close()
    
    def get_user_stats(self, user_id):
        """Get user statistics"""
        conn = self.db.get_connection()
        try:
            stats = conn.execute('''
                SELECT 
                    COUNT(*) as total_assessments,
                    MAX(overall_level) as best_level,
                    AVG(xp_earned) as avg_xp,
                    SUM(xp_earned) as total_xp,
                    AVG(ai_usage_percentage) as avg_ai_usage
                FROM assessment_results 
                WHERE user_id = ?
            ''', (user_id,)).fetchone()
            
            return dict(stats) if stats else {}
            
        except Exception as e:
            logger.error(f"Error getting user stats: {str(e)}")
            return {}
        finally:
            conn.close()

# Authentication decorators
def login_required(f):
    """Decorator to require login for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

def guest_only(f):
    """Decorator to allow only guests (not logged in users)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' in session:
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated_function