/**
 * Error Handler Utility for Phase 5
 * Provides consistent error handling and user-friendly error messages
 */

/**
 * Parse and format API errors
 */
export function handleAPIError(error) {
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return {
        message: 'Network connection error. Please check your internet connection and try again.',
        type: 'network',
        retryable: true
      }
    }
    
    // Timeout errors
    if (error.message.includes('timeout') || error.message.includes('aborted')) {
      return {
        message: 'Request timed out. Please try again.',
        type: 'timeout',
        retryable: true
      }
    }
    
    // API errors
    if (error.message.includes('Failed to') || error.message.includes('error')) {
      return {
        message: error.message || 'An error occurred. Please try again.',
        type: 'api',
        retryable: true
      }
    }
    
    // Generic error
    return {
      message: error.message || 'An unexpected error occurred. Please try again.',
      type: 'unknown',
      retryable: true
    }
  }
  
  // String errors
  if (typeof error === 'string') {
    return {
      message: error,
      type: 'string',
      retryable: false
    }
  }
  
  // Default
  return {
    message: 'An unexpected error occurred. Please try again.',
    type: 'unknown',
    retryable: true
  }
}

/**
 * Validate text input
 */
export function validateTextInput(text, minLength = 1, maxLength = 10000) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Please enter some text.' }
  }
  
  const trimmed = text.trim()
  
  if (trimmed.length < minLength) {
    return { 
      valid: false, 
      error: `Please enter at least ${minLength} character${minLength !== 1 ? 's' : ''}.` 
    }
  }
  
  if (trimmed.length > maxLength) {
    return { 
      valid: false, 
      error: `Text is too long. Maximum ${maxLength} characters allowed.` 
    }
  }
  
  return { valid: true, error: null }
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Please enter an email address.' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address.' }
  }
  
  return { valid: true, error: null }
}

/**
 * Create a timeout promise
 */
export function createTimeoutPromise(timeoutMs = 30000) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'))
    }, timeoutMs)
  })
}

/**
 * Fetch with timeout
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

/**
 * Log error for debugging (in development)
 */
export function logError(error, context = '') {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Phase 5 Error${context ? ` - ${context}` : ''}]:`, error)
  }
  // In production, you might want to send to error tracking service
}
