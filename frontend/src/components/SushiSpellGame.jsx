import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Button, Chip, Grid, Alert } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

/**
 * Sushi Spell Game Component
 * Students click letters to spell advertising vocabulary words within 2 minutes
 */

// Target words for advertising vocabulary
const TARGET_WORDS = [
  'persuasive',
  'targeted',
  'creative',
  'dramatisation',
  'goal',
  'obstacles',
  'friction'
]

// Generate letter grid with enough letters to spell ALL target words
// Note: Letters can be REUSED (clicked multiple times), so we only need enough
// for the longest occurrence of each letter in any single word
const generateLetterGrid = () => {
  const neededLetters = []

  // For each unique letter, find the maximum times it appears in ANY SINGLE word
  const uniqueLetters = new Set()
  TARGET_WORDS.forEach(word => {
    word.toUpperCase().split('').forEach(letter => uniqueLetters.add(letter))
  })

  // Add enough of each letter to spell the word that uses it most
  uniqueLetters.forEach(letter => {
    const maxOccurrences = Math.max(...TARGET_WORDS.map(word => {
      const matches = word.toUpperCase().match(new RegExp(letter, 'g'))
      return matches ? matches.length : 0
    }))

    // Add this letter 'maxOccurrences' times
    for (let i = 0; i < maxOccurrences; i++) {
      neededLetters.push(letter)
    }
  })

  // Add random filler letters to reach 30 tiles (3 rows x 10 columns)
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  while (neededLetters.length < 30) {
    const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)]
    neededLetters.push(randomLetter)
  }

  // Shuffle all letters randomly
  const shuffled = neededLetters.sort(() => Math.random() - 0.5)

  // Create 3 rows of 10 letters each
  const grid = []
  for (let i = 0; i < 3; i++) {
    grid.push(shuffled.slice(i * 10, (i + 1) * 10))
  }

  return grid
}

// Color palette for letter buttons (matching Sushi Spell style)
const COLORS = [
  '#8BC34A', '#4CAF50', '#66BB6A', '#9CCC65', // Greens
  '#FFB74D', '#FFA726', '#FF9800', '#FFD54F', // Oranges/Yellows
  '#BA68C8', '#9C27B0', '#AB47BC', '#CE93D8', // Purples
  '#42A5F5', '#2196F3', '#64B5F6', '#90CAF9', // Blues
  '#EF5350', '#F44336', '#E57373', '#EF9A9A', // Reds/Pinks
  '#78909C', '#607D8B', '#90A4AE', '#B0BEC5'  // Grays
]

// Points: +1 for each word found
const POINTS_PER_WORD = 1

