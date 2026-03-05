import React from 'react'
import { Alert, AlertTitle, Button, Box } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

/**
 * Reusable Error Message Component for Phase 5
 */
export default function ErrorMessage({ 
  error, 
  onRetry = null, 
  severity = 'error',
  title = 'Error',
  showRetry = true 
}) {
  if (!error) return null

  return (
    <Alert 
      severity={severity} 
      icon={<ErrorOutlineIcon />}
      sx={{ mb: 2 }}
      action={
        showRetry && onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {typeof error === 'string' ? error : error.message || 'An error occurred'}
    </Alert>
  )
}
