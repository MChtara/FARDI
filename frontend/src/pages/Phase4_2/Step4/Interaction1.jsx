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
  Divider
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step4Interaction1() {
  const navigate = useNavigate()
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!caption.trim() || !hashtags.trim()) {
      setFeedback('Please write both a caption and hashtags.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step4/evaluate-instagram-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, hashtags })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setLevel(data.level)
        setFeedback(data.feedback)
        setSubmitted(true)

        // Store post and score
        sessionStorage.setItem('phase4_2_step4_instagram_caption', caption)
        sessionStorage.setItem('phase4_2_step4_instagram_hashtags', hashtags)
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
    navigate('/phase4_2/step/4/interaction/2')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Interaction 1: Write an Instagram Post
      </Typography>

      <CharacterMessage
        character="Ms. Mabrouki"
        message="First, write an Instagram post (caption + hashtags) using this guided template with examples."
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Instagram Caption Template
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Sentence 1 (Hook/Opening): Start with something exciting about the festival.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', ml: 2 }}>
            Example: Get ready to travel the world without leaving Tunis! 🌍
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Sentence 2-3 (Details/What to expect): Describe 2-3 main attractions.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', ml: 2 }}>
            Example: Enjoy live music, traditional dances, delicious international food, and cultural workshops.
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Sentence 4 (Call-to-Action): Tell people what to do.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', ml: 2 }}>
            Example: Join us on March 8 at Student Center – tag a friend who loves culture!
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Sentence 5 (Closing/Emotion): End with feeling or reminder.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', ml: 2 }}>
            Example: Don't miss this unforgettable day of global unity! ❤️
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Hashtags (5-10): Add relevant hashtags at the end.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', ml: 2 }}>
            Example: #GlobalCulturesFestival #Festival2025 #TunisEvents #CulturalCelebration #JoinUs
          </Typography>
        </Box>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Hint: Use the examples as models—change words, add your festival details.
        </Typography>
        <Typography variant="body2">
          Check for grammar (agreement, tense), spelling, and structure (flow, CTA placement) before submitting.
        </Typography>
      </Alert>

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Instagram Post
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          label="Instagram Caption (4-8 sentences)"
          placeholder="Get ready to travel the world without leaving Tunis! 🌍..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={submitted}
          sx={{ mb: 3 }}
          helperText={`${caption.split(/[.!?]+/).filter(s => s.trim()).length} sentences • ${caption.split(' ').filter(w => w).length} words`}
        />

        <TextField
          fullWidth
          variant="outlined"
          label="Hashtags (5-10 hashtags)"
          placeholder="#GlobalCulturesFestival #Festival2025 #TunisEvents..."
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          disabled={submitted}
          helperText={`${hashtags.split('#').filter(h => h.trim()).length - 1} hashtags`}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || submitted || !caption.trim() || !hashtags.trim()}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Post'}
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
            Continue to Interaction 2
          </Button>
        </Box>
      )}

    </Container>
  )
}

export default Phase4_2Step4Interaction1
