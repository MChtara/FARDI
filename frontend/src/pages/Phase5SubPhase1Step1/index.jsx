import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent, Link } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

/**
 * Phase 5 Step 1: Engage - Handling a Last-Minute Issue
 * Intro page with scenario setup and real examples
 */

export default function Phase5Step1Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    navigate('/phase5/subphase/1/step/1/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Handling a Last-Minute Issue
        </Typography>
        <Typography variant="body1">
          Develop problem-solving skills by managing unexpected challenges during the Global Cultures Festival
        </Typography>
      </Paper>

      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Scenario
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="We have a big problem! The main singer just canceled due to illness, and the Global Cultures Festival starts soon. We need to solve this quickly and professionally. Let's discuss how to handle this last-minute issue and keep the festival running smoothly."
        />
      </Paper>

      {/* Real Examples Section */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
        Real-World Examples
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Before we start, let's look at how real events handle last-minute problems:
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Festival Cancellation Email Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Festival Cancellation Email
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                See how professional event organizers communicate cancellations and changes to attendees.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                href="https://theeventscalendar.com/blog/event-cancellation-announcement-examples/"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
                fullWidth
              >
                View Cancellation Examples
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Last-Minute Change Announcement */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Social Media Change Announcement
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Learn how events use social media to quickly inform people about last-minute changes.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                href="https://twitter.com/example/status/change-post"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
                fullWidth
              >
                View Social Media Examples
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Learning Outcomes */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          What You'll Learn
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Problem-Solving Vocabulary:</strong> problem, cancel, change, solution, sorry, alternative, fix, urgent
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Solution Strategies:</strong> How to suggest and explain solutions professionally
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Communication Skills:</strong> Writing clear messages and announcements
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Professional Tone:</strong> Maintaining calm and professional communication during crises
          </Typography>
        </Box>
      </Paper>

      {/* Key Vocabulary Preview */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'warning.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Key Vocabulary You'll Practice
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {['problem', 'cancel', 'change', 'solution', 'sorry', 'alternative', 'fix', 'urgent'].map((word, idx) => (
            <Typography
              key={idx}
              variant="body2"
              sx={{
                px: 2,
                py: 1,
                bgcolor: 'warning.main',
                color: 'white',
                borderRadius: 1,
                fontWeight: 'bold'
              }}
            >
              {word}
            </Typography>
          ))}
        </Box>
      </Paper>

      {/* Start Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={handleStartActivities}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          Start Problem-Solving Activities
        </Button>
      </Box>
    </Box>
  )
}
