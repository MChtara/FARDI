"""
Phase 4 API Routes
Marketing & Promotion phase endpoints
"""
from flask import Blueprint, request, jsonify, session
from routes.auth_routes import login_required
from models.phase4_loader import get_phase4_step
from services.ai_service import AIService
import logging
import json

logger = logging.getLogger(__name__)

# Create blueprint
phase4_bp = Blueprint('phase4', __name__, url_prefix='/api/phase4')

# Initialize AI service
ai_service = AIService()

@phase4_bp.route('/step/<int:step_id>', methods=['GET'])
@login_required
def get_step(step_id):
    """Get Phase 4 step data"""
    try:
        step_data = get_phase4_step(step_id)
        
        if not step_data:
            return jsonify({
                'success': False,
                'error': f'Step {step_id} not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': step_data
        })
    except Exception as e:
        logger.error(f"Error getting Phase 4 step {step_id}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step/<int:step_id>/submit', methods=['POST'])
@login_required
def submit_response(step_id):
    """Submit Phase 4 step response"""
    try:
        user_id = session.get('user_id')
        data = request.json

        # TODO: Implement response submission logic
        # For now, just return success

        return jsonify({
            'success': True,
            'message': 'Response submitted successfully'
        })
    except Exception as e:
        logger.error(f"Error submitting Phase 4 step {step_id} response: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/remedial/log', methods=['POST'])
@login_required
def log_remedial_task():
    """
    Log remedial task completion
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        time_taken = data.get('time_taken', 0)

        # TERMINAL OUTPUT - Detailed logging
        print("\n" + "="*60)
        print(f"REMEDIAL PHASE - LEVEL {level} - TASK {task}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Score: {score}/{max_score} points")
        print(f"Time Taken: {time_taken} seconds")
        print(f"Success Rate: {(score/max_score)*100:.1f}%")
        print("="*60 + "\n")

        logger.info(f"Remedial {level} Task {task} - User {user_id}: Score={score}/{max_score}, Time={time_taken}s")

        return jsonify({
            'success': True,
            'message': 'Remedial task logged successfully'
        })

    except Exception as e:
        logger.error(f"Error logging remedial task: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step/1/calculate-score', methods=['POST'])
@login_required
def calculate_step1_score():
    """
    Calculate Phase 4 Step 1 total score and CEFR level
    Based on 3 interactions:
    - Interaction 1 (Matching): 0-8 points
    - Interaction 2 (Wordshake): 0-8 points
    - Interaction 3 (Sentence): 1-5 points (CEFR A1-C1)
    Total: 21 points max
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)

        # Validate scores
        if not (0 <= interaction1_score <= 8):
            return jsonify({
                'success': False,
                'error': 'Interaction 1 score must be between 0 and 8'
            }), 400

        if not (0 <= interaction2_score <= 8):
            return jsonify({
                'success': False,
                'error': 'Interaction 2 score must be between 0 and 8'
            }), 400

        if not (1 <= interaction3_score <= 5):
            return jsonify({
                'success': False,
                'error': 'Interaction 3 score must be between 1 and 5'
            }), 400

        # Calculate CEFR levels for individual interactions
        def get_interaction_level(score):
            """Map 8-point score to CEFR level"""
            if score == 1:
                return 'A1'
            elif score <= 3:
                return 'A2'
            elif score <= 5:
                return 'B1'
            elif score <= 7:
                return 'B2'
            elif score == 8:
                return 'C1'
            else:
                return 'Below A1'

        interaction1_level = get_interaction_level(interaction1_score)
        interaction2_level = get_interaction_level(interaction2_score)

        # Interaction 3 already has CEFR level from sentence evaluation
        level_to_name = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
        interaction3_level = level_to_name.get(interaction3_score, 'A1')

        # Calculate total score
        total_score = interaction1_score + interaction2_score + interaction3_score

        # Determine remedial CEFR level based on total score
        if total_score <= 3:
            remedial_level = 'Remedial A1'
        elif total_score <= 8:
            remedial_level = 'Remedial A2'
        elif total_score <= 13:
            remedial_level = 'Remedial B1'
        elif total_score <= 18:
            remedial_level = 'Remedial B2'
        elif total_score <= 21:
            remedial_level = 'Remedial C1'
        else:
            remedial_level = 'Unknown'

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("PHASE 4 STEP 1 - SCORING RESULTS")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nInteraction 1 (Matching Game):")
        print(f"  Score: {interaction1_score}/8 points")
        print(f"  Level: {interaction1_level}")
        print(f"\nInteraction 2 (Wordshake Game):")
        print(f"  Score: {interaction2_score}/8 points")
        print(f"  Level: {interaction2_level}")
        print(f"\nInteraction 3 (Sentence Production):")
        print(f"  Score: {interaction3_score}/5 points")
        print(f"  Level: {interaction3_level}")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/21 points")
        print(f"REMEDIAL LEVEL: {remedial_level}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 1 scoring - User {user_id}: I1={interaction1_score}, I2={interaction2_score}, I3={interaction3_score}, Total={total_score}, Level={remedial_level}")

        return jsonify({
            'success': True,
            'data': {
                'interaction1': {
                    'score': interaction1_score,
                    'max_score': 8,
                    'level': interaction1_level
                },
                'interaction2': {
                    'score': interaction2_score,
                    'max_score': 8,
                    'level': interaction2_level
                },
                'interaction3': {
                    'score': interaction3_score,
                    'max_score': 5,
                    'level': interaction3_level
                },
                'total': {
                    'score': total_score,
                    'max_score': 21,
                    'remedial_level': remedial_level
                }
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 1 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/remedial/a1/final-score', methods=['POST'])
@login_required
def calculate_a1_final_score():
    """
    Calculate and log Remedial A1 final score
    Pass threshold: >= 13/16
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        total_score = task_a_score + task_b_score
        passed = total_score >= 13

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("REMEDIAL A1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Drag-Drop Matching):")
        print(f"  Score: {task_a_score}/8 points")
        print(f"\nTask B (Wordle Game):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/16 points")
        print(f"PASS THRESHOLD: 13/16 points")
        print(f"RESULT: {'✅ PASSED' if passed else '❌ FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Remedial A1 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'total_score': total_score,
                'max_score': 16,
                'passed': passed,
                'pass_threshold': 13
            }
        })

    except Exception as e:
        logger.error(f"Error calculating A1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/remedial/a2/final-score', methods=['POST'])
@login_required
def calculate_a2_final_score():
    """
    Calculate and log Remedial A2 final score
    Pass threshold: >= 13/16
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        total_score = task_a_score + task_b_score
        passed = total_score >= 13

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("REMEDIAL A2 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Chat Challenge):")
        print(f"  Score: {task_a_score}/8 points")
        print(f"\nTask B (Expand Quest):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/16 points")
        print(f"PASS THRESHOLD: 13/16 points")
        print(f"RESULT: {'✅ PASSED' if passed else '❌ FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Remedial A2 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'total_score': total_score,
                'max_score': 16,
                'passed': passed,
                'pass_threshold': 13
            }
        })

    except Exception as e:
        logger.error(f"Error calculating A2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/remedial/b1/final-score', methods=['POST'])
@login_required
def calculate_b1_final_score():
    """
    Calculate and log Remedial B1 final score
    Pass threshold: >= 22/27
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        task_d_score = data.get('task_d_score', 0)
        total_score = task_a_score + task_b_score + task_c_score + task_d_score
        passed = total_score >= 22

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("REMEDIAL B1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Dialogue):")
        print(f"  Score: {task_a_score}/5 points")
        print(f"\nTask B (Proposals):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\nTask C (Quiz):")
        print(f"  Score: {task_c_score}/6 points")
        print(f"\nTask D (Matching):")
        print(f"  Score: {task_d_score}/8 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/27 points")
        print(f"PASS THRESHOLD: 22/27 points")
        print(f"RESULT: {'✅ PASSED' if passed else '❌ FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Remedial B1 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, TaskD={task_d_score}, Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'task_d_score': task_d_score,
                'total_score': total_score,
                'max_score': 27,
                'passed': passed,
                'pass_threshold': 22
            }
        })

    except Exception as e:
        logger.error(f"Error calculating B1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/remedial/b2/final-score', methods=['POST'])
@login_required
def calculate_b2_final_score():
    """
    Calculate and log Remedial B2 final score
    Pass threshold: >= 24/30
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        task_d_score = data.get('task_d_score', 0)
        total_score = task_a_score + task_b_score + task_c_score + task_d_score
        passed = total_score >= 24

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("REMEDIAL B2 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Role-Play RPG):")
        print(f"  Score: {task_a_score}/8 points")
        print(f"\nTask B (Compare Quest):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\nTask C (Sushi Spell):")
        print(f"  Score: {task_c_score}/8 points")
        print(f"\nTask D (Kahoot Quiz):")
        print(f"  Score: {task_d_score}/6 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/30 points")
        print(f"PASS THRESHOLD: 24/30 points")
        print(f"RESULT: {'✅ PASSED' if passed else '❌ FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Remedial B2 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, TaskD={task_d_score}, Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'task_d_score': task_d_score,
                'total_score': total_score,
                'max_score': 30,
                'passed': passed,
                'pass_threshold': 24
            }
        })

    except Exception as e:
        logger.error(f"Error calculating B2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/remedial/c1/final-score', methods=['POST'])
@login_required
def calculate_c1_final_score():
    """
    Calculate and log Remedial C1 final score
    Pass threshold: >= 16/19
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        task_d_score = data.get('task_d_score', 0)
        total_score = task_a_score + task_b_score + task_c_score + task_d_score
        passed = total_score >= 16

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("REMEDIAL C1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Debate Duel):")
        print(f"  Score: {task_a_score}/4 points")
        print(f"\nTask B (Critique Challenge):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\nTask C (Wordshake):")
        print(f"  Score: {task_c_score}/6 points")
        print(f"\nTask D (Live Debate):")
        print(f"  Score: {task_d_score}/1 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/19 points")
        print(f"PASS THRESHOLD: 16/19 points")
        print(f"RESULT: {'✅ PASSED' if passed else '❌ FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Remedial C1 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, TaskD={task_d_score}, Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'task_d_score': task_d_score,
                'total_score': total_score,
                'max_score': 19,
                'passed': passed,
                'pass_threshold': 16
            }
        })

    except Exception as e:
        logger.error(f"Error calculating C1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/evaluate-writing', methods=['POST'])
def evaluate_writing():
    """
    Evaluate B2 comparison writing with AI
    Returns score: 1 (correct) or 0 (incorrect)

    Request body:
    {
        "question": "The guided question",
        "answer": "Student's comparison answer",
        "level": "B2",
        "task": "comparison",
        "criteria": {
            "requiresComparison": true,
            "glossaryTerms": ["billboard", "eye-catcher", ...],
            "minTermsRequired": 1
        }
    }

    Returns:
    {
        "score": 1 or 0,
        "feedback": "AI feedback message"
    }
    """
    try:
        data = request.get_json()
        question = data.get('question', '')
        answer = data.get('answer', '').strip()
        level = data.get('level', 'B2')
        task_type = data.get('task', 'comparison')
        criteria = data.get('criteria', {})

        glossary_terms = criteria.get('glossaryTerms', [])
        requires_comparison = criteria.get('requiresComparison', True)

        if not answer:
            return jsonify({
                'score': 0,
                'feedback': 'Please write your comparison.'
            })

        # Check minimum length
        if len(answer.split()) < 5:
            return jsonify({
                'score': 0,
                'feedback': 'Your answer is too short. Please provide more detail.'
            })

        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = f"""You are a CEFR {level} language assessment expert evaluating comparison writing.

Evaluate the student's answer based on:
1. Uses comparative language (while, whereas, compared to, unlike, in contrast, better than, etc.)
2. Addresses the question logically
3. Uses appropriate marketing/promotional vocabulary
4. Makes a clear comparison between two things
5. Is coherent and relevant

IMPORTANT:
- Be FLEXIBLE at {level} level - accept answers that show effort even if grammar isn't perfect
- Focus on whether they made a COMPARISON and used relevant terminology
- Score 1 (correct) if the answer shows understanding and attempts comparison
- Score 0 (incorrect) only if the answer is completely irrelevant, nonsensical, or shows no effort

Respond ONLY in JSON format:
{{
    "score": 1 or 0,
    "feedback": "Brief encouraging feedback (1-2 sentences, no examples)"
}}"""

                user_prompt = f"""
Question: {question}

Available glossary terms: {', '.join(glossary_terms)}

Student's Answer:
"{answer}"

Does this answer demonstrate comparison writing at {level} level?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'score': result.get('score', 1),
                    'feedback': result.get('feedback', 'Good comparison!')
                })

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Local evaluation
        answer_lower = answer.lower()

        # Check for comparative language
        comparative_words = ['while', 'whereas', 'compared to', 'unlike', 'in contrast', 'better than',
                            'worse than', 'more', 'less', 'differ', 'difference', 'but', 'however']
        has_comparison = any(word in answer_lower for word in comparative_words)

        # Check for glossary terms
        terms_used = sum(1 for term in glossary_terms if term.lower() in answer_lower)

        # Determine score
        if has_comparison and len(answer.split()) >= 5:
            score = 1
            if terms_used > 0:
                feedback = f"Good comparison! You used relevant terminology."
            else:
                feedback = "Good comparison! Try to include more marketing terms."
        else:
            score = 0
            if not has_comparison:
                feedback = "Try to make a clear comparison using words like 'while', 'whereas', or 'compared to'."
            else:
                feedback = "Please provide more detail in your comparison."

        return jsonify({
            'score': score,
            'feedback': feedback
        })

    except Exception as e:
        logger.error(f"Evaluation error: {str(e)}")
        return jsonify({
            'score': 0,
            'feedback': 'Unable to evaluate answer. Please try again.'
        })

