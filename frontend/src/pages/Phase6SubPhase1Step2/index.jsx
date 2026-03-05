import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Chip, Alert, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import ArticleIcon from '@mui/icons-material/Article'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'

/**
 * Phase 6 SubPhase 1 Step 2: Explore
 * Writing a Post-Event Report - Explore Phase
 */

const KEY_VOCABULARY = ['summary', 'evidence', 'achievement', 'positive', 'negative', 'impact', 'lesson', 'recommend']
const SUSHI_WORDS = ['success', 'challenge', 'feedback', 'improve', 'recommend']

const LEARNING_OUTCOMES = [
  'Explore the structure of a post-event report',
  'Practice writing a trial summary section',
  'Understand what makes effective reporting'
]

const REPORT_SECTIONS = [
  {
    title: 'Executive Summary',
    description: 'A brief overview of the entire event and its main outcomes. This is the first thing readers see.',
    icon: '📋'
  },
  {
    title: 'Successes',
    description: 'What went well during the event. Include specific achievements and positive outcomes.',
    icon: '✅'
  },
  {
    title: 'Challenges',
    description: 'What was difficult or did not go as planned. Be honest and objective.',
    icon: '⚠️'
  },
  {
    title: 'Recommendations',
    description: 'Ideas and suggestions for improving future events based on lessons learned.',
    icon: '💡'
  }
]

export default function Phase6SP1Step2Intro() {
  const navigate = useNavigate()
  const [sushiDone, setSushiDone] = useState(false)

  const handleStart = () => {
    navigate('/phase6/subphase/1/step/2/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection &amp; Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 6.1 - Step 2: Explore
        </Typography>
        <Typography variant="body1">
          Writing a Post-Event Report - Exploring Report Structure
        </Typography>
      </Paper>

      {/* Scenario Intro */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's explore how professional event reports are written. I'm going to show you a sample post-event report structure. Understanding this structure will help you write your own complete report for our Global Cultures Festival!"
        />
      </Paper>

      {/* Learning Outcomes */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f0faf4', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon sx={{ fontSize: 36, color: '#27ae60', mr: 2 }} />
          <Typography variant="h6" color="success.dark" fontWeight="bold">
            Learning Outcomes
          </Typography>
        </Box>
        <Stack spacing={1}>
          {LEARNING_OUTCOMES.map((outcome, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}
              >
                {idx + 1}
              </Box>
              <Typography variant="body2">{outcome}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Report Structure */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ArticleIcon sx={{ fontSize: 36, color: '#27ae60', mr: 2 }} />
          <Typography variant="h6" color="success.dark" fontWeight="bold">
            Sample Post-Event Report Structure
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          A professional post-event report follows a clear structure. Here are the main sections:
        </Typography>
        <Stack spacing={2}>
          {REPORT_SECTIONS.map((section, idx) => (
            <Card key={idx} variant="outlined" sx={{ borderColor: '#27ae60', borderLeft: '4px solid #27ae60' }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.5rem', lineHeight: 1.2 }}>{section.icon}</Typography>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="success.dark">
                      {idx + 1}. {section.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {section.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>

      {/* Key Vocabulary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="success.dark" fontWeight="bold">
          Key Vocabulary for This Step
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {KEY_VOCABULARY.map((term, idx) => (
            <Chip
              key={idx}
              label={term}
              sx={{
                backgroundColor: '#27ae60',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#1e8449' }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* What You'll Do */}
      <Alert
        severity="info"
        icon={<InfoIcon />}
        sx={{ mb: 3, borderRadius: 2 }}
      >
        <Typography variant="body2" gutterBottom fontWeight="bold">
          What You'll Do in This Step:
        </Typography>
        <Typography variant="body2">1. Play Sushi Spell to activate report writing vocabulary</Typography>
        <Typography variant="body2">2. Write a trial executive summary for the festival</Typography>
        <Typography variant="body2">3. Explain your writing choices using "because" to give reasons</Typography>
        <Typography variant="body2">4. Play Sushi Spell again to reinforce vocabulary</Typography>
      </Alert>

      {/* Sushi Spell Game */}
      <Box sx={{ mb: 3 }}>
        <SushiSpellGame
          step={2}
          interaction={0}
          targetWords={SUSHI_WORDS}
          onComplete={() => setSushiDone(true)}
          subphase={1}
        />
      </Box>

      {/* Start Button */}
      {sushiDone && (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStart}
            sx={{
              px: 6,
              py: 1.5,
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' },
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Start Step 2: Explore
          </Button>
        </Box>
      )}
    </Box>
  )
}
