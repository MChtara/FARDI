import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, TextField, Button, Stack, Grid } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

/**
 * Wordle-style Game Component
 * Students guess promotion vocabulary words letter by letter
 */

const WordleGame = ({ sentences = [], onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentGuess, setCurrentGuess] = useState('')
  const [attempts, setAttempts] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [wordCompleted, setWordCompleted] = useState(false)

  const MAX_ATTEMPTS = 6
  const currentWord = sentences[currentWordIndex]?.answer || ''
  const currentSentence = sentences[currentWordIndex]?.sentence || ''

  // Reset state when moving to next word
  useEffect(() => {
    setCurrentGuess('')
    setAttempts([])
    setWordCompleted(false)
  }, [currentWordIndex])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitGuess()
    }
  }

  const handleSubmitGuess = () => {
    if (currentGuess.length !== currentWord.length) {
      return // Must match word length
    }

    const guess = currentGuess.toLowerCase()
    const newAttempts = [...attempts, guess]
    setAttempts(newAttempts)

    // Check if guess is correct
    if (guess === currentWord.toLowerCase()) {
      // Correct guess!
      setScore(prev => prev + 1)
      setWordCompleted(true)

      // Move to next word after a delay
      setTimeout(() => {
        if (currentWordIndex < sentences.length - 1) {
          setCurrentWordIndex(prev => prev + 1)
        } else {
          // Game complete
          setGameOver(true)
          if (onComplete) {
            onComplete({
              score: score + 1,
              totalWords: sentences.length,
              completed: true
            })
          }
        }
      }, 1500)
    } else if (newAttempts.length >= MAX_ATTEMPTS) {
      // Out of attempts for this word
      setWordCompleted(true)

      setTimeout(() => {
        if (currentWordIndex < sentences.length - 1) {
          setCurrentWordIndex(prev => prev + 1)
        } else {
          // Game complete
          setGameOver(true)
          if (onComplete) {
            onComplete({
              score: score,
              totalWords: sentences.length,
              completed: true
            })
          }
        }
      }, 2000)
    }

    setCurrentGuess('')
  }

  const handleSkip = () => {
    // Skip this word without earning a point
    setWordCompleted(true)

    setTimeout(() => {
      if (currentWordIndex < sentences.length - 1) {
        setCurrentWordIndex(prev => prev + 1)
      } else {
        // Game complete
        setGameOver(true)
        if (onComplete) {
          onComplete({
            score: score,
            totalWords: sentences.length,
            completed: true
          })
        }
      }
    }, 1500)
  }

  const getLetterColor = (letter, index, guess) => {
    const targetWord = currentWord.toLowerCase()
    const guessLower = guess.toLowerCase()

    if (guessLower[index] === targetWord[index]) {
      // Correct position (green)
      return 'success.main'
    } else if (targetWord.includes(guessLower[index])) {
      // Wrong position but in word (yellow)
      return 'warning.main'
    } else {
      // Not in word (gray)
      return 'grey.500'
    }
  }

  const getLetterBgColor = (letter, index, guess) => {
    const targetWord = currentWord.toLowerCase()
    const guessLower = guess.toLowerCase()

    if (guessLower[index] === targetWord[index]) {
      return 'success.light'
    } else if (targetWord.includes(guessLower[index])) {
      return 'warning.light'
    } else {
      return 'grey.300'
    }
  }

  if (gameOver) {
    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', backgroundColor: 'success.light' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="success.dark">
          🎉 Game Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          You guessed {score} out of {sentences.length} words correctly!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {score === sentences.length ? 'Perfect score! Amazing work!' : 'Great effort!'}
        </Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Progress */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'primary.light' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary.dark">
            Word {currentWordIndex + 1} of {sentences.length}
          </Typography>
          <Typography variant="h6" color="primary.dark">
            Score: {score}/{sentences.length}
          </Typography>
        </Stack>
      </Paper>

      {/* Sentence with gap */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: 'info.light' }}>
        <Typography variant="h5" textAlign="center" fontWeight="medium" color="info.dark">
          {currentSentence}
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }} color="text.secondary">
          Fill in the blank with a {currentWord.length}-letter word
        </Typography>
      </Paper>

      {/* Previous attempts */}
      <Box sx={{ mb: 3 }}>
        {attempts.map((guess, attemptIndex) => (
          <Stack
            key={attemptIndex}
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            {guess.split('').map((letter, letterIndex) => (
              <Paper
                key={letterIndex}
                elevation={3}
                sx={{
                  width: 50,
                  height: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: getLetterBgColor(letter, letterIndex, guess),
                  border: '2px solid',
                  borderColor: getLetterColor(letter, letterIndex, guess)
                }}
              >
                <Typography variant="h5" fontWeight="bold" color="#000000">
                  {letter.toUpperCase()}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ))}

        {/* Empty rows for remaining attempts */}
        {!wordCompleted && Array.from({ length: MAX_ATTEMPTS - attempts.length }).map((_, i) => (
          <Stack
            key={`empty-${i}`}
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            {Array.from({ length: currentWord.length }).map((_, j) => (
              <Paper
                key={j}
                elevation={1}
                sx={{
                  width: 50,
                  height: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.100',
                  border: '2px solid',
                  borderColor: 'grey.300'
                }}
              >
                <Typography variant="h5" color="grey.400">
                  _
                </Typography>
              </Paper>
            ))}
          </Stack>
        ))}
      </Box>

      {/* Word completed message */}
      {wordCompleted && (
        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 3,
            textAlign: 'center',
            backgroundColor: attempts.length > 0 && attempts[attempts.length - 1]?.toLowerCase() === currentWord.toLowerCase() ? 'success.light' : attempts.length === 0 ? 'warning.light' : 'error.light'
          }}
        >
          {attempts.length > 0 && attempts[attempts.length - 1]?.toLowerCase() === currentWord.toLowerCase() ? (
            <>
              <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h5" color="success.dark">
                Correct! The word is "{currentWord}"
              </Typography>
            </>
          ) : attempts.length === 0 ? (
            <>
              <Typography variant="h5" color="warning.dark">
                Skipped! The word was "{currentWord}"
              </Typography>
            </>
          ) : (
            <>
              <CancelIcon sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
              <Typography variant="h5" color="error.dark">
                The correct word was "{currentWord}"
              </Typography>
            </>
          )}
        </Paper>
      )}

      {/* Input area */}
      {!wordCompleted && attempts.length < MAX_ATTEMPTS && (
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={`Type your ${currentWord.length}-letter guess...`}
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value.toLowerCase())}
              onKeyPress={handleKeyPress}
              inputProps={{
                maxLength: currentWord.length,
                style: { fontSize: 24, textAlign: 'center', textTransform: 'uppercase' }
              }}
              autoFocus
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmitGuess}
                disabled={currentGuess.length !== currentWord.length}
                sx={{ flex: 1 }}
              >
                Submit Guess ({attempts.length + 1}/{MAX_ATTEMPTS})
              </Button>
              <Button
                variant="outlined"
                color="warning"
                size="large"
                onClick={handleSkip}
                sx={{ minWidth: 120 }}
              >
                Skip Word
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* Instructions */}
      <Paper elevation={2} sx={{ p: 2, mt: 3, backgroundColor: 'warning.light' }}>
        <Typography variant="body2" textAlign="center" color="warning.dark">
          🟢 Green = Correct letter in correct position | 🟡 Yellow = Correct letter in wrong position | ⚫ Gray = Letter not in word
        </Typography>
      </Paper>
    </Box>
  )
}

export default WordleGame