@phase4_bp.route('/step3/remedial/a1/final-score', methods=['POST'])
@login_required
def calculate_step3_a1_final_score():
    """
    Calculate and log Phase 4 Step 2 Remedial A1 final score
    Pass threshold: >= 18/22 (~82%)
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        total_score = task_a_score + task_b_score + task_c_score
        passed = total_score >= 18

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("PHASE 4 STEP 2 - REMEDIAL A1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Term Treasure Hunt):")
        print(f"  Score: {task_a_score}/8 points")
        print(f"\nTask B (Fill Quest):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\nTask C (Sentence Builder):")
        print(f"  Score: {task_c_score}/6 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/22 points")
        print(f"PASS THRESHOLD: 18/22 points (~82%)")
        print(f"RESULT: {'✅ PASSED' if passed else '❌ FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 2 Remedial A1 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'total_score': total_score,
                'max_score': 22,
                'passed': passed,
                'pass_threshold': 18
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Step 2 A1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step3/remedial/a2/final-score', methods=['POST'])
@login_required
def calculate_step3_a2_final_score():
    """
    Calculate and log Phase 4 Step 2 Remedial A2 final score
    Pass threshold: >= 18/22 (~82%)
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        task_c_score = data.get('task_c_score', 0)
        total_score = task_a_score + task_b_score + task_c_score
        passed = total_score >= 18

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("PHASE 4 STEP 2 - REMEDIAL A2 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Dialogue Adventure):")
        print(f"  Score: {task_a_score}/8 points")
        print(f"\nTask B (Expand Empire):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\nTask C (Connector Quest):")
        print(f"  Score: {task_c_score}/6 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/22 points")
        print(f"PASS THRESHOLD: 18/22 points (~82%)")
        print(f"RESULT: {'✅ PASSED' if passed else '❌ FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 2 Remedial A2 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'total_score': total_score,
                'max_score': 22,
                'passed': passed,
                'pass_threshold': 18
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Step 2 A2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/evaluate-simple-sentences', methods=['POST'])
def evaluate_simple_sentences():
    """
    Evaluate multiple A1 sentences with AI in a single call
    Returns: list of {isCorrect: True/False} for each sentence

    Request body:
    {
        "sentences": [
            {"term": "promotional", "hint": "The ad is ___.", "userAnswer": "...", "correctAnswer": "..."},
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        sentences = data.get('sentences', [])

        if not sentences:
            return jsonify({
                'success': False,
                'error': 'No sentences provided'
            }), 400

        # Use AI evaluation if available
        if ai_service.client:
            try:
                # Build evaluation prompt for all sentences at once
                sentences_text = ""
                for idx, sent in enumerate(sentences, 1):
                    sentences_text += f"\nSentence {idx}:\n"
                    sentences_text += f"  Term: {sent.get('term', '')}\n"
                    sentences_text += f"  Hint: {sent.get('hint', '')}\n"
                    sentences_text += f"  Student Answer: \"{sent.get('userAnswer', '')}\"\n"

                system_prompt = """You are evaluating A1 level English sentences for a language learning exercise.

For EACH sentence, evaluate if it is correct based on these criteria:
1. Uses present simple tense correctly (is, has, be, are)
2. Contains the required term (IGNORE minor spelling mistakes - accept if 80%+ letters are correct)
3. Meaning is clear and makes sense

IMPORTANT - BE FLEXIBLE:
- Accept minor spelling mistakes (e.g., "promotinal" for "promotional")
- Accept simple grammar variations (e.g., "The ad is..." or "Ad is...")
- Focus on: Does it use the term? Does it use present simple? Is meaning clear?

Respond ONLY with valid JSON array with exactly one result per sentence:
{
    "results": [
        {"isCorrect": true},
        {"isCorrect": false},
        ...
    ]
}"""

                user_prompt = f"""Evaluate these {len(sentences)} A1 sentences:{sentences_text}

Return ONLY valid JSON with results array."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=300,
                    temperature=0.2
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                # Validate results length
                if 'results' in result and len(result['results']) == len(sentences):
                    return jsonify({
                        'success': True,
                        'results': result['results']
                    })
                else:
                    logger.warning(f"AI returned incorrect number of results: expected {len(sentences)}, got {len(result.get('results', []))}")
                    # Fall through to local evaluation

            except Exception as e:
                logger.error(f"AI batch sentence evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Local evaluation for all sentences
        results = []
        for sent in sentences:
            user_answer = sent.get('userAnswer', '').strip().lower()
            term = sent.get('term', '').lower()

            # Simple check
            has_term = term in user_answer
            has_verb = any(verb in user_answer for verb in ['is', 'are', 'has', 'have', 'be'])
            is_valid = has_term and has_verb and len(user_answer.split()) >= 3

            results.append({'isCorrect': is_valid})

        return jsonify({
            'success': True,
            'results': results
        })

    except Exception as e:
        logger.error(f"Batch sentence evaluation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/evaluate-simple-sentence', methods=['POST'])
def evaluate_simple_sentence():
    """
    Evaluate simple A1 sentence with AI
    Returns: isCorrect (True/False)

    Criteria:
    - Correct present simple tense (is, has, be, are)
    - Contains the required term (ignore minor spelling)
    - Meaning is clear
    """
    try:
        data = request.get_json()
        term = data.get('term', '')
        hint = data.get('hint', '')
        user_answer = data.get('userAnswer', '').strip()
        correct_answer = data.get('correctAnswer', '')

        if not user_answer:
            return jsonify({
                'success': True,
                'isCorrect': False
            })

        # Check minimum length
        if len(user_answer.split()) < 3:
            return jsonify({
                'success': True,
                'isCorrect': False
            })

        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = f"""You are evaluating A1 level English sentences for a language learning exercise.

Evaluate if the student's sentence is correct based on these criteria:
1. Uses present simple tense correctly (is, has, be, are)
2. Contains the term "{term}" (IGNORE minor spelling mistakes - accept if 80%+ letters are correct)
3. Meaning is clear and makes sense
4. Follows the hint: {hint}

IMPORTANT - BE FLEXIBLE:
- Accept minor spelling mistakes (e.g., "promotinal" for "promotional")
- Accept simple grammar variations (e.g., "The ad is..." or "Ad is...")
- Focus on: Does it use the term? Does it use present simple? Is meaning clear?

Example correct answers:
- "{correct_answer}"
- Variations with minor spelling/grammar differences

Respond ONLY with valid JSON:
{{
    "isCorrect": true or false
}}"""

                user_prompt = f"""
Term: {term}
Hint: {hint}
Student's Answer: "{user_answer}"

Is this sentence correct at A1 level? Remember to ignore minor spelling mistakes.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=100,
                    temperature=0.2
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'success': True,
                    'isCorrect': result.get('isCorrect', False)
                })

            except Exception as e:
                logger.error(f"AI sentence evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Local evaluation
        answer_lower = user_answer.lower()
        term_lower = term.lower()

        # Check for term (flexible)
        has_term = term_lower in answer_lower

        # Check for present simple verbs
        has_verb = any(verb in answer_lower for verb in ['is', 'are', 'has', 'have', 'be'])

        # Simple evaluation
        is_correct = has_term and has_verb and len(user_answer.split()) >= 3

        return jsonify({
            'success': True,
            'isCorrect': is_correct
        })

    except Exception as e:
        logger.error(f"Simple sentence evaluation error: {str(e)}")
        return jsonify({
            'success': False,
            'isCorrect': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/evaluate-definition', methods=['POST'])
def evaluate_definition():
    """
    Evaluate vocabulary definition with AI (for Step 2 Interaction 1)
    Returns score: 1-5 (CEFR A1-C1)

    Request body:
    {
        "question": "What is 'persuasive' for posters?",
        "answer": "Student's definition",
        "term": "persuasive",
        "context": "advertising and posters",
        "expectedConcepts": ["convince", "ethos", "pathos", "logos"],
        "level": "B1"
    }

    Returns:
    {
        "score": 1-5,
        "level": "A1" | "A2" | "B1" | "B2" | "C1",
        "feedback": "AI feedback message"
    }
    """
    try:
        data = request.get_json()
        question = data.get('question', '')
        answer = data.get('answer', '').strip()
        term = data.get('term', 'persuasive')
        context = data.get('context', 'advertising')
        expected_concepts = data.get('expectedConcepts', [])
        target_level = data.get('level', 'B1')

        if not answer:
            return jsonify({
                'score': 0,
                'level': 'Below A1',
                'feedback': f'Please write your definition of "{term}".'
            })

        # Check minimum length
        if len(answer.split()) < 3:
            return jsonify({
                'score': 1,
                'level': 'A1',
                'feedback': 'Your answer is very short. Try to provide more detail.'
            })

        # Use AI evaluation if available
        if ai_service.client:
            try:
                # Specific prompts based on term
                if term.lower() == 'persuasive':
                    scoring_guide = """
CEFR Scoring Guidelines for "persuasive":
- A1 (score 1): "Persuasive is make buy. Video say convince." (basic, fragmented)
- A2 (score 2): "Persuasive is to convince people to buy, like video say with feelings." (simple with basic concepts)
- B1 (score 3): "Persuasive means using ethos, pathos, logos to make the poster convince viewers the product is better, as the video explained for ads." (clear with specific concepts)
- B2 (score 4): "Persuasive advertising in posters involves emotional, logical, and credible appeals to demonstrate superiority over competitors, as detailed in the video's pathos/ethos/logos section." (detailed with multiple appeals)
- C1 (score 5): "Persuasive techniques for posters draw on ethos (authority), pathos (emotions), and logos (logic) to influence purchasing habits by highlighting product superiority, mirroring the video's emphasis on convincing consumers effectively without overt pressure." (sophisticated, nuanced understanding)
"""
                elif term.lower() == 'dramatisation':
                    scoring_guide = """
CEFR Scoring Guidelines for "dramatisation":
- A1 (score 1): "Dramatisation is story. Video show people try." (basic, fragmented)
- A2 (score 2): "Dramatisation is story with goal in video, like first video say character try something." (simple with goal mentioned)
- B1 (score 3): "Dramatisation is creating a sketch with relatable character, clear goal, and obstacles to engage, as the first video explained for short films." (clear with character/goal/obstacles)
- B2 (score 4): "Dramatisation uses scripted scenes with character goals and visual obstacles for emotional impact, as illustrated in the first video's drama principles and second's small ideas for seamless ads." (detailed with emotional impact)
- C1 (score 5): "Dramatisation employs theatrical storytelling with relatable characters facing filmable goals and obstacles to captivate viewers persuasively, as the first video's principles demonstrate, aligning with the second video's advocacy for small, frictionless ideas that integrate products naturally." (sophisticated with both videos referenced)
"""
                else:
                    scoring_guide = f"""
CEFR Scoring Guidelines:
- A1 (score 1): Very simple, fragmented definition
- A2 (score 2): Simple definition with basic concepts
- B1 (score 3): Clear definition with specific concepts mentioned
- B2 (score 4): Detailed definition with multiple concepts and clear application
- C1 (score 5): Sophisticated definition with nuanced understanding
"""

                system_prompt = f"""You are a CEFR language assessment expert evaluating vocabulary definitions.

Evaluate the student's definition of "{term}" in the context of {context}.

{scoring_guide}

Expected concepts: {', '.join(expected_concepts)}

Respond ONLY in JSON format:
{{
    "score": 1-5,
    "level": "A1" | "A2" | "B1" | "B2" | "C1",
    "feedback": "Encouraging feedback (1-2 sentences)"
}}"""

                user_prompt = f"""
Question: {question}

Student's Answer:
"{answer}"

Evaluate this definition and assign a CEFR level.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=150,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'score': result.get('score', 3),
                    'level': result.get('level', 'B1'),
                    'feedback': result.get('feedback', 'Good definition!')
                })

            except Exception as e:
                logger.error(f"AI definition evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Local evaluation
        answer_lower = answer.lower()

        # Check for key concepts
        has_convince = 'convince' in answer_lower or 'persuade' in answer_lower
        has_ethos = 'ethos' in answer_lower or 'credible' in answer_lower or 'authority' in answer_lower
        has_pathos = 'pathos' in answer_lower or 'emotion' in answer_lower or 'feeling' in answer_lower
        has_logos = 'logos' in answer_lower or 'logic' in answer_lower or 'reason' in answer_lower

        # Count rhetorical appeals
        appeal_count = sum([has_ethos, has_pathos, has_logos])
        word_count = len(answer.split())

        # Determine score and level
        if appeal_count >= 2 and word_count >= 20:
            score = 5
            level = 'C1'
            feedback = 'Excellent! Your definition shows sophisticated understanding of persuasive techniques.'
        elif appeal_count >= 2 or (appeal_count == 1 and word_count >= 15):
            score = 4
            level = 'B2'
            feedback = 'Very good! You mentioned key persuasive concepts with good detail.'
        elif appeal_count >= 1 and has_convince:
            score = 3
            level = 'B1'
            feedback = 'Good definition! You mentioned key concepts from the video.'
        elif has_convince and word_count >= 7:
            score = 2
            level = 'A2'
            feedback = 'Good start! Try to include concepts like ethos, pathos, or logos.'
        else:
            score = 1
            level = 'A1'
            feedback = 'Basic definition. Watch the video again and include concepts like ethos, pathos, or logos.'

        return jsonify({
            'score': score,
            'level': level,
            'feedback': feedback
        })

    except Exception as e:
        logger.error(f"Definition evaluation error: {str(e)}")
        return jsonify({
            'score': 1,
            'level': 'A1',
            'feedback': 'Unable to evaluate answer. Please try again.'
        })

@phase4_bp.route('/step3/remedial/b2/final-score', methods=['POST'])
@login_required
def calculate_step3_b2_final_score():
    """
    Calculate and log Phase 4 Step 2 Remedial B2 final score
    Pass threshold: >= 15/18 (~83%)
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        task_a_score = data.get('task_a_score', 0)
        task_b_score = data.get('task_b_score', 0)
        total_score = task_a_score + task_b_score
        passed = total_score >= 15

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("PHASE 4 STEP 2 - REMEDIAL B2 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nTask A (Role-Play Saga):")
        print(f"  Score: {task_a_score}/10 points")
        print(f"\nTask B (Explain Expedition):")
        print(f"  Score: {task_b_score}/8 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE: {total_score}/18 points")
        print(f"PASS THRESHOLD: 15/18 points (~83%)")
        print(f"RESULT: {'✅ PASSED' if passed else '❌ FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 2 Remedial B2 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'total_score': total_score,
                'max_score': 18,
                'passed': passed,
                'pass_threshold': 15
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Step 2 B2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step3/remedial/b1/final-score', methods=['POST'])
@login_required
def calculate_step3_b1_final_score():
    """
    Calculate and log Phase 4 Step 2 Remedial B1 final score
    Pass threshold: >= 22/27 (~81%)
    Required tasks: A (5), B (8), C (6), D (8)
    Bonus tasks: E (6), F (6)
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        task_a_score = data.get('task_a_score', 0)  # Negotiation Battle
        task_b_score = data.get('task_b_score', 0)  # Definition Duel
        task_c_score = data.get('task_c_score', 0)  # Wordshake Quiz
        task_d_score = data.get('task_d_score', 0)  # Flashcard Game
        task_e_score = data.get('task_e_score', 0)  # Tense Time Travel (bonus)
        task_f_score = data.get('task_f_score', 0)  # Grammar Kahoot (bonus)

        # Calculate required task total (A-D)
        required_total = task_a_score + task_b_score + task_c_score + task_d_score

        # Calculate bonus total (E-F)
        bonus_total = task_e_score + task_f_score

        # Overall total
        total_score = required_total + bonus_total

        # Pass based on required tasks only
        passed = required_total >= 22

        # TERMINAL OUTPUT - Detailed logging for professor
        print("\n" + "="*60)
        print("PHASE 4 STEP 2 - REMEDIAL B1 - FINAL ASSESSMENT")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"\nREQUIRED TASKS:")
        print(f"  Task A (Negotiation Battle):    {task_a_score}/5 points")
        print(f"  Task B (Definition Duel):        {task_b_score}/8 points")
        print(f"  Task C (Wordshake Quiz):         {task_c_score}/6 points")
        print(f"  Task D (Flashcard Game):         {task_d_score}/8 points")
        print(f"  Required Tasks Subtotal:         {required_total}/27 points")
        print(f"\nBONUS TASKS:")
        print(f"  Task E (Tense Time Travel):      {task_e_score}/6 points")
        print(f"  Task F (Grammar Kahoot):         {task_f_score}/6 points")
        print(f"  Bonus Tasks Subtotal:            {bonus_total}/12 points")
        print(f"\n" + "-"*60)
        print(f"TOTAL SCORE (Required + Bonus):  {total_score}/39 points")
        print(f"REQUIRED TASKS SCORE:             {required_total}/27 points")
        print(f"PASS THRESHOLD:                   22/27 points (~81%)")
        print(f"RESULT: {'✅ PASSED' if passed else '❌ FAILED - RETRY REQUIRED'}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 2 Remedial B1 Final - User {user_id}: TaskA={task_a_score}, TaskB={task_b_score}, TaskC={task_c_score}, TaskD={task_d_score}, TaskE={task_e_score}, TaskF={task_f_score}, Required={required_total}, Bonus={bonus_total}, Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                'task_a_score': task_a_score,
                'task_b_score': task_b_score,
                'task_c_score': task_c_score,
                'task_d_score': task_d_score,
                'task_e_score': task_e_score,
                'task_f_score': task_f_score,
                'required_total': required_total,
                'bonus_total': bonus_total,
                'total_score': total_score,
                'max_score_required': 27,
                'max_score_bonus': 12,
                'max_score_total': 39,
                'passed': passed,
                'pass_threshold': 22
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Step 2 B1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step3/remedial/b1/evaluate-definitions', methods=['POST'])
@login_required
def evaluate_b1_definitions():
    """
    Evaluate B1 Task B (Definition Duel) - 8 definitions with LLM

    Request body:
    {
        "definitions": [
            {
                "term": "promotional",
                "answer": "student's definition and example",
                "example": "expected example answer"
            },
            ...
        ]
    }

    Returns:
    {
        "success": true,
        "results": [
            {"term": "promotional", "score": 1, "feedback": "..."},
            ...
        ],
        "total_score": 6,
        "max_score": 8
    }
    """
    logger.info(f"=== B1 Definition Evaluation - User {session.get('user_id')} ===")
    try:
        data = request.get_json()
        logger.info(f"Received request data: {data}")
        definitions = data.get('definitions', [])
        logger.info(f"Processing {len(definitions)} definitions")

        if not definitions:
            return jsonify({
                'success': False,
                'error': 'No definitions provided'
            }), 400

        results = []
        total_score = 0

        # Use AI evaluation if available
        if ai_service.client:
            for defn in definitions:
                term = defn.get('term', '')
                student_answer = defn.get('answer', '').strip()
                example_answer = defn.get('example', '')

                if not student_answer:
                    results.append({
                        'term': term,
                        'score': 0,
                        'feedback': 'Please provide a definition and example.'
                    })
                    continue

                try:
                    system_prompt = f"""You are evaluating a B1 level English definition for the term '{term}'.

The student should provide:
1) A clear definition of the term
2) An example that references a video about advertising characteristics
3) Complete sentences with B1-appropriate grammar
4) Logical connection between definition and example

IMPORTANT - BE FLEXIBLE at B1 level:
- Accept minor grammar mistakes if meaning is clear
- Accept varied sentence structures
- Focus on: Clear definition + Video reference + Logical example
- Score 1 if the answer shows understanding and effort
- Score 0 only if completely irrelevant or no effort shown

Respond ONLY in JSON format:
{{
    "score": 0 or 1,
    "feedback": "brief encouraging feedback (1-2 sentences)"
}}"""

                    user_prompt = f"""
Term: {term}
Example answer: {example_answer}

Student's answer: "{student_answer}"

Evaluate and return ONLY valid JSON."""

                    ai_response = ai_service.client.chat.completions.create(
                        model=ai_service.model,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        max_tokens=150,
                        temperature=0.3
                    )

                    result_text = ai_response.choices[0].message.content.strip()

                    # Parse JSON
                    import json
                    if '```json' in result_text:
                        result_text = result_text.split('```json')[1].split('```')[0]
                    elif '```' in result_text:
                        result_text = result_text.split('```')[1].split('```')[0]

                    result = json.loads(result_text.strip())

                    score = result.get('score', 0)
                    feedback = result.get('feedback', 'Good effort!')

                    results.append({
                        'term': term,
                        'score': score,
                        'feedback': feedback
                    })
                    total_score += score

                except Exception as e:
                    logger.error(f"AI evaluation error for term '{term}': {str(e)}")
                    # Fallback to basic scoring
                    score = 1 if len(student_answer.split()) >= 10 else 0
                    results.append({
                        'term': term,
                        'score': score,
                        'feedback': 'Good effort!' if score == 1 else 'Try to provide more detail.'
                    })
                    total_score += score
        else:
            # Fallback: Local evaluation without AI
            for defn in definitions:
                term = defn.get('term', '')
                student_answer = defn.get('answer', '').strip()

                # Simple check: answer length and relevance
                word_count = len(student_answer.split())

                # Accept answer if it's at least 10 words (flexible for B1 level)
                score = 1 if word_count >= 10 else 0

                if score == 1:
                    feedback = 'Good effort! Your definition shows understanding.'
                else:
                    feedback = 'Try to provide more detail in your definition (at least 10 words).'

                results.append({
                    'term': term,
                    'score': score,
                    'feedback': feedback
                })
                total_score += score

        logger.info(f"B1 Definition Duel - User {session.get('user_id')}: Total Score={total_score}/8")

        return jsonify({
            'success': True,
            'results': results,
            'total_score': total_score,
            'max_score': 8
        })

    except Exception as e:
        logger.error(f"Error evaluating B1 definitions: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step3/remedial/b2/evaluate-explanations', methods=['POST'])
@login_required
def evaluate_b2_explanations():
    """
    Evaluate B2 Task B (Explain Expedition) - 8 explanations with LLM

    Request body:
    {
        "explanations": [
            {
                "term": "Promotional",
                "question": "Explain the promotional purpose...",
                "answer": "student's detailed explanation",
                "expectedConcepts": ["sell", "promote", "video 1"]
            },
            ...
        ]
    }

    Returns:
    {
        "success": true,
        "results": [
            {"term": "Promotional", "score": 1, "feedback": "..."},
            ...
        ],
        "total_score": 7,
        "max_score": 8
    }
    """
    logger.info(f"=== B2 Explanation Evaluation - User {session.get('user_id')} ===")
    try:
        data = request.get_json()
        logger.info(f"Received request data: {data}")
        explanations = data.get('explanations', [])
        logger.info(f"Processing {len(explanations)} explanations")

        if not explanations:
            return jsonify({
                'success': False,
                'error': 'No explanations provided'
            }), 400

        results = []
        total_score = 0

        # Use AI evaluation if available
        if ai_service.client:
            # Pre-check all explanations for minimum requirements
            valid_explanations = []
            for idx, expl in enumerate(explanations):
                term = expl.get('term', '')
                question = expl.get('question', '')
                student_answer = expl.get('answer', '').strip()
                expected_concepts = expl.get('expectedConcepts', [])

                if not student_answer:
                    results.append({
                        'term': term,
                        'score': 0,
                        'feedback': 'Please provide an explanation.'
                    })
                    continue

                # Check minimum length
                if len(student_answer.split()) < 10:
                    results.append({
                        'term': term,
                        'score': 0,
                        'feedback': 'Your explanation is too short. Please provide more detail (at least 10 words).'
                    })
                    continue

                # Add to valid explanations for AI evaluation
                valid_explanations.append({
                    'index': idx,
                    'term': term,
                    'question': question,
                    'answer': student_answer,
                    'expected_concepts': expected_concepts
                })

            # Evaluate all valid explanations in ONE API call
            if valid_explanations:
                try:
                    # Build combined prompt for all explanations
                    explanations_text = ""
                    for i, expl in enumerate(valid_explanations, 1):
                        explanations_text += f"\n--- Explanation {i} ---\n"
                        explanations_text += f"Term: {expl['term']}\n"
                        explanations_text += f"Question: {expl['question']}\n"
                        explanations_text += f"Expected concepts: {', '.join(expl['expected_concepts'])}\n"
                        explanations_text += f"Student's answer: \"{expl['answer']}\"\n"

                    system_prompt = """You are evaluating B2 level English explanations for advertising concepts.

For EACH explanation, evaluate based on these criteria:
1) Detailed explanation showing B2-level depth
2) Reference to video content (Video 1 or Video 2)
3) Specific concepts related to the term
4) Clear, coherent paragraph structure
5) 2-3 sentences minimum

IMPORTANT - B2 Level Criteria:
- Accept explanations that show understanding and effort
- Look for video references (Video 1, Video 2, "as the video shows", etc.)
- Look for relevant expected concepts mentioned for each term
- Focus on: Detail + Video reference + Relevant concepts
- Score 1 if explanation shows B2-level depth and references video
- Score 0 if too simple, no video reference, or missing key concepts

DO NOT MENTION EXAMPLES in your feedback.

Respond ONLY with valid JSON array with exactly one result per explanation:
{
    "results": [
        {"score": 0 or 1, "feedback": "brief encouraging feedback (1-2 sentences, no examples)"},
        {"score": 0 or 1, "feedback": "brief encouraging feedback (1-2 sentences, no examples)"},
        ...
    ]
}"""

                    user_prompt = f"""Evaluate these {len(valid_explanations)} B2 explanations:{explanations_text}

Return ONLY valid JSON with results array. Each result must have "score" (0 or 1) and "feedback"."""

                    logger.info(f"Sending single API call to evaluate {len(valid_explanations)} explanations")

                    ai_response = ai_service.client.chat.completions.create(
                        model=ai_service.model,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        max_tokens=1500,  # Increased for multiple evaluations
                        temperature=0.3
                    )

                    result_text = ai_response.choices[0].message.content.strip()
                    logger.info(f"Received AI response: {result_text[:200]}...")

                    # Parse JSON
                    import json
                    if '```json' in result_text:
                        result_text = result_text.split('```json')[1].split('```')[0]
                    elif '```' in result_text:
                        result_text = result_text.split('```')[1].split('```')[0]

                    result = json.loads(result_text.strip())

                    # Validate and process results
                    if 'results' in result and len(result['results']) == len(valid_explanations):
                        # Insert results in correct order
                        for i, ai_result in enumerate(result['results']):
                            original_idx = valid_explanations[i]['index']
                            term = valid_explanations[i]['term']
                            score = ai_result.get('score', 0)
                            feedback = ai_result.get('feedback', 'Good effort!')

                            # Insert at correct position
                            while len(results) <= original_idx:
                                results.append(None)

                            results[original_idx] = {
                                'term': term,
                                'score': score,
                                'feedback': feedback
                            }
                            total_score += score

                        logger.info(f"✅ Single API call successful: evaluated {len(valid_explanations)} explanations")
                    else:
                        logger.warning(f"AI returned incorrect number of results: expected {len(valid_explanations)}, got {len(result.get('results', []))}")
                        raise ValueError("Incorrect number of results from AI")

                except Exception as e:
                    logger.error(f"Batch AI evaluation error: {str(e)}")
                    # Fallback: evaluate each explanation with basic scoring
                    for i, expl in enumerate(valid_explanations):
                        original_idx = expl['index']
                        term = expl['term']
                        score = 1 if len(expl['answer'].split()) >= 15 else 0

                        while len(results) <= original_idx:
                            results.append(None)

                        results[original_idx] = {
                            'term': term,
                            'score': score,
                            'feedback': 'Good effort!' if score == 1 else 'Try to provide more detail and reference the videos.'
                        }
                        total_score += score
        else:
            # Fallback: Local evaluation without AI
            for expl in explanations:
                term = expl.get('term', '')
                student_answer = expl.get('answer', '').strip()
                expected_concepts = expl.get('expectedConcepts', [])

                # Simple checks
                word_count = len(student_answer.split())
                has_video_reference = 'video' in student_answer.lower()

                # Check for at least one expected concept
                has_concept = any(concept.lower() in student_answer.lower() for concept in expected_concepts)

                # Score based on criteria
                score = 1 if (word_count >= 15 and has_video_reference and has_concept) else 0

                if score == 1:
                    feedback = 'Good detailed explanation with video reference!'
                elif not has_video_reference:
                    feedback = 'Try to reference the videos in your explanation.'
                elif not has_concept:
                    feedback = 'Include more specific concepts from the videos.'
                else:
                    feedback = 'Provide more detail in your explanation (aim for 15+ words).'

                results.append({
                    'term': term,
                    'score': score,
                    'feedback': feedback
                })
                total_score += score

        logger.info(f"B2 Explain Expedition - User {session.get('user_id')}: Total Score={total_score}/8")

        return jsonify({
            'success': True,
            'results': results,
            'total_score': total_score,
            'max_score': 8
        })

    except Exception as e:
        logger.error(f"Error evaluating B2 explanations: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/evaluate-game-explanation', methods=['POST'])
def evaluate_game_explanation():
    """
    Evaluate game explanation with AI (for Step 2 Interaction 3 - Sushi Spell)
    Returns score: 1-5 (CEFR A1-C1)

    Request body:
    {
        "question": "How would you use Sushi Spell to practice one vocabulary word from the videos?",
        "answer": "Student's explanation",
        "vocabularyWords": ["persuasive", "targeted", ...],
        "expectedElements": ["game", "word", "video", "spelling", "practice"],
        "level": "B1"
    }

    Returns:
    {
        "score": 1-5,
        "level": "A1" | "A2" | "B1" | "B2" | "C1",
        "feedback": "AI feedback message"
    }
    """
    try:
        data = request.get_json()
        question = data.get('question', '')
        answer = data.get('answer', '').strip()
        vocabulary_words = data.get('vocabularyWords', [])
        expected_elements = data.get('expectedElements', [])
        target_level = data.get('level', 'B1')

        if not answer:
            return jsonify({
                'score': 0,
                'level': 'Below A1',
                'feedback': 'Please explain how to use Sushi Spell with one of the vocabulary words.'
            })

        # Check minimum length
        if len(answer.split()) < 3:
            return jsonify({
                'score': 1,
                'level': 'A1',
                'feedback': 'Your answer is very short. Try to explain in more detail.'
            })

        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = f"""You are a CEFR language assessment expert evaluating explanations about game-based vocabulary learning.

Evaluate the student's explanation of how to use Sushi Spell game to practice advertising vocabulary from the videos.

CEFR Scoring Guidelines for Interaction 3 (Game Connection):
- A1 (score 1): "Game help word." or "Spell word game." (very basic, fragmented, 1-4 words)
- A2 (score 2): "Sushi Spell practice 'persuasive' word." (mentions vocabulary word, 5+ words, basic structure)
- B1 (score 3): "Sushi Spell helps practice spelling 'targeted' because game is timed." (mentions word + game element/practice, 8+ words)
- B2 (score 4): "Use Sushi Spell to practice 'dramatisation' because the timed format helps remember how it was used in the first video." (connects word + game + video reference, 12+ words)
- C1 (score 5): "Sushi Spell reinforces spelling of 'persuasive' through timed practice, connecting to the first video's explanation of convincing techniques in advertising." (sophisticated connection between game mechanics, vocabulary word, and video content with explanation, 15+ words)

Assessment Focus:
- Grammar: Explanatory structures, causal/reasoning language
- Content: Connection between game, specific vocabulary word, and video learning
- Meta-cognitive: Awareness of learning strategy and how game reinforces concepts

Expected elements: {', '.join(expected_elements)}
Vocabulary words from videos: {', '.join(vocabulary_words)}

The student MUST mention:
1. A specific vocabulary word from the list
2. Reference to the Sushi Spell game
3. For higher levels (B2-C1): Connection to video content or learning purpose

Respond ONLY in JSON format:
{{
    "score": 1-5,
    "level": "A1" | "A2" | "B1" | "B2" | "C1",
    "feedback": "Encouraging feedback (1-2 sentences)"
}}"""

                user_prompt = f"""
Question: {question}

Student's Answer:
"{answer}"

Evaluate this explanation and assign a CEFR level.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=150,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'score': result.get('score', 3),
                    'level': result.get('level', 'B1'),
                    'feedback': result.get('feedback', 'Good explanation!')
                })

            except Exception as e:
                logger.error(f"AI game explanation evaluation error: {str(e)}")
                # Fall through to local evaluation

        # Fallback: Local evaluation
        answer_lower = answer.lower()

        # Check if mentions a vocabulary word
        mentions_word = any(word.lower() in answer_lower for word in vocabulary_words)
        mentions_game = 'sushi' in answer_lower or 'spell' in answer_lower or 'game' in answer_lower
        mentions_video = 'video' in answer_lower or 'first' in answer_lower or 'second' in answer_lower
        mentions_practice = 'practice' in answer_lower or 'learn' in answer_lower or 'spell' in answer_lower

        word_count = len(answer.split())

        # Determine score and level
        if mentions_word and mentions_game and mentions_video and word_count >= 15:
            score = 5
            level = 'C1'
            feedback = 'Excellent explanation! You connected the game, vocabulary word, and video content very well.'
        elif mentions_word and mentions_game and (mentions_video or mentions_practice) and word_count >= 12:
            score = 4
            level = 'B2'
            feedback = 'Very good! You explained the connection between the game and vocabulary clearly.'
        elif mentions_word and (mentions_game or mentions_practice) and word_count >= 8:
            score = 3
            level = 'B1'
            feedback = 'Good explanation! You connected the game to a specific word from the videos.'
        elif mentions_word and word_count >= 5:
            score = 2
            level = 'A2'
            feedback = 'Good start! Try to explain how the game helps you practice the word.'
        else:
            score = 1
            level = 'A1'
            feedback = 'Basic explanation. Try to explain how Sushi Spell helps you learn a specific word from the videos.'

        return jsonify({
            'score': score,
            'level': level,
            'feedback': feedback
        })

    except Exception as e:
        logger.error(f"Game explanation evaluation error: {str(e)}")
        return jsonify({
            'score': 1,
            'level': 'A1',
            'feedback': 'Unable to evaluate answer. Please try again.'
        })

@phase4_bp.route('/step3/remedial/b2/evaluate-spell-explanation', methods=['POST'])
@login_required
def evaluate_b2_spell_explanation():
    """
    Evaluate B2 Task D (Spell Quest) - Single explanation evaluation with LLM
    
    Request body:
    {
        "term": "promotional",
        "explanation": "student's explanation",
        "expectedConcepts": ["promote", "sell", "video 1"]
    }
    
    Returns:
    {
        "success": true,
        "score": 1 or 0,
        "feedback": "AI feedback message"
    }
    """
    logger.info(f"=== B2 Spell Quest Explanation Evaluation - User {session.get('user_id')} ===")
    try:
        data = request.get_json()
        term = data.get('term', '')
        explanation = data.get('explanation', '').strip()
        expected_concepts = data.get('expectedConcepts', [])
        
        if not explanation:
            return jsonify({
                'success': True,
                'score': 0,
                'feedback': 'Please provide an explanation.'
            })
        
        # Check minimum length
        if len(explanation.split()) < 10:
            return jsonify({
                'success': True,
                'score': 0,
                'feedback': 'Your explanation is too short. Please provide more detail (at least 10 words).'
            })
        
        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = f"""You are evaluating a B2 level English explanation for the term '{term}'.

The student should provide:
1) A clear explanation of the term
2) Reference to video content (Video 1 or Video 2)
3) Specific concepts related to the term
4) Complete sentences with B2-level grammar

