/**
 * Phase 5 API Client
 * Handles all API calls for Phase 5: Execution & Problem-Solving
 */

import { fetchWithTimeout, handleAPIError, logError } from '../utils/errorHandler.js'

const BASE_URL = '/api/phase5'
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
 * Evaluate solution suggestion (Step 1 Interaction 2)
 */
export async function evaluateSolution(response) {
  return apiCall(
    `${BASE_URL}/step1/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateSolution'
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
 * Evaluate writing (for Steps 2-5)
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
 * Evaluate error correction
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
 * Evaluate announcement writing (Step 2 Interaction 1)
 */
export async function evaluateAnnouncement(announcement) {
  return apiCall(
    `${BASE_URL}/step2/interaction1/evaluate-announcement`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ announcement })
    },
    'evaluateAnnouncement'
  )
}

/**
 * Evaluate solution explanation (Step 2 Interaction 2)
 */
export async function evaluateExplanation(explanation) {
  return apiCall(
    `${BASE_URL}/step2/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ explanation })
    },
    'evaluateExplanation'
  )
}

/**
 * Evaluate announcement revision (Step 2 Interaction 3)
 */
export async function evaluateRevision(originalSentence, revisedSentence, newTerm) {
  return apiCall(
    `${BASE_URL}/step2/interaction3/evaluate-revision`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        original_sentence: originalSentence,
        revised_sentence: revisedSentence,
        new_term: newTerm
      })
    },
    'evaluateRevision'
  )
}

/**
 * Evaluate contingency definition (Step 3 Interaction 1)
 */
export async function evaluateDefinition(definition) {
  return apiCall(
    `${BASE_URL}/step3/interaction1/evaluate-definition`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ definition })
    },
    'evaluateDefinition'
  )
}

/**
 * Evaluate transparent communication explanation (Step 3 Interaction 2)
 */
export async function evaluateTransparent(explanation) {
  return apiCall(
    `${BASE_URL}/step3/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ explanation })
    },
    'evaluateTransparent'
  )
}

/**
 * Evaluate term explanation (Step 3 Interaction 3)
 */
export async function evaluateTermExplanation(term, explanation) {
  return apiCall(
    `${BASE_URL}/step3/interaction3/evaluate-term-explanation`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        term,
        explanation
      })
    },
    'evaluateTermExplanation'
  )
}

/**
 * Evaluate social media announcement (Step 4 Interaction 1)
 */
export async function evaluateSocialMedia(announcement) {
  return apiCall(
    `${BASE_URL}/step4/interaction1/evaluate-social-media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ announcement })
    },
    'evaluateSocialMedia'
  )
}

/**
 * Evaluate email writing (Step 4 Interaction 2)
 */
export async function evaluateEmail(subject, emailBody) {
  return apiCall(
    `${BASE_URL}/step4/interaction2/evaluate-email`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        subject,
        email_body: emailBody
      })
    },
    'evaluateEmail'
  )
}

/**
 * Evaluate sentence revision (Step 4 Interaction 3)
 */
export async function evaluateRevisionStep4(originalSentence, revisedSentence, termUsed) {
  return apiCall(
    `${BASE_URL}/step4/interaction3/evaluate-revision`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        original_sentence: originalSentence,
        revised_sentence: revisedSentence,
        term_used: termUsed
      })
    },
    'evaluateRevisionStep4'
  )
}

/**
 * Evaluate spelling corrections (Step 5 Interaction 1)
 */
export async function evaluateSpelling(originalText, correctedText) {
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
    'evaluateSpelling'
  )
}

/**
 * Evaluate grammar corrections (Step 5 Interaction 2)
 */
export async function evaluateGrammar(spellingCorrectedText, grammarCorrectedText) {
  return apiCall(
    `${BASE_URL}/step5/interaction2/evaluate-grammar`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        spelling_corrected_text: spellingCorrectedText,
        grammar_corrected_text: grammarCorrectedText
      })
    },
    'evaluateGrammar'
  )
}

/**
 * Evaluate overall enhancement (Step 5 Interaction 3)
 */
export async function evaluateEnhancement(grammarCorrectedText, enhancedText) {
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
    'evaluateEnhancement'
  )
}

/**
 * SubPhase 2: Evaluate volunteer instructions (Step 1 Interaction 2)
 */
