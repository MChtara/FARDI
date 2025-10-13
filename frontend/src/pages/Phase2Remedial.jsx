import React, { useEffect, useMemo, useState, useRef, useLayoutEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Stack, Button, Chip, LinearProgress, Grid, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, TextField } from '@mui/material'
import { CharacterMessage } from '../components/Avatar.jsx'

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

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const idx = searchParams.get('activity')
      const url = `/api/phase2/remedial?step_id=${encodeURIComponent(stepId)}&level=${encodeURIComponent(level)}${idx?`&activity=${idx}`:''}`
      const r = await fetch(url, { credentials: 'include' })
      
      // Check if we got redirected to login (authentication required)
      if (r.status === 302 || (r.status === 200 && r.headers.get('content-type')?.includes('text/html'))) {
        // User is not authenticated, redirect to login
        navigate('/login')
        return
      }
      
      if (!r.ok) {
        throw new Error(`Failed to load remedial data (${r.status})`)
      }
      
      const d = await r.json()
      setData(d)
      setAnswers({})
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [stepId, level, searchParams])

  const setAnswer = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }))

  // Helper to render input field - B1/B2 use text input, A1/A2 use dropdowns
  const renderInputField = (key, options) => {
    const useTextInput = data.level === 'B1' || data.level === 'B2'

    if (useTextInput) {
      return (
        <TextField
          size="small"
          value={answers[key]||''}
          onChange={e=>setAnswer(key, e.target.value)}
          placeholder="Type here..."
          sx={{ minWidth: 150 }}
        />
      )
    }

    return (
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select value={answers[key]||''} onChange={e=>setAnswer(key, e.target.value)} displayEmpty sx={{ fontSize: '1rem' }}>
          <MenuItem value=""><em>Choose...</em></MenuItem>
          {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
        </Select>
      </FormControl>
    )
  }

  const computeScore = () => {
    if (!data?.activity) return 0
    const a = data.activity
    let score = 0
    if (a.task_type === 'matching' && a.matching_items) {
      // answers should map description key to chosen item key
      Object.entries(a.matching_items).forEach(([key, _desc]) => {
        if (answers[key] && answers[key] === key) score += 1
      })
    } else if (a.task_type === 'fill_gaps' && Array.isArray(a.sentences)) {
      let idx = 0
      a.sentences.forEach(s => {
        (s.blanks||[]).forEach(correct => {
          const user = answers[`g_${idx}`]
          if (user && user === correct) score += 1
          idx += 1
        })
      })
    } else if (a.task_type === 'dialogue' && Array.isArray(a.dialogue)) {
      let idx = 0
      a.dialogue.forEach(line => {
        if (line.type === 'user_input') {
          (line.blanks||[]).forEach(correct => {
            const user = answers[`d_${idx}`]
            if (user && user === correct) score += 1
            idx += 1
          })
        }
      })
    } else if (a.task_type === 'listening_matching' && a.matching_items) {
      // Same scoring as matching
      Object.entries(a.matching_items).forEach(([key, _desc]) => {
        if (answers[key] && answers[key] === key) score += 1
      })
    } else if (a.task_type === 'dialogue_completion' && Array.isArray(a.dialogue)) {
      // Same scoring as dialogue
      let idx = 0
      a.dialogue.forEach(line => {
        if (line.type === 'user_input') {
          (line.blanks||[]).forEach(correct => {
            const user = answers[`d_${idx}`]
            if (user && user === correct) score += 1
            idx += 1
          })
        }
      })
    } else if (a.task_type === 'sentence_expansion' && Array.isArray(a.expansion_exercises)) {
      let idx = 0
      a.expansion_exercises.forEach(ex => {
        (ex.blanks||[]).forEach(correct => {
          const user = answers[`g_${idx}`]
          if (user && user === correct) score += 1
          idx += 1
        })
      })
    } else if (a.task_type === 'cultural_research' && Array.isArray(a.research_prompts)) {
      let idx = 0
      a.research_prompts.forEach(prompt => {
        (prompt.blanks||[]).forEach(correct => {
          const user = answers[`g_${idx}`]
          if (user && user === correct) score += 1
          idx += 1
        })
      })
    } else if (a.task_type === 'team_planning' && Array.isArray(a.planning_template)) {
      let idx = 0
      a.planning_template.forEach(template => {
        (template.blanks||[]).forEach(correct => {
          const user = answers[`g_${idx}`]
          if (user && user === correct) score += 1
          idx += 1
        })
      })
    } else if (a.task_type === 'negotiation_roleplay' && Array.isArray(a.negotiation_dialogue || a.dialogue)) {
      // negotiation_roleplay uses dialogue format
      let idx = 0
      const dialogueArray = a.negotiation_dialogue || a.dialogue
      dialogueArray.forEach(line => {
        if (line.type === 'user_input') {
          (line.blanks||[]).forEach(correct => {
            const user = answers[`d_${idx}`]
            if (user && user === correct) score += 1
            idx += 1
          })
        }
      })
    } else if ((a.task_type === 'assignment_report' || a.task_type === 'cultural_reflection' ||
                a.task_type === 'event_proposal' || a.task_type === 'story_writing' ||
                a.task_type === 'proposal_writing' || a.task_type === 'listening_expansion' ||
                a.task_type === 'priority_planning' || a.task_type === 'strategic_proposal' ||
                a.task_type === 'analysis_report') &&
               (Array.isArray(a.report_template) || Array.isArray(a.reflection_prompts) ||
                Array.isArray(a.proposal_framework) || Array.isArray(a.story_template) ||
                Array.isArray(a.story_framework) || Array.isArray(a.writing_prompts) ||
                Array.isArray(a.expansion_exercises) || Array.isArray(a.priority_template) ||
                Array.isArray(a.planning_items) || Array.isArray(a.strategic_template) ||
                Array.isArray(a.proposal_template) || Array.isArray(a.analysis_template))) {
      let idx = 0
      const items = a.report_template || a.reflection_prompts || a.proposal_framework ||
                    a.story_template || a.story_framework || a.writing_prompts ||
                    a.expansion_exercises || a.priority_template || a.planning_items ||
                    a.strategic_template || a.proposal_template || a.analysis_template
      items.forEach(item => {
        (item.blanks||[]).forEach(correct => {
          const user = answers[`g_${idx}`]
          if (user && user === correct) score += 1
          idx += 1
        })
      })
    } else {
      // generic freeform fallback (count any non-empty as 1)
      Object.values(answers).forEach(v => { if (v) score += 1 })
    }
    return score
  }

  const onSubmit = async () => {
    if (!data?.activity) return
    setSubmitting(true)
    try {
      const score = computeScore()
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
      
      // Store result for later navigation
      window.lastRemedialResult = res
      
      // Get character-style feedback
      try {
        const fbRes = await fetch('/api/phase2/remedial/feedback', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ step_id: data.step_id, level: data.level, activity_id: data.activity.id, score })
        })
        const fb = await fbRes.json()
        setFeedback({
          title: res.activity_passed ? '🎉 Great Job!' : '💪 Keep Practicing!',
          message: fb.feedback || res.message,
          success: res.activity_passed,
          score: score,
          threshold: data.activity?.success_threshold || 6
        })
        setShowFeedback(true)
      } catch (fbErr) {
        console.warn('Failed to get feedback:', fbErr)
        setFeedback({
          title: res.activity_passed ? '🎉 Great Job!' : '💪 Keep Practicing!',
          message: res.message,
          success: res.activity_passed,
          score: score,
          threshold: data.activity?.success_threshold || 6
        })
        setShowFeedback(true)
      }
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

  // TEMPORARILY DISABLED - Allow pasting for testing
  const onPaste = (e) => { /* e.preventDefault(); setPasteWarn(true) */ }
  const onKeyDown = (e) => {
    // if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') { e.preventDefault(); setPasteWarn(true) }
  }

  const speak = (text) => {
    if (!text) return
    try {
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.9; u.pitch = 1; u.lang = 'en-US'
      window.speechSynthesis.speak(u)
    } catch (err) {
      console.warn('Speech synthesis failed:', err)
    }
  }

  const handleFeedbackClose = (proceed = false) => {
    setShowFeedback(false)

    if (proceed && feedback) {
      // Handle navigation based on the last submission result
      const lastResult = window.lastRemedialResult
      if (lastResult) {
        if (lastResult.remedial_complete) {
          navigate(`/phase2/step/${data.step_id}`)
        } else if ((lastResult.next_action === 'next_remedial' || lastResult.next_action === 'level_switch') && lastResult.next_url) {
          // Convert classic URL to SPA route
          try {
            const u = new URL(lastResult.next_url, window.location.origin)
            const segs = u.pathname.split('/').filter(Boolean)
            // URL format: /app/phase2/remedial/step_id/level?activity=index
            // segs: [app, phase2, remedial, step_id, level]
            const step = segs[3]  // step_id
            const lvl = segs[4]   // level
            const idx = u.searchParams.get('activity')
            navigate(`/phase2/remedial/${step}/${lvl}${idx ? `?activity=${idx}` : ''}`)
          } catch {
            load() // Fallback reload
          }
        } else if (lastResult.next_action === 'return_to_step') {
          navigate(`/phase2/step/${data.step_id}`)
        } else {
          load() // Reload for retry or other cases
        }
      }
    }

    setFeedback(null)
  }

  if (loading) return <Box sx={{ p: 3 }}><LinearProgress /></Box>
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>
  if (!data) return null

  const a = data.activity

  return (
    <Box onPaste={onPaste} onKeyDown={onKeyDown} onContextMenu={(e)=>e.preventDefault()}>
      <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" gutterBottom>Practice Activities</Typography>
        <Typography color="text.secondary">Build your skills step by step</Typography>
        <Stack direction={{ xs:'column', sm:'row' }} spacing={1} sx={{ mt: 2 }}>
          <Chip label={`Activity ${data.current_index + 1} of ${data.total}`} />
          <Chip label={`${data.level} Level Practice`} />
        </Stack>
        {/* Navigation across activities (completed and current) */}
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
          {Array.from({ length: data.total }).map((_, i) => (
            <Button key={i}
              size="small"
              variant={i === data.current_index ? 'contained' : ((data.completed_indices||[]).includes(i) ? 'outlined' : 'text')}
              onClick={() => navigate(`/phase2/remedial/${data.step_id}/${data.level}?activity=${i}`)}
            >
              {i+1}
            </Button>
          ))}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">{a.title}</Typography>
          
          {a.speaker && (
            <CharacterMessage 
              speaker={a.speaker} 
              message={a.instruction}
              showRole={true}
            />
          )}
          
          {!a.speaker && (
            <Typography color="text.secondary">{a.instruction}</Typography>
          )}
          {a.audio_text && (
            <Stack direction="row" spacing={1}>
              <Button onClick={()=>speak(a.audio_text)}>Play Audio</Button>
            </Stack>
          )}

          {/* Task renderers */}
          {a.task_type === 'matching' && a.matching_items && (
            <>
              <ArrowMatching
              items={a.word_bank?.length ? a.word_bank : Object.keys(a.matching_items)}
              descriptions={a.matching_items}
              answers={answers}
              onChange={setAnswer}
              reverse={(data.current_index||0) === 0}
            />
            </>
          )}

          {a.task_type === 'fill_gaps' && Array.isArray(a.sentences) && (
            <Stack spacing={2}>
              {a.sentences.map((s, si) => {
                let textParts = s.text.split('__________')
                return (
                  <Paper key={si} sx={{ p: 2 }} variant="outlined">
                    <Typography variant="body2" sx={{ mb: 2 }}>Sentence {si+1}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
                      {textParts.map((part, pi) => (
                        <React.Fragment key={pi}>
                          <Typography component="span" sx={{ fontSize: '1.1rem' }}>{part}</Typography>
                          {pi < textParts.length - 1 && (
                            (() => {
                              const idx = s.blanks.slice(0,pi).length + a.sentences.slice(0,si).reduce((acc, cur)=>acc+(cur.blanks?cur.blanks.length:0), 0)
                              const key = `g_${idx}`
                              // Use per-blank choices if available, otherwise fall back to global word_bank
                              const options = (s.choices && s.choices[pi]) ? s.choices[pi] : (a.word_bank||[])
                              return (
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                  <Select
                                    value={answers[key]||''}
                                    onChange={e=>setAnswer(key, e.target.value)}
                                    displayEmpty
                                    sx={{ fontSize: '1rem' }}
                                  >
                                    <MenuItem value=""><em>Choose...</em></MenuItem>
                                    {options.map(opt => (
                                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )
                            })()
                          )}
                        </React.Fragment>
                      ))}
                    </Box>
                  </Paper>
                )
              })}
            </Stack>
          )}

          {a.task_type === 'dialogue' && Array.isArray(a.dialogue) && (
            <Stack spacing={2}>
              {a.dialogue.map((line, li) => (
                <Paper key={li} sx={{ p: 2 }} variant="outlined">
                  {line.type === 'character' ? (
                    <CharacterMessage 
                      speaker={line.speaker} 
                      message={line.text}
                    />
                  ) : (
                    <>
                      <Typography variant="body2" sx={{ mb: 2 }}><strong>Your response:</strong></Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
                        {(() => {
                          let textParts = line.text.split('__________')
                          return textParts.map((part, pi) => (
                            <React.Fragment key={pi}>
                              <Typography component="span" sx={{ fontSize: '1.1rem', fontStyle: 'italic' }}>{part}</Typography>
                              {pi < textParts.length - 1 && (
                                (() => {
                                  const idx = a.dialogue.slice(0,li).reduce((acc, cur)=> acc + (cur.type==='user_input' && cur.blanks ? cur.blanks.length : 0), 0) + pi
                                  const key = `d_${idx}`
                                  return (
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                      <Select 
                                        value={answers[key]||''} 
                                        onChange={e=>setAnswer(key, e.target.value)}
                                        displayEmpty
                                        sx={{ fontSize: '1rem' }}
                                      >
                                        <MenuItem value=""><em>Choose...</em></MenuItem>
                                        {(a.word_bank||[]).map(opt => (
                                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  )
                                })()
                              )}
                            </React.Fragment>
                          ))
                        })()}
                      </Box>
                    </>
                  )}
                </Paper>
              ))}
            </Stack>
          )}

          {/* Sentence Expansion */}
          {a.task_type === 'sentence_expansion' && Array.isArray(a.expansion_exercises) && (
            <Stack spacing={2}>
              {a.expansion_exercises.map((ex, ei) => {
                let textParts = ex.text.split('__________')
                return (
                  <Paper key={ei} sx={{ p: 2 }} variant="outlined">
                    <Typography variant="body2" sx={{ mb: 2 }}>Exercise {ei+1}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
                      {textParts.map((part, pi) => (
                        <React.Fragment key={pi}>
                          <Typography component="span" sx={{ fontSize: '1.1rem' }}>{part}</Typography>
                          {pi < textParts.length - 1 && (
                            (() => {
                              const idx = a.expansion_exercises.slice(0,ei).reduce((acc, cur)=>acc+(cur.blanks?cur.blanks.length:0), 0) + pi
                              const key = `g_${idx}`
                              const options = (ex.choices && ex.choices[pi]) ? ex.choices[pi] : (a.word_bank||[])
                              return renderInputField(key, options)
                            })()
                          )}
                        </React.Fragment>
                      ))}
                    </Box>
                  </Paper>
                )
              })}
            </Stack>
          )}

          {/* Cultural Research */}
          {a.task_type === 'cultural_research' && Array.isArray(a.research_prompts) && (
            <Stack spacing={2}>
              {a.research_prompts.map((prompt, pi) => {
                let textParts = prompt.text.split('__________')
                return (
                  <Paper key={pi} sx={{ p: 2 }} variant="outlined">
                    <Typography variant="body2" sx={{ mb: 2 }}>Research Question {pi+1}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
                      {textParts.map((part, ti) => (
                        <React.Fragment key={ti}>
                          <Typography component="span" sx={{ fontSize: '1.1rem' }}>{part}</Typography>
                          {ti < textParts.length - 1 && (
                            (() => {
                              const idx = a.research_prompts.slice(0,pi).reduce((acc, cur)=>acc+(cur.blanks?cur.blanks.length:0), 0) + ti
                              const key = `g_${idx}`
                              const options = (prompt.choices && prompt.choices[ti]) ? prompt.choices[ti] : (a.word_bank||[])
                              return (
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                  <Select value={answers[key]||''} onChange={e=>setAnswer(key, e.target.value)} displayEmpty sx={{ fontSize: '1rem' }}>
                                    <MenuItem value=""><em>Choose...</em></MenuItem>
                                    {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                  </Select>
                                </FormControl>
                              )
                            })()
                          )}
                        </React.Fragment>
                      ))}
                    </Box>
                  </Paper>
                )
              })}
            </Stack>
          )}

          {/* Team Planning */}
          {a.task_type === 'team_planning' && Array.isArray(a.planning_template) && (
            <Stack spacing={2}>
              {a.planning_template.map((template, ti) => {
                let textParts = template.text.split('__________')
                return (
                  <Paper key={ti} sx={{ p: 2 }} variant="outlined">
                    <Typography variant="body2" sx={{ mb: 2 }}>Planning Item {ti+1}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
                      {textParts.map((part, pi) => (
                        <React.Fragment key={pi}>
                          <Typography component="span" sx={{ fontSize: '1.1rem' }}>{part}</Typography>
                          {pi < textParts.length - 1 && (
                            (() => {
                              const idx = a.planning_template.slice(0,ti).reduce((acc, cur)=>acc+(cur.blanks?cur.blanks.length:0), 0) + pi
                              const key = `g_${idx}`
                              const options = (template.choices && template.choices[pi]) ? template.choices[pi] : (a.word_bank||[])
                              return (
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                  <Select value={answers[key]||''} onChange={e=>setAnswer(key, e.target.value)} displayEmpty sx={{ fontSize: '1rem' }}>
                                    <MenuItem value=""><em>Choose...</em></MenuItem>
                                    {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                  </Select>
                                </FormControl>
                              )
                            })()
                          )}
                        </React.Fragment>
                      ))}
                    </Box>
                  </Paper>
                )
              })}
            </Stack>
          )}

          {/* Listening Matching */}
          {a.task_type === 'listening_matching' && a.matching_items && (
            <>
              {a.audio_content && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light' }} variant="outlined">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="contained" onClick={()=>speak(a.audio_content)}>🔊 Play Audio</Button>
                    <Typography variant="body2" color="text.secondary">Listen carefully and then match the items below</Typography>
                  </Stack>
                </Paper>
              )}
              <ArrowMatching
                items={a.word_bank?.length ? a.word_bank : Object.keys(a.matching_items)}
                descriptions={a.matching_items}
                answers={answers}
                onChange={setAnswer}
                reverse={false}
              />
            </>
          )}

          {/* Dialogue Completion */}
          {a.task_type === 'dialogue_completion' && Array.isArray(a.dialogue) && (
            <>
              {a.audio_content && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light' }} variant="outlined">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="contained" onClick={()=>speak(a.audio_content)}>🔊 Play Audio</Button>
                    <Typography variant="body2" color="text.secondary">Listen to the conversation and complete the dialogue</Typography>
                  </Stack>
                </Paper>
              )}
              <Stack spacing={2}>
                {a.dialogue.map((line, li) => (
                  <Paper key={li} sx={{ p: 2 }} variant="outlined">
                    {line.type === 'character' ? (
                      <CharacterMessage
                        speaker={line.speaker}
                        message={line.text}
                      />
                    ) : (
                      <>
                        <Typography variant="body2" sx={{ mb: 2 }}><strong>Your response:</strong></Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
                          {(() => {
                            let textParts = line.text.split('__________')
                            return textParts.map((part, pi) => (
                              <React.Fragment key={pi}>
                                <Typography component="span" sx={{ fontSize: '1.1rem', fontStyle: 'italic' }}>{part}</Typography>
                                {pi < textParts.length - 1 && (
                                  (() => {
                                    const idx = a.dialogue.slice(0,li).reduce((acc, cur)=> acc + (cur.type==='user_input' && cur.blanks ? cur.blanks.length : 0), 0) + pi
                                    const key = `d_${idx}`
                                    const options = (line.choices && line.choices[pi]) ? line.choices[pi] : (a.word_bank||[])
                                    return (
                                      <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <Select value={answers[key]||''} onChange={e=>setAnswer(key, e.target.value)} displayEmpty sx={{ fontSize: '1rem' }}>
                                          <MenuItem value=""><em>Choose...</em></MenuItem>
                                          {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                        </Select>
                                      </FormControl>
                                    )
                                  })()
                                )}
                              </React.Fragment>
                            ))
                          })()}
                        </Box>
                      </>
                    )}
                  </Paper>
                ))}
              </Stack>
            </>
          )}

          {/* Negotiation Roleplay (uses dialogue format) */}
          {a.task_type === 'negotiation_roleplay' && Array.isArray(a.negotiation_dialogue || a.dialogue) && (
            <Stack spacing={2}>
              {(a.negotiation_dialogue || a.dialogue).map((line, li) => (
                <Paper key={li} sx={{ p: 2 }} variant="outlined">
                  {line.type === 'character' ? (
                    <CharacterMessage speaker={line.speaker} message={line.text} />
                  ) : (
                    <>
                      <Typography variant="body2" sx={{ mb: 2 }}><strong>Your response:</strong></Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
                        {(() => {
                          let textParts = line.text.split('__________')
                          return textParts.map((part, pi) => (
                            <React.Fragment key={pi}>
                              <Typography component="span" sx={{ fontSize: '1.1rem', fontStyle: 'italic' }}>{part}</Typography>
                              {pi < textParts.length - 1 && (
                                (() => {
                                  const dialogueArray = a.negotiation_dialogue || a.dialogue
                                  const idx = dialogueArray.slice(0,li).reduce((acc, cur)=> acc + (cur.type==='user_input' && cur.blanks ? cur.blanks.length : 0), 0) + pi
                                  const key = `d_${idx}`
                                  const options = (line.choices && line.choices[pi]) ? line.choices[pi] : (a.word_bank||[])
                                  return (
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                      <Select value={answers[key]||''} onChange={e=>setAnswer(key, e.target.value)} displayEmpty sx={{ fontSize: '1rem' }}>
                                        <MenuItem value=""><em>Choose...</em></MenuItem>
                                        {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                      </Select>
                                    </FormControl>
                                  )
                                })()
                              )}
                            </React.Fragment>
                          ))
                        })()}
                      </Box>
                    </>
                  )}
                </Paper>
              ))}
            </Stack>
          )}

          {/* Generic renderer for all other template-based task types */}
          {(() => {
            const taskTypeMap = {
              'assignment_report': { array: a.report_template, label: 'Report Item' },
              'cultural_reflection': { array: a.reflection_prompts, label: 'Reflection' },
              'event_proposal': { array: a.proposal_framework, label: 'Proposal Item' },
              'story_writing': { array: a.story_template || a.story_framework, label: 'Story Element' },
              'proposal_writing': { array: a.proposal_template || a.proposal_framework || a.writing_prompts, label: 'Proposal Element' },
              'listening_expansion': { array: a.expansion_exercises, label: 'Listening Item', hasAudio: true },
              'priority_planning': { array: a.priority_template || a.planning_items, label: 'Priority Item' },
              'strategic_proposal': { array: a.strategic_template || a.proposal_framework, label: 'Strategic Item' },
              'analysis_report': { array: a.analysis_template || a.report_template, label: 'Analysis Item' }
            }

            const config = taskTypeMap[a.task_type]
            if (config && Array.isArray(config.array)) {
              return (
                <>
                  {config.hasAudio && a.audio_content && (
                    <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light' }} variant="outlined">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Button variant="contained" onClick={()=>speak(a.audio_content)}>🔊 Play Audio</Button>
                        <Typography variant="body2" color="text.secondary">Listen carefully and complete the exercises</Typography>
                      </Stack>
                    </Paper>
                  )}
                  <Stack spacing={2}>
                    {config.array.map((item, ii) => {
                    let textParts = item.text.split('__________')
                    return (
                      <Paper key={ii} sx={{ p: 2 }} variant="outlined">
                        <Typography variant="body2" sx={{ mb: 2 }}>{config.label} {ii+1}</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
                          {textParts.map((part, pi) => (
                            <React.Fragment key={pi}>
                              <Typography component="span" sx={{ fontSize: '1.1rem' }}>{part}</Typography>
                              {pi < textParts.length - 1 && (
                                (() => {
                                  const idx = config.array.slice(0,ii).reduce((acc, cur)=>acc+(cur.blanks?cur.blanks.length:0), 0) + pi
                                  const key = `g_${idx}`
                                  const options = (item.choices && item.choices[pi]) ? item.choices[pi] : (a.word_bank||[])

                                  // B1/B2 levels should use text input for more free expression
                                  // A1/A2 use dropdowns for structured practice
                                  const useTextInput = data.level === 'B1' || data.level === 'B2'

                                  if (useTextInput) {
                                    return (
                                      <TextField
                                        size="small"
                                        value={answers[key]||''}
                                        onChange={e=>setAnswer(key, e.target.value)}
                                        placeholder="Type here..."
                                        sx={{ minWidth: 150 }}
                                      />
                                    )
                                  }

                                  return (
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                      <Select value={answers[key]||''} onChange={e=>setAnswer(key, e.target.value)} displayEmpty sx={{ fontSize: '1rem' }}>
                                        <MenuItem value=""><em>Choose...</em></MenuItem>
                                        {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                      </Select>
                                    </FormControl>
                                  )
                                })()
                              )}
                            </React.Fragment>
                          ))}
                        </Box>
                      </Paper>
                    )
                  })}
                  </Stack>
                </>
              )
            }
            return null
          })()}

          {/* Fallback message for unsupported task types */}
          {!['matching', 'fill_gaps', 'dialogue', 'sentence_expansion', 'cultural_research', 'team_planning',
              'listening_matching', 'dialogue_completion', 'negotiation_roleplay', 'assignment_report',
              'cultural_reflection', 'event_proposal', 'story_writing', 'proposal_writing',
              'listening_expansion', 'priority_planning', 'strategic_proposal', 'analysis_report'].includes(a.task_type) && (
            <Paper sx={{ p: 3, bgcolor: 'warning.light' }} variant="outlined">
              <Typography variant="h6" color="warning.dark">Task Type Not Supported</Typography>
              <Typography>Task type "{a.task_type}" is not yet implemented in the frontend.</Typography>
              <Typography variant="caption">Activity ID: {a.id}</Typography>
            </Paper>
          )}

          <Stack direction={{ xs:'column', sm:'row' }} spacing={2} sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              disabled={submitting} 
              onClick={onSubmit}
              startIcon={submitting ? <CircularProgress size={20} /> : null}
            >
              {submitting ? 'Submitting...' : 'Submit & Continue'}
            </Button>
            <Button variant="outlined" onClick={()=>navigate(`/phase2/step/${data.step_id}`)}>Back to Main Activity</Button>
            <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
              <Button size="small" variant="outlined"
                disabled={data.current_index <= 0}
                onClick={() => navigate(`/phase2/remedial/${data.step_id}/${data.level}?activity=${Math.max(0, data.current_index-1)}`)}
              >Prev</Button>
              <Button size="small" variant="outlined"
                disabled={data.current_index >= (data.total-1)}
                onClick={() => navigate(`/phase2/remedial/${data.step_id}/${data.level}?activity=${Math.min(data.total-1, data.current_index+1)}`)}
              >Next</Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
      {/* Feedback Dialog */}
      <Dialog 
        open={showFeedback} 
        onClose={() => handleFeedbackClose(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          {feedback?.title}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" paragraph>
            {feedback?.message}
          </Typography>
          {feedback?.score !== undefined && (
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

      {/* Paste Warning Snackbar */}
      <Snackbar
        open={pasteWarn}
        autoHideDuration={2500}
        onClose={()=>setPasteWarn(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" variant="filled" onClose={()=>setPasteWarn(false)}>
          Pasting is disabled. Please use your own words.
        </Alert>
      </Snackbar>
    </Box>
  )
}

function ArrowMatching({ items, descriptions, answers, onChange, reverse=false }) {
  const containerRef = useRef(null)
  const leftRefs = useRef({})
  const rightRefs = useRef({})
  const [selected, setSelected] = useState(null)
  const [dragPreview, setDragPreview] = useState(null)
  
  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
  
  // Create shuffled items on component mount
  const [shuffledItems] = useState(() => shuffleArray(items))


  // Remove any mapping to the same item to keep one-to-one
  const connect = (descKey, itemKey) => {
    // Clear previous assignment of this item
    Object.entries(answers||{}).forEach(([dk, ik]) => {
      if (ik === itemKey && dk !== descKey) onChange(dk, '')
    })
    onChange(descKey, itemKey)
  }


  // Start drag from item chip
  const startDrag = (itemKey, e) => {
    console.log('startDrag called with itemKey:', itemKey)
    e.preventDefault()
    e.stopPropagation()
    setSelected(itemKey)
    setDragPreview({ 
      x: e.clientX + 10, 
      y: e.clientY - 20, 
      text: itemKey 
    })
    console.log('startDrag for:', itemKey)

    const onMove = (ev) => {
      setDragPreview({ 
        x: ev.clientX + 10, 
        y: ev.clientY - 20, 
        text: itemKey 
      })
    }
    const onUp = (ev) => {
      console.log('onUp called at:', ev.clientX, ev.clientY)
      // Hit test descriptions
      const dx = ev.clientX
      const dy = ev.clientY
      let hit = null
      Object.entries(rightRefs.current).forEach(([dkey, el]) => {
        if (el) {
          const rr = el.getBoundingClientRect()
          console.log('Testing hit for', dkey, 'rect:', rr)
          if (dx >= rr.left && dx <= rr.right && dy >= rr.top && dy <= rr.bottom) {
            hit = dkey
            console.log('HIT:', dkey)
          }
        }
      })
      console.log('Final hit:', hit, 'itemKey:', itemKey)
      if (hit && itemKey) {
        console.log('Connecting:', hit, '->', itemKey)
        connect(hit, itemKey)
      }
      setDragPreview(null)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const used = new Set(Object.values(answers||{}).filter(Boolean))

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      

      {/* Drag preview */}
      {dragPreview && (
        <Box
          sx={{
            position: 'fixed',
            left: dragPreview.x,
            top: dragPreview.y,
            zIndex: 9999,
            padding: '4px 8px',
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {dragPreview.text}
        </Box>
      )}

      <Grid container spacing={3}>
        {reverse ? (
          <>
            {/* Descriptions on the left */}
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Descriptions</Typography>
              <Stack spacing={1}>
                {Object.entries(descriptions).map(([dkey, desc]) => (
                  <Paper key={dkey} variant="outlined" sx={{ p: 1.5 }} ref={(el)=>{ if (el) rightRefs.current[dkey]=el }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} md={7}>
                        <Typography variant="body2">{desc}</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                          {answers[dkey] ? (
                            <>
                              <Chip label={answers[dkey]} />
                              <Button size="small" onClick={()=> onChange(dkey, '')}>Clear</Button>
                            </>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Drag from an item to connect</Typography>
                      )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </Grid>

            {/* Items on the right */}
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Items</Typography>
              <Stack spacing={1} sx={{ p: 1, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                {shuffledItems.map(k => (
                  <div 
                    key={k} 
                    ref={(el)=>{ if (el) leftRefs.current[k]=el }}
                    onMouseDown={(ev)=> startDrag(k, ev)}
                    onClick={()=> setSelected(k)}
                    style={{ 
                      cursor: 'grab', 
                      padding: '8px 12px', 
                      background: selected===k ? '#1976d2' : (used.has(k) ? '#bdbdbd' : '#f5f5f5'),
                      color: selected===k ? 'white' : (used.has(k) ? '#666' : '#333'),
                      margin: '4px 0',
                      borderRadius: '8px',
                      border: `2px solid ${selected===k ? '#1976d2' : (used.has(k) ? '#999' : '#ddd')}`,
                      transition: 'all 0.2s ease',
                      userSelect: 'none'
                    }}
                  >
                    {k}
                  </div>
                ))}
              </Stack>
            </Grid>
          </>
        ) : (
          <>
            {/* Items on the left */}
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Items</Typography>
              <Stack spacing={1} sx={{ p: 1, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                {shuffledItems.map(k => (
                  <div 
                    key={k} 
                    ref={(el)=>{ if (el) leftRefs.current[k]=el }}
                    onMouseDown={(ev)=> startDrag(k, ev)}
                    onClick={()=> setSelected(k)}
                    style={{ 
                      cursor: 'grab', 
                      padding: '8px 12px', 
                      background: selected===k ? '#1976d2' : (used.has(k) ? '#bdbdbd' : '#f5f5f5'),
                      color: selected===k ? 'white' : (used.has(k) ? '#666' : '#333'),
                      margin: '4px 0',
                      borderRadius: '8px',
                      border: `2px solid ${selected===k ? '#1976d2' : (used.has(k) ? '#999' : '#ddd')}`,
                      transition: 'all 0.2s ease',
                      userSelect: 'none'
                    }}
                  >
                    {k}
                  </div>
                ))}
              </Stack>
            </Grid>

            {/* Descriptions on the right */}
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Descriptions</Typography>
              <Stack spacing={1}>
                {Object.entries(descriptions).map(([dkey, desc]) => (
                  <Paper key={dkey} variant="outlined" sx={{ p: 1.5 }} ref={(el)=>{ if (el) rightRefs.current[dkey]=el }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} md={7}>
                        <Typography variant="body2">{desc}</Typography>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                          {answers[dkey] ? (
                            <>
                              <Chip label={answers[dkey]} />
                              <Button size="small" onClick={()=> onChange(dkey, '')}>Clear</Button>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary">Drag from an item to connect</Typography>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}
