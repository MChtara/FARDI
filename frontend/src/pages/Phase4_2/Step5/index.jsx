import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Button, Box, Paper } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step5Intro() {
  const navigate = useNavigate()

  const handleStart = () => {
    // Initialize score
    sessionStorage.setItem('phase4_2_step5_score', '0')
    navigate('/phase4_2/step/5/interaction/1')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Phase 4.2 - Step 5: Evaluate
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Assess Learning by Correcting Faulty Social Media Posts
      </Typography>

      <CharacterMessage
        character="MS. MABROUKI"
        message="Great job writing your posts! Now it's time to evaluate and polish them. I'll give you 'wrong' versions with mistakes (spelling, grammar, structure, vocabulary, tone). Correct them step by step—no images, just text. We'll focus on one error type at a time to build your editing skills."
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Three-Step Correction Process
        </Typography>
        <Typography variant="body1" paragraph>
          You'll correct faulty social media posts in three focused steps:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Step 1: Spelling Mistakes</strong> - Identify and correct misspelled words
            </Typography>
          </li>
          <li>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Step 2: Grammar Mistakes</strong> - Fix subject-verb agreement, articles, tense, prepositions
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Step 3: Enhancement</strong> - Improve coherence, tone, vocabulary, hashtags, emojis, and calls-to-action
            </Typography>
          </li>
        </Box>
      </Paper>


      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          What You'll Practice
        </Typography>
        <Typography variant="body1" paragraph>
          This evaluation step helps you develop critical editing skills essential for professional social media communication:
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Error Detection</Typography>
            <Typography variant="body2" color="text.secondary">Spot spelling and grammar mistakes</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Correction Skills</Typography>
            <Typography variant="body2" color="text.secondary">Apply proper grammar rules</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Enhancement</Typography>
            <Typography variant="body2" color="text.secondary">Improve tone and vocabulary</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Strategic Thinking</Typography>
            <Typography variant="body2" color="text.secondary">Optimize hashtags and CTAs</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Engagement</Typography>
            <Typography variant="body2" color="text.secondary">Use emojis and connectors effectively</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Professionalism</Typography>
            <Typography variant="body2" color="text.secondary">Polish posts for impact</Typography>
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
          Start Step 5: Evaluate
        </Button>
      </Box>
    </Container>
  )
}

export default Phase4_2Step5Intro
