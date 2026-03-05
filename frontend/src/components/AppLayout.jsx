import React from 'react'
import { Outlet, Link as RouterLink, useLocation, Navigate } from 'react-router-dom'
import {
  Box, Typography, Stack, Button, Avatar, Chip, IconButton, Tooltip,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonIcon from '@mui/icons-material/Person'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SchoolIcon from '@mui/icons-material/School'
import GroupIcon from '@mui/icons-material/Group'
import StorefrontIcon from '@mui/icons-material/Storefront'
import CampaignIcon from '@mui/icons-material/Campaign'
import BuildIcon from '@mui/icons-material/Build'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MapIcon from '@mui/icons-material/Map'
import LogoutIcon from '@mui/icons-material/Logout'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import MenuIcon from '@mui/icons-material/Menu'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import SecurityIcon from '@mui/icons-material/Security'
import { useColorMode } from '../theme.jsx'
import { useAuth } from '../lib/api.jsx'
import { useUserStats } from '../hooks/useUserStats.jsx'

const SIDEBAR_W = 260

const PHASES = [
  { id: 1, title: 'Foundation', subtitle: 'Language Assessment', icon: SchoolIcon, color: '#6366f1', path: '/game' },
  { id: 2, title: 'Cultural Planning', subtitle: 'Event Organization', icon: GroupIcon, color: '#0ea5e9', path: '/phase2/intro' },
  { id: 3, title: 'Vendors & Budget', subtitle: 'Negotiation', icon: StorefrontIcon, color: '#10b981', path: '/phase3/step/1' },
  { id: 4, title: 'Marketing', subtitle: 'Promotion & Outreach', icon: CampaignIcon, color: '#f97316', path: '/phase4/step/1' },
  { id: 5, title: 'Execution', subtitle: 'Problem-Solving', icon: BuildIcon, color: '#ef4444', path: '/phase5/subphase/1/step/1' },
  { id: 6, title: 'Reflection', subtitle: 'Evaluation & Feedback', icon: AutoStoriesIcon, color: '#8b5cf6', path: '/phase6/subphase/1/step/1' },
]

export default function AppLayout() {
  const { user, loading } = useAuth()
  const { mode, toggle } = useColorMode()
  const { stats, loading: statsLoading } = useUserStats()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Close drawer on route change
  React.useEffect(() => { setMobileOpen(false) }, [location.pathname])

  if (loading || statsLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white' }}>
        <Typography sx={{ color: '#94a3b8' }}>Loading...</Typography>
      </Box>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const userName = user?.first_name || user?.username || 'User'
  const userLevel = stats?.best_level || stats?.overall_level || null
  const isAdmin = user?.is_admin === 1 || user?.role === 'admin'
  const hasCompletedPhase1 = stats?.total_assessments > 0
  const phaseCompletion = stats?.phase_completion || []
  const isPhaseComplete = (n) => phaseCompletion.some(pc => pc.phase_number === n && pc.completed)
  const hasCompletedPhase2 = isPhaseComplete(2) || (stats?.phase2_completed_steps || 0) >= 9
  const hasCompletedPhase3 = isPhaseComplete(3)
  const hasCompletedPhase4 = isPhaseComplete(4)
  const hasCompletedPhase5 = isPhaseComplete(5)

  const getPhaseUnlocked = (id) => {
    switch (id) {
      case 1: return true
      case 2: return hasCompletedPhase1
      case 3: return hasCompletedPhase2
      case 4: return hasCompletedPhase3
      case 5: return hasCompletedPhase4
      case 6: return hasCompletedPhase5
      default: return false
    }
  }

  const getPhaseCompleted = (id) => {
    switch (id) {
      case 1: return hasCompletedPhase1
      case 2: return hasCompletedPhase2
      case 3: return hasCompletedPhase3
      case 4: return hasCompletedPhase4
      case 5: return hasCompletedPhase5
      case 6: return isPhaseComplete(6)
      default: return false
    }
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  // ── Sidebar content (shared desktop + mobile) ──
  const sidebar = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'white' }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, borderBottom: '1px solid #f1f5f9' }}>
        <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Box sx={{
            width: 34, height: 34, borderRadius: 2.5,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 18, color: 'white' }} />
          </Box>
          <Typography sx={{
            fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            FARDI
          </Typography>
        </RouterLink>
      </Box>

      {/* Nav links */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 2 }}>
        {isAdmin ? (
          <>
            {/* Admin badge */}
            <Box sx={{ px: 1, mb: 2 }}>
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 1.5, py: 0.8, borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f108, #8b5cf608)',
                border: '1px solid #6366f115',
              }}>
                <SecurityIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Admin Panel
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ px: 1, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Overview
            </Typography>
            <List disablePadding>
              {[
                { to: '/admin', icon: <DashboardIcon />, label: 'Dashboard', color: '#6366f1' },
                { to: '/admin/analytics', icon: <BarChartIcon />, label: 'Analytics', color: '#0ea5e9' },
              ].map((item) => {
                const active = location.pathname === item.to
                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink} to={item.to}
                      sx={{
                        borderRadius: 2.5, py: 1, px: 1.5,
                        bgcolor: active ? `${item.color}10` : 'transparent',
                        '&:hover': { bgcolor: '#f8fafc' },
                      }}
                    >
                      <ListItemIcon sx={{ color: active ? item.color : '#94a3b8', minWidth: 36 }}>
                        {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                      </ListItemIcon>
                      <ListItemText primary={
                        <Typography sx={{ fontWeight: active ? 650 : 500, fontSize: '0.88rem', color: active ? item.color : '#475569' }}>
                          {item.label}
                        </Typography>
                      } />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>

            <Typography sx={{ px: 1, mt: 2.5, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Students
            </Typography>
            <List disablePadding>
              {[
                { to: '/admin/users', icon: <PeopleIcon />, label: 'All Students', color: '#10b981', match: '/admin/users' },
              ].map((item) => {
                const active = isActive(item.match || item.to)
                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink} to={item.to}
                      sx={{
                        borderRadius: 2.5, py: 1, px: 1.5,
                        bgcolor: active ? `${item.color}10` : 'transparent',
                        '&:hover': { bgcolor: '#f8fafc' },
                      }}
                    >
                      <ListItemIcon sx={{ color: active ? item.color : '#94a3b8', minWidth: 36 }}>
                        {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                      </ListItemIcon>
                      <ListItemText primary={
                        <Typography sx={{ fontWeight: active ? 650 : 500, fontSize: '0.88rem', color: active ? item.color : '#475569' }}>
                          {item.label}
                        </Typography>
                      } />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>

            <Typography sx={{ px: 1, mt: 2.5, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Communication
            </Typography>
            <List disablePadding>
              {[
                { to: '/admin/chat', icon: <ChatBubbleOutlineIcon />, label: 'Messages', color: '#f97316', match: '/admin/chat' },
              ].map((item) => {
                const active = isActive(item.match || item.to)
                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink} to={item.to}
                      sx={{
                        borderRadius: 2.5, py: 1, px: 1.5,
                        bgcolor: active ? `${item.color}10` : 'transparent',
                        '&:hover': { bgcolor: '#f8fafc' },
                      }}
                    >
                      <ListItemIcon sx={{ color: active ? item.color : '#94a3b8', minWidth: 36 }}>
                        {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                      </ListItemIcon>
                      <ListItemText primary={
                        <Typography sx={{ fontWeight: active ? 650 : 500, fontSize: '0.88rem', color: active ? item.color : '#475569' }}>
                          {item.label}
                        </Typography>
                      } />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>

            <Typography sx={{ px: 1, mt: 2.5, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Account
            </Typography>
            <List disablePadding>
              {[
                { to: '/profile', icon: <PersonIcon />, label: 'Profile', color: '#64748b' },
              ].map((item) => {
                const active = isActive(item.to)
                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink} to={item.to}
                      sx={{ borderRadius: 2.5, py: 1, px: 1.5, bgcolor: active ? '#6366f108' : 'transparent', '&:hover': { bgcolor: '#f8fafc' } }}
                    >
                      <ListItemIcon sx={{ color: active ? '#6366f1' : '#94a3b8', minWidth: 36 }}>
                        {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                      </ListItemIcon>
                      <ListItemText primary={
                        <Typography sx={{ fontWeight: active ? 650 : 500, fontSize: '0.88rem', color: active ? '#6366f1' : '#475569' }}>
                          {item.label}
                        </Typography>
                      } />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </>
        ) : (
          <>
            <Typography sx={{ px: 1, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Menu
            </Typography>
            <List disablePadding>
              {[
                { to: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
                { to: '/chat', icon: <ChatBubbleOutlineIcon />, label: 'Messages' },
                { to: '/profile', icon: <PersonIcon />, label: 'Profile' },
                { to: '/phase-journey', icon: <MapIcon />, label: 'Learning Journey' },
              ].map((item) => {
                const active = isActive(item.to)
                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink} to={item.to}
                      sx={{
                        borderRadius: 2.5, py: 1, px: 1.5,
                        bgcolor: active ? '#6366f108' : 'transparent',
                        '&:hover': { bgcolor: '#f8fafc' },
                      }}
                    >
                      <ListItemIcon sx={{ color: active ? '#6366f1' : '#94a3b8', minWidth: 36 }}>
                        {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                      </ListItemIcon>
                      <ListItemText primary={
                        <Typography sx={{ fontWeight: active ? 650 : 500, fontSize: '0.88rem', color: active ? '#6366f1' : '#475569' }}>
                          {item.label}
                        </Typography>
                      } />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>

            {/* Phases */}
            <Typography sx={{ px: 1, mt: 2.5, mb: 1, fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Phases
            </Typography>
            <List disablePadding>
              {PHASES.map((phase) => {
                const unlocked = getPhaseUnlocked(phase.id)
                const completed = getPhaseCompleted(phase.id)
                const IconComp = phase.icon
                const active = isActive(phase.path) ||
                  (phase.id === 1 && isActive('/game')) ||
                  (phase.id === 2 && isActive('/phase2')) ||
                  (phase.id === 3 && isActive('/phase3')) ||
                  (phase.id === 4 && isActive('/phase4')) ||
                  (phase.id === 5 && isActive('/phase5')) ||
                  (phase.id === 6 && isActive('/phase6'))

                return (
                  <ListItem key={phase.id} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={unlocked ? RouterLink : 'div'}
                      to={unlocked ? phase.path : undefined}
                      disabled={!unlocked}
                      sx={{
                        borderRadius: 2.5, py: 1, px: 1.5,
                        opacity: unlocked ? 1 : 0.5,
                        bgcolor: active ? `${phase.color}08` : 'transparent',
                        '&:hover': unlocked ? { bgcolor: '#f8fafc' } : {},
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Avatar sx={{
                          width: 28, height: 28,
                          background: unlocked ? `linear-gradient(135deg, ${phase.color}, ${phase.color}cc)` : '#f1f5f9',
                          boxShadow: unlocked ? `0 2px 6px ${phase.color}30` : 'none',
                        }}>
                          {completed ? (
                            <CheckCircleIcon sx={{ fontSize: 14, color: 'white' }} />
                          ) : !unlocked ? (
                            <LockIcon sx={{ fontSize: 13, color: '#cbd5e1' }} />
                          ) : (
                            <IconComp sx={{ fontSize: 14, color: 'white' }} />
                          )}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: active ? 650 : 500, fontSize: '0.85rem', color: unlocked ? (active ? phase.color : '#475569') : '#94a3b8' }}>
                            Phase {phase.id}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {phase.title}
                          </Typography>
                        }
                      />
                      {completed && (
                        <Chip size="small" label="Done" sx={{
                          height: 18, fontSize: '0.6rem', fontWeight: 700,
                          bgcolor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                        }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </>
        )}

        {/* Theme toggle */}
        <Divider sx={{ my: 2, mx: 0.5 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={toggle} sx={{ borderRadius: 2.5, py: 1, px: 1.5, '&:hover': { bgcolor: '#f8fafc' } }}>
            <ListItemIcon sx={{ color: '#94a3b8', minWidth: 36 }}>
              {mode === 'light' ? <DarkModeIcon sx={{ fontSize: 20 }} /> : <LightModeIcon sx={{ fontSize: 20 }} />}
            </ListItemIcon>
            <ListItemText primary={
              <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: '#475569' }}>
                {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Typography>
            } />
          </ListItemButton>
        </ListItem>
      </Box>

      {/* User section (pinned bottom) */}
      <Box sx={{ borderTop: '1px solid #f1f5f9', p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            fontSize: '0.85rem', fontWeight: 700,
            boxShadow: '0 2px 6px rgba(99,102,241,0.25)',
          }}>
            {userName[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName}
            </Typography>
            {isAdmin ? (
              <Chip size="small" label="Admin" sx={{
                height: 18, mt: 0.3, fontSize: '0.6rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #dc262610, #ef444410)',
                color: '#dc2626', border: '1px solid #dc262620',
              }} />
            ) : userLevel ? (
              <Chip size="small" label={`CEFR ${userLevel}`} sx={{
                height: 18, mt: 0.3, fontSize: '0.6rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f110, #8b5cf610)',
                color: '#6366f1', border: '1px solid #6366f120',
              }} />
            ) : null}
          </Box>
          <Tooltip title="Logout">
            <IconButton
              href="/auth/logout"
              size="small"
              sx={{
                width: 32, height: 32, borderRadius: 2,
                color: '#94a3b8',
                '&:hover': { bgcolor: '#fef2f2', color: '#ef4444' },
              }}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white' }}>
      {/* Desktop sidebar — fixed */}
      <Box component="nav" sx={{ width: SIDEBAR_W, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
        <Box sx={{
          width: SIDEBAR_W, height: '100vh', position: 'fixed', top: 0, left: 0,
          borderRight: '1px solid #f1f5f9', overflowY: 'auto',
        }}>
          {sidebar}
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_W, border: 'none' },
        }}
      >
        {sidebar}
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', width: { xs: '100%', md: `calc(100% - ${SIDEBAR_W}px)` } }}>
        {/* Mobile header bar */}
        <Box sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          px: 2, py: 1.5,
          borderBottom: '1px solid #f1f5f9',
          bgcolor: 'white',
          position: 'sticky', top: 0, zIndex: 1000,
        }}>
          <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#475569', mr: 1.5 }}>
            <MenuIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Box sx={{
              width: 26, height: 26, borderRadius: 1.5,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 14, color: 'white' }} />
            </Box>
            <Typography sx={{
              fontWeight: 800, fontSize: '1rem',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              FARDI
            </Typography>
          </RouterLink>
        </Box>

        <Outlet />
      </Box>
    </Box>
  )
}
