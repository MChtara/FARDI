"""
Phase 5 Advanced Features API Routes
Power-ups, Collectibles, Avatar Customization, and Adaptive Learning
Plus Phase 5: Execution & Problem-Solving endpoints
"""

from flask import Blueprint, request, jsonify, session
from routes.auth_routes import login_required
from services.powerup_service import PowerUpService
from services.collectible_service import CollectibleService
from services.avatar_service import AvatarService
from services.adaptive_service import AdaptiveService
import json
import logging
import math
import sqlite3

# Create blueprint
phase5_bp = Blueprint('phase5', __name__, url_prefix='/api/phase5')

# Initialize services
powerup_service = PowerUpService()
collectible_service = CollectibleService()
avatar_service = AvatarService()
adaptive_service = AdaptiveService()


# ============================================================
# POWER-UPS ENDPOINTS
# ============================================================

@phase5_bp.route('/powerups', methods=['GET'])
@login_required
def get_powerups():
    """Get all available power-ups"""
    try:
        powerups = powerup_service.get_available_powerups()
        return jsonify({"success": True, "powerups": powerups})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/powerups/inventory', methods=['GET'])
@login_required
def get_powerup_inventory():
    """Get user's power-up inventory"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        inventory = powerup_service.get_user_inventory(user_id)
        active_effects = powerup_service.get_active_effects(user_id)
        
        return jsonify({
            "success": True,
            "inventory": inventory,
            "active_effects": active_effects
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/powerups/purchase', methods=['POST'])
@login_required
def purchase_powerup():
    """Purchase a power-up with XP"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        powerup_type = data.get('powerup_type')
        
        if not powerup_type:
            return jsonify({"success": False, "message": "Power-up type required"}), 400
        
        result = powerup_service.purchase_powerup(user_id, powerup_type)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/powerups/use', methods=['POST'])
