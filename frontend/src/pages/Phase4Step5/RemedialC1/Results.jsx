import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Box, Button, Paper, LinearProgress } from '@mui/material'
import Avatar from '../../../components/Avatar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5010/'

const Results = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  // Retrieve scores from session storage
  const taskAScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_c1_taskA_score')) || 0
  const taskBScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_c1_taskB_score')) || 0
  const taskCScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_c1_taskC_score')) || 0
  const taskDScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_c1_taskD_score')) || 0
  const taskEScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_c1_taskE_score')) || 0
  const taskFScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_c1_taskF_score')) || 0
  const taskGScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_c1_taskG_score')) || 0

  const totalScore = taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore + taskGScore
  const maxScore = 42 // 4 + 8 + 6 + 6 + 6 + 6 + 6
  const passingScore = 34 // 80% of 42
  const passed = totalScore >= passingScore

  useEffect(() => {
    // Log final results
    fetch(`${BASE_URL}api/phase4/step5/remedial/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        level: 'C1',
        task: 'Results',
        score: totalScore,
        maxScore: maxScore,
        passed: passed
      })
    }).catch(console.error)

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (passed) {
            navigate('/app/dashboard')
          } else {
            // Restart from Task A
            sessionStorage.removeItem('phase4_step5_remedial_c1_taskA_score')
            sessionStorage.removeItem('phase4_step5_remedial_c1_taskB_score')
            sessionStorage.removeItem('phase4_step5_remedial_c1_taskC_score')
            sessionStorage.removeItem('phase4_step5_remedial_c1_taskD_score')
            sessionStorage.removeItem('phase4_step5_remedial_c1_taskE_score')
            sessionStorage.removeItem('phase4_step5_remedial_c1_taskF_score')
            sessionStorage.removeItem('phase4_step5_remedial_c1_taskG_score')
            navigate('/app/phase4/step/5/remedial/c1/taskA')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [passed, navigate])

  const handleContinue = () => {
    if (passed) {
      navigate('/app/dashboard')
    } else {
      sessionStorage.removeItem('phase4_step5_remedial_c1_taskA_score')
      sessionStorage.removeItem('phase4_step5_remedial_c1_taskB_score')
      sessionStorage.removeItem('phase4_step5_remedial_c1_taskC_score')
      sessionStorage.removeItem('phase4_step5_remedial_c1_taskD_score')
      sessionStorage.removeItem('phase4_step5_remedial_c1_taskE_score')
      sessionStorage.removeItem('phase4_step5_remedial_c1_taskF_score')
      sessionStorage.removeItem('phase4_step5_remedial_c1_taskG_score')
      navigate('/app/phase4/step/5/remedial/c1/taskA')
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: passed
            ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
            : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          minHeight: '70vh',
          textAlign: 'center'
        }}
      >
        <Box sx={{ mb: 3 }}>
          {passed ? (
            <CheckCircleIcon sx={{ fontSize: 80, color: 'white' }} />
          ) : (
            <CancelIcon sx={{ fontSize: 80, color: 'white' }} />
          )}
        </Box>

        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          {passed ? 'Congratulations!' : 'Keep Trying!'}
        </Typography>

        <Typography variant="h5" sx={{ mb: 4 }}>
          C1 Remedial Activities Complete
        </Typography>

        <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(255,255,255,0.2)' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Final Score: {totalScore}/{maxScore}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(totalScore / maxScore) * 100}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                bgcolor: passed ? '#f1c40f' : 'white'
              }
            }}
          />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Passing Score: {passingScore}/{maxScore} (80%)
          </Typography>
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Task Breakdown:
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }}>
            <Typography>Task A: Debate Dominion - {taskAScore}/4</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }}>
            <Typography>Task B: Analysis Odyssey - {taskBScore}/8</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }}>
            <Typography>Task C: Quizlet Live - {taskCScore}/6</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }}>
            <Typography>Task D: Tense Odyssey - {taskDScore}/6</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }}>
            <Typography>Task E: Clause Conquest - {taskEScore}/6</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }}>
            <Typography>Task F: Debate Duel Advanced - {taskFScore}/6</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }}>
            <Typography>Task G: Correction Crusade - {taskGScore}/6</Typography>
          </Paper>
        </Box>

        <Avatar
          message={
            passed
              ? 'Outstanding! You have mastered C1-level skills. Ready for the dashboard!'
              : 'You need more practice. Let\'s try again from the beginning!'
          }
          type={passed ? 'success' : 'error'}
        />

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Redirecting in {countdown} seconds...
          </Typography>
          <Button
            variant="contained"
            onClick={handleContinue}
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              color: passed ? '#27ae60' : '#c0392b',
              '&:hover': { bgcolor: 'white' },
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            {passed ? 'Go to Dashboard' : 'Retry from Task A'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default Results
