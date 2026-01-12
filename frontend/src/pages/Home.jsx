import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApiContext } from '../lib/api.jsx'
import {
  Box, Typography, Button, Grid, Paper, Stack, Chip, Container, Card, CardContent, Avatar, 
  alpha, LinearProgress, Badge
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import SchoolIcon from '@mui/icons-material/School'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import GroupsIcon from '@mui/icons-material/Groups'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PsychologyIcon from '@mui/icons-material/Psychology'
import LanguageIcon from '@mui/icons-material/Language'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import SpeedIcon from '@mui/icons-material/Speed'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import BarChartIcon from '@mui/icons-material/BarChart'
import QuizIcon from '@mui/icons-material/Quiz'
import PersonIcon from '@mui/icons-material/Person'

export default function Home() {
  const { user, client, loading } = useApiContext()
  const navigate = useNavigate()

  const onStart = async () => {
    try {
      await client.startGame()
      navigate('/game')
    } catch (e) {
      alert('Failed to start game')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
          color: 'white',
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" sx={{ minHeight: { xs: '60vh', md: '70vh' } }}>
            <Grid item xs={12} lg={6}>
              <Box>
                <Stack direction="row" spacing={2} sx={{ mb: 6 }} flexWrap="wrap">
                  <Chip 
                    label="AI-Powered Assessment" 
                    sx={{ 
                      bgcolor: 'rgba(96, 165, 250, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(96, 165, 250, 0.4)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Chip 
                    label="CEFR Certified" 
                    sx={{ 
                      bgcolor: 'rgba(129, 140, 248, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(129, 140, 248, 0.4)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Chip 
                    label="Professional Grade" 
                    sx={{ 
                      bgcolor: 'rgba(34, 197, 94, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '0.875rem'
                    }}
                  />
                </Stack>

                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.75rem', md: '4rem', lg: '4.5rem' },
                    fontWeight: 800,
                    mb: 4,
                    lineHeight: 1.05,
                    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Master English with
                  <br />
                  <Box component="span" sx={{ color: '#60a5fa' }}>
                    Professional Assessment
                  </Box>
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 400,
                    opacity: 0.9,
                    mb: 4,
                    lineHeight: 1.5,
                    maxWidth: 500
                  }}
                >
                  Professional CEFR assessment in 15 minutes. Get your official A1-C2 level for academic and professional use.
                </Typography>

                {/* CEFR Level Explanation - Simplified */}
                <Paper 
                  sx={{ 
                    p: 3, 
                    mb: 4, 
                    bgcolor: 'rgba(255, 255, 255, 0.1)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LanguageIcon /> CEFR Levels
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { level: 'A1', desc: 'Beginner', detail: 'Basic phrases' },
                      { level: 'A2', desc: 'Elementary', detail: 'Simple tasks' },
                      { level: 'B1', desc: 'Intermediate', detail: 'Work situations' },
                      { level: 'B2', desc: 'Upper-Int', detail: 'Complex topics' },
                      { level: 'C1', desc: 'Advanced', detail: 'Fluent expression' },
                      { level: 'C2', desc: 'Proficient', detail: 'Native-like' }
                    ].map((item, idx) => (
                      <Grid item xs={4} sm={2} key={item.level}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                            {item.level}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'block' }}>
                            {item.desc}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, gap: 1 }}>
                    <SpeedIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      15 minutes • No preparation needed • Instant results
                    </Typography>
                  </Box>
                </Paper>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
                  {!loading && user ? (
                    <>
                      <Button 
                        size="large"
                        onClick={onStart}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          bgcolor: 'white',
                          color: 'primary.main',
                          px: 4,
                          py: 1.5,
                          '&:hover': { 
                            bgcolor: 'grey.50'
                          }
                        }}
                      >
                        Continue Assessment
                      </Button>
                      <Button 
                        size="large" 
                        variant="outlined" 
                        component={Link} 
                        to="/dashboard"
                        sx={{ 
                          borderColor: 'white',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          '&:hover': { 
                            borderColor: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        View Dashboard
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="large"
                        component={Link} 
                        to="/signup"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          bgcolor: 'white',
                          color: 'primary.main',
                          px: 4,
                          py: 1.5,
                          '&:hover': { 
                            bgcolor: 'grey.50'
                          }
                        }}
                      >
                        Start Free Assessment
                      </Button>
                      <Button 
                        size="large" 
                        variant="outlined" 
                        component={Link} 
                        to="/login"
                        sx={{ 
                          borderColor: 'white',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          '&:hover': { 
                            borderColor: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </Stack>

                <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 2 }}>
                  {['Free Forever', '10 Min Test', 'Instant Results', 'AI Feedback'].map((benefit, index) => (
                    <Stack key={index} direction="row" alignItems="center" spacing={1}>
                      <CheckCircleIcon sx={{ fontSize: 20, color: 'secondary.light' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {benefit}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <Paper
                sx={{
                  p: 4,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3
                }}
              >
                <Stack alignItems="center" spacing={3}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80,
                      bgcolor: 'secondary.main'
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  
                  <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center' }}>
                    Professional Assessment
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    textAlign: 'center',
                    lineHeight: 1.6
                  }}>
                    Evaluate your English proficiency with our comprehensive AI-powered assessment system
                  </Typography>

                  <Box sx={{ width: '100%' }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">Assessment Progress</Typography>
                      <Typography variant="body2">Ready</Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={100} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'secondary.main'
                        }
                      }} 
                    />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
            Why Choose FARDI
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Professional language assessment platform with AI-powered evaluation and CEFR standards
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: <PsychologyIcon />,
              title: 'AI Assessment',
              description: 'Advanced artificial intelligence evaluates your grammar, vocabulary, pronunciation, and fluency in real-time.',
              color: 'primary.main'
            },
            {
              icon: <LanguageIcon />,
              title: 'CEFR Standards',
              description: 'Internationally recognized Common European Framework of Reference for Languages ensures accurate level evaluation.',
              color: 'secondary.main'
            },
            {
              icon: <GroupsIcon />,
              title: 'Interactive Conversations',
              description: 'Engage with AI characters in realistic scenarios that test your practical communication skills.',
              color: 'tertiary.main'
            },
            {
              icon: <SpeedIcon />,
              title: 'Quick Results',
              description: 'Get detailed assessment results in minutes with comprehensive breakdown of your language skills.',
              color: 'success.main'
            },
            {
              icon: <BarChartIcon />,
              title: 'Progress Tracking',
              description: 'Monitor your improvement over time with detailed analytics and personalized learning recommendations.',
              color: 'warning.main'
            },
            {
              icon: <EmojiEventsIcon />,
              title: 'Achievements',
              description: 'Earn certificates and badges as you progress through different CEFR levels and complete assessments.',
              color: 'error.main'
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 3 } }}>
                <CardContent sx={{ p: 4 }}>
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56,
                      mb: 3,
                      bgcolor: feature.color
                    }}
                  >
                    {React.cloneElement(feature.icon, { style: { fontSize: 28 } })}
                  </Avatar>
                  
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            {[
              { number: '10,000+', label: 'Assessments Completed', icon: <QuizIcon /> },
              { number: '25', label: 'Supported Languages', icon: <LanguageIcon /> },
              { number: '95%', label: 'Accuracy Rate', icon: <TrendingUpIcon /> },
              { number: '24/7', label: 'AI Availability', icon: <AutoAwesomeIcon /> }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Stack alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                    {React.cloneElement(stat.icon, { style: { fontSize: 28 } })}
                  </Avatar>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 12 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Ready to Assess Your English Level?
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Join thousands of learners who trust FARDI for accurate English proficiency assessment.
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="center" 
            spacing={2} 
            sx={{ mb: 4 }}
          >
            {['Free Assessment', 'No Credit Card', 'Instant Results', 'CEFR Certified'].map((benefit, index) => (
              <Chip 
                key={index}
                icon={<CheckCircleIcon />} 
                label={benefit}
                sx={{ 
                  bgcolor: alpha('#059669', 0.1),
                  color: 'success.main',
                  border: `1px solid ${alpha('#059669', 0.3)}`
                }}
              />
            ))}
          </Stack>

          {!loading && !user && (
            <Button 
              size="large"
              component={Link}
              to="/signup"
              endIcon={<PlayCircleOutlineIcon />}
              sx={{ 
                px: 5,
                py: 2,
                fontSize: '1.1rem'
              }}
            >
              Start Free Assessment
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  )
}