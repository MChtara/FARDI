from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
import os
from dotenv import load_dotenv
import logging
from datetime import datetime, timedelta
from flask_session import Session

# Import our custom modules
from models.game_data import NPCS, DIALOGUE_QUESTIONS, CEFR_LEVELS, BADGES, ACHIEVEMENTS, PROGRESS_LEVELS
from services.ai_service import AIService
from services.audio_service import AudioService
from services.assessment_service import AssessmentService
from utils.helpers import (
    determine_overall_level, 
    skill_levels_from_assessments, 
    calculate_achievements, 
    calculate_xp
)

# Import authentication modules
from routes.auth_routes import auth_bp, db_manager, user_manager, assessment_history, login_required, guest_only

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "dev-secret-key")
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = os.path.join(os.path.dirname(__file__), 'sessions')
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)  # 30 days for "remember me"

os.makedirs('sessions', exist_ok=True)
Session(app)

# Initialize services
ai_service = AIService()
audio_service = AudioService()
assessment_service = AssessmentService()

# Register authentication blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

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
    return render_template('welcome.html')

@app.route('/home')
@login_required
def index():
    """Home page route with game introduction - requires login"""
    return render_template('index.html', npcs=NPCS)

@app.route('/dashboard')
@login_required
def dashboard():
    """User dashboard showing stats and recent assessments"""
    user_id = session.get('user_id')
    
    # Get user statistics
    user_stats = assessment_history.get_user_stats(user_id)
    recent_assessments = assessment_history.get_user_assessments(user_id, limit=5)
    
    # Get user data
    user_data = user_manager.get_user_by_id(user_id)
    
    return render_template('dashboard.html', 
                         user=user_data,
                         user_stats=user_stats, 
                         recent_assessments=recent_assessments)

@app.route('/start-game', methods=['POST'])
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
    """Main game page with interactive dialogue"""
    player_name = session.get('player_name', 'Player')
    current_step = session.get('current_step', 0)
    xp = session.get('xp', 0)

    # Check if game is completed
    if current_step >= len(DIALOGUE_QUESTIONS):
        return redirect(url_for('results'))

    # Get current question
    question_data = DIALOGUE_QUESTIONS[current_step]

    # Get current scene information
    scene = question_data.get('scene', 'meeting_room')
    scene_description = {
        'meeting_room': 'A bright conference room with a large table and chairs. Maps of Tunisia and cultural artifacts decorate the walls.',
        'coffee_break': 'A casual seating area with comfortable sofas and a coffee table. Committee members are chatting and enjoying refreshments.',
        'brainstorming_area': 'A creative space with whiteboards, sticky notes, and colorful markers. Ideas for the event are posted all around.',
        'creative_corner': 'A quiet area with inspirational posters and design materials, perfect for writing and creative tasks.'
    }.get(scene, 'A room at the university')

    # Get skill being assessed
    skill = question_data.get('skill', 'communication')
    skill_descriptions = {
        'self-expression': 'Ability to introduce yourself and express personal information',
        'reasoning': 'Ability to explain your thoughts and motivations',
        'world_knowledge': 'Knowledge about cultural topics and facts',
        'listening_comprehension': 'Ability to understand and process spoken language',
        'ideation': 'Creativity and ability to generate original ideas',
        'conversation': 'Social interaction skills and politeness',
        'strategic_thinking': 'Problem-solving abilities and forward planning',
        'abstract_thinking': 'Ability to discuss abstract concepts and ideas',
        'written_expression': 'Writing skills and ability to craft messages'
    }

    return render_template(
        'game.html',
        player_name=player_name,
        question=question_data,
        npcs=NPCS,
        current_step=current_step,
        total_steps=len(DIALOGUE_QUESTIONS),
        xp=xp,
        scene=scene,
        scene_description=scene_description,
        skill=skill,
        skill_description=skill_descriptions.get(skill, 'Communication skills')
    )

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

    return render_template(
        'results.html',
        player_name=player_name,
        responses=responses,
        assessments=assessments,
        overall_level=overall_level,
        level_description=level_description,
        cefr_levels=CEFR_LEVELS,
        achievements=ACHIEVEMENTS,
        achievements_earned=achievements_earned,
        xp=xp,
        badges=BADGES,
        progress_levels=progress_levels,
        skill_levels=skill_levels,
        ai_responses_count=ai_detected_count,
        responses_length=total_responses,
        ai_percentage=ai_percentage
    )

@app.route('/certificate')
@login_required
def certificate():
    """Generate a certificate of completion with CEFR level"""
    player_name = session.get('player_name', 'Player')
    overall_level = session.get('overall_level', determine_overall_level(session.get('assessments', [])))
    level_description = CEFR_LEVELS.get(overall_level, "")
    completion_date = datetime.now().strftime("%B %d, %Y")

    return render_template(
        'certificate.html',
        player_name=player_name,
        overall_level=overall_level,
        level_description=level_description,
        completion_date=completion_date
    )

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
    return redirect(url_for('index'))

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('static/images/avatars', exist_ok=True)
    
    # Initialize audio files
    audio_service.initialize_audio_files()
    
    # Initialize database
    db_manager.init_database()
    
    app.run(debug=True)