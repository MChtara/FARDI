/**
 * Phase 2 Remedial Page - Gamified Exercise Interface
 * Supports all 20 task types from gamification-exercises.json
 */
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Stack, Button, Chip, LinearProgress,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, IconButton
} from '@mui/material'

// Import all gamified components
import PuzzleGame from '../components/PuzzleGame.jsx'
import WordSniper from '../components/WordSniper.jsx'
import BillboardDesigner from '../components/BillboardDesigner.jsx'
import PhraseExpander from '../components/PhraseExpander.jsx'
import GapFillStory from '../components/GapFillStory.jsx'
import EventPlannerBoard from '../components/EventPlannerBoard.jsx'
import {
  DebateArena,
  ConversationTetris,
  RhythmMatcher,
  SignalDecoder,
  ChatMessengerSim,
  PhoneCallSim,
  SocialPostMaker,
  SentenceGarden
} from '../components/exercises'

// Task type to component mapping (from gamification-exercises.json)
// Note: Backend API converts some types: drag_and_drop→matching, gap_fill→fill_gaps
const TASK_COMPONENT_MAP = {
  'drag_and_drop': 'PuzzleGame',
  'matching': 'PuzzleGame',  // Backend converts drag_and_drop to matching
  'listening_drag_drop': 'RhythmMatcher',
  'gap_fill': 'WordSniper',
  'fill_gaps': 'WordSniper',  // Backend converts gap_fill to fill_gaps
  'gap_fill_story': 'GapFillStory',
  'negotiation_gap_fill': 'DebateArena',
  'listening_negotiation': 'SocialPostMaker',  // Writing task with guided_questions
  'dialogue_completion': 'PhoneCallSim',
  'listening_dialogue_gap_fill': 'SignalDecoder',
  'listening_role_play': 'SocialPostMaker',  // Writing task with guided_questions
  'writing': 'SocialPostMaker',
  'listening_proposal_writing': 'SocialPostMaker',
  'listening_proposal': 'SocialPostMaker',
  'sentence_expansion': 'SentenceGarden',
  'reflection_gap_fill': 'SentenceGarden',
  'listening_expansion': 'SocialPostMaker',  // Writing task with guided_questions
  'listening_story_writing': 'ChatMessengerSim',
  'listening_research': 'SocialPostMaker',  // Writing task with guided_questions
  'listening_reflection': 'ChatMessengerSim',
  'listening_team_plan': 'SocialPostMaker',  // Writing task with guided_questions
  'listening_assignment': 'SocialPostMaker'  // Writing task with guided_questions
}

