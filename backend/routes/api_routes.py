"""
API routes for the CEFR assessment game
"""
import random
import logging
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify
from services.ai_service import AIService
from services.audio_service import AudioService
from services.assessment_service import AssessmentService
from utils.helpers import get_challenges_by_level, get_tips_by_level, get_xp_reward_by_level
from models.game_data import NPCS
from utils.helpers import determine_overall_level, skill_levels_from_assessments, calculate_achievements
from models.game_data import CEFR_LEVELS, BADGES, ACHIEVEMENTS, PROGRESS_LEVELS
from models.game_data import PHASE_2_STEPS, PHASE_2_REMEDIAL_ACTIVITIES, PHASE_2_POINTS, PHASE_2_SUCCESS_THRESHOLD
from flask import session
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from routes.auth_routes import login_required, user_manager, assessment_history

logger = logging.getLogger(__name__)

def replace_player_placeholders(text, player_name=None):
    """Replace [Player] placeholders with actual player name"""
    if not player_name:
        player_name = session.get('player_name') or session.get('first_name') or session.get('username', 'Player')
    return text.replace('[Player]', player_name) if text else text

# Create blueprint for API routes
api_bp = Blueprint('api', __name__)

# Initialize services
ai_service = AIService()
audio_service = AudioService()
assessment_service = AssessmentService()

@api_bp.route('/results', methods=['GET'])
@login_required
def get_results():
    """Finalize current session results and return JSON mirroring the classic results page"""
    try:
        # Gather from session
        player_name = session.get('player_name', 'Player')
        assessments = session.get('assessments', [])
        responses = session.get('responses', [])
        start_time_str = session.get('start_time')
        xp = session.get('xp', 0)
        user_id = session.get('game_user_id') or session.get('user_id')

        # Check if user has completed any assessments
        if not assessments or len(assessments) == 0:
            return jsonify({"error": "No assessment data found. Please complete Phase 1 assessment first."}), 404

        # AI usage statistics
        total_responses = len(responses)
        ai_detected_count = sum(1 for r in responses if r.get('ai_generated', False))
        ai_percentage = round((ai_detected_count / total_responses * 100) if total_responses > 0 else 0)

        # Parse start time
        from datetime import datetime
        start_time = datetime.strptime(start_time_str, "%Y-%m-%d %H:%M:%S") if start_time_str else datetime.now()
        time_taken = (datetime.now() - start_time).total_seconds()

        # Determine overall CEFR level and skill levels
        overall_level = determine_overall_level(assessments)
        level_description = CEFR_LEVELS.get(overall_level, "Could not determine level")
        achievements_earned = calculate_achievements(assessments, start_time)
        skill_levels = skill_levels_from_assessments(assessments)

        # Progress levels unlock
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

        # Enrich responses with speaker (from DIALOGUE_QUESTIONS by step)
        try:
            from models.game_data import DIALOGUE_QUESTIONS
            step_map = {q.get('step'): q for q in DIALOGUE_QUESTIONS}
            for r in responses:
                st = r.get('step')
                if st in step_map and 'speaker' not in r:
                    r['speaker'] = step_map[st].get('speaker')
        except Exception:
            pass

        # Save assessment to DB
        import uuid, json
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
        assessment_session_id = str(uuid.uuid4())
        # Only attempt save if user_id available
        save_ok = False
        if user_id:
            save_ok = assessment_history.save_assessment(user_id, assessment_session_id, assessment_data)

        # Mark completed
        session['phase1_completed'] = True
        session['overall_level'] = overall_level
        session.modified = True

        return jsonify({
            'player_name': player_name,
            'assessments': assessments,
            'responses': responses,
            'overall_level': overall_level,
            'level_description': level_description,
            'cefr_levels': CEFR_LEVELS,
            'achievements': ACHIEVEMENTS,
            'achievements_earned': achievements_earned,
            'xp': xp,
            'badges': BADGES,
            'progress_levels': progress_levels,
            'skill_levels': skill_levels,
            'ai_responses_count': ai_detected_count,
            'responses_length': total_responses,
            'ai_percentage': ai_percentage,
            'saved': bool(save_ok),
            'session_id': assessment_session_id
        })
    except Exception as e:
        logger.error(f"Error building results: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/game/state', methods=['GET'])
@login_required
def get_game_state():
    try:
        from flask import session
        from models.game_data import DIALOGUE_QUESTIONS, NPCS
        current_step = session.get('current_step', 0)
        total_steps = len(DIALOGUE_QUESTIONS)
        xp = session.get('xp', 0)
        if current_step >= total_steps:
            return jsonify({
                'completed': True,
                'current_step': current_step,
                'total_steps': total_steps,
                'xp': xp
            })
        q = DIALOGUE_QUESTIONS[current_step]
        # Only include safe fields
        question = {
            'step': q.get('step'),
            'speaker': q.get('speaker'),
            'question': q.get('question'),
            'instruction': q.get('instruction'),
            'type': q.get('type'),
            'skill': q.get('skill'),
            'scene': q.get('scene'),
            'audio_cue': q.get('audio_cue')
        }

        # Scene and skill descriptions to match classic view
        scene = q.get('scene', 'meeting_room')
        scene_description = {
            'meeting_room': 'A bright conference room with a large table and chairs. Maps of Tunisia and cultural artifacts decorate the walls.',
            'coffee_break': 'A casual seating area with comfortable sofas and a coffee table. Committee members are chatting and enjoying refreshments.',
            'brainstorming_area': 'A creative space with whiteboards, sticky notes, and colorful markers. Ideas for the event are posted all around.',
            'creative_corner': 'A quiet area with inspirational posters and design materials, perfect for writing and creative tasks.'
        }.get(scene, 'A room at the university')

        skill = q.get('skill', 'communication')
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

        # Speaker details
        speaker = q.get('speaker')
        npc = NPCS.get(speaker, {})
        speaker_role = npc.get('role')
        speaker_avatar = npc.get('avatar')

        # Audio URL for listening
        audio_url = None
        if q.get('audio_cue'):
            audio_url = f"/static/audio/{q.get('audio_cue')}"

        return jsonify({
            'completed': False,
            'current_step': current_step,
            'total_steps': total_steps,
            'xp': xp,
            'question': question,
            'npcs': list(NPCS.keys()),
            'scene_description': scene_description,
            'skill_description': skill_descriptions.get(skill, 'Communication skills'),
            'speaker_role': speaker_role,
            'speaker_avatar': speaker_avatar,
            'audio_url': audio_url
        })
    except Exception as e:
        logger.error(f"Error in get_game_state: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/game/submit', methods=['POST'])
@login_required
def api_submit_response():
    try:
        data = request.get_json(silent=True) or {}
        response_text = data.get('response', '')
        question_type = data.get('question_type', '')
        if not response_text:
            return jsonify({"error": "Response is required"}), 400

        current_step = session.get('current_step', 0)
        from models.game_data import DIALOGUE_QUESTIONS
        if current_step >= len(DIALOGUE_QUESTIONS):
            return jsonify({"message": "completed"})

        question_data = DIALOGUE_QUESTIONS[current_step]
        question_text = question_data['question']

        # AI detection
        is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response_text)
        if is_ai and ai_score > 0.5:
            return jsonify({
                "error": "AI content detected",
                "message": f"AI content detected ({ai_score:.0%}). Please provide your own authentic response.",
                "ai_score": ai_score,
                "ai_reasons": ai_reasons
            }), 400

        # Store response in session
        responses = session.get('responses', [])
        responses.append({
            "step": current_step + 1,
            "question": question_text,
            "response": response_text,
            "type": question_type or question_data.get('type'),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ai_generated": is_ai,
            "ai_score": ai_score,
            "ai_reasons": ai_reasons
        })
        session['responses'] = responses

        # Assess
        assessment = assessment_service.assess_response(question_text, response_text, question_type or question_data.get('type'))
        assessment["type"] = question_type or question_data.get('type')
        assessment["step"] = current_step + 1
        assessment["ai_generated"] = is_ai
        assessment["ai_score"] = ai_score
        assessment["ai_reasons"] = ai_reasons

        assessments = session.get('assessments', [])
        assessments.append(assessment)
        session['assessments'] = assessments

        # XP calc
        xp_earned = question_data.get('xp_reward', 10)
        level_multipliers = {"A1": 1.0, "A2": 1.2, "B1": 1.5, "B2": 1.8, "C1": 2.0}
        xp_earned = int(xp_earned * level_multipliers.get(assessment.get('level', 'B1'), 1.0))
        session['xp'] = session.get('xp', 0) + xp_earned

        session['current_step'] = current_step + 1
        session.modified = True

        return jsonify({
            "success": True,
            "xp_earned": xp_earned,
            "assessment": assessment
        })
    except Exception as e:
        logger.error(f"Error in api_submit_response: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/get-ai-feedback', methods=['POST'])
@login_required
def get_ai_feedback():
    """API endpoint to get AI feedback on a response with detailed language assessment"""
    data = request.json
    question = data.get('question', '')
    response = data.get('response', '')
    speaker = data.get('speaker', 'Ms. Mabrouki')
    question_type = data.get('type', '')
    
    # Check if the response was generated by AI using Sapling
    is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response)
    
    # First, run a quick assessment to identify level and issues
    quick_assessment = assessment_service.assess_response(question, response, question_type)
    level = quick_assessment.get('level', 'B1')
    strengths = quick_assessment.get('specific_strengths', [])
    improvements = quick_assessment.get('specific_areas_for_improvement', [])
    
    # Add information about AI detection if necessary
    if is_ai:
        improvements = ["Your response appears to use AI-generated patterns"] + improvements
    
    # Create a coaching prompt based on assessment
    coaching_notes = ""
    if strengths and improvements:
        coaching_notes = f"""
        This response is approximately at CEFR level {level}.
        
        Strengths: {', '.join(strengths[:2])}
        
        Areas for improvement: {', '.join(improvements[:2])}
        
        {'This response shows characteristics typical of AI-generated content. ' if is_ai else ''}
        
        Give encouraging feedback that acknowledges these strengths and provides one brief suggestion related to the top area for improvement. Make it sound natural and conversational.
        """
    else:
        coaching_notes = f"""
        This response is approximately at CEFR level {level}.
        
        {'This response shows characteristics typical of AI-generated content. ' if is_ai else ''}
        
        Give encouraging feedback appropriate for this level. If it's a lower level (A1-A2), focus on praising their effort and encourage more vocabulary. If it's a mid level (B1), suggest using more complex sentences. If it's a higher level (B2-C1), praise their sophistication and encourage continuing this level of expression.
        """
    
    # Create a prompt based on the question, response and coaching notes
    prompt = f"""
    As {speaker}, you are providing feedback to a student in an English language learning game.

    Student's response to: "{question}"

    Their response: "{response}"

    {coaching_notes}

    CRITICAL FEEDBACK REQUIREMENTS:
    - Always check for basic capitalization errors, especially "i" instead of "I"
    - Check for inappropriate contractions in formal contexts
    - Point out professional English standards when needed
    - Use formal English in your own response (I am, do not, cannot - NO contractions)

    SPECIFIC ERRORS TO ALWAYS CATCH:
    - "i" instead of "I" → Must be corrected every time
    - Missing capitalization at sentence beginnings
    - Informal contractions in formal contexts: "i'm" → "I am", "don't" → "do not", "can't" → "cannot", "won't" → "will not", "shouldn't" → "should not", "couldn't" → "could not", "wouldn't" → "would not"
    - Missing punctuation

    IMPORTANT: Your response MUST BE IN ENGLISH ONLY, even if the student wrote in another language. This is an English language learning application.

    Your response should:
    1. Stay completely in character as {speaker}
    2. Be encouraging and supportive
    3. Be concise (2-3 sentences)
    4. ALWAYS correct "i" to "I" and contractions if you see these errors
    5. Include one brief, specific suggestion for improvement focusing on professional English
    6. Model correct formal English in your own response (use "I am", "do not", "cannot" etc.)
    7. End with a natural segue to the next part of the conversation
    8. ALWAYS RESPOND IN ENGLISH ONLY, regardless of what language the student used

    EXAMPLE CORRECTIONS:
    - If student writes "i am fine" → Say "Remember to always capitalize 'I' - it should be 'I am fine'"
    - If student writes "i'm happy" → Say "Great! Just remember to capitalize 'I' and use 'I am' instead of 'I'm' for more formal writing"
    - If student writes "i don't know" → Say "Good effort! Remember to capitalize 'I' and use 'do not' instead of 'don't' - so 'I do not know'"
    """
    
    ai_response = ai_service.get_ai_response(prompt, speaker)
    
    # Also return assessment data for UI features
    return jsonify({
        "ai_response": ai_response,
        "assessment": {
            "level": level,
            "strengths": strengths[:2] if strengths else [],
            "improvements": improvements[:2] if improvements else [],
            "ai_generated": is_ai,
            "ai_score": ai_score,
            "ai_reasons": ai_reasons[:3] if ai_reasons else []
        }
    })

@api_bp.route('/language-tips', methods=['GET'])
@login_required
def language_tips():
    """API endpoint to get personalized language tips based on assessment history"""
    level = request.args.get('level', 'B1')

    # Get tips appropriate for the user's level
    selected_tips = get_tips_by_level(level)

    # Randomly select 2 tips to return
    tips_to_show = random.sample(selected_tips, min(2, len(selected_tips)))

    return jsonify({
        "level": level,
        "tips": tips_to_show
    })

@api_bp.route('/next-challenge', methods=['GET'])
@login_required
def next_challenge():
    """API endpoint to get a bonus challenge based on the user's current level"""
    level = request.args.get('level', 'B1')

    # Get challenges for the selected level
    selected_challenges = get_challenges_by_level(level)

    # Randomly select a challenge
    challenge = random.choice(selected_challenges)
    xp_reward = get_xp_reward_by_level(level)

    return jsonify({
        "level": level,
        "challenge": challenge,
        "xp_reward": xp_reward
    })

@api_bp.route('/check-ai-response', methods=['POST'])
@login_required
def check_ai_response():
    """API endpoint to check if a response is AI-generated before submission"""
    try:
        data = request.json
        response_text = data.get('response', '')
        
        logger.info(f"Checking AI for text: {response_text[:100]}...")
        
        if len(response_text.strip()) < 20:
            return jsonify({
                "is_ai": False,
                "score": 0,
                "message": "Response too short for AI detection",
                "reasons": []
            })
        
        # Use AI service to check for AI-generated content
        is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response_text)
        
        logger.info(f"AI Detection result - is_ai: {is_ai}, score: {ai_score}")
        
        return jsonify({
            "is_ai": is_ai,
            "score": ai_score,
            "message": f"AI detection score: {ai_score:.0%}",
            "reasons": ai_reasons[:3] if ai_reasons else []
        })
        
    except Exception as e:
        logger.error(f"ERROR in check_ai_response: {str(e)}")
        return jsonify({
            "is_ai": False,
            "score": 0,
            "message": "Error in AI detection",
            "reasons": []
        }), 200  # Return 200 to allow continuation in case of error

