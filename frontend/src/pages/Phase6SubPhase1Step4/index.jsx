import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Card,
  CardContent
} from '@mui/material'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import EditIcon from '@mui/icons-material/Edit'
import InfoIcon from '@mui/icons-material/Info'
import ArticleIcon from '@mui/icons-material/Article'
import SushiSpellGame from '../../components/phase5/SushiSpellGame.jsx'

const SUSHI_WORDS = ['success', 'challenge', 'feedback', 'recommend', 'summary']

/**
 * Phase 6 SubPhase 1 Step 4: Elaborate
 * Writing a Post-Event Report - Full Report Sections
 */

const KEY_VOCABULARY = [
  'executive', 'summary', 'successes', 'challenges', 'evidence',
  'impact', 'conclusion', 'recommendation', 'achieved', 'encountered'
]

const LEARNING_OUTCOMES = [
  'Write a structured Executive Summary with professional language',
  'Write a Successes & Challenges section with specific evidence',
  'Use formal register and appropriate linking words',
  'Organise report sections logically and coherently'
]

const REPORT_TEMPLATE = [
  {
    section: 'Executive Summary',
    description: 'A brief overview of the entire event (5-8 sentences)',
    elements: ['Event name, date, location', 'Main objectives', 'Key successes', 'Main challenges', 'Overall outcome']
  },
  {
    section: 'Successes & Challenges',
    description: 'Detailed account with specific evidence',
    elements: ['At least 2 successes with evidence', 'At least 2 challenges encountered', 'Past tense throughout', 'Specific details (numbers, names)']
  }
]

export default function Phase6SP1Step4Intro() {
  const navigate = useNavigate()
  const [sushiDone, setSushiDone] = useState(false)

  const handleStart = () => {
    navigate('/phase6/subphase/1/step/4/interaction/1')
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
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection & Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Elaborate - Writing Full Report Sections
        </Typography>
        <Typography variant="body1">
          SubPhase 6.1: Writing a Post-Event Report
        </Typography>
      </Paper>

      {/* Scenario / Character Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #27ae60, #1e8449)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              flexShrink: 0
            }}
          >
            MM
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ms. Mabrouki
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              "Now it's time to write the full report sections. You'll write an Executive Summary
              and then the Successes &amp; Challenges section. These are the most important parts
              of your post-event report — they tell the story of what happened and what you learned."
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Learning Outcomes */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f0fdf4' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon sx={{ fontSize: 36, color: '#27ae60', mr: 2 }} />
          <Typography variant="h6" sx={{ color: '#1e8449' }}>
            Learning Outcomes
          </Typography>
        </Box>
        <Stack spacing={1}>
          {LEARNING_OUTCOMES.map((outcome, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#27ae60', fontWeight: 'bold', minWidth: 20 }}>
                {idx + 1}.
              </Typography>
              <Typography variant="body2">
                {outcome}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Report Template Structure */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ArticleIcon sx={{ fontSize: 36, color: '#27ae60', mr: 2 }} />
          <Typography variant="h6" color="primary">
            Report Template Structure
          </Typography>
        </Box>
        <Stack spacing={2}>
          {REPORT_TEMPLATE.map((section, idx) => (
            <Card key={idx} variant="outlined" sx={{ borderColor: '#27ae60' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1e8449', mb: 0.5 }}>
                  {section.section}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {section.description}
                </Typography>
                <Stack spacing={0.5}>
                  {section.elements.map((el, i) => (
                    <Typography key={i} variant="body2">
                      • {el}
                    </Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>

      {/* Key Vocabulary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Key Vocabulary
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {KEY_VOCABULARY.map((term, idx) => (
            <Chip
              key={idx}
              label={term}
              sx={{
                fontWeight: 'bold',
                borderColor: '#27ae60',
                color: '#1e8449'
              }}
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>

      {/* Writing Tasks Overview */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#fffbf0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EditIcon sx={{ fontSize: 36, color: '#f39c12', mr: 2 }} />
          <Typography variant="h6" sx={{ color: '#e67e22' }}>
            What You Will Do
          </Typography>
        </Box>
        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Interaction 1:</strong> Write an Executive Summary using a guided template
          </Typography>
          <Typography variant="body2">
            <strong>Interaction 2:</strong> Write the Successes &amp; Challenges section with specific evidence
          </Typography>
          <Typography variant="body2">
            <strong>Interaction 3:</strong> Play Sushi Spell to reinforce formal report vocabulary
          </Typography>
        </Stack>
      </Paper>

      {/* Tips */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom fontWeight="bold">
          Writing Tips:
        </Typography>
        <Typography variant="body2">
          • Use past tense throughout (the event happened in the past)
        </Typography>
        <Typography variant="body2">
          • Be specific — include numbers, names, and events as evidence
        </Typography>
        <Typography variant="body2">
          • Use formal linking words: however, furthermore, consequently, despite
        </Typography>
        <Typography variant="body2">
          • Keep a professional, objective tone
        </Typography>
      </Alert>

      {/* Sushi Spell Game */}
      <Box sx={{ mb: 3 }}>
        <SushiSpellGame
          step={4}
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
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e8449 0%, #145a32 100%)'
              }
            }}
          >
            Start Step 4: Elaborate
          </Button>
        </Box>
      )}
    </Box>
  )
}
