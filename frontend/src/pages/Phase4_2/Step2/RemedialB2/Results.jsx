import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

/**
 * Phase 4.2 Step 2 - Remedial B2 - Results Page
 * Shows final scores and pass/fail status
 * Tasks: A-D (4 tasks) = 40 points total, average to /10 scale
 * Pass threshold: 8/10 (80%)
 */

export default function RemedialB2Results() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({
    taskA: 0,
    taskB: 0,
    taskC: 0,
    taskD: 0,
    average: 0,
    passed: false
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
    // Get scores from sessionStorage (all out of 10)
    const taskAScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step2_b2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step2_b2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step2_b2_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('remedial_phase4_2_step2_b2_taskD_score') || '0')

    // Calculate average (all tasks are out of 10)
    const average = Math.round((taskAScore + taskBScore + taskCScore + taskDScore) / 4)
    const passed = average >= 8 // 8/10 = 80%

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4.2 STEP 2 - REMEDIAL B2 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Dialogue):', taskAScore, '/10')
    console.log('Task B (Writing):', taskBScore, '/10')
    console.log('Task C (Matching):', taskCScore, '/10')
    console.log('Task D (Spelling):', taskDScore, '/10')
    console.log('-'.repeat(60))
    console.log('AVERAGE SCORE:', average, '/10')
    console.log('PASS THRESHOLD: 8/10 (80%)')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to next phase')
    } else {
      console.log('❌ FAILED - Student will repeat Phase 4.2 Step 2 Remedial Level B2')
    }
    console.log('='.repeat(60) + '\n')

    setScores({
      taskA: taskAScore,
      taskB: taskBScore,
      taskC: taskCScore,
      taskD: taskDScore,
      average,
      passed
    })

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/remedial/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 2,
          level: 'B2',
          task_a_score: taskAScore,
          task_b_score: taskBScore,
          task_c_score: taskCScore,
          task_d_score: taskDScore,
          average_score: average,
          passed: passed
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Phase 4.2 Step 2 B2 Final score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    setLoading(false)
  }

  const handleRedirect = () => {
    // Clear B2 scores
    sessionStorage.removeItem('remedial_phase4_2_step2_b2_taskA_score')
    sessionStorage.removeItem('remedial_phase4_2_step2_b2_taskB_score')
    sessionStorage.removeItem('remedial_phase4_2_step2_b2_taskC_score')
    sessionStorage.removeItem('remedial_phase4_2_step2_b2_taskD_score')

    if (scores.passed) {
      navigate('/dashboard')
    } else {
      navigate('/phase4_2/step2/remedial/b2/taskA')
    }
  }

  const handleRedirectNow = () => {
    setCountdown(0)
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">Calculating your final score...</Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: scores.passed
            ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)'
            : 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4.2 - Step 2: Remedial Activities
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Final Results
        </Typography>
      </Paper>

      {/* Main Results Card */}
      <Paper
        elevation={8}
        sx={{
          p: 5,
          mb: 3,
          textAlign: 'center',
          background: scores.passed
            ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)'
            : 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
          color: 'white'
        }}
      >
        <EmojiEventsIcon sx={{ fontSize: 100, mb: 2 }} />

        <Typography variant="h3" gutterBottom fontWeight="bold">
          {scores.passed ? 'Congratulations!' : 'Keep Practicing!'}
        </Typography>

        <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 400, mx: 'auto', my: 3 }}>
          <Typography variant="h2" fontWeight="bold" sx={{
            color: scores.passed ? '#27ae60' : '#e67e22'
          }}>
            {scores.average} / 10
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Average Score
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Pass Threshold: 8/10 (80%)
          </Typography>
        </Paper>

        {scores.passed ? (
          <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)' }}>
            <Typography variant="h6">
              You have passed Phase 4.2 Step 2 Remedial B2!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Excellent work! You've mastered B2 level social media post planning skills with strong understanding of hashtags, captions, engagement strategies, and professional communication.
            </Typography>
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mt: 2, backgroundColor: 'rgba(230, 126, 34, 0.9)' }}>
            <Typography variant="h6">
              Score below passing threshold
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Don't worry! You'll restart from Task A to improve your B2-level social media post planning vocabulary and concepts.
            </Typography>
          </Alert>
        )}
      </Paper>

      {/* Detailed Score Breakdown */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#2c3e50' }}>
          Score Breakdown
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#ecf0f1', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>Task A: Role-Play Dialogue</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: scores.taskA >= 8 ? '#27ae60' : '#e67e22' }}>
              {scores.taskA} / 10
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#ecf0f1', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>Task B: Explain Expedition</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: scores.taskB >= 8 ? '#27ae60' : '#e67e22' }}>
              {scores.taskB} / 10
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#ecf0f1', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>Task C: Matching Game</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: scores.taskC >= 8 ? '#27ae60' : '#e67e22' }}>
              {scores.taskC} / 10
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#ecf0f1', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>Task D: Spell & Explain</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: scores.taskD >= 8 ? '#27ae60' : '#e67e22' }}>
              {scores.taskD} / 10
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, backgroundColor: '#34495e', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ color: 'white' }} fontWeight="bold">
              Average Score
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
              {scores.average} / 10
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Message from Instructor */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message={scores.passed
            ? "Outstanding achievement! You've successfully completed the B2 level remedial activities with excellent social media post planning skills. Your understanding of hashtags, captions, engagement strategies, viral content, and professional communication is impressive. You're ready for the next challenge!"
            : "Good effort! You're making progress, but let's work on strengthening your social media post planning skills. Remember to use the correct terms for hashtags, engagement, calls-to-action, and understand how different elements work together to create effective posts. Practice makes perfect - you'll do even better next time!"}
        />
      </Paper>

      {/* Countdown and Action */}
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {scores.passed ? 'Proceeding to dashboard...' : 'Restarting B2 remedial activities...'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Redirecting in {countdown} seconds
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(10 - countdown) * 10}
          sx={{
            height: 8,
            borderRadius: 1,
            mb: 2,
            backgroundColor: '#ecf0f1',
            '& .MuiLinearProgress-bar': {
              backgroundColor: scores.passed ? '#27ae60' : '#e67e22'
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleRedirectNow}
          sx={{
            background: scores.passed
              ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)'
              : 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
            '&:hover': {
              background: scores.passed
                ? 'linear-gradient(135deg, #229954 0%, #1e8449 100%)'
                : 'linear-gradient(135deg, #d35400 0%, #ba4a00 100%)'
            }
          }}
        >
          {scores.passed ? 'Go to Dashboard Now' : 'Restart Now'}
        </Button>
      </Paper>
    </Box>
  )
}
