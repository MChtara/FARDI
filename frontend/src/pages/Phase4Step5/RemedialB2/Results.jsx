import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Alert, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

/**
 * Phase 4 Step 5 - Remedial B2 - Results Page
 * Shows final scores and pass/fail status
 * Tasks A-F = 46 points total (6+8+8+12+6+6)
 * Pass threshold: 37/46 (80%)
 */

export default function Phase4Step5RemedialB2Results() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({
    taskA: 0,
    taskB: 0,
    taskC: 0,
    taskD: 0,
    taskE: 0,
    taskF: 0,
    total: 0,
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
    // Get scores from sessionStorage
    const taskAScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('phase4_step5_remedial_b2_taskF_score') || '0')

    const total = taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore
    const passed = total >= 37 // 37/46 = 80%

    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 5 - REMEDIAL B2 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Role-Play Saga):', taskAScore, '/6')
    console.log('Task B (Analysis Odyssey):', taskBScore, '/8')
    console.log('Task C (Kahoot Match):', taskCScore, '/8')
    console.log('Task D (Spell Quest):', taskDScore, '/12')
    console.log('Task E (Conditional Challenge):', taskEScore, '/6')
    console.log('Task F (Grammar Role-Quest):', taskFScore, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', total, '/46')
    console.log('PASS THRESHOLD: 37/46 (80%)')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to dashboard/next phase')
    } else {
      console.log('❌ FAILED - Student will repeat Step 5 Remedial Level B2')
    }
    console.log('='.repeat(60) + '\n')

    setScores({
      taskA: taskAScore,
      taskB: taskBScore,
      taskC: taskCScore,
      taskD: taskDScore,
      taskE: taskEScore,
      taskF: taskFScore,
      total,
      passed
    })

    // Log final score to backend
    try {
      const response = await fetch('/api/phase4/step5/remedial/b2/final-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          task_a_score: taskAScore,
          task_b_score: taskBScore,
          task_c_score: taskCScore,
          task_d_score: taskDScore,
          task_e_score: taskEScore,
          task_f_score: taskFScore
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Step 5 B2 Final score logged to backend:', data.data)
      }
    } catch (error) {
      console.error('Failed to log final score:', error)
    }

    setLoading(false)
  }

  const handleRedirect = () => {
    // Clear B2 scores
    sessionStorage.removeItem('phase4_step5_remedial_b2_taskA_score')
    sessionStorage.removeItem('phase4_step5_remedial_b2_taskB_score')
    sessionStorage.removeItem('phase4_step5_remedial_b2_taskC_score')
    sessionStorage.removeItem('phase4_step5_remedial_b2_taskD_score')
    sessionStorage.removeItem('phase4_step5_remedial_b2_taskE_score')
    sessionStorage.removeItem('phase4_step5_remedial_b2_taskF_score')

    if (scores.passed) {
      navigate('/app/dashboard')
    } else {
      navigate('/app/phase4/step/5/remedial/b2/taskA')
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
          Phase 4 Step 5: Evaluate - Remedial Practice
        </Typography>
        <Typography variant="h5" gutterBottom>
          Level B2 - Final Results 🏆
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
          {scores.passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
        </Typography>

        <Paper elevation={4} sx={{ p: 4, backgroundColor: 'white', maxWidth: 400, mx: 'auto', my: 3 }}>
          <Typography variant="h2" fontWeight="bold" sx={{
            color: scores.passed ? '#27ae60' : '#e67e22'
          }}>
            {scores.total} / 46
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Total Points
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Pass Threshold: 37/46 (80%)
          </Typography>
        </Paper>

        {scores.passed ? (
          <Alert severity="success" sx={{ mt: 2, backgroundColor: 'rgba(46, 204, 113, 0.9)', '& .MuiAlert-message': { color: '#1a252f' } }}>
            <Typography variant="h6" sx={{ color: '#1a252f' }}>
              ✅ You have passed Step 5 Remedial B2!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: '#2c3e50' }}>
              Excellent work! You've mastered B2-level evaluation skills with advanced grammar, conditionals, passive voice, and essay writing.
            </Typography>
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mt: 2, backgroundColor: 'rgba(230, 126, 34, 0.9)', '& .MuiAlert-message': { color: '#1a252f' } }}>
            <Typography variant="h6" sx={{ color: '#1a252f' }}>
              ❌ Score below passing threshold
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: '#2c3e50' }}>
              Don't worry! You'll restart from Task A to improve your B2-level evaluation and grammar skills.
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
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>Task A: Role-Play Saga 🎭</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: scores.taskA >= 5 ? '#27ae60' : '#e67e22' }}>
              {scores.taskA} / 6
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#ecf0f1', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>Task B: Analysis Odyssey 📝</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: scores.taskB >= 7 ? '#27ae60' : '#e67e22' }}>
              {scores.taskB} / 8
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#ecf0f1', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>Task C: Kahoot Match 🎮</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: scores.taskC >= 7 ? '#27ae60' : '#e67e22' }}>
              {scores.taskC} / 8
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#ecf0f1', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>Task D: Spell Quest 📝</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: scores.taskD >= 10 ? '#27ae60' : '#e67e22' }}>
              {scores.taskD} / 12
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#ecf0f1', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>Task E: Conditional Challenge 🎯</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: scores.taskE >= 5 ? '#27ae60' : '#e67e22' }}>
              {scores.taskE} / 6
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#ecf0f1', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: '#2c3e50' }}>Task F: Grammar Role-Quest 🎭</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: scores.taskF >= 5 ? '#27ae60' : '#e67e22' }}>
              {scores.taskF} / 6
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, backgroundColor: '#34495e', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>Total Score</Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
              {scores.total} / 46
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Message from Instructor */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="LILIA"
          message={scores.passed
            ? "Fantastic work! 🌟 You've successfully completed the B2 level remedial activities for evaluating advertising materials. Your mastery of essay writing, conditionals, passive voice, and advanced vocabulary is excellent. You're ready to move forward!"
            : "Good effort! 💪 You've made progress with B2-level grammar and writing, but let's practice a bit more to strengthen your skills. Focus on conditionals, passive voice, and essay coherence. Review the content and try again!"}
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
