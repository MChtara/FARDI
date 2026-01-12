import React, { useEffect, useMemo, useState } from 'react'
import {
  Box, Grid, Paper, Typography, Stack, Button, Chip, LinearProgress, Divider, Card, CardContent, Avatar, Alert, Container, IconButton, Tooltip, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, Stepper, Step, StepLabel
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import HistoryIcon from '@mui/icons-material/History'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LockIcon from '@mui/icons-material/Lock'
import GroupIcon from '@mui/icons-material/Group'
import SchoolIcon from '@mui/icons-material/School'
import EventIcon from '@mui/icons-material/Event'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import InfoIcon from '@mui/icons-material/Info'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import AssessmentIcon from '@mui/icons-material/Assessment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LanguageIcon from '@mui/icons-material/Language'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RefreshIcon from '@mui/icons-material/Refresh'
import LaunchIcon from '@mui/icons-material/Launch'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    fetch('/api/dashboard', { credentials: 'include' })
      .then(async r => { if (!r.ok) throw new Error('Failed to load dashboard'); return r.json() })
      .then(data => {
        setData(data)
        // Only show onboarding if user explicitly hasn't seen it (could add a flag later)
        // For now, disable automatic popup to reduce modal fatigue
        // const totalAssessments = data.user_stats?.total_assessments || 0
        // if (totalAssessments === 0) {
        //   setShowOnboarding(true)
        // }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Box sx={{ p: 3 }}><LinearProgress /></Box>
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>
  if (!data) return null

  const { user, user_stats, recent_assessments, phase2_progress } = data
  const name = user?.first_name || user?.username || 'User'
  const totalAssessments = user_stats?.total_assessments || 0
  const bestLevel = user_stats?.best_level || 'A1'
  const totalXp = user_stats?.total_xp || 0
  const avgXp = Math.round(user_stats?.avg_xp || 0)
  const p2Completed = user_stats?.phase2_completed_steps || 0
  const currentProgress = user_stats?.current_progress || null
  const hasCompletedPhase1 = totalAssessments > 0
  const hasIncompleteAssessment = recent_assessments?.some(a => !a.completed_at)
  const hasPhase2Progress = phase2_progress?.responses?.length > 0 || phase2_progress?.steps?.length > 0 || phase2_progress?.remedial_activities?.length > 0
  
  // Find the current/next Phase 2 step to continue from
  const getCurrentPhase2Step = () => {
    // Check if user has active remedial activities
    if (phase2_progress?.remedial_activities?.length > 0) {
      const lastRemedial = phase2_progress.remedial_activities[phase2_progress.remedial_activities.length - 1]
      if (!lastRemedial.completed) {
        // Return special marker for remedial activity - let backend determine activity index
        return {
          type: 'remedial',
          url: `/phase2/remedial/${lastRemedial.step_id}/${lastRemedial.level}`
        }
      }
    }
    
    if (!phase2_progress?.steps?.length) return null
    
    // Find the most recent incomplete step, or return the last step if all complete
    const incompleteStep = phase2_progress.steps.find(step => !step.completed_at)
    if (incompleteStep) return { type: 'step', stepId: incompleteStep.step_id }
    
    // If all steps are complete, check if there's a next step available
    const lastStep = phase2_progress.steps[phase2_progress.steps.length - 1]
    return lastStep ? { type: 'step', stepId: lastStep.step_id } : null
  }
  
  const currentPhase2Step = getCurrentPhase2Step()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Modern Hero Section */}
      <Box 
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
          color: 'white',
          py: 6,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(96, 165, 250, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    Welcome back, {name}! 👋
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600 }}>
                    Continue your personalized English learning journey with AI-powered assessments and real-world scenarios.
                  </Typography>
                </Box>
                
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip 
                    icon={<WorkspacePremiumIcon />}
                    label={`CEFR Level: ${bestLevel}`}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                  <Chip 
                    icon={<AutoAwesomeIcon />}
                    label={`${totalXp} XP Earned`}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                  <Chip 
                    icon={<AssessmentIcon />}
                    label={`${totalAssessments} Completed`}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                </Stack>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white'
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'white', 
                      color: 'primary.main',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Your Learning Progress
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    Track your journey through CEFR levels with personalized assessments
                  </Typography>
                  <Stack direction="row" justifyContent="center" spacing={1}>
                    <Chip size="small" label="A1" variant={bestLevel === 'A1' ? 'filled' : 'outlined'} sx={{ color: 'white', borderColor: 'white' }} />
                    <Chip size="small" label="A2" variant={bestLevel === 'A2' ? 'filled' : 'outlined'} sx={{ color: 'white', borderColor: 'white' }} />
                    <Chip size="small" label="B1" variant={bestLevel === 'B1' ? 'filled' : 'outlined'} sx={{ color: 'white', borderColor: 'white' }} />
                    <Chip size="small" label="B2" variant={bestLevel === 'B2' ? 'filled' : 'outlined'} sx={{ color: 'white', borderColor: 'white' }} />
                    <Chip size="small" label="C1" variant={bestLevel === 'C1' ? 'filled' : 'outlined'} sx={{ color: 'white', borderColor: 'white' }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* First-time User Banner (non-modal) */}
        {totalAssessments === 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'info.main',
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
            action={
              <Button 
                color="info" 
                size="small" 
                variant="contained"
                href="/game"
              >
                Start Assessment
              </Button>
            }
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              🎯 Ready to discover your CEFR level?
            </Typography>
            <Typography variant="body2">
              Take your first professional assessment in 15 minutes. Get A1-C2 level results with detailed feedback.
            </Typography>
          </Alert>
        )}

        {/* Quick Actions Bar */}
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Quick Actions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Continue your assessment or explore new features
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={2}>
                {hasIncompleteAssessment ? (
                  <Button 
                    variant="contained" 
                    startIcon={<PlayArrowIcon />}
                    href="/game"
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Continue Phase 1 Assessment
                  </Button>
                ) : hasPhase2Progress && hasCompletedPhase1 ? (
                  <Button 
                    variant="contained" 
                    startIcon={<PlayArrowIcon />}
                    href={currentPhase2Step ? (currentPhase2Step.type === 'remedial' ? currentPhase2Step.url : `/phase2/step/${currentPhase2Step.stepId}`) : "/phase2"}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Continue Phase 2
                  </Button>
                ) : hasCompletedPhase1 ? (
                  <Button 
                    variant="contained" 
                    startIcon={<PlayArrowIcon />}
                    href="/phase2"
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Start Phase 2
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    startIcon={<PlayArrowIcon />}
                    href="/game"
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Start Phase 1 Assessment
                  </Button>
                )}
                <Button 
                  variant="outlined" 
                  startIcon={<AssessmentIcon />}
                  href="/results"
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  View Results
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Assessment Phases */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
            Assessment Phases
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Phase 1 Card */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.8) 100%)'
                    : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(99, 102, 241, 0.3)'
                    : '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                  },
                  '&:hover': { 
                    transform: 'translateY(-6px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 20px 40px rgba(99, 102, 241, 0.25)'
                      : '0 20px 40px rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} alignItems={{ xs: 'center', sm: 'flex-start' }} sx={{ mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: { xs: 56, sm: 64 }, 
                        height: { xs: 56, sm: 64 }, 
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                        border: '3px solid rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      <EmojiEventsIcon sx={{ fontSize: { xs: 26, sm: 30 }, color: 'white' }} />
                    </Avatar>
                    <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                      <Typography variant={{ xs: 'h6', sm: 'h5' }} sx={{ fontWeight: 700, mb: 1 }}>
                        Phase 1: Foundation
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        Comprehensive English proficiency assessment to establish your CEFR baseline level
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                        <Chip 
                          size="small" 
                          label="9 Core Questions" 
                          variant="outlined" 
                          color="secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                        />
                        <Chip 
                          size="small" 
                          label="CEFR Aligned" 
                          variant="outlined" 
                          color="secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                        />
                        <Chip 
                          size="small" 
                          label="AI Powered" 
                          variant="outlined" 
                          color="secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ 
                    mb: 3, 
                    p: { xs: 2, sm: 2.5 }, 
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
                      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                    borderRadius: 2,
                    border: theme.palette.mode === 'dark'
                      ? '1px solid rgba(99, 102, 241, 0.2)'
                      : '1px solid rgba(99, 102, 241, 0.1)'
                  }}>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={{ xs: 2, sm: 3 }} 
                      alignItems="center"
                      divider={<Divider 
                        orientation={{ xs: 'horizontal', sm: 'vertical' }} 
                        flexItem 
                        sx={{ 
                          borderColor: theme.palette.mode === 'dark'
                            ? 'rgba(99, 102, 241, 0.25)'
                            : 'rgba(99, 102, 241, 0.15)' 
                        }}
                      />}
                    >
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography 
                          variant={{ xs: 'h5', sm: 'h4' }} 
                          sx={{ 
                            fontWeight: 800, 
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5
                          }}
                        >
                          {totalAssessments}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Assessments
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography 
                          variant={{ xs: 'h5', sm: 'h4' }} 
                          sx={{ 
                            fontWeight: 800, 
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5
                          }}
                        >
                          {bestLevel}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          CEFR Level
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography 
                          variant={{ xs: 'h5', sm: 'h4' }} 
                          sx={{ 
                            fontWeight: 800, 
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5
                          }}
                        >
                          {totalXp}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Total XP
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  
                  {currentProgress && (
                    <Box sx={{ mb: 3 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Current Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Step {currentProgress.current_step + 1} of {currentProgress.total_steps}
                        </Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={((currentProgress.current_step + 1) / currentProgress.total_steps) * 100} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button 
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      href="/game"
                      sx={{ 
                        flex: 1, 
                        borderRadius: 2, 
                        py: 1.5,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5856eb 0%, #7c3aed 100%)',
                          boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      {currentProgress ? 'Continue Assessment' : 'Start Phase 1'}
                    </Button>
                    <Button 
                      variant="outlined"
                      startIcon={<LaunchIcon />}
                      href="/results"
                      sx={{ 
                        borderRadius: 2, 
                        py: 1.5,
                        borderColor: theme.palette.mode === 'dark' 
                          ? 'rgba(99, 102, 241, 0.4)' 
                          : 'rgba(99, 102, 241, 0.3)',
                        color: theme.palette.mode === 'dark' 
                          ? '#a78bfa' 
                          : '#6366f1',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          borderColor: theme.palette.mode === 'dark' 
                            ? '#a78bfa' 
                            : '#6366f1',
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(167, 139, 250, 0.1)' 
                            : 'rgba(99, 102, 241, 0.05)',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      View Results
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Phase 2 Card */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  background: theme.palette.mode === 'dark'
                    ? (hasCompletedPhase1 
                        ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.8) 100%)'
                        : 'linear-gradient(145deg, rgba(51, 65, 85, 0.6) 0%, rgba(71, 85, 105, 0.5) 100%)')
                    : (hasCompletedPhase1 
                        ? 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
                        : 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)'),
                  border: theme.palette.mode === 'dark'
                    ? (hasCompletedPhase1 
                        ? '1px solid rgba(30, 58, 138, 0.4)'
                        : '1px solid rgba(148, 163, 184, 0.3)')
                    : (hasCompletedPhase1 
                        ? '1px solid rgba(30, 58, 138, 0.2)'
                        : '1px solid rgba(148, 163, 184, 0.3)'),
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: hasCompletedPhase1 ? 1 : 0.8,
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: hasCompletedPhase1 
                      ? 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)'
                      : 'linear-gradient(90deg, #94a3b8 0%, #cbd5e1 100%)',
                  },
                  '&:hover': hasCompletedPhase1 ? { 
                    transform: 'translateY(-6px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 20px 40px rgba(30, 58, 138, 0.25)'
                      : '0 20px 40px rgba(30, 58, 138, 0.15)',
                    border: theme.palette.mode === 'dark'
                      ? '1px solid rgba(30, 58, 138, 0.5)'
                      : '1px solid rgba(30, 58, 138, 0.3)',
                  } : {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 20px rgba(148, 163, 184, 0.3)'
                      : '0 8px 20px rgba(148, 163, 184, 0.2)',
                  }
                }}
              >
                {!hasCompletedPhase1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1
                    }}
                  >
                    <Chip 
                      icon={<LockIcon />}
                      label="Complete Phase 1 First"
                      size="small"
                      color="warning"
                      variant="filled"
                    />
                  </Box>
                )}
                
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} alignItems={{ xs: 'center', sm: 'flex-start' }} sx={{ mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: { xs: 56, sm: 64 }, 
                        height: { xs: 56, sm: 64 }, 
                        background: hasCompletedPhase1 
                          ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
                          : 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                        boxShadow: hasCompletedPhase1 
                          ? '0 8px 24px rgba(30, 58, 138, 0.4)'
                          : '0 4px 12px rgba(148, 163, 184, 0.3)',
                        border: '3px solid rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      <EventIcon sx={{ 
                        fontSize: { xs: 26, sm: 30 }, 
                        color: hasCompletedPhase1 ? 'white' : '#64748b'
                      }} />
                    </Avatar>
                    <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                      <Typography variant={{ xs: 'h6', sm: 'h5' }} sx={{ fontWeight: 700, mb: 1 }}>
                        Phase 2: Cultural Events
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        Interactive committee simulation planning Tunisian cultural events with real team dynamics
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                        <Chip 
                          size="small" 
                          label="9 Interactive Steps" 
                          variant="outlined" 
                          color={hasCompletedPhase1 ? "primary" : "default"}
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                        />
                        <Chip 
                          size="small" 
                          label="Cultural Context" 
                          variant="outlined" 
                          color={hasCompletedPhase1 ? "primary" : "default"}
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                        />
                        <Chip 
                          size="small" 
                          label="Team Simulation" 
                          variant="outlined" 
                          color={hasCompletedPhase1 ? "primary" : "default"}
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ 
                    mb: 3, 
                    p: { xs: 2, sm: 2.5 }, 
                    background: theme.palette.mode === 'dark'
                      ? (hasCompletedPhase1 
                          ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)'
                          : 'linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(203, 213, 225, 0.1) 100%)')
                      : (hasCompletedPhase1 
                          ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
                          : 'linear-gradient(135deg, rgba(148, 163, 184, 0.05) 0%, rgba(203, 213, 225, 0.05) 100%)'),
                    borderRadius: 2,
                    border: theme.palette.mode === 'dark'
                      ? (hasCompletedPhase1 
                          ? '1px solid rgba(30, 64, 175, 0.2)'
                          : '1px solid rgba(148, 163, 184, 0.3)')
                      : (hasCompletedPhase1 
                          ? '1px solid rgba(30, 64, 175, 0.1)'
                          : '1px solid rgba(148, 163, 184, 0.2)')
                  }}>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={{ xs: 2, sm: 3 }} 
                      alignItems="center"
                      divider={<Divider 
                        orientation={{ xs: 'horizontal', sm: 'vertical' }} 
                        flexItem 
                        sx={{ 
                          borderColor: theme.palette.mode === 'dark'
                            ? (hasCompletedPhase1 
                                ? 'rgba(30, 64, 175, 0.25)' 
                                : 'rgba(148, 163, 184, 0.3)')
                            : (hasCompletedPhase1 
                                ? 'rgba(30, 64, 175, 0.15)' 
                                : 'rgba(148, 163, 184, 0.2)')
                        }}
                      />}
                    >
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography 
                          variant={{ xs: 'h5', sm: 'h4' }} 
                          sx={{ 
                            fontWeight: 800, 
                            background: hasCompletedPhase1 
                              ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
                              : 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5
                          }}
                        >
                          {p2Completed}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          of 9 Steps
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography 
                          variant={{ xs: 'h5', sm: 'h4' }} 
                          sx={{ 
                            fontWeight: 800, 
                            background: hasCompletedPhase1 
                              ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
                              : 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5
                          }}
                        >
                          5
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Team Members
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography 
                          variant={{ xs: 'h5', sm: 'h4' }} 
                          sx={{ 
                            fontWeight: 800, 
                            background: hasCompletedPhase1 
                              ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
                              : 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5
                          }}
                        >
                          3
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Main Phases
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  
                  {hasCompletedPhase1 && p2Completed > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Phase 2 Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {p2Completed} of 9 steps
                        </Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(p2Completed / 9) * 100} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button 
                      variant={hasCompletedPhase1 ? "contained" : "outlined"}
                      startIcon={hasCompletedPhase1 ? <PlayArrowIcon /> : <LockIcon />}
                      href={hasCompletedPhase1 ? (hasPhase2Progress && currentPhase2Step ? (currentPhase2Step.type === 'remedial' ? currentPhase2Step.url : `/phase2/step/${currentPhase2Step.stepId}`) : "/phase2") : undefined}
                      disabled={!hasCompletedPhase1}
                      sx={{ 
                        flex: 1, 
                        borderRadius: 2, 
                        py: 1.5,
                        ...(hasCompletedPhase1 ? {
                          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                          boxShadow: '0 4px 15px rgba(30, 64, 175, 0.4)',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                            boxShadow: '0 6px 20px rgba(30, 64, 175, 0.6)',
                            transform: 'translateY(-1px)'
                          }
                        } : {
                          borderColor: 'rgba(148, 163, 184, 0.4)',
                          color: 'rgba(148, 163, 184, 0.8)',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          cursor: 'not-allowed'
                        })
                      }}
                    >
                      {hasCompletedPhase1 
                        ? (hasPhase2Progress ? 'Continue Phase 2' : 'Start Phase 2')
                        : 'Locked - Complete Phase 1'
                      }
                    </Button>
                    {hasCompletedPhase1 && (
                      <Button 
                        variant="outlined"
                        startIcon={<InfoIcon />}
                        href="/phase2"
                        sx={{ 
                          borderRadius: 2, 
                          py: 1.5,
                          borderColor: theme.palette.mode === 'dark' 
                            ? 'rgba(30, 64, 175, 0.4)' 
                            : 'rgba(30, 64, 175, 0.3)',
                          color: theme.palette.mode === 'dark' 
                            ? '#60a5fa' 
                            : '#1e40af',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          '&:hover': {
                            borderColor: theme.palette.mode === 'dark' 
                              ? '#60a5fa' 
                              : '#1e40af',
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(96, 165, 250, 0.1)' 
                              : 'rgba(30, 64, 175, 0.05)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        Learn More
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Performance Overview */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
            Performance Overview
          </Typography>
          
          <Grid container spacing={3}>
            {[
              { 
                label: 'Total Assessments', 
                value: totalAssessments, 
                icon: <AssessmentIcon />, 
                color: 'primary',
                description: 'Completed assessments across all phases'
              },
              { 
                label: 'Best CEFR Level', 
                value: bestLevel, 
                icon: <WorkspacePremiumIcon />, 
                color: 'secondary',
                description: 'Highest achieved proficiency level'
              },
              { 
                label: 'Total XP Earned', 
                value: totalXp, 
                icon: <AutoAwesomeIcon />, 
                color: 'success',
                description: 'Experience points from all activities'
              },
              { 
                label: 'Average Score', 
                value: `${avgXp} XP`, 
                icon: <TrendingUpIcon />, 
                color: 'warning',
                description: 'Average performance per assessment'
              }
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        bgcolor: `${stat.color}.main`,
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: `${stat.color}.main` }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Activity */}
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your latest assessment progress and achievements
                </Typography>
              </Box>
              {(recent_assessments?.length || phase2_progress?.responses?.length) && (
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<LaunchIcon />}
                  href="/results"
                  sx={{ borderRadius: 2 }}
                >
                  View All Activity
                </Button>
              )}
            </Stack>
            
            {/* Recent Activity */}
            {(recent_assessments?.length || hasPhase2Progress) ? (
              <Box>
                {/* Phase 1 Recent Assessments */}
                {recent_assessments?.length > 0 && (
                  <Box sx={{ mb: hasPhase2Progress ? 4 : 0 }}>
                    <Typography variant="subtitle1" color="secondary.main" sx={{ fontWeight: 600, mb: 2 }}>
                      Phase 1 - Foundation Assessments
                    </Typography>
                    <Stack spacing={2}>
                      {recent_assessments.slice(0, 3).map((assessment, idx) => (
                        <Box key={idx} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box sx={{ flex: 1 }}>
                              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                <Chip size="small" label={assessment.cefr_level} color="secondary" />
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  Assessment #{assessment.id} - {assessment.cefr_level} Level
                                </Typography>
                                {assessment.completed_at && (
                                  <Chip 
                                    size="small" 
                                    label="Completed" 
                                    color="success" 
                                    variant="outlined"
                                    icon={<CheckCircleIcon />}
                                  />
                                )}
                              </Stack>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                  <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                  {assessment.completed_at ? new Date(assessment.completed_at).toLocaleDateString() : 'In Progress'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <AutoAwesomeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                  {assessment.total_xp} XP
                                </Typography>
                                {assessment.ai_responses > 0 && (
                                  <Chip size="small" label={`${assessment.ai_responses} AI Detected`} color="warning" variant="outlined" />
                                )}
                              </Stack>
                            </Box>
                            <Stack direction="row" spacing={1}>
                              {!assessment.completed_at && (
                                <Button 
                                  size="small"
                                  variant="contained" 
                                  color="secondary"
                                  href="/game"
                                  sx={{ borderRadius: 1.5 }}
                                >
                                  Continue
                                </Button>
                              )}
                              <Button 
                                size="small"
                                variant="outlined" 
                                href="/results"
                                sx={{ borderRadius: 1.5 }}
                              >
                                View Results
                              </Button>
                            </Stack>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
                
                {/* Phase 2 Recent Activity */}
                {hasPhase2Progress && (
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 600 }}>
                        Phase 2 - Cultural Event Planning
                      </Typography>
                      {currentPhase2Step && (
                        <Button 
                          size="small"
                          variant="contained" 
                          color="primary"
                          href={`/phase2/step/${currentPhase2Step}`}
                          sx={{ borderRadius: 1.5 }}
                        >
                          Continue Phase 2
                        </Button>
                      )}
                    </Stack>
                    
                    {/* Show recent responses and remedial activities */}
                    {(() => {
                      // Combine regular responses and remedial activities
                      const allActivity = []
                      
                      // Add regular responses
                      if (phase2_progress?.responses?.length > 0) {
                        phase2_progress.responses.forEach(r => {
                          allActivity.push({
                            type: 'response',
                            ...r,
                            timestamp: r.submitted_at,
                            title: `${String(r.step_id || '').replaceAll('_', ' ')} - Step ${r.action_item_id?.slice(-1)}`,
                            continueUrl: `/phase2/step/${r.step_id}`
                          })
                        })
                      }
                      
                      // Add remedial activities
                      if (phase2_progress?.remedial_activities?.length > 0) {
                        phase2_progress.remedial_activities.forEach(rem => {
                          allActivity.push({
                            type: 'remedial',
                            ...rem,
                            timestamp: rem.submitted_at,
                            title: `${String(rem.step_id || '').replaceAll('_', ' ')} - ${rem.level} Practice`,
                            continueUrl: `/phase2/remedial/${rem.step_id}/${rem.level}`
                          })
                        })
                      }
                      
                      // Sort by timestamp, most recent first
                      allActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      
                      return allActivity.length > 0 ? (
                        <Stack spacing={2}>
                          {allActivity.slice(0, 3).map((activity, idx) => (
                            <Box key={idx} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box sx={{ flex: 1 }}>
                                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                    <Chip 
                                      size="small" 
                                      label={activity.type === 'remedial' ? activity.level : activity.cefr_level} 
                                      color={activity.type === 'remedial' ? 'secondary' : 'primary'} 
                                    />
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                      {activity.title}
                                    </Typography>
                                    {activity.type === 'remedial' && (
                                      <Chip size="small" label="Practice" variant="outlined" color="secondary" />
                                    )}
                                  </Stack>
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                      <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                      {String(activity.timestamp || '').split('T')[0]}
                                    </Typography>
                                    {activity.points_earned && (
                                      <Typography variant="body2" color="text.secondary">
                                        <AutoAwesomeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                        +{activity.points_earned} XP
                                      </Typography>
                                    )}
                                    {activity.ai_detected && (
                                      <Chip size="small" label="AI Detected" color="warning" variant="outlined" />
                                    )}
                                  </Stack>
                                </Box>
                                <Button 
                                  size="small"
                                  variant="outlined" 
                                  href={activity.continueUrl}
                                  sx={{ borderRadius: 1.5 }}
                                >
                                  {activity.type === 'remedial' ? 'Continue' : 'Review'}
                                </Button>
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      ) : null
                    })()}
                    
                    {/* Show step progress if no responses but has steps */}
                    {(!phase2_progress?.responses?.length && phase2_progress?.steps?.length > 0) && (
                      <Stack spacing={2}>
                        {phase2_progress.steps.slice(-3).map((step, idx) => (
                          <Box key={idx} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                  <Chip 
                                    size="small" 
                                    label={step.completed_at ? "Completed" : "In Progress"} 
                                    color={step.completed_at ? "success" : "primary"} 
                                  />
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {String(step.step_id || '').replaceAll('_', ' ')}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Typography variant="body2" color="text.secondary">
                                    <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                    {step.started_at ? new Date(step.started_at).toLocaleDateString() : 'Started'}
                                  </Typography>
                                </Stack>
                              </Box>
                              <Button 
                                size="small"
                                variant={step.completed_at ? "outlined" : "contained"}
                                color="primary"
                                href={`/phase2/step/${step.step_id}`}
                                sx={{ borderRadius: 1.5 }}
                              >
                                {step.completed_at ? "Review" : "Continue"}
                              </Button>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.100', mx: 'auto', mb: 2 }}>
                  <HistoryIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                </Avatar>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start your first assessment to see your progress here
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<PlayArrowIcon />}
                  href="/game"
                  sx={{ borderRadius: 2 }}
                >
                  Start Assessment
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>

      {/* First-Time User Onboarding Modal */}
      <Dialog 
        open={showOnboarding} 
        onClose={() => setShowOnboarding(false)}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: 'primary.main', 
                mx: 'auto', 
                mb: 2 
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Welcome to FARDI! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Let's get you started with your English assessment journey
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3 }}>
          <Stepper orientation="vertical" sx={{ mb: 3 }}>
            <Step active>
              <StepLabel>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Take Your First Assessment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete 9 workplace scenarios to discover your CEFR level (15-20 minutes)
                </Typography>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  View Your Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get detailed feedback, skills breakdown, and certificate
                </Typography>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Continue with Phase 2
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Practice advanced teamwork scenarios (optional)
                </Typography>
              </StepLabel>
            </Step>
          </Stepper>

          <Paper sx={{ p: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
              🚀 Quick Start Tips
            </Typography>
            <List dense>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="No preparation needed - just be yourself!"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Answer naturally in your own words"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="You can save and resume anytime"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Paper>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setShowOnboarding(false)}
            color="inherit"
          >
            I'll explore first
          </Button>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<PlayArrowIcon />}
            href="/game"
            sx={{ px: 4 }}
          >
            Start My Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}