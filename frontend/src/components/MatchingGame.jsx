import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Button, Stack, Card, CardContent, CardMedia, Grid, LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

/**
 * Matching Game Component
 * One-by-one image matching game where students select the correct definition for each image
 * Based on phase4.json requirements for Interaction 1
 */
const MatchingGame = ({
  pairs = [], // Array of {image, word, definition}
  onComplete,
  onProgress
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentQuestionAttempts, setCurrentQuestionAttempts] = useState(0) // Track attempts per question
  const [shuffledOptions, setShuffledOptions] = useState([]) // Shuffled options for current question

  // Colors for the option cards (8 colors for 8 options)
  const OPTION_COLORS = [
    '#ef5350', // red
    '#66bb6a', // green
    '#ff9800', // orange
    '#42a5f5', // blue
    '#ab47bc', // purple
    '#26c6da', // cyan
    '#ffca28', // amber
    '#ec407a'  // pink
  ]

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  useEffect(() => {
    // Shuffle options when pairs are loaded or when moving to a new question
    if (pairs.length > 0) {
      setShuffledOptions(shuffleArray(pairs))
    }
    // Reset selection when moving to next question
    setSelectedOption(null)
    setIsCorrect(null)
    setShowFeedback(false)
    setCurrentQuestionAttempts(0) // Reset attempts for new question
  }, [currentIndex, pairs])

  const handleOptionClick = (option, index) => {
    if (showFeedback) return // Prevent clicking during feedback

    const currentPair = pairs[currentIndex]
    const correct = option.word === currentPair.word

    setSelectedOption(index)
    setIsCorrect(correct)
    setShowFeedback(true)
    setAttempts(prev => prev + 1)
    setCurrentQuestionAttempts(prev => prev + 1)

    if (correct) {
      // Correct answer - add to score
      setCorrectCount(prev => prev + 1)

      // Wait 1.5 seconds then move to next question
      setTimeout(() => {
        if (currentIndex + 1 < pairs.length) {
          // Move to next question
          setCurrentIndex(prev => prev + 1)
          onProgress && onProgress({
            current: currentIndex + 1,
            total: pairs.length,
            correct: true,
            score: correctCount + 1
          })
        } else {
          // All questions completed
          onComplete && onComplete({
            correct: true,
            totalCorrect: correctCount + 1,
            totalPairs: pairs.length,
            attempts: attempts + 1
          })
        }
      }, 1500)
    } else {
      // Wrong answer
      if (currentQuestionAttempts === 0) {
        // First attempt - give one more chance with "Try again"
        setTimeout(() => {
          setShowFeedback(false)
          setSelectedOption(null)
          setIsCorrect(null)
        }, 1500)

        onProgress && onProgress({
          current: currentIndex,
          total: pairs.length,
          correct: false,
          message: 'Try again'
        })
      } else {
        // Second attempt or more - move to next question anyway (no score added)
        setTimeout(() => {
          if (currentIndex + 1 < pairs.length) {
            // Move to next question without adding to score
            setCurrentIndex(prev => prev + 1)
            onProgress && onProgress({
              current: currentIndex + 1,
              total: pairs.length,
              correct: false,
              score: correctCount
            })
          } else {
            // All questions completed
            onComplete && onComplete({
              correct: false,
              totalCorrect: correctCount,
              totalPairs: pairs.length,
              attempts: attempts + 1
            })
          }
        }, 1500)
      }
    }
  }

  if (pairs.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading game...</Typography>
      </Box>
    )
  }

  if (currentIndex >= pairs.length) {
    return (
      <Paper elevation={6} sx={{ p: 4, textAlign: 'center', backgroundColor: 'success.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          🎉 Excellent Work!
        </Typography>
        <Typography variant="h6">
          You've successfully matched all {pairs.length} vocabulary terms!
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Score: {correctCount} / {pairs.length}
        </Typography>
      </Paper>
    )
  }

  const currentPair = pairs[currentIndex]

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Progress */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
            Question {currentIndex + 1} / {pairs.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={((currentIndex) / pairs.length) * 100}
            sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
          />
          <Typography variant="body2" color="success.main" fontWeight="bold">
            ✓ {correctCount}
          </Typography>
        </Stack>
      </Paper>

      {/* Instructions */}
      <Typography variant="h6" align="center" gutterBottom sx={{ mb: 3 }}>
        Click on the correct definition
      </Typography>

      {/* Main Image - Top Center with slide-in animation */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Card
          key={currentIndex} // Key ensures animation triggers on each new image
          elevation={3}
          sx={{
            maxWidth: 500,
            animation: 'slideInFromLeft 0.6s ease-out',
            '@keyframes slideInFromLeft': {
              '0%': {
                transform: 'translateX(-100%)',
                opacity: 0
              },
              '100%': {
                transform: 'translateX(0)',
                opacity: 1
              }
            }
          }}
        >
          <CardMedia
            component="img"
            image={currentPair.image}
            alt={currentPair.word}
            sx={{
              height: 300,
              objectFit: 'cover'
            }}
          />
          <CardContent sx={{ textAlign: 'center', backgroundColor: 'primary.main' }}>
            <Typography variant="h5" fontWeight="bold" color="white">
              {currentPair.word}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Options Grid - 8 colored tiles with TEXT definitions (randomized) */}
      <Grid container spacing={2}>
        {shuffledOptions.map((option, index) => {
          const isSelected = selectedOption === index
          const isThisCorrect = option.word === currentPair.word
          const showCheck = showFeedback && isSelected && isCorrect
          const showX = showFeedback && isSelected && !isCorrect

          return (
            <Grid item xs={6} sm={4} md={3} key={`${option.word}-${index}`}>
              <Paper
                onClick={() => handleOptionClick(option, index)}
                sx={{
                  cursor: showFeedback ? 'default' : 'pointer',
                  border: '6px solid',
                  borderColor: OPTION_COLORS[index],
                  transition: 'all 0.3s',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  position: 'relative',
                  opacity: showFeedback && !isSelected ? 0.6 : 1,
                  minHeight: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  backgroundColor: 'grey.100',
                  '&:hover': {
                    transform: showFeedback ? 'scale(1)' : 'scale(1.05)',
                    boxShadow: showFeedback ? 2 : 6,
                    backgroundColor: showFeedback ? 'grey.100' : 'grey.200'
                  }
                }}
              >
                {/* Text - Hide when correct answer is selected */}
                <Typography
                  variant="body2"
                  align="center"
                  fontWeight="medium"
                  sx={{
                    opacity: showCheck ? 0 : 1,
                    transition: 'opacity 0.3s'
                  }}
                >
                  {option.definition}
                </Typography>

                {/* Feedback Icons */}
                {showCheck && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 50 }} />
                  </Box>
                )}

                {showX && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CancelIcon sx={{ color: 'error.main', fontSize: 50 }} />
                  </Box>
                )}
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      {/* Feedback Message */}
      {showFeedback && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          {isCorrect ? (
            <Typography variant="h6" color="success.main" fontWeight="bold">
              ✓ Correct! Moving to next question...
            </Typography>
          ) : currentQuestionAttempts === 1 ? (
            <Typography variant="h6" color="warning.main" fontWeight="bold">
              ⚠ Try again! You have one more chance.
            </Typography>
          ) : (
            <Typography variant="h6" color="error.main" fontWeight="bold">
              ✗ Wrong! Moving to next question...
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

export default MatchingGame

