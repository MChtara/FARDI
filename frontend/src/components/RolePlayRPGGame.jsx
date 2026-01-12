import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Chip, Stack, Button, LinearProgress, Avatar, Card, CardContent } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import StarIcon from '@mui/icons-material/Star'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

/**
 * Role-Play RPG Game Component
 * Advanced dialogue completion with RPG character leveling mechanics
 * Players "level up" their character by using correct terms in role-play scenarios
 */

const RolePlayRPGGame = ({
  dialogueLines = [],
  wordBank = [],
  onComplete,
  characterName = "Marketing Expert",
  scenario = "Marketing Campaign Discussion"
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [selectedWords, setSelectedWords] = useState([])
  const [completedLines, setCompletedLines] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [showError, setShowError] = useState(false)
  const [hasRetried, setHasRetried] = useState(false)
  const [wordValidation, setWordValidation] = useState([])
  const [characterLevel, setCharacterLevel] = useState(1)
  const [experiencePoints, setExperiencePoints] = useState(0)

  const currentLine = dialogueLines[currentLineIndex]
  const totalBlanks = currentLine?.blanks?.length || 0
  const maxLevel = dialogueLines.filter(line => line.blanks.length > 0).length
  const xpPerLevel = 100

  // Calculate level based on XP
  useEffect(() => {
    const newLevel = Math.min(Math.floor(experiencePoints / xpPerLevel) + 1, maxLevel)
    setCharacterLevel(newLevel)
  }, [experiencePoints, maxLevel])

  // Auto-complete lines with no blanks
  useEffect(() => {
    if (currentLine && totalBlanks === 0 && !gameComplete) {
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
          setTimeout(() => {
            setGameComplete(true)
            if (onComplete) {
              onComplete({
                score: score,
                totalLines: dialogueLines.length,
                level: characterLevel,
                experiencePoints: experiencePoints,
                completed: true
              })
            }
          }, 500)
        }
      }
    }
  }, [currentLineIndex, currentLine, totalBlanks, completedLines, dialogueLines.length, gameComplete, onComplete, score, characterLevel, experiencePoints])

  const handleWordClick = (word) => {
    if (selectedWords.length < totalBlanks && !showError) {
      setSelectedWords([...selectedWords, word])
    }
  }

  const handleRemoveWord = (index) => {
    if (!showError) {
      setSelectedWords(selectedWords.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    // Validate each word individually
    const validation = selectedWords.map((word, index) =>
      word.toLowerCase() === currentLine.blanks[index].toLowerCase()
    )
    setWordValidation(validation)

    const isCorrect = validation.every(v => v)

    if (isCorrect) {
      // Correct! Award XP and level up
      const xpGained = 100
      setExperiencePoints(experiencePoints + xpGained)
      setShowError(false)
      setHasRetried(false)

      const newCompletedLines = [...completedLines, {
        ...currentLine,
        userAnswer: selectedWords,
        validation: validation,
        isCorrect: true,
        xpGained: xpGained
      }]
      setCompletedLines(newCompletedLines)
      setScore(score + 1)

      // Move to next line or complete game
      if (currentLineIndex + 1 < dialogueLines.length) {
        setTimeout(() => {
          setCurrentLineIndex(currentLineIndex + 1)
          setSelectedWords([])
          setWordValidation([])
        }, 1500)
      } else {
        setTimeout(() => {
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              score: score + 1,
              totalLines: dialogueLines.filter(l => l.blanks.length > 0).length,
              level: characterLevel,
              experiencePoints: experiencePoints + xpGained,
              completed: true
            })
          }
        }, 1500)
      }
    } else {
      // Wrong answer
      if (!hasRetried) {
        setShowError(true)
        setHasRetried(true)
        setTimeout(() => {
          setShowError(false)
          setSelectedWords([])
          setWordValidation([])
        }, 2000)
      } else {
        setShowError(true)
        const newCompletedLines = [...completedLines, {
          ...currentLine,
          userAnswer: selectedWords,
          validation: validation,
          isCorrect: false,
          xpGained: 0
        }]
        setCompletedLines(newCompletedLines)

        setTimeout(() => {
          setShowError(false)
          setHasRetried(false)

          if (currentLineIndex + 1 < dialogueLines.length) {
            setCurrentLineIndex(currentLineIndex + 1)
            setSelectedWords([])
            setWordValidation([])
          } else {
            setGameComplete(true)
            if (onComplete) {
              onComplete({
                score: score,
                totalLines: dialogueLines.filter(l => l.blanks.length > 0).length,
                level: characterLevel,
                experiencePoints: experiencePoints,
                completed: true
              })
            }
          }
        }, 2000)
      }
    }
  }

  const handleClear = () => {
    setSelectedWords([])
  }

  if (gameComplete) {
    const totalQuestionsWithBlanks = dialogueLines.filter(line => line.blanks.length > 0).length
    const finalLevel = Math.min(Math.floor(experiencePoints / xpPerLevel) + 1, maxLevel)

    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ color: 'white' }}>
          <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: '#ffd700' }} />
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Quest Complete!
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            You've mastered the role-play dialogue!
          </Typography>

          <Card sx={{ maxWidth: 500, mx: 'auto', mb: 3, backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Final Character Level
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {[...Array(finalLevel)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#ffd700', fontSize: 40 }} />
                    ))}
                  </Stack>
                  <Typography variant="h4" color="primary.dark" fontWeight="bold">
                    Level {finalLevel}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Score
                  </Typography>
                  <Typography variant="h3" color="success.dark" fontWeight="bold">
                    {score} / {totalQuestionsWithBlanks}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Experience Points
                  </Typography>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {experiencePoints} XP
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
            You're now a certified {characterName}!
          </Typography>
        </Box>
      </Paper>
    )
  }

  const currentXP = experiencePoints % xpPerLevel
  const xpProgress = (currentXP / xpPerLevel) * 100

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* RPG Character Status Panel */}
      <Paper elevation={4} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
          {/* Character Avatar */}
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#ffd700', mb: 1 }}>
              <PersonIcon sx={{ fontSize: 50, color: '#764ba2' }} />
            </Avatar>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
              {characterName}
            </Typography>
          </Box>

          {/* Level & XP */}
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#ffd700' }}>
                Level {characterLevel}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                {[...Array(maxLevel)].map((_, i) => (
                  <StarIcon
                    key={i}
                    sx={{
                      color: i < characterLevel ? '#ffd700' : 'rgba(255,255,255,0.3)',
                      fontSize: 24
                    }}
                  />
                ))}
              </Stack>
            </Stack>

            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Experience: {currentXP} / {xpPerLevel} XP
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {xpProgress.toFixed(0)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={xpProgress}
                sx={{
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ffd700'
                  }
                }}
              />
            </Box>
          </Box>

          {/* Dialogue Progress */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
              Quest Progress
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#ffd700' }}>
              {completedLines.length} / {dialogueLines.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(completedLines.length / dialogueLines.length) * 100}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4caf50'
                }
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Scenario Context */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'info.light' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="info.dark">
          Scenario: {scenario}
        </Typography>
      </Paper>

      {/* Completed Lines (Dialogue History) */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {completedLines.map((line, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              p: 2.5,
              backgroundColor: line.speaker === 'You' ? 'info.light' : 'grey.100',
              border: '2px solid',
              borderColor: line.isCorrect === false ? 'error.main' : 'success.main',
              position: 'relative'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar sx={{
                bgcolor: line.speaker === 'You' ? 'info.dark' : 'grey.500',
                width: 40,
                height: 40
              }}>
                <PersonIcon />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary" gutterBottom>
                  {line.speaker}
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
                {line.isCorrect && line.xpGained > 0 && (
                  <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 'bold', mt: 1, display: 'block' }}>
                    +{line.xpGained} XP earned!
                  </Typography>
                )}
              </Box>
              <CheckCircleIcon sx={{
                color: line.isCorrect === false ? 'error.main' : 'success.main',
                fontSize: 28
              }} />
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Current Line - Active Role-Play */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 3,
          backgroundColor: showError ? '#ffebee' : (currentLine?.speaker === 'You' ? 'info.light' : 'grey.50'),
          border: '3px solid',
          borderColor: showError ? 'error.main' : 'primary.main',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
      >
        {currentLine?.speaker === 'You' && (
          <Box sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'primary.main',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 2
          }}>
            <Typography variant="caption" fontWeight="bold">
              YOUR TURN
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar sx={{
            bgcolor: currentLine?.speaker === 'You' ? 'info.dark' : 'grey.500',
            width: 48,
            height: 48
          }}>
            <PersonIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color={showError ? 'error.main' : 'primary.dark'}>
              {currentLine?.speaker}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.15rem', lineHeight: 1.8 }}>
              {currentLine?.template.split('[____]').map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < totalBlanks && (
                    <span style={{
                      display: 'inline-block',
                      minWidth: '120px',
                      padding: '6px 14px',
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
              <Box sx={{
                mt: 2,
                p: 2,
                backgroundColor: 'error.light',
                borderRadius: 2,
                border: '2px solid',
                borderColor: 'error.main'
              }}>
                <Typography variant="body1" color="error.dark" fontWeight="bold">
                  {!hasRetried
                    ? 'Incorrect! Try again to level up!'
                    : 'Incorrect again! No XP gained. Moving to next dialogue...'}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* Word Bank */}
      <Paper elevation={4} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50', border: '2px solid', borderColor: 'primary.light' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.dark">
          Marketing Terms - Choose wisely to level up!
        </Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {wordBank.map((word, index) => (
            <Chip
              key={index}
              label={word}
              onClick={() => handleWordClick(word)}
              sx={{
                fontSize: '1.05rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                px: 2.5,
                py: 1.5,
                height: 'auto',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease'
                }
              }}
              color={selectedWords.includes(word) ? 'primary' : 'default'}
            />
          ))}
        </Stack>
      </Paper>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClear}
          disabled={selectedWords.length === 0 || showError}
          size="large"
        >
          Clear Selection
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={selectedWords.length !== totalBlanks || showError}
          size="large"
          sx={{ px: 4 }}
        >
          {selectedWords.length === totalBlanks
            ? 'Submit & Level Up!'
            : `Select ${totalBlanks - selectedWords.length} more term(s)`}
        </Button>
      </Stack>

      {/* Locked Future Dialogues */}
      {currentLineIndex < dialogueLines.length - 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom fontWeight="bold">
            Upcoming Dialogues (Complete current to unlock):
          </Typography>
          {dialogueLines.slice(currentLineIndex + 1, currentLineIndex + 3).map((line, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                p: 2,
                mb: 1,
                backgroundColor: 'grey.200',
                opacity: 0.6
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

export default RolePlayRPGGame
