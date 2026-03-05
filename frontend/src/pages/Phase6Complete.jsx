import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Stack, Chip, Button, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'

export default function Phase6Complete() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(true)

  // Gather scores from sessionStorage
  const sp1Steps = [1, 2, 3, 4, 5].map(s => parseInt(sessionStorage.getItem(`phase6_sp1_step${s}_total_score`) || '0'))
  const sp2Steps = [1, 2, 3, 4, 5].map(s => parseInt(sessionStorage.getItem(`phase6_sp2_step${s}_total_score`) || '0'))
  const sp1Total = sp1Steps.reduce((a, b) => a + b, 0)
  const sp2Total = sp2Steps.reduce((a, b) => a + b, 0)
  const grandTotal = sp1Total + sp2Total

  useEffect(() => {
    fetch('/api/phase/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        phase_number: 6,
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
          background: 'linear-gradient(135deg, #27ae60 0%, #8e44ad 50%, #6c3483 100%)',
          color: 'white',
          textAlign: 'center',
          borderRadius: 3
        }}
      >
        <EmojiEventsIcon sx={{ fontSize: 100, mb: 2, color: '#ffd740' }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Phase 6 Complete!
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 1 }}>
          Reflection and Evaluation Mastered
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 500, mx: 'auto' }}>
          You have successfully completed all reflection and evaluation activities.
          You can now write post-event reports and give constructive peer feedback!
        </Typography>
      </Paper>

      {saving ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Saving your progress...</Typography>
        </Box>
      ) : (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
              Score Summary
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ p: 2, backgroundColor: '#e8f8f0', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#27ae60">
                  SubPhase 6.1: Writing a Post-Event Report
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {sp1Steps.map((score, idx) => (
                    <Chip
                      key={idx}
                      label={`Step ${idx + 1}: ${score}/6`}
                      icon={<CheckCircleIcon />}
                      sx={{ backgroundColor: score >= 4 ? '#27ae60' : '#e0e0e0', color: score >= 4 ? 'white' : 'inherit' }}
                    />
                  ))}
                </Stack>
                <Typography variant="h6" sx={{ mt: 1, color: '#27ae60' }}>
                  Total: {sp1Total}/30
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: '#f5eef8', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#8e44ad">
                  SubPhase 6.2: Peer Feedback Discussion
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {sp2Steps.map((score, idx) => (
                    <Chip
                      key={idx}
                      label={`Step ${idx + 1}: ${score}/6`}
                      icon={<CheckCircleIcon />}
                      sx={{ backgroundColor: score >= 4 ? '#8e44ad' : '#e0e0e0', color: score >= 4 ? 'white' : 'inherit' }}
                    />
                  ))}
                </Stack>
                <Typography variant="h6" sx={{ mt: 1, color: '#8e44ad' }}>
                  Total: {sp2Total}/30
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: '#fff9c4', borderRadius: 1, textAlign: 'center' }}>
                <StarIcon sx={{ fontSize: 40, color: '#ffc107' }} />
                <Typography variant="h5" fontWeight="bold">
                  Grand Total: {grandTotal}/60
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              size="large"
              sx={{
                px: 4,
                background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
                '&:hover': { opacity: 0.9 }
              }}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/journey')}
              size="large"
              sx={{ px: 4 }}
            >
              View Journey
            </Button>
          </Stack>
        </>
      )}
    </Box>
  )
}