export async function evaluateVolunteerInstructions(response) {
  return apiCall(
    `${BASE_URL}/subphase2/step1/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateVolunteerInstructions'
  )
}

/**
 * SubPhase 2: Evaluate reflection on writing choices (Step 2 Interaction 2)
 */
export async function evaluateReflection(response) {
  return apiCall(
    `${BASE_URL}/subphase2/step2/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateReflection'
  )
}

/**
 * SubPhase 2: Evaluate revision with new term (Step 2 Interaction 3)
 */
export async function evaluateRevisionSubPhase2(original, revised) {
  return apiCall(
    `${BASE_URL}/subphase2/step2/interaction3/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ original, revised })
    },
    'evaluateRevisionSubPhase2'
  )
}

/**
 * SubPhase 2: Evaluate video explanation (Step 3 Interaction 1)
 */
export async function evaluateVideoExplanation(response) {
  return apiCall(
    `${BASE_URL}/subphase2/step3/interaction1/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateVideoExplanation'
  )
}

/**
 * SubPhase 2: Evaluate sequencing words explanation (Step 3 Interaction 2)
 */
export async function evaluateSequencingExplanation(response) {
  return apiCall(
    `${BASE_URL}/subphase2/step3/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateSequencingExplanation'
  )
}

/**
 * SubPhase 2: Evaluate entrance volunteer instructions (Step 4 Interaction 1)
 */
export async function evaluateEntranceInstructions(response) {
  return apiCall(
    `${BASE_URL}/subphase2/step4/interaction1/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateEntranceInstructions'
  )
}

/**
 * SubPhase 2: Evaluate queue manager instructions (Step 4 Interaction 2)
 */
export async function evaluateQueueManagerInstructions(response) {
  return apiCall(
    `${BASE_URL}/subphase2/step4/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ response })
    },
    'evaluateQueueManagerInstructions'
  )
}

/**
 * SubPhase 2: Evaluate revision with Sushi Spell term (Step 4 Interaction 3)
 */
export async function evaluateRevisionStep4SubPhase2(original, revised, time_played, completed) {
  return apiCall(
    `${BASE_URL}/subphase2/step4/interaction3/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ original_text: original, improved_text: revised, time_played, completed })
    },
    'evaluateRevisionStep4SubPhase2'
  )
}

/**
 * SubPhase 2: Evaluate spelling correction (Step 5 Interaction 1)
 */
export async function evaluateSpellingSubPhase2(faultyText, correctedText) {
  return apiCall(
    `${BASE_URL}/subphase2/step5/interaction1/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ faulty_text: faultyText, corrected_text: correctedText })
    },
    'evaluateSpellingSubPhase2'
  )
}

/**
 * SubPhase 2: Evaluate grammar correction (Step 5 Interaction 2)
 */
export async function evaluateGrammarSubPhase2(originalText, correctedText) {
  return apiCall(
    `${BASE_URL}/subphase2/step5/interaction2/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ original_text: originalText, corrected_text: correctedText })
    },
    'evaluateGrammarSubPhase2'
  )
}

/**
 * SubPhase 2: Evaluate full improvement (Step 5 Interaction 3)
 */
export async function evaluateFullImprovement(originalText, improvedText) {
  return apiCall(
    `${BASE_URL}/subphase2/step5/interaction3/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ original_text: originalText, improved_text: improvedText })
    },
    'evaluateFullImprovement'
  )
}

/**
 * Check SubPhase 1 completion and score
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
 * Check SubPhase 2 completion and score
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

/**
 * Phase 5 API object with all methods
 */
export const phase5API = {
  trackGame,
  evaluateSolution,
  calculateStepScore,
  evaluateWriting,
  evaluateCorrection,
  logRemedialActivity,
  calculateRemedialScore,
  evaluateAnnouncement,
  evaluateExplanation,
  evaluateRevision,
  evaluateDefinition,
  evaluateTransparent,
  evaluateTermExplanation,
  evaluateSocialMedia,
  evaluateEmail,
  evaluateRevisionStep4,
  evaluateSpelling,
  evaluateGrammar,
  evaluateEnhancement,
  // SubPhase 2 methods
  evaluateVolunteerInstructions,
  evaluateReflection,
  evaluateRevisionSubPhase2,
  evaluateVideoExplanation,
  evaluateSequencingExplanation,
  evaluateEntranceInstructions,
  evaluateQueueManagerInstructions,
  evaluateRevisionStep4SubPhase2,
  evaluateSpellingSubPhase2,
  evaluateGrammarSubPhase2,
  evaluateFullImprovement,
  // Progression checks
  checkSubPhase1Completion,
  checkSubPhase2Completion
}

export default phase5API
