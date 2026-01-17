import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Stack, LinearProgress } from '@mui/material'

/**
 * Phase 4 Step 4 - Remedial C1 - Results Page
 * Shows scores from all 4 tasks (A, B, C, D)
 * Total: 26 points (8+6+6+6)
 * Pass threshold: 21/26 (80%)
 */

export default function RemedialC1Results() {
  const navigate = useNavigate()
  const [taskAScore, setTaskAScore] = useState(0)
  const [taskBScore, setTaskBScore] = useState(0)
  const [taskCScore, setTaskCScore] = useState(0)
  const [taskDScore, setTaskDScore] = useState(0)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Get scores from session storage
    const scoreA = parseInt(sessionStorage.getItem('remedial_step4_c1_taskA_score') || '0')
    const scoreB = parseInt(sessionStorage.getItem('remedial_step4_c1_taskB_score') || '0')
    const scoreC = parseInt(sessionStorage.getItem('remedial_step4_c1_taskC_score') || '0')
    const scoreD = parseInt(sessionStorage.getItem('remedial_step4_c1_taskD_score') || '0')

    setTaskAScore(scoreA)
    setTaskBScore(scoreB)
    setTaskCScore(scoreC)
    setTaskDScore(scoreD)

    const total = scoreA + scoreB + scoreC + scoreD
    const passed = total >= 21 // 21/26 = 80%

    // Console log results
    console.log('\n' + '='.repeat(60))
    console.log('PHASE 4 STEP 4 - REMEDIAL C1 - FINAL RESULTS')
    console.log('='.repeat(60))
    console.log('Task A (Analysis Odyssey):', scoreA, '/8')
    console.log('Task B (Quizlet Live):', scoreB, '/6')
    console.log('Task C (Tense Odyssey):', scoreC, '/6')
    console.log('Task D (Clause Conquest):', scoreD, '/6')
    console.log('-'.repeat(60))
    console.log('TOTAL SCORE:', total, '/26')
    console.log('PASS THRESHOLD: 21/26 (80%)')
    console.log('-'.repeat(60))
    if (passed) {
      console.log('✅ PASSED - Student will proceed to dashboard')
    } else {
      console.log('❌ FAILED - Student will restart Remedial C1 from Task A')
    }
    console.log('='.repeat(60) + '\n')

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          // Clear C1 scores
          sessionStorage.removeItem('remedial_step4_c1_taskA_score')
          sessionStorage.removeItem('remedial_step4_c1_taskB_score')
          sessionStorage.removeItem('remedial_step4_c1_taskC_score')
          sessionStorage.removeItem('remedial_step4_c1_taskD_score')

          if (passed) {
            navigate('/app/dashboard')
          } else {
            navigate('/app/phase4/step/4/remedial/c1/taskA')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const total = taskAScore + taskBScore + taskCScore + taskDScore
  const passed = total >= 21
  const percentage = Math.round((total / 26) * 100)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Main Results Card */}
      <Paper
        elevation={8}
        sx={{
          p: 5,
          textAlign: 'center',
          background: passed
            ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
            : 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          {passed ? '🎉 Outstanding! 🎉' : '💪 Keep Striving! 💪'}
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Phase 4 Step 4 - Remedial C1
        </Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, mb: 3 }}>
          Final Results
        </Typography>

        {/* Score Breakdown */}
        <Box sx={{ my: 4, p: 3, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Task A - Analysis Odyssey:</Typography>
              <Typography variant="h6" fontWeight="bold">{taskAScore} / 8</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(taskAScore / 8) * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': { backgroundColor: 'white' }
              }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Task B - Quizlet Live:</Typography>
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
              <Typography variant="h6">Task C - Tense Odyssey:</Typography>
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
              <Typography variant="h6">Task D - Clause Conquest:</Typography>
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
            {total} / 26
          </Typography>
          <Typography variant="h5" sx={{ mt: 1 }}>
            ({percentage}%)
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
            Pass Threshold: 21 / 26 (80%)
          </Typography>
        </Box>

        {/* Result Message */}
        {passed ? (
          <Box>
            <Typography variant="h6" sx={{ mt: 3 }}>
              ✅ You have passed Remedial C1!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Exceptional performance! You demonstrated mastery of C1-level skills: analytical writing,
              sophisticated vocabulary, complex grammar structures, and advanced language competency.
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
              You need more practice with C1-level skills: analytical paragraph construction, advanced vocabulary,
              mixed tenses/conditionals, and complex grammar structures. Review the feedback and try again!
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
              Restarting Remedial C1 to help you improve...
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
              Task A - Analysis Odyssey ({taskAScore}/8)
            </Typography>
            <Typography variant="body2">
              {taskAScore >= 7 ? '✅ Excellent paragraph reconstruction and analytical thinking' :
               taskAScore >= 5 ? '⚠️ Good, but review logical progression and cohesive devices' :
               '❌ Practice identifying sophisticated analytical structures and advanced connectors'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Task B - Quizlet Live ({taskBScore}/6)
            </Typography>
            <Typography variant="body2">
              {taskBScore >= 5 ? '✅ Excellent detailed responses with video references' :
               taskBScore >= 3 ? '⚠️ Good, but include more specific details and sophisticated vocabulary' :
               '❌ Practice writing detailed answers with advanced vocabulary and video references'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Task C - Tense Odyssey ({taskCScore}/6)
            </Typography>
            <Typography variant="body2">
              {taskCScore >= 5 ? '✅ Excellent mastery of mixed tenses and conditionals' :
               taskCScore >= 3 ? '⚠️ Good, review perfect tenses and conditional structures' :
               '❌ Study present/past perfect, second/third conditionals, and complex sentence structures'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Task D - Clause Conquest ({taskDScore}/6)
            </Typography>
            <Typography variant="body2">
              {taskDScore >= 5 ? '✅ Excellent command of passive voice and relative clauses' :
               taskDScore >= 3 ? '⚠️ Good, review passive constructions and clause structures' :
               '❌ Practice passive voice forms (is used, has been shown, are conveyed) and relative clauses'}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