export default function SushiSpellGame({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes = 120 seconds
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWord, setCurrentWord] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [message, setMessage] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [letterGrid, setLetterGrid] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [wordsCount, setWordsCount] = useState(0)

  // Timer countdown
  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isPlaying) {
      endGame()
    }
  }, [timeLeft, isPlaying, gameOver])

  const startGame = () => {
    setIsPlaying(true)
    setTimeLeft(120)
    setCurrentWord([])
    setFoundWords([])
    setMessage('Spell the advertising words!')
    setGameOver(false)
    setLetterGrid(generateLetterGrid())
    setTotalPoints(0)
    setWordsCount(0)
  }

  const endGame = () => {
    setIsPlaying(false)
    setGameOver(true)
    setMessage(`Time's up! You found ${foundWords.length}/${TARGET_WORDS.length} words!`)
    if (onComplete) {
      onComplete({
        foundWords: foundWords,
        totalWords: TARGET_WORDS.length,
        score: foundWords.length
      })
    }
  }

  const handleLetterClick = (letter) => {
    if (!isPlaying || gameOver) return
    setCurrentWord([...currentWord, letter])
  }

  const handleClear = () => {
    setCurrentWord([])
    setMessage('')
  }

  const handleSubmit = () => {
    if (currentWord.length === 0) return

    const word = currentWord.join('').toLowerCase()

    // Check if word is in target list
    if (TARGET_WORDS.includes(word)) {
      // Check if already found
      if (foundWords.includes(word)) {
        setMessage(`"${word}" already found!`)
      } else {
        setFoundWords([...foundWords, word])
        setTotalPoints(totalPoints + POINTS_PER_WORD)
        setWordsCount(wordsCount + 1)
        setMessage(`✓ Great! "${word}" is correct! +${POINTS_PER_WORD} point!`)
        setCurrentWord([])
      }
    } else {
      setMessage(`"${word}" is not one of the target words. Try again!`)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getLetterColor = (rowIndex, colIndex) => {
    const index = (rowIndex * 10 + colIndex) % COLORS.length
    return COLORS[index]
  }

  return (
    <Paper elevation={3} sx={{ p: 3, backgroundColor: '#2D5016' }}>
      {/* Header with Timer and Words Counter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Paper elevation={1} sx={{ p: 2, backgroundColor: '#FFFEF7', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ color: '#FF6B35' }} />
            <Typography variant="h5" sx={{ color: '#FF6B35' }} fontWeight="bold">
              Time: {formatTime(timeLeft)}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ color: '#4CAF50' }} fontWeight="bold">
            Score: {totalPoints}
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 2, backgroundColor: '#FF6B35', borderRadius: 2, minWidth: 120 }}>
          <Typography variant="h5" fontWeight="bold" color="white" textAlign="center">
            Words: {wordsCount}
          </Typography>
        </Paper>
      </Box>

      {/* Start Button */}
      {!isPlaying && !gameOver && (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={startGame}
            sx={{ px: 6, py: 2, fontSize: '1.2rem' }}
          >
            Start Game (2 minutes)
          </Button>
        </Box>
      )}

      {/* Letter Grid */}
      {isPlaying && letterGrid.length > 0 && (
        <>
          <Box sx={{
            backgroundColor: '#C5E1A5',
            p: 2,
            borderRadius: 2,
            mb: 2,
            border: '3px solid #7CB342'
          }}>
            {letterGrid.map((row, rowIndex) => (
              <Box
                key={rowIndex}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 1
                }}
              >
                {row.map((letter, colIndex) => (
                  <Box
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleLetterClick(letter)}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: getLetterColor(rowIndex, colIndex),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '3px solid white',
                      boxShadow: 3,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: 6
                      },
                      '&:active': {
                        transform: 'scale(0.95)'
                      }
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="white"
                      sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                    >
                      {letter}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>

          {/* Current Word Display */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: '#FFF9C4',
              minHeight: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              border: '2px solid #F9A825'
            }}
          >
            {currentWord.length > 0 ? (
              currentWord.map((letter, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #F9A825',
                    boxShadow: 2
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {letter}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                Click letters to spell a word...
              </Typography>
            )}
          </Paper>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              size="large"
              onClick={handleSubmit}
              disabled={currentWord.length === 0}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="warning"
              fullWidth
              size="large"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Box>

          {/* Message */}
          {message && (
            <Alert
              severity={message.includes('✓') ? 'success' : 'info'}
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}
        </>
      )}

      {/* Found Words */}
      {foundWords.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#E8F5E9' }}>
          <Typography variant="subtitle1" fontWeight="bold" color="success.main" gutterBottom>
            <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Words Found ({foundWords.length}/{TARGET_WORDS.length}):
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {foundWords.map((word, index) => (
              <Chip
                key={index}
                label={word}
                color="success"
                icon={<CheckCircleIcon />}
              />
            ))}
          </Box>
        </Paper>
      )}


      {/* Game Over Summary */}
      {gameOver && (
        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#FFF3E0', textAlign: 'center' }}>
          <Typography variant="h5" color="success.main" gutterBottom fontWeight="bold">
            🎉 Game Complete!
          </Typography>
          <Typography variant="h6" gutterBottom>
            You found {foundWords.length} out of {TARGET_WORDS.length} words!
          </Typography>
          <Box sx={{ mt: 2 }}>
            {foundWords.map((word, index) => (
              <Chip
                key={index}
                label={word}
                color="success"
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={startGame}
          >
            Play Again
          </Button>
        </Paper>
      )}
    </Paper>
  )
}
