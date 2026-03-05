import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Stack, Chip, Button, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'

export default function Phase5Complete() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(true)

  // Gather scores from sessionStorage
  const sub1Total = parseInt(sessionStorage.getItem('phase5_subphase1_overall_total') || '0')
  const sub2Total = parseInt(sessionStorage.getItem('phase5_subphase2_overall_total') || '0')
  const grandTotal = sub1Total + sub2Total

  useEffect(() => {
    // Mark Phase 5 as complete in DB
    fetch('/api/phase/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        phase_number: 5,
        overall_score: grandTotal,
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
          p: 5,
          mb: 3,
          background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f97316 100%)',
          color: 'white',
          textAlign: 'center',
          borderRadius: 3
        }}
      >
        <EmojiEventsIcon sx={{ fontSize: 100, mb: 2, color: '#ffd740' }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          All Phases Complete!
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 1 }}>
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          You've completed the entire FARDI Language Assessment Journey
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Phase 5 Summary
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body1">SubPhase 1: Handling a Last-Minute Issue</Typography>
            <Chip icon={<CheckCircleIcon />} label={`${sub1Total} pts`} color="success" size="small" />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body1">SubPhase 2: Giving Instructions</Typography>
            <Chip icon={<CheckCircleIcon />} label={`${sub2Total} pts`} color="success" size="small" />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 1, border: '1px solid', borderColor: 'error.main' }}>
            <Typography variant="h6" fontWeight="bold">Phase 5 Total</Typography>
            <Chip label={`${grandTotal} points`} color="error" sx={{ fontWeight: 700, fontSize: '1rem' }} />
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 3,
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '2px solid',
          borderColor: 'success.main',
          borderRadius: 3
        }}
      >
        <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mb: 2 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <StarIcon key={i} sx={{ fontSize: 40, color: '#ffd740' }} />
          ))}
        </Stack>
        <Typography variant="h5" color="success.dark" fontWeight="bold" gutterBottom>
          Congratulations on Completing the Full Journey!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You've progressed through all phases of the Global Cultures Festival project:
          Foundation Assessment, Cultural Event Planning, Marketing & Promotion,
          and Execution & Problem-Solving. Your English communication skills have been
          assessed and developed across real-world scenarios.
        </Typography>
      </Paper>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <EmojiEventsIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{
            py: 2,
            fontWeight: 700,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #5856eb 0%, #7c3aed 100%)' }
          }}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/results')}
          sx={{ py: 2 }}
        >
          View All Results
        </Button>
      </Stack>
    </Box>
  )
}
