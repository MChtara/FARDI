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
  Timeline as TimelineIcon,
  AccountTree as FlowIcon,
  GetApp as ImportIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import WorkflowChart from '../components/WorkflowChart'

export default function AdminExerciseBuilder() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [importPreview, setImportPreview] = useState(null)
  const [importing, setImporting] = useState(false)
  
  // Dialog states
  const [createWorkflowDialog, setCreateWorkflowDialog] = useState(false)
  const [exerciseLibrary, setExerciseLibrary] = useState([])
  const [createExerciseDialog, setCreateExerciseDialog] = useState(false)
  const [selectedExerciseType, setSelectedExerciseType] = useState('')
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    exercise_type: '',
    exercise_context: {
      prompt: '',
      question: '',
      audio_file: '',
      image_file: '',
      scenario: '',
      options: ['', '', '', ''], // Pre-filled array for easy editing
      word_bank: ['', '', '', '', ''], // Pre-filled array for easy editing
      dialogue_lines: [
        { speaker: 'Character A', text: '' },
        { speaker: 'Character B', text: '' }
      ],
      positions: ['', ''],
      available_roles: ['', '', ''],
      team_members: ['', '', ''],
      cultural_element: '',
      analysis_type: 'comparison',
      writing_type: 'essay',
      min_words: 50,
      max_words: 200,
      min_length: 100,
      question_type: 'multiple_choice'
    },
    difficulty_levels: {
      A1: { content: '', instructions: '' },
      A2: { content: '', instructions: '' },
      B1: { content: '', instructions: '' },
      B2: { content: '', instructions: '' }
    },
    correct_answers: {},
    wrong_answers: {},
    ai_instructions: '',
    parameters: {},
    cultural_themes: [],
    tags: []
  })
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    difficulty_level: 'intermediate',
    estimated_time: 30,
    cultural_themes: [],
    tags: []
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [workflowsRes, exerciseLibraryRes] = await Promise.all([
        fetch('/api/admin/workflows', { credentials: 'include' }),
        fetch('/api/admin/exercises/library', { credentials: 'include' })
      ])

      if (!workflowsRes.ok) {
        throw new Error('Failed to load workflows')
      }

      const workflowsData = await workflowsRes.json()
      setWorkflows(workflowsData.workflows || [])

      // Load exercise library (optional, don't fail if it doesn't work)
      if (exerciseLibraryRes.ok) {
        const libraryData = await exerciseLibraryRes.json()
        setExerciseLibrary(libraryData.exercises || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewImport = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/workflow-importer/preview', {
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to preview import')
      
      const data = await response.json()
      setImportPreview(data.preview)
    } catch (err) {
      setError('Failed to preview existing exercises: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImportWorkflows = async () => {
    try {
      setImporting(true)
      const response = await fetch('/api/admin/workflow-importer/import-existing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          import_phase1: true,
          import_phase2: true
        })
      })
      
      if (!response.ok) throw new Error('Failed to import workflows')
      
      const data = await response.json()
      if (data.success) {
        // Refresh workflows list
        await loadInitialData()
        setImportPreview(null)
        // Switch to Chart View tab to show imported workflows
        setActiveTab(1)
      } else {
        throw new Error(data.error || 'Import failed')
      }
    } catch (err) {
      setError('Failed to import workflows: ' + err.message)
    } finally {
      setImporting(false)
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
        // Handle different types of errors
        if (response.status === 401) {
          setError('Authentication required. Please login as an admin.')
          return
        } else if (response.status === 403) {
          setError('Admin privileges required to create workflows.')
          return
        } else if (data.error) {
          setError(`Failed to create workflow: ${data.error}`)
          if (data.details) {
            console.error('Workflow creation error details:', data.details)
          }
          return
        } else {
          throw new Error(`HTTP ${response.status}: Failed to create workflow`)
        }
      }

      // Success - close dialog and reset form
      setCreateWorkflowDialog(false)
      setNewWorkflow({
        name: '',
        description: '',
        difficulty_level: 'intermediate',
        estimated_time: 30,
        cultural_themes: [],
        tags: []
      })
      
      // Refresh workflows list
      loadInitialData()
      
      // Navigate to FBP workflow editor
      if (data.workflow_id) {
        navigate(`/admin/exercises/workflow/${data.workflow_id}/edit`)
      }
    } catch (err) {
      console.error('Workflow creation error:', err)
      setError(err.message)
    }
  }

  const handleCreateExercise = async () => {
    try {
      setError('')
      setLoading(true)
      
      const response = await fetch('/api/admin/exercises/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newExercise)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create exercise')
      }
      
      // Reset form
      setNewExercise({
        name: '',
        description: '',
        exercise_type: '',
        exercise_context: {
          prompt: '',
          question: '',
          audio_file: '',
          image_file: '',
          scenario: '',
          options: [],
          word_bank: []
        },
        difficulty_levels: {
          A1: { content: '', instructions: '' },
          A2: { content: '', instructions: '' },
          B1: { content: '', instructions: '' },
          B2: { content: '', instructions: '' }
        },
        correct_answers: {},
        wrong_answers: {},
        ai_instructions: '',
        parameters: {},
        cultural_themes: [],
        tags: []
      })
      setSelectedExerciseType('')
      setCreateExerciseDialog(false)
      
      // Refresh data
      await loadInitialData()
      
      // Switch to Exercise Library tab to show the new exercise
      setActiveTab(4)
      
    } catch (err) {
      console.error('Exercise creation error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderExerciseContentForm = () => {
    const updateExerciseContext = (field, value) => {
      setNewExercise({
        ...newExercise,
        exercise_context: { ...newExercise.exercise_context, [field]: value }
      })
    }

    const updateCorrectAnswers = (value) => {
      setNewExercise({...newExercise, correct_answers: value})
    }

    const updateWrongAnswers = (value) => {
      setNewExercise({...newExercise, wrong_answers: value})
    }

    // Helper function to update array fields easily
    const updateArrayField = (fieldName, index, value) => {
      const currentArray = newExercise.exercise_context[fieldName] || []
      const newArray = [...currentArray]
      newArray[index] = value
      updateExerciseContext(fieldName, newArray)
    }

    // Helper function to add item to array
    const addArrayItem = (fieldName, defaultValue = '') => {
      const currentArray = newExercise.exercise_context[fieldName] || []
      updateExerciseContext(fieldName, [...currentArray, defaultValue])
    }

    // Helper function to remove item from array
    const removeArrayItem = (fieldName, index) => {
      const currentArray = newExercise.exercise_context[fieldName] || []
      const newArray = currentArray.filter((_, i) => i !== index)
      updateExerciseContext(fieldName, newArray)
    }

    switch(selectedExerciseType) {
      case 'storytelling':
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{ mr: 1 }}>
                Storytelling Exercise Content
              </Typography>
              <Tooltip title="Students write creative stories based on your prompt. Set word limits and provide guidance for what makes a good story.">
                <InfoIcon color="primary" sx={{ fontSize: 20 }} />
              </Tooltip>
            </Box>
            <TextField
              label="Story Prompt"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newExercise.exercise_context.prompt || ''}
              onChange={(e) => updateExerciseContext('prompt', e.target.value)}
              helperText="The creative writing prompt for the story"
              sx={{ mb: 2 }}
            />
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Minimum Words"
                type="number"
                variant="outlined"
                value={newExercise.exercise_context.min_words || 50}
                onChange={(e) => updateExerciseContext('min_words', parseInt(e.target.value))}
                sx={{ width: '50%' }}
              />
              <TextField
                label="Maximum Words"
                type="number"
                variant="outlined"
                value={newExercise.exercise_context.max_words || 200}
                onChange={(e) => updateExerciseContext('max_words', parseInt(e.target.value))}
                sx={{ width: '50%' }}
              />
            </Box>
            <TextField
              label="Assessment Criteria"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newExercise.correct_answers || ''}
              onChange={(e) => updateCorrectAnswers(e.target.value)}
              helperText="Key elements that should be present in a good story (e.g., clear beginning/middle/end, creative vocabulary, cultural elements)"
              sx={{ mb: 2 }}
            />
          </Box>
        )

      case 'matching_game':
        const matchingPairs = newExercise.exercise_context.matching_pairs || [{ item: '', description: '' }]
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{ mr: 1 }}>
                Drag & Drop Matching Content
              </Typography>
              <Tooltip title="Students drag items to match them with their correct descriptions. Create pairs of items and descriptions below.">
                <InfoIcon color="primary" sx={{ fontSize: 20 }} />
              </Tooltip>
            </Box>
            <TextField
              label="Matching Instructions"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newExercise.exercise_context.question || ''}
              onChange={(e) => updateExerciseContext('question', e.target.value)}
              helperText="Instructions for the matching exercise (e.g., 'Match each country to its continent')"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle1" gutterBottom>Matching Pairs</Typography>
            {matchingPairs.map((pair, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <TextField
                  label={`Item ${index + 1}`}
                  variant="outlined"
                  value={pair.item || ''}
                  onChange={(e) => {
                    const newPairs = [...matchingPairs]
                    newPairs[index] = { ...newPairs[index], item: e.target.value }
                    updateExerciseContext('matching_pairs', newPairs)
                    // Also update correct_answers for backend compatibility
                    const answersObj = {}
                    newPairs.forEach(p => { if (p.item && p.description) answersObj[p.item] = p.description })
                    updateCorrectAnswers(answersObj)
                  }}
                  sx={{ flex: 1 }}
                />
                <Typography sx={{ mx: 1 }}>→</Typography>
                <TextField
                  label={`Description ${index + 1}`}
                  variant="outlined"
                  value={pair.description || ''}
                  onChange={(e) => {
                    const newPairs = [...matchingPairs]
                    newPairs[index] = { ...newPairs[index], description: e.target.value }
                    updateExerciseContext('matching_pairs', newPairs)
                    // Also update correct_answers for backend compatibility
                    const answersObj = {}
                    newPairs.forEach(p => { if (p.item && p.description) answersObj[p.item] = p.description })
                    updateCorrectAnswers(answersObj)
                  }}
                  sx={{ flex: 1 }}
                />
                {matchingPairs.length > 1 && (
                  <IconButton 
                    onClick={() => {
                      const newPairs = matchingPairs.filter((_, i) => i !== index)
                      updateExerciseContext('matching_pairs', newPairs)
                      const answersObj = {}
                      newPairs.forEach(p => { if (p.item && p.description) answersObj[p.item] = p.description })
                      updateCorrectAnswers(answersObj)
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                const newPairs = [...matchingPairs, { item: '', description: '' }]
                updateExerciseContext('matching_pairs', newPairs)
              }}
              sx={{ mb: 2 }}
            >
              Add Another Pair
            </Button>
          </Box>
        )

      case 'fill_gaps':
        const correctAnswers = Array.isArray(newExercise.correct_answers) ? newExercise.correct_answers : []
        const wordBankWords = newExercise.exercise_context.word_bank || ['', '', '', '', '']
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{ mr: 1 }}>
                Fill in the Blanks Content
              </Typography>
              <Tooltip title="Students fill missing words in sentences. Use _____ to mark blanks. Provide correct answers and optionally a word bank.">
                <InfoIcon color="primary" sx={{ fontSize: 20 }} />
              </Tooltip>
            </Box>
            <TextField
              label="Text with Blanks"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={newExercise.exercise_context.prompt || ''}
              onChange={(e) => updateExerciseContext('prompt', e.target.value)}
              helperText="Use _____ to mark gaps (e.g., 'The capital of Tunisia _____ Tunis.')"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle1" gutterBottom>Correct Answers (in order)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Provide the correct answer for each blank in the order they appear in the text
            </Typography>
            {correctAnswers.map((answer, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                <Typography sx={{ minWidth: 80 }}>Blank {index + 1}:</Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  value={answer || ''}
                  onChange={(e) => {
                    const newAnswers = [...correctAnswers]
                    newAnswers[index] = e.target.value
                    updateCorrectAnswers(newAnswers.filter(a => a.trim()))
                  }}
                  sx={{ flex: 1 }}
                />
                {correctAnswers.length > 1 && (
                  <IconButton 
                    onClick={() => {
                      const newAnswers = correctAnswers.filter((_, i) => i !== index)
                      updateCorrectAnswers(newAnswers)
                    }}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={() => updateCorrectAnswers([...correctAnswers, ''])}
              sx={{ mb: 3 }}
            >
              Add Another Answer
            </Button>
            
            <Typography variant="subtitle1" gutterBottom>Word Bank (Optional)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Words students can choose from (leave empty for free-text input)
            </Typography>
            {wordBankWords.map((word, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                <Typography sx={{ minWidth: 80 }}>Word {index + 1}:</Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  value={word || ''}
                  onChange={(e) => updateArrayField('word_bank', index, e.target.value)}
                  sx={{ flex: 1 }}
                />
                {wordBankWords.length > 1 && (
                  <IconButton 
                    onClick={() => removeArrayItem('word_bank', index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={() => addArrayItem('word_bank', '')}
            >
              Add Another Word
            </Button>
          </Box>
        )

      case 'listening_comprehension':
        const listeningQuestions = newExercise.exercise_context.listening_questions || [{ 
          question: '', 
          correct_answer: '', 
          options: ['', '', '', ''] 
        }]
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{ mr: 1 }}>
                Listening Comprehension Content
              </Typography>
              <Tooltip title="Students listen to audio and answer questions. Upload audio file and create questions with multiple choice or short answer formats.">
                <InfoIcon color="primary" sx={{ fontSize: 20 }} />
              </Tooltip>
            </Box>
            <TextField
              label="Audio File URL"
              fullWidth
              variant="outlined"
              value={newExercise.exercise_context.audio_file || ''}
              onChange={(e) => updateExerciseContext('audio_file', e.target.value)}
              helperText="URL or path to the audio file (e.g., /static/audio/listening1.mp3)"
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Question Type"
              fullWidth
              variant="outlined"
              value={newExercise.exercise_context.question_type || 'multiple_choice'}
              onChange={(e) => updateExerciseContext('question_type', e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mb: 3 }}
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="short_answer">Short Answer</option>
              <option value="true_false">True/False</option>
            </TextField>
            
            <Typography variant="subtitle1" gutterBottom>Questions</Typography>
            {listeningQuestions.map((q, qIndex) => (
              <Box key={qIndex} sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle2">Question {qIndex + 1}</Typography>
                  {listeningQuestions.length > 1 && (
                    <IconButton 
                      onClick={() => {
                        const newQuestions = listeningQuestions.filter((_, i) => i !== qIndex)
                        updateExerciseContext('listening_questions', newQuestions)
                      }}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                
                <TextField
                  label="Question Text"
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={q.question || ''}
                  onChange={(e) => {
                    const newQuestions = [...listeningQuestions]
                    newQuestions[qIndex] = { ...newQuestions[qIndex], question: e.target.value }
                    updateExerciseContext('listening_questions', newQuestions)
                  }}
                  sx={{ mb: 2 }}
                />
                
                {newExercise.exercise_context.question_type === 'multiple_choice' && (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>Answer Options:</Typography>
                    {(q.options || ['', '', '', '']).map((option, optIndex) => (
                      <TextField
                        key={optIndex}
                        label={`Option ${String.fromCharCode(65 + optIndex)}`}
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={option || ''}
                        onChange={(e) => {
                          const newQuestions = [...listeningQuestions]
                          const newOptions = [...(newQuestions[qIndex].options || ['', '', '', ''])]
                          newOptions[optIndex] = e.target.value
                          newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions }
                          updateExerciseContext('listening_questions', newQuestions)
                        }}
                        sx={{ mb: 1 }}
                      />
                    ))}
                    <TextField
                      select
                      label="Correct Answer"
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={q.correct_answer || ''}
                      onChange={(e) => {
                        const newQuestions = [...listeningQuestions]
                        newQuestions[qIndex] = { ...newQuestions[qIndex], correct_answer: e.target.value }
                        updateExerciseContext('listening_questions', newQuestions)
                        // Update backend-compatible format
                        const answersObj = {}
                        newQuestions.forEach((question, idx) => {
                          if (question.correct_answer) answersObj[`question_${idx + 1}`] = question.correct_answer
                        })
                        updateCorrectAnswers(answersObj)
                      }}
                      SelectProps={{ native: true }}
                    >
                      <option value="">Select correct option</option>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </TextField>
                  </>
                )}
                
                {newExercise.exercise_context.question_type === 'short_answer' && (
                  <TextField
                    label="Correct Answer"
                    fullWidth
                    variant="outlined"
                    value={q.correct_answer || ''}
                    onChange={(e) => {
                      const newQuestions = [...listeningQuestions]
                      newQuestions[qIndex] = { ...newQuestions[qIndex], correct_answer: e.target.value }
                      updateExerciseContext('listening_questions', newQuestions)
                      // Update backend-compatible format
                      const answersObj = {}
                      newQuestions.forEach((question, idx) => {
                        if (question.correct_answer) answersObj[`question_${idx + 1}`] = question.correct_answer
                      })
                      updateCorrectAnswers(answersObj)
                    }}
                    helperText="The expected answer text"
                  />
                )}
                
                {newExercise.exercise_context.question_type === 'true_false' && (
                  <TextField
                    select
                    label="Correct Answer"
                    fullWidth
                    variant="outlined"
                    value={q.correct_answer || ''}
                    onChange={(e) => {
                      const newQuestions = [...listeningQuestions]
                      newQuestions[qIndex] = { ...newQuestions[qIndex], correct_answer: e.target.value }
                      updateExerciseContext('listening_questions', newQuestions)
                      // Update backend-compatible format
                      const answersObj = {}
                      newQuestions.forEach((question, idx) => {
                        if (question.correct_answer) answersObj[`question_${idx + 1}`] = question.correct_answer
                      })
                      updateCorrectAnswers(answersObj)
                    }}
                    SelectProps={{ native: true }}
                  >
                    <option value="">Select answer</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </TextField>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                const newQuestions = [...listeningQuestions, { 
                  question: '', 
                  correct_answer: '', 
                  options: ['', '', '', ''] 
                }]
                updateExerciseContext('listening_questions', newQuestions)
              }}
            >
              Add Another Question
            </Button>
          </Box>
        )

      case 'dialogue_practice':
        const dialogueLines = newExercise.exercise_context.dialogue_lines || [
          { speaker: 'Character A', text: '' },
          { speaker: 'Character B', text: '' }
        ]
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{ mr: 1 }}>
                Dialogue Practice Content
              </Typography>
              <Tooltip title="Students practice conversations by selecting appropriate responses. Create a dialogue scenario and conversation flow with multiple choice responses.">
                <InfoIcon color="primary" sx={{ fontSize: 20 }} />
              </Tooltip>
            </Box>
            <TextField
              label="Dialogue Scenario"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newExercise.exercise_context.scenario || ''}
              onChange={(e) => updateExerciseContext('scenario', e.target.value)}
              helperText="The conversation context (e.g., 'You are meeting a new classmate at university')"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle1" gutterBottom>Dialogue Conversation</Typography>
            {dialogueLines.map((line, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Box display="flex" gap={2} alignItems="center" mb={2}>
                  <TextField
                    label="Speaker"
                    variant="outlined"
                    size="small"
                    value={line.speaker || ''}
                    onChange={(e) => {
                      const newLines = [...dialogueLines]
                      newLines[index] = { ...newLines[index], speaker: e.target.value }
                      updateExerciseContext('dialogue_lines', newLines)
                    }}
                    sx={{ width: '30%' }}
                  />
                  {dialogueLines.length > 2 && (
                    <IconButton 
                      onClick={() => {
                        const newLines = dialogueLines.filter((_, i) => i !== index)
                        updateExerciseContext('dialogue_lines', newLines)
                      }}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                <TextField
                  label="Dialogue Text"
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={line.text || ''}
                  onChange={(e) => {
                    const newLines = [...dialogueLines]
                    newLines[index] = { ...newLines[index], text: e.target.value }
                    updateExerciseContext('dialogue_lines', newLines)
                  }}
                  helperText={`What ${line.speaker || 'this speaker'} says`}
                />
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                const newLines = [...dialogueLines, { speaker: `Character ${String.fromCharCode(65 + dialogueLines.length)}`, text: '' }]
                updateExerciseContext('dialogue_lines', newLines)
              }}
              sx={{ mb: 2 }}
            >
              Add Dialogue Line
            </Button>
            
            <TextField
              label="Assessment Notes"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newExercise.correct_answers || ''}
              onChange={(e) => updateCorrectAnswers(e.target.value)}
              helperText="What makes a good dialogue response (e.g., appropriate tone, cultural awareness, correct grammar)"
              sx={{ mb: 2 }}
            />
          </Box>
        )

      case 'creative_writing':
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{ mr: 1 }}>
                Creative Writing Content
              </Typography>
              <Tooltip title="Students write creative pieces like essays, poems, or letters. Choose the writing type and provide clear guidelines and evaluation criteria.">
                <InfoIcon color="primary" sx={{ fontSize: 20 }} />
              </Tooltip>
            </Box>
            <TextField
              select
              label="Writing Type"
              fullWidth
              variant="outlined"
              value={newExercise.exercise_context.writing_type || 'essay'}
              onChange={(e) => updateExerciseContext('writing_type', e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="poem">Poem</option>
              <option value="essay">Essay</option>
              <option value="letter">Letter</option>
              <option value="report">Report</option>
              <option value="story">Story</option>
            </TextField>
            <TextField
              label="Writing Guidelines & Topic"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newExercise.exercise_context.prompt || ''}
              onChange={(e) => updateExerciseContext('prompt', e.target.value)}
              helperText="Clear guidelines and topic for the writing task (e.g., 'Write a formal letter to the university dean requesting funding for your cultural event')"
              sx={{ mb: 2 }}
            />
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Minimum Length (words)"
                type="number"
                variant="outlined"
                value={newExercise.exercise_context.min_length || 100}
                onChange={(e) => updateExerciseContext('min_length', parseInt(e.target.value))}
                sx={{ width: '50%' }}
              />
              <TextField
                label="Time Limit (minutes)"
                type="number"
                variant="outlined"
                value={newExercise.exercise_context.time_limit || 15}
                onChange={(e) => updateExerciseContext('time_limit', parseInt(e.target.value))}
                sx={{ width: '50%' }}
              />
            </Box>
            <TextField
              label="Assessment Criteria"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newExercise.correct_answers || ''}
              onChange={(e) => updateCorrectAnswers(e.target.value)}
              helperText="Key criteria for evaluating the writing (e.g., clear structure, appropriate vocabulary, cultural awareness, grammar accuracy)"
              sx={{ mb: 2 }}
            />
          </Box>
        )

      case 'peer_negotiation':
        const positions = newExercise.exercise_context.positions || ['', '']
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{ mr: 1 }}>
                Peer Negotiation Content
              </Typography>
              <Tooltip title="Students practice diplomatic discussions and finding agreements. Set up conflicting positions and guide them toward successful resolution.">
                <InfoIcon color="primary" sx={{ fontSize: 20 }} />
              </Tooltip>
            </Box>
            <TextField
              label="Negotiation Scenario"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newExercise.exercise_context.scenario || ''}
              onChange={(e) => updateExerciseContext('scenario', e.target.value)}
              helperText="The conflict or situation to negotiate (e.g., 'Your team disagrees on the cultural event location. Some want indoors, others prefer outdoor venue.')"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle1" gutterBottom>Different Viewpoints</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Define the different positions that need to be negotiated
            </Typography>
            {positions.map((position, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <Typography sx={{ minWidth: 100 }}>Position {index + 1}:</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={position || ''}
                  onChange={(e) => updateArrayField('positions', index, e.target.value)}
                  placeholder={`Enter viewpoint ${index + 1} (e.g., "Wants outdoor venue for better atmosphere")`}
                />
                {positions.length > 2 && (
                  <IconButton 
                    onClick={() => removeArrayItem('positions', index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => addArrayItem('positions', '')}
              sx={{ mb: 3 }}
            >
              Add Another Position
            </Button>
            
            <TextField
              label="Successful Resolution Examples"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newExercise.correct_answers || ''}
              onChange={(e) => updateCorrectAnswers(e.target.value)}
              helperText="Examples of successful diplomatic solutions (e.g., compromise solutions, win-win outcomes, respectful language)"
              sx={{ mb: 2 }}
            />
          </Box>
        )

      case 'role_suggestion':
        const availableRoles = newExercise.exercise_context.available_roles || ['', '', '']
        const teamMembers = newExercise.exercise_context.team_members || ['', '', '']
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{ mr: 1 }}>
                Role Suggestion Content
              </Typography>
              <Tooltip title="Students suggest which team members should take which roles. Define team members, available roles, and provide guidance for good assignments.">
                <InfoIcon color="primary" sx={{ fontSize: 20 }} />
              </Tooltip>
            </Box>
            <TextField
              label="Team Scenario"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newExercise.exercise_context.scenario || ''}
              onChange={(e) => updateExerciseContext('scenario', e.target.value)}
              helperText="The team project or situation (e.g., 'Your team is organizing a cultural festival and needs to assign responsibilities')"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle1" gutterBottom>Available Roles</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Define the roles that can be assigned to team members
            </Typography>
            {availableRoles.map((role, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                <Typography sx={{ minWidth: 60 }}>Role {index + 1}:</Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={role || ''}
                  onChange={(e) => updateArrayField('available_roles', index, e.target.value)}
                  placeholder={`Enter role ${index + 1} (e.g., "Event Coordinator", "Marketing Manager")`}
                />
                {availableRoles.length > 1 && (
                  <IconButton 
                    onClick={() => removeArrayItem('available_roles', index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={() => addArrayItem('available_roles', '')}
              sx={{ mb: 3 }}
            >
              Add Another Role
            </Button>
            
            <Typography variant="subtitle1" gutterBottom>Team Members</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Define the team members who will be assigned roles
            </Typography>
            {teamMembers.map((member, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                <Typography sx={{ minWidth: 80 }}>Member {index + 1}:</Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={member || ''}
                  onChange={(e) => updateArrayField('team_members', index, e.target.value)}
                  placeholder={`Enter member name ${index + 1} (e.g., "Sarah - Art student", "Ahmed - Business major")`}
                />
                {teamMembers.length > 1 && (
                  <IconButton 
                    onClick={() => removeArrayItem('team_members', index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={() => addArrayItem('team_members', '')}
              sx={{ mb: 3 }}
            >
              Add Another Member
            </Button>
            
            <TextField
              label="Assessment Guidelines"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newExercise.correct_answers || ''}
              onChange={(e) => updateCorrectAnswers(e.target.value)}
              helperText="What makes a good role assignment (e.g., matching skills to roles, clear reasoning, consideration of everyone's strengths)"
              sx={{ mb: 2 }}
            />
          </Box>
        )

      case 'cultural_analysis':
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{ mr: 1 }}>
                Cultural Analysis Content
              </Typography>
              <Tooltip title="Students analyze cultural elements and contexts. Choose what they'll analyze, how they'll analyze it, and provide evaluation criteria.">
                <InfoIcon color="primary" sx={{ fontSize: 20 }} />
              </Tooltip>
            </Box>
            <TextField
              label="Cultural Element to Analyze"
              fullWidth
              variant="outlined"
              value={newExercise.exercise_context.cultural_element || ''}
              onChange={(e) => updateExerciseContext('cultural_element', e.target.value)}
              helperText="The cultural aspect students will analyze (e.g., 'Traditional Tunisian wedding customs', 'University graduation ceremonies')"
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Analysis Type"
              fullWidth
              variant="outlined"
              value={newExercise.exercise_context.analysis_type || 'comparison'}
              onChange={(e) => updateExerciseContext('analysis_type', e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="comparison">Comparison</option>
              <option value="description">Description</option>
              <option value="significance">Significance</option>
              <option value="impact">Impact</option>
            </TextField>
            <TextField
              label="Analysis Prompt"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newExercise.exercise_context.prompt || ''}
              onChange={(e) => updateExerciseContext('prompt', e.target.value)}
              helperText="Specific questions or prompts for the analysis (e.g., 'Compare traditional and modern Tunisian celebrations. How have they evolved?')"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Assessment Criteria"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newExercise.correct_answers || ''}
              onChange={(e) => updateCorrectAnswers(e.target.value)}
              helperText="Key aspects for good analysis (e.g., demonstrates cultural understanding, provides specific examples, shows critical thinking, uses appropriate vocabulary)"
              sx={{ mb: 2 }}
            />
          </Box>
        )

      default:
        return (
          <Box>
            <Typography variant="body1" color="text.secondary">
              Please select an exercise type to configure its content.
            </Typography>
          </Box>
        )
    }
  }

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'error'
      default: return 'default'
    }
  }

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )

  if (loading) return <Box sx={{ p: 3 }}><LinearProgress /></Box>
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>

  return (
    <Box>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom>
              Exercise Builder
            </Typography>
            <Typography color="text.secondary">
              Create and manage dynamic learning workflows and exercises
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setCreateWorkflowDialog(true)}
          >
            New Workflow
          </Button>
        </Box>
      </Paper>

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
            <Grid item xs={12} md={6} lg={4} key={workflow.id}>
              <Card sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease',
                  borderColor: 'primary.main'
                }
              }}>
                <CardContent sx={{ pb: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1.5}>
                    <Typography variant="h6" component="h3" sx={{ 
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'text.primary'
                    }}>
                      {workflow.name}
                    </Typography>
                    <Chip 
                      label={workflow.difficulty_level} 
                      size="small"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: 20,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        border: 'none',
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

      {/* Chart View Tab */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" gutterBottom>
          Workflow Visual Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Visual representation of your learning workflows with exercise progression and remedial paths
        </Typography>
        
        <Grid container spacing={3}>
          {workflows.map(workflow => (
            <Grid item xs={12} md={6} lg={4} key={workflow.id}>
              <WorkflowChart 
                workflow={workflow} 
                height={300}
                showControls={false}
              />
            </Grid>
          ))}
          
          {workflows.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <FlowIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No workflows created yet
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Create your first workflow to see the visual flow chart
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => setCreateWorkflowDialog(true)}
                >
                  Create First Workflow
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Import Existing Tab */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h6" gutterBottom>
          Import Existing Exercises
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Convert your existing Phase 1 and Phase 2 exercises into visual workflow representations
        </Typography>
        
        {!importPreview ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ImportIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Ready to Import Existing Exercises
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              This will convert your Phase 1 dialogue sequences and Phase 2 collaborative activities 
              into visual Flow-based Programming workflows that you can see and manage in the dashboard.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<ViewIcon />}
              onClick={handlePreviewImport}
              disabled={loading}
            >
              Preview What Will Be Imported
            </Button>
          </Paper>
        ) : (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Preview of exercises that will be imported as visual workflows:
            </Alert>
            
            <Grid container spacing={3}>
              {/* Phase 1 Preview */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      {importPreview.phase1.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Cultural Event Interview - Main dialogue sequence
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Exercise Steps:</Typography>
                      <Chip label={`${importPreview.phase1.steps} dialogue steps`} size="small" />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Characters:</Typography>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {importPreview.phase1.speakers.map(speaker => (
                          <Chip key={speaker} label={speaker} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2">Skills Assessed:</Typography>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {importPreview.phase1.skills.map(skill => (
                          <Chip key={skill} label={skill} size="small" variant="outlined" color="secondary" />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Phase 2 Preview */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Phase 2: Collaborative Activities
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Team planning and cultural event organization
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Total Steps:</Typography>
                      <Chip label={`${importPreview.phase2.steps} collaborative steps`} size="small" />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Step Activities:</Typography>
                      <List dense>
                        {importPreview.phase2.step_names.map((stepName, index) => (
                          <ListItem key={index} sx={{ py: 0 }}>
                            <ListItemText 
                              primary={stepName}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2">Remedial Levels:</Typography>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {importPreview.phase2.remedial_levels.map(level => (
                          <Chip key={level} label={level} size="small" variant="outlined" color="warning" />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ImportIcon />}
                onClick={handleImportWorkflows}
                disabled={importing}
                color="primary"
                sx={{ mr: 2 }}
              >
                {importing ? 'Importing...' : 'Import All Workflows'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setImportPreview(null)}
                disabled={importing}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
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

          {/* Exercise Library Grid */}
          {exerciseLibrary.map((exercise) => (
            <Grid item xs={12} md={6} lg={4} key={exercise.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {exercise.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {exercise.description}
                  </Typography>
                  
                  <Chip 
                    label={exercise.exercise_type} 
                    size="small" 
                    sx={{ mb: 1, mr: 1 }}
                  />
                  
                  <Typography variant="caption" display="block" color="text.secondary">
                    Difficulty Levels: {Object.keys(exercise.difficulty_levels || {}).join(', ')}
                  </Typography>
                  
                  <Typography variant="caption" display="block" color="text.secondary">
                    Created: {new Date(exercise.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/admin/exercises/edit/${exercise.id}`)}
                  >
                    Edit
                  </Button>
                  <Button size="small">Use in Workflow</Button>
                  <Button size="small" color="error">Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          
          {exerciseLibrary.length === 0 && !loading && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <AddIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
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


      {/* Create Exercise Dialog */}
      <Dialog 
        open={createExerciseDialog} 
        onClose={() => setCreateExerciseDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Create New Exercise</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a reusable exercise with type-specific configurations and difficulty levels
          </Typography>
          
          <TextField
            label="Exercise Name"
            fullWidth
            variant="outlined"
            value={newExercise.name}
            onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={newExercise.description}
            onChange={(e) => setNewExercise({...newExercise, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <TextField
            select
            label="Exercise Type"
            fullWidth
            variant="outlined"
            value={newExercise.exercise_type}
            onChange={(e) => {
              setNewExercise({...newExercise, exercise_type: e.target.value})
              setSelectedExerciseType(e.target.value)
            }}
            SelectProps={{ native: true }}
            sx={{ mb: 3 }}
          >
            <option value="">Select Exercise Type</option>
            <option value="storytelling">Storytelling</option>
            <option value="matching_game">Drag & Drop Matching</option>
            <option value="fill_gaps">Fill in the Blanks</option>
            <option value="listening_comprehension">Listening Comprehension</option>
            <option value="dialogue_practice">Dialogue Practice</option>
            <option value="creative_writing">Creative Writing</option>
            <option value="peer_negotiation">Peer Negotiation</option>
            <option value="role_suggestion">Role Suggestion</option>
            <option value="cultural_analysis">Cultural Analysis</option>
          </TextField>

          {selectedExerciseType && (
            <>
              {/* Dynamic Content Form Based on Exercise Type */}
              {renderExerciseContentForm()}

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Difficulty Levels Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Configure content and instructions for each CEFR level
              </Typography>
              
              {['A1', 'A2', 'B1', 'B2'].map(level => (
                <Box key={level} sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Level {level}
                  </Typography>
                  <TextField
                    label={`${level} Content`}
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    value={newExercise.difficulty_levels[level]?.content || ''}
                    onChange={(e) => setNewExercise({
                      ...newExercise,
                      difficulty_levels: {
                        ...newExercise.difficulty_levels,
                        [level]: {
                          ...newExercise.difficulty_levels[level],
                          content: e.target.value
                        }
                      }
                    })}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label={`${level} Instructions`}
                    fullWidth
                    multiline
                    rows={1}
                    variant="outlined"
                    value={newExercise.difficulty_levels[level]?.instructions || ''}
                    onChange={(e) => setNewExercise({
                      ...newExercise,
                      difficulty_levels: {
                        ...newExercise.difficulty_levels,
                        [level]: {
                          ...newExercise.difficulty_levels[level],
                          instructions: e.target.value
                        }
                      }
                    })}
                  />
                </Box>
              ))}
              
              <TextField
                label="AI Instructions"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={newExercise.ai_instructions}
                onChange={(e) => setNewExercise({...newExercise, ai_instructions: e.target.value})}
                helperText="Instructions for AI assistance during the exercise"
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateExerciseDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={!newExercise.name || !newExercise.exercise_type}
            onClick={handleCreateExercise}
          >
            Create Exercise
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