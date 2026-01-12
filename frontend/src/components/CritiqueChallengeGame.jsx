import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Stack, LinearProgress, Chip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

/**
 * Critique Challenge Game Component
 * Write critiques with advanced terms - challenge levels unlock badges
 * C1 level writing with nuanced analysis
 */

const CritiqueChallengeGame = ({
  questions = [],
  glossaryTerms = [],
  onComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)
  const [badgeLevel, setBadgeLevel] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  const handleAnswerChange = (event) => {
    setCurrentAnswer(event.target.value)
  }

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: currentAnswer,
          level: 'C1',
          task: 'critique',
          criteria: {
            requiresComparison: true,
            requiresNuance: true,
            glossaryTerms: glossaryTerms,
            minTermsRequired: 2
          }
        })
      })

      const result = await response.json()

      const newAnswers = {
        ...answers,
        [currentQuestionIndex]: {
          question: currentQuestion.question,
          answer: currentAnswer,
          evaluation: result,
          isCorrect: result.score === 1
        }
      }
      setAnswers(newAnswers)

      if (result.score === 1) {
        setBadgeLevel(Math.min(badgeLevel + 1, totalQuestions))
      }

      setEvaluationResult(result)

      setTimeout(() => {
        if (currentQuestionIndex + 1 < totalQuestions) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setCurrentAnswer('')
          setEvaluationResult(null)
        } else {
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              answers: newAnswers,
              score: Object.values(newAnswers).filter(a => a.isCorrect).length,
              totalQuestions: totalQuestions,
              badgeLevel: result.score === 1 ? badgeLevel + 1 : badgeLevel,
              completed: true
            })
          }
        }
      }, 2000)

    } catch (error) {
      console.error('Evaluation error:', error)
      setEvaluationResult({ score: 0, feedback: 'Unable to evaluate. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getBadgeName = (level) => {
    if (level >= 8) return 'Master Critic'
    if (level >= 6) return 'Expert Analyst'
    if (level >= 4) return 'Skilled Reviewer'
    if (level >= 2) return 'Novice Critic'
    return 'Beginner'
  }

  if (gameComplete) {
    const correctAnswers = Object.values(answers).filter(a => a.isCorrect).length

    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ color: 'white' }}>
          <EmojiEventsIcon sx={{ fontSize: 100, mb: 2, color: '#ffd700' }} />
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Challenge Complete!
          </Typography>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Score: {correctAnswers} / {totalQuestions}
          </Typography>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Badge Earned: {getBadgeName(badgeLevel)}
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Paper elevation={4} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'white' }}>Badge Level</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#ffd700' }}>
              {badgeLevel}
            </Typography>
          </Box>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={(currentQuestionIndex / totalQuestions) * 100}
          sx={{
            mt: 2,
            height: 10,
            borderRadius: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': { backgroundColor: '#ffd700' }
          }}
        />
      </Paper>

      <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: evaluationResult ? (evaluationResult.score === 1 ? '#e8f5e9' : '#ffebee') : 'white' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: '#000000' }}>
          {currentQuestion?.question}
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={6}
          value={currentAnswer}
          onChange={handleAnswerChange}
          placeholder="Write your critique using advanced marketing terminology..."
          disabled={isSubmitting || evaluationResult !== null}
          InputProps={{ style: { color: '#000000', fontSize: '16px' } }}
          sx={{
            mt: 2,
            mb: 2,
            '& .MuiOutlinedInput-root': { backgroundColor: 'white' },
            '& .MuiInputBase-input': { color: '#000000 !important', WebkitTextFillColor: '#000000 !important' }
          }}
        />

        {evaluationResult && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: evaluationResult.score === 1 ? 'success.light' : 'error.light', borderRadius: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              {evaluationResult.score === 1 ? <CheckCircleIcon sx={{ color: 'success.dark' }} /> : <CancelIcon sx={{ color: 'error.dark' }} />}
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#000000' }}>
                {evaluationResult.score === 1 ? 'Excellent!' : 'Needs Improvement'}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#000000' }}>
              {evaluationResult.feedback}
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!currentAnswer.trim() || isSubmitting || evaluationResult !== null}
            sx={{ px: 4 }}
          >
            {isSubmitting ? 'Evaluating...' : 'Submit Critique'}
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, backgroundColor: 'info.light' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#000000' }} gutterBottom>
          Advanced Terms to Use:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {glossaryTerms.map((term, index) => (
            <Chip key={index} label={term} size="small" sx={{ backgroundColor: 'white', fontWeight: 'bold' }} />
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}

export default CritiqueChallengeGame
