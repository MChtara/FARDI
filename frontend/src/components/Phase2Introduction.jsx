import React, { useState } from 'react'
import {
  Box, Paper, Typography, Button, Stack, Stepper, Step, StepLabel, StepContent,
  Card, CardContent, Avatar, Grid, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import GroupsIcon from '@mui/icons-material/Groups'
import EventIcon from '@mui/icons-material/Event'
import TaskIcon from '@mui/icons-material/Task'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QuizIcon from '@mui/icons-material/Quiz'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import LanguageIcon from '@mui/icons-material/Language'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import InfoIcon from '@mui/icons-material/Info'

export default function Phase2Introduction({ onStart, onClose }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  const steps = [
    {
      label: 'Welcome to Cultural Event Planning',
      title: 'Join the Committee',
      description: 'You\'ve been selected to join a student committee planning a Tunisian cultural event. Work with team members to organize an authentic celebration.',
      icon: <GroupsIcon />,
      color: 'primary.main'
    },
    {
      label: 'Meet Your Team',
      title: 'Team Members & Roles',
      description: 'Get acquainted with committee members, each bringing unique skills to the project. Learn about their backgrounds and expertise.',
      icon: <EventIcon />,
      color: 'secondary.main'
    },
    {
      label: 'Assessment Process',
      title: 'Real-World Skills',
      description: 'Your English skills will be evaluated through authentic interactions: assigning roles, scheduling meetings, and planning tasks.',
      icon: <TaskIcon />,
      color: 'tertiary.main'
    }
  ]

  const teamMembers = [
    {
      name: 'Ms. Mabrouki',
      role: 'Event Coordinator',
      description: 'Experienced coordinator who guides discussions and provides direction',
      avatar: 'mabrouki.svg',
      expertise: ['Event Planning', 'Team Leadership', 'Cultural Events'],
      background: 'Over 20 cultural events coordinated across Tunisia'
    },
    {
      name: 'SKANDER',
      role: 'Student Council President',
      description: 'Charismatic leader with vision for cultural heritage preservation',
      avatar: 'skander.svg',
      expertise: ['Leadership', 'Student Relations', 'Cultural Heritage'],
      background: 'Third-year politics student passionate about cultural heritage'
    },
    {
      name: 'Emna',
      role: 'Committee Member - Finance & Logistics',
      description: 'Detail-oriented organizer handling practical aspects',
      avatar: 'emna.svg',
      expertise: ['Budget Management', 'Logistics', 'Project Planning'],
      background: 'Business student with community project experience'
    },
    {
      name: 'Ryan',
      role: 'Committee Member - Media & Outreach',
      description: 'Creative communicator managing digital presence',
      avatar: 'ryan.svg',
      expertise: ['Social Media', 'Digital Marketing', 'Communications'],
      background: 'Communications major with digital marketing experience'
    },
    {
      name: 'Lilia',
      role: 'Committee Member - Cultural Direction',
      description: 'Art specialist ensuring cultural authenticity',
      avatar: 'lilia.svg',
      expertise: ['Art History', 'Cultural Authenticity', 'Museum Work'],
      background: 'Art history student and part-time museum tour guide'
    }
  ]

  const assessmentTypes = [
    {
      type: 'Self Introduction',
      description: 'Present yourself to the team and share relevant experience',
      skills: ['Self-expression', 'Personal background', 'Relevant experience'],
      icon: '👋'
    },
    {
      type: 'Listening Comprehension',
      description: 'Listen to audio scenarios and respond appropriately',
      skills: ['Audio comprehension', 'Response generation', 'Context understanding'],
      icon: '🎧'
    },
    {
      type: 'Cultural Knowledge',
      description: 'Demonstrate understanding of Tunisian cultural elements',
      skills: ['Cultural awareness', 'Traditional knowledge', 'Contextual application'],
      icon: '🌍'
    },
    {
      type: 'Problem Solving',
      description: 'Address challenges and propose practical solutions',
      skills: ['Critical thinking', 'Solution development', 'Resource management'],
      icon: '🧩'
    },
    {
      type: 'Social Interaction',
      description: 'Navigate team dynamics and collaborative situations',
      skills: ['Interpersonal communication', 'Teamwork', 'Conflict resolution'],
      icon: '💬'
    },
    {
      type: 'Creative Writing',
      description: 'Express ideas clearly in written format',
      skills: ['Written expression', 'Structure', 'Creativity'],
      icon: '✍️'
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Hero Section */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'white', 
            color: 'primary.main',
            mx: 'auto', 
            mb: 3 
          }}
        >
          <SchoolIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Phase 2: Cultural Event Planning
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
          Join a Tunisian Student Committee
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Chip label="9 Interactive Steps" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip label="Real Cultural Context" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip label="CEFR Assessment" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip label="Authentic Scenarios" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
        </Stack>
      </Paper>

      {/* Interactive Introduction Steps */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Stepper activeStep={currentStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Card sx={{ mt: 2, mb: 3 }}>
                  <CardContent>
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: step.color, width: 56, height: 56 }}>
                        {step.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                          {step.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                          {step.description}
                        </Typography>
                        
                        {index === 1 && (
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<InfoIcon />}
                            onClick={() => setShowDetails(true)}
                          >
                            Meet the Team
                          </Button>
                        )}
                        
                        {index === 2 && (
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<QuizIcon />}
                            onClick={() => setShowDetails(true)}
                          >
                            View Assessment Types
                          </Button>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
                
                <Stack direction="row" spacing={2}>
                  {currentStep < steps.length - 1 && (
                    <Button variant="contained" onClick={handleNext}>
                      Continue
                    </Button>
                  )}
                  {currentStep > 0 && (
                    <Button onClick={handleBack}>
                      Back
                    </Button>
                  )}
                </Stack>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Key Features */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <LanguageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Authentic Context
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Learn through real-world scenarios based on Tunisian cultural events and traditions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <RecordVoiceOverIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Interactive Dialogue
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Engage in natural conversations with AI characters representing committee members
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Progressive Assessment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your CEFR level is evaluated through diverse, engaging activities and real tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
        <Button 
          size="large"
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={onStart}
          sx={{ minWidth: 200, py: 1.5 }}
        >
          Start Assessment
        </Button>
        <Button 
          size="large"
          variant="outlined"
          onClick={onClose}
          sx={{ minWidth: 200, py: 1.5 }}
        >
          Return to Dashboard
        </Button>
      </Stack>

      {/* Team Details Dialog */}
      <Dialog 
        open={showDetails && currentStep === 1} 
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Meet Your Team Members</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {teamMembers.map((member) => (
              <Grid item xs={12} sm={6} key={member.name}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar 
                        src={`/static/images/avatars/${member.avatar}`}
                        sx={{ width: 56, height: 56 }}
                      >
                        {member.name[0]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>{member.name}</Typography>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          {member.role}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {member.description}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                          {member.expertise.map((skill) => (
                            <Chip key={skill} label={skill} size="small" variant="outlined" />
                          ))}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {member.background}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Assessment Types Dialog */}
      <Dialog 
        open={showDetails && currentStep === 2} 
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Assessment Exercise Types</Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            {assessmentTypes.map((assessment, index) => (
              <React.Fragment key={assessment.type}>
                <ListItem>
                  <ListItemIcon>
                    <Typography variant="h4">{assessment.icon}</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={assessment.type}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {assessment.description}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {assessment.skills.map((skill) => (
                            <Chip key={skill} label={skill} size="small" color="primary" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    }
                  />
                </ListItem>
                {index < assessmentTypes.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}