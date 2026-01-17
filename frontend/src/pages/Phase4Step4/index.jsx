import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

/**
 * Phase 4 Step 4: Apply - Complete Poster and Video Description
 * Introduction to the main activity where students write complete descriptions
 * Updated: 2026-01-14
 */

export default function Phase4Step4Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    // Start with Interaction 1 - Poster Description
    navigate('/app/phase4/step/4/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Elaborate
        </Typography>
        <Typography variant="body1">
          Writing complete descriptions for posters and videos
        </Typography>
      </Paper>

      {/* Congratulations Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'success.lighter', border: '2px solid', borderColor: 'success.main' }}>
        <Typography variant="h6" gutterBottom color="success.dark" sx={{ fontWeight: 'bold' }}>
          Congratulations!
        </Typography>
        <Typography variant="body1" color="success.dark">
          You've successfully completed the previous steps and are ready to apply what you've learned!
        </Typography>
      </Paper>

      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
          Main Activity (Scenario)
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Now apply what we've learned by writing a complete description of a poster first (using the guided template with examples), then a script for a video (using the guided template with examples), for the festival. Focus on grammar, spelling, and structure—follow the examples, adapt them, and self-check for mistakes before submitting."
        />
      </Paper>

      {/* What You'll Do */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'warning.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          What You'll Do
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
              1. Poster Description
            </Typography>
            <Typography variant="body1">
              Write 4-8 sentences describing poster elements (layout, colors, slogan) using the guided template with examples. Adapt the examples to your ideas and check for grammar/spelling mistakes.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
              2. Video Script
            </Typography>
            <Typography variant="body1">
              Write a complete script for a video using the guided template with examples. Focus on structure, grammar, and spelling.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Learning Focus */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Assessment Focus
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Writing Skills:</strong> Grammar, spelling, and structure
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Vocabulary Use:</strong> Appropriate marketing and promotional terms
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Template Adaptation:</strong> Following examples and making them your own
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Self-Correction:</strong> Checking for mistakes before submitting
          </Typography>
        </Box>
      </Paper>

      {/* Key Tips */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, border: '2px solid', borderColor: 'warning.main' }}>
        <Typography variant="h6" gutterBottom color="warning.dark">
          Important Tips
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Use the examples as models, change words to make it your own
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Check for grammar mistakes (e.g., subject-verb agreement)
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Check for spelling mistakes (e.g., "gatefold")
          </Typography>
          <Typography component="li" variant="body1">
            Ensure logical flow and structure in your writing
          </Typography>
        </Box>
      </Paper>

      {/* Start Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStartActivities}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2 }}
        >
          Start Writing Activities
        </Button>
      </Box>
    </Box>
  )
}
