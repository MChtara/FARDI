import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Stack, LinearProgress, Card, CardContent, Chip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import StarIcon from '@mui/icons-material/Star'
import LockIcon from '@mui/icons-material/Lock'

/**
 * Compare Quest Game Component
 * Writing task with guided questions - each strong comparison unlocks an advanced vocabulary level
 * Students answer questions to build a complete comparison paragraph
 */

const CompareQuestGame = ({
  questions = [],
  glossaryTerms = [],
  onComplete,
  evaluationCriteria = {}
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [skippedQuestions, setSkippedQuestions] = useState(new Set())
  const [vocabularyLevel, setVocabularyLevel] = useState(1)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.keys(answers).length
  const totalQuestions = questions.length
  const maxLevel = totalQuestions

  const handleAnswerChange = (event) => {
    setCurrentAnswer(event.target.value)
  }

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) return

    setIsSubmitting(true)

    try {
      // Submit answer for LLM evaluation
      const response = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: currentAnswer,
          level: 'B2',
          task: 'comparison',
          criteria: {
            requiresComparison: true,
            glossaryTerms: glossaryTerms,
            minTermsRequired: 1
          }
        })
      })

      const result = await response.json()

      setEvaluationResult(result)

      // If correct (score === 1), save answer and move to next
      if (result.score === 1) {
        // Store correct answer
        const newAnswers = {
          ...answers,
          [currentQuestionIndex]: {
            question: currentQuestion.question,
            answer: currentAnswer,
            evaluation: result,
            isCorrect: true
          }
        }
        setAnswers(newAnswers)

        // Level up
        setVocabularyLevel(Math.min(vocabularyLevel + 1, maxLevel))

        // Move to next question after showing feedback
        setTimeout(() => {
          if (currentQuestionIndex + 1 < totalQuestions) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setCurrentAnswer('')
            setEvaluationResult(null)
          } else {
            // All questions answered - complete game
            completeGame(newAnswers)
          }
        }, 2000)
      }
      // If incorrect (score === 0), show feedback but allow retry or skip
      // Don't auto-advance - user must choose to retry or skip

    } catch (error) {
      console.error('Evaluation error:', error)
      setEvaluationResult({
        score: 0,
        feedback: 'Unable to evaluate answer. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    // Clear evaluation result to allow editing and resubmission
    setEvaluationResult(null)
    // Keep the current answer so user can edit it
  }

  const handleSkip = () => {
    // If there was an incorrect answer, save it with score 0
    if (evaluationResult && evaluationResult.score === 0) {
      const newAnswers = {
        ...answers,
        [currentQuestionIndex]: {
          question: currentQuestion.question,
          answer: currentAnswer,
          evaluation: evaluationResult,
          isCorrect: false
        }
      }
      setAnswers(newAnswers)
    }

    // Mark as skipped
    const newSkipped = new Set(skippedQuestions)
    newSkipped.add(currentQuestionIndex)
    setSkippedQuestions(newSkipped)

    // Move to next question
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentAnswer('')
      setEvaluationResult(null)
    } else {
      // All questions processed - complete game
      const finalAnswers = evaluationResult && evaluationResult.score === 0
        ? {
            ...answers,
            [currentQuestionIndex]: {
              question: currentQuestion.question,
              answer: currentAnswer,
              evaluation: evaluationResult,
              isCorrect: false
            }
          }
        : answers
      completeGame(finalAnswers)
    }
  }

  const completeGame = (finalAnswers) => {
    const answeredQuestions = Object.values(finalAnswers)
    const correctAnswers = answeredQuestions.filter(a => a.isCorrect).length
    const finalLevel = vocabularyLevel
    const skippedCount = skippedQuestions.size

    setGameComplete(true)

    if (onComplete) {
      onComplete({
        answers: finalAnswers,
        score: correctAnswers,
        totalQuestions: totalQuestions,
        skipped: skippedCount,
        vocabularyLevel: finalLevel,
        completed: true
      })
    }
  }

  if (gameComplete) {
    const answeredQuestions = Object.values(answers)
    const correctAnswers = answeredQuestions.filter(a => a.isCorrect).length

    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ color: 'white' }}>
          <StarIcon sx={{ fontSize: 80, mb: 2, color: '#ffd700' }} />
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Quest Complete!
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            You've mastered comparison writing!
          </Typography>

          <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3, backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Vocabulary Level Achieved
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {[...Array(vocabularyLevel)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#ffd700', fontSize: 40 }} />
                    ))}
                  </Stack>
                  <Typography variant="h4" color="primary.dark" fontWeight="bold">
                    Level {vocabularyLevel}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Correct Answers
                  </Typography>
                  <Typography variant="h3" color="success.dark" fontWeight="bold">
                    {correctAnswers} / {answeredQuestions.length}
                  </Typography>
                </Box>

                {skippedQuestions.size > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Skipped: {skippedQuestions.size}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Progress Header */}
      <Paper elevation={4} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#ffd700' }}>
              Vocabulary Level {vocabularyLevel}
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Question {currentQuestionIndex + 1} / {totalQuestions}
            </Typography>
          </Stack>

          <Box>
            <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
              {[...Array(maxLevel)].map((_, i) => (
                <StarIcon
                  key={i}
                  sx={{
                    color: i < vocabularyLevel ? '#ffd700' : 'rgba(255,255,255,0.3)',
                    fontSize: 28
                  }}
                />
              ))}
            </Stack>
            <LinearProgress
              variant="determinate"
              value={((answeredCount + skippedQuestions.size) / totalQuestions) * 100}
              sx={{
                height: 10,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4caf50'
                }
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Completed Questions Summary */}
      {answeredCount > 0 && (
        <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Your Progress:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {questions.map((q, index) => {
              const answer = answers[index]
              const isSkipped = skippedQuestions.has(index)
              const isAnswered = answer !== undefined

              return (
                <Chip
                  key={index}
                  label={`Q${index + 1}`}
                  size="small"
                  icon={
                    isAnswered ? (
                      answer.isCorrect ? <CheckCircleIcon /> : <CancelIcon />
                    ) : isSkipped ? (
                      <CancelIcon />
                    ) : (
                      <LockIcon />
                    )
                  }
                  color={
                    isAnswered ? (answer.isCorrect ? 'success' : 'error') : isSkipped ? 'default' : 'default'
                  }
                  sx={{ opacity: isAnswered || isSkipped ? 1 : 0.4 }}
                />
              )
            })}
          </Stack>
        </Paper>
      )}

      {/* Current Question */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 3,
          backgroundColor: evaluationResult ? (evaluationResult.score === 1 ? '#e8f5e9' : '#ffebee') : 'white',
          border: '3px solid',
          borderColor: evaluationResult ? (evaluationResult.score === 1 ? 'success.main' : 'error.main') : 'primary.main',
          transition: 'all 0.3s ease'
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.dark">
          {currentQuestion.question}
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          value={currentAnswer}
          onChange={handleAnswerChange}
          placeholder="Write your comparison here... (Use terms like: while, whereas, better than, etc.)"
          disabled={isSubmitting || (evaluationResult !== null && evaluationResult.score === 1)}
          InputProps={{
            style: {
              color: '#000000',
              fontSize: '16px',
              fontWeight: 400
            }
          }}
          sx={{
            mt: 2,
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2
              }
            },
            '& .MuiInputBase-input': {
              color: '#000000 !important',
              WebkitTextFillColor: '#000000 !important',
              opacity: '1 !important'
            },
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#000000 !important'
            }
          }}
        />

        {evaluationResult && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: evaluationResult.score === 1 ? 'success.light' : 'error.light',
              borderRadius: 2,
              border: '2px solid',
              borderColor: evaluationResult.score === 1 ? 'success.main' : 'error.main'
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              {evaluationResult.score === 1 ? (
                <>
                  <CheckCircleIcon sx={{ color: 'success.dark' }} />
                  <Typography variant="h6" fontWeight="bold" color="success.dark">
                    Excellent! ✓
                  </Typography>
                </>
              ) : (
                <>
                  <CancelIcon sx={{ color: 'error.dark' }} />
                  <Typography variant="h6" fontWeight="bold" color="error.dark">
                    Not quite ✕
                  </Typography>
                </>
              )}
            </Stack>
            <Typography variant="body2" color="text.primary">
              {evaluationResult.feedback}
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          {evaluationResult && evaluationResult.score === 0 ? (
            // Show Retry and Skip buttons when answer is incorrect
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={handleSkip}
                disabled={isSubmitting}
                startIcon={<CancelIcon />}
              >
                Skip (Accept 0)
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={handleRetry}
                disabled={isSubmitting}
                sx={{ px: 4 }}
              >
                Retry
              </Button>
            </>
          ) : (
            // Show Submit and Skip buttons normally
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={handleSkip}
                disabled={isSubmitting || (evaluationResult !== null && evaluationResult.score === 1)}
                startIcon={<CancelIcon />}
              >
                Skip
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!currentAnswer.trim() || isSubmitting || (evaluationResult !== null && evaluationResult.score === 1)}
                sx={{ px: 4 }}
              >
                {isSubmitting ? 'Evaluating...' : 'Submit'}
              </Button>
            </>
          )}
        </Stack>
      </Paper>

      {/* Glossary Terms Reference */}
      <Paper elevation={2} sx={{ p: 3, backgroundColor: 'info.light' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="info.dark" gutterBottom>
          Suggested Terms to Use:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {glossaryTerms.map((term, index) => (
            <Chip
              key={index}
              label={term}
              size="small"
              sx={{
                backgroundColor: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            />
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}

export default CompareQuestGame
