"""
Phase 6: Reflection & Evaluation API Routes
Sub-phase 6.1: Writing a Post-Event Report
Sub-phase 6.2: Peer Feedback Discussion
"""

from flask import Blueprint, request, jsonify, session
from routes.auth_routes import login_required
from services.ai_service import AIService
import json
import logging
import sqlite3
import re
import math

# Create blueprint
phase6_bp = Blueprint('phase6', __name__, url_prefix='/api/phase6')

logger = logging.getLogger(__name__)
ai_service = AIService()

# Phase 6 vocabulary
VOCAB_61 = ['success', 'challenge', 'feedback', 'improve', 'achievement',
            'strength', 'weakness', 'recommend', 'summary', 'positive',
            'negative', 'evidence', 'impact', 'lesson', 'report']

VOCAB_62 = ['feedback', 'constructive', 'positive', 'suggestion', 'strength',
            'weakness', 'improve', 'specific', 'actionable', 'polite',
            'balanced', 'empathy', 'helpful', 'sandwich', 'mindset']


def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect('fardi.db')
    conn.row_factory = sqlite3.Row
    return conn


# ============================================================
# SHARED HELPERS
# ============================================================

def _generic_fallback(response, vocabulary, min_level='A2'):
    """Generic fallback keyword-based CEFR evaluation"""
    response_lower = response.lower()
    word_count = len(response.split())
    terms_found = [t for t in vocabulary if t in response_lower]
    has_connector = any(w in response_lower for w in
                        ['because', 'since', 'however', 'therefore', 'so', 'thus', 'although'])
    has_advanced = any(w in response_lower for w in
                       ['demonstrate', 'facilitate', 'implement', 'achieve', 'strategic',
                        'evidence', 'credibility', 'accountability', 'transparency'])

    if word_count <= 8 and len(terms_found) == 0:
        score, level = 1, 'A1'
    elif word_count <= 15 and len(terms_found) >= 1 and not has_connector:
        score, level = 2, 'A2'
    elif word_count <= 30 and len(terms_found) >= 1 and has_connector:
        score, level = 3, 'B1'
    elif word_count <= 60 and len(terms_found) >= 2 and has_connector:
        score, level = 4, 'B2'
    else:
        score, level = 5, 'C1'

    return {
        'score': score,
        'level': level,
        'feedback': f'Your response shows {level} level understanding. '
                    f'{"Good vocabulary use!" if terms_found else "Try using more target vocabulary."}',
        'vocabulary_used': terms_found,
        'strengths': ['Relevant content'] if word_count > 5 else [],
        'improvements': ['Use more vocabulary terms', 'Add connectors like because/however']
                        if len(terms_found) < 2 else []
    }


def _build_game_track_response(user_id, step, interaction, subphase, data, min_time=120):
    """Build standard game track response"""
    time_played = data.get('time_played', 0)
    completed = data.get('completed', False)
    engagement_score = data.get('engagement_score', 0)
    score = 1 if (completed and time_played >= min_time) else 0
    logger.info(f"Phase 6 SP{subphase} Step {step} I{interaction} - User {user_id}: "
                f"Time={time_played}s, Score={score}")
    return jsonify({'success': True, 'data': {
        'time_played': time_played,
        'completed': completed,
        'engagement_score': engagement_score,
        'score': score,
        'message': 'Game completion tracked successfully'
    }})


def _build_score_response(user_id, step, subphase, interaction1_score, interaction2_score, interaction3_score):
    """Build standard calculate-score response"""
    total_score = interaction1_score + interaction2_score + interaction3_score
    level_map = {1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1'}
    remedial_level = level_map.get(interaction2_score, 'A2')
    should_proceed = interaction2_score >= 3

    print(f"\n{'='*60}")
    print(f"PHASE 6 SP{subphase} STEP {step} - SCORING")
    print(f"User: {user_id}  I1={interaction1_score} I2={interaction2_score} I3={interaction3_score}")
    print(f"Total={total_score}/7  Level={remedial_level}  Proceed={should_proceed}")
    print(f"{'='*60}\n")

    return jsonify({'success': True, 'data': {
        'interaction1': {'score': interaction1_score, 'max_score': 1, 'type': 'completion'},
        'interaction2': {'score': interaction2_score, 'max_score': 5, 'level': remedial_level},
        'interaction3': {'score': interaction3_score, 'max_score': 1, 'type': 'completion'},
        'total': {
            'score': total_score,
            'max_score': 7,
            'remedial_level': remedial_level,
            'should_proceed': should_proceed
        }
    }})


def _build_remedial_log_response(data):
    """Build standard remedial log response"""
    return jsonify({'success': True, 'data': {
        'level': data.get('level'),
        'task': data.get('task'),
        'score': data.get('score', 0),
        'max_score': data.get('max_score', 8),
        'logged': True
    }})


def _build_final_score_response(level, task_scores):
    """Build standard remedial final score response"""
    total = sum(task_scores.values())
    level_max = {'A2': 24, 'B1': 24, 'B2': 32, 'C1': 32}
    max_score = level_max.get(level.upper(), 24)
    pass_threshold = math.ceil(max_score * 0.8)
    passed = total >= pass_threshold

    return jsonify({'success': True, 'data': {
        'level': level,
        'total_score': total,
        'max_score': max_score,
        'pass_threshold': pass_threshold,
        'passed': passed,
        'task_scores': task_scores
    }})


def _ai_evaluate(prompt, fallback_fn, response_text):
    """Run AI evaluation with fallback"""
    try:
        ai_resp = ai_service.get_ai_response(prompt)
        match = re.search(r'\{.*\}', ai_resp, re.DOTALL)
        if match:
            return json.loads(match.group())
        return fallback_fn(response_text)
    except Exception as e:
        logger.warning(f"AI evaluation failed, using fallback: {e}")
        return fallback_fn(response_text)


# ============================================================
# SUBPHASE 6.1 - STEP 1: ENGAGE
# ============================================================

@phase6_bp.route('/step1/interaction1/track', methods=['POST'])
@login_required
def track_61_step1_interaction1():
    """Track Wordshake game - Step 1 Interaction 1 (3 min target)"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 1, 1, 1, data, min_time=120)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step1/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_61_step1_interaction2():
    """
    Evaluate festival reflection - Step 1 Interaction 2
    SKANDER: Share 3-5 sentences about one success and one challenge
    Scoring: A2=2, B1=3, B2=4, C1=5
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400

        prompt = f"""
Evaluate this student's festival reflection for CEFR level.

Student Response: "{response}"

Context: Student reflects on the Global Cultures Festival: a success and a challenge (past tense).
Target vocabulary: success, challenge, feedback, improve, achievement, strength, weakness

Scoring:
- A2 (2 pts): Very simple past tense sentences, 1+ vocabulary term
- B1 (3 pts): 3-5 sentences with past tense, basic connectors, 1-2 vocabulary terms
- B2 (4 pts): Detailed reflection with reasons ("because/however"), 2+ vocabulary terms
- C1 (5 pts): Sophisticated reflection with advanced analysis, 3+ vocabulary terms

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_61)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 1 I2 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 1 I2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step1/interaction3/track', methods=['POST'])
@login_required
def track_61_step1_interaction3():
    """Track Sushi Spell game - Step 1 Interaction 3 (2 min target)"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 1, 3, 1, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step1/calculate-score', methods=['POST'])
@login_required
def calculate_61_step1_score():
    """Calculate Phase 6.1 Step 1 total score"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 1, 1, i1, i2, i3)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step1/remedial/log', methods=['POST'])
@login_required
def log_61_step1_remedial():
    """Log remedial task completion - Step 1"""
    try:
        data = request.get_json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step1/remedial/<level>/final-score', methods=['POST'])
@login_required
def final_score_61_step1(level):
    """Calculate remedial final score - Step 1"""
    try:
        data = request.get_json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SUBPHASE 6.1 - STEP 2: EXPLORE
# ============================================================

@phase6_bp.route('/step2/interaction1/track', methods=['POST'])
@login_required
def track_61_step2_interaction1():
    """Track Sushi Spell game - Step 2 Interaction 1"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 2, 1, 1, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step2/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_61_step2_interaction2():
    """
    Evaluate writing choice explanation - Step 2 Interaction 2
    SKANDER: Why did you write your summary that way?
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400

        prompt = f"""
Evaluate this student's explanation of their writing choices for a post-event report summary.

Student Response: "{response}"

Context: Student explains why they organised their summary a certain way (successes first/challenges/recommendations).
Target vocabulary: success, challenge, feedback, positive, recommend, evidence, summary

Scoring:
- A2 (2 pts): Very simple reason ("because good")
- B1 (3 pts): Simple reason with connector ("I wrote successes first because helpful")
- B2 (4 pts): Clear reasoning with report purpose ("balance/credibility/honest")
- C1 (5 pts): Sophisticated meta-reasoning about professional reporting standards

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_61)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 2 I2 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 2 I2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step2/interaction3/track', methods=['POST'])
@login_required
def track_61_step2_interaction3():
    """Track Sushi Spell game - Step 2 Interaction 3"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 2, 3, 1, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step2/calculate-score', methods=['POST'])
@login_required
def calculate_61_step2_score():
    """Calculate Phase 6.1 Step 2 total score"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 2, 1, i1, i2, i3)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step2/remedial/log', methods=['POST'])
