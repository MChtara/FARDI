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
 * Phase 5 Step 3: Score Calculation & Remedial Routing
 */

export default function Phase5Step3ScoreCalculation() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [scores, setScores] = useState({
    interaction1Game: 0,
    interaction1Definition: 0,
    interaction2: 0,
    interaction3Game: 0,
    interaction3Term: 0,
    total: 0
  })
  const [routing, setRouting] = useState(null)

  useEffect(() => {
    calculateScore()
  }, [])

  const calculateScore = async () => {
    setCalculating(true)

    try {
      const interaction1GameScore = parseInt(sessionStorage.getItem('phase5_step3_interaction1_game_score') || '0')
      const interaction1DefinitionScore = parseInt(sessionStorage.getItem('phase5_step3_interaction1_definition_score') || '0')
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_step3_interaction2_score') || '0')
      const interaction3GameScore = parseInt(sessionStorage.getItem('phase5_step3_interaction3_game_score') || '0')
      const interaction3TermScore = parseInt(sessionStorage.getItem('phase5_step3_interaction3_term_score') || '0')

      const totalScore = interaction1GameScore + interaction1DefinitionScore + interaction2Score + interaction3GameScore + interaction3TermScore

      setScores({
        interaction1Game: interaction1GameScore,
        interaction1Definition: interaction1DefinitionScore,
        interaction2: interaction2Score,
        interaction3Game: interaction3GameScore,
        interaction3Term: interaction3TermScore,
        total: totalScore
      })

      const result = await phase5API.calculateStepScore(3, {
        interaction1_score: interaction1GameScore,
        interaction1_definition_score: interaction1DefinitionScore,
        interaction2_score: interaction2Score,
        interaction3_score: interaction3GameScore,
        interaction3_term_score: interaction3TermScore
      })

      if (result.success && result.data) {
        const data = result.data
        const remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(interaction2Score)
        const shouldProceed = data.total?.should_proceed ?? (interaction2Score >= 3)

        setRouting({
          remedialLevel,
          shouldProceed,
          totalScore: data.total_score || totalScore
        })

        sessionStorage.setItem('phase5_step3_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_step3_remedial_level', remedialLevel)
      } else {
        const remedialLevel = determineRemedialLevel(interaction2Score)
        setRouting({
          remedialLevel,
          shouldProceed: interaction2Score >= 3,
          totalScore
        })
        sessionStorage.setItem('phase5_step3_total_score', totalScore.toString())
        sessionStorage.setItem('phase5_step3_remedial_level', remedialLevel)
      }
    } catch (error) {
      console.error('Error calculating score:', error)
      const interaction2Score = parseInt(sessionStorage.getItem('phase5_step3_interaction2_score') || '2')
      const remedialLevel = determineRemedialLevel(interaction2Score)
      setRouting({
        remedialLevel,
        shouldProceed: interaction2Score >= 3,
        totalScore: scores.total
      })
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
      navigate('/phase5/subphase/1/step/4')
    } else {
      const levelLower = routing.remedialLevel.toLowerCase()
      navigate(`/phase5/subphase/1/step/3/remedial/${levelLower}/task/a`)
    }
  }

  if (loading || calculating) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6">Calculating your score...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 5: Execution & Problem-Solving</Typography>
        <Typography variant="h5" gutterBottom>Step 3: Score Summary</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">Your Performance Summary</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" gutterBottom><strong>Interaction 1 (Game):</strong> {scores.interaction1Game} / 1 point</Typography>
              <LinearProgress variant="determinate" value={(scores.interaction1Game / 1) * 100} sx={{ mt: 1, height: 8, borderRadius: 1 }} color="primary" />
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" gutterBottom><strong>Interaction 1 (Definition):</strong> {scores.interaction1Definition} / 5 points</Typography>
              <LinearProgress variant="determinate" value={(scores.interaction1Definition / 5) * 100} sx={{ mt: 1, height: 8, borderRadius: 1 }} color="primary" />
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" gutterBottom><strong>Interaction 2 (Transparent):</strong> {scores.interaction2} / 5 points</Typography>
              <LinearProgress variant="determinate" value={(scores.interaction2 / 5) * 100} sx={{ mt: 1, height: 8, borderRadius: 1 }} color="primary" />
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" gutterBottom><strong>Interaction 3 (Game):</strong> {scores.interaction3Game} / 1 point</Typography>
              <LinearProgress variant="determinate" value={(scores.interaction3Game / 1) * 100} sx={{ mt: 1, height: 8, borderRadius: 1 }} color="primary" />
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" gutterBottom><strong>Interaction 3 (Term Explanation):</strong> {scores.interaction3Term} / 5 points</Typography>
              <LinearProgress variant="determinate" value={(scores.interaction3Term / 5) * 100} sx={{ mt: 1, height: 8, borderRadius: 1 }} color="primary" />
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ border: '3px solid', borderColor: 'primary.main', backgroundColor: 'primary.lighter' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">Total Score: {scores.total} / 17 points</Typography>
              <LinearProgress variant="determinate" value={(scores.total / 17) * 100} sx={{ mt: 1, height: 10, borderRadius: 1 }} color="primary" />
            </CardContent>
          </Card>
        </Stack>
      </Paper>

      {routing && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: routing.shouldProceed ? 'success.lighter' : 'info.lighter', border: '2px solid', borderColor: routing.shouldProceed ? 'success.main' : 'info.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: routing.shouldProceed ? 'success.main' : 'info.main', mr: 2 }} />
            <Box>
              <Typography variant="h5" color={routing.shouldProceed ? 'success.dark' : 'info.dark'}>
                {routing.shouldProceed ? 'Great Progress!' : 'Practice Time'}
              </Typography>
              <Typography variant="body2" color="text.secondary">Assigned Level: <strong>{routing.remedialLevel}</strong></Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {routing.shouldProceed
              ? `You've scored ${routing.totalScore} points! You'll proceed to remedial activities at ${routing.remedialLevel} level.`
              : `You've scored ${routing.totalScore} points. You'll complete remedial activities at ${routing.remedialLevel} level.`}
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2"><strong>Next Steps:</strong> You'll complete remedial activities designed for {routing.remedialLevel} level.</Typography>
          </Alert>
          <Button variant="contained" color={routing.shouldProceed ? 'success' : 'primary'} onClick={handleContinue} size="large" fullWidth sx={{ mt: 3 }}>
            Continue to {routing.remedialLevel} Remedial Activities
          </Button>
        </Paper>
      )}
    </Box>
  )
}
