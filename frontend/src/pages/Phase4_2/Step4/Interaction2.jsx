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
  Chip
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step4Interaction2() {
  const navigate = useNavigate()
  const [tweet1, setTweet1] = useState('')
  const [tweet2, setTweet2] = useState('')
  const [tweet3, setTweet3] = useState('')
  const [tweet4, setTweet4] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!tweet1.trim() || !tweet2.trim()) {
      setFeedback('Please write at least the first 2 tweets.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const tweets = [tweet1, tweet2, tweet3, tweet4].filter(t => t.trim())
      const response = await fetch('/api/phase4/4_2/step4/evaluate-twitter-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweets })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setLevel(data.level)
        setFeedback(data.feedback)
        setSubmitted(true)

        // Store thread and score
        sessionStorage.setItem('phase4_2_step4_twitter_thread', JSON.stringify(tweets))
        const currentScore = parseInt(sessionStorage.getItem('phase4_2_step4_score') || '0')
        sessionStorage.setItem('phase4_2_step4_score', (currentScore + data.score).toString())
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
    navigate('/phase4_2/step/4/interaction/3')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Interaction 2: Write a Twitter/X Thread
      </Typography>

      <CharacterMessage
        character="Emna"
        message="Now, write a short Twitter/X thread (2-4 tweets) using this guided template with examples."
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Twitter/X Thread Template
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Tweet 1 (Hook/Announcement): Exciting news about the festival!
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', ml: 2 }}>
            Example: 🚨 Global Cultures Festival is almost here! 🌍 March 8 – Student Center 1/3
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Tweet 2 (Details): Describe main attractions.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', ml: 2 }}>
            Example: Live music, traditional dances, global food & workshops await! 2/3
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Tweet 3 (Call-to-Action + Tag): Tell people what to do.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', ml: 2 }}>
            Example: Tag friends & join us! RSVP in bio. #GlobalCulturesFest 3/3
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Tweet 4 (optional Closing): Final reminder or emotion.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', ml: 2 }}>
            Example: Can't wait to celebrate diversity together! ❤️
          </Typography>
        </Box>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Hint: Use thread numbering (1/4, 2/4) and include hashtags/CTA.
        </Typography>
        <Typography variant="body2">
          Check for grammar (tense consistency), spelling, and structure (tweet length ~280 chars, logical sequence).
        </Typography>
      </Alert>

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Twitter/X Thread
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip label="Tweet 1" color="primary" size="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Required • {tweet1.length}/280 chars
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="🚨 Global Cultures Festival is almost here! 🌍 March 8 – Student Center 1/3"
            value={tweet1}
            onChange={(e) => setTweet1(e.target.value)}
            disabled={submitted}
            error={tweet1.length > 280}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip label="Tweet 2" color="primary" size="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Required • {tweet2.length}/280 chars
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Live music, traditional dances, global food & workshops await! 2/3"
            value={tweet2}
            onChange={(e) => setTweet2(e.target.value)}
            disabled={submitted}
            error={tweet2.length > 280}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip label="Tweet 3" color="secondary" size="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Optional • {tweet3.length}/280 chars
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Tag friends & join us! RSVP in bio. #GlobalCulturesFest 3/3"
            value={tweet3}
            onChange={(e) => setTweet3(e.target.value)}
            disabled={submitted}
            error={tweet3.length > 280}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip label="Tweet 4" color="secondary" size="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Optional • {tweet4.length}/280 chars
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Can't wait to celebrate diversity together! ❤️"
            value={tweet4}
            onChange={(e) => setTweet4(e.target.value)}
            disabled={submitted}
            error={tweet4.length > 280}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || submitted || !tweet1.trim() || !tweet2.trim() || tweet1.length > 280 || tweet2.length > 280}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Thread'}
          </Button>
        </Box>
      </Paper>

      {feedback && (
        <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: score >= 4 ? '#e8f5e9' : '#fff3e0' }}>
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

export default Phase4_2Step4Interaction2
