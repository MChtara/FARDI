import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Grid, Button, Stack, LinearProgress, Chip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'
import StarIcon from '@mui/icons-material/Star'

/**
 * Wordshake Game Component
 * Students form words by clicking adjacent letters in a grid
 * Target: Find 8 specific marketing vocabulary words
 */
const WordshakeGame = ({
  targetWords = [], // Array of words to find
  duration = 180, // Duration in seconds (3 minutes)
  onComplete
}) => {
  const [grid, setGrid] = useState([])
  const [selectedCells, setSelectedCells] = useState([])
  const [currentWord, setCurrentWord] = useState('')
  const [foundWords, setFoundWords] = useState(new Set())
  const [foundWordCells, setFoundWordCells] = useState(new Set()) // Track cells that are part of found words
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [score, setScore] = useState(0)

  // Predefined grid with all target words
  const PREDEFINED_GRID = [
    ['C', 'O', 'M', 'M', 'E', 'R', 'C', 'I', 'A', 'L', 'K', 'P'],
    ['X', 'A', 'D', 'H', 'T', 'Y', 'U', 'I', 'O', 'P', 'L', 'O'],
    ['B', 'I', 'L', 'L', 'B', 'O', 'A', 'R', 'D', 'M', 'S', 'S'],
    ['F', 'E', 'A', 'T', 'U', 'R', 'E', 'Z', 'X', 'C', 'L', 'T'],
    ['E', 'Y', 'E', 'C', 'A', 'T', 'C', 'H', 'E', 'R', 'O', 'E'],
    ['V', 'I', 'D', 'E', 'O', 'W', 'Q', 'A', 'S', 'D', 'G', 'R'],
    ['M', 'N', 'B', 'V', 'C', 'X', 'Z', 'L', 'K', 'J', 'A', 'H'],
    ['P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q', 'N', 'M']
  ]

  // Generate letter grid containing target words
  useEffect(() => {
    setGrid(PREDEFINED_GRID)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (gameStarted && !gameEnded && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameEnded(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, gameEnded, timeLeft])

  // Auto-complete when time runs out
  useEffect(() => {
    if (gameEnded && onComplete) {
      onComplete({
        score: foundWords.size,
        totalWords: targetWords.length,
        foundWords: Array.from(foundWords)
      })
    }
  }, [gameEnded])


  const handleCellClick = (row, col) => {
    if (gameEnded) return

    if (!gameStarted) {
      setGameStarted(true)
    }

    const cellKey = `${row}-${col}`
    const isAlreadySelected = selectedCells.some(cell => cell.key === cellKey)

    if (isAlreadySelected) {
      // Deselect if clicking the same cell
      return
    }

    // Check if cell is adjacent to last selected cell
    if (selectedCells.length > 0) {
      const lastCell = selectedCells[selectedCells.length - 1]
      const rowDiff = Math.abs(row - lastCell.row)
      const colDiff = Math.abs(col - lastCell.col)

      // Must be adjacent (including diagonals)
      if (rowDiff > 1 || colDiff > 1) {
        return
      }
    }

    const newSelectedCells = [...selectedCells, { row, col, key: cellKey, letter: grid[row][col] }]
    setSelectedCells(newSelectedCells)
    setCurrentWord(newSelectedCells.map(cell => cell.letter).join(''))
  }

  const handleSubmitWord = () => {
    const word = currentWord.toLowerCase()

    // Check if it's a target word and not already found
    const matchedWord = targetWords.find(tw => tw.toLowerCase().replace('-', '') === word.replace('-', ''))

    if (matchedWord && !foundWords.has(matchedWord)) {
      const newFoundWords = new Set([...foundWords, matchedWord])
      setFoundWords(newFoundWords)
      setScore(prev => prev + 1)

      // Mark the cells of the found word
      const newFoundCells = new Set(foundWordCells)
      selectedCells.forEach(cell => {
        newFoundCells.add(cell.key)
      })
      setFoundWordCells(newFoundCells)

      // Check if all words are found - end game immediately
      if (newFoundWords.size === targetWords.length) {
        setTimeout(() => {
          setGameEnded(true)
        }, 800) // Short delay to show the last word highlighted
      }
    }

    // Clear selection
    setSelectedCells([])
    setCurrentWord('')
  }

  const handleClearSelection = () => {
    setSelectedCells([])
    setCurrentWord('')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col)
  }

  const isFoundWordCell = (row, col) => {
    const key = `${row}-${col}`
    return foundWordCells.has(key)
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header with Timer and Score */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2}>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary.dark">
              Wordshake Challenge
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Form words by clicking adjacent letters
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} alignItems="center">
            {/* Timer */}
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TimerIcon sx={{ color: timeLeft < 30 ? 'error.main' : 'primary.main' }} />
                <Typography variant="h4" fontWeight="bold" color={timeLeft < 30 ? 'error.main' : 'primary.main'}>
                  {formatTime(timeLeft)}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Time Left
              </Typography>
            </Box>

            {/* Score */}
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <StarIcon sx={{ color: 'warning.main' }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {score}/{targetWords.length}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Words Found
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={(foundWords.size / targetWords.length) * 100}
          sx={{ mt: 2, height: 8, borderRadius: 1 }}
        />
      </Paper>

      {/* Current Word Display */}
      {currentWord && (
        <Paper elevation={2} sx={{ p: 2, mb: 2, textAlign: 'center', backgroundColor: 'info.light' }}>
          <Typography variant="h5" fontWeight="bold" color="info.dark">
            {currentWord}
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 1 }}>
            <Button variant="contained" color="success" onClick={handleSubmitWord}>
              Submit Word
            </Button>
            <Button variant="outlined" color="error" onClick={handleClearSelection}>
              Clear
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Letter Grid */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={1}>
          {grid.map((row, rowIndex) => (
            <Grid item xs={12} key={rowIndex}>
              <Stack direction="row" spacing={1} justifyContent="center">
                {row.map((letter, colIndex) => {
                  const selected = isSelected(rowIndex, colIndex)
                  const isFound = isFoundWordCell(rowIndex, colIndex)
                  return (
                    <Paper
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      elevation={selected ? 8 : isFound ? 4 : 2}
                      sx={{
                        width: 50,
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: gameEnded ? 'default' : 'pointer',
                        backgroundColor: selected ? 'primary.main' : isFound ? 'success.light' : 'grey.100',
                        color: selected ? 'white' : isFound ? 'success.dark' : 'text.primary',
                        transition: 'all 0.3s',
                        border: '2px solid',
                        borderColor: selected ? 'primary.dark' : isFound ? 'success.main' : 'grey.300',
                        '&:hover': {
                          transform: gameEnded ? 'none' : 'scale(1.1)',
                          boxShadow: gameEnded ? 2 : 6,
                          backgroundColor: selected ? 'primary.main' : isFound ? 'success.light' : 'grey.200'
                        }
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {letter}
                      </Typography>
                    </Paper>
                  )
                })}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Target Words List */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Target Words ({foundWords.size}/{targetWords.length})
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {targetWords.map((word, index) => {
            const found = foundWords.has(word)
            return (
              <Chip
                key={index}
                label={word}
                icon={found ? <CheckCircleIcon /> : null}
                color={found ? 'success' : 'default'}
                sx={{
                  fontSize: '1rem',
                  fontWeight: found ? 'bold' : 'normal',
                  opacity: found ? 1 : 0.6
                }}
              />
            )
          })}
        </Stack>
      </Paper>

      {/* Game Over Message */}
      {gameEnded && (
        <Paper elevation={6} sx={{ p: 4, mt: 3, textAlign: 'center', backgroundColor: 'success.main', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            {foundWords.size === targetWords.length ? '🎉 Congratulations!' : '⏰ Time\'s Up!'}
          </Typography>
          <Typography variant="h5">
            {foundWords.size === targetWords.length
              ? `Perfect! You found all ${targetWords.length} words!`
              : `You found ${foundWords.size} out of ${targetWords.length} words!`
            }
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Score: {score}/{targetWords.length}
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default WordshakeGame
