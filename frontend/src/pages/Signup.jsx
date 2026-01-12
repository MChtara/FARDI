import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useApiContext } from '../lib/api.jsx'
import { Box, Paper, Typography, TextField, Button, Stack, Alert, Grid, InputAdornment, IconButton, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

export default function Signup() {
  const { client } = useApiContext()
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [uStatus, setUStatus] = useState({ loading: false, available: null, message: '' })
  const [eStatus, setEStatus] = useState({ loading: false, available: null, message: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // Live username availability (debounced)
  useEffect(() => {
    if (!form.username) { setUStatus({ loading: false, available: null, message: '' }); return }
    setUStatus(s => ({ ...s, loading: true }))
    const h = setTimeout(async () => {
      try {
        const r = await fetch(`/auth/api/check-username?username=${encodeURIComponent(form.username)}`, { credentials: 'include' })
        const data = await r.json()
        setUStatus({ loading: false, available: !!data.available, message: data.message || '' })
      } catch (err) {
        setUStatus({ loading: false, available: null, message: 'Could not check username' })
      }
    }, 400)
    return () => clearTimeout(h)
  }, [form.username])

  // Live email availability (debounced)
  useEffect(() => {
    if (!form.email) { setEStatus({ loading: false, available: null, message: '' }); return }
    setEStatus(s => ({ ...s, loading: true }))
    const h = setTimeout(async () => {
      try {
        const r = await fetch(`/auth/api/check-email?email=${encodeURIComponent(form.email)}`, { credentials: 'include' })
        const data = await r.json()
        setEStatus({ loading: false, available: !!data.available, message: data.message || '' })
      } catch (err) {
        setEStatus({ loading: false, available: null, message: 'Could not check email' })
      }
    }, 400)
    return () => clearTimeout(h)
  }, [form.email])

  // Password rules inline validation
  const pwRules = useMemo(() => {
    const v = form.password || ''
    return {
      len: v.length >= 8,
      up: /[A-Z]/.test(v),
      low: /[a-z]/.test(v),
      num: /\d/.test(v)
    }
  }, [form.password])

  const canSubmit = Boolean(
    form.username && form.email && form.password &&
    uStatus.available === true && eStatus.available === true &&
    pwRules.len && pwRules.up && pwRules.low && pwRules.num && !loading
  )

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await client.signup(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Box sx={{ width: '100%', maxWidth: 560 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Join FARDI
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Quick registration for your professional CEFR assessment
          </Typography>
          
          {/* Why Create Account Section */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 3, 
              bgcolor: theme => theme.palette.mode === 'dark' 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'rgba(59, 130, 246, 0.05)',
              border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
              borderRadius: 2
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
              Secure your results • Official certificates • Track progress
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Registration takes 30 seconds. Your CEFR assessment is saved permanently.
            </Typography>
          </Paper>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            background: theme => theme.palette.mode === 'dark' 
              ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(30, 41, 59, 0.8) 100%)`
              : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(248, 250, 252, 0.8) 100%)`,
            border: theme => `1px solid ${theme.palette.divider}`,
            backdropFilter: 'blur(10px)'
          }}
        >
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '0.95rem'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="First name" 
                    value={form.first_name} 
                    onChange={onChange('first_name')}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Last name" 
                    value={form.last_name} 
                    onChange={onChange('last_name')}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Username"
                value={form.username}
                onChange={onChange('username')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {uStatus.loading && <CircularProgress size={18} />}
                      {!uStatus.loading && uStatus.available === true && <CheckCircleOutlineIcon color="success" fontSize="small" />}
                      {!uStatus.loading && uStatus.available === false && <ErrorOutlineIcon color="error" fontSize="small" />}
                    </InputAdornment>
                  )
                }}
                helperText={uStatus.message}
                error={uStatus.available === false}
              />

              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={onChange('email')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {eStatus.loading && <CircularProgress size={18} />}
                      {!eStatus.loading && eStatus.available === true && <CheckCircleOutlineIcon color="success" fontSize="small" />}
                      {!eStatus.loading && eStatus.available === false && <ErrorOutlineIcon color="error" fontSize="small" />}
                    </InputAdornment>
                  )
                }}
                helperText={eStatus.message}
                error={eStatus.available === false}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={onChange('password')}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(s => !s)}
                        edge="end"
                        aria-label="toggle password visibility"
                        sx={{ borderRadius: 2 }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Password Requirements */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  borderRadius: 3,
                  backgroundColor: 'background.default'
                }}
              >
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Password Requirements
                </Typography>
                <Grid container spacing={1}>
                  {[
                    { key: 'len', text: 'At least 8 characters' },
                    { key: 'up', text: 'Uppercase letter' },
                    { key: 'low', text: 'Lowercase letter' },
                    { key: 'num', text: 'Number' }
                  ].map((rule, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {pwRules[rule.key] ? 
                          <CheckCircleOutlineIcon color="success" fontSize="small" /> : 
                          <ErrorOutlineIcon color="disabled" fontSize="small" />
                        }
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: pwRules[rule.key] ? 'success.main' : 'text.secondary',
                            fontWeight: pwRules[rule.key] ? 500 : 400
                          }}
                        >
                          {rule.text}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Button
                type="submit"
                disabled={!canSubmit}
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: theme => (!canSubmit || loading)
                    ? 'rgba(0, 0, 0, 0.12)' 
                    : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: theme => (canSubmit && !loading)
                      ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                      : undefined,
                    transform: (canSubmit && !loading) ? 'translateY(-1px)' : 'none',
                  }
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign in
              </Button>
            </Typography>
          </Box>
        </Paper>

        {/* Benefits */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            What you'll get with FARDI
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            {[
              'Free CEFR assessment',
              'AI-powered coaching', 
              'Cultural learning',
              'Progress tracking'
            ].map((benefit, index) => (
              <Typography 
                key={index}
                variant="caption" 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  fontWeight: 500
                }}
              >
                {benefit}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
