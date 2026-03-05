import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Button, Box, Paper } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step3Intro() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/phase4_2/step/3/interaction/1')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Phase 4.2 - Step 3: Explain
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Social Media Post Creation
      </Typography>

      <CharacterMessage
        character="Ms. Mabrouki"
        message="Now let's explain how to make great social media posts for our festival. We will watch three short videos: first on writing captions & hashtags, then two real post examples. Listen carefully and get ready to talk about the terms."
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          What You'll Learn
        </Typography>
        <Typography variant="body1" paragraph>
          In this step, you'll formalize your understanding of effective social media posts for event promotion. You'll explore:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li><Typography variant="body1">Writing effective Instagram captions</Typography></li>
          <li><Typography variant="body1">Creating Twitter/X threads</Typography></li>
          <li><Typography variant="body1">Facebook announcements</Typography></li>
          <li><Typography variant="body1">Key glossary terms: hashtag, caption, emoji, tag, call-to-action (CTA), engagement, viral, story, thread, reach</Typography></li>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Key Social Media Terms
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Hashtag (#)</Typography>
            <Typography variant="body2" color="text.secondary">Keyword tag to categorize content</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Caption</Typography>
            <Typography variant="body2" color="text.secondary">Text accompanying a post</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Emoji</Typography>
            <Typography variant="body2" color="text.secondary">Visual symbol to express emotion</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Tag</Typography>
            <Typography variant="body2" color="text.secondary">Mention another user (@username)</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Call-to-Action (CTA)</Typography>
            <Typography variant="body2" color="text.secondary">Prompt for audience action</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Engagement</Typography>
            <Typography variant="body2" color="text.secondary">Likes, comments, shares</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Viral</Typography>
            <Typography variant="body2" color="text.secondary">Content spreading rapidly</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Story</Typography>
            <Typography variant="body2" color="text.secondary">Temporary 24-hour post</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Thread</Typography>
            <Typography variant="body2" color="text.secondary">Series of connected posts</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Reach</Typography>
            <Typography variant="body2" color="text.secondary">Number of people who see content</Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleStart}
          sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
        >
          Start Step 3: Explain
        </Button>
      </Box>
    </Container>
  )
}

export default Phase4_2Step3Intro
