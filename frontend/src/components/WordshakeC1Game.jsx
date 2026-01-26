import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Grid, Button, Stack, LinearProgress, Chip, TextField } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TimerIcon from '@mui/icons-material/Timer'
import StarIcon from '@mui/icons-material/Star'
import CancelIcon from '@mui/icons-material/Cancel'

/**
 * Wordshake C1 Game Component
 * Students find 6 advanced marketing words in a grid, then use each in a sentence
 * C1 level: guerilla, surrogate, remarketing, geotargeting, infomercial, viral
 */
const WordshakeC1Game = ({
  targetWords = [], // Array of 6 words to find
  duration = 300, // 5 minutes for finding words
  onComplete
}) => {
  // C1-specific grid with the 6 advanced terms
  const PREDEFINED_GRID = [
    ['G', 'U', 'E', 'R', 'I', 'L', 'L', 'A', 'X', 'Z', 'C', 'V'],
    ['E', 'B', 'N', 'M', 'G', 'F', 'D', 'S', 'A', 'L', 'K', 'J'],
    ['O', 'I', 'N', 'F', 'O', 'M', 'E', 'R', 'C', 'I', 'A', 'L'],
    ['T', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q', 'S'],
    ['A', 'G', 'F', 'D', 'S', 'A', 'L', 'K', 'J', 'H', 'G', 'U'],
    ['R', 'E', 'M', 'A', 'R', 'K', 'E', 'T', 'I', 'N', 'G', 'R'],
    ['G', 'M', 'N', 'B', 'V', 'C', 'X', 'Z', 'L', 'K', 'J', 'R'],
    ['E', 'V', 'I', 'R', 'A', 'L', 'P', 'O', 'I', 'U', 'Y', 'O'],
    ['T', 'H', 'G', 'F', 'D', 'S', 'A', 'L', 'K', 'J', 'H', 'G'],
    ['I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q', 'M', 'N', 'B', 'A'],
    ['N', 'M', 'L', 'K', 'J', 'H', 'G', 'F', 'D', 'S', 'A', 'T'],
    ['G', 'S', 'U', 'R', 'R', 'O', 'G', 'A', 'T', 'E', 'W', 'E']
  ]

  // Phase 1: Word Finding
  const [grid] = useState(PREDEFINED_GRID)
  const [selectedCells, setSelectedCells] = useState([])
  const [currentWord, setCurrentWord] = useState('')
  const [foundWords, setFoundWords] = useState(new Set())
  const [foundWordCells, setFoundWordCells] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameStarted, setGameStarted] = useState(false)
  const [wordFindingComplete, setWordFindingComplete] = useState(false)
  const [score, setScore] = useState(0)

  // Phase 2: Sentence Writing
  const [sentencePhase, setSentencePhase] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [sentences, setSentences] = useState({})
  const [currentSentence, setCurrentSentence] = useState('')
  const [sentenceEvaluation, setSentenceEvaluation] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  // Timer countdown (only during word finding phase)
  useEffect(() => {
    if (gameStarted && !wordFindingComplete && !sentencePhase && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setWordFindingComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, wordFindingComplete, sentencePhase, timeLeft])

  // Auto-transition to sentence phase when all words found or time's up
  useEffect(() => {
    if (wordFindingComplete && !sentencePhase && foundWords.size > 0) {
      setTimeout(() => {
        setSentencePhase(true)
      }, 1500)
    }
  }, [wordFindingComplete, sentencePhase, foundWords])

  const handleCellClick = (row, col) => {
    if (wordFindingComplete || sentencePhase) return

    if (!gameStarted) {
      setGameStarted(true)
    }

    const cellKey = `${row}-${col}`
    const isAlreadySelected = selectedCells.some(cell => cell.key === cellKey)

    if (isAlreadySelected) {
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
    const matchedWord = targetWords.find(tw => tw.toLowerCase() === word)

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

      // Check if all words are found - end word finding phase
      if (newFoundWords.size === targetWords.length) {
        setTimeout(() => {
          setWordFindingComplete(true)
        }, 800)
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

  const handleSentenceChange = (event) => {
    setCurrentSentence(event.target.value)
  }

  const handleSubmitSentence = async () => {
    if (!currentSentence.trim()) return

    const wordsArray = Array.from(foundWords)
    const currentTargetWord = wordsArray[currentWordIndex]

    setIsEvaluating(true)

    try {
      const response = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: `Use "${currentTargetWord}" in a marketing context sentence`,
          answer: currentSentence,
          level: 'C1',
          task: 'sentence',
          criteria: {
            requiresWord: currentTargetWord,
            requiresContext: true,
            glossaryTerms: targetWords,
            minWordsRequired: 5
          }
        })
      })

      const result = await response.json()

      // Store the sentence and evaluation
      const newSentences = {
        ...sentences,
        [currentTargetWord]: {
          sentence: currentSentence,
          evaluation: result,
          isCorrect: result.score === 1
        }
      }
      setSentences(newSentences)
      setSentenceEvaluation(result)

      // Move to next word or complete game
      setTimeout(() => {
        if (currentWordIndex + 1 < wordsArray.length) {
          setCurrentWordIndex(currentWordIndex + 1)
          setCurrentSentence('')
          setSentenceEvaluation(null)
        } else {
          setGameComplete(true)
          if (onComplete) {
            const sentenceScore = Object.values(newSentences).filter(s => s.isCorrect).length
            onComplete({
              wordFindingScore: foundWords.size,
              totalWords: targetWords.length,
              foundWords: Array.from(foundWords),
              sentences: newSentences,
              sentenceScore: sentenceScore,
              totalScore: foundWords.size + sentenceScore,
              maxScore: targetWords.length * 2,
              completed: true
            })
          }
        }
      }, 2000)

    } catch (error) {
      console.error('Sentence evaluation error:', error)
      setSentenceEvaluation({ score: 0, feedback: 'Unable to evaluate. Please try again.' })
    } finally {
      setIsEvaluating(false)
    }
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

  // Game Complete View
  if (gameComplete) {
    const correctSentences = Object.values(sentences).filter(s => s.isCorrect).length
    const totalScore = foundWords.size + correctSentences

    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ color: 'white' }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            🎉 Challenge Complete!
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            You've completed the C1 Wordshake Challenge!
          </Typography>
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.2)', p: 3, borderRadius: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Word Finding: {foundWords.size}/{targetWords.length}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Sentence Writing: {correctSentences}/{foundWords.size}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
              Total Score: {totalScore}/{targetWords.length * 2}
            </Typography>
          </Box>
        </Box>
      </Paper>
    )
  }

  // Sentence Writing Phase
  if (sentencePhase) {
    const wordsArray = Array.from(foundWords)
    const currentTargetWord = wordsArray[currentWordIndex]

    return (
      <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Sentence Writing Phase
          </Typography>
          <Typography variant="body1">
            Write a sentence using each word in a marketing context
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(currentWordIndex / wordsArray.length) * 100}
            sx={{
              mt: 2,
              height: 10,
              borderRadius: 1,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': { backgroundColor: '#ffd700' }
            }}
          />
        </Paper>

        {/* Current Word */}
        <Paper elevation={4} sx={{ p: 4, mb: 3, backgroundColor: sentenceEvaluation ? (sentenceEvaluation.score === 1 ? '#e8f5e9' : '#ffebee') : 'white' }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
            Word {currentWordIndex + 1} of {wordsArray.length}: <span style={{ color: '#667eea' }}>{currentTargetWord}</span>
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={currentSentence}
            onChange={handleSentenceChange}
            placeholder={`Write a sentence using "${currentTargetWord}" in a marketing context...`}
            disabled={isEvaluating || sentenceEvaluation !== null}
            InputProps={{ style: { color: '#000000', fontSize: '16px' } }}
            sx={{
              mt: 2,
              mb: 2,
              '& .MuiOutlinedInput-root': { backgroundColor: 'white' },
              '& .MuiInputBase-input': { color: '#000000 !important', WebkitTextFillColor: '#000000 !important' }
            }}
          />

          {sentenceEvaluation && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: sentenceEvaluation.score === 1 ? 'success.light' : 'error.light', borderRadius: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                {sentenceEvaluation.score === 1 ? <CheckCircleIcon sx={{ color: 'success.dark' }} /> : <CancelIcon sx={{ color: 'error.dark' }} />}
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#000000' }}>
                  {sentenceEvaluation.score === 1 ? 'Excellent!' : 'Needs Improvement'}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#000000' }}>
                {sentenceEvaluation.feedback}
              </Typography>
            </Box>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitSentence}
              disabled={!currentSentence.trim() || isEvaluating || sentenceEvaluation !== null}
              sx={{ px: 4 }}
            >
              {isEvaluating ? 'Evaluating...' : 'Submit Sentence'}
            </Button>
          </Stack>
        </Paper>

        {/* Progress */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Progress: {currentWordIndex}/{wordsArray.length} completed
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {wordsArray.map((word, index) => {
              const completed = index < currentWordIndex
              const current = index === currentWordIndex
              return (
                <Chip
                  key={index}
                  label={word}
                  icon={completed ? <CheckCircleIcon /> : null}
                  color={current ? 'primary' : completed ? 'success' : 'default'}
                  sx={{ fontWeight: current ? 'bold' : 'normal' }}
                />
              )
            })}
          </Stack>
        </Paper>
      </Box>
    )
  }

  // Word Finding Phase
  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header with Timer and Score */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2}>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary.dark">
              Wordshake Challenge - C1 Level
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find 6 advanced marketing terms in the grid
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} alignItems="center">
            {/* Timer */}
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TimerIcon sx={{ color: timeLeft < 60 ? 'error.main' : 'primary.main' }} />
                <Typography variant="h4" fontWeight="bold" color={timeLeft < 60 ? 'error.main' : 'primary.main'}>
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
                        width: 45,
                        height: 45,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: wordFindingComplete ? 'default' : 'pointer',
                        backgroundColor: selected ? 'primary.main' : isFound ? 'success.light' : 'grey.100',
                        color: selected ? 'white' : isFound ? 'success.dark' : 'text.primary',
                        transition: 'all 0.3s',
                        border: '2px solid',
                        borderColor: selected ? 'primary.dark' : isFound ? 'success.main' : 'grey.300',
                        '&:hover': {
                          transform: wordFindingComplete ? 'none' : 'scale(1.1)',
                          boxShadow: wordFindingComplete ? 2 : 6,
                          backgroundColor: selected ? 'primary.main' : isFound ? 'success.light' : 'grey.200'
                        }
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
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

      {/* Phase Complete Message */}
      {wordFindingComplete && (
        <Paper elevation={6} sx={{ p: 4, mt: 3, textAlign: 'center', backgroundColor: 'success.main', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            {foundWords.size === targetWords.length ? '🎉 Perfect!' : '⏰ Time\'s Up!'}
          </Typography>
          <Typography variant="h5">
            You found {foundWords.size} out of {targetWords.length} words!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Next: Write sentences using each word...
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default WordshakeC1Game