@login_required
def log_61_step2_remedial():
    """Log remedial task - Step 2"""
    try:
        data = request.get_json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step2/remedial/<level>/final-score', methods=['POST'])
@login_required
def final_score_61_step2(level):
    """Calculate remedial final score - Step 2"""
    try:
        data = request.get_json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SUBPHASE 6.1 - STEP 3: EXPLAIN
# ============================================================

@phase6_bp.route('/step3/interaction1/track', methods=['POST'])
@login_required
def track_61_step3_interaction1():
    """Track Wordshake game - Step 3 Interaction 1"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 3, 1, 1, data, min_time=120)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step3/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_61_step3_interaction2():
    """
    Evaluate balance explanation - Step 3 Interaction 2
    Lilia: Why include both strengths and weaknesses in the report?
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400

        prompt = f"""
Evaluate this student's explanation of why a balanced post-event report includes both strengths and weaknesses.

Student Response: "{response}"

Context: Student explains why including both successes and challenges builds credibility/trust.
Target vocabulary: strength, weakness, honest, credibility, trust, improve, balance, transparency

Scoring:
- A2 (2 pts): Simple reason ("honest good")
- B1 (3 pts): Basic reason with connector ("because it shows honesty")
- B2 (4 pts): Clear explanation referencing credibility/trust/improvement
- C1 (5 pts): Sophisticated analysis of transparency, accountability, stakeholder trust

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_61)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 3 I2 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 3 I2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step3/interaction3/track', methods=['POST'])
@login_required
def track_61_step3_interaction3():
    """Track Sushi Spell game - Step 3 Interaction 3"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 3, 3, 1, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step3/calculate-score', methods=['POST'])
@login_required
def calculate_61_step3_score():
    """Calculate Phase 6.1 Step 3 total score"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 3, 1, i1, i2, i3)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step3/remedial/log', methods=['POST'])
@login_required
def log_61_step3_remedial():
    """Log remedial task - Step 3"""
    try:
        data = request.get_json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step3/remedial/<level>/final-score', methods=['POST'])
@login_required
def final_score_61_step3(level):
    """Calculate remedial final score - Step 3"""
    try:
        data = request.get_json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SUBPHASE 6.1 - STEP 4: ELABORATE
# ============================================================

@phase6_bp.route('/step4/interaction1/track', methods=['POST'])
@login_required
def track_61_step4_interaction1():
    """Track Sushi Spell game - Step 4 Interaction 1"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 4, 1, 1, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step4/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_61_step4_interaction2():
    """
    Evaluate Successes & Challenges section - Step 4 Interaction 2
    Emna: Write 'Successes & Challenges' section using template
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400

        prompt = f"""
Evaluate this student's 'Successes & Challenges' section of a post-event report.

Student Response: "{response}"

Context: Student writes a structured report section describing 3 successes and 2-3 challenges
from the Global Cultures Festival, with how challenges were handled.

Scoring:
- A2 (2 pts): Very simple list of successes/challenges, basic past tense
- B1 (3 pts): 4-6 sentences covering successes, at least 1 challenge with solution
- B2 (4 pts): 6-10 structured sentences, balanced evaluation, past tense, basic connectors
- C1 (5 pts): Sophisticated section with evidence (numbers/quotes), advanced connectors, formal tone

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_61)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 4 I2 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 4 I2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step4/interaction3/track', methods=['POST'])
@login_required
def track_61_step4_interaction3():
    """Track Sushi Spell game - Step 4 Interaction 3"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 4, 3, 1, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step4/calculate-score', methods=['POST'])
@login_required
def calculate_61_step4_score():
    """Calculate Phase 6.1 Step 4 total score"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 4, 1, i1, i2, i3)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step4/remedial/log', methods=['POST'])
@login_required
def log_61_step4_remedial():
    """Log remedial task - Step 4"""
    try:
        data = request.get_json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step4/remedial/<level>/final-score', methods=['POST'])
@login_required
def final_score_61_step4(level):
    """Calculate remedial final score - Step 4"""
    try:
        data = request.get_json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SUBPHASE 6.1 - STEP 5: EVALUATE
# ============================================================

@phase6_bp.route('/step5/interaction1/evaluate-spelling', methods=['POST'])
@login_required
def evaluate_61_step5_interaction1():
    """
    Evaluate spelling corrections - Step 5 Interaction 1
    Ms. Mabrouki: Correct spelling errors in faulty report
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        original_text = data.get('original_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        if not corrected_text:
            return jsonify({'success': False, 'error': 'Corrected text is required'}), 400

        prompt = f"""
Evaluate this student's spelling corrections in a post-event report excerpt.

Original (with errors): "{original_text}"
Student Corrections: "{corrected_text}"

Scoring based on accuracy of spelling fixes:
- A2 (2 pts): Fixed 1-2 basic spelling errors
- B1 (3 pts): Fixed 3-4 spelling errors correctly
- B2 (4 pts): Fixed 5-6 spelling errors with attention to detail
- C1 (5 pts): Fixed all spelling errors perfectly, no over-corrections

