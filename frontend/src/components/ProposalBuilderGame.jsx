import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Stack, LinearProgress, Grid } from '@mui/material'

/**
 * Proposal Builder Game Component
 * Write proposals like puzzle pieces - reveal picture as you complete them
 */

const ProposalBuilderGame = ({ questions = [], onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [completedProposals, setCompletedProposals] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [skippedQuestions, setSkippedQuestions] = useState([])

  const currentQuestion = questions[currentQuestionIndex]
  const revealPercentage = (completedProposals.length / questions.length) * 100

  const handleSkip = () => {
    // Mark as skipped
    setSkippedQuestions([...skippedQuestions, currentQuestionIndex])
    setUserInput('')
    setFeedback('')

    // Move to next question
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Game complete!
      setGameComplete(true)
      if (onComplete) {
        onComplete({
          score: completedProposals.length,
          totalQuestions: questions.length,
          completed: true
        })
      }
    }
  }

  const handleSubmit = () => {
    if (!userInput.trim()) {
      setFeedback('Please write a proposal.')
      return
    }

    const input = userInput.toLowerCase().trim()

    // Check if includes "because" (reason)
    const hasReason = input.includes('because')

    // Check if includes relevant terms (poster, video, slogan, etc.)
    const relevantTerms = ['poster', 'video', 'slogan', 'billboard', 'commercial', 'feature', 'eye-catcher', 'ad']
    const hasRelevantTerm = relevantTerms.some(term => input.includes(term))

    // Check if sentence is substantial (B1 level)
    const wordCount = input.split(/\s+/).length
    const isSubstantial = wordCount >= 5

    if (hasReason && hasRelevantTerm && isSubstantial) {
      // Good proposal!
      const newCompletedProposals = [...completedProposals, {
        question: currentQuestion.question,
        userAnswer: userInput,
        questionIndex: currentQuestionIndex
      }]

      setCompletedProposals(newCompletedProposals)
      setFeedback('')
      setUserInput('')

      // Move to next or complete
      if (currentQuestionIndex + 1 < questions.length) {
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        }, 800)
      } else {
        // Game complete!
        setTimeout(() => {
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              score: completedProposals.length + 1,
              totalQuestions: questions.length,
              completed: true
            })
          }
        }, 1000)
      }
    } else {
      // Give specific feedback
      if (!hasReason) {
        setFeedback('Include "because" to explain your reason.')
      } else if (!hasRelevantTerm) {
        setFeedback('Include promotion terms like poster, video, slogan, etc.')
      } else if (!isSubstantial) {
        setFeedback('Write a more detailed proposal (at least 5 words).')
      }
    }
  }

  if (gameComplete) {
    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', backgroundColor: 'success.light' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="success.dark">
          🎉 Proposal Builder Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          You completed {completedProposals.length} out of {questions.length} proposals!
        </Typography>

        {/* Progress Summary */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            p: 4,
            backgroundColor: 'white',
            borderRadius: 2,
            border: '4px solid',
            borderColor: 'success.dark'
          }}
        >
          <Typography variant="h4" color="success.dark" fontWeight="bold">
            Final Score
          </Typography>
          <Typography variant="h2" color="success.main" sx={{ my: 2 }}>
            {completedProposals.length} / {questions.length}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {skippedQuestions.length} skipped
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
      {/* Progress */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: 'primary.light' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body1" fontWeight="bold" color="primary.dark">
            Proposals: {completedProposals.length} / {questions.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={revealPercentage}
            sx={{ flexGrow: 1, height: 10, borderRadius: 1 }}
          />
          <Typography variant="body2" fontWeight="bold" color="primary.dark">
            {Math.round(revealPercentage)}% Revealed
          </Typography>
        </Stack>
      </Paper>

      {/* Picture Reveal Area */}
      <Paper elevation={4} sx={{ p: 3, mb: 3, backgroundColor: 'grey.100' }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          Proposal Progress
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 400,
            height: 200,
            mx: 'auto',
            backgroundColor: 'grey.300',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Puzzle Pieces Grid */}
          <Grid container sx={{ height: '100%' }}>
            {Array.from({ length: questions.length }).map((_, index) => {
              // Check if this specific question index was completed (not skipped)
              const isCompleted = completedProposals.some(proposal => proposal.questionIndex === index)
              const isSkipped = skippedQuestions.includes(index)

              return (
                <Grid
                  item
                  key={index}
                  xs={questions.length <= 4 ? 6 : 3}
                  sx={{
                    border: '2px solid white',
                    backgroundColor: isCompleted ? 'success.main' : (isSkipped ? 'error.light' : 'grey.400'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.5s'
                  }}
                >
                  {isCompleted && (
                    <Typography sx={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
                      ✓
                    </Typography>
                  )}
                  {isSkipped && (
                    <Typography sx={{ color: 'error.dark', fontSize: '3rem', fontWeight: 'bold' }}>
                      ✕
                    </Typography>
                  )}
                </Grid>
              )
            })}
          </Grid>
        </Box>
        <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }} color="text.secondary">
          Complete proposals to earn checkmarks!
        </Typography>
      </Paper>

      {/* Current Question */}
      <Paper elevation={4} sx={{ p: 3, mb: 3, backgroundColor: 'info.light' }}>
        <Typography variant="h6" gutterBottom color="info.dark">
          Question {currentQuestionIndex + 1} of {questions.length}:
        </Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: 'info.dark' }}>
          {currentQuestion?.question}
        </Typography>
        <Typography variant="body2" color="info.dark" sx={{ fontStyle: 'italic' }}>
          Write a complete proposal sentence explaining your idea and why it would work.
        </Typography>
      </Paper>

      {/* Input Area */}
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          label="Your proposal"
          placeholder="Write your proposal with a reason (use 'because')..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          sx={{ mb: 2 }}
        />

        {feedback && (
          <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
            {feedback}
          </Typography>
        )}

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleSkip}
            size="large"
            sx={{ minWidth: 100 }}
          >
            Skip ✕
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!userInput.trim()}
            size="large"
            fullWidth
          >
            Submit Proposal
          </Button>
        </Stack>
      </Paper>

      {/* Completed Proposals */}
      {completedProposals.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Completed Proposals:
          </Typography>
          <Stack spacing={2}>
            {completedProposals.map((item, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 2,
                  backgroundColor: 'success.light',
                  border: '2px solid',
                  borderColor: 'success.main'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Typography sx={{ color: 'success.dark', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    ✓
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Q{index + 1}: {item.question}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {item.userAnswer}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default ProposalBuilderGame
