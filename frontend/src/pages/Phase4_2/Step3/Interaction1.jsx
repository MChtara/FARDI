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

function Phase4_2Step3Interaction1() {
  const navigate = useNavigate()
  const [definition, setDefinition] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!definition.trim()) {
      setFeedback('Please enter your definition of "caption".')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step3/evaluate-caption-definition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ definition })
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
    navigate('/phase4_2/step/3/interaction/2')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Interaction 1: Understanding Captions
      </Typography>

      <CharacterMessage
        character="Ms. Mabrouki"
        message="Watch this short video on writing effective Instagram captions & hashtags (3:45). While watching, listen for: caption, hashtag, emoji, tag, call-to-action, engagement, reach. After watching, answer: What is a 'caption' in social media posts?"
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Video Resource
        </Typography>
        <Typography variant="body1" paragraph>
          Watch the video on writing effective Instagram captions and hashtags:
        </Typography>
        <Box sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #ddd' }}>
          <Link
            href="https://www.youtube.com/watch?v=examplecaptionhashtagvideo"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontSize: '1rem', fontWeight: 'bold' }}
          >
            Watch: Writing Effective Instagram Captions & Hashtags (3:45)
          </Link>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Opens in new window
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          <strong>Listen for these terms:</strong> caption, hashtag, emoji, tag, call-to-action, engagement, reach
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Task
        </Typography>
        <Typography variant="body1" paragraph>
          After watching the video, define "caption" in your own words, referencing the video.
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Hint:</strong> Use "It is words under..." and mention one example from the video.
        </Alert>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Define 'caption' in social media posts"
          placeholder="A caption is..."
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || submitted || !definition.trim()}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Definition'}
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
            Continue to Interaction 2
          </Button>
        </Box>
      )}

    </Container>
  )
}

export default Phase4_2Step3Interaction1
