from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
import os
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta
from flask_session import Session
from flask import send_from_directory
from models.game_data import NPCS, DIALOGUE_QUESTIONS, CEFR_LEVELS, BADGES, ACHIEVEMENTS, PROGRESS_LEVELS, PHASE_2_STEPS, PHASE_2_REMEDIAL_ACTIVITIES, PHASE_2_POINTS, PHASE_2_SUCCESS_THRESHOLD
from services.ai_service import AIService
from services.audio_service import AudioService
from services.assessment_service import AssessmentService
from utils.helpers import (
    determine_overall_level, 
    skill_levels_from_assessments, 
    calculate_achievements, 
    calculate_xp
)
from routes.auth_routes import auth_bp, db_manager, user_manager, assessment_history, login_required, guest_only
from routes.exercise_builder_routes import exercise_builder_bp
from models.auth import admin_required

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = str(os.getenv("SECRET_KEY", "dev-secret-key"))
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = os.path.join(os.path.dirname(__file__), 'sessions')
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = False  # Disable signer to avoid bytes/string issues
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)  # 30 days for "remember me"

os.makedirs('sessions', exist_ok=True)
Session(app)

# Initialize services
ai_service = AIService()
audio_service = AudioService()
assessment_service = AssessmentService()

# Register authentication blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

# Register exercise builder blueprint
app.register_blueprint(exercise_builder_bp)

# Register workflow importer blueprint
from routes.workflow_importer import workflow_importer_bp
app.register_blueprint(workflow_importer_bp)

# Register gamification blueprint
from routes.gamification_routes import gamification_bp
app.register_blueprint(gamification_bp)

# Register Phase 5 advanced features blueprint
from routes.phase5_routes import phase5_bp
app.register_blueprint(phase5_bp)

# Register AI evaluation routes
from routes.evaluation_routes import evaluation_bp
app.register_blueprint(evaluation_bp, url_prefix='/api')

# Register Phase 4 routes
from routes.phase4_routes import phase4_bp
app.register_blueprint(phase4_bp)

# Import Phase 4 loader
from models.phase4_loader import get_phase4_step


@app.route('/')
def root():
    """Root route - redirects based on authentication status"""
    if 'user_id' in session:
        return redirect(url_for('index'))
    else:
        return redirect(url_for('welcome'))

@app.route('/welcome')
def welcome():
    """Public welcome page for unauthenticated users"""
    if 'user_id' in session:
        return redirect(url_for('index'))
    return redirect('/app')

@app.route('/home')
@login_required
def index():
    """Home page route with game introduction - requires login"""
    # Use the SPA home for a consistent React experience
    return redirect('/app')

@app.route('/dashboard')
@login_required
def dashboard():
    """Redirect to admin dashboard if admin, otherwise React dashboard"""
    user_id = session.get('user_id')
    
    # Check if user is admin
    try:
        conn = db_manager.get_connection()
        admin_check = conn.execute(
            'SELECT is_admin FROM users WHERE id = ?', (user_id,)
        ).fetchone()
        conn.close()
        
        if admin_check and admin_check['is_admin']:
            return redirect(url_for('admin_main_dashboard'))
    except Exception as e:
        logger.error(f"Error checking admin status: {e}")
    
    # Regular user dashboard
    return redirect('/app/dashboard')

@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    """Admin dashboard with user management and analytics"""
    user_id = session.get('user_id')
    
    # Verify admin access
    try:
        conn = db_manager.get_connection()
        admin_check = conn.execute(
            'SELECT is_admin, first_name, username FROM users WHERE id = ?', (user_id,)
        ).fetchone()
        
        if not admin_check or not admin_check['is_admin']:
            flash('Access denied. Admin privileges required.', 'error')
            return redirect(url_for('dashboard'))
        
        # Get admin statistics
        stats = get_admin_statistics()
        
        # Get users with pagination
        page = request.args.get('page', 1, type=int)
        search = request.args.get('search', '')
        role_filter = request.args.get('role', '')
        
        users, pagination = get_users_with_stats(page=page, search=search, role_filter=role_filter)
        
        # Calculate additional metrics
        new_users_this_month = get_new_users_count('month')
        assessments_this_week = get_assessments_count('week')
        active_users_today = get_active_users_count('today')
        
        conn.close()
        
        return render_template('admin/dashboard.html',
                             current_user=admin_check,
                             stats=stats,
                             users=users,
                             pagination=pagination,
                             new_users_this_month=new_users_this_month,
                             assessments_this_week=assessments_this_week,
                             active_users_today=active_users_today)
                             
    except Exception as e:
        logger.error(f"Error in admin dashboard: {e}")
        flash('Error loading admin dashboard', 'error')
        return redirect(url_for('dashboard'))

