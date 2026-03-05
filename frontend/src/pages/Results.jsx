import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Stack, Button, LinearProgress, Chip, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, TextField, Alert, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton, Avatar } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SchoolIcon from '@mui/icons-material/School'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import PsychologyIcon from '@mui/icons-material/Psychology'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import RefreshIcon from '@mui/icons-material/Refresh'
import DashboardIcon from '@mui/icons-material/Dashboard'

const CEFR_META = {
  A1: { name: 'Beginner', color: '#94a3b8', bg: '#f8fafc', workplace: 'Simple greetings and basic personal information', rank: 1 },
  A2: { name: 'Elementary', color: '#60a5fa', bg: '#eff6ff', workplace: 'Simple work conversations and basic instructions', rank: 2 },
  B1: { name: 'Intermediate', color: '#34d399', bg: '#ecfdf5', workplace: 'Meetings, customer service, simple reports', rank: 3 },
  B2: { name: 'Upper-Intermediate', color: '#f59e0b', bg: '#fffbeb', workplace: 'Lead meetings, present ideas, complex negotiations', rank: 4 },
  C1: { name: 'Advanced', color: '#a78bfa', bg: '#f5f3ff', workplace: 'Strategic discussions, complex documents, mentoring', rank: 5 },
  C2: { name: 'Proficient', color: '#fb7185', bg: '#fff1f2', workplace: 'Native-like proficiency in all professional situations', rank: 6 },
}

const SKILLS = [
  { label: 'Vocabulary', key: 'vocabulary', color: '#34d399' },
  { label: 'Grammar', key: 'grammar', color: '#60a5fa' },
  { label: 'Fluency', key: 'fluency', color: '#f59e0b' },
  { label: 'Spelling', key: 'spelling', color: '#fb7185' },
  { label: 'Comprehension', key: 'comprehension', color: '#a78bfa' },
]

const levelToPct = (lv) => ({ A1: 17, A2: 33, B1: 50, B2: 67, C1: 83, C2: 100 }[lv] || 0)

