import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LockIcon from '@mui/icons-material/Lock'
import { phase6API } from '../../lib/phase6_api.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

/**
 * Phase 6 SubPhase 1 Step 1: Engage - Writing a Post-Event Report
 * Intro page with scenario setup and learning outcomes
 */

const VOCABULARY_WORDS = [
  'success', 'challenge', 'feedback', 'improve', 'achievement',
  'strength', 'weakness', 'recommend', 'summary', 'positive', 'negative'
]

const LEARNING_OUTCOMES = [
  {
    title: 'Reflection Writing:',
    description: 'Write a brief reflection on festival success and challenges using past tense'
  },
  {
    title: 'Key Vocabulary:',
    description: 'Use vocabulary for reviewing events: success, challenge, achievement, strength, weakness'
  },
  {
    title: 'Sequencing Language:',
    description: 'Practice sequencing and evaluation language in written reflection'
  }
]

export default function Phase6SubPhase1Step1Intro() {
  const navigate = useNavigate()
  const [checkingPhase5, setCheckingPhase5] = useState(true)
  const [phase5Complete, setPhase5Complete] = useState(false)
  const [wordshakeDone, setWordshakeDone] = useState(false)

  useEffect(() => {
    checkPhase5()
  }, [])

  const checkPhase5 = async () => {
    setCheckingPhase5(true)
    try {
      const result = await phase6API.checkPhase5Completion()
      if (result && result.completed) {
        setPhase5Complete(true)
      } else {
        setPhase5Complete(false)
      }
    } catch (error) {
      console.error('Error checking Phase 5 completion:', error)
      // Default to allowing access if check fails to avoid blocking
      setPhase5Complete(true)
    } finally {
      setCheckingPhase5(false)
    }
  }

  const handleStartInteraction1 = () => {
    navigate('/phase6/subphase/1/step/1/interaction/1')
  }

  if (checkingPhase5) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center', mt: 8 }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6">Checking prerequisites...</Typography>
      </Box>
    )
  }

  if (!phase5Complete) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px solid',
            borderColor: 'warning.main',
            backgroundColor: 'warning.lighter'
          }}
        >
          <LockIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold" color="warning.dark">
            Phase 6 is Locked
          </Typography>
          <Typography variant="h6" gutterBottom color="text.secondary">
            You need to complete Phase 5 first
          </Typography>
          <Alert severity="warning" sx={{ mt: 3, mb: 3, textAlign: 'left' }}>
            <Typography variant="body1">
              Phase 6 (Reflection and Evaluation) builds on the skills you developed in Phase 5
              (Execution and Problem-Solving). Please complete all Phase 5 steps before proceeding.
            </Typography>
          </Alert>
          <Button
            variant="contained"
            color="warning"
            size="large"
            onClick={() => navigate('/phase5/subphase/1/step/1')}
            sx={{ px: 4, py: 1.5 }}
          >
            Go to Phase 5
          </Button>
        </Paper>
      </Box>
    )
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
          Phase 6: Reflection and Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 6.1: Writing a Post-Event Report
        </Typography>
        <Typography variant="h6" gutterBottom>
          Step 1: Engage - Reflecting on the Festival
        </Typography>
        <Typography variant="body1">
          Look back on the Global Cultures Festival and reflect on what happened
        </Typography>
      </Paper>

      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Scenario
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="The festival is over! Now it's time to reflect on what happened. Gather around, everyone — let's think about what went well, what was challenging, and how we can improve for next time. Writing a good post-event report is an important professional skill!"
        />
      </Paper>

      {/* Learning Outcomes */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: '#f0faf4', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          What You'll Learn
        </Typography>
        <Box component="ul" sx={{ pl: 2, mt: 1 }}>
          {LEARNING_OUTCOMES.map((outcome, idx) => (
            <Typography key={idx} component="li" variant="body1" sx={{ mb: 1 }}>
              <strong>{outcome.title}</strong> {outcome.description}
            </Typography>
          ))}
        </Box>
      </Paper>

      {/* Key Vocabulary Preview */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: '#e8f8f0', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Key Vocabulary You'll Practice
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
          {VOCABULARY_WORDS.map((word, idx) => (
            <Chip
              key={idx}
              label={word}
              sx={{
                backgroundColor: '#27ae60',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                '&:hover': { backgroundColor: '#1e8449' }
              }}
            />
          ))}
        </Stack>
      </Paper>

      {/* Activity Overview */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Today's Activities
        </Typography>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {[
            { num: 1, title: 'Wordshake Game (3 min)', desc: 'Find words related to reviewing and reflecting on events' },
            { num: 2, title: 'Festival Reflection Writing', desc: 'Write 3-5 sentences about what went well and what was challenging' },
            { num: 3, title: 'Sushi Spell Game (2 min)', desc: 'Practise spelling key evaluation vocabulary correctly' }
          ].map((activity) => (
            <Box
              key={activity.num}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                backgroundColor: '#f9f9f9',
                borderRadius: 1,
                border: '1px solid #e0e0e0'
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  flexShrink: 0
                }}
              >
                {activity.num}
              </Box>
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {activity.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activity.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Wordshake Game */}
      <Box sx={{ mb: 3 }}>
        <WordshakeGame
          step={1}
          interaction={0}
          targetWords={VOCABULARY_WORDS}
          onComplete={() => setWordshakeDone(true)}
          subphase={1}
        />
      </Box>

      {/* Start Button */}
      {wordshakeDone && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartInteraction1}
            startIcon={<PlayArrowIcon />}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e8449 0%, #196f3d 100%)'
              }
            }}
          >
            Start Reflection Activities
          </Button>
        </Box>
      )}
    </Box>
  )
}
