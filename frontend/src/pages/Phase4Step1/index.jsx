import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardMedia, CardContent, CardActionArea } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

/**
 * Phase 4 Step 1: Intro - Scenario Setup
 * Shows the context with poster and video examples before activities begin
 */

export default function Phase4Step1Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    navigate('/app/phase4/step/1/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage
        </Typography>
        <Typography variant="body1">
          Spark interest by connecting to prior knowledge of event promotion
        </Typography>
      </Paper>

      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
          Scenario
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="We've planned the event—now let's get people excited! Look at this poster with its bold slogan and eye-catching colors, and this video teaser showing quick clips of dances and music. We'll start with a quick individual game to activate vocabulary, then discuss what you notice in these examples and how they promote events."
        />
      </Paper>

      {/* Examples Section */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        Promotion Examples
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Poster Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardMedia
              component="img"
              height="400"
              image="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/e7dd90239337541.67f47284ce71c.png"
              alt="Cultural Festival Poster Example"
              sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Festival Poster Example
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Notice the bold colors, clear slogan, and eye-catching design that draws attention to the event.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                href="https://www.behance.net/gallery/239337541/Backdrop-design"
                target="_blank"
                sx={{ mt: 2 }}
              >
                View Full Poster
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Video Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardActionArea
              onClick={() => window.open('https://www.youtube.com/watch?v=Vc9UQoPk0EI', '_blank')}
              sx={{ position: 'relative' }}
            >
              <CardMedia
                component="img"
                height="400"
                image="https://img.youtube.com/vi/Vc9UQoPk0EI/maxresdefault.jpg"
                alt="Cultural Festival Video Thumbnail"
                sx={{ objectFit: 'cover', backgroundColor: '#000' }}
                onError={(e) => {
                  // Fallback thumbnail if YouTube thumbnail fails
                  e.target.src = 'https://img.youtube.com/vi/Vc9UQoPk0EI/hqdefault.jpg'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }}
              >
                <PlayCircleOutlineIcon
                  sx={{
                    fontSize: 80,
                    color: 'white',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'
                  }}
                />
              </Box>
            </CardActionArea>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Promotional Video Teaser
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Watch how the video uses dynamic clips of dances, music, and festivities to create excitement.
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<PlayCircleOutlineIcon />}
                onClick={() => window.open('https://www.youtube.com/watch?v=Vc9UQoPk0EI', '_blank')}
                fullWidth
              >
                Watch Video
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Key Observations */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          What to Notice
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Slogans:</strong> Catchy phrases that communicate the event's message
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Eye-catchers:</strong> Bold colors, images, and design elements that grab attention
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Features:</strong> Highlighted activities, performances, and attractions
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Format:</strong> Different media (posters, videos, ads) reach different audiences
          </Typography>
        </Box>
      </Paper>

      {/* Start Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStartActivities}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2 }}
        >
          Start Activities
        </Button>
      </Box>
    </Box>
  )
}
