import React from 'react'
import { AppBar, Toolbar, Typography, Container, Box, Button, Stack, IconButton, Tooltip, Avatar, Chip, useScrollTrigger, Slide, Badge, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Drawer, List, ListItem, ListItemButton } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/api.jsx'
import { useUserStats } from '../hooks/useUserStats.jsx'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import LogoutIcon from '@mui/icons-material/Logout'
import SchoolIcon from '@mui/icons-material/School'
import HomeIcon from '@mui/icons-material/Home'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import EventIcon from '@mui/icons-material/Event'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LockIcon from '@mui/icons-material/Lock'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useColorMode } from '../theme.jsx'
import { GamificationHeader } from './gamification'


function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({
    target: window,
  })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default function Layout({ children }) {
  const { user, loading } = useAuth()
  const { mode, toggle } = useColorMode()
  const { stats, loading: statsLoading } = useUserStats()
  const location = useLocation()
  const [assessmentMenuAnchor, setAssessmentMenuAnchor] = React.useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const isHomePage = location.pathname === '/'
  const isWelcomePage = location.pathname === '/welcome'
  const userName = user?.first_name || user?.username || 'User'
  const userLevel = stats?.best_level || stats?.overall_level || null
  const hasCompletedPhase1 = stats?.total_assessments > 0 || false
  const isAdmin = user?.is_admin === 1 || user?.role === 'admin'

  // Show loading state instead of null to maintain theme context
  if (loading || statsLoading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  const handleAssessmentMenuOpen = (event) => {
    setAssessmentMenuAnchor(event.currentTarget)
  }

  const handleAssessmentMenuClose = () => {
    setAssessmentMenuAnchor(null)
  }

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false)
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <HideOnScroll>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: mode === 'dark'
              ? 'rgba(15, 23, 42, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${mode === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(229, 231, 235, 0.8)'}`,
            zIndex: 1100,
            boxShadow: mode === 'dark'
              ? '0 1px 3px rgba(0, 0, 0, 0.3)'
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 3 } }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>

              {/* Mobile Menu Button for authenticated users */}
              {!loading && user && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleMobileMenuOpen}
                  sx={{
                    mr: 2,
                    display: { xs: 'block', md: 'none' },
                    color: 'text.primary'
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* Navigation for authenticated users */}
              {!loading && user && (
                <Stack direction="row" spacing={1} sx={{ ml: 'auto', mr: 2, display: { xs: 'none', md: 'flex' } }}>
                  <Button
                    component={RouterLink}
                    to="/"
                    startIcon={<HomeIcon sx={{ fontSize: 18 }} />}
                    variant={location.pathname === '/' ? 'contained' : 'text'}
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.75,
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      minWidth: 80,
                      height: 36,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: location.pathname === '/'
                          ? 'primary.dark'
                          : (mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)')
                      }
                    }}
                  >
                    Home
                  </Button>

                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    startIcon={<DashboardIcon sx={{ fontSize: 18 }} />}
                    variant={location.pathname === '/dashboard' ? 'contained' : 'text'}
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.75,
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      minWidth: 100,
                      height: 36,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: location.pathname === '/dashboard'
                          ? 'primary.dark'
                          : (mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)')
                      }
                    }}
                  >
                    Dashboard
                  </Button>

                  <Button
                    component={RouterLink}
                    to="/profile"
                    startIcon={<PersonIcon sx={{ fontSize: 18 }} />}
                    variant={location.pathname.startsWith('/profile') ? 'contained' : 'text'}
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.75,
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      minWidth: 80,
                      height: 36,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: location.pathname.startsWith('/profile')
                          ? 'primary.dark'
                          : (mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)')
                      }
                    }}
                  >
                    Profile
                  </Button>

                  {/* Admin Dashboard Button - Only show for admin users */}
                  {isAdmin && (
                    <Button
                      component={RouterLink}
                      to="/admin"
                      startIcon={<AdminPanelSettingsIcon sx={{ fontSize: 18 }} />}
                      variant={location.pathname.startsWith('/admin') ? 'contained' : 'text'}
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        px: 2,
                        py: 0.75,
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        minWidth: 80,
                        height: 36,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: location.pathname.startsWith('/admin')
                            ? 'primary.dark'
                            : (mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)')
                        }
                      }}
                    >
                      Admin
                    </Button>
                  )}

                  {/* Assessment Phases Dropdown */}
                  <Button
                    onClick={handleAssessmentMenuOpen}
                    endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
                    variant="text"
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.75,
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      minWidth: 120,
                      height: 36,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)'
                      }
                    }}
                  >
                    Assessments
                  </Button>

                  <Menu
                    anchorEl={assessmentMenuAnchor}
                    open={Boolean(assessmentMenuAnchor)}
                    onClose={handleAssessmentMenuClose}
                    sx={{
                      '& .MuiPaper-root': {
                        borderRadius: 2,
                        mt: 1,
                        minWidth: 200,
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                      }
                    }}
                  >
                    <MenuItem
                      component={RouterLink}
                      to="/game"
                      onClick={handleAssessmentMenuClose}
                    >
                      <ListItemIcon>
                        <EmojiEventsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phase 1: Foundation"
                        secondary="Basic English assessment"
                      />
                    </MenuItem>

                    <Divider />

                    <MenuItem
                      component={hasCompletedPhase1 ? RouterLink : 'div'}
                      to={hasCompletedPhase1 ? "/phase2" : undefined}
                      onClick={handleAssessmentMenuClose}
                      disabled={!hasCompletedPhase1}
                    >
                      <ListItemIcon>
                        {hasCompletedPhase1 ? (
                          <EventIcon fontSize="small" />
                        ) : (
                          <LockIcon fontSize="small" color="disabled" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary="Phase 2: Cultural Events"
                        secondary={hasCompletedPhase1 ? "Interactive committee simulation" : "Complete Phase 1 first"}
                      />
                    </MenuItem>
                  </Menu>
                </Stack>
              )}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
              {!loading && user && (
                <>
                  {/* User info */}
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Chip
                      avatar={
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            fontSize: '0.75rem',
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 600
                          }}
                        >
                          {userName[0].toUpperCase()}
                        </Avatar>
                      }
                      label={userName}
                      variant="outlined"
                      size="small"
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        height: 32,
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)'
                        }
                      }}
                    />
                  </Stack>

                  {/* Mobile user avatar */}
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      display: { xs: 'flex', md: 'none' },
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    {userName[0].toUpperCase()}
                  </Avatar>

                  <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
                    <IconButton
                      color="inherit"
                      onClick={toggle}
                      size="small"
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      {mode === 'light' ? <DarkModeIcon sx={{ fontSize: 20 }} /> : <LightModeIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </Tooltip>

                  <Button
                    href="/auth/logout"
                    startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.75,
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      display: { xs: 'none', sm: 'flex' },
                      height: 36,
                      borderColor: 'error.main',
                      color: 'error.main',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'error.dark',
                        backgroundColor: mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}

              {!loading && !user && (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
                    <IconButton
                      color="inherit"
                      onClick={toggle}
                      size="small"
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      {mode === 'light' ? <DarkModeIcon sx={{ fontSize: 20 }} /> : <LightModeIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </Tooltip>

                  <Stack direction="row" spacing={1}>
                    <Button
                      component={RouterLink}
                      to="/login"
                      startIcon={<LoginIcon sx={{ fontSize: 18 }} />}
                      variant="text"
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        px: 2,
                        py: 0.75,
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        display: { xs: 'none', sm: 'flex' },
                        height: 36,
                        color: 'text.secondary',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)',
                          color: 'primary.main'
                        }
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/signup"
                      startIcon={<PersonAddIcon sx={{ fontSize: 18 }} />}
                      variant="contained"
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        px: 3,
                        py: 0.75,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        height: 36,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'primary.dark'
                        }
                      }}
                    >
                      Sign Up
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Box sx={{
        ...(isHomePage && {
          pt: 0,
          px: 0
        }),
        ...(isWelcomePage && {
          pt: 0,
          px: 0
        })
      }}>
        {(isHomePage || isWelcomePage) ? (
          <Box>
            {children}
          </Box>
        ) : (
          <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
            {children}
          </Container>
        )}
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            bgcolor: mode === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
          },
        }}
      >
        {/* Mobile Menu Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          p: 2,
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(229, 231, 235, 0.8)'}`
        }}>
          <IconButton onClick={handleMobileMenuClose} sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Info Section */}
        {!loading && user && (
          <Box sx={{ p: 2, borderBottom: `1px solid ${mode === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(229, 231, 235, 0.8)'}` }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '1rem', fontWeight: 600 }}>
                {userName[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {userName}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* Navigation Items */}
        {!loading && user && (
          <List sx={{ py: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/"
                onClick={handleMobileMenuClose}
                selected={location.pathname === '/'}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)',
                    '&:hover': {
                      bgcolor: mode === 'dark' ? 'rgba(96, 165, 250, 0.12)' : 'rgba(30, 58, 138, 0.08)',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === '/' ? 'primary.main' : 'text.secondary' }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/dashboard"
                onClick={handleMobileMenuClose}
                selected={location.pathname === '/dashboard'}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)',
                    '&:hover': {
                      bgcolor: mode === 'dark' ? 'rgba(96, 165, 250, 0.12)' : 'rgba(30, 58, 138, 0.08)',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === '/dashboard' ? 'primary.main' : 'text.secondary' }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/profile"
                onClick={handleMobileMenuClose}
                selected={location.pathname.startsWith('/profile')}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)',
                    '&:hover': {
                      bgcolor: mode === 'dark' ? 'rgba(96, 165, 250, 0.12)' : 'rgba(30, 58, 138, 0.08)',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: location.pathname.startsWith('/profile') ? 'primary.main' : 'text.secondary' }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>

            {/* Admin Dashboard - Only show for admin users */}
            {isAdmin && (
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/admin"
                  onClick={handleMobileMenuClose}
                  selected={location.pathname.startsWith('/admin')}
                  sx={{
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: mode === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(30, 58, 138, 0.04)',
                      '&:hover': {
                        bgcolor: mode === 'dark' ? 'rgba(96, 165, 250, 0.12)' : 'rgba(30, 58, 138, 0.08)',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname.startsWith('/admin') ? 'primary.main' : 'text.secondary' }}>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItemButton>
              </ListItem>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Phase 1 */}
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/game"
                onClick={handleMobileMenuClose}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: 'text.secondary' }}>
                  <EmojiEventsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Phase 1: Foundation"
                  secondary="Basic English assessment"
                />
              </ListItemButton>
            </ListItem>

            {/* Phase 2 */}
            <ListItem disablePadding>
              <ListItemButton
                component={hasCompletedPhase1 ? RouterLink : 'div'}
                to={hasCompletedPhase1 ? "/phase2" : undefined}
                onClick={handleMobileMenuClose}
                disabled={!hasCompletedPhase1}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ color: hasCompletedPhase1 ? 'text.secondary' : 'text.disabled' }}>
                  {hasCompletedPhase1 ? <EventIcon /> : <LockIcon />}
                </ListItemIcon>
                <ListItemText
                  primary="Phase 2: Cultural Events"
                  secondary={hasCompletedPhase1 ? "Interactive committee simulation" : "Complete Phase 1 first"}
                />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1 }} />

            {/* Theme Toggle */}
            <ListItem disablePadding>
              <ListItemButton onClick={toggle} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ color: 'text.secondary' }}>
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </ListItemIcon>
                <ListItemText primary={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} />
              </ListItemButton>
            </ListItem>

            {/* Logout */}
            <ListItem disablePadding>
              <ListItemButton
                href="/auth/logout"
                sx={{
                  py: 1.5,
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        )}

        {/* Non-authenticated user options */}
        {!loading && !user && (
          <List sx={{ py: 1 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={toggle} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ color: 'text.secondary' }}>
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </ListItemIcon>
                <ListItemText primary={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/login" onClick={handleMobileMenuClose} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ color: 'text.secondary' }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Sign In" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/signup" onClick={handleMobileMenuClose} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </Drawer>
    </Box>
  )
}