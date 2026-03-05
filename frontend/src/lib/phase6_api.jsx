/**
 * Phase 6 API Client
 * Handles all API calls for Phase 6: Review & Feedback
 */

import { fetchWithTimeout, handleAPIError, logError } from '../utils/errorHandler.js'

const BASE_URL = '/api/phase6'
const DEFAULT_TIMEOUT = 30000 // 30 seconds

/**
 * Helper function to make API calls with consistent error handling
 */
async function apiCall(url, options = {}, context = '') {
  try {
    const response = await fetchWithTimeout(url, options, DEFAULT_TIMEOUT)

    if (!response.ok) {
      let errorMessage = 'An error occurred'
      try {
        const error = await response.json()
        errorMessage = error.error || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }

      const apiError = handleAPIError(new Error(errorMessage))
      logError(apiError, context || url)
      throw new Error(apiError.message)
    }

    return response.json()
  } catch (error) {
    const apiError = handleAPIError(error)
    logError(apiError, context || url)
    throw new Error(apiError.message)
  }
}

// ============================================================
// Generic Functions (shared across subphases)
// ============================================================

/**
 * Track external game completion (Wordshake, Sushi Spell)
 */
export async function trackGame(step, interaction, gameData, subphase = 1) {
  const { time_played, completed, engagement_score } = gameData
  const endpoint = subphase === 2
    ? `${BASE_URL}/subphase2/step${step}/interaction${interaction}/track`
    : `${BASE_URL}/step${step}/interaction${interaction}/track`

  return apiCall(
    endpoint,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        time_played,
        completed,
        engagement_score
      })
    },
    `trackGame - SubPhase ${subphase}, Step ${step}, Interaction ${interaction}`
  )
}

/**
 * Calculate step total score
 */
export async function calculateStepScore(step, scores, subphase = 1) {
  const endpoint = subphase === 2
    ? `${BASE_URL}/subphase2/step${step}/calculate-score`
    : `${BASE_URL}/step${step}/calculate-score`

  return apiCall(
    endpoint,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(scores)
    },
    `calculateStepScore - SubPhase ${subphase}, Step ${step}`
  )
}

/**
 * Log remedial activity completion
 */
export async function logRemedialActivity(step, level, task, score, maxScore, timeTaken = 0, subphase = 1) {
  const endpoint = subphase === 2
    ? `${BASE_URL}/subphase2/step${step}/remedial/log`
    : `${BASE_URL}/step${step}/remedial/log`

  return apiCall(
    endpoint,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        level,
        task,
        step,
        score,
        max_score: maxScore,
        time_taken: timeTaken,
        completed: true
      })
    },
    `logRemedialActivity - SubPhase ${subphase}, Step ${step}, Level ${level}, Task ${task}`
  )
}

/**
 * Calculate final remedial score
 */
export async function calculateRemedialScore(step, level, taskScores, subphase = 1) {
  const endpoint = subphase === 2
    ? `${BASE_URL}/subphase2/step${step}/remedial/${level}/final-score`
    : `${BASE_URL}/step${step}/remedial/${level}/final-score`

  return apiCall(
    endpoint,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(taskScores)
    },
    `calculateRemedialScore - SubPhase ${subphase}, Step ${step}, Level ${level}`
  )
}

/**
 * Evaluate writing (generic, for any step/interaction)
 */
export async function evaluateWriting(step, interaction, text, context = {}) {
  const response = await fetch(`${BASE_URL}/step${step}/interaction${interaction}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      text,
      ...context
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to evaluate writing')
  }

  return response.json()
}

/**
 * Evaluate error correction (generic)
 */
export async function evaluateCorrection(step, interaction, original, corrected, correctionType) {
  const response = await fetch(`${BASE_URL}/step${step}/interaction${interaction}/evaluate-correction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      original,
      corrected,
      correction_type: correctionType  // 'spelling', 'grammar', 'enhancement'
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to evaluate correction')
  }

  return response.json()
}

// ============================================================
// SubPhase 6.1: Review Writing
// ============================================================

/**
 * SubPhase 6.1 - Step 1 Interaction 2: Evaluate festival reflection
 */
export async function evaluateReflection61(response) {
  return apiCall(
    `${BASE_URL}/step1/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateReflection61'
  )
}

/**
 * SubPhase 6.1 - Step 2 Interaction 2: Explain writing choice
 */
export async function evaluateWritingChoice(response) {
  return apiCall(
    `${BASE_URL}/step2/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateWritingChoice'
  )
}

/**
 * SubPhase 6.1 - Step 3 Interaction 2: Why include both strengths and weaknesses
 */
export async function evaluateBalanceExplanation(response) {
  return apiCall(
    `${BASE_URL}/step3/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateBalanceExplanation'
  )
}

/**
 * SubPhase 6.1 - Step 4 Interaction 2: Write successes and challenges section
 */
export async function evaluateSuccessesChallenges(response) {
  return apiCall(
    `${BASE_URL}/step4/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateSuccessesChallenges'
  )
}

/**
 * SubPhase 6.1 - Step 5 Interaction 2: Grammar correction
 */
