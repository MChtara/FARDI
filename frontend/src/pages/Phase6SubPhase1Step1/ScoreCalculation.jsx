import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
  Stack,
  Card,
  CardContent
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'

/**
 * Phase 6 SubPhase 1 Step 1: Score Calculation and Remedial Routing
 * Reads scores from sessionStorage, calculates total, and routes to remedial level
 */

export default function Phase6SP1Step1ScoreCalculation() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [scores, setScores] = useState({
    interaction1: 0,
    interaction2: 0,
    interaction3: 0,
    total: 0
  })
  const [routing, setRouting] = useState(null)

  useEffect(() => {
    calculateScore()
  }, [])

  /**
   * Determine remedial level based on interaction2_score (writing task).
   * 1 → A2, 2 → B1, 3 → B2, 4 → C1
   */
  const determineRemedialLevel = (i2Score) => {
    if (i2Score <= 1) return 'A1'
    if (i2Score <= 2) return 'A2'
    if (i2Score <= 3) return 'B1'
    if (i2Score <= 4) return 'B2'
    return 'C1'
  }

  const calculateScore = async () => {
    setCalculating(true)

    try {
      // Read scores from sessionStorage
      const interaction1Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction2_score') || '1')
      const interaction3Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction3_score') || '0')
      const totalScore = interaction1Score + interaction2Score + interaction3Score

      setScores({
        interaction1: interaction1Score,
        interaction2: interaction2Score,
        interaction3: interaction3Score,
        total: totalScore
      })

      // Send to backend for calculation
      let remedialLevel = determineRemedialLevel(interaction2Score)
      let shouldProceed = interaction2Score >= 3

      try {
        const result = await phase6API.calculateStepScore(1, {
          interaction1_score: interaction1Score,
          interaction2_score: interaction2Score,
          interaction3_score: interaction3Score
        }, 1)

        if (result && result.data) {
          const data = result.data
          remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
          shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)
        } else if (result && result.remedial_level) {
          remedialLevel = result.remedial_level
        }
      } catch (apiError) {
        console.warn('Backend score calculation failed, using local routing:', apiError)
      }

      // Store in sessionStorage
      sessionStorage.setItem('phase6_sp1_step1_total_score', totalScore.toString())
      sessionStorage.setItem('phase6_sp1_step1_remedial_level', remedialLevel)

      setRouting({ remedialLevel, totalScore, shouldProceed })

      console.log('\n' + '='.repeat(60))
      console.log('PHASE 6 SP1 STEP 1 - SCORE SUMMARY')
      console.log('='.repeat(60))
      console.log('Interaction 1 (Wordshake):', interaction1Score, '/1')
      console.log('Interaction 2 (Festival Reflection):', interaction2Score, '/4')
      console.log('Interaction 3 (Sushi Spell):', interaction3Score, '/1')
      console.log('-'.repeat(60))
      console.log('TOTAL SCORE:', totalScore, '/6')
      console.log('Assigned Level:', remedialLevel)
      console.log('='.repeat(60) + '\n')

    } catch (error) {
      console.error('Error calculating score:', error)
      // Fallback
      const interaction1Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction2_score') || '1')
      const interaction3Score = parseInt(sessionStorage.getItem('phase6_sp1_step1_interaction3_score') || '0')
      const totalScore = interaction1Score + interaction2Score + interaction3Score
      const remedialLevel = determineRemedialLevel(interaction2Score)

      setScores({
        interaction1: interaction1Score,
        interaction2: interaction2Score,
        interaction3: interaction3Score,
        total: totalScore
      })

      const shouldProceed = interaction2Score >= 3
      setRouting({ remedialLevel, totalScore, shouldProceed })
      sessionStorage.setItem('phase6_sp1_step1_total_score', totalScore.toString())
      sessionStorage.setItem('phase6_sp1_step1_remedial_level', remedialLevel)
    } finally {
      setCalculating(false)
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!routing) return
    if (routing.shouldProceed) {
      navigate('/phase6/subphase/1/step/2')
    } else {
      const levelLower = routing.remedialLevel.toLowerCase()
      navigate(`/phase6/subphase/1/step/1/remedial/${levelLower}/task/a`)
    }
  }

  if (loading || calculating) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center', mt: 8 }}>
        <CircularProgress size={60} sx={{ mb: 3, color: '#27ae60' }} />
        <Typography variant="h6">Calculating your score...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection and Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Score Summary
        </Typography>
        <Typography variant="body1">
          See how you performed across all three interactions
        </Typography>
      </Paper>

      {/* Score Breakdown */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Your Performance Summary
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Interaction 1 (Wordshake):</strong> {scores.interaction1} / 1 point
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(scores.interaction1 / 1) * 100}
                sx={{ mt: 1, height: 8, borderRadius: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#27ae60' } }}
              />
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Interaction 2 (Festival Reflection):</strong> {scores.interaction2} / 4 points
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(scores.interaction2 / 4) * 100}
                sx={{ mt: 1, height: 8, borderRadius: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#27ae60' } }}
              />
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Interaction 3 (Sushi Spell):</strong> {scores.interaction3} / 1 point
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(scores.interaction3 / 1) * 100}
                sx={{ mt: 1, height: 8, borderRadius: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#27ae60' } }}
              />
            </CardContent>
          </Card>

          <Card
            variant="outlined"
            sx={{
              border: '3px solid #27ae60',
              backgroundColor: '#f0faf4'
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#27ae60' }}>
                Total Score: {scores.total} / 6 points
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(scores.total / 6) * 100}
                sx={{
                  mt: 1,
                  height: 12,
                  borderRadius: 1,
                  '& .MuiLinearProgress-bar': { backgroundColor: '#27ae60' }
                }}
              />
            </CardContent>
          </Card>
        </Stack>
      </Paper>

      {/* Routing Decision */}
      {routing && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: 'info.lighter',
            border: '2px solid',
            borderColor: 'info.main',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon
              sx={{ fontSize: 50, color: 'info.main', mr: 2 }}
            />
            <Box>
              <Typography variant="h5" color="info.dark">
                Practice Activities Ready
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assigned Level: <strong>{routing.remedialLevel}</strong>
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Based on your reflection writing (Interaction 2), you have been assigned to{' '}
            <strong>{routing.remedialLevel}</strong> level remedial activities. These exercises will
            strengthen your post-event report writing skills before moving to Step 2.
          </Typography>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Next Steps:</strong> You will complete remedial activities designed for{' '}
              {routing.remedialLevel} level. These activities will help you practise reflection and
              evaluation language for writing post-event reports.
            </Typography>
          </Alert>

          <Button
            variant="contained"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{
              mt: 3,
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #1e8449 0%, #196f3d 100%)' }
            }}
          >
            {routing.shouldProceed ? 'Continue to Step 2' : `Continue to ${routing.remedialLevel} Remedial Activities`}
          </Button>
        </Paper>
      )}
    </Box>
  )
}
