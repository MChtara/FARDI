import React from 'react'
import { 
  Box, Paper, Typography, Stack, Button, Chip, Grid, Container, Card, CardContent, 
  Avatar, alpha, Divider, LinearProgress, useTheme
} from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SchoolIcon from '@mui/icons-material/School'
import TimelineIcon from '@mui/icons-material/Timeline'
import PsychologyIcon from '@mui/icons-material/Psychology'
import LanguageIcon from '@mui/icons-material/Language'
import GroupsIcon from '@mui/icons-material/Groups'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SpeedIcon from '@mui/icons-material/Speed'
import BarChartIcon from '@mui/icons-material/BarChart'
import QuizIcon from '@mui/icons-material/Quiz'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

export default function Welcome() {
  const theme = useTheme()
  
  // Ensure theme is loaded before rendering
  if (!theme.palette?.primary?.main) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Welcome Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
          color: 'white',
          py: { xs: 12, md: 18 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(96, 165, 250, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center" sx={{ minHeight: { xs: '70vh', md: '80vh' } }}>
            <Grid item xs={12} lg={6}>
              <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
                <Stack 
                  direction="row" 
                  spacing={2} 
                  sx={{ mb: 6, justifyContent: { xs: 'center', lg: 'flex-start' } }}
                  flexWrap="wrap"
                >
                  <Chip 
                    label="AI-Powered Assessment" 
                    sx={{ 
                      bgcolor: 'rgba(96, 165, 250, 0.25)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(96, 165, 250, 0.5)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Chip 
                    label="CEFR Certified" 
                    sx={{ 
                      bgcolor: 'rgba(129, 140, 248, 0.25)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(129, 140, 248, 0.5)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Chip 
                    label="Professional Grade" 
                    sx={{ 
                      bgcolor: 'rgba(34, 197, 94, 0.25)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(34, 197, 94, 0.5)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '0.875rem'
                    }}
                  />
                </Stack>

                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '3.25rem', md: '4.5rem', lg: '5rem' },
                    fontWeight: 800,
                    mb: 5,
                    lineHeight: 1.05,
                    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
                    position: 'relative'
                  }}
                >
                  Welcome to{' '}
                  <Box component="span" sx={{ color: '#60a5fa' }}>
                    FARDI
                  </Box>
                </Typography>

                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                    fontWeight: 400,
                    opacity: 0.9,
                    mb: 5,
                    lineHeight: 1.4,
                    maxWidth: '600px',
                    mx: { xs: 'auto', lg: 0 }
                  }}
                >
                  Professional English language assessment platform powered by advanced AI technology and CEFR standards.
                </Typography>

                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3}
                  sx={{ mb: 5 }}
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                >
                  <Button 
                    size="large"
                    href="/auth/signup"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': { 
                        bgcolor: 'grey.50'
                      }
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button 
                    size="large" 
                    variant="outlined" 
                    href="/auth/login"
                    sx={{ 
                      borderColor: 'white',
                      color: 'white',
                      px: 5,
                      py: 2,
                      fontSize: '1rem',
                      fontWeight: 500,
                      '&:hover': { 
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>

                <Stack 
                  direction="row" 
                  spacing={3} 
                  sx={{ flexWrap: 'wrap', gap: 2 }}
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                >
                  {['Free Forever', '10 Min Assessment', 'Instant Results', 'Professional Report'].map((benefit, index) => (
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
                  p: 5,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  textAlign: 'center'
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mb: 3,
                    bgcolor: 'secondary.main',
                    mx: 'auto'
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 50 }} />
                </Avatar>
                
                <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  Welcome Aboard
                </Typography>
                
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, lineHeight: 1.6 }}>
                  Start your professional English assessment journey with our advanced AI evaluation system
                </Typography>

                <Box sx={{ width: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="body2">System Status</Typography>
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
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
            How FARDI Works
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Three simple steps to get professional English assessment results
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {[
            {
              step: '01',
              title: 'Take Assessment',
              description: 'Complete our comprehensive English assessment through interactive conversations with AI-powered characters designed to evaluate all language skills.',
              icon: <QuizIcon sx={{ fontSize: 40 }} />,
              color: 'primary.main'
            },
            {
              step: '02',
              title: 'AI Analysis',
              description: 'Our advanced AI analyzes your responses for grammar, vocabulary, pronunciation, and fluency using internationally recognized CEFR standards.',
              icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
              color: 'secondary.main'
            },
            {
              step: '03',
              title: 'Get Results',
              description: 'Receive detailed professional report with your CEFR level, strengths, areas for improvement, and personalized learning recommendations.',
              icon: <BarChartIcon sx={{ fontSize: 40 }} />,
              color: 'tertiary.main'
            }
          ].map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  '&:hover': { boxShadow: 3 }
                }}
              >
                <CardContent sx={{ p: 5, textAlign: 'center' }}>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      fontSize: '3rem',
                      fontWeight: 900,
                      color: alpha(step.color, 0.1),
                      lineHeight: 1
                    }}
                  >
                    {step.step}
                  </Typography>

                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 3,
                      bgcolor: step.color,
                      mx: 'auto'
                    }}
                  >
                    {step.icon}
                  </Avatar>
                  
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    {step.title}
                  </Typography>
                  
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {step.description}
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
              { number: '5,000+', label: 'Active Users', icon: <GroupsIcon /> },
              { number: '98%', label: 'Accuracy Rate', icon: <SpeedIcon /> },
              { number: '15min', label: 'Average Duration', icon: <TimelineIcon /> },
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

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
            Why Choose FARDI
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Professional features designed for accurate language assessment
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: <LanguageIcon />,
              title: 'CEFR Standards',
              description: 'Internationally recognized framework ensuring accurate and reliable language proficiency assessment.',
            },
            {
              icon: <PsychologyIcon />,
              title: 'AI Technology',
              description: 'Advanced artificial intelligence provides comprehensive evaluation of all language skills.',
            },
            {
              icon: <SpeedIcon />,
              title: 'Quick Results',
              description: 'Get detailed assessment results in minutes with comprehensive skill breakdown.',
            },
            {
              icon: <EmojiEventsIcon />,
              title: 'Professional Reports',
              description: 'Receive certificates and detailed reports suitable for academic and professional use.',
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Stack direction="row" spacing={3} sx={{ p: 3 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                  {React.cloneElement(feature.icon, { style: { fontSize: 28 } })}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Final CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 12 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
              Ready to Get Started?
            </Typography>
            
            <Typography variant="h5" sx={{ mb: 6, opacity: 0.9, lineHeight: 1.6 }}>
              Join thousands of professionals and students who trust FARDI for accurate English assessment
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center" sx={{ mb: 6 }}>
              <Button 
                size="large"
                href="/auth/signup"
                endIcon={<PlayCircleOutlineIcon />}
                sx={{ 
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
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
                href="/auth/login"
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  px: 6,
                  py: 2.5,
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Sign In
              </Button>
            </Stack>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              justifyContent="center" 
              spacing={4} 
              divider={<Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />}
            >
              {[
                { text: 'Free Forever' },
                { text: 'Professional Reports' },
                { text: 'Instant Results' },
                { text: 'CEFR Certified' }
              ].map((feature, idx) => (
                <Typography key={idx} variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                  {feature.text}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}