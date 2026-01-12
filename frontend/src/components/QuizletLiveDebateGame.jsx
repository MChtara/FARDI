import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Stack, Chip, Avatar, LinearProgress } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const QuizletLiveDebateGame = ({ debatePrompts = [], glossaryTerms = [], onComplete }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [responses, setResponses] = useState([])
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  const currentPrompt = debatePrompts[currentPromptIndex]

  const handleSubmit = async () => {
    if (!response.trim()) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/phase4/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: currentPrompt.prompt,
          answer: response,
          level: 'C1',
          task: 'advanced_debate',
          criteria: {
            requiresNuance: true,
            glossaryTerms: glossaryTerms,
            minTermsRequired: 4
          }
        })
      })

      const result = await res.json()
      setEvaluationResult(result)

      const newResponses = [...responses, {
        prompt: currentPrompt.prompt,
        response: response,
        evaluation: result,
        isCorrect: result.score === 1
      }]
      setResponses(newResponses)

      if (result.score === 1) setScore(score + 1)

      setTimeout(() => {
        if (currentPromptIndex + 1 < debatePrompts.length) {
          setCurrentPromptIndex(currentPromptIndex + 1)
          setResponse('')
          setEvaluationResult(null)
        } else {
          setGameComplete(true)
          if (onComplete) {
            onComplete({
              score: result.score === 1 ? score + 1 : score,
              totalPrompts: debatePrompts.length,
              responses: newResponses,
              completed: true
            })
          }
        }
      }, 2500)
    } catch (error) {
      console.error('Evaluation error:', error)
      setEvaluationResult({ score: 0, feedback: 'Unable to evaluate.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (gameComplete) {
    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', color: 'white' }}>
        <GroupsIcon sx={{ fontSize: 100, mb: 2 }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">Debate Complete!</Typography>
        <Typography variant="h5">Score: {score} / {debatePrompts.length}</Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Paper elevation={4} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: '#white', color: '#9c27b0' }}><GroupsIcon /></Avatar>
            <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
              Debate Prompt {currentPromptIndex + 1} / {debatePrompts.length}
            </Typography>
          </Stack>
          <Typography variant="h6" sx={{ color: 'white' }}>Score: {score}</Typography>
        </Stack>
        <LinearProgress variant="determinate" value={(currentPromptIndex / debatePrompts.length) * 100} sx={{ mt: 2, height: 10, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { backgroundColor: '#ffd700' } }} />
      </Paper>

      <Paper elevation={6} sx={{ p: 4, mb: 3, backgroundColor: evaluationResult ? (evaluationResult.score === 1 ? '#e8f5e9' : '#ffebee') : 'white' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#000000', mb: 3 }}>
          {currentPrompt?.prompt}
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={5}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Provide a nuanced response using at least 4 advanced marketing terms..."
          disabled={isSubmitting || evaluationResult !== null}
          InputProps={{ style: { color: '#000000', fontSize: '16px' } }}
          sx={{ mb: 2, '& .MuiInputBase-input': { color: '#000000 !important', WebkitTextFillColor: '#000000 !important' } }}
        />

        {evaluationResult && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: evaluationResult.score === 1 ? 'success.light' : 'error.light', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#000000' }}>
              {evaluationResult.score === 1 ? '✓ Excellent Response!' : '✗ Needs More Depth'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#000000' }}>{evaluationResult.feedback}</Typography>
          </Box>
        )}

        <Button variant="contained" onClick={handleSubmit} disabled={!response.trim() || isSubmitting || evaluationResult !== null} sx={{ mt: 2 }}>
          {isSubmitting ? 'Evaluating...' : 'Submit Response'}
        </Button>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, backgroundColor: 'info.light' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#000000' }} gutterBottom>Use These Advanced Terms:</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {glossaryTerms.map((term, i) => (
            <Chip key={i} label={term} size="small" sx={{ backgroundColor: 'white', fontWeight: 'bold' }} />
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}

export default QuizletLiveDebateGame