export async function evaluateGrammarCorrection(originalText, correctedText) {
  return apiCall(
    `${BASE_URL}/step5/interaction2/evaluate-grammar`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        original_text: originalText,
        corrected_text: correctedText
      })
    },
    'evaluateGrammarCorrection'
  )
}

/**
 * SubPhase 6.1 - Step 5 Interaction 1: Spelling correction
 */
export async function evaluateSpellingCorrection(originalText, correctedText) {
  return apiCall(
    `${BASE_URL}/step5/interaction1/evaluate-spelling`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        original_text: originalText,
        corrected_text: correctedText
      })
    },
    'evaluateSpellingCorrection'
  )
}

/**
 * SubPhase 6.1 - Step 5 Interaction 3: Full improvement/enhancement
 */
export async function evaluateEnhancement61(grammarCorrectedText, enhancedText) {
  return apiCall(
    `${BASE_URL}/step5/interaction3/evaluate-enhancement`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        grammar_corrected_text: grammarCorrectedText,
        enhanced_text: enhancedText
      })
    },
    'evaluateEnhancement61'
  )
}

// ============================================================
// SubPhase 6.2: Feedback
// ============================================================

/**
 * SubPhase 6.2 - Step 1 Interaction 2: Feedback experience
 */
export async function evaluateFeedbackExperience(response) {
  return apiCall(
    `${BASE_URL}/subphase2/step1/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateFeedbackExperience'
  )
}

/**
 * SubPhase 6.2 - Step 2 Interaction 2: Explain feedback choice
 */
export async function evaluateFeedbackChoice(response) {
  return apiCall(
    `${BASE_URL}/subphase2/step2/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateFeedbackChoice'
  )
}

/**
 * SubPhase 6.2 - Step 3 Interaction 2: Why specific is better than general
 */
export async function evaluateSpecificityExplanation(response) {
  return apiCall(
    `${BASE_URL}/subphase2/step3/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateSpecificityExplanation'
  )
}

/**
 * SubPhase 6.2 - Step 4 Interaction 2: Respond to received feedback
 */
export async function evaluateFeedbackResponse(response) {
  return apiCall(
    `${BASE_URL}/subphase2/step4/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateFeedbackResponse'
  )
}

/**
 * SubPhase 6.2 - Step 5 Interaction 2: Fix tone/politeness
 */
export async function evaluateToneCorrection(originalText, correctedText) {
  return apiCall(
    `${BASE_URL}/subphase2/step5/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        original_text: originalText,
        corrected_text: correctedText
      })
    },
    'evaluateToneCorrection'
  )
}

/**
 * SubPhase 6.2 - Step 5 Interaction 1: Fix spelling in feedback
 */
export async function evaluateSpellingSubPhase2(faultyText, correctedText) {
  return apiCall(
    `${BASE_URL}/subphase2/step5/interaction1/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        faulty_text: faultyText,
        corrected_text: correctedText
      })
    },
    'evaluateSpellingSubPhase2'
  )
}

/**
 * SubPhase 6.2 - Step 5 Interaction 3: Restructure feedback
 */
export async function evaluateStructureImprovement(originalText, improvedText) {
  return apiCall(
    `${BASE_URL}/subphase2/step5/interaction3/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        original_text: originalText,
        improved_text: improvedText
      })
    },
    'evaluateStructureImprovement'
  )
}

// ============================================================
// Progression Checks
// ============================================================

/**
 * Check Phase 5 completion (prerequisite for Phase 6)
 */
export async function checkPhase5Completion() {
  return apiCall(
    `${BASE_URL}/check-phase5-completion`,
    {
      method: 'GET',
      credentials: 'include'
    },
    'checkPhase5Completion'
  )
}

/**
 * Check SubPhase 6.1 completion and score
 */
export async function checkSubPhase1Completion() {
  return apiCall(
    `${BASE_URL}/subphase1/check-completion`,
    {
      method: 'GET',
      credentials: 'include'
    },
    'checkSubPhase1Completion'
  )
}

/**
 * Check SubPhase 6.2 completion and score
 */
export async function checkSubPhase2Completion() {
  return apiCall(
    `${BASE_URL}/subphase2/check-completion`,
    {
      method: 'GET',
      credentials: 'include'
    },
    'checkSubPhase2Completion'
  )
}

// ============================================================
// Export
// ============================================================

/**
 * Phase 6 API object with all methods
 */
export const phase6API = {
  // Generic functions
  trackGame,
  calculateStepScore,
  logRemedialActivity,
  calculateRemedialScore,
  evaluateWriting,
  evaluateCorrection,
  // SubPhase 6.1 methods
  evaluateReflection61,
  evaluateWritingChoice,
  evaluateBalanceExplanation,
  evaluateSuccessesChallenges,
  evaluateGrammarCorrection,
  evaluateSpellingCorrection,
  evaluateEnhancement61,
  // SubPhase 6.2 methods
  evaluateFeedbackExperience,
  evaluateFeedbackChoice,
  evaluateSpecificityExplanation,
  evaluateFeedbackResponse,
  evaluateToneCorrection,
  evaluateSpellingSubPhase2,
  evaluateStructureImprovement,
  // Progression checks
  checkPhase5Completion,
  checkSubPhase1Completion,
  checkSubPhase2Completion
}

export default phase6API
