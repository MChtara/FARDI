import React, { useEffect, useState, useRef } from 'react'
import {
  Box, Typography, Stack, Avatar, TextField, IconButton, Paper,
  LinearProgress, Chip
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'

export default function StudentChat() {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations', { credentials: 'include' })
      const data = await res.json()
      if (data.success && data.data.length > 0) {
        setConversations(data.data)
        // Auto-select first admin
        if (!adminUser) {
          setAdminUser(data.data[0])
        }
      }
    } catch {}
    setLoading(false)
  }

  const loadMessages = async (uid) => {
    try {
      const res = await fetch(`/api/chat/messages/${uid}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setMessages(data.data)
    } catch {}
  }

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (adminUser) {
      loadMessages(adminUser.user_id)
    }
  }, [adminUser])

  // Poll for new messages
  useEffect(() => {
    if (!adminUser) return
    pollRef.current = setInterval(() => {
      loadMessages(adminUser.user_id)
    }, 5000)
    return () => clearInterval(pollRef.current)
  }, [adminUser])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !adminUser) return
    setSending(true)
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ receiver_id: adminUser.user_id, message: newMessage.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setNewMessage('')
        loadMessages(adminUser.user_id)
      }
    } catch {}
    setSending(false)
  }

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ mb: 2, color: '#64748b' }}>Loading messages...</Typography>
        <LinearProgress sx={{ borderRadius: 2 }} />
      </Box>
    )
  }

  if (!adminUser) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <SupportAgentIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
        <Typography sx={{ color: '#94a3b8' }}>No instructor available for chat</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 1px)', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{
        px: 2.5, py: 1.5, borderBottom: '1px solid #f1f5f9', bgcolor: 'white',
        display: 'flex', alignItems: 'center', gap: 1.5,
      }}>
        <Avatar sx={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          fontSize: '0.85rem', fontWeight: 700,
        }}>
          <SupportAgentIcon sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
            {adminUser.first_name} {adminUser.last_name}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 500 }}>
            Instructor
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2, bgcolor: '#fafbfc' }}>
        {messages.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <SupportAgentIcon sx={{ fontSize: 40, color: '#e2e8f0', mb: 1 }} />
            <Typography sx={{ color: '#94a3b8', fontSize: '0.92rem', fontWeight: 500 }}>
              Message your instructor
            </Typography>
            <Typography sx={{ color: '#cbd5e1', fontSize: '0.78rem', mt: 0.5 }}>
              Ask questions about your learning progress
            </Typography>
          </Box>
        )}
        {messages.map((msg, i) => {
          const showDate = i === 0 || new Date(messages[i-1].created_at).toDateString() !== new Date(msg.created_at).toDateString()
          return (
            <React.Fragment key={msg.id}>
              {showDate && (
                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <Chip
                    label={new Date(msg.created_at).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
                    size="small"
                    sx={{ fontSize: '0.65rem', bgcolor: '#f1f5f9', color: '#94a3b8', fontWeight: 500 }}
                  />
                </Box>
              )}
              <Box sx={{
                display: 'flex',
                justifyContent: msg.is_mine ? 'flex-end' : 'flex-start',
                mb: 1,
              }}>
                {!msg.is_mine && (
                  <Avatar sx={{
                    width: 28, height: 28, mr: 1, mt: 0.5,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    fontSize: '0.65rem',
                  }}>
                    <SupportAgentIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                )}
                <Paper sx={{
                  px: 2, py: 1, maxWidth: '70%', borderRadius: 3,
                  bgcolor: msg.is_mine ? '#6366f1' : 'white',
                  color: msg.is_mine ? 'white' : '#0f172a',
                  border: msg.is_mine ? 'none' : '1px solid #f1f5f9',
                  boxShadow: msg.is_mine ? '0 1px 4px rgba(99,102,241,0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
                  borderBottomRightRadius: msg.is_mine ? 6 : 16,
                  borderBottomLeftRadius: msg.is_mine ? 16 : 6,
                }}>
                  <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {msg.message}
                  </Typography>
                  <Typography sx={{
                    fontSize: '0.6rem', mt: 0.5,
                    color: msg.is_mine ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                    textAlign: 'right',
                  }}>
                    {new Date(msg.created_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            </React.Fragment>
          )
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid #f1f5f9', bgcolor: 'white' }}>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3, bgcolor: '#f8fafc', fontSize: '0.88rem',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' },
              },
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            sx={{
              width: 40, height: 40, borderRadius: 2.5,
              bgcolor: newMessage.trim() ? '#6366f1' : '#f1f5f9',
              color: newMessage.trim() ? 'white' : '#94a3b8',
              '&:hover': { bgcolor: newMessage.trim() ? '#4f46e5' : '#f1f5f9' },
              '&.Mui-disabled': { bgcolor: '#f1f5f9', color: '#cbd5e1' },
              transition: 'all 0.2s',
            }}
          >
            <SendIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  )
}
