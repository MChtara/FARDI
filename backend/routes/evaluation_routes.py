"""
AI Evaluation Routes for Phase 2 Writing Tasks
Provides endpoints for evaluating student writing responses using AI
"""
import logging
from flask import Blueprint, request, jsonify, session
from services.ai_service import AIService

logger = logging.getLogger(__name__)

# Create blueprint
evaluation_bp = Blueprint('evaluation', __name__)

# Initialize AI service
ai_service = AIService()


def normalize_text(text):
    """Normalize text for comparison"""
    if not text:
        return ""
    return text.lower().strip().replace(".", "").replace(",", "").replace("!", "").replace("?", "")


@evaluation_bp.route('/evaluate-writing', methods=['POST'])
def evaluate_writing():
    """
    Evaluate a writing response using AI

    Request body:
    {
        "response": "The student's written response",
        "prompt": "The evaluation prompt from the exercise config",
        "context": "Additional context (template, instruction, etc.)",
        "task_type": "The type of task (writing, sentence_expansion, etc.)"
    }

    Returns:
    {
        "is_correct": bool,
        "score": 0-100,
        "feedback": "AI-generated feedback",
        "suggestions": ["improvement suggestions"],
        "detected_level": "A1/A2/B1/B2"
    }
    """
    try:
        data = request.get_json()
        response_text = data.get('response', '').strip()
        eval_prompt = data.get('prompt', '')
        context = data.get('context', '')
        task_type = data.get('task_type', 'writing')

        if not response_text:
            return jsonify({
                'is_correct': False,
                'score': 0,
                'feedback': 'No response provided.',
                'suggestions': ['Please write your response.']
            })

        # For very short responses, don't use AI
        if len(response_text) < 10:
            return jsonify({
                'is_correct': False,
                'score': 20,
                'feedback': 'Your response is too short.',
                'suggestions': ['Please provide a more detailed response.']
            })

        # Build AI evaluation prompt
        system_prompt = """You are a CEFR language assessment expert evaluating student responses.
Evaluate the response based on:
1. Task completion - Did they address what was asked?
2. Language accuracy - Grammar, vocabulary, spelling
3. Coherence - Is the response clear and logical?
4. CEFR level appropriateness

Respond in JSON format:
{
    "is_correct": true/false,
    "score": 0-100,
    "feedback": "brief encouraging feedback",
    "suggestions": ["specific improvement suggestion"],
    "detected_level": "A1/A2/B1/B2"
}"""

        user_prompt = f"""
Task Type: {task_type}
Context/Instructions: {context}
Evaluation Criteria: {eval_prompt}

Student Response:
"{response_text}"

Evaluate this response and provide JSON feedback.
"""

        # Try to get AI evaluation
        if ai_service.client:
            try:
                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    max_tokens=500,
                    temperature=0.3
                )

                result_text = ai_response.choices[0].message.content

                # Parse JSON from response
                import json
                # Try to extract JSON from the response
                try:
                    # Handle markdown code blocks
                    if '```json' in result_text:
                        result_text = result_text.split('```json')[1].split('```')[0]
                    elif '```' in result_text:
                        result_text = result_text.split('```')[1].split('```')[0]

                    result = json.loads(result_text)
                    return jsonify(result)
                except json.JSONDecodeError:
                    # Fallback if JSON parsing fails
                    pass

            except Exception as e:
                logger.error(f"AI evaluation error: {str(e)}")

        # Fallback local evaluation
        return jsonify(evaluate_locally(response_text, context, task_type))

    except Exception as e:
        logger.error(f"Evaluation route error: {str(e)}")
        return jsonify({
            'is_correct': True,
            'score': 70,
            'feedback': 'Response recorded.',
            'suggestions': []
        })


@evaluation_bp.route('/evaluate-batch', methods=['POST'])
def evaluate_batch():
    """
    Evaluate multiple responses in batch
    """
    try:
        data = request.get_json()
        responses = data.get('responses', [])

        results = []
        for resp in responses:
            result = evaluate_locally(
                resp.get('response', ''),
                resp.get('context', ''),
                resp.get('task_type', 'writing')
            )
            results.append(result)

        return jsonify(results)

    except Exception as e:
        logger.error(f"Batch evaluation error: {str(e)}")
        return jsonify([])


