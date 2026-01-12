import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Grid, Stack, Chip, LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'

/**
 * Match Master Game Component
 * Timed matching game - click pairs to match terms with examples
 * Inspired by Quizlet Match
 */

const MatchMasterGame = ({ pairs = [], onComplete }) => {
  const [shuffledTerms, setShuffledTerms] = useState([])
  const [shuffledExamples, setShuffledExamples] = useState([])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedExample, setSelectedExample] = useState(null)
  const [matches, setMatches] = useState([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  // Shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize shuffled items
  useEffect(() => {
    if (pairs.length > 0) {
      setShuffledTerms(shuffleArray(pairs.map((p, i) => ({ ...p, id: i }))))
      setShuffledExamples(shuffleArray(pairs.map((p, i) => ({ ...p, id: i }))))
    }
  }, [pairs])

  // Timer
  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, gameComplete])

  const handleTermClick = (term) => {
    if (isMatched(term.id)) return
    if (!gameStarted) setGameStarted(true)

    setSelectedTerm(term)

    // If example already selected, check match
    if (selectedExample) {
      checkMatch(term, selectedExample)
    }
  }

  const handleExampleClick = (example) => {
    if (isMatched(example.id)) return
    if (!gameStarted) setGameStarted(true)

    setSelectedExample(example)

    // If term already selected, check match
    if (selectedTerm) {
      checkMatch(selectedTerm, example)
    }
  }

  const checkMatch = (term, example) => {
    if (term.id === example.id) {
      // Correct match!
      setMatches([...matches, term.id])

      // Check if game complete
      if (matches.length + 1 === pairs.length) {
        setTimeout(() => {
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              score: pairs.length,
              totalPairs: pairs.length,
              timeElapsed: timeElapsed,
              completed: true
            })
          }
        }, 500)
      }
    }

    // Clear selections
    setSelectedTerm(null)
    setSelectedExample(null)
  }

  const isMatched = (id) => {
    return matches.includes(id)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gameComplete) {
    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', backgroundColor: 'success.light' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="success.dark">
          🎉 Match Master!
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          You matched all {pairs.length} pairs correctly!
        </Typography>
        <Typography variant="h6" color="text.primary">
          Time: {formatTime(timeElapsed)}
        </Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: 'primary.light' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <TimerIcon sx={{ color: 'primary.dark' }} />
            <Typography variant="h5" fontWeight="bold" color="primary.dark">
              {formatTime(timeElapsed)}
            </Typography>
          </Stack>

          <Typography variant="h6" color="text.primary">
            Matched: {matches.length} / {pairs.length}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={(matches.length / pairs.length) * 100}
            sx={{ width: 200, height: 10, borderRadius: 1 }}
          />
        </Stack>
      </Paper>

      {/* Matching Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Terms */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, backgroundColor: 'grey.100' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
              Terms
            </Typography>
            <Stack spacing={2}>
              {shuffledTerms.map((item) => (
                <Chip
                  key={`term-${item.id}`}
                  label={item.term}
                  onClick={() => handleTermClick(item)}
                  color={
                    isMatched(item.id)
                      ? 'success'
                      : selectedTerm?.id === item.id
                      ? 'primary'
                      : 'default'
                  }
                  icon={isMatched(item.id) ? <CheckCircleIcon /> : undefined}
                  sx={{
                    fontSize: '1rem',
                    py: 2.5,
                    cursor: isMatched(item.id) ? 'default' : 'pointer',
                    '&:hover': {
                      backgroundColor: isMatched(item.id) ? undefined : 'primary.light'
                    }
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column - Examples */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, backgroundColor: 'grey.100' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="secondary.main">
              Examples
            </Typography>
            <Stack spacing={2}>
              {shuffledExamples.map((item) => (
                <Chip
                  key={`example-${item.id}`}
                  label={item.example}
                  onClick={() => handleExampleClick(item)}
                  color={
                    isMatched(item.id)
                      ? 'success'
                      : selectedExample?.id === item.id
                      ? 'secondary'
                      : 'default'
                  }
                  icon={isMatched(item.id) ? <CheckCircleIcon /> : undefined}
                  sx={{
                    fontSize: '1rem',
                    py: 2.5,
                    cursor: isMatched(item.id) ? 'default' : 'pointer',
                    '&:hover': {
                      backgroundColor: isMatched(item.id) ? undefined : 'secondary.light'
                    }
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MatchMasterGame