export default function Phase2Remedial() {
  const { stepId, level } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [pasteWarn, setPasteWarn] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [exerciseCompleted, setExerciseCompleted] = useState(false)
  const [exerciseResult, setExerciseResult] = useState(null)

  // Load activity data
  const load = async () => {
    setLoading(true)
    setError('')
    setExerciseCompleted(false)
    setExerciseResult(null)
    setAudioPlayed(false)

    try {
      const idx = searchParams.get('activity')
      const url = `/api/phase2/remedial?step_id=${encodeURIComponent(stepId)}&level=${encodeURIComponent(level)}${idx ? `&activity=${idx}` : ''}`
      const r = await fetch(url, { credentials: 'include' })

      if (r.status === 302 || (r.status === 200 && r.headers.get('content-type')?.includes('text/html'))) {
        navigate('/login')
        return
      }

      if (!r.ok) {
        throw new Error(`Failed to load remedial data (${r.status})`)
      }

      const d = await r.json()
      setData(d)

      // Restore saved answers
      const storageKey = `remedial_${stepId}_${level}_${d.activity.id}`
      const sessionAnswers = sessionStorage.getItem(storageKey)

      if (sessionAnswers) {
        try {
          setAnswers(JSON.parse(sessionAnswers))
        } catch (e) {
          if (d.saved_responses && Object.keys(d.saved_responses).length > 0) {
            setAnswers(d.saved_responses)
          } else {
            setAnswers({})
          }
        }
      } else if (d.saved_responses && Object.keys(d.saved_responses).length > 0) {
        setAnswers(d.saved_responses)
        sessionStorage.setItem(storageKey, JSON.stringify(d.saved_responses))
      } else {
        setAnswers({})
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [stepId, level, searchParams])

  // Save answers to sessionStorage
  useEffect(() => {
    if (data?.activity?.id && Object.keys(answers).length > 0) {
      const storageKey = `remedial_${stepId}_${level}_${data.activity.id}`
      sessionStorage.setItem(storageKey, JSON.stringify(answers))
    }
  }, [answers, data, stepId, level])

  const setAnswer = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }))

  // Play audio for listening exercises
  const playAudio = (text) => {
    if (!text) return

    setAudioPlaying(true)
    try {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.rate = 0.9
        u.pitch = 1
        u.lang = 'en-US'
        u.onend = () => {
          setAudioPlaying(false)
          setAudioPlayed(true)
        }
        u.onerror = () => {
          setAudioPlaying(false)
          setAudioPlayed(true)
        }
        speechSynthesis.speak(u)
      } else {
        setTimeout(() => {
          setAudioPlaying(false)
          setAudioPlayed(true)
        }, 3000)
      }
    } catch (err) {
      console.warn('Speech synthesis failed:', err)
      setAudioPlaying(false)
      setAudioPlayed(true)
    }
  }

  // Compute score based on answers
  const computeScore = () => {
    if (!data?.activity) return 0
    const a = data.activity
    let score = 0

    // Check correct_answers
    if (a.correct_answers && Array.isArray(a.correct_answers)) {
      const totalAnswers = Object.keys(answers).filter(k => answers[k]).length
      score = Math.min(totalAnswers, a.correct_answers.length)
    }

    // For pairs-based matching
    if (a.pairs && Array.isArray(a.pairs)) {
      a.pairs.forEach((pair) => {
        if (answers[pair.term] === pair.term) score++
      })
    }

    // Fallback: count non-empty answers
    if (score === 0) {
      Object.values(answers).forEach(v => {
        if (v && v.toString().trim()) score++
      })
    }

    return score
  }

  // Handle exercise completion from gamified components
  const handleExerciseComplete = (result) => {
    console.log('Exercise completed:', result)
    setExerciseCompleted(true)
    setExerciseResult(result)
  }

  // Handle progress updates from gamified components
  const handleProgress = (progress) => {
    console.log('Progress:', progress)
    // Update answers from component progress
    if (progress.answers) {
      setAnswers(prev => ({ ...prev, ...progress.answers }))
    } else if (progress.answer !== undefined) {
      // For components that return a single answer (SocialPostMaker, etc.)
      setAnswers({ response: progress.answer })
    }
  }

  // Submit answers to backend
  const onSubmit = async () => {
    if (!data?.activity) return
    setSubmitting(true)

    try {
      const score = exerciseResult?.correctCount || computeScore()
      const r = await fetch('/api/phase2/submit-remedial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step_id: data.step_id,
          level: data.level,
          activity_id: data.activity.id,
          responses: answers,
          score
        })
      })

      const res = await r.json()
      if (!r.ok) throw new Error(res.error || 'Submission failed')

      // Clear sessionStorage
      const storageKey = `remedial_${data.step_id}_${data.level}_${data.activity.id}`
      sessionStorage.removeItem(storageKey)

      window.lastRemedialResult = res

      if (res.overall_performance_low) {
        setFeedback({
          title: '⚠️ Overall Performance Needs Improvement',
          message: res.message,
          success: false,
          score: res.overall_score,
          threshold: res.overall_max_score,
          overall_percentage: res.overall_percentage,
          recommendation: res.recommendation,
          isOverallPerformance: true
        })
      } else {
        // Get character-style feedback
        try {
          const fbRes = await fetch('/api/phase2/remedial/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              step_id: data.step_id,
              level: data.level,
              activity_id: data.activity.id,
              score
            })
          })
          const fb = await fbRes.json()
          setFeedback({
            title: res.activity_passed ? '🎉 Great Job!' : '💪 Keep Practicing!',
            message: fb.feedback || res.message,
            success: res.activity_passed,
            score: score,
            threshold: data.activity?.success_threshold || 6
          })
        } catch (fbErr) {
          setFeedback({
            title: res.activity_passed ? '🎉 Great Job!' : '💪 Keep Practicing!',
            message: res.message,
            success: res.activity_passed,
            score: score,
            threshold: data.activity?.success_threshold || 6
          })
        }
      }

      setShowFeedback(true)
    } catch (e) {
      console.error('Submission error:', e)
      setError(e.message)
      setFeedback({
        title: '❌ Submission Error',
        message: 'There was a problem submitting your response. Please try again.',
        success: false
      })
      setShowFeedback(true)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle feedback dialog close
  const handleFeedbackClose = (proceed = false) => {
    setShowFeedback(false)

    if (proceed && feedback) {
      const lastResult = window.lastRemedialResult
      if (lastResult) {
        if (lastResult.remedial_complete) {
          navigate(`/phase2/step/${data.step_id}`)
        } else if (lastResult.next_url) {
          try {
            const u = new URL(lastResult.next_url, window.location.origin)
            const segs = u.pathname.split('/').filter(Boolean)
            const step = segs[3]
            const lvl = segs[4]
            const idx = u.searchParams.get('activity')
            navigate(`/phase2/remedial/${step}/${lvl}${idx ? `?activity=${idx}` : ''}`)
          } catch {
            load()
          }
        } else {
          load()
        }
      }
    }

    setFeedback(null)
  }

  // Render gamified exercise component
  const renderExerciseComponent = () => {
    if (!data?.activity) return null

    const a = data.activity
    const taskType = a.task_type || a.type
    const componentName = TASK_COMPONENT_MAP[taskType]

    // Check if this is a listening exercise and audio hasn't been played yet
    const isListening = taskType?.startsWith('listening_')
    const hasAudio = a.audio_script || a.audio_text || a.audio_content

    if (isListening && hasAudio && !audioPlayed) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }} elevation={3}>
          <Typography variant="h5" gutterBottom>🎧 Listening Exercise</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {a.instruction || 'Listen to the audio carefully before completing the exercise.'}
          </Typography>

          {/* Audio waveform animation */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, height: 60, alignItems: 'center', mb: 3 }}>
            {[...Array(15)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 6,
                  bgcolor: audioPlaying ? 'primary.main' : 'grey.400',
                  borderRadius: 1,
                  height: audioPlaying ? `${20 + Math.random() * 40}px` : 10,
                  transition: 'height 0.1s',
                  animation: audioPlaying ? `wave 0.5s ease-in-out infinite ${i * 0.05}s` : 'none',
                  '@keyframes wave': {
                    '0%, 100%': { height: '10px' },
                    '50%': { height: '50px' }
                  }
                }}
              />
            ))}
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => playAudio(a.audio_script || a.audio_text || a.audio_content)}
            disabled={audioPlaying}
            startIcon={audioPlaying ? <CircularProgress size={20} color="inherit" /> : '🔊'}
            sx={{ minWidth: 200 }}
          >
            {audioPlaying ? 'Playing...' : 'Play Audio'}
          </Button>
        </Paper>
      )
    }

    // Prepare exercise data in a normalized format
    const exerciseData = {
      type: taskType,
      instruction: a.instruction || '',
      audio_script: a.audio_script || a.audio_text || a.audio_content,
      word_bank: a.word_bank || [],
      templates: a.templates || [],
      pairs: a.pairs || [],
      matching_items: a.matching_items || {},  // API returns matching_items for drag_and_drop
      dialogue_lines: a.dialogue_lines || [],
      correct_answers: a.correct_answers || [],
      // Use correct_answers as guided_questions if guided_questions is missing (fallback)
      guided_questions: a.guided_questions || (a.correct_answers && a.correct_answers.length > 0 ? ['Write your response based on the examples provided.'] : []),
      example_of_answers: a.example_of_answers || a.correct_answers || [],
      ai_evaluation_prompt: a.ai_evaluation?.prompt || ''
    }

    switch (componentName) {
      case 'PuzzleGame':
        // Use matching_items (object) if pairs array is empty
        const hasPairs = exerciseData.pairs && exerciseData.pairs.length > 0
        const hasMatchingItems = exerciseData.matching_items && Object.keys(exerciseData.matching_items).length > 0

        // Extract items and descriptions from either format
        let puzzleItems = []
        let puzzleDescriptions = {}

        if (hasPairs) {
          puzzleItems = exerciseData.pairs.map(p => p.term)
          puzzleDescriptions = exerciseData.pairs.reduce((acc, p) => ({ ...acc, [p.term]: p.definition }), {})
        } else if (hasMatchingItems) {
          puzzleItems = Object.keys(exerciseData.matching_items)
          puzzleDescriptions = exerciseData.matching_items
        }

        return (
          <PuzzleGame
            items={puzzleItems}
            descriptions={puzzleDescriptions}
            answers={answers}
            onChange={(key, value) => setAnswer(key, value)}
            onComplete={() => handleExerciseComplete({ isPerfect: true, correctCount: puzzleItems.length })}
          />
        )

      case 'RhythmMatcher':
        return (
          <RhythmMatcher
            exercise={exerciseData}
            onComplete={handleExerciseComplete}
            onProgress={handleProgress}
          />
        )

      case 'WordSniper':
        // Transform templates to sentences format
        const sentences = exerciseData.templates.map((template, i) => {
          const blankCount = (template.match(/_{3,}/g) || []).length
          return {
            text: template,
            blanks: Array(blankCount).fill('blank')
          }
        })
        return (
          <WordSniper
            sentences={sentences}
            answers={answers}
            onChange={(key, value) => setAnswer(key, value)}
            globalWordBank={exerciseData.word_bank}
            correctAnswers={exerciseData.correct_answers}
          />
        )

      case 'GapFillStory':
        return (
          <GapFillStory
            templates={exerciseData.templates}
            wordBank={exerciseData.word_bank}
            answers={answers}
            onChange={(key, value) => setAnswer(key, value)}
          />
        )

      case 'DebateArena':
        return (
          <DebateArena
            exercise={exerciseData}
            onComplete={(result) => {
              handleExerciseComplete(result)
              if (result.isVictory) {
                onSubmit()
              }
            }}
            onProgress={handleProgress}
          />
        )

      case 'ConversationTetris':
        return (
          <ConversationTetris
            exercise={exerciseData}
            onComplete={(result) => {
              handleExerciseComplete(result)
            }}
            onProgress={handleProgress}
          />
        )

      case 'PhoneCallSim':
        return (
          <PhoneCallSim
            exercise={exerciseData}
            onComplete={(result) => {
              handleExerciseComplete(result)
            }}
            onProgress={handleProgress}
          />
        )

      case 'SignalDecoder':
        return (
          <SignalDecoder
            exercise={exerciseData}
            onComplete={handleExerciseComplete}
            onProgress={handleProgress}
          />
        )

      case 'SocialPostMaker':
        return (
          <SocialPostMaker
            exercise={exerciseData}
            onComplete={(result) => {
              handleExerciseComplete(result)
              // Auto-submit after completion
              setTimeout(() => onSubmit(), 500)
            }}
            onProgress={handleProgress}
          />
        )

      case 'BillboardDesigner':
        return (
          <BillboardDesigner
            templates={exerciseData.templates}
            guidedQuestions={exerciseData.guided_questions}
            exampleAnswers={exerciseData.example_of_answers}
            answers={answers}
            onChange={(key, value) => setAnswer(key, value)}
          />
        )

      case 'SentenceGarden':
        return (
          <SentenceGarden
            exercise={exerciseData}
            onComplete={(result) => {
              handleExerciseComplete(result)
              // Auto-submit after completion
              setTimeout(() => onSubmit(), 500)
            }}
            onProgress={handleProgress}
          />
        )

      case 'PhraseExpander':
        return (
          <PhraseExpander
            templates={exerciseData.templates}
            guidedQuestions={exerciseData.guided_questions}
            exampleAnswers={exerciseData.example_of_answers}
            answers={answers}
            onChange={(key, value) => setAnswer(key, value)}
          />
        )

      case 'ChatMessengerSim':
        return (
          <ChatMessengerSim
            exercise={exerciseData}
            onComplete={handleExerciseComplete}
            onProgress={handleProgress}
          />
        )

      case 'EventPlannerBoard':
        return (
          <EventPlannerBoard
            exercise={exerciseData}
            templates={exerciseData.templates}
            guidedQuestions={exerciseData.guided_questions}
            dialogueLines={exerciseData.dialogue_lines}
            wordBank={exerciseData.word_bank}
            answers={answers}
            onChange={(key, value) => setAnswer(key, value)}
          />
        )

      default:
        // Fallback for unsupported types
        return (
          <Paper sx={{ p: 3, bgcolor: 'warning.light' }} variant="outlined">
            <Typography variant="h6" color="warning.dark">
              Task Type: {taskType}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {a.instruction}
            </Typography>
            {exerciseData.word_bank.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {exerciseData.word_bank.map((word, i) => (
                  <Chip key={i} label={word} variant="outlined" />
                ))}
              </Box>
            )}
            <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
              Activity ID: {a.id}
            </Typography>
          </Paper>
        )
    }
  }

  // Check if current component handles its own submission
  const isSelfSubmitting = () => {
    if (!data?.activity) return false
    const componentName = TASK_COMPONENT_MAP[data.activity.task_type || data.activity.type]
    return ['DebateArena', 'RhythmMatcher', 'SignalDecoder', 'ChatMessengerSim', 'SocialPostMaker', 'SentenceGarden', 'PhoneCallSim'].includes(componentName)
  }

  if (loading) return <Box sx={{ p: 3 }}><LinearProgress /></Box>
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>
  if (!data) return null

  const a = data.activity

  return (
    <Box sx={{ p: 3 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        {/* Navigation Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <IconButton
            disabled={data.current_index <= 0}
            onClick={() => navigate(`/phase2/remedial/${data.step_id}/${data.level}?activity=${Math.max(0, data.current_index - 1)}`)}
            sx={{
              border: '2px solid',
              borderColor: data.current_index <= 0 ? 'divider' : 'primary.main',
              '&:hover': { bgcolor: 'primary.light', borderColor: 'primary.dark' }
            }}
          >
            <Typography variant="h6">←</Typography>
          </IconButton>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" fontWeight="medium" color="text.secondary">
              Activity {data.current_index + 1} of {data.total}
            </Typography>
            <Chip
              label={`${data.level} Level`}
              size="small"
              color="primary"
              sx={{ mt: 0.5 }}
            />
          </Box>

          <IconButton
            disabled={data.current_index >= (data.total - 1)}
            onClick={() => navigate(`/phase2/remedial/${data.step_id}/${data.level}?activity=${Math.min(data.total - 1, data.current_index + 1)}`)}
            sx={{
              border: '2px solid',
              borderColor: data.current_index >= (data.total - 1) ? 'divider' : 'primary.main',
              '&:hover': { bgcolor: 'primary.light', borderColor: 'primary.dark' }
            }}
          >
            <Typography variant="h6">→</Typography>
          </IconButton>
        </Box>

        {/* Task Type Badge */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Chip
            label={((a.task_type || a.type)?.replace(/_/g, ' ') || 'EXERCISE').toUpperCase()}
            color="secondary"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* Instruction (for non-listening or after audio played) */}
        {(!(a.task_type || a.type)?.startsWith('listening_') || audioPlayed) && a.instruction && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }} variant="outlined">
            <Typography variant="body1" textAlign="center">
              {a.instruction}
            </Typography>
          </Paper>
        )}

        {/* Exercise Component */}
        <Box sx={{ mb: 3 }}>
          {renderExerciseComponent()}
        </Box>

        {/* Submit Button (for non-self-submitting components) */}
        {!isSelfSubmitting() && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              disabled={submitting || Object.keys(answers).length === 0}
              onClick={onSubmit}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ minWidth: 200 }}
            >
              {submitting ? 'Submitting...' : 'Submit & Continue'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onClose={() => handleFeedbackClose(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          {feedback?.title}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" paragraph>
            {feedback?.message}
          </Typography>
          {feedback?.isOverallPerformance ? (
            <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
              <Chip
                label={`Overall Score: ${feedback.score}/${feedback.threshold} (${feedback.overall_percentage}%)`}
                color="warning"
                sx={{ fontSize: '1rem', py: 2 }}
              />
              {feedback.recommendation && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                  💡 {feedback.recommendation}
                </Typography>
              )}
            </Stack>
          ) : feedback?.score !== undefined && (
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
              <Chip label={`Score: ${feedback.score}/${feedback.threshold}`} color={feedback.success ? 'success' : 'warning'} />
              {feedback.success && <Chip label="✅ Passed" color="success" />}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => handleFeedbackClose(true)} variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Paste Warning */}
      <Snackbar
        open={pasteWarn}
        autoHideDuration={2500}
        onClose={() => setPasteWarn(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" variant="filled" onClose={() => setPasteWarn(false)}>
          Pasting is disabled. Please use your own words.
        </Alert>
      </Snackbar>
    </Box>
  )
}
