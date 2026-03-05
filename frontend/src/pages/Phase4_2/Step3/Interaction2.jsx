import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Link
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step3Interaction2() {
  const navigate = useNavigate()
  const [ctaExplanation, setCtaExplanation] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!ctaExplanation.trim()) {
      setFeedback('Please enter your explanation of "call-to-action".')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step3/evaluate-cta-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ explanation: ctaExplanation })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setLevel(data.level)
        setFeedback(data.feedback)
        setSubmitted(true)

        // Store score
        const currentScore = parseInt(sessionStorage.getItem('phase4_2_step3_score') || '0')
        sessionStorage.setItem('phase4_2_step3_score', (currentScore + data.score).toString())
      } else {
        setFeedback(data.error || 'Evaluation failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setFeedback('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    navigate('/phase4_2/step/3/interaction/3')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Interaction 2: Understanding Call-to-Action
      </Typography>

      <CharacterMessage
        character="Lilia"
        message="Now watch these two real social media post examples (first Instagram festival post, then Twitter/X thread). Listen for: hashtag strategy, emoji use, call-to-action, tag, viral potential, engagement. After watching, explain 'call-to-action' (CTA) in social media posts."
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Video Resources
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Example 1: Instagram Festival Post
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #ddd' }}>
            <Link
              href="https://www.instagram.com/p/examplefestivalcaption/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontSize: '1rem' }}
            >
              View Instagram Post with Hashtags & Emojis
            </Link>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Instagram caption with hashtags & emojis
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Example 2: Twitter/X Thread
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #ddd' }}>
            <Link
              href="https://twitter.com/example/status/examplethread"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontSize: '1rem' }}
            >
              View Twitter Thread with CTA & Tagging
            </Link>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Twitter thread with CTA & tagging
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          <strong>Listen for:</strong> hashtag strategy, emoji use, call-to-action, tag, viral potential, engagement
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Task
        </Typography>
        <Typography variant="body1" paragraph>
          After watching both examples, define "call-to-action" (CTA) and describe its purpose, using examples from the videos/posts.
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Hint:</strong> Include "It tells people to..." and reference one example (e.g., "Join us!").
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          label="Explain 'call-to-action' (CTA) in social media posts"
          placeholder="A call-to-action is..."
          value={ctaExplanation}
          onChange={(e) => setCtaExplanation(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || submitted || !ctaExplanation.trim()}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Explanation'}
          </Button>
        </Box>
      </Paper>

      {feedback && (
        <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: score >= 3 ? '#e8f5e9' : '#fff3e0' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Evaluation Results
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Score:</strong> {score}/5 points
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>CEFR Level:</strong> {level}
          </Typography>
          <Typography variant="body1">
            <strong>Feedback:</strong> {feedback}
          </Typography>
        </Paper>
      )}

      {submitted && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleNext}
            sx={{ px: 6, py: 2 }}
          >
            Continue to Interaction 3
          </Button>
        </Box>
      )}

    </Container>
  )
}

export default Phase4_2Step3Interaction2
