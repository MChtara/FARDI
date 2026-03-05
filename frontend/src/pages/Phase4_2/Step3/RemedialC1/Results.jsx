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
 * Phase 4.2 Step 3 - Level C1 Remedial Results
 * Shows combined results from Tasks A through H (8 tasks)
 * Total: 50 points, Pass threshold: 40/50
 */

const PASS_THRESHOLD = 40 // 40/50 to proceed

export default function Phase4_2Step3RemedialC1Results() {
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
    total: 0,
    passed: false
  })

  useEffect(() => {
    // Get scores from sessionStorage
    const taskAScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskA_score') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskB_score') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskC_score') || '0')
    const taskDScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskD_score') || '0')
    const taskEScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskE_score') || '0')
    const taskFScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskF_score') || '0')
    const taskGScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskG_score') || '0')
    const taskHScore = parseInt(sessionStorage.getItem('phase4_2_step3_c1_taskH_score') || '0')

    const totalScore = taskAScore + taskBScore + taskCScore + taskDScore + taskEScore + taskFScore + taskGScore + taskHScore
    const passed = totalScore >= PASS_THRESHOLD

    setResults({
      taskA: taskAScore,
      taskB: taskBScore,
      taskC: taskCScore,
      taskD: taskDScore,
      taskE: taskEScore,
      taskF: taskFScore,
      taskG: taskGScore,
      taskH: taskHScore,
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
          level: 'C1',
          final_score: score,
          max_score: 50,
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
      sessionStorage.removeItem('phase4_2_step3_c1_taskA_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskB_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskC_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskD_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskE_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskF_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskG_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskH_score')
      navigate('/dashboard')
    } else {
      // Retry from Task A
      sessionStorage.removeItem('phase4_2_step3_c1_taskA_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskB_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskC_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskD_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskE_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskF_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskG_score')
      sessionStorage.removeItem('phase4_2_step3_c1_taskH_score')
      navigate('/phase4_2/step/3/remedial/c1/taskA')
    }
  }

  const progressPercent = (results.total / 50) * 100

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
          Phase 4.2 Step 3 - Level C1 Remedial
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
              ? "Outstanding! You've mastered C1-level social media language with sophisticated grammar, advanced vocabulary, and analytical thinking. You're ready to proceed!"
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
            {results.passed ? 'You Passed C1!' : 'Not Yet...'}
          </Typography>
          <Typography variant="h2" fontWeight="bold" color={results.passed ? 'success.main' : 'error.main'}>
            {results.total}/50
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            Total Score Across 8 Tasks
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
              You scored <strong>{results.total}/50</strong>, which is above the required <strong>{PASS_THRESHOLD}/50</strong> to proceed!
            </Typography>
          ) : (
            <Typography>
              You scored <strong>{results.total}/50</strong>. You need at least <strong>{PASS_THRESHOLD}/50</strong> to proceed. Please try again!
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
                Task A: Debate Dominion
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskA}/6
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task B: Analysis Odyssey
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskB}/8
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task C: Quizlet Live
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskC}/6
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task D: Critique Kahoot
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskD}/6
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task E: Tense Odyssey
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskE}/6
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task F: Clause Conquest
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskF}/6
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task G: Debate Duel Advanced
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskG}/6
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Task H: Correction Crusade
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {results.taskH}/6
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
