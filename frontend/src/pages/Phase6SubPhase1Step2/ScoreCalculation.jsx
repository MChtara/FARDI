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
import SchoolIcon from '@mui/icons-material/School'
import { phase6API } from '../../lib/phase6_api.jsx'

/**
 * Phase 6 SubPhase 1 Step 2: Score Calculation & Remedial Routing
 */

const determineRemedialLevel = (i2Score) => {
  if (i2Score <= 1) return 'A1'
  if (i2Score <= 2) return 'A2'
  if (i2Score <= 3) return 'B1'
  if (i2Score <= 4) return 'B2'
  return 'C1'
}

export default function Phase6SP1Step2ScoreCalculation() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
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
    const interaction1Score = parseInt(sessionStorage.getItem('phase6_sp1_step2_interaction1_score') || '0')
    const interaction2Score = parseInt(sessionStorage.getItem('phase6_sp1_step2_interaction2_score') || '2')
    const interaction3Score = parseInt(sessionStorage.getItem('phase6_sp1_step2_interaction3_score') || '0')

    const totalScore = interaction1Score + interaction2Score + interaction3Score

    setScores({
      interaction1: interaction1Score,
      interaction2: interaction2Score,
      interaction3: interaction3Score,
      total: totalScore
    })

    try {
      const result = await phase6API.calculateStepScore(2, {
        interaction1_score: interaction1Score,
        interaction2_score: interaction2Score,
        interaction3_score: interaction3Score
      }, 1)

      if (result && result.data) {
        const data = result.data
        const remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
        const shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)
        setRouting({ remedialLevel, totalScore: data.total_score || totalScore, shouldProceed })
        sessionStorage.setItem('phase6_sp1_step2_total_score', (data.total_score || totalScore).toString())
        sessionStorage.setItem('phase6_sp1_step2_remedial_level', remedialLevel)
      } else {
        throw new Error('No data')
      }
    } catch (error) {
      console.error('Score calculation error:', error)
      const remedialLevel = determineRemedialLevel(interaction2Score)
      const shouldProceed = interaction2Score >= 3
      setRouting({ remedialLevel, totalScore, shouldProceed })
      sessionStorage.setItem('phase6_sp1_step2_total_score', totalScore.toString())
      sessionStorage.setItem('phase6_sp1_step2_remedial_level', remedialLevel)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!routing) return
    if (routing.shouldProceed) {
      navigate('/phase6/subphase/1/step/3')
    } else {
      const levelLower = routing.remedialLevel.toLowerCase()
      navigate(`/phase6/subphase/1/step/2/remedial/${levelLower}/task/a`)
    }
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mb: 3, color: '#27ae60' }} />
        <Typography variant="h6" color="text.secondary">
          Calculating your score...
        </Typography>
      </Box>
    )
  }

  const scorePercent = (scores.total / 6) * 100

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
          Phase 6: Reflection &amp; Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Score Summary
        </Typography>
        <Typography variant="body1">
          Writing a Post-Event Report - Explore Phase Results
        </Typography>
      </Paper>

      {/* Score Breakdown */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SchoolIcon sx={{ fontSize: 36, color: '#27ae60', mr: 2 }} />
          <Typography variant="h6" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
            Your Performance Breakdown
          </Typography>
        </Box>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <Card variant="outlined" sx={{ borderColor: '#27ae60' }}>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Interaction 1 (Sushi Spell):</strong> {scores.interaction1} / 1 point
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(scores.interaction1 / 1) * 100}
                sx={{ mt: 1, height: 8, borderRadius: 1, backgroundColor: '#c8e6c9', '& .MuiLinearProgress-bar': { backgroundColor: '#27ae60' } }}
              />
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderColor: '#27ae60' }}>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Interaction 2 (Writing Choice Explanation):</strong> {scores.interaction2} / 4 points
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(scores.interaction2 / 4) * 100}
                sx={{ mt: 1, height: 8, borderRadius: 1, backgroundColor: '#c8e6c9', '& .MuiLinearProgress-bar': { backgroundColor: '#27ae60' } }}
              />
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderColor: '#27ae60' }}>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Interaction 3 (Sushi Spell):</strong> {scores.interaction3} / 1 point
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(scores.interaction3 / 1) * 100}
                sx={{ mt: 1, height: 8, borderRadius: 1, backgroundColor: '#c8e6c9', '& .MuiLinearProgress-bar': { backgroundColor: '#27ae60' } }}
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
                value={scorePercent}
                sx={{ mt: 1, height: 12, borderRadius: 1, backgroundColor: '#c8e6c9', '& .MuiLinearProgress-bar': { backgroundColor: '#27ae60' } }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {scorePercent.toFixed(0)}% of total points
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Paper>

      {/* Routing Card */}
      {routing && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: '#f0faf4',
            border: '2px solid #27ae60',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: '#27ae60', mr: 2 }} />
            <Box>
              <Typography variant="h5" color="success.dark" fontWeight="bold">
                Step 2 Complete!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assigned Practice Level: <strong>{routing.remedialLevel}</strong>
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            You scored <strong>{scores.total} / 6 points</strong> in the Explore phase. You'll now complete tailored remedial activities at <strong>{routing.remedialLevel}</strong> level to strengthen your report writing skills.
          </Typography>

          <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
            <Typography variant="body2">
              <strong>Next Steps:</strong> Complete the remedial activities designed for your {routing.remedialLevel} level. These activities will help you write a better post-event report.
            </Typography>
          </Alert>

          <Button
            variant="contained"
            onClick={handleContinue}
            size="large"
            fullWidth
            sx={{
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' },
              fontWeight: 'bold'
            }}
          >
            {routing.shouldProceed ? 'Continue to Step 3' : `Continue to ${routing.remedialLevel} Remedial Activities`}
          </Button>
        </Paper>
      )}
    </Box>
  )
}
