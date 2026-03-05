import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'

/**
 * Phase 6 SubPhase 1 Step 1: Engage
 * Interaction 1: Wordshake Game
 * Find words related to reviewing and reflecting on events
 */

const TARGET_WORDS = [
  'success', 'challenge', 'feedback', 'improve', 'achievement',
  'strength', 'weakness', 'recommend', 'summary', 'positive', 'negative'
]

export default function Phase6SP1Step1Interaction1() {
  const navigate = useNavigate()

  const handleGameComplete = async (gameData) => {
    // Store score in sessionStorage
    const score = gameData.score !== undefined ? gameData.score : (gameData.completed ? 1 : 0)
    sessionStorage.setItem('phase6_sp1_step1_interaction1_score', score.toString())

    // Track game completion on backend
    try {
      await phase6API.trackGame(1, 1, gameData, 1)
    } catch (error) {
      console.error('Failed to track game:', error)
    }

    // Navigate to next interaction after a short delay
    setTimeout(() => {
      navigate('/phase6/subphase/1/step/1/interaction/2')
    }, 2000)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection and Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Interaction 1
        </Typography>
        <Typography variant="body1">
          Wordshake - Find reflection and evaluation vocabulary
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's warm up! Find words related to reviewing and reflecting on events. Look for words like 'success', 'challenge', 'feedback', and 'achievement'. You have 3 minutes — find as many as you can!"
        />
      </Paper>

      {/* Game Component */}
      <WordshakeGame
        step={1}
        interaction={1}
        targetTime={180}
        targetWords={TARGET_WORDS}
        onComplete={handleGameComplete}
      />
    </Box>
  )
}
