import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Button, Stack, LinearProgress, Chip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'

/**
 * Sushi Spell Advanced Game Component
 * Spell advanced marketing terms by selecting letters, then match them to scenarios
 * Inspired by British Council's Sushi Spell game
 */

const SushiSpellAdvancedGame = ({
  terms = [],
  onComplete
}) => {
  const [currentTermIndex, setCurrentTermIndex] = useState(0)
  const [selectedLetters, setSelectedLetters] = useState([])
  const [availableLetters, setAvailableLetters] = useState([])
  const [spelledTerms, setSpelledTerms] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [wordTimeLeft, setWordTimeLeft] = useState(30) // 30 seconds per word
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [score, setScore] = useState(0)

  const currentTerm = terms[currentTermIndex]

  // Global Timer
  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, gameComplete])

  // Per-word 30-second countdown timer
  useEffect(() => {
    if (gameStarted && !gameComplete && !showFeedback) {
      setWordTimeLeft(30) // Reset to 30 seconds for new word

      const wordTimer = setInterval(() => {
        setWordTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up! Move to next word
            clearInterval(wordTimer)
            moveToNextWord()
            return 30
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(wordTimer)
    }
  }, [currentTermIndex, gameStarted, gameComplete, showFeedback])

  const moveToNextWord = () => {
    if (currentTermIndex + 1 < terms.length) {
      setCurrentTermIndex(currentTermIndex + 1)
      setShowFeedback(false)
      setSelectedLetters([])
    } else {
      // Game complete
      setGameComplete(true)
      if (onComplete) {
        onComplete({
          score: score,
          totalTerms: terms.length,
          timeElapsed: timeElapsed,
          spelledTerms: spelledTerms,
          completed: true
        })
      }
    }
  }

  // Generate scrambled letters when term changes
  useEffect(() => {
    if (currentTerm) {
      const letters = currentTerm.term.toUpperCase().split('')

      // Add some extra random letters to make it challenging
      const extraLetters = ['A', 'E', 'I', 'O', 'R', 'S', 'T', 'N']
      const numExtras = Math.min(3, Math.floor(letters.length / 2))

      for (let i = 0; i < numExtras; i++) {
        const randomLetter = extraLetters[Math.floor(Math.random() * extraLetters.length)]
        letters.push(randomLetter)
      }

      // Shuffle letters
      const shuffled = shuffleArray(letters)
      setAvailableLetters(shuffled)
      setSelectedLetters([])
      setGameStarted(true)
    }
  }, [currentTerm])

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleLetterClick = (letter, index) => {
    // Add letter to selected
    setSelectedLetters([...selectedLetters, { letter, originalIndex: index }])

    // Remove from available
    const newAvailable = [...availableLetters]
    newAvailable.splice(index, 1)
    setAvailableLetters(newAvailable)
  }

  const handleRemoveLetter = (index) => {
    const letterToRemove = selectedLetters[index]

    // Remove from selected
    const newSelected = [...selectedLetters]
    newSelected.splice(index, 1)
    setSelectedLetters(newSelected)

    // Add back to available
    setAvailableLetters([...availableLetters, letterToRemove.letter])
  }

  const handleSubmit = () => {
    const spelledWord = selectedLetters.map(item => item.letter).join('').toLowerCase()
    const correctWord = currentTerm.term.toLowerCase()

    if (spelledWord === correctWord) {
      // Correct!
      setIsCorrect(true)
      setShowFeedback(true)
      setScore(score + 1)

      // Add to spelled terms
      const newSpelledTerms = [...spelledTerms, {
        term: currentTerm.term,
        scenario: currentTerm.scenario,
        isCorrect: true
      }]
      setSpelledTerms(newSpelledTerms)

      // Move to next term
      setTimeout(() => {
        if (currentTermIndex + 1 < terms.length) {
          setCurrentTermIndex(currentTermIndex + 1)
          setShowFeedback(false)
        } else {
          // Game complete
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              score: score + 1,
              totalTerms: terms.length,
              timeElapsed: timeElapsed,
              spelledTerms: newSpelledTerms,
              completed: true
            })
          }
        }
      }, 1500)
    } else {
      // Incorrect
      setIsCorrect(false)
      setShowFeedback(true)

      setTimeout(() => {
        setShowFeedback(false)
        // Reset letters
        const letters = currentTerm.term.toUpperCase().split('')
        const extraLetters = ['A', 'E', 'I', 'O', 'R', 'S', 'T', 'N']
        const numExtras = Math.min(3, Math.floor(letters.length / 2))
        for (let i = 0; i < numExtras; i++) {
          const randomLetter = extraLetters[Math.floor(Math.random() * extraLetters.length)]
          letters.push(randomLetter)
        }
        setAvailableLetters(shuffleArray(letters))
        setSelectedLetters([])
      }, 1500)
    }
  }

  const handleClear = () => {
    // Move all selected letters back to available
    const letters = currentTerm.term.toUpperCase().split('')
    const extraLetters = ['A', 'E', 'I', 'O', 'R', 'S', 'T', 'N']
    const numExtras = Math.min(3, Math.floor(letters.length / 2))
    for (let i = 0; i < numExtras; i++) {
      const randomLetter = extraLetters[Math.floor(Math.random() * extraLetters.length)]
      letters.push(randomLetter)
    }
    setAvailableLetters(shuffleArray(letters))
    setSelectedLetters([])
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gameComplete) {
    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ color: 'white' }}>
          <Typography variant="h2" gutterBottom fontWeight="bold" sx={{ fontSize: '4rem' }}>
            🍣
          </Typography>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Sushi Spell Master!
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            You've spelled all {terms.length} advanced marketing terms!
          </Typography>
          <Typography variant="h6">
            Score: {score} / {terms.length}
          </Typography>
          <Typography variant="h6">
            Time: {formatTime(timeElapsed)}
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Header with Timer and Progress */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#2e7d32' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={2}>
            <TimerIcon sx={{ color: 'white', fontSize: 30 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
              {formatTime(timeElapsed)}
            </Typography>
          </Stack>

          <Typography variant="h6" sx={{ color: 'white' }}>
            Term {currentTermIndex + 1} / {terms.length}
          </Typography>

          {/* 30-second countdown per word */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
              Time Left
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: wordTimeLeft <= 10 ? '#ff5252' : '#ffd700',
                animation: wordTimeLeft <= 5 ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' }
                }
              }}
            >
              0:{wordTimeLeft.toString().padStart(2, '0')}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
              Score: {score} / {currentTermIndex}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(currentTermIndex / terms.length) * 100}
              sx={{
                height: 10,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#ffd700'
                }
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Scenario Display */}
      <Paper elevation={4} sx={{ p: 3, mb: 3, backgroundColor: '#fff3e0' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#000000' }} gutterBottom>
          Match this scenario:
        </Typography>
        <Typography variant="h5" sx={{ color: '#bf360c', fontWeight: 'bold' }}>
          {currentTerm?.scenario}
        </Typography>
      </Paper>

      {/* Sushi Belt - Spelled Word Area */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 3,
          backgroundColor: showFeedback ? (isCorrect ? '#c8e6c9' : '#ffcdd2') : '#f5f5f5',
          border: '4px solid',
          borderColor: showFeedback ? (isCorrect ? '#4caf50' : '#f44336') : '#8d6e63',
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#424242' }} gutterBottom align="center">
          Spell the term:
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {selectedLetters.length === 0 ? (
            <Typography variant="h4" sx={{ color: '#757575', fontStyle: 'italic' }}>
              Select letters below...
            </Typography>
          ) : (
            selectedLetters.map((item, index) => (
              <Chip
                key={index}
                label={item.letter}
                onClick={() => !showFeedback && handleRemoveLetter(index)}
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  width: 50,
                  height: 50,
                  backgroundColor: '#8d6e63',
                  color: 'white',
                  cursor: showFeedback ? 'default' : 'pointer',
                  '&:hover': {
                    backgroundColor: showFeedback ? '#8d6e63' : '#6d4c41'
                  }
                }}
              />
            ))
          )}
        </Stack>

        {showFeedback && (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            {isCorrect ? (
              <>
                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 30 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#2e7d32' }}>
                  Correct! "{currentTerm.term}"
                </Typography>
              </>
            ) : (
              <>
                <CancelIcon sx={{ color: '#f44336', fontSize: 30 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#c62828' }}>
                  Try again!
                </Typography>
              </>
            )}
          </Stack>
        )}
      </Paper>

      {/* Available Letters - Sushi Conveyor Belt */}
      <Paper elevation={4} sx={{ p: 3, mb: 3, backgroundColor: '#795548' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white', mb: 2 }} align="center">
          🍣 Sushi Letter Belt 🍣
        </Typography>
        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
          {availableLetters.map((letter, index) => (
            <Chip
              key={index}
              label={letter}
              onClick={() => !showFeedback && handleLetterClick(letter, index)}
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                width: 50,
                height: 50,
                backgroundColor: '#8bc34a',
                color: 'white',
                cursor: showFeedback ? 'default' : 'pointer',
                border: '3px solid #558b2f',
                '&:hover': {
                  backgroundColor: showFeedback ? '#8bc34a' : '#7cb342',
                  transform: showFeedback ? 'none' : 'scale(1.1)',
                  transition: 'all 0.2s ease'
                }
              }}
            />
          ))}
        </Stack>
      </Paper>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="outlined"
          color="error"
          onClick={handleClear}
          disabled={selectedLetters.length === 0 || showFeedback}
          size="large"
          sx={{ px: 4 }}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={selectedLetters.length === 0 || showFeedback}
          size="large"
          sx={{ px: 6, fontSize: '1.1rem' }}
        >
          Submit
        </Button>
      </Stack>

      {/* Spelled Terms Progress */}
      {spelledTerms.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mt: 3, backgroundColor: 'grey.100' }}>
          <Typography variant="subtitle2" sx={{ color: '#424242' }} gutterBottom>
            Completed Terms:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {spelledTerms.map((item, index) => (
              <Chip
                key={index}
                label={item.term}
                icon={<CheckCircleIcon />}
                color="success"
                size="small"
              />
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

export default SushiSpellAdvancedGame
