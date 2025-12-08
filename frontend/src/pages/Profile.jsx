import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Stack, Button, Avatar, Chip, Divider, Grid, Card, CardContent } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import LockIcon from '@mui/icons-material/Lock'
import DeleteIcon from '@mui/icons-material/Delete'
import SchoolIcon from '@mui/icons-material/School'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { useAuth } from '../lib/api.jsx'
import { useUserStats } from '../hooks/useUserStats.jsx'

export default function Profile() {
  const { user } = useAuth()
  const { stats } = useUserStats()

  const userName = user?.first_name || user?.username || 'User'
  const userLevel = stats?.best_level || stats?.overall_level || null
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Profile Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
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
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              @{user?.username}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {userLevel && (
                <Chip
                  icon={<SchoolIcon />}
                  label={`Level ${userLevel}`}
                  color="primary"
                  variant="outlined"
                />
              )}
              <Chip
                icon={<CalendarTodayIcon />}
                label={`Joined ${joinDate}`}
                variant="outlined"
              />
            </Stack>
          </Grid>
          <Grid item>
            <Stack spacing={2}>
              <Button
                component={RouterLink}
                to="/profile/edit"
                startIcon={<EditIcon />}
                variant="contained"
              >
                Edit Profile
              </Button>
              <Button
                component={RouterLink}
                to="/profile/change-password"
                startIcon={<LockIcon />}
                variant="outlined"
              >
                Change Password
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Account Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {user?.email || 'Not provided'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1">
                    {user?.username}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Role
                  </Typography>
                  <Chip
                    label={user?.is_admin ? 'Administrator' : 'Student'}
                    size="small"
                    color={user?.is_admin ? 'secondary' : 'default'}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Learning Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Learning Progress
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Current Level
                  </Typography>
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={userLevel ? `CEFR Level ${userLevel}` : 'Not assessed yet'}
                    color={userLevel ? 'primary' : 'default'}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Assessments
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {stats?.total_assessments || 0}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Average Score
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats?.average_score ? `${Math.round(stats.average_score)}%` : 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Actions */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error.main">
                Danger Zone
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Delete Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to="/profile/delete-account"
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                  color="error"
                >
                  Delete Account
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}