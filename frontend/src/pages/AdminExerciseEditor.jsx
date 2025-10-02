import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Box, Paper, Typography, Grid, TextField, Button, Chip, IconButton, 
  Card, CardContent, List, ListItem, ListItemText, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Checkbox, Alert, LinearProgress,
  Tooltip, Divider, Stepper, Step, StepLabel
} from '@mui/material'
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Info as InfoIcon,
  VolumeUp as AudioIcon,
  Image as ImageIcon
} from '@mui/icons-material'

export default function AdminExerciseEditor() {
  const { exerciseId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEditMode = Boolean(exerciseId)
  
  const [exercise, setExercise] = useState({
    name: '',
    description: '',
    exercise_type: '',
    exercise_context: {
      prompt: '',
      question: '',
      audio_file: '',
      image_file: '',
      scenario: '',
      options: ['', '', '', ''],
      word_bank: ['', '', '', '', ''],
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
      question_type: 'multiple_choice',
      matching_pairs: [{ item: '', description: '' }],
      listening_questions: [{ 
        question: '', 
        correct_answer: '', 
        options: ['', '', '', ''] 
      }]
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

  // Available characters from the game
  const availableCharacters = {
    'Ms. Mabrouki': {
      role: 'Event Coordinator',
      description: 'Facilitates discussions, provides guidance.',
      personality: 'Organized, encouraging, and detail-oriented',
      avatar: 'mabrouki.svg'
    },
    'SKANDER': {
      role: 'Student Council President',
      description: 'Engages players in team activities.',
      personality: 'Charismatic, energetic, and visionary',
      avatar: 'skander.svg'
    },
    'Emna': {
      role: 'Committee Member',
      description: 'Manages finances and logistics',
      personality: 'Practical, precise, and reliable',
      avatar: 'emna.svg'
    },
    'Ryan': {
      role: 'Committee Member',
      description: 'Coordinates social media and outreach',
      personality: 'Creative, tech-savvy, and social',
      avatar: 'ryan.svg'
    },
    'Lilia': {
      role: 'Committee Member',
      description: 'Handles artistic direction and cultural authenticity',
      personality: 'Artistic, thoughtful, and passionate about tradition',
      avatar: 'lilia.svg'
    }
  }

  const exerciseTypes = {
    'storytelling': {
      name: 'Storytelling Task',
      description: 'Students write creative stories based on prompts',
      icon: '📝'
    },
    'matching_game': {
      name: 'Drag & Drop Matching',
      description: 'Match items to their descriptions',
      icon: '🔗'
    },
    'fill_gaps': {
      name: 'Fill in the Blanks',
      description: 'Complete sentences with missing words',
      icon: '📝'
    },
    'listening_comprehension': {
      name: 'Listening Comprehension',
      description: 'Audio-based comprehension exercises',
      icon: '🎧'
    },
    'dialogue_practice': {
      name: 'Dialogue Practice',
      description: 'Interactive conversation practice',
      icon: '💬'
    },
    'creative_writing': {
      name: 'Creative Writing',
      description: 'Open-ended creative writing tasks',
      icon: '✍️'
    },
    'peer_negotiation': {
      name: 'Peer Negotiation',
      description: 'Diplomatic discussion and agreement tasks',
      icon: '🤝'
    },
    'role_suggestion': {
      name: 'Role Suggestion',
      description: 'Suggest roles for team members',
      icon: '👥'
    },
    'cultural_analysis': {
      name: 'Cultural Analysis',
      description: 'Analyze cultural elements and contexts',
      icon: '🏛️'
    }
  }

  // Load exercise data in edit mode
  useEffect(() => {
    if (isEditMode && exerciseId) {
      loadExercise()
    }
  }, [isEditMode, exerciseId])

  // Update exercise name and description when type changes (only in create mode)
  useEffect(() => {
    if (!isEditMode && exercise.exercise_type && exerciseTypes[exercise.exercise_type]) {
      setExercise(prev => ({
        ...prev,
        name: prev.name || `New ${exerciseTypes[exercise.exercise_type].name}`,
        description: prev.description || exerciseTypes[exercise.exercise_type].description
      }))
    }
  }, [exercise.exercise_type, isEditMode])

  const loadExercise = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/exercises/library/${exerciseId}`, {
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load exercise')
      }
      
      setExercise(prev => ({
        ...prev,
        ...data.exercise,
        exercise_context: {
          ...prev.exercise_context,
          ...data.exercise.exercise_context,
          // Ensure all array properties have default values
          matching_pairs: data.exercise.exercise_context?.matching_pairs || [{ item: '', description: '' }],
          listening_questions: data.exercise.exercise_context?.listening_questions || [{ 
            question: '', 
            correct_answer: '', 
            options: ['', '', '', ''] 
          }],
          dialogue_lines: data.exercise.exercise_context?.dialogue_lines || [
            { speaker: 'Character A', text: '' },
            { speaker: 'Character B', text: '' }
          ],
          options: data.exercise.exercise_context?.options || ['', '', '', ''],
          word_bank: data.exercise.exercise_context?.word_bank || ['', '', '', '', ''],
          positions: data.exercise.exercise_context?.positions || ['', ''],
          available_roles: data.exercise.exercise_context?.available_roles || ['', '', ''],
          team_members: data.exercise.exercise_context?.team_members || ['', '', '']
        }
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateExerciseContext = (field, value) => {
    setExercise({
      ...exercise,
      exercise_context: { ...exercise.exercise_context, [field]: value }
    })
  }

  const updateCorrectAnswers = (value) => {
    setExercise({...exercise, correct_answers: value})
  }

  const updateWrongAnswers = (value) => {
    setExercise({...exercise, wrong_answers: value})
  }

  // Helper functions for arrays
  const updateArrayField = (fieldName, index, value) => {
    const currentArray = exercise.exercise_context[fieldName] || []
    const newArray = [...currentArray]
    newArray[index] = value
    updateExerciseContext(fieldName, newArray)
  }

  const addArrayItem = (fieldName, defaultValue = '') => {
    const currentArray = exercise.exercise_context[fieldName] || []
    updateExerciseContext(fieldName, [...currentArray, defaultValue])
  }

  const removeArrayItem = (fieldName, index) => {
    const currentArray = exercise.exercise_context[fieldName] || []
    const newArray = currentArray.filter((_, i) => i !== index)
    updateExerciseContext(fieldName, newArray)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      
      const url = isEditMode 
        ? `/api/admin/exercises/library/${exerciseId}`
        : '/api/admin/exercises/library'
      
      const method = isEditMode ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(exercise)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} exercise`)
      }
      
      // Show success and redirect
      navigate('/admin/exercises', { 
        state: { message: `Exercise ${isEditMode ? 'updated' : 'created'} successfully!` }
      })
      
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const renderExerciseForm = () => {
    if (!exercise.exercise_type) {
      return (
        <Alert severity="info">
          Please select an exercise type above to configure the exercise content.
        </Alert>
      )
    }

    switch(exercise.exercise_type) {
      case 'storytelling':
        return renderStorytellingForm()
      case 'matching_game':
        return renderMatchingGameForm()
      case 'fill_gaps':
        return renderFillGapsForm()
      case 'listening_comprehension':
        return renderListeningForm()
      case 'dialogue_practice':
        return renderDialogueForm()
      case 'creative_writing':
        return renderCreativeWritingForm()
      case 'peer_negotiation':
        return renderNegotiationForm()
      case 'role_suggestion':
        return renderRoleSuggestionForm()
      case 'cultural_analysis':
        return renderCulturalAnalysisForm()
      default:
        return (
          <Alert severity="error">
            Unknown exercise type: {exercise.exercise_type}
          </Alert>
        )
    }
  }

  const renderStorytellingForm = () => (
    <Box>
      <TextField
        label="Story Prompt"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        value={exercise.exercise_context.prompt || ''}
        onChange={(e) => updateExerciseContext('prompt', e.target.value)}
        helperText="The creative writing prompt for the story"
        sx={{ mb: 2 }}
      />
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Minimum Words"
          type="number"
          variant="outlined"
          value={exercise.exercise_context.min_words || 50}
          onChange={(e) => updateExerciseContext('min_words', parseInt(e.target.value))}
          sx={{ width: '50%' }}
        />
        <TextField
          label="Maximum Words"
          type="number"
          variant="outlined"
          value={exercise.exercise_context.max_words || 200}
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
        value={exercise.correct_answers || ''}
        onChange={(e) => updateCorrectAnswers(e.target.value)}
        helperText="Key elements that should be present in a good story"
        sx={{ mb: 2 }}
      />
    </Box>
  )

  const renderMatchingGameForm = () => {
    const matchingPairs = exercise.exercise_context.matching_pairs || [{ item: '', description: '' }]
    return (
      <Box>
        <TextField
          label="Matching Instructions"
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          value={exercise.exercise_context.question || ''}
          onChange={(e) => updateExerciseContext('question', e.target.value)}
          helperText="Instructions for the matching exercise"
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
              }}
              sx={{ flex: 1 }}
            />
            {matchingPairs.length > 1 && (
              <IconButton 
                onClick={() => {
                  const newPairs = matchingPairs.filter((_, i) => i !== index)
                  updateExerciseContext('matching_pairs', newPairs)
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
  }

  const renderFillGapsForm = () => {
    const correctAnswers = Array.isArray(exercise.correct_answers) ? exercise.correct_answers : []
    const wordBankWords = exercise.exercise_context.word_bank || ['', '', '', '', '']
    
    return (
      <Box>
        <TextField
          label="Text with Blanks"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={exercise.exercise_context.prompt || ''}
          onChange={(e) => updateExerciseContext('prompt', e.target.value)}
          helperText="Use _____ to mark gaps"
          sx={{ mb: 3 }}
        />
        
        <Typography variant="subtitle1" gutterBottom>Correct Answers (in order)</Typography>
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
                updateCorrectAnswers(newAnswers)
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
      </Box>
    )
  }

  // Simplified forms for other exercise types (following same pattern)
  const renderListeningForm = () => {
    const listeningQuestions = exercise.exercise_context.listening_questions || [{ 
      question: '', 
      correct_answer: '', 
      options: ['', '', '', ''] 
    }]
    return (
      <Box>
        <TextField
          label="Audio File URL"
          fullWidth
          variant="outlined"
          value={exercise.exercise_context.audio_file || ''}
          onChange={(e) => updateExerciseContext('audio_file', e.target.value)}
          helperText="URL or path to the audio file (e.g., /static/audio/listening1.mp3)"
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Question Type"
          fullWidth
          variant="outlined"
          value={exercise.exercise_context.question_type || 'multiple_choice'}
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
            
            {exercise.exercise_context.question_type === 'multiple_choice' && (
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
            
            {exercise.exercise_context.question_type === 'short_answer' && (
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
            
            {exercise.exercise_context.question_type === 'true_false' && (
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
  }

  const renderDialogueForm = () => {
    const dialogueLines = exercise.exercise_context.dialogue_lines || [
      { speaker: 'Character A', text: '' },
      { speaker: 'Character B', text: '' }
    ]
    return (
      <Box>
        <TextField
          label="Dialogue Scenario"
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          value={exercise.exercise_context.scenario || ''}
          onChange={(e) => updateExerciseContext('scenario', e.target.value)}
          helperText="The conversation context (e.g., 'You are meeting a new classmate at university')"
          sx={{ mb: 3 }}
        />
        
        <Typography variant="subtitle1" gutterBottom>Dialogue Conversation</Typography>
        {dialogueLines.map((line, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              <TextField
                select
                label="Speaker"
                variant="outlined"
                size="small"
                value={line.speaker || ''}
                onChange={(e) => {
                  const newLines = [...dialogueLines]
                  newLines[index] = { ...newLines[index], speaker: e.target.value }
                  updateExerciseContext('dialogue_lines', newLines)
                }}
                SelectProps={{ native: true }}
                sx={{ width: '30%' }}
              >
                <option value="">Choose speaker...</option>
                <option value="Student">Student (Player)</option>
                {exercise.exercise_context.include_characters && 
                 exercise.exercise_context.selected_characters?.map(charName => (
                  <option key={charName} value={charName}>{charName}</option>
                ))}
                <option value="custom">Custom Speaker</option>
              </TextField>
              
              {line.speaker === 'custom' && (
                <TextField
                  label="Custom Speaker Name"
                  variant="outlined"
                  size="small"
                  value={line.custom_speaker || ''}
                  onChange={(e) => {
                    const newLines = [...dialogueLines]
                    newLines[index] = { ...newLines[index], custom_speaker: e.target.value }
                    updateExerciseContext('dialogue_lines', newLines)
                  }}
                  sx={{ width: '30%' }}
                />
              )}
              
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
          value={exercise.correct_answers || ''}
          onChange={(e) => updateCorrectAnswers(e.target.value)}
          helperText="What makes a good dialogue response (e.g., appropriate tone, cultural awareness, correct grammar)"
          sx={{ mb: 2 }}
        />
      </Box>
    )
  }

  const renderCreativeWritingForm = () => (
    <Box>
      <TextField
        select
        label="Writing Type"
        fullWidth
        variant="outlined"
        value={exercise.exercise_context.writing_type || 'essay'}
        onChange={(e) => updateExerciseContext('writing_type', e.target.value)}
        SelectProps={{ native: true }}
        sx={{ mb: 2 }}
      >
        <option value="poem">Poem</option>
        <option value="essay">Essay</option>
        <option value="letter">Letter</option>
        <option value="report">Report</option>
        <option value="story">Story</option>
        <option value="journal">Journal Entry</option>
        <option value="review">Review/Critique</option>
        <option value="blog">Blog Post</option>
      </TextField>
      <TextField
        label="Writing Guidelines & Topic"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        value={exercise.exercise_context.prompt || ''}
        onChange={(e) => updateExerciseContext('prompt', e.target.value)}
        helperText="Clear guidelines and topic for the writing task (e.g., 'Write a formal letter to the university dean requesting funding for your cultural event')"
        sx={{ mb: 2 }}
      />
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Minimum Length (words)"
          type="number"
          variant="outlined"
          value={exercise.exercise_context.min_length || 100}
          onChange={(e) => updateExerciseContext('min_length', parseInt(e.target.value))}
          sx={{ width: '50%' }}
        />
        <TextField
          label="Time Limit (minutes)"
          type="number"
          variant="outlined"
          value={exercise.exercise_context.time_limit || 15}
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
        value={exercise.correct_answers || ''}
        onChange={(e) => updateCorrectAnswers(e.target.value)}
        helperText="Key criteria for evaluating the writing (e.g., clear structure, appropriate vocabulary, cultural awareness, grammar accuracy)"
        sx={{ mb: 2 }}
      />
    </Box>
  )

  const renderNegotiationForm = () => {
    const positions = exercise.exercise_context.positions || ['', '']
    return (
      <Box>
        <TextField
          label="Negotiation Scenario"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={exercise.exercise_context.scenario || ''}
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
          value={exercise.correct_answers || ''}
          onChange={(e) => updateCorrectAnswers(e.target.value)}
          helperText="Examples of successful diplomatic solutions (e.g., compromise solutions, win-win outcomes, respectful language)"
          sx={{ mb: 2 }}
        />
      </Box>
    )
  }

  const renderRoleSuggestionForm = () => {
    const availableRoles = exercise.exercise_context.available_roles || ['', '', '']
    const teamMembers = exercise.exercise_context.team_members || ['', '', '']
    return (
      <Box>
        <TextField
          label="Team Scenario"
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          value={exercise.exercise_context.scenario || ''}
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
          value={exercise.correct_answers || ''}
          onChange={(e) => updateCorrectAnswers(e.target.value)}
          helperText="What makes a good role assignment (e.g., matching skills to roles, clear reasoning, consideration of everyone's strengths)"
          sx={{ mb: 2 }}
        />
      </Box>
    )
  }

  const renderCulturalAnalysisForm = () => (
    <Box>
      <TextField
        label="Cultural Element to Analyze"
        fullWidth
        variant="outlined"
        value={exercise.exercise_context.cultural_element || ''}
        onChange={(e) => updateExerciseContext('cultural_element', e.target.value)}
        helperText="The cultural aspect students will analyze (e.g., 'Traditional Tunisian wedding customs', 'University graduation ceremonies')"
        sx={{ mb: 2 }}
      />
      <TextField
        select
        label="Analysis Type"
        fullWidth
        variant="outlined"
        value={exercise.exercise_context.analysis_type || 'comparison'}
        onChange={(e) => updateExerciseContext('analysis_type', e.target.value)}
        SelectProps={{ native: true }}
        sx={{ mb: 2 }}
      >
        <option value="comparison">Comparison</option>
        <option value="description">Description</option>
        <option value="significance">Significance</option>
        <option value="impact">Impact</option>
        <option value="evolution">Historical Evolution</option>
        <option value="critique">Critical Analysis</option>
      </TextField>
      <TextField
        label="Analysis Prompt"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        value={exercise.exercise_context.prompt || ''}
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
        value={exercise.correct_answers || ''}
        onChange={(e) => updateCorrectAnswers(e.target.value)}
        helperText="Key aspects for good analysis (e.g., demonstrates cultural understanding, provides specific examples, shows critical thinking, uses appropriate vocabulary)"
        sx={{ mb: 2 }}
      />
    </Box>
  )

  const renderExercisePreview = () => {
    const typeData = exerciseTypes[exercise.exercise_type]
    if (!typeData) {
      return (
        <Card sx={{ height: 'fit-content', position: 'sticky', top: 20 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📋 Exercise Preview
            </Typography>
            <Alert severity="info">
              Select an exercise type to see the preview
            </Alert>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card sx={{ height: 'fit-content', position: 'sticky', top: 20 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ mr: 1 }}>
              {typeData.icon} Live Preview
            </Typography>
            <Tooltip title="This shows how students will see the exercise">
              <InfoIcon color="primary" sx={{ fontSize: 20 }} />
            </Tooltip>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Exercise Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary">
              {exercise.name || 'Untitled Exercise'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {exercise.description || 'No description provided'}
            </Typography>
            <Chip 
              label={typeData.name} 
              size="small" 
              sx={{ mt: 1 }}
            />
          </Box>

          {/* Exercise Content Preview */}
          {renderExerciseContentPreview()}
          
          {/* Student Actions */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>Student Actions:</Typography>
            <Box display="flex" gap={1}>
              <Button size="small" variant="outlined" startIcon={<PlayIcon />}>
                Start Exercise
              </Button>
              <Button size="small" variant="outlined">
                Submit Answer
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const renderExerciseContentPreview = () => {
    switch(exercise.exercise_type) {
      case 'storytelling':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Story Prompt:</strong><br />
              {exercise.exercise_context.prompt || 'Enter a story prompt...'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Word limit: {exercise.exercise_context.min_words || 50} - {exercise.exercise_context.max_words || 200} words
            </Typography>
            <TextField
              placeholder="Student would write their story here..."
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              disabled
            />
          </Box>
        )
      
      case 'matching_game':
        const pairs = exercise.exercise_context.matching_pairs || []
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {exercise.exercise_context.question || 'Match the items below...'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Drag items from the left to match with descriptions on the right:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Items:</Typography>
                {pairs.map((pair, index) => (
                  <Paper key={index} sx={{ p: 1, mb: 1, backgroundColor: 'primary.light', color: 'white' }}>
                    {pair.item || `Item ${index + 1}`}
                  </Paper>
                ))}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Descriptions:</Typography>
                {pairs.map((pair, index) => (
                  <Paper key={index} sx={{ p: 1, mb: 1, border: '2px dashed', borderColor: 'grey.300' }}>
                    {pair.description || `Description ${index + 1}`}
                  </Paper>
                ))}
              </Grid>
            </Grid>
          </Box>
        )
      
      case 'fill_gaps':
        const text = exercise.exercise_context.prompt || 'Enter text with _____ for blanks...'
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Fill in the blanks:
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="body1">
                {text.split('_____').map((part, index, array) => (
                  <span key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <TextField 
                        size="small" 
                        sx={{ mx: 1, width: 100 }} 
                        placeholder="___"
                        disabled
                      />
                    )}
                  </span>
                ))}
              </Typography>
            </Paper>
          </Box>
        )
      
      case 'listening_comprehension':
        return (
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <AudioIcon color="primary" />
              <Typography variant="body1">
                {exercise.exercise_context.audio_file || 'No audio file selected'}
              </Typography>
              <Button size="small" variant="outlined" startIcon={<PlayIcon />}>
                Play Audio
              </Button>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {exercise.exercise_context.question || 'Listen to the audio and answer the questions...'}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup>
                <FormControlLabel value="a" control={<Radio />} label="Option A" />
                <FormControlLabel value="b" control={<Radio />} label="Option B" />
                <FormControlLabel value="c" control={<Radio />} label="Option C" />
                <FormControlLabel value="d" control={<Radio />} label="Option D" />
              </RadioGroup>
            </FormControl>
          </Box>
        )

      case 'dialogue_practice':
        const dialogueLines = exercise.exercise_context.dialogue_lines || []
        return (
          <Box>
            {exercise.exercise_context.include_characters && exercise.exercise_context.selected_characters?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Characters in this exercise:</Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {exercise.exercise_context.selected_characters.map(charName => (
                    <Chip 
                      key={charName} 
                      label={`${charName} - ${availableCharacters[charName]?.role}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Scenario:</strong><br />
              {exercise.exercise_context.scenario || 'Enter a dialogue scenario...'}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Conversation:</Typography>
            <Box sx={{ backgroundColor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
              {dialogueLines.length > 0 ? (
                dialogueLines.map((line, index) => {
                  const speakerName = line.speaker === 'custom' ? line.custom_speaker : line.speaker
                  const isCharacter = exercise.exercise_context.selected_characters?.includes(line.speaker)
                  return (
                    <Box key={index} sx={{ mb: 1.5 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {isCharacter && (
                          <Box 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: '50%', 
                              backgroundColor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '12px'
                            }}
                          >
                            {line.speaker.charAt(0)}
                          </Box>
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: isCharacter ? 'primary.main' : 'text.primary' }}>
                          {speakerName || `Speaker ${index + 1}`}:
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: isCharacter ? 4 : 2, fontStyle: line.text ? 'normal' : 'italic' }}>
                        {line.text || 'Enter dialogue text...'}
                      </Typography>
                    </Box>
                  )
                })
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Add dialogue lines to see the conversation preview...
                </Typography>
              )}
            </Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Your Response:</Typography>
            <TextField
              placeholder="Student would type their response here..."
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
        )

      case 'creative_writing':
        return (
          <Box>
            <Chip 
              label={exercise.exercise_context.writing_type || 'essay'} 
              sx={{ mb: 2 }}
              color="primary"
            />
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Writing Task:</strong><br />
              {exercise.exercise_context.prompt || 'Enter writing guidelines...'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Minimum length: {exercise.exercise_context.min_length || 100} words
              {exercise.exercise_context.time_limit && ` • Time limit: ${exercise.exercise_context.time_limit} minutes`}
            </Typography>
            <TextField
              placeholder="Student would write their creative piece here..."
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
        )

      case 'peer_negotiation':
        const positions = exercise.exercise_context.positions || []
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Negotiation Scenario:</strong><br />
              {exercise.exercise_context.scenario || 'Enter negotiation scenario...'}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Different Viewpoints:</Typography>
            <Box sx={{ mb: 2 }}>
              {positions.length > 0 && positions.some(p => p.trim()) ? (
                positions.filter(p => p.trim()).map((position, index) => (
                  <Paper key={index} sx={{ p: 1.5, mb: 1, backgroundColor: index % 2 === 0 ? 'blue.50' : 'orange.50' }}>
                    <Typography variant="body2">
                      <strong>Position {index + 1}:</strong> {position}
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Add different positions to see the negotiation setup...
                </Typography>
              )}
            </Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Your Diplomatic Response:</Typography>
            <TextField
              placeholder="Student would provide their negotiation response here..."
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
        )

      case 'role_suggestion':
        const availableRoles = exercise.exercise_context.available_roles || []
        const teamMembers = exercise.exercise_context.team_members || []
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Team Scenario:</strong><br />
              {exercise.exercise_context.scenario || 'Enter team scenario...'}
            </Typography>
            
            {availableRoles.length > 0 && availableRoles.some(r => r.trim()) && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Available Roles:</Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  {availableRoles.filter(r => r.trim()).map((role, index) => (
                    <Chip key={index} label={role} variant="outlined" color="primary" />
                  ))}
                </Box>
              </Box>
            )}

            {teamMembers.length > 0 && teamMembers.some(m => m.trim()) && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Team Members:</Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  {teamMembers.filter(m => m.trim()).map((member, index) => (
                    <Chip key={index} label={member} variant="outlined" color="secondary" />
                  ))}
                </Box>
              </Box>
            )}

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Role Assignment Suggestions:</Typography>
            <TextField
              placeholder="Student would suggest role assignments with reasoning here..."
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
        )

      case 'cultural_analysis':
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Cultural Element:</strong><br />
              {exercise.exercise_context.cultural_element || 'Enter cultural element to analyze...'}
            </Typography>
            <Chip 
              label={`Analysis Type: ${exercise.exercise_context.analysis_type || 'comparison'}`}
              sx={{ mb: 2 }}
              color="secondary"
            />
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Analysis Prompt:</strong><br />
              {exercise.exercise_context.prompt || 'Enter analysis prompt...'}
            </Typography>
            <TextField
              placeholder="Student would write their cultural analysis here..."
              multiline
              rows={5}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
        )
      
      default:
        return (
          <Box>
            <Typography variant="body1" color="text.secondary">
              Preview will appear here as you configure the exercise...
            </Typography>
          </Box>
        )
    }
  }

  if (loading) return <LinearProgress />

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => navigate('/admin/exercises')} sx={{ mr: 2 }}>
              <BackIcon />
            </IconButton>
            <Box>
              <Typography variant="h5">
                {isEditMode ? 'Edit Exercise' : 'Create Exercise'}
              </Typography>
              <Typography color="text.secondary">
                {isEditMode 
                  ? 'Modify and update your existing exercise'
                  : 'Build interactive learning exercises with live preview'
                }
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => {/* Preview functionality */}}
            >
              Full Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving || !exercise.name || !exercise.exercise_type}
            >
              {saving 
                ? (isEditMode ? 'Updating...' : 'Saving...') 
                : (isEditMode ? 'Update Exercise' : 'Save Exercise')
              }
            </Button>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, mx: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
        {/* Left Side - Live Preview */}
        <Grid item xs={12} md={5}>
          {renderExercisePreview()}
        </Grid>

        {/* Right Side - Exercise Configuration */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Exercise Configuration
            </Typography>
            
            {/* Exercise Type Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>Exercise Type</Typography>
              <TextField
                select
                label="Select Exercise Type"
                fullWidth
                variant="outlined"
                value={exercise.exercise_type}
                onChange={(e) => setExercise({...exercise, exercise_type: e.target.value})}
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
                required
                disabled={isEditMode}
                helperText={isEditMode ? "Exercise type cannot be changed in edit mode" : ""}
              >
                <option value="">Choose an exercise type...</option>
                {Object.entries(exerciseTypes).map(([typeId, typeData]) => (
                  <option key={typeId} value={typeId}>
                    {typeData.icon} {typeData.name}
                  </option>
                ))}
              </TextField>
              {exercise.exercise_type && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <strong>{exerciseTypes[exercise.exercise_type].name}:</strong> {exerciseTypes[exercise.exercise_type].description}
                </Alert>
              )}
            </Box>

            {/* Basic Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>Basic Information</Typography>
              <TextField
                label="Exercise Name"
                fullWidth
                variant="outlined"
                value={exercise.name}
                onChange={(e) => setExercise({...exercise, name: e.target.value})}
                sx={{ mb: 2 }}
                required
                disabled={!exercise.exercise_type}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={exercise.description}
                onChange={(e) => setExercise({...exercise, description: e.target.value})}
                sx={{ mb: 2 }}
                disabled={!exercise.exercise_type}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Character Selection */}
            {exercise.exercise_type && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>Character Configuration</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choose whether to include characters in this exercise and select which ones
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Include Characters:</Typography>
                  <Box display="flex" gap={2}>
                    <Button
                      variant={exercise.exercise_context.include_characters ? "contained" : "outlined"}
                      onClick={() => updateExerciseContext('include_characters', true)}
                      size="small"
                    >
                      Yes
                    </Button>
                    <Button
                      variant={!exercise.exercise_context.include_characters ? "contained" : "outlined"}
                      onClick={() => updateExerciseContext('include_characters', false)}
                      size="small"
                    >
                      No
                    </Button>
                  </Box>
                </Box>

                {exercise.exercise_context.include_characters && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>Select Characters:</Typography>
                    <Grid container spacing={2}>
                      {Object.entries(availableCharacters).map(([charName, charData]) => {
                        const isSelected = exercise.exercise_context.selected_characters?.includes(charName)
                        return (
                          <Grid item xs={12} sm={6} md={4} key={charName}>
                            <Card 
                              sx={{ 
                                cursor: 'pointer',
                                border: isSelected ? 2 : 1,
                                borderColor: isSelected ? 'primary.main' : 'divider',
                                '&:hover': { borderColor: 'primary.main' }
                              }}
                              onClick={() => {
                                const currentSelected = exercise.exercise_context.selected_characters || []
                                const newSelected = isSelected 
                                  ? currentSelected.filter(name => name !== charName)
                                  : [...currentSelected, charName]
                                updateExerciseContext('selected_characters', newSelected)
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box display="flex" alignItems="center" mb={1}>
                                  <Checkbox 
                                    checked={isSelected}
                                    size="small"
                                    sx={{ p: 0, mr: 1 }}
                                  />
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {charName}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {charData.role}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                                  {charData.personality}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Box>
                )}
              </Box>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Exercise-Specific Configuration */}
            {exercise.exercise_type && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {exerciseTypes[exercise.exercise_type]?.name} Configuration
                </Typography>
                {renderExerciseForm()}
              </Box>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Difficulty Levels */}
            {exercise.exercise_type && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>CEFR Difficulty Levels</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Configure content for different proficiency levels
                </Typography>
                
                {['A1', 'A2', 'B1', 'B2'].map(level => (
                  <Box key={level} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Level {level}
                    </Typography>
                    <TextField
                      label={`${level} Instructions`}
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      value={exercise.difficulty_levels[level]?.instructions || ''}
                      onChange={(e) => setExercise({
                        ...exercise,
                        difficulty_levels: {
                          ...exercise.difficulty_levels,
                          [level]: {
                            ...exercise.difficulty_levels[level],
                            instructions: e.target.value
                          }
                        }
                      })}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* AI Instructions */}
            {exercise.exercise_type && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>AI Assessment Instructions</Typography>
                <TextField
                  label="Instructions for AI Assessment"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  value={exercise.ai_instructions}
                  onChange={(e) => setExercise({...exercise, ai_instructions: e.target.value})}
                  helperText="Guide the AI on how to evaluate student responses"
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}