IMPORTANT - B2 Level Criteria:
- Accept explanations that show understanding and effort
- Look for video references (Video 1, Video 2, "as the video shows", etc.)
- Look for relevant concepts: {', '.join(expected_concepts)}
- Focus on: Detail + Video reference + Relevant concepts
- Score 1 if explanation shows B2-level depth and references video
- Score 0 if too simple, no video reference, or missing key concepts

Respond ONLY in JSON format:
{{
    "score": 0 or 1,
    "feedback": "brief encouraging feedback (1-2 sentences, no examples)"
}}"""

                user_prompt = f"""
Term: {term}

Expected concepts: {', '.join(expected_concepts)}

Student's explanation: "{explanation}"

Evaluate at B2 level. Does it have depth, video reference, and relevant concepts?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                score = result.get('score', 0)
                feedback = result.get('feedback', 'Good effort!')

                logger.info(f"B2 Spell Quest - User {session.get('user_id')} - Term '{term}': Score={score}")

                return jsonify({
                    'success': True,
                    'score': score,
                    'feedback': feedback
                })

            except Exception as e:
                logger.error(f"AI evaluation error for term '{term}': {str(e)}")
                # Fallback to basic scoring
                score = 1 if len(explanation.split()) >= 15 else 0
                return jsonify({
                    'success': True,
                    'score': score,
                    'feedback': 'Good effort!' if score == 1 else 'Try to provide more detail and reference the videos.'
                })
        else:
            # Fallback: Local evaluation without AI
            word_count = len(explanation.split())
            has_video_reference = 'video' in explanation.lower()
            has_concept = any(concept.lower() in explanation.lower() for concept in expected_concepts)
            
            score = 1 if (word_count >= 15 and has_video_reference and has_concept) else 0
            
            if score == 1:
                feedback = 'Good detailed explanation with video reference!'
            elif not has_video_reference:
                feedback = 'Try to reference the videos in your explanation.'
            elif not has_concept:
                feedback = 'Include more specific concepts from the videos.'
            else:
                feedback = 'Provide more detail in your explanation (aim for 15+ words).'
            
            return jsonify({
                'success': True,
                'score': score,
                'feedback': feedback
            })
    
    except Exception as e:
        logger.error(f"Error evaluating B2 spell explanation: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step3/remedial/c1/evaluate-analyses', methods=['POST'])
@login_required
def evaluate_c1_analyses():
    """
    Evaluate C1 Task B (Analysis Odyssey) - 8 analyses with LLM

    Request body:
    {
        "analyses": [
            {
                "term": "Promotional",
                "question": "Analyze the promotional approach...",
                "answer": "student's analytical sentence",
                "example": "Promotional drives sales but risks overexposure as video 1 warns.",
                "expectedConcepts": ["sales", "drives", "overexposure", "risks", "video 1"]
            },
            ...
        ]
    }

    Returns:
    {
        "success": true,
        "results": [
            {"term": "Promotional", "score": 1, "feedback": "..."},
            ...
        ],
        "total_score": 7,
        "max_score": 8
    }
    """
    logger.info(f"=== C1 Analysis Evaluation - User {session.get('user_id')} ===")
    try:
        data = request.get_json()
        logger.info(f"Received request data: {data}")
        analyses = data.get('analyses', [])
        logger.info(f"Processing {len(analyses)} analyses")

        if not analyses:
            return jsonify({
                'success': False,
                'error': 'No analyses provided'
            }), 400

        results = []
        total_score = 0

        # Use AI evaluation if available
        if ai_service.client:
            # Pre-check all analyses for minimum requirements
            valid_analyses = []
            for idx, analysis in enumerate(analyses):
                term = analysis.get('term', '')
                question = analysis.get('question', '')
                student_answer = analysis.get('answer', '').strip()
                example = analysis.get('example', '')
                expected_concepts = analysis.get('expectedConcepts', [])

                if not student_answer:
                    results.append({
                        'term': term,
                        'score': 0,
                        'feedback': 'Please provide your analysis.'
                    })
                    continue

                # Check minimum length
                if len(student_answer.split()) < 5:
                    results.append({
                        'term': term,
                        'score': 0,
                        'feedback': 'Your analysis is too short. Please write a more detailed analytical sentence (at least 20 characters).'
                    })
                    continue

                # Add to valid analyses for AI evaluation
                valid_analyses.append({
                    'index': idx,
                    'term': term,
                    'question': question,
                    'answer': student_answer,
                    'example': example,
                    'expected_concepts': expected_concepts
                })

            # Evaluate all valid analyses in ONE API call
            if valid_analyses:
                try:
                    # Build combined prompt for all analyses
                    analyses_text = ""
                    for i, anal in enumerate(valid_analyses, 1):
                        analyses_text += f"\n--- Analysis {i} ---\n"
                        analyses_text += f"Term: {anal['term']}\n"
                        analyses_text += f"Question: {anal['question']}\n"
                        analyses_text += f"Example C1 analysis: {anal['example']}\n"
                        analyses_text += f"Expected concepts: {', '.join(anal['expected_concepts'])}\n"
                        analyses_text += f"Student's answer: \"{anal['answer']}\"\n"

                    system_prompt = """You are evaluating C1 level English analytical sentences for advertising concepts.

For EACH analysis, evaluate based on these C1-level criteria:
1) Nuanced understanding showing critical thinking
2) Analytical depth (not just description)
3) Reference to video content when applicable (Video 1 or Video 2)
4) Sophisticated vocabulary and sentence structure
5) Addresses complexity, trade-offs, or implications
6) One well-crafted analytical sentence (quality over quantity)

IMPORTANT - C1 Level Criteria:
- Look for NUANCE: "but", "yet", "while", "although", "risks", "enhances", etc.
- Look for ANALYTICAL language: "drives", "fosters", "raises concerns", "demands", etc.
- Look for video references when expected (Video 1, Video 2)
- Look for relevant expected concepts
- Focus on: Nuance + Critical thinking + Video reference (when applicable) + Analytical depth
- Score 1 if analysis shows C1-level sophistication and critical thinking
- Score 0 if too simple, descriptive only, or missing analytical nuance

DO NOT MENTION EXAMPLES in your feedback.

Respond ONLY with valid JSON array with exactly one result per analysis:
{
    "results": [
        {"score": 0 or 1, "feedback": "brief encouraging feedback (1-2 sentences, no examples)"},
        {"score": 0 or 1, "feedback": "brief encouraging feedback (1-2 sentences, no examples)"},
        ...
    ]
}"""

                    user_prompt = f"""Evaluate these {len(valid_analyses)} C1 analytical sentences:{analyses_text}

Return ONLY valid JSON with results array. Each result must have "score" (0 or 1) and "feedback"."""

                    logger.info(f"Sending single API call to evaluate {len(valid_analyses)} analyses")

                    ai_response = ai_service.client.chat.completions.create(
                        model=ai_service.model,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        max_tokens=1500,  # Increased for multiple evaluations
                        temperature=0.3
                    )

                    result_text = ai_response.choices[0].message.content.strip()
                    logger.info(f"Received AI response: {result_text[:200]}...")

                    # Parse JSON
                    import json
                    if '```json' in result_text:
                        result_text = result_text.split('```json')[1].split('```')[0]
                    elif '```' in result_text:
                        result_text = result_text.split('```')[1].split('```')[0]

                    result = json.loads(result_text.strip())

                    # Validate and process results
                    if 'results' in result and len(result['results']) == len(valid_analyses):
                        # Insert results in correct order
                        for i, ai_result in enumerate(result['results']):
                            original_idx = valid_analyses[i]['index']
                            term = valid_analyses[i]['term']
                            score = ai_result.get('score', 0)
                            feedback = ai_result.get('feedback', 'Good effort!')

                            # Insert at correct position
                            while len(results) <= original_idx:
                                results.append(None)

                            results[original_idx] = {
                                'term': term,
                                'score': score,
                                'feedback': feedback
                            }
                            total_score += score

                        logger.info(f"✅ Single API call successful: evaluated {len(valid_analyses)} analyses")
                    else:
                        logger.warning(f"AI returned incorrect number of results: expected {len(valid_analyses)}, got {len(result.get('results', []))}")
                        raise ValueError("Incorrect number of results from AI")

                except Exception as e:
                    logger.error(f"Batch AI evaluation error: {str(e)}")
                    # Fallback: evaluate each analysis with basic scoring
                    for i, anal in enumerate(valid_analyses):
                        original_idx = anal['index']
                        term = anal['term']
                        answer_lower = anal['answer'].lower()

                        # Check for analytical nuance
                        has_nuance = any(word in answer_lower for word in ['but', 'yet', 'while', 'although', 'however', 'whereas'])
                        has_analytical = any(word in answer_lower for word in ['drives', 'enhances', 'raises', 'fosters', 'demands', 'risks'])
                        word_count = len(anal['answer'].split())

                        score = 1 if (has_nuance and has_analytical and word_count >= 10) else 0

                        while len(results) <= original_idx:
                            results.append(None)

                        results[original_idx] = {
                            'term': term,
                            'score': score,
                            'feedback': 'Good analytical depth!' if score == 1 else 'Try to add more nuance and analytical language to your sentence.'
                        }
                        total_score += score
        else:
            # Fallback: Local evaluation without AI
            for anal in analyses:
                term = anal.get('term', '')
                student_answer = anal.get('answer', '').strip()
                expected_concepts = anal.get('expectedConcepts', [])

                # Simple checks for C1 level
                word_count = len(student_answer.split())
                answer_lower = student_answer.lower()

                # Check for analytical nuance
                has_nuance = any(word in answer_lower for word in ['but', 'yet', 'while', 'although', 'however', 'whereas'])
                has_analytical = any(word in answer_lower for word in ['drives', 'enhances', 'raises', 'fosters', 'demands', 'risks'])
                has_video = 'video' in answer_lower

                # Check for at least one expected concept
                has_concept = any(concept.lower() in answer_lower for concept in expected_concepts)

                # Score based on criteria
                score = 1 if (word_count >= 10 and has_nuance and has_analytical and has_concept) else 0

                if score == 1:
                    feedback = 'Excellent analytical sentence with nuanced understanding!'
                elif not has_nuance:
                    feedback = 'Try to add nuance using words like "but", "yet", or "while" to show critical thinking.'
                elif not has_analytical:
                    feedback = 'Use more analytical verbs like "drives", "enhances", or "fosters".'
                elif not has_concept:
                    feedback = 'Include more specific concepts related to the term.'
                else:
                    feedback = 'Provide more depth in your analysis (aim for 10+ words with analytical language).'

                results.append({
                    'term': term,
                    'score': score,
                    'feedback': feedback
                })
                total_score += score

        logger.info(f"C1 Analysis Odyssey - User {session.get('user_id')}: Total Score={total_score}/8")

        return jsonify({
            'success': True,
            'results': results,
            'total_score': total_score,
            'max_score': 8
        })

    except Exception as e:
        logger.error(f"Error evaluating C1 analyses: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step3/remedial/c1/evaluate-justification', methods=['POST'])
@login_required
def evaluate_c1_justification():
    """
    Evaluate C1 Task C (Quizlet Live) - Single justification evaluation

    Request body:
    {
        "question": "What is the primary function...",
        "correctAnswer": "A",
        "justification": "student's justification",
        "videoReference": "Video 1",
        "expectedConcepts": ["sales", "promote", "video 1"]
    }

    Returns:
    {
        "success": true,
        "score": 1,
        "feedback": "..."
    }
    """
    logger.info(f"=== C1 Justification Evaluation - User {session.get('user_id')} ===")
    try:
        data = request.get_json()
        question = data.get('question', '')
        correct_answer = data.get('correctAnswer', '')
        justification = data.get('justification', '').strip()
        video_reference = data.get('videoReference', '')
        expected_concepts = data.get('expectedConcepts', [])

        if not justification or len(justification.split()) < 5:
            return jsonify({
                'success': True,
                'score': 0,
                'feedback': 'Justification is too short. Please provide more detail and reference the videos.'
            })

        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = """You are evaluating C1 level English justifications for quiz answers about advertising.

Evaluate based on these criteria:
1) References video content (Video 1 or Video 2)
2) Explains WHY the answer is correct
3) Uses relevant concepts from the expected list
4) Shows C1-level understanding

Score 1 if justification meets criteria (has video reference + relevant concepts + explains why).
Score 0 if missing video reference or lacks explanation.

Respond ONLY with valid JSON:
{
    "score": 0 or 1,
    "feedback": "brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""Question: {question}
Correct Answer: {correct_answer}
Expected video: {video_reference}
Expected concepts: {', '.join(expected_concepts)}

Student's justification: "{justification}"

Evaluate and return JSON with score and feedback."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()
                logger.info(f"AI response: {result_text}")

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())
                score = result.get('score', 0)
                feedback = result.get('feedback', 'Good effort!')

                return jsonify({
                    'success': True,
                    'score': score,
                    'feedback': feedback
                })

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")
                # Fallback to local evaluation
                pass

        # Fallback: Local evaluation without AI
        justification_lower = justification.lower()

        # Check for video reference
        has_video_ref = 'video' in justification_lower

        # Check for at least one expected concept
        has_concept = any(concept.lower() in justification_lower for concept in expected_concepts)

        # Check minimum length
        word_count = len(justification.split())

        # Score based on criteria
        score = 1 if (has_video_ref and has_concept and word_count >= 10) else 0

        if score == 1:
            feedback = 'Excellent justification with video reference and relevant concepts!'
        elif not has_video_ref:
            feedback = f'Include a reference to {video_reference} in your justification.'
        elif not has_concept:
            feedback = 'Include more relevant concepts related to the answer.'
        else:
            feedback = 'Provide more depth in your justification (aim for 10+ words).'

        return jsonify({
            'success': True,
            'score': score,
            'feedback': feedback
        })

    except Exception as e:
        logger.error(f"Error evaluating C1 justification: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step3/remedial/c1/evaluate-critique', methods=['POST'])
@login_required
def evaluate_c1_critique():
    """
    Evaluate C1 Task D (Critique Kahoot) - Single critique evaluation

    Request body:
    {
        "term": "promotional",
        "critique": "student's nuanced critique",
        "expectedConcepts": ["effective", "sales", "pushy", "overdone"],
        "videoReference": "Video 1"
    }

    Returns:
    {
        "success": true,
        "score": 1,
        "feedback": "..."
    }
    """
    logger.info(f"=== C1 Critique Evaluation - User {session.get('user_id')} ===")
    try:
        data = request.get_json()
        term = data.get('term', '')
        critique = data.get('critique', '').strip()
        expected_concepts = data.get('expectedConcepts', [])
        video_reference = data.get('videoReference', '')

        if not critique or len(critique.split()) < 5:
            return jsonify({
                'success': True,
                'score': 0,
                'feedback': 'Critique is too short. Please provide more detail with nuanced analysis.'
            })

        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = """You are evaluating C1 level English critiques of advertising terms.

A good critique must:
1) Show NUANCE with words like "but", "yet", "however", "although"
2) Address BOTH strengths AND weaknesses
3) Use relevant concepts from the expected list
4) Show critical thinking and depth
5) Be specific and analytical (not just generic statements)

