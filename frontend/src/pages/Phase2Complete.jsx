import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Stack, Chip, LinearProgress, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CharacterMessage } from '../components/Avatar.jsx'

export default function Phase2Complete() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/phase2/overall', { credentials: 'include' })
      .then(async r => { if (!r.ok) throw new Error('No Phase 2 data'); return r.json() })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Box sx={{ p: 3 }}><LinearProgress /></Box>
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>
  if (!data) return null

  const { overall_level, total_score, step_scores, level_distribution, total_responses, completion_rate } = data

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" gutterBottom>Phase 2 Complete</Typography>
        
        <CharacterMessage 
          speaker="Ms. Mabrouki" 
          message="Congratulations, team! You've successfully completed Phase 2 of our cultural event planning. Your collaboration, creativity, and dedication have made this an incredible journey. The action plan you've created will bring our Tunisian cultural celebration to life!"
          showRole={true}
        />
        
        <CharacterMessage 
          speaker="SKANDER" 
          message="Amazing work, everyone! Your teamwork and cultural insights have impressed me. You've shown great leadership in planning this event. I'm excited to see how our celebration will showcase Tunisian traditions!"
          showRole={false}
        />
        
        <Stack direction={{ xs:'column', sm:'row' }} spacing={1} sx={{ mt: 2 }}>
          <Chip label={`Level: ${overall_level}`} />
          <Chip label={`Total Score: ${total_score}`} />
          <Chip label={`Responses: ${total_responses}`} />
          <Chip label={`Completion: ${Math.round(completion_rate)}%`} />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Step Scores</Typography>
        {Object.entries(step_scores||{}).map(([id, s]) => (
          <Stack key={id} direction="row" spacing={2} alignItems="center" sx={{ py: 0.5 }}>
            <Typography sx={{ minWidth: 140 }}>{String(id).replaceAll('_',' ')}</Typography>
            <Chip label={`${s.score} pts`} size="small" />
            <Typography color="text.secondary" variant="body2">({s.items} items • avg {s.average})</Typography>
          </Stack>
        ))}
      </Paper>

      <Stack direction={{ xs:'column', sm:'row' }} spacing={2} sx={{ mt: 2 }}>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        <Button variant="outlined" href="/certificate">View Certificate</Button>
      </Stack>
    </Box>
  )
}

