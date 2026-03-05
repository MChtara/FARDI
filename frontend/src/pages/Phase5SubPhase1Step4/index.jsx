import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Chip, Alert } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import EditIcon from '@mui/icons-material/Edit'

/**
 * Phase 5 Step 4: Elaborate
 * Complete Crisis Communication Texts - Writing full announcements and emails
 */

const KEY_VOCABULARY = ['emergency', 'contingency', 'backup', 'announce', 'update', 'transparent', 'resolve', 'reassure']

const LEARNING_OUTCOMES = {
  A2: 'Can write simple guided announcements following examples (e.g., "Problem lights. We fix.")',
  B1: 'Can write structured messages with reasons following examples (e.g., "We use backup because emergency.")',
  B2: 'Can create detailed, polite crisis texts with logical flow following examples (e.g., "We are resolving... thank you for patience.")',
  C1: 'Can compose autonomous, nuanced crisis communications integrating strategic tone and multi-channel coordination following examples (e.g., "While we activate contingency measures... trust in our preparedness.")'
}

export default function Phase5Step4Intro() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/phase5/subphase/1/step/4/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Elaborate
        </Typography>
        <Typography variant="body1">
          Complete Crisis Communication Texts - Writing full announcements and emails
        </Typography>
      </Paper>

      {/* Scenario Intro */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="The lighting has failed - now write real crisis responses! Use the guided templates with examples, adapt them to the festival situation, and self-check grammar, spelling, and structure before submitting."
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

      {/* Writing Tasks */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EditIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
          <Typography variant="h6" color="warning.dark">
            Writing Tasks
          </Typography>
        </Box>
        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Interaction 1:</strong> Write an urgent social media announcement (4-8 sentences)
          </Typography>
          <Typography variant="body2">
            <strong>Interaction 2:</strong> Write an email to sponsors/team (5-10 sentences)
          </Typography>
          <Typography variant="body2">
            <strong>Interaction 3:</strong> Play Sushi Spell and revise one sentence using a spelled term
          </Typography>
        </Stack>
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          What You'll Do:
        </Typography>
        <Typography variant="body2">
          1. Write a social media announcement using the guided template
        </Typography>
        <Typography variant="body2">
          2. Write an email to sponsors/team using the guided template
        </Typography>
        <Typography variant="body2">
          3. Play Sushi Spell and revise one sentence with a spelled term
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
          Remember: Self-check for grammar, spelling, and structure mistakes!
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
          Start Step 4: Elaborate
        </Button>
      </Box>
    </Box>
  )
}
