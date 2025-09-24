import React, { useEffect, useMemo, useState } from 'react'
import { Box, Paper, Typography, Stack, Button, LinearProgress, Chip, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, TextField, Alert, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SchoolIcon from '@mui/icons-material/School'
import TimelineIcon from '@mui/icons-material/Timeline'
import HelpIcon from '@mui/icons-material/Help'
import InfoIcon from '@mui/icons-material/Info'

export default function Results() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [challenge, setChallenge] = useState(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [coaching, setCoaching] = useState({})

  // CEFR Level Explanations with real-world examples
  const cefrExplanations = {
    A1: {
      name: "Beginner",
      description: "Can understand and use familiar everyday expressions and very basic phrases",
      realWorld: "Can introduce yourself, order food, ask for directions",
      workplace: "Can handle simple greetings and basic personal information"
    },
    A2: {
      name: "Elementary", 
      description: "Can communicate in simple routine tasks requiring direct exchange of information",
      realWorld: "Can handle shopping, make appointments, describe family and background",
      workplace: "Can participate in simple work conversations and understand basic instructions"
    },
    B1: {
      name: "Intermediate",
      description: "Can deal with most situations likely to arise while traveling and working",
      realWorld: "Can handle travel arrangements, express opinions, describe experiences",
      workplace: "Can participate in meetings, handle customer service, write simple reports"
    },
    B2: {
      name: "Upper-Intermediate",
      description: "Can interact fluently and spontaneously with native speakers",
      realWorld: "Can debate current events, understand complex texts, give detailed explanations", 
      workplace: "Can lead meetings, present ideas clearly, handle complex negotiations"
    },
    C1: {
      name: "Advanced",
      description: "Can express ideas fluently and spontaneously without much searching for expressions",
      realWorld: "Can understand academic texts, express subtle meanings, use language flexibly",
      workplace: "Can lead strategic discussions, write complex documents, mentor others"
    },
    C2: {
      name: "Proficient",
      description: "Can understand virtually everything heard or read with ease",
      realWorld: "Near-native fluency in all contexts",
      workplace: "Can handle any professional situation with native-like proficiency"
    }
  }

  useEffect(() => {
    fetch('/api/results', { credentials: 'include' })
      .then(async r => { if (!r.ok) throw new Error('Failed to load results'); return r.json() })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!data) return
    fetch(`/api/next-challenge?level=${encodeURIComponent(data.overall_level)}`, { credentials: 'include' })
      .then(async r => r.json())
      .then(setChallenge)
      .catch(() => {})
  }, [data])

  // Brief celebration effect when results load
  useEffect(() => {
    if (!data) return
    let rafId
    const canvas = document.createElement('canvas')
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '1000'
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    const pieces = []
    const n = 120
    const colors = ['#0B1F3B', '#1d3557', '#a8dadc', '#f1faee', '#e63946']
    for (let i = 0; i < n; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random()*100,
        r: Math.random() * 8 + 4,
        rot: Math.random()*360,
        v: Math.random() * 2 + 1.2,
        col: colors[Math.floor(Math.random()*colors.length)]
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pieces.forEach(p => {
        p.y += p.v
        p.rot += 4
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.fillStyle = p.col
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r)
        ctx.restore()
        if (p.y > canvas.height + 20) {
          p.y = -20
          p.x = Math.random() * canvas.width
        }
      })
      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)

    const timer = setTimeout(() => {
      cancelAnimationFrame(rafId)
      canvas.remove()
    }, 4500)

    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timer)
      cancelAnimationFrame(rafId)
      canvas.remove()
    }
  }, [data])

  const getCoaching = async (idx) => {
    try {
      const r = data.responses[idx]
      if (!r) return
      const res = await fetch('/api/get-ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          question: r.question,
          response: r.response,
          speaker: r.speaker || 'Ms. Mabrouki',
          type: r.type
        })
      })
      const json = await res.json()
      setCoaching(prev => ({ ...prev, [idx]: json }))
    } catch (e) {
      setCoaching(prev => ({ ...prev, [idx]: { error: 'Could not fetch coaching' } }))
    }
  }

  if (loading) return <Box sx={{ p: 3 }}><LinearProgress /></Box>
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>
  if (!data) return null

  const levelToPct = (lv) => ({ A1: 20, A2: 40, B1: 60, B2: 80, C1: 100 }[lv] || 0)
  const skill = data.skill_levels || {}
  const progressLevels = data.progress_levels || []
  const aiWarn = data.ai_percentage > 50 ? 'warning' : (data.ai_percentage > 30 ? 'info' : 'success')

  return (
    <Box sx={{ p: { xs:1, md:2 } }}>
      <Paper elevation={0} sx={{ p: { xs:2, md:3 }, mb: 3, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={1} alignItems="center">
          <Typography variant="h4" gutterBottom>
            🎉 Great work, {data.player_name}!
          </Typography>
          <Typography color="text.secondary" maxWidth={720}>
            You finished the Cultural Event Planning orientation. Here is your level, skill breakdown, and personalized feedback to help you grow.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip icon={<SchoolIcon />} label="CEFR Assessment" />
            <Chip icon={<TimelineIcon />} label="Progress Summary" />
            <Chip icon={<EmojiEventsIcon />} label="Achievements" />
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
            <Stack spacing={2} alignItems="center">
              <Tooltip 
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {cefrExplanations[data.overall_level]?.name || 'CEFR Level'} ({data.overall_level})
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {cefrExplanations[data.overall_level]?.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      🌍 Real World: 
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, fontSize: '0.85rem' }}>
                      {cefrExplanations[data.overall_level]?.realWorld}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      💼 Workplace:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {cefrExplanations[data.overall_level]?.workplace}
                    </Typography>
                  </Box>
                }
                placement="top"
                arrow
              >
                <Box sx={{ 
                  width: 140, 
                  height: 140, 
                  borderRadius: '50%', 
                  display: 'grid', 
                  placeItems: 'center', 
                  bgcolor: 'background.default', 
                  border: '2px solid', 
                  borderColor: 'primary.main',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    transform: 'scale(1.02)'
                  }
                }}>
                  <Stack alignItems="center">
                    <Typography variant="h3">{data.overall_level}</Typography>
                    <Typography variant="subtitle2">{cefrExplanations[data.overall_level]?.name || String(data.overall_level).split('-')[0]}</Typography>
                  </Stack>
                </Box>
              </Tooltip>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h5">Your Language Level</Typography>
                <Tooltip title="Click the level badge above for detailed explanation">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography color="text.secondary" align="center">{data.level_description}</Typography>
              <Chip label={`${data.xp} XP Earned`} color="primary" />
            </Stack>
          </Paper>

          {/* CEFR Level Comparison */}
          <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon /> CEFR Level Comparison
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              See how your level compares to the European Framework standards
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(cefrExplanations).map(([level, info]) => {
                const isCurrentLevel = level === data.overall_level
                return (
                  <Grid item xs={12} sm={6} md={4} key={level}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        bgcolor: isCurrentLevel ? 'primary.50' : 'background.default',
                        border: isCurrentLevel ? '2px solid' : '1px solid',
                        borderColor: isCurrentLevel ? 'primary.main' : 'divider',
                        position: 'relative'
                      }}
                    >
                      {isCurrentLevel && (
                        <Chip 
                          label="Your Level" 
                          size="small" 
                          color="primary" 
                          sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }}
                        />
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 700, color: isCurrentLevel ? 'primary.main' : 'text.primary' }}>
                        {level}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        {info.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                        {info.workplace}
                      </Typography>
                    </Paper>
                  </Grid>
                )
              })}
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
            <Typography variant="h6" gutterBottom>Skills Breakdown</Typography>
            {!data.overall_level ? (
              <Typography color="text.secondary">Complete the assessment to see your skill breakdown.</Typography>
            ) : (
              [{label:'Vocabulary', key:'vocabulary', color:'success'},
               {label:'Grammar', key:'grammar', color:'info'},
               {label:'Fluency', key:'fluency', color:'warning'},
               {label:'Spelling', key:'spelling', color:'error'},
               {label:'Comprehension', key:'comprehension', color:'primary'}].map(s => (
                <Box key={s.key} sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{s.label}</Typography>
                    <Chip size="small" label={skill[s.key] || data.overall_level} />
                  </Stack>
                  <LinearProgress variant="determinate" sx={{ height: 10, borderRadius: 1, mt: 0.5 }} value={levelToPct(skill[s.key] || data.overall_level)} color={s.color} />
                </Box>
              ))
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
            <Typography variant="h6" gutterBottom>AI Usage Detection</Typography>
            <LinearProgress variant="determinate" sx={{ height: 14, borderRadius: 1 }} value={data.ai_percentage} color={aiWarn} />
            <Typography color="text.secondary" align="center" sx={{ mt: 1 }}>{data.ai_responses_count} out of {data.responses_length} responses detected as AI-generated</Typography>
            <Box sx={{ mt: 2 }}>
              {aiWarn === 'warning' && <Alert severity="warning">High AI usage detected. Try to respond with your own words.</Alert>}
              {aiWarn === 'info' && <Alert severity="info">Moderate AI usage detected. Personal responses promote better learning.</Alert>}
              {aiWarn === 'success' && <Alert severity="success">Great job on authentic, personal responses!</Alert>}
            </Box>
            {data.ai_responses_count > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">AI Detection Patterns</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {(data.responses||[]).filter(r => r.ai_generated && r.ai_score>0.5).map((r, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="body2"><strong>Question {r.step}:</strong> AI score: {Math.round(r.ai_score*100)}%</Typography>
                      {Array.isArray(r.ai_reasons) && r.ai_reasons.length>0 && (
                        <Typography variant="body2" color="text.secondary">• {(r.ai_reasons||[]).slice(0,2).join('; ')}</Typography>
                      )}
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
            <Typography variant="h6" gutterBottom>Achievements</Typography>
            <Grid container spacing={2}>
              {Object.entries(data.achievements||{}).map(([key, ach]) => {
                const unlocked = (data.achievements_earned||[]).includes(key)
                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Paper variant="outlined" sx={{ p: 2, opacity: unlocked ? 1 : 0.6 }}>
                      <Typography variant="subtitle1">{ach.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{ach.description}</Typography>
                      <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <Chip size="small" label={unlocked ? 'Unlocked' : 'Locked'} color={unlocked ? 'success' : 'default'} />
                      </Box>
                    </Paper>
                  </Grid>
                )
              })}
            </Grid>
          </Paper>

          <Paper 
            sx={{ 
              p: 4, 
              mb: 3, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }} 
            elevation={0}
          >
            {/* Background decoration */}
            <Box 
              sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
            
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              🚀 Ready for Advanced Practice?
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, opacity: 0.95 }}>
              Team Collaboration Scenarios
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
              Practice real workplace teamwork situations with interactive scenarios designed 
              to improve your collaboration and communication skills in professional settings.
            </Typography>
            
            {/* What You'll Practice */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                🎯 What You'll Practice:
              </Typography>
              <Grid container spacing={2}>
                {[
                  {label: 'Team Meetings', icon: '👥'},
                  {label: 'Project Planning', icon: '📋'}, 
                  {label: 'Problem Solving', icon: '🧩'},
                  {label: 'Decision Making', icon: '⚖️'}
                ].map((skill, i) => (
                  <Grid item xs={6} key={i}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center', 
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <Typography variant="h6">{skill.icon}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {skill.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Time and Benefits */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  ⏱️ Duration
                </Typography>
                <Typography variant="body2">
                  20-25 minutes
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  🏆 Benefits
                </Typography>
                <Typography variant="body2">
                  Enhanced teamwork skills
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  📊 Difficulty
                </Typography>
                <Typography variant="body2">
                  Intermediate+
                </Typography>
              </Paper>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Button 
                href="/phase2" 
                variant="contained"
                size="large"
                sx={{ 
                  bgcolor: 'white',
                  color: '#667eea',
                  fontWeight: 700,
                  px: 4,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Start Team Practice
              </Button>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Optional • Builds on your {data.overall_level} level
              </Typography>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
            <Typography variant="h6" gutterBottom>CEFR Level Guide</Typography>
            <Grid container spacing={2}>
              {Object.entries(data.cefr_levels||{}).map(([lv, desc]) => (
                <Grid item xs={12} md={6} key={lv}>
                  <Paper variant="outlined" sx={{ p: 2, borderColor: lv===data.overall_level ? 'primary.main' : 'divider' }}>
                    <Typography variant="subtitle1">{lv}</Typography>
                    <Typography color="text.secondary" variant="body2">{desc}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Next Steps</Typography>
            <Stack spacing={1}>
              {data.session_id ? (
                <Button href={`/certificate?session_id=${data.session_id}`} size="large" variant="contained">Get Certificate</Button>
              ) : (
                <Button disabled size="large" variant="contained">Complete Assessment for Certificate</Button>
              )}
              <Button href="/start-game" size="large" variant="outlined">Start New Assessment</Button>
              <Button size="large" variant="outlined" onClick={()=>setFeedbackOpen(true)}>Provide Feedback</Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Your Progress Path</Typography>
            <Stack spacing={1}>
              {(progressLevels).map((pl, idx) => (
                <Stack key={idx} direction="row" spacing={1} alignItems="center">
                  <Chip size="small" label={pl.is_unlocked ? 'Unlocked' : 'Locked'} color={pl.is_unlocked ? 'success' : 'default'} />
                  <Box>
                    <Typography>{pl.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{pl.description}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Badge Earned</Typography>
            <Box sx={{ mb: 1 }}>
              <img src={`/static/images/badges/${data.badges?.[data.overall_level]?.icon || ''}`} alt="badge" style={{ width: 100, height: 100, objectFit: 'contain' }} />
            </Box>
            <Typography variant="subtitle1">{data.badges?.[data.overall_level]?.name}</Typography>
            <Typography color="text.secondary" variant="body2">{data.badges?.[data.overall_level]?.description}</Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Next Challenge</Typography>
            {!challenge ? (
              <Box sx={{ py: 2 }}><LinearProgress /></Box>
            ) : (
              <>
                <Typography color="text.secondary" sx={{ mb: 1 }}>Try this {challenge.level} level challenge:</Typography>
                <Typography>{challenge.challenge}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                  <Typography color="success.main">+{challenge.xp_reward} XP reward</Typography>
                  <Button size="small" variant="outlined" onClick={(e)=>{ e.currentTarget.disabled=true; }}>Accept Challenge</Button>
                </Stack>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed feedback per response */}
      <Paper sx={{ p: 3, mt: 3 }} elevation={0}>
        <Typography variant="h6" gutterBottom>Detailed Feedback</Typography>
        {(!data.responses || data.responses.length === 0) ? (
          <Typography color="text.secondary">No detailed feedback available. Complete the game to see response-by-response analysis.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {(data.responses||[]).map((r, idx) => {
            const a = (data.assessments||[])[idx] || {}
            const aiChip = r.ai_generated && r.ai_score>0.5 ? <Chip size="small" color="warning" label={`AI: ${Math.round(r.ai_score*100)}%`} /> : null
            return (
              <Accordion key={idx} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction={{ xs:'column', sm:'row' }} spacing={1} alignItems={{ xs:'flex-start', sm:'center' }}>
                    <Typography variant="subtitle1">Step {r.step}</Typography>
                    <Chip size="small" label={`Level: ${a.level || '—'}`} />
                    {aiChip}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Question:</strong> {r.question}
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    <strong>Your response:</strong> {r.response}
                  </Typography>
                  <Grid container spacing={2}>
                    {a.vocabulary_assessment && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2">Vocabulary</Typography>
                        <Typography color="text.secondary" variant="body2">{a.vocabulary_assessment}</Typography>
                      </Grid>
                    )}
                  {a.grammar_assessment && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Grammar</Typography>
                      <Typography color="text.secondary" variant="body2">{a.grammar_assessment}</Typography>
                    </Grid>
                  )}
                  {a.spelling_assessment && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Spelling</Typography>
                      <Typography color="text.secondary" variant="body2">{a.spelling_assessment}</Typography>
                    </Grid>
                  )}
                  {a.comprehension_assessment && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Comprehension</Typography>
                      <Typography color="text.secondary" variant="body2">{a.comprehension_assessment}</Typography>
                    </Grid>
                  )}
                  {a.fluency_assessment && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Fluency</Typography>
                      <Typography color="text.secondary" variant="body2">{a.fluency_assessment}</Typography>
                    </Grid>
                  )}
                  {Array.isArray(a.specific_strengths) && a.specific_strengths.length>0 && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Strengths</Typography>
                      <Typography color="text.secondary" variant="body2">{a.specific_strengths.slice(0,3).join(', ')}</Typography>
                    </Grid>
                  )}
                  {Array.isArray(a.specific_areas_for_improvement) && a.specific_areas_for_improvement.length>0 && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Focus Areas</Typography>
                      <Typography color="text.secondary" variant="body2">{a.specific_areas_for_improvement.slice(0,3).join(', ')}</Typography>
                    </Grid>
                  )}
                  {a.tips_for_improvement && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Tips</Typography>
                      <Typography color="text.secondary" variant="body2">{a.tips_for_improvement}</Typography>
                    </Grid>
                  )}
                  </Grid>
                  <Stack direction={{ xs:'column', sm:'row' }} spacing={1} sx={{ mt: 1 }}>
                    <Button size="small" variant="outlined" onClick={()=>getCoaching(idx)}>Get AI Coaching</Button>
                    {coaching[idx]?.feedback && <Chip size="small" color="primary" label="Coaching ready" />}
                  </Stack>
                  {coaching[idx]?.feedback && (
                    <Alert severity="info" sx={{ mt: 1 }}>{coaching[idx].feedback}</Alert>
                  )}
                </AccordionDetails>
              </Accordion>
            )
          })}
          </Stack>
        )}
      </Paper>

      <Dialog open={feedbackOpen} onClose={()=>setFeedbackOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Provide Feedback</DialogTitle>
        <DialogContent>
          <Typography>How would you rate your experience?</Typography>
          <RadioGroup row defaultValue="5" sx={{ mb: 2 }}>
            {[1,2,3,4,5].map(n => (
              <FormControlLabel key={n} value={String(n)} control={<Radio />} label={`${n} ★`} />
            ))}
          </RadioGroup>
          <TextField label="What did you like?" fullWidth multiline minRows={3} sx={{ mb: 2 }} />
          <TextField label="How can we improve?" fullWidth multiline minRows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setFeedbackOpen(false)}>Close</Button>
          <Button variant="contained" onClick={()=>setFeedbackOpen(false)}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
