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
 * Phase 4.2 Step 4 - Level A2 Remedial Results
 * Shows combined results from Tasks A, B, and C
 * Total: 22 points (8 + 8 + 6)
 * Pass threshold: 18/22 points
 */

const PASS_THRESHOLD = 18 // 18/22 to proceed
const MAX_SCORE = 22 // 8 + 8 + 6

export default function Phase4_2Step4RemedialA2Results() {
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
    const taskAScore = parseInt(sessionStorage.getItem('phase4_2_step4_a2_taskA') || '0')
    const taskBScore = parseInt(sessionStorage.getItem('phase4_2_step4_a2_taskB') || '0')
    const taskCScore = parseInt(sessionStorage.getItem('phase4_2_step4_a2_taskC') || '0')

    const totalScore = taskAScore + taskBScore + taskCScore
    const passed = totalScore >= PASS_THRESHOLD

    setResults({
      taskA: taskAScore,
      taskB: taskBScore,
      taskC: taskCScore,
      total: totalScore,
      passed
    })

    // Log final results
    logRemedialCompletion(totalScore, passed)
  }, [])

  const logRemedialCompletion = async (score, passed) => {
    try {
      await fetch('/api/phase4/4_2/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phase: '4_2',
          step: '4_remedial',
          level: 'A2',
          interaction_type: 'remedial_complete',
          details: {
            final_score: score,
            max_score: MAX_SCORE,
            passed: passed,
            task_scores: {
              taskA: results.taskA,
              taskB: results.taskB,
              taskC: results.taskC
            }
          }
        })
      })
    } catch (error) {
      console.error('Failed to log remedial completion:', error)
    }
  }

  const handleContinue = () => {
    if (results.passed) {
      // Clear remedial scores and return to dashboard
      sessionStorage.removeItem('phase4_2_step4_a2_taskA')
      sessionStorage.removeItem('phase4_2_step4_a2_taskB')
      sessionStorage.removeItem('phase4_2_step4_a2_taskC')
      navigate('/dashboard')
    } else {
      // Retry from Task A
      sessionStorage.removeItem('phase4_2_step4_a2_taskA')
      sessionStorage.removeItem('phase4_2_step4_a2_taskB')
      sessionStorage.removeItem('phase4_2_step4_a2_taskC')
      navigate('/phase4_2/step/4/remedial/a2/taskA')
    }
  }

  const progressPercent = (results.total / MAX_SCORE) * 100

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
          Phase 4.2 Step 4 - Level A2 Remedial
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
              ? "Excellent work! You've mastered the A2 social media vocabulary. All your hard work has paid off - you can proceed!"
              : "Keep practicing! Review the vocabulary and try again. Remember: Use hashtag #Festival, Write caption, Add emoji, Tag friend, Use call-to-action, Make post, Watch story, Click like. You can do it!"
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
            {results.total}/{MAX_SCORE}
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
              You scored <strong>{results.total}/{MAX_SCORE}</strong>, which is above the required <strong>{PASS_THRESHOLD}/{MAX_SCORE}</strong> to proceed!
            </Typography>
          ) : (
            <Typography>
              You scored <strong>{results.total}/{MAX_SCORE}</strong>. You need at least <strong>{PASS_THRESHOLD}/{MAX_SCORE}</strong> to proceed. Please try again!
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
          <Card elevation={2} sx={{
            border: 2,
            borderColor: results.taskA >= 6 ? 'success.main' : 'error.main'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Task A: Term Treasure Hunt
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {results.taskA}/8
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (Pass: 6/8)
              </Typography>
              {results.taskA >= 6 ? (
                <CheckCircleIcon sx={{ color: 'success.main', mt: 1 }} />
              ) : (
                <ErrorIcon sx={{ color: 'error.main', mt: 1 }} />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{
            border: 2,
            borderColor: results.taskB >= 6 ? 'success.main' : 'error.main'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Task B: Fill Quest
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {results.taskB}/8
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (Pass: 6/8)
              </Typography>
              {results.taskB >= 6 ? (
                <CheckCircleIcon sx={{ color: 'success.main', mt: 1 }} />
              ) : (
                <ErrorIcon sx={{ color: 'error.main', mt: 1 }} />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{
            border: 2,
            borderColor: results.taskC >= 4 ? 'success.main' : 'error.main'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Task C: Sentence Builder
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {results.taskC}/6
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (Pass: 4/6)
              </Typography>
              {results.taskC >= 4 ? (
                <CheckCircleIcon sx={{ color: 'success.main', mt: 1 }} />
              ) : (
                <ErrorIcon sx={{ color: 'error.main', mt: 1 }} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Analysis */}
      {!results.passed && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tips for Improvement:
          </Typography>
          {results.taskA < 6 && (
            <Typography variant="body2">
              • Review Task A: Match hashtag to #, caption to "Words under photo", emoji to "Smile face", tag to @name
            </Typography>
          )}
          {results.taskB < 6 && (
            <Typography variant="body2">
              • Review Task B: Use hashtag #Festival, Write caption, Add emoji, Tag friend with @
            </Typography>
          )}
          {results.taskC < 4 && (
            <Typography variant="body2">
              • Review Task C: Write simple sentences - start with capital, end with punctuation, at least 2 words
            </Typography>
          )}
        </Alert>
      )}

      {/* Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
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
