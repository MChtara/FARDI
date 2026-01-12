import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Chip, Stack } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

/**
 * Phase 4 Step 2: Explain - Promotion Basics
 * Introduction to promotion basics before activities begin
 */

export default function Phase4Step2Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    // Start with vocabulary warm-up before interactions
    navigate('/app/phase4/step/2/vocabulary')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explain
        </Typography>
        <Typography variant="body1">
          Understanding promotion basics: posters and videos
        </Typography>
      </Paper>

      {/* Congratulations Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'success.lighter', border: '2px solid', borderColor: 'success.main' }}>
        <Typography variant="h6" gutterBottom color="success.dark" sx={{ fontWeight: 'bold' }}>
          🎉 Congratulations!
        </Typography>
        <Typography variant="body1" color="success.dark">
          You've successfully completed the remedial phase and are ready to move forward to Step 2!
        </Typography>
      </Paper>

      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
          Scenario
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's explain posters first (e.g., promotional, persuasive), then videos (e.g., dramatisation, creative). We'll watch three short videos: first on ad characteristics, then two video ad examples. Listen for terms like 'promotional', 'persuasive', 'dramatisation', and note how they apply to posters/videos!"
        />
      </Paper>

      {/* Key Terms to Listen For */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Key Terms to Listen For
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="Promotional" color="primary" variant="outlined" />
          <Chip label="Persuasive" color="primary" variant="outlined" />
          <Chip label="Dramatisation" color="primary" variant="outlined" />
          <Chip label="Creative" color="primary" variant="outlined" />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Pay attention to how these terms are used in the context of posters and video advertisements.
        </Typography>
      </Paper>

      {/* Learning Objectives */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'warning.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          What You'll Learn
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Poster Types:</strong> Promotional vs. Persuasive approaches
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Video Types:</strong> Dramatisation and creative techniques
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Ad Characteristics:</strong> What makes advertisements effective
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Application:</strong> How these concepts apply to both posters and videos
          </Typography>
        </Box>
      </Paper>

      {/* Start Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleStartActivities}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2 }}
        >
          Start Learning Activities
        </Button>
      </Box>
    </Box>
  )
}