@api_bp.route('/generate-audio', methods=['POST'])
@login_required
def api_generate_audio():
    """API endpoint to generate audio from text using Edge TTS"""
    data = request.json
    text = data.get('text', '')
    voice = data.get('voice', 'en-US-ChristopherNeural')
    filename = data.get('filename', f'custom_{int(datetime.now().timestamp())}.mp3')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        audio_url = audio_service.generate_custom_audio(text, filename, voice)
        return jsonify({
            "success": True,
            "audio_url": audio_url
        })
    except Exception as e:
        logger.error(f"Error generating audio: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api_bp.route('/phase2/submit-response', methods=['POST'])
@login_required
def submit_phase2_response():
    """Submit a Phase 2 response and get assessment"""
    try:
        data = request.json
        step_id = data.get('step_id')
        action_item_id = data.get('action_item_id')
        response_text = data.get('response', '')
        
        logger.info(f"Phase 2 submission - Step: {step_id}, Item: {action_item_id}")
        
        # Validate input
        if not all([step_id, action_item_id, response_text]):
            return jsonify({"error": "Missing required fields"}), 400
        
        if step_id not in PHASE_2_STEPS:
            return jsonify({"error": "Invalid step ID"}), 400
        
        # Check for AI-generated content
        is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response_text)
        
        if is_ai and ai_score > 0.5:
            return jsonify({
                "error": "AI content detected",
                "message": f"AI content detected ({ai_score:.0%}). Please provide your own authentic response.",
                "ai_score": ai_score,
                "ai_reasons": ai_reasons
            }), 400
        
        # Assess the response
        assessment = assessment_service.assess_phase2_response(step_id, action_item_id, response_text)
        
        # Create phase2_session_id if it doesn't exist
        if 'phase2_session_id' not in session:
            session['phase2_session_id'] = str(uuid.uuid4())
        
        # Store in session
        session_key = f"phase2_{step_id}_{action_item_id}"
        
        if 'phase2_responses' not in session:
            session['phase2_responses'] = {}
        if 'phase2_assessments' not in session:
            session['phase2_assessments'] = {}
        
        session['phase2_responses'][session_key] = {
            'response': response_text,
            'timestamp': datetime.now().isoformat(),
            'ai_generated': is_ai,
            'ai_score': ai_score
        }
        
        session['phase2_assessments'][session_key] = assessment
        session.modified = True
        
        # Save to database
        try:
            from flask import session as flask_session
            user_id = flask_session.get('user_id')
            phase2_session_id = session['phase2_session_id']
            
            response_data = {
                'response_text': response_text,
                'assessment_data': assessment,
                'points_earned': assessment.get('points', 1),
                'cefr_level': assessment.get('cefr_level', 'A1'),
                'ai_detected': is_ai,
                'ai_score': ai_score
            }
            
            # Save response to database
            user_manager.save_phase2_response(
                user_id, phase2_session_id, step_id, action_item_id, response_data
            )
            
            logger.info(f"Phase 2 response saved to database for user {user_id}")
            
        except Exception as db_error:
            logger.error(f"Failed to save Phase 2 response to database: {str(db_error)}")
            # Continue anyway since session data is saved
        
        # Determine progression logic
        step_data = PHASE_2_STEPS[step_id]
        action_items = step_data['action_items']
        
        # Find current action item index
        current_index = 0
        for i, item in enumerate(action_items):
            if item['id'] == action_item_id:
                current_index = i
                break
        
        # Check if this is the last action item in the step
        is_last_item = current_index >= len(action_items) - 1
        next_action_item = None
        
        if not is_last_item:
            next_action_item = action_items[current_index + 1]
        
        # Determine what should happen next
        if is_last_item:
            # Last item in step - check step completion
            total_items = len(action_items)
            completed_items = 0
            total_score = 0
            
            assessments = session.get('phase2_assessments', {})
            for item in action_items:
                session_key = f"phase2_{step_id}_{item['id']}"
                if session_key in assessments:
                    completed_items += 1
                    assessment_data = assessments[session_key]
                    level = assessment_data.get('level', 'A1')
                    total_score += PHASE_2_POINTS.get(level, 1)
            
            needs_remedial = total_score < PHASE_2_SUCCESS_THRESHOLD
            
            if needs_remedial:
                user_level = determine_phase2_user_level(total_score)
                next_action = "remedial_activities"
                next_url = f"/app/phase2/remedial/{step_id}/{user_level}"
                message = f"Good work! Let's strengthen your skills with some practice activities before moving forward."
            else:
                next_step = get_next_phase2_step(step_id)
                if next_step:
                    next_action = "next_step"
                    next_url = f"/app/phase2/step/{next_step}"
                    message = f"Excellent! You've completed this step. Ready for the next challenge?"
                else:
                    next_action = "phase2_complete"
                    next_url = "/app/phase2/complete"
                    message = "🎉 Congratulations! You've completed Phase 2!"
        else:
            # Move to next action item in same step
            next_action = "next_action_item"
            next_url = f"/app/phase2/step/{step_id}"
            message = "Great response! Let's continue with the next part."
        
        return jsonify({
            "success": True,
            "assessment": assessment,
            "points_earned": assessment.get('points', 1),
            "message": message,
            "progression": {
                "next_action": next_action,
                "next_url": next_url,
                "is_last_item": is_last_item,
                "next_action_item": next_action_item,
                "current_index": current_index,
                "total_items": len(action_items)
            }
        })
        
    except Exception as e:
        logger.error(f"Error in Phase 2 response submission: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/get-step-state', methods=['GET'])
@login_required
def get_phase2_step_state():
    """Get current state of a Phase 2 step"""
    try:
        step_id = request.args.get('step_id')
        
        if not step_id or step_id not in PHASE_2_STEPS:
            return jsonify({"error": "Invalid step ID"}), 400
        
        step_data = PHASE_2_STEPS[step_id]
        action_items = step_data['action_items']
        
        # Find current action item based on completed responses
        assessments = session.get('phase2_assessments', {})
        current_index = 0
        
        # Find the first uncompleted action item
        for i, item in enumerate(action_items):
            session_key = f"phase2_{step_id}_{item['id']}"
            if session_key not in assessments:
                current_index = i
                break
            current_index = i + 1  # If all are completed, this will be len(action_items)
        
        # Ensure we don't go beyond the available items
        if current_index >= len(action_items):
            current_index = len(action_items) - 1
        
        current_action_item = action_items[current_index] if current_index < len(action_items) else None
        
        # Calculate progress
        completed_responses = sum(1 for item in action_items 
                                if f"phase2_{step_id}_{item['id']}" in assessments)
        
        is_step_complete = completed_responses >= len(action_items)
        
        return jsonify({
            "step_id": step_id,
            "step_title": step_data['title'],
            "step_description": step_data['description'],
            "scenario": step_data['scenario'],
            "current_index": current_index,
            "current_action_item": current_action_item,
            "total_items": len(action_items),
            "completed_items": completed_responses,
            "is_step_complete": is_step_complete,
            "progress_percentage": round((completed_responses / len(action_items)) * 100)
        })
        
    except Exception as e:
        logger.error(f"Error getting Phase 2 step state: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/check-step-completion', methods=['POST'])
@login_required
def check_phase2_step_completion():
    """Check if a Phase 2 step is completed and determine next action"""
    try:
        data = request.json
        step_id = data.get('step_id')
        
        if step_id not in PHASE_2_STEPS:
            return jsonify({"error": "Invalid step ID"}), 400
        
        step_data = PHASE_2_STEPS[step_id]
        total_items = len(step_data['action_items'])
        
        # Count completed responses and calculate score
        assessments = session.get('phase2_assessments', {})
        completed_items = 0
        total_score = 0
        
        for i in range(total_items):
            action_item = step_data['action_items'][i]
            session_key = f"phase2_{step_id}_{action_item['id']}"
            
            if session_key in assessments:
                completed_items += 1
                assessment = assessments[session_key]
                level = assessment.get('level', 'A1')
                total_score += PHASE_2_POINTS.get(level, 1)
        
        # Check if step is complete
        step_complete = completed_items >= total_items
        
        if not step_complete:
            return jsonify({
                "step_complete": False,
                "completed_items": completed_items,
                "total_items": total_items,
                "next_action": "continue_step"
            })
        
        # Step is complete, check if remedial activities needed
        needs_remedial = total_score < PHASE_2_SUCCESS_THRESHOLD
        
        # Save step completion to database
        try:
            from flask import session as flask_session
            user_id = flask_session.get('user_id')
            phase2_session_id = session.get('phase2_session_id', str(uuid.uuid4()))
            
            progress_data = {
                'current_item': completed_items,
                'total_items': total_items,
                'step_score': total_score,
                'step_completed': True,
                'needs_remedial': needs_remedial,
                'remedial_level': determine_phase2_user_level(total_score) if needs_remedial else None,
                'completed_at': datetime.now().isoformat()
            }
            
            user_manager.save_phase2_progress(user_id, phase2_session_id, step_id, progress_data)
            logger.info(f"Phase 2 step {step_id} completion saved to database for user {user_id}")
            
        except Exception as db_error:
            logger.error(f"Failed to save Phase 2 step completion to database: {str(db_error)}")
        
        if needs_remedial:
            user_level = determine_phase2_user_level(total_score)
            
            return jsonify({
                "step_complete": True,
                "needs_remedial": True,
                "total_score": total_score,
                "threshold": PHASE_2_SUCCESS_THRESHOLD,
                "user_level": user_level,
                "next_action": "remedial_activities",
                "remedial_url": f"/app/phase2/remedial/{step_id}/{user_level}"
            })
        else:
            next_step = get_next_phase2_step(step_id)
            
            return jsonify({
                "step_complete": True,
                "needs_remedial": False,
                "total_score": total_score,
                "success": True,
                "next_action": "next_step" if next_step else "phase2_complete",
                "next_step": next_step,
                "next_url": f"/app/phase2/step/{next_step}" if next_step else "/app/phase2/complete"
            })
            
    except Exception as e:
        logger.error(f"Error checking step completion: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# ===== PHASE 2 REMEDIAL HELPER FUNCTIONS =====

def get_next_remedial_level(current_level):
    """Get the next CEFR level in sequential progression (A1 → A2 → B1)"""
    level_order = ['A1', 'A2', 'B1']
    try:
        current_index = level_order.index(current_level)
        if current_index < len(level_order) - 1:
            return level_order[current_index + 1]
    except ValueError:
        logger.warning(f"Invalid level: {current_level}")
    return None

def check_level_completion(session, step_id, level):
    """Check if all exercises in a level are completed"""
    completed_key = f"{step_id}_{level}_completed"
    completed_activities = session.get('phase2_level_completed', {}).get(completed_key, [])

    # Get total activities for this level
    remedial_activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
    total_activities = len(remedial_activities)

    logger.info(f"Level completion check: {step_id}/{level} - {len(completed_activities)}/{total_activities} completed: {completed_activities}")

    # Check if all activities (0, 1, 2, 3) are completed
    return len(completed_activities) >= total_activities

def mark_activity_completed(session, step_id, level, activity_index):
    """Mark an activity as completed in the session"""
    if 'phase2_level_completed' not in session:
        session['phase2_level_completed'] = {}
    
    completed_key = f"{step_id}_{level}_completed"
    if completed_key not in session['phase2_level_completed']:
        session['phase2_level_completed'][completed_key] = []
    
    if activity_index not in session['phase2_level_completed'][completed_key]:
        session['phase2_level_completed'][completed_key].append(activity_index)
        session.modified = True
        logger.info(f"Marked {level} activity {activity_index} as completed for step {step_id}")

def get_current_level_for_step(session, step_id, initial_level):
    """Get the current level for a step, or initialize it"""
    if 'phase2_current_level' not in session:
        session['phase2_current_level'] = {}
    
    if step_id not in session['phase2_current_level']:
        session['phase2_current_level'][step_id] = initial_level
        session.modified = True
    
    return session['phase2_current_level'][step_id]

def set_current_level_for_step(session, step_id, level):
    """Set the current level for a step"""
    if 'phase2_current_level' not in session:
        session['phase2_current_level'] = {}
    
    session['phase2_current_level'][step_id] = level
    session.modified = True
    logger.info(f"Set current level for step {step_id} to {level}")
    

@api_bp.route('/phase2/submit-remedial', methods=['POST'])
@login_required
def submit_remedial_activity():
    """Submit a remedial activity response"""
    try:
        data = request.json
        step_id = data.get('step_id')
        level = data.get('level')
        activity_id = data.get('activity_id')
        responses = data.get('responses', {})
        score = data.get('score', 0)
        
        logger.info(f"Remedial submission - Step: {step_id}, Level: {level}, Activity: {activity_id}")
        
        # Validate input
        if not all([step_id, level, activity_id]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Get activity data
        remedial_activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
        
        if not remedial_activities:
            return jsonify({"error": "No remedial activities found"}), 400
        
        # Find current activity
        current_activity = None
        activity_index = 0
        
        for i, activity in enumerate(remedial_activities):
            if activity['id'] == activity_id:
                current_activity = activity
                activity_index = i
                break
        
        if not current_activity:
            return jsonify({"error": "Activity not found"}), 400
        
        # Initialize gamification XP service
        from services.xp_service import XPService
        from routes.auth_routes import db_manager
        xp_service = XPService(db_manager.get_connection())
        user_id = session.get('user_id')

        
        # Store remedial response in database
        from routes.auth_routes import assessment_history
        
        user_id = session.get('user_id')
        session_id = session.get('phase2_session_id')
        
        # Create phase2_session_id if it doesn't exist
        if not session_id:
            session_id = str(uuid.uuid4())
            session['phase2_session_id'] = session_id
            session.modified = True
        
        activity_data = {
            'activity_id': activity_id,
            'activity_index': activity_index,
            'responses': responses,
            'score': score,
            'max_score': current_activity.get('success_threshold', 6),
            'completed': False  # Will be updated below based on success
        }
        
        # Store remedial response in session for backward compatibility
        session_key = f"remedial_{step_id}_{level}_{activity_id}"

        if 'phase2_remedial_responses' not in session:
            session['phase2_remedial_responses'] = {}

        session['phase2_remedial_responses'][session_key] = {
            'responses': responses,
            'score': score,
            'timestamp': datetime.now().isoformat()
        }

        # Track progression per level: store highest completed activity index for each level
        if 'phase2_level_progress' not in session:
            session['phase2_level_progress'] = {}

        # Key format: "step_id_level" → stores highest completed activity index
        progress_key = f"{step_id}_{level}"

        # Update highest completed activity index for this level
        current_highest = session['phase2_level_progress'].get(progress_key, -1)
        if activity_index > current_highest:
            session['phase2_level_progress'][progress_key] = activity_index
            logger.info(f"Updated progress for {level}: highest completed activity = {activity_index}")
        
        
        # ===== SEQUENTIAL LEVEL PROGRESSION SYSTEM =====
        # New logic: Students must complete ALL 4 exercises at current level before advancing
        # Progression: A1 (all 4) → A2 (all 4) → B1 (all 4) → Next Step
        
        max_score = current_activity.get('success_threshold', 6)
        passing_threshold = int(max_score * 0.50)  # 50% to pass
        
        # Determine if activity passed (50% threshold)
        activity_passed = score >= passing_threshold
        
        logger.info(f"=== SEQUENTIAL PROGRESSION LOGIC ===")
        logger.info(f"Current: {level} Activity {activity_index}, Score: {score}/{max_score}, Passed: {activity_passed}")
        
        # Update activity data with completion status and save to database
        activity_data['completed'] = activity_passed
        activity_data['performance_level'] = level  # Keep student at current level
        assessment_history.save_phase2_remedial(user_id, session_id, step_id, level, activity_data)
        
        # Ensure we're tracking the correct level (in case URL level differs from session level)
        current_level = get_current_level_for_step(session, step_id, level)
        
        # Check if there are more activities in current level
        next_activity_index = activity_index + 1
        is_last_activity_in_level = activity_index >= len(remedial_activities) - 1
        
        # Case 1: Score too low (< 50%) → Retry same activity
        if not activity_passed:
            return jsonify({
                "success": False,
                "activity_passed": False,
                "score": score,
                "threshold": max_score,
                "passing_score": passing_threshold,
                "message": f"💪 You scored {score}/{max_score}. You need at least {passing_threshold} to pass. Let's try again!",
                "next_action": "retry",
                "next_url": f"/app/phase2/remedial/{step_id}/{current_level}?activity={activity_index}",
                "score_feedback": f"You need {passing_threshold - score} more correct answers to pass this exercise.",
                "encouragement": "Don't worry - learning takes practice. Review the instructions and try again!"
            })
        
        # Activity passed! Mark it as completed
        mark_activity_completed(session, step_id, current_level, activity_index)
        
        # Award XP for completing remedial activity
        xp_data = None
        try:
            # Determine if perfect score
            is_perfect = score >= max_score
            
            # Award XP based on level
            activity_type = f"remedial_{current_level}_completed"
            xp_result = xp_service.award_activity_xp(
                user_id=user_id,
                activity_type=activity_type,
                activity_id=f"{step_id}_{activity_id}",
                is_perfect=is_perfect,
                is_first_try=activity_index == 0,  # First activity in level
                speed_bonus=False  # Could add timing logic later
            )
            
            xp_data = {
                "xp_awarded": xp_result.get("total_xp_awarded", 0),
                "level_up": xp_result.get("progression", {}).get("leveled_up", False),
                "new_level": xp_result.get("progression", {}).get("current_level", 1),
                "total_xp": xp_result.get("progression", {}).get("total_xp", 0)
            }
            
            logger.info(f"Awarded {xp_data['xp_awarded']} XP for {activity_type} (perfect: {is_perfect})")
            
        except Exception as xp_error:
            logger.error(f"Failed to award XP for remedial activity: {str(xp_error)}")
            # Continue without XP if gamification fails
            xp_data = {"xp_awarded": 0, "level_up": False}
        
        # Case 2: Not last activity in level → Continue to next activity in same level
        if not is_last_activity_in_level:
            next_activity = remedial_activities[next_activity_index]
            completed_count = len(session.get('phase2_level_completed', {}).get(f"{step_id}_{current_level}_completed", []))
            
            response_data = {
                "success": True,
                "activity_passed": True,
                "remedial_complete": False,
                "score": score,
                "threshold": max_score,
                "passing_score": passing_threshold,
                "message": f"✅ Great! Let's continue with {current_level} exercise {next_activity_index + 1} of {len(remedial_activities)}.",
                "next_action": "next_activity",
                "next_url": f"/app/phase2/remedial/{step_id}/{current_level}?activity={next_activity_index}",
                "progress_update": f"Completed {completed_count}/{len(remedial_activities)} exercises in {current_level} level",
                "current_level": current_level,
                "level_progress": f"{completed_count}/{len(remedial_activities)}"
            }
            
            # Add XP data if available
            if xp_data:
                response_data["xp_data"] = xp_data
            
            return jsonify(response_data)
        
        # Case 3: Last activity in level AND passed → Check overall performance
        # Calculate overall score across all 4 activities
        overall_score = 0
        overall_max_score = 0

        for i, activity in enumerate(remedial_activities):
            activity_key = f"remedial_{step_id}_{level}_{activity['id']}"
            saved_response = session.get('phase2_remedial_responses', {}).get(activity_key, {})
            activity_score = saved_response.get('score', 0)
            activity_max = activity.get('success_threshold', 6)

            overall_score += activity_score
            overall_max_score += activity_max

            logger.info(f"Activity {i}: Score {activity_score}/{activity_max}")

        overall_percentage = (overall_score / overall_max_score * 100) if overall_max_score > 0 else 0
        logger.info(f"Overall performance: {overall_score}/{overall_max_score} ({overall_percentage:.1f}%)")

        # Check if user has already been warned about low performance
        revisit_warning_key = f"revisit_warning_{step_id}_{level}"
        has_been_warned = session.get(revisit_warning_key, False)

        # If overall score < 50% AND not yet warned, show warning message
        if overall_percentage < 50 and not has_been_warned:
            # Mark that we've shown the warning
            session[revisit_warning_key] = True
            session.modified = True

            return jsonify({
                "success": True,
                "activity_passed": True,
                "overall_performance_low": True,
                "score": score,
                "threshold": max_score,
                "overall_score": overall_score,
                "overall_max_score": overall_max_score,
                "overall_percentage": round(overall_percentage, 1),
                "message": f"⚠️ You've completed all activities, but your overall score is {overall_score}/{overall_max_score} ({overall_percentage:.0f}%). You need to revisit the activities where you made the most mistakes to improve.",
                "next_action": "revisit_activities",
                "next_url": f"/app/phase2/remedial/{step_id}/{current_level}?activity=0",
                "recommendation": "Review activities 0-3 and try to improve your answers. Aim for at least 50% overall to progress.",
                "xp_data": xp_data if xp_data else {"xp_awarded": 0, "level_up": False}
            })

        # If overall score < 50% BUT already warned, force progression with a different message
        if overall_percentage < 50 and has_been_warned:
            logger.info(f"User already warned about low performance, allowing progression")
            # Clear the warning flag for next level
            session[revisit_warning_key] = False
            session.modified = True

        # Overall performance is good (>= 50%) OR user has already been warned, check level completion
        # First, ensure all passed activities in this level are marked as completed
        # Check BOTH session and database for scores
        logger.info(f"=== CHECKING ALL ACTIVITIES FOR {step_id}/{level} ===")

        # Get scores from database as well
        user_id = session.get('user_id')
        db_progress = assessment_history.get_phase2_progress(user_id) if user_id else {'remedial_activities': []}

        logger.info(f"Session phase2_remedial_responses keys: {list(session.get('phase2_remedial_responses', {}).keys())}")

        for i, activity in enumerate(remedial_activities):
            activity_key = f"remedial_{step_id}_{level}_{activity['id']}"
            activity_id = activity['id']

            # Check session first
            saved_response = session.get('phase2_remedial_responses', {}).get(activity_key, {})
            activity_score = saved_response.get('score', 0)

            # If not in session, check database
            if activity_score == 0:
                for db_activity in db_progress.get('remedial_activities', []):
                    if (db_activity.get('step_id') == step_id and
                        db_activity.get('level') == level and
                        db_activity.get('activity_id') == activity_id):
                        activity_score = db_activity.get('score', 0)
                        logger.info(f"  Found score in database: {activity_score}")
                        break

            activity_threshold = activity.get('success_threshold', 6)
            activity_passing = int(activity_threshold * 0.50)

            logger.info(f"Activity {i} ({activity_id}): score={activity_score}, threshold={activity_threshold}, passing={activity_passing}")

            # If this activity was passed (score >= 50% of threshold), mark it as completed
            if activity_score >= activity_passing:
                mark_activity_completed(session, step_id, current_level, i)
                logger.info(f"  -> Activity {i} PASSED and marked as completed")
            else:
                logger.info(f"  -> Activity {i} NOT PASSED")

        level_complete = check_level_completion(session, step_id, current_level)
        logger.info(f"Final level completion for {step_id}/{current_level}: {level_complete}")

        if level_complete:
            # All exercises in current level completed! Try to advance to next level
            next_level = get_next_remedial_level(current_level)
            
            if next_level:
                # Check if next level exists in remedial activities
                next_level_activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(next_level, [])
                
                if next_level_activities:
                    # Advance to next level, starting at activity 0
                    set_current_level_for_step(session, step_id, next_level)
                    
                    return jsonify({
                        "success": True,
                        "activity_passed": True,
                        "level_complete": True,
                        "remedial_complete": False,
                        "score": score,
                        "threshold": max_score,
                        "passing_score": passing_threshold,
                        "message": f"🎉 Excellent! You've completed all {current_level} exercises. Moving to {next_level} level!",
                        "next_action": "level_advance",
                        "next_url": f"/app/phase2/remedial/{step_id}/{next_level}?activity=0",
                        "previous_level": current_level,
                        "current_level": next_level,
                        "celebration": True,
                        "progress_update": f"Advanced from {current_level} to {next_level}",
                        "xp_data": xp_data if xp_data else {"xp_awarded": 0, "level_up": False}
                    })
            
            # No next level OR next level doesn't exist → All remedial levels complete!
            # Mark remedial as complete and advance to next step
            session['remedial_completed'] = True
            session[f'remedial_completed_{step_id}'] = True
            session.modified = True
            
            next_step = get_next_phase2_step(step_id)
            
            if next_step:
                next_url = f"/app/phase2/step/{next_step}"
                message = f"🎉 Outstanding! You've completed all remedial levels ({current_level} was the last). Moving to the next step!"
                next_action = "next_step"
            else:
                next_url = "/app/phase2/complete"
                message = f"🎉 Congratulations! You've completed all remedial activities and Phase 2!"
                next_action = "phase2_complete"
            
            return jsonify({
                "success": True,
                "activity_passed": True,
                "level_complete": True,
                "remedial_complete": True,
                "score": score,
                "threshold": max_score,
                "passing_score": passing_threshold,
                "message": message,
                "next_action": next_action,
                "next_url": next_url,
                "celebration": True,
                "step_completed": True,
                "final_level": current_level,
                "xp_data": xp_data if xp_data else {"xp_awarded": 0, "level_up": False},
                "all_levels_complete": True
            })
        
        # Fallback: Should not reach here, but just in case
        logger.error(f"FALLBACK HIT! level_complete was False for {step_id}/{current_level}")
        logger.error(f"This should not happen. Check level completion logic.")
        return jsonify({
            "success": True,
            "activity_passed": True,
            "score": score,
            "message": "Activity completed. Please refresh the page.",
            "next_action": "refresh",
            "next_url": f"/app/phase2/remedial/{step_id}/{current_level}"
        })

        
    except Exception as e:
        logger.error(f"Error in remedial activity submission: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/get-remedial-state', methods=['GET'])
@login_required
def get_remedial_state():
    """Get current state of remedial activities"""
    try:
        step_id = request.args.get('step_id')
        level = request.args.get('level')
        activity_param = request.args.get('activity', '0')
        
        if not step_id or not level:
            return jsonify({"error": "Missing step_id or level"}), 400
        
        # Get remedial activities for this step and level
        remedial_activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
        
        if not remedial_activities:
            return jsonify({"error": "No remedial activities found"}), 400
        
        # Determine current activity index - allow access to any specific activity
        try:
            current_activity_index = int(activity_param)
        except (ValueError, TypeError):
            current_activity_index = 0
        
        # Validate activity index
        if current_activity_index >= len(remedial_activities) or current_activity_index < 0:
            current_activity_index = 0
        
        # Check completed activities from session/database
        completed_activities = []
        session_responses = session.get('phase2_remedial_responses', {})
        
        for i, activity in enumerate(remedial_activities):
            session_key = f"remedial_{step_id}_{level}_{activity['id']}"
            if session_key in session_responses:
                response_data = session_responses[session_key]
                success_threshold = activity.get('success_threshold', 6)
                if response_data.get('score', 0) >= success_threshold:
                    completed_activities.append(i)
        
        # Only auto-advance if no specific activity was requested (activity param was '0' and is default)
        if activity_param == '0' and current_activity_index in completed_activities:
            for i in range(current_activity_index + 1, len(remedial_activities)):
                if i not in completed_activities:
                    current_activity_index = i
                    break
            else:
                # All activities completed
                return jsonify({
                    "step_id": step_id,
                    "level": level,
                    "all_completed": True,
                    "message": "🎉 All remedial activities completed! Ready to return to main step.",
                    "next_action": "return_to_step",
                    "next_url": f"/app/phase2/step/{step_id}"
                })
        
        # Ensure index is within bounds
        if current_activity_index >= len(remedial_activities):
            current_activity_index = len(remedial_activities) - 1
        
        current_activity = remedial_activities[current_activity_index]
        
        return jsonify({
            "step_id": step_id,
            "level": level,
            "current_activity_index": current_activity_index,
            "current_activity": current_activity,
            "total_activities": len(remedial_activities),
            "completed_activities": len(completed_activities),
            "all_completed": False,
            "progress_percentage": round((len(completed_activities) / len(remedial_activities)) * 100)
        })
        
    except Exception as e:
        logger.error(f"Error getting remedial state: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/check-remedial-completion', methods=['GET'])
@login_required
def check_remedial_completion():
    """Check if remedial activities are completed and determine next action"""
    try:
        step_id = request.args.get('step_id')
        level = request.args.get('level')
        
        if not step_id or not level:
            return jsonify({"error": "Missing step_id or level"}), 400
        
        # Check if this step's remedials were completed
        remedial_completed = session.get(f'remedial_completed_{step_id}', False)
        
        if remedial_completed:
            # Determine next action after remedial completion
            next_step = get_next_phase2_step(step_id)
            
            if next_step:
                return jsonify({
                    "remedial_completed": True,
                    "next_action": "next_step",
                    "next_url": f"/app/phase2/step/{next_step}",
                    "next_step": next_step,
                    "message": "Remedials completed! Moving to next step."
                })
            else:
                return jsonify({
                    "remedial_completed": True,
                    "next_action": "phase2_complete",
                    "next_url": "/app/phase2/complete",
                    "message": "Phase 2 completed!"
                })
        else:
            return jsonify({
                "remedial_completed": False,
                "message": "Remedials not yet completed."
            })
        
    except Exception as e:
        logger.error(f"Error checking remedial completion: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# Alias route for template compatibility
@api_bp.route('/submit-remedial-activity', methods=['POST'])
@login_required
def submit_remedial_activity_alias():
    """Alias for submit_remedial_activity for template compatibility"""
    return submit_remedial_activity()

@api_bp.route('/phase2/get-ai-feedback', methods=['POST'])
@login_required
def get_phase2_ai_feedback():
    """Get AI feedback specifically for Phase 2 responses"""
    try:
        data = request.json
        step_id = data.get('step_id')
        action_item_id = data.get('action_item_id')
        response_text = data.get('response', '')
        
        if not all([step_id, action_item_id, response_text]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Get the specific action item
        step_data = PHASE_2_STEPS.get(step_id, {})
        action_items = step_data.get('action_items', [])
        
        action_item = None
        for item in action_items:
            if item['id'] == action_item_id:
                action_item = item
                break
        
        if not action_item:
            return jsonify({"error": "Action item not found"}), 400
        
        # Check for AI content
        is_ai, ai_score, ai_reasons = assessment_service.check_ai_response(response_text)
        
        # Get assessment
        assessment = assessment_service.assess_phase2_response(step_id, action_item_id, response_text)
        
        # Create character-specific feedback prompt
        speaker = action_item.get('speaker', 'Ms. Mabrouki')
        character_info = NPCS.get(speaker, {})
        
        feedback_prompt = f"""
        As {speaker} ({character_info.get('role', 'Team Member')}), provide encouraging feedback on this Phase 2 response.
        
        Character personality: {character_info.get('personality', 'Helpful and supportive')}
        
        Student's response to: "{action_item['question']}"
        Response: "{response_text}"
        
        Assessment level: {assessment.get('level', 'B1')}
        Assessment points: {assessment.get('points', 1)}/4
        
        {"Note: This response shows characteristics of AI-generated content. " if is_ai else ""}
        
        Give feedback that:
        1. Stays in character as {speaker}
        2. Is encouraging and team-focused
        3. Acknowledges strengths from the assessment
        4. Provides one specific suggestion for improvement
        5. Relates to the cultural event planning context
        6. Is 2-3 sentences maximum
        7. Uses formal English (no contractions)
        
        Example tone: "Great teamwork spirit! Your suggestion shows good understanding of our cultural goals. Try adding more specific details about how this would benefit our Tunisian event."
        """
        
        ai_feedback = ai_service.get_ai_response(feedback_prompt, speaker)
        
        return jsonify({
            "success": True,
            "feedback": ai_feedback,
            "assessment": {
                "level": assessment.get('level'),
                "points": assessment.get('points'),
                "strengths": assessment.get('strengths', []),
                "improvements": assessment.get('improvements', [])
            },
            "ai_detection": {
                "is_ai": is_ai,
                "score": ai_score,
                "reasons": ai_reasons[:3] if ai_reasons else []
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting Phase 2 AI feedback: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/generate-character-audio', methods=['POST'])
@login_required
def generate_character_audio():
    """Generate audio for character dialogue in Phase 2"""
    try:
        data = request.json
        text = data.get('text', '')
        character = data.get('character', 'Ms. Mabrouki')
        step_id = data.get('step_id', '')
        action_item_id = data.get('action_item_id', '')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        # Map characters to voices
        character_voices = {
            'Ms. Mabrouki': 'en-US-AriaNeural',  # Professional female voice
            'SKANDER': 'en-US-ChristopherNeural',  # Energetic male voice
            'Emna': 'en-US-JennyNeural',  # Friendly female voice
            'Ryan': 'en-US-GuyNeural',  # Creative male voice
            'Lilia': 'en-US-AmberNeural'  # Artistic female voice
        }
        
        voice = character_voices.get(character, 'en-US-AriaNeural')
        filename = f'phase2_{step_id}_{action_item_id}_{character.lower()}_{int(datetime.now().timestamp())}.mp3'
        
        # Generate audio
        audio_url = audio_service.generate_custom_audio(text, filename, voice)
        
        return jsonify({
            "success": True,
            "audio_url": audio_url,
            "character": character,
            "filename": filename
        })
        
    except Exception as e:
        logger.error(f"Error generating character audio: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api_bp.route('/phase2/get-step-progress', methods=['GET'])
@login_required
def get_phase2_step_progress():
    """Get current progress for a Phase 2 step"""
    try:
        step_id = request.args.get('step_id')
        
        if step_id not in PHASE_2_STEPS:
            return jsonify({"error": "Invalid step ID"}), 400
        
        step_data = PHASE_2_STEPS[step_id]
        action_items = step_data['action_items']
        
        # Count completed items
        assessments = session.get('phase2_assessments', {})
        completed_count = 0
        total_score = 0
        item_scores = []
        
        for item in action_items:
            session_key = f"phase2_{step_id}_{item['id']}"
            if session_key in assessments:
                completed_count += 1
                assessment = assessments[session_key]
                points = assessment.get('points', 1)
                total_score += points
                item_scores.append({
                    'id': item['id'],
                    'level': assessment.get('level'),
                    'points': points,
                    'completed': True
                })
            else:
                item_scores.append({
                    'id': item['id'],
                    'completed': False
                })
        
        return jsonify({
            "step_id": step_id,
            "total_items": len(action_items),
            "completed_items": completed_count,
            "total_score": total_score,
            "threshold": PHASE_2_SUCCESS_THRESHOLD,
            "progress_percentage": round((completed_count / len(action_items)) * 100),
            "item_scores": item_scores,
            "step_complete": completed_count >= len(action_items),
            "needs_remedial": completed_count >= len(action_items) and total_score < PHASE_2_SUCCESS_THRESHOLD
        })
        
    except Exception as e:
        logger.error(f"Error getting step progress: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/reset-step', methods=['POST'])
@login_required
def reset_phase2_step():
    """Reset a Phase 2 step (for testing or retrying)"""
    try:
        data = request.json
        step_id = data.get('step_id')
        
        if step_id not in PHASE_2_STEPS:
            return jsonify({"error": "Invalid step ID"}), 400
        
        # Clear session data for this step
        if 'phase2_responses' in session:
            keys_to_remove = [key for key in session['phase2_responses'].keys() if key.startswith(f"phase2_{step_id}_")]
            for key in keys_to_remove:
                del session['phase2_responses'][key]
        
        if 'phase2_assessments' in session:
            keys_to_remove = [key for key in session['phase2_assessments'].keys() if key.startswith(f"phase2_{step_id}_")]
            for key in keys_to_remove:
                del session['phase2_assessments'][key]
        
        session.modified = True
        
        return jsonify({
            "success": True,
            "message": f"Step {step_id} has been reset"
        })
        
    except Exception as e:
        logger.error(f"Error resetting step: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
        
     
# Helper functions for Phase 2
def get_next_phase2_step(current_step):
    """Get the next step in Phase 2 sequence"""
    steps = ['step_1', 'step_2', 'step_3', 'final_writing']
    try:
        current_index = steps.index(current_step)
        if current_index + 1 < len(steps):
            return steps[current_index + 1]
    except ValueError:
        pass
    return None

def determine_phase2_user_level(total_score):
    """Determine user level based on Phase 2 score"""
    if total_score <= 7:  # 1 point per item = A1 level
        return 'A1'
    elif total_score <= 10:  # 2 points per item = A2 level
        return 'A2'
    elif total_score <= 15:  # 3 points per item = B1 level
        return 'B1'
    else:
        return 'B2'  # Should not reach remedial if B2

def get_phase2_overall_assessment(user_id=None):
    """Get overall Phase 2 assessment for storage"""
    try:
        assessments = session.get('phase2_assessments', {})
        responses = session.get('phase2_responses', {})
        
        if not assessments:
            return None
        
        # Calculate overall statistics
        total_score = 0
        step_scores = {}
        level_counts = {'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0}
        
        for step_id in ['step_1', 'step_2', 'step_3', 'final_writing']:
            step_score = 0
            step_items = 0
            
            for key, assessment in assessments.items():
                if key.startswith(f"phase2_{step_id}_"):
                    points = assessment.get('points', 1)
                    level = assessment.get('level', 'A1')
                    step_score += points
                    step_items += 1
                    level_counts[level] += 1
            
            if step_items > 0:
                step_scores[step_id] = {
                    'score': step_score,
                    'items': step_items,
                    'average': round(step_score / step_items, 2)
                }
                total_score += step_score
        
        # Determine overall level
        if level_counts['B2'] >= 2:
            overall_level = 'B2'
        elif level_counts['B1'] >= 3:
            overall_level = 'B1'
        elif level_counts['A2'] >= 3:
            overall_level = 'A2'
        else:
            overall_level = 'A1'
        
        return {
            'overall_level': overall_level,
            'total_score': total_score,
            'step_scores': step_scores,
            'level_distribution': level_counts,
            'total_responses': len(assessments),
            'completion_rate': len(assessments) / 20 * 100  # 4 steps × 5 items each
        }
        
    except Exception as e:
        logger.error(f"Error calculating Phase 2 assessment: {str(e)}")
        return None

@api_bp.route('/phase2/step', methods=['GET'])
@login_required
def get_phase2_step_metadata():
    """Get metadata for a Phase 2 step, including action items"""
    try:
        step_id = request.args.get('step_id')
        if step_id not in PHASE_2_STEPS:
            return jsonify({"error": "Invalid step ID"}), 400
            
        step = PHASE_2_STEPS[step_id]
        
        # Initialize step progress in database if not exists
        try:
            from flask import session as flask_session
            user_id = flask_session.get('user_id')
            
            if user_id:
                # Create phase2_session_id if it doesn't exist
                if 'phase2_session_id' not in session:
                    session['phase2_session_id'] = str(uuid.uuid4())
                    session.modified = True
                
                phase2_session_id = session['phase2_session_id']
                
                # Check if step already exists in database
                existing_progress = user_manager.get_phase2_progress(user_id)
                step_exists = any(s.get('step_id') == step_id for s in existing_progress.get('steps', []))
                
                if not step_exists:
                    # Initialize step progress
                    progress_data = {
                        'current_item': 0,
                        'total_items': len(step.get('action_items', [])),
                        'step_score': 0,
                        'step_completed': False,
                        'needs_remedial': False,
                        'started_at': datetime.now().isoformat()
                    }
                    
                    user_manager.save_phase2_progress(user_id, phase2_session_id, step_id, progress_data)
                    logger.info(f"Phase 2 step {step_id} initialized for user {user_id}")
                    
        except Exception as db_error:
            logger.error(f"Failed to initialize Phase 2 step progress: {str(db_error)}")
        
        # Whitelist fields
        action_items = []
        for item in step.get('action_items', []):
            action_items.append({
                'id': item.get('id'),
                'speaker': item.get('speaker'),
                'question': item.get('question'),
                'instruction': item.get('instruction'),
                'hint': item.get('hint'),
                'audio_text': item.get('audio_text')
            })
            
        return jsonify({
            'step_id': step_id,
            'title': step.get('title'),
            'description': step.get('description'),
            'scenario': step.get('scenario'),
            'action_items': action_items
        })
    except Exception as e:
        logger.error(f"Error getting phase2 step metadata: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/overall', methods=['GET'])
@login_required
def api_phase2_overall():
    try:
        from flask import session
        if not session.get('phase2_assessments'):
            # Try to assemble from session via helper
            data = get_phase2_overall_assessment()
        else:
            data = get_phase2_overall_assessment()
        if not data:
            return jsonify({"error": "No Phase 2 data"}), 404
        return jsonify(data)
    except Exception as e:
        logger.error(f"Error getting phase2 overall: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/remedial', methods=['GET'])
@login_required
def get_phase2_remedial():
    """Return remedial activities for a step/level with current index"""
    try:
        step_id = request.args.get('step_id')
        level = request.args.get('level')
        try_index = request.args.get('activity', type=int)
        if not step_id or not level:
            return jsonify({"error": "Missing step_id or level"}), 400
        activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
        if not activities:
            return jsonify({"error": "No remedial activities found"}), 404

        # Determine current activity index from DB progress
        from routes.auth_routes import assessment_history
        from flask import session
        user_id = session.get('user_id')
        p = assessment_history.get_phase2_progress(user_id)
        completed_indices = []
        for ra in p.get('remedial_activities', []):
            if ra.get('step_id') == step_id and ra.get('level') == level and ra.get('completed'):
                completed_indices.append(ra.get('activity_index', 0))
        
        logger.info(f"Remedial progress for {step_id}/{level}: completed_indices={completed_indices}, try_index={try_index}")
        
        # Use specific index if provided, otherwise find next uncompleted activity
        if try_index is not None:
            current_index = try_index
        else:
            # Find the first uncompleted activity
            current_index = 0
            for i in range(len(activities)):
                if i not in completed_indices:
                    current_index = i
                    break
        if current_index >= len(activities):
            current_index = 0
            
        logger.info(f"Final current_index for {step_id}/{level}: {current_index}")

        # Whitelist activity fields for the client
        def sanitize(activity):
            # Convert new JSON format to old format for backward compatibility
            task_type = activity.get('task_type') or activity.get('type', 'fill_gaps')
            matching_items = activity.get('matching_items')
            sentences = activity.get('sentences')
            word_bank = activity.get('word_bank', [])
            
            # Convert sentence_expansion to writing task type
            if task_type == 'sentence_expansion':
                task_type = 'sentence_expansion'  # Keep as is, frontend will handle it

            # Keep gap_fill_story as is - frontend will handle it
            if task_type == 'gap_fill_story':
                task_type = 'gap_fill_story'  # Keep as is, frontend will handle it

            # Convert drag_and_drop pairs to matching_items format
            if task_type == 'drag_and_drop' and activity.get('pairs'):
                task_type = 'matching'
                matching_items = {pair['term']: pair['definition'] for pair in activity['pairs']}
            
            # Convert gap_fill templates to sentences format (NOT writing)
            if task_type == 'gap_fill' and activity.get('templates'):
                task_type = 'fill_gaps'
                sentences = []
                templates = activity.get('templates', [])
                correct_answers = activity.get('correct_answers', [])
                
                for i, template in enumerate(templates):
                    # Count blanks in template
                    blank_count = template.count('___')
                    # Extract blanks from correct answer if available
                    blanks = []
                    if i < len(correct_answers):
                        # Simple extraction - split by common words and get filled parts
                        # This is a simplified approach
                        answer_parts = correct_answers[i].split()
                        template_parts = template.replace('___', '').split()
                        blanks = [part for part in answer_parts if part not in template_parts]
                    
                    sentences.append({
                        'text': template,
                        'blanks': blanks[:blank_count] if blanks else [''] * blank_count
                    })
            
            # Convert writing templates to clean prompts (remove numbering and underscores)
            if task_type == 'writing' and activity.get('templates'):
                templates = activity.get('templates', [])
                # Clean up templates: remove numbering (e.g., "1. ") and convert to descriptive prompts
                clean_templates = []
                for template in templates:
                    # Remove numbering like "1. ", "2. ", etc.
                    clean = template
                    if '. ' in template and template[0].isdigit():
                        clean = template.split('. ', 1)[1] if len(template.split('. ', 1)) > 1 else template
                    
                    # Convert underscores to descriptive placeholders for display
                    # e.g., "__________ does __________" -> "Who does what and why?"
                    # For now, keep the template as-is since it shows the structure
                    clean_templates.append(clean)
                
                # Assign back to activity
                activity['templates'] = clean_templates
            
            # Convert dialogue_completion to dialogue format
            dialogue = activity.get('dialogue')
            if task_type == 'dialogue_completion' and activity.get('dialogue_lines'):
                dialogue = []
                correct_answers = activity.get('correct_answers', [])
                answer_index = 0
                
                for line in activity.get('dialogue_lines', []):
                    if 'template' in line:
                        # User input line with blanks
                        template = line.get('template', '')
                        # Count groups of 3+ underscores, not individual ___ substrings
                        import re
                        blank_count = len(re.findall(r'_{3,}', template))
                        blanks = []
                        
                        # Extract blanks from corresponding correct answer
                        if answer_index < len(correct_answers):
                            answer_text = correct_answers[answer_index]
                            # Remove numbering like "1. " from the answer
                            if answer_text and '. ' in answer_text:
                                answer_text = answer_text.split('. ', 1)[1] if len(answer_text.split('. ', 1)) > 1 else answer_text
                            
                            # Extract words that fill the blanks
                            answer_parts = answer_text.split() if answer_text else []
                            template_parts = re.sub(r'_{3,}', '', template).split()
                            blanks = [part for part in answer_parts if part not in template_parts]
                            answer_index += 1
                        
                        # Ensure we have enough blanks
                        while len(blanks) < blank_count:
                            blanks.append('')
                        
                        dialogue.append({
                            'type': 'user_input',
                            'speaker': line.get('speaker', 'You'),
                            'text': template,
                            'blanks': blanks[:blank_count]
                        })
                    else:
                        # Regular dialogue line (character speaking)
                        dialogue.append({
                            'type': 'character',
                            'speaker': line.get('speaker', ''),
                            'text': line.get('text', '')
                        })
                
                # Assign converted dialogue to activity
                activity['dialogue'] = dialogue
            
            return {

                'id': activity.get('id'),
                'title': activity.get('title', 'Practice Activity'),
                'speaker': activity.get('speaker', 'Mentor'),
                'instruction': activity.get('instruction', ''),
                'task_type': task_type,
                'matching_items': matching_items,
                'pairs': activity.get('pairs', []),  # For RhythmMatcher
                'sentences': sentences,
                'dialogue': dialogue,
                'templates': activity.get('templates'),  # For writing tasks
                'word_bank': word_bank,
                'correct_answers': activity.get('correct_answers', []),  # For gap_fill_story validation
                'guided_questions': activity.get('guided_questions', []),  # For hints/tips

                'audio_text': activity.get('audio_text'),
                'audio_content': activity.get('audio_content'),
                'success_threshold': activity.get('success_threshold', 6),
                'expected_answers': activity.get('expected_answers', []),
                'success_feedback': replace_player_placeholders(activity.get('success_feedback')),
                'remedial_feedback': replace_player_placeholders(activity.get('remedial_feedback')),
                # All custom task type properties
                'expansion_exercises': activity.get('expansion_exercises'),
                'research_prompts': activity.get('research_prompts'),
                'planning_template': activity.get('planning_template'),
                'negotiation_dialogue': activity.get('negotiation_dialogue'),
                'report_template': activity.get('report_template'),
                'reflection_prompts': activity.get('reflection_prompts'),
                'proposal_framework': activity.get('proposal_framework'),
                'story_template': activity.get('story_template'),
                'story_framework': activity.get('story_framework'),
                'proposal_template': activity.get('proposal_template'),
                'writing_prompts': activity.get('writing_prompts'),
                'expansion_items': activity.get('expansion_items'),
                'listening_items': activity.get('listening_items'),
                'priority_template': activity.get('priority_template'),
                'planning_items': activity.get('planning_items'),
                'strategic_template': activity.get('strategic_template'),
                'analysis_template': activity.get('analysis_template'),
                'negotiation_items': activity.get('negotiation_items'),
                'roleplay_items': activity.get('roleplay_items'),
                'priority_items': activity.get('priority_items'),
                'strategic_items': activity.get('strategic_items'),
                'proposal_items': activity.get('proposal_items'),
                'analysis_items': activity.get('analysis_items'),
                # For negotiation_gap_fill and similar types
                'dialogue_lines': activity.get('dialogue_lines')
            }


        # Build simple meta list for navigation
        activities_meta = [
            {
                'id': act.get('id'),
                'title': act.get('title', f'Activity {i+1}'),
                'index': i
            } for i, act in enumerate(activities)
        ]

        # Get saved responses for this activity from database
        user_id = session.get('user_id')
        current_activity_id = activities[current_index].get('id')
        saved_responses = {}

        if user_id:
            try:
                progress = assessment_history.get_phase2_progress(user_id)
                for rem_activity in progress.get('remedial_activities', []):
                    if (rem_activity.get('step_id') == step_id and
                        rem_activity.get('level') == level and
                        rem_activity.get('activity_id') == current_activity_id):
                        saved_responses = rem_activity.get('responses', {})
                        logger.info(f"Loaded saved responses for {current_activity_id}: {len(saved_responses)} answers")
                        break
            except Exception as e:
                logger.error(f"Error loading saved responses: {str(e)}")

        return jsonify({
            'step_id': step_id,
            'level': level,
            'current_index': current_index,
            'total': len(activities),
            'activity': sanitize(activities[current_index]),
            'completed_indices': completed_indices,
            'activities_meta': activities_meta,
            'saved_responses': saved_responses  # Include saved responses from DB
        })
    except Exception as e:
        logger.error(f"Error getting remedial data: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/step-results', methods=['GET'])
@login_required
def get_phase2_step_results():
    """Summarize a Phase 2 step outcome (success or remedial path)"""
    try:
        step_id = request.args.get('step_id')
        if step_id not in PHASE_2_STEPS:
            return jsonify({"error": "Invalid step ID"}), 400

        step = PHASE_2_STEPS[step_id]
        total_items = len(step.get('action_items', []))

        # Aggregate score from session assessments for this step
        assessments = session.get('phase2_assessments', {})
        total_score = 0
        completed_items = 0
        for item in step.get('action_items', []):
            key = f"phase2_{step_id}_{item['id']}"
            if key in assessments:
                completed_items += 1
                pts = assessments[key].get('points', 1)
                total_score += pts

        success_threshold = PHASE_2_SUCCESS_THRESHOLD
        success = completed_items >= total_items and total_score >= success_threshold

        result = {
            'step_id': step_id,
            'title': step.get('title'),
            'description': step.get('description'),
            'total_score': total_score,
            'success_threshold': success_threshold,
            'completed_items': completed_items,
            'total_items': total_items,
            'success': success
        }

        if success:
            next_step = get_next_phase2_step(step_id)
            result.update({
                'next_step': next_step,
                'next_step_title': PHASE_2_STEPS[next_step]['title'] if next_step else 'Phase 2 Complete',
                'success_feedback': replace_player_placeholders(step.get('success_feedback'))
            })
        else:
            user_level = determine_phase2_user_level(total_score)
            result.update({
                'needs_remedial': True,
                'user_level': user_level,
                'remedial_feedback': replace_player_placeholders(step.get('remedial_feedback'))
            })

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error getting phase2 step results: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/remedial/feedback', methods=['POST'])
@login_required
def get_phase2_remedial_feedback():
    """Generate character-style feedback for a remedial activity performance"""
    try:
        data = request.json or {}
        step_id = data.get('step_id')
        level = data.get('level')
        activity_id = data.get('activity_id')
        score = data.get('score', 0)
        if step_id not in PHASE_2_STEPS:
            return jsonify({"error": "Invalid step ID"}), 400

        # Find the activity to identify the speaker
        activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(level, [])
        activity = next((a for a in activities if a.get('id') == activity_id), None)
        speaker = (activity or {}).get('speaker', 'Ms. Mabrouki')

        # Build a concise prompt
        prompt = f"""
        As {speaker}, provide encouraging, concise feedback (2 sentences) on a student's practice activity.
        The student scored {score} on a remedial activity for {step_id.replace('_',' ')} at level {level}.
        Acknowledge effort, suggest one clear next improvement, and keep a supportive tone.
        """
        feedback_text = ai_service.get_ai_response(prompt, speaker)
        return jsonify({'feedback': feedback_text or 'Great effort—keep going! Focus on one detail to improve next time.'})
    except Exception as e:
        logger.error(f"Error generating remedial feedback: {str(e)}")
        return jsonify({"feedback": "Great effort—keep going! Focus on one detail to improve next time."})
    
@api_bp.route('/dashboard', methods=['GET'])
@login_required
def get_dashboard_data():
    """Return JSON data for the dashboard view"""
    try:
        from flask import session
        user_id = session.get('user_id')
        user = user_manager.get_user_by_id(user_id) or {}
        user_stats = assessment_history.get_user_stats(user_id) or {}
        recent_assessments = assessment_history.get_user_assessments(user_id, limit=5) or []
        phase2_progress = assessment_history.get_phase2_progress(user_id) or {}
        return jsonify({
            'user': user,
            'user_stats': user_stats,
            'recent_assessments': recent_assessments,
            'phase2_progress': phase2_progress
        })
    except Exception as e:
        logger.error(f"Error building dashboard data: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
