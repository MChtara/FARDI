import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent, Link, Alert, CircularProgress } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import LockIcon from '@mui/icons-material/Lock'
import { phase5API } from '../../lib/phase5_api.jsx'

/**
 * Phase 5 SubPhase 2 Step 1: Engage - Giving Instructions to Volunteers
 * Intro page with scenario setup and real examples
 * Includes progression check: Must complete SubPhase 1 with score >= 20
 */

export default function Phase5SubPhase2Step1Intro() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [subphase1Complete, setSubphase1Complete] = useState(false)
  const [subphase1Score, setSubphase1Score] = useState(0)
  const [requiredScore, setRequiredScore] = useState(20)

  useEffect(() => {
    checkSubPhase1Completion()
  }, [])

  const checkSubPhase1Completion = async () => {
    try {
      const result = await phase5API.checkSubPhase1Completion()
      if (result.success && result.data) {
        setSubphase1Complete(result.data.is_complete)
        setSubphase1Score(result.data.total_score)
        setRequiredScore(result.data.required_score)
      }
    } catch (error) {
      console.error('Error checking SubPhase 1 completion:', error)
      // Allow access if check fails (for development/testing)
      setSubphase1Complete(true)
    } finally {
      setLoading(false)
    }
  }

  const handleStartActivities = () => {
    if (subphase1Complete) {
      navigate('/phase5/subphase/2/step/1/interaction/1')
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 5: Execution & Problem-Solving
        </Typography>
        <Typography variant="h5" gutterBottom>
          SubPhase 2: Step 1 - Engage - Giving Instructions to Volunteers
        </Typography>
        <Typography variant="body1">
          Practice writing clear, polite, and structured instructions for volunteers during the Global Cultures Festival
        </Typography>
      </Paper>

      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Scenario
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="The Global Cultures Festival is tomorrow and we need to prepare our volunteers! Volunteers will welcome guests, guide them to booths, manage queues, and help with small problems. We must give them clear, polite instructions. Let's start with a game to activate useful words, then share ideas about what volunteers need to know."
        />
      </Paper>

      {/* Video Display - Festival Ushering Scene */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          Watch: Festival Volunteers in Action
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ms. Mabrouki shows a short video clip of volunteers helping at a real cultural event. 
          Watch how volunteers welcome guests and follow instructions at festivals.
        </Typography>
        <Box
          sx={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            overflow: 'hidden',
            borderRadius: 2,
            backgroundColor: '#000',
            mb: 2
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/lg7adyHPC7U?si=90bXTr0QJnJDHRnK"
            title="Festival Ushering Scene - Volunteers Helping at Cultural Event"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          <strong>Reflection Questions:</strong> What instructions would you give volunteers? How can we make them clear and polite?
        </Typography>
      </Paper>

      {/* Real Examples Section */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
        Real-World Examples
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Before we start, let's look at how real festivals give instructions to volunteers:
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Volunteer Task Card Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Volunteer Task Card
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                See how professional events create clear task cards for volunteers.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                href="https://youtu.be/dKgjv9YaQfI?si=rnJVJiuVF6aqySHg"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
                fullWidth
              >
                Watch Instruction Video
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Festival Volunteering Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Festival Volunteering
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Learn how volunteers help at cultural festivals and events.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                href="https://youtube.com/shorts/lg7adyHPC7U?si=90bXTr0QJnJDHRnK"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
                fullWidth
              >
                View Festival Volunteering
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Learning Outcomes */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'info.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          What You'll Learn
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Instruction Vocabulary:</strong> please, thank you, first, then, after, careful, help, guide, welcome, queue, safety, listen
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Polite Language:</strong> How to use "please" and "thank you" effectively
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Sequencing Words:</strong> Using "first", "then", "next", "after that" to organize instructions
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Clear Communication:</strong> Writing instructions that are easy to understand and follow
          </Typography>
        </Box>
      </Paper>

      {/* Key Vocabulary Preview */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'warning.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Key Vocabulary You'll Practice
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {['please', 'thank you', 'first', 'then', 'after', 'careful', 'help', 'guide', 'welcome', 'queue', 'safety', 'listen'].map((word, idx) => (
            <Typography
              key={idx}
              variant="body2"
              sx={{
                px: 2,
                py: 1,
                bgcolor: 'warning.main',
                color: 'white',
                borderRadius: 1,
                fontWeight: 'bold'
              }}
            >
              {word}
            </Typography>
          ))}
        </Box>
      </Paper>

      {/* Progression Check */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : !subphase1Complete ? (
        <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: 'warning.lighter', border: '2px solid', borderColor: 'warning.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LockIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
            <Typography variant="h5" color="warning.dark" fontWeight="bold">
              SubPhase 2 Locked
            </Typography>
          </Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Complete SubPhase 1 First!</strong>
            </Typography>
            <Typography variant="body2">
              You need to complete Phase 5 SubPhase 1 (Handling Last-Minute Issues) with a score of at least {requiredScore} points before accessing SubPhase 2.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Your current SubPhase 1 score: <strong>{subphase1Score} / {requiredScore}</strong>
            </Typography>
          </Alert>
          <Button
            variant="contained"
            color="warning"
            size="large"
            onClick={() => navigate('/phase5/subphase/1/step/1')}
            sx={{ mt: 2 }}
          >
            Go to SubPhase 1
          </Button>
        </Paper>
      ) : (
        <>
          {/* Start Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStartActivities}
              startIcon={<PlayArrowIcon />}
              sx={{ px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
            >
              Start Instruction Activities
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
