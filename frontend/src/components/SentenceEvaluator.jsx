import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Stack, Alert, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

/**
 * Sentence Evaluator Component
 * Students write a sentence using a target word
 * AI evaluates the sentence and assigns CEFR level (A1-C1) with points (1-5)
 */
const SentenceEvaluator = ({
  targetWord = 'slogan',
  hint = '',
  exampleSentences = {},
  onComplete
}) => {
  const [userSentence, setUserSentence] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!userSentence.trim()) {
      setError('Please write a sentence before submitting.')
      return
    }

    setIsEvaluating(true)
    setError('')

    try {
      // Call backend API to evaluate sentence
      const response = await fetch('/api/evaluate/sentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          sentence: userSentence,
          targetWord: targetWord,
          exampleSentences: exampleSentences
        })
      })

      const data = await response.json()

      if (data.success) {
        setEvaluation(data.evaluation)
        setSubmitted(true)

        // Log level to terminal (not shown to student)
        console.log('Student CEFR Level:', data.evaluation.level)
        console.log('Points Earned:', data.evaluation.score)

        // Call onComplete with result
        if (onComplete) {
          onComplete({
            sentence: userSentence,
            level: data.evaluation.level,
            score: data.evaluation.score,
            feedback: data.evaluation.feedback
          })
        }
      } else {
        setError(data.error || 'Failed to evaluate sentence')
      }
    } catch (err) {
      console.error('Error evaluating sentence:', err)
      setError('An error occurred while evaluating your sentence. Please try again.')
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Instructions */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light' }}>
        <Typography variant="h6" gutterBottom color="primary.dark">
          Write a Sentence Using: "{targetWord}"
        </Typography>
        {hint && (
          <Typography variant="body2" color="text.secondary">
            💡 Hint: {hint}
          </Typography>
        )}
      </Paper>

      {/* Text Input */}
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label={`Your sentence with "${targetWord}"`}
          placeholder={`Write a sentence that uses the word "${targetWord}"...`}
          value={userSentence}
          onChange={(e) => setUserSentence(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!submitted && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={isEvaluating || !userSentence.trim()}
            fullWidth
          >
            {isEvaluating ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                Evaluating...
              </>
            ) : (
              'Submit Sentence'
            )}
          </Button>
        )}
      </Paper>

      {/* Evaluation Results */}
      {evaluation && submitted && (
        <Paper elevation={6} sx={{ p: 4, backgroundColor: 'grey.100' }}>
          <Stack spacing={3}>
            {/* Success Message */}
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 60, mb: 1 }} />
              <Typography variant="h5" gutterBottom color="success.dark">
                Sentence Submitted Successfully!
              </Typography>
            </Box>

            {/* AI Feedback - Darker shade */}
            {evaluation.feedback && (
              <Paper elevation={3} sx={{ p: 3, backgroundColor: 'grey.800' }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'grey.300' }}>
                  Feedback:
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.100', lineHeight: 1.8 }}>
                  {evaluation.feedback}
                </Typography>
              </Paper>
            )}
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

export default SentenceEvaluator
