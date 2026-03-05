import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Chip, Alert } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'

/**
 * Phase 5 Step 3: Explain
 * Crisis Communication Concepts - Defining and explaining terms
 */

const KEY_VOCABULARY = ['emergency', 'contingency', 'backup', 'immediate', 'announce', 'update', 'communicate', 'resolve', 'transparent', 'reassure']

const LEARNING_OUTCOMES = {
  A2: 'Can define basic crisis terms (e.g., "Emergency is big problem")',
  B1: 'Can explain simple functions with examples (e.g., "Backup is extra light because problem")',
  B2: 'Can describe strategies with reasons (e.g., "Announce quickly because people need to know")',
  C1: 'Can analyze integrated use (e.g., "Transparent updates and contingency plans minimize panic and maintain trust during crises")'
}

export default function Phase5Step3Intro() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/phase5/subphase/1/step/3/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 3: Explain
        </Typography>
        <Typography variant="body1">
          Crisis Communication Concepts - Defining and explaining terms
        </Typography>
      </Paper>

      {/* Scenario Intro */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Now let's explain how to handle a last-minute crisis like our lighting failure. We will watch three short videos: first on crisis communication basics, then two real event crisis examples. Listen carefully and get ready to talk about the terms."
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

      {/* Video Resources */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'warning.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <VideoLibraryIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
          <Typography variant="h6" color="warning.dark">
            Video Resources
          </Typography>
        </Box>
        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Interaction 1:</strong> Watch videos on crisis communication basics
          </Typography>
          <Typography variant="body2">
            <strong>Interaction 2:</strong> Read real crisis communication examples
          </Typography>
          <Typography variant="body2">
            <strong>Interaction 3:</strong> Play Sushi Spell and explain terms
          </Typography>
        </Stack>
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          What You'll Do:
        </Typography>
        <Typography variant="body2">
          1. Play Wordshake to activate vocabulary (3 minutes)
        </Typography>
        <Typography variant="body2">
          2. Watch videos and define 'contingency' plan
        </Typography>
        <Typography variant="body2">
          3. Read examples and explain 'transparent' communication
        </Typography>
        <Typography variant="body2">
          4. Play Sushi Spell and explain one term relating to the videos
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
          Start Step 3: Explain
        </Button>
      </Box>
    </Box>
  )
}
