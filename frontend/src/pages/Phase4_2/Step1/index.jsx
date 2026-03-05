import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent, Stack } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CampaignIcon from '@mui/icons-material/Campaign'
import TagIcon from '@mui/icons-material/Tag'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'

/**
 * Phase 4.2 Step 1: Engage - Social Media Promotion
 * Scenario setup for social media marketing
 */

export default function Phase4_2Step1Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    navigate('/phase4_2/step/1/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4.2: Marketing & Promotion (Social Media Focus)
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Social Media Introduction
        </Typography>
        <Typography variant="body1">
          Spark interest by connecting to social media promotion strategies
        </Typography>
      </Paper>

      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
          Scenario
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="We've planned the festival—now let's get people excited online! Look at these posts with strong captions, hashtags, and calls-to-action. We'll start with a quick game to activate vocabulary, then discuss how they work."
        />
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            The Cultural Committee gathers to brainstorm social media promotion for the Global Cultures Festival. Ms. Mabrouki shares real examples of Instagram and Twitter/X posts for cultural events.
          </Typography>
        </Box>
      </Paper>

      {/* Social Media Examples */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        Social Media Post Examples
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Instagram Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CampaignIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">
                  Instagram Post Example
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 2, color: '#333', fontStyle: 'italic' }}>
                  "Experience the world in one place! 🌍✨ Join us for the Global Cultures Festival featuring food, music, and art from 20+ countries. Save the date! #GlobalCultures #CulturalFestival #DiversityMatters"
                </Typography>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Key Elements: Short caption, emojis, call-to-action, hashtags
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Twitter/X Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TagIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Typography variant="h6">
                  Twitter/X Thread Example
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
                  <strong>1/3:</strong> Breaking news! 🎉 Our university is hosting the Global Cultures Festival next month!
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
                  <strong>2/3:</strong> Experience authentic cuisine, traditional music, and cultural exhibitions. Free entry!
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#333' }}>
                  <strong>3/3:</strong> Tag a friend who loves culture! 👥 #GlobalCultures #UniversityEvent
                </Typography>
                <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 'bold' }}>
                  Key Elements: Thread format, engagement hook, tagging strategy
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          Start Vocabulary Activities
        </Button>
      </Box>
    </Box>
  )
}
