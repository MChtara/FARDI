import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Stack,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import GroupIcon from '@mui/icons-material/Group'
import AssessmentIcon from '@mui/icons-material/Assessment'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SchoolIcon from '@mui/icons-material/School'
import PersonIcon from '@mui/icons-material/Person'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler
)

export default function AdminAnalytics() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/analytics', { credentials: 'include' })

        if (!response.ok) {
          throw new Error('Failed to load analytics')
        }

        const result = await response.json()
        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error || 'Failed to load analytics')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Loading analytics...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={() => navigate('/admin')} startIcon={<ArrowBackIcon />}>
          Back to Admin Dashboard
        </Button>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No analytics data available</Typography>
      </Box>
    )
  }

  // Chart configurations
  const cefrChartData = {
    labels: data.learning_progress.cefr_distribution.map(d => d.level),
    datasets: [{
      data: data.learning_progress.cefr_distribution.map(d => d.count),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ]
    }]
  }

  const activityChartData = {
    labels: data.engagement.daily_activity.slice().reverse().map(d => d.date),
    datasets: [{
      label: 'Active Users',
      data: data.engagement.daily_activity.slice().reverse().map(d => d.active_users),
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }

  const durationChartData = {
    labels: data.engagement.session_duration_dist.map(d => d.duration_range),
    datasets: [{
      label: 'Sessions',
      data: data.engagement.session_duration_dist.map(d => d.count),
      backgroundColor: '#4BC0C0'
    }]
  }

  const scoreChartData = {
    labels: data.quality.score_distribution.map(d => d.score_range),
    datasets: [{
      label: 'Students',
      data: data.quality.score_distribution.map(d => d.count),
      backgroundColor: ['#FF6384', '#FFCE56', '#4BC0C0', '#36A2EB']
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  }

  const { learning_progress, engagement, quality, risk, system } = data

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          variant="outlined"
        >
          Back to Admin
        </Button>
        <Typography variant="h4">📊 Analytics Dashboard</Typography>
      </Stack>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <GroupIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{engagement.active_users_7d}</Typography>
                  <Typography variant="body2">Active Users (7d)</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CheckCircleIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{learning_progress.phase_completion.phase1_completed}</Typography>
                  <Typography variant="body2">Phase 1 Completed</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <SmartToyIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {quality.ai_detection.avg_ai_usage ? Math.round(quality.ai_detection.avg_ai_usage) : 0}%
                  </Typography>
                  <Typography variant="body2">Avg AI Usage</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <WarningIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{risk.at_risk_students.length}</Typography>
                  <Typography variant="body2">At-Risk Students</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Learning Progress Analytics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📈 CEFR Level Distribution</Typography>
              {data.learning_progress.cefr_distribution.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <Pie data={cefrChartData} options={chartOptions} />
                </Box>
              ) : (
                <Typography color="text.secondary">No assessment data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>🎯 Phase Completion Funnel</Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2">Total Users: {learning_progress.phase_completion.total_users}</Typography>
                  <LinearProgress variant="determinate" value={100} sx={{ mt: 1 }} />
                </Box>
                <Box>
                  <Typography variant="body2">
                    Phase 1 Completed: {learning_progress.phase_completion.phase1_completed}
                    ({Math.round(learning_progress.phase_completion.phase1_completed / learning_progress.phase_completion.total_users * 100)}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={learning_progress.phase_completion.phase1_completed / learning_progress.phase_completion.total_users * 100}
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2">
                    Phase 2 Started: {learning_progress.phase_completion.phase2_started}
                    ({Math.round(learning_progress.phase_completion.phase2_started / learning_progress.phase_completion.total_users * 100)}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={learning_progress.phase_completion.phase2_started / learning_progress.phase_completion.total_users * 100}
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2">
                    Phase 2 Completed: {learning_progress.phase_completion.phase2_completed}
                    ({learning_progress.phase_completion.total_users > 0 ? Math.round(learning_progress.phase_completion.phase2_completed / learning_progress.phase_completion.total_users * 100) : 0}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={learning_progress.phase_completion.total_users > 0 ? learning_progress.phase_completion.phase2_completed / learning_progress.phase_completion.total_users * 100 : 0}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Student Engagement */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📅 Daily Active Users (Last 30 Days)</Typography>
              {data.engagement.daily_activity.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <Line data={activityChartData} options={chartOptions} />
                </Box>
              ) : (
                <Typography color="text.secondary">No activity data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>⏱️ Session Duration</Typography>
              {data.engagement.session_duration_dist.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <Bar data={durationChartData} options={chartOptions} />
                </Box>
              ) : (
                <Typography color="text.secondary">No duration data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assessment Quality & Risk Management */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>🎖️ Score Distribution</Typography>
              {data.quality.score_distribution.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <Bar data={scoreChartData} options={chartOptions} />
                </Box>
              ) : (
                <Typography color="text.secondary">No score data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📊 Most Challenging Steps</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Step</TableCell>
                      <TableCell align="right">Attempts</TableCell>
                      <TableCell align="right">Success Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.quality.challenging_steps.map((step, index) => (
                      <TableRow key={index}>
                        <TableCell>{(step.step_id?.replace('_', ' ') || 'UNKNOWN').toUpperCase()}</TableCell>
                        <TableCell align="right">{step.attempts}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${step.success_rate}%`}
                            color={step.success_rate > 70 ? 'success' : step.success_rate > 50 ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Risk Identification */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>🚨 At-Risk Students</Typography>
              <List>
                {data.risk.at_risk_students.map((student, index) => (
                  <ListItem key={index} divider={index < data.risk.at_risk_students.length - 1}>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${student.first_name} ${student.last_name} (@${student.username})`}
                      secondary={`Last active: ${new Date(student.last_activity).toLocaleDateString()} | Assessments: ${student.assessments_completed}`}
                    />
                    <Button
                      size="small"
                      onClick={() => navigate(`/admin/users/${student.id}`)}
                    >
                      View
                    </Button>
                  </ListItem>
                ))}
                {data.risk.at_risk_students.length === 0 && (
                  <Typography color="text.secondary">No at-risk students identified</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>⏳ Stuck Students</Typography>
              <List>
                {data.risk.stuck_students.map((student, index) => (
                  <ListItem key={index} divider={index < data.risk.stuck_students.length - 1}>
                    <ListItemAvatar>
                      <Avatar>
                        <AccessTimeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${student.first_name} ${student.last_name}`}
                      secondary={`Stuck on ${(student.step_id?.replace('_', ' ') || 'unknown').toUpperCase()} for ${student.days_stuck} days`}
                    />
                    <Button
                      size="small"
                      onClick={() => navigate(`/admin/users/${student.id}`)}
                    >
                      Help
                    </Button>
                  </ListItem>
                ))}
                {data.risk.stuck_students.length === 0 && (
                  <Typography color="text.secondary">No stuck students found</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Health */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>🔧 System Health</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Stack alignItems="center">
                <Typography variant="h4" color="info.main">{system.total_sessions_7d}</Typography>
                <Typography variant="body2" color="text.secondary">Sessions (7d)</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack alignItems="center">
                <Typography variant="h4" color={system.recent_errors > 0 ? 'error.main' : 'success.main'}>
                  {system.recent_errors}
                </Typography>
                <Typography variant="body2" color="text.secondary">Recent Errors</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack alignItems="center">
                <Typography variant="h4" color="success.main">
                  {engagement.active_users_30d}
                </Typography>
                <Typography variant="body2" color="text.secondary">Monthly Active</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack alignItems="center">
                <Typography variant="h4" color="primary.main">
                  {quality.ai_detection.total_assessments || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">Total Assessments</Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}