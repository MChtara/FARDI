import React, { useEffect, useState } from 'react'
import {
  Box, Paper, Typography, Stack, Button, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, LinearProgress,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Alert, Tabs, Tab
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
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
import PeopleIcon from '@mui/icons-material/People'
import AssessmentIcon from '@mui/icons-material/Assessment'
import SchoolIcon from '@mui/icons-material/School'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DownloadIcon from '@mui/icons-material/Download'
import RefreshIcon from '@mui/icons-material/Refresh'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import GroupIcon from '@mui/icons-material/Group'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TargetIcon from '@mui/icons-material/GpsFixed'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import BarChartIcon from '@mui/icons-material/BarChart'
import ErrorIcon from '@mui/icons-material/Error'
import HelpIcon from '@mui/icons-material/Help'
import CelebrationIcon from '@mui/icons-material/Celebration'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'

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

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tabValue, setTabValue] = useState(0)

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [usersRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/users', { credentials: 'include' }),
        fetch('/api/admin/analytics', { credentials: 'include' })
      ])

      if (!usersRes.ok || !analyticsRes.ok) {
        throw new Error('Failed to load admin data')
      }

      const [usersData, analyticsData] = await Promise.all([
        usersRes.json(),
        analyticsRes.json()
      ])

      setRecentUsers(usersData.success ? usersData.data.users || [] : [])
      setAnalytics(analyticsData.success ? analyticsData.data : null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleExportData = () => {
    window.location.href = '/admin/export-data'
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Loading analytics dashboard...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={loadData} startIcon={<RefreshIcon />}>
          Retry
        </Button>
      </Box>
    )
  }

  if (!analytics) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No analytics data available</Typography>
      </Box>
    )
  }

  // Chart configurations
  const cefrChartData = {
    labels: analytics.learning_progress.cefr_distribution.map(d => d.level),
    datasets: [{
      data: analytics.learning_progress.cefr_distribution.map(d => d.count),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ]
    }]
  }

  const activityChartData = {
    labels: analytics.engagement.daily_activity.slice().reverse().map(d =>
      new Date(d.date).toLocaleDateString()
    ),
    datasets: [{
      label: 'Active Users',
      data: analytics.engagement.daily_activity.slice().reverse().map(d => d.active_users),
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }

  const scoreChartData = {
    labels: analytics.quality.score_distribution.map(d => d.score_range),
    datasets: [{
      label: 'Students',
      data: analytics.quality.score_distribution.map(d => d.count),
      backgroundColor: ['#FF6384', '#FFCE56', '#4BC0C0', '#36A2EB']
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  }

  const { learning_progress, engagement, quality, risk, system } = analytics

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Analytics Dashboard
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadData}
            variant="outlined"
          >
            Refresh
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
            variant="contained"
          >
            Export Data
          </Button>
        </Stack>
      </Stack>

      {/* Quick Actions Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Admin Tools
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Exercise Builder
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create and manage dynamic learning workflows and exercises
                  </Typography>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/admin/exercises"
                    fullWidth
                  >
                    Open Builder
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <SupervisorAccountIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    User Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and manage user accounts and permissions
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveTab(3)}
                    fullWidth
                  >
                    Manage Users
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <BarChartIcon sx={{ fontSize: 48, color: 'success.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View detailed analytics and performance metrics
                  </Typography>
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/admin/analytics"
                    fullWidth
                  >
                    View Analytics
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Key Performance Indicators */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            height: '100%',
            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
          }}>
            <CardContent>
              <Stack spacing={1} alignItems="center" textAlign="center">
                <GroupIcon sx={{ fontSize: 40 }} />
                <Typography variant="h3" fontWeight="bold">{engagement.active_users_7d}</Typography>
                <Typography variant="body2">Active Users (7d)</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{
            background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
            color: 'white',
            height: '100%',
            boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)'
          }}>
            <CardContent>
              <Stack spacing={1} alignItems="center" textAlign="center">
                <CheckCircleIcon sx={{ fontSize: 40 }} />
                <Typography variant="h3" fontWeight="bold">{learning_progress.phase_completion.phase1_completed}</Typography>
                <Typography variant="body2">Phase 1 Completed</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{
            background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)',
            color: 'white',
            height: '100%',
            boxShadow: '0 4px 20px rgba(237, 108, 2, 0.3)'
          }}>
            <CardContent>
              <Stack spacing={1} alignItems="center" textAlign="center">
                <SmartToyIcon sx={{ fontSize: 40 }} />
                <Typography variant="h3" fontWeight="bold">
                  {quality.ai_detection.avg_ai_usage ? Math.round(quality.ai_detection.avg_ai_usage) : 0}%
                </Typography>
                <Typography variant="body2">Avg AI Usage</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{
            background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
            color: 'white',
            height: '100%',
            boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)'
          }}>
            <CardContent>
              <Stack spacing={1} alignItems="center" textAlign="center">
                <WarningIcon sx={{ fontSize: 40 }} />
                <Typography variant="h3" fontWeight="bold">{risk.at_risk_students.length}</Typography>
                <Typography variant="body2">At-Risk Students</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{
            background: 'linear-gradient(135deg, #0288d1 0%, #0277bd 100%)',
            color: 'white',
            height: '100%',
            boxShadow: '0 4px 20px rgba(2, 136, 209, 0.3)'
          }}>
            <CardContent>
              <Stack spacing={1} alignItems="center" textAlign="center">
                <TrendingUpIcon sx={{ fontSize: 40 }} />
                <Typography variant="h3" fontWeight="bold">{engagement.active_users_30d}</Typography>
                <Typography variant="body2">Monthly Active</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Different Analytics Views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab
            icon={<TrendingUpIcon />}
            label="Learning Progress"
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<GroupIcon />}
            label="Student Engagement"
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<WarningIcon />}
            label="Risk Management"
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<SupervisorAccountIcon />}
            label="User Management"
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>
      </Box>

      {/* Learning Progress Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TargetIcon /> CEFR Level Distribution
                </Typography>
                {analytics.learning_progress.cefr_distribution.length > 0 ? (
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
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RocketLaunchIcon /> Phase Completion Funnel
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2">Total Users: {learning_progress.phase_completion.total_users}</Typography>
                    <LinearProgress variant="determinate" value={100} sx={{ mt: 1, height: 8 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      Phase 1 Completed: {learning_progress.phase_completion.phase1_completed}
                      ({Math.round(learning_progress.phase_completion.phase1_completed / learning_progress.phase_completion.total_users * 100)}%)
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={learning_progress.phase_completion.phase1_completed / learning_progress.phase_completion.total_users * 100}
                      sx={{ mt: 1, height: 8 }}
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
                      sx={{ mt: 1, height: 8 }}
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
                      sx={{ mt: 1, height: 8 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChartIcon /> Most Challenging Steps
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Step</TableCell>
                        <TableCell align="right">Attempts</TableCell>
                        <TableCell align="right">Success Rate</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analytics.quality.challenging_steps.map((step, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {(step.step_id?.replace('_', ' ') || 'UNKNOWN').toUpperCase()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{step.attempts}</TableCell>
                          <TableCell align="right">{step.success_rate}%</TableCell>
                          <TableCell>
                            <Chip
                              label={step.success_rate > 70 ? 'Good' : step.success_rate > 50 ? 'Needs Attention' : 'Critical'}
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
      </TabPanel>

      {/* Student Engagement Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon /> Daily Active Users (Last 30 Days)
                </Typography>
                {analytics.engagement.daily_activity.length > 0 ? (
                  <Box sx={{ height: 400 }}>
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
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEventsIcon /> Score Distribution
                </Typography>
                {analytics.quality.score_distribution.length > 0 ? (
                  <Box sx={{ height: 400 }}>
                    <Bar data={scoreChartData} options={chartOptions} />
                  </Box>
                ) : (
                  <Typography color="text.secondary">No score data available</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h4" color="primary">{engagement.active_users_7d}</Typography>
                    <Typography variant="body2" color="text.secondary">Active Users (7d)</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h4" color="success.main">{engagement.active_users_30d}</Typography>
                    <Typography variant="body2" color="text.secondary">Active Users (30d)</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h4" color="info.main">{system.total_sessions_7d}</Typography>
                    <Typography variant="body2" color="text.secondary">Sessions (7d)</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h4" color={system.recent_errors > 0 ? 'error.main' : 'success.main'}>
                      {system.recent_errors}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Recent Errors</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Risk Management Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ErrorIcon color="error" /> At-Risk Students
                </Typography>
                <List>
                  {analytics.risk.at_risk_students.map((student, index) => (
                    <ListItem key={index} divider={index < analytics.risk.at_risk_students.length - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'error.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${student.first_name} ${student.last_name} (@${student.username})`}
                        secondary={`Last active: ${new Date(student.last_activity).toLocaleDateString()} | Assessments: ${student.assessments_completed}`}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/admin/users/${student.id}`)}
                      >
                        View
                      </Button>
                    </ListItem>
                  ))}
                  {analytics.risk.at_risk_students.length === 0 && (
                    <Box sx={{ p: 2, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <CelebrationIcon color="success" />
                      <Typography color="success.main">
                        No at-risk students identified!
                      </Typography>
                    </Box>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon color="warning" /> Stuck Students
                </Typography>
                <List>
                  {analytics.risk.stuck_students.map((student, index) => (
                    <ListItem key={index} divider={index < analytics.risk.stuck_students.length - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <AccessTimeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${student.first_name} ${student.last_name}`}
                        secondary={`Stuck on ${(student.step_id?.replace('_', ' ') || 'unknown').toUpperCase()} for ${student.days_stuck} days`}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        onClick={() => navigate(`/admin/users/${student.id}`)}
                      >
                        Help
                      </Button>
                    </ListItem>
                  ))}
                  {analytics.risk.stuck_students.length === 0 && (
                    <Box sx={{ p: 2, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <DoneAllIcon color="success" />
                      <Typography color="success.main">
                        No students are currently stuck!
                      </Typography>
                    </Box>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* User Management Tab */}
      <TabPanel value={tabValue} index={3}>
        <Paper>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Recent Users</Typography>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Assessments</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentUsers.slice(0, 10).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.best_level || 'N/A'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{user.total_assessments || 0}</TableCell>
                    <TableCell>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={RouterLink}
                        to={`/admin/users/${user.id}`}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>
    </Box>
  )
}