"""
Authentication routes for login, signup, and user management - FIXED VERSION
"""
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
import re
import logging
from models.auth import DatabaseManager, User, AssessmentHistory, login_required, guest_only

logger = logging.getLogger(__name__)

# Create blueprint
auth_bp = Blueprint('auth', __name__)

# Initialize database and user management
db_manager = DatabaseManager()
user_manager = User(db_manager)
assessment_history = AssessmentHistory(db_manager)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    return True, "Password is valid"

def validate_username(username):
    """Validate username format"""
    if len(username) < 3:
        return False, "Username must be at least 3 characters long"
    
    if len(username) > 20:
        return False, "Username must not exceed 20 characters"
    
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "Username can only contain letters, numbers, and underscores"
    
    return True, "Username is valid"

@auth_bp.route('/login', methods=['GET', 'POST'])
@guest_only
def login():
    """User login page and handler"""
    # Redirect browser GETs to the SPA login
    if request.method == 'GET':
        return redirect('/app/login')
    if request.method == 'POST':
        username_or_email = request.form.get('username_or_email', '').strip()
        password = request.form.get('password', '')
        remember_me = request.form.get('remember_me') == 'on'
        
        # Validate input
        if not username_or_email:
            flash('Please enter your username or email.', 'danger')
            return render_template('auth/login.html')
        
        if not password:
            flash('Please enter your password.', 'danger')
            return render_template('auth/login.html')
        
        # Authenticate user
        user = user_manager.authenticate_user(username_or_email, password)
        
        if user:
            # Set session data
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['email'] = user['email']
            session['first_name'] = user['first_name']
            session['last_name'] = user['last_name']
            session['is_admin'] = user.get('is_admin', False)
            session['role'] = user.get('role', 'user')
            
            # Set session permanence based on remember me
            session.permanent = remember_me
            
            # Redirect to main page or next page
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            
            # Redirect admins to admin dashboard, regular users to regular dashboard
            if user.get('is_admin'):
                flash(f'Welcome back, Administrator {user["first_name"] or user["username"]}!', 'success')
                return redirect(url_for('admin_main_dashboard'))
            else:
                flash(f'Welcome back, {user["first_name"] or user["username"]}!', 'success')
                return redirect(url_for('dashboard'))
        else:
            flash('Invalid username/email or password. Please try again.', 'danger')
    
    return render_template('auth/login.html') 

