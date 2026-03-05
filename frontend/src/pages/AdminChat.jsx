import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Stack, Avatar, TextField, IconButton, InputAdornment,
  Badge, Paper, LinearProgress, Chip
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SearchIcon from '@mui/icons-material/Search'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

export default function AdminChat() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [activeUser, setActiveUser] = useState(null)
  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations', { credentials: 'include' })
      const data = await res.json()
      if (data.success) setConversations(data.data)
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
    if (userId) {
      const user = conversations.find(c => String(c.user_id) === String(userId))
      setActiveUser(user || null)
      loadMessages(userId)
    } else {
      setActiveUser(null)
      setMessages([])
    }
  }, [userId, conversations])

  // Poll for new messages
  useEffect(() => {
    if (!userId) return
    pollRef.current = setInterval(() => {
      loadMessages(userId)
      loadConversations()
    }, 5000)
    return () => clearInterval(pollRef.current)
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return
    setSending(true)
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ receiver_id: parseInt(userId), message: newMessage.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setNewMessage('')
        loadMessages(userId)
        loadConversations()
      }
    } catch {}
    setSending(false)
  }

  const filtered = conversations.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (c.first_name || '').toLowerCase().includes(q) ||
      (c.last_name || '').toLowerCase().includes(q) ||
      (c.username || '').toLowerCase().includes(q)
    )
  })

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ mb: 2, color: '#64748b' }}>Loading messages...</Typography>
        <LinearProgress sx={{ borderRadius: 2 }} />
      </Box>
    )
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    const now = new Date()
    const diffDays = Math.floor((now - d) / 86400000)
    if (diffDays === 0) return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return d.toLocaleDateString('en', { weekday: 'short' })
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 1px)', overflow: 'hidden' }}>
      {/* Sidebar: Student list */}
      <Box sx={{
        width: 320, flexShrink: 0, borderRight: '1px solid #f1f5f9',
        display: 'flex', flexDirection: 'column', bgcolor: 'white',
        ...(userId ? { display: { xs: 'none', md: 'flex' } } : {}),
      }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
            Messages
          </Typography>
          <TextField
            fullWidth size="small" placeholder="Search students..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5, bgcolor: '#f8fafc', fontSize: '0.85rem',
                '& fieldset': { borderColor: '#e2e8f0' },
              },
            }}
          />
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map((c) => {
            const isSelected = String(c.user_id) === String(userId)
            return (
              <Box
                key={c.user_id}
                onClick={() => navigate(`/admin/chat/${c.user_id}`)}
                sx={{
                  px: 2, py: 1.5, cursor: 'pointer',
                  bgcolor: isSelected ? '#6366f106' : 'transparent',
                  borderLeft: isSelected ? '3px solid #6366f1' : '3px solid transparent',
                  '&:hover': { bgcolor: '#f8fafc' },
                  transition: 'all 0.15s',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Badge
                    badgeContent={c.unread_count || 0}
                    color="error"
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
                  >
                    <Avatar sx={{
                      width: 38, height: 38,
                      background: isSelected ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e2e8f0',
                      fontSize: '0.82rem', fontWeight: 700,
                      color: isSelected ? 'white' : '#64748b',
                    }}>
                      {(c.first_name || c.username || '?')[0].toUpperCase()}
                    </Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{
                        fontSize: '0.85rem', fontWeight: c.unread_count ? 700 : 600,
                        color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {c.first_name} {c.last_name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', flexShrink: 0, ml: 1 }}>
                        {formatTime(c.last_message_at)}
                      </Typography>
                    </Stack>
                    <Typography sx={{
                      fontSize: '0.75rem', color: c.unread_count ? '#475569' : '#94a3b8',
                      fontWeight: c.unread_count ? 600 : 400,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {c.last_message || 'No messages yet'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )
          })}
          {filtered.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                {search ? 'No students match' : 'No students registered'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fafbfc' }}>
        {!userId ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
            <Typography sx={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>
              Select a student to start messaging
            </Typography>
          </Box>
        ) : (
          <>
            {/* Chat header */}
            <Box sx={{
              px: 2.5, py: 1.5, borderBottom: '1px solid #f1f5f9', bgcolor: 'white',
              display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              {/* Back button on mobile */}
              <IconButton
                onClick={() => navigate('/admin/chat')}
                sx={{ display: { xs: 'flex', md: 'none' }, color: '#64748b', mr: 0.5 }}
              >
                <Typography sx={{ fontSize: '1.2rem' }}>&larr;</Typography>
              </IconButton>
              <Avatar sx={{
                width: 34, height: 34,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                fontSize: '0.8rem', fontWeight: 700,
              }}>
                {activeUser ? (activeUser.first_name || activeUser.username || '?')[0].toUpperCase() : '?'}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
                  {activeUser ? `${activeUser.first_name} ${activeUser.last_name}` : 'Student'}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  @{activeUser?.username || ''}
                </Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2 }}>
              {messages.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                    No messages yet. Send the first message!
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
          </>
        )}
      </Box>
    </Box>
  )
}
