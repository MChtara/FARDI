/**
 * AI Evaluation Service
 * Handles communication with backend AI evaluation endpoints
 * for writing tasks that require AI-based assessment
 */

const API_BASE = '/api';

/**
 * Evaluate a writing response using AI
 * @param {Object} params - Evaluation parameters
 * @param {string} params.response - The student's written response
 * @param {string} params.prompt - The evaluation prompt from exercise config
 * @param {string} params.context - Additional context (template, instruction, etc.)
 * @param {string} params.taskType - The type of task being evaluated
 * @returns {Promise<Object>} Evaluation result
 */
export async function evaluateWriting({ response, prompt, context, taskType }) {
    try {
        const res = await fetch(`${API_BASE}/evaluate-writing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                response,
                prompt,
                context,
                task_type: taskType
            })
        });

        if (!res.ok) {
            throw new Error(`Evaluation failed: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('AI Evaluation error:', error);
        // Return a fallback evaluation
        return {
            is_correct: response.trim().length > 10,
            score: Math.min(100, response.trim().length * 2),
            feedback: 'Evaluation unavailable. Response recorded.',
            suggestions: []
        };
    }
}

/**
 * Evaluate multiple responses in batch
 * @param {Array<Object>} responses - Array of response objects
 * @returns {Promise<Array<Object>>} Array of evaluation results
 */
export async function evaluateBatch(responses) {
    try {
        const res = await fetch(`${API_BASE}/evaluate-batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses })
        });

        if (!res.ok) {
            throw new Error(`Batch evaluation failed: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Batch evaluation error:', error);
        // Return fallback evaluations
        return responses.map(r => ({
            is_correct: r.response?.trim().length > 10,
            score: Math.min(100, (r.response?.trim().length || 0) * 2),
            feedback: 'Evaluation unavailable. Response recorded.',
            suggestions: []
        }));
    }
}

/**
 * Get AI hint for a writing task
 * @param {Object} params - Hint parameters
 * @param {string} params.template - The writing template
 * @param {string} params.instruction - The task instruction
 * @param {string} params.currentText - What the student has written so far
 * @returns {Promise<Object>} Hint response
 */
export async function getWritingHint({ template, instruction, currentText }) {
    try {
        const res = await fetch(`${API_BASE}/get-writing-hint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                template,
                instruction,
                current_text: currentText
            })
        });

        if (!res.ok) {
            throw new Error(`Hint request failed: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Hint request error:', error);
        return {
            hint: 'Try to include key details from the template.',
            example_start: ''
        };
    }
}

/**
 * Validate a gap-fill answer using AI (for complex responses)
 * @param {Object} params - Validation parameters
 * @param {string} params.userAnswer - The student's answer
 * @param {string} params.correctAnswer - The expected correct answer
 * @param {string} params.context - Surrounding context
 * @returns {Promise<Object>} Validation result
 */
export async function validateGapFill({ userAnswer, correctAnswer, context }) {
    try {
        const res = await fetch(`${API_BASE}/validate-gap-fill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_answer: userAnswer,
                correct_answer: correctAnswer,
                context
            })
        });

        if (!res.ok) {
            throw new Error(`Validation failed: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Gap-fill validation error:', error);
        // Simple fallback validation
        const normalized = (str) => str.toLowerCase().trim().replace(/[.,!?]/g, '');
        return {
            is_correct: normalized(userAnswer) === normalized(correctAnswer),
            is_acceptable: normalized(userAnswer).includes(normalized(correctAnswer).split(' ')[0]),
            feedback: ''
        };
    }
}

/**
 * Local validation helper for simple gap-fill tasks
 * Does not require API call
 */
export function validateGapFillLocal(userAnswer, correctAnswer, strictMode = false) {
    const normalize = (str) => str.toLowerCase().trim().replace(/[.,!?'"]/g, '');
    const userNorm = normalize(userAnswer);
    const correctNorm = normalize(correctAnswer);

    if (strictMode) {
        return {
            is_correct: userNorm === correctNorm,
            is_acceptable: false
        };
    }

    // Check for exact match
    if (userNorm === correctNorm) {
        return { is_correct: true, is_acceptable: true };
    }

    // Check if user answer contains key words from correct answer
    const correctWords = correctNorm.split(/\s+/).filter(w => w.length > 2);
    const matchedWords = correctWords.filter(w => userNorm.includes(w));
    const matchRatio = correctWords.length > 0 ? matchedWords.length / correctWords.length : 0;

    return {
        is_correct: matchRatio >= 0.8,
        is_acceptable: matchRatio >= 0.5
    };
}

export default {
    evaluateWriting,
    evaluateBatch,
    getWritingHint,
    validateGapFill,
    validateGapFillLocal
};
