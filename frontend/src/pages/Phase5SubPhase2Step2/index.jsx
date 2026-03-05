import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

/**
 * Phase 5 SubPhase 2 Step 2: Explore - Writing Instructions
 * Intro page with scenario setup
 */

export default function Phase5SubPhase2Step2Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    navigate('/phase5/subphase/2/step/2/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2: Step 2 - Explore - Writing Instructions
        </Typography>
        <Typography variant="body1">
          Explore real-world examples and experiment with writing clear, polite instructions
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Volunteers are the heart of our festival! Let's explore how to give them clear, polite instructions. Look at real volunteer task cards and briefings first (from cultural festivals and big events), then write your own short trial instructions for different roles using the templates. Try different styles and see what feels easy and friendly."
        />
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
          Start Exploration Activities
        </Button>
      </Box>
    </Box>
  )
}
