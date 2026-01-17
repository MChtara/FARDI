import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Stack, LinearProgress } from '@mui/material'

/**
 * Phase 4 Step 4 - Remedial B2 - Results Page
 * Shows scores from all 4 tasks (A, B, C, D)
 * Total: 24 points (6+6+6+6)
 * Pass threshold: 20/24 (~83%)
 */

export default function RemedialB2Results() {
  const navigate = useNavigate()
  const [taskAScore, setTaskAScore] = useState(0)
  const [taskBScore, setTaskBScore] = useState(0)
  const [taskCScore, setTaskCScore] = useState(0)
  const [taskDScore, setTaskDScore] = useState(0)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Get scores from session storage
    const scoreA = parseInt(sessionStorage.getItem('remedial_step4_b2_taskA_score') || '0')
    const scoreB = parseInt(sessionStorage.getItem('remedial_step4_b2_taskB_score') || '0')
    const scoreC = parseInt(sessionStorage.getItem('remedial_step4_b2_taskC_score') || '0')
    const scoreD = parseInt(sessionStorage.getItem('remedial_step4_b2_taskD_score') || '0')

    setTaskAScore(scoreA)
    setTaskBScore(scoreB)
    setTaskCScore(scoreC)
    setTaskDScore(scoreD)

    const total = scoreA + scoreB + scoreC + scoreD
    const passed = total >= 20 // 20/24 = ~83%

    // Console log results
    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 4 - REMEDIAL B2 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Debate Simulation):', scoreA, '/6')
    console.log('Task B (Critique Game):', scoreB, '/6')
    console.log('Task C (Debate Grammar Game):', scoreC, '/6')
    console.log('Task D (Error Correction Game):', scoreD, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', total, '/24')
    console.log('PASS THRESHOLD: 20/24 (~83%)')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to dashboard')
    } else {
      console.log('❌ FAILED - Student will restart Remedial B2 from Task A')
    }
    console.log('='.repeat(60) + '\n')

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          // Clear B2 scores
          sessionStorage.removeItem('remedial_step4_b2_taskA_score')
          sessionStorage.removeItem('remedial_step4_b2_taskB_score')
          sessionStorage.removeItem('remedial_step4_b2_taskC_score')
          sessionStorage.removeItem('remedial_step4_b2_taskD_score')

          if (passed) {
            navigate('/app/dashboard')
          } else {
            navigate('/app/phase4/step/4/remedial/b2/taskA')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const total = taskAScore + taskBScore + taskCScore + taskDScore
  const passed = total >= 20
  const percentage = Math.round((total / 24) * 100)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Main Results Card */}
      <Paper
        elevation={8}
        sx={{
          p: 5,
          textAlign: 'center',
          background: passed
            ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
            : 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          {passed ? '🎉 Congratulations! 🎉' : '💪 Keep Practicing! 💪'}
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Phase 4 Step 4 - Remedial B2
        </Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, mb: 3 }}>
          Final Results
        </Typography>

        {/* Score Breakdown */}
        <Box sx={{ my: 4, p: 3, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Task A - Debate Simulation:</Typography>
              <Typography variant="h6" fontWeight="bold">{taskAScore} / 6</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(taskAScore / 6) * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': { backgroundColor: 'white' }
              }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Task B - Critique Game:</Typography>
              <Typography variant="h6" fontWeight="bold">{taskBScore} / 6</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(taskBScore / 6) * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': { backgroundColor: 'white' }
              }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Task C - Debate Grammar Game:</Typography>
              <Typography variant="h6" fontWeight="bold">{taskCScore} / 6</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(taskCScore / 6) * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': { backgroundColor: 'white' }
              }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Task D - Error Correction Game:</Typography>
              <Typography variant="h6" fontWeight="bold">{taskDScore} / 6</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(taskDScore / 6) * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': { backgroundColor: 'white' }
              }}
            />
          </Stack>
        </Box>

        {/* Total Score */}
        <Box sx={{ my: 4, p: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Total Score
          </Typography>
          <Typography variant="h2" fontWeight="bold">
            {total} / 24
          </Typography>
          <Typography variant="h5" sx={{ mt: 1 }}>
            ({percentage}%)
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
            Pass Threshold: 20 / 24 (~83%)
          </Typography>
        </Box>

        {/* Result Message */}
        {passed ? (
          <Box>
            <Typography variant="h6" sx={{ mt: 3 }}>
              ✅ You have passed Remedial B2!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Excellent work! You demonstrated advanced language skills with sophisticated vocabulary,
              nuanced argumentation, and mastery of complex grammar structures.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
              Proceeding to dashboard...
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mt: 3 }}>
              ❌ Score below passing threshold
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              You need more practice with B2-level skills: debate, critique, advanced grammar, and error correction.
              Review the feedback from each task and try again!
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
              Restarting Remedial B2 to help you improve...
            </Typography>
          </Box>
        )}

        {/* Countdown */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(countdown / 10) * 100}
            sx={{
              mt: 2,
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': { backgroundColor: 'white' }
            }}
          />
        </Box>
      </Paper>

      {/* Performance Breakdown */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Performance Analysis
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Task A - Debate Simulation ({taskAScore}/6)
            </Typography>
            <Typography variant="body2">
              {taskAScore >= 5 ? '✅ Excellent argumentation and vocabulary' :
               taskAScore >= 3 ? '⚠️ Good effort, but needs more nuanced reasoning' :
               '❌ Practice writing longer, more detailed responses with video references'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Task B - Critique Game ({taskBScore}/6)
            </Typography>
            <Typography variant="body2">
              {taskBScore >= 5 ? '✅ Excellent balanced critiques' :
               taskBScore >= 3 ? '⚠️ Good, but remember to show both strengths AND weaknesses' :
               '❌ Practice writing balanced critiques with connecting words (but, yet, although)'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Task C - Debate Grammar Game ({taskCScore}/6)
            </Typography>
            <Typography variant="body2">
              {taskCScore >= 5 ? '✅ Excellent grammar mastery' :
               taskCScore >= 3 ? '⚠️ Good, review subjunctives and modals' :
               '❌ Study subjunctives (It is crucial that...) and modals (should, must, might, could)'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Task D - Error Correction Game ({taskDScore}/6)
            </Typography>
            <Typography variant="body2">
              {taskDScore >= 5 ? '✅ Excellent error detection and correction' :
               taskDScore >= 3 ? '⚠️ Good, pay closer attention to subject-verb agreement and punctuation' :
               '❌ Practice identifying grammar errors: subject-verb agreement, missing words, punctuation'}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
