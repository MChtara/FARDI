import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useApiContext } from '../lib/api.jsx'
import { Box, Paper, Typography, TextField, Button, Stack, FormControlLabel, Checkbox, Alert, InputAdornment, IconButton } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

export default function Login() {
  const { client } = useApiContext()
  const [username_or_email, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await client.login({ username_or_email, password, remember_me: remember })
      // Use the redirect URL from the API response, or fallback to dashboard
      const redirectUrl = result.redirect_url || '/dashboard'
      navigate(redirectUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome Back
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sign in to continue your English learning journey
          </Typography>
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
              <TextField 
                label="Username or Email"
                value={username_or_email}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }
                }}
              />
              
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
                variant="outlined"
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

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
              </Box>

              <Button
                type="submit"
                disabled={loading}
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: theme => loading 
                    ? 'rgba(0, 0, 0, 0.12)' 
                    : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: theme => !loading 
                      ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                      : undefined,
                    transform: loading ? 'none' : 'translateY(-1px)',
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              New to FARDI?{' '}
              <Button
                component={RouterLink}
                to="/signup"
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
                Create an account
              </Button>
            </Typography>
          </Box>
        </Paper>

        {/* Feature highlights */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Join thousands of learners improving their English with FARDI
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            {['AI-powered assessment', 'CEFR certified', 'Cultural immersion'].map((feature, index) => (
              <Typography 
                key={index}
                variant="caption" 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                {feature}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
