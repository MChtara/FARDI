import React, { useState } from 'react'
import { Box, Typography, Paper, Button, TextField, LinearProgress, Stack } from '@mui/material'
import { CheckCircle, Close } from '@mui/icons-material'

const PhraseExpander = ({ templates, answers, onChange }) => {
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [currentInput, setCurrentInput] = useState('')
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  if (!templates || templates.length === 0) return null

  const totalPhrases = templates.length
  const canProceed = currentInput.trim().length > 3

  const handleNext = () => {
    if (!canProceed) return

    const key = `w_${currentPhrase}`
    onChange(key, currentInput)

    // Simple validation - just check if they filled something
    const isValid = currentInput.trim().length > 3
    setIsCorrect(isValid)
    setShowingFeedback(true)

    if (navigator.vibrate) {
      if (isValid) {
        navigator.vibrate([100, 50, 100])
      }
    }

    const isLastPhrase = currentPhrase >= totalPhrases - 1

    setTimeout(() => {
      setShowingFeedback(false)
      if (!isLastPhrase) {
        setCurrentPhrase(currentPhrase + 1)
        setCurrentInput('')
      }
    }, 1500)
  }

  const progress = ((currentPhrase + (showingFeedback ? 1 : 0)) / totalPhrases) * 100
  const isComplete = currentPhrase >= totalPhrases - 1 && showingFeedback

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', py: 4, px: 2 }}>
      {/* Progress Bar */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Sentence Expansion
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 2, maxWidth: 400, mx: 'auto' }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {Math.min(currentPhrase + (showingFeedback ? 1 : 0), totalPhrases)} / {totalPhrases} Complete
        </Typography>
      </Box>

      {/* Feedback Display */}
      {showingFeedback && (
        <Paper
          elevation={12}
          sx={{
            p: 4,
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: isCorrect ? 'success.light' : 'warning.light',
            animation: 'slideDown 0.5s ease-out',
            '@keyframes slideDown': {
              from: { opacity: 0, transform: 'translateY(-50px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          {isCorrect ? (
            <>
              <CheckCircle sx={{
                color: 'success.main',
                fontSize: 80,
                mb: 2,
                animation: 'popIn 0.6s ease-out'
              }} />
              <Typography variant="h5" fontWeight="bold" color="success.dark">
                Great! Moving to next phrase
              </Typography>
            </>
          ) : (
            <>
              <Close sx={{
                color: 'warning.main',
                fontSize: 80,
                mb: 2,
                animation: 'shake 0.5s ease-out'
              }} />
              <Typography variant="h5" fontWeight="bold" color="warning.dark">
                Please write more
              </Typography>
            </>
          )}
        </Paper>
      )}

      {/* Current Phrase Input */}
      {!showingFeedback && (
        <Paper sx={{ p: 4, bgcolor: 'background.paper', border: '2px solid', borderColor: 'primary.main' }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Phrase {currentPhrase + 1} of {totalPhrases}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
                {templates[currentPhrase].replace(/_+/g, '________')}
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Rewrite this phrase here..."
              variant="outlined"
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  bgcolor: 'background.paper'
                }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color={canProceed ? 'success.main' : 'text.secondary'}>
                {currentInput.trim().length} characters {canProceed ? '✓' : '(min 3)'}
              </Typography>
              <Button
                variant="contained"
                size="large"
                disabled={!canProceed}
                onClick={handleNext}
                sx={{ minWidth: 200, py: 1.5 }}
              >
                {currentPhrase >= totalPhrases - 1 ? 'Finish' : 'Next Phrase'} →
              </Button>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Completion Message */}
      {isComplete && (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'success.light', mt: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold" color="success.dark">
            All Phrases Complete!
          </Typography>
          <Typography variant="body1">
            Click Submit below to continue.
          </Typography>
        </Paper>
      )}

      <style>
        {`
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              transform: scale(1.15);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-15px) rotate(-5deg); }
            75% { transform: translateX(15px) rotate(5deg); }
          }
        `}
      </style>
    </Box>
  )
}

export default PhraseExpander