@auth_bp.route('/signup', methods=['GET', 'POST'])
@guest_only
def signup():
    """User registration page and handler"""
    # Redirect browser GETs to the SPA signup
    if request.method == 'GET':
        return redirect('/app/signup')
    if request.method == 'POST':
        # Get form data
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        first_name = request.form.get('first_name', '').strip()
        last_name = request.form.get('last_name', '').strip()
        terms_accepted = request.form.get('terms_accepted') == 'on'
        
        # Validation
        errors = []
        
        # Username validation
        username_valid, username_msg = validate_username(username)
        if not username_valid:
            errors.append(username_msg)
        
        # Email validation
        if not email:
            errors.append('Email is required.')
        elif not validate_email(email):
            errors.append('Please enter a valid email address.')
        
        # Password validation
        password_valid, password_msg = validate_password(password)
        if not password_valid:
            errors.append(password_msg)
        
        # Confirm password
        if password != confirm_password:
            errors.append('Passwords do not match.')
        
        # Terms acceptance
        if not terms_accepted:
            errors.append('You must accept the terms and conditions.')
        
        # If there are validation errors
        if errors:
            for error in errors:
                flash(error, 'danger')
            return render_template('auth/signup.html', 
                                 username=username, 
                                 email=email, 
                                 first_name=first_name, 
                                 last_name=last_name)
        
        # Create user
        user_data, error = user_manager.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name or None,
            last_name=last_name or None
        )
        
        if user_data:
            # Auto-login the user
            session['user_id'] = user_data['id']
            session['username'] = user_data['username']
            session['email'] = user_data['email']
            session['first_name'] = user_data['first_name']
            session['last_name'] = user_data['last_name']
            
            flash(f'Welcome to FARDI, {first_name or username}! Your account has been created successfully.', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash(error, 'danger')
    
    return render_template('auth/signup.html')

@auth_bp.route('/logout')
def logout():
    """User logout"""
    username = session.get('first_name') or session.get('username', 'User')
    
    # Clear session
    session.clear()
    
    flash(f'Goodbye, {username}! You have been logged out successfully.', 'info')
    return redirect(url_for('welcome'))

@auth_bp.route('/profile')
@login_required
def profile():
    """User profile page"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            flash('Session expired. Please log in again.', 'warning')
            return redirect(url_for('auth.login'))
            
        user_data = user_manager.get_user_by_id(user_id)
        
        if not user_data:
            flash('User not found. Please log in again.', 'danger')
            return redirect(url_for('auth.logout'))
        
        # Get user statistics with error handling
        try:
            user_stats = assessment_history.get_user_stats(user_id)
        except Exception as e:
            logger.error(f"Error getting user stats: {str(e)}")
            user_stats = {}
        
        try:
            recent_assessments = assessment_history.get_user_assessments(user_id, limit=5)
        except Exception as e:
            logger.error(f"Error getting recent assessments: {str(e)}")
            recent_assessments = []
        
        return render_template('auth/profile.html', 
                             user=user_data, 
                             stats=user_stats, 
                             recent_assessments=recent_assessments)
                             
    except Exception as e:
        logger.error(f"Error in profile route: {str(e)}")
        flash('An error occurred loading your profile. Please try again.', 'danger')
        return redirect(url_for('dashboard'))

@auth_bp.route('/profile/edit', methods=['GET', 'POST'])
@login_required
def edit_profile():
    """Edit user profile"""
    user_id = session.get('user_id')
    user_data = user_manager.get_user_by_id(user_id)
    
    if not user_data:
        flash('User not found. Please log in again.', 'danger')
        return redirect(url_for('auth.logout'))
    
    if request.method == 'POST':
        # Get form data
        first_name = request.form.get('first_name', '').strip()
        last_name = request.form.get('last_name', '').strip()
        email = request.form.get('email', '').strip().lower()
        preferred_language = request.form.get('preferred_language', 'en')
        timezone = request.form.get('timezone', 'UTC')
        
        # Validate email
        if email != user_data['email']:
            if not validate_email(email):
                flash('Please enter a valid email address.', 'danger')
                return render_template('auth/edit_profile.html', user=user_data)
            
            # Check if email is already taken
            existing_user = user_manager.get_user_by_email(email)
            if existing_user and existing_user['id'] != user_id:
                flash('This email address is already registered.', 'danger')
                return render_template('auth/edit_profile.html', user=user_data)
        
        # Update user
        success = user_manager.update_user(
            user_id,
            first_name=first_name or None,
            last_name=last_name or None,
            email=email,
            preferred_language=preferred_language,
            timezone=timezone
        )
        
        if success:
            # Update session data
            session['first_name'] = first_name
            session['last_name'] = last_name
            session['email'] = email
            
            flash('Your profile has been updated successfully.', 'success')
            return redirect(url_for('auth.profile'))
        else:
            flash('An error occurred while updating your profile.', 'danger')
    
    return render_template('auth/edit_profile.html', user=user_data)

@auth_bp.route('/change-password', methods=['GET', 'POST'])
@login_required
def change_password():
    """Change user password"""
    if request.method == 'POST':
        current_password = request.form.get('current_password', '')
        new_password = request.form.get('new_password', '')
        confirm_password = request.form.get('confirm_password', '')
        
        # Validate input
        if not current_password:
            flash('Please enter your current password.', 'danger')
            return render_template('auth/change_password.html')
        
        # Validate new password
        password_valid, password_msg = validate_password(new_password)
        if not password_valid:
            flash(password_msg, 'danger')
            return render_template('auth/change_password.html')
        
        # Confirm password
        if new_password != confirm_password:
            flash('New passwords do not match.', 'danger')
            return render_template('auth/change_password.html')
        
        # Change password
        user_id = session.get('user_id')
        success, message = user_manager.change_password(user_id, current_password, new_password)
        
        if success:
            flash('Your password has been changed successfully.', 'success')
            return redirect(url_for('auth.profile'))
        else:
            flash(message, 'danger')
    
    return render_template('auth/change_password.html')

@auth_bp.route('/delete-account', methods=['GET', 'POST'])
@login_required
def delete_account():
    """Delete user account"""
    if request.method == 'POST':
        password = request.form.get('password', '')
        confirmation = request.form.get('confirmation', '')
        
        # Validate confirmation
        if confirmation != 'DELETE':
            flash('Please type "DELETE" to confirm account deletion.', 'danger')
            return render_template('auth/delete_account.html')
        
        # Verify password
        user_id = session.get('user_id')
        user_data = user_manager.get_user_by_id(user_id)
        
        if not user_manager.verify_password(password, user_data['password_hash']):
            flash('Incorrect password. Account deletion cancelled.', 'danger')
            return render_template('auth/delete_account.html')
        
        # Deactivate account
        success = user_manager.deactivate_user(user_id)
        
        if success:
            # Clear session
            username = session.get('first_name') or session.get('username', 'User')
            session.clear()
            
            flash(f'Your account has been deleted, {username}. We\'re sorry to see you go.', 'info')
            return redirect(url_for('index'))
        else:
            flash('An error occurred while deleting your account. Please try again.', 'danger')
    
    return render_template('auth/delete_account.html')

@auth_bp.route('/forgot-password')
@guest_only
def forgot_password():
    """Forgot password page (placeholder)"""
    flash('Password reset functionality will be available soon. Please contact support if you need assistance.', 'info')
    return redirect(url_for('auth.login'))

@auth_bp.route('/api/check-username')
def check_username():
    """API endpoint to check username availability - FIXED"""
    try:
        username = request.args.get('username', '').strip()
        
        if not username:
            return jsonify({'available': False, 'message': 'Username is required'})
        
        # Validate username format first
        username_valid, username_msg = validate_username(username)
        if not username_valid:
            return jsonify({'available': False, 'message': username_msg})
        
        # Check if username exists in database
        conn = db_manager.get_connection()
        try:
            cursor = conn.execute(
                'SELECT id FROM users WHERE LOWER(username) = LOWER(?)',
                (username,)
            )
            existing = cursor.fetchone()
            
            available = existing is None
            message = 'Username is available' if available else 'Username is already taken'
            
            return jsonify({'available': available, 'message': message})
            
        except Exception as db_error:
            logger.error(f"Database error checking username: {str(db_error)}")
            return jsonify({'available': False, 'message': 'Error checking username availability'})
        finally:
            conn.close()
            
    except Exception as e:
        logger.error(f"Error in check_username endpoint: {str(e)}")
        return jsonify({'available': False, 'message': 'Server error occurred'})

@auth_bp.route('/api/check-email')
def check_email():
    """API endpoint to check email availability - FIXED"""
    try:
        email = request.args.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'available': False, 'message': 'Email is required'})
        
        # Validate email format first
        if not validate_email(email):
            return jsonify({'available': False, 'message': 'Invalid email format'})
        
        # Check if email exists in database
        conn = db_manager.get_connection()
        try:
            cursor = conn.execute(
                'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
                (email,)
            )
            existing = cursor.fetchone()
            
            available = existing is None
            message = 'Email is available' if available else 'Email is already registered'
            
            return jsonify({'available': available, 'message': message})
            
        except Exception as db_error:
            logger.error(f"Database error checking email: {str(db_error)}")
            return jsonify({'available': False, 'message': 'Error checking email availability'})
        finally:
            conn.close()
            
    except Exception as e:
        logger.error(f"Error in check_email endpoint: {str(e)}")
        return jsonify({'available': False, 'message': 'Server error occurred'})

# Debug endpoint to test database connectivity
@auth_bp.route('/api/debug/db-test')
def debug_db_test():
    """Debug endpoint to test database connectivity"""
    try:
        conn = db_manager.get_connection()
        try:
            # Test basic database operations
            cursor = conn.execute('SELECT COUNT(*) as count FROM users')
            result = cursor.fetchone()
            user_count = result['count'] if result else 0
            
            # Test table structure
            cursor = conn.execute("PRAGMA table_info(users)")
            columns = [row['name'] for row in cursor.fetchall()]
            
            return jsonify({
                'status': 'success',
                'user_count': user_count,
                'table_columns': columns,
                'message': 'Database connection successful'
            })
            
        except Exception as db_error:
            logger.error(f"Database test error: {str(db_error)}")
            return jsonify({
                'status': 'error',
                'message': f'Database error: {str(db_error)}'
            })
        finally:
            conn.close()
            
    except Exception as e:
        logger.error(f"Debug endpoint error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Connection error: {str(e)}'
        })

# Export the database manager and user manager for use in other modules
__all__ = ['auth_bp', 'db_manager', 'user_manager', 'assessment_history', 'login_required', 'guest_only']

# Lightweight API for SPA to get current user session info
@auth_bp.route('/api/me')
def api_me():
    try:
        if 'user_id' in session:
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': session.get('user_id'),
                    'username': session.get('username'),
                    'email': session.get('email'),
                    'first_name': session.get('first_name'),
                    'last_name': session.get('last_name'),
                    'is_admin': session.get('is_admin', False),
                    'role': session.get('role', 'user')
                }
            })
        else:
            return jsonify({'authenticated': False, 'user': None})
    except Exception as e:
        logger.error(f"Error in api_me: {str(e)}")
        return jsonify({'authenticated': False, 'user': None}), 200

# SPA JSON: Login
@auth_bp.route('/api/login', methods=['POST'])
@guest_only
def api_login():
    try:
        data = request.get_json(silent=True) or {}
        username_or_email = (data.get('username_or_email') or '').strip()
        password = data.get('password') or ''
        remember_me = bool(data.get('remember_me'))

        if not username_or_email or not password:
            return jsonify({'success': False, 'error': 'Missing credentials'}), 400

        user = user_manager.authenticate_user(username_or_email, password)
        if not user:
            return jsonify({'success': False, 'error': 'Invalid username/email or password'}), 401

        # Set session
        session['user_id'] = user['id']
        session['username'] = user['username']
        session['email'] = user['email']
        session['first_name'] = user['first_name']
        session['last_name'] = user['last_name']
        session['is_admin'] = user.get('is_admin', False)
        session['role'] = user.get('role', 'user')
        session.permanent = remember_me

        # Determine redirect URL based on user role (without /app prefix since React Router handles that)
        redirect_url = '/admin' if user.get('is_admin') else '/dashboard'
        
        return jsonify({
            'success': True, 
            'redirect_url': redirect_url,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'is_admin': user.get('is_admin', False),
                'role': user.get('role', 'user')
            }
        })
    except Exception as e:
        logger.error(f"Error in api_login: {str(e)}")
        return jsonify({'success': False, 'error': 'Server error'}), 500

# SPA JSON: Signup
@auth_bp.route('/api/signup', methods=['POST'])
@guest_only
def api_signup():
    try:
        data = request.get_json(silent=True) or {}
        username = (data.get('username') or '').strip()
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''
        first_name = (data.get('first_name') or '').strip()
        last_name = (data.get('last_name') or '').strip()

        errors = []
        un_ok, un_msg = validate_username(username)
        if not un_ok:
            errors.append(un_msg)
        if not email:
            errors.append('Email is required')
        elif not validate_email(email):
            errors.append('Invalid email format')
        pw_ok, pw_msg = validate_password(password)
        if not pw_ok:
            errors.append(pw_msg)
        if errors:
            return jsonify({'success': False, 'error': errors[0]}), 400

        user_data, error = user_manager.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name or None,
            last_name=last_name or None
        )

        if not user_data:
            return jsonify({'success': False, 'error': error or 'Signup failed'}), 400

        # Auto-login
        session['user_id'] = user_data['id']
        session['username'] = user_data['username']
        session['email'] = user_data['email']
        session['first_name'] = user_data['first_name']
        session['last_name'] = user_data['last_name']

        return jsonify({'success': True, 'user': {
            'id': user_data['id'],
            'username': user_data['username'],
            'email': user_data['email'],
            'first_name': user_data['first_name'],
            'last_name': user_data['last_name'],
            'is_admin': False,
            'role': 'user'
        }})
    except Exception as e:
        logger.error(f"Error in api_signup: {str(e)}")
        return jsonify({'success': False, 'error': 'Server error'}), 500
