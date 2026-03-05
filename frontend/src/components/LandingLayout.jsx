import React from 'react'
import { Outlet, Link as RouterLink } from 'react-router-dom'
import { AppBar, Toolbar, Box, Button, Stack, Typography, IconButton, Tooltip, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useColorMode } from '../theme.jsx'
import { useAuth } from '../lib/api.jsx'

export default function LandingLayout() {
  const { user, loading } = useAuth()
  const { mode, toggle } = useColorMode()
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      {/* ── SaaS Top Bar ── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: '1px solid #f1f5f9',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 }, px: { xs: 2, md: 4 }, maxWidth: 1280, width: '100%', mx: 'auto' }}>
          {/* Logo */}
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            <Typography sx={{
              fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              FARDI
            </Typography>
          </RouterLink>

          {/* Desktop right side */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
              <IconButton onClick={toggle} size="small" sx={{
                width: 34, height: 34, borderRadius: 2.5,
                color: '#94a3b8', border: '1px solid #f1f5f9',
                '&:hover': { bgcolor: '#f8fafc', color: '#475569', borderColor: '#e2e8f0' },
              }}>
                {mode === 'light' ? <DarkModeIcon sx={{ fontSize: 18 }} /> : <LightModeIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Tooltip>

            {!loading && !user && (
              <>
                <Button
                  component={RouterLink} to="/login" size="small"
                  sx={{
                    borderRadius: 2.5, px: 2.5, py: 0.6, fontWeight: 600,
                    textTransform: 'none', fontSize: '0.85rem', height: 36,
                    boxShadow: 'none', color: '#475569',
                    '&:hover': { bgcolor: '#f8fafc', color: '#6366f1', boxShadow: 'none' },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink} to="/signup" size="small"
                  sx={{
                    borderRadius: 2.5, px: 3, py: 0.6, fontWeight: 600,
                    textTransform: 'none', fontSize: '0.85rem', height: 36,
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                    '&:hover': { background: 'linear-gradient(135deg, #5856eb, #4338ca)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}

            {!loading && user && (
              <Button
                component={RouterLink} to="/dashboard" size="small"
                sx={{
                  borderRadius: 2.5, px: 3, py: 0.6, fontWeight: 600,
                  textTransform: 'none', fontSize: '0.85rem', height: 36,
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #5856eb, #4338ca)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' },
                }}
              >
                Dashboard
              </Button>
            )}
          </Stack>

          {/* Mobile hamburger */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'flex', sm: 'none' }, color: '#475569' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 280, bgcolor: 'white' },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5 }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#94a3b8' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 1 }}>
          {!loading && !user && (
            <>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton component={RouterLink} to="/login" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 2.5, py: 1.2 }}>
                  <ListItemIcon sx={{ color: '#64748b', minWidth: 40 }}><LoginIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#475569' }}>Sign In</Typography>} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/signup" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 2.5, py: 1.2 }}>
                  <ListItemIcon sx={{ color: '#6366f1', minWidth: 40 }}><PersonAddIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#6366f1' }}>Sign Up</Typography>} />
                </ListItemButton>
              </ListItem>
            </>
          )}
          {!loading && user && (
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/dashboard" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 2.5, py: 1.2 }}>
                <ListItemIcon sx={{ color: '#6366f1', minWidth: 40 }}><AutoAwesomeIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#6366f1' }}>Go to Dashboard</Typography>} />
              </ListItemButton>
            </ListItem>
          )}
          <Divider sx={{ my: 1.5, mx: 1 }} />
          <ListItem disablePadding>
            <ListItemButton onClick={() => { toggle(); setDrawerOpen(false) }} sx={{ borderRadius: 2.5, py: 1.2 }}>
              <ListItemIcon sx={{ color: '#94a3b8', minWidth: 40 }}>
                {mode === 'light' ? <DarkModeIcon sx={{ fontSize: 20 }} /> : <LightModeIcon sx={{ fontSize: 20 }} />}
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#475569' }}>{mode === 'light' ? 'Dark Mode' : 'Light Mode'}</Typography>} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Page content */}
      <Outlet />
    </Box>
  )
}