function LevelBadge({ level, size = 120 }) {
  const meta = CEFR_META[level] || { name: level, color: '#6366f1', bg: '#f5f3ff' }
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box sx={{
        width: size, height: size, borderRadius: '50%',
        background: `conic-gradient(${meta.color} ${levelToPct(level)}%, transparent 0%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: '4px'
      }}>
        <Box sx={{
          width: size - 12, height: size - 12, borderRadius: '50%',
          bgcolor: 'background.paper',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Typography sx={{ fontSize: size * 0.28, fontWeight: 800, color: meta.color, lineHeight: 1 }}>{level}</Typography>
          <Typography sx={{ fontSize: size * 0.11, fontWeight: 600, color: 'text.secondary', mt: 0.5 }}>{meta.name}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

function SkillBar({ label, level, color }) {
  const pct = levelToPct(level)
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="body2" fontWeight={500}>{label}</Typography>
        <Chip size="small" label={level || '—'} sx={{ bgcolor: color + '22', color: color, fontWeight: 700, fontSize: '0.75rem' }} />
      </Stack>
      <Box sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.100', overflow: 'hidden' }}>
        <Box sx={{
          height: '100%', borderRadius: 4,
          background: `linear-gradient(90deg, ${color}aa, ${color})`,
          width: `${pct}%`,
          transition: 'width 1s ease'
        }} />
      </Box>
    </Box>
  )
}

export default function Results() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [challenge, setChallenge] = useState(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [coaching, setCoaching] = useState({})
  const [activeTab, setActiveTab] = useState('overview')

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

  // Confetti
  useEffect(() => {
    if (!data) return
    let rafId
    const canvas = document.createElement('canvas')
    Object.assign(canvas.style, { position: 'fixed', top: '0', left: '0', pointerEvents: 'none', zIndex: '1000' })
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    const colors = ['#1e3a8a', '#6366f1', '#34d399', '#f59e0b', '#fb7185']
    const pieces = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width, y: -20 - Math.random() * 100,
      r: Math.random() * 7 + 3, rot: Math.random() * 360,
      v: Math.random() * 2 + 1, col: colors[Math.floor(Math.random() * colors.length)]
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pieces.forEach(p => {
        p.y += p.v; p.rot += 3
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180)
        ctx.fillStyle = p.col; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r); ctx.restore()
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width }
      })
      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)
    const timer = setTimeout(() => { cancelAnimationFrame(rafId); canvas.remove() }, 4000)
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); cancelAnimationFrame(rafId); canvas.remove() }
  }, [data])

  const getCoaching = async (idx) => {
    try {
      const r = data.responses[idx]
      if (!r) return
      const res = await fetch('/api/get-ai-feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ question: r.question, response: r.response, speaker: r.speaker || 'Ms. Mabrouki', type: r.type })
      })
      const json = await res.json()
      setCoaching(prev => ({ ...prev, [idx]: json }))
    } catch {
      setCoaching(prev => ({ ...prev, [idx]: { error: 'Could not fetch coaching' } }))
    }
  }

  if (loading) return (
    <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Typography variant="h6" color="text.secondary">Loading your results…</Typography>
      <LinearProgress sx={{ width: 240, borderRadius: 2 }} />
    </Box>
  )
  if (error) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="error" variant="h6">Could not load results</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>{error}</Typography>
    </Box>
  )
  if (!data) return null

  const skill = data.skill_levels || {}
  const aiWarn = data.ai_percentage > 50 ? 'warning' : (data.ai_percentage > 30 ? 'info' : 'success')
  const meta = CEFR_META[data.overall_level] || {}
  const allLevels = Object.keys(CEFR_META)
  const currentRank = meta.rank || 0

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills' },
    { id: 'feedback', label: 'Detailed Feedback' },
    { id: 'achievements', label: 'Achievements' },
  ]

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>

      {/* ── HERO ── */}
      <Paper elevation={0} sx={{
        p: { xs: 3, md: 5 }, mb: 3, borderRadius: 4, overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4f46e5 100%)',
        color: 'white'
      }}>
        {/* decorative circles */}
        {[{top:-60,right:-60,s:200},{top:20,right:120,s:80},{bottom:-40,left:-40,s:160}].map((c,i)=>(
          <Box key={i} sx={{ position:'absolute', top:c.top, right:c.right, bottom:c.bottom, left:c.left,
            width:c.s, height:c.s, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }} />
        ))}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Chip label="Assessment Complete" size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', mb: 2, fontWeight: 600, backdropFilter: 'blur(8px)' }} />
            <Typography variant="h3" fontWeight={800} gutterBottom sx={{ lineHeight: 1.2 }}>
              Well done, {data.player_name}! 🎉
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85, mb: 3, maxWidth: 500 }}>
              You've completed the Cultural Event Planning orientation. Here's your full language profile.
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1.5 }}>
              <Chip icon={<EmojiEventsIcon />} label={`${data.xp} XP Earned`}
                sx={{ bgcolor: '#f59e0b', color: 'white', fontWeight: 700, '& .MuiChip-icon': { color: 'white' } }} />
              {data.session_id && (
                <Chip icon={<WorkspacePremiumIcon />} label="Certificate Available"
                  sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600, backdropFilter: 'blur(8px)', '& .MuiChip-icon': { color: 'white' } }} />
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <LevelBadge level={data.overall_level} size={160} />
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.75 }}>Your CEFR Level</Typography>
              <Typography variant="body1" fontWeight={600}>{meta.name}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ── QUICK STATS ROW ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'CEFR Level', value: data.overall_level, sub: meta.name, color: meta.color || '#6366f1', icon: SchoolIcon },
          { label: 'XP Earned', value: data.xp, sub: 'experience points', color: '#f59e0b', icon: StarIcon },
          { label: 'Responses', value: data.responses_length || (data.responses || []).length, sub: 'total answers', color: '#34d399', icon: TrendingUpIcon },
          { label: 'AI Detection', value: `${data.ai_percentage || 0}%`, sub: 'AI-generated responses', color: aiWarn === 'success' ? '#34d399' : aiWarn === 'info' ? '#f59e0b' : '#fb7185', icon: PsychologyIcon },
        ].map(({ label, value, sub, color, icon: Icon }) => (
          <Grid item xs={6} md={3} key={label}>
            <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Avatar sx={{ bgcolor: color + '18', width: 40, height: 40 }}>
                  <Icon sx={{ color, fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight: 1 }}>{value}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>{label}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── TABS ── */}
      <Stack direction="row" spacing={0.5} sx={{ mb: 3, p: 0.5, bgcolor: 'grey.100', borderRadius: 3, width: 'fit-content' }}>
        {TABS.map(t => (
          <Button key={t.id} size="small" disableElevation
            onClick={() => setActiveTab(t.id)}
            variant={activeTab === t.id ? 'contained' : 'text'}
            sx={{
              borderRadius: 2.5, px: 2.5, py: 1,
              bgcolor: activeTab === t.id ? 'primary.main' : 'transparent',
              color: activeTab === t.id ? 'white' : 'text.secondary',
              fontWeight: activeTab === t.id ? 600 : 400,
              '&:hover': { bgcolor: activeTab === t.id ? 'primary.dark' : 'grey.200' }
            }}
          >{t.label}</Button>
        ))}
      </Stack>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            {/* CEFR Journey */}
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Your CEFR Journey</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The European Framework for language proficiency — see where you stand.
              </Typography>
              <Stack spacing={1.5}>
                {allLevels.map((lv) => {
                  const m = CEFR_META[lv]
                  const isCurrent = lv === data.overall_level
                  const isPast = m.rank < currentRank
                  const isLocked = m.rank > currentRank
                  return (
                    <Box key={lv} sx={{
                      display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2,
                      bgcolor: isCurrent ? m.color + '15' : 'transparent',
                      border: isCurrent ? `2px solid ${m.color}` : '2px solid transparent',
                      transition: 'all 0.2s'
                    }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: isPast ? '#34d39922' : isCurrent ? m.color + '22' : 'grey.100',
                        flexShrink: 0
                      }}>
                        {isPast ? <CheckCircleIcon sx={{ color: '#34d399', fontSize: 20 }} />
                          : isLocked ? <LockIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                          : <Typography fontWeight={800} sx={{ color: m.color, fontSize: 14 }}>{lv}</Typography>}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2" fontWeight={isCurrent ? 700 : 500}
                            sx={{ color: isCurrent ? m.color : isPast ? 'text.secondary' : isLocked ? 'text.disabled' : 'text.primary' }}>
                            {lv} — {m.name}
                          </Typography>
                          {isCurrent && <Chip size="small" label="Your Level" sx={{ bgcolor: m.color, color: 'white', fontWeight: 700, fontSize: '0.7rem', height: 20 }} />}
                        </Stack>
                        <Typography variant="caption" color={isLocked ? 'text.disabled' : 'text.secondary'} noWrap>{m.workplace}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Stack>
            </Paper>

            {/* Next steps */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Next Steps</Typography>
              <Stack spacing={1.5}>
                {data.session_id && (
                  <Button href={`/certificate?session_id=${data.session_id}`} size="large"
                    startIcon={<WorkspacePremiumIcon />}
                    sx={{ justifyContent: 'flex-start', background: 'linear-gradient(135deg, #1e3a8a, #4f46e5)' }}>
                    Get Your Certificate
                  </Button>
                )}
                <Button href="/app/dashboard" size="large" variant="outlined"
                  startIcon={<DashboardIcon />} sx={{ justifyContent: 'flex-start' }}>
                  Go to Dashboard
                </Button>
                <Button href="/start-game" size="large" variant="outlined"
                  startIcon={<RefreshIcon />} sx={{ justifyContent: 'flex-start' }}>
                  Start New Assessment
                </Button>
                <Button size="large" variant="outlined" onClick={() => setFeedbackOpen(true)}
                  sx={{ justifyContent: 'flex-start' }}>
                  Share Your Feedback
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            {/* Progress path */}
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Progress Path</Typography>
              <Stack spacing={1}>
                {(data.progress_levels || []).map((pl, idx) => (
                  <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start" sx={{ p: 1.5, borderRadius: 2, bgcolor: pl.is_unlocked ? 'success.light' + '18' : 'grey.50' }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: pl.is_unlocked ? 'success.main' : 'grey.300', flexShrink: 0 }}>
                      {pl.is_unlocked ? <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} /> : <LockIcon sx={{ fontSize: 14 }} />}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600} color={pl.is_unlocked ? 'text.primary' : 'text.disabled'}>{pl.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{pl.description}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            {/* Badge */}
            {data.badges?.[data.overall_level] && (
              <Paper elevation={1} sx={{ p: 3, mb: 3, textAlign: 'center', borderRadius: 3,
                background: `linear-gradient(135deg, ${meta.color || '#6366f1'}15, ${meta.color || '#6366f1'}05)`,
                border: `1px solid ${meta.color || '#6366f1'}30`
              }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Badge Earned</Typography>
                <Box sx={{ mb: 1.5 }}>
                  <img src={`/static/images/badges/${data.badges[data.overall_level].icon || ''}`}
                    alt="badge" style={{ width: 90, height: 90, objectFit: 'contain' }} />
                </Box>
                <Typography fontWeight={700} color={meta.color}>{data.badges[data.overall_level].name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{data.badges[data.overall_level].description}</Typography>
              </Paper>
            )}

            {/* Next challenge */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Next Challenge</Typography>
              {!challenge ? (
                <LinearProgress sx={{ borderRadius: 2 }} />
              ) : (
                <>
                  <Chip size="small" label={`${challenge.level} Level`} sx={{ mb: 1.5, bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{challenge.challenge}</Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="success.main" fontWeight={600}>+{challenge.xp_reward} XP</Typography>
                    <Button size="small" variant="outlined" endIcon={<NavigateNextIcon />}>Accept</Button>
                  </Stack>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ── SKILLS TAB ── */}
      {activeTab === 'skills' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Skill Breakdown</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your performance across five core language skills.
              </Typography>
              <Stack spacing={2.5}>
                {SKILLS.map(s => (
                  <SkillBar key={s.key} label={s.label} level={skill[s.key] || data.overall_level} color={s.color} />
                ))}
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>AI Usage Analysis</Typography>
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">AI-generated responses</Typography>
                  <Typography variant="body2" fontWeight={700}>{data.ai_percentage || 0}%</Typography>
                </Stack>
                <Box sx={{ height: 12, borderRadius: 6, bgcolor: 'grey.100', overflow: 'hidden' }}>
                  <Box sx={{
                    height: '100%', borderRadius: 6, width: `${data.ai_percentage || 0}%`, transition: 'width 1s ease',
                    background: aiWarn === 'success' ? 'linear-gradient(90deg,#34d399,#059669)'
                      : aiWarn === 'info' ? 'linear-gradient(90deg,#f59e0b,#d97706)'
                      : 'linear-gradient(90deg,#fb7185,#dc2626)'
                  }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {data.ai_responses_count} of {data.responses_length} responses
                </Typography>
              </Box>
              <Alert severity={aiWarn} sx={{ borderRadius: 2 }}>
                {aiWarn === 'warning' && 'High AI usage detected. Try responding with your own words.'}
                {aiWarn === 'info' && 'Moderate AI usage. Personal responses improve learning outcomes.'}
                {aiWarn === 'success' && 'Excellent! Your responses were authentic and personal.'}
              </Alert>
              {data.ai_responses_count > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Flagged Responses</Typography>
                  <Stack spacing={1}>
                    {(data.responses || []).filter(r => r.ai_generated && r.ai_score > 0.5).map((r, idx) => (
                      <Box key={idx} sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 2, borderLeft: '3px solid #fb7185' }}>
                        <Typography variant="body2"><strong>Step {r.step}</strong> — AI confidence: {Math.round(r.ai_score * 100)}%</Typography>
                        {Array.isArray(r.ai_reasons) && r.ai_reasons.length > 0 && (
                          <Typography variant="caption" color="text.secondary">{r.ai_reasons.slice(0, 2).join(' · ')}</Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>

            <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #1e3a8a, #4f46e5)', color: 'white' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Advanced Practice</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                Strengthen your {data.overall_level} level with real team collaboration scenarios.
              </Typography>
              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                {['Team Meetings', 'Project Planning', 'Problem Solving', 'Decision Making'].map((s, i) => (
                  <Grid item xs={6} key={i}>
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight={600}>{s}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button href="/phase2" size="large" sx={{ bgcolor: 'white', color: '#1e3a8a', fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
                Start Team Practice
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ── FEEDBACK TAB ── */}
      {activeTab === 'feedback' && (
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Response-by-Response Analysis</Typography>
          {(!data.responses || data.responses.length === 0) ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">Complete the assessment to see detailed feedback.</Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {(data.responses || []).map((r, idx) => {
                const a = (data.assessments || [])[idx] || {}
                const hasAI = r.ai_generated && r.ai_score > 0.5
                return (
                  <Accordion key={idx} disableGutters elevation={0} sx={{
                    border: '1px solid', borderColor: 'divider', borderRadius: '12px !important',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': { borderColor: 'primary.main' }
                  }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 1 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 12, fontWeight: 700 }}>{r.step}</Avatar>
                        <Typography variant="body2" fontWeight={600}>Step {r.step}</Typography>
                        {a.level && <Chip size="small" label={a.level} sx={{ bgcolor: (CEFR_META[a.level]?.color || '#6366f1') + '20', color: CEFR_META[a.level]?.color || '#6366f1', fontWeight: 700 }} />}
                        {hasAI && <Chip size="small" label={`AI: ${Math.round(r.ai_score * 100)}%`} color="warning" />}
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>QUESTION</Typography>
                        <Typography variant="body2">{r.question}</Typography>
                      </Box>
                      <Box sx={{ p: 2, bgcolor: 'primary.main' + '08', borderRadius: 2, mb: 2, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>YOUR RESPONSE</Typography>
                        <Typography variant="body2">{r.response}</Typography>
                      </Box>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                          { key: 'vocabulary_assessment', label: 'Vocabulary' },
                          { key: 'grammar_assessment', label: 'Grammar' },
                          { key: 'spelling_assessment', label: 'Spelling' },
                          { key: 'comprehension_assessment', label: 'Comprehension' },
                          { key: 'fluency_assessment', label: 'Fluency' },
                        ].filter(f => a[f.key]).map(f => (
                          <Grid item xs={12} sm={6} key={f.key}>
                            <Typography variant="caption" color="text.secondary" display="block">{f.label.toUpperCase()}</Typography>
                            <Typography variant="body2">{a[f.key]}</Typography>
                          </Grid>
                        ))}
                        {Array.isArray(a.specific_strengths) && a.specific_strengths.length > 0 && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="success.main" display="block">STRENGTHS</Typography>
                            <Typography variant="body2">{a.specific_strengths.slice(0, 3).join(', ')}</Typography>
                          </Grid>
                        )}
                        {Array.isArray(a.specific_areas_for_improvement) && a.specific_areas_for_improvement.length > 0 && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="warning.main" display="block">FOCUS AREAS</Typography>
                            <Typography variant="body2">{a.specific_areas_for_improvement.slice(0, 3).join(', ')}</Typography>
                          </Grid>
                        )}
                        {a.tips_for_improvement && (
                          <Grid item xs={12}>
                            <Typography variant="caption" color="info.main" display="block">TIPS</Typography>
                            <Typography variant="body2">{a.tips_for_improvement}</Typography>
                          </Grid>
                        )}
                      </Grid>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button size="small" variant="outlined" startIcon={<PsychologyIcon />}
                          onClick={() => getCoaching(idx)} disabled={!!coaching[idx]}>
                          {coaching[idx] ? 'Coaching Loaded' : 'Get AI Coaching'}
                        </Button>
                        {coaching[idx]?.feedback && <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />}
                      </Stack>
                      {coaching[idx]?.feedback && (
                        <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2 }}>{coaching[idx].feedback}</Alert>
                      )}
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </Stack>
          )}
        </Paper>
      )}

      {/* ── ACHIEVEMENTS TAB ── */}
      {activeTab === 'achievements' && (
        <Grid container spacing={2}>
          {Object.entries(data.achievements || {}).map(([key, ach]) => {
            const unlocked = (data.achievements_earned || []).includes(key)
            return (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Paper elevation={unlocked ? 2 : 0} sx={{
                  p: 3, borderRadius: 3, height: '100%', textAlign: 'center',
                  opacity: unlocked ? 1 : 0.55,
                  background: unlocked
                    ? 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(16,185,129,0.05))'
                    : 'transparent',
                  border: unlocked ? '1px solid rgba(52,211,153,0.3)' : '1px solid',
                  borderColor: unlocked ? 'rgba(52,211,153,0.3)' : 'divider',
                  transition: 'all 0.2s'
                }}>
                  <Avatar sx={{
                    width: 56, height: 56, mx: 'auto', mb: 2,
                    bgcolor: unlocked ? '#34d39922' : 'grey.100'
                  }}>
                    {unlocked
                      ? <EmojiEventsIcon sx={{ color: '#059669', fontSize: 28 }} />
                      : <LockIcon sx={{ color: 'text.disabled', fontSize: 24 }} />}
                  </Avatar>
                  <Typography fontWeight={700} gutterBottom>{ach.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{ach.description}</Typography>
                  <Chip size="small" label={unlocked ? 'Unlocked' : 'Locked'}
                    sx={{ bgcolor: unlocked ? '#34d39922' : 'grey.100', color: unlocked ? '#059669' : 'text.disabled', fontWeight: 600 }} />
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* ── FEEDBACK DIALOG ── */}
      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Share Your Feedback</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>How was your experience with FARDI?</Typography>
          <RadioGroup row defaultValue="5" sx={{ mb: 2 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <FormControlLabel key={n} value={String(n)} control={<Radio size="small" />} label={`${n}★`} />
            ))}
          </RadioGroup>
          <TextField label="What did you enjoy?" fullWidth multiline minRows={2} sx={{ mb: 2 }} />
          <TextField label="How can we improve?" fullWidth multiline minRows={2} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button variant="outlined" onClick={() => setFeedbackOpen(false)}>Cancel</Button>
          <Button onClick={() => setFeedbackOpen(false)}>Submit Feedback</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
