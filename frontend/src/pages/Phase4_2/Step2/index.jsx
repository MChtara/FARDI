import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent, Chip, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ExploreIcon from '@mui/icons-material/Explore'
import CreateIcon from '@mui/icons-material/Create'
import TagIcon from '@mui/icons-material/Tag'

/**
 * Phase 4.2 Step 2: Explore - Social Media Post Writing
 * Students explore real posts and write trial captions
 */

export default function Phase4_2Step2Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    navigate('/phase4_2/step/2/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4.2: Marketing & Promotion (Social Media Focus)
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explore - Real Social Media Posts
        </Typography>
        <Typography variant="body1">
          Explore effective social media elements and write your own trial captions
        </Typography>
      </Paper>

      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
          <ExploreIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Scenario
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's explore how real posts attract people! Look at these examples, then write your own short trial post for our festival."
        />
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            The committee explores real social media posts from successful cultural events to identify what makes them engaging and effective.
          </Typography>
        </Box>
      </Paper>

      {/* Example Posts */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        <CreateIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Real Social Media Post Examples
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Instagram Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>IG</Typography>
                </Box>
                <Typography variant="h6">
                  Instagram Caption Example
                </Typography>
              </Box>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 2, color: '#333', whiteSpace: 'pre-line' }}>
                  "Experience the world in one place! 🌍✨

Join us for the Global Cultures Festival featuring food, music, and art from 20+ countries.

Save the date! March 8th 📅

Tag a friend who loves culture! 👥

#GlobalCultures #CulturalFestival #DiversityMatters #UniversityLife"
                </Typography>
              </Paper>
              <Box sx={{ p: 2, backgroundColor: 'success.lighter', borderRadius: 1 }}>
                <Typography variant="caption" fontWeight="bold" color="success.dark">
                  Effective Elements:
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Chip label="✓ Eye-catching emoji" size="small" color="success" variant="outlined" />
                  <Chip label="✓ Clear call-to-action" size="small" color="success" variant="outlined" />
                  <Chip label="✓ Multiple relevant hashtags" size="small" color="success" variant="outlined" />
                  <Chip label="✓ Direct audience engagement" size="small" color="success" variant="outlined" />
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Twitter/X Thread Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: '#1DA1F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>𝕏</Typography>
                </Box>
                <Typography variant="h6">
                  Twitter/X Thread Example
                </Typography>
              </Box>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>🧵 1/3:</strong> Breaking news! 🎉 Our university is hosting the Global Cultures Festival next month! Get ready for an unforgettable experience.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>2/3:</strong> Experience authentic cuisine, traditional music, and cultural exhibitions from around the world. Free entry for all students! 🎭🎵
                </Typography>
                <Typography variant="body2" sx={{ color: '#333' }}>
                  <strong>3/3:</strong> Mark your calendars: March 8th! Tag a friend who loves exploring new cultures 👥 #GlobalCultures #CampusEvent
                </Typography>
              </Paper>
              <Box sx={{ p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
                <Typography variant="caption" fontWeight="bold" color="info.dark">
                  Effective Elements:
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Chip label="✓ Thread format for storytelling" size="small" color="info" variant="outlined" />
                  <Chip label="✓ Engaging hook (Breaking news!)" size="small" color="info" variant="outlined" />
                  <Chip label="✓ Specific details and benefits" size="small" color="info" variant="outlined" />
                  <Chip label="✓ Tag friends strategy" size="small" color="info" variant="outlined" />
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Preview */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'primary.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          What You'll Do:
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography variant="h5" color="primary">1</Typography>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Play Sushi Spell & Write</Typography>
              <Typography variant="body2" color="text.secondary">
                Activate vocabulary with Sushi Spell, then write your own 3–6 sentence Instagram post for the Global Cultures Festival
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography variant="h5" color="primary">2</Typography>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Explain Engagement</Typography>
              <Typography variant="body2" color="text.secondary">
                Identify one element (hashtag, emoji, or CTA) from your post and explain why it makes your post engaging
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography variant="h5" color="primary">3</Typography>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Revise & Improve</Typography>
              <Typography variant="body2" color="text.secondary">
                Play Sushi Spell again, then improve one sentence using a new social media term
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Start Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="info"
          size="large"
          onClick={handleStartActivities}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2 }}
        >
          Start Exploring & Writing
        </Button>
      </Box>
    </Box>
  )
}
