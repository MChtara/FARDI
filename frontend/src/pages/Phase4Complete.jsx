import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Stack, Chip, Button, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function Phase4Complete() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(true)

  // Gather scores from sessionStorage
  const step1Score = parseInt(sessionStorage.getItem('phase4_step1_total_score') || '0')
  const step3Score = parseInt(sessionStorage.getItem('phase4_step3_total_score') || '0')
  const step4Score = parseInt(sessionStorage.getItem('phase4_step4_total_score') || '0')
  const step5Score = parseInt(sessionStorage.getItem('phase4_step5_total_score') || '0')
  const totalScore = step1Score + step3Score + step4Score + step5Score

  useEffect(() => {
    // Mark Phase 4 as complete in DB
    fetch('/api/phase/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        phase_number: 4,
        overall_score: totalScore,
        final_level: ''
      })
    })
      .catch(() => {})
      .finally(() => setSaving(false))
  }, [])

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
          color: 'white',
          textAlign: 'center',
          borderRadius: 3
        }}
      >
        <EmojiEventsIcon sx={{ fontSize: 80, mb: 2, color: '#ffd740' }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Phase 4 Complete!
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Marketing & Promotion
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Your Performance
        </Typography>
        <Stack spacing={2}>
          {[
            { label: 'Step 1: Engage', score: step1Score },
            { label: 'Step 3: Explain', score: step3Score },
            { label: 'Step 4: Elaborate', score: step4Score },
            { label: 'Step 5: Evaluate', score: step5Score },
          ].map((step, i) => (
            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body1">{step.label}</Typography>
              <Chip
                icon={<CheckCircleIcon />}
                label={`${step.score} pts`}
                color="success"
                size="small"
              />
            </Stack>
          ))}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, bgcolor: 'warning.lighter', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
            <Typography variant="h6" fontWeight="bold">Total Score</Typography>
            <Chip label={`${totalScore} points`} color="warning" sx={{ fontWeight: 700, fontSize: '1rem' }} />
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: 'success.lighter', border: '1px solid', borderColor: 'success.main' }}>
        <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
        <Typography variant="h6" color="success.dark" fontWeight="bold">
          Congratulations! You've unlocked Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Handle last-minute issues and coordinate volunteers at the Global Cultures Festival
        </Typography>
      </Paper>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          endIcon={saving ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
          disabled={saving}
          onClick={() => navigate('/phase5/subphase/1/step/1')}
          sx={{
            py: 2,
            fontWeight: 700,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)' }
          }}
        >
          Continue to Phase 5
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/dashboard')}
          sx={{ py: 2 }}
        >
          Back to Dashboard
        </Button>
      </Stack>
    </Box>
  )
}
