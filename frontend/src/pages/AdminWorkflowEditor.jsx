import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem,
  ListItemText, ListItemIcon, Divider, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  Paper, Chip, Tooltip, Alert
} from '@mui/material'
import {
  Save as SaveIcon,
  PlayArrow as PlayIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  Psychology as ExerciseIcon,
  AccountTree as ConditionIcon,
  PlayCircle as StartIcon,
  StopCircle as EndIcon,
  Help as RemedialIcon,
  Timeline as FlowIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Handle,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'

// Custom node types for different exercise types
const ExerciseNode = ({ data, isConnectable }) => {
  const getNodeColor = (exerciseType) => {
    const colors = {
      storytelling: '#4CAF50',
      listening: '#2196F3', 
      matching: '#FF9800',
      conversation: '#9C27B0',
      writing: '#F44336',
      grammar: '#795548',
      cultural: '#607D8B',
      'phase2-remedial': '#E91E63',
      custom: '#9E9E9E'
    }
    return colors[exerciseType] || '#9E9E9E'
  }

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
        backgroundColor: getNodeColor(data.exerciseType),
        color: 'white',
        minWidth: 180,
        textAlign: 'center',
        border: '2px solid transparent',
        '&:hover': {
          border: '2px solid #fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#fff' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <ExerciseIcon sx={{ fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight="bold">
          {data.label}
        </Typography>
      </Box>
      
      <Typography variant="caption" sx={{ opacity: 0.9 }}>
        {data.exerciseType}
      </Typography>
      
      {data.settings && (
        <Chip
          size="small"
          label={`${Object.keys(data.settings).length} settings`}
          sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.2)' }}
        />
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ background: '#fff' }}
      />
    </Box>
  )
}

const ConditionNode = ({ data, isConnectable }) => (
  <Box
    sx={{
      padding: 2,
      borderRadius: '50%',
      backgroundColor: '#FF5722',
      color: 'white',
      width: 100,
      height: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid transparent',
      '&:hover': {
        border: '2px solid #fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
      }
    }}
  >
    <Handle
      type="target"
      position={Position.Top}
      isConnectable={isConnectable}
      style={{ background: '#fff' }}
    />
    
    <ConditionIcon sx={{ fontSize: 24, mb: 0.5 }} />
    <Typography variant="caption" textAlign="center">
      {data.label}
    </Typography>

    <Handle
      type="source"
      position={Position.Left}
      id="pass"
      isConnectable={isConnectable}
      style={{ background: '#4CAF50', left: 10 }}
    />
    <Handle
      type="source"
      position={Position.Right}
      id="fail"
      isConnectable={isConnectable}
      style={{ background: '#F44336', right: 10 }}
    />
  </Box>
)

const StartEndNode = ({ data, isConnectable }) => (
  <Box
    sx={{
      padding: 2,
      borderRadius: '50%',
      backgroundColor: data.type === 'start' ? '#4CAF50' : '#F44336',
      color: 'white',
      width: 80,
      height: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '3px solid white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}
  >
    {data.type === 'start' ? (
      <>
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{ background: '#fff' }}
        />
        <StartIcon sx={{ fontSize: 32 }} />
      </>
    ) : (
      <>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ background: '#fff' }}
        />
        <EndIcon sx={{ fontSize: 32 }} />
      </>
    )}
  </Box>
)

// Define node types
const nodeTypes = {
  exercise: ExerciseNode,
  condition: ConditionNode,
  start: StartEndNode,
  end: StartEndNode
}

// Exercise type definitions for learning progression
const EXERCISE_TYPES = {
  storytelling: { name: 'Storytelling', icon: '📖', color: '#4CAF50', level: 'main' },
  listening: { name: 'Listening', icon: '🎧', color: '#2196F3', level: 'main' },
  matching: { name: 'Arrow Matching', icon: '↔️', color: '#FF9800', level: 'main' },
  conversation: { name: 'Conversation', icon: '💬', color: '#9C27B0', level: 'main' },
  writing: { name: 'Writing', icon: '✍️', color: '#F44336', level: 'main' },
  grammar: { name: 'Grammar', icon: '📝', color: '#795548', level: 'main' },
  cultural: { name: 'Cultural', icon: '🌍', color: '#607D8B', level: 'main' },
  'remedial-basic': { name: 'Basic Remedial', icon: '🔄', color: '#E91E63', level: 'remedial' },
  'remedial-advanced': { name: 'Advanced Remedial', icon: '🎯', color: '#AD1457', level: 'remedial' },
  'phase2-remedial': { name: 'Phase 2 Remedial', icon: '🔧', color: '#880E4F', level: 'remedial' },
  assessment: { name: 'Assessment', icon: '📊', color: '#1565C0', level: 'checkpoint' }
}

export default function AdminWorkflowEditor() {
  const { workflowId } = useParams()
  const navigate = useNavigate()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [selectedNode, setSelectedNode] = useState(null)
  const [configDialog, setConfigDialog] = useState(false)
  const [workflow, setWorkflow] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Initialize workflow
  useEffect(() => {
    if (workflowId && workflowId !== 'new') {
      loadWorkflow()
    } else {
      // New workflow - initialize with start and end nodes
      const startNode = {
        id: 'start',
        type: 'start',
        position: { x: 400, y: 50 },
        data: { label: 'Start', type: 'start' }
      }
      const endNode = {
        id: 'end',
        type: 'end', 
        position: { x: 400, y: 400 },
        data: { label: 'End', type: 'end' }
      }
      setNodes([startNode, endNode])
    }
  }, [workflowId])

  const loadWorkflow = async () => {
    try {
      const response = await fetch(`/api/admin/exercises/workflows/${workflowId}`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to load workflow')
      
      const data = await response.json()
      setWorkflow(data.workflow)
      
      // Convert workflow data to React Flow format
      if (data.workflow.workflow_data) {
        const workflowData = data.workflow.workflow_data // Already parsed by backend
        if (workflowData.nodes) {
          // Handle both object and array formats for nodes
          const nodeList = Array.isArray(workflowData.nodes) 
            ? workflowData.nodes 
            : Object.values(workflowData.nodes)
          setNodes(nodeList)
        }
        if (workflowData.edges) {
          setEdges(workflowData.edges)
        }
      }
    } catch (err) {
      setError('Failed to load workflow: ' + err.message)
    }
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
    if (node.type === 'exercise' || node.type === 'condition') {
      setConfigDialog(true)
    }
  }, [])

  // Add new exercise node
  const addExerciseNode = (exerciseType) => {
    const newNode = {
      id: `${exerciseType}_${Date.now()}`,
      type: 'exercise',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 150 },
      data: {
        label: EXERCISE_TYPES[exerciseType].name,
        exerciseType,
        settings: {}
      }
    }
    setNodes((nds) => [...nds, newNode])
    setDrawerOpen(false)
  }

  // Add condition node
  const addConditionNode = () => {
    const newNode = {
      id: `condition_${Date.now()}`,
      type: 'condition',
      position: { x: Math.random() * 400 + 150, y: Math.random() * 300 + 150 },
      data: {
        label: 'Score Check',
        condition: 'score >= 70'
      }
    }
    setNodes((nds) => [...nds, newNode])
    setDrawerOpen(false)
  }

  // Save workflow
  const saveWorkflow = async () => {
    setSaving(true)
    try {
      const workflowData = {
        nodes: nodes.reduce((acc, node) => {
          acc[node.id] = node
          return acc
        }, {}),
        edges,
        start_node_id: 'start'
      }

      const response = await fetch(`/api/admin/exercises/workflows/${workflowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ workflow_data: JSON.stringify(workflowData) })
      })

      if (!response.ok) throw new Error('Failed to save workflow')
      
      setError('')
      // Show success feedback
    } catch (err) {
      setError('Failed to save workflow: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/admin/exercises')}>
            <BackIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Workflow Designer - {workflow?.name || 'New Workflow'}
          </Typography>

          <Button
            startIcon={<MenuIcon />}
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            Add Nodes
          </Button>

          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            color="secondary"
            onClick={saveWorkflow}
            disabled={saving}
            sx={{ mr: 2 }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>

          <Button
            startIcon={<PlayIcon />}
            variant="contained"
            color="success"
          >
            Preview
          </Button>
        </Toolbar>
      </AppBar>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Main Flow Editor */}
      <Box sx={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          
          {/* Info Panel */}
          <Panel position="top-left">
            <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
              <Typography variant="subtitle2" gutterBottom>
                <FlowIcon sx={{ mr: 1, fontSize: 16 }} />
                Flow-based Programming
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Drag nodes, connect with lines to create learning flows
              </Typography>
            </Paper>
          </Panel>

          {/* Stats Panel */}
          <Panel position="top-right">
            <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
              <Typography variant="caption" display="block">
                Exercises: {nodes.filter(n => n.type === 'exercise').length}
              </Typography>
              <Typography variant="caption" display="block">
                Conditions: {nodes.filter(n => n.type === 'condition').length}
              </Typography>
              <Typography variant="caption" display="block">
                Connections: {edges.length}
              </Typography>
            </Paper>
          </Panel>
        </ReactFlow>
      </Box>

      {/* Node Palette Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 320, top: 64 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Main Learning Path
          </Typography>
          
          <List dense>
            {Object.entries(EXERCISE_TYPES)
              .filter(([type, config]) => config.level === 'main')
              .map(([type, config]) => (
              <ListItem
                key={type}
                button
                onClick={() => addExerciseNode(type)}
                sx={{ 
                  mb: 1, 
                  borderRadius: 1, 
                  border: '1px solid',
                  borderColor: 'grey.300',
                  '&:hover': { borderColor: config.color }
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      backgroundColor: config.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}
                  >
                    {config.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={config.name}
                  secondary="Main progression exercise"
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Remedial Exercises
          </Typography>
          
          <List dense>
            {Object.entries(EXERCISE_TYPES)
              .filter(([type, config]) => config.level === 'remedial')
              .map(([type, config]) => (
              <ListItem
                key={type}
                button
                onClick={() => addExerciseNode(type)}
                sx={{ 
                  mb: 1, 
                  borderRadius: 1, 
                  border: '1px solid',
                  borderColor: 'grey.300',
                  '&:hover': { borderColor: config.color }
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      backgroundColor: config.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}
                  >
                    {config.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={config.name}
                  secondary="For struggling students"
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Assessment Points
          </Typography>
          
          <List dense>
            {Object.entries(EXERCISE_TYPES)
              .filter(([type, config]) => config.level === 'checkpoint')
              .map(([type, config]) => (
              <ListItem
                key={type}
                button
                onClick={() => addExerciseNode(type)}
                sx={{ 
                  mb: 1, 
                  borderRadius: 1, 
                  border: '1px solid',
                  borderColor: 'grey.300',
                  '&:hover': { borderColor: config.color }
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      backgroundColor: config.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}
                  >
                    {config.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={config.name}
                  secondary="Progress evaluation"
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Flow Control
          </Typography>
          
          <List dense>
            <ListItem
              button
              onClick={addConditionNode}
              sx={{ 
                mb: 1, 
                borderRadius: 1, 
                border: '1px solid',
                borderColor: 'grey.300',
                '&:hover': { borderColor: '#FF5722' }
              }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    backgroundColor: '#FF5722',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <ConditionIcon fontSize="small" />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Condition"
                secondary="Branch based on score/performance"
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Node Configuration Dialog */}
      <Dialog open={configDialog} onClose={() => setConfigDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Configure {selectedNode?.data?.label}
        </DialogTitle>
        <DialogContent>
          {selectedNode?.type === 'exercise' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Exercise Title"
                value={selectedNode?.data?.label || ''}
                onChange={(e) => {
                  const updatedNodes = nodes.map(node => 
                    node.id === selectedNode.id 
                      ? { ...node, data: { ...node.data, label: e.target.value } }
                      : node
                  )
                  setNodes(updatedNodes)
                  setSelectedNode(prev => ({ ...prev, data: { ...prev.data, label: e.target.value } }))
                }}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={selectedNode?.data?.difficulty || 'intermediate'}
                  label="Difficulty"
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          
          {selectedNode?.type === 'condition' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Condition Logic"
                value={selectedNode?.data?.condition || ''}
                placeholder="e.g., score >= 70, attempts <= 3"
                helperText="Define when to branch to different paths"
                onChange={(e) => {
                  const updatedNodes = nodes.map(node => 
                    node.id === selectedNode.id 
                      ? { ...node, data: { ...node.data, condition: e.target.value } }
                      : node
                  )
                  setNodes(updatedNodes)
                  setSelectedNode(prev => ({ ...prev, data: { ...prev.data, condition: e.target.value } }))
                }}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Green handle (left) = Pass condition, Red handle (right) = Fail condition
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Condition Type</InputLabel>
                <Select
                  value={selectedNode?.data?.conditionType || 'score'}
                  label="Condition Type"
                  onChange={(e) => {
                    const updatedNodes = nodes.map(node => 
                      node.id === selectedNode.id 
                        ? { ...node, data: { ...node.data, conditionType: e.target.value } }
                        : node
                    )
                    setNodes(updatedNodes)
                    setSelectedNode(prev => ({ ...prev, data: { ...prev.data, conditionType: e.target.value } }))
                  }}
                >
                  <MenuItem value="score">Score Threshold</MenuItem>
                  <MenuItem value="attempts">Attempt Limit</MenuItem>
                  <MenuItem value="time">Time Limit</MenuItem>
                  <MenuItem value="accuracy">Accuracy Check</MenuItem>
                  <MenuItem value="custom">Custom Logic</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setConfigDialog(false)}>
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}