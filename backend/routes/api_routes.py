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
        
        # ===== ADAPTIVE LEARNING SCORING SYSTEM =====
        # Dynamic threshold calculation based on activity max score
        max_score = current_activity.get('success_threshold', 6)

        # Calculate dynamic thresholds as percentages of max_score
        perfect_score = max_score  # B2 level - 100%
        good_score = int(max_score * 0.83)  # B1 level - 83%
        okay_score = int(max_score * 0.50)  # A2 level - 50%
        low_score = max(1, int(max_score * 0.33))  # A1 level - 33% (minimum 1)

        # Determine performance level based on score
        if score >= perfect_score:
            performance_level = 'B2'
            activity_passed = True
        elif score >= good_score:
            performance_level = 'B1'
            activity_passed = True if level == 'B1' else False  # Pass B1 activities, upgrade A2
        elif score >= okay_score:
            performance_level = 'A2'
            activity_passed = True if level in ['A1', 'A2'] else False  # Pass A1/A2 activities, need upgrade for B1
        elif score >= low_score:
            performance_level = 'A1'
            activity_passed = True if level == 'A1' else False  # Only pass if already in A1
        else:
            performance_level = 'Below A1'
            activity_passed = False  # Need to retry or go back

        logger.info(f"Score: {score}/{max_score}, Level: {level}, Performance: {performance_level}, Passed: {activity_passed}")

        # Update activity data with completion status and save to database
        activity_data['completed'] = activity_passed
        activity_data['performance_level'] = performance_level
        assessment_history.save_phase2_remedial(user_id, session_id, step_id, level, activity_data)

        # Check if there are more activities
        next_activity_index = activity_index + 1
        has_next_activity = next_activity_index < len(remedial_activities)
        is_last_activity = activity_index == len(remedial_activities) - 1

        # ===== DYNAMIC LEVEL PROGRESSION LOGIC =====
        # Score determines performance_level, which determines next action:
        # - B2 (100%): Proceed to next step (success!)
        # - B1 (83%): Move to B1 level remedial, Activity 0
        # - A2 (50%): Move to A2 level remedial, Activity 0
        # - A1 (33%): Move to A1 level remedial, Activity 0
        # - Score 0: Retry same activity
        # Exception: Activity 3 (last) + score < B2 → Trap loop

        logger.info(f"=== DYNAMIC PROGRESSION LOGIC ===")
        logger.info(f"Current: {level} Activity {activity_index}, Score: {score}/{max_score}, Performance: {performance_level}")

        # Case 1: Score = 0 → Retry same activity
        if score == 0:
            return jsonify({
                "success": False,
                "activity_passed": False,
                "score": 0,
                "threshold": max_score,
                "performance_level": performance_level,
                "message": "💪 Let's review the concepts and try again. Take your time to understand the material.",
                "next_action": "retry",
                "next_url": f"/app/phase2/remedial/{step_id}/{level}?activity={activity_index}",
                "score_feedback": f"You need at least 1 correct answer to progress.",
                "encouragement": "Don't worry - learning takes practice. Review the instructions and try again!"
            })

        # Case 2: B2 Performance → Proceed to next step (ONLY B2!)
        if performance_level == 'B2':
            session['remedial_completed'] = True
            session[f'remedial_completed_{step_id}'] = True
            session.modified = True

            next_step = get_next_phase2_step(step_id)

            if next_step:
                next_url = f"/app/phase2/step/{next_step}"
                message = f"🎉 Perfect! You've achieved B2 level. Moving to the next step!"
                next_action = "next_step"
            else:
                next_url = "/app/phase2/complete"
                message = f"🎉 Outstanding! You've achieved B2 level and completed Phase 2!"
                next_action = "phase2_complete"

            return jsonify({
                "success": True,
                "activity_passed": True,
                "remedial_complete": True,
                "score": score,
                "threshold": max_score,
                "performance_level": performance_level,
                "message": message,
                "next_action": next_action,
                "next_url": next_url,
                "celebration": True,
                "step_completed": True
            })

        # Case 3: B1, A2, or A1 Performance → DYNAMIC LEVEL SWITCHING
        if performance_level in ['B1', 'A2', 'A1']:
            # Check if we're at the last activity of the current level
            if is_last_activity:
                # Last activity (activity 3) → TRAP LOOP: Repeat until score improves to B2
                return jsonify({
                    "success": False,
                    "activity_passed": False,
                    "score": score,
                    "threshold": max_score,
                    "performance_level": performance_level,
                    "message": f"💪 You scored {score}/{max_score}. You need to score {perfect_score} (perfect score) to progress to the next step. Let's practice this final activity again!",
                    "next_action": "retry",
                    "next_url": f"/app/phase2/remedial/{step_id}/{level}?activity={activity_index}",
                    "score_feedback": f"Keep practicing! You need {perfect_score - score} more correct answers to reach B2 level and move forward.",
                    "trap_loop": True,
                    "encouragement": "You're on the last practice activity. Keep trying - you'll get there!"
                })
            else:
                # Not last activity → DYNAMIC LEVEL SWITCHING
                # Check if performance_level matches current level
                if performance_level == level:
                    # Same level → Move to next activity in same level
                    next_activity = remedial_activities[next_activity_index]
                    return jsonify({
                        "success": True,
                        "activity_passed": True,
                        "remedial_complete": False,
                        "score": score,
                        "threshold": max_score,
                        "performance_level": performance_level,
                        "message": f"✅ Good! Let's continue with {level} activity {next_activity_index + 1} of {len(remedial_activities)}.",
                        "next_action": "next_remedial",
                        "next_url": f"/app/phase2/remedial/{step_id}/{level}?activity={next_activity_index}",
                        "progress_update": f"Activity {activity_index + 1} of {len(remedial_activities)} completed"
                    })
                else:
                    # Different level → Switch to performance_level, resume where left off
                    # Check if the new level exists in remedial activities
                    if performance_level in PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}):
                        # Check if we've made progress in the target level before
                        target_progress_key = f"{step_id}_{performance_level}"
                        last_completed_in_target = session.get('phase2_level_progress', {}).get(target_progress_key, -1)

                        # Resume at next activity after last completed, or start at 0
                        resume_activity_index = last_completed_in_target + 1

                        # Get activities for target level to check bounds
                        target_activities = PHASE_2_REMEDIAL_ACTIVITIES.get(step_id, {}).get(performance_level, [])

                        # If resume index is beyond available activities, cap at last activity
                        if resume_activity_index >= len(target_activities):
                            resume_activity_index = len(target_activities) - 1

                        logger.info(f"Level switch: {level} → {performance_level}, resuming at activity {resume_activity_index} (last completed: {last_completed_in_target})")

                        return jsonify({
                            "success": True,
                            "activity_passed": True,
                            "remedial_complete": False,
                            "score": score,
                            "threshold": max_score,
                            "performance_level": performance_level,
                            "level_changed": True,
                            "message": f"📊 Your performance shows {performance_level} level! {'Resuming' if resume_activity_index > 0 else 'Starting'} {performance_level} activities.",
                            "next_action": "level_switch",
                            "next_url": f"/app/phase2/remedial/{step_id}/{performance_level}?activity={resume_activity_index}",
                            "progress_update": f"Switching from {level} to {performance_level}, activity {resume_activity_index}"
                        })
                    else:
                        # Fallback: stay in current level if new level doesn't exist
                        next_activity = remedial_activities[next_activity_index]
                        return jsonify({
                            "success": True,
                            "activity_passed": True,
                            "remedial_complete": False,
                            "score": score,
                            "threshold": max_score,
                            "performance_level": performance_level,
                            "message": f"✅ Good! Let's continue with activity {next_activity_index + 1} of {len(remedial_activities)}.",
                            "next_action": "next_remedial",
                            "next_url": f"/app/phase2/remedial/{step_id}/{level}?activity={next_activity_index}",
                            "progress_update": f"Activity {activity_index + 1} of {len(remedial_activities)} completed"
                        })

        session.modified = True
        
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
            return {
                'id': activity.get('id'),
                'title': activity.get('title', 'Practice Activity'),
                'speaker': activity.get('speaker', 'Mentor'),
                'instruction': activity.get('instruction', ''),
                'task_type': activity.get('task_type', 'fill_gaps'),
                'matching_items': activity.get('matching_items'),
                'sentences': activity.get('sentences'),
                'dialogue': activity.get('dialogue'),
                'word_bank': activity.get('word_bank', []),
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
                'analysis_items': activity.get('analysis_items')
            }

        # Build simple meta list for navigation
        activities_meta = [
            {
                'id': act.get('id'),
                'title': act.get('title', f'Activity {i+1}'),
                'index': i
            } for i, act in enumerate(activities)
        ]

        return jsonify({
            'step_id': step_id,
            'level': level,
            'current_index': current_index,
            'total': len(activities),
            'activity': sanitize(activities[current_index]),
            'completed_indices': completed_indices,
            'activities_meta': activities_meta
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