@login_required
def use_powerup():
    """Use a power-up"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        powerup_type = data.get('powerup_type')
        activity_id = data.get('activity_id')
        
        if not powerup_type:
            return jsonify({"success": False, "message": "Power-up type required"}), 400
        
        result = powerup_service.use_powerup(user_id, powerup_type, activity_id)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================
# COLLECTIBLES ENDPOINTS
# ============================================================

@phase5_bp.route('/collectibles', methods=['GET'])
@login_required
def get_all_collectibles():
    """Get all available collectibles"""
    try:
        collectibles = collectible_service.get_all_collectibles()
        return jsonify({"success": True, "collectibles": collectibles})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/collectibles/collection', methods=['GET'])
@login_required
def get_user_collection():
    """Get user's collectible collection"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        collection_data = collectible_service.get_user_collection(user_id)
        stats = collectible_service.get_collection_stats(user_id)
        
        return jsonify({
            "success": True,
            **collection_data,
            "stats": stats
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/collectibles/drop', methods=['POST'])
@login_required
def drop_collectible():
    """Award a random collectible (called after activity completion)"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        source = data.get('source', 'activity')
        
        collectible = collectible_service.drop_collectible(user_id, source)
        
        if collectible:
            return jsonify({
                "success": True,
                "dropped": True,
                "collectible": collectible
            })
        else:
            return jsonify({
                "success": True,
                "dropped": False,
                "message": "No collectible dropped this time"
            })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================
# AVATAR ENDPOINTS
# ============================================================

@phase5_bp.route('/avatar/items', methods=['GET'])
@login_required
def get_avatar_items():
    """Get available avatar items"""
    try:
        category = request.args.get('category')
        items = avatar_service.get_available_items(category)
        
        return jsonify({"success": True, "items": items})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/avatar', methods=['GET'])
@login_required
def get_user_avatar():
    """Get user's current avatar"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        avatar = avatar_service.get_user_avatar(user_id)
        owned_items = avatar_service.get_user_owned_items(user_id)
        
        return jsonify({
            "success": True,
            "avatar": avatar,
            "owned_items": owned_items
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/avatar/purchase', methods=['POST'])
@login_required
def purchase_avatar_item():
    """Purchase an avatar item"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        item_id = data.get('item_id')
        
        if not item_id:
            return jsonify({"success": False, "message": "Item ID required"}), 400
        
        result = avatar_service.purchase_item(user_id, item_id)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/avatar/customize', methods=['POST'])
@login_required
def customize_avatar():
    """Update user's avatar customization"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        outfit_id = data.get('outfit_id')
        accessory_id = data.get('accessory_id')
        background_id = data.get('background_id')
        
        result = avatar_service.customize_avatar(user_id, outfit_id, accessory_id, background_id)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================
# ADAPTIVE LEARNING ENDPOINTS
# ============================================================

@phase5_bp.route('/adaptive/performance', methods=['GET'])
@login_required
def get_performance_summary():
    """Get user's overall performance summary"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        summary = adaptive_service.get_performance_summary(user_id)
        
        return jsonify({"success": True, **summary})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/adaptive/track', methods=['POST'])
@login_required
def track_performance():
    """Track performance on an activity"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        activity_id = data.get('activity_id')
        success = data.get('success', False)
        score = data.get('score', 0.0)
        activity_type = data.get('activity_type', 'remedial')
        
        if not activity_id:
            return jsonify({"success": False, "message": "Activity ID required"}), 400
        
        result = adaptive_service.track_performance(user_id, activity_id, success, score, activity_type)
        
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/adaptive/review', methods=['GET'])
@login_required
def get_review_activities():
    """Get activities due for review (spaced repetition)"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        activities = adaptive_service.get_activities_for_review(user_id)
        
        return jsonify({
            "success": True,
            "activities": activities,
            "count": len(activities)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================
# PHASE 5: EXECUTION & PROBLEM-SOLVING ENDPOINTS
# ============================================================

from services.ai_service import AIService

logger = logging.getLogger(__name__)
ai_service = AIService()


def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect('fardi.db')
    conn.row_factory = sqlite3.Row
    return conn

# ============================================================
# STEP 1: ENGAGE - Handling a Last-Minute Issue
# ============================================================

@phase5_bp.route('/step1/interaction1/track', methods=['POST'])
@login_required
def track_step1_interaction1():
    """
    Track Wordshake game completion for Step 1 Interaction 1
    Tracks engagement and time played (3 minutes target)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)  # in seconds
        completed = data.get('completed', False)
        engagement_score = data.get('engagement_score', 0)  # 0-100
        
        # Log completion
        logger.info(f"Phase 5 Step 1 Interaction 1 - User {user_id}: Time={time_played}s, Completed={completed}, Engagement={engagement_score}")
        
        # Calculate completion score (based on engagement and time)
        # Full points if completed and played at least 2 minutes
        score = 1 if (completed and time_played >= 120) else 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'engagement_score': engagement_score,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking Step 1 Interaction 1: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step1/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_step1_interaction2():
    """
    Evaluate solution suggestion for Step 1 Interaction 2
    SKANDER: "The singer canceled! How can we solve this last-minute problem?"
    Expected: Solution with glossary terms (alternative, urgent, solution)
    Scoring: A1=1pt, A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        response = data.get('response', '').strip()
        
        if not response:
            return jsonify({
                'success': False,
                'error': 'Response is required'
            }), 400
        
        # AI Evaluation with CEFR-specific prompts
        evaluation_prompt = f"""
        Evaluate this student's solution suggestion for handling a last-minute festival cancellation.
        
        Student Response: "{response}"
        
        Context: The main singer canceled due to illness. The student must suggest a solution using problem-solving vocabulary.
        
        Expected vocabulary terms: problem, cancel, change, solution, sorry, alternative, fix, urgent
        
        Evaluation Criteria:
        - A1 (1 point): Basic solution mention (e.g., "Find new singer")
        - A2 (2 points): Simple solution with one vocabulary term (e.g., "Find alternative singer because urgent")
        - B1 (3 points): Clear solution with multiple terms and reasoning (e.g., "We can find another singer as an alternative because it is urgent and keeps the program")
        - B2 (4 points): Detailed solution with multiple terms and logical flow (e.g., "I suggest finding a backup performer or local talent as a quick alternative, since this solution is urgent and maintains the event quality")
        - C1 (5 points): Sophisticated solution with advanced vocabulary and strategic thinking (e.g., "A feasible solution would be to secure a substitute artist immediately while sending an apologetic update to attendees, ensuring minimal disruption and preserving trust")
        
        Requirements:
        1. Must include a solution
        2. Must include at least one vocabulary term (alternative, urgent, solution, etc.)
        3. Must show logical reasoning (use of "because", "since", etc.)
        
        Return JSON with:
        {{
            "score": 1-5,
            "level": "A1" | "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback on the response",
            "vocabulary_used": ["list", "of", "terms", "found"],
            "strengths": ["strength1", "strength2"],
            "improvements": ["improvement1", "improvement2"]
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            
            # Try to parse JSON from AI response
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                # Fallback: keyword-based evaluation
                evaluation = _evaluate_solution_fallback(response)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_solution_fallback(response)
        
        score = evaluation.get('score', 1)
        level = evaluation.get('level', 'A1')
        
        # Log evaluation
        logger.info(f"Phase 5 Step 1 Interaction 2 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'vocabulary_used': evaluation.get('vocabulary_used', []),
                'strengths': evaluation.get('strengths', []),
                'improvements': evaluation.get('improvements', [])
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 1 Interaction 2: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_solution_fallback(response):
    """Fallback keyword-based evaluation for solution suggestion"""
    response_lower = response.lower()
    
    # Check for vocabulary terms
    vocabulary_terms = ['alternative', 'urgent', 'solution', 'fix', 'problem', 'cancel', 'change', 'sorry']
    terms_found = [term for term in vocabulary_terms if term in response_lower]
    
    # Check for connectors
    has_connector = any(word in response_lower for word in ['because', 'since', 'as', 'so', 'therefore'])
    
    # Check length and complexity
    word_count = len(response.split())
    
    # Score determination
    if word_count <= 5 and len(terms_found) == 0:
        score = 1
        level = 'A1'
    elif word_count <= 10 and len(terms_found) >= 1 and not has_connector:
        score = 2
        level = 'A2'
    elif word_count <= 20 and len(terms_found) >= 1 and has_connector:
        score = 3
        level = 'B1'
    elif word_count <= 30 and len(terms_found) >= 2 and has_connector:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your solution shows {level} level understanding. {"Good use of vocabulary!" if terms_found else "Try to include problem-solving terms like alternative, urgent, or solution."}',
        'vocabulary_used': terms_found,
        'strengths': ['Clear solution'] if word_count > 0 else [],
        'improvements': ['Add more vocabulary terms', 'Explain why your solution works'] if len(terms_found) < 2 else []
    }


@phase5_bp.route('/step1/interaction3/track', methods=['POST'])
@login_required
def track_step1_interaction3():
    """
    Track Sushi Spell game completion for Step 1 Interaction 3
    Tracks engagement and time played (2 minutes target)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)  # in seconds
        completed = data.get('completed', False)
        engagement_score = data.get('engagement_score', 0)  # 0-100
        
        # Log completion
        logger.info(f"Phase 5 Step 1 Interaction 3 - User {user_id}: Time={time_played}s, Completed={completed}, Engagement={engagement_score}")
        
        # Calculate completion score (based on engagement and time)
        # Full points if completed and played at least 1.5 minutes
        score = 1 if (completed and time_played >= 90) else 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'engagement_score': engagement_score,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking Step 1 Interaction 3: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step1/calculate-score', methods=['POST'])
@login_required
def calculate_step1_score():
    """
    Calculate Phase 5 Step 1 total score and route to remedial if needed
    Scoring: A1=1pt, A2=2pts, B1=3pts, B2=4pts, C1=5pts per interaction
    Total: 15 points max (3 interactions × 5 points)
    Passing: Total ≥ 20 (but max is 15, so adjust threshold)
    Actually: Passing threshold should be step-specific or total across all steps
    For now: Use 10+ to proceed (B2 level average)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        interaction1_score = data.get('interaction1_score', 0)  # 0-1 (completion)
        interaction2_score = data.get('interaction2_score', 0)  # 1-5 (CEFR)
        interaction3_score = data.get('interaction3_score', 0)  # 0-1 (completion)
        
        # Validate scores
        if not (0 <= interaction1_score <= 1):
            return jsonify({
                'success': False,
                'error': 'Interaction 1 score must be 0 or 1'
            }), 400
        
        if not (1 <= interaction2_score <= 5):
            return jsonify({
                'success': False,
                'error': 'Interaction 2 score must be between 1 and 5'
            }), 400
        
        if not (0 <= interaction3_score <= 1):
            return jsonify({
                'success': False,
                'error': 'Interaction 3 score must be 0 or 1'
            }), 400
        
        # Calculate total (Interaction 2 is the main scorer, 1-5 points)
        # Add bonus points for game completions
        total_score = interaction2_score + interaction1_score + interaction3_score
        max_score = 7  # 5 (I2) + 1 (I1) + 1 (I3)
        
        # Determine remedial level based on Interaction 2 score (main assessment)
        if interaction2_score == 1:
            remedial_level = 'A1'
        elif interaction2_score == 2:
            remedial_level = 'A2'
        elif interaction2_score == 3:
            remedial_level = 'B1'
        elif interaction2_score == 4:
            remedial_level = 'B2'
        else:  # interaction2_score == 5
            remedial_level = 'C1'
        
        # Determine if should proceed (threshold: B1 level = 3 points)
        should_proceed = interaction2_score >= 3
        
        # TERMINAL OUTPUT
        print("\n" + "="*60)
        print("PHASE 5 STEP 1 - SCORING RESULTS")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nInteraction 1 (Wordshake Game):")
        print(f"  Score: {interaction1_score}/1 (completion)")
        print(f"\nInteraction 2 (Solution Suggestion):")
        print(f"  Score: {interaction2_score}/5 points")
        print(f"  Level: {remedial_level}")
        print(f"\nInteraction 3 (Sushi Spell Game):")
        print(f"  Score: {interaction3_score}/1 (completion)")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/{max_score} points")
        print(f"REMEDIAL LEVEL: {remedial_level}")
        print(f"PROCEED TO STEP 2: {'✅ YES' if should_proceed else '❌ NO - Remedial Required'}")
        print("="*60 + "\n")
        
        logger.info(f"Phase 5 Step 1 scoring - User {user_id}: I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}, Total={total_score}, Level={remedial_level}, Proceed={should_proceed}")
        
        return jsonify({
            'success': True,
            'data': {
                'interaction1': {
                    'score': interaction1_score,
                    'max_score': 1,
                    'type': 'completion'
                },
                'interaction2': {
                    'score': interaction2_score,
                    'max_score': 5,
                    'level': remedial_level
                },
                'interaction3': {
                    'score': interaction3_score,
                    'max_score': 1,
                    'type': 'completion'
                },
                'total': {
                    'score': total_score,
                    'max_score': max_score,
                    'remedial_level': remedial_level,
                    'should_proceed': should_proceed
                }
            }
        })
    except Exception as e:
        logger.error(f"Error calculating Phase 5 Step 1 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 2: EXPLORE - Crisis Communication
# ============================================================

@phase5_bp.route('/step2/interaction1/track', methods=['POST'])
@login_required
def track_step2_interaction1():
    """
    Track Sushi Spell game completion for Step 2 Interaction 1
    Tracks engagement and time played (2 minutes target)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        engagement_score = data.get('engagement_score', 0)
        
        logger.info(f"Phase 5 Step 2 Interaction 1 - User {user_id}: Time={time_played}s, Completed={completed}, Engagement={engagement_score}")
        
        score = 1 if (completed and time_played >= 90) else 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'engagement_score': engagement_score,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking Step 2 Interaction 1: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step2/interaction1/evaluate-announcement', methods=['POST'])
@login_required
def evaluate_step2_interaction1_announcement():
    """
    Evaluate announcement writing for Step 2 Interaction 1
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        announcement = data.get('announcement', '').strip()
        
        if not announcement:
            return jsonify({
                'success': False,
                'error': 'Announcement is required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's crisis announcement for a festival lighting failure.
        
        Student Announcement: "{announcement}"
        
        Context: One hour before the Global Cultures Festival opens, the main stage lights fail. The student must write an announcement (3-6 sentences) announcing the issue and solution.
        
        Expected vocabulary terms: emergency, backup, announce, update, communicate
        
        Evaluation Criteria:
        - A2 (2 points): 2-3 sentence announcement with basic vocabulary (e.g., "Lights problem. Use backup. Come festival.")
        - B1 (3 points): 4-6 sentence update with reasons (e.g., "Dear guests, there is a lighting problem on stage. We are using backup lights now. The festival will start on time. Thank you for understanding.")
        - B2 (4 points): Structured announcement with polite language (e.g., "Urgent update: Due to a technical issue, the main stage lighting has temporarily failed. Our team is implementing the backup lighting system and expects resolution within 20 minutes. The event will proceed as scheduled. We appreciate your patience and understanding.")
        - C1 (5 points): Multi-channel crisis response with strategic tone (e.g., "Immediate notice to all attendees: An unexpected technical failure has affected the main stage lighting system just one hour before opening. Our contingency team is actively deploying the pre-tested backup lighting array, with full restoration anticipated within the next 20-25 minutes. The festival schedule remains unchanged, and we are committed to delivering the full cultural experience you expect. We sincerely thank you for your patience and understanding during this brief disruption.")
        
        Requirements:
        1. Must announce the issue
        2. Must mention solution (backup lights)
        3. Must use appropriate tone (calm, professional)
        4. Must include next steps or reassurance
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback on the announcement",
            "vocabulary_used": ["list", "of", "terms", "found"],
            "strengths": ["strength1", "strength2"],
            "improvements": ["improvement1", "improvement2"]
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_announcement_fallback(announcement)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_announcement_fallback(announcement)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 2 Interaction 1 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'vocabulary_used': evaluation.get('vocabulary_used', []),
                'strengths': evaluation.get('strengths', []),
                'improvements': evaluation.get('improvements', [])
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 2 Interaction 1: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_announcement_fallback(announcement):
    """Fallback keyword-based evaluation for announcement"""
    announcement_lower = announcement.lower()
    word_count = len(announcement.split())
    sentence_count = len([s for s in announcement.split('.') if s.strip()])
    
    vocabulary_terms = ['emergency', 'backup', 'announce', 'update', 'communicate', 'lights', 'problem', 'solution']
    terms_found = [term for term in vocabulary_terms if term in announcement_lower]
    
    has_backup = 'backup' in announcement_lower
    has_polite = any(word in announcement_lower for word in ['thank', 'appreciate', 'please', 'sorry', 'understanding'])
    has_reassurance = any(word in announcement_lower for word in ['will', 'continue', 'proceed', 'scheduled', 'on time'])
    
    # Score determination
    if word_count <= 10 and sentence_count <= 3 and len(terms_found) >= 1:
        score = 2
        level = 'A2'
    elif word_count <= 30 and sentence_count <= 6 and has_backup and len(terms_found) >= 2:
        score = 3
        level = 'B1'
    elif word_count <= 50 and sentence_count >= 4 and has_backup and has_polite and len(terms_found) >= 3:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your announcement shows {level} level understanding. {"Good use of vocabulary!" if len(terms_found) >= 2 else "Try to include more crisis communication terms."}',
        'vocabulary_used': terms_found,
        'strengths': ['Clear announcement'] if word_count > 0 else [],
        'improvements': ['Add more vocabulary terms', 'Include polite language'] if not has_polite else []
    }


@phase5_bp.route('/step2/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_step2_interaction2():
    """
    Evaluate solution explanation for Step 2 Interaction 2
    SKANDER: "Why did you choose that solution?"
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        explanation = data.get('explanation', '').strip()
        
        if not explanation:
            return jsonify({
                'success': False,
                'error': 'Explanation is required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's explanation for why they chose a solution (backup lights) for the crisis.
        
        Student Explanation: "{explanation}"
        
        Context: The student must explain why backup lights are a good solution for the lighting failure.
        
        Expected Response Examples:
        - A2 (2 points): "Backup good because fix."
        - B1 (3 points): "Backup lights work because it is emergency and fast."
        - B2 (4 points): "Using backup lights is the best immediate solution because it ensures the event continues without major delay and maintains audience safety."
        - C1 (5 points): "Deploying the backup lighting system is the optimal crisis response because it minimizes downtime, preserves the event's integrity, and demonstrates proactive risk management, thereby reinforcing stakeholder confidence."
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "strengths": ["strength1"],
            "improvements": ["improvement1"]
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_explanation_fallback(explanation)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_explanation_fallback(explanation)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 2 Interaction 2 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'strengths': evaluation.get('strengths', []),
                'improvements': evaluation.get('improvements', [])
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 2 Interaction 2: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_explanation_fallback(explanation):
    """Fallback evaluation for solution explanation"""
    explanation_lower = explanation.lower()
    word_count = len(explanation.split())
    has_because = 'because' in explanation_lower
    has_backup = 'backup' in explanation_lower
    
    if word_count <= 5 and has_backup:
        score = 2
        level = 'A2'
    elif word_count <= 15 and has_because and has_backup:
        score = 3
        level = 'B1'
    elif word_count <= 30 and has_because and has_backup:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your explanation shows {level} level understanding.',
        'strengths': ['Clear reasoning'] if has_because else [],
        'improvements': ['Add more detail about why the solution works'] if word_count < 10 else []
    }


@phase5_bp.route('/step2/interaction3/track', methods=['POST'])
@login_required
def track_step2_interaction3():
    """
    Track Sushi Spell game completion for Step 2 Interaction 3
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        engagement_score = data.get('engagement_score', 0)
        
        logger.info(f"Phase 5 Step 2 Interaction 3 - User {user_id}: Time={time_played}s, Completed={completed}, Engagement={engagement_score}")
        
        score = 1 if (completed and time_played >= 90) else 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'engagement_score': engagement_score,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking Step 2 Interaction 3: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step2/interaction3/evaluate-revision', methods=['POST'])
@login_required
def evaluate_step2_interaction3_revision():
    """
    Evaluate announcement revision for Step 2 Interaction 3
    Must improve one sentence using a new term (e.g., "communicate", "contingency")
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        original_sentence = data.get('original_sentence', '').strip()
        revised_sentence = data.get('revised_sentence', '').strip()
        new_term = data.get('new_term', '').strip()
        
        if not revised_sentence or not new_term:
            return jsonify({
                'success': False,
                'error': 'Revised sentence and new term are required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's revision of an announcement sentence.
        
        Original Sentence: "{original_sentence}"
        Revised Sentence: "{revised_sentence}"
        New Term Used: "{new_term}"
        
        Expected vocabulary terms: communicate, contingency, update, emergency, backup
        
        Evaluation Criteria:
        - A2 (2 points): Simple addition of term (e.g., "Add communicate.")
        - B1 (3 points): Basic sentence with term (e.g., "We communicate to everyone.")
        - B2 (4 points): Improved sentence with term (e.g., "We are communicating transparently with all stakeholders.")
        - C1 (5 points): Sophisticated revision with advanced vocabulary (e.g., "We are communicating transparently and proactively to all stakeholders to maintain trust during this contingency.")
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "improvement_detected": true/false
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_revision_fallback(original_sentence, revised_sentence, new_term)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_revision_fallback(original_sentence, revised_sentence, new_term)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 2 Interaction 3 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'improvement_detected': evaluation.get('improvement_detected', False)
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 2 Interaction 3: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_revision_fallback(original, revised, new_term):
    """Fallback evaluation for revision"""
    revised_lower = revised.lower()
    new_term_lower = new_term.lower()
    
    has_term = new_term_lower in revised_lower
    word_count = len(revised.split())
    is_longer = len(revised) > len(original)
    
    if word_count <= 3 and has_term:
        score = 2
        level = 'A2'
    elif word_count <= 8 and has_term:
        score = 3
        level = 'B1'
    elif word_count <= 15 and has_term and is_longer:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your revision shows {level} level improvement.',
        'improvement_detected': is_longer and has_term
    }


@phase5_bp.route('/step2/calculate-score', methods=['POST'])
@login_required
def calculate_step2_score():
    """
    Calculate Phase 5 Step 2 total score and route to remedial if needed
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts per interaction
    Main scorer: Interaction 1 (announcement writing)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        interaction1_score = data.get('interaction1_score', 0)  # 0-1 (game) + 2-5 (writing)
        interaction1_writing_score = data.get('interaction1_writing_score', 0)  # 2-5 (CEFR)
        interaction2_score = data.get('interaction2_score', 0)  # 2-5 (CEFR)
        interaction3_score = data.get('interaction3_score', 0)  # 0-1 (game) + 2-5 (revision)
        interaction3_revision_score = data.get('interaction3_revision_score', 0)  # 2-5 (CEFR)
        
        # Main scorer is Interaction 1 writing (2-5 points)
        main_score = interaction1_writing_score
        total_score = interaction1_score + interaction1_writing_score + interaction2_score + interaction3_score + interaction3_revision_score
        max_score = 1 + 5 + 5 + 1 + 5  # 17 total
        
        # Determine remedial level based on main score
        if main_score == 2:
            remedial_level = 'A2'
        elif main_score == 3:
            remedial_level = 'B1'
        elif main_score == 4:
            remedial_level = 'B2'
        else:  # main_score == 5
            remedial_level = 'C1'
        
        should_proceed = main_score >= 3  # B1 level or higher
        
        logger.info(f"Phase 5 Step 2 scoring - User {user_id}: I1={interaction1_score}+{interaction1_writing_score}, I2={interaction2_score}, I3={interaction3_score}+{interaction3_revision_score}, Total={total_score}, Level={remedial_level}, Proceed={should_proceed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'remedial_level': remedial_level,
                'should_proceed': should_proceed,
                'interaction1': {
                    'game_score': interaction1_score,
                    'writing_score': interaction1_writing_score
                },
                'interaction2': {
                    'score': interaction2_score
                },
                'interaction3': {
                    'game_score': interaction3_score,
                    'revision_score': interaction3_revision_score
                }
            }
        })
    except Exception as e:
        logger.error(f"Error calculating Phase 5 Step 2 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step2/remedial/log', methods=['POST'])
@login_required
def log_step2_remedial():
    """Log remedial task completion for Step 2"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        step = data.get('step', 2)
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        completed = data.get('completed', False)
        
        # Store in database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_remedial (user_id, step_id, level, task_scores, total_score, max_score, passed, attempts)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            ON CONFLICT(user_id, step_id, level) DO UPDATE SET
                task_scores = json_set(COALESCE(task_scores, '{}'), '$.task' || ?, ?),
                total_score = total_score + ?,
                attempts = attempts + 1
        ''', (user_id, step, level, json.dumps({task: score}), score, max_score, score >= max_score * 0.8, task, score, score))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 Step 2 Remedial logged - User {user_id}: Level={level}, Task={task}, Score={score}/{max_score}")
        
        return jsonify({
            'success': True,
            'message': 'Remedial activity logged successfully'
        })
    except Exception as e:
        logger.error(f"Error logging Step 2 remedial: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 3: EXPLAIN - Crisis Communication Concepts
# ============================================================

@phase5_bp.route('/step3/interaction1/track', methods=['POST'])
@login_required
def track_step3_interaction1():
    """
    Track Wordshake game completion for Step 3 Interaction 1
    Tracks engagement and time played (3 minutes target)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        engagement_score = data.get('engagement_score', 0)
        
        logger.info(f"Phase 5 Step 3 Interaction 1 - User {user_id}: Time={time_played}s, Completed={completed}, Engagement={engagement_score}")
        
        score = 1 if (completed and time_played >= 150) else 0  # 3 minutes = 180s, but 150s threshold
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'engagement_score': engagement_score,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking Step 3 Interaction 1: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step3/interaction1/evaluate-definition', methods=['POST'])
@login_required
def evaluate_step3_interaction1_definition():
    """
    Evaluate contingency definition for Step 3 Interaction 1
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        definition = data.get('definition', '').strip()
        
        if not definition:
            return jsonify({
                'success': False,
                'error': 'Definition is required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's definition of 'contingency' after watching crisis communication videos.
        
        Student Definition: "{definition}"
        
        Context: The student watched videos on crisis communication and must define 'contingency' in their own words, referencing the video.
        
        Expected Response Examples:
        - A2 (2 points): "Contingency is extra plan."
        - B1 (3 points): "A contingency is an extra plan for problems, like backup lights in the video when main lights fail."
        - B2 (4 points): "A contingency plan is a prepared alternative action or resource (such as backup lighting) that is activated when the primary plan fails, as shown in the video's event management example."
        - C1 (5 points): "In event crisis management, a contingency plan constitutes a pre-established protocol or resource (e.g., backup systems) designed to mitigate disruption, maintain operational continuity, and preserve stakeholder confidence, as exemplified in the video through rapid activation of alternative lighting solutions."
        
        Requirements:
        1. Must define 'contingency' accurately
        2. Should reference video content (backup lights, alternative plan, etc.)
        3. Must show understanding of the concept
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "video_reference_detected": true/false,
            "strengths": ["strength1"],
            "improvements": ["improvement1"]
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_definition_fallback(definition)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_definition_fallback(definition)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 3 Interaction 1 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'video_reference_detected': evaluation.get('video_reference_detected', False),
                'strengths': evaluation.get('strengths', []),
                'improvements': evaluation.get('improvements', [])
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 3 Interaction 1: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_definition_fallback(definition):
    """Fallback evaluation for contingency definition"""
    definition_lower = definition.lower()
    word_count = len(definition.split())
    has_contingency = 'contingency' in definition_lower
    has_plan = 'plan' in definition_lower or 'extra' in definition_lower or 'backup' in definition_lower
    has_video_ref = any(word in definition_lower for word in ['video', 'backup', 'light', 'example', 'show'])
    
    if word_count <= 5 and has_contingency and has_plan:
        score = 2
        level = 'A2'
    elif word_count <= 20 and has_contingency and has_plan and has_video_ref:
        score = 3
        level = 'B1'
    elif word_count <= 40 and has_contingency and has_plan and has_video_ref:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your definition shows {level} level understanding.',
        'video_reference_detected': has_video_ref,
        'strengths': ['Clear definition'] if has_contingency else [],
        'improvements': ['Add video reference'] if not has_video_ref else []
    }


@phase5_bp.route('/step3/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_step3_interaction2():
    """
    Evaluate transparent communication explanation for Step 3 Interaction 2
    Lilia: "Explain 'transparent' communication in a crisis"
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        explanation = data.get('explanation', '').strip()
        
        if not explanation:
            return jsonify({
                'success': False,
                'error': 'Explanation is required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's explanation of 'transparent' communication after reading crisis communication examples.
        
        Student Explanation: "{explanation}"
        
        Context: The student read examples of crisis communication and must explain 'transparent' communication and its purpose, using examples from the texts.
        
        Expected Response Examples:
        - A2 (2 points): "Transparent is tell truth."
        - B1 (3 points): "Transparent communication means telling people the truth about the problem and what we are doing, like the Twitter post said 'lights broken but we fix soon' because it makes people not worried."
        - B2 (4 points): "Transparent communication involves openly sharing accurate information about the crisis (problem + actions being taken), as seen in the Twitter update that clearly stated the issue and resolution timeline, because it builds trust and reduces anxiety."
        - C1 (5 points): "Transparent communication in crisis situations entails full, timely, and honest disclosure of the issue, response measures, and expected outcomes (e.g., 'technical failure - backup lighting activated - event proceeds in 25 minutes'), as both examples demonstrate, thereby mitigating misinformation, preserving stakeholder trust, and transforming potential disruption into an opportunity for demonstrating reliability and accountability."
        
        Requirements:
        1. Must explain 'transparent' communication
        2. Should reference examples from texts (Twitter, email, etc.)
        3. Must explain purpose (build trust, reduce panic)
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "example_reference_detected": true/false,
            "purpose_explained": true/false
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_transparent_fallback(explanation)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_transparent_fallback(explanation)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 3 Interaction 2 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'example_reference_detected': evaluation.get('example_reference_detected', False),
                'purpose_explained': evaluation.get('purpose_explained', False)
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 3 Interaction 2: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_transparent_fallback(explanation):
    """Fallback evaluation for transparent communication"""
    explanation_lower = explanation.lower()
    word_count = len(explanation.split())
    has_transparent = 'transparent' in explanation_lower
    has_truth = 'truth' in explanation_lower or 'honest' in explanation_lower or 'open' in explanation_lower
    has_example = any(word in explanation_lower for word in ['twitter', 'email', 'example', 'text', 'post'])
    has_purpose = any(word in explanation_lower for word in ['trust', 'panic', 'worried', 'anxiety', 'because'])
    
    if word_count <= 5 and has_transparent and has_truth:
        score = 2
        level = 'A2'
    elif word_count <= 25 and has_transparent and has_truth and has_example:
        score = 3
        level = 'B1'
    elif word_count <= 50 and has_transparent and has_truth and has_example and has_purpose:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your explanation shows {level} level understanding.',
        'example_reference_detected': has_example,
        'purpose_explained': has_purpose
    }


@phase5_bp.route('/step3/interaction3/track', methods=['POST'])
@login_required
def track_step3_interaction3():
    """
    Track Sushi Spell game completion for Step 3 Interaction 3
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        engagement_score = data.get('engagement_score', 0)
        
        logger.info(f"Phase 5 Step 3 Interaction 3 - User {user_id}: Time={time_played}s, Completed={completed}, Engagement={engagement_score}")
        
        score = 1 if (completed and time_played >= 90) else 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'engagement_score': engagement_score,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking Step 3 Interaction 3: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step3/interaction3/evaluate-term-explanation', methods=['POST'])
@login_required
def evaluate_step3_interaction3_term_explanation():
    """
    Evaluate term explanation for Step 3 Interaction 3
    Must link game to a spelled term and video example
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        term = data.get('term', '').strip()
        explanation = data.get('explanation', '').strip()
        
        if not term or not explanation:
            return jsonify({
                'success': False,
                'error': 'Term and explanation are required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's explanation of a term after playing Sushi Spell game.
        
        Term: "{term}"
        Student Explanation: "{explanation}"
        
        Context: The student played Sushi Spell to spell crisis communication terms, then must explain one spelled term relating to the videos.
        
        Expected Response Examples:
        - A2 (2 points): "Game for backup."
        - B1 (3 points): "Use Sushi Spell for 'backup' because the video showed extra lights for emergency."
        - B2 (4 points): "Incorporate Sushi Spell for rapid spelling of 'transparent' to make vocabulary engaging, as the email example used open communication to reassure people."
        - C1 (5 points): "Leverage Sushi Spell to master 'contingency' through competitive spelling, relating to the Twitter update's reference to pre-planned alternative measures that ensured minimal disruption."
        
        Requirements:
        1. Must mention the game (Sushi Spell)
        2. Must mention the spelled term
        3. Should link to video/text examples
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "game_reference_detected": true/false,
            "video_reference_detected": true/false
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_term_explanation_fallback(term, explanation)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_term_explanation_fallback(term, explanation)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 3 Interaction 3 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'game_reference_detected': evaluation.get('game_reference_detected', False),
                'video_reference_detected': evaluation.get('video_reference_detected', False)
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 3 Interaction 3: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_term_explanation_fallback(term, explanation):
    """Fallback evaluation for term explanation"""
    explanation_lower = explanation.lower()
    term_lower = term.lower()
    word_count = len(explanation.split())
    has_game = 'game' in explanation_lower or 'sushi' in explanation_lower or 'spell' in explanation_lower
    has_term = term_lower in explanation_lower
    has_video = any(word in explanation_lower for word in ['video', 'example', 'text', 'twitter', 'email'])
    
    if word_count <= 5 and has_term:
        score = 2
        level = 'A2'
    elif word_count <= 15 and has_term and has_game:
        score = 3
        level = 'B1'
    elif word_count <= 30 and has_term and has_game and has_video:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your explanation shows {level} level understanding.',
        'game_reference_detected': has_game,
        'video_reference_detected': has_video
    }


@phase5_bp.route('/step3/calculate-score', methods=['POST'])
@login_required
def calculate_step3_score():
    """
    Calculate Phase 5 Step 3 total score and route to remedial if needed
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts per interaction
    Main scorer: Interaction 1 (contingency definition)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        interaction1_score = data.get('interaction1_score', 0)  # 0-1 (game) + 2-5 (definition)
        interaction1_definition_score = data.get('interaction1_definition_score', 0)  # 2-5 (CEFR)
        interaction2_score = data.get('interaction2_score', 0)  # 2-5 (CEFR)
        interaction3_score = data.get('interaction3_score', 0)  # 0-1 (game) + 2-5 (term explanation)
        interaction3_term_score = data.get('interaction3_term_score', 0)  # 2-5 (CEFR)
        
        # Main scorer is Interaction 1 definition (2-5 points)
        main_score = interaction1_definition_score
        total_score = interaction1_score + interaction1_definition_score + interaction2_score + interaction3_score + interaction3_term_score
        max_score = 1 + 5 + 5 + 1 + 5  # 17 total
        
        # Determine remedial level based on main score
        if main_score == 2:
            remedial_level = 'A2'
        elif main_score == 3:
            remedial_level = 'B1'
        elif main_score == 4:
            remedial_level = 'B2'
        else:  # main_score == 5
            remedial_level = 'C1'
        
        should_proceed = main_score >= 3  # B1 level or higher
        
        logger.info(f"Phase 5 Step 3 scoring - User {user_id}: I1={interaction1_score}+{interaction1_definition_score}, I2={interaction2_score}, I3={interaction3_score}+{interaction3_term_score}, Total={total_score}, Level={remedial_level}, Proceed={should_proceed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'remedial_level': remedial_level,
                'should_proceed': should_proceed,
                'interaction1': {
                    'game_score': interaction1_score,
                    'definition_score': interaction1_definition_score
                },
                'interaction2': {
                    'score': interaction2_score
                },
                'interaction3': {
                    'game_score': interaction3_score,
                    'term_score': interaction3_term_score
                }
            }
        })
    except Exception as e:
        logger.error(f"Error calculating Phase 5 Step 3 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step3/remedial/log', methods=['POST'])
@login_required
def log_step3_remedial():
    """Log remedial task completion for Step 3"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        step = data.get('step', 3)
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        completed = data.get('completed', False)
        
        # Store in database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_remedial (user_id, step_id, level, task_scores, total_score, max_score, passed, attempts)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            ON CONFLICT(user_id, step_id, level) DO UPDATE SET
                task_scores = json_set(COALESCE(task_scores, '{}'), '$.task' || ?, ?),
                total_score = total_score + ?,
                attempts = attempts + 1
        ''', (user_id, step, level, json.dumps({task: score}), score, max_score, score >= max_score * 0.8, task, score, score))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 Step 3 Remedial logged - User {user_id}: Level={level}, Task={task}, Score={score}/{max_score}")
        
        return jsonify({
            'success': True,
            'message': 'Remedial activity logged successfully'
        })
    except Exception as e:
        logger.error(f"Error logging Step 3 remedial: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 4: ELABORATE - Complete Crisis Communication Texts
# ============================================================

@phase5_bp.route('/step4/interaction1/evaluate-social-media', methods=['POST'])
@login_required
def evaluate_step4_interaction1_social_media():
    """
    Evaluate social media announcement for Step 4 Interaction 1
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        announcement = data.get('announcement', '').strip()
        
        if not announcement:
            return jsonify({
                'success': False,
                'error': 'Announcement is required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's social media announcement for a festival lighting failure.
        
        Student Announcement: "{announcement}"
        
        Context: The student must write a 4-8 sentence social media post announcing the issue and solution, following a template with examples.
        
        Expected vocabulary terms: emergency, backup, announce, transparent, update, fix
        
        Evaluation Criteria:
        - A2 (2 points): Simple guided announcement (e.g., "Lighting problem. We use backup. Festival start soon. Thank you. #Festival")
        - B1 (3 points): Structured message with reasons (e.g., "Hello everyone! There is a lighting problem on stage. We are using backup lights now. The festival will start on time. Thank you for your patience. See you soon! #GlobalFestival #Update")
        - B2 (4 points): Detailed, polite crisis text with logical flow (e.g., "Dear festival community, a technical issue has temporarily affected the main stage lighting. Our team is actively deploying the backup system and anticipates full restoration within 20-30 minutes. The event schedule remains unchanged-performances and activities will proceed as planned. We sincerely appreciate your understanding and patience during this brief interruption. Thank you for being part of this celebration! #GlobalCulturesFestival #FestivalUpdate #WeAreOnIt")
        - C1 (5 points): Autonomous, nuanced crisis communication with strategic tone (e.g., "Immediate update to all attendees: An unforeseen technical malfunction has impacted the main stage lighting just one hour before doors open. Our dedicated response team has already initiated the pre-tested contingency protocol, deploying the full backup lighting array with restoration expected within the next 20-25 minutes. The festival program remains intact, and we remain fully committed to delivering the rich cultural experience you have been anticipating. We sincerely thank you for your patience and understanding during this short disruption-your continued support means everything. See you very soon for an unforgettable celebration of global unity. #GlobalCulturesFestival #LiveUpdate #ContingencyInAction #FestivalContinues")
        
        Requirements:
        1. Must announce the issue
        2. Must mention solution (backup lights)
        3. Must use calm, professional tone
        4. Should include hashtags
        5. Must check for grammar/spelling/structure mistakes
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "vocabulary_used": ["list", "of", "terms"],
            "mistakes_detected": ["mistake1", "mistake2"],
            "strengths": ["strength1"],
            "improvements": ["improvement1"]
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_social_media_fallback(announcement)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_social_media_fallback(announcement)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 4 Interaction 1 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'vocabulary_used': evaluation.get('vocabulary_used', []),
                'mistakes_detected': evaluation.get('mistakes_detected', []),
                'strengths': evaluation.get('strengths', []),
                'improvements': evaluation.get('improvements', [])
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 4 Interaction 1: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_social_media_fallback(announcement):
    """Fallback evaluation for social media announcement"""
    import re
    announcement_lower = announcement.lower()
    word_count = len(announcement.split())
    sentence_count = len([s for s in re.split(r'[.!?]+', announcement) if s.strip()])
    has_hashtag = '#' in announcement
    has_backup = 'backup' in announcement_lower
    has_polite = any(word in announcement_lower for word in ['thank', 'appreciate', 'please', 'sorry', 'understanding'])
    
    vocabulary_terms = ['emergency', 'backup', 'announce', 'transparent', 'update', 'fix']
    terms_found = [term for term in vocabulary_terms if term in announcement_lower]
    
    if word_count <= 15 and sentence_count <= 4 and len(terms_found) >= 1:
        score = 2
        level = 'A2'
    elif word_count <= 40 and sentence_count <= 6 and has_backup and len(terms_found) >= 2:
        score = 3
        level = 'B1'
    elif word_count <= 80 and sentence_count >= 4 and has_backup and has_polite and len(terms_found) >= 3:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    mistakes = []
    if 'emergancy' in announcement_lower:
        mistakes.append('Spelling: "emergancy" should be "emergency"')
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your announcement shows {level} level understanding.',
        'vocabulary_used': terms_found,
        'mistakes_detected': mistakes,
        'strengths': ['Clear announcement'] if word_count > 0 else [],
        'improvements': ['Add more vocabulary terms', 'Include hashtags'] if not has_hashtag else []
    }


@phase5_bp.route('/step4/interaction2/evaluate-email', methods=['POST'])
@login_required
def evaluate_step4_interaction2_email():
    """
    Evaluate email writing for Step 4 Interaction 2
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        subject = data.get('subject', '').strip()
        email_body = data.get('email_body', '').strip()
        
        if not subject or not email_body:
            return jsonify({
                'success': False,
                'error': 'Subject and email body are required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's email to sponsors/team about a festival lighting failure.
        
        Subject: "{subject}"
        Email Body: "{email_body}"
        
        Context: The student must write a 5-10 sentence email following a template with examples.
        
        Expected vocabulary terms: emergency, backup, announce, transparent, update, fix
        
        Evaluation Criteria:
        - A2 (2 points): Simple email (e.g., "Subject: Problem lights. Dear team, lights problem. We fix. Festival ok. Thank you.")
        - B1 (3 points): Structured email with reasons (e.g., "Subject: Lighting Update - Festival. Dear sponsors, there is a lighting problem. We use backup lights now. Festival starts on time. Thank you for support.")
        - B2 (4 points): Detailed, polite email with logical flow (e.g., "Subject: Urgent Update: Stage Lighting - Global Cultures Festival. Dear valued sponsors, we are currently addressing a brief technical issue with the main stage lighting. Our team has activated the backup system and anticipates full restoration within the next 20-30 minutes. The event schedule remains unchanged, and we are fully prepared to deliver the planned program. We sincerely appreciate your understanding and continued partnership. Best regards, [Name], Festival Committee.")
        - C1 (5 points): Autonomous, nuanced email with strategic tone (e.g., "Subject: Immediate Operational Update: Stage Lighting Contingency - Global Cultures Festival. Dear esteemed sponsors and team, an unexpected technical malfunction has temporarily affected the main stage lighting system one hour prior to opening. Our response protocol has been immediately engaged, with the pre-tested backup lighting array now being deployed-full resolution is projected within 20-25 minutes. The festival program remains fully intact, and we remain steadfast in our commitment to delivering an exceptional experience. We deeply value your trust and support during this brief disruption. Thank you for your continued partnership. Warm regards, [Name], Festival Director.")
        
        Requirements:
        1. Must have clear subject line
        2. Must have polite greeting
        3. Must explain the issue
        4. Must mention solution and timeline
        5. Must include polite closing
        6. Must check for grammar/spelling/structure mistakes
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "vocabulary_used": ["list", "of", "terms"],
            "mistakes_detected": ["mistake1"],
            "structure_score": 0-1 (has greeting, body, closing)
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_email_fallback(subject, email_body)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_email_fallback(subject, email_body)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 4 Interaction 2 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'vocabulary_used': evaluation.get('vocabulary_used', []),
                'mistakes_detected': evaluation.get('mistakes_detected', []),
                'structure_score': evaluation.get('structure_score', 0)
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 4 Interaction 2: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_email_fallback(subject, email_body):
    """Fallback evaluation for email"""
    import re
    email_lower = email_body.lower()
    word_count = len(email_body.split())
    sentence_count = len([s for s in re.split(r'[.!?]+', email_body) if s.strip()])
    has_greeting = any(word in email_lower for word in ['dear', 'hello', 'hi'])
    has_closing = any(word in email_lower for word in ['regards', 'thank', 'sincerely', 'best'])
    has_backup = 'backup' in email_lower
    has_polite = any(word in email_lower for word in ['thank', 'appreciate', 'please', 'sorry', 'understanding'])
    
    vocabulary_terms = ['emergency', 'backup', 'announce', 'transparent', 'update', 'fix']
    terms_found = [term for term in vocabulary_terms if term in email_lower]
    
    structure_score = 1 if (has_greeting and has_closing) else 0
    
    if word_count <= 20 and sentence_count <= 5 and len(terms_found) >= 1:
        score = 2
        level = 'A2'
    elif word_count <= 50 and sentence_count <= 8 and has_backup and len(terms_found) >= 2:
        score = 3
        level = 'B1'
    elif word_count <= 100 and sentence_count >= 5 and has_backup and has_polite and len(terms_found) >= 3:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    mistakes = []
    if 'sponser' in email_lower:
        mistakes.append('Spelling: "sponser" should be "sponsor"')
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your email shows {level} level understanding.',
        'vocabulary_used': terms_found,
        'mistakes_detected': mistakes,
        'structure_score': structure_score
    }


@phase5_bp.route('/step4/interaction3/track', methods=['POST'])
@login_required
def track_step4_interaction3():
    """
    Track Sushi Spell game completion for Step 4 Interaction 3
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        engagement_score = data.get('engagement_score', 0)
        
        logger.info(f"Phase 5 Step 4 Interaction 3 - User {user_id}: Time={time_played}s, Completed={completed}, Engagement={engagement_score}")
        
        score = 1 if (completed and time_played >= 90) else 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'engagement_score': engagement_score,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking Step 4 Interaction 3: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step4/interaction3/evaluate-revision', methods=['POST'])
@login_required
def evaluate_step4_interaction3_revision():
    """
    Evaluate sentence revision for Step 4 Interaction 3
    Must use spelled term and fix mistakes
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        original_sentence = data.get('original_sentence', '').strip()
        revised_sentence = data.get('revised_sentence', '').strip()
        term_used = data.get('term_used', '').strip()
        
        if not revised_sentence or not term_used:
            return jsonify({
                'success': False,
                'error': 'Revised sentence and term used are required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's sentence revision after playing Sushi Spell.
        
        Original Sentence: "{original_sentence}"
        Revised Sentence: "{revised_sentence}"
        Term Used: "{term_used}"
        
        Context: The student played Sushi Spell to spell terms, then must revise one sentence using a spelled term and fix any mistakes.
        
        Expected Response Examples:
        - A2 (2 points): "Spell backup. Add backup light."
        - B1 (3 points): "Use Sushi Spell for 'announce' - revised: 'We announce to everyone' fixed to 'We are announcing to all guests'."
        - B2 (4 points): "Incorporate Sushi Spell for 'transparent' - revised announcement: 'We tell problem' fixed to 'We are communicating transparently about the issue'."
        - C1 (5 points): "Leverage Sushi Spell for 'contingency' - revised email: Detected passive error in 'Backup is use' to 'The contingency plan, which includes the backup system, has been activated'."
        
        Requirements:
        1. Must mention the game (Sushi Spell)
        2. Must use the spelled term in revised sentence
        3. Must show error detection and correction
        4. Must improve the sentence
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "term_used_correctly": true/false,
            "error_detected": true/false,
            "improvement_detected": true/false
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_revision_step4_fallback(original_sentence, revised_sentence, term_used)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_revision_step4_fallback(original_sentence, revised_sentence, term_used)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 4 Interaction 3 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'term_used_correctly': evaluation.get('term_used_correctly', False),
                'error_detected': evaluation.get('error_detected', False),
                'improvement_detected': evaluation.get('improvement_detected', False)
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 4 Interaction 3: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_revision_step4_fallback(original, revised, term):
    """Fallback evaluation for Step 4 revision"""
    revised_lower = revised.lower()
    term_lower = term.lower()
    word_count = len(revised.split())
    has_term = term_lower in revised_lower
    has_game = 'sushi' in revised_lower or 'spell' in revised_lower or 'game' in revised_lower
    is_longer = len(revised) > len(original)
    has_improvement = is_longer and has_term
    
    if word_count <= 5 and has_term:
        score = 2
        level = 'A2'
    elif word_count <= 15 and has_term and has_game:
        score = 3
        level = 'B1'
    elif word_count <= 30 and has_term and has_game and has_improvement:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your revision shows {level} level improvement.',
        'term_used_correctly': has_term,
        'error_detected': is_longer,
        'improvement_detected': has_improvement
    }


@phase5_bp.route('/step4/calculate-score', methods=['POST'])
@login_required
def calculate_step4_score():
    """
    Calculate Phase 5 Step 4 total score and route to remedial if needed
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts per interaction
    Main scorer: Interaction 1 (social media announcement)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        interaction1_score = data.get('interaction1_score', 0)  # 2-5 (CEFR)
        interaction2_score = data.get('interaction2_score', 0)  # 2-5 (CEFR)
        interaction3_score = data.get('interaction3_score', 0)  # 0-1 (game) + 2-5 (revision)
        interaction3_revision_score = data.get('interaction3_revision_score', 0)  # 2-5 (CEFR)
        
        # Main scorer is Interaction 1 (2-5 points)
        main_score = interaction1_score
        total_score = interaction1_score + interaction2_score + interaction3_score + interaction3_revision_score
        max_score = 5 + 5 + 1 + 5  # 16 total
        
        # Determine remedial level based on main score
        if main_score == 2:
            remedial_level = 'A2'
        elif main_score == 3:
            remedial_level = 'B1'
        elif main_score == 4:
            remedial_level = 'B2'
        else:  # main_score == 5
            remedial_level = 'C1'
        
        should_proceed = main_score >= 3  # B1 level or higher
        
        logger.info(f"Phase 5 Step 4 scoring - User {user_id}: I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}+{interaction3_revision_score}, Total={total_score}, Level={remedial_level}, Proceed={should_proceed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'remedial_level': remedial_level,
                'should_proceed': should_proceed,
                'interaction1': {
                    'score': interaction1_score
                },
                'interaction2': {
                    'score': interaction2_score
                },
                'interaction3': {
                    'game_score': interaction3_score,
                    'revision_score': interaction3_revision_score
                }
            }
        })
    except Exception as e:
        logger.error(f"Error calculating Phase 5 Step 4 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step4/remedial/log', methods=['POST'])
@login_required
def log_step4_remedial():
    """Log remedial task completion for Step 4"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        step = data.get('step', 4)
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        completed = data.get('completed', False)
        
        # Store in database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_remedial (user_id, step_id, level, task_scores, total_score, max_score, passed, attempts)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            ON CONFLICT(user_id, step_id, level) DO UPDATE SET
                task_scores = json_set(COALESCE(task_scores, '{}'), '$.task' || ?, ?),
                total_score = total_score + ?,
                attempts = attempts + 1
        ''', (user_id, step, level, json.dumps({task: score}), score, max_score, score >= max_score * 0.8, task, score, score))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 Step 4 Remedial logged - User {user_id}: Level={level}, Task={task}, Score={score}/{max_score}")
        
        return jsonify({
            'success': True,
            'message': 'Remedial activity logged successfully'
        })
    except Exception as e:
        logger.error(f"Error logging Step 4 remedial: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 5: EVALUATE - Progressive Error Correction
# ============================================================

@phase5_bp.route('/step5/interaction1/evaluate-spelling', methods=['POST'])
@login_required
def evaluate_step5_interaction1_spelling():
    """
    Evaluate spelling corrections for Step 5 Interaction 1
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        original_text = data.get('original_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        
        if not original_text or not corrected_text:
            return jsonify({
                'success': False,
                'error': 'Original and corrected texts are required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's spelling corrections for a faulty crisis communication text.
        
        Original (Faulty) Text: "{original_text}"
        Student's Corrected Text: "{corrected_text}"
        
        Context: The student must correct ONLY spelling errors (e.g., "emergancy" → "emergency", "back-up" → "backup", "anounce" → "announce", "up-date" → "update", "resolv" → "resolve", "transperent" → "transparent").
        
        Expected Response Examples:
        - A2 (2 points): "Lites problem. We fix soon. Come festivl." → "Lights problem. We fix soon. Come festival."
        - B1 (3 points): "Dear gests, lighting probelm. We use bakup. Festival ok. Thank you." → "Dear guests, lighting problem. We use backup. Festival ok. Thank you."
        - B2 (4 points): "Urgent up-date: Stage lighing fail. Team activat bakup. Event continue. Appreciate patience." → "Urgent update: Stage lighting failure. Team activating backup. Event continues. Appreciate patience."
        - C1 (5 points): "Imediate notice: Unforseen technicle malfuntion afected stage lighing. Contingincy protocol iniciated. Full restorasion expected shortly. Thank for understanding." → "Immediate notice: Unforeseen technical malfunction affected stage lighting. Contingency protocol initiated. Full restoration expected shortly. Thank you for understanding."
        
        Requirements:
        1. Must correct spelling errors only (not grammar)
        2. Must identify common misspellings (emergancy, back-up, anounce, up-date, resolv, transperent, probelm, fixs, lites, festivl, gests, bakup, lighing, activat, continue, imediate, unforseen, technicle, malfuntion, afected, contingincy, iniciated, restorasion)
        3. Score based on accuracy and completeness of spelling corrections
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "spelling_errors_found": ["error1", "error2"],
            "spelling_errors_corrected": ["correction1", "correction2"],
            "missed_errors": ["missed1"],
            "accuracy_percentage": 0-100
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_spelling_fallback(original_text, corrected_text)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_spelling_fallback(original_text, corrected_text)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 5 Interaction 1 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'spelling_errors_found': evaluation.get('spelling_errors_found', []),
                'spelling_errors_corrected': evaluation.get('spelling_errors_corrected', []),
                'missed_errors': evaluation.get('missed_errors', []),
                'accuracy_percentage': evaluation.get('accuracy_percentage', 0)
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 5 Interaction 1: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_spelling_fallback(original, corrected):
    """Fallback evaluation for spelling corrections"""
    import re
    common_errors = {
        'emergancy': 'emergency', 'back-up': 'backup', 'anounce': 'announce',
        'up-date': 'update', 'resolv': 'resolve', 'transperent': 'transparent',
        'probelm': 'problem', 'fixs': 'fix', 'lites': 'lights', 'festivl': 'festival',
        'gests': 'guests', 'bakup': 'backup', 'lighing': 'lighting', 'activat': 'activating',
        'imediate': 'immediate', 'unforseen': 'unforeseen', 'technicle': 'technical',
        'malfuntion': 'malfunction', 'afected': 'affected', 'contingincy': 'contingency',
        'iniciated': 'initiated', 'restorasion': 'restoration'
    }
    
    original_lower = original.lower()
    corrected_lower = corrected.lower()
    
    errors_found = []
    errors_corrected = []
    missed_errors = []
    
    for error, correction in common_errors.items():
        if error in original_lower:
            errors_found.append(error)
            if correction in corrected_lower or error not in corrected_lower:
                errors_corrected.append(f"{error} → {correction}")
            else:
                missed_errors.append(error)
    
    accuracy = (len(errors_corrected) / len(errors_found) * 100) if errors_found else 0
    
    if len(errors_found) <= 3 and accuracy >= 80:
        score = 2
        level = 'A2'
    elif len(errors_found) <= 6 and accuracy >= 85:
        score = 3
        level = 'B1'
    elif len(errors_found) <= 10 and accuracy >= 90:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'You corrected {len(errors_corrected)} spelling errors. {level} level accuracy.',
        'spelling_errors_found': errors_found,
        'spelling_errors_corrected': errors_corrected,
        'missed_errors': missed_errors,
        'accuracy_percentage': accuracy
    }


@phase5_bp.route('/step5/interaction2/evaluate-grammar', methods=['POST'])
@login_required
def evaluate_step5_interaction2_grammar():
    """
    Evaluate grammar corrections for Step 5 Interaction 2
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        spelling_corrected_text = data.get('spelling_corrected_text', '').strip()
        grammar_corrected_text = data.get('grammar_corrected_text', '').strip()
        
        if not spelling_corrected_text or not grammar_corrected_text:
            return jsonify({
                'success': False,
                'error': 'Spelling-corrected and grammar-corrected texts are required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's grammar corrections for a crisis communication text.
        
        Spelling-Corrected Text: "{spelling_corrected_text}"
        Student's Grammar-Corrected Text: "{grammar_corrected_text}"
        
        Context: The student must correct ONLY grammar errors (subject-verb agreement, articles, prepositions, tense consistency, sentence fragments).
        
        Expected Response Examples:
        - A2 (2 points): "Lights problem. We fix soon. Come festival." → "The lights problem. We fix soon. Come to festival."
        - B1 (3 points): "Dear guests, lighting problem. We use backup. Festival ok. Thank you." → "Dear guests, there is a lighting problem. We are using backup lights. The festival is ok. Thank you."
        - B2 (4 points): "Urgent update: Stage lighting failure. Team activating backup. Event continues. Appreciate patience." → "Urgent update: The stage lighting has failed. Our team is activating the backup system. The event will continue. We appreciate your patience."
        - C1 (5 points): "Immediate notice: Unforeseen technical malfunction affected stage lighting. Contingency protocol initiated. Full restoration expected shortly. Thank for understanding." → "Immediate notice: An unforeseen technical malfunction has affected the stage lighting. The contingency protocol has been initiated. Full restoration is expected shortly. Thank you for your understanding."
        
        Requirements:
        1. Must correct grammar errors only (not spelling - already done)
        2. Must fix: subject-verb agreement, articles (a/an/the), prepositions, tense consistency, sentence fragments
        3. Score based on accuracy and completeness of grammar corrections
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "grammar_errors_found": ["error1", "error2"],
            "grammar_errors_corrected": ["correction1", "correction2"],
            "missed_errors": ["missed1"],
            "accuracy_percentage": 0-100
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_grammar_fallback(spelling_corrected_text, grammar_corrected_text)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_grammar_fallback(spelling_corrected_text, grammar_corrected_text)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 5 Interaction 2 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'grammar_errors_found': evaluation.get('grammar_errors_found', []),
                'grammar_errors_corrected': evaluation.get('grammar_errors_corrected', []),
                'missed_errors': evaluation.get('missed_errors', []),
                'accuracy_percentage': evaluation.get('accuracy_percentage', 0)
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 5 Interaction 2: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_grammar_fallback(spelling_corrected, grammar_corrected):
    """Fallback evaluation for grammar corrections"""
    spelling_words = len(spelling_corrected.split())
    grammar_words = len(grammar_corrected.split())
    
    has_articles = any(word in grammar_corrected.lower() for word in ['the', 'a', 'an'])
    has_prepositions = any(word in grammar_corrected.lower() for word in ['to', 'for', 'with', 'on', 'in', 'at'])
    has_tense_consistency = any(phrase in grammar_corrected.lower() for phrase in ['is', 'are', 'has', 'have', 'will', 'was', 'were'])
    is_longer = grammar_words > spelling_words
    
    improvements = sum([has_articles, has_prepositions, has_tense_consistency, is_longer])
    
    if improvements <= 1:
        score = 2
        level = 'A2'
    elif improvements <= 2:
        score = 3
        level = 'B1'
    elif improvements <= 3:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your grammar corrections show {level} level understanding.',
        'grammar_errors_found': ['subject-verb', 'articles', 'tense'],
        'grammar_errors_corrected': ['Fixed articles', 'Fixed tense'] if has_articles else [],
        'missed_errors': [],
        'accuracy_percentage': (improvements / 4) * 100
    }


@phase5_bp.route('/step5/interaction3/track', methods=['POST'])
@login_required
def track_step5_interaction3():
    """
    Track Wordshake game completion for Step 5 Interaction 3
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        engagement_score = data.get('engagement_score', 0)
        
        logger.info(f"Phase 5 Step 5 Interaction 3 - User {user_id}: Time={time_played}s, Completed={completed}, Engagement={engagement_score}")
        
        score = 1 if (completed and time_played >= 90) else 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'engagement_score': engagement_score,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking Step 5 Interaction 3: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step5/interaction3/evaluate-enhancement', methods=['POST'])
@login_required
def evaluate_step5_interaction3_enhancement():
    """
    Evaluate overall enhancement for Step 5 Interaction 3
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        grammar_corrected_text = data.get('grammar_corrected_text', '').strip()
        enhanced_text = data.get('enhanced_text', '').strip()
        
        if not grammar_corrected_text or not enhanced_text:
            return jsonify({
                'success': False,
                'error': 'Grammar-corrected and enhanced texts are required'
            }), 400
        
        # AI Evaluation
        evaluation_prompt = f"""
        Evaluate this student's overall enhancement of a crisis communication text.
        
        Grammar-Corrected Text: "{grammar_corrected_text}"
        Student's Enhanced Text: "{enhanced_text}"
        
        Context: The student must enhance: coherence/cohesion (connectors), tone (calm, reassuring), vocabulary (upgrade terms), politeness, and overall crisis effectiveness.
        
        Expected Response Examples:
        - A2 (2 points): "Lights problem. We use backup. Festival start soon. Thank you." → "Lights problem. We use backup. Festival start soon. Thank you 😊."
        - B1 (3 points): "Dear guests, there is a lighting problem. We are using backup lights. The festival will start on time. Thank you." → "Dear guests, there is a lighting problem on stage. We are using backup lights now. The festival will start on time. Thank you very much for your patience."
        - B2 (4 points): "Urgent update: The stage lighting has failed. Our team is activating the backup system. The event will continue. We appreciate your patience." → "Dear festival community, a temporary technical issue has affected the main stage lighting. Our team is swiftly activating the backup system and expects full resolution within 20-30 minutes. The event will proceed as scheduled. We sincerely appreciate your understanding and patience during this short interruption. Thank you - see you soon!"
        - C1 (5 points): "Immediate notice: An unforeseen technical malfunction has affected the stage lighting. The contingency protocol has been initiated. Full restoration is expected shortly. Thank you for your understanding." → "Immediate stakeholder update: An unforeseen technical malfunction has temporarily compromised the main stage lighting system one hour prior to opening. Our response team has promptly engaged the pre-tested contingency protocol, with the backup lighting array now fully deployed-restoration is projected within 20-25 minutes. The festival program remains entirely unchanged, and we remain fully committed to delivering the exceptional experience you expect. We deeply value your patience and continued trust during this brief disruption. Thank you for being part of this celebration of global unity."
        
        Requirements:
        1. Must improve coherence/cohesion (add connectors: "however", "therefore", "meanwhile")
        2. Must improve tone (calm, reassuring, professional vs panic)
        3. Must upgrade vocabulary ("problem" → "technical issue", "fix" → "resolve")
        4. Must add politeness ("We sincerely appreciate...", "Thank you for your patience")
        5. Must improve crisis effectiveness (clear solution, timeline, CTA)
        
        Return JSON with:
        {{
            "score": 2-5,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback",
            "improvements": {{
                "coherence": true/false,
                "tone": true/false,
                "vocabulary": true/false,
                "politeness": true/false,
                "effectiveness": true/false
            }},
            "enhancement_percentage": 0-100
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_enhancement_fallback(grammar_corrected_text, enhanced_text)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_enhancement_fallback(grammar_corrected_text, enhanced_text)
        
        score = evaluation.get('score', 2)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 Step 5 Interaction 3 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'improvements': evaluation.get('improvements', {}),
                'enhancement_percentage': evaluation.get('enhancement_percentage', 0)
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating Step 5 Interaction 3: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_enhancement_fallback(grammar_corrected, enhanced):
    """Fallback evaluation for enhancement"""
    enhanced_lower = enhanced.lower()
    grammar_words = len(grammar_corrected.split())
    enhanced_words = len(enhanced.split())
    
    has_connectors = any(word in enhanced_lower for word in ['however', 'therefore', 'meanwhile', 'furthermore', 'moreover'])
    has_polite = any(phrase in enhanced_lower for phrase in ['sincerely', 'appreciate', 'thank you', 'patience', 'understanding'])
    has_vocab_upgrade = any(upgrade in enhanced_lower for upgrade in ['technical issue', 'resolve', 'restoration', 'contingency', 'stakeholder'])
    has_timeline = any(word in enhanced_lower for word in ['minutes', 'shortly', 'within', 'expected'])
    is_longer = enhanced_words > grammar_words * 1.2
    
    improvements = {
        'coherence': has_connectors,
        'tone': has_polite and not any(word in enhanced_lower for word in ['panic', 'urgent', 'emergency']),
        'vocabulary': has_vocab_upgrade,
        'politeness': has_polite,
        'effectiveness': has_timeline and is_longer
    }
    
    improvement_count = sum(improvements.values())
    
    if improvement_count <= 2:
        score = 2
        level = 'A2'
    elif improvement_count <= 3:
        score = 3
        level = 'B1'
    elif improvement_count <= 4:
        score = 4
        level = 'B2'
    else:
        score = 5
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your enhancements show {level} level sophistication.',
        'improvements': improvements,
        'enhancement_percentage': (improvement_count / 5) * 100
    }


@phase5_bp.route('/step5/calculate-score', methods=['POST'])
@login_required
def calculate_step5_score():
    """
    Calculate Phase 5 Step 5 total score and route to remedial if needed
    Scoring: A2=2pts, B1=3pts, B2=4pts, C1=5pts per interaction
    Main scorer: Interaction 3 (enhancement)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        interaction1_score = data.get('interaction1_score', 0)  # 2-5 (CEFR)
        interaction2_score = data.get('interaction2_score', 0)  # 2-5 (CEFR)
        interaction3_score = data.get('interaction3_score', 0)  # 0-1 (game)
        interaction3_enhancement_score = data.get('interaction3_enhancement_score', 0)  # 2-5 (CEFR)
        
        # Main scorer is Interaction 3 enhancement (2-5 points)
        main_score = interaction3_enhancement_score
        total_score = interaction1_score + interaction2_score + interaction3_score + interaction3_enhancement_score
        max_score = 5 + 5 + 1 + 5  # 16 total
        
        # Determine remedial level based on main score
        if main_score == 2:
            remedial_level = 'A2'
        elif main_score == 3:
            remedial_level = 'B1'
        elif main_score == 4:
            remedial_level = 'B2'
        else:  # main_score == 5
            remedial_level = 'C1'
        
        should_proceed = main_score >= 3  # B1 level or higher
        
        logger.info(f"Phase 5 Step 5 scoring - User {user_id}: I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}+{interaction3_enhancement_score}, Total={total_score}, Level={remedial_level}, Proceed={should_proceed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'remedial_level': remedial_level,
                'should_proceed': should_proceed,
                'interaction1': {
                    'score': interaction1_score
                },
                'interaction2': {
                    'score': interaction2_score
                },
                'interaction3': {
                    'game_score': interaction3_score,
                    'enhancement_score': interaction3_enhancement_score
                }
            }
        })
    except Exception as e:
        logger.error(f"Error calculating Phase 5 Step 5 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step5/remedial/log', methods=['POST'])
@login_required
def log_step5_remedial():
    """Log remedial task completion for Step 5"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        step = data.get('step', 5)
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        completed = data.get('completed', False)
        
        # Store in database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_remedial (user_id, step_id, level, task_scores, total_score, max_score, passed, attempts)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            ON CONFLICT(user_id, step_id, level) DO UPDATE SET
                task_scores = json_set(COALESCE(task_scores, '{}'), '$.task' || ?, ?),
                total_score = total_score + ?,
                attempts = attempts + 1
        ''', (user_id, step, level, json.dumps({task: score}), score, max_score, score >= max_score * 0.8, task, score, score))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 Step 5 Remedial logged - User {user_id}: Level={level}, Task={task}, Score={score}/{max_score}")
        
        return jsonify({
            'success': True,
            'message': 'Remedial activity logged successfully'
        })
    except Exception as e:
        logger.error(f"Error logging Step 5 remedial: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step5/remedial/<level>/final-score', methods=['POST'])
@login_required
def calculate_step5_remedial_final_score(level):
    """Calculate final remedial score for Step 5"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        # Calculate total from task scores
        task_scores = data.get('task_scores', {})
        total_score = sum(task_scores.values())
        
        # Determine max score based on level
        max_scores = {
            'A2': 22,  # 8+8+6
            'B1': 19,  # 4+8+7
            'B2': 24,  # 4+8+8
            'C1': 25   # 4+8+6+7
        }
        max_score = max_scores.get(level.upper(), 20)
        threshold = math.ceil(max_score * 0.8)
        passed = total_score >= threshold
        
        # Update database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE phase5_remedial
            SET total_score = ?, max_score = ?, passed = ?
            WHERE user_id = ? AND step_id = 5 AND level = ?
        ''', (total_score, max_score, passed, user_id, level.upper()))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 Step 5 Remedial final score - User {user_id}: Level={level}, Score={total_score}/{max_score}, Passed={passed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'threshold': threshold
            }
        })
    except Exception as e:
        logger.error(f"Error calculating Step 5 remedial final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step4/remedial/<level>/final-score', methods=['POST'])
@login_required
def calculate_step4_remedial_final_score(level):
    """Calculate final remedial score for Step 4"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        # Calculate total from task scores
        task_scores = data.get('task_scores', {})
        total_score = sum(task_scores.values())
        
        # Determine max score based on level
        max_scores = {
            'A2': 22,  # 8+8+6
            'B1': 19,  # 4+8+7
            'B2': 28,  # 5+8+8+7
            'C1': 28   # 5+8+6+9
        }
        max_score = max_scores.get(level.upper(), 20)
        threshold = math.ceil(max_score * 0.8)
        passed = total_score >= threshold
        
        # Update database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE phase5_remedial
            SET total_score = ?, max_score = ?, passed = ?
            WHERE user_id = ? AND step_id = 4 AND level = ?
        ''', (total_score, max_score, passed, user_id, level.upper()))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 Step 4 Remedial final score - User {user_id}: Level={level}, Score={total_score}/{max_score}, Passed={passed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'threshold': threshold
            }
        })
    except Exception as e:
        logger.error(f"Error calculating Step 4 remedial final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step3/remedial/<level>/final-score', methods=['POST'])
@login_required
def calculate_step3_remedial_final_score(level):
    """Calculate final remedial score for Step 3"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        # Calculate total from task scores
        task_scores = data.get('task_scores', {})
        total_score = sum(task_scores.values())
        
        # Determine max score based on level
        max_scores = {
            'A2': 22,  # 8+8+6
            'B1': 22,  # 4+8+10
            'B2': 28,  # 5+8+8+7
            'C1': 28   # 5+8+6+9
        }
        max_score = max_scores.get(level.upper(), 20)
        threshold = math.ceil(max_score * 0.8)
        passed = total_score >= threshold
        
        # Update database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE phase5_remedial
            SET total_score = ?, max_score = ?, passed = ?
            WHERE user_id = ? AND step_id = 3 AND level = ?
        ''', (total_score, max_score, passed, user_id, level.upper()))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 Step 3 Remedial final score - User {user_id}: Level={level}, Score={total_score}/{max_score}, Passed={passed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'threshold': threshold
            }
        })
    except Exception as e:
        logger.error(f"Error calculating Step 3 remedial final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step2/remedial/<level>/final-score', methods=['POST'])
@login_required
def calculate_step2_remedial_final_score(level):
    """Calculate final remedial score for Step 2"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        # Calculate total from task scores
        task_scores = data.get('task_scores', {})
        total_score = sum(task_scores.values())
        
        # Determine max score based on level
        max_scores = {
            'A2': 18,  # 6+6+6
            'B1': 18,  # 4+6+8
            'B2': 28,  # 5+8+8+7
            'C1': 28   # 5+8+6+9
        }
        max_score = max_scores.get(level.upper(), 20)
        threshold = math.ceil(max_score * 0.8)
        passed = total_score >= threshold
        
        # Update database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE phase5_remedial
            SET total_score = ?, max_score = ?, passed = ?
            WHERE user_id = ? AND step_id = 2 AND level = ?
        ''', (total_score, max_score, passed, user_id, level.upper()))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 Step 2 Remedial final score - User {user_id}: Level={level}, Score={total_score}/{max_score}, Passed={passed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'threshold': threshold
            }
        })
    except Exception as e:
        logger.error(f"Error calculating Step 2 remedial final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step1/remedial/log', methods=['POST'])
@login_required
def log_step1_remedial():
    """
    Log remedial task completion for Step 1
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        step = data.get('step', 1)
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        completed = data.get('completed', False)
        
        # TERMINAL OUTPUT
        print("\n" + "="*60)
        print(f"PHASE 5 STEP {step} - REMEDIAL {level.upper()} - TASK {task}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Score: {score}/{max_score} points")
        print(f"Success Rate: {(score/max_score)*100:.1f}%" if max_score > 0 else "N/A")
        print("="*60 + "\n")
        
        logger.info(f"Phase 5 Step {step} Remedial {level} Task {task} - User {user_id}: Score={score}/{max_score}, Completed={completed}")
        
        return jsonify({
            'success': True,
            'message': 'Remedial task logged successfully'
        })
    except Exception as e:
        logger.error(f"Error logging Phase 5 remedial task: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/step1/remedial/<level>/final-score', methods=['POST'])
@login_required
def calculate_step1_remedial_final_score(level):
    """
    Calculate final remedial score for Step 1
    Pass threshold: 8/10 correct (80%)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        # Get task scores based on level
        if level == 'a1':
            task_a_score = data.get('task_a_score', 0)
            task_b_score = data.get('task_b_score', 0)
            task_c_score = data.get('task_c_score', 0)
            total_score = task_a_score + task_b_score + task_c_score
            max_score = 24  # 8 + 8 + 8
            pass_threshold = 19  # ~80% of 24
        elif level == 'a2':
            task_a_score = data.get('task_a_score', 0)
            task_b_score = data.get('task_b_score', 0)
            task_c_score = data.get('task_c_score', 0)
            total_score = task_a_score + task_b_score + task_c_score
            max_score = 24
            pass_threshold = 19
        elif level == 'b1':
            task_a_score = data.get('task_a_score', 0)
            task_b_score = data.get('task_b_score', 0)
            task_c_score = data.get('task_c_score', 0)
            task_d_score = data.get('task_d_score', 0)
            task_e_score = data.get('task_e_score', 0)
            task_f_score = data.get('task_f_score', 0)
            total_score = task_a_score + task_b_score + task_c_score + task_d_score + task_e_score + task_f_score
            max_score = 60  # 6 tasks × 10 points
            pass_threshold = 48  # 80% of 60
        elif level == 'b2':
            task_a_score = data.get('task_a_score', 0)
            task_b_score = data.get('task_b_score', 0)
            task_c_score = data.get('task_c_score', 0)
            task_d_score = data.get('task_d_score', 0)
            task_e_score = data.get('task_e_score', 0)
            task_f_score = data.get('task_f_score', 0)
            total_score = task_a_score + task_b_score + task_c_score + task_d_score + task_e_score + task_f_score
            max_score = 60
            pass_threshold = 48
        elif level == 'c1':
            task_a_score = data.get('task_a_score', 0)
            task_b_score = data.get('task_b_score', 0)
            task_c_score = data.get('task_c_score', 0)
            task_d_score = data.get('task_d_score', 0)
            task_e_score = data.get('task_e_score', 0)
            task_f_score = data.get('task_f_score', 0)
            task_g_score = data.get('task_g_score', 0)
            task_h_score = data.get('task_h_score', 0)
            total_score = task_a_score + task_b_score + task_c_score + task_d_score + task_e_score + task_f_score + task_g_score + task_h_score
            max_score = 80  # 8 tasks × 10 points
            pass_threshold = 64  # 80% of 80
        else:
            return jsonify({
                'success': False,
                'error': f'Invalid level: {level}'
            }), 400
        
        passed = total_score >= pass_threshold
        
        # TERMINAL OUTPUT
        print("\n" + "="*60)
        print(f"PHASE 5 STEP 1 - REMEDIAL {level.upper()} - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Total Score: {total_score}/{max_score} points")
        print(f"Pass Threshold: {pass_threshold}/{max_score} (80%)")
        print(f"Result: {'✅ PASSED' if passed else '❌ FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")
        
        logger.info(f"Phase 5 Step 1 Remedial {level} Final - User {user_id}: Total={total_score}/{max_score}, Passed={passed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'pass_threshold': pass_threshold,
                'passed': passed,
                'percentage': round((total_score / max_score) * 100, 1) if max_score > 0 else 0
            }
        })
    except Exception as e:
        logger.error(f"Error calculating Step 1 Remedial {level} final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# SUBPHASE 2: GIVING INSTRUCTIONS TO VOLUNTEERS
# ============================================================
# SubPhase 2 Step 1: ENGAGE - Giving Instructions to Volunteers
# ============================================================

@phase5_bp.route('/subphase2/step1/interaction1/track', methods=['POST'])
@login_required
def track_subphase2_step1_interaction1():
    """Track Wordshake game completion for SubPhase 2 Step 1 Interaction 1"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        engagement_score = data.get('engagement_score', 0)
        
        logger.info(f"Phase 5 SubPhase 2 Step 1 Interaction 1 - User {user_id}: Time={time_played}s, Completed={completed}")
        
        score = 1 if (completed and time_played >= 120) else 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'engagement_score': engagement_score,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking SubPhase 2 Step 1 Interaction 1: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/subphase2/step1/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step1_interaction2():
    """
    Evaluate volunteer instructions for SubPhase 2 Step 1 Interaction 2
    SKANDER: "What instructions would you give a volunteer who is welcoming guests at the entrance?"
    Scoring: A2=1pt, B1=2pts, B2=3pts, C1=4pts (no A1 in SubPhase 2)
    """
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        response = data.get('response', '').strip()
        
        if not response:
            return jsonify({
                'success': False,
                'error': 'Response is required'
            }), 400
        
        evaluation_prompt = f"""
        Evaluate this student's volunteer instructions for welcoming guests at a festival entrance.
        
        Student Response: "{response}"
        
        Expected vocabulary: please, thank you, first, then, after, careful, help, guide, welcome, queue, safety
        
        Evaluation Criteria:
        - A2 (1 point): Basic instructions with simple polite words (e.g., "Please welcome. Say hello. Thank you.")
        - B1 (2 points): Clear instructions with sequencing and polite language
        - B2 (3 points): Detailed instructions with sequencing, politeness, and clarity
        - C1 (4 points): Sophisticated, professional instructions with advanced sequencing, empathy, and cultural sensitivity
        
        Requirements:
        1. Must include polite language ("please", "thank you")
        2. Must include sequencing words ("first", "then", "next", "after that")
        3. Must be clear and actionable
        
        Return JSON with:
        {{
            "score": 1-4,
            "level": "A2" | "B1" | "B2" | "C1",
            "feedback": "Specific feedback on the response",
            "vocabulary_used": ["list", "of", "terms", "found"],
            "strengths": ["strength1", "strength2"],
            "improvements": ["improvement1", "improvement2"]
        }}
        """
        
        try:
            ai_response = ai_service.get_ai_response(evaluation_prompt)
            import re
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = _evaluate_subphase2_instructions_fallback(response)
        except Exception as e:
            logger.warning(f"AI evaluation failed, using fallback: {e}")
            evaluation = _evaluate_subphase2_instructions_fallback(response)
        
        score = evaluation.get('score', 1)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 SubPhase 2 Step 1 Interaction 2 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'vocabulary_used': evaluation.get('vocabulary_used', []),
                'strengths': evaluation.get('strengths', []),
                'improvements': evaluation.get('improvements', [])
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 1 Interaction 2: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def _evaluate_subphase2_instructions_fallback(response):
    """Fallback keyword-based evaluation for volunteer instructions"""
    response_lower = response.lower()
    
    vocabulary_terms = ['please', 'thank you', 'first', 'then', 'after', 'careful', 'help', 'guide', 'welcome', 'queue', 'safety']
    terms_found = [term for term in vocabulary_terms if term in response_lower]
    
    has_sequencing = any(word in response_lower for word in ['first', 'then', 'next', 'after', 'finally'])
    has_polite = any(word in response_lower for word in ['please', 'thank you', 'thank'])
    
    word_count = len(response.split())
    instruction_count = response.count('.') + response.count('!') + response.count('?')
    
    # Score determination (A2=1, B1=2, B2=3, C1=4)
    if word_count <= 10 and (not has_sequencing or not has_polite):
        score = 1
        level = 'A2'
    elif word_count <= 25 and has_sequencing and has_polite and instruction_count >= 2:
        score = 2
        level = 'B1'
    elif word_count <= 50 and has_sequencing and has_polite and len(terms_found) >= 3 and instruction_count >= 3:
        score = 3
        level = 'B2'
    else:
        score = 4
        level = 'C1'
    
    return {
        'score': score,
        'level': level,
        'feedback': f'Your instructions show {level} level understanding. {"Good use of sequencing and polite language!" if has_sequencing and has_polite else "Try to include sequencing words (first, then) and polite language (please, thank you)."}',
        'vocabulary_used': terms_found,
        'strengths': ['Clear instructions'] if word_count > 0 else [],
        'improvements': ['Add more sequencing words', 'Include polite language'] if not (has_sequencing and has_polite) else []
    }


@phase5_bp.route('/subphase2/step1/interaction3/track', methods=['POST'])
@login_required
def track_subphase2_step1_interaction3():
    """Track Sushi Spell game completion for SubPhase 2 Step 1 Interaction 3"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        engagement_score = data.get('engagement_score', 0)
        
        logger.info(f"Phase 5 SubPhase 2 Step 1 Interaction 3 - User {user_id}: Time={time_played}s, Completed={completed}")
        
        score = 1 if (completed and time_played >= 90) else 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'engagement_score': engagement_score,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking SubPhase 2 Step 1 Interaction 3: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/subphase2/step1/calculate-score', methods=['POST'])
@login_required
def calculate_subphase2_step1_score():
    """Calculate SubPhase 2 Step 1 total score - Scoring: A2=1pt, B1=2pts, B2=3pts, C1=4pts"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)
        
        if not (0 <= interaction1_score <= 1) or not (1 <= interaction2_score <= 4) or not (0 <= interaction3_score <= 1):
            return jsonify({
                'success': False,
                'error': 'Invalid score values'
            }), 400
        
        total_score = interaction2_score + interaction1_score + interaction3_score
        max_score = 6
        
        if interaction2_score == 1:
            remedial_level = 'A2'
        elif interaction2_score == 2:
            remedial_level = 'B1'
        elif interaction2_score == 3:
            remedial_level = 'B2'
        else:
            remedial_level = 'C1'
        
        # Store progress
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_progress (user_id, subphase, step_id, interaction_scores, total_score, remedial_level, should_proceed)
            VALUES (?, 2, 1, ?, ?, ?, ?)
            ON CONFLICT(user_id, subphase, step_id) DO UPDATE SET
                interaction_scores = ?,
                total_score = ?,
                remedial_level = ?,
                updated_at = CURRENT_TIMESTAMP
        ''', (
            user_id,
            json.dumps({'interaction1': interaction1_score, 'interaction2': interaction2_score, 'interaction3': interaction3_score}),
            total_score,
            remedial_level,
            False,
            json.dumps({'interaction1': interaction1_score, 'interaction2': interaction2_score, 'interaction3': interaction3_score}),
            total_score,
            remedial_level
        ))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 SubPhase 2 Step 1 scoring - User {user_id}: Total={total_score}, Level={remedial_level}")
        
        return jsonify({
            'success': True,
            'data': {
                'interaction1': {'score': interaction1_score, 'max_score': 1},
                'interaction2': {'score': interaction2_score, 'max_score': 4, 'level': remedial_level},
                'interaction3': {'score': interaction3_score, 'max_score': 1},
                'total': {'score': total_score, 'max_score': max_score, 'remedial_level': remedial_level}
            }
        })
    except Exception as e:
        logger.error(f"Error calculating SubPhase 2 Step 1 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/subphase2/step1/remedial/log', methods=['POST'])
@login_required
def log_subphase2_step1_remedial():
    """Log remedial task completion for SubPhase 2 Step 1"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        step = data.get('step', 1)
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_remedial (user_id, subphase, step_id, level, task_scores, total_score, max_score, passed, attempts)
            VALUES (?, 2, ?, ?, ?, ?, ?, ?, 1)
            ON CONFLICT(user_id, subphase, step_id, level) DO UPDATE SET
                task_scores = json_set(COALESCE(task_scores, '{}'), '$.' || ?, ?),
                total_score = total_score + ?,
                attempts = attempts + 1
        ''', (user_id, step, level, json.dumps({task: score}), score, max_score, score >= max_score * 0.75, task, score, score))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 SubPhase 2 Step {step} Remedial logged - User {user_id}: Level={level}, Task={task}")
        
        return jsonify({
            'success': True,
            'message': 'Remedial activity logged successfully'
        })
    except Exception as e:
        logger.error(f"Error logging SubPhase 2 Step {step} remedial: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@phase5_bp.route('/subphase2/step1/remedial/<level>/final-score', methods=['POST'])
@login_required
def calculate_subphase2_step1_remedial_final_score(level):
    """Calculate final remedial score for SubPhase 2 Step 1 - Pass threshold: 6/8 (75%)"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level_lower = level.lower()
        
        if level_lower == 'a2':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0)
            max_score = 24
            pass_threshold = 18
        elif level_lower == 'b1':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0)
            max_score = 24
            pass_threshold = 18
        elif level_lower == 'b2':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0) + data.get('task_d_score', 0)
            max_score = 32
            pass_threshold = 24
        elif level_lower == 'c1':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0) + data.get('task_d_score', 0)
            max_score = 32
            pass_threshold = 24
        else:
            return jsonify({'success': False, 'error': f'Invalid level: {level}'}), 400
        
        passed = total_score >= pass_threshold
        
        logger.info(f"Phase 5 SubPhase 2 Step 1 Remedial {level} Final - User {user_id}: Total={total_score}/{max_score}, Passed={passed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'pass_threshold': pass_threshold,
                'passed': passed,
                'percentage': round((total_score / max_score) * 100, 1) if max_score > 0 else 0
            }
        })
    except Exception as e:
        logger.error(f"Error calculating SubPhase 2 Step 1 Remedial {level} final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# SubPhase 2 Step 2: EXPLORE - Writing Instructions
# ============================================================

@phase5_bp.route('/subphase2/step2/interaction1/track', methods=['POST'])
@login_required
def track_subphase2_step2_interaction1():
    """Track Sushi Spell + Write Instructions for SubPhase 2 Step 2 Interaction 1"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        response = data.get('response', '').strip()
        
        logger.info(f"Phase 5 SubPhase 2 Step 2 Interaction 1 - User {user_id}: Time={time_played}s, Completed={completed}")
        
        # Evaluate writing (A2=1, B1=2, B2=3, C1=4)
        if response:
            evaluation = _evaluate_subphase2_instructions_fallback(response)
            score = evaluation.get('score', 1)
        else:
            score = 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'score': score,
                'message': 'Game and writing tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking SubPhase 2 Step 2 Interaction 1: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step2/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step2_interaction2():
    """Evaluate reflection on writing choices for SubPhase 2 Step 2 Interaction 2"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400
        
        # Evaluate reflection (A2=1, B1=2, B2=3, C1=4)
        response_lower = response.lower()
        has_because = 'because' in response_lower
        word_count = len(response.split())
        
        if word_count <= 5:
            score = 1
            level = 'A2'
        elif word_count <= 15 and has_because:
            score = 2
            level = 'B1'
        elif word_count <= 30 and has_because:
            score = 3
            level = 'B2'
        else:
            score = 4
            level = 'C1'
        
        logger.info(f"Phase 5 SubPhase 2 Step 2 Interaction 2 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': f'Your reflection shows {level} level understanding.'
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 2 Interaction 2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step2/interaction3/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step2_interaction3():
    """Evaluate revision with new term for SubPhase 2 Step 2 Interaction 3"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        original = data.get('original', '').strip()
        revised = data.get('revised', '').strip()
        
        if not revised:
            return jsonify({'success': False, 'error': 'Revised text is required'}), 400
        
        # Evaluate improvement (A2=1, B1=2, B2=3, C1=4)
        revised_lower = revised.lower()
        vocabulary_terms = ['guide', 'safety', 'welcome', 'careful', 'help']
        terms_found = [term for term in vocabulary_terms if term in revised_lower]
        
        word_count = len(revised.split())
        improvement = len(revised) > len(original) if original else True
        
        if word_count <= 5 and not improvement:
            score = 1
            level = 'A2'
        elif word_count <= 15 and improvement and len(terms_found) >= 1:
            score = 2
            level = 'B1'
        elif word_count <= 30 and improvement and len(terms_found) >= 2:
            score = 3
            level = 'B2'
        else:
            score = 4
            level = 'C1'
        
        logger.info(f"Phase 5 SubPhase 2 Step 2 Interaction 3 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': f'Your revision shows {level} level improvement.'
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 2 Interaction 3: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step2/calculate-score', methods=['POST'])
@login_required
def calculate_subphase2_step2_score():
    """Calculate SubPhase 2 Step 2 total score"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)
        
        if not (1 <= interaction1_score <= 4) or not (1 <= interaction2_score <= 4) or not (1 <= interaction3_score <= 4):
            return jsonify({'success': False, 'error': 'Invalid score values'}), 400
        
        total_score = interaction1_score + interaction2_score + interaction3_score
        max_score = 12
        
        # Determine remedial level based on average
        avg_score = total_score / 3
        if avg_score <= 1.5:
            remedial_level = 'A2'
        elif avg_score <= 2.5:
            remedial_level = 'B1'
        elif avg_score <= 3.5:
            remedial_level = 'B2'
        else:
            remedial_level = 'C1'
        
        # Store progress
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_progress (user_id, subphase, step_id, interaction_scores, total_score, remedial_level, should_proceed)
            VALUES (?, 2, 2, ?, ?, ?, ?)
            ON CONFLICT(user_id, subphase, step_id) DO UPDATE SET
                interaction_scores = ?,
                total_score = ?,
                remedial_level = ?,
                updated_at = CURRENT_TIMESTAMP
        ''', (
            user_id,
            json.dumps({'interaction1': interaction1_score, 'interaction2': interaction2_score, 'interaction3': interaction3_score}),
            total_score,
            remedial_level,
            False,
            json.dumps({'interaction1': interaction1_score, 'interaction2': interaction2_score, 'interaction3': interaction3_score}),
            total_score,
            remedial_level
        ))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 SubPhase 2 Step 2 scoring - User {user_id}: Total={total_score}, Level={remedial_level}")
        
        return jsonify({
            'success': True,
            'data': {
                'interaction1': {'score': interaction1_score, 'max_score': 4},
                'interaction2': {'score': interaction2_score, 'max_score': 4},
                'interaction3': {'score': interaction3_score, 'max_score': 4},
                'total': {'score': total_score, 'max_score': max_score, 'remedial_level': remedial_level}
            }
        })
    except Exception as e:
        logger.error(f"Error calculating SubPhase 2 Step 2 score: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step2/remedial/log', methods=['POST'])
@login_required
def log_subphase2_step2_remedial():
    """Log remedial task completion for SubPhase 2 Step 2"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_remedial (user_id, subphase, step_id, level, task_scores, total_score, max_score, passed, attempts)
            VALUES (?, 2, 2, ?, ?, ?, ?, ?, 1)
            ON CONFLICT(user_id, subphase, step_id, level) DO UPDATE SET
                task_scores = json_set(COALESCE(task_scores, '{}'), '$.' || ?, ?),
                total_score = total_score + ?,
                attempts = attempts + 1
        ''', (user_id, level, json.dumps({task: score}), score, max_score, score >= max_score * 0.75, task, score, score))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 SubPhase 2 Step 2 Remedial logged - User {user_id}: Level={level}, Task={task}")
        
        return jsonify({'success': True, 'message': 'Remedial activity logged successfully'})
    except Exception as e:
        logger.error(f"Error logging SubPhase 2 Step 2 remedial: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step2/remedial/<level>/final-score', methods=['POST'])
@login_required
def calculate_subphase2_step2_remedial_final_score(level):
    """Calculate final remedial score for SubPhase 2 Step 2 - Pass threshold: 6/8 (75%)"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level_lower = level.lower()
        
        if level_lower == 'a2':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0)
            max_score = 24
            pass_threshold = 18
        elif level_lower == 'b1':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0)
            max_score = 24
            pass_threshold = 18
        elif level_lower == 'b2':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0) + data.get('task_d_score', 0)
            max_score = 32
            pass_threshold = 24
        elif level_lower == 'c1':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0) + data.get('task_d_score', 0)
            max_score = 32
            pass_threshold = 24
        else:
            return jsonify({'success': False, 'error': f'Invalid level: {level}'}), 400
        
        passed = total_score >= pass_threshold
        
        logger.info(f"Phase 5 SubPhase 2 Step 2 Remedial {level} Final - User {user_id}: Total={total_score}/{max_score}, Passed={passed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'pass_threshold': pass_threshold,
                'passed': passed,
                'percentage': round((total_score / max_score) * 100, 1) if max_score > 0 else 0
            }
        })
    except Exception as e:
        logger.error(f"Error calculating SubPhase 2 Step 2 Remedial {level} final score: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SubPhase 2 Step 3: EXPLAIN - Formalize Concepts
# ============================================================

@phase5_bp.route('/subphase2/step3/interaction1/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step3_interaction1():
    """Evaluate video explanation for SubPhase 2 Step 3 Interaction 1"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400
        
        # Evaluate explanation (A2=1, B1=2, B2=3, C1=4)
        response_lower = response.lower()
        has_because = 'because' in response_lower
        has_polite_terms = any(term in response_lower for term in ['please', 'thank you', 'polite'])
        word_count = len(response.split())
        
        if word_count <= 5:
            score = 1
            level = 'A2'
        elif word_count <= 20 and has_because and has_polite_terms:
            score = 2
            level = 'B1'
        elif word_count <= 40 and has_because and has_polite_terms:
            score = 3
            level = 'B2'
        else:
            score = 4
            level = 'C1'
        
        logger.info(f"Phase 5 SubPhase 2 Step 3 Interaction 1 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': f'Your explanation shows {level} level understanding.'
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 3 Interaction 1: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step3/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step3_interaction2():
    """Evaluate sequencing words explanation for SubPhase 2 Step 3 Interaction 2"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400
        
        # Evaluate explanation (A2=1, B1=2, B2=3, C1=4)
        response_lower = response.lower()
        has_sequencing = any(word in response_lower for word in ['first', 'then', 'next', 'sequencing', 'order'])
        has_because = 'because' in response_lower
        word_count = len(response.split())
        
        if word_count <= 5:
            score = 1
            level = 'A2'
        elif word_count <= 20 and has_sequencing:
            score = 2
            level = 'B1'
        elif word_count <= 40 and has_sequencing and has_because:
            score = 3
            level = 'B2'
        else:
            score = 4
            level = 'C1'
        
        logger.info(f"Phase 5 SubPhase 2 Step 3 Interaction 2 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': f'Your explanation shows {level} level understanding.'
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 3 Interaction 2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step3/interaction3/track', methods=['POST'])
@login_required
def track_subphase2_step3_interaction3():
    """Track Sushi Spell + Explain for SubPhase 2 Step 3 Interaction 3"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        
        logger.info(f"Phase 5 SubPhase 2 Step 3 Interaction 3 - User {user_id}: Time={time_played}s, Completed={completed}")
        
        score = 1 if (completed and time_played >= 90) else 0
        
        return jsonify({
            'success': True,
            'data': {
                'time_played': time_played,
                'completed': completed,
                'score': score,
                'message': 'Game completion tracked successfully'
            }
        })
    except Exception as e:
        logger.error(f"Error tracking SubPhase 2 Step 3 Interaction 3: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step3/calculate-score', methods=['POST'])
@login_required
def calculate_subphase2_step3_score():
    """Calculate SubPhase 2 Step 3 total score"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)
        
        if not (1 <= interaction1_score <= 4) or not (1 <= interaction2_score <= 4) or not (0 <= interaction3_score <= 1):
            return jsonify({'success': False, 'error': 'Invalid score values'}), 400
        
        total_score = interaction1_score + interaction2_score + interaction3_score
        max_score = 9
        
        avg_score = (interaction1_score + interaction2_score) / 2
        if avg_score <= 1.5:
            remedial_level = 'A2'
        elif avg_score <= 2.5:
            remedial_level = 'B1'
        elif avg_score <= 3.5:
            remedial_level = 'B2'
        else:
            remedial_level = 'C1'
        
        # Store progress
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_progress (user_id, subphase, step_id, interaction_scores, total_score, remedial_level, should_proceed)
            VALUES (?, 2, 3, ?, ?, ?, ?)
            ON CONFLICT(user_id, subphase, step_id) DO UPDATE SET
                interaction_scores = ?,
                total_score = ?,
                remedial_level = ?,
                updated_at = CURRENT_TIMESTAMP
        ''', (
            user_id,
            json.dumps({'interaction1': interaction1_score, 'interaction2': interaction2_score, 'interaction3': interaction3_score}),
            total_score,
            remedial_level,
            False,
            json.dumps({'interaction1': interaction1_score, 'interaction2': interaction2_score, 'interaction3': interaction3_score}),
            total_score,
            remedial_level
        ))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 SubPhase 2 Step 3 scoring - User {user_id}: Total={total_score}, Level={remedial_level}")
        
        return jsonify({
            'success': True,
            'data': {
                'interaction1': {'score': interaction1_score, 'max_score': 4},
                'interaction2': {'score': interaction2_score, 'max_score': 4},
                'interaction3': {'score': interaction3_score, 'max_score': 1},
                'total': {'score': total_score, 'max_score': max_score, 'remedial_level': remedial_level}
            }
        })
    except Exception as e:
        logger.error(f"Error calculating SubPhase 2 Step 3 score: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step3/remedial/log', methods=['POST'])
@login_required
def log_subphase2_step3_remedial():
    """Log remedial task completion for SubPhase 2 Step 3"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_remedial (user_id, subphase, step_id, level, task_scores, total_score, max_score, passed, attempts)
            VALUES (?, 2, 3, ?, ?, ?, ?, ?, 1)
            ON CONFLICT(user_id, subphase, step_id, level) DO UPDATE SET
                task_scores = json_set(COALESCE(task_scores, '{}'), '$.' || ?, ?),
                total_score = total_score + ?,
                attempts = attempts + 1
        ''', (user_id, level, json.dumps({task: score}), score, max_score, score >= max_score * 0.75, task, score, score))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 SubPhase 2 Step 3 Remedial logged - User {user_id}: Level={level}, Task={task}")
        
        return jsonify({'success': True, 'message': 'Remedial activity logged successfully'})
    except Exception as e:
        logger.error(f"Error logging SubPhase 2 Step 3 remedial: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step3/remedial/<level>/final-score', methods=['POST'])
@login_required
def calculate_subphase2_step3_remedial_final_score(level):
    """Calculate final remedial score for SubPhase 2 Step 3 - Pass threshold: 6/8 (75%)"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level_lower = level.lower()
        
        if level_lower == 'a2':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0)
            max_score = 24
            pass_threshold = 18
        elif level_lower == 'b1':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0)
            max_score = 24
            pass_threshold = 18
        elif level_lower == 'b2':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0) + data.get('task_d_score', 0)
            max_score = 32
            pass_threshold = 24
        elif level_lower == 'c1':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0) + data.get('task_d_score', 0)
            max_score = 32
            pass_threshold = 24
        else:
            return jsonify({'success': False, 'error': f'Invalid level: {level}'}), 400
        
        passed = total_score >= pass_threshold
        
        logger.info(f"Phase 5 SubPhase 2 Step 3 Remedial {level} Final - User {user_id}: Total={total_score}/{max_score}, Passed={passed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'pass_threshold': pass_threshold,
                'passed': passed,
                'percentage': round((total_score / max_score) * 100, 1) if max_score > 0 else 0
            }
        })
    except Exception as e:
        logger.error(f"Error calculating SubPhase 2 Step 3 Remedial {level} final score: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SubPhase 2 Step 4: ELABORATE - Complete Instructions
# ============================================================

@phase5_bp.route('/subphase2/step4/interaction1/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step4_interaction1():
    """Evaluate entrance volunteer instructions for SubPhase 2 Step 4 Interaction 1"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400
        
        # Evaluate instructions (A2=1, B1=2, B2=3, C1=4)
        evaluation = _evaluate_subphase2_instructions_fallback(response)
        score = evaluation.get('score', 1)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 SubPhase 2 Step 4 Interaction 1 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'vocabulary_used': evaluation.get('vocabulary_used', []),
                'strengths': evaluation.get('strengths', []),
                'improvements': evaluation.get('improvements', [])
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 4 Interaction 1: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step4/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step4_interaction2():
    """Evaluate queue manager instructions for SubPhase 2 Step 4 Interaction 2"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400
        
        # Evaluate instructions (A2=1, B1=2, B2=3, C1=4)
        evaluation = _evaluate_subphase2_instructions_fallback(response)
        score = evaluation.get('score', 1)
        level = evaluation.get('level', 'A2')
        
        logger.info(f"Phase 5 SubPhase 2 Step 4 Interaction 2 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': evaluation.get('feedback', ''),
                'vocabulary_used': evaluation.get('vocabulary_used', []),
                'strengths': evaluation.get('strengths', []),
                'improvements': evaluation.get('improvements', [])
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 4 Interaction 2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step4/interaction3/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step4_interaction3():
    """Evaluate revision with Sushi Spell term for SubPhase 2 Step 4 Interaction 3"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        original = data.get('original', '').strip()
        revised = data.get('revised', '').strip()
        time_played = data.get('time_played', 0)
        completed = data.get('completed', False)
        
        if not revised:
            return jsonify({'success': False, 'error': 'Revised text is required'}), 400
        
        # Evaluate improvement (A2=1, B1=2, B2=3, C1=4)
        revised_lower = revised.lower()
        vocabulary_terms = ['please', 'thank you', 'first', 'then', 'careful', 'safety', 'guide']
        terms_found = [term for term in vocabulary_terms if term in revised_lower]
        
        word_count = len(revised.split())
        improvement = len(revised) > len(original) if original else True
        game_bonus = 1 if (completed and time_played >= 90) else 0
        
        if word_count <= 10 and not improvement:
            score = 1
            level = 'A2'
        elif word_count <= 25 and improvement and len(terms_found) >= 2:
            score = 2
            level = 'B1'
        elif word_count <= 50 and improvement and len(terms_found) >= 3:
            score = 3
            level = 'B2'
        else:
            score = 4
            level = 'C1'
        
        logger.info(f"Phase 5 SubPhase 2 Step 4 Interaction 3 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'game_bonus': game_bonus,
                'feedback': f'Your revision shows {level} level improvement.'
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 4 Interaction 3: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step4/calculate-score', methods=['POST'])
@login_required
def calculate_subphase2_step4_score():
    """Calculate SubPhase 2 Step 4 total score"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)
        
        if not (1 <= interaction1_score <= 4) or not (1 <= interaction2_score <= 4) or not (1 <= interaction3_score <= 4):
            return jsonify({'success': False, 'error': 'Invalid score values'}), 400
        
        total_score = interaction1_score + interaction2_score + interaction3_score
        max_score = 12
        
        avg_score = total_score / 3
        if avg_score <= 1.5:
            remedial_level = 'A2'
        elif avg_score <= 2.5:
            remedial_level = 'B1'
        elif avg_score <= 3.5:
            remedial_level = 'B2'
        else:
            remedial_level = 'C1'
        
        # Store progress
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_progress (user_id, subphase, step_id, interaction_scores, total_score, remedial_level, should_proceed)
            VALUES (?, 2, 4, ?, ?, ?, ?)
            ON CONFLICT(user_id, subphase, step_id) DO UPDATE SET
                interaction_scores = ?,
                total_score = ?,
                remedial_level = ?,
                updated_at = CURRENT_TIMESTAMP
        ''', (
            user_id,
            json.dumps({'interaction1': interaction1_score, 'interaction2': interaction2_score, 'interaction3': interaction3_score}),
            total_score,
            remedial_level,
            False,
            json.dumps({'interaction1': interaction1_score, 'interaction2': interaction2_score, 'interaction3': interaction3_score}),
            total_score,
            remedial_level
        ))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 SubPhase 2 Step 4 scoring - User {user_id}: Total={total_score}, Level={remedial_level}")
        
        return jsonify({
            'success': True,
            'data': {
                'interaction1': {'score': interaction1_score, 'max_score': 4},
                'interaction2': {'score': interaction2_score, 'max_score': 4},
                'interaction3': {'score': interaction3_score, 'max_score': 4},
                'total': {'score': total_score, 'max_score': max_score, 'remedial_level': remedial_level}
            }
        })
    except Exception as e:
        logger.error(f"Error calculating SubPhase 2 Step 4 score: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step4/remedial/log', methods=['POST'])
@login_required
def log_subphase2_step4_remedial():
    """Log remedial task completion for SubPhase 2 Step 4"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_remedial (user_id, subphase, step_id, level, task_scores, total_score, max_score, passed, attempts)
            VALUES (?, 2, 4, ?, ?, ?, ?, ?, 1)
            ON CONFLICT(user_id, subphase, step_id, level) DO UPDATE SET
                task_scores = json_set(COALESCE(task_scores, '{}'), '$.' || ?, ?),
                total_score = total_score + ?,
                attempts = attempts + 1
        ''', (user_id, level, json.dumps({task: score}), score, max_score, score >= max_score * 0.75, task, score, score))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 SubPhase 2 Step 4 Remedial logged - User {user_id}: Level={level}, Task={task}")
        
        return jsonify({'success': True, 'message': 'Remedial activity logged successfully'})
    except Exception as e:
        logger.error(f"Error logging SubPhase 2 Step 4 remedial: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step4/remedial/<level>/final-score', methods=['POST'])
@login_required
def calculate_subphase2_step4_remedial_final_score(level):
    """Calculate final remedial score for SubPhase 2 Step 4 - Pass threshold: 6/8 (75%)"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level_lower = level.lower()
        
        if level_lower == 'a2':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0)
            max_score = 24
            pass_threshold = 18
        elif level_lower == 'b1':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0)
            max_score = 24
            pass_threshold = 18
        elif level_lower == 'b2':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0) + data.get('task_d_score', 0)
            max_score = 32
            pass_threshold = 24
        elif level_lower == 'c1':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0) + data.get('task_d_score', 0)
            max_score = 32
            pass_threshold = 24
        else:
            return jsonify({'success': False, 'error': f'Invalid level: {level}'}), 400
        
        passed = total_score >= pass_threshold
        
        logger.info(f"Phase 5 SubPhase 2 Step 4 Remedial {level} Final - User {user_id}: Total={total_score}/{max_score}, Passed={passed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'pass_threshold': pass_threshold,
                'passed': passed,
                'percentage': round((total_score / max_score) * 100, 1) if max_score > 0 else 0
            }
        })
    except Exception as e:
        logger.error(f"Error calculating SubPhase 2 Step 4 Remedial {level} final score: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SubPhase 2 Step 5: EVALUATE - Correct Faulty Instructions
# ============================================================

@phase5_bp.route('/subphase2/step5/interaction1/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step5_interaction1():
    """Evaluate spelling correction for SubPhase 2 Step 5 Interaction 1"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        faulty_text = data.get('faulty_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        
        if not corrected_text:
            return jsonify({'success': False, 'error': 'Corrected text is required'}), 400
        
        # Evaluate spelling corrections (A2=1, B1=2, B2=3, C1=4)
        spelling_errors = ['pleese', 'thak you', 'furst', 'cairful', 'guied', 'welcom', 'que', 'thankk']
        corrections = ['please', 'thank you', 'first', 'careful', 'guide', 'welcome', 'queue', 'thank']
        
        errors_found = sum(1 for error in spelling_errors if error in faulty_text.lower())
        corrections_made = sum(1 for i, error in enumerate(spelling_errors) if corrections[i] in corrected_text.lower() and error in faulty_text.lower())
        
        accuracy = corrections_made / errors_found if errors_found > 0 else 1.0
        
        if accuracy < 0.5:
            score = 1
            level = 'A2'
        elif accuracy < 0.75:
            score = 2
            level = 'B1'
        elif accuracy < 0.9:
            score = 3
            level = 'B2'
        else:
            score = 4
            level = 'C1'
        
        logger.info(f"Phase 5 SubPhase 2 Step 5 Interaction 1 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'errors_found': errors_found,
                'corrections_made': corrections_made,
                'accuracy': round(accuracy * 100, 1),
                'feedback': f'You corrected {corrections_made} out of {errors_found} spelling errors.'
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 5 Interaction 1: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step5/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step5_interaction2():
    """Evaluate grammar correction for SubPhase 2 Step 5 Interaction 2"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        original_text = data.get('original_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        
        if not corrected_text:
            return jsonify({'success': False, 'error': 'Corrected text is required'}), 400
        
        # Evaluate grammar corrections (A2=1, B1=2, B2=3, C1=4)
        # Check for common grammar fixes: articles, verb forms, sentence structure
        original_lower = original_text.lower()
        corrected_lower = corrected_text.lower()
        
        # Check improvements
        has_articles = any(article in corrected_lower for article in ['the ', 'a ', 'an '])
        has_imperatives = any(verb in corrected_lower for verb in ['welcome', 'check', 'guide', 'help'])
        has_sequencing = any(word in corrected_lower for word in ['first', 'then', 'next'])
        
        improvements = sum([has_articles, has_imperatives, has_sequencing])
        
        if improvements <= 1:
            score = 1
            level = 'A2'
        elif improvements == 2:
            score = 2
            level = 'B1'
        elif improvements == 3:
            score = 3
            level = 'B2'
        else:
            score = 4
            level = 'C1'
        
        logger.info(f"Phase 5 SubPhase 2 Step 5 Interaction 2 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': f'Your grammar corrections show {level} level understanding.'
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 5 Interaction 2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step5/interaction3/evaluate', methods=['POST'])
@login_required
def evaluate_subphase2_step5_interaction3():
    """Evaluate full improvement for SubPhase 2 Step 5 Interaction 3"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        original_text = data.get('original_text', '').strip()
        improved_text = data.get('improved_text', '').strip()
        
        if not improved_text:
            return jsonify({'success': False, 'error': 'Improved text is required'}), 400
        
        # Evaluate full improvement (A2=1, B1=2, B2=3, C1=4)
        improved_lower = improved_text.lower()
        
        has_sequencing = any(word in improved_lower for word in ['first', 'then', 'next', 'after', 'finally'])
        has_polite = any(word in improved_lower for word in ['please', 'thank you', 'thank'])
        has_safety = any(word in improved_lower for word in ['careful', 'safety', 'safe'])
        has_vocabulary = sum(1 for term in ['guide', 'welcome', 'help', 'queue'] if term in improved_lower)
        
        improvements = sum([has_sequencing, has_polite, has_safety, has_vocabulary >= 2])
        word_count = len(improved_text.split())
        
        if improvements <= 1 or word_count <= 10:
            score = 1
            level = 'A2'
        elif improvements == 2 and word_count <= 25:
            score = 2
            level = 'B1'
        elif improvements == 3 and word_count <= 50:
            score = 3
            level = 'B2'
        else:
            score = 4
            level = 'C1'
        
        logger.info(f"Phase 5 SubPhase 2 Step 5 Interaction 3 - User {user_id}: Score={score}, Level={level}")
        
        return jsonify({
            'success': True,
            'data': {
                'score': score,
                'level': level,
                'feedback': f'Your improvements show {level} level understanding.'
            }
        })
    except Exception as e:
        logger.error(f"Error evaluating SubPhase 2 Step 5 Interaction 3: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step5/calculate-score', methods=['POST'])
@login_required
def calculate_subphase2_step5_score():
    """Calculate SubPhase 2 Step 5 total score and overall SubPhase 2 progression"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)
        
        if not (1 <= interaction1_score <= 4) or not (1 <= interaction2_score <= 4) or not (1 <= interaction3_score <= 4):
            return jsonify({'success': False, 'error': 'Invalid score values'}), 400
        
        total_score = interaction1_score + interaction2_score + interaction3_score
        max_score = 12
        
        avg_score = total_score / 3
        if avg_score <= 1.5:
            remedial_level = 'A2'
        elif avg_score <= 2.5:
            remedial_level = 'B1'
        elif avg_score <= 3.5:
            remedial_level = 'B2'
        else:
            remedial_level = 'C1'
        
        # Calculate total SubPhase 2 score across all steps
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get scores from all steps
        cursor.execute('''
            SELECT total_score FROM phase5_progress
            WHERE user_id = ? AND subphase = 2 AND step_id IN (1, 2, 3, 4, 5)
        ''', (user_id,))
        
        step_scores = [row[0] for row in cursor.fetchall()]
        overall_total = sum(step_scores) if step_scores else total_score
        
        # Store Step 5 progress
        cursor.execute('''
            INSERT INTO phase5_progress (user_id, subphase, step_id, interaction_scores, total_score, remedial_level, should_proceed)
            VALUES (?, 2, 5, ?, ?, ?, ?)
            ON CONFLICT(user_id, subphase, step_id) DO UPDATE SET
                interaction_scores = ?,
                total_score = ?,
                remedial_level = ?,
                should_proceed = ?,
                updated_at = CURRENT_TIMESTAMP
        ''', (
            user_id,
            json.dumps({'interaction1': interaction1_score, 'interaction2': interaction2_score, 'interaction3': interaction3_score}),
            total_score,
            remedial_level,
            overall_total >= 12,  # 12 points needed to proceed
            json.dumps({'interaction1': interaction1_score, 'interaction2': interaction2_score, 'interaction3': interaction3_score}),
            total_score,
            remedial_level,
            overall_total >= 12
        ))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 SubPhase 2 Step 5 scoring - User {user_id}: Total={total_score}, Overall={overall_total}, Level={remedial_level}, Proceed={overall_total >= 12}")
        
        return jsonify({
            'success': True,
            'data': {
                'interaction1': {'score': interaction1_score, 'max_score': 4},
                'interaction2': {'score': interaction2_score, 'max_score': 4},
                'interaction3': {'score': interaction3_score, 'max_score': 4},
                'total': {
                    'score': total_score,
                    'max_score': max_score,
                    'remedial_level': remedial_level
                },
                'overall': {
                    'total_score': overall_total,
                    'required_score': 12,
                    'should_proceed': overall_total >= 12
                }
            }
        })
    except Exception as e:
        logger.error(f"Error calculating SubPhase 2 Step 5 score: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step5/remedial/log', methods=['POST'])
@login_required
def log_subphase2_step5_remedial():
    """Log remedial task completion for SubPhase 2 Step 5"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO phase5_remedial (user_id, subphase, step_id, level, task_scores, total_score, max_score, passed, attempts)
            VALUES (?, 2, 5, ?, ?, ?, ?, ?, 1)
            ON CONFLICT(user_id, subphase, step_id, level) DO UPDATE SET
                task_scores = json_set(COALESCE(task_scores, '{}'), '$.' || ?, ?),
                total_score = total_score + ?,
                attempts = attempts + 1
        ''', (user_id, level, json.dumps({task: score}), score, max_score, score >= max_score * 0.75, task, score, score))
        conn.commit()
        conn.close()
        
        logger.info(f"Phase 5 SubPhase 2 Step 5 Remedial logged - User {user_id}: Level={level}, Task={task}")
        
        return jsonify({'success': True, 'message': 'Remedial activity logged successfully'})
    except Exception as e:
        logger.error(f"Error logging SubPhase 2 Step 5 remedial: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/step5/remedial/<level>/final-score', methods=['POST'])
@login_required
def calculate_subphase2_step5_remedial_final_score(level):
    """Calculate final remedial score for SubPhase 2 Step 5 - Pass threshold: 6/8 (75%)"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        level_lower = level.lower()
        
        if level_lower == 'a2':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0)
            max_score = 24
            pass_threshold = 18
        elif level_lower == 'b1':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0)
            max_score = 24
            pass_threshold = 18
        elif level_lower == 'b2':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0) + data.get('task_d_score', 0)
            max_score = 32
            pass_threshold = 24
        elif level_lower == 'c1':
            total_score = data.get('task_a_score', 0) + data.get('task_b_score', 0) + data.get('task_c_score', 0) + data.get('task_d_score', 0)
            max_score = 32
            pass_threshold = 24
        else:
            return jsonify({'success': False, 'error': f'Invalid level: {level}'}), 400
        
        passed = total_score >= pass_threshold
        
        logger.info(f"Phase 5 SubPhase 2 Step 5 Remedial {level} Final - User {user_id}: Total={total_score}/{max_score}, Passed={passed}")
        
        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': max_score,
                'pass_threshold': pass_threshold,
                'passed': passed,
                'percentage': round((total_score / max_score) * 100, 1) if max_score > 0 else 0
            }
        })
    except Exception as e:
        logger.error(f"Error calculating SubPhase 2 Step 5 Remedial {level} final score: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# PHASE 5 PROGRESSION & COMPLETION CHECKS
# ============================================================

@phase5_bp.route('/subphase1/check-completion', methods=['GET'])
@login_required
def check_subphase1_completion():
    """Check if SubPhase 1 is completed and calculate total score"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all step scores for SubPhase 1
        cursor.execute('''
            SELECT step_id, total_score FROM phase5_progress
            WHERE user_id = ? AND subphase = 1 AND step_id IN (1, 2, 3, 4, 5)
            ORDER BY step_id
        ''', (user_id,))
        
        step_scores = cursor.fetchall()
        conn.close()
        
        # Calculate total score
        total_score = sum(row[1] for row in step_scores) if step_scores else 0
        
        # Check if all 5 steps are completed
        completed_steps = len(step_scores)
        all_steps_complete = completed_steps >= 5
        
        # Check if score meets threshold (>= 20)
        meets_threshold = total_score >= 20
        
        # SubPhase 1 is considered complete if all steps done AND score >= 20
        is_complete = all_steps_complete and meets_threshold
        
        logger.info(f"SubPhase 1 completion check - User {user_id}: Steps={completed_steps}/5, Score={total_score}/20, Complete={is_complete}")
        
        return jsonify({
            'success': True,
            'data': {
                'completed_steps': completed_steps,
                'total_steps': 5,
                'total_score': total_score,
                'required_score': 20,
                'all_steps_complete': all_steps_complete,
                'meets_threshold': meets_threshold,
                'is_complete': is_complete,
                'step_scores': {row[0]: row[1] for row in step_scores}
            }
        })
    except Exception as e:
        logger.error(f"Error checking SubPhase 1 completion: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase5_bp.route('/subphase2/check-completion', methods=['GET'])
@login_required
def check_subphase2_completion():
    """Check if SubPhase 2 is completed and calculate total score"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all step scores for SubPhase 2
        cursor.execute('''
            SELECT step_id, total_score FROM phase5_progress
            WHERE user_id = ? AND subphase = 2 AND step_id IN (1, 2, 3, 4, 5)
            ORDER BY step_id
        ''', (user_id,))
        
        step_scores = cursor.fetchall()
        conn.close()
        
        # Calculate total score
        total_score = sum(row[1] for row in step_scores) if step_scores else 0
        
        # Check if all 5 steps are completed
        completed_steps = len(step_scores)
        all_steps_complete = completed_steps >= 5
        
        # Check if score meets threshold (>= 12)
        meets_threshold = total_score >= 12
        
        # SubPhase 2 is considered complete if all steps done AND score >= 12
        is_complete = all_steps_complete and meets_threshold
        
        logger.info(f"SubPhase 2 completion check - User {user_id}: Steps={completed_steps}/5, Score={total_score}/12, Complete={is_complete}")
        
        return jsonify({
            'success': True,
            'data': {
                'completed_steps': completed_steps,
                'total_steps': 5,
                'total_score': total_score,
                'required_score': 12,
                'all_steps_complete': all_steps_complete,
                'meets_threshold': meets_threshold,
                'is_complete': is_complete,
                'step_scores': {row[0]: row[1] for row in step_scores}
            }
        })
    except Exception as e:
        logger.error(f"Error checking SubPhase 2 completion: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
