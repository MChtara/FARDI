import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Button, Stack, LinearProgress, Grid, Avatar } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TimerIcon from '@mui/icons-material/Timer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

/**
 * Kahoot-Inspired Quiz Game Component
 * Competitive quiz with AI peers, colorful answers, timer, and leaderboard
 * Inspired by Kahoot's engaging quiz format
 */

const KahootQuizGame = ({
  questions = [],
  onComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20) // 20 seconds per question
  const [userPoints, setUserPoints] = useState(0)
  const [aiPeers, setAiPeers] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState([])

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  // Kahoot-style answer colors
  const answerColors = [
    { bg: '#e21b3c', hover: '#c41230' }, // Red
    { bg: '#1368ce', hover: '#0f5ab0' }, // Blue
    { bg: '#d89e00', hover: '#b88400' }, // Yellow
    { bg: '#26890c', hover: '#1e6d0a' }  // Green
  ]

  // Generate AI peers with random names
  useEffect(() => {
    const names = ['Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa']
    const peers = names.map(name => ({
      name,
      points: 0,
      avatar: name[0]
    }))
    setAiPeers(peers)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!showResult && !gameComplete && currentQuestion) {
      setTimeLeft(20) // Reset timer for new question

      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up! Auto-submit wrong answer
            clearInterval(timer)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentQuestionIndex, showResult, gameComplete])

  const handleTimeUp = () => {
    // Time ran out - mark as incorrect
    setShowResult(true)
    simulateAiAnswers(false)

    setTimeout(() => {
      moveToNextQuestion()
    }, 3000)
  }

  const handleAnswerClick = (answerIndex) => {
    if (showResult || selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === currentQuestion.correctIndex

    // Calculate points based on speed (Kahoot-style)
    const speedBonus = Math.floor((timeLeft / 20) * 500)
    const points = isCorrect ? 1000 + speedBonus : 0

    if (isCorrect) {
      setScore(score + 1)
      setUserPoints(userPoints + points)
    }

    setShowResult(true)

    // Add to answered questions
    setAnsweredQuestions([...answeredQuestions, {
      question: currentQuestion.question,
      selectedAnswer: currentQuestion.answers[answerIndex],
      correctAnswer: currentQuestion.answers[currentQuestion.correctIndex],
      isCorrect: isCorrect,
      explanation: currentQuestion.explanation,
      points: points
    }])

    // Simulate AI peer answers
    simulateAiAnswers(isCorrect)

    setTimeout(() => {
      moveToNextQuestion()
    }, 3000)
  }

  const simulateAiAnswers = (userWasCorrect) => {
    // Make AI peers answer with varying success
    const updatedPeers = aiPeers.map(peer => {
      const correctChance = 0.6 // 60% chance AI gets it right
      const aiCorrect = Math.random() < correctChance
      const aiSpeed = Math.random() * 20
      const aiPoints = aiCorrect ? 1000 + Math.floor((aiSpeed / 20) * 500) : 0

      return {
        ...peer,
        points: peer.points + aiPoints,
        lastCorrect: aiCorrect
      }
    })

    setAiPeers(updatedPeers)
  }

  const moveToNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // Game complete
      setGameComplete(true)
      if (onComplete) {
        onComplete({
          score: score,
          totalQuestions: totalQuestions,
          points: userPoints,
          answeredQuestions: answeredQuestions,
          completed: true
        })
      }
    }
  }

  // Leaderboard (sorted by points)
  const getLeaderboard = () => {
    const allPlayers = [
      { name: 'You', points: userPoints, avatar: '👤', isUser: true },
      ...aiPeers
    ]
    return allPlayers.sort((a, b) => b.points - a.points)
  }

  if (gameComplete) {
    const leaderboard = getLeaderboard()
    const userRank = leaderboard.findIndex(p => p.isUser) + 1

    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ color: 'white' }}>
          <EmojiEventsIcon sx={{ fontSize: 100, mb: 2, color: '#ffd700' }} />
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Quiz Complete!
          </Typography>
          <Typography variant="h5" sx={{ mb: 1 }}>
            You scored {score} / {totalQuestions}
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Total Points: {userPoints.toLocaleString()}
          </Typography>
          <Typography variant="h4" sx={{ mb: 4 }}>
            You placed #{userRank} out of {leaderboard.length}!
          </Typography>

          {/* Final Leaderboard */}
          <Paper elevation={4} sx={{ p: 3, backgroundColor: 'white', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
              Final Leaderboard
            </Typography>
            <Stack spacing={1}>
              {leaderboard.map((player, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1.5,
                    backgroundColor: player.isUser ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: 1,
                    border: player.isUser ? '2px solid #1976d2' : 'none'
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight="bold" color={index < 3 ? '#ffd700' : 'text.secondary'}>
                        #{index + 1}
                      </Typography>
                      <Typography variant="body1" fontWeight={player.isUser ? 'bold' : 'normal'}>
                        {player.avatar} {player.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      {player.points.toLocaleString()}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      {/* Kahoot-style Header */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #46178f 0%, #e21b3c 100%)',
          color: 'white'
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </Typography>

          {/* Timer */}
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <TimerIcon sx={{ fontSize: 30 }} />
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  color: timeLeft <= 5 ? '#ff5252' : 'white',
                  animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.15)' }
                  }
                }}
              >
                {timeLeft}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(timeLeft / 20) * 100}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: timeLeft <= 5 ? '#ff5252' : '#4caf50'
                }
              }}
            />
          </Box>

          <Typography variant="h6" fontWeight="bold">
            Points: {userPoints.toLocaleString()}
          </Typography>
        </Stack>
      </Paper>

      {/* Main Question Area */}
      <Box>
          {/* Question Display */}
          <Paper
            elevation={6}
            sx={{
              p: 4,
              mb: 3,
              minHeight: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#46178f',
              color: 'white'
            }}
          >
            <Typography variant="h4" fontWeight="bold" align="center">
              {currentQuestion?.question}
            </Typography>
          </Paper>

          {/* Answer Options - Kahoot Style */}
          <Grid container spacing={2}>
            {currentQuestion?.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.correctIndex
              const showCorrect = showResult && isCorrect
              const showIncorrect = showResult && isSelected && !isCorrect

              return (
                <Grid item xs={12} sm={6} key={index}>
                  <Button
                    fullWidth
                    onClick={() => handleAnswerClick(index)}
                    disabled={showResult}
                    sx={{
                      py: 4,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      backgroundColor: showCorrect
                        ? '#4caf50'
                        : showIncorrect
                        ? '#f44336'
                        : answerColors[index].bg,
                      color: 'white',
                      border: '4px solid white',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: showResult
                          ? undefined
                          : answerColors[index].hover,
                        transform: showResult ? 'none' : 'scale(1.02)'
                      },
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Stack spacing={1} alignItems="center">
                      {showCorrect && <CheckCircleIcon sx={{ fontSize: 40 }} />}
                      {showIncorrect && <CancelIcon sx={{ fontSize: 40 }} />}
                      <Typography variant="h6" fontWeight="bold">
                        {answer}
                      </Typography>
                    </Stack>
                  </Button>
                </Grid>
              )
            })}
          </Grid>

          {/* Explanation */}
          {showResult && (
            <Paper
              elevation={4}
              sx={{
                p: 3,
                mt: 3,
                backgroundColor: selectedAnswer === currentQuestion.correctIndex ? '#e8f5e9' : '#ffebee'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#000000' }}>
                {selectedAnswer === currentQuestion.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#000000' }}>
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </Typography>
            </Paper>
          )}
      </Box>
    </Box>
  )
}

export default KahootQuizGame
