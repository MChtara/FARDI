import React, { useEffect, useMemo, useState } from 'react'
import { useApiContext } from '../lib/api.jsx'
import { useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Button, Stack, TextField, LinearProgress, Stepper, Step, StepLabel, Avatar, Chip, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ReplayIcon from '@mui/icons-material/Replay'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import InfoIcon from '@mui/icons-material/Info'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QuizIcon from '@mui/icons-material/Quiz'
import TimerIcon from '@mui/icons-material/Timer'
import SecurityIcon from '@mui/icons-material/Security'
import HelpIcon from '@mui/icons-material/Help'
import ExerciseRenderer from '../components/ExerciseRenderer.jsx'
import Phase2Introduction from '../components/Phase2Introduction.jsx'

export default function Game() {
  const { client } = useApiContext()
  const [state, setState] = useState(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [audioRef, setAudioRef] = useState(null)
  const [pasteWarn, setPasteWarn] = useState(false)
  const [showIntro, setShowIntro] = useState(false) // Disable Phase 2 intro in Phase 1 game
  const [showInstructions, setShowInstructions] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const s = await client.getGameState()
      if (s.completed) {
        // Show completion celebration
        setSubmitError('🎉 Assessment Complete! Calculating your results...')
        setTimeout(() => {
          navigate('/results')
        }, 2000)
      } else {
        setState(s)
        // Only show instructions if user hasn't started yet (optional)
        // Remove automatic popup - let users start directly
        // if (s.current_step === 0) {
        //   setShowInstructions(true)
        // }
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    if (e) e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      await client.submitResponse({ response, type: state.question.type })
      setResponse('')
      setFeedback(null)
      
      // Check if this was the final question
      if (state.current_step === state.total_steps - 1) {
        setSubmitError('🎯 Final answer submitted! Preparing your results...')
      }
      
      await load()
    } catch (e) {
      // Handle AI detection or other submission errors gracefully
      if (e.message.includes('AI content detected')) {
        setSubmitError('💡 Tip: Please rephrase your answer in your own words for the most accurate assessment.')
      } else {
        setSubmitError('Unable to submit response. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleExerciseSubmit = async (responseText) => {
    setSubmitting(true)
    setSubmitError('')
    try {
      await client.submitResponse({ response: responseText, type: state.question.type })
      setFeedback(null)
      
      // Show encouraging progress message
      const encouragingMessages = [
        "Great work! Moving to the next question...",
        "Nice response! Let's continue...", 
        "Well done! On to the next scenario...",
        "Excellent! Keep up the good work...",
        "Perfect! Moving forward..."
      ]
      const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
      setSubmitError(`✅ ${randomMessage}`)
      setTimeout(() => setSubmitError(''), 2000)
      
      await load()
    } catch (e) {
      // Handle AI detection or other submission errors gracefully
      if (e.message.includes('AI content detected')) {
        setSubmitError('💡 Tip: Please rephrase your answer in your own words for the most accurate assessment.')
      } else {
        setSubmitError('Unable to submit response. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleIntroStart = () => {
    // Start Phase 1 game - just close the intro dialog
    setShowIntro(false)
  }

  const handleIntroClose = () => {
    navigate('/dashboard')
  }

  const getFeedback = async () => {
    try {
      const data = await client.getFeedback({
        question: state.question.question,
        response,
        speaker: state.question.speaker,
        type: state.question.type
      })
      setFeedback(data)
    } catch (e) {
      setFeedback({ error: 'Could not get feedback' })
    }
  }

  const onPaste = (e) => {
    e.preventDefault()
    setPasteWarn(true)
  }
  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      e.preventDefault()
      setPasteWarn(true)
    }
  }

  if (loading) return <Box sx={{ p: 3 }}><LinearProgress /></Box>
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>
  if (!state) return null

  // Show introduction dialog for first time users or when requested
  if (showIntro && state.current_step === 0) {
    return (
      <Dialog open={true} maxWidth="lg" fullWidth>
        <Phase2Introduction 
          onStart={handleIntroStart}
          onClose={handleIntroClose}
        />
      </Dialog>
    )
  }

  const { current_step, total_steps, xp, question } = state

  const steps = Array.from({ length: total_steps }, (_, i) => i + 1)
  const progress = Math.round((current_step / total_steps) * 100)

  return (
    <Box>
      {/* Enhanced Header: title, step progress, XP, time estimate */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs:'column', sm:'row' }} spacing={2} alignItems={{ xs:'flex-start', sm:'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h5">Business English Assessment</Typography>
            <Typography color="text.secondary">
              Question {current_step + 1} of {total_steps}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label={`${xp} XP`} 
              color="primary" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label={`~${Math.max(1, Math.round((total_steps - current_step) * 2))} min left`} 
              color="default" 
              variant="outlined" 
              size="small"
              icon={<TimerIcon />}
            />
            <IconButton 
              size="small" 
              onClick={() => setShowInstructions(true)}
              sx={{ color: 'text.secondary' }}
            >
              <HelpIcon />
            </IconButton>
          </Stack>
        </Stack>
        
        {/* Enhanced Progress Bar */}
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress: {progress}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {total_steps - current_step} questions remaining
            </Typography>
          </Stack>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)'
              }
            }} 
          />
        </Box>
      </Paper>

      {/* Scene header with background */}
      <Paper elevation={0} sx={{ p: 0, mb: 2, overflow: 'hidden', borderRadius: 2 }}>
        <Box sx={{
          p: 3,
          minHeight: 120,
          display: 'flex',
          alignItems: 'end',
          backgroundImage: `url(/static/images/scenes/${question.scene}.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.25)' }} />
          <Box sx={{ position: 'relative', color: 'white' }}>
            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{String(question.scene || '').replaceAll('_',' ')}</Typography>
            <Typography variant="body2">{state.scene_description}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Skill & NPC section */}
      <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
        <Stack direction={{ xs:'column', md:'row' }} spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 260 }}>
            <Avatar src={state.speaker_avatar ? `/static/images/avatars/${state.speaker_avatar}` : undefined}>
              {(question.speaker||' ')[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{question.speaker}</Typography>
              <Typography variant="body2" color="text.secondary">{state.speaker_role}</Typography>
            </Box>
          </Stack>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <RecordVoiceOverIcon fontSize="small" />
              <Typography variant="overline">Currently Assessing</Typography>
            </Stack>
            <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'capitalize' }}>{String(question.skill || '').replaceAll('_',' ')}</Typography>
            <Typography variant="body2" color="text.secondary">{state.skill_description}</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Dialogue bubble with optional audio */}
      <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            {question.speaker}: 
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            {question.question}
          </Typography>
          {question.instruction && (
            <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <InfoIcon fontSize="small" />
                <Typography variant="body2">{question.instruction}</Typography>
              </Stack>
            </Paper>
          )}
          {state.audio_url && (
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <audio src={state.audio_url} ref={(r)=>setAudioRef(r)} />
                <Button 
                  variant="contained" 
                  size="small" 
                  startIcon={<PlayArrowIcon />} 
                  onClick={()=> audioRef && audioRef.play()}
                >
                  Play Audio
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<ReplayIcon />} 
                  onClick={()=> { if (audioRef){ audioRef.currentTime=0; audioRef.play(); }}}
                >
                  Replay
                </Button>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Paper>

      {/* Enhanced Exercise Renderer */}
      <ExerciseRenderer 
        question={{
          ...question,
          audio_url: state.audio_url,
          hint: state.hint
        }}
        onSubmit={handleExerciseSubmit}
        loading={submitting}
      />

      {/* Submit Error Display */}
      {submitError && (
        <Alert 
          severity="info" 
          sx={{ 
            mt: 2,
            borderRadius: 2,
            backgroundColor: 'info.50',
            '& .MuiAlert-message': {
              fontSize: '0.95rem'
            }
          }}
          onClose={() => setSubmitError('')}
        >
          {submitError}
        </Alert>
      )}

      {/* AI Feedback Section */}
      {!submitting && (
        <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Button 
              variant="outlined" 
              startIcon={<TipsAndUpdatesIcon />} 
              onClick={getFeedback} 
              disabled={!response}
              sx={{ minWidth: 150 }}
            >
              Get AI Feedback
            </Button>
            <Typography color="text.secondary">Current XP: {xp}</Typography>
          </Stack>

          {feedback && (
            <Paper sx={{ mt: 3, p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'primary.light' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                🤖 AI Feedback
              </Typography>
              {feedback.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {feedback.error}
                </Alert>
              )}
              {feedback.feedback && (
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                  {feedback.feedback}
                </Typography>
              )}
              {feedback.assessment && (
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Chip 
                      label={`CEFR Level: ${feedback.assessment.level}`}
                      color="primary" 
                      variant="filled"
                    />
                  </Stack>
                  {Array.isArray(feedback.assessment.strengths) && feedback.assessment.strengths.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="success.main" gutterBottom>
                        ✅ Strengths:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feedback.assessment.strengths.slice(0,3).join(', ')}
                      </Typography>
                    </Box>
                  )}
                  {Array.isArray(feedback.assessment.improvements) && feedback.assessment.improvements.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="warning.main" gutterBottom>
                        🎯 Areas for improvement:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feedback.assessment.improvements.slice(0,3).join(', ')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          )}
        </Paper>
      )}

      <Snackbar
        open={pasteWarn}
        autoHideDuration={2500}
        onClose={() => setPasteWarn(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" variant="filled" onClose={() => setPasteWarn(false)}>
          Pasting is disabled. Please type your own response.
        </Alert>
      </Snackbar>

      {/* Pre-Game Instructions Modal */}
      <Dialog 
        open={showInstructions} 
        onClose={() => setShowInstructions(false)}
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: 'primary.main', 
                mx: 'auto', 
                mb: 2 
              }}
            >
              <QuizIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              English Assessment Instructions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get ready for your CEFR level evaluation
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ px: 4 }}>
          <Stack spacing={3}>
            {/* What to Expect */}
            <Paper sx={{ p: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon /> What to Expect
              </Typography>
              <Stack spacing={2}>
                <Typography variant="body1">
                  • <strong>9 workplace scenarios</strong> - Real business situations you might encounter
                </Typography>
                <Typography variant="body1">
                  • <strong>15-20 minutes total</strong> - Take your time, no rush
                </Typography>
                <Typography variant="body1">
                  • <strong>Different NPCs</strong> - Meet various characters in different contexts
                </Typography>
              </Stack>
            </Paper>

            {/* How to Succeed */}
            <Paper sx={{ p: 3, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'success.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon /> How to Succeed
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Answer naturally in your own words"
                    secondary="There are no 'right' or 'wrong' answers - we're assessing your language level"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use complete sentences when possible"
                    secondary="Show your full language ability - don't just give one-word answers"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Stay relaxed and be yourself"
                    secondary="This assessment adapts to your level - no pressure!"
                  />
                </ListItem>
              </List>
            </Paper>

            {/* AI Detection */}
            <Paper sx={{ p: 3, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'warning.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon /> AI Detection & Fairness
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                We use AI detection to ensure fair assessment for everyone.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Tip:</strong> If you see an AI warning, simply rephrase your answer in your own words. 
                This helps us give you the most accurate assessment of your English level.
              </Typography>
            </Paper>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setShowInstructions(false)}
            color="inherit"
            size="large"
          >
            I'll read this later
          </Button>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => setShowInstructions(false)}
            sx={{ px: 4 }}
          >
            Start Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
