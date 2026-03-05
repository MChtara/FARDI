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
  CircularProgress,
  Link,
  Divider
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'

function Phase4_2Step5Interaction3() {
  const navigate = useNavigate()
  const [grammarCorrectedPost, setGrammarCorrectedPost] = useState('')
  const [enhancedPost, setEnhancedPost] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [totalScore, setTotalScore] = useState(0)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Get level and grammar-corrected post from sessionStorage
    const userLevel = sessionStorage.getItem('user_level') || 'B1'
    setLevel(userLevel)

    const grammarCorrected = sessionStorage.getItem('phase4_2_step5_grammar_corrected') || ''
    if (!grammarCorrected) {
      // If no grammar-corrected post, redirect back
      navigate('/phase4_2/step/5/interaction/2')
      return
    }
    setGrammarCorrectedPost(grammarCorrected)
  }, [navigate])

  const handleSubmit = async () => {
    if (!enhancedPost.trim()) {
      setFeedback('Please enter your enhanced version.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step5/evaluate-enhancement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grammar_corrected: grammarCorrectedPost,
          enhanced_post: enhancedPost,
          level: level
        })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setFeedback(data.feedback)
        setSubmitted(true)

        // Store final enhanced version and calculate total score
        sessionStorage.setItem('phase4_2_step5_final_post', enhancedPost)
        const currentScore = parseInt(sessionStorage.getItem('phase4_2_step5_score') || '0')
        const finalTotalScore = currentScore + data.score
        sessionStorage.setItem('phase4_2_step5_score', finalTotalScore.toString())
        setTotalScore(finalTotalScore)

        // Log interaction to backend
        logInteraction(finalTotalScore)
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

  const logInteraction = async (finalScore) => {
    try {
      await fetch('/api/phase4/4_2/interaction/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: '4.2',
          step: 5,
          interaction: 3,
          total_score: finalScore,
          max_score: 15,
          level: level
        })
      })
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }
  }

  const handleFinish = () => {
    // Calculate total score for Step 5
    const step5Score = parseInt(sessionStorage.getItem('phase4_2_step5_score') || '0')
    const step5Max = 15
    const step5Percentage = (step5Score / step5Max) * 100

    // Store Step 5 totals
    sessionStorage.setItem('phase4_2_step5_total_score', step5Score.toString())
    sessionStorage.setItem('phase4_2_step5_total_max', step5Max.toString())
    sessionStorage.setItem('phase4_2_step5_percentage', step5Percentage.toFixed(2))

    console.log(`[Phase 4.2 Step 5 - TOTAL] Score: ${step5Score}/${step5Max} (${step5Percentage.toFixed(1)}%)`)

    // Route based on 80% threshold for Step 5
    if (step5Percentage >= 80) {
      // Check overall Phase 4.2 performance across all 5 steps
      const step1Percentage = parseFloat(sessionStorage.getItem('phase4_2_step1_percentage') || '0')
      const step2Percentage = parseFloat(sessionStorage.getItem('phase4_2_step2_percentage') || '0')
      const step3Percentage = parseFloat(sessionStorage.getItem('phase4_2_step3_percentage') || '0')
      const step4Percentage = parseFloat(sessionStorage.getItem('phase4_2_step4_percentage') || '0')
      const step5Percentage = (step5Score / step5Max) * 100

      const overallPercentage = (step1Percentage + step2Percentage + step3Percentage + step4Percentage + step5Percentage) / 5

      console.log(`[Phase 4.2 - OVERALL] Average: ${overallPercentage.toFixed(1)}%`)

      if (overallPercentage >= 80) {
        console.log('[Phase 4.2 Complete] ≥80% overall → Completed successfully')
        alert(`Congratulations! You completed Phase 4.2 with ${overallPercentage.toFixed(1)}% overall score. Well done!`)
        navigate('/dashboard')
      } else {
        console.log('[Phase 4.2 Complete] <80% overall → Need to retry Phase 4.2')
        alert(`Your overall Phase 4.2 score was ${overallPercentage.toFixed(1)}%. You need 80% or higher overall. Please review and retry Phase 4.2.`)
        navigate('/app/phase4_2/step/1/interaction/1')
      }
    } else {
      console.log('[Phase 4.2 Step 5] <80% → Need to retry Step 5')
      alert(`Your Step 5 score was ${step5Percentage.toFixed(1)}%. You need 80% or higher. Please review and try again.`)
      navigate('/app/phase4_2/step/5/interaction/1')
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Interaction 3: Enhancement (Coherence, Tone, Vocabulary)
      </Typography>

      <CharacterMessage
        character="RYAN"
        message="Excellent grammar! Now, improve coherence/cohesion, tone, vocabulary, hashtags, emoji, and CTA in the corrected posts—reorder/add connectors/enhance words for better flow and engagement."
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e8f5e9' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Grammar-Corrected Post
        </Typography>
        <Paper elevation={1} sx={{ p: 2, bgcolor: 'white', border: '2px solid #66bb6a' }}>
          <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {grammarCorrectedPost}
          </Typography>
        </Paper>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Task: Enhance for Maximum Engagement
        </Typography>
        <Typography variant="body1" paragraph>
          Transform your grammar-corrected post into a compelling, engaging social media post by improving:
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
          <Box>
            <Typography variant="body2">✓ Coherence & Cohesion</Typography>
            <Typography variant="body2">✓ Tone & Voice</Typography>
            <Typography variant="body2">✓ Vocabulary Richness</Typography>
          </Box>
          <Box>
            <Typography variant="body2">✓ Strategic Hashtags</Typography>
            <Typography variant="body2">✓ Engaging Emojis</Typography>
            <Typography variant="body2">✓ Strong Call-to-Action</Typography>
          </Box>
        </Box>


        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Enhanced Post"
          placeholder="Type your enhanced, engaging version here..."
          value={enhancedPost}
          onChange={(e) => setEnhancedPost(e.target.value)}
          disabled={submitted}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || submitted || !enhancedPost.trim()}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Enhancement'}
          </Button>
        </Box>
      </Paper>

      {feedback && (
        <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: score >= 3 ? '#e8f5e9' : '#fff3e0' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Evaluation Results
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Enhancement Score:</strong> {score}/5 points
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Total Score (All Steps):</strong> {totalScore}/15 points
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
        <>
          <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#f3e5f5' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Bonus Practice: Wordshake Game
            </Typography>
            <Typography variant="body1" paragraph>
              Want to practice more vocabulary? Play the British Council Wordshake game to reinforce key social media terms!
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              <strong>Focus on these terms:</strong> strength, weakness, engagement, persuasive, viral
            </Typography>
            <Link
              href="https://learnenglish.britishcouncil.org/games/wordshake"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontSize: '1rem', fontWeight: 'bold' }}
            >
              Play Wordshake on British Council
            </Link>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Opens in new window
            </Typography>
          </Paper>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Congratulations!
            </Typography>
            <Typography variant="body1" paragraph>
              You've completed Phase 4.2 Step 5: Evaluate
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
              Final Score: {totalScore}/15 points
            </Typography>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleFinish}
              sx={{ px: 6, py: 2 }}
            >
              Return to Dashboard
            </Button>
          </Box>
        </>
      )}



    </Container>
  )
}

export default Phase4_2Step5Interaction3
