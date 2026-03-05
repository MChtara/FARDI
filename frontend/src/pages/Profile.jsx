import React from 'react'
import { Box, Typography, Stack, Button, Avatar, Chip, Divider, IconButton, Tooltip } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import EditIcon from '@mui/icons-material/Edit'
import LockIcon from '@mui/icons-material/Lock'
import DeleteIcon from '@mui/icons-material/Delete'
import SchoolIcon from '@mui/icons-material/School'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import BadgeIcon from '@mui/icons-material/Badge'
import AssessmentIcon from '@mui/icons-material/Assessment'
import StarIcon from '@mui/icons-material/Star'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useAuth } from '../lib/api.jsx'
import { useUserStats } from '../hooks/useUserStats.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } })
}

export default function Profile() {
  const { user } = useAuth()
  const { stats } = useUserStats()

  const userName = user?.first_name || user?.username || 'User'
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || userName
  const userLevel = stats?.best_level || stats?.overall_level || null
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'
  const totalAssessments = stats?.total_assessments || 0
  const avgScore = stats?.average_score ? Math.round(stats.average_score) : null

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 880, mx: 'auto' }}>

        {/* ── Hero Card ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Box sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid #f1f5f9',
            mb: 3,
          }}>
            {/* Gradient banner */}
            <Box sx={{
              height: 120,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
              position: 'relative',
            }}>
              <Box sx={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)',
              }} />
            </Box>

            {/* Content */}
            <Box sx={{ px: { xs: 2.5, md: 4 }, pb: 3, pt: 0 }}>
              {/* Avatar — overlapping banner */}
              <Avatar sx={{
                width: 88, height: 88,
                mt: -5.5,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                fontSize: '2rem', fontWeight: 800,
                border: '4px solid white',
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              }}>
                {userName[0].toUpperCase()}
              </Avatar>

              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-end' }} justifyContent="space-between" sx={{ mt: 1.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 750, fontSize: '1.5rem', color: '#0f172a', lineHeight: 1.2 }}>
                    {fullName}
                  </Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', mt: 0.3 }}>
                    @{user?.username}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    {userLevel && (
                      <Chip size="small" icon={<SchoolIcon sx={{ fontSize: 14 }} />} label={`CEFR ${userLevel}`} sx={{
                        height: 26, fontSize: '0.75rem', fontWeight: 700,
                        background: 'linear-gradient(135deg, #6366f110, #8b5cf610)',
                        color: '#6366f1', border: '1px solid #6366f120',
                        '& .MuiChip-icon': { color: '#6366f1' },
                      }} />
                    )}
                    <Chip size="small" icon={<CalendarTodayIcon sx={{ fontSize: 13 }} />} label={`Joined ${joinDate}`} sx={{
                      height: 26, fontSize: '0.75rem', fontWeight: 600,
                      bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
                      '& .MuiChip-icon': { color: '#94a3b8' },
                    }} />
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1.5} sx={{ mt: { xs: 2, sm: 0 } }}>
                  <Button
                    component={RouterLink} to="/profile/edit" size="small"
                    startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: 2.5, px: 2.5, py: 0.8, fontWeight: 600,
                      textTransform: 'none', fontSize: '0.85rem',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                      '&:hover': { background: 'linear-gradient(135deg, #5856eb, #4338ca)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' },
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    component={RouterLink} to="/profile/change-password" size="small"
                    startIcon={<LockIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: 2.5, px: 2.5, py: 0.8, fontWeight: 600,
                      textTransform: 'none', fontSize: '0.85rem',
                      bgcolor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1', boxShadow: 'none' },
                    }}
                  >
                    Password
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'CEFR Level', value: userLevel || '—', icon: TrendingUpIcon, color: '#6366f1', bg: '#6366f108' },
              { label: 'Assessments', value: totalAssessments, icon: AssessmentIcon, color: '#0ea5e9', bg: '#0ea5e908' },
              { label: 'Avg Score', value: avgScore ? `${avgScore}%` : '—', icon: StarIcon, color: '#f59e0b', bg: '#f59e0b08' },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <Box key={i} sx={{
                  flex: 1, borderRadius: 3, p: 2.5,
                  border: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', gap: 2,
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: '#e2e8f0' },
                }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: 2.5,
                    bgcolor: stat.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon sx={{ fontSize: 22, color: stat.color }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {stat.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: 750, color: '#0f172a', lineHeight: 1.2, mt: 0.2 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Stack>
        </motion.div>

        {/* ── Account Info + Quick Actions ── */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ mb: 3 }}>
          {/* Account Info */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} style={{ flex: 1 }}>
            <Box sx={{ borderRadius: 3, border: '1px solid #f1f5f9', p: 3, height: '100%' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', mb: 2 }}>
                Account Information
              </Typography>
              <Stack spacing={2.5}>
                {[
                  { icon: EmailIcon, label: 'Email', value: user?.email || 'Not provided' },
                  { icon: PersonIcon, label: 'Username', value: user?.username },
                  { icon: BadgeIcon, label: 'Role', value: user?.is_admin ? 'Administrator' : 'Student', chip: true, chipColor: user?.is_admin ? '#8b5cf6' : '#0ea5e9' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 36, height: 36, borderRadius: 2,
                        bgcolor: '#f8fafc',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon sx={{ fontSize: 18, color: '#94a3b8' }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {item.label}
                        </Typography>
                        {item.chip ? (
                          <Chip size="small" label={item.value} sx={{
                            height: 22, mt: 0.3, fontSize: '0.75rem', fontWeight: 600,
                            bgcolor: `${item.chipColor}10`, color: item.chipColor,
                            border: `1px solid ${item.chipColor}20`,
                          }} />
                        ) : (
                          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.value}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} style={{ flex: 1 }}>
            <Box sx={{ borderRadius: 3, border: '1px solid #f1f5f9', p: 3, height: '100%' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'Edit Profile', desc: 'Update your name and details', to: '/profile/edit', icon: EditIcon, color: '#6366f1' },
                  { label: 'Change Password', desc: 'Update your login credentials', to: '/profile/change-password', icon: LockIcon, color: '#0ea5e9' },
                  { label: 'Learning Journey', desc: 'View your phase progress map', to: '/phase-journey', icon: TrendingUpIcon, color: '#10b981' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Box
                      key={i}
                      component={RouterLink} to={item.to}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 2,
                        p: 1.5, borderRadius: 2.5,
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: '#f8fafc', '& .arrow': { opacity: 1, transform: 'translateX(0)' } },
                      }}
                    >
                      <Box sx={{
                        width: 36, height: 36, borderRadius: 2,
                        bgcolor: `${item.color}08`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon sx={{ fontSize: 18, color: item.color }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {item.desc}
                        </Typography>
                      </Box>
                      <ArrowForwardIcon className="arrow" sx={{ fontSize: 16, color: '#94a3b8', opacity: 0, transform: 'translateX(-4px)', transition: 'all 0.2s' }} />
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          </motion.div>
        </Stack>

        {/* ── Danger Zone ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Box sx={{
            borderRadius: 3, p: 2.5,
            border: '1px solid #fecaca',
            bgcolor: '#fef2f210',
          }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: 2,
                  bgcolor: '#fef2f2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <WarningAmberIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 650, fontSize: '0.9rem', color: '#991b1b' }}>
                    Delete Account
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', mt: 0.2 }}>
                    Permanently remove your account and all data. This cannot be undone.
                  </Typography>
                </Box>
              </Box>
              <Button
                component={RouterLink} to="/profile/delete-account" size="small"
                sx={{
                  borderRadius: 2.5, px: 2.5, py: 0.7, fontWeight: 600,
                  textTransform: 'none', fontSize: '0.82rem',
                  color: '#ef4444', border: '1px solid #fecaca',
                  bgcolor: 'transparent', boxShadow: 'none',
                  '&:hover': { bgcolor: '#fef2f2', borderColor: '#fca5a5', boxShadow: 'none' },
                }}
              >
                Delete Account
              </Button>
            </Stack>
          </Box>
        </motion.div>

      </Box>
    </Box>
  )
}
