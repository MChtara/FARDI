import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import EditIcon from '@mui/icons-material/Edit'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import GrammarIcon from '@mui/icons-material/MenuBook'
import StarIcon from '@mui/icons-material/Star'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

/**
 * Phase 6 SubPhase 1 Step 5: Evaluate
 * Writing a Post-Event Report - Error Correction and Enhancement
 */

const WORDSHAKE_WORDS = ['balanced', 'evidence', 'recommend', 'objective', 'formal', 'credible']

const LEARNING_OUTCOMES = [
  'Identify and correct spelling errors in a post-event report',
  'Fix grammar and tense mistakes for accuracy',
  'Improve coherence, tone, and evidence quality to enhance the overall report'
]

const CORRECTION_STEPS = [
  {
    icon: <SpellcheckIcon />,
    title: 'Interaction 1: Fix Spelling Errors',
    description: 'Find and correct spelling mistakes in the report draft. Focus only on spelling - not grammar or style.',
    color: '#27ae60'
  },
  {
    icon: <GrammarIcon />,
    title: 'Interaction 2: Fix Grammar Errors',
    description: 'Correct grammar and tense mistakes in a report section. Focus on subject-verb agreement and verb tenses.',
    color: '#1e8449'
  },
  {
    icon: <StarIcon />,
    title: 'Interaction 3: Enhance Overall Quality',
    description: 'Improve vocabulary, add specific details and evidence, and raise the overall professionalism of the report.',
    color: '#145a32'
  }
]

export default function Phase6SubPhase1Step5Intro() {
  const navigate = useNavigate()
  const [wordshakeDone, setWordshakeDone] = useState(false)

  const handleStart = () => {
    navigate('/phase6/subphase/1/step/5/interaction/1')
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
          Phase 6: Reflection & Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 6.1: Writing a Post-Event Report
        </Typography>
        <Typography variant="h6">
          Step 5: Evaluate - Error Correction and Enhancement
        </Typography>
      </Paper>

      {/* Scenario Intro */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="Let's review and improve your report! You'll fix spelling, grammar, and then enhance the overall quality. This is the final editing step before your report is complete - take your time and focus on each correction type one at a time."
        />
      </Paper>

      {/* Learning Outcomes */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f0fdf4' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon sx={{ fontSize: 36, color: '#27ae60', mr: 2 }} />
          <Typography variant="h6" sx={{ color: '#1e8449', fontWeight: 'bold' }}>
            Learning Outcomes
          </Typography>
        </Box>
        <Stack spacing={1.5}>
          {LEARNING_OUTCOMES.map((outcome, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Chip
                label={idx + 1}
                size="small"
                sx={{ backgroundColor: '#27ae60', color: 'white', fontWeight: 'bold', minWidth: 28 }}
              />
              <Typography variant="body1">{outcome}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Correction Steps */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EditIcon sx={{ fontSize: 36, color: '#27ae60', mr: 2 }} />
          <Typography variant="h6" sx={{ color: '#1e8449', fontWeight: 'bold' }}>
            Your Three Tasks
          </Typography>
        </Box>
        <Stack spacing={2}>
          {CORRECTION_STEPS.map((step, idx) => (
            <Paper
              key={idx}
              variant="outlined"
              sx={{
                p: 2,
                borderLeft: `4px solid ${step.color}`,
                borderRadius: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, color: step.color }}>
                {step.icon}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1 }}>
                  {step.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Paper>

      {/* Instructions */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          How This Works:
        </Typography>
        <Typography variant="body2">
          1. Read the faulty text carefully and find all spelling mistakes to correct.
        </Typography>
        <Typography variant="body2">
          2. Then fix the grammar and tense errors in the corrected text.
        </Typography>
        <Typography variant="body2">
          3. Finally, enhance the report by adding better vocabulary, specific evidence, and a professional tone.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
          Tip: Focus on one error type at a time for more effective editing!
        </Typography>
      </Alert>

      {/* Wordshake Game */}
      <Box sx={{ mb: 3 }}>
        <WordshakeGame
          step={5}
          interaction={0}
          targetWords={WORDSHAKE_WORDS}
          onComplete={() => setWordshakeDone(true)}
          subphase={1}
        />
      </Box>

      {/* Start Button */}
      {wordshakeDone && (
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
            Start Step 5: Evaluate
          </Button>
        </Box>
      )}
    </Box>
  )
}