@app.route('/start-game', methods=['GET', 'POST'])
@login_required
def start_game():
    """Initialize game session with player data - requires login"""
    # User must be logged in to access this
    player_name = session.get('first_name') or session.get('username')
    user_id = session.get('user_id')

    # Initialize session data
    session['player_name'] = player_name
    session['current_step'] = 0
    session['responses'] = []
    session['assessments'] = []
    session['start_time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    session['xp'] = 0
    session['progress_level'] = 0
    session['achievements'] = []
    session['game_user_id'] = user_id

    return redirect(url_for('game'))

@app.route('/game')
@login_required
def game():
    """Redirect to React SPA game to keep a single source of UI"""
    return redirect('/app/game')

@app.route('/results')
@login_required
def results():
    """Show game results, CEFR level assessment, and achievements"""
    player_name = session.get('player_name', 'Player')
    assessments = session.get('assessments', [])
    responses = session.get('responses', [])
    start_time_str = session.get('start_time')
    xp = session.get('xp', 0)
    user_id = session.get('game_user_id')  # Get user ID from game session

    # Calculate AI usage statistics
    total_responses = len(responses)
    ai_detected_count = sum(1 for r in responses if r.get('ai_generated', False))
    ai_percentage = round((ai_detected_count / total_responses * 100) if total_responses > 0 else 0)

    # Parse start time
    start_time = datetime.strptime(start_time_str, "%Y-%m-%d %H:%M:%S") if start_time_str else datetime.now()
    time_taken = (datetime.now() - start_time).total_seconds()

    # Determine overall CEFR level
    overall_level = determine_overall_level(assessments)
    level_description = CEFR_LEVELS.get(overall_level, "Could not determine level")

    # Calculate achievements
    achievements_earned = calculate_achievements(assessments, start_time)

    # Calculate skill levels
    skill_levels = skill_levels_from_assessments(assessments)

    # Calculate progress levels
    progress_levels = []
    for level in PROGRESS_LEVELS:
        required_level = level.get('required_level')
        is_unlocked = True

        if required_level:
            level_values = {"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5}
            player_level_value = level_values.get(overall_level, 0)
            required_level_value = level_values.get(required_level, 999)
            is_unlocked = player_level_value >= required_level_value

        progress_levels.append({
            "name": level.get('name'),
            "description": level.get('description'),
            "icon": level.get('icon'),
            "is_unlocked": is_unlocked,
            "required_level": required_level
        })

    # Save assessment to database (user is guaranteed to be logged in)
    assessment_data = {
        'overall_level': overall_level,
        'xp_earned': xp,
        'time_taken': int(time_taken),
        'skill_levels': skill_levels,
        'achievements': achievements_earned,
        'responses': responses,
        'assessments': assessments,
        'ai_usage_percentage': ai_percentage
    }
    
    # Generate unique session ID for this assessment
    import uuid
    assessment_session_id = str(uuid.uuid4())
    
    # Save to database
    success = assessment_history.save_assessment(user_id, assessment_session_id, assessment_data)
    if success:
        logger.info(f"Assessment saved successfully for user {user_id}")
    else:
        logger.error(f"Failed to save assessment for user {user_id}")

    session['phase1_completed'] = True  # Mark Phase 1 as completed
    session.modified = True
    
    # Redirect to React results page with session ID
    return redirect(f'/app/results?session_id={assessment_session_id}')

@app.route('/certificate')
@login_required
def certificate():
    """Redirect to React certificate"""
    session_id = request.args.get('session_id', '')
    return redirect(f'/app/certificate?session_id={session_id}')

@app.route('/submit-response', methods=['POST'])
@login_required
def submit_response():
    """Process player response, assess language level, and update game state"""
    current_step = session.get('current_step', 0)
    player_response = request.form.get('response', '')
    
    # Check for AI-generated content
    is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(player_response)
    
    # If AI is detected with high score, reject submission
    if is_ai and ai_score > 0.5:
        flash(f"❌ AI content detected ({ai_score:.0%}). Please provide your own authentic response.", "error")
        return redirect(url_for('game'))
    
    if current_step < len(DIALOGUE_QUESTIONS):
        question_data = DIALOGUE_QUESTIONS[current_step]
        question_text = question_data['question']
        question_type = question_data['type']
        
        # Store the response
        responses = session.get('responses', [])
        responses.append({
            "step": current_step + 1,
            "question": question_text,
            "response": player_response,
            "type": question_type,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ai_generated": is_ai,
            "ai_score": ai_score,
            "ai_reasons": ai_reasons
        })
        session['responses'] = responses
        
        # Assess the response
        assessment = assessment_service.assess_response(question_text, player_response, question_type)
        
        # Add metadata to assessment
        assessment["type"] = question_type
        assessment["step"] = current_step + 1
        assessment["ai_generated"] = is_ai
        assessment["ai_score"] = ai_score
        assessment["ai_reasons"] = ai_reasons
        
        # Store the assessment
        assessments = session.get('assessments', [])
        assessments.append(assessment)
        session['assessments'] = assessments
        
        # Calculate XP
        xp_earned = question_data.get('xp_reward', 10)
        level_multipliers = {"A1": 1.0, "A2": 1.2, "B1": 1.5, "B2": 1.8, "C1": 2.0}
        xp_earned = int(xp_earned * level_multipliers.get(assessment.get('level', 'B1'), 1.0))
        
        flash(f"Great work! You earned {xp_earned} XP for your authentic response.", "success")
        
        session['xp'] = session.get('xp', 0) + xp_earned
        session['current_step'] = current_step + 1
    
    return redirect(url_for('game'))

# Import API routes
from routes.api_routes import api_bp
app.register_blueprint(api_bp, url_prefix='/api')

# Context processor to make authentication status available in all templates
@app.context_processor
def inject_auth_status():
    return {
        'logged_in': 'user_id' in session,
        'current_user': {
            'id': session.get('user_id'),
            'username': session.get('username'),
            'email': session.get('email'),
            'first_name': session.get('first_name'),
            'last_name': session.get('last_name')
        } if 'user_id' in session else None
    }

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('errors/500.html'), 500

@app.errorhandler(403)
def forbidden_error(error):
    return render_template('errors/403.html'), 403

# Helper route to clear guest session (for testing)
@app.route('/clear-session')
def clear_session():
    """Clear current session - useful for testing"""
    session.clear()
    flash('Session cleared successfully.', 'info')
    return redirect(url_for('welcome'))

# Optional: Serve React build (if present) under /app without affecting existing pages
@app.route('/app', strict_slashes=False)
@app.route('/app/<path:path>')
def serve_react(path=None):
    import mimetypes
    build_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')
    index_path = os.path.join(build_dir, 'index.html')
    if os.path.exists(index_path):
        # Serve static assets or index.html for SPA routes
        if path and os.path.exists(os.path.join(build_dir, path)):
            # Get the mimetype and ensure .js files are served correctly
            mimetype, _ = mimetypes.guess_type(path)
            if path.endswith('.js'):
                mimetype = 'application/javascript'
            elif path.endswith('.mjs'):
                mimetype = 'application/javascript'
            elif path.endswith('.css'):
                mimetype = 'text/css'
            return send_from_directory(build_dir, path, mimetype=mimetype)
        return send_from_directory(build_dir, 'index.html')
    # If no build yet, show a friendly message
    return ("React build not found. Run 'npm run build' in frontend/ to enable /app.", 404)

@app.route('/phase2')
@login_required
def phase2_intro():
    """Phase 2 introduction page - Cultural Event Planning and Teamwork"""
    player_name = session.get('player_name') or session.get('first_name') or session.get('username', 'Player')
    user_id = session.get('user_id')
    
    # Check if user has completed Phase 1 (either current session or from database)
    has_completed_phase1 = (session.get('overall_level') or 
                           session.get('assessments') or 
                           session.get('phase1_completed'))
    
    if not has_completed_phase1:
        flash('Welcome! Please complete Phase 1 first to unlock Phase 2: Cultural Event Planning.', 'info')
        return redirect(url_for('index'))
    
    # Check if user has existing Phase 2 progress
    from routes.auth_routes import assessment_history
    phase2_progress = assessment_history.get_phase2_progress(user_id)
    
    if phase2_progress and phase2_progress.get('current_step') and not phase2_progress.get('completed'):
        # User has an in-progress step, redirect to it
        current_step = phase2_progress.get('current_step')
        return redirect(f'/app/phase2/step/{current_step}')
    
    # Initialize Phase 2 session data following the .docx specifications
    session['phase2_player_name'] = player_name
    session['phase2_user_id'] = user_id
    session['phase2_current_step'] = 'step_1'
    session['phase2_responses'] = {}
    session['phase2_assessments'] = {}
    session['phase2_scores'] = {}
    session['phase2_start_time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    session['phase2_total_points'] = 0
    
    # Redirect to SPA intro after initializing session data
    return redirect('/app/phase2')

@app.route('/phase2/step/<step_id>')
@login_required
def phase2_step(step_id):
    """Handle Phase 2 steps with database persistence"""
    if step_id not in PHASE_2_STEPS:
        flash('Invalid step!', 'error')
        return redirect(url_for('phase2_intro'))
    
    player_name = session.get('player_name', 'Player')
    user_id = session.get('user_id')
    current_step = PHASE_2_STEPS[step_id]
    
    # Get current progress from database first, then session
    phase2_progress = assessment_history.get_phase2_progress(user_id)
    current_action_item = 0
    
    # Find this step's progress in database
    for step_progress in phase2_progress['steps']:
        if step_progress['step_id'] == step_id and not step_progress['step_completed']:
            current_action_item = step_progress['current_item']
            break
    
    # Fallback to session if not in database
    if current_action_item == 0:
        current_action_item = session.get(f'phase2_{step_id}_current_item', 0)
    
    total_items = len(current_step['action_items'])
    
    # Check if step is completed
    if current_action_item >= total_items:
        return redirect(url_for('phase2_step_results', step_id=step_id))
    
    action_item = current_step['action_items'][current_action_item]
    
    # Save/update progress in database
    import uuid
    session_id = session.get('phase2_session_id', str(uuid.uuid4()))
    session['phase2_session_id'] = session_id
    
    progress_data = {
        'current_item': current_action_item,
        'total_items': total_items,
        'step_score': 0,
        'step_completed': False
    }
    assessment_history.save_phase2_progress(user_id, session_id, step_id, progress_data)
    
    # Redirect to SPA step view, preserving DB progress above
    return redirect(f'/app/phase2/step/{step_id}')

@app.route('/phase2/submit-response', methods=['POST'])
@login_required
def phase2_submit_response():
    """Submit Phase 2 response with database persistence"""
    step_id = request.form.get('step_id')
    action_item_id = request.form.get('action_item_id')
    response = request.form.get('response', '')
    user_id = session.get('user_id')
    session_id = session.get('phase2_session_id')
    
    # Check for AI-generated content
    is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response)
    
    if is_ai and ai_score > 0.5:
        flash(f"❌ AI content detected ({ai_score:.0%}). Please provide your own authentic response.", "error")
        return redirect(url_for('phase2_step', step_id=step_id))
    
    # Assess the response using Phase 2 criteria
    assessment = assessment_service.assess_phase2_response(
        step_id, action_item_id, response
    )
    
    # Store response in database
    response_data = {
        'response_text': response,
        'assessment_data': assessment,
        'points_earned': assessment.get('points', 1),
        'cefr_level': assessment.get('level', 'A1'),
        'ai_detected': is_ai,
        'ai_score': ai_score
    }
    assessment_history.save_phase2_response(user_id, session_id, step_id, action_item_id, response_data)
    
    # Store in session for backward compatibility
    if 'phase2_responses' not in session:
        session['phase2_responses'] = {}
    if 'phase2_assessments' not in session:
        session['phase2_assessments'] = {}
    
    session['phase2_responses'][f"phase2_{step_id}_{action_item_id}"] = response
    session['phase2_assessments'][f"phase2_{step_id}_{action_item_id}"] = assessment
    
    # Move to next action item
    current_item = session.get(f'phase2_{step_id}_current_item', 0)
    new_current_item = current_item + 1
    session[f'phase2_{step_id}_current_item'] = new_current_item
    
    # Update step progress in database
    total_items = len(PHASE_2_STEPS[step_id]['action_items'])
    step_completed = new_current_item >= total_items
    
    progress_data = {
        'current_item': new_current_item,
        'total_items': total_items,
        'step_completed': step_completed,
        'completed_at': datetime.now().isoformat() if step_completed else None
    }
    assessment_history.save_phase2_progress(user_id, session_id, step_id, progress_data)
    
    logger.info(f"Phase 2 response saved - User: {user_id}, Step: {step_id}, Item: {action_item_id}, Level: {assessment.get('level')}")
    
    return redirect(url_for('phase2_step', step_id=step_id))

@app.route('/phase2/step/<step_id>/results')
@login_required
def phase2_step_results(step_id):
    """Redirect to SPA step results view"""
    return redirect(f'/app/phase2/step/{step_id}/results')
    
@app.route('/phase2/remedial/<step_id>/<level>')
@login_required
def phase2_remedial(step_id, level):
    """Handle remedial activities with database persistence"""
    remedial_activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
    user_id = session.get('user_id')
    
    if not remedial_activities:
        flash('No remedial activities found for this level!', 'error')
        return redirect(url_for('phase2_step', step_id=step_id))
    
    # Get current activity from URL parameter - allow access to any activity
    current_activity = int(request.args.get('activity', 0))
    
    # If no specific activity requested, find the next uncompleted one
    if not request.args.get('activity'):
        # Get remedial progress from database
        phase2_progress = assessment_history.get_phase2_progress(user_id)
        completed_activities = []
        for rem_activity in phase2_progress['remedial_activities']:
            if (rem_activity['step_id'] == step_id and 
                rem_activity['level'] == level and 
                rem_activity['completed']):
                completed_activities.append(rem_activity['activity_index'])
        
        # Find next uncompleted activity only if no specific activity requested
        for i in range(len(remedial_activities)):
            if i not in completed_activities:
                current_activity = i
                break
        else:
            # All activities completed - use fallback from session
            current_activity = session.get(f'phase2_remedial_{step_id}_{level}_current', 0)
    
    if current_activity >= len(remedial_activities):
        # All activities completed
        flash('🎉 Excellent! You completed all practice activities. Ready to try the main step again!', 'success')
        
        # Update step progress to allow retry
        session_id = session.get('phase2_session_id')
        progress_data = {
            'current_item': 0,  # Reset to beginning of step
            'step_completed': False,
            'needs_remedial': False,
            'remedial_level': None
        }
        assessment_history.save_phase2_progress(user_id, session_id, step_id, progress_data)
        
        return redirect(url_for('phase2_step', step_id=step_id))
    
    # Redirect to React remedial page with parameters
    return redirect(f'/app/phase2/remedial/{step_id}/{level}?activity={current_activity}')

# Fix double remedial URL issue    
@app.route('/app/phase2/remedial/remedial/<path:remainder>')
def fix_double_remedial(remainder):
    """Fix double remedial URLs by redirecting to correct path"""
    return redirect(f'/app/phase2/remedial/{remainder}')
    
# Helper functions
def get_next_phase2_step(current_step):
    """Get the next step in Phase 2"""
    steps = ['step_1', 'step_2', 'step_3', 'final_writing']
    try:
        current_index = steps.index(current_step)
        if current_index + 1 < len(steps):
            return steps[current_index + 1]
    except ValueError:
        pass
    return None

def determine_phase2_level(score):
    """Determine user level based on Phase 2 step score"""
    if score >= 20:
        return 'B2'  # 20+ points → Proceed to Step 2
    elif score >= 15:
        return 'B1'  # 15-19 points → Remedial B1
    elif score >= 10:
        return 'A2'  # 10-14 points → Remedial A2
    else:
        return 'A1'  # 5-9 points → Remedial A1
    
@app.route('/phase2/complete')
@login_required
def phase2_complete():
    """Phase 2 completion page with results"""
    player_name = session.get('player_name', 'Player')
    
    # Get Phase 2 assessment data
    from routes.api_routes import get_phase2_overall_assessment
    phase2_assessment = get_phase2_overall_assessment()
    
    if not phase2_assessment:
        flash('Phase 2 data not found. Please restart Phase 2.', 'warning')
        return redirect(url_for('phase2_intro'))
    
    # Mark Phase 2 as completed
    session['phase2_completed'] = True
    session.modified = True
    
    return redirect('/app/phase2/complete')
    
@app.route('/profile')
@login_required
def profile():
    """Redirect to React profile page"""
    return redirect('/app/profile')

@app.route('/profile/edit')
@login_required  
def edit_profile():
    """Redirect to React edit profile page"""
    return redirect('/app/profile/edit')

@app.route('/profile/change-password')
@login_required
def change_password():
    """Redirect to React change password page"""
    return redirect('/app/profile/change-password')

@app.route('/profile/delete-account')
@login_required
def delete_account():
    """Redirect to React delete account page"""
    return redirect('/app/profile/delete-account')

@app.route('/phase4/step/1')
@login_required
def phase4_step1():
    """Phase 4 Step 1 - Marketing & Promotion Engage"""
    user_id = session.get('user_id')
    if not user_id:
        flash('Please log in to access Phase 4', 'error')
        return redirect('/auth/login')
    
    # Redirect to React SPA
    return redirect('/app/phase4/step/1')

@app.route('/admin')
@login_required
def admin_main_dashboard():
    """Admin dashboard - redirect to React admin interface"""
    user_id = session.get('user_id')
    
    # Check if user is admin
    try:
        conn = db_manager.get_connection()
        current_user = conn.execute(
            'SELECT is_admin FROM users WHERE id = ?', 
            (user_id,)
        ).fetchone()
        conn.close()
        
        if not current_user or not current_user['is_admin']:
            flash('Access denied. Admin privileges required.', 'error')
            return redirect('/app/dashboard')
        
        # Redirect to React admin dashboard
        return redirect('/app/admin')
                             
    except Exception as e:
        logger.error(f"Error checking admin access: {e}")
        flash('Error loading admin dashboard', 'error')
        return redirect('/app/dashboard')

@app.route('/admin/users/<int:user_id>')
@login_required
def admin_user_detail(user_id):
    """Get detailed information about a specific user for modal popup"""
    user_id_session = session.get('user_id')
    
    # Check if user is admin
    try:
        conn = db_manager.get_connection()
        admin_check = conn.execute('SELECT is_admin FROM users WHERE id = ?', (user_id_session,)).fetchone()
        
        if not admin_check or not admin_check['is_admin']:
            return jsonify({'success': False, 'error': 'Access denied'}), 403
        
        # Get comprehensive user details
        user_details = assessment_history.get_user_details(user_id)
        conn.close()
        
        if not user_details.get('user_info'):
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        return jsonify({'success': True, 'user': user_details})
        
    except Exception as e:
        logger.error(f"Error getting user details: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

@app.route('/admin/users/<int:user_id>/toggle', methods=['POST'])
@admin_required
def admin_toggle_user(user_id):
    """Toggle user active status"""
    try:
        data = request.json
        is_active = data.get('active', True)
        
        success = user_manager.update_user(user_id, is_active=is_active)
        
        if success:
            action = 'activated' if is_active else 'deactivated'
            logger.info(f"Admin {session.get('username')} {action} user {user_id}")
            return jsonify({'success': True, 'message': f'User {action} successfully'})
        else:
            return jsonify({'success': False, 'error': 'Failed to update user'}), 400
            
    except Exception as e:
        logger.error(f"Error toggling user: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

@app.route('/admin/users/<int:user_id>/view-data')
@admin_required
def admin_view_user_data(user_id):
    """Redirect to React admin user viewer"""
    return redirect(f'/app/admin/users/{user_id}')

@app.route('/admin/export-data')
@admin_required
def admin_export_data():
    """Export all users data to CSV - alias for export/users"""
    return admin_export_users()

@app.route('/admin/export/users')
@admin_required
def admin_export_users():
    """Export users data to CSV"""
    try:
        import csv
        import io
        from flask import make_response
        from datetime import datetime
        
        search = request.args.get('search', '')
        role_filter = request.args.get('role', '')
        
        # Use our existing get_users_with_stats function to get all users
        users, _ = get_users_with_stats(page=1, per_page=10000, search=search, role_filter=role_filter)
        
        # Create CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Headers
        writer.writerow([
            'ID', 'Username', 'Email', 'First Name', 'Last Name', 
            'Role', 'Active', 'Created At', 'Last Login',
            'Total Assessments', 'Best Level', 'Total XP', 'Phase2 Steps Completed', 'Phase2 Steps Attempted'
        ])
        
        # Write user data
        for user in users:
            writer.writerow([
                user.get('id', ''),
                user.get('username', ''),
                user.get('email', ''),
                user.get('first_name', ''),
                user.get('last_name', ''),
                'Admin' if user.get('is_admin') else 'User',
                'Yes' if user.get('is_active') else 'No',
                user.get('created_at', ''),
                user.get('last_login', ''),
                user.get('total_assessments', 0),
                user.get('best_level', 'N/A'),
                user.get('total_xp', 0),
                user.get('phase2_steps_completed', 0),
                user.get('phase2_steps_attempted', 0)
            ])
        
        # Create response
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=fardi_users_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        
        return response
        
    except Exception as e:
        logger.error(f"Error exporting users: {str(e)}")
        flash('Error exporting users data', 'error')
        return redirect(url_for('admin_dashboard'))

@app.route('/debug/complete-phase1')
@login_required
def debug_complete_phase1():
    """Temporary route to mark Phase 1 as completed"""
    session['phase1_completed'] = True
    session.modified = True
    flash('Phase 1 marked as completed!', 'success')
    return redirect(url_for('results'))

@app.route('/debug/create-admin')
def debug_create_admin():
    """Create default admin user for testing"""
    try:
        admin_user, error = user_manager.create_admin_user(
            username='admin',
            email='admin@fardi.com',
            password='admin123',
            first_name='System',
            last_name='Administrator'
        )
        
        if admin_user:
            flash('Admin user created successfully! Username: admin, Password: admin123', 'success')
        else:
            flash(f'Error creating admin user: {error}', 'error')
    except Exception as e:
        flash(f'Error: {str(e)}', 'error')
    
    return redirect(url_for('welcome'))

@app.route('/debug/login-admin')
def debug_login_admin():
    """Quick admin login for testing"""
    try:
        # Find admin user
        conn = db_manager.get_connection()
        admin_user = conn.execute(
            'SELECT * FROM users WHERE username = ? AND is_admin = 1', 
            ('admin',)
        ).fetchone()
        
        if admin_user:
            # Set session variables
            session['user_id'] = admin_user['id']
            session['username'] = admin_user['username']
            session['email'] = admin_user['email']
            session['first_name'] = admin_user['first_name']
            session['last_name'] = admin_user['last_name']
            session['is_admin'] = True
            session['role'] = 'admin'
            session.permanent = True
            
            flash('Admin login successful!', 'success')
            return redirect('/admin')
        else:
            flash('Admin user not found', 'error')
            
        conn.close()
            
    except Exception as e:
        flash(f'Error: {str(e)}', 'error')
    
    return redirect(url_for('welcome'))

# Admin helper functions
def get_admin_statistics():
    """Get comprehensive admin statistics"""
    try:
        conn = db_manager.get_connection()
        
        # Overall stats (simplified to work with existing tables)
        total_users = conn.execute('SELECT COUNT(*) as count FROM users').fetchone()['count']
        total_assessments = conn.execute('SELECT COUNT(*) as count FROM assessment_results').fetchone()['count']
        total_phase2_sessions = conn.execute('SELECT COUNT(DISTINCT user_id) as count FROM phase2_responses').fetchone()['count']
        avg_xp = 0  # Simplified since user_stats table doesn't exist
        
        # Assessment stats by level (simplified)
        assessment_stats = []  # Empty since assessments table doesn't exist
        
        # Recent activity (simplified to show recent user registrations)
        recent_activity = conn.execute('''
            SELECT 'registration' as type, first_name, username, 'N/A' as level, 
                   0 as points, created_at as timestamp
            FROM users
            ORDER BY created_at DESC
            LIMIT 10
        ''').fetchall()
        
        conn.close()
        
        return {
            'overall': {
                'total_users': total_users,
                'total_assessments': total_assessments,
                'total_phase2_sessions': total_phase2_sessions,
                'avg_xp': avg_xp
            },
            'assessment_stats': [dict(row) for row in assessment_stats],
            'recent_activity': [dict(row) for row in recent_activity]
        }
    except Exception as e:
        logger.error(f"Error getting admin statistics: {e}")
        return {
            'overall': {'total_users': 0, 'total_assessments': 0, 'total_phase2_sessions': 0, 'avg_xp': 0},
            'assessment_stats': [],
            'recent_activity': []
        }

def get_users_with_stats(page=1, per_page=20, search='', role_filter=''):
    """Get users with their stats and pagination"""
    try:
        conn = db_manager.get_connection()
        
        # Build query conditions
        conditions = []
        params = []
        
        if search:
            conditions.append('(u.username LIKE ? OR u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)')
            search_term = f'%{search}%'
            params.extend([search_term, search_term, search_term, search_term])
        
        if role_filter:
            conditions.append('u.role = ?')
            params.append(role_filter)
        
        where_clause = ' WHERE ' + ' AND '.join(conditions) if conditions else ''
        
        # Get total count
        total_query = f'SELECT COUNT(*) as count FROM users u{where_clause}'
        total = conn.execute(total_query, params).fetchone()['count']
        
        # Calculate pagination
        offset = (page - 1) * per_page
        
        # Get users with real assessment stats
        query = f'''
            SELECT u.*, 
                   COALESCE(ar.total_assessments, 0) as total_assessments,
                   COALESCE(ar.latest_level, 'N/A') as best_level,
                   COALESCE(ar.total_xp, 0) as total_xp,
                   COALESCE(p2.steps_attempted, 0) as phase2_steps_attempted,
                   COALESCE(p2.steps_completed, 0) as phase2_steps_completed
            FROM users u
            LEFT JOIN (
                SELECT ar1.user_id,
                       COUNT(*) as total_assessments,
                       ar2.overall_level as latest_level,
                       SUM(ar1.xp_earned) as total_xp
                FROM assessment_results ar1
                LEFT JOIN (
                    SELECT user_id, overall_level,
                           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY completed_at DESC) as rn
                    FROM assessment_results
                ) ar2 ON ar1.user_id = ar2.user_id AND ar2.rn = 1
                GROUP BY ar1.user_id, ar2.overall_level
            ) ar ON u.id = ar.user_id
            LEFT JOIN (
                SELECT user_id, 
                       COUNT(DISTINCT step_id) as steps_attempted,
                       COUNT(DISTINCT CASE WHEN step_completed = 1 THEN step_id END) as steps_completed
                FROM phase2_progress 
                GROUP BY user_id
            ) p2 ON u.id = p2.user_id
            {where_clause}
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        '''
        
        params.extend([per_page, offset])
        users = conn.execute(query, params).fetchall()
        
        conn.close()
        
        # Create pagination object
        pagination = {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'has_prev': page > 1,
            'has_next': page * per_page < total,
            'prev_num': page - 1 if page > 1 else None,
            'next_num': page + 1 if page * per_page < total else None
        }
        
        # Add iter_pages as a list instead of function (for JSON serialization)
        iter_pages_list = list(range(max(1, page - 2), min(pagination['pages'] + 1, page + 3)))
        pagination['iter_pages'] = iter_pages_list
        
        return [dict(row) for row in users], pagination
        
    except Exception as e:
        logger.error(f"Error getting users with stats: {e}")
        return [], {'page': 1, 'pages': 1, 'total': 0, 'has_prev': False, 'has_next': False}

def get_new_users_count(period='month'):
    """Get count of new users in specified period"""
    try:
        conn = db_manager.get_connection()
        
        if period == 'month':
            date_filter = "DATE(created_at) >= DATE('now', '-30 days')"
        elif period == 'week':
            date_filter = "DATE(created_at) >= DATE('now', '-7 days')"
        else:  # today
            date_filter = "DATE(created_at) = DATE('now')"
        
        count = conn.execute(f'SELECT COUNT(*) as count FROM users WHERE {date_filter}').fetchone()['count']
        conn.close()
        return count
    except Exception as e:
        logger.error(f"Error getting new users count: {e}")
        return 0

def get_assessments_count(period='week'):
    """Get count of assessments in specified period"""
    try:
        conn = db_manager.get_connection()
        
        if period == 'week':
            date_filter = "DATE(completed_at) >= DATE('now', '-7 days')"
        else:  # today
            date_filter = "DATE(completed_at) = DATE('now')"
        
        count = conn.execute(f'SELECT COUNT(*) as count FROM assessments WHERE {date_filter}').fetchone()['count']
        conn.close()
        return count
    except Exception as e:
        logger.error(f"Error getting assessments count: {e}")
        return 0

def get_active_users_count(period='today'):
    """Get count of active users in specified period"""
    try:
        conn = db_manager.get_connection()
        
        if period == 'today':
            date_filter = "DATE(last_login) = DATE('now')"
        else:  # week
            date_filter = "DATE(last_login) >= DATE('now', '-7 days')"
        
        count = conn.execute(f'SELECT COUNT(*) as count FROM users WHERE {date_filter}').fetchone()['count']
        conn.close()
        return count
    except Exception as e:
        logger.error(f"Error getting active users count: {e}")
        return 0
# Admin API Endpoints
@app.route('/api/admin/dashboard', methods=['GET'])
@login_required
def api_admin_dashboard():
    """API endpoint for admin dashboard data"""
    user_id = session.get('user_id')
    
    # Check if user is admin
    try:
        conn = db_manager.get_connection()
        current_user = conn.execute(
            'SELECT is_admin, first_name, last_name, username FROM users WHERE id = ?', 
            (user_id,)
        ).fetchone()
        conn.close()
        
        if not current_user or not current_user['is_admin']:
            return jsonify({'error': 'Access denied. Admin privileges required.'}), 403
        
        # Get admin statistics
        stats = get_admin_statistics()
        
        # Get additional metrics
        new_users_this_month = get_new_users_count('month')
        assessments_this_week = get_assessments_count('week')
        active_users_today = get_active_users_count('today')
        
        return jsonify({
            'success': True,
            'data': {
                'admin': {
                    'name': f"{current_user['first_name']} {current_user['last_name']}" if current_user['first_name'] else current_user['username'],
                    'username': current_user['username']
                },
                'stats': stats,
                'metrics': {
                    'new_users_this_month': new_users_this_month,
                    'assessments_this_week': assessments_this_week,
                    'active_users_today': active_users_today
                }
            }
        })
        
    except Exception as e:
        logger.error(f"Error in admin dashboard API: {e}")
        return jsonify({'error': 'Error loading admin dashboard'}), 500

@app.route('/api/admin/users', methods=['GET'])
@login_required
def api_admin_users():
    """API endpoint for admin users list"""
    user_id = session.get('user_id')
    
    # Check if user is admin
    try:
        conn = db_manager.get_connection()
        admin_check = conn.execute(
            'SELECT is_admin FROM users WHERE id = ?', (user_id,)
        ).fetchone()
        conn.close()
        
        if not admin_check or not admin_check['is_admin']:
            return jsonify({'error': 'Access denied. Admin privileges required.'}), 403
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        search = request.args.get('search', '')
        role_filter = request.args.get('role', '')
        
        # Get users with pagination
        users, pagination = get_users_with_stats(page=page, search=search, role_filter=role_filter)
        
        return jsonify({
            'success': True,
            'data': {
                'users': users,
                'pagination': pagination
            }
        })
        
    except Exception as e:
        logger.error(f"Error in admin users API: {e}")
        return jsonify({'error': 'Error loading users data'}), 500

@app.route('/api/admin/analytics')
@admin_required
def api_admin_analytics():
    """API endpoint for comprehensive admin analytics"""
    try:
        conn = db_manager.get_connection()
        
        # 1. Learning Progress Analytics
        cefr_distribution = conn.execute('''
            SELECT overall_level as level, COUNT(*) as count
            FROM assessment_results ar
            INNER JOIN (
                SELECT user_id, MAX(completed_at) as latest_date
                FROM assessment_results GROUP BY user_id
            ) latest ON ar.user_id = latest.user_id AND ar.completed_at = latest.latest_date
            GROUP BY overall_level
            ORDER BY 
                CASE overall_level 
                    WHEN 'A1' THEN 1 WHEN 'A2' THEN 2 WHEN 'B1' THEN 3 
                    WHEN 'B2' THEN 4 WHEN 'C1' THEN 5 WHEN 'C2' THEN 6 
                END
        ''').fetchall()
        
        phase_completion = conn.execute('''
            SELECT 
                COUNT(DISTINCT u.id) as total_users,
                COUNT(DISTINCT ar.user_id) as phase1_completed,
                COUNT(DISTINCT p2.user_id) as phase2_started,
                COUNT(DISTINCT CASE WHEN p2.steps_completed >= 4 THEN p2.user_id END) as phase2_completed
            FROM users u
            LEFT JOIN assessment_results ar ON u.id = ar.user_id
            LEFT JOIN (
                SELECT user_id, COUNT(DISTINCT CASE WHEN step_completed = 1 THEN step_id END) as steps_completed
                FROM phase2_progress GROUP BY user_id
            ) p2 ON u.id = p2.user_id
            WHERE u.is_admin = 0
        ''').fetchone()
        
        avg_assessment_times = conn.execute('''
            SELECT 
                'Phase 1' as phase,
                AVG(time_taken) / 60.0 as avg_minutes
            FROM assessment_results
            UNION ALL
            SELECT 
                'Phase 2 - ' || step_id as phase,
                AVG(CAST((julianday(completed_at) - julianday(started_at)) * 24 * 60 AS INTEGER)) as avg_minutes
            FROM phase2_progress 
            WHERE completed_at IS NOT NULL
            GROUP BY step_id
        ''').fetchall()
        
        # 2. Student Engagement Metrics
        active_users_7d = conn.execute('''
            SELECT COUNT(DISTINCT user_id) as count
            FROM (
                SELECT user_id, completed_at as activity_date FROM assessment_results
                WHERE completed_at >= datetime('now', '-7 days')
                UNION
                SELECT user_id, last_activity as activity_date FROM phase2_progress
                WHERE last_activity >= datetime('now', '-7 days')
            )
        ''').fetchone()
        
        active_users_30d = conn.execute('''
            SELECT COUNT(DISTINCT user_id) as count
            FROM (
                SELECT user_id, completed_at as activity_date FROM assessment_results
                WHERE completed_at >= datetime('now', '-30 days')
                UNION
                SELECT user_id, last_activity as activity_date FROM phase2_progress
                WHERE last_activity >= datetime('now', '-30 days')
            )
        ''').fetchone()
        
        daily_activity = conn.execute('''
            SELECT DATE(activity_date) as date, COUNT(DISTINCT user_id) as active_users
            FROM (
                SELECT user_id, completed_at as activity_date FROM assessment_results
                WHERE completed_at >= datetime('now', '-30 days')
                UNION
                SELECT user_id, last_activity as activity_date FROM phase2_progress
                WHERE last_activity >= datetime('now', '-30 days')
            )
            GROUP BY DATE(activity_date)
            ORDER BY date DESC
            LIMIT 30
        ''').fetchall()
        
        session_duration_dist = conn.execute('''
            SELECT 
                CASE 
                    WHEN time_taken < 300 THEN '0-5 min'
                    WHEN time_taken < 600 THEN '5-10 min'
                    WHEN time_taken < 1200 THEN '10-20 min'
                    WHEN time_taken < 1800 THEN '20-30 min'
                    ELSE '30+ min'
                END as duration_range,
                COUNT(*) as count
            FROM assessment_results
            WHERE time_taken IS NOT NULL
            GROUP BY duration_range
        ''').fetchall()
        
        # 3. Assessment Quality Insights
        ai_detection_stats = conn.execute('''
            SELECT 
                AVG(ai_usage_percentage) as avg_ai_usage,
                COUNT(CASE WHEN ai_usage_percentage > 30 THEN 1 END) as high_ai_count,
                COUNT(*) as total_assessments
            FROM assessment_results
            WHERE ai_usage_percentage IS NOT NULL
        ''').fetchone()
        
        score_distribution = conn.execute('''
            SELECT 
                CASE 
                    WHEN xp_earned < 200 THEN 'Low (0-199)'
                    WHEN xp_earned < 400 THEN 'Medium (200-399)'
                    WHEN xp_earned < 600 THEN 'High (400-599)'
                    ELSE 'Excellent (600+)'
                END as score_range,
                COUNT(*) as count
            FROM assessment_results
            GROUP BY score_range
        ''').fetchall()
        
        most_challenging_steps = conn.execute('''
            SELECT 
                step_id,
                COUNT(*) as attempts,
                COUNT(CASE WHEN step_completed = 1 THEN 1 END) as completions,
                ROUND(CAST(COUNT(CASE WHEN step_completed = 1 THEN 1 END) AS FLOAT) / COUNT(*) * 100, 1) as success_rate
            FROM phase2_progress
            GROUP BY step_id
            HAVING attempts > 0
            ORDER BY success_rate ASC
        ''').fetchall()
        
        # 4. Risk Identification
        at_risk_students = conn.execute('''
            SELECT 
                u.id, u.username, u.first_name, u.last_name,
                MAX(COALESCE(ar.completed_at, p2.last_activity, u.created_at)) as last_activity,
                COUNT(DISTINCT ar.id) as assessments_completed,
                COUNT(DISTINCT p2.step_id) as phase2_steps_attempted
            FROM users u
            LEFT JOIN assessment_results ar ON u.id = ar.user_id
            LEFT JOIN phase2_progress p2 ON u.id = p2.user_id
            WHERE u.is_admin = 0
            GROUP BY u.id, u.username, u.first_name, u.last_name
            HAVING last_activity < datetime('now', '-7 days') OR assessments_completed = 0
            ORDER BY last_activity ASC
            LIMIT 10
        ''').fetchall()
        
        stuck_students = conn.execute('''
            SELECT 
                u.id, u.username, u.first_name, u.last_name, p2.step_id,
                p2.started_at, p2.last_activity,
                CAST((julianday('now') - julianday(p2.last_activity)) AS INTEGER) as days_stuck
            FROM users u
            INNER JOIN phase2_progress p2 ON u.id = p2.user_id
            WHERE p2.step_completed = 0 
              AND p2.last_activity < datetime('now', '-3 days')
              AND u.is_admin = 0
            ORDER BY days_stuck DESC
            LIMIT 10
        ''').fetchall()
        
        # 5. System Health (basic metrics)
        recent_errors = conn.execute('''
            SELECT COUNT(*) as error_count
            FROM phase2_progress
            WHERE step_score = 0 AND started_at >= datetime('now', '-24 hours')
        ''').fetchone()
        
        total_sessions = conn.execute('''
            SELECT COUNT(DISTINCT session_id) as count FROM assessment_results
            WHERE completed_at >= datetime('now', '-7 days')
        ''').fetchone()
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': {
                'learning_progress': {
                    'cefr_distribution': [dict(row) for row in cefr_distribution],
                    'phase_completion': dict(phase_completion),
                    'avg_assessment_times': [dict(row) for row in avg_assessment_times]
                },
                'engagement': {
                    'active_users_7d': active_users_7d['count'],
                    'active_users_30d': active_users_30d['count'],
                    'daily_activity': [dict(row) for row in daily_activity],
                    'session_duration_dist': [dict(row) for row in session_duration_dist]
                },
                'quality': {
                    'ai_detection': dict(ai_detection_stats) if ai_detection_stats else {},
                    'score_distribution': [dict(row) for row in score_distribution],
                    'challenging_steps': [dict(row) for row in most_challenging_steps]
                },
                'risk': {
                    'at_risk_students': [dict(row) for row in at_risk_students],
                    'stuck_students': [dict(row) for row in stuck_students]
                },
                'system': {
                    'recent_errors': recent_errors['error_count'],
                    'total_sessions_7d': total_sessions['count']
                }
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting analytics data: {e}")
        return jsonify({'error': 'Error loading analytics data'}), 500

@app.route('/api/admin/users/<int:user_id>/details', methods=['GET'])
@login_required
def api_admin_user_details(user_id):
    """API endpoint for detailed user information"""
    admin_user_id = session.get('user_id')
    
    # Check if user is admin
    try:
        conn = db_manager.get_connection()
        admin_check = conn.execute(
            'SELECT is_admin FROM users WHERE id = ?', (admin_user_id,)
        ).fetchone()
        
        if not admin_check or not admin_check['is_admin']:
            conn.close()
            return jsonify({'error': 'Access denied. Admin privileges required.'}), 403
        
        # Get user details
        user = conn.execute('''
            SELECT id, username, email, first_name, last_name, created_at, last_login,
                   is_active, email_verified, preferred_language, timezone, role, is_admin
            FROM users WHERE id = ?
        ''', (user_id,)).fetchone()
        
        if not user:
            conn.close()
            return jsonify({'error': 'User not found'}), 404
        
        # Get user statistics from assessment_results
        user_assessments = conn.execute('''
            SELECT overall_level, xp_earned, completed_at, time_taken
            FROM assessment_results
            WHERE user_id = ?
            ORDER BY completed_at DESC
        ''', (user_id,)).fetchall()
        
        # Calculate user stats and add duration in minutes
        total_assessments = len(user_assessments)
        total_xp = sum(a['xp_earned'] for a in user_assessments if a['xp_earned'])
        latest_level = user_assessments[0]['overall_level'] if user_assessments else 'N/A'
        
        # Convert assessments to dict and add duration_minutes
        assessments_list = []
        for assessment in user_assessments:
            assessment_dict = dict(assessment)
            # Convert time_taken from seconds to minutes
            if assessment_dict['time_taken']:
                assessment_dict['duration_minutes'] = round(assessment_dict['time_taken'] / 60, 1)
            else:
                assessment_dict['duration_minutes'] = None
            assessments_list.append(assessment_dict)
        
        user_stats = {
            'total_assessments': total_assessments,
            'total_xp': total_xp,
            'latest_level': latest_level,
            'assessments': assessments_list
        }
        
        # Get Phase 2 progress
        phase2_progress = conn.execute('''
            SELECT step_id, step_completed, started_at
            FROM phase2_progress
            WHERE user_id = ?
            ORDER BY started_at DESC
        ''', (user_id,)).fetchall()
        
        # Check if Phase 2 is completed (all 4 steps completed)
        completed_steps = [p['step_id'] for p in phase2_progress if p['step_completed']]
        expected_steps = ['step_1', 'step_2', 'step_3', 'final_writing']
        phase2_completed = all(step in completed_steps for step in expected_steps)
        
        user_progress = {
            'phase2_steps': [dict(p) for p in phase2_progress],
            'phase2_completed': phase2_completed
        }
        
        conn.close()
        
        # Add phase2_completed to user data
        user_dict = dict(user)
        user_dict['phase2_completed'] = phase2_completed
        
        return jsonify({
            'success': True,
            'data': {
                'user': user_dict,
                'stats': user_stats,
                'progress': user_progress
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting user details: {e}")
        return jsonify({'error': 'Error loading user details'}), 500
        
if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('static/images/avatars', exist_ok=True)
    
    # Initialize audio files
    audio_service.initialize_audio_files()
    
    # Initialize database
    db_manager.init_database()
    
    app.run(debug=True, port=5010)
