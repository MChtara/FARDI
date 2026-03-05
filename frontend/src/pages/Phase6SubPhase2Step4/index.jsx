import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Chip, Stack } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'

const VOCABULARY = ['respond', 'politely', 'disagree', 'consider', 'thank', 'constructive', 'accept', 'improve']
const SUSHI_WORDS = ['constructive', 'specific', 'balanced', 'suggestion', 'empathy']

export default function Phase6SP2Step4Intro() {
  const navigate = useNavigate()
  const [sushiDone, setSushiDone] = useState(false)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 6.2: Peer Feedback Discussion</Typography>
        <Typography variant="h6">Step 4: Elaborate - Responding to Feedback</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">Scenario</Typography>
        <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
          Mr. Karim introduces the activity for today's lesson.
        </Typography>
        <Typography variant="body1">
          "Spell these words about responding to feedback!"
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#ede0f5', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">Key Vocabulary</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
          {VOCABULARY.map((word, idx) => (
            <Chip key={idx} label={word} sx={{ backgroundColor: '#8e44ad', color: 'white', fontWeight: 'bold', '&:hover': { backgroundColor: '#6c3483' } }} />
          ))}
        </Stack>
      </Paper>

      {/* Sushi Spell Game */}
      <Box sx={{ mb: 3 }}>
        <SushiSpellGame
          step={4}
          interaction={0}
          targetWords={SUSHI_WORDS}
          onComplete={() => setSushiDone(true)}
          subphase={2}
        />
      </Box>

      {sushiDone && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" size="large" onClick={() => navigate('/phase6/subphase/2/step/4/interaction/1')} startIcon={<PlayArrowIcon />}
            sx={{ px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
            Start Activities
          </Button>
        </Box>
      )}
    </Box>
  )
}
