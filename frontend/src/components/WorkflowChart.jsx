import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, IconButton, useTheme } from '@mui/material'
import { Edit as EditIcon, Visibility as ViewIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Position,
  Handle
} from 'reactflow'
import 'reactflow/dist/style.css'

// Clean n8n-inspired exercise node
const CleanExerciseNode = ({ data }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  const getNodeStyles = (exerciseType) => {
    const isError = exerciseType === 'error'
    
    return {
      backgroundColor: isError ? '#dc2626' : (isDark ? '#1e293b' : '#ffffff'),
      borderColor: isError ? '#dc2626' : '#1e40af',
      color: isError ? '#ffffff' : (isDark ? '#f1f5f9' : '#1e293b'),
      shadowColor: isError ? 'rgba(220, 38, 38, 0.2)' : 'rgba(30, 64, 175, 0.15)'
    }
  }
  
  const styles = getNodeStyles(data.exerciseType)
  
  return (
    <Box
      sx={{
        minWidth: 120,
        minHeight: 40,
        backgroundColor: styles.backgroundColor,
        border: `2px solid ${styles.borderColor}`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 2px 8px ${styles.shadowColor}`,
        position: 'relative',
        padding: '8px 12px',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: `0 4px 12px ${styles.shadowColor}`,
          transition: 'all 0.2s ease'
        }
      }}
    >
      {/* Left connection */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ 
          background: styles.borderColor, 
          border: 'none', 
          width: 8, 
          height: 8, 
          left: -4,
          borderRadius: '50%'
        }}
      />
      
      {/* Top connection */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ 
          background: styles.borderColor, 
          border: 'none', 
          width: 8, 
          height: 8, 
          top: -4,
          borderRadius: '50%'
        }}
      />
      
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: '12px', 
          fontWeight: 500,
          color: styles.color,
          textAlign: 'center',
          lineHeight: 1.2
        }}
      >
        {data.label}
      </Typography>
      
      {/* Right connection */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          background: styles.borderColor, 
          border: 'none', 
          width: 8, 
          height: 8, 
          right: -4,
          borderRadius: '50%'
        }}
      />
      
      {/* Bottom connection */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ 
          background: styles.borderColor, 
          border: 'none', 
          width: 8, 
          height: 8, 
          bottom: -4,
          borderRadius: '50%'
        }}
      />
    </Box>
  )
}

// Clean condition node
const CleanConditionNode = ({ data }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: '2px solid #1e40af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(30, 64, 175, 0.15)',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)',
          transition: 'all 0.2s ease'
        }
      }}
    >
      {/* Input connection */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ 
          background: '#1e40af', 
          border: 'none', 
          width: 8, 
          height: 8, 
          left: -4,
          borderRadius: '50%'
        }}
      />
      
      <Typography 
        sx={{ 
          fontSize: '16px', 
          color: '#1e40af',
          fontWeight: 600
        }}
      >
        ?
      </Typography>
      
      {/* Pass connection (right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        style={{ 
          background: '#10b981', 
          border: 'none', 
          width: 8, 
          height: 8, 
          right: -4,
          borderRadius: '50%'
        }}
      />
      
      {/* Fail connection (bottom) - only red for errors */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="fail"
        style={{ 
          background: '#dc2626', 
          border: 'none', 
          width: 8, 
          height: 8, 
          bottom: -4,
          borderRadius: '50%'
        }}
      />
    </Box>
  )
}

// Clean start/end nodes
const CleanStartEndNode = ({ data }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const isStart = data.type === 'start'
  
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: `2px solid ${isStart ? '#10b981' : '#1e40af'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 2px 8px ${isStart ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 64, 175, 0.15)'}`,
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: `0 4px 12px ${isStart ? 'rgba(16, 185, 129, 0.25)' : 'rgba(30, 64, 175, 0.25)'}`,
          transition: 'all 0.2s ease'
        }
      }}
    >
      {isStart ? (
        <>
          <Handle
            type="source"
            position={Position.Right}
            style={{ 
              background: '#10b981', 
              border: 'none', 
              width: 8, 
              height: 8, 
              right: -4,
              borderRadius: '50%'
            }}
          />
          <Typography sx={{ fontSize: '14px', color: '#10b981', fontWeight: 600 }}>
            ▶
          </Typography>
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={{ 
              background: '#1e40af', 
              border: 'none', 
              width: 8, 
              height: 8, 
              left: -4,
              borderRadius: '50%'
            }}
          />
          <Typography sx={{ fontSize: '14px', color: '#1e40af', fontWeight: 600 }}>
            ■
          </Typography>
        </>
      )}
    </Box>
  )
}

const nodeTypes = {
  exercise: CleanExerciseNode,
  condition: CleanConditionNode,
  start: CleanStartEndNode,
  end: CleanStartEndNode
}

export default function WorkflowChart({ workflow, height = 300, showControls = false }) {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  useEffect(() => {
    if (workflow?.workflow_data) {
      const workflowData = workflow.workflow_data
      
      // Convert workflow data to nodes and edges for display
      if (workflowData.nodes) {
        const nodeList = Array.isArray(workflowData.nodes) 
          ? workflowData.nodes 
          : Object.values(workflowData.nodes)
        setNodes(nodeList)
      }
      
      if (workflowData.edges) {
        setEdges(workflowData.edges)
      }
    } else {
      // Create a clean default visualization (horizontal layout)
      setNodes([
        {
          id: 'start',
          type: 'start',
          position: { x: 50, y: 100 },
          data: { type: 'start' }
        },
        {
          id: 'main',
          type: 'exercise',
          position: { x: 150, y: 100 },
          data: { label: 'Exercise', exerciseType: 'text_response' }
        },
        {
          id: 'condition',
          type: 'condition',
          position: { x: 320, y: 100 },
          data: { condition: 'check' }
        },
        {
          id: 'end',
          type: 'end',
          position: { x: 450, y: 100 },
          data: { type: 'end' }
        }
      ])
      
      setEdges([
        { id: 'e1', source: 'start', target: 'main' },
        { id: 'e2', source: 'main', target: 'condition' },
        { id: 'e3', source: 'condition', target: 'end', sourceHandle: 'pass' }
      ])
    }
  }, [workflow])

  return (
    <Paper sx={{ 
      height, 
      position: 'relative', 
      overflow: 'hidden',
      borderRadius: 2,
      border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      boxShadow: isDark 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
        : '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Clean Header */}
      <Box sx={{ 
        position: 'absolute', 
        top: 12, 
        left: 12, 
        zIndex: 10
      }}>
        <Typography variant="caption" sx={{ 
          backgroundColor: isDark ? '#1e293b' : '#f8fafc',
          color: isDark ? '#f1f5f9' : '#1e293b',
          px: 2, 
          py: 0.5, 
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 500,
          border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
          boxShadow: isDark 
            ? '0 2px 4px rgba(0, 0, 0, 0.2)' 
            : '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {workflow?.name || 'Sample Workflow'}
        </Typography>
      </Box>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          style: { 
            stroke: isDark ? '#64748b' : '#94a3b8', 
            strokeWidth: 2 
          },
          type: 'smoothstep'
        }}
      >
        <Background 
          variant="dots" 
          gap={20} 
          size={1} 
          color={isDark ? '#374151' : '#e2e8f0'}
        />
        {showControls && <Controls />}
      </ReactFlow>
    </Paper>
  )
}