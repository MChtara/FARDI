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

@phase3_bp.route('/step/<int:step_id>/calculate-score', methods=['POST'])
@login_required
def calculate_step_score(step_id):
    """
    Calculate Phase 3 score and determine remedial routing.

    🎯 Global Rules:
    - Scores are NOT shown to the user
    - Scores are only displayed in the terminal/logs for monitoring

    🔹 Phase 3 — Step 1
    - interaction 1: each one matched correctly +1 (max 8)
    - interaction 2: each word targeted found +1 (max 8)
    - interaction 3: scored based on CEFR level (A1=1, A2=2, B1=3, B2=4, C1=5)
    - Routing Logic: total_score < 12 → A1, < 18 → A2, < 22 → B1, < 26 → B2, else → C1

    🔹 Phase 3 — Step 2
    - interaction 1: each one matched correctly +1 (max 10)
    - interaction 2: each matched one correctly +1 (max 8)
    - interaction 3: each matched one correctly +1 (max 5)
    - Routing Logic: total_score < 8 → A1, < 13 → A2, < 18 → B1, < 21 → B2, else → C1

    🔹 Phase 3 — Step 3
    - interaction 1: Guided Explanation - each correct selection +1 (max 8)
    - interaction 2: Sentence Transformation - each correct combination +1 (max 5)
    - interaction 3: Justification Practice - CEFR level (A1=1, A2=2, B1=3, B2=4, C1=5)
    - Routing Logic: total_score < 6 → A1, < 11 → A2, < 14 → B1, < 17 → B2, else → C1

    🔹 Phase 3 — Step 4
    - interaction 1: Budget Creation - CEFR level (A1=1, A2=2, B1=3, B2=4, C1=5)
    - interaction 2: Sponsor Pitch - CEFR level (A1=1, A2=2, B1=3, B2=4, C1=5)
    - Routing Logic: total_score < 2 → A1, < 4 → A2, < 6 → B1, < 8 → B2, else → C1
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        interaction1_score = data.get('interaction1_score', 0)
        interaction2_score = data.get('interaction2_score', 0)
        interaction3_score = data.get('interaction3_score', 0)

        total_score = interaction1_score + interaction2_score + interaction3_score

        # Routing Logic based on step_id and total score
        if step_id == 1:
            # Step 1: Max scores are 8, 8, 5 (total 21)
            i1_max, i2_max, i3_max, total_max = 8, 8, 5, 21
            i1_desc = "Matching"
            i2_desc = "Word Finding"
            i3_desc = "CEFR Writing"

            if total_score < 12:
                remedial_level = 'A1'
            elif total_score < 18:
                remedial_level = 'A2'
            elif total_score < 22:
                remedial_level = 'B1'
            elif total_score < 26:
                remedial_level = 'B2'
            else:
                remedial_level = 'C1'

        elif step_id == 2:
            # Step 2: Max scores are 10, 8, 5 (total 23)
            i1_max, i2_max, i3_max, total_max = 10, 8, 5, 23
            i1_desc = "Matching"
            i2_desc = "Matching"
            i3_desc = "Matching"

            if total_score < 8:
                remedial_level = 'A1'
            elif total_score < 13:
                remedial_level = 'A2'
            elif total_score < 18:
                remedial_level = 'B1'
            elif total_score < 21:
                remedial_level = 'B2'
            else:
                remedial_level = 'C1'

        elif step_id == 3:
            # Step 3: Max scores are 8, 5, 5 (total 18)
            i1_max, i2_max, i3_max, total_max = 8, 5, 5, 18
            i1_desc = "Guided Explanation"
            i2_desc = "Sentence Transformation"
            i3_desc = "Justification (CEFR)"

            if total_score < 6:
                remedial_level = 'A1'
            elif total_score < 11:
                remedial_level = 'A2'
            elif total_score < 14:
                remedial_level = 'B1'
            elif total_score < 17:
                remedial_level = 'B2'
            else:
                remedial_level = 'C1'

        elif step_id == 4:
            # Step 4: Max scores are 5, 5, 0 (total 10) - Only 2 interactions
            i1_max, i2_max, i3_max, total_max = 5, 5, 0, 10
            i1_desc = "Budget Creation (CEFR)"
            i2_desc = "Sponsor Pitch (CEFR)"
            i3_desc = "N/A"

            if total_score < 2:
                remedial_level = 'A1'
            elif total_score < 4:
                remedial_level = 'A2'
            elif total_score < 6:
                remedial_level = 'B1'
            elif total_score < 8:
                remedial_level = 'B2'
            else:
                remedial_level = 'C1'
        else:
            # Default to Step 1 routing for other steps
            i1_max, i2_max, i3_max, total_max = 8, 8, 5, 21
            i1_desc = "Task"
            i2_desc = "Task"
            i3_desc = "Task"
            remedial_level = 'A1'

        # Route to remedial
        next_url = f"/app/phase3/step/{step_id}/remedial/{remedial_level.lower()}/task/a"

        # TERMINAL OUTPUT (Scores NOT shown to user)
        print("\n" + "="*70)
        print(f"🎯 PHASE 3 STEP {step_id} - SCORING RESULTS (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print(f"Interaction 1 ({i1_desc}): {interaction1_score}/{i1_max}")
        print(f"Interaction 2 ({i2_desc}): {interaction2_score}/{i2_max}")
        print(f"Interaction 3 ({i3_desc}): {interaction3_score}/{i3_max}")
        print(f"TOTAL SCORE: {total_score}/{total_max}")
        print(f"ROUTING TO: Remedial {remedial_level}")
        print("="*70 + "\n")

        logger.info(f"Phase 3 Step {step_id} - User {user_id}: I1={interaction1_score}/{i1_max}, I2={interaction2_score}/{i2_max}, I3={interaction3_score}/{i3_max}, Total={total_score}/{total_max}, Remedial={remedial_level}")

        return jsonify({
            'success': True,
            'data': {
                'next_url': next_url,
                'remedial_level': remedial_level
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 3 Step {step_id} score: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@phase3_bp.route('/remedial/evaluate', methods=['POST'])
@login_required
def evaluate_remedial():
    """
    Evaluate remedial task completion and determine if user can proceed to next step.

    STEP 1 REMEDIAL:
    🔸 Remedial A1: score >= 6/8 → go to Step 2
    🔸 Remedial A2: score >= 80% → go to Step 2
    🔸 Remedial B1: CEFR score >= 2 → go to Step 2
    🔸 Remedial B2: CEFR score >= 3 → go to Step 2
    🔸 Remedial C1: CEFR score >= 4 → go to Step 2

    STEP 2 REMEDIAL:
    🔸 Remedial A1: score >= 6/8 → go to Step 3
    🔸 Remedial A2: score >= 8/10 → go to Step 3
    🔸 Remedial B1: CEFR score >= 2 → go to Step 3
    🔸 Remedial B2: CEFR score >= 3 → go to Step 3
    🔸 Remedial C1: CEFR score >= 4 → go to Step 3

    STEP 3 REMEDIAL:
    🔸 Remedial A1: Sentence Building - score >= 3/5 → go to Step 4
    🔸 Remedial A2: Gap Fill - score >= 8/10 → go to Step 4
    🔸 Remedial B1: Short Justification - CEFR score >= 2 → go to Step 4
    🔸 Remedial B2: Structured Explanation - CEFR score >= 3 → go to Step 4
    🔸 Remedial C1: Financial Rationale - CEFR score >= 4 → go to Step 4

    STEP 4 REMEDIAL:
    🔸 Remedial A1: Fill-in Budget Template - score >= 3/4 → go to Phase 4
    🔸 Remedial A2: Sentence Completers - score >= 4/5 → go to Phase 4
    🔸 Remedial B1: Budget + Justification - score >= 4/6 → go to Phase 4
    🔸 Remedial B2: Draft → Revision - score >= 6/8 → go to Phase 4
    🔸 Remedial C1: Strategic Proposal - score >= 9/12 → go to Phase 4
    """
    try:
        user_id = session.get('user_id')
        data = request.json

        level = data.get('level', '').upper()
        step_id = data.get('step_id', 1)
        remedial_score = data.get('score', 0)
        max_score = data.get('max_score', 0)

        # Determine if user can proceed based on remedial level and step
        can_proceed = False
        threshold = 0

        if step_id == 1:
            # STEP 1 REMEDIAL CONDITIONS
            if level == 'A1':
                # A1: Need 6/8 to proceed
                threshold = 6
                can_proceed = remedial_score >= threshold
            elif level == 'A2':
                # A2: Need 80% to proceed
                threshold_percent = 80
                actual_percent = (remedial_score / max_score * 100) if max_score > 0 else 0
                can_proceed = actual_percent >= threshold_percent
            elif level == 'B1':
                # B1: Need CEFR score >= 2 (A2 level)
                threshold = 2
                can_proceed = remedial_score >= threshold
            elif level == 'B2':
                # B2: Need CEFR score >= 3 (B1 level)
                threshold = 3
                can_proceed = remedial_score >= threshold
            elif level == 'C1':
                # C1: Need CEFR score >= 4 (B2 level)
                threshold = 4
                can_proceed = remedial_score >= threshold

            next_step = 2

        elif step_id == 2:
            # STEP 2 REMEDIAL CONDITIONS
            if level == 'A1':
                # A1: Need 6/8 to proceed
                threshold = 6
                can_proceed = remedial_score >= threshold
            elif level == 'A2':
                # A2: Need 8/10 to proceed
                threshold = 8
                can_proceed = remedial_score >= threshold
            elif level == 'B1':
                # B1: Need CEFR score >= 2 (A2 level)
                threshold = 2
                can_proceed = remedial_score >= threshold
            elif level == 'B2':
                # B2: Need CEFR score >= 3 (B1 level)
                threshold = 3
                can_proceed = remedial_score >= threshold
            elif level == 'C1':
                # C1: Need CEFR score >= 4 (B2 level)
                threshold = 4
                can_proceed = remedial_score >= threshold

            next_step = 3

        elif step_id == 3:
            # STEP 3 REMEDIAL CONDITIONS
            if level == 'A1':
                # A1: Sentence Building - Need 3/5 to proceed
                threshold = 3
                can_proceed = remedial_score >= threshold
            elif level == 'A2':
                # A2: Gap Fill - Need 8/10 to proceed
                threshold = 8
                can_proceed = remedial_score >= threshold
            elif level == 'B1':
                # B1: Short Justification - Need CEFR score >= 2 (A2 level)
                threshold = 2
                can_proceed = remedial_score >= threshold
            elif level == 'B2':
                # B2: Structured Explanation - Need CEFR score >= 3 (B1 level)
                threshold = 3
                can_proceed = remedial_score >= threshold
            elif level == 'C1':
                # C1: Financial Rationale - Need CEFR score >= 4 (B2 level)
                threshold = 4
                can_proceed = remedial_score >= threshold

            next_step = 4

        elif step_id == 4:
            # STEP 4 REMEDIAL CONDITIONS
            if level == 'A1':
                # A1: Fill-in Budget Template - Need 3/4 to proceed
                threshold = 3
                can_proceed = remedial_score >= threshold
            elif level == 'A2':
                # A2: Sentence Completers - Need 4/5 to proceed
                threshold = 4
                can_proceed = remedial_score >= threshold
            elif level == 'B1':
                # B1: Budget + Justification - Need 4/6 to proceed
                threshold = 4
                can_proceed = remedial_score >= threshold
            elif level == 'B2':
                # B2: Draft → Revision - Need 6/8 to proceed
                threshold = 6
                can_proceed = remedial_score >= threshold
            elif level == 'C1':
                # C1: Strategic Proposal - Need 9/12 to proceed
                threshold = 9
                can_proceed = remedial_score >= threshold

            next_step = 'phase4'  # Move to Phase 4
        else:
            # Default for other steps
            next_step = step_id + 1

        # Determine next URL
        if can_proceed:
            if next_step == 'phase4':
                next_url = "/app/phase4/step/1"
            else:
                next_url = f"/app/phase3/step/{next_step}"
        else:
            # Stay in remedial or retry
            next_url = f"/app/phase3/step/{step_id}/remedial/{level.lower()}/retry"

        # TERMINAL OUTPUT (Scores NOT shown to user)
        print("\n" + "="*70)
        print(f"🔸 PHASE 3 STEP {step_id} REMEDIAL {level} - EVALUATION (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print(f"Remedial Score: {remedial_score}/{max_score}")

        if step_id == 1 and level == 'A2':
            actual_percent = (remedial_score / max_score * 100) if max_score > 0 else 0
            print(f"Success Rate: {actual_percent:.1f}% (Required: 80%)")
        else:
            print(f"Threshold: {threshold}")

        if can_proceed:
            if next_step == 'phase4':
                print(f"CAN PROCEED: ✓ YES - Moving to Phase 4")
            else:
                print(f"CAN PROCEED: ✓ YES - Moving to Step {next_step}")
        else:
            print(f"CAN PROCEED: ✗ NO - Remedial required")
        print("="*70 + "\n")

        logger.info(f"Phase 3 Step {step_id} Remedial {level} - User {user_id}: Score={remedial_score}/{max_score}, CanProceed={can_proceed}, NextStep={next_step if can_proceed else 'Retry'}")

        return jsonify({
            'success': True,
            'data': {
                'can_proceed': can_proceed,
                'next_url': next_url,
                'level': level,
                'next_step': next_step if can_proceed else None
            }
        })

    except Exception as e:
        logger.error(f"Error evaluating Phase 3 remedial: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

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

        # TERMINAL OUTPUT - Detailed logging (Scores NOT shown to user)
        print("\n" + "="*70)
        print(f"📝 PHASE 3 REMEDIAL - LEVEL {level} - TASK {task} (INTERNAL)")
        print("="*70)
        print(f"User ID: {user_id}")
        print(f"Score: {score}/{max_score} points")
        print(f"Time Taken: {time_taken} seconds")
        print(f"Success Rate: {(score/max_score)*100:.1f}%" if max_score > 0 else "N/A")
        print("="*70 + "\n")

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
    🎯 Scores are NOT shown to the user - only logged in terminal
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

        # TERMINAL OUTPUT - Detailed logging (Scores NOT shown to user)
        print("\n" + "="*70)
        print(f"📊 PHASE 3 STEP {step} - INTERACTION {interaction} (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print(f"Score: {score}/{max_score} points")
        print(f"Time Taken: {time_taken} seconds")
        print(f"Completed: {completed}")
        print(f"Success Rate: {(score/max_score)*100:.1f}%" if max_score > 0 else "N/A")
        print("="*70 + "\n")

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

        # TERMINAL OUTPUT (Scores NOT shown to user)
        print("\n" + "="*70)
        print(f"📝 PHASE 3 REMEDIAL EVALUATION - LEVEL {level} - TASK {task} (INTERNAL)")
        print("="*70)
        print(f"User ID: {user_id}")
        print(f"Total Score: {total_score}/{len(answers)}")
        for eval_result in evaluations:
            print(f"\nAnswer {eval_result['id']}: {eval_result['score']}/1")
            print(f"  Feedback: {eval_result['feedback']}")
        print("="*70 + "\n")

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
