import React, { useState, useEffect } from 'react'
import {
  Box, Paper, Typography, Button, Stack, TextField, FormControl, InputLabel, 
  Select, MenuItem, RadioGroup, FormControlLabel, Radio, Chip, Alert, Stepper,
  Step, StepLabel, StepContent, Card, CardContent, IconButton, Tooltip
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ReplayIcon from '@mui/icons-material/Replay'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

export default function ExerciseRenderer({ question, onSubmit, loading }) {
  const [response, setResponse] = useState('')
  const [wordBankAnswers, setWordBankAnswers] = useState({})
  const [audioRef, setAudioRef] = useState(null)
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    let finalResponse = response
    
    // Handle word-bank exercises
    if (question.type === 'word_bank' && question.blanks) {
      finalResponse = question.template
      question.blanks.forEach((blank, index) => {
        const answer = wordBankAnswers[index] || ''
        finalResponse = finalResponse.replace(`[${index}]`, answer)
      })
    }
    
    onSubmit(finalResponse)
  }

  const renderExerciseByType = () => {
    switch (question.type) {
      case 'introduction':
      case 'motivation':
      case 'cultural_knowledge':
      case 'creativity':
      case 'skills_discussion':
        return renderOpenEndedExercise()
      
      case 'listening':
        return renderListeningExercise()
      
      case 'social_interaction':
        return renderSocialInteractionExercise()
      
      case 'problem_solving':
        return renderProblemSolvingExercise()
      
      case 'writing':
        return renderWritingExercise()
      
      case 'word_bank':
        return renderWordBankExercise()
      
      case 'dialogue':
        return renderDialogueExercise()
      
      default:
        return renderOpenEndedExercise()
    }
  }

  const renderOpenEndedExercise = () => (
    <Box>
      <Stack spacing={3}>
        <Card variant="outlined" sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                {getExerciseIcon()}
              </Box>
              <Box>
                <Typography variant="h6">
                  {getExerciseTitle()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {getExerciseDescription()}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <TextField
          label="Your response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          multiline
          minRows={4}
          fullWidth
          placeholder={getPlaceholderText()}
          variant="outlined"
        />

        {question.hint && (
          <Box>
            <Button 
              size="small" 
              startIcon={<HelpOutlineIcon />}
              onClick={() => setShowHint(!showHint)}
              sx={{ mb: 1 }}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
            {showHint && (
              <Alert severity="info" sx={{ mt: 1 }}>
                {question.hint}
              </Alert>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  )

  const renderListeningExercise = () => (
    <Box>
      <Stack spacing={3}>
        <Card variant="outlined" sx={{ bgcolor: 'secondary.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎧 Listening Comprehension
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Listen carefully to the audio and respond to the question
            </Typography>
          </CardContent>
        </Card>

        {question.audio_url && (
          <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <audio src={question.audio_url} ref={setAudioRef} />
              <IconButton 
                color="primary" 
                size="large"
                onClick={() => audioRef && audioRef.play()}
                sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                <PlayArrowIcon />
              </IconButton>
              <IconButton 
                color="primary"
                onClick={() => { 
                  if (audioRef) { 
                    audioRef.currentTime = 0
                    audioRef.play() 
                  }
                }}
              >
                <ReplayIcon />
              </IconButton>
              <Tooltip title="Play Audio">
                <Chip 
                  icon={<VolumeUpIcon />} 
                  label="Audio Available" 
                  color="primary" 
                  variant="outlined" 
                />
              </Tooltip>
            </Stack>
          </Paper>
        )}

        <TextField
          label="What did you hear? Respond to the speaker"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          multiline
          minRows={3}
          fullWidth
          placeholder="Listen carefully and respond appropriately..."
        />
      </Stack>
    </Box>
  )

  const renderWordBankExercise = () => (
    <Box>
      <Stack spacing={3}>
        <Card variant="outlined" sx={{ bgcolor: 'tertiary.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔤 Word Bank Exercise
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Fill in the blanks using the correct words from the options
            </Typography>
          </CardContent>
        </Card>

        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Complete the sentence by selecting the appropriate words:
          </Typography>
          
          {question.blanks && question.blanks.map((blank, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Choose word {index + 1}</InputLabel>
                <Select
                  value={wordBankAnswers[index] || ''}
                  onChange={(e) => setWordBankAnswers({
                    ...wordBankAnswers,
                    [index]: e.target.value
                  })}
                >
                  {blank.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ))}

          {question.template && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Preview:</strong> {generatePreview()}
              </Typography>
            </Alert>
          )}
        </Paper>
      </Stack>
    </Box>
  )

  const renderSocialInteractionExercise = () => (
    <Box>
      <Stack spacing={3}>
        <Card variant="outlined" sx={{ bgcolor: 'success.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💬 Social Interaction
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Practice real-world communication and social skills
            </Typography>
          </CardContent>
        </Card>

        <Alert severity="info" icon={<CheckCircleIcon />}>
          <Typography variant="body2">
            <strong>Communication Tips:</strong> Be polite, clear, and consider cultural context
          </Typography>
        </Alert>

        <TextField
          label="Your response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          multiline
          minRows={4}
          fullWidth
          placeholder="How would you respond in this social situation? Consider politeness and cultural context..."
        />
      </Stack>
    </Box>
  )

  const renderProblemSolvingExercise = () => (
    <Box>
      <Stack spacing={3}>
        <Card variant="outlined" sx={{ bgcolor: 'warning.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🧩 Problem Solving
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Think critically and propose solutions
            </Typography>
          </CardContent>
        </Card>

        <Stepper orientation="vertical">
          <Step active>
            <StepLabel>Understand the Problem</StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary">
                Read the situation carefully and identify the key issues
              </Typography>
            </StepContent>
          </Step>
          <Step active>
            <StepLabel>Propose a Solution</StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary">
                Think of practical steps to address the problem
              </Typography>
            </StepContent>
          </Step>
        </Stepper>

        <TextField
          label="Your solution"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          multiline
          minRows={4}
          fullWidth
          placeholder="Describe your approach to solving this problem step by step..."
        />
      </Stack>
    </Box>
  )

  const renderWritingExercise = () => (
    <Box>
      <Stack spacing={3}>
        <Card variant="outlined" sx={{ bgcolor: 'error.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ✍️ Writing Task
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Demonstrate your writing skills with proper structure and style
            </Typography>
          </CardContent>
        </Card>

        <Alert severity="info">
          <Typography variant="body2">
            <strong>Writing Guidelines:</strong> Use proper grammar, clear structure, and appropriate vocabulary
          </Typography>
        </Alert>

        <TextField
          label="Your written response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          multiline
          minRows={6}
          fullWidth
          placeholder="Write your response with attention to grammar, vocabulary, and structure..."
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
          <Typography variant="caption">
            Word count: {response.split(' ').filter(word => word.length > 0).length}
          </Typography>
          <Typography variant="caption">
            Character count: {response.length}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )

  const renderDialogueExercise = () => (
    <Box>
      <Stack spacing={3}>
        <Card variant="outlined" sx={{ bgcolor: 'info.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💭 Interactive Dialogue
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Participate in a natural conversation
            </Typography>
          </CardContent>
        </Card>

        {question.dialogue_context && (
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Context:</strong> {question.dialogue_context}
            </Typography>
          </Paper>
        )}

        <TextField
          label="Your response in the conversation"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          multiline
          minRows={3}
          fullWidth
          placeholder="Continue the conversation naturally..."
        />
      </Stack>
    </Box>
  )

  const getExerciseIcon = () => {
    const icons = {
      introduction: '👋',
      motivation: '💪',
      cultural_knowledge: '🌍',
      creativity: '🎨',
      skills_discussion: '🗣️'
    }
    return icons[question.type] || '📝'
  }

  const getExerciseTitle = () => {
    const titles = {
      introduction: 'Self Introduction',
      motivation: 'Share Your Motivation',
      cultural_knowledge: 'Cultural Knowledge',
      creativity: 'Creative Thinking',
      skills_discussion: 'Skills & Experience'
    }
    return titles[question.type] || 'Response Exercise'
  }

  const getExerciseDescription = () => {
    const descriptions = {
      introduction: 'Introduce yourself and share relevant background',
      motivation: 'Express your interest and motivation for the project',
      cultural_knowledge: 'Share your understanding of cultural topics',
      creativity: 'Demonstrate creative thinking and original ideas',
      skills_discussion: 'Discuss your skills and relevant experience'
    }
    return descriptions[question.type] || 'Provide a thoughtful response'
  }

  const getPlaceholderText = () => {
    const placeholders = {
      introduction: 'Tell us about yourself, your background, and what brings you here...',
      motivation: 'What motivates you to participate in this cultural event?',
      cultural_knowledge: 'Share your thoughts on this cultural topic...',
      creativity: 'Let your creativity shine through your response...',
      skills_discussion: 'Describe your relevant skills and experience...'
    }
    return placeholders[question.type] || 'Type your response here...'
  }

  const generatePreview = () => {
    if (!question.template) return ''
    
    let preview = question.template
    question.blanks?.forEach((blank, index) => {
      const answer = wordBankAnswers[index] || `[${blank.label || `word ${index + 1}`}]`
      preview = preview.replace(`[${index}]`, answer)
    })
    return preview
  }

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        {renderExerciseByType()}
        
        <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="space-between">
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || (!response && Object.keys(wordBankAnswers).length === 0)}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Submitting...' : 'Submit & Continue'}
          </Button>
          
          <Chip 
            label={`Assessment: ${question.skill?.replace('_', ' ') || 'General'}`}
            color="primary" 
            variant="outlined"
          />
        </Stack>
      </Box>
    </Paper>
  )
}