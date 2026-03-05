import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { phase5API } from '../../../lib/phase5_api.jsx'

/**
 * Phase 5 Step 2 - Remedial B1 - Results Page
 * Shows final scores and pass/fail status
 * All 3 tasks: A, B, C = 8 points total
 * Pass threshold: 6/8 (75%)
 */

export default function Phase5Step2RemedialB1Results() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({
    taskA: 0, taskB: 0, taskC: 0,
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
    const taskAScore = parseInt(sessionStorage.getItem('phase5_step2_remedial_b1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase5_step2_remedial_b1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase5_step2_remedial_b1_taskC_score') || '0')

    const total = taskAScore + taskBScore + taskCScore
    const passed = total >= 6 // 6/8 = 75%

    setScores({ taskA: taskAScore, taskB: taskBScore, taskC: taskCScore, total, passed })
    setLoading(false)

    try {
      await phase5API.logRemedialActivity(2, 'B1', 'final', total, {
        task_a_score: taskAScore, task_b_score: taskBScore, task_c_score: taskCScore
      })
    } catch (error) {
      console.error('Failed to log final score:', error)
    }
  }

  const handleRedirect = () => {
    if (scores.passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase5/step2/remedial-b1/task-a')
    }
  }

  if (loading) return <Box sx={{ textAlign: 'center', p: 4 }}><Typography>Loading results...</Typography></Box>

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Remedial Practice - Level B1</Typography>
        <Typography variant="h6" gutterBottom>Final Results</Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 3, backgroundColor: scores.passed ? 'success.lighter' : 'error.lighter', textAlign: 'center' }}>
        <EmojiEventsIcon sx={{ fontSize: 60, color: scores.passed ? 'success.main' : 'error.main', mb: 2 }} />
        <Typography variant="h4" color={scores.passed ? 'success.dark' : 'error.dark'} gutterBottom>
          {scores.passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
        </Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>Total Score: {scores.total} / 8</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>Pass Threshold: 6/8 (75%)</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Task Breakdown:</Typography>
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Box><Typography>Task A (Negotiation Simulator): {scores.taskA} / 4</Typography><LinearProgress variant="determinate" value={(scores.taskA/4)*100} /></Box>
          <Box><Typography>Task B (Instruction Builder): {scores.taskB} / 6</Typography><LinearProgress variant="determinate" value={(scores.taskB/6)*100} /></Box>
          <Box><Typography>Task C (Wordshake Quiz): {scores.taskC} / 6</Typography><LinearProgress variant="determinate" value={(scores.taskC/6)*100} /></Box>
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
