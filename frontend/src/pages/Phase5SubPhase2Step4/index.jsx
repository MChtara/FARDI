import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

export default function Phase5SubPhase2Step4Intro() {
  const navigate = useNavigate()

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2: Step 4 - Elaborate - Complete Instructions
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="The festival is tomorrow - our volunteers need clear instructions! Use the guided templates with examples, adapt them to different roles (entrance, booth, queue, etc.), and self-check grammar, spelling, politeness, sequencing, and clarity before submitting."
        />
      </Paper>

      {/* Template-Based Writing Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Template-Based Writing Guide
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You'll use guided templates with examples to write complete sets of instructions for different volunteer roles:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li><strong>Entrance Volunteer:</strong> Welcome guests, check tickets, guide them</li>
          <li><strong>Queue Manager:</strong> Manage lines, maintain order, ensure safety</li>
          <li><strong>Booth Assistant:</strong> Help at booths, engage guests, provide information</li>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Each template includes step-by-step examples. Adapt them to your own writing style while keeping them clear, polite, and safe!
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/phase5/subphase/2/step/4/interaction/1')}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          Start Elaboration Activities
        </Button>
      </Box>
    </Box>
  )
}
