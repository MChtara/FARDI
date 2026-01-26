import React from 'react'
import { Avatar as MuiAvatar, Box, Typography } from '@mui/material'

const AVATAR_MAPPING = {
  'Ms. Mabrouki': 'mabrouki.svg',
  'SKANDER': 'skander.svg',
  'Skander': 'skander.svg',
  'Emna': 'emna.svg',
  'Ryan': 'ryan.svg',
  'Lilia': 'lilia.svg',
  'Team': 'mabrouki.svg' // Default to coordinator for team messages
}

const CHARACTER_ROLES = {
  'Ms. Mabrouki': 'Event Coordinator',
  'SKANDER': 'Student Council President',
  'Skander': 'Student Council President',
  'Emna': 'Committee Member',
  'Ryan': 'Committee Member',
  'Lilia': 'Committee Member',
  'Team': 'Team Discussion'
}

export default function Avatar({ speaker, size = 60, showName = true, showRole = false }) {
  const avatarFile = AVATAR_MAPPING[speaker] || 'mabrouki.svg'
  const avatarUrl = `/static/images/avatars/${avatarFile}`
  const role = CHARACTER_ROLES[speaker] || ''

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 1
      }}
    >
      <MuiAvatar
        src={avatarUrl}
        alt={speaker}
        sx={{
          width: size,
          height: size,
          border: '3px solid',
          borderColor: 'primary.main',
          boxShadow: 3,
          '& img': {
            objectFit: 'cover'
          }
        }}
      >
        {speaker?.[0] || 'T'}
      </MuiAvatar>
      
      {showName && (
        <Typography 
          variant="body2" 
          fontWeight="bold" 
          color="primary.main"
          textAlign="center"
        >
          {speaker}
        </Typography>
      )}
      
      {showRole && role && (
        <Typography 
          variant="caption" 
          color="text.secondary"
          textAlign="center"
          sx={{ fontStyle: 'italic' }}
        >
          {role}
        </Typography>
      )}
    </Box>
  )
}

// Character Message Component with Avatar
export function CharacterMessage({ speaker, message, children, showRole = false }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 1
      }}
    >
      <Avatar speaker={speaker} size={50} showName={false} />
      
      <Box sx={{ flex: 1 }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
            {speaker}
          </Typography>
          {showRole && CHARACTER_ROLES[speaker] && (
            <Typography variant="caption" color="text.secondary" display="block">
              {CHARACTER_ROLES[speaker]}
            </Typography>
          )}
        </Box>
        
        {message && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            {message}
          </Typography>
        )}
        
        {children}
      </Box>
    </Box>
  )
}