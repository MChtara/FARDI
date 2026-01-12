import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Stack, Alert, Checkbox, FormControlLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import WarningIcon from '@mui/icons-material/Warning'
import { useAuth } from '../lib/api.jsx'

export default function DeleteAccount() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationText, setConfirmationText] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)

  const requiredText = 'DELETE MY ACCOUNT'
  const isConfirmationValid = confirmationText === requiredText && acknowledged

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isConfirmationValid) {
      setError('Please complete all confirmation steps')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/auth/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          confirmation: confirmationText
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account')
      }

      // Redirect to goodbye page or home
      window.location.href = '/auth/logout'
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={2} sx={{ p: 4, border: '2px solid', borderColor: 'error.main' }}>
        <Stack alignItems="center" spacing={3} sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <WarningIcon sx={{ fontSize: 30, color: 'white' }} />
          </Box>
          <Typography variant="h4" gutterBottom color="error.main">
            Delete Account
          </Typography>
        </Stack>

        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            This action is permanent and cannot be undone!
          </Typography>
          <Typography variant="body2">
            Deleting your account will permanently remove:
          </Typography>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Your profile information</li>
            <li>All assessment results and progress</li>
            <li>Learning history and achievements</li>
            <li>Any certificates earned</li>
          </ul>
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Account to be deleted:
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {user?.first_name} {user?.last_name} (@{user?.username})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  color="error"
                />
              }
              label="I understand that this action is permanent and cannot be undone"
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Type "{requiredText}" to confirm:
              </Typography>
              <TextField
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                fullWidth
                placeholder={requiredText}
                error={confirmationText && confirmationText !== requiredText}
                helperText={
                  confirmationText && confirmationText !== requiredText
                    ? `Please type exactly: ${requiredText}`
                    : ''
                }
              />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/profile')}
                disabled={loading}
                fullWidth
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                disabled={loading || !isConfirmationValid}
                fullWidth
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}