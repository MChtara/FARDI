import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * Reusable Loading Spinner Component for Phase 5
 */
export default function LoadingSpinner({ message = 'Loading...', size = 60 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  )
}
