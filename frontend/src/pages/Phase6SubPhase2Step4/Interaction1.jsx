import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography } from '@mui/material'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'
import { phase6API } from '../../lib/phase6_api.jsx'

const TARGET_WORDS = ['feedback', 'constructive', 'positive', 'suggestion', 'strength']

export default function Phase6SP2Step4Int1() {
  const navigate = useNavigate()

  const handleGameComplete = async (gameData) => {
    const score = gameData.score !== undefined ? gameData.score : (gameData.completed ? 1 : 0)
    sessionStorage.setItem('phase6_sp2_step4_interaction1_score', score.toString())
    try { await phase6API.trackGame(4, 1, gameData, 2) } catch (e) { console.error('Track failed:', e) }
    setTimeout(() => navigate('/phase6/subphase/2/step/4/interaction/2'), 2000)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Phase 6: Reflection and Evaluation</Typography>
        <Typography variant="h5" gutterBottom>Step 4: Elaborate - Interaction 1</Typography>
        <Typography variant="body1">Sushi Spell - Peer Feedback Vocabulary</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>Ms. Mabrouki: "Play Sushi Spell, then write a full piece of peer feedback on a sample report. Use the positive sandwich: start positive, suggest improvement, end positive."</Typography>
      </Paper>
      <SushiSpellGame step={4} interaction={1} targetTime={120} targetWords={TARGET_WORDS} onComplete={handleGameComplete} />
    </Box>
  )
}
