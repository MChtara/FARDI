import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Card,
  CardContent
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { phase6API } from '../../lib/phase6_api.jsx'
import WordshakeGame from '../../components/phase5/WordshakeGame.jsx'

const WORDSHAKE_WORDS = ['feedback', 'constructive', 'positive', 'suggestion', 'strength', 'weakness', 'improve', 'polite', 'listen', 'agree', 'disagree', 'helpful']

/**
 * Phase 6 SubPhase 2 Step 1: Engage - Peer Feedback Discussion
 * Intro page with scenario and SubPhase 1 completion check
 */

const VOCABULARY_CHIPS = [
  'feedback', 'constructive', 'positive', 'suggestion', 'strength',
  'weakness', 'improve', 'polite', 'listen', 'agree', 'disagree', 'helpful'
]

const LEARNING_OUTCOMES = [
  { title: 'Share your feedback experience', desc: 'Reflect on times you gave or received feedback' },
  { title: 'Learn feedback vocabulary', desc: 'Master words like constructive, suggestion, strength, weakness' },
  { title: 'Practice giving and receiving feedback politely', desc: 'Use polite language to share opinions' }
]

export default function Phase6SubPhase2Step1Intro() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [subphase1Complete, setSubphase1Complete] = useState(false)
  const [subphase1Score, setSubphase1Score] = useState(0)
  const [requiredScore, setRequiredScore] = useState(12)
  const [wordshakeDone, setWordshakeDone] = useState(false)

  useEffect(() => {
    checkSubPhase1Completion()
  }, [])

  const checkSubPhase1Completion = async () => {
    try {
      const result = await phase6API.checkSubPhase1Completion()
      if (result.success && result.data) {
        setSubphase1Complete(result.data.is_complete)
        setSubphase1Score(result.data.total_score || 0)
        setRequiredScore(result.data.required_score || 12)
      }
    } catch (error) {
      console.error('Error checking SubPhase 1 completion:', error)
      // Allow access if check fails (for development/testing)
      setSubphase1Complete(true)
    } finally {
      setLoading(false)
    }
  }

  const handleStart = () => {
    navigate('/phase6/subphase/2/step/1/interaction/1')
  }

  // Extract YouTube video ID for embed
  const videoId = 'wtl5UrrgU8c'

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 6: Reflection &amp; Evaluation
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2: Peer Feedback Discussion
        </Typography>
        <Typography variant="h6" gutterBottom>
          Step 1: Engage
        </Typography>
        <Typography variant="body1">
          Learn how to give and receive feedback professionally and constructively
        </Typography>
      </Paper>

      {/* Scenario */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Scenario
        </Typography>
        <Box
          sx={{
            p: 3,
            backgroundColor: '#f3e5f5',
            borderRadius: 2,
            borderLeft: '4px solid #8e44ad'
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" color="#6c3483" gutterBottom>
            Mr. Karim
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
            "Congratulations on your reports! Now let's learn how to give and receive feedback
            professionally. Feedback is a gift - when it's constructive and polite, it helps
            everyone grow. Today we'll explore how to share our thoughts in a helpful way."
          </Typography>
        </Box>
      </Paper>

      {/* Video */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Watch: Understanding Feedback Culture
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Mr. Karim shares a video about why feedback matters and how to give it effectively.
        </Typography>
        <Box
          sx={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: 2,
            backgroundColor: '#000',
            mb: 2
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Feedback Culture Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          <strong>Think about:</strong> What makes feedback helpful? How do you feel when you receive feedback?
        </Typography>
      </Paper>

      {/* Learning Outcomes */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: '#f3e5f5' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="#6c3483">
          What You'll Learn in This Step
        </Typography>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {LEARNING_OUTCOMES.map((outcome, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <CheckCircleIcon sx={{ color: '#8e44ad', mt: 0.3, flexShrink: 0 }} />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {outcome.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {outcome.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Vocabulary Preview */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
          Key Vocabulary You'll Practice
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {VOCABULARY_CHIPS.map((word, idx) => (
            <Chip
              key={idx}
              label={word}
              sx={{
                backgroundColor: '#8e44ad',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#6c3483' }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Activities Overview */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
          Step 1 Activities
        </Typography>
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Activity 1 - Wordshake Game (3 min)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Activate feedback vocabulary by forming as many words as possible
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Activity 2 - Share Your Feedback Experience
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Write 3-5 sentences about a time you received feedback and how it made you feel
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Activity 3 - Sushi Spell Game (2 min)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Practise spelling key feedback vocabulary words correctly
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Paper>

      {/* Progression Check */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress sx={{ color: '#8e44ad' }} />
        </Box>
      ) : !subphase1Complete ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: '#fff3e0',
            border: '2px solid',
            borderColor: 'warning.main'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LockIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
            <Typography variant="h5" color="warning.dark" fontWeight="bold">
              SubPhase 2 Locked
            </Typography>
          </Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Complete SubPhase 6.1 (Writing a Post-Event Report) first!</strong>
            </Typography>
            <Typography variant="body2">
              You need to complete Phase 6 SubPhase 1 with a total score of at least {requiredScore} points
              across all 5 steps before accessing SubPhase 2.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Your current SubPhase 1 score: <strong>{subphase1Score} / {requiredScore}</strong>
            </Typography>
          </Alert>
          <Button
            variant="contained"
            color="warning"
            size="large"
            onClick={() => navigate('/phase6/subphase/1/step/1')}
            sx={{ mt: 2 }}
          >
            Go to SubPhase 6.1
          </Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <WordshakeGame
              step={1}
              interaction={0}
              targetWords={WORDSHAKE_WORDS}
              onComplete={() => setWordshakeDone(true)}
              subphase={2}
            />
          </Box>
          {wordshakeDone && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleStart}
                startIcon={<PlayArrowIcon />}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6c3483 0%, #4a235a 100%)'
                  }
                }}
              >
                Start Feedback Activities
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
