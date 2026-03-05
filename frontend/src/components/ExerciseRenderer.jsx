import React, { useState } from 'react'
import {
  Box, Typography, Button, Stack, TextField, FormControl, InputLabel,
  Select, MenuItem, Chip, IconButton
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ReplayIcon from '@mui/icons-material/Replay'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import SendIcon from '@mui/icons-material/Send'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// Exercise type configurations
const EXERCISE_CONFIG = {
  introduction: { icon: '👋', title: 'Self Introduction', desc: 'Introduce yourself and share relevant background', color: '#6366f1', placeholder: 'Tell us about yourself, your background, and what brings you here...' },
  motivation: { icon: '💪', title: 'Share Your Motivation', desc: 'Express your interest and motivation for the project', color: '#8b5cf6', placeholder: 'What motivates you to participate in this cultural event?' },
  cultural_knowledge: { icon: '🌍', title: 'Cultural Knowledge', desc: 'Share your understanding of cultural topics', color: '#0ea5e9', placeholder: 'Share your thoughts on this cultural topic...' },
  creativity: { icon: '🎨', title: 'Creative Thinking', desc: 'Demonstrate creative thinking and original ideas', color: '#f59e0b', placeholder: 'Let your creativity shine through your response...' },
  skills_discussion: { icon: '🗣️', title: 'Skills & Experience', desc: 'Discuss your skills and relevant experience', color: '#10b981', placeholder: 'Describe your relevant skills and experience...' },
  listening: { icon: '🎧', title: 'Listening Comprehension', desc: 'Listen carefully to the audio and respond', color: '#6366f1', placeholder: 'Listen carefully and respond appropriately...' },
  social_interaction: { icon: '💬', title: 'Social Interaction', desc: 'Practice real-world communication skills', color: '#10b981', placeholder: 'How would you respond in this situation? Consider politeness and cultural context...' },
  problem_solving: { icon: '🧩', title: 'Problem Solving', desc: 'Think critically and propose solutions', color: '#f59e0b', placeholder: 'Describe your approach to solving this problem step by step...' },
  writing: { icon: '✍️', title: 'Writing Task', desc: 'Demonstrate your writing skills with proper structure', color: '#ef4444', placeholder: 'Write your response with attention to grammar, vocabulary, and structure...' },
  word_bank: { icon: '🔤', title: 'Word Bank Exercise', desc: 'Fill in the blanks using the correct words', color: '#0ea5e9', placeholder: '' },
  dialogue: { icon: '💭', title: 'Interactive Dialogue', desc: 'Participate in a natural conversation', color: '#8b5cf6', placeholder: 'Continue the conversation naturally...' },
}

const DEFAULT_CONFIG = { icon: '📝', title: 'Response Exercise', desc: 'Provide a thoughtful response', color: '#6366f1', placeholder: 'Type your response here...' }

export default function ExerciseRenderer({ question, onSubmit, loading }) {
  const [response, setResponse] = useState('')
  const [wordBankAnswers, setWordBankAnswers] = useState({})
  const [audioRef, setAudioRef] = useState(null)
  const [showHint, setShowHint] = useState(false)

  const config = EXERCISE_CONFIG[question.type] || DEFAULT_CONFIG

  const handleSubmit = (e) => {
    e.preventDefault()
    let finalResponse = response
    if (question.type === 'word_bank' && question.blanks) {
      finalResponse = question.template
      question.blanks.forEach((blank, index) => {
        const answer = wordBankAnswers[index] || ''
        finalResponse = finalResponse.replace(`[${index}]`, answer)
      })
    }
    onSubmit(finalResponse)
  }

  const generatePreview = () => {
    if (!question.template) return ''
    let preview = question.template
    question.blanks?.forEach((blank, index) => {
      const answer = wordBankAnswers[index] || `[${blank.label || `word ${index + 1}`}]`
      preview = preview.replace(`[${index}]`, answer)
    })
    return preview
  }

  const wordCount = response.split(' ').filter(w => w.length > 0).length

  // ── Shared exercise header ──
  const ExerciseHeader = () => (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 2,
      p: 2, borderRadius: 2.5,
      bgcolor: `${config.color}06`,
      border: `1px solid ${config.color}15`,
    }}>
      <Box sx={{
        width: 42, height: 42, borderRadius: 2.5,
        bgcolor: `${config.color}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem', flexShrink: 0,
      }}>
        {config.icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
          {config.title}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
          {config.desc}
        </Typography>
      </Box>
    </Box>
  )

  // ── Shared text input ──
  const ResponseInput = ({ label, placeholder, minRows = 4, showWordCount = false }) => (
    <Box>
      <TextField
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        multiline
        minRows={minRows}
        fullWidth
        placeholder={placeholder || config.placeholder}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2.5,
            fontSize: '0.95rem',
            bgcolor: '#fafbfc',
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#cbd5e1' },
            '&.Mui-focused fieldset': { borderColor: config.color, borderWidth: '1.5px' },
            '&.Mui-focused': { boxShadow: `0 0 0 3px ${config.color}10` },
          },
          '& .MuiInputLabel-root': { fontSize: '0.88rem', color: '#94a3b8' },
          '& .MuiInputLabel-root.Mui-focused': { color: config.color },
        }}
      />
      {showWordCount && response.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 0.8 }}>
          <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'} &middot; {response.length} chars
          </Typography>
        </Stack>
      )}
    </Box>
  )

  // ── Hint section ──
  const HintSection = () => {
    if (!question.hint) return null
    return (
      <Box>
        <Button
          size="small"
          startIcon={<LightbulbIcon sx={{ fontSize: 15 }} />}
          onClick={() => setShowHint(!showHint)}
          sx={{
            borderRadius: 2, px: 1.5, py: 0.4, fontWeight: 600,
            textTransform: 'none', fontSize: '0.8rem',
            color: '#f59e0b', bgcolor: showHint ? '#fef3c720' : 'transparent',
            '&:hover': { bgcolor: '#fef3c730' },
          }}
        >
          {showHint ? 'Hide Hint' : 'Need a hint?'}
        </Button>
        {showHint && (
          <Box sx={{
            mt: 1, p: 2, borderRadius: 2.5,
            bgcolor: '#fef3c710', border: '1px solid #fde68a30',
            display: 'flex', gap: 1.5, alignItems: 'flex-start',
          }}>
            <LightbulbIcon sx={{ fontSize: 16, color: '#f59e0b', mt: 0.2, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.85rem', color: '#92400e' }}>
              {question.hint}
            </Typography>
          </Box>
        )}
      </Box>
    )
  }

  // ── Tip box ──
  const TipBox = ({ text }) => (
    <Box sx={{
      p: 2, borderRadius: 2.5,
      bgcolor: '#eff6ff08', border: '1px solid #dbeafe30',
      display: 'flex', gap: 1.5, alignItems: 'flex-start',
    }}>
      <InfoOutlinedIcon sx={{ fontSize: 16, color: '#3b82f6', mt: 0.2, flexShrink: 0 }} />
      <Typography sx={{ fontSize: '0.85rem', color: '#475569' }}>
        {text}
      </Typography>
    </Box>
  )

  // ── Exercise type renderers ──
  const renderOpenEnded = () => (
    <Stack spacing={2.5}>
      <ExerciseHeader />
      <ResponseInput showWordCount />
      <HintSection />
    </Stack>
  )

  const renderListening = () => (
    <Stack spacing={2.5}>
      <ExerciseHeader />
      {question.audio_url && (
        <Box sx={{
          p: 2, borderRadius: 2.5,
          bgcolor: '#f8fafc', border: '1px solid #f1f5f9',
        }}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
            <audio src={question.audio_url} ref={setAudioRef} />
            <IconButton
              onClick={() => audioRef && audioRef.play()}
              sx={{
                width: 44, height: 44,
                background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
                color: 'white',
                boxShadow: `0 2px 8px ${config.color}30`,
                '&:hover': { background: `linear-gradient(135deg, ${config.color}dd, ${config.color}bb)` },
              }}
            >
              <PlayArrowIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <IconButton
              onClick={() => { if (audioRef) { audioRef.currentTime = 0; audioRef.play() } }}
              sx={{
                width: 36, height: 36, color: '#64748b',
                border: '1px solid #e2e8f0',
                '&:hover': { bgcolor: '#f1f5f9' },
              }}
            >
              <ReplayIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Chip size="small" icon={<VolumeUpIcon sx={{ fontSize: 14 }} />} label="Audio" sx={{
              height: 26, fontSize: '0.72rem', fontWeight: 600,
              bgcolor: `${config.color}08`, color: config.color, border: `1px solid ${config.color}20`,
              '& .MuiChip-icon': { color: config.color },
            }} />
          </Stack>
        </Box>
      )}
      <ResponseInput placeholder="What did you hear? Respond to the speaker..." minRows={3} />
    </Stack>
  )

  const renderWordBank = () => (
    <Stack spacing={2.5}>
      <ExerciseHeader />
      <Box sx={{ borderRadius: 2.5, border: '1px solid #f1f5f9', p: 2.5 }}>
        <Typography sx={{ fontSize: '0.88rem', color: '#475569', mb: 2 }}>
          Complete the sentence by selecting the appropriate words:
        </Typography>
        {question.blanks && question.blanks.map((blank, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: '0.85rem' }}>Word {index + 1}</InputLabel>
              <Select
                value={wordBankAnswers[index] || ''}
                label={`Word ${index + 1}`}
                onChange={(e) => setWordBankAnswers({ ...wordBankAnswers, [index]: e.target.value })}
                sx={{
                  borderRadius: 2.5, fontSize: '0.9rem',
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '&:hover fieldset': { borderColor: '#cbd5e1' },
                  '&.Mui-focused fieldset': { borderColor: config.color },
                }}
              >
                {blank.options.map((option) => (
                  <MenuItem key={option} value={option} sx={{ fontSize: '0.9rem' }}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
        {question.template && (
          <Box sx={{
            p: 2, borderRadius: 2, mt: 1,
            bgcolor: '#f8fafc', border: '1px solid #f1f5f9',
          }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
              Preview
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#334155' }}>
              {generatePreview()}
            </Typography>
          </Box>
        )}
      </Box>
    </Stack>
  )

  const renderSocialInteraction = () => (
    <Stack spacing={2.5}>
      <ExerciseHeader />
      <TipBox text="Be polite, clear, and consider cultural context in your response." />
      <ResponseInput showWordCount />
    </Stack>
  )

  const renderProblemSolving = () => (
    <Stack spacing={2.5}>
      <ExerciseHeader />
      <Box sx={{ display: 'flex', gap: 2, p: 2, borderRadius: 2.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
        {[
          { step: '1', label: 'Understand', desc: 'Identify the key issues' },
          { step: '2', label: 'Propose', desc: 'Think of practical steps' },
        ].map((item, i) => (
          <Box key={i} sx={{ flex: 1, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              bgcolor: `${config.color}10`, color: config.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700,
            }}>
              {item.step}
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 650, color: '#0f172a' }}>{item.label}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.desc}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <ResponseInput showWordCount />
    </Stack>
  )

  const renderWriting = () => (
    <Stack spacing={2.5}>
      <ExerciseHeader />
      <TipBox text="Use proper grammar, clear structure, and appropriate vocabulary." />
      <ResponseInput minRows={6} showWordCount />
    </Stack>
  )

  const renderDialogue = () => (
    <Stack spacing={2.5}>
      <ExerciseHeader />
      {question.dialogue_context && (
        <Box sx={{
          p: 2, borderRadius: 2.5,
          bgcolor: '#f8fafc', border: '1px solid #f1f5f9',
        }}>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
            Context
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', color: '#475569' }}>
            {question.dialogue_context}
          </Typography>
        </Box>
      )}
      <ResponseInput minRows={3} showWordCount />
    </Stack>
  )

  const renderByType = () => {
    switch (question.type) {
      case 'listening': return renderListening()
      case 'word_bank': return renderWordBank()
      case 'social_interaction': return renderSocialInteraction()
      case 'problem_solving': return renderProblemSolving()
      case 'writing': return renderWriting()
      case 'dialogue': return renderDialogue()
      default: return renderOpenEnded()
    }
  }

  return (
    <Box sx={{ borderRadius: 3, border: '1px solid #f1f5f9', p: { xs: 2, md: 3 } }}>
      <Box component="form" onSubmit={handleSubmit}>
        {renderByType()}

        {/* Submit bar */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }} alignItems="center" justifyContent="space-between">
          <Button
            type="submit"
            disabled={loading || (!response && Object.keys(wordBankAnswers).length === 0)}
            endIcon={loading ? null : <ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: 2.5, px: 3, py: 1, fontWeight: 650,
              textTransform: 'none', fontSize: '0.88rem',
              background: loading ? '#e2e8f0' : `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
              color: loading ? '#94a3b8' : 'white',
              boxShadow: loading ? 'none' : `0 2px 8px ${config.color}25`,
              transition: 'all 0.2s',
              '&:hover': {
                background: `linear-gradient(135deg, ${config.color}dd, ${config.color}bb)`,
                boxShadow: `0 4px 16px ${config.color}35`,
              },
              '&.Mui-disabled': {
                background: '#f1f5f9', color: '#94a3b8', boxShadow: 'none',
              },
            }}
          >
            {loading ? 'Submitting...' : 'Submit & Continue'}
          </Button>

          <Chip
            size="small"
            label={question.skill?.replace('_', ' ') || 'General'}
            sx={{
              height: 26, fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize',
              bgcolor: `${config.color}08`, color: config.color,
              border: `1px solid ${config.color}15`,
            }}
          />
        </Stack>
      </Box>
    </Box>
  )
}
