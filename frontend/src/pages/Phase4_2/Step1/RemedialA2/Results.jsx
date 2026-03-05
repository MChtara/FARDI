import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  LinearProgress
} from '@mui/material'
import { CharacterMessage } from '../../../../components/Avatar.jsx'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HomeIcon from '@mui/icons-material/Home'

/**
 * Phase 4.2 Step 1 - Level A2 Remedial Results
 * Shows combined results from Tasks A, B, and C
 */

const PASS_THRESHOLD = 8 // 8/10 to proceed

export default function Phase4_2RemedialA2Results() {
  const navigate = useNavigate()
  const [results, setResults] = useState({
    taskA: 0,
    taskB: 0,
    taskC: 0,
    total: 0,
    passed: false
  })

  useEffect(() => {
    // Get scores from sessionStorage
    const taskAScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_a2_taskA_score') || '0')
    const taskBScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_a2_taskB_score') || '0')
    const taskCScore = parseFloat(sessionStorage.getItem('phase4_2_remedial_a2_taskC_score') || '0')

    const totalScore = taskAScore + taskBScore + taskCScore
    const averageScore = totalScore / 3
    const passed = averageScore >= PASS_THRESHOLD

    setResults({
      taskA: taskAScore,
      taskB: taskBScore,
      taskC: taskCScore,
      total: averageScore,
      passed
    })

    // Log final results
    logRemedialCompletion(averageScore, passed)
  }, [])

  const logRemedialCompletion = async (score, passed) => {
    try {
      await fetch('/api/phase4/remedial/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 1,
          level: 'A2',
          final_score: score,
          max_score: 10,
          passed: passed
        })
      })
    } catch (error) {
      console.error('Failed to log remedial completion:', error)
    }
  }

  const handleContinue = () => {
    if (results.passed) {
      // Clear remedial scores and return to dashboard
      sessionStorage.removeItem('phase4_2_remedial_a2_taskA_score')
      sessionStorage.removeItem('phase4_2_remedial_a2_taskB_score')
      sessionStorage.removeItem('phase4_2_remedial_a2_taskC_score')
      navigate('/dashboard')
    } else {
      // Retry from Task A
      sessionStorage.removeItem('phase4_2_remedial_a2_taskA_score')
      sessionStorage.removeItem('phase4_2_remedial_a2_taskB_score')
      sessionStorage.removeItem('phase4_2_remedial_a2_taskC_score')
      navigate('/phase4_2/step/1/remedial/a2/taskA')
    }
  }

  const progressPercent = (results.total / 10) * 100

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: results.passed ? 'success.main' : 'error.main',
          color: 'white'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Phase 4.2 Step 1 - Level A2 Remedial
        </Typography>
        <Typography variant="h6">
          Final Results
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message={
            results.passed
              ? "Excellent work! You've mastered the A2 social media vocabulary. You can proceed!"
              : "Keep practicing! Review the vocabulary and try again. You can do it!"
          }
        />
      </Paper>

      {/* Overall Result */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 3,
          backgroundColor: results.passed ? 'success.lighter' : 'error.lighter',
          border: 3,
          borderColor: results.passed ? 'success.main' : 'error.main'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {results.passed ? (
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          ) : (
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          )}
          <Typography variant="h4" gutterBottom color={results.passed ? 'success.dark' : 'error.dark'}>
            {results.passed ? '🎉 You Passed!' : '❌ Not Yet...'}
          </Typography>
          <Typography variant="h2" fontWeight="bold" color={results.passed ? 'success.main' : 'error.main'}>
            {results.total.toFixed(1)}/10
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            Average Score
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressPercent}
          color={results.passed ? 'success' : 'error'}
          sx={{ height: 12, borderRadius: 6, mb: 2 }}
        />

        <Alert severity={results.passed ? 'success' : 'warning'} sx={{ mt: 2 }}>
          {results.passed ? (
            <Typography>
              You scored <strong>{results.total.toFixed(1)}/10</strong>, which is above the required <strong>{PASS_THRESHOLD}/10</strong> to proceed!
            </Typography>
          ) : (
            <Typography>
              You scored <strong>{results.total.toFixed(1)}/10</strong>. You need at least <strong>{PASS_THRESHOLD}/10</strong> to proceed. Please try again!
            </Typography>
          )}
        </Alert>
      </Paper>

      {/* Task Breakdown */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        Task Breakdown:
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Task A: Match Race
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {results.taskA.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Task B: Fill Frenzy
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {results.taskB.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Task C: Sentence Builder
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {results.taskC.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color={results.passed ? 'success' : 'warning'}
          size="large"
          onClick={handleContinue}
          startIcon={results.passed ? <HomeIcon /> : undefined}
          sx={{ px: 6, py: 2 }}
        >
          {results.passed ? 'Return to Dashboard' : 'Try Again'}
        </Button>
      </Box>
    </Box>
  )
}