Common errors to look for: succes→success, challange→challenge, feedbak→feedback,
recomend→recommend, sumary→summary, achievment→achievement, evidance→evidence

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"corrections_found": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            # Simple heuristic: count fixed errors
            import re as re_mod
            error_words = ['succes', 'challange', 'feedbak', 'recomend', 'sumary', 'achievment']
            fixed = sum(1 for w in error_words if w not in r.lower())
            if fixed <= 1: score, level = 2, 'A2'
            elif fixed <= 3: score, level = 3, 'B1'
            elif fixed <= 5: score, level = 4, 'B2'
            else: score, level = 5, 'C1'
            return {'score': score, 'level': level,
                    'feedback': f'You fixed {fixed} spelling errors — {level} level.',
                    'corrections_found': [], 'strengths': [], 'improvements': []}

        evaluation = _ai_evaluate(prompt, fallback, corrected_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 5 I1 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'corrections_found': evaluation.get('corrections_found', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 5 I1: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step5/interaction2/evaluate-grammar', methods=['POST'])
@login_required
def evaluate_61_step5_interaction2():
    """
    Evaluate grammar corrections - Step 5 Interaction 2
    Lilia: Fix grammar and tense mistakes
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        original_text = data.get('original_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        if not corrected_text:
            return jsonify({'success': False, 'error': 'Corrected text is required'}), 400

        prompt = f"""
Evaluate this student's grammar/tense corrections in a post-event report.

Original (with grammar errors): "{original_text}"
Student Grammar Corrections: "{corrected_text}"

Scoring based on grammar fix accuracy:
- A2 (2 pts): Fixed basic article/subject-verb errors
- B1 (3 pts): Correct past tense, fixed fragments
- B2 (4 pts): Consistent past tense, correct articles, proper sentence structure
- C1 (5 pts): Perfect grammar, formal register, all tense issues resolved

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            word_count = len(r.split())
            has_past = any(w in r.lower() for w in ['was', 'were', 'came', 'had', 'took', 'fixed'])
            if word_count < 10: score, level = 2, 'A2'
            elif has_past and word_count < 25: score, level = 3, 'B1'
            elif has_past and word_count < 50: score, level = 4, 'B2'
            else: score, level = 5, 'C1'
            return {'score': score, 'level': level,
                    'feedback': f'Grammar correction at {level} level.',
                    'strengths': [], 'improvements': []}

        evaluation = _ai_evaluate(prompt, fallback, corrected_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 5 I2 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 5 I2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step5/interaction3/evaluate-enhancement', methods=['POST'])
@login_required
def evaluate_61_step5_interaction3():
    """
    Evaluate full enhancement - Step 5 Interaction 3
    Ryan: Improve coherence, tone, formality, balance, evidence, recommendations
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        grammar_corrected_text = data.get('grammar_corrected_text', '').strip()
        enhanced_text = data.get('enhanced_text', '').strip()
        if not enhanced_text:
            return jsonify({'success': False, 'error': 'Enhanced text is required'}), 400

        prompt = f"""
Evaluate the quality of this enhanced post-event report compared to its grammar-corrected version.

Grammar-corrected: "{grammar_corrected_text}"
Enhanced version: "{enhanced_text}"

Assess improvements in: coherence, tone/formality, balance (positive+negative), evidence (numbers/quotes),
vocabulary precision, recommendations quality.

Scoring:
- A2 (2 pts): Minor improvement, mostly same content
- B1 (3 pts): Improved formality/vocabulary, added one new element
- B2 (4 pts): Balanced, formal, added connectors and some evidence
- C1 (5 pts): Sophisticated enhancement with evidence, formal tone, specific actionable recommendations

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"improvements_made": [...], "strengths": [...], "suggestions": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_61)

        evaluation = _ai_evaluate(prompt, fallback, enhanced_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.1 Step 5 I3 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'improvements_made': evaluation.get('improvements_made', []),
            'strengths': evaluation.get('strengths', []),
            'suggestions': evaluation.get('suggestions', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.1 Step 5 I3: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step5/calculate-score', methods=['POST'])
@login_required
def calculate_61_step5_score():
    """Calculate Phase 6.1 Step 5 total score"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 5, 1, i1, i2, i3)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step5/remedial/log', methods=['POST'])
@login_required
def log_61_step5_remedial():
    """Log remedial task - Step 5"""
    try:
        data = request.get_json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/step5/remedial/<level>/final-score', methods=['POST'])
@login_required
def final_score_61_step5(level):
    """Calculate remedial final score - Step 5"""
    try:
        data = request.get_json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SUBPHASE 6.1 - COMPLETION CHECK
# ============================================================

@phase6_bp.route('/subphase1/check-completion', methods=['GET'])
@login_required
def check_subphase1_completion():
    """Check if SubPhase 6.1 is complete (all 5 steps, total >= 12 points)"""
    try:
        user_id = session.get('user_id')
        conn = get_db_connection()

        rows = conn.execute(
            'SELECT step_id, total_score FROM phase6_progress WHERE user_id = ? AND subphase = 1',
            (user_id,)
        ).fetchall()
        conn.close()

        completed_steps = {row['step_id']: row['total_score'] for row in rows}
        all_steps_done = all(s in completed_steps for s in range(1, 6))
        total_score = sum(completed_steps.values())
        is_complete = all_steps_done and total_score >= 12

        return jsonify({'success': True, 'data': {
            'is_complete': is_complete,
            'steps_completed': list(completed_steps.keys()),
            'total_score': total_score,
            'min_score_required': 12
        }})
    except Exception as e:
        logger.error(f"Error checking subphase1 completion: {e}")
        # Graceful fallback
        return jsonify({'success': True, 'data': {
            'is_complete': False, 'steps_completed': [], 'total_score': 0, 'min_score_required': 12
        }})


# ============================================================
# PHASE 5 COMPLETION CHECK (prerequisite)
# ============================================================

@phase6_bp.route('/check-phase5-completion', methods=['GET'])
@login_required
def check_phase5_completion():
    """Check if Phase 5 is completed (prerequisite for Phase 6)"""
    try:
        user_id = session.get('user_id')
        conn = get_db_connection()

        # Check phase5_progress for both subphases having 5 steps each
        sp1_rows = conn.execute(
            'SELECT COUNT(*) as cnt FROM phase5_progress WHERE user_id = ? AND subphase = 1',
            (user_id,)
        ).fetchone()
        sp2_rows = conn.execute(
            'SELECT COUNT(*) as cnt FROM phase5_progress WHERE user_id = ? AND subphase = 2',
            (user_id,)
        ).fetchone()
        conn.close()

        sp1_done = sp1_rows['cnt'] >= 5 if sp1_rows else False
        sp2_done = sp2_rows['cnt'] >= 5 if sp2_rows else False
        is_complete = sp1_done and sp2_done

        return jsonify({'success': True, 'data': {
            'is_complete': is_complete,
            'subphase1_done': sp1_done,
            'subphase2_done': sp2_done
        }})
    except Exception as e:
        logger.error(f"Error checking phase5 completion: {e}")
        return jsonify({'success': True, 'data': {
            'is_complete': True  # Graceful: don't block if DB error
        }})


# ============================================================
# SUBPHASE 6.2 - STEP 1: ENGAGE (Peer Feedback)
# ============================================================

@phase6_bp.route('/subphase2/step1/interaction1/track', methods=['POST'])
@login_required
def track_62_step1_interaction1():
    """Track Wordshake game - SP2 Step 1 Interaction 1"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 1, 1, 2, data, min_time=120)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step1/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_62_step1_interaction2():
    """
    Evaluate feedback experience - SP2 Step 1 Interaction 2
    SKANDER: Share experience with receiving/giving feedback (past tense)
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400

        prompt = f"""
Evaluate this student's personal experience with receiving or giving feedback.

Student Response: "{response}"

Context: Student shares a past experience with feedback (school/project/life).
Target vocabulary: feedback, positive, suggestion, improve, helpful, polite, listen

Scoring:
- A2 (2 pts): Very simple past sentences ("Teacher say better. I happy.")
- B1 (3 pts): 3-4 sentences with past tense, basic reasons ("because helpful")
- B2 (4 pts): Detailed experience with feelings and impact, connectors
- C1 (5 pts): Sophisticated reflection on feedback quality, critical analysis

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_62)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 1 I2 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 1 I2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step1/interaction3/track', methods=['POST'])
@login_required
def track_62_step1_interaction3():
    """Track Sushi Spell game - SP2 Step 1 Interaction 3"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 1, 3, 2, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step1/calculate-score', methods=['POST'])
@login_required
def calculate_62_step1_score():
    """Calculate Phase 6.2 Step 1 total score"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 1, 2, i1, i2, i3)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step1/remedial/log', methods=['POST'])
@login_required
def log_62_step1_remedial():
    """Log remedial task - SP2 Step 1"""
    try:
        data = request.get_json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step1/remedial/<level>/final-score', methods=['POST'])
@login_required
def final_score_62_step1(level):
    """Calculate remedial final score - SP2 Step 1"""
    try:
        data = request.get_json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SUBPHASE 6.2 - STEP 2: EXPLORE
# ============================================================

@phase6_bp.route('/subphase2/step2/interaction1/track', methods=['POST'])
@login_required
def track_62_step2_interaction1():
    """Track Sushi Spell game - SP2 Step 2 Interaction 1"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 2, 1, 2, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step2/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_62_step2_interaction2():
    """
    Evaluate feedback choice explanation - SP2 Step 2 Interaction 2
    SKANDER: Why did you write your feedback that way?
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400

        prompt = f"""
Evaluate this student's explanation of why they wrote feedback a certain way.

Student Response: "{response}"

Context: Student explains feedback writing choices (starting positive, using suggestions, etc.)
Target vocabulary: positive, suggestion, constructive, feedback, improve, polite, helpful, because

Scoring:
- A2 (2 pts): Very simple reason ("I say good first because happy")
- B1 (3 pts): Simple reason with connector and basic explanation
- B2 (4 pts): Clear reasoning referencing feedback principles (sandwich technique)
- C1 (5 pts): Sophisticated meta-reasoning about psychological impact of feedback structure

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_62)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 2 I2 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 2 I2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step2/interaction3/track', methods=['POST'])
@login_required
def track_62_step2_interaction3():
    """Track Sushi Spell game - SP2 Step 2 Interaction 3"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 2, 3, 2, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step2/calculate-score', methods=['POST'])
@login_required
def calculate_62_step2_score():
    """Calculate Phase 6.2 Step 2 total score"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 2, 2, i1, i2, i3)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step2/remedial/log', methods=['POST'])
@login_required
def log_62_step2_remedial():
    """Log remedial task - SP2 Step 2"""
    try:
        data = request.get_json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step2/remedial/<level>/final-score', methods=['POST'])
@login_required
def final_score_62_step2(level):
    """Calculate remedial final score - SP2 Step 2"""
    try:
        data = request.get_json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SUBPHASE 6.2 - STEP 3: EXPLAIN
# ============================================================

@phase6_bp.route('/subphase2/step3/interaction1/track', methods=['POST'])
@login_required
def track_62_step3_interaction1():
    """Track Wordshake game - SP2 Step 3 Interaction 1"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 3, 1, 2, data, min_time=120)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step3/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_62_step3_interaction2():
    """
    Evaluate specificity explanation - SP2 Step 3 Interaction 2
    Lilia: Why should feedback be specific (not general)?
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400

        prompt = f"""
Evaluate this student's explanation of why feedback should be specific rather than general.

Student Response: "{response}"

Context: Student explains the importance of specific vs general feedback with an example.
Target vocabulary: specific, actionable, clear, improve, helpful, suggest, example, because

Scoring:
- A2 (2 pts): Simple statement ("specific is better because help")
- B1 (3 pts): Reason with connector and basic example
- B2 (4 pts): Clear explanation referencing "clear action" and providing example
- C1 (5 pts): Sophisticated analysis linking specificity to actionability and evidence-based learning

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_62)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 3 I2 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 3 I2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step3/interaction3/track', methods=['POST'])
@login_required
def track_62_step3_interaction3():
    """Track Sushi Spell game - SP2 Step 3 Interaction 3"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 3, 3, 2, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step3/calculate-score', methods=['POST'])
@login_required
def calculate_62_step3_score():
    """Calculate Phase 6.2 Step 3 total score"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 3, 2, i1, i2, i3)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step3/remedial/log', methods=['POST'])
@login_required
def log_62_step3_remedial():
    """Log remedial task - SP2 Step 3"""
    try:
        data = request.get_json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step3/remedial/<level>/final-score', methods=['POST'])
@login_required
def final_score_62_step3(level):
    """Calculate remedial final score - SP2 Step 3"""
    try:
        data = request.get_json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SUBPHASE 6.2 - STEP 4: ELABORATE
# ============================================================

@phase6_bp.route('/subphase2/step4/interaction1/track', methods=['POST'])
@login_required
def track_62_step4_interaction1():
    """Track Sushi Spell game - SP2 Step 4 Interaction 1"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 4, 1, 2, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step4/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_62_step4_interaction2():
    """
    Evaluate response to received feedback - SP2 Step 4 Interaction 2
    SKANDER: How did feedback make you feel? What will you change?
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        response = data.get('response', '').strip()
        if not response:
            return jsonify({'success': False, 'error': 'Response is required'}), 400

        prompt = f"""
Evaluate this student's response to peer feedback they received.

Student Response: "{response}"

Context: Student responds to feedback received from a classmate about their report,
explaining what they agree with and what they will change.
Target vocabulary: thank, agree, improve, feedback, suggestion, polite, helpful, change

Scoring:
- A2 (2 pts): Very simple ("Thank you. I add words.")
- B1 (3 pts): Polite acknowledgement + one specific change stated
- B2 (4 pts): Reflective response agreeing with reasoning, specific improvement plan
- C1 (5 pts): Sophisticated growth-oriented response with specific actionable revisions

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"vocabulary_used": [...], "strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_62)

        evaluation = _ai_evaluate(prompt, fallback, response)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 4 I2 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'vocabulary_used': evaluation.get('vocabulary_used', []),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 4 I2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step4/interaction3/track', methods=['POST'])
@login_required
def track_62_step4_interaction3():
    """Track Sushi Spell game - SP2 Step 4 Interaction 3"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        return _build_game_track_response(user_id, 4, 3, 2, data, min_time=90)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step4/calculate-score', methods=['POST'])
@login_required
def calculate_62_step4_score():
    """Calculate Phase 6.2 Step 4 total score"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 4, 2, i1, i2, i3)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step4/remedial/log', methods=['POST'])
@login_required
def log_62_step4_remedial():
    """Log remedial task - SP2 Step 4"""
    try:
        data = request.get_json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step4/remedial/<level>/final-score', methods=['POST'])
@login_required
def final_score_62_step4(level):
    """Calculate remedial final score - SP2 Step 4"""
    try:
        data = request.get_json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SUBPHASE 6.2 - STEP 5: EVALUATE
# ============================================================

@phase6_bp.route('/subphase2/step5/interaction1/evaluate', methods=['POST'])
@login_required
def evaluate_62_step5_interaction1():
    """
    Evaluate spelling correction in faulty feedback - SP2 Step 5 Interaction 1
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        faulty_text = data.get('faulty_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        if not corrected_text:
            return jsonify({'success': False, 'error': 'Corrected text is required'}), 400

        prompt = f"""
Evaluate spelling corrections in this feedback text.

Original (faulty): "{faulty_text}"
Student Corrections: "{corrected_text}"

Common feedback spelling errors: feedbak→feedback, sugestion→suggestion,
improv→improve, strenght→strength, weknes→weakness, polight→polite

Scoring by number of correct fixes:
- A2 (2 pts): 1-2 correct fixes
- B1 (3 pts): 3-4 correct fixes
- B2 (4 pts): 5-6 correct fixes
- C1 (5 pts): All errors fixed perfectly

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            errors = ['feedbak', 'sugestion', 'improv', 'strenght', 'weknes', 'polight']
            fixed = sum(1 for e in errors if e not in r.lower())
            if fixed <= 1: score, level = 2, 'A2'
            elif fixed <= 3: score, level = 3, 'B1'
            elif fixed <= 5: score, level = 4, 'B2'
            else: score, level = 5, 'C1'
            return {'score': score, 'level': level,
                    'feedback': f'Fixed {fixed} spelling errors — {level} level.',
                    'strengths': [], 'improvements': []}

        evaluation = _ai_evaluate(prompt, fallback, corrected_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 5 I1 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 5 I1: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step5/interaction2/evaluate', methods=['POST'])
@login_required
def evaluate_62_step5_interaction2():
    """
    Evaluate tone/politeness correction - SP2 Step 5 Interaction 2
    Lilia: Fix tone & politeness (make it kind, not harsh)
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        original_text = data.get('original_text', '').strip()
        corrected_text = data.get('corrected_text', '').strip()
        if not corrected_text:
            return jsonify({'success': False, 'error': 'Corrected text is required'}), 400

        prompt = f"""
Evaluate the tone/politeness improvement in this peer feedback.

Original (harsh/impolite): "{original_text}"
Student Improved Version: "{corrected_text}"

Assess: politeness (please/thank you), softened language (could→could be stronger),
empathy (I think/perhaps/well done), encouraging tone.

Scoring:
- A2 (2 pts): Added "please" or "thank you", minor change
- B1 (3 pts): Softened one harsh phrase, added polite opening/closing
- B2 (4 pts): Overall tone shift from negative to constructive, multiple polite elements
- C1 (5 pts): Sophisticated empathetic tone with encouraging language throughout

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"strengths": [...], "improvements": [...]}}
"""
        def fallback(r):
            polite = ['please', 'thank', 'well done', 'good', 'could', 'perhaps', 'i think']
            polite_count = sum(1 for p in polite if p in r.lower())
            if polite_count <= 1: score, level = 2, 'A2'
            elif polite_count <= 3: score, level = 3, 'B1'
            elif polite_count <= 5: score, level = 4, 'B2'
            else: score, level = 5, 'C1'
            return {'score': score, 'level': level,
                    'feedback': f'Tone improvement at {level} level.',
                    'strengths': [], 'improvements': []}

        evaluation = _ai_evaluate(prompt, fallback, corrected_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 5 I2 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'strengths': evaluation.get('strengths', []),
            'improvements': evaluation.get('improvements', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 5 I2: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step5/interaction3/evaluate', methods=['POST'])
@login_required
def evaluate_62_step5_interaction3():
    """
    Evaluate full feedback restructure - SP2 Step 5 Interaction 3
    Ryan: Restructure into positive sandwich + make specific/actionable
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        original_text = data.get('original_text', '').strip()
        improved_text = data.get('improved_text', '').strip()
        if not improved_text:
            return jsonify({'success': False, 'error': 'Improved text is required'}), 400

        prompt = f"""
Evaluate the quality of this restructured peer feedback.

Original (weak/problematic): "{original_text}"
Student Restructured Version: "{improved_text}"

Assess: positive sandwich structure (positive→suggestion→positive), specificity of suggestion,
actionability, politeness, empathy, overall helpfulness.

Scoring:
- A2 (2 pts): Added simple positive and basic suggestion
- B1 (3 pts): Positive + suggestion + closing positive, somewhat polite
- B2 (4 pts): Full sandwich structure, specific suggestion, balanced and polite
- C1 (5 pts): Sophisticated empathetic feedback with actionable specific suggestions, growth-oriented

Return JSON: {{"score": 2-5, "level": "A2"|"B1"|"B2"|"C1", "feedback": "...",
"improvements_made": [...], "strengths": [...], "suggestions": [...]}}
"""
        def fallback(r):
            return _generic_fallback(r, VOCAB_62)

        evaluation = _ai_evaluate(prompt, fallback, improved_text)
        score = max(2, min(5, evaluation.get('score', 2)))
        level = evaluation.get('level', 'A2')
        logger.info(f"Phase 6.2 Step 5 I3 - User {user_id}: Score={score}, Level={level}")

        return jsonify({'success': True, 'data': {
            'score': score, 'level': level,
            'feedback': evaluation.get('feedback', ''),
            'improvements_made': evaluation.get('improvements_made', []),
            'strengths': evaluation.get('strengths', []),
            'suggestions': evaluation.get('suggestions', [])
        }})
    except Exception as e:
        logger.error(f"Error evaluating 6.2 Step 5 I3: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step5/calculate-score', methods=['POST'])
@login_required
def calculate_62_step5_score():
    """Calculate Phase 6.2 Step 5 total score"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        i1 = data.get('interaction1_score', 0)
        i2 = data.get('interaction2_score', 2)
        i3 = data.get('interaction3_score', 0)
        return _build_score_response(user_id, 5, 2, i1, i2, i3)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step5/remedial/log', methods=['POST'])
@login_required
def log_62_step5_remedial():
    """Log remedial task - SP2 Step 5"""
    try:
        data = request.get_json()
        return _build_remedial_log_response(data)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@phase6_bp.route('/subphase2/step5/remedial/<level>/final-score', methods=['POST'])
@login_required
def final_score_62_step5(level):
    """Calculate remedial final score - SP2 Step 5"""
    try:
        data = request.get_json()
        task_scores = {k: v for k, v in data.items() if k.startswith('task_')}
        return _build_final_score_response(level, task_scores)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# SUBPHASE 6.2 - COMPLETION CHECK
# ============================================================

@phase6_bp.route('/subphase2/check-completion', methods=['GET'])
@login_required
def check_subphase2_completion():
    """Check if SubPhase 6.2 is complete (all 5 steps, total >= 12 points)"""
    try:
        user_id = session.get('user_id')
        conn = get_db_connection()

        rows = conn.execute(
            'SELECT step_id, total_score FROM phase6_progress WHERE user_id = ? AND subphase = 2',
            (user_id,)
        ).fetchall()
        conn.close()

        completed_steps = {row['step_id']: row['total_score'] for row in rows}
        all_steps_done = all(s in completed_steps for s in range(1, 6))
        total_score = sum(completed_steps.values())
        is_complete = all_steps_done and total_score >= 12

        return jsonify({'success': True, 'data': {
            'is_complete': is_complete,
            'steps_completed': list(completed_steps.keys()),
            'total_score': total_score,
            'min_score_required': 12
        }})
    except Exception as e:
        logger.error(f"Error checking subphase2 completion: {e}")
        return jsonify({'success': True, 'data': {
            'is_complete': False, 'steps_completed': [], 'total_score': 0, 'min_score_required': 12
        }})


# ============================================================
# PHASE 6 ROUTING ENDPOINTS - STEP 1, 3, 4, 5
# Following exact pattern from Phase 4 and Phase 5
# ============================================================

# ============================================================
# STEP 1 - CALCULATE SCORE AND ROUTING
# ============================================================

@phase6_bp.route('/step/1/calculate-score', methods=['POST'])
@login_required
def calculate_phase6_step1_score():
    """
    Calculate Phase 6 Step 1 total score and determine remedial level
    Multiple interactions with max 21 points total

    Routing Logic:
    - total < 7 → Remedial A1
    - total < 12 → Remedial A2
    - total < 16 → Remedial B1
    - total < 19 → Remedial B2
    - total >= 19 → Remedial C1
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        # Get scores from all interactions (adjust based on actual interaction structure)
        interaction_scores = []
        total_score = 0

        # Collect all interaction scores dynamically
        for key, value in data.items():
            if key.startswith('interaction') and key.endswith('_score'):
                interaction_scores.append(value)
                total_score += value

        # Determine remedial CEFR level based on TOTAL SCORE thresholds
        if total_score < 7:
            remedial_level = 'A1'
        elif total_score < 12:
            remedial_level = 'A2'
        elif total_score < 16:
            remedial_level = 'B1'
        elif total_score < 19:
            remedial_level = 'B2'
        else:
            remedial_level = 'C1'

        # TERMINAL OUTPUT - SCORES NEVER SHOWN TO USER (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 1 - SCORE CALCULATION (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        for i, score in enumerate(interaction_scores, 1):
            print(f"Interaction {i}: {score} points")
        print(f"Total Score: {total_score}/21")
        print(f"Remedial Level: {remedial_level}")
        print(f"Route: User must complete Remedial {remedial_level}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 1 scoring - User {user_id}: Total={total_score}, Level={remedial_level}")

        return jsonify({
            'success': True,
            'data': {
                'total_score': total_score,
                'max_score': 21,
                'remedial_level': remedial_level,
                'should_proceed': False,
                'next_url': f'/app/phase6/step/1/remedial/{remedial_level.lower()}'
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 1 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 1 - REMEDIAL A1
# ============================================================

@phase6_bp.route('/step/1/remedial/a1/final-score', methods=['POST'])
@login_required
def calculate_step1_a1_final_score():
    """
    Calculate Phase 6 Step 1 Remedial A1 final score
    Total Max: 22 points
    Pass threshold: >= 18/22 (~82%)
    Route to Step 3 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        # Dynamically collect all task scores
        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 22
        threshold = 18
        passed = total_score >= threshold

        # Determine next URL
        next_url = "/app/phase6/step/3" if passed else "/app/phase6/step/1/remedial/a1/retry"

        # TERMINAL OUTPUT - SCORES NEVER SHOWN TO USER (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 1 - REMEDIAL A1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~82%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 1 Remedial A1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 1 A1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 1 - REMEDIAL A2
# ============================================================

@phase6_bp.route('/step/1/remedial/a2/final-score', methods=['POST'])
@login_required
def calculate_step1_a2_final_score():
    """
    Calculate Phase 6 Step 1 Remedial A2 final score
    Total Max: 22 points
    Pass threshold: >= 18/22 (~82%)
    Route to Step 3 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 22
        threshold = 18
        passed = total_score >= threshold

        next_url = "/app/phase6/step/3" if passed else "/app/phase6/step/1/remedial/a2/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 1 - REMEDIAL A2 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~82%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 1 Remedial A2 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 1 A2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 1 - REMEDIAL B1
# ============================================================

@phase6_bp.route('/step/1/remedial/b1/final-score', methods=['POST'])
@login_required
def calculate_step1_b1_final_score():
    """
    Calculate Phase 6 Step 1 Remedial B1 final score
    Total Max: 39 points (required + bonus tasks)
    Pass threshold: >= 22/39 (~56% - only required tasks)
    Route to Step 3 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 39
        threshold = 22
        passed = total_score >= threshold

        next_url = "/app/phase6/step/3" if passed else "/app/phase6/step/1/remedial/b1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 1 - REMEDIAL B1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (required tasks only)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 1 Remedial B1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 1 B1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 1 - REMEDIAL B2
# ============================================================

@phase6_bp.route('/step/1/remedial/b2/final-score', methods=['POST'])
@login_required
def calculate_step1_b2_final_score():
    """
    Calculate Phase 6 Step 1 Remedial B2 final score
    Total Max: 44 points
    Pass threshold: >= 35/44 (~80%)
    Route to Step 3 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 44
        threshold = 35
        passed = total_score >= threshold

        next_url = "/app/phase6/step/3" if passed else "/app/phase6/step/1/remedial/b2/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 1 - REMEDIAL B2 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~80%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 1 Remedial B2 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 1 B2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 1 - REMEDIAL C1
# ============================================================

@phase6_bp.route('/step/1/remedial/c1/final-score', methods=['POST'])
@login_required
def calculate_step1_c1_final_score():
    """
    Calculate Phase 6 Step 1 Remedial C1 final score
    Total Max: 54 points
    Pass threshold: >= 43/54 (~80%)
    Route to Step 3 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 54
        threshold = 43
        passed = total_score >= threshold

        next_url = "/app/phase6/step/3" if passed else "/app/phase6/step/1/remedial/c1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 1 - REMEDIAL C1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~80%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 1 Remedial C1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 1 C1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 3 - CALCULATE SCORE AND ROUTING
# ============================================================

@phase6_bp.route('/step/3/calculate-score', methods=['POST'])
@login_required
def calculate_phase6_step3_score():
    """
    Calculate Phase 6 Step 3 total score and determine remedial level
    3 CEFR interactions (1-5 points each), max 15 total

    Routing Logic:
    - total < 4 → Remedial A1
    - total < 7 → Remedial A2
    - total < 10 → Remedial B1
    - total < 13 → Remedial B2
    - total >= 13 → Remedial C1
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        interaction1_score = data.get('interaction1_score', 1)
        interaction2_score = data.get('interaction2_score', 1)
        interaction3_score = data.get('interaction3_score', 1)

        total_score = interaction1_score + interaction2_score + interaction3_score

        # Determine remedial CEFR level based on TOTAL SCORE thresholds
        if total_score < 4:
            remedial_level = 'A1'
        elif total_score < 7:
            remedial_level = 'A2'
        elif total_score < 10:
            remedial_level = 'B1'
        elif total_score < 13:
            remedial_level = 'B2'
        else:
            remedial_level = 'C1'

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 3 - SCORE CALCULATION (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print(f"Interaction 1: {interaction1_score}/5 points")
        print(f"Interaction 2: {interaction2_score}/5 points")
        print(f"Interaction 3: {interaction3_score}/5 points")
        print(f"Total Score: {total_score}/15")
        print(f"Remedial Level: {remedial_level}")
        print(f"Route: User must complete Remedial {remedial_level}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 3 scoring - User {user_id}: Total={total_score}, Level={remedial_level}")

        return jsonify({
            'success': True,
            'data': {
                'interaction1_score': interaction1_score,
                'interaction2_score': interaction2_score,
                'interaction3_score': interaction3_score,
                'total_score': total_score,
                'max_score': 15,
                'remedial_level': remedial_level,
                'should_proceed': False,
                'next_url': f'/app/phase6/step/3/remedial/{remedial_level.lower()}'
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 3 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 3 - REMEDIAL A1
# ============================================================

@phase6_bp.route('/step/3/remedial/a1/final-score', methods=['POST'])
@login_required
def calculate_step3_a1_final_score():
    """
    Calculate Phase 6 Step 3 Remedial A1 final score
    Total Max: 22 points
    Pass threshold: >= 18/22 (~82%)
    Route to Step 4 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 22
        threshold = 18
        passed = total_score >= threshold

        next_url = "/app/phase6/step/4" if passed else "/app/phase6/step/3/remedial/a1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 3 - REMEDIAL A1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~82%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 3 Remedial A1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 3 A1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 3 - REMEDIAL A2
# ============================================================

@phase6_bp.route('/step/3/remedial/a2/final-score', methods=['POST'])
@login_required
def calculate_step3_a2_final_score():
    """
    Calculate Phase 6 Step 3 Remedial A2 final score
    Total Max: 22 points
    Pass threshold: >= 18/22 (~82%)
    Route to Step 4 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 22
        threshold = 18
        passed = total_score >= threshold

        next_url = "/app/phase6/step/4" if passed else "/app/phase6/step/3/remedial/a2/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 3 - REMEDIAL A2 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~82%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 3 Remedial A2 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 3 A2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 3 - REMEDIAL B1
# ============================================================

@phase6_bp.route('/step/3/remedial/b1/final-score', methods=['POST'])
@login_required
def calculate_step3_b1_final_score():
    """
    Calculate Phase 6 Step 3 Remedial B1 final score
    Total Max: 39 points (required + bonus tasks)
    Pass threshold: >= 22/39 (~56% - only required tasks)
    Route to Step 4 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 39
        threshold = 22
        passed = total_score >= threshold

        next_url = "/app/phase6/step/4" if passed else "/app/phase6/step/3/remedial/b1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 3 - REMEDIAL B1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (required tasks only)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 3 Remedial B1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 3 B1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 3 - REMEDIAL B2
# ============================================================

@phase6_bp.route('/step/3/remedial/b2/final-score', methods=['POST'])
@login_required
def calculate_step3_b2_final_score():
    """
    Calculate Phase 6 Step 3 Remedial B2 final score
    Total Max: 44 points
    Pass threshold: >= 35/44 (~80%)
    Route to Step 4 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 44
        threshold = 35
        passed = total_score >= threshold

        next_url = "/app/phase6/step/4" if passed else "/app/phase6/step/3/remedial/b2/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 3 - REMEDIAL B2 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~80%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 3 Remedial B2 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 3 B2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 3 - REMEDIAL C1
# ============================================================

@phase6_bp.route('/step/3/remedial/c1/final-score', methods=['POST'])
@login_required
def calculate_step3_c1_final_score():
    """
    Calculate Phase 6 Step 3 Remedial C1 final score
    Total Max: 54 points
    Pass threshold: >= 43/54 (~80%)
    Route to Step 4 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 54
        threshold = 43
        passed = total_score >= threshold

        next_url = "/app/phase6/step/4" if passed else "/app/phase6/step/3/remedial/c1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 3 - REMEDIAL C1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~80%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 3 Remedial C1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 3 C1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 4 - CALCULATE SCORE AND ROUTING
# ============================================================

@phase6_bp.route('/step/4/calculate-score', methods=['POST'])
@login_required
def calculate_phase6_step4_score():
    """
    Calculate Phase 6 Step 4 total score and determine remedial level
    3 CEFR interactions (1-5 points each), max 15 total

    Routing Logic:
    - total < 4 → Remedial A1
    - total < 7 → Remedial A2
    - total < 10 → Remedial B1
    - total < 13 → Remedial B2
    - total >= 13 → Remedial C1
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        interaction1_score = data.get('interaction1_score', 1)
        interaction2_score = data.get('interaction2_score', 1)
        interaction3_score = data.get('interaction3_score', 1)

        total_score = interaction1_score + interaction2_score + interaction3_score

        # Determine remedial CEFR level based on TOTAL SCORE thresholds
        if total_score < 4:
            remedial_level = 'A1'
        elif total_score < 7:
            remedial_level = 'A2'
        elif total_score < 10:
            remedial_level = 'B1'
        elif total_score < 13:
            remedial_level = 'B2'
        else:
            remedial_level = 'C1'

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 4 - SCORE CALCULATION (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print(f"Interaction 1: {interaction1_score}/5 points")
        print(f"Interaction 2: {interaction2_score}/5 points")
        print(f"Interaction 3: {interaction3_score}/5 points")
        print(f"Total Score: {total_score}/15")
        print(f"Remedial Level: {remedial_level}")
        print(f"Route: User must complete Remedial {remedial_level}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 4 scoring - User {user_id}: Total={total_score}, Level={remedial_level}")

        return jsonify({
            'success': True,
            'data': {
                'interaction1_score': interaction1_score,
                'interaction2_score': interaction2_score,
                'interaction3_score': interaction3_score,
                'total_score': total_score,
                'max_score': 15,
                'remedial_level': remedial_level,
                'should_proceed': False,
                'next_url': f'/app/phase6/step/4/remedial/{remedial_level.lower()}'
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 4 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 4 - REMEDIAL A1
# ============================================================

@phase6_bp.route('/step/4/remedial/a1/final-score', methods=['POST'])
@login_required
def calculate_step4_a1_final_score():
    """
    Calculate Phase 6 Step 4 Remedial A1 final score
    Total Max: 22 points
    Pass threshold: >= 18/22 (~82%)
    Route to Step 5 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 22
        threshold = 18
        passed = total_score >= threshold

        next_url = "/app/phase6/step/5" if passed else "/app/phase6/step/4/remedial/a1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 4 - REMEDIAL A1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~82%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 4 Remedial A1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 4 A1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 4 - REMEDIAL A2
# ============================================================

@phase6_bp.route('/step/4/remedial/a2/final-score', methods=['POST'])
@login_required
def calculate_step4_a2_final_score():
    """
    Calculate Phase 6 Step 4 Remedial A2 final score
    Total Max: 21 points
    Pass threshold: >= 18/21 (~86%)
    Route to Step 5 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 21
        threshold = 18
        passed = total_score >= threshold

        next_url = "/app/phase6/step/5" if passed else "/app/phase6/step/4/remedial/a2/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 4 - REMEDIAL A2 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~86%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 4 Remedial A2 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 4 A2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 4 - REMEDIAL B1
# ============================================================

@phase6_bp.route('/step/4/remedial/b1/final-score', methods=['POST'])
@login_required
def calculate_step4_b1_final_score():
    """
    Calculate Phase 6 Step 4 Remedial B1 final score
    Total Max: 38 points (required + bonus tasks)
    Pass threshold: >= 22/38 (~58% - only required tasks)
    Route to Step 5 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 38
        threshold = 22
        passed = total_score >= threshold

        next_url = "/app/phase6/step/5" if passed else "/app/phase6/step/4/remedial/b1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 4 - REMEDIAL B1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (required tasks only)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 4 Remedial B1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 4 B1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 4 - REMEDIAL B2
# ============================================================

@phase6_bp.route('/step/4/remedial/b2/final-score', methods=['POST'])
@login_required
def calculate_step4_b2_final_score():
    """
    Calculate Phase 6 Step 4 Remedial B2 final score
    Total Max: 32 points
    Pass threshold: >= 26/32 (~81%)
    Route to Step 5 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 32
        threshold = 26
        passed = total_score >= threshold

        next_url = "/app/phase6/step/5" if passed else "/app/phase6/step/4/remedial/b2/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 4 - REMEDIAL B2 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~81%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 4 Remedial B2 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 4 B2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 4 - REMEDIAL C1
# ============================================================

@phase6_bp.route('/step/4/remedial/c1/final-score', methods=['POST'])
@login_required
def calculate_step4_c1_final_score():
    """
    Calculate Phase 6 Step 4 Remedial C1 final score
    Total Max: 26 points
    Pass threshold: >= 21/26 (~81%)
    Route to Step 5 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 26
        threshold = 21
        passed = total_score >= threshold

        next_url = "/app/phase6/step/5" if passed else "/app/phase6/step/4/remedial/c1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 4 - REMEDIAL C1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~81%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 4 Remedial C1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 4 C1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 5 - CALCULATE SCORE AND ROUTING
# ============================================================

@phase6_bp.route('/step/5/calculate-score', methods=['POST'])
@login_required
def calculate_phase6_step5_score():
    """
    Calculate Phase 6 Step 5 total score and determine remedial level
    3 AI-scored CEFR interactions (1-5 points each), max 15 total

    Routing Logic:
    - total < 4 → Remedial A1
    - total < 7 → Remedial A2
    - total < 10 → Remedial B1
    - total < 13 → Remedial B2
    - total >= 13 → Remedial C1
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        interaction1_score = data.get('interaction1_score', 1)
        interaction2_score = data.get('interaction2_score', 1)
        interaction3_score = data.get('interaction3_score', 1)

        total_score = interaction1_score + interaction2_score + interaction3_score

        # Determine remedial CEFR level based on TOTAL SCORE thresholds
        if total_score < 4:
            remedial_level = 'A1'
        elif total_score < 7:
            remedial_level = 'A2'
        elif total_score < 10:
            remedial_level = 'B1'
        elif total_score < 13:
            remedial_level = 'B2'
        else:
            remedial_level = 'C1'

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 5 - SCORE CALCULATION (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print(f"Interaction 1 (AI-scored): {interaction1_score}/5 points")
        print(f"Interaction 2 (AI-scored): {interaction2_score}/5 points")
        print(f"Interaction 3 (AI-scored): {interaction3_score}/5 points")
        print(f"Total Score: {total_score}/15")
        print(f"Remedial Level: {remedial_level}")
        print(f"Route: User must complete Remedial {remedial_level}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 5 scoring - User {user_id}: Total={total_score}, Level={remedial_level}")

        return jsonify({
            'success': True,
            'data': {
                'interaction1_score': interaction1_score,
                'interaction2_score': interaction2_score,
                'interaction3_score': interaction3_score,
                'total_score': total_score,
                'max_score': 15,
                'remedial_level': remedial_level,
                'should_proceed': False,
                'next_url': f'/app/phase6/step/5/remedial/{remedial_level.lower()}'
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 5 score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 5 - REMEDIAL A1
# ============================================================

@phase6_bp.route('/step/5/remedial/a1/final-score', methods=['POST'])
@login_required
def calculate_step5_a1_final_score():
    """
    Calculate Phase 6 Step 5 Remedial A1 final score
    Total Max: 22 points
    Pass threshold: >= 17/22 (~77%)
    Route to Phase 6_2 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 22
        threshold = 17
        passed = total_score >= threshold

        next_url = "/app/phase6_2" if passed else "/app/phase6/step/5/remedial/a1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 5 - REMEDIAL A1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~77%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 5 Remedial A1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 5 A1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 5 - REMEDIAL A2
# ============================================================

@phase6_bp.route('/step/5/remedial/a2/final-score', methods=['POST'])
@login_required
def calculate_step5_a2_final_score():
    """
    Calculate Phase 6 Step 5 Remedial A2 final score
    Total Max: 22 points
    Pass threshold: >= 18/22 (~82%)
    Route to Phase 6_2 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 22
        threshold = 18
        passed = total_score >= threshold

        next_url = "/app/phase6_2" if passed else "/app/phase6/step/5/remedial/a2/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 5 - REMEDIAL A2 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~82%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 5 Remedial A2 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 5 A2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 5 - REMEDIAL B1
# ============================================================

@phase6_bp.route('/step/5/remedial/b1/final-score', methods=['POST'])
@login_required
def calculate_step5_b1_final_score():
    """
    Calculate Phase 6 Step 5 Remedial B1 final score
    Total Max: 39 points (required + bonus tasks)
    Pass threshold: >= 22/39 (~56% - only required tasks)
    Route to Phase 6_2 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 39
        threshold = 22
        passed = total_score >= threshold

        next_url = "/app/phase6_2" if passed else "/app/phase6/step/5/remedial/b1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 5 - REMEDIAL B1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (required tasks only)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 5 Remedial B1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 5 B1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 5 - REMEDIAL B2
# ============================================================

@phase6_bp.route('/step/5/remedial/b2/final-score', methods=['POST'])
@login_required
def calculate_step5_b2_final_score():
    """
    Calculate Phase 6 Step 5 Remedial B2 final score
    Total Max: 44 points
    Pass threshold: >= 35/44 (~80%)
    Route to Phase 6_2 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 44
        threshold = 35
        passed = total_score >= threshold

        next_url = "/app/phase6_2" if passed else "/app/phase6/step/5/remedial/b2/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 5 - REMEDIAL B2 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~80%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 5 Remedial B2 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 5 B2 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# STEP 5 - REMEDIAL C1
# ============================================================

@phase6_bp.route('/step/5/remedial/c1/final-score', methods=['POST'])
@login_required
def calculate_step5_c1_final_score():
    """
    Calculate Phase 6 Step 5 Remedial C1 final score
    Total Max: 54 points
    Pass threshold: >= 43/54 (~80%)
    Route to Phase 6_2 on pass
    """
    try:
        user_id = session.get('user_id')
        data = request.get_json()

        task_scores = {}
        total_score = 0

        for key, value in data.items():
            if key.startswith('task_'):
                task_scores[key] = value
                total_score += value

        max_score = 54
        threshold = 43
        passed = total_score >= threshold

        next_url = "/app/phase6_2" if passed else "/app/phase6/step/5/remedial/c1/retry"

        # TERMINAL OUTPUT (INTERNAL USE ONLY)
        print("\n" + "="*70)
        print("PHASE 6 STEP 5 - REMEDIAL C1 - FINAL ASSESSMENT (INTERNAL USE ONLY)")
        print("="*70)
        print(f"User ID: {user_id}")
        print("\nTask Breakdown:")
        for task_name, score in task_scores.items():
            print(f"  {task_name}: {score} points")
        print("-"*70)
        print(f"TOTAL SCORE: {total_score}/{max_score}")
        print(f"PASS THRESHOLD: {threshold}/{max_score} (~80%)")
        print(f"RESULT: {'PASSED ✓' if passed else 'FAILED ✗ - RETRY REQUIRED'}")
        print(f"NEXT URL: {next_url}")
        print("="*70 + "\n")

        logger.info(f"Phase 6 Step 5 Remedial C1 - User {user_id}: Total={total_score}, Passed={passed}")

        return jsonify({
            'success': True,
            'data': {
                **task_scores,
                'total_score': total_score,
                'max_score': max_score,
                'passed': passed,
                'pass_threshold': threshold,
                'next_url': next_url
            }
        })

    except Exception as e:
        logger.error(f"Error calculating Phase 6 Step 5 C1 final score: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
