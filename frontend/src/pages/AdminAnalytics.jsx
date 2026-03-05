import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Grid, Card, CardContent, Alert, Stack, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, LinearProgress, Avatar, IconButton, List, ListItem
} from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, LineElement, PointElement, Filler
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import RefreshIcon from '@mui/icons-material/Refresh'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import VisibilityIcon from '@mui/icons-material/Visibility'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, LineElement, PointElement, Filler
)

const PHASE_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f97316', '#ef4444', '#8b5cf6']
const PHASE_NAMES = ['Foundation', 'Cultural Planning', 'Vendors & Budget', 'Marketing', 'Execution', 'Reflection']

export default function AdminAnalytics() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const loadAnalytics = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/analytics', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load analytics')
      const result = await res.json()
      if (result.success) setData(result.data)
      else setError(result.error || 'Failed to load analytics')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAnalytics() }, [])

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography sx={{ fontSize: '1rem', color: '#64748b', mb: 2 }}>Loading analytics...</Typography>
        <LinearProgress sx={{ borderRadius: 2 }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={loadAnalytics} startIcon={<RefreshIcon />}>Retry</Button>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography color="text.secondary">No analytics data available</Typography>
      </Box>
    )
  }

  const { learning_progress, engagement, quality, risk, system } = data

  // Charts
  const activityChartData = {
    labels: (engagement.daily_activity || []).slice().reverse().map(d =>
      new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      label: 'Active Users',
      data: (engagement.daily_activity || []).slice().reverse().map(d => d.active_users),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.06)',
      tension: 0.4,
      fill: true,
      pointRadius: 2,
      pointBackgroundColor: '#6366f1',
      borderWidth: 2,
    }]
  }

  const cefrChartData = {
    labels: (learning_progress.cefr_distribution || []).map(d => d.level),
    datasets: [{
      data: (learning_progress.cefr_distribution || []).map(d => d.count),
      backgroundColor: PHASE_COLORS,
      borderWidth: 0,
      hoverOffset: 6,
    }]
  }

  const scoreChartData = {
    labels: (quality.score_distribution || []).map(d => d.score_range),
    datasets: [{
      label: 'Students',
      data: (quality.score_distribution || []).map(d => d.count),
      backgroundColor: PHASE_COLORS.slice(0, 4),
      borderRadius: 6,
      borderSkipped: false,
    }]
  }

  const durationChartData = {
    labels: (engagement.session_duration_dist || []).map(d => d.duration_range),
    datasets: [{
      label: 'Sessions',
      data: (engagement.session_duration_dist || []).map(d => d.count),
      backgroundColor: '#0ea5e9',
      borderRadius: 6,
      borderSkipped: false,
    }]
  }

  const lineOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
    },
  }

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: { legend: { display: false } },
  }

  const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
    },
  }

  const phaseKeys = ['phase1_completed', 'phase2_completed', 'phase3_completed', 'phase4_completed', 'phase5_completed', 'phase6_completed']

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
            Analytics
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', color: '#94a3b8', mt: 0.3 }}>
            In-depth platform metrics and insights
          </Typography>
        </Box>
        <IconButton onClick={loadAnalytics} sx={{ color: '#94a3b8', '&:hover': { color: '#6366f1' } }}>
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* Top KPIs */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Active (7d)', value: engagement.active_users_7d, color: '#6366f1' },
          { label: 'Active (30d)', value: engagement.active_users_30d, color: '#10b981' },
          { label: 'Sessions (7d)', value: system.total_sessions_7d, color: '#0ea5e9' },
          { label: 'Errors', value: system.recent_errors, color: system.recent_errors > 0 ? '#ef4444' : '#10b981' },
          { label: 'AI Usage', value: `${quality.ai_detection.avg_ai_usage ? Math.round(quality.ai_detection.avg_ai_usage) : 0}%`, color: '#f97316' },
        ].map(({ label, value, color }) => (
          <Grid item xs={6} sm={4} md key={label}>
            <Card sx={{ border: '1px solid #f1f5f9', borderRadius: 3, boxShadow: 'none', textAlign: 'center' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color, lineHeight: 1.1 }}>
                  {value}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500, mt: 0.3 }}>
                  {label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Activity + CEFR */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ border: '1px solid #f1f5f9', borderRadius: 3, boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
                Daily Active Users (30 Days)
              </Typography>
              <Box sx={{ height: 280 }}>
                {(engagement.daily_activity || []).length > 0 ? (
                  <Line data={activityChartData} options={lineOpts} />
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#94a3b8' }}>No activity data</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ border: '1px solid #f1f5f9', borderRadius: 3, boxShadow: 'none', height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
                CEFR Level Distribution
              </Typography>
              <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                {(learning_progress.cefr_distribution || []).length > 0 ? (
                  <Doughnut data={cefrChartData} options={doughnutOpts} />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ color: '#94a3b8' }}>No data</Typography>
                  </Box>
                )}
              </Box>
              <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 1.5, justifyContent: 'center' }}>
                {(learning_progress.cefr_distribution || []).map((d, i) => (
                  <Chip key={d.level} label={`${d.level}: ${d.count}`} size="small" sx={{
                    fontSize: '0.68rem', fontWeight: 600, height: 22,
                    bgcolor: PHASE_COLORS[i] + '10', color: PHASE_COLORS[i],
                  }} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Phase Completion Funnel */}
      <Card sx={{ border: '1px solid #f1f5f9', borderRadius: 3, boxShadow: 'none', mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', mb: 2.5 }}>
            Phase Completion Funnel
          </Typography>
          <Stack spacing={1.5}>
            {phaseKeys.map((key, i) => {
              const total = learning_progress.phase_completion.total_users || 1
              const value = learning_progress.phase_completion[key] || 0
              const pct = Math.round((value / total) * 100)
              return (
                <Stack key={key} direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ width: 120, flexShrink: 0 }}>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                      Phase {i + 1}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                      {PHASE_NAMES[i]}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        height: 10, borderRadius: 5, bgcolor: '#f1f5f9',
                        '& .MuiLinearProgress-bar': { bgcolor: PHASE_COLORS[i], borderRadius: 5 },
                      }}
                    />
                  </Box>
                  <Box sx={{ width: 70, textAlign: 'right', flexShrink: 0 }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: PHASE_COLORS[i] }}>
                      {value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                      {pct}%
                    </Typography>
                  </Box>
                </Stack>
              )
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Score Distribution + Session Duration */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '1px solid #f1f5f9', borderRadius: 3, boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
                Score Distribution
              </Typography>
              <Box sx={{ height: 250 }}>
                {(quality.score_distribution || []).length > 0 ? (
                  <Bar data={scoreChartData} options={barOpts} />
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#94a3b8' }}>No data</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '1px solid #f1f5f9', borderRadius: 3, boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
                Session Duration
              </Typography>
              <Box sx={{ height: 250 }}>
                {(engagement.session_duration_dist || []).length > 0 ? (
                  <Bar data={durationChartData} options={barOpts} />
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#94a3b8' }}>No data</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Challenging Steps */}
      <Card sx={{ border: '1px solid #f1f5f9', borderRadius: 3, boxShadow: 'none', mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', mb: 2 }}>
            Most Challenging Steps
          </Typography>
          {(quality.challenging_steps || []).length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', borderColor: '#f1f5f9' }}>Step</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', borderColor: '#f1f5f9' }} align="right">Attempts</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', borderColor: '#f1f5f9' }} align="right">Success Rate</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', borderColor: '#f1f5f9' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quality.challenging_steps.map((step, i) => (
                    <TableRow key={i} sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ borderColor: '#f1f5f9' }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
                          {(step.step_id?.replace('_', ' ') || 'UNKNOWN').toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: '#f1f5f9' }} align="right">
                        <Typography sx={{ fontSize: '0.82rem', color: '#475569' }}>{step.attempts}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: '#f1f5f9' }} align="right">
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: step.success_rate > 70 ? '#10b981' : step.success_rate > 50 ? '#f59e0b' : '#ef4444' }}>
                          {step.success_rate}%
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: '#f1f5f9' }}>
                        <Chip
                          label={step.success_rate > 70 ? 'Good' : step.success_rate > 50 ? 'Needs Attention' : 'Critical'}
                          size="small"
                          sx={{
                            fontSize: '0.65rem', fontWeight: 700, height: 22,
                            bgcolor: step.success_rate > 70 ? '#f0fdf4' : step.success_rate > 50 ? '#fffbeb' : '#fef2f2',
                            color: step.success_rate > 70 ? '#10b981' : step.success_rate > 50 ? '#f59e0b' : '#ef4444',
                            border: `1px solid ${step.success_rate > 70 ? '#bbf7d0' : step.success_rate > 50 ? '#fde68a' : '#fecaca'}`,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>No step data available</Typography>
          )}
        </CardContent>
      </Card>

      {/* Risk: At-Risk + Stuck */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '1px solid #f1f5f9', borderRadius: 3, boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <WarningAmberIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
                  At-Risk Students
                </Typography>
                {risk.at_risk_students.length > 0 && (
                  <Chip label={risk.at_risk_students.length} size="small" sx={{
                    height: 20, fontSize: '0.65rem', fontWeight: 700,
                    bgcolor: '#fef2f2', color: '#ef4444',
                  }} />
                )}
              </Stack>
              {risk.at_risk_students.length === 0 ? (
                <Box sx={{ py: 3, textAlign: 'center', bgcolor: '#f0fdf4', borderRadius: 2 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 24, color: '#10b981', mb: 0.5 }} />
                  <Typography sx={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>
                    No at-risk students
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  {risk.at_risk_students.map((s, i) => (
                    <Stack key={i} direction="row" alignItems="center" spacing={1.5}
                      sx={{ p: 1.5, borderRadius: 2, border: '1px solid #f1f5f9', '&:hover': { bgcolor: '#f8fafc' } }}
                    >
                      <Avatar sx={{ width: 30, height: 30, bgcolor: '#fef2f2', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
                        {(s.first_name || '?')[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                          {s.first_name} {s.last_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                          Last: {s.last_activity ? new Date(s.last_activity).toLocaleDateString() : 'Unknown'}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => navigate(`/admin/users/${s.id}`)}
                        sx={{ color: '#94a3b8', '&:hover': { color: '#6366f1' } }}
                      >
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '1px solid #f1f5f9', borderRadius: 3, boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
                  Stuck Students
                </Typography>
                {risk.stuck_students.length > 0 && (
                  <Chip label={risk.stuck_students.length} size="small" sx={{
                    height: 20, fontSize: '0.65rem', fontWeight: 700,
                    bgcolor: '#fffbeb', color: '#f59e0b',
                  }} />
                )}
              </Stack>
              {risk.stuck_students.length === 0 ? (
                <Box sx={{ py: 3, textAlign: 'center', bgcolor: '#f0fdf4', borderRadius: 2 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 24, color: '#10b981', mb: 0.5 }} />
                  <Typography sx={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>
                    No stuck students
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  {risk.stuck_students.map((s, i) => (
                    <Stack key={i} direction="row" alignItems="center" spacing={1.5}
                      sx={{ p: 1.5, borderRadius: 2, border: '1px solid #f1f5f9', '&:hover': { bgcolor: '#f8fafc' } }}
                    >
                      <Avatar sx={{ width: 30, height: 30, bgcolor: '#fffbeb', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>
                        {(s.first_name || '?')[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                          {s.first_name} {s.last_name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                          {(s.step_id?.replace('_', ' ') || 'unknown').toUpperCase()} — {s.days_stuck} days
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => navigate(`/admin/users/${s.id}`)}
                        sx={{ color: '#94a3b8', '&:hover': { color: '#6366f1' } }}
                      >
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
