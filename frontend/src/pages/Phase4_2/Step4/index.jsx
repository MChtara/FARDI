import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Button, Box, Paper, Alert } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step4Intro() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/phase4_2/step/4/interaction/1')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Phase 4.2 - Step 4: Elaborate
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Social Media Post Creation
      </Typography>

      <CharacterMessage
        character="Ms. Mabrouki"
        message="Now apply what we've learned by writing real social media posts for our Global Cultures Festival. Use the guided templates with examples, adapt them to your ideas, and self-check grammar, spelling, and structure before submitting."
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          What You'll Create
        </Typography>
        <Typography variant="body1" paragraph>
          In this step, you'll apply your knowledge by creating complete social media posts for the Global Cultures Festival:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li><Typography variant="body1">Instagram caption with hashtags</Typography></li>
          <li><Typography variant="body1">Twitter/X thread (2-4 tweets)</Typography></li>
          <li><Typography variant="body1">Vocabulary integration using Sushi Spell game</Typography></li>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Writing Focus Areas
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Grammar</Typography>
            <Typography variant="body2" color="text.secondary">Subject-verb agreement, tense consistency</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Spelling</Typography>
            <Typography variant="body2" color="text.secondary">Correct spelling of social media terms</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Structure</Typography>
            <Typography variant="body2" color="text.secondary">Logical flow, CTA placement</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Vocabulary</Typography>
            <Typography variant="body2" color="text.secondary">hashtag, caption, emoji, CTA, engagement</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Persuasive Language</Typography>
            <Typography variant="body2" color="text.secondary">Concise, engaging content</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Strategic Elements</Typography>
            <Typography variant="body2" color="text.secondary">Hashtags, emojis, CTAs, tagging</Typography>
          </Box>
        </Box>
      </Paper>

      <Alert severity="info" sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Important: Use Guided Templates
        </Typography>
        <Typography variant="body2">
          You'll be provided with templates and examples for each post type. Use them as models adapt the examples to your ideas while maintaining proper grammar, spelling, and structure.
        </Typography>
      </Alert>

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Three Writing Tasks
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Interaction 1: Instagram Post</Typography>
          <Typography variant="body2" color="text.secondary">Write 4-8 sentence caption + 5-10 hashtags using guided template</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Interaction 2: Twitter/X Thread</Typography>
          <Typography variant="body2" color="text.secondary">Create 2-4 tweet thread with hashtags and CTAs</Typography>
        </Box>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Interaction 3: Vocabulary Polish</Typography>
          <Typography variant="body2" color="text.secondary">Play Sushi Spell and revise your posts using new vocabulary</Typography>
        </Box>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleStart}
          sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
        >
          Start Step 4: Elaborate
        </Button>
      </Box>
    </Container>
  )
}

export default Phase4_2Step4Intro
