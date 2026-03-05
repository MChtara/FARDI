import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Chip, Stack } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

const VOCABULARY = ['specific', 'actionable', 'clear', 'example', 'improve', 'understand', 'vague', 'general']
const WORDSHAKE_WORDS = ['feedback', 'constructive', 'positive', 'suggestion', 'specific', 'polite', 'empathy']

export default function Phase6SP2Step3Intro() {
  const navigate = useNavigate()
  const [wordshakeDone, setWordshakeDone] = useState(false)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>SubPhase 6.2: Peer Feedback Discussion</Typography>
        <Typography variant="h6">Step 3: Explain - Specific vs General Feedback</Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">Scenario</Typography>
        <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
          Mr. Karim introduces the activity for today's lesson.
        </Typography>
        <Typography variant="body1">
          "Watch this video about effective feedback, then explain what you learned."
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

      {/* Wordshake Game */}
      <Box sx={{ mb: 3 }}>
        <WordshakeGame
          step={3}
          interaction={0}
          targetWords={WORDSHAKE_WORDS}
          onComplete={() => setWordshakeDone(true)}
          subphase={2}
        />
      </Box>

      {wordshakeDone && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" size="large" onClick={() => navigate('/phase6/subphase/2/step/3/interaction/1')} startIcon={<PlayArrowIcon />}
            sx={{ px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', '&:hover': { opacity: 0.9 } }}>
            Start Activities
          </Button>
        </Box>
      )}
    </Box>
  )
}
