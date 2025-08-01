"""
API routes for the CEFR assessment game
"""
import random
import logging
from datetime import datetime
from flask import Blueprint, request, jsonify
from services.ai_service import AIService
from services.audio_service import AudioService
from services.assessment_service import AssessmentService
from utils.helpers import get_challenges_by_level, get_tips_by_level, get_xp_reward_by_level
from models.game_data import NPCS
from models.game_data import PHASE_2_STEPS, PHASE_2_REMEDIAL_ACTIVITIES, PHASE_2_POINTS, PHASE_2_SUCCESS_THRESHOLD
from flask import session
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from routes.auth_routes import login_required  

logger = logging.getLogger(__name__)

# Create blueprint for API routes
api_bp = Blueprint('api', __name__)

# Initialize services
ai_service = AIService()
audio_service = AudioService()
assessment_service = AssessmentService()

@api_bp.route('/get-ai-feedback', methods=['POST'])
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
        
        return jsonify({
            "success": True,
            "assessment": assessment,
            "points_earned": assessment.get('points', 1),
            "message": "Response submitted successfully!"
        })
        
    except Exception as e:
        logger.error(f"Error in Phase 2 response submission: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/check-step-completion', methods=['POST'])
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
        
        if needs_remedial:
            user_level = determine_phase2_user_level(total_score)
            
            return jsonify({
                "step_complete": True,
                "needs_remedial": True,
                "total_score": total_score,
                "threshold": PHASE_2_SUCCESS_THRESHOLD,
                "user_level": user_level,
                "next_action": "remedial_activities",
                "remedial_url": f"/phase2/remedial/{step_id}/{user_level}"
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
                "next_url": f"/phase2/step/{next_step}" if next_step else "/phase2/complete"
            })
            
    except Exception as e:
        logger.error(f"Error checking step completion: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
@api_bp.route('/phase2/submit-remedial', methods=['POST'])
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
        
        # Store remedial response
        session_key = f"remedial_{step_id}_{level}_{activity_id}"
        
        if 'phase2_remedial_responses' not in session:
            session['phase2_remedial_responses'] = {}
        
        session['phase2_remedial_responses'][session_key] = {
            'responses': responses,
            'score': score,
            'timestamp': datetime.now().isoformat()
        }
        
        # Assess if activity passed
        success_threshold = current_activity.get('success_threshold', 6)
        activity_passed = score >= success_threshold
        
        # Check if there are more activities
        next_activity_index = activity_index + 1
        has_next_activity = next_activity_index < len(remedial_activities)
        
        if activity_passed and not has_next_activity:
            # All remedial activities completed successfully
            return jsonify({
                "success": True,
                "activity_passed": True,
                "remedial_complete": True,
                "message": "Great job! You've completed all practice activities.",
                "next_action": "return_to_step",
                "next_url": f"/phase2/step/{step_id}"
            })
        elif activity_passed and has_next_activity:
            # Move to next remedial activity
            next_activity = remedial_activities[next_activity_index]
            return jsonify({
                "success": True,
                "activity_passed": True,
                "remedial_complete": False,
                "message": "Excellent! Let's try the next practice activity.",
                "next_action": "next_remedial",
                "next_url": f"/phase2/remedial/{step_id}/{level}?activity={next_activity_index}"
            })
        else:
            # Activity not passed, try again or get feedback
            return jsonify({
                "success": False,
                "activity_passed": False,
                "score": score,
                "threshold": success_threshold,
                "message": f"You got {score}/{success_threshold} correct. Try again for better results!",
                "next_action": "retry"
            })
            
        session.modified = True
        
    except Exception as e:
        logger.error(f"Error in remedial activity submission: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api_bp.route('/phase2/get-ai-feedback', methods=['POST'])
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
    
