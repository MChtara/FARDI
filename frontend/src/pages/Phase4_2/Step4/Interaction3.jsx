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
  Divider,
  Stack
} from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import SushiSpellGame from '../../../components/SushiSpellGame.jsx'

// Target words for Phase 4.2 - Social Media vocabulary
const TARGET_WORDS = [
  'hashtag',
  'caption',
  'viral',
  'engagement',
  'emoji',
  'tag',
  'story',
  'call-to-action'
]

function Phase4_2Step4Interaction3() {
  const navigate = useNavigate()
  const [gameResult, setGameResult] = useState(null)
  const [spelledTerm, setSpelledTerm] = useState('')
  const [revisedSentence, setRevisedSentence] = useState('')
  const [originalPosts, setOriginalPosts] = useState({ instagram: '', twitter: '' })
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(null)
  const [level, setLevel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Load original posts from previous interactions
    const instagramCaption = sessionStorage.getItem('phase4_2_step4_instagram_caption') || ''
    const twitterThread = JSON.parse(sessionStorage.getItem('phase4_2_step4_twitter_thread') || '[]')
    setOriginalPosts({
      instagram: instagramCaption,
      twitter: twitterThread.join(' ')
    })
  }, [])

  const handleGameComplete = (result) => {
    console.log('Sushi Spell Game completed:', result)
    setGameResult(result)

    // Store result - score based on words found
    const foundWordsCount = result.foundWords?.length || 0
    const timeElapsed = result.timeElapsed || 0
    sessionStorage.setItem('phase4_2_step4_int3_sushi_score', foundWordsCount)
    sessionStorage.setItem('phase4_2_step4_int3_sushi_time', timeElapsed)
    sessionStorage.setItem('phase4_2_step4_int3_sushi_words', JSON.stringify(result.foundWords || []))

    // Log to backend
    logGameCompletion(foundWordsCount, timeElapsed, result.foundWords || [])
  }

  const logGameCompletion = async (foundWordsCount, timeElapsed, foundWords) => {
    try {
      const response = await fetch('/api/phase4_2/interaction/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          step: 4,
          interaction: 3,
          score: foundWordsCount,
          max_score: TARGET_WORDS.length,
          time_taken: timeElapsed,
          found_words: foundWords,
          completed: true,
          game_type: 'sushi_spell'
        })
      })

      const data = await response.json()
      if (data.success) {
        console.log('Interaction 3 (Sushi Spell) logged to backend')
      }
    } catch (error) {
      console.error('Failed to log interaction completion:', error)
    }
  }

  const handleSubmit = async () => {
    if (!spelledTerm.trim() || !revisedSentence.trim()) {
      setFeedback('Please enter the term you spelled and your revised sentence.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/phase4/4_2/step4/evaluate-vocabulary-revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spelled_term: spelledTerm,
          revised_sentence: revisedSentence,
          original_instagram: originalPosts.instagram,
          original_twitter: originalPosts.twitter
        })
      })

      const data = await response.json()

      if (response.ok) {
        setScore(data.score)
        setLevel(data.level)
        setFeedback(data.feedback)
        setSubmitted(true)

        // Calculate and store final score
        const currentScore = parseInt(sessionStorage.getItem('phase4_2_step4_score') || '0')
        const totalScore = currentScore + data.score
        sessionStorage.setItem('phase4_2_step4_score', totalScore.toString())

        // Log completion
        await fetch('/api/phase4/4_2/interaction/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phase: '4_2',
            step: '4',
            interaction: 'vocabulary_revision_complete',
            data: {
              total_score: totalScore,
              spelled_term: spelledTerm
            }
          })
        })
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

  const handleFinish = () => {
    // Calculate total score from all 3 interactions in Step 4
    const totalScore = parseInt(sessionStorage.getItem('phase4_2_step4_score') || '0')
    const totalMax = 15 // As shown in UI line 361
    const percentage = (totalScore / totalMax) * 100

    // Store total score for Step 4
    sessionStorage.setItem('phase4_2_step4_total_score', totalScore.toString())
    sessionStorage.setItem('phase4_2_step4_total_max', totalMax.toString())
    sessionStorage.setItem('phase4_2_step4_percentage', percentage.toFixed(2))

    console.log(`[Phase 4.2 Step 4 - TOTAL] Score: ${totalScore}/${totalMax} (${percentage.toFixed(1)}%)`)

    // Route based on 80% threshold
    if (percentage >= 80) {
      console.log('[Phase 4.2 Step 4] ≥80% → Proceeding to Step 5')
      navigate('/app/phase4_2/step/5/interaction/1')
    } else {
      console.log('[Phase 4.2 Step 4] <80% → Need to retry')
      alert(`Your score was ${percentage.toFixed(1)}%. You need 80% or higher to proceed to Step 5. Please review the material and try again.`)
      navigate('/app/phase4_2/step/4/interaction/1')
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Interaction 3: Polish Your Writing
      </Typography>

      <CharacterMessage
        character="Ryan"
        message="To polish your writing, play a game and integrate terms."
      />

      <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Your Previous Posts
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Instagram Caption:
          </Typography>
          <Paper elevation={1} sx={{ p: 2, mt: 1, bgcolor: 'white' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {originalPosts.instagram || 'No Instagram post yet'}
            </Typography>
          </Paper>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Twitter Thread:
          </Typography>
          <Paper elevation={1} sx={{ p: 2, mt: 1, bgcolor: 'white' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {originalPosts.twitter || 'No Twitter thread yet'}
            </Typography>
          </Paper>
        </Box>
      </Paper>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'info.lighter' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
          How to Play:
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2">
            • Click letters as they fall to spell words
          </Typography>
          <Typography variant="body2">
            • Think of words related to social media: hashtag, caption, viral, engagement, emoji, tag, story, call-to-action
          </Typography>
          <Typography variant="body2">
            • Longer words give more points!
          </Typography>
          <Typography variant="body2">
            • Click "Submit Word" when you're ready to check your spelling
          </Typography>
        </Stack>
      </Paper>

      {/* Hint */}
      {!gameResult && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Hint:</strong> Try longer words like "call-to-action" or "engagement" for higher scores.
          </Typography>
        </Alert>
      )}

      {/* Sushi Spell Game */}
      <Box sx={{ mb: 4 }}>
        <SushiSpellGame onComplete={handleGameComplete} targetWords={TARGET_WORDS} />
      </Box>

      {/* Game Results Display */}
      {gameResult && (
        <>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 3,
              backgroundColor: 'success.lighter',
              border: 2,
              borderColor: 'success.main'
            }}
          >
            <Typography variant="h4" gutterBottom textAlign="center" color="success.dark">
              🎮 Game Complete!
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="h5" gutterBottom textAlign="center">
                Your Performance
              </Typography>

              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="h2" fontWeight="bold" color="success.main">
                  {gameResult.foundWords?.length || 0}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Words Found
                </Typography>
              </Box>

              {gameResult.foundWords && gameResult.foundWords.length > 0 && (
                <Box sx={{ my: 3 }}>
                  <Typography variant="subtitle1" gutterBottom textAlign="center" fontWeight="bold">
                    Words You Spelled:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ mt: 2 }} useFlexGap>
                    {gameResult.foundWords.map((word, index) => (
                      <Alert key={index} severity="success" sx={{ mb: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {word}
                        </Typography>
                      </Alert>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {gameResult.foundWords && gameResult.foundWords.length >= 5 && (
              <Typography variant="h6" textAlign="center" color="success.dark" sx={{ mt: 2 }}>
                ✨ Excellent spelling skills!
              </Typography>
            )}
          </Paper>
        </>
      )}

      {/* Revision Task - Only show after game is complete */}
      {gameResult && (
        <Paper elevation={3} sx={{ p: 3, my: 3, bgcolor: '#fff3e0' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Revision Task
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Hint: "Sushi Spell for 'call-to-action' because... then add to your post."
            </Typography>
            <Typography variant="body2">
              Use a spelled term in a revised sentence, fixing any grammar/spelling/structure mistakes.
            </Typography>
          </Alert>

          <TextField
            fullWidth
            variant="outlined"
            label="Which term did you spell?"
            placeholder="hashtag, caption, call-to-action, engagement, or viral"
            value={spelledTerm}
            onChange={(e) => setSpelledTerm(e.target.value)}
            disabled={submitted}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Revise one sentence using the spelled term (fix any mistakes)"
            placeholder="Original: Tag friends viral\nRevised: Tag friends to help make this post go viral"
            value={revisedSentence}
            onChange={(e) => setRevisedSentence(e.target.value)}
            disabled={submitted}
            helperText="Show how you detected and corrected errors in grammar, spelling, or structure"
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || submitted || !spelledTerm.trim() || !revisedSentence.trim()}
              sx={{ minWidth: 150 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Revision'}
            </Button>
          </Box>
        </Paper>
      )}

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
          <Typography variant="body1" paragraph>
            <strong>Feedback:</strong> {feedback}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Total Step 4 Score: {parseInt(sessionStorage.getItem('phase4_2_step4_score') || '0')}/15 points
          </Typography>
        </Paper>
      )}

      {submitted && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleFinish}
            sx={{ px: 6, py: 2 }}
          >
            Complete Step 4 - Return to Dashboard
          </Button>
        </Box>
      )}

    </Container>
  )
}

export default Phase4_2Step4Interaction3