Score 1 if critique shows clear nuance (both pros and cons) with relevant concepts.
Score 0 if too simple, one-sided, or lacks critical thinking.

Respond ONLY with valid JSON:
{
    "score": 0 or 1,
    "feedback": "brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""Term: {term}
Expected concepts: {', '.join(expected_concepts)}
Video reference: {video_reference}

Student's critique: "{critique}"

Evaluate for nuance (both sides), critical thinking, and use of relevant concepts. Return JSON with score and feedback."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()
                logger.info(f"AI response: {result_text}")

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())
                score = result.get('score', 0)
                feedback = result.get('feedback', 'Good effort!')

                return jsonify({
                    'success': True,
                    'score': score,
                    'feedback': feedback
                })

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")
                # Fallback to local evaluation
                pass

        # Fallback: Local evaluation without AI
        critique_lower = critique.lower()

        # Check for nuance words
        has_nuance = any(word in critique_lower for word in ['but', 'yet', 'however', 'although', 'whereas', 'while'])

        # Check for at least 2 expected concepts
        concepts_found = sum(1 for concept in expected_concepts if concept.lower() in critique_lower)
        has_concepts = concepts_found >= 2

        # Check minimum length
        word_count = len(critique.split())

        # Score based on criteria
        score = 1 if (has_nuance and has_concepts and word_count >= 10) else 0

        if score == 1:
            feedback = 'Excellent nuanced critique showing both strengths and weaknesses!'
        elif not has_nuance:
            feedback = 'Add nuance by showing BOTH strengths AND weaknesses (use "but", "yet", or "however").'
        elif not has_concepts:
            feedback = 'Include more relevant concepts related to the term.'
        else:
            feedback = 'Provide more depth in your critique (aim for 10+ words with critical thinking).'

        return jsonify({
            'success': True,
            'score': score,
            'feedback': feedback
        })

    except Exception as e:
        logger.error(f"Error evaluating C1 critique: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step3/remedial/c1/evaluate-critiques-batch', methods=['POST'])
@login_required
def evaluate_c1_critiques_batch():
    """
    Evaluate C1 Task D (Critique Kahoot) - Batch evaluation of all 6 critiques in ONE API call

    Request body:
    {
        "critiques": [
            {
                "term": "promotional",
                "critique": "student's critique",
                "expectedConcepts": ["effective", "sales", "pushy"],
                "videoReference": "Video 1"
            },
            ...
        ]
    }

    Returns:
    {
        "success": true,
        "results": [
            {"score": 1, "feedback": "..."},
            ...
        ],
        "total_score": 5
    }
    """
    logger.info(f"=== C1 Batch Critique Evaluation - User {session.get('user_id')} ===")
    try:
        data = request.get_json()
        critiques = data.get('critiques', [])

        if not critiques:
            return jsonify({
                'success': False,
                'error': 'No critiques provided'
            }), 400

        results = []
        total_score = 0

        # Use AI evaluation if available
        if ai_service.client:
            # Precheck all critiques
            valid_critiques = []
            for idx, critique_data in enumerate(critiques):
                term = critique_data.get('term', '')
                critique = critique_data.get('critique', '').strip()
                expected_concepts = critique_data.get('expectedConcepts', [])
                video_reference = critique_data.get('videoReference', '')

                if not critique or len(critique.split()) < 5:
                    results.append({
                        'score': 0,
                        'feedback': 'Critique is too short. Write more detail with nuanced analysis.'
                    })
                    continue

                valid_critiques.append({
                    'index': idx,
                    'term': term,
                    'critique': critique,
                    'expected_concepts': expected_concepts,
                    'video_reference': video_reference
                })

            # Evaluate all valid critiques in ONE API call
            if valid_critiques:
                try:
                    # Build combined prompt
                    critiques_text = ""
                    for i, crit in enumerate(valid_critiques, 1):
                        critiques_text += f"\n--- Critique {i} ---\n"
                        critiques_text += f"Term: {crit['term']}\n"
                        critiques_text += f"Expected concepts: {', '.join(crit['expected_concepts'])}\n"
                        critiques_text += f"Video reference: {crit['video_reference']}\n"
                        critiques_text += f"Student's critique: \"{crit['critique']}\"\n"

                    system_prompt = """You are evaluating C1 level English critiques of advertising terms.

For EACH critique, evaluate based on these criteria:
1) Shows NUANCE with words like "but", "yet", "however", "although" (BOTH sides)
2) Addresses BOTH strengths AND weaknesses
3) Uses relevant concepts from the expected list
4) Shows critical thinking and depth
5) Is specific and analytical (not generic)

IMPORTANT:
- Score 1 if critique shows clear nuance (both pros and cons) with relevant concepts
- Score 0 if too simple, one-sided, or lacks critical thinking
- DO NOT MENTION EXAMPLES in your feedback

Respond ONLY with valid JSON array with exactly one result per critique:
{
    "results": [
        {"score": 0 or 1, "feedback": "brief encouraging feedback (1-2 sentences, no examples)"},
        {"score": 0 or 1, "feedback": "brief encouraging feedback (1-2 sentences, no examples)"},
        ...
    ]
}"""

                    user_prompt = f"""Evaluate these {len(valid_critiques)} C1 critiques:{critiques_text}

Return ONLY valid JSON with results array. Each result must have "score" (0 or 1) and "feedback" (no examples)."""

                    logger.info(f"Sending single API call to evaluate {len(valid_critiques)} critiques")

                    ai_response = ai_service.client.chat.completions.create(
                        model=ai_service.model,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        max_tokens=1200,
                        temperature=0.3
                    )

                    result_text = ai_response.choices[0].message.content.strip()
                    logger.info(f"Received AI response: {result_text[:200]}...")

                    # Parse JSON
                    import json
                    if '```json' in result_text:
                        result_text = result_text.split('```json')[1].split('```')[0]
                    elif '```' in result_text:
                        result_text = result_text.split('```')[1].split('```')[0]

                    result = json.loads(result_text.strip())

                    # Validate and process results
                    if 'results' in result and len(result['results']) == len(valid_critiques):
                        # Insert results in correct order
                        for i, ai_result in enumerate(result['results']):
                            original_idx = valid_critiques[i]['index']
                            score = ai_result.get('score', 0)
                            feedback = ai_result.get('feedback', 'Good effort!')

                            # Insert at correct position
                            while len(results) <= original_idx:
                                results.append(None)

                            results[original_idx] = {
                                'score': score,
                                'feedback': feedback
                            }
                            total_score += score

                        logger.info(f"✅ Single API call successful: evaluated {len(valid_critiques)} critiques")
                    else:
                        logger.warning(f"AI returned incorrect number of results")
                        raise ValueError("Incorrect number of results from AI")

                except Exception as e:
                    logger.error(f"Batch AI evaluation error: {str(e)}")
                    # Fallback: evaluate each critique with basic scoring
                    for i, crit in enumerate(valid_critiques):
                        original_idx = crit['index']
                        critique_lower = crit['critique'].lower()

                        has_nuance = any(word in critique_lower for word in ['but', 'yet', 'however', 'although', 'whereas', 'while'])
                        concepts_found = sum(1 for concept in crit['expected_concepts'] if concept.lower() in critique_lower)
                        has_concepts = concepts_found >= 2

                        score = 1 if (has_nuance and has_concepts) else 0

                        while len(results) <= original_idx:
                            results.append(None)

                        results[original_idx] = {
                            'score': score,
                            'feedback': 'Good critique with nuance!' if score == 1 else 'Add more nuance using "but", "yet", or "however" to show both strengths and weaknesses.'
                        }
                        total_score += score
        else:
            # Fallback: Local evaluation without AI
            for critique_data in critiques:
                term = critique_data.get('term', '')
                critique = critique_data.get('critique', '').strip()
                expected_concepts = critique_data.get('expectedConcepts', [])

                if not critique or len(critique.split()) < 5:
                    results.append({
                        'score': 0,
                        'feedback': 'Critique is too short. Write more detail with nuanced analysis.'
                    })
                    continue

                critique_lower = critique.lower()
                has_nuance = any(word in critique_lower for word in ['but', 'yet', 'however', 'although', 'whereas', 'while'])
                concepts_found = sum(1 for concept in expected_concepts if concept.lower() in critique_lower)
                has_concepts = concepts_found >= 2

                score = 1 if (has_nuance and has_concepts) else 0

                if score == 1:
                    feedback = 'Excellent nuanced critique showing both strengths and weaknesses!'
                elif not has_nuance:
                    feedback = 'Add nuance using "but", "yet", or "however" to show both strengths and weaknesses.'
                elif not has_concepts:
                    feedback = 'Include more relevant concepts related to the term.'
                else:
                    feedback = 'Provide more depth with critical thinking (aim for 10+ words).'

                results.append({
                    'score': score,
                    'feedback': feedback
                })
                total_score += score

        logger.info(f"C1 Critique Kahoot - User {session.get('user_id')}: Total Score={total_score}/6")

        return jsonify({
            'success': True,
            'results': results,
            'total_score': total_score
        })

    except Exception as e:
        logger.error(f"Error evaluating C1 critiques batch: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step3/remedial/c1/evaluate-clauses-batch', methods=['POST'])
def evaluate_c1_clauses_batch():
    """
    Evaluate C1 Task F - Clause Conquest sentences in batch
    Evaluates 6 complex sentences with relative clauses and passive voice
    """
    try:
        data = request.get_json()
        sentences = data.get('sentences', [])

        if not sentences or len(sentences) == 0:
            return jsonify({
                'success': False,
                'error': 'No sentences provided'
            }), 400

        # Build combined prompt for batch evaluation
        sentences_text = ""
        for i, sent in enumerate(sentences, 1):
            sentences_text += f"\n--- Sentence {i} ---\n"
            sentences_text += f"Sentence: {sent.get('sentence', '')}\n"
            sentences_text += f"Grammar Concept: {sent.get('concept', '')}\n"

        prompt = f"""You are evaluating C1-level English grammar focusing on RELATIVE CLAUSES and PASSIVE VOICE.

The student wrote relative clauses to complete 6 sentences. Each sentence tests a specific grammar structure.

IMPORTANT EVALUATION CRITERIA:
1. **The clause MUST be present** - If blank is empty or contains only the infinitive verb, score 0
2. **Correct relative pronoun** - Must use "which", "that", "by which" etc. as specified in the concept
3. **Grammatical structure** - The relative clause must be grammatically correct
4. **Passive voice (when required)** - Check if passive construction is used correctly where needed
5. **Sentence makes sense** - The complete sentence must be logical and coherent
6. **Creative answers are ALLOWED** - Students don't need exact answers, just correct grammar

{sentences_text}

SCORING GUIDELINES:
- Score 1: Relative clause is grammatically correct with proper structure (even if wording differs from expected)
- Score 0: Empty/missing clause, contains only infinitive (like "to design"), grammar errors, wrong relative pronoun, missing passive voice when required, or sentence doesn't make sense

For EACH sentence, provide:
- Score: 1 or 0
- Feedback: Brief explanation (mention what's correct or what grammar error occurred)

Format your response EXACTLY as follows:
Sentence 1:
Score: [0 or 1]
Feedback: [brief feedback on grammar correctness]

Sentence 2:
Score: [0 or 1]
Feedback: [brief feedback on grammar correctness]

Sentence 3:
Score: [0 or 1]
Feedback: [brief feedback on grammar correctness]

Sentence 4:
Score: [0 or 1]
Feedback: [brief feedback on grammar correctness]

Sentence 5:
Score: [0 or 1]
Feedback: [brief feedback on grammar correctness]

Sentence 6:
Score: [0 or 1]
Feedback: [brief feedback on grammar correctness]"""

        # Call AI service
        ai_response = ai_service.client.chat.completions.create(
            model=ai_service.model,
            messages=[
                {"role": "system", "content": "You are an expert English grammar teacher specializing in C1-level advanced grammar evaluation."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.3
        )

        evaluation_text = ai_response.choices[0].message.content

        # Parse AI response
        results = []
        sentence_blocks = evaluation_text.split('Sentence ')[1:]  # Skip first empty split

        for block in sentence_blocks:
            lines = block.strip().split('\n')
            score = 0
            feedback = "Good effort!"

            for line in lines:
                if line.startswith('Score:'):
                    score_text = line.replace('Score:', '').strip()
                    try:
                        score = int(score_text)
                    except:
                        score = 0
                elif line.startswith('Feedback:'):
                    feedback = line.replace('Feedback:', '').strip()

            results.append({
                'score': score,
                'feedback': feedback
            })

        # Ensure we have results for all sentences
        while len(results) < len(sentences):
            results.append({
                'score': 0,
                'feedback': 'Could not evaluate this sentence. Please check your grammar.'
            })

        return jsonify({
            'success': True,
            'results': results[:len(sentences)]  # Return only the number of sentences we received
        })

    except Exception as e:
        logger.error(f"Error evaluating C1 clauses batch: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ============================================================================
# PHASE 4 STEP 4: APPLY - POSTER AND VIDEO DESCRIPTION
# ============================================================================

@phase4_bp.route('/step4/evaluate-poster-description', methods=['POST'])
def evaluate_poster_description():
    """
    Evaluate poster description writing with AI

    Scoring System (each correct element +1):
    - A1 (1): Basic attempt with title or colors
    - A2 (2): Basic template use with title/layout and colors/slogan
    - B1 (3): Complete 4+ sentence description following template
    - B2 (4): Detailed description with persuasive vocabulary
    - C1 (5): Sophisticated essay-like description with advanced vocabulary

    Expected Response Examples:
    - A1: "My poster has title 'Festival'. It is big. Colors red. Date March 8."
    - A2: "My poster has gatefold with title 'Global Festival'. It use colors because eye-catcher. Slogan is 'Come!'. Date March 8."
    - B1: "My poster has a gatefold layout with title 'Global Cultures Festival'. It uses bright colors and cultural images because they are eye-catchers. The slogan is 'Join the Celebration!' with bold lettering. Date is March 8 at Student Center—come join!"
    - B2: "My poster features a gatefold layout for extra space, with the title 'Global Cultures Festival' in elegant lettering. It uses vibrant colors and diverse cultural images as eye-catchers to attract students. The slogan 'Discover Worlds in One Day' is bold and persuasive. Details include date March 8 at Student Center—don't miss this immersive experience!"
    - C1: "In this descriptive essay, the poster employs a sophisticated gatefold layout to unfold a narrative of cultural unity, titled 'Global Cultures Festival' in precise, elegant lettering for visual hierarchy. Vibrant colors and authentic cultural images serve as eye-catchers, persuasively drawing viewers in through emotional resonance. The slogan 'Unite Through Diversity' encapsulates the event's ethos in bold, memorable phrasing. Practical details—March 8 at the Student Center—are structured for clarity, culminating in a compelling call to action: 'Join us for an unforgettable celebration!'."

    Request body:
    {
        "description": "Student's poster description"
    }

    Returns:
    {
        "score": 1-5,
        "level": "A1" | "A2" | "B1" | "B2" | "C1",
        "feedback": "AI feedback message",
        "details": {
            "grammar": "Grammar assessment",
            "spelling": "Spelling assessment",
            "structure": "Structure assessment"
        }
    }
    """
    try:
        data = request.get_json()
        description = data.get('description', '').strip()

        if not description:
            return jsonify({
                'success': False,
                'score': 0,
                'level': 'Below A1',
                'feedback': 'Please write your poster description using the template.'
            })

        # Check minimum length
        sentences = [s.strip() for s in description.replace('!', '.').replace('?', '.').split('.') if s.strip()]
        sentence_count = len(sentences)
        word_count = len(description.split())

        if word_count < 5:
            return jsonify({
                'success': False,
                'score': 0,
                'level': 'Below A1',
                'feedback': 'Your description is too short. Please write 4-8 sentences following the template.'
            })

        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR language assessment expert evaluating poster description writing.

Evaluate the student's poster description based on:

TEMPLATE ELEMENTS (must include):
1. Title/Layout: Mentions "gatefold" or layout type with title
2. Colors/Images: Describes colors/images as "eye-catcher"
3. Slogan/Lettering: States slogan with lettering style
4. Details/Call to Action: Includes date (March 8), place (Student Center), call to action (come join)

ASSESSMENT CRITERIA:
1. Grammar: Subject-verb agreement, article use, sentence structure
2. Spelling: Correct spelling (especially "gatefold")
3. Structure: Logical flow, complete sentences
4. Vocabulary: Appropriate marketing terms (persuasive, vibrant, elegant, etc.)
5. Template Adaptation: Following examples while making it their own

SCORING (each correct element +1):
- C1 (5 points): Sophisticated essay-like description with advanced vocabulary (unfold, narrative, hierarchy, ethos, authentic, persuasive, encapsulate, culminating), complex sentences, 60+ words, 4+ sentences
- B2 (4 points): Detailed description with persuasive vocabulary (vibrant, elegant, persuasive, immersive, diverse, attract), all template elements, 40+ words, 4+ sentences
- B1 (3 points): Complete description following template with all 4 elements, good grammar with subject-verb agreement, logical structure, 4+ sentences
- A2 (2 points): Basic template use with some elements (title/layout + colors/slogan), basic grammar, 3+ sentences
- A1 (1 point): Very basic attempt with at least title or colors, simple sentences

IMPORTANT:
- Give credit for effort and understanding even if grammar isn't perfect
- Focus on whether they followed the template structure
- Recognize when they adapted examples creatively
- Each correct template element should earn +1 point

Expected Response Examples:
A1: "My poster has title 'Festival'. It is big. Colors red. Date March 8."
A2: "My poster has gatefold with title 'Global Festival'. It use colors because eye-catcher. Slogan is 'Come!'. Date March 8."
B1: "My poster has a gatefold layout with title 'Global Cultures Festival'. It uses bright colors and cultural images because they are eye-catchers. The slogan is 'Join the Celebration!' with bold lettering. Date is March 8 at Student Center—come join!"
B2: "My poster features a gatefold layout for extra space, with the title 'Global Cultures Festival' in elegant lettering. It uses vibrant colors and diverse cultural images as eye-catchers to attract students. The slogan 'Discover Worlds in One Day' is bold and persuasive. Details include date March 8 at Student Center—don't miss this immersive experience!"
C1: "In this descriptive essay, the poster employs a sophisticated gatefold layout to unfold a narrative of cultural unity, titled 'Global Cultures Festival' in precise, elegant lettering for visual hierarchy. Vibrant colors and authentic cultural images serve as eye-catchers, persuasively drawing viewers in through emotional resonance. The slogan 'Unite Through Diversity' encapsulates the event's ethos in bold, memorable phrasing. Practical details—March 8 at the Student Center—are structured for clarity, culminating in a compelling call to action: 'Join us for an unforgettable celebration!'."

Respond ONLY in JSON format:
{
    "score": 1-5,
    "level": "A1" | "A2" | "B1" | "B2" | "C1",
    "feedback": "Brief encouraging feedback (2-3 sentences)",
    "details": {
        "grammar": "Brief grammar assessment",
        "spelling": "Brief spelling assessment",
        "structure": "Brief structure assessment"
    }
}"""

                user_prompt = f"""
Student's Poster Description:
"{description}"

Sentence count: {sentence_count}
Word count: {word_count}

Evaluate this poster description and determine the CEFR level and score.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=300,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                # Ensure score is within valid range
                score = max(1, min(5, result.get('score', 1)))

                logger.info(f"Poster description AI evaluation - Score: {score}/5 | Level: {result.get('level', 'A1')}")

                return jsonify({
                    'success': True,
                    'score': score,
                    'level': result.get('level', 'A1'),
                    'feedback': result.get('feedback', 'Good work on your poster description!'),
                    'details': result.get('details', {})
                })

            except Exception as ai_error:
                logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
                # Fall through to fallback evaluation

        # Fallback evaluation based on CEFR criteria
        desc_lower = description.lower()

        # Check for template elements
        has_title = 'title' in desc_lower or 'poster' in desc_lower
        has_layout = 'gatefold' in desc_lower or 'layout' in desc_lower
        has_colors = 'color' in desc_lower or 'colour' in desc_lower or 'bright' in desc_lower or 'vibrant' in desc_lower
        has_images = 'image' in desc_lower or 'picture' in desc_lower or 'photo' in desc_lower or 'cultural' in desc_lower
        has_slogan = 'slogan' in desc_lower
        has_date = 'march' in desc_lower or 'date' in desc_lower
        has_place = 'student center' in desc_lower or 'place' in desc_lower
        has_call_to_action = 'join' in desc_lower or 'come' in desc_lower or "don't miss" in desc_lower

        # Grammar indicators
        has_subject_verb = bool(__import__('re').search(r'\b(it|poster|slogan|layout)\s+(is|has|uses|features|employs)\b', description, __import__('re').IGNORECASE))
        has_articles = bool(__import__('re').search(r'\b(a|an|the)\b', description, __import__('re').IGNORECASE))
        has_because = 'because' in desc_lower
        has_eye_catcher = 'eye-catcher' in desc_lower or 'eye catcher' in desc_lower

        # Advanced vocabulary indicators
        has_advanced_vocab = any(word in desc_lower for word in [
            'unfold', 'narrative', 'hierarchy', 'ethos', 'authentic', 'persuasive',
            'encapsulate', 'culminat', 'resonate', 'compelling'
        ])
        has_b2_vocab = any(word in desc_lower for word in [
            'vibrant', 'elegant', 'immersive', 'diverse', 'attract', 'persuasive'
        ])

        score = 0
        level = 'Below A1'
        feedback = ''

        # C1: 5 points - Sophisticated essay-like description
        if (sentence_count >= 4 and word_count >= 60 and
            has_layout and has_title and has_colors and has_slogan and
            has_advanced_vocab and has_subject_verb):
            score = 5
            level = 'C1'
            feedback = 'Excellent! Your description demonstrates sophisticated writing with advanced vocabulary, complex sentence structures, and essay-like narrative quality. You effectively described the poster\'s visual hierarchy and persuasive elements.'
        # B2: 4 points - Detailed description with persuasive elements
        elif (sentence_count >= 4 and word_count >= 40 and
              has_layout and has_title and has_colors and has_slogan and has_date and
              (has_b2_vocab or (has_images and has_call_to_action)) and has_subject_verb):
            score = 4
            level = 'B2'
            feedback = 'Very good! Your description includes detailed elements with persuasive vocabulary. You featured the gatefold layout, vibrant colors, and compelling call to action with good grammar and structure.'
        # B1: 3 points - Complete description following template
        elif (sentence_count >= 4 and
              has_layout and has_title and has_colors and has_slogan and
              has_subject_verb):
            score = 3
            level = 'B1'
            feedback = 'Good! You followed the template well with 4+ sentences describing layout, colors, slogan, and date. Your grammar shows subject-verb agreement and logical structure.'
        # A2: 2 points - Basic template use with some elements
        elif (sentence_count >= 3 and
              (has_title or has_layout) and (has_colors or has_slogan) and
              has_subject_verb):
            score = 2
            level = 'A2'
            feedback = 'Good start! You used the template and included some poster elements. Try to add more details like date, place, and call to action. Check spelling (e.g., "gatefold").'
        # A1: 1 point - Very basic attempt
        elif sentence_count >= 1 and (has_title or has_colors or 'poster' in desc_lower):
            score = 1
            level = 'A1'
            feedback = 'You made an attempt at describing the poster. Try to follow the template more closely with title, layout, colors, slogan, and date. Use complete sentences with subject-verb structure.'
        else:
            score = 0
            level = 'Below A1'
            feedback = 'Please try again following the template. Write 4-8 sentences describing: 1) Title/Layout, 2) Colors/Images, 3) Slogan/Lettering, 4) Date/Place/Call to Action. Use the examples as models.'

        logger.info(f"Poster description fallback evaluation - Score: {score}/5 | Level: {level}")

        return jsonify({
            'success': score > 0,
            'score': score,
            'level': level,
            'feedback': feedback,
            'details': {
                'grammar': 'Check subject-verb agreement and article use' if not has_subject_verb or not has_articles else 'Good grammar',
                'spelling': 'Check spelling of "gatefold"' if 'gatefold' in desc_lower or 'layout' in desc_lower else 'OK',
                'structure': f'{sentence_count} sentences - aim for 4-8' if sentence_count < 4 else 'Good structure'
            }
        })

    except Exception as e:
        logger.error(f"Error evaluating poster description: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step4/evaluate-video-script', methods=['POST'])
def evaluate_video_script():
    """
    Evaluate video script writing with AI

    Scoring System (each correct element +1):
    - A1 (1): Basic attempt with video opening or clip
    - A2 (2): Basic template use with opening/animation and dramatisation
    - B1 (3): Complete 3+ scene script following template
    - B2 (4): Dynamic script with persuasive language and character development
    - C1 (5): Autonomous script with sophisticated vocabulary and layered storytelling

    Expected Response Examples:
    - A1: "Video open with clip. Show dancing. Music jingle. Come festival."
    - A2: "The video opens with animation and jingle. Show dramatisation with people dance. Feature date March March 8."
    - B1: "The video opens with colorful animation of cultures and a catchy jingle. Show dramatisation with students discovering traditions (goal) and enjoying together. Feature details: March 8 at Student Center—come join the fun!"
    - B2: "The video script opens with dynamic animation transitioning cultures, accompanied by an upbeat jingle for memorability. Dramatisation follows with relatable characters pursuing the goal of unity amid light obstacles, resolved joyfully. Features include quick clips of food/music, ending with persuasive call: 'Join Global Cultures Festival on March 8 at Student Center—don't miss out!'."
    - C1: "This autonomous video script commences with seamless animation illustrating cultural convergence, underscored by a custom jingle for rhythmic consistency and emotional hook. Dramatisation unfolds through nuanced storytelling—relatable characters navigate goals of cross-cultural understanding amid subtle obstacles, resolved in celebratory harmony. Features are layered persuasively: clips highlighting diversity, overlaid text for details (March 8, Student Center), culminating in an urgent, inclusive call to action: 'Be part of this transformative experience—join us!'."

    Request body:
    {
        "script": "Student's video script"
    }

    Returns:
    {
        "score": 1-5,
        "level": "A1" | "A2" | "B1" | "B2" | "C1",
        "feedback": "AI feedback message",
        "details": {
            "grammar": "Grammar assessment",
            "spelling": "Spelling assessment",
            "structure": "Structure assessment"
        }
    }
    """
    try:
        data = request.get_json()
        script = data.get('script', '').strip()

        if not script:
            return jsonify({
                'success': False,
                'score': 0,
                'level': 'Below A1',
                'feedback': 'Please write your video script using the template.'
            })

        # Check minimum length
        sentences = [s.strip() for s in script.replace('!', '.').replace('?', '.').split('.') if s.strip()]
        sentence_count = len(sentences)
        word_count = len(script.split())

        if word_count < 5:
            return jsonify({
                'success': False,
                'score': 0,
                'level': 'Below A1',
                'feedback': 'Your script is too short. Please write 4-8 sentences for video scenes following the template.'
            })

        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR language assessment expert evaluating video script writing.

Evaluate the student's video script based on:

TEMPLATE ELEMENTS (must include):
1. Scene 1 (Opening/Sketch): Opens with animation/clip and jingle
2. Scene 2 (Dramatisation/Storytelling): Shows dramatisation with characters, goals, and obstacles
3. Scene 3 (Features/Call to Action): Features event details and ends with call to action (Come on March 8!)

ASSESSMENT CRITERIA:
1. Grammar: Tense consistency, subject-verb agreement, sentence structure
2. Spelling: Correct spelling (especially "dramatisation")
3. Structure: Scene sequence, logical flow
4. Vocabulary: Appropriate video production terms (animation, dramatisation, jingle, etc.)
5. Template Adaptation: Following examples while making it their own

SCORING (each correct element +1):
- C1 (5 points): Autonomous script with sophisticated vocabulary (seamless, nuanced, transformative, convergence, culminating), layered storytelling with character arcs, 60+ words, 4+ sentences
- B2 (4 points): Dynamic script with persuasive language (dynamic, transitioning, relatable, memorability), character development with goals/obstacles, 40+ words, 4+ sentences
- B1 (3 points): Complete 3+ scene script following template with opening/jingle, dramatisation with characters/goals, features with call to action, good grammar
- A2 (2 points): Basic template use with some scenes (opening/animation + dramatisation or features), basic grammar, 2+ sentences
- A1 (1 point): Very basic attempt with at least video opening or clip mention, simple sentences

IMPORTANT:
- Give credit for effort and understanding even if grammar isn't perfect
- Focus on whether they followed the template structure with scenes
- Recognize when they adapted examples creatively
- Each correct scene element should contribute to the score

Expected Response Examples:
A1: "Video open with clip. Show dancing. Music jingle. Come festival."
A2: "The video opens with animation and jingle. Show dramatisation with people dance. Feature date March March 8."
B1: "The video opens with colorful animation of cultures and a catchy jingle. Show dramatisation with students discovering traditions (goal) and enjoying together. Feature details: March 8 at Student Center—come join the fun!"
B2: "The video script opens with dynamic animation transitioning cultures, accompanied by an upbeat jingle for memorability. Dramatisation follows with relatable characters pursuing the goal of unity amid light obstacles, resolved joyfully. Features include quick clips of food/music, ending with persuasive call: 'Join Global Cultures Festival on March 8 at Student Center—don't miss out!'."
C1: "This autonomous video script commences with seamless animation illustrating cultural convergence, underscored by a custom jingle for rhythmic consistency and emotional hook. Dramatisation unfolds through nuanced storytelling—relatable characters navigate goals of cross-cultural understanding amid subtle obstacles, resolved in celebratory harmony. Features are layered persuasively: clips highlighting diversity, overlaid text for details (March 8, Student Center), culminating in an urgent, inclusive call to action: 'Be part of this transformative experience—join us!'."

Respond ONLY in JSON format:
{
    "score": 1-5,
    "level": "A1" | "A2" | "B1" | "B2" | "C1",
    "feedback": "Brief encouraging feedback (2-3 sentences)",
    "details": {
        "grammar": "Brief grammar assessment",
        "spelling": "Brief spelling assessment",
        "structure": "Brief structure assessment"
    }
}"""

                user_prompt = f"""
Student's Video Script:
"{script}"

Sentence count: {sentence_count}
Word count: {word_count}

Evaluate this video script and determine the CEFR level and score.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=300,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                # Ensure score is within valid range
                score = max(1, min(5, result.get('score', 1)))

                logger.info(f"Video script AI evaluation - Score: {score}/5 | Level: {result.get('level', 'A1')}")

                return jsonify({
                    'success': True,
                    'score': score,
                    'level': result.get('level', 'A1'),
                    'feedback': result.get('feedback', 'Good work on your video script!'),
                    'details': result.get('details', {})
                })

            except Exception as ai_error:
                logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
                # Fall through to fallback evaluation

        # Fallback evaluation based on CEFR criteria
        script_lower = script.lower()

        # Check for template elements
        has_opening = 'video' in script_lower and ('open' in script_lower or 'start' in script_lower or 'begin' in script_lower)
        has_animation = 'animation' in script_lower or 'clip' in script_lower or 'sketch' in script_lower
        has_jingle = 'jingle' in script_lower
        has_dramatisation = 'dramatisation' in script_lower or 'dramatization' in script_lower or 'show' in script_lower
        has_character = 'character' in script_lower or 'student' in script_lower or 'people' in script_lower
        has_goal = 'goal' in script_lower or 'discover' in script_lower or 'unity' in script_lower
        has_obstacle = 'obstacle' in script_lower or 'overcome' in script_lower or 'shy' in script_lower
        has_features = 'feature' in script_lower or 'detail' in script_lower
        has_date = 'march' in script_lower or 'date' in script_lower
        has_call_to_action = 'come' in script_lower or 'join' in script_lower or "don't miss" in script_lower

        # Grammar indicators
        has_subject_verb = bool(__import__('re').search(r'\b(video|scene|script)\s+(open|start|show|feature)', script, __import__('re').IGNORECASE))

        # Advanced vocabulary indicators
        has_advanced_vocab = any(word in script_lower for word in [
            'autonomous', 'commence', 'seamless', 'nuanced', 'transformative', 'convergence',
            'underscored', 'unfold', 'navigate', 'culminating'
        ])
        has_b2_vocab = any(word in script_lower for word in [
            'dynamic', 'transitioning', 'relatable', 'memorability', 'persuasive'
        ])

        score = 0
        level = 'Below A1'
        feedback = ''

        # C1: 5 points - Autonomous script with sophisticated vocabulary
        if (sentence_count >= 4 and word_count >= 60 and
            has_opening and has_animation and has_jingle and has_dramatisation and
            has_goal and has_features and has_call_to_action and has_advanced_vocab):
            score = 5
            level = 'C1'
            feedback = 'Excellent! Your script demonstrates autonomous, sophisticated writing with advanced vocabulary (seamless, nuanced, transformative), layered storytelling, and persuasive elements. The script shows deep understanding of video structure and narrative techniques.'
        # B2: 4 points - Dynamic script with persuasive language
        elif (sentence_count >= 4 and word_count >= 40 and
              has_opening and has_animation and has_jingle and has_dramatisation and
              has_character and has_goal and has_features and has_call_to_action and
              (has_b2_vocab or has_obstacle)):
            score = 4
            level = 'B2'
            feedback = 'Very good! Your script includes dynamic transitions, relatable characters with clear goals and obstacles, and persuasive call to action. You used effective vocabulary and structured scenes logically.'
        # B1: 3 points - Complete script following template
        elif (sentence_count >= 3 and
              has_opening and has_dramatisation and has_features and
              has_subject_verb):
            score = 3
            level = 'B1'
            feedback = 'Good! You followed the template with 3+ scenes: opening with animation/jingle, dramatisation with characters discovering traditions, and features with call to action. Your grammar shows good structure.'
        # A2: 2 points - Basic template use with some scenes
        elif (sentence_count >= 2 and
              (has_opening or has_animation) and (has_dramatisation or has_features)):
            score = 2
            level = 'A2'
            feedback = 'Good start! You included some video scenes with animation and dramatisation. Try to add more details about characters, goals, obstacles, and a clear call to action. Check spelling (e.g., "dramatisation").'
        # A1: 1 point - Very basic attempt
        elif sentence_count >= 1 and (has_opening or 'video' in script_lower or 'clip' in script_lower):
            score = 1
            level = 'A1'
            feedback = 'You made an attempt at writing a video script. Try to follow the template more closely with: 1) Opening/Animation/Jingle, 2) Dramatisation with characters/goals/obstacles, 3) Features and call to action.'
        else:
            score = 0
            level = 'Below A1'
            feedback = 'Please try again following the template. Write 4-8 sentences for video scenes: 1) Opening/Sketch with animation and jingle, 2) Dramatisation/Storytelling with characters/goals/obstacles, 3) Features/Call to Action with event details.'

        logger.info(f"Video script fallback evaluation - Score: {score}/5 | Level: {level}")

        return jsonify({
            'success': score > 0,
            'score': score,
            'level': level,
            'feedback': feedback,
            'details': {
                'grammar': 'Check tense consistency' if not has_subject_verb else 'Good grammar',
                'spelling': 'Check spelling of "dramatisation"' if 'dramatisation' in script_lower or 'show' in script_lower else 'OK',
                'structure': f'{sentence_count} scenes - aim for 3+ scenes' if sentence_count < 3 else 'Good scene sequence'
            }
        })

    except Exception as e:
        logger.error(f"Error evaluating video script: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step4/evaluate-vocabulary-integration', methods=['POST'])
def evaluate_vocabulary_integration():
    """
    Evaluate vocabulary integration with Sushi Spell game

    Scoring System (each correct element +1):
    - A1 (1): Basic attempt using a vocabulary term
    - A2 (2): Basic use of term with some sentence structure
    - B1 (3): Uses term correctly with basic revision showing improvement
    - B2 (4): Well-structured revision with clear improvement and error correction
    - C1 (5): Complex sentence with autonomous error detection and sophisticated revision

    Expected Response Examples:
    - A1: "Spell gatefold. Poster gatefold."
    - A2: "Sushi Spell for dramatisation because add to video. Revised: Video has dramatisation."
    - B1: "Use Sushi Spell for 'jingle'—revised script: 'Add jingle for music' fixed to 'The script adds a jingle for catchy music'."
    - B2: "Incorporate Sushi Spell for 'lettering'—revised description: 'Poster lettering for appeal' fixed structure to 'The poster uses elegant lettering for visual appeal'."
    - C1: "Leverage Sushi Spell for 'sketch'—revised essay: Detected run-on in 'Sketches plan video it has goal' to 'Sketches, which plan the video, incorporate a clear goal for narrative drive'."

    Request body:
    {
        "spelledTerms": "Terms student spelled in Sushi Spell",
        "revisedSentence": "Revised sentence using one of the terms"
    }

    Returns:
    {
        "score": 1-5,
        "level": "A1" | "A2" | "B1" | "B2" | "C1",
        "feedback": "AI feedback message",
        "details": {
            "usedTerm": "Term used in sentence",
            "grammar": "Grammar assessment",
            "structure": "Structure assessment"
        }
    }
    """
    try:
        data = request.get_json()
        spelled_terms = data.get('spelledTerms', '').strip()
        revised_sentence = data.get('revisedSentence', '').strip()

        if not spelled_terms or not revised_sentence:
            return jsonify({
                'success': False,
                'score': 0,
                'level': 'Below A1',
                'feedback': 'Please list the terms you spelled in Sushi Spell AND write a revised sentence using one of those terms.'
            })

        word_count = len(revised_sentence.split())

        if word_count < 3:
            return jsonify({
                'success': False,
                'score': 0,
                'level': 'Below A1',
                'feedback': 'Your revised sentence is too short. Please write a complete sentence showing how you fixed errors.'
            })

        # Vocabulary terms to check
        vocabulary_terms = ['gatefold', 'dramatisation', 'animation', 'jingle', 'lettering', 'sketch']

        # Use AI evaluation if available
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR language assessment expert evaluating vocabulary integration and writing revision.

Evaluate the student's response based on:

REQUIREMENTS:
1. Must list terms spelled in Sushi Spell game
2. Must use ONE of those terms in a revised sentence
3. Must show how they fixed errors (grammar/spelling/structure)
4. Must demonstrate autonomous error detection

VOCABULARY TERMS (from Sushi Spell):
- gatefold, dramatisation, animation, jingle, lettering, sketch

ASSESSMENT CRITERIA:
1. Vocabulary Integration: Uses spelled term correctly in context
2. Error Detection: Identifies specific errors to fix (run-on, subject-verb, structure)
3. Revision Quality: Shows clear improvement from original to revised sentence
4. Grammar: Proper sentence structure, tense consistency
5. Autonomous Learning: Self-corrects without prompting

SCORING (each correct element +1):
- C1 (5 points): Complex sentence with clause structure (which, that), autonomous error detection (run-on, complex issues), sophisticated vocabulary (leverage, incorporate, narrative drive), 15+ words
- B2 (4 points): Well-structured revision showing specific error fixed (structure, grammar), clear improvement explanation, good vocabulary (incorporate, elegant, visual appeal), 10+ words
- B1 (3 points): Uses term correctly with basic revision, shows improvement (fixed to), subject-verb agreement, proper structure, 8+ words
- A2 (2 points): Basic use of term in sentence, some structure, mentions fixing, 5+ words
- A1 (1 point): Very basic attempt using vocabulary term, simple sentence

IMPORTANT:
- Student MUST use one of the spelled terms in their revised sentence
- Focus on whether they demonstrated autonomous error correction
- Give credit for identifying and fixing specific errors
- Recognize improvement in grammar, spelling, or structure

Expected Response Examples:
A1: "Spell gatefold. Poster gatefold."
A2: "Sushi Spell for dramatisation because add to video. Revised: Video has dramatisation."
B1: "Use Sushi Spell for 'jingle'—revised script: 'Add jingle for music' fixed to 'The script adds a jingle for catchy music'."
B2: "Incorporate Sushi Spell for 'lettering'—revised description: 'Poster lettering for appeal' fixed structure to 'The poster uses elegant lettering for visual appeal'."
C1: "Leverage Sushi Spell for 'sketch'—revised essay: Detected run-on in 'Sketches plan video it has goal' to 'Sketches, which plan the video, incorporate a clear goal for narrative drive'."

Respond ONLY in JSON format:
{
    "score": 1-5,
    "level": "A1" | "A2" | "B1" | "B2" | "C1",
    "feedback": "Brief encouraging feedback mentioning the term used and quality of revision (2-3 sentences)",
    "details": {
        "usedTerm": "The vocabulary term used",
        "grammar": "Brief grammar assessment",
        "structure": "Brief structure assessment"
    }
}"""

                user_prompt = f"""
Spelled Terms: "{spelled_terms}"

Revised Sentence: "{revised_sentence}"

Word count: {word_count}

Evaluate this vocabulary integration response and determine the CEFR level and score.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=300,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                import json
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                # Ensure score is within valid range
                score = max(1, min(5, result.get('score', 1)))

                logger.info(f"Vocabulary integration AI evaluation - Score: {score}/5 | Level: {result.get('level', 'A1')}")

                return jsonify({
                    'success': True,
                    'score': score,
                    'level': result.get('level', 'A1'),
                    'feedback': result.get('feedback', 'Good work on vocabulary integration!'),
                    'details': result.get('details', {})
                })

            except Exception as ai_error:
                logger.warning(f"AI evaluation failed, using fallback: {ai_error}")
                # Fall through to fallback evaluation

        # Fallback evaluation based on CEFR criteria
        sentence_lower = revised_sentence.lower()
        terms_lower = spelled_terms.lower()

        # Check if any vocabulary term is used
        used_term = None
        for term in vocabulary_terms:
            if term.lower() in sentence_lower:
                used_term = term
                break

        listed_term = None
        for term in vocabulary_terms:
            if term.lower() in terms_lower:
                listed_term = term
                break

        # Grammar indicators
        has_subject_verb = bool(__import__('re').search(r'\b(poster|video|script|scene)\s+(has|uses|features|employs|adds|incorporates)\b', revised_sentence, __import__('re').IGNORECASE))
        has_articles = bool(__import__('re').search(r'\b(a|an|the)\b', revised_sentence, __import__('re').IGNORECASE))
        has_proper_structure = word_count >= 5

        # Error detection indicators
        mentions_error = 'fixed' in sentence_lower or 'corrected' in sentence_lower or 'revised' in sentence_lower or 'detected' in sentence_lower
        shows_improvement = 'to' in sentence_lower and has_subject_verb

        # Advanced writing indicators
        has_complex = 'which' in sentence_lower or 'that' in sentence_lower or ',' in revised_sentence
        has_advanced_vocab = 'autonomous' in sentence_lower or 'leverage' in sentence_lower or 'incorporate' in sentence_lower or 'narrative drive' in sentence_lower

        score = 0
        level = 'Below A1'
        feedback = ''

        # C1: 5 points - Complex sentence with error detection and sophisticated revision
        if used_term and listed_term and word_count >= 15 and has_complex and has_advanced_vocab and mentions_error:
            score = 5
            level = 'C1'
            feedback = f'Excellent! You successfully spelled "{used_term}" in Sushi Spell and leveraged it in a sophisticated revised sentence. Your sentence demonstrates autonomous error detection (identifying run-on sentences or structure issues) and complex grammar with clauses. Outstanding improvement!'
        # B2: 4 points - Well-structured revision with clear improvement
        elif used_term and listed_term and word_count >= 10 and has_subject_verb and has_articles and (mentions_error or shows_improvement):
            score = 4
            level = 'B2'
            feedback = f'Very good! You incorporated "{used_term}" from Sushi Spell into a well-structured revised sentence. You showed clear improvement from the original sentence with better grammar and structure. Good work on autonomous correction!'
        # B1: 3 points - Uses term correctly with basic revision
        elif used_term and listed_term and word_count >= 8 and has_subject_verb and has_proper_structure:
            score = 3
            level = 'B1'
            feedback = f'Good! You used "{used_term}" from Sushi Spell in your revised sentence. Your sentence shows improvement with subject-verb agreement and proper structure. Keep working on identifying and fixing errors autonomously.'
        # A2: 2 points - Basic use of term with some structure
        elif used_term and word_count >= 5 and has_proper_structure:
            score = 2
            level = 'A2'
            feedback = f'Good start! You used "{used_term}" in your sentence. Try to show more clearly how you revised/fixed the original sentence. Make sure to list the terms you spelled in Sushi Spell and explain the improvement.'
        # A1: 1 point - Very basic attempt
        elif (used_term or listed_term) and len(revised_sentence.strip()) > 0:
            score = 1
            level = 'A1'
            feedback = 'You made an attempt. Make sure to: 1) Play Sushi Spell and list 5 terms you spelled, 2) Use ONE of those terms in a revised sentence, 3) Show how you fixed errors in grammar/spelling/structure.'
        else:
            score = 0
            level = 'Below A1'
            feedback = 'Please try again. First play Sushi Spell for terms like "gatefold", "dramatisation", "animation", "jingle", "lettering", "sketch". Then list the terms you spelled AND write a revised sentence using one term, showing how you fixed errors.'

        logger.info(f"Vocabulary integration fallback evaluation - Score: {score}/5 | Level: {level}")

        return jsonify({
            'success': score > 0,
            'score': score,
            'level': level,
            'feedback': feedback,
            'details': {
                'usedTerm': used_term or 'None detected',
                'grammar': 'Good subject-verb agreement' if has_subject_verb else 'Check subject-verb agreement',
                'structure': 'Good structure' if has_proper_structure else 'Sentence needs more development'
            }
        })

    except Exception as e:
        logger.error(f"Error evaluating vocabulary integration: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ============================================================================
# PHASE 4 STEP 4: REMEDIAL LOGGING
# ============================================================================

@phase4_bp.route('/step4/remedial/log', methods=['POST'])
def log_step4_remedial_task():
    """
    Log Phase 4 Step 4 remedial task completion
    """
    try:
        user_id = session.get('user_id', 'anonymous')
        data = request.json

        level = data.get('level', 'Unknown')
        task = data.get('task', 'Unknown')
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        time_taken = data.get('time_taken', 0)

        # TERMINAL OUTPUT - Detailed logging
        print("\n" + "="*60)
        print(f"PHASE 4 STEP 4 - REMEDIAL {level} - TASK {task}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Score: {score}/{max_score} points")
        if time_taken > 0:
            print(f"Time Taken: {time_taken} seconds")
        print(f"Success Rate: {(score/max_score)*100:.1f}%")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 4 - Remedial {level} Task {task} - User {user_id}: Score={score}/{max_score}, Time={time_taken}s")

        return jsonify({
            'success': True,
            'message': 'Phase 4 Step 4 remedial task logged successfully'
        })

    except Exception as e:
        logger.error(f"Error logging Phase 4 Step 4 remedial task: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step4/remedial/a1/final-score', methods=['POST'])
def calculate_step4_a1_final_score():
    """
    Calculate Phase 4 Step 4 Remedial A1 final score

    Task A: 8 points (Drag & Drop Matching)
    Task B: 8 points (Gap Fill)
    Task C: 6 points (Sentence Builder)
    Total: 22 points
    Pass threshold: 70% = 16 points
    """
    try:
        user_id = session.get('user_id', 'anonymous')
        data = request.json

        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)

        total = task_a + task_b + task_c
        max_score = 22
        threshold = 16  # 70%
        passed = total >= threshold

        # TERMINAL OUTPUT
        print("\n" + "="*60)
        print("PHASE 4 STEP 4 - REMEDIAL A1 - FINAL SCORE")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Task A (Term Treasure Hunt): {task_a}/8")
        print(f"Task B (Fill Quest): {task_b}/8")
        print(f"Task C (Sentence Builder): {task_c}/6")
        print("-"*60)
        print(f"TOTAL SCORE: {total}/{max_score}")
        print(f"Pass Threshold: {threshold}/{max_score} (70%)")
        print(f"Result: {'✅ PASSED' if passed else '❌ FAILED'}")
        print("="*60 + "\n")

        logger.info(f"Phase 4 Step 4 - Remedial A1 Final - User {user_id}: {total}/{max_score} ({'PASS' if passed else 'FAIL'})")

        return jsonify({
            'success': True,
            'data': {
                'task_a': task_a,
                'task_b': task_b,
                'task_c': task_c,
                'total': total,
                'max_score': max_score,
                'threshold': threshold,
                'passed': passed
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 4 A1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# =========================================================================
# Phase 4 Step 4 - Remedial B1 Routes
# =========================================================================

@phase4_bp.route('/step4/remedial/b1/evaluate-definitions', methods=['POST'])
@login_required
def evaluate_step4_b1_definitions():
    """
    Evaluate Step 4 B1 Task B (Definition Duel) - 8 definitions with LLM

    Request body:
    {
        "definitions": [
            {
                "term": "promotional",
                "answer": "student's definition",
                "example": ""
            },
            ...
        ]
    }

    Returns:
    {
        "success": true,
        "results": [
            {"term": "promotional", "score": 1, "feedback": "..."},
            ...
        ],
        "total_score": 6,
        "max_score": 8
    }
    """
    logger.info(f"=== Step 4 B1 Definition Evaluation - User {session.get('user_id')} ===")
    try:
        data = request.get_json()
        logger.info(f"Received request data: {data}")
        definitions = data.get('definitions', [])
        logger.info(f"Processing {len(definitions)} definitions")

        if not definitions:
            return jsonify({
                'success': False,
                'error': 'No definitions provided'
            }), 400

        results = []
        total_score = 0

        # Use AI evaluation if available
        if ai_service.client:
            for defn in definitions:
                term = defn.get('term', '')
                student_answer = defn.get('answer', '').strip()

                if not student_answer:
                    results.append({
                        'term': term,
                        'score': 0,
                        'feedback': 'Please provide a definition.'
                    })
                    continue

                try:
                    # Get example answer for this term
                    examples = {
                        'promotional': 'Promotional means to advertise or sell something, like the first video says ads are promotional to make people buy.',
                        'persuasive': 'Persuasive means to convince people, and the video explains it uses feelings and logic.',
                        'targeted': 'Targeted means the ad is for a specific group, for example students in our university.',
                        'original': 'Original means a new idea that is not copied, as the video says good ads are original.',
                        'creative': 'Creative means using imagination to make the ad interesting, like the video shows creative examples.',
                        'consistent': 'Consistent means the message and style stay the same, which the video says is important for all ads.',
                        'personalized': 'Personalized means the ad is made for one person or small group, like sending a special message.',
                        'ethical': 'Ethical means the ad is honest and fair, and the video says we should not lie in advertising.'
                    }

                    example_answer = examples.get(term, '')

                    system_prompt = f"""You are evaluating a B1 level English definition for the term '{term}' in advertising context.

The student should provide:
1) A clear definition of the term
2) Complete sentences with B1-appropriate grammar
3) Understanding of the term's meaning in advertising

Example of a good B1 answer for '{term}':
{example_answer}

IMPORTANT - BE FLEXIBLE at B1 level:
- Accept minor grammar mistakes if meaning is clear
- Accept varied sentence structures
- Focus on: Clear definition + Understanding of meaning
- Compare to the example but accept different wording
- Score 1 if the answer shows understanding and effort
- Score 0 only if completely irrelevant or no effort shown

Respond ONLY in JSON format:
{{
    "score": 0 or 1,
    "feedback": "brief encouraging feedback (1-2 sentences)"
}}"""

                    user_prompt = f"""
Term: {term}

Student's answer: "{student_answer}"

Evaluate and return ONLY valid JSON."""

                    ai_response = ai_service.client.chat.completions.create(
                        model=ai_service.model,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        max_tokens=150,
                        temperature=0.3
                    )

                    response_text = ai_response.choices[0].message.content.strip()
                    logger.info(f"AI response for term '{term}': {response_text}")

                    # Parse JSON response
                    evaluation = json.loads(response_text)
                    score = evaluation.get('score', 0)
                    feedback = evaluation.get('feedback', 'Good effort!')

                    results.append({
                        'term': term,
                        'score': score,
                        'feedback': feedback
                    })
                    total_score += score

                except json.JSONDecodeError as je:
                    logger.warning(f"JSON decode error for term '{term}': {je}")
                    # Fallback: Basic length check
                    if len(student_answer) >= 20:
                        results.append({
                            'term': term,
                            'score': 1,
                            'feedback': 'Good effort! Your definition shows understanding.'
                        })
                        total_score += 1
                    else:
                        results.append({
                            'term': term,
                            'score': 0,
                            'feedback': 'Please write a more complete definition with an example.'
                        })

                except Exception as e:
                    logger.error(f"Error evaluating term '{term}': {e}")
                    results.append({
                        'term': term,
                        'score': 0,
                        'feedback': 'Error evaluating this definition. Please try again.'
                    })

        else:
            # Fallback if AI not available
            logger.warning("AI service not available, using fallback evaluation")
            for defn in definitions:
                term = defn.get('term', '')
                student_answer = defn.get('answer', '').strip()

                if len(student_answer) >= 20:
                    results.append({
                        'term': term,
                        'score': 1,
                        'feedback': 'Good effort!'
                    })
                    total_score += 1
                else:
                    results.append({
                        'term': term,
                        'score': 0,
                        'feedback': 'Please write a more complete definition.'
                    })

        logger.info(f"Step 4 B1 Evaluation complete. Total score: {total_score}/8")

        return jsonify({
            'success': True,
            'results': results,
            'total_score': total_score,
            'max_score': 8
        })

    except Exception as e:
        logger.error(f"Error in Step 4 B1 definition evaluation: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase4_bp.route('/step4/remedial/b1/final-score', methods=['POST'])
@login_required
def calculate_step4_b1_final_score():
    """
    Calculate and log Phase 4 Step 4 Remedial B1 final score
    Pass threshold: >= 32/38 (~84%)

    Request body:
    {
        "task_a_score": 4,   # Negotiation Battle (max 4)
        "task_b_score": 8,   # Definition Duel (max 8)
        "task_c_score": 6,   # Quiz Game (max 6)
        "task_d_score": 8,   # Flashcard Game (max 8)
        "task_e_score": 6,   # Tense Time Travel (max 6)
        "task_f_score": 6    # Grammar Kahoot (max 6)
    }

    Returns:
    {
        "success": true,
        "data": {
            "task_a": 4,
            "task_b": 8,
            "task_c": 6,
            "task_d": 8,
            "task_e": 6,
            "task_f": 6,
            "total": 38,
            "max_score": 38,
            "threshold": 32,
            "passed": true
        }
    }
    """
    logger.info(f"=== Calculating Phase 4 Step 4 B1 Final Score - User {session.get('user_id')} ===")
    try:
        data = request.get_json()
        task_a = data.get('task_a_score', 0)
        task_b = data.get('task_b_score', 0)
        task_c = data.get('task_c_score', 0)
        task_d = data.get('task_d_score', 0)
        task_e = data.get('task_e_score', 0)
        task_f = data.get('task_f_score', 0)

        total = task_a + task_b + task_c + task_d + task_e + task_f
        max_score = 38
        threshold = 32  # ~84%
        passed = total >= threshold

        logger.info(f"Step 4 B1 Scores - Task A: {task_a}/4, Task B: {task_b}/8, Task C: {task_c}/6")
        logger.info(f"Task D: {task_d}/8, Task E: {task_e}/6, Task F: {task_f}/6")
        logger.info(f"Total: {total}/{max_score}, Threshold: {threshold}, Passed: {passed}")

        # Log to database
        user_id = session.get('user_id')
        if user_id:
            try:
                import sqlite3
                db = sqlite3.connect('fardi.db')
                cursor = db.cursor()

                cursor.execute('''
                    INSERT INTO remedial_scores (
                        user_id, phase, step, level,
                        task_a_score, task_b_score, task_c_score,
                        task_d_score, task_e_score, task_f_score,
                        total_score, max_score, passed, timestamp
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ''', (
                    user_id, 4, 4, 'B1',
                    task_a, task_b, task_c,
                    task_d, task_e, task_f,
                    total, max_score, passed
                ))

                db.commit()
                logger.info(f"Step 4 B1 final score logged to database for user {user_id}")

            except Exception as db_error:
                logger.error(f"Database error logging Step 4 B1 score: {db_error}")

        return jsonify({
            'success': True,
            'data': {
                'task_a': task_a,
                'task_b': task_b,
                'task_c': task_c,
                'task_d': task_d,
                'task_e': task_e,
                'task_f': task_f,
                'total': total,
                'max_score': max_score,
                'threshold': threshold,
                'passed': passed
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 4 Step 4 B1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ===================================
# PHASE 4 STEP 5 - REMEDIAL EVALUATION ENDPOINTS
# ===================================

@phase4_bp.route('/step5/remedial/evaluate-expansion', methods=['POST'])
@login_required
def evaluate_step5_remedial_expansion():
    """
    Evaluate sentence correction for B2/C1 Task B (Analysis Odyssey)
    Uses LLM to check if the corrected sentence meets level requirements
    """
    try:
        data = request.json
        level = data.get('level', 'B2')
        faulty_sentence = data.get('faultySentence', '')
        user_answer = data.get('userAnswer', '').strip()
        sentence_index = data.get('sentenceIndex', 0)

        if not user_answer:
            return jsonify({
                'correct': False,
                'feedback': 'Please provide your correction.'
            })

        # Use AI to evaluate the correction
        if ai_service.client:
            try:
                if level == 'B2':
                    system_prompt = """You are a CEFR B2-level language evaluator for sentence correction exercises.

Evaluate if the student's corrected sentence meets B2 requirements:
1. **Grammar**: Proper subject-verb agreement, verb forms, tenses
2. **Articles**: Correct use of a/an/the
3. **Vocabulary**: Upgraded vocabulary (good→effective, bad→poorly executed, ok→acceptable, nice→pleasant)
4. **Connectors**: Proper use of although, even though, but
5. **Coherence**: Logical flow and clear meaning
6. **Spelling**: No spelling errors

IMPORTANT: Be flexible. Accept variations if they demonstrate B2-level improvements.
Do NOT require exact matches to expected answers.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""
                else:  # C1
                    system_prompt = """You are a CEFR C1-level language evaluator for sentence correction exercises.

Evaluate if the student's corrected sentence meets C1 requirements:
1. **Grammar**: Perfect subject-verb agreement, precise verb forms, complex tenses
2. **Vocabulary**: Sophisticated words (hinges, rooted, compelling, fosters, exemplifies, captivates, determines)
3. **Syntax**: Complex structures with dashes (—), commas, subordinate clauses
4. **Connectors**: Precise connectors (although, yet, rather than, regarding, ensuring, through)
5. **Nuance**: Adds detail, context, and sophisticated meaning
6. **Coherence**: Elegant, flowing sentences with clear logical relationships

IMPORTANT: Be flexible with structure but require C1-level sophistication.
Do NOT require exact matches to expected answers.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""
Faulty sentence: "{faulty_sentence}"
Student's correction: "{user_answer}"

Evaluate if this correction meets {level}-level requirements.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'correct': result.get('correct', False),
                    'feedback': result.get('feedback', 'Keep practicing!')
                })

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Accept if meaningful changes were made
        if len(user_answer) >= len(faulty_sentence):
            return jsonify({
                'correct': True,
                'feedback': 'Good correction! Keep up the good work.'
            })
        else:
            return jsonify({
                'correct': False,
                'feedback': 'Try to expand and improve the sentence more.'
            })

    except Exception as e:
        logger.error(f"Error evaluating expansion: {e}")
        return jsonify({
            'correct': True,
            'feedback': 'Correction recorded.'
        }), 200


@phase4_bp.route('/step5/remedial/evaluate-question', methods=['POST'])
@login_required
def evaluate_step5_remedial_question():
    """
    Evaluate question answers for C1 Task C (Quizlet Live)
    Uses LLM to check if the answer is detailed and sophisticated enough
    """
    try:
        data = request.json
        level = data.get('level', 'C1')
        question = data.get('question', '')
        user_answer = data.get('userAnswer', '').strip()
        expected_answer = data.get('expectedAnswer', '')
        keywords = data.get('keywords', [])

        if not user_answer:
            return jsonify({
                'correct': False,
                'feedback': 'Please provide your answer.'
            })

        # Use AI to evaluate the answer
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for advanced comprehension questions.

Evaluate if the student's answer meets C1 requirements:
1. **Video References**: Mentions specific videos (video 1, video 2)
2. **Key Concepts**: Includes relevant keywords from expected answer
3. **Sophisticated Vocabulary**: Uses advanced words and precise expressions
4. **Detail**: Provides complete explanations (minimum 30 characters)
5. **Nuance**: Explains both advantages and drawbacks where applicable
6. **Coherence**: Clear, flowing sentences with logical connections

IMPORTANT: Be flexible. Accept answers that demonstrate understanding even if worded differently.
Do NOT require exact matches to expected answers.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""
Question: "{question}"
Expected answer: "{expected_answer}"
Key concepts: {', '.join(keywords)}

Student's answer: "{user_answer}"

Evaluate if this answer meets C1-level requirements and demonstrates understanding.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'correct': result.get('correct', False),
                    'feedback': result.get('feedback', 'Keep practicing!')
                })

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Check for keywords
        user_lower = user_answer.lower()
        keyword_matches = sum(1 for kw in keywords if kw.lower() in user_lower)
        keyword_threshold = len(keywords) * 0.6

        if keyword_matches >= keyword_threshold and len(user_answer) >= 30:
            return jsonify({
                'correct': True,
                'feedback': 'Good answer! You covered the key concepts.'
            })
        else:
            return jsonify({
                'correct': False,
                'feedback': 'Try to include more key concepts and details in your answer.'
            })

    except Exception as e:
        logger.error(f"Error evaluating question: {e}")
        return jsonify({
            'correct': True,
            'feedback': 'Answer recorded.'
        }), 200


@phase4_bp.route('/step5/remedial/evaluate-tense', methods=['POST'])
@login_required
def evaluate_step5_remedial_tense():
    """
    Evaluate tense correction for C1 Task D (Tense Odyssey)
    Uses LLM to check if the corrected sentence has proper tenses and structure
    """
    try:
        data = request.json
        level = data.get('level', 'C1')
        faulty_sentence = data.get('faultySentence', '')
        user_answer = data.get('userAnswer', '').strip()
        expected_answer = data.get('expectedAnswer', '')
        key_elements = data.get('keyElements', [])

        if not user_answer:
            return jsonify({
                'correct': False,
                'feedback': 'Please provide your correction.'
            })

        # Use AI to evaluate the correction
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for mixed tense/grammar correction exercises.

Evaluate if the student's corrected sentence meets C1 requirements:
1. **Tense Accuracy**: Proper use of perfect tenses (has been used, have become, have proven), past perfect (had been, had it been)
2. **Conditionals**: Complex conditionals (would be, would have been, would have felt, if it incorporated, had it been)
3. **Subject-Verb Agreement**: Correct agreement (are→is, were→was, has→have, stand→stands)
4. **Sophisticated Vocabulary**: Advanced words (employed, portrayed, illustrates, oversaturated, authentic)
5. **Complex Syntax**: Uses commas, subordinate clauses, relative clauses (which, although, yet)
6. **Video References**: Includes references like "as video 1 suggests", "in video 2"

IMPORTANT: Be flexible with exact wording but require C1-level tense sophistication.
Do NOT require exact matches - accept variations that demonstrate C1-level understanding.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""
Faulty sentence: "{faulty_sentence}"
Expected correction: "{expected_answer}"
Key elements needed: {', '.join(key_elements)}

Student's correction: "{user_answer}"

Evaluate if this correction meets C1-level requirements for tense, grammar, and structure.
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'correct': result.get('correct', False),
                    'feedback': result.get('feedback', 'Keep practicing!')
                })

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Check for key elements
        user_lower = user_answer.lower()
        has_key_elements = all(elem.lower() in user_lower for elem in key_elements)
        has_proper_length = len(user_answer) >= 80
        has_punctuation = ',' in user_answer
        is_not_faulty = user_answer.lower() != faulty_sentence.lower()

        if has_key_elements and has_proper_length and has_punctuation and is_not_faulty:
            return jsonify({
                'correct': True,
                'feedback': 'Good correction! You used the required tenses and structures.'
            })
        else:
            return jsonify({
                'correct': False,
                'feedback': 'Remember to use perfect tenses, conditionals, and complex structures.'
            })

    except Exception as e:
        logger.error(f"Error evaluating tense correction: {e}")
        return jsonify({
            'correct': True,
            'feedback': 'Correction recorded.'
        }), 200


@phase4_bp.route('/step5/remedial/evaluate-clause', methods=['POST'])
@login_required
def evaluate_step5_remedial_clause():
    """
    Evaluate clause analysis for C1 Task E (Clause Conquest)
    Uses LLM to check if student correctly identified that sentences are grammatically correct

    Note: All sentences in this task are CORRECT. Students must recognize them as correct
    by either writing "correct" or copying the sentence accurately.
    """
    try:
        data = request.json
        level = data.get('level', 'C1')
        original_sentence = data.get('originalSentence', '')
        user_answer = data.get('userAnswer', '').strip()
        correct_answer = data.get('correctAnswer', '')

        if not user_answer:
            return jsonify({
                'correct': False,
                'feedback': 'Please provide your answer.'
            })

        # Use AI to evaluate the answer
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for clause analysis exercises.

IMPORTANT CONTEXT: All sentences in this task are grammatically CORRECT. The student's task is to analyze each sentence and recognize that it has proper structure.

Evaluate if the student correctly identified the sentence as correct. Accept if they:
1. Wrote "correct", "this is correct", "already correct", "no errors", or similar recognition
2. Copied the entire sentence accurately (showing they recognized it's correct and preserved it)
3. Made only minor typos while copying but clearly tried to preserve the correct sentence

REJECT if they:
- Wrote nonsense or random characters (e.g., "hhhhhhh", "asdfasdf")
- Tried to "fix" a sentence that was already correct
- Wrote incomplete fragments
- Provided an answer that shows they misunderstood the task

The original sentence has:
- Proper relative clauses (which, by which)
- Correct passive voice constructions
- Accurate tense usage (present perfect, conditionals)
- Complex subordination

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief feedback (1 sentence)"
}"""

                user_prompt = f"""
Original sentence (which is CORRECT): "{original_sentence}"
Student's answer: "{user_answer}"

Did the student correctly recognize this sentence as grammatically correct?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=150,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'correct': result.get('correct', False),
                    'feedback': result.get('feedback', 'Keep practicing!')
                })

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Check for "correct" keyword or exact copy
        user_lower = user_answer.lower().strip()
        recognized_correct = user_lower in ['correct', 'this is correct', 'already correct', 'no errors', 'no error', 'sentence is correct']

        # Check if they copied the sentence (at least 80% match)
        correct_lower = correct_answer.lower().strip()
        if len(user_answer) > 50:
            # Simple substring match for long answers
            copied_correctly = user_lower == correct_lower or correct_lower in user_lower
        else:
            copied_correctly = False

        if recognized_correct or copied_correctly:
            return jsonify({
                'correct': True,
                'feedback': 'Correct! You recognized the sentence has proper structure.'
            })
        else:
            return jsonify({
                'correct': False,
                'feedback': 'This sentence is actually correct. Try to recognize proper C1-level structures.'
            })

    except Exception as e:
        logger.error(f"Error evaluating clause: {e}")
        return jsonify({
            'correct': False,
            'feedback': 'Evaluation error occurred.'
        }), 200


@phase4_bp.route('/step5/remedial/evaluate-modal', methods=['POST'])
@login_required
def evaluate_step5_remedial_modal():
    """
    Evaluate modal/subjunctive analysis for C1 Task F (Debate Duel Advanced)
    Uses LLM to check if student correctly identified subjunctive and modal usage

    Note: All sentences in this task are CORRECT. Students must recognize proper
    subjunctive and modal structures.
    """
    try:
        data = request.json
        level = data.get('level', 'C1')
        original_sentence = data.get('originalSentence', '')
        user_answer = data.get('userAnswer', '').strip()
        correct_answer = data.get('correctAnswer', '')
        grammar_type = data.get('grammarType', '')

        if not user_answer:
            return jsonify({
                'correct': False,
                'feedback': 'Please provide your answer.'
            })

        # Use AI to evaluate the answer
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for subjunctive and modal analysis exercises.

IMPORTANT CONTEXT: All sentences in this task are grammatically CORRECT. The student's task is to analyze each sentence and recognize that it uses subjunctive/modal structures correctly.

Evaluate if the student correctly identified the sentence as correct. Accept if they:
1. Wrote "correct", "this is correct", "already correct", "no errors", or similar recognition
2. Copied the entire sentence accurately (showing they recognized it's correct and preserved it)
3. Made only minor typos while copying but clearly tried to preserve the correct sentence

REJECT if they:
- Wrote nonsense or random characters (e.g., "hhhhhhh", "asdfasdf")
- Tried to "fix" a sentence that was already correct with proper subjunctive/modal usage
- Wrote incomplete fragments
- Provided an answer that shows they misunderstood the task

The original sentence has proper:
- Present subjunctive (It is crucial/essential that X be...)
- Modals (should, could, might, must)
- Second conditional (If X were..., Y might/could...)
- Advanced structures (lest, implied subjunctive)

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief feedback (1 sentence)"
}"""

                user_prompt = f"""
Original sentence (which is CORRECT): "{original_sentence}"
Grammar type: {grammar_type}
Student's answer: "{user_answer}"

Did the student correctly recognize this sentence has proper subjunctive/modal usage?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=150,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'correct': result.get('correct', False),
                    'feedback': result.get('feedback', 'Keep practicing!')
                })

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Check for "correct" keyword or exact copy
        user_lower = user_answer.lower().strip()
        recognized_correct = user_lower in ['correct', 'this is correct', 'already correct', 'no errors', 'no error', 'sentence is correct']

        # Check if they copied the sentence
        correct_lower = correct_answer.lower().strip()
        if len(user_answer) > 50:
            copied_correctly = user_lower == correct_lower or correct_lower in user_lower
        else:
            copied_correctly = False

        if recognized_correct or copied_correctly:
            return jsonify({
                'correct': True,
                'feedback': 'Correct! You recognized proper subjunctive/modal usage.'
            })
        else:
            return jsonify({
                'correct': False,
                'feedback': 'This sentence is actually correct. Recognize C1-level subjunctive and modal structures.'
            })

    except Exception as e:
        logger.error(f"Error evaluating modal: {e}")
        return jsonify({
            'correct': False,
            'feedback': 'Evaluation error occurred.'
        }), 200


@phase4_bp.route('/step5/remedial/evaluate-correction', methods=['POST'])
@login_required
def evaluate_step5_remedial_correction():
    """
    Evaluate comprehensive error correction for C1 Task G (Correction Crusade)
    Uses LLM to check if student fixed ALL error types correctly
    """
    try:
        data = request.json
        level = data.get('level', 'C1')
        faulty_sentence = data.get('faultySentence', '')
        user_answer = data.get('userAnswer', '').strip()
        correct_answer = data.get('correctAnswer', '')
        errors = data.get('errors', [])

        if not user_answer:
            return jsonify({
                'correct': False,
                'feedback': 'Please provide your correction.'
            })

        # Use AI to evaluate the correction
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for comprehensive error correction exercises.

Evaluate if the student's corrected sentence fixes ALL the errors and meets C1 requirements:
1. **Subject-Verb Agreement**: All subjects and verbs must agree
2. **Relative Clauses**: Proper commas around non-restrictive clauses
3. **Tenses**: Correct verb tenses throughout
4. **Vocabulary**: C1-level word choices (employed, highly effective, etc.)
5. **Connectors**: Sophisticated connectors (although, yet, etc.)
6. **Completeness**: All necessary objects, articles, modals added
7. **Punctuation**: Proper comma usage

IMPORTANT: Be flexible with exact wording but ensure all major errors are fixed.
Accept variations that demonstrate C1-level corrections even if worded differently.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""
Faulty sentence: "{faulty_sentence}"
Errors to fix: {', '.join(errors)}
Expected correction: "{correct_answer}"

Student's correction: "{user_answer}"

Did the student successfully fix all the errors at C1 level?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'correct': result.get('correct', False),
                    'feedback': result.get('feedback', 'Keep practicing!')
                })

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Basic error checking
        user_lower = user_answer.lower().strip()

        # Check if major errors are fixed
        has_proper_agreement = 'are to sell' not in user_lower and 'which provide' not in user_lower
        has_proper_tense = 'were used' not in user_lower or 'was employed' in user_lower
        has_length = len(user_answer) >= len(correct_answer) * 0.75
        is_not_faulty = user_lower != faulty_sentence.lower()

        if has_proper_agreement and has_length and is_not_faulty:
            return jsonify({
                'correct': True,
                'feedback': 'Good correction! You fixed the major errors.'
            })
        else:
            return jsonify({
                'correct': False,
                'feedback': 'Make sure to fix ALL errors: grammar, vocabulary, tenses, punctuation, and structure.'
            })

    except Exception as e:
        logger.error(f"Error evaluating correction: {e}")
        return jsonify({
            'correct': True,
            'feedback': 'Correction recorded.'
        }), 200


@phase4_bp.route('/step5/remedial/evaluate-subjunctive', methods=['POST'])
@login_required
def evaluate_step5_remedial_subjunctive():
    """
    Evaluate subjunctive/modal corrections for C1 Task F (Debate Duel Advanced)
    Uses LLM to check if student fixed subjunctive and modal errors correctly
    """
    try:
        data = request.json
        level = data.get('level', 'C1')
        faulty_sentence = data.get('faultySentence', '')
        user_answer = data.get('userAnswer', '').strip()
        correct_answer = data.get('correctAnswer', '')
        errors = data.get('errors', [])

        if not user_answer:
            return jsonify({
                'correct': False,
                'feedback': 'Please provide your correction.'
            })

        # Use AI to evaluate the correction
        if ai_service.client:
            try:
                system_prompt = """You are a CEFR C1-level language evaluator for subjunctive and modal correction exercises.

Evaluate if the student's corrected sentence fixes the subjunctive/modal errors and meets C1 requirements:
1. **Present Subjunctive**: Base form "be" after "it is crucial/essential that" (not "is" or "are")
2. **Modals + Base Form**: Modal verbs (should, could, might, must) must be followed by BASE VERB (incorporate, not incorporates)
3. **Second Conditional**: Use "were" (not "was") in if-clauses
4. **Advanced Structures**: "lest" + base form, implied subjunctive

IMPORTANT: The faulty sentence has specific subjunctive/modal errors. Check if the student fixed these errors.
Be flexible with minor wording changes but ensure the core grammatical errors are corrected.

Respond ONLY in JSON format:
{
    "correct": true or false,
    "feedback": "Brief encouraging feedback (1-2 sentences)"
}"""

                user_prompt = f"""
Faulty sentence: "{faulty_sentence}"
Error to fix: {', '.join(errors)}
Expected correction: "{correct_answer}"

Student's correction: "{user_answer}"

Did the student successfully fix the subjunctive/modal error at C1 level?
Return ONLY valid JSON."""

                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=200,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content.strip()

                # Parse JSON
                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                result = json.loads(result_text.strip())

                return jsonify({
                    'correct': result.get('correct', False),
                    'feedback': result.get('feedback', 'Keep practicing!')
                })

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback: Check if main errors are fixed
        user_lower = user_answer.lower().strip()

        # Check specific error fixes
        fixed_subjunctive = 'is balanced' not in user_lower and 'is prioritized' not in user_lower
        fixed_modals = 'incorporates' not in user_lower and 'captivates' not in user_lower and 'remains' not in user_lower
        fixed_conditional = 'was applied' not in user_lower
        has_proper_length = len(user_answer) >= 50

        if fixed_subjunctive and fixed_modals and fixed_conditional and has_proper_length:
            return jsonify({
                'correct': True,
                'feedback': 'Good correction! You fixed the subjunctive/modal errors.'
            })
        else:
            return jsonify({
                'correct': False,
                'feedback': 'Make sure to fix the subjunctive/modal errors: use base forms after modals and "that" clauses.'
            })

    except Exception as e:
        logger.error(f"Error evaluating subjunctive: {e}")
        return jsonify({
            'correct': True,
            'feedback': 'Correction recorded.'
        }), 200
