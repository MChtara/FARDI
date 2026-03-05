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
import { CharacterMessage } from '../../components/Avatar.jsx'
import InfoIcon from '@mui/icons-material/Info'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import BalanceIcon from '@mui/icons-material/Balance'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

/**
 * Phase 6 SubPhase 1 Step 3: Explain
 * Writing a Post-Event Report - Why Balance Matters
 */

const KEY_VOCABULARY = [
  'balance', 'objective', 'fair', 'evidence',
  'positive', 'negative', 'strength', 'weakness',
  'impact', 'recommend'
]

const LEARNING_OUTCOMES = [
  'Understand why balanced reporting is important',
  'Learn to include both strengths and weaknesses',
  'Understand the purpose of a post-event report'
]

const WHAT_YOU_WILL_DO = [
  'Watch a short video about balanced reporting and explain its purpose',
  'Write 2-3 sentences explaining why balance matters in a post-event report',
  'Play Sushi Spell to practise spelling key evaluation vocabulary'
]

const WORDSHAKE_WORDS = ['success', 'challenge', 'feedback', 'recommend', 'summary', 'improve']

export default function Phase6SP1Step3Intro() {
  const navigate = useNavigate()
  const [wordshakeDone, setWordshakeDone] = useState(false)

  const handleStart = () => {
    navigate('/phase6/subphase/1/step/3/interaction/1')
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
          SubPhase 6.1 - Step 3: Explain
        </Typography>
        <Typography variant="body1">
          Writing a Post-Event Report - Why Balanced Reporting Matters
        </Typography>
      </Paper>

      {/* Scenario Intro */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="A good report tells both the good AND the bad. Let's learn why balance matters. When we write a post-event report, we need to be honest and objective — that means including both what went well and what could be improved. Today we'll explore why this is so important!"
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

      {/* Key Vocabulary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="success.dark" fontWeight="bold">
          Key Vocabulary for This Step
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Look out for these words as you work through the step:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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

      {/* Video Resource */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#fff8e1', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <VideoLibraryIcon sx={{ fontSize: 36, color: '#f39c12', mr: 2 }} />
          <Typography variant="h6" color="warning.dark" fontWeight="bold">
            Video Resource
          </Typography>
        </Box>
        <Card variant="outlined" sx={{ borderColor: '#f39c12' }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Balanced Reporting in Event Management
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Watch this video to learn about writing balanced post-event reports:
            </Typography>
            <Typography
              component="a"
              href="https://youtu.be/RNdYoBSBag8"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-block',
                color: '#27ae60',
                fontWeight: 'bold',
                textDecoration: 'underline',
                '&:hover': { color: '#1e8449' }
              }}
            >
              https://youtu.be/RNdYoBSBag8 →
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You will watch this video in Interaction 1. Make notes on: the purpose of a post-event report, why balance is important, and what happens when a report is one-sided.
            </Typography>
          </CardContent>
        </Card>
      </Paper>

      {/* Balance Concept */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BalanceIcon sx={{ fontSize: 36, color: '#27ae60', mr: 2 }} />
          <Typography variant="h6" color="success.dark" fontWeight="bold">
            What is Balanced Reporting?
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Card variant="outlined" sx={{ borderLeft: '4px solid #27ae60' }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2" fontWeight="bold" color="success.dark">
                Strengths (What went well)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Include specific successes, achievements, and positive outcomes from the event.
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ borderLeft: '4px solid #e74c3c' }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2" fontWeight="bold" color="error.dark">
                Weaknesses (What could improve)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Include challenges, difficulties, and areas that need improvement for the future.
              </Typography>
            </CardContent>
          </Card>
          <Alert severity="info" sx={{ mt: 1 }}>
            <Typography variant="body2">
              <strong>Why balance matters:</strong> A report that only mentions positives or only mentions negatives is not useful. Decision-makers need the full picture to improve future events.
            </Typography>
          </Alert>
        </Stack>
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
        {WHAT_YOU_WILL_DO.map((item, idx) => (
          <Typography key={idx} variant="body2">
            {idx + 1}. {item}
          </Typography>
        ))}
      </Alert>

      {/* Wordshake Game */}
      <Box sx={{ mb: 3 }}>
        <WordshakeGame
          step={3}
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
              backgroundColor: '#27ae60',
              '&:hover': { backgroundColor: '#1e8449' },
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Start Step 3: Explain
          </Button>
        </Box>
      )}
    </Box>
  )
}
