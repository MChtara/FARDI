import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

export default function Phase5SubPhase2Step3Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    navigate('/phase5/subphase/2/step/3/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2: Step 3 - Explain - Formalize Concepts
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Now let's explain how to give clear, polite, and safe instructions to our volunteers. We will watch three short videos: first on how to write instructions, then two real volunteer briefing examples from festivals. Listen carefully and be ready to talk about the terms."
        />
      </Paper>

      {/* Glossary Terms Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Key Glossary Terms
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Throughout this step, you'll learn about these important instruction terms:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {['please', 'thank you', 'first', 'then', 'next', 'after that', 'finally', 'careful', 'safety', 'guide', 'welcome', 'help', 'queue', 'clear', 'polite'].map((term, idx) => (
            <Typography
              key={idx}
              variant="body2"
              sx={{
                px: 2,
                py: 1,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 1,
                fontWeight: 'bold'
              }}
            >
              {term}
            </Typography>
          ))}
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStartActivities}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          Start Explanation Activities
        </Button>
      </Box>
    </Box>
  )
}
