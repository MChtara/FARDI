import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step5Interaction1() {
  const navigate = useNavigate()
  const [faultyPost, setFaultyPost] = useState('')
  const [correctedPost, setCorrectedPost] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Get level from sessionStorage or default to B1
    const userLevel = sessionStorage.getItem('user_level') || 'B1'
    setLevel(userLevel)

    // Set faulty post based on level
    const faultyPosts = {
      A2: "Festival is fun. Come March 8. #Globol #Festivel",
      B1: "Join Globel Cultures Festival! Music food dance. Tag frend! #Festival #Fun",
      B2: "Ready for world tour? Globel Cultures Festival March 8. Tag freinds! #GlobalCulturesFest #TunisEvnts",
      C1: "Immerse yourself in globel unity: Global Cultures Festival March 8. Tag felllow explorers. #GlobalCulturesFestival #DiversityInAction"
    }

    setFaultyPost(faultyPosts[userLevel] || faultyPosts.B1)
  }, [])

  const handleSubmit = async () => {
    if (!correctedPost.trim()) {
      setFeedback('Please enter your spelling-corrected version.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step5/evaluate-spelling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_post: faultyPost,
          corrected_post: correctedPost,
          level: level
        })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setFeedback(data.feedback)
        setSubmitted(true)

        // Store corrected version and score
        sessionStorage.setItem('phase4_2_step5_spelling_corrected', correctedPost)
        const currentScore = parseInt(sessionStorage.getItem('phase4_2_step5_score') || '0')
        sessionStorage.setItem('phase4_2_step5_score', (currentScore + data.score).toString())
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
    navigate('/phase4_2/step/5/interaction/2')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Interaction 1: Spelling Correction
      </Typography>

      <CharacterMessage
        character="MS. MABROUKI"
        message="Here are faulty social media posts with mistakes. First, focus only on spelling mistakes—correct them."
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#ffebee' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Faulty Post (Contains Spelling Errors)
        </Typography>
        <Paper elevation={1} sx={{ p: 2, bgcolor: 'white', border: '2px solid #e57373' }}>
          <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {faultyPost}
          </Typography>
        </Paper>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Task: Correct Spelling Mistakes Only
        </Typography>
        <Typography variant="body1" paragraph>
          Carefully read the faulty post above and correct all spelling mistakes. Focus only on misspelled words—don't change grammar or structure yet.
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Spelling-Corrected Post"
          placeholder="Type your spelling-corrected version here..."
          value={correctedPost}
          onChange={(e) => setCorrectedPost(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || submitted || !correctedPost.trim()}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Correction'}
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
            <strong>Level:</strong> {level}
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
            Continue to Grammar Correction
          </Button>
        </Box>
      )}


    </Container>
  )
}

export default Phase4_2Step5Interaction1
