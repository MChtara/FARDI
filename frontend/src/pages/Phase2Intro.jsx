import React, { useEffect } from 'react'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { CharacterMessage } from '../components/Avatar.jsx'

export default function Phase2Intro() {
  // Ensure server initializes Phase 2 session
  useEffect(() => {
    fetch('/phase2', { credentials: 'include' }).catch(() => {})
  }, [])

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" gutterBottom>Phase 2: Cultural Event Planning</Typography>
        
        <CharacterMessage 
          speaker="Ms. Mabrouki" 
          message="Welcome, team! You're an essential member of our Cultural Event Planning Committee at the university. Together we'll create a vibrant celebration of Tunisian culture through teamwork and collaboration!"
          showRole={true}
        >
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Work with your team to assign roles, schedule meetings, plan tasks, and create a final action plan. Respond concisely and authentically.
          </Typography>
        </CharacterMessage>
        
        <Stack direction={{ xs:'column', sm:'row' }} spacing={2} sx={{ mt: 2 }}>
          <Button component={RouterLink} to="/phase2/step/step_1">Start Step 1: Assigning Roles</Button>
          <Button component={RouterLink} to="/dashboard" variant="outlined">Back to Dashboard</Button>
        </Stack>
      </Paper>
    </Box>
  )
}
