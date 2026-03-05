import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Stack, Button, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

export default function AdminUserViewer() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true)
      setError('')

      try {
        const userRes = await fetch(`/api/admin/users/${userId}/details`, { credentials: 'include' })

        if (!userRes.ok) {
          throw new Error('Failed to load user data')
        }

        const userData = await userRes.json()

        if (userData.success) {
          setUserData({
            ...userData.data.user,
            total_assessments: userData.data.stats.total_assessments,
            total_xp: userData.data.stats.total_xp,
            latest_level: userData.data.stats.latest_level,
            current_level: userData.data.stats.latest_level,
            phase3_completed: userData.data.progress?.phase3_completed,
            phase4_completed: userData.data.progress?.phase4_completed,
            phase5_completed: userData.data.progress?.phase5_completed,
            phase6_completed: userData.data.progress?.phase6_completed,
          })
          setAssessments(userData.data.stats.assessments || [])
        } else {
          throw new Error(userData.error || 'Failed to load user data')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadUserData()
    }
  }, [userId])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography>Loading user data...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button onClick={() => navigate('/admin')} sx={{ mt: 2 }}>
          Back to Admin Dashboard
        </Button>
      </Box>
    )
  }

  if (!userData) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6">User not found</Typography>
        <Button onClick={() => navigate('/admin')} sx={{ mt: 2 }}>
          Back to Admin Dashboard
        </Button>
      </Box>
    )
  }

  const userName = userData.first_name || userData.username || 'User'

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          variant="outlined"
        >
          Back to Admin
        </Button>
        <Typography variant="h4">
          User Details: {userData.first_name} {userData.last_name}
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* User Profile */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {userName[0].toUpperCase()}
                </Avatar>
                <Typography variant="h5">
                  {userData.first_name} {userData.last_name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  @{userData.username}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    icon={<SchoolIcon />}
                    label={userData.latest_level || userData.current_level || 'N/A'}
                    color="primary"
                  />
                  <Chip
                    icon={<PersonIcon />}
                    label={userData.is_admin ? 'Admin' : 'Student'}
                    color={userData.is_admin ? 'secondary' : 'default'}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {userData.email}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Account Created
                  </Typography>
                  <Typography variant="body1">
                    {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Active
                  </Typography>
                  <Typography variant="body1">
                    {userData.last_login ? new Date(userData.last_login).toLocaleDateString() : 'Never'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics & Assessments */}
        <Grid item xs={12} md={8}>
          {/* Statistics Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {userData.total_assessments || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Assessments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {assessments.length > 0 
                      ? Math.round(assessments.reduce((acc, a) => acc + (a.score || 0), 0) / assessments.length)
                      : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {userData.latest_level || userData.current_level || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Level
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
          </Grid>

          {/* Phase Progress */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Phase Progress</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {[
                  { n: 1, label: 'Foundation', done: (userData.total_assessments || 0) > 0, color: '#6366f1' },
                  { n: 2, label: 'Cultural Planning', done: userData.phase2_completed, color: '#0ea5e9' },
                  { n: 3, label: 'Vendors & Budget', done: userData.phase3_completed, color: '#10b981' },
                  { n: 4, label: 'Marketing', done: userData.phase4_completed, color: '#f97316' },
                  { n: 5, label: 'Execution', done: userData.phase5_completed, color: '#ef4444' },
                  { n: 6, label: 'Reflection', done: userData.phase6_completed, color: '#8b5cf6' },
                ].map(({ n, label, done, color }) => (
                  <Chip
                    key={n}
                    label={`Phase ${n}: ${label}`}
                    size="small"
                    sx={{
                      bgcolor: done ? color : '#f1f5f9',
                      color: done ? 'white' : '#94a3b8',
                      fontWeight: 600,
                      border: `1px solid ${done ? color : '#e2e8f0'}`,
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Assessment History */}
          <Paper>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6">Assessment History</Typography>
            </Box>
            
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>XP Earned</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessments.map((assessment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {assessment.completed_at 
                          ? new Date(assessment.completed_at).toLocaleDateString()
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="CEFR Assessment"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={assessment.overall_level || 'N/A'}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          color={
                            (assessment.xp_earned || 0) >= 800 
                              ? 'success.main' 
                              : (assessment.xp_earned || 0) >= 400 
                                ? 'warning.main' 
                                : 'error.main'
                          }
                        >
                          {assessment.xp_earned || 0} XP
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {assessment.duration_minutes 
                          ? `${assessment.duration_minutes} min` 
                          : 'N/A'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                  {assessments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">
                          No assessments completed yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}