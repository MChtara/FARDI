import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Alert,
  LinearProgress
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase5API } from '../../lib/phase5_api.jsx'

export default function Phase5SubPhase2Step5ScoreCalculation() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [scores, setScores] = useState({ interaction1: 0, interaction2: 0, interaction3: 0, total: 0 })
  const [routing, setRouting] = useState(null)
  const [overall, setOverall] = useState(null)

  useEffect(() => {
    calculateScore()
  }, [])

  const calculateScore = async () => {
    setCalculating(true)

    try {
      const interaction1Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction2_score') || '0')
      const interaction3Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction3_score') || '0')
      const totalScore = interaction1Score + interaction2Score + interaction3Score

      setScores({ interaction1: interaction1Score, interaction2: interaction2Score, interaction3: interaction3Score, total: totalScore })

      const result = await phase5API.calculateStepScore(5, {
        interaction1_score: interaction1Score,
        interaction2_score: interaction2Score,
        interaction3_score: interaction3Score
      }, 2)

      if (result.success && result.data) {
        const data = result.data
        const remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
        const shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)

        // Use backend-calculated overall score if available
        const overallTotal = data.overall?.total_score || (() => {
          // Fallback: calculate from sessionStorage
          const step1Score = parseInt(sessionStorage.getItem('phase5_subphase2_step1_total_score') || '0')
          const step2Score = parseInt(sessionStorage.getItem('phase5_subphase2_step2_total_score') || '0')
          const step3Score = parseInt(sessionStorage.getItem('phase5_subphase2_step3_total_score') || '0')
          const step4Score = parseInt(sessionStorage.getItem('phase5_subphase2_step4_total_score') || '0')
          return step1Score + step2Score + step3Score + step4Score + totalScore
        })()

        setOverall({
          total_score: overallTotal,
          required_score: data.overall?.required_score || 12,
          should_proceed: data.overall?.should_proceed ?? (overallTotal >= 12)
        })

        setRouting({
          remedialLevel,
          shouldProceed,
          totalScore: data.total?.score || totalScore
        })

        sessionStorage.setItem('phase5_subphase2_step5_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_subphase2_step5_remedial_level', remedialLevel)
        sessionStorage.setItem('phase5_subphase2_overall_total', overallTotal.toString())
      } else {
        // Fallback routing
        const remedialLevel = determineRemedialLevel(interaction2Score)
        setRouting({
          remedialLevel,
          shouldProceed: interaction2Score >= 3,
          totalScore
        })
        sessionStorage.setItem('phase5_subphase2_step5_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_subphase2_step5_remedial_level', remedialLevel)
      }
    } catch (error) {
      console.error('Error calculating score:', error)
      // Fallback: use sessionStorage scores
      const interaction1Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction1_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction2_score') || '0')
      const interaction3Score = parseInt(sessionStorage.getItem('phase5_subphase2_step5_interaction3_score') || '0')
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

      sessionStorage.setItem('phase5_subphase2_step5_total_score', totalScore.toString())
      sessionStorage.setItem('phase5_subphase2_step5_remedial_level', remedialLevel)
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
      navigate('/phase5/complete')
    } else {
      const levelLower = routing.remedialLevel.toLowerCase()
      navigate(`/phase5/subphase/2/step/5/remedial/${levelLower}/task/a`)
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
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2 Step 5: Final Score Summary
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Step 5 Scores
        </Typography>
        <Stack spacing={2}>
          <Card><CardContent><Typography>Interaction 1: {scores.interaction1}/4</Typography></CardContent></Card>
          <Card><CardContent><Typography>Interaction 2: {scores.interaction2}/4</Typography></CardContent></Card>
          <Card><CardContent><Typography>Interaction 3: {scores.interaction3}/4</Typography></CardContent></Card>
          <Card sx={{ backgroundColor: 'primary.lighter' }}>
            <CardContent><Typography variant="h6">Step 5 Total: {scores.total}/12</Typography></CardContent>
          </Card>
        </Stack>
      </Paper>

      {overall && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: overall.should_proceed ? 'success.lighter' : 'warning.lighter' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: overall.should_proceed ? 'success.main' : 'warning.main', mr: 2 }} />
            <Box>
              <Typography variant="h6" color={overall.should_proceed ? 'success.main' : 'warning.main'}>
                Overall SubPhase 2 Score
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {overall.total_score}/{overall.required_score} points
              </Typography>
            </Box>
          </Box>
          <Alert severity={overall.should_proceed ? 'success' : 'warning'} sx={{ mb: 2 }}>
            {overall.should_proceed ? (
              <Typography variant="body1">
                Congratulations! You've completed SubPhase 2 with {overall.total_score} points. You can proceed to the next phase!
              </Typography>
            ) : (
              <Typography variant="body1">
                You have {overall.total_score} points. You need {overall.required_score} points total to proceed. Complete remedial activities to improve your score.
              </Typography>
            )}
          </Alert>
        </Paper>
      )}

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
                {routing.shouldProceed ? 'Ready to Complete Phase 5!' : 'Remedial Activities Recommended'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assigned Level: {routing.remedialLevel}
              </Typography>
            </Box>
          </Box>

          <Alert severity={routing.shouldProceed ? 'success' : 'warning'} sx={{ mb: 2 }}>
            {routing.shouldProceed ? (
              <Typography variant="body1">
                Great work! You've demonstrated strong understanding. You can proceed to complete Phase 5!
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
            sx={{ mt: 2, py: 2, fontWeight: 700, fontSize: '1.1rem' }}
          >
            {routing.shouldProceed ? 'Complete Phase 5 - View Final Results' : `Start ${routing.remedialLevel} Remedial Activities`}
          </Button>
        </Paper>
      )}
    </Box>
  )
}
