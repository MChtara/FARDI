import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Button, Stack, Chip, Avatar, LinearProgress } from '@mui/material'
import SwordsIcon from '@mui/icons-material/SportsMartialArts'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

/**
 * Debate Duel Game Component
 * Simulate debate with AI opponent - win rounds with correct term usage
 * Advanced C1 level vocabulary challenge
 */

const DebateDuelGame = ({
  debateLines = [],
  wordBank = [],
  onComplete
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [selectedWords, setSelectedWords] = useState([])
  const [completedLines, setCompletedLines] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [userScore, setUserScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [wordValidation, setWordValidation] = useState([])

  const currentLine = debateLines[currentLineIndex]
  const totalBlanks = currentLine?.blanks?.length || 0

  const handleWordClick = (word) => {
    if (selectedWords.length < totalBlanks && !showFeedback) {
      setSelectedWords([...selectedWords, word])
    }
  }

  const handleRemoveWord = (index) => {
    if (!showFeedback) {
      setSelectedWords(selectedWords.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    // Validate each word individually
    const validation = selectedWords.map((word, index) =>
      word.toLowerCase() === currentLine.blanks[index].toLowerCase()
    )
    setWordValidation(validation)

    const allCorrect = validation.every(v => v)
    setIsCorrect(allCorrect)
    setShowFeedback(true)

    if (allCorrect) {
      // User wins this round
      setUserScore(userScore + 1)
    } else {
      // Opponent wins this round
      setOpponentScore(opponentScore + 1)
    }

    // Store completed line
    const newCompletedLines = [...completedLines, {
      ...currentLine,
      userAnswer: selectedWords,
      validation: validation,
      isCorrect: allCorrect
    }]
    setCompletedLines(newCompletedLines)

    // Move to next line or complete game
    setTimeout(() => {
      if (currentLineIndex + 1 < debateLines.length) {
        setCurrentLineIndex(currentLineIndex + 1)
        setSelectedWords([])
        setShowFeedback(false)
        setWordValidation([])
      } else {
        // Game complete
        setGameComplete(true)
        if (onComplete) {
          onComplete({
            userScore: allCorrect ? userScore + 1 : userScore,
            opponentScore: allCorrect ? opponentScore : opponentScore + 1,
            totalRounds: debateLines.filter(l => l.blanks.length > 0).length,
            completedLines: newCompletedLines,
            won: (allCorrect ? userScore + 1 : userScore) > (allCorrect ? opponentScore : opponentScore + 1),
            completed: true
          })
        }
      }
    }, 2000)
  }

  const handleClear = () => {
    setSelectedWords([])
  }

  if (gameComplete) {
    const won = userScore > opponentScore
    const tied = userScore === opponentScore

    return (
      <Paper
        elevation={6}
        sx={{
          p: 6,
          textAlign: 'center',
          background: won
            ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
            : tied
            ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
            : 'linear-gradient(135deg, #f44336 0%, #c62828 100%)'
        }}
      >
        <Box sx={{ color: 'white' }}>
          <Typography variant="h2" gutterBottom sx={{ fontSize: '4rem' }}>
            {won ? '🏆' : tied ? '🤝' : '⚔️'}
          </Typography>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            {won ? 'Victory!' : tied ? 'Tie!' : 'Defeat!'}
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {won
              ? 'You won the debate duel!'
              : tied
              ? 'The debate ended in a tie!'
              : 'Your opponent won this time!'}
          </Typography>

          <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>You</Typography>
              <Typography variant="h2" fontWeight="bold">{userScore}</Typography>
            </Box>
            <Typography variant="h2" fontWeight="bold">-</Typography>
            <Box>
              <Typography variant="h6" gutterBottom>Opponent</Typography>
              <Typography variant="h2" fontWeight="bold">{opponentScore}</Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    )
  }

  // Auto-complete lines with no blanks (opponent lines)
  useEffect(() => {
    if (currentLine && totalBlanks === 0 && !showFeedback) {
      const alreadyCompleted = completedLines.some(line =>
        line.speaker === currentLine.speaker &&
        line.template === currentLine.template
      )

      if (!alreadyCompleted) {
        const newCompletedLines = [...completedLines, {
          ...currentLine,
          userAnswer: [],
          isCorrect: null
        }]
        setCompletedLines(newCompletedLines)

        setTimeout(() => {
          if (currentLineIndex + 1 < debateLines.length) {
            setCurrentLineIndex(currentLineIndex + 1)
          } else {
            setGameComplete(true)
            if (onComplete) {
              onComplete({
                userScore: userScore,
                opponentScore: opponentScore,
                totalRounds: debateLines.filter(l => l.blanks.length > 0).length,
                completedLines: newCompletedLines,
                won: userScore > opponentScore,
                completed: true
              })
            }
          }
        }, 2000)
      }
    }
  }, [currentLineIndex, currentLine, totalBlanks, completedLines, debateLines.length, showFeedback, onComplete, userScore, opponentScore])

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Duel Score Header */}
      <Paper elevation={4} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: '#1976d2', width: 50, height: 50 }}>
              <Typography fontWeight="bold">You</Typography>
            </Avatar>
            <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
              {userScore}
            </Typography>
          </Stack>

          <Stack alignItems="center">
            <SwordsIcon sx={{ fontSize: 50, color: 'white', mb: 1 }} />
            <Typography variant="h6" sx={{ color: 'white' }}>
              Round {completedLines.filter(l => l.blanks && l.blanks.length > 0).length + 1} / {debateLines.filter(l => l.blanks.length > 0).length}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
              {opponentScore}
            </Typography>
            <Avatar sx={{ bgcolor: '#f44336', width: 50, height: 50 }}>
              <Typography fontWeight="bold">AI</Typography>
            </Avatar>
          </Stack>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={((completedLines.filter(l => l.blanks && l.blanks.length > 0).length) / debateLines.filter(l => l.blanks.length > 0).length) * 100}
          sx={{
            mt: 2,
            height: 10,
            borderRadius: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#ffd700'
            }
          }}
        />
      </Paper>

      {/* Completed Debate History */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {completedLines.map((line, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              p: 2.5,
              backgroundColor: line.speaker === 'You' ? '#e3f2fd' : '#ffebee',
              border: '2px solid',
              borderColor: line.isCorrect === true ? 'success.main' : line.isCorrect === false ? 'error.main' : 'grey.300'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{
                bgcolor: line.speaker === 'You' ? '#1976d2' : '#f44336',
                width: 40,
                height: 40
              }}>
                <Typography variant="body2" fontWeight="bold">
                  {line.speaker === 'You' ? 'You' : 'AI'}
                </Typography>
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>
                  {line.speaker}
                </Typography>
                <Typography variant="body1" sx={{ color: '#000000' }}>
                  {line.blanks && line.blanks.length === 0 ? (
                    line.template
                  ) : (
                    line.template.split('[____]').map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < (line.userAnswer?.length || 0) && (
                          <span style={{
                            backgroundColor: line.validation && line.validation[i] === false ? '#f44336' : '#4caf50',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            margin: '0 2px'
                          }}>
                            {line.userAnswer[i]}
                          </span>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </Typography>
              </Box>
              {line.isCorrect !== null && (
                line.isCorrect ? (
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 30 }} />
                ) : (
                  <CancelIcon sx={{ color: 'error.main', fontSize: 30 }} />
                )
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Current Debate Line */}
      {currentLine && (
        <Paper
          elevation={6}
          sx={{
            p: 4,
            mb: 3,
            backgroundColor: showFeedback
              ? (isCorrect ? '#e8f5e9' : '#ffebee')
              : (currentLine.speaker === 'You' ? '#e3f2fd' : '#ffebee'),
            border: '3px solid',
            borderColor: showFeedback
              ? (isCorrect ? 'success.main' : 'error.main')
              : (currentLine.speaker === 'You' ? '#1976d2' : '#f44336')
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar sx={{
              bgcolor: currentLine.speaker === 'You' ? '#1976d2' : '#f44336',
              width: 48,
              height: 48
            }}>
              <Typography fontWeight="bold">
                {currentLine.speaker === 'You' ? 'You' : 'AI'}
              </Typography>
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#000000' }}>
                {currentLine.speaker}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.15rem', lineHeight: 1.8, color: '#000000' }}>
                {currentLine.template.split('[____]').map((part, i) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < totalBlanks && (
                      <span style={{
                        display: 'inline-block',
                        minWidth: '140px',
                        padding: '6px 14px',
                        margin: '0 4px',
                        backgroundColor: showFeedback
                          ? (wordValidation[i] === false ? '#f44336' : (wordValidation[i] === true ? '#4caf50' : '#e0e0e0'))
                          : (selectedWords[i] ? '#1976d2' : '#e0e0e0'),
                        color: selectedWords[i] || showFeedback ? 'white' : '#666',
                        borderRadius: '8px',
                        border: '2px dashed #999',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        cursor: selectedWords[i] && !showFeedback ? 'pointer' : 'default'
                      }}
                      onClick={() => selectedWords[i] && !showFeedback && handleRemoveWord(i)}
                      >
                        {selectedWords[i] || '____'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </Typography>

              {showFeedback && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: isCorrect ? 'success.light' : 'error.light',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: isCorrect ? 'success.main' : 'error.main'
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#000000' }}>
                    {isCorrect ? '✓ You win this round!' : '✗ Opponent wins this round!'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Word Bank */}
      {currentLine && totalBlanks > 0 && (
        <>
          <Paper elevation={4} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', border: '2px solid', borderColor: 'primary.light' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: '#000000' }}>
              Advanced Marketing Terms - Choose Carefully!
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {wordBank.map((word, index) => (
                <Chip
                  key={index}
                  label={word}
                  onClick={() => handleWordClick(word)}
                  disabled={showFeedback}
                  sx={{
                    fontSize: '1.05rem',
                    fontWeight: 'bold',
                    cursor: showFeedback ? 'default' : 'pointer',
                    px: 2.5,
                    py: 1.5,
                    height: 'auto',
                    backgroundColor: selectedWords.includes(word) ? '#1976d2' : 'default',
                    color: selectedWords.includes(word) ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor: showFeedback ? undefined : (selectedWords.includes(word) ? '#1565c0' : 'primary.light'),
                      transform: showFeedback ? 'none' : 'scale(1.05)'
                    }
                  }}
                />
              ))}
            </Stack>
          </Paper>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="error"
              onClick={handleClear}
              disabled={selectedWords.length === 0 || showFeedback}
              size="large"
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={selectedWords.length !== totalBlanks || showFeedback}
              size="large"
              sx={{ px: 4 }}
            >
              {selectedWords.length === totalBlanks ? 'Submit Response' : `Select ${totalBlanks - selectedWords.length} more`}
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}

export default DebateDuelGame
