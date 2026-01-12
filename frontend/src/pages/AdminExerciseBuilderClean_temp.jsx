import React, { useState, useEffect } from 'react'
import { 
  Box, Paper, Typography, Grid, Card, CardContent, CardActions, 
  Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions, Tabs, Tab, List, ListItem, ListItemText,
  ListItemSecondaryAction, Fab, Tooltip, Alert, LinearProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  PlayArrow as PlayIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  AccountTree as FlowIcon,
  GetApp as ImportIcon,
  Visibility as ViewIcon,
  Info as InfoIcon,
  Help as HelpIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

// TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export default function AdminExerciseBuilder() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Dialog states
  const [createWorkflowDialog, setCreateWorkflowDialog] = useState(false)
  const [exerciseLibrary, setExerciseLibrary] = useState([])
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    difficulty_level: 'intermediate',
    estimated_time: 30,
    cultural_themes: [],
    tags: []
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load workflows
      const workflowsResponse = await fetch('/api/admin/workflows', {
        credentials: 'include'
      })
      if (workflowsResponse.ok) {
        const workflowsData = await workflowsResponse.json()
        setWorkflows(workflowsData.workflows || [])
      }

      // Load exercise library
      const exerciseResponse = await fetch('/api/admin/exercises/library', {
        credentials: 'include'
      })
      if (exerciseResponse.ok) {
        const exerciseData = await exerciseResponse.json()
        setExerciseLibrary(exerciseData.exercises || [])
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkflow = async () => {
    try {
      const response = await fetch('/api/admin/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newWorkflow)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create workflow')
      }
      
      // Navigate to the workflow editor
      navigate(`/admin/exercises/workflow/${data.workflow.id}/edit`)
      
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEditExercise = (exercise) => {
    navigate(`/admin/exercises/edit/${exercise.id}`)
  }

  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        const response = await fetch(`/api/admin/exercises/library/${exerciseId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (response.ok) {
          setExerciseLibrary(prev => prev.filter(ex => ex.id !== exerciseId))
        } else {
          throw new Error('Failed to delete exercise')
        }
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  if (loading) return <LinearProgress />

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Exercise Builder
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Create and manage interactive learning workflows
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setCreateWorkflowDialog(true)}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            New Workflow
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<TimelineIcon />} label="Workflows" />
          <Tab icon={<AddIcon />} label="Exercise Library" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      
      {/* Workflows Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={2}>
          {workflows.map(workflow => (
            <Grid item xs={12} sm={6} md={4} key={workflow.id}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardContent sx={{ pb: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography 
                      variant="h6" 
                      component="h3"
                      sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {workflow.name}
                    </Typography>
                    <Chip 
                      label={workflow.difficulty_level} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 20,
                        fontWeight: 500
                      }}
                    />
                  </Box>
                  
                  <Typography color="text.secondary" variant="body2" sx={{ 
                    mb: 2,
                    fontSize: '0.875rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {workflow.description || 'No description provided'}
                  </Typography>
                  
                  <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
                    <Chip 
                      label={formatTime(workflow.estimated_time)} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 20,
                        fontWeight: 400
                      }}
                    />
                    {workflow.cultural_themes?.slice(0, 2).map(theme => (
                      <Chip 
                        key={theme} 
                        label={theme} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 20,
                          fontWeight: 400
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
                
                <CardActions sx={{ pt: 0, pb: 1, px: 2 }}>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon sx={{ fontSize: '16px' }} />}
                    onClick={() => navigate(`/admin/exercises/workflow/${workflow.id}/edit`)}
                    sx={{ fontSize: '0.75rem', py: 0.5 }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<PreviewIcon sx={{ fontSize: '16px' }} />}
                    onClick={() => navigate(`/admin/exercises/workflow/${workflow.id}/preview`)}
                    sx={{ fontSize: '0.75rem', py: 0.5 }}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          
          {workflows.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>No Workflows Created</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Start building your first learning workflow to create engaging educational experiences
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => setCreateWorkflowDialog(true)}
                >
                  Create Your First Workflow
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Exercise Library Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          {/* Create Exercise Button */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Exercise Library ({exerciseLibrary.length})</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/admin/exercises/create')}
                >
                  Create New Exercise
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Exercise List */}
          {exerciseLibrary.length > 0 ? (
            exerciseLibrary.map(exercise => (
              <Grid item xs={12} md={6} lg={4} key={exercise.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {exercise.name}
                    </Typography>
                    <Chip 
                      label={exercise.exercise_type} 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {exercise.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={() => handleEditExercise(exercise)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteExercise(exercise.id)}
                      color="error"
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <AddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>No Exercises Yet</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Create your first exercise to build a reusable library for workflows.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/admin/exercises/create')}
                >
                  Create First Exercise
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Create Workflow Dialog */}
      <Dialog open={createWorkflowDialog} onClose={() => setCreateWorkflowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Workflow</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Workflow Name"
            fullWidth
            variant="outlined"
            value={newWorkflow.name}
            onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newWorkflow.description}
            onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                select
                label="Difficulty Level"
                fullWidth
                variant="outlined"
                value={newWorkflow.difficulty_level}
                onChange={(e) => setNewWorkflow({...newWorkflow, difficulty_level: e.target.value})}
                SelectProps={{ native: true }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Estimated Time (minutes)"
                fullWidth
                variant="outlined"
                value={newWorkflow.estimated_time}
                onChange={(e) => setNewWorkflow({...newWorkflow, estimated_time: parseInt(e.target.value)})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateWorkflowDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateWorkflow} variant="contained" disabled={!newWorkflow.name}>
            Create & Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Tooltip title="Quick Actions">
        <Fab 
          color="primary" 
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setCreateWorkflowDialog(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  )
}