import React, { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Typography, Stack, TextField, InputAdornment, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, IconButton, LinearProgress, Alert, Button, Paper
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PeopleIcon from '@mui/icons-material/People'
import RefreshIcon from '@mui/icons-material/Refresh'

const PHASE_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f97316', '#ef4444', '#8b5cf6']

export default function AdminUserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load users')
      const data = await res.json()
      if (data.success) {
        setUsers(data.data.users || [])
      } else {
        throw new Error(data.error || 'Failed')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const filtered = users.filter(u => {
    if (!search) return !u.is_admin
    const q = search.toLowerCase()
    return !u.is_admin && (
      (u.first_name || '').toLowerCase().includes(q) ||
      (u.last_name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    )
  })

  const getPhaseProgress = (user) => {
    const phases = [
      user.phase1_level ? true : false,
      user.phase2_percentage > 0,
      user.phase3_completed,
      user.phase4_completed,
      user.phase5_completed,
      user.phase6_completed,
    ]
    return phases
  }

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Loading students...</Typography>
        <LinearProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={loadUsers} startIcon={<RefreshIcon />}>Retry</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <PeopleIcon sx={{ fontSize: 28, color: '#10b981' }} />
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
            Students
          </Typography>
          <Chip label={`${filtered.length}`} size="small" sx={{
            fontWeight: 700, bgcolor: '#f1f5f9', color: '#64748b',
          }} />
        </Stack>
        <IconButton onClick={loadUsers} sx={{ color: '#94a3b8' }}>
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search by name, username, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: '#f8fafc',
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#cbd5e1' },
          },
        }}
      />

      {/* Student Cards (mobile) / Table (desktop) */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.78rem' }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.78rem' }}>Level</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.78rem' }}>Phase Progress</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.78rem' }}>Last Active</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.78rem', width: 60 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((user) => {
                const phases = getPhaseProgress(user)
                return (
                  <TableRow key={user.user_id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{
                          width: 34, height: 34,
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          fontSize: '0.8rem', fontWeight: 700,
                        }}>
                          {(user.first_name || user.username || '?')[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.2 }}>
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            @{user.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.phase1_level || 'N/A'}
                        size="small"
                        sx={{
                          fontWeight: 700, fontSize: '0.72rem',
                          bgcolor: user.phase1_level ? '#6366f110' : '#f1f5f9',
                          color: user.phase1_level ? '#6366f1' : '#94a3b8',
                          border: `1px solid ${user.phase1_level ? '#6366f120' : '#e2e8f0'}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.4}>
                        {phases.map((done, i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 22, height: 6, borderRadius: 1,
                              bgcolor: done ? PHASE_COLORS[i] : '#e2e8f0',
                              transition: 'all 0.2s',
                            }}
                            title={`Phase ${i + 1}: ${done ? 'Completed' : 'Not completed'}`}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={RouterLink}
                        to={`/admin/users/${user.user_id}`}
                        size="small"
                        sx={{
                          color: '#94a3b8',
                          '&:hover': { color: '#6366f1', bgcolor: '#6366f108' },
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography sx={{ color: '#94a3b8' }}>
                      {search ? 'No students match your search' : 'No students registered yet'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
