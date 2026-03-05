import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { phase5API } from '../../../lib/phase5_api.jsx'

/**
 * Phase 5 Step 1 - Remedial B1 - Results Page
 * Shows final scores and pass/fail status
 * All 6 tasks: A-F = 37 points total (5+8+6+8+6+6)
 * Pass threshold: 30/37 (80%)
 */

export default function Phase5Step1RemedialB1Results() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({
    taskA: 0, taskB: 0, taskC: 0, taskD: 0, taskE: 0, taskF: 0,
    total: 0, passed: false
  })
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    calculateFinalScore()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      handleRedirect()
    }
  }, [countdown])

  const calculateFinalScore = async () => {
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('phase5_step1_remedial_b1_taskF_score') || '0')

    const total = taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore
    const passed = total >= 30 // 30/37 = 80%

    setScores({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, taskD: taskDScore, taskE: taskEScore, taskF: taskFScore, total, passed })
    setLoading(false)

    try {
      await phase5API.calculateRemedialScore(1, 'B1', {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore,
        task_d_score: taskDScore, task_e_score: taskEScore, task_f_score: taskFScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }
  }

  const handleRedirect = () => {
    if (scores.passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/subphase/1/step/1/remedial/b1/task/a')
    }
  }

  if (loading) return <Box sx={{ textAlign: 'center', p: 4 }}><Typography>Loading results...</Typography></Box>

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 1: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Final Results</Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: scores.passed ? 'success.lighter' : 'error.lighter', textAlign: 'center' }}>
        <EmojiEventsIcon sx={{ fontSize: 60, color: scores.passed ? 'success.main' : 'error.main', mb: 2 }} />
        <Typography variant="h4" color={scores.passed ? 'success.dark' : 'error.dark'} gutterBottom>
          {scores.passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
        </Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>Total Score: {scores.total} / 37</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>Pass Threshold: 30/37 (80%)</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Task Breakdown:</Typography>
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Box><Typography>Task A (Negotiation): {scores.taskA} / 5</Typography><LinearProgress variant="determinate" value={(scores.taskA/5)*100} /></Box>
          <Box><Typography>Task B (Proposals): {scores.taskB} / 8</Typography><LinearProgress variant="determinate" value={(scores.taskB/8)*100} /></Box>
          <Box><Typography>Task C (Quiz): {scores.taskC} / 6</Typography><LinearProgress variant="determinate" value={(scores.taskC/6)*100} /></Box>
          <Box><Typography>Task D (Flashcards): {scores.taskD} / 8</Typography><LinearProgress variant="determinate" value={(scores.taskD/8)*100} /></Box>
          <Box><Typography>Task E (Past Tense): {scores.taskE} / 6</Typography><LinearProgress variant="determinate" value={(scores.taskE/6)*100} /></Box>
          <Box><Typography>Task F (Grammar): {scores.taskF} / 6</Typography><LinearProgress variant="determinate" value={(scores.taskF/6)*100} /></Box>
        </Stack>
      </Paper>

      <Alert severity={scores.passed ? 'success' : 'warning'} sx={{ mb: 3 }}>
        {scores.passed 
          ? 'You will proceed to the dashboard. Great work!'
          : `Redirecting to repeat B1 remedial in ${countdown} seconds...`}
      </Alert>

      <Button variant="contained" color={scores.passed ? 'success' : 'primary'} onClick={handleRedirect} size="large" fullWidth>
        {scores.passed ? 'Continue to Dashboard' : 'Retry B1 Remedial'}
      </Button>
    </Box>
  )
}
