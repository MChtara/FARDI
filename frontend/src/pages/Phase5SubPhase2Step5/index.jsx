import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

export default function Phase5SubPhase2Step5Intro() {
  const navigate = useNavigate()

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2: Step 5 - Evaluate - Correct Faulty Instructions
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Excellent instructions for our volunteers! Now we evaluate by fixing 'wrong' versions with typical mistakes. I'll give faulty texts - correct them step by step. Focus on one error type at a time to sharpen your editing skills."
        />
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/phase5/subphase/2/step/5/interaction/1')}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          Start Evaluation Activities
        </Button>
      </Box>
    </Box>
  )
}
