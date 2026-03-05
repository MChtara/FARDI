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
import RefreshIcon from '@mui/icons-material/Refresh'

/**
 * Phase 4.2 Step 2 - Level C1 Remedial Results
 * Shows combined results from Tasks A through H (8 tasks)
 * Pass threshold: 8/10 average
 */

const PASS_THRESHOLD = 8 // 8/10 average to proceed

export default function Phase4_2Step2RemedialC1Results() {
  const navigate = useNavigate()
  const [results, setResults] = useState({
    taskA: 0,
    taskB: 0,
    taskC: 0,
    taskD: 0,
    taskE: 0,
    taskF: 0,
    taskG: 0,
    taskH: 0,
    average: 0,
    passed: false
  })

  useEffect(() => {
    // Get scores from sessionStorage (all normalized to /10)
    const taskAScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskA_score') || '0')
    const taskBScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskB_score') || '0')
    const taskCScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskC_score') || '0')
    const taskDScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskD_score') || '0')
    const taskEScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskE_score') || '0')
    const taskFScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskF_score') || '0')
    const taskGScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskG_score') || '0')
    const taskHScore = parseFloat(sessionStorage.getItem('phase4_2_step2_remedial_c1_taskH_score') || '0')

    // Normalize Task A (out of 6) to /10
    const normalizedTaskA = (taskAScore / 6) * 10

    const totalScore = normalizedTaskA + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore + taskGScore + taskHScore
    const averageScore = totalScore / 8
    const passed = averageScore >= PASS_THRESHOLD

    setResults({
      taskA: normalizedTaskA,
      taskB: taskBScore,
      taskC: taskCScore,
      taskD: taskDScore,
      taskE: taskEScore,
      taskF: taskFScore,
      taskG: taskGScore,
      taskH: taskHScore,
      average: averageScore,
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
          step: 2,
          level: 'C1',
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
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskA_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskB_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskC_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskD_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskE_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskF_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskG_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskH_score')
      navigate('/dashboard')
    } else {
      // Retry from Task A
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskA_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskB_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskC_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskD_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskE_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskF_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskG_score')
      sessionStorage.removeItem('phase4_2_step2_remedial_c1_taskH_score')
      navigate('/phase4_2/step/2/remedial/c1/taskA')
    }
  }

  const progressPercent = (results.average / 10) * 100

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
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
          Phase 4.2 Step 2 - Level C1 Remedial
        </Typography>
        <Typography variant="h6">
          Final Results
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="EMNA"
          message={
            results.passed
              ? "Outstanding! You've mastered C1-level Instagram post language with sophisticated grammar, advanced vocabulary, and analytical thinking. You're ready to proceed!"
              : "You've made good progress, but C1 requires excellence in all areas. Review the advanced grammar, terminology, and analytical skills, then try again. You can achieve mastery!"
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
            {results.passed ? '🎉 You Passed C1!' : '❌ Not Yet...'}
          </Typography>
          <Typography variant="h2" fontWeight="bold" color={results.passed ? 'success.main' : 'error.main'}>
            {results.average.toFixed(1)}/10
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            Average Score Across 8 Tasks
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
              You scored <strong>{results.average.toFixed(1)}/10</strong>, which is above the required <strong>{PASS_THRESHOLD}/10</strong> to proceed!
            </Typography>
          ) : (
            <Typography>
              You scored <strong>{results.average.toFixed(1)}/10</strong>. You need at least <strong>{PASS_THRESHOLD}/10</strong> to proceed. Please try again!
            </Typography>
          )}
        </Alert>
      </Paper>

      {/* Task Breakdown */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        Task Breakdown:
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task A: Debate Simulation
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskA.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task B: Analytical Writing
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskB.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task C: Advanced Quiz
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskC.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task D: Critique Game
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskD.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task E: Mixed Tenses
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskE.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task F: Advanced Grammar
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskF.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task G: Debate Grammar
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskG.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task H: Error Correction
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskH.toFixed(1)}/10
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
          startIcon={results.passed ? <HomeIcon /> : <RefreshIcon />}
          sx={{ px: 6, py: 2 }}
        >
          {results.passed ? 'Return to Dashboard' : 'Try Again'}
        </Button>
      </Box>
    </Box>
  )
}
