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

function Phase4_2Step5Interaction2() {
  const navigate = useNavigate()
  const [spellingCorrectedPost, setSpellingCorrectedPost] = useState('')
  const [grammarCorrectedPost, setGrammarCorrectedPost] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Get level and spelling-corrected post from sessionStorage
    const userLevel = sessionStorage.getItem('user_level') || 'B1'
    setLevel(userLevel)

    const spellingCorrected = sessionStorage.getItem('phase4_2_step5_spelling_corrected') || ''
    if (!spellingCorrected) {
      // If no spelling-corrected post, redirect back
      navigate('/phase4_2/step/5/interaction/1')
      return
    }
    setSpellingCorrectedPost(spellingCorrected)
  }, [navigate])

  const handleSubmit = async () => {
    if (!grammarCorrectedPost.trim()) {
      setFeedback('Please enter your grammar-corrected version.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step5/evaluate-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spelling_corrected: spellingCorrectedPost,
          grammar_corrected: grammarCorrectedPost,
          level: level
        })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setFeedback(data.feedback)
        setSubmitted(true)

        // Store corrected version and add to score
        sessionStorage.setItem('phase4_2_step5_grammar_corrected', grammarCorrectedPost)
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
    navigate('/phase4_2/step/5/interaction/3')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Interaction 2: Grammar Correction
      </Typography>

      <CharacterMessage
        character="LILIA"
        message="Good spelling fixes! Now, from the same faulty posts (spelling corrected), focus on grammar mistakes—correct them."
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e8f5e9' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Spelling-Corrected Post
        </Typography>
        <Paper elevation={1} sx={{ p: 2, bgcolor: 'white', border: '2px solid #66bb6a' }}>
          <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {spellingCorrectedPost}
          </Typography>
        </Paper>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Task: Correct Grammar Mistakes
        </Typography>
        <Typography variant="body1" paragraph>
          Now focus on grammar errors in your spelling-corrected post. Fix issues with:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li><Typography variant="body2">Subject-verb agreement (e.g., "Festival is" not "Festival are")</Typography></li>
          <li><Typography variant="body2">Missing articles (a, an, the)</Typography></li>
          <li><Typography variant="body2">Incorrect prepositions (on, at, in)</Typography></li>
          <li><Typography variant="body2">Verb tense consistency</Typography></li>
        </Box>



        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Grammar-Corrected Post"
          placeholder="Type your grammar-corrected version here..."
          value={grammarCorrectedPost}
          onChange={(e) => setGrammarCorrectedPost(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || submitted || !grammarCorrectedPost.trim()}
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
            Continue to Enhancement
          </Button>
        </Box>
      )}


    </Container>
  )
}

export default Phase4_2Step5Interaction2
