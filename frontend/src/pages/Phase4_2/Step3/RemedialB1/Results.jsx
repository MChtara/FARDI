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
 * Phase 4.2 Step 3 - Level B1 Remedial Results
 * Shows combined results from Tasks A, B, C, and D
 * Pass threshold: 22/28 points
 */

const PASS_THRESHOLD = 22 // 22/28 to proceed

export default function Phase4_2Step3RemedialB1Results() {
  const navigate = useNavigate()
  const [results, setResults] = useState({
    taskA: 0,
    taskB: 0,
    taskC: 0,
    taskD: 0,
    total: 0,
    passed: false
  })

  useEffect(() => {
    // Get scores from sessionStorage
    const taskAScore = parseInt(sessionStorage.getItem('phase4_2_step3_b1_taskA') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_2_step3_b1_taskB') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_2_step3_b1_taskC') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase4_2_step3_b1_taskD') || '0')

    const totalScore = taskAScore + taskBScore + taskCScore + taskDScore
    const passed = totalScore >= PASS_THRESHOLD

    setResults({
      taskA: taskAScore,
      taskB: taskBScore,
      taskC: taskCScore,
      taskD: taskDScore,
      total: totalScore,
      passed
    })

    // Log final results
    logRemedialCompletion(totalScore, passed)
  }, [])

  const logRemedialCompletion = async (score, passed) => {
    try {
      await fetch('/api/phase4/remedial/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4.2',
          step: 3,
          level: 'B1',
          final_score: score,
          max_score: 28,
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
      sessionStorage.removeItem('phase4_2_step3_b1_taskA')
      sessionStorage.removeItem('phase4_2_step3_b1_taskB')
      sessionStorage.removeItem('phase4_2_step3_b1_taskC')
      sessionStorage.removeItem('phase4_2_step3_b1_taskD')
      navigate('/dashboard')
    } else {
      // Retry from Task A
      sessionStorage.removeItem('phase4_2_step3_b1_taskA')
      sessionStorage.removeItem('phase4_2_step3_b1_taskB')
      sessionStorage.removeItem('phase4_2_step3_b1_taskC')
      sessionStorage.removeItem('phase4_2_step3_b1_taskD')
      navigate('/phase4_2/step/3/remedial/b1/taskA')
    }
  }

  const progressPercent = (results.total / 28) * 100

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
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
          Phase 4.2 Step 3 - Level B1 Remedial
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
              ? "Excellent work! You've mastered the social media vocabulary. Well done!"
              : "You're making progress! Review the terms and try again. You can do this!"
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
            {results.passed ? 'You Passed!' : 'Not Yet...'}
          </Typography>
          <Typography variant="h2" fontWeight="bold" color={results.passed ? 'success.main' : 'error.main'}>
            {results.total}/28
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            Total Score
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
              You scored <strong>{results.total}/28</strong>, which is above the required <strong>{PASS_THRESHOLD}/28</strong> to proceed!
            </Typography>
          ) : (
            <Typography>
              You scored <strong>{results.total}/28</strong>. You need at least <strong>{PASS_THRESHOLD}/28</strong> to proceed. Please try again!
            </Typography>
          )}
        </Alert>
      </Paper>

      {/* Task Breakdown */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        Task Breakdown:
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task A: Negotiation Battle
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {results.taskA}/6
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task B: Definition Duel
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {results.taskB}/8
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task C: Wordshake Quiz
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {results.taskC}/6
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task D: Quizlet Flashcards
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {results.taskD}/8
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
