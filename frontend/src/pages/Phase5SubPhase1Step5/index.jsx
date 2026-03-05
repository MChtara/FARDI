import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Chip, Alert } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import EditIcon from '@mui/icons-material/Edit'

/**
 * Phase 5 Step 5: Evaluate
 * Progressive Error Correction - Correct faulty crisis communication texts
 */

const KEY_VOCABULARY = ['strength', 'weakness', 'calm', 'transparent', 'reassure', 'resolve', 'refine']

const LEARNING_OUTCOMES = {
  A2: 'Can spot and fix basic spelling/grammar in short crisis messages.',
  B1: 'Can correct grammar, simple structure, polite tone, and basic vocabulary.',
  B2: 'Can improve coherence, cohesion, calm tone, vocabulary precision, and logical crisis flow.',
  C1: 'Can deliver nuanced, professional-level corrections across all dimensions (tone, strategy, stakeholder sensitivity, persuasive reassurance), achieving full autonomy in crisis communication writing.'
}

export default function Phase5Step5Intro() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/phase5/subphase/1/step/5/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 5: Evaluate
        </Typography>
        <Typography variant="body1">
          Progressive Error Correction - Correct faulty crisis communication texts
        </Typography>
      </Paper>

      {/* Scenario Intro */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Excellent crisis writing! Now we evaluate by fixing 'wrong' versions with common mistakes. I'll give faulty texts - correct them step by step. Focus on one error type at a time to sharpen your editing skills."
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
          Key Vocabulary (for Wordshake game)
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

      {/* Correction Steps */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EditIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
          <Typography variant="h6" color="warning.dark">
            Correction Steps
          </Typography>
        </Box>
        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Interaction 1:</strong> Correct spelling errors only
          </Typography>
          <Typography variant="body2">
            <strong>Interaction 2:</strong> Correct grammar errors (using spelling-corrected version)
          </Typography>
          <Typography variant="body2">
            <strong>Interaction 3:</strong> Enhance overall quality (coherence, tone, vocabulary, politeness) + Play Wordshake
          </Typography>
        </Stack>
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          What You'll Do:
        </Typography>
        <Typography variant="body2">
          1. Correct spelling mistakes in faulty crisis texts
        </Typography>
        <Typography variant="body2">
          2. Correct grammar mistakes using your spelling-corrected version
        </Typography>
        <Typography variant="body2">
          3. Enhance overall quality and play Wordshake for feedback terms
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
          Remember: Focus on one error type at a time for better learning!
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
          Start Step 5: Evaluate
        </Button>
      </Box>
    </Box>
  )
}
