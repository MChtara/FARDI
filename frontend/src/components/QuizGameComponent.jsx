import React, { useState } from 'react'
import { Box, Paper, Typography, Button, Stack, Radio, RadioGroup, FormControlLabel, LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

/**
 * Quiz Game Component
 * Multiple choice quiz on vocabulary terms
 */

const QuizGameComponent = ({ questions = [], onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer

    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setCorrectCount(correctCount + 1)
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer('')
        setShowFeedback(false)
        setIsCorrect(false)
      } else {
        // Game complete
        setGameComplete(true)
        if (onComplete) {
          onComplete({
            score: correctCount + (correct ? 1 : 0),
            totalQuestions: questions.length,
            passed: (correctCount + (correct ? 1 : 0)) === questions.length
          })
        }
      }
    }, 1500)
  }

  if (gameComplete) {
    const finalScore = correctCount
    const passed = finalScore === questions.length

    return (
      <Paper
        elevation={6}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: passed ? 'success.light' : 'warning.light'
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold" color={passed ? 'success.dark' : 'warning.dark'}>
          {passed ? '🎉 Perfect Score!' : '📊 Quiz Complete!'}
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          You scored {finalScore} out of {questions.length}
        </Typography>
        {passed ? (
          <Typography variant="body1" color="success.dark" fontWeight="bold">
            All answers correct! Excellent work!
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Keep practicing to get all answers correct!
          </Typography>
        )}
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      {/* Progress */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: 'primary.light' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body1" fontWeight="bold" color="primary.dark">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={((currentQuestionIndex) / questions.length) * 100}
            sx={{ flexGrow: 1, height: 10, borderRadius: 1 }}
          />
          <Typography variant="body2" fontWeight="bold" color="success.dark">
            ✓ {correctCount}
          </Typography>
        </Stack>
      </Paper>

      {/* Question */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mb: 3,
          backgroundColor: showFeedback
            ? isCorrect
              ? 'success.light'
              : 'error.light'
            : 'grey.50',
          transition: 'background-color 0.3s'
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.dark">
          {currentQuestion?.question}
        </Typography>

        <RadioGroup value={selectedAnswer} onChange={(e) => handleAnswerSelect(e.target.value)}>
          <Stack spacing={2} sx={{ mt: 3 }}>
            {currentQuestion?.options?.map((option, index) => (
              <Paper
                key={index}
                elevation={selectedAnswer === option ? 3 : 1}
                sx={{
                  p: 2,
                  cursor: showFeedback ? 'default' : 'pointer',
                  border: '2px solid',
                  borderColor:
                    showFeedback && option === currentQuestion.correctAnswer
                      ? 'success.main'
                      : showFeedback && selectedAnswer === option && !isCorrect
                      ? 'error.main'
                      : selectedAnswer === option
                      ? 'primary.main'
                      : 'grey.300',
                  backgroundColor:
                    showFeedback && option === currentQuestion.correctAnswer
                      ? 'success.light'
                      : showFeedback && selectedAnswer === option && !isCorrect
                      ? 'error.light'
                      : selectedAnswer === option
                      ? 'primary.light'
                      : 'white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: showFeedback ? undefined : 'grey.100'
                  }
                }}
                onClick={() => !showFeedback && handleAnswerSelect(option)}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControlLabel
                    value={option}
                    control={<Radio disabled={showFeedback} />}
                    label={
                      <Typography variant="body1" fontWeight="medium" sx={{ color: '#000000' }}>
                        {option}
                      </Typography>
                    }
                    sx={{ flexGrow: 1, m: 0 }}
                  />
                  {showFeedback && option === currentQuestion.correctAnswer && (
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 30 }} />
                  )}
                  {showFeedback && selectedAnswer === option && !isCorrect && (
                    <CancelIcon sx={{ color: 'error.main', fontSize: 30 }} />
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </RadioGroup>
      </Paper>

      {/* Submit Button */}
      {!showFeedback && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={!selectedAnswer}
        >
          Submit Answer
        </Button>
      )}

      {/* Feedback */}
      {showFeedback && (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: isCorrect ? 'success.light' : 'error.light' }}>
          <Typography variant="h6" fontWeight="bold" color={isCorrect ? 'success.dark' : 'error.dark'}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </Typography>
          {!isCorrect && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              The correct answer is: {currentQuestion.correctAnswer}
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  )
}

export default QuizGameComponent
