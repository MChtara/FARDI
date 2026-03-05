"""
Phase 3 API Routes
Sponsorship & Budgeting phase endpoints
"""
from flask import Blueprint, request, jsonify, session
from routes.auth_routes import login_required
import logging

logger = logging.getLogger(__name__)

# Create blueprint
phase3_bp = Blueprint('phase3', __name__, url_prefix='/api/phase3')

@phase3_bp.route('/step/<int:step_id>', methods=['GET'])
@login_required
def get_step(step_id):
    """Get Phase 3 step data"""
    try:
        # TODO: Implement step data loading
        # For now, return basic structure
        return jsonify({
            'success': True,
            'data': {
                'step_id': step_id,
                'title': f'Phase 3 - Step {step_id}: Sponsorship & Budgeting',
                'description': 'Financial planning and sponsorship activities'
            }
        })
    except Exception as e:
        logger.error(f"Error getting Phase 3 step {step_id}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase3_bp.route('/step/<int:step_id>/submit', methods=['POST'])
@login_required
def submit_response(step_id):
    """Submit Phase 3 step response"""
    try:
        user_id = session.get('user_id')
        data = request.json

        # TODO: Implement response submission and AI assessment
        logger.info(f"Phase 3 Step {step_id} submission from user {user_id}")

        return jsonify({
            'success': True,
            'message': 'Response submitted successfully'
        })
    except Exception as e:
        logger.error(f"Error submitting Phase 3 step {step_id} response: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase3_bp.route('/remedial/log', methods=['POST'])
@login_required
def log_remedial_task():
    """
    Log remedial task completion for Phase 3
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
        print(f"PHASE 3 REMEDIAL - LEVEL {level} - TASK {task}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Score: {score}/{max_score} points")
        print(f"Time Taken: {time_taken} seconds")
        print(f"Success Rate: {(score/max_score)*100:.1f}%" if max_score > 0 else "N/A")
        print("="*60 + "\n")

        logger.info(f"Phase 3 Remedial {level} Task {task} - User {user_id}: Score={score}/{max_score}, Time={time_taken}s")

        return jsonify({
            'success': True,
            'message': 'Remedial task logged successfully'
        })

    except Exception as e:
        logger.error(f"Error logging Phase 3 remedial task: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase3_bp.route('/interaction/log', methods=['POST'])
@login_required
def log_interaction():
    """
    Log interaction completion for Phase 3
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        step = data.get('step', 0)
        interaction = data.get('interaction', 0)
        score = data.get('score', 0)
        max_score = data.get('max_score', 0)
        time_taken = data.get('time_taken', 0)
        completed = data.get('completed', False)

        # TERMINAL OUTPUT - Detailed logging
        print("\n" + "="*60)
        print(f"PHASE 3 STEP {step} - INTERACTION {interaction}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Score: {score}/{max_score} points")
        print(f"Time Taken: {time_taken} seconds")
        print(f"Completed: {completed}")
        print(f"Success Rate: {(score/max_score)*100:.1f}%" if max_score > 0 else "N/A")
        print("="*60 + "\n")

        logger.info(f"Phase 3 Step {step} Interaction {interaction} - User {user_id}: Score={score}/{max_score}, Time={time_taken}s")

        return jsonify({
            'success': True,
            'message': 'Interaction logged successfully'
        })

    except Exception as e:
        logger.error(f"Error logging Phase 3 interaction: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase3_bp.route('/interaction/<int:interaction_id>/submit', methods=['POST'])
@login_required
def submit_interaction(interaction_id):
    """
    Submit interaction response for AI assessment
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        user_response = data.get('response', '')
        interaction_type = data.get('type', 'unknown')

        logger.info(f"Phase 3 Interaction {interaction_id} from user {user_id}: {interaction_type}")

        # TODO: Implement AI assessment using services/ai_service.py
        # For now, return mock assessment

        return jsonify({
            'success': True,
            'assessment': {
                'score': 3,  # Mock B1 level
                'level': 'B1',
                'feedback': 'Good use of financial vocabulary!'
            }
        })

    except Exception as e:
        logger.error(f"Error submitting Phase 3 interaction {interaction_id}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase3_bp.route('/remedial/evaluate', methods=['POST'])
@login_required
def evaluate_remedial_answers():
    """
    Evaluate remedial task answers using LLM
    Returns individual feedback and scores for each answer
    """
    try:
        from services.ai_service import AIService

        user_id = session.get('user_id')
        data = request.json

        level = data.get('level', 'A2')
        task = data.get('task', 'A')
        answers = data.get('answers', {})
        prompts = data.get('prompts', {})

        logger.info(f"Evaluating Phase 3 Remedial {level} Task {task} for user {user_id}")

        # Initialize AI service
        ai_service = AIService()

        # Evaluation results
        evaluations = []
        total_score = 0

        # Evaluate each answer
        for answer_id, answer_text in answers.items():
            if not answer_text or len(answer_text.strip()) < 5:
                evaluations.append({
                    'id': answer_id,
                    'score': 0,
                    'feedback': 'Answer too short or empty.',
                    'evaluation': 'Please provide a more complete answer.'
                })
                continue

            # Get the original prompt/sentence for context
            original_prompt = prompts.get(str(answer_id), "Complete the sentence")

            # Create evaluation prompt
            prompt = f"""
You are evaluating a CEFR {level} level English language learning task.

Task: Complete the sentence using "because" to give a reason.

The sentence to complete: "{original_prompt}"

Student wrote: "{answer_text}"

Evaluate this answer based on:
1. Does it provide a logical reason? (grammar doesn't need to be perfect)
2. Is the meaning clear and makes sense?
3. Is it appropriate for {level} level?

Respond ONLY with a JSON object in this exact format:
{{
  "score": 1 or 0 (1 if the answer provides a reasonable explanation, 0 if it doesn't),
  "feedback": "Brief encouraging feedback (1-2 sentences)",
  "evaluation": "Brief explanation of why you gave this score"
}}
"""

            try:
                # Get AI evaluation
                response = ai_service.get_ai_response(prompt)

                # Parse JSON response
                import json
                import re

                # Extract JSON from response (in case there's extra text)
                json_match = re.search(r'\{.*\}', response, re.DOTALL)
                if json_match:
                    evaluation = json.loads(json_match.group())
                    score = int(evaluation.get('score', 0))
                    feedback = evaluation.get('feedback', 'Good effort!')
                    eval_text = evaluation.get('evaluation', '')
                else:
                    # Fallback if JSON parsing fails
                    score = 1 if len(answer_text.strip()) > 10 else 0
                    feedback = "Your answer has been recorded."
                    eval_text = "Unable to parse detailed evaluation."

                total_score += score

                evaluations.append({
                    'id': answer_id,
                    'score': score,
                    'feedback': feedback,
                    'evaluation': eval_text
                })

            except Exception as e:
                logger.error(f"Error evaluating answer {answer_id}: {e}")
                # Fallback scoring
                score = 1 if len(answer_text.strip()) > 10 else 0
                total_score += score
                evaluations.append({
                    'id': answer_id,
                    'score': score,
                    'feedback': 'Your answer has been recorded.',
                    'evaluation': 'Evaluation completed.'
                })

        # Terminal output
        print("\n" + "="*60)
        print(f"PHASE 3 REMEDIAL EVALUATION - LEVEL {level} - TASK {task}")
        print("="*60)
        print(f"User ID: {user_id}")
        print(f"Total Score: {total_score}/{len(answers)}")
        for eval_result in evaluations:
            print(f"\nAnswer {eval_result['id']}: {eval_result['score']}/1")
            print(f"  Feedback: {eval_result['feedback']}")
        print("="*60 + "\n")

        return jsonify({
            'success': True,
            'evaluations': evaluations,
            'total_score': total_score,
            'max_score': len(answers)
        })

    except Exception as e:
        logger.error(f"Error evaluating remedial answers: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase3_bp.route('/step4/evaluate-budget', methods=['POST'])
@login_required
def evaluate_budget():
    """
    Evaluate Step 4 Interaction 1: Budget Creation
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        cost_items = data.get('costItems', [])
        funding_sources = data.get('fundingSources', [])
        justification = data.get('justification', '')

        logger.info(f"Phase 3 Step 4 Budget from user {user_id}: {len(cost_items)} costs, {len(funding_sources)} funding sources")

        # Simple fallback evaluation (frontend has detailed evaluation)
        score = min(len(cost_items), 3) + (1 if len(funding_sources) >= 1 else 0) + (1 if len(justification) > 20 else 0)
        score = min(score, 5)

        level_map = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
        level = level_map.get(score, 'A1')

        return jsonify({
            'success': True,
            'score': score,
            'level': level,
            'feedback': f'Budget evaluation complete at {level} level.'
        })

    except Exception as e:
        logger.error(f"Error evaluating budget: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@phase3_bp.route('/step4/evaluate-pitch', methods=['POST'])
@login_required
def evaluate_pitch():
    """
    Evaluate Step 4 Interaction 2: Sponsor Pitch
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        pitch = data.get('pitch', '')
        sponsor = data.get('sponsor', '')

        logger.info(f"Phase 3 Step 4 Pitch from user {user_id} for sponsor {sponsor}: {len(pitch)} chars")

        # Simple fallback evaluation (frontend has detailed evaluation)
        word_count = len(pitch.split())
        score = 1
        if word_count >= 25:
            score = 2
        if word_count >= 40:
            score = 3
        if 'visibility' in pitch.lower() or 'brand' in pitch.lower():
            score += 1
        score = min(score, 5)

        level_map = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
        level = level_map.get(score, 'A1')

        return jsonify({
            'success': True,
            'score': score,
            'level': level,
            'feedback': f'Sponsor pitch evaluation complete at {level} level.'
        })

    except Exception as e:
        logger.error(f"Error evaluating pitch: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
