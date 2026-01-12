import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Stack, Button, TextField, Chip, LinearProgress, Snackbar, Alert } from '@mui/material'
import { CharacterMessage } from '../components/Avatar.jsx'

export default function Phase2Step() {
  const { stepId } = useParams()
  const navigate = useNavigate()
  const [meta, setMeta] = useState(null)
  const [progress, setProgress] = useState(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [pasteWarn, setPasteWarn] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [mRes, pRes] = await Promise.all([
        fetch(`/api/phase2/step?step_id=${encodeURIComponent(stepId)}`, { credentials: 'include' }),
        fetch(`/api/phase2/get-step-progress?step_id=${encodeURIComponent(stepId)}`, { credentials: 'include' })
      ])
      if (!mRes.ok) throw new Error('Failed to load step data')
      if (!pRes.ok) throw new Error('Failed to load progress')
      const m = await mRes.json()
      const p = await pRes.json()
      setMeta(m)
      setProgress(p)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [stepId])

  const currentItem = useMemo(() => {
    if (!meta || !progress) return null
    const completedIds = new Set((progress.item_scores||[]).filter(i=>i.completed).map(i=>i.id))
    const next = (meta.action_items||[]).find(it => !completedIds.has(it.id))
    return next || null
  }, [meta, progress])

  // Auto-check completion when all items are done
  useEffect(() => {
    if (meta && progress && !currentItem && progress.completed_items >= progress.total_items) {
      // All items completed but still on step page - trigger completion check
      const checkCompletion = async () => {
        try {
          const c = await fetch('/api/phase2/check-step-completion', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            credentials: 'include',
            body: JSON.stringify({ step_id: stepId })
          })
          const cData = await c.json()
          if (c.ok && cData.step_complete) {
            // Handle different completion scenarios
            if (cData.needs_remedial) {
              navigate(`/phase2/remedial/${stepId}/${cData.user_level}`)
            } else if (cData.next_action === "next_step" && cData.next_url) {
              navigate(cData.next_url)
            } else if (cData.next_action === "phase2_complete") {
              navigate(`/phase2/complete`)
            } else {
              navigate(`/phase2/step/${stepId}/results`)
            }
          }
        } catch (e) {
          console.error('Auto completion check failed:', e)
        }
      }
      checkCompletion()
    }
  }, [meta, progress, currentItem, stepId, navigate])

  const submit = async (e) => {
    e.preventDefault()
    if (!currentItem) return
    setSubmitting(true)
    try {
      const r = await fetch('/api/phase2/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step_id: stepId, action_item_id: currentItem.id, response })
      })
      const data = await r.json()
      if (!r.ok || data.error) throw new Error(data.error || 'Submit failed')
      setResponse('')
      // Check completion
      const c = await fetch('/api/phase2/check-step-completion', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ step_id: stepId })
      })
      const cData = await c.json()
      if (!c.ok) throw new Error('Failed to check completion')
      if (!cData.step_complete) {
        await load()
      } else {
        // Handle different completion scenarios
        if (cData.needs_remedial) {
          // Redirect to remedial activities
          navigate(`/phase2/remedial/${stepId}/${cData.user_level}`)
        } else if (cData.next_action === "next_step" && cData.next_url) {
          // Redirect to next step
          navigate(cData.next_url)
        } else if (cData.next_action === "phase2_complete") {
          // Phase 2 is complete
          navigate(`/phase2/complete`)
        } else {
          // Fallback to results page
          navigate(`/phase2/step/${stepId}/results`)
        }
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // TEMPORARILY DISABLED - Allow pasting for testing
  const onPaste = (e) => {
    // e.preventDefault()
    // setPasteWarn(true)
  }
  const onKeyDown = (e) => {
    // if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
    //   e.preventDefault()
    //   setPasteWarn(true)
    // }
  }

  if (loading) return <Box sx={{ p: 3 }}><LinearProgress /></Box>
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>
  if (!meta || !progress) return null

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" gutterBottom>{meta.title}</Typography>
        <Typography color="text.secondary">{meta.description}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{meta.scenario}</Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="overline" color="text.secondary">
          {currentItem ? `Item ${progress.completed_items + 1} of ${progress.total_items}` : `All ${progress.total_items} items completed`}
        </Typography>
        {currentItem ? (
          <>
            <CharacterMessage 
              speaker={currentItem.speaker} 
              message={currentItem.question}
              showRole={true}
            >
              {currentItem.instruction && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                  💡 {currentItem.instruction}
                </Typography>
              )}
            </CharacterMessage>
            <Box component="form" onSubmit={submit} noValidate>
              <TextField
                label="Your response"
                value={response}
                onChange={e=>setResponse(e.target.value)}
                required
                multiline minRows={4}
                fullWidth
                onPaste={onPaste}
                onKeyDown={onKeyDown}
                onContextMenu={(e)=>e.preventDefault()}
                sx={{ mt: 2 }}
              />
              <Stack direction={{ xs:'column', sm:'row' }} spacing={2} sx={{ mt: 2 }}>
                <Button type="submit" disabled={submitting || !response}>Submit</Button>
                <Chip label={`${progress.completed_items}/${progress.total_items} completed`} />
              </Stack>
            </Box>
          </>
        ) : (
          <Typography>Step complete. Checking next action…</Typography>
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
      </Paper>
    </Box>
  )
}
