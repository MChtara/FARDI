import React, { useState, useEffect, useRef } from 'react'
import { Box, Paper, Typography, Stack, Button, LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'

/**
 * Simple Line Matching Game
 * Click term on left, then example on right to draw a line
 * Simple and intuitive matching interface
 */

const SimpleLineMatchingGame = ({ pairs = [], onComplete }) => {
  const [shuffledTerms, setShuffledTerms] = useState([])
  const [shuffledExamples, setShuffledExamples] = useState([])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [matches, setMatches] = useState({}) // { termId: exampleId }
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const canvasRef = useRef(null)
  const termsRef = useRef({})
  const examplesRef = useRef({})

  // Shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize
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

  // Draw lines
  useEffect(() => {
    drawLines()
  }, [matches, shuffledTerms, shuffledExamples])

  const drawLines = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()

    // Set canvas size
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw lines for matches
    Object.entries(matches).forEach(([termId, exampleId]) => {
      const termEl = termsRef.current[termId]
      const exampleEl = examplesRef.current[exampleId]

      if (termEl && exampleEl) {
        const termRect = termEl.getBoundingClientRect()
        const exampleRect = exampleEl.getBoundingClientRect()
        const canvasRect = canvas.getBoundingClientRect()

        const startX = termRect.right - canvasRect.left
        const startY = termRect.top + termRect.height / 2 - canvasRect.top
        const endX = exampleRect.left - canvasRect.left
        const endY = exampleRect.top + exampleRect.height / 2 - canvasRect.top

        // Draw line in neutral blue color
        ctx.strokeStyle = '#1976d2'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    })
  }

  const handleTermClick = (term) => {
    if (!gameStarted) setGameStarted(true)
    setSelectedTerm(term)
  }

  const handleExampleClick = (example) => {
    if (!gameStarted) setGameStarted(true)

    if (selectedTerm) {
      // Create or update match
      const newMatches = { ...matches, [selectedTerm.id]: example.id }
      setMatches(newMatches)
      setSelectedTerm(null)

      // Check if all matched
      if (Object.keys(newMatches).length === pairs.length) {
        // Calculate score
        let correctCount = 0
        Object.entries(newMatches).forEach(([termId, exampleId]) => {
          if (parseInt(termId) === parseInt(exampleId)) {
            correctCount++
          }
        })

        console.log('=== Simple Line Matching - Scoring ===')
        console.log('Total matches:', Object.keys(newMatches).length)
        console.log('Correct matches:', correctCount, '/', pairs.length)
        console.log('Each correct match = +1 point')

        setTimeout(() => {
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              score: correctCount,
              totalPairs: pairs.length,
              timeElapsed: timeElapsed,
              completed: true
            })
          }
        }, 500)
      }
    }
  }

  const handleReset = () => {
    setMatches({})
    setSelectedTerm(null)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCorrectMatchCount = () => {
    let count = 0
    Object.entries(matches).forEach(([termId, exampleId]) => {
      if (parseInt(termId) === parseInt(exampleId)) count++
    })
    return count
  }

  if (gameComplete) {
    const correctCount = getCorrectMatchCount()
    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', backgroundColor: 'success.light' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="success.dark">
          🎉 Game Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          You got {correctCount} out of {pairs.length} matches correct!
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
            Matched: {Object.keys(matches).length} / {pairs.length}
          </Typography>

          <Button variant="outlined" size="small" onClick={handleReset}>
            Reset
          </Button>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={(Object.keys(matches).length / pairs.length) * 100}
          sx={{ mt: 2, height: 8, borderRadius: 1 }}
        />
      </Paper>

      {/* Instructions */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'info.light' }}>
        <Typography variant="body1" textAlign="center" fontWeight="medium" color="info.dark">
          👆 Click a term on the left, then click its matching example on the right to draw a line
        </Typography>
      </Paper>

      {/* Matching Area */}
      <Box sx={{ position: 'relative' }}>
        {/* Canvas for lines */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Matching Grid */}
        <Box sx={{ display: 'flex', gap: 4, position: 'relative', zIndex: 2 }}>
          {/* Left Column - Terms */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main" textAlign="center">
                Terms
              </Typography>
              <Stack spacing={2}>
                {shuffledTerms.map((item) => {
                  const isMatched = matches[item.id] !== undefined
                  const isSelected = selectedTerm?.id === item.id

                  return (
                    <Paper
                      key={`term-${item.id}`}
                      ref={(el) => (termsRef.current[item.id] = el)}
                      onClick={() => handleTermClick(item)}
                      elevation={isSelected ? 6 : 2}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'primary.light' : 'white',
                        border: '2px solid',
                        borderColor: isSelected ? 'primary.main' : 'grey.300',
                        opacity: isMatched ? 0.6 : 1,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: isMatched ? 'white' : 'primary.lighter',
                          transform: 'translateX(-4px)'
                        }
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold" sx={{ color: '#000000' }}>
                        {item.term}
                      </Typography>
                    </Paper>
                  )
                })}
              </Stack>
            </Paper>
          </Box>

          {/* Right Column - Examples */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="secondary.main" textAlign="center">
                Examples
              </Typography>
              <Stack spacing={2}>
                {shuffledExamples.map((item) => {
                  const isMatched = Object.values(matches).includes(item.id)

                  return (
                    <Paper
                      key={`example-${item.id}`}
                      ref={(el) => (examplesRef.current[item.id] = el)}
                      onClick={() => handleExampleClick(item)}
                      elevation={2}
                      sx={{
                        p: 2,
                        cursor: selectedTerm ? 'pointer' : 'default',
                        backgroundColor: 'white',
                        border: '2px solid',
                        borderColor: 'grey.300',
                        opacity: isMatched ? 0.6 : selectedTerm ? 1 : 0.7,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: selectedTerm ? 'secondary.lighter' : 'white',
                          transform: selectedTerm ? 'translateX(4px)' : 'none'
                        }
                      }}
                    >
                      <Typography variant="body1" sx={{ color: '#000000' }}>
                        {item.example}
                      </Typography>
                    </Paper>
                  )
                })}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SimpleLineMatchingGame
