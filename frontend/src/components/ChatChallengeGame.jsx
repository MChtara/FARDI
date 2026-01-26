import React, { useState } from 'react'
import { Box, Paper, Typography, Chip, Stack, Button, LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'

/**
 * Chat Challenge Game Component
 * Complete dialogue lines by selecting words from a word bank
 * Unlock next dialogue level by completing current one
 */

const ChatChallengeGame = ({ dialogueLines = [], wordBank = [], onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [selectedWords, setSelectedWords] = useState([])
  const [completedLines, setCompletedLines] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [showError, setShowError] = useState(false)
  const [hasRetried, setHasRetried] = useState(false)
  const [wordValidation, setWordValidation] = useState([]) // Track which words are correct/incorrect

  const currentLine = dialogueLines[currentLineIndex]
  const totalBlanks = currentLine?.blanks?.length || 0

  // Auto-complete lines with no blanks
  React.useEffect(() => {
    if (currentLine && totalBlanks === 0 && !gameComplete) {
      // Check if this line is already completed to avoid infinite loop
      const alreadyCompleted = completedLines.some(line =>
        line.speaker === currentLine.speaker &&
        line.template === currentLine.template
      )

      if (!alreadyCompleted) {
        const newCompletedLines = [...completedLines, {
          ...currentLine,
          userAnswer: []
        }]
        setCompletedLines(newCompletedLines)

        // Move to next line or complete game
        if (currentLineIndex + 1 < dialogueLines.length) {
          setTimeout(() => {
            setCurrentLineIndex(currentLineIndex + 1)
          }, 500)
        } else {
          // Game complete!
          setTimeout(() => {
            setGameComplete(true)
            if (onComplete) {
              onComplete({
                score: score,
                totalLines: dialogueLines.length,
                completed: true
              })
            }
          }, 500)
        }
      }
    }
  }, [currentLineIndex, currentLine, totalBlanks, completedLines, dialogueLines.length, gameComplete, onComplete, score])

  const handleWordClick = (word) => {
    // Add word to selected words
    if (selectedWords.length < totalBlanks) {
      setSelectedWords([...selectedWords, word])
    }
  }

  const handleRemoveWord = (index) => {
    setSelectedWords(selectedWords.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    // Validate each word individually
    const validation = selectedWords.map((word, index) =>
      word.toLowerCase() === currentLine.blanks[index].toLowerCase()
    )
    setWordValidation(validation)

    // Check if all words are correct
    const isCorrect = validation.every(v => v)

    if (isCorrect) {
      // Correct! Add to completed lines
      setShowError(false)
      setHasRetried(false)

      // Count each correct word as +1 point
      const correctWordCount = validation.filter(v => v).length

      const newCompletedLines = [...completedLines, {
        ...currentLine,
        userAnswer: selectedWords,
        validation: validation,
        isCorrect: true
      }]
      setCompletedLines(newCompletedLines)
      setScore(score + correctWordCount)

      // Move to next line or complete game
      if (currentLineIndex + 1 < dialogueLines.length) {
        setTimeout(() => {
          setCurrentLineIndex(currentLineIndex + 1)
          setSelectedWords([])
          setWordValidation([])
        }, 1000)
      } else {
        // Game complete!
        setTimeout(() => {
          setGameComplete(true)
          if (onComplete) {
            // Calculate total blanks for accurate max score
            const totalBlanksCount = dialogueLines.reduce((sum, line) => sum + (line.blanks?.length || 0), 0)
            const correctWordCount = validation.filter(v => v).length

            onComplete({
              score: score + correctWordCount,
              totalBlanks: totalBlanksCount,
              completed: true
            })
          }
        }, 1000)
      }
    } else {
      // Wrong answer - show which words are incorrect
      if (!hasRetried) {
        // First try failed - allow one retry
        setShowError(true)
        setHasRetried(true)
        setTimeout(() => {
          setShowError(false)
          setSelectedWords([])
          setWordValidation([])
        }, 1500)
      } else {
        // Second try also failed - move to next line with score 0
        setShowError(true)
        const newCompletedLines = [...completedLines, {
          ...currentLine,
          userAnswer: selectedWords,
          validation: validation,
          isCorrect: false
        }]
        setCompletedLines(newCompletedLines)

        setTimeout(() => {
          setShowError(false)
          setHasRetried(false)

          // Move to next line or complete game
          if (currentLineIndex + 1 < dialogueLines.length) {
            setCurrentLineIndex(currentLineIndex + 1)
            setSelectedWords([])
            setWordValidation([])
          } else {
            // Game complete!
            setGameComplete(true)
            if (onComplete) {
              onComplete({
                score: score,
                totalLines: dialogueLines.length - 1,
                completed: true
              })
            }
          }
        }, 1500)
      }
    }
  }

  const handleClear = () => {
    setSelectedWords([])
  }

  if (gameComplete) {
    const totalBlanksCount = dialogueLines.reduce((sum, line) => sum + (line.blanks?.length || 0), 0)
    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', backgroundColor: 'success.light' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="success.dark">
          🎉 Chat Challenge Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          You completed the dialogue!
        </Typography>
        <Typography variant="h4" color="success.dark" sx={{ mb: 2 }}>
          Score: {score} / {totalBlanksCount} words correct
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
          Moving to Task B...
        </Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
      {/* Progress */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: 'primary.light' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body1" fontWeight="bold" color="primary.dark">
            Dialogue Progress: {completedLines.length} / {dialogueLines.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(completedLines.length / dialogueLines.length) * 100}
            sx={{ flexGrow: 1, height: 10, borderRadius: 1 }}
          />
        </Stack>
      </Paper>

      {/* Completed Lines (Chat History) */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {completedLines.map((line, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 2,
              backgroundColor: line.speaker === 'You' ? 'info.light' : 'grey.100',
              border: '2px solid',
              borderColor: line.isCorrect === false ? 'error.main' : 'success.main'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <PersonIcon sx={{ color: line.speaker === 'You' ? 'info.dark' : 'text.secondary' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                  {line.speaker}:
                </Typography>
                <Typography variant="body1">
                  {line.blanks.length === 0 ? (
                    line.template
                  ) : (
                    line.template.split('[____]').map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < line.userAnswer.length && (
                          <span style={{
                            backgroundColor: line.validation && line.validation[i] === false ? '#f44336' : '#4caf50',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                          }}>
                            {line.userAnswer[i]}
                          </span>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </Typography>
              </Box>
              <CheckCircleIcon sx={{ color: line.isCorrect === false ? 'error.main' : 'success.main', ml: 'auto' }} />
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Current Line */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: showError ? '#ffebee' : (currentLine?.speaker === 'You' ? 'info.light' : 'grey.50'),
          border: '3px solid',
          borderColor: showError ? 'error.main' : 'primary.main',
          transition: 'all 0.3s ease'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <PersonIcon sx={{ color: currentLine?.speaker === 'You' ? 'info.dark' : 'text.secondary', fontSize: 30 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color={showError ? 'error.main' : 'primary.dark'}>
              {currentLine?.speaker}:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
              {currentLine?.template.split('[____]').map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < totalBlanks && (
                    <span style={{
                      display: 'inline-block',
                      minWidth: '100px',
                      padding: '4px 12px',
                      margin: '0 4px',
                      backgroundColor: showError
                        ? (wordValidation[i] === false ? '#f44336' : (wordValidation[i] === true ? '#4caf50' : '#e0e0e0'))
                        : (selectedWords[i] ? '#1976d2' : '#e0e0e0'),
                      color: selectedWords[i] || showError ? 'white' : '#666',
                      borderRadius: '8px',
                      border: showError && wordValidation[i] === false ? '2px solid #d32f2f' : '2px dashed #999',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      cursor: selectedWords[i] ? 'pointer' : 'default',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => selectedWords[i] && !showError && handleRemoveWord(i)}
                    >
                      {selectedWords[i] || '____'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </Typography>
            {showError && (
              <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                {!hasRetried ? '❌ Incorrect! Score: 0. Try again!' : '❌ Incorrect again! Score: 0. Moving to next question...'}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* Word Bank */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Word Bank - Click to fill blanks
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {wordBank.map((word, index) => (
            <Chip
              key={index}
              label={word}
              onClick={() => handleWordClick(word)}
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
              color={selectedWords.includes(word) ? 'primary' : 'default'}
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
          disabled={selectedWords.length === 0}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={selectedWords.length !== totalBlanks}
          size="large"
        >
          {selectedWords.length === totalBlanks ? 'Submit Answer' : `Fill ${totalBlanks - selectedWords.length} more blank(s)`}
        </Button>
      </Stack>

      {/* Locked Future Lines Preview */}
      {currentLineIndex < dialogueLines.length - 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Locked - Complete current line to unlock:
          </Typography>
          {dialogueLines.slice(currentLineIndex + 1).map((line, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                p: 2,
                mb: 1,
                backgroundColor: 'grey.200',
                opacity: 0.5
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <LockIcon sx={{ color: 'grey.500' }} />
                <Typography variant="body2" color="text.secondary">
                  {line.speaker}: {line.template.replace(/\[____\]/g, '____')}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ChatChallengeGame
