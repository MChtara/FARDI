import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Chip, Alert } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'

/**
 * Phase 5 Step 2: Explore
 * Crisis Communication - Writing announcements and updates
 */

const KEY_VOCABULARY = ['emergency', 'backup', 'announce', 'update', 'communicate']

const LEARNING_OUTCOMES = {
  A2: 'Write 2-3 sentence announcements',
  B1: 'Write 4-6 sentence updates with reasons',
  B2: 'Write structured emails/announcements with polite language',
  C1: 'Write multi-channel crisis responses with strategic tone'
}

export default function Phase5Step2Intro() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/phase5/subphase/1/step/2/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explore
        </Typography>
        <Typography variant="body1">
          Crisis Communication - Writing announcements and updates
        </Typography>
      </Paper>

      {/* Scenario Intro */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="One hour before the Global Cultures Festival opens, the main stage lights fail! We need to write quick solutions: announcement to audience, email to sponsors, social media update. Let's explore real examples first."
        />
      </Paper>

      {/* Learning Outcomes */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h6" color="primary">
            Learning Outcomes
          </Typography>
        </Box>
        <Stack spacing={1}>
          {Object.entries(LEARNING_OUTCOMES).map(([level, outcome]) => (
            <Box key={level}>
              <Typography variant="body2" fontWeight="bold" color="primary">
                {level}:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {outcome}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Key Vocabulary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Key Vocabulary
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {KEY_VOCABULARY.map((term, idx) => (
            <Chip
              key={idx}
              label={term}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          What You'll Do:
        </Typography>
        <Typography variant="body2">
          1. Play Sushi Spell to activate vocabulary (emergency, backup, announce, update, communicate)
        </Typography>
        <Typography variant="body2">
          2. Write a short announcement (3-6 sentences) about the lighting problem
        </Typography>
        <Typography variant="body2">
          3. Explain why you chose your solution
        </Typography>
        <Typography variant="body2">
          4. Play Sushi Spell again and revise your announcement with a new term
        </Typography>
      </Alert>

      {/* Start Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStart}
          sx={{ px: 6, py: 1.5 }}
        >
          Start Step 2: Explore
        </Button>
      </Box>
    </Box>
  )
}
