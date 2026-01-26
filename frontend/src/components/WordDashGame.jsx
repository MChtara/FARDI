import React, { useState, useEffect, useRef } from 'react'
import { Box, Paper, Typography, Button, Stack, LinearProgress, Chip } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import StarIcon from '@mui/icons-material/Star'

/**
 * Word Dash Game Component
 * Words "dash" across the screen, player clicks the correct one to fill gaps
 * A1 Level - Simple gap-fill with moving words
 */

const WordDashGame = ({ sentences = [], onComplete }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [movingWords, setMovingWords] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState(false)
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const [nextWordId, setNextWordId] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const gameAreaRef = useRef(null)
  const wordSpawnIntervalRef = useRef(null)
  const wordUpdateIntervalRef = useRef(null)

  // Word bank for distractors
  const WORD_BANK = ['poster', 'video', 'slogan', 'billboard', 'commercial', 'eye-catcher', 'feature', 'ad']

  // Get current sentence
  const currentSentence = sentences[currentSentenceIndex]

  // Start spawning words
  useEffect(() => {
    if (gameStarted && !gameOver && currentSentence) {
      // Spawn words at random intervals (1-3 seconds)
      wordSpawnIntervalRef.current = setInterval(() => {
        spawnWord()
      }, Math.random() * 2000 + 1000) // 1-3 seconds

      return () => {
        if (wordSpawnIntervalRef.current) {
          clearInterval(wordSpawnIntervalRef.current)
        }
      }
    }
  }, [gameStarted, gameOver, currentSentenceIndex])

  // Update word positions
  useEffect(() => {
    if (gameStarted && !gameOver) {
      wordUpdateIntervalRef.current = setInterval(() => {
        setMovingWords(prev => {
          const updated = prev.map(word => ({
            ...word,
            position: word.position - 2 // Move 2px left every frame
          }))

          // Check for words that went off screen
          const offScreenWords = updated.filter(word => word.position < -150)
          if (offScreenWords.length > 0) {
            // Check if correct answer went off screen
            const correctWentOffScreen = offScreenWords.some(word => word.text === currentSentence?.answer)
            if (correctWentOffScreen) {
              handleMissedWord()
            }
          }

          // Remove words that are off screen
          return updated.filter(word => word.position > -150)
        })
      }, 30) // Update every 30ms for smooth animation

      return () => {
        if (wordUpdateIntervalRef.current) {
          clearInterval(wordUpdateIntervalRef.current)
        }
      }
    }
  }, [gameStarted, gameOver, currentSentenceIndex])

  const spawnWord = () => {
    if (!currentSentence) return

    const gameWidth = gameAreaRef.current?.offsetWidth || 800

    // Randomly decide: spawn correct answer or distractor
    const spawnCorrect = Math.random() > 0.6 // 40% chance for correct answer

    let wordText
    if (spawnCorrect) {
      wordText = currentSentence.answer
    } else {
      // Pick a random distractor (not the correct answer)
      const distractors = WORD_BANK.filter(w => w !== currentSentence.answer)
      wordText = distractors[Math.floor(Math.random() * distractors.length)]
    }

    // Random vertical position (top 20% to bottom 80% of game area)
    const randomTop = Math.random() * 60 + 10 // 10-70%

    const newWord = {
      id: nextWordId,
      text: wordText,
      position: gameWidth, // Start from right edge
      top: randomTop,
      isCorrect: wordText === currentSentence.answer
    }

    setMovingWords(prev => [...prev, newWord])
    setNextWordId(prev => prev + 1)
  }

  const handleWordClick = (word) => {
    if (word.isCorrect) {
      // Correct answer!
      setScore(prev => prev + 1)
      setCorrectAnswer(true)
      setMovingWords([]) // Clear all moving words

      // Show feedback briefly, then move to next sentence
      setTimeout(() => {
        setCorrectAnswer(false)
        if (currentSentenceIndex + 1 < sentences.length) {
          setCurrentSentenceIndex(prev => prev + 1)
        } else {
          // Game complete!
          endGame(true)
        }
      }, 1000)
    } else {
      // Wrong answer!
      handleWrongAnswer()
      // Remove the clicked word
      setMovingWords(prev => prev.filter(w => w.id !== word.id))
    }
  }

  const handleWrongAnswer = () => {
    setWrongAnswer(true)
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        endGame(false)
      }
      return newLives
    })

    setTimeout(() => {
      setWrongAnswer(false)
    }, 500)
  }

  const handleMissedWord = () => {
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        endGame(false)
      }
      return newLives
    })
  }

  const endGame = (completed) => {
    setGameOver(true)
    if (wordSpawnIntervalRef.current) clearInterval(wordSpawnIntervalRef.current)
    if (wordUpdateIntervalRef.current) clearInterval(wordUpdateIntervalRef.current)

    if (onComplete) {
      onComplete({
        score,
        totalSentences: sentences.length,
        completed
      })
    }
  }

  const handleRestart = () => {
    setCurrentSentenceIndex(0)
    setScore(0)
    setLives(3)
    setGameOver(false)
    setMovingWords([])
    setCorrectAnswer(false)
    setWrongAnswer(false)
    setNextWordId(0)
    setGameStarted(true)
  }

  const handleStart = () => {
    setGameStarted(true)
  }

  if (!sentences || sentences.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading game...</Typography>
      </Box>
    )
  }

  // Start screen
  if (!gameStarted && !gameOver) {
    return (
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center', backgroundColor: 'primary.light' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="primary.dark">
          Word Dash!
        </Typography>
        <Typography variant="h6" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
          Click the correct word as it dashes across the screen!
        </Typography>

        <Stack spacing={2} sx={{ mb: 4, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
          <Typography variant="body1">
            📝 Fill in {sentences.length} sentences
          </Typography>
          <Typography variant="body1">
            ❤️ You have 3 lives
          </Typography>
          <Typography variant="body1">
            ⭐ Get +1 point for each correct word
          </Typography>
          <Typography variant="body1">
            ⚠️ Lose a life if you click wrong or miss the correct word
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStart}
          sx={{ px: 6, py: 2, fontSize: '1.2rem' }}
        >
          Start Game
        </Button>
      </Paper>
    )
  }

  // Game over screen
  if (gameOver) {
    return (
      <Paper
        elevation={6}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: score === sentences.length ? 'success.light' : 'error.light'
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          {score === sentences.length ? '🎉 Perfect Score!' : '⏱️ Game Over!'}
        </Typography>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Final Score: {score} / {sentences.length}
        </Typography>
        <Button
          variant="contained"
          color={score === sentences.length ? 'success' : 'primary'}
          size="large"
          onClick={handleRestart}
          sx={{ px: 6, py: 2 }}
        >
          Play Again
        </Button>
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Score and Lives Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {/* Score */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <StarIcon sx={{ color: 'warning.main', fontSize: 30 }} />
            <Typography variant="h5" fontWeight="bold" color="success.main">
              Score: {score}
            </Typography>
          </Stack>

          {/* Progress */}
          <Typography variant="body1" color="text.secondary">
            Sentence {currentSentenceIndex + 1} / {sentences.length}
          </Typography>

          {/* Lives */}
          <Stack direction="row" spacing={0.5}>
            {Array.from({ length: 3 }).map((_, i) => (
              <FavoriteIcon
                key={i}
                sx={{
                  color: i < lives ? 'error.main' : 'grey.300',
                  fontSize: 30
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>

      {/* Current Sentence */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 2,
          textAlign: 'center',
          backgroundColor: correctAnswer ? 'success.light' : wrongAnswer ? 'error.light' : 'info.light',
          transition: 'background-color 0.3s',
          animation: wrongAnswer ? 'shake 0.5s' : 'none',
          '@keyframes shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
            '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' }
          }
        }}
      >
        <Typography variant="h4" fontWeight="medium" color="text.primary">
          {currentSentence?.sentence.split('[____]')[0]}
          <span style={{
            backgroundColor: correctAnswer ? '#4caf50' : '#1976d2',
            color: 'white',
            padding: '4px 16px',
            borderRadius: '8px',
            display: 'inline-block',
            minWidth: '150px'
          }}>
            {correctAnswer ? currentSentence?.answer : '____'}
          </span>
          {currentSentence?.sentence.split('[____]')[1]}
        </Typography>
      </Paper>

      {/* Game Lane - where words move */}
      <Paper
        ref={gameAreaRef}
        elevation={4}
        sx={{
          position: 'relative',
          height: 300,
          backgroundColor: 'grey.100',
          overflow: 'hidden',
          border: '3px solid',
          borderColor: 'primary.main',
          borderRadius: 2
        }}
      >
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: 'text.secondary',
            fontStyle: 'italic'
          }}
        >
          Click the correct word!
        </Typography>

        {/* Moving Words */}
        {movingWords.map(word => (
          <Chip
            key={word.id}
            label={word.text}
            onClick={() => handleWordClick(word)}
            sx={{
              position: 'absolute',
              left: `${word.position}px`,
              top: `${word.top}%`,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              px: 3,
              py: 2,
              cursor: 'pointer',
              transition: 'transform 0.1s',
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'primary.dark'
              }
            }}
          />
        ))}
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mt: 2, backgroundColor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          💡 Click the moving word that correctly fills the gap. Be careful - wrong clicks cost lives!
        </Typography>
      </Paper>
    </Box>
  )
}

export default WordDashGame
