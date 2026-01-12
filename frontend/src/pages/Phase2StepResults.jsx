import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Stack, Chip, Button, LinearProgress } from '@mui/material'
import { CharacterMessage } from '../components/Avatar.jsx'

export default function Phase2StepResults() {
  const { stepId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/phase2/step-results?step_id=${encodeURIComponent(stepId)}`, { credentials: 'include' })
      .then(async r => { if (!r.ok) throw new Error('Failed to load step results'); return r.json() })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [stepId])

  if (loading) return <Box sx={{ p: 3 }}><LinearProgress /></Box>
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>
  if (!data) return null

  const success = !!data.success

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" gutterBottom>Step Results</Typography>
        <Stack direction={{ xs:'column', sm:'row' }} spacing={1}>
          <Chip label={`Score: ${data.total_score}`} />
          <Chip label={`Threshold: ${data.success_threshold}`} />
          <Chip label={`${data.completed_items}/${data.total_items} items`} />
        </Stack>
      </Paper>

      {success ? (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <CharacterMessage 
            speaker="Ms. Mabrouki" 
            message={data.success_feedback || "Great job! You've successfully completed this step of our cultural event planning!"} 
            showRole={true}
          />
          <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
            {data.next_step ? (
              <Button onClick={() => navigate(`/phase2/step/${data.next_step}`)}>Go to {data.next_step_title}</Button>
            ) : (
              <Button onClick={() => navigate('/phase2/complete')}>Finish Phase 2</Button>
            )}
            <Button variant="outlined" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </Stack>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <CharacterMessage 
            speaker="SKANDER" 
            message={data.remedial_feedback || "Great start! Let's do some fun practice activities to polish your skills before moving forward with our cultural event planning!"} 
            showRole={true}
          />
          <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
            <Button onClick={() => navigate(`/phase2/remedial/${data.step_id}/${data.user_level}`)}>Start Practice</Button>
            <Button variant="outlined" onClick={() => navigate(`/phase2/step/${data.step_id}`)}>Back to Step</Button>
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

