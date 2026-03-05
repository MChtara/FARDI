import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, CircularProgress, LinearProgress, Stack, Card, CardContent } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'

const determineRemedialLevel = (i2Score) => {
  if (i2Score <= 1) return 'A1'
  if (i2Score <= 2) return 'A2'
  if (i2Score <= 3) return 'B1'
  if (i2Score <= 4) return 'B2'
  return 'C1'
}

export default function Phase6SP2Step2Score() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ i1: 0, i2: 0, i3: 0, total: 0 })
  const [level, setLevel] = useState('A1')
  const [shouldProceed, setShouldProceed] = useState(false)

  useEffect(() => {
    const calc = async () => {
      const i1 = parseInt(sessionStorage.getItem('phase6_sp2_step2_interaction1_score') || '0')
      const i2 = parseInt(sessionStorage.getItem('phase6_sp2_step2_interaction2_score') || '1')
      const i3 = parseInt(sessionStorage.getItem('phase6_sp2_step2_interaction3_score') || '0')
      const total = i1 + i2 + i3
      setScores({ i1, i2, i3, total })

      let remedialLevel = determineRemedialLevel(i2)
      let proceed = i2 >= 3
      try {
        const result = await phase6API.calculateStepScore(2, { interaction1_score: i1, interaction2_score: i2, interaction3_score: i3 }, 2)
        const data = result?.data || result || {}
        remedialLevel = data.total?.remedial_level || data.interaction2?.level || determineRemedialLevel(i2)
        proceed = data.total?.should_proceed ?? (i2 >= 3)
      } catch (e) { console.warn('Backend calc failed:', e) }

      setLevel(remedialLevel)
      setShouldProceed(proceed)
      sessionStorage.setItem('phase6_sp2_step2_total_score', total.toString())
      sessionStorage.setItem('phase6_sp2_step2_remedial_level', remedialLevel)
      setLoading(false)
    }
    calc()
  }, [])

  const handleContinue = () => {
    if (shouldProceed) {
      navigate('/phase6/subphase/2/step/3')
    } else {
      navigate(`/phase6/subphase/2/step/2/remedial/${level.toLowerCase()}/task/a`)
    }
  }

  if (loading) return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center', mt: 8 }}>
      <CircularProgress size={60} sx={{ mb: 3, color: '#8e44ad' }} />
      <Typography variant="h6">Calculating your score...</Typography>
    </Box>
  )

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 2: Score Summary</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">Performance Summary</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {[{ label: 'Interaction 1', score: scores.i1, max: 1 }, { label: 'Interaction 2 (Feedback Choice Explanation)', score: scores.i2, max: 4 }, { label: 'Interaction 3', score: scores.i3, max: 1 }].map((item, idx) => (
            <Card variant="outlined" key={idx}>
              <CardContent>
                <Typography variant="body1"><strong>{item.label}:</strong> {item.score} / {item.max}</Typography>
                <LinearProgress variant="determinate" value={(item.score / item.max) * 100} sx={{ mt: 1, height: 8, borderRadius: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#8e44ad' } }} />
              </CardContent>
            </Card>
          ))}
          <Card variant="outlined" sx={{ border: '3px solid #8e44ad', backgroundColor: '#8e44ad10' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#8e44ad' }}>Total: {scores.total} / 6</Typography>
              <LinearProgress variant="determinate" value={(scores.total / 6) * 100} sx={{ mt: 1, height: 12, borderRadius: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#8e44ad' } }} />
            </CardContent>
          </Card>
        </Stack>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter', border: '2px solid', borderColor: 'info.main', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 50, color: 'info.main', mr: 2 }} />
          <Box>
            <Typography variant="h5" color="info.dark">{shouldProceed ? 'Great Job! Moving Forward' : 'Practice Activities Ready'}</Typography>
            <Typography variant="body2" color="text.secondary">{shouldProceed ? 'You passed this step!' : `Assigned Level: ${level}`}</Typography>
          </Box>
        </Box>
        <Button variant="contained" onClick={handleContinue} size="large" fullWidth
          sx={{ mt: 2, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
          {shouldProceed ? 'Continue to Next Step' : `Continue to ${level} Remedial Activities`}
        </Button>
      </Paper>
    </Box>
  )
}
