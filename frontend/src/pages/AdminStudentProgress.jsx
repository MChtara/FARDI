/**
 * Admin Student Progress Page
 * Comprehensive view of student progress, responses, and AI evaluations
 */
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Stack, Button, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, LinearProgress, Accordion, AccordionSummary,
  AccordionDetails, Alert, Divider, Tabs, Tab, List, ListItem,
  ListItemText, Avatar, Badge, Tooltip
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import AssessmentIcon from '@mui/icons-material/Assessment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import WarningIcon from '@mui/icons-material/Warning'
import InfoIcon from '@mui/icons-material/Info'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AdminStudentProgress() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    loadStudentData()
  }, [userId])

  const loadStudentData = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/student/${userId}/progress`, {
        credentials: 'include'
      })

      if (!res.ok) {
        throw new Error('Failed to load student data')
      }

      const result = await res.json()
      if (result.success) {
        setData(result.data)
      } else {
        throw new Error(result.error || 'Unknown error')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading student data...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')} sx={{ mt: 2 }}>
          Back to Admin Dashboard
        </Button>
      </Box>
    )
  }

  if (!data) return null

  const { user, phase1_history, phase2_progress, responses_with_ai, remedial_with_ai, summary } = data

  const getScoreColor = (score, max = 100) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'success'
    if (percentage >= 50) return 'warning'
    return 'error'
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/admin')}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <PersonIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{user.username} • {user.email}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={loadStudentData}>
          Refresh
        </Button>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SchoolIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Current CEFR Level
                  </Typography>
                  <Typography variant="h6">
                    {summary.current_level || 'Not Assessed'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AssessmentIcon color="success" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phase 2 Score
                  </Typography>
                  <Typography variant="h6">
                    {summary.phase2_score} / {summary.phase2_max}
                  </Typography>
                  <Typography variant="caption" color={getScoreColor(summary.phase2_percentage)}>
                    {summary.phase2_percentage}%
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleIcon color="info" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Steps Completed
                  </Typography>
                  <Typography variant="h6">
                    {summary.steps_completed} / 4
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SmartToyIcon color="secondary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    AI Evaluations
                  </Typography>
                  <Typography variant="h6">
                    {responses_with_ai.length + remedial_with_ai.filter(a => a.ai_evaluation).length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable">
          <Tab label={`Phase 1 History (${phase1_history.length})`} />
          <Tab label={`Phase 2 Responses (${responses_with_ai.length})`} />
          <Tab label={`Remedial Activities (${remedial_with_ai.length})`} />
          <Tab label="AI Evaluations" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {phase1_history.length === 0 ? (
          <Alert severity="info">No Phase 1 assessments completed yet.</Alert>
        ) : (
          <Stack spacing={2}>
            {phase1_history.map((attempt, idx) => (
              <Accordion key={idx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                    <Chip label={attempt.overall_level} color="primary" size="small" />
                    <Typography variant="body2">
                      {formatTimestamp(attempt.timestamp)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {attempt.total_xp} XP earned
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>Skill Levels:</Typography>
                      <Stack spacing={1}>
                        {Object.entries(attempt.skill_levels || {}).map(([skill, level]) => (
                          <Box key={skill}>
                            <Typography variant="caption">{skill}:</Typography>
                            <Chip label={level} size="small" sx={{ ml: 1 }} />
                          </Box>
                        ))}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>Details:</Typography>
                      <Typography variant="body2">Time taken: {Math.round(attempt.time_taken / 60)} minutes</Typography>
                      <Typography variant="body2">Achievements: {attempt.achievements_earned?.length || 0}</Typography>
                      {attempt.ai_detected_percentage > 0 && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                          AI detection: {attempt.ai_detected_percentage}% of responses
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {responses_with_ai.length === 0 ? (
          <Alert severity="info">No Phase 2 responses yet.</Alert>
        ) : (
          <Stack spacing={2}>
            {responses_with_ai.map((response, idx) => (
              <Accordion key={idx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                    <Chip label={response.step_id} size="small" />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {response.action_item_id}
                    </Typography>
                    {response.ai_evaluation && (
                      <Chip icon={<SmartToyIcon />} label="AI Evaluated" color="secondary" size="small" />
                    )}
                    <Chip
                      label={`${response.score || 0}/10`}
                      color={getScoreColor(response.score || 0, 10)}
                      size="small"
                    />
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Student Response:</Typography>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body2">{response.response_text}</Typography>
                      </Paper>
                    </Box>

                    {response.ai_evaluation && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          <SmartToyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          AI Evaluation:
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                          <Stack spacing={1}>
                            <Box>
                              <Chip
                                label={`Score: ${response.ai_evaluation.score || 0}/100`}
                                color={getScoreColor(response.ai_evaluation.score || 0)}
                                size="small"
                              />
                              {response.ai_evaluation.level_alignment && (
                                <Chip
                                  label={`Level: ${response.ai_evaluation.level_alignment}`}
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>

                            {response.ai_evaluation.feedback && (
                              <Typography variant="body2">
                                <strong>Feedback:</strong> {response.ai_evaluation.feedback}
                              </Typography>
                            )}

                            {response.ai_evaluation.strengths && response.ai_evaluation.strengths.length > 0 && (
                              <Box>
                                <Typography variant="caption" color="success.main">
                                  <ThumbUpIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                  Strengths:
                                </Typography>
                                <List dense>
                                  {response.ai_evaluation.strengths.map((strength, i) => (
                                    <ListItem key={i}>
                                      <ListItemText primary={strength} />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}

                            {response.ai_evaluation.improvements && response.ai_evaluation.improvements.length > 0 && (
                              <Box>
                                <Typography variant="caption" color="warning.main">
                                  <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                  Areas for Improvement:
                                </Typography>
                                <List dense>
                                  {response.ai_evaluation.improvements.map((improvement, i) => (
                                    <ListItem key={i}>
                                      <ListItemText primary={improvement} />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Stack>
                        </Paper>
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Submitted: {formatTimestamp(response.timestamp)}
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {remedial_with_ai.length === 0 ? (
          <Alert severity="info">No remedial activities completed yet.</Alert>
        ) : (
          <Stack spacing={2}>
            {remedial_with_ai.map((activity, idx) => (
              <Accordion key={idx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
                    <Chip label={activity.step_id} size="small" />
                    <Chip label={activity.level} color="primary" size="small" />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      Activity {activity.activity_index}
                    </Typography>
                    {activity.completed ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <AccessTimeIcon color="disabled" />
                    )}
                    {activity.ai_evaluation && (
                      <Chip icon={<SmartToyIcon />} label="AI Evaluated" color="secondary" size="small" />
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Student Responses:</Typography>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                        {Object.entries(activity.responses || {}).map(([key, value]) => (
                          <Box key={key} sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">{key}:</Typography>
                            <Typography variant="body2">{value}</Typography>
                          </Box>
                        ))}
                      </Paper>
                    </Box>

                    {activity.ai_evaluation && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          <SmartToyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          AI Evaluation:
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'secondary.50' }}>
                          <Stack spacing={1}>
                            <Chip
                              label={`Score: ${activity.ai_evaluation.score || activity.score || 0}`}
                              color={getScoreColor(activity.ai_evaluation.score || activity.score || 0)}
                              size="small"
                            />
                            {activity.ai_evaluation.feedback && (
                              <Typography variant="body2">{activity.ai_evaluation.feedback}</Typography>
                            )}
                          </Stack>
                        </Paper>
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Completed: {formatTimestamp(activity.timestamp)}
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Stack spacing={3}>
          {/* Summary stats */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Total AI Evaluations</Typography>
                  <Typography variant="h3">
                    {responses_with_ai.filter(r => r.ai_evaluation).length +
                     remedial_with_ai.filter(a => a.ai_evaluation).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Average AI Score</Typography>
                  <Typography variant="h3" color="primary.main">
                    {(() => {
                      const scores = [
                        ...responses_with_ai.filter(r => r.ai_evaluation?.score).map(r => r.ai_evaluation.score),
                        ...remedial_with_ai.filter(a => a.ai_evaluation?.score).map(a => a.ai_evaluation.score)
                      ]
                      return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
                    })()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Success Rate</Typography>
                  <Typography variant="h3" color="success.main">
                    {(() => {
                      const scores = [
                        ...responses_with_ai.filter(r => r.ai_evaluation?.score).map(r => r.ai_evaluation.score),
                        ...remedial_with_ai.filter(a => a.ai_evaluation?.score).map(a => a.ai_evaluation.score)
                      ]
                      const passing = scores.filter(s => s >= 70).length
                      return scores.length > 0 ? Math.round((passing / scores.length) * 100) : 0
                    })()}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* All evaluations combined */}
          <Typography variant="h6">All AI Evaluations</Typography>
          <Alert severity="info" icon={<InfoIcon />}>
            This section shows all AI-powered evaluations for writing tasks and remedial activities.
          </Alert>

          {[...responses_with_ai.filter(r => r.ai_evaluation),
            ...remedial_with_ai.filter(a => a.ai_evaluation).map(a => ({
              ...a,
              response_text: JSON.stringify(a.responses),
              isRemedial: true
            }))].map((item, idx) => (
            <Paper key={idx} sx={{ p: 2 }} variant="outlined">
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {item.isRemedial ? (
                    <>
                      <Chip label="Remedial" size="small" color="secondary" />
                      <Chip label={item.level} size="small" />
                    </>
                  ) : (
                    <Chip label="Phase 2 Response" size="small" color="primary" />
                  )}
                  <Chip
                    label={`Score: ${item.ai_evaluation.score || 0}`}
                    color={getScoreColor(item.ai_evaluation.score || 0)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {formatTimestamp(item.timestamp)}
                  </Typography>
                </Stack>

                <Typography variant="body2" color="primary.main">
                  {item.ai_evaluation.feedback}
                </Typography>

                {item.ai_evaluation.level_alignment && (
                  <Chip
                    label={`Level Alignment: ${item.ai_evaluation.level_alignment}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </TabPanel>
    </Box>
  )
}
