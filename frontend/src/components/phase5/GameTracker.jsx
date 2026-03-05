import React, { useState, useEffect } from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'

/**
 * Game Tracker Component
 * Displays progress for external games
 * 
 * @param {Object} props
 * @param {number} props.timeElapsed - Time elapsed in seconds
 * @param {number} props.targetTime - Target time in seconds
 * @param {boolean} props.completed - Whether game is completed
 */
export default function GameTracker({ timeElapsed, targetTime, completed }) {
  const progress = Math.min(100, (timeElapsed / targetTime) * 100)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">
          Time: {formatTime(timeElapsed)} / {formatTime(targetTime)}
        </Typography>
        <Typography 
          variant="body2" 
          color={completed ? 'success.main' : 'primary.main'} 
          fontWeight="bold"
        >
          {completed ? '✓ Completed' : `${Math.round(progress)}%`}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 8, 
          borderRadius: 1,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            backgroundColor: completed ? 'success.main' : 'primary.main'
          }
        }} 
      />
    </Box>
  )
}
