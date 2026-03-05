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
import { phase5API } from '../../lib/phase5_api.jsx'

/**
 * Phase 5 SubPhase 2 Step 1: Score Calculation & Remedial Routing
 * Calculates total score from all 3 interactions and routes to appropriate remedial level
 * Scoring: A2=1pt, B1=2pts, B2=3pts, C1=4pts (no A1 in SubPhase 2)
 */

export default function Phase5SubPhase2Step1ScoreCalculation() {
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

  const calculateScore = async () => {
    setCalculating(true)

    try {
      // Get scores from sessionStorage
      const interaction1Score = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction2_score') || '0')
      const interaction3Score = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction3_score') || '0')

      const totalScore = interaction1Score + interaction2Score + interaction3Score

      setScores({
        interaction1: interaction1Score,
        interaction2: interaction2Score,
        interaction3: interaction3Score,
        total: totalScore
      })

      // Send to backend for calculation and routing decision
      const result = await phase5API.calculateStepScore(1, {
        interaction1_score: interaction1Score,
        interaction2_score: interaction2Score,
        interaction3_score: interaction3Score
      }, 2) // subphase 2

      if (result.success && result.data) {
        const data = result.data
        const remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
        const shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)

        setRouting({
          remedialLevel,
          shouldProceed,
          totalScore: data.total?.score || totalScore
        })

        // Store in sessionStorage
        sessionStorage.setItem('phase5_subphase2_step1_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_subphase2_step1_remedial_level', remedialLevel)

        console.log('\n' + '='.repeat(60))
        console.log('PHASE 5 SUBPHASE 2 STEP 1 - SCORE SUMMARY')
        console.log('='.repeat(60))
        console.log('Interaction 1 (Wordshake):', interaction1Score, '/1')
        console.log('Interaction 2 (Instructions):', interaction2Score, '/4')
        console.log('Interaction 3 (Sushi Spell):', interaction3Score, '/1')
        console.log('-'.repeat(60))
        console.log('TOTAL SCORE:', totalScore, '/6')
        console.log('Assigned Level:', remedialLevel)
        console.log('Should Proceed:', shouldProceed)
        console.log('='.repeat(60) + '\n')
      } else {
        // Fallback routing
        const remedialLevel = determineRemedialLevel(interaction2Score)
        setRouting({
          remedialLevel,
          shouldProceed: interaction2Score >= 3,
          totalScore
        })
        sessionStorage.setItem('phase5_subphase2_step1_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_subphase2_step1_remedial_level', remedialLevel)
      }
    } catch (error) {
      console.error('Error calculating score:', error)
      // Fallback: use sessionStorage scores
      const interaction1Score = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction2_score') || '0')
      const interaction3Score = parseInt(sessionStorage.getItem('phase5_subphase2_step1_interaction3_score') || '0')
      const totalScore = interaction1Score + interaction2Score + interaction3Score
      const remedialLevel = determineRemedialLevel(interaction2Score)

      setScores({
        interaction1: interaction1Score,
        interaction2: interaction2Score,
        interaction3: interaction3Score,
        total: totalScore
      })

      setRouting({
        remedialLevel,
        shouldProceed: interaction2Score >= 3,
        totalScore
      })

      sessionStorage.setItem('phase5_subphase2_step1_total_score', totalScore.toString())
      sessionStorage.setItem('phase5_subphase2_step1_remedial_level', remedialLevel)
    } finally {
      setCalculating(false)
      setLoading(false)
    }
  }

  const determineRemedialLevel = (i2Score) => {
    if (i2Score <= 1) return 'A1'
    if (i2Score <= 2) return 'A2'
    if (i2Score <= 3) return 'B1'
    if (i2Score <= 4) return 'B2'
    return 'C1'
  }

  const handleContinue = () => {
    if (!routing) return

    if (routing.shouldProceed) {
      navigate('/phase5/subphase/2/step/2')
    } else {
      const levelLower = routing.remedialLevel.toLowerCase()
      navigate(`/phase5/subphase/2/step/1/remedial/${levelLower}/task/a`)
    }
  }

  if (loading || calculating) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Calculating your score...
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 1: Score Summary
        </Typography>
      </Paper>

      {/* Score Summary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Your Scores
        </Typography>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Interaction 1 (Wordshake Game):</strong> {scores.interaction1}/1 point
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vocabulary activation and engagement
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Interaction 2 (Volunteer Instructions):</strong> {scores.interaction2}/4 points
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Main assessment - Writing clear, polite instructions
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Interaction 3 (Sushi Spell Game):</strong> {scores.interaction3}/1 point
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vocabulary spelling practice
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ backgroundColor: 'primary.lighter' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Total Score: {scores.total}/6 points
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum possible: 6 points (1 + 4 + 1)
              </Typography>
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
            backgroundColor: routing.shouldProceed ? 'success.lighter' : 'warning.lighter',
            border: `2px solid ${routing.shouldProceed ? 'success.main' : 'warning.main'}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon
              sx={{
                fontSize: 40,
                color: routing.shouldProceed ? 'success.main' : 'warning.main',
                mr: 2
              }}
            />
            <Box>
              <Typography variant="h6" color={routing.shouldProceed ? 'success.main' : 'warning.main'}>
                {routing.shouldProceed ? 'Ready to Continue!' : 'Remedial Activities Recommended'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assigned Level: {routing.remedialLevel}
              </Typography>
            </Box>
          </Box>

          <Alert severity={routing.shouldProceed ? 'success' : 'warning'} sx={{ mb: 2 }}>
            {routing.shouldProceed ? (
              <Typography variant="body1">
                Great work! You've demonstrated strong understanding. You can proceed to Step 2 or complete remedial activities for extra practice.
              </Typography>
            ) : (
              <Typography variant="body1">
                Based on your performance, we recommend completing remedial activities at the <strong>{routing.remedialLevel}</strong> level to strengthen your skills before continuing.
              </Typography>
            )}
          </Alert>

          <Button
            variant="contained"
            color={routing.shouldProceed ? 'success' : 'warning'}
            onClick={handleContinue}
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            {routing.shouldProceed ? 'Continue to Step 2' : `Start ${routing.remedialLevel} Remedial Activities`}
          </Button>
        </Paper>
      )}
    </Box>
  )
}