@evaluation_bp.route('/validate-gap-fill', methods=['POST'])
def validate_gap_fill():
    """
    Validate a gap-fill answer
    """
    try:
        data = request.get_json()
        user_answer = normalize_text(data.get('user_answer', ''))
        correct_answer = normalize_text(data.get('correct_answer', ''))
        context = data.get('context', '')

        if not user_answer:
            return jsonify({
                'is_correct': False,
                'is_acceptable': False,
                'feedback': 'Please provide an answer.'
            })

        # Exact match
        if user_answer == correct_answer:
            return jsonify({
                'is_correct': True,
                'is_acceptable': True,
                'feedback': 'Correct!'
            })

        # Partial match - check keywords
        correct_words = set(correct_answer.split())
        user_words = set(user_answer.split())
        common_words = correct_words.intersection(user_words)

        if len(common_words) >= len(correct_words) * 0.8:
            return jsonify({
                'is_correct': True,
                'is_acceptable': True,
                'feedback': 'Good answer!'
            })
        elif len(common_words) >= len(correct_words) * 0.5:
            return jsonify({
                'is_correct': False,
                'is_acceptable': True,
                'feedback': 'Close, but not quite.'
            })
        else:
            return jsonify({
                'is_correct': False,
                'is_acceptable': False,
                'feedback': 'Try again.'
            })

    except Exception as e:
        logger.error(f"Gap-fill validation error: {str(e)}")
        return jsonify({
            'is_correct': False,
            'is_acceptable': False,
            'feedback': 'Validation error.'
        })


@evaluation_bp.route('/get-writing-hint', methods=['POST'])
def get_writing_hint():
    """
    Get AI-generated hint for writing tasks
    """
    try:
        data = request.get_json()
        template = data.get('template', '')
        instruction = data.get('instruction', '')
        current_text = data.get('current_text', '')

        # Simple hint generation
        if not current_text:
            hint = f"Start with the key information from the template."
        elif len(current_text) < 20:
            hint = "Try to include more details in your response."
        else:
            hint = "Good progress! Make sure to complete your thought."

        # Try AI-generated hint
        if ai_service.client and template:
            try:
                prompt = f"""
Template: {template}
Instruction: {instruction}
Current text: {current_text}

Provide a brief, encouraging hint (1 sentence) to help complete this writing task.
"""
                ai_response = ai_service.client.chat.completions.create(
                    model=ai_service.model,
                    messages=[
                        {"role": "system", "content": "You are a helpful language learning assistant. Provide brief, encouraging hints."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=100,
                    temperature=0.7
                )
                hint = ai_response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Hint generation error: {str(e)}")

        return jsonify({
            'hint': hint,
            'example_start': ''
        })

    except Exception as e:
        logger.error(f"Get hint error: {str(e)}")
        return jsonify({
            'hint': 'Try to complete the template with relevant details.',
            'example_start': ''
        })


def evaluate_locally(response_text, context, task_type):
    """
    Local fallback evaluation when AI is unavailable
    """
    if not response_text:
        return {
            'is_correct': False,
            'score': 0,
            'feedback': 'No response provided.',
            'suggestions': ['Please write your response.']
        }

    word_count = len(response_text.split())
    char_count = len(response_text)

    # Basic scoring
    score = 50

    # Word count scoring
    if word_count >= 20:
        score += 20
    elif word_count >= 10:
        score += 10

    # Character count scoring
    if char_count >= 100:
        score += 15
    elif char_count >= 50:
        score += 10

    # Check for basic sentence structure
    if response_text.endswith('.') or response_text.endswith('!') or response_text.endswith('?'):
        score += 5

    # Check capitalization
    if response_text[0].isupper():
        score += 5

    # Cap at 100
    score = min(100, score)

    # Generate feedback
    if score >= 80:
        feedback = "Great job! Your response is well-written."
        suggestions = []
    elif score >= 60:
        feedback = "Good effort! You're on the right track."
        suggestions = ["Try adding more detail to your response."]
    else:
        feedback = "Keep practicing! Your response needs more detail."
        suggestions = ["Add more sentences to fully address the task."]

    # Determine level
    if word_count >= 30 and score >= 80:
        level = "B2"
    elif word_count >= 20 and score >= 60:
        level = "B1"
    elif word_count >= 10:
        level = "A2"
    else:
        level = "A1"

    return {
        'is_correct': score >= 50,
        'score': score,
        'feedback': feedback,
        'suggestions': suggestions,
        'detected_level': level
    }
