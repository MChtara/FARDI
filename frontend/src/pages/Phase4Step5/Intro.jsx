import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import ArticleIcon from '@mui/icons-material/Article'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

/**
 * Phase 4 Step 5 - Intro
 * Progressive Error Correction: Spelling → Grammar → Coherence/Vocabulary
 * Students correct faulty poster/video descriptions to build autonomous writing skills
 */

export default function Phase4Step5Intro() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/app/phase4/step/5/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Phase 4: Marketing & Promotion
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 5: Evaluate - Error Correction & Refinement
        </Typography>
        <Typography variant="body1">
          Build autonomous writing skills through progressive error correction
        </Typography>
      </Paper>

      {/* Instructor Message */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <CharacterMessage
          character="MS. MABROUKI"
          message="To evaluate your writing skills, I'll give you 'wrong' versions of poster descriptions and video scripts with mistakes (spelling, grammar, structure, vocabulary). Correct them step by step—no pictures, just text. We'll focus on one error type at a time to build your autonomous correction skills."
        />
      </Paper>

      {/* Learning Overview */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          What You'll Learn
        </Typography>
        <Typography variant="body1" paragraph>
          You'll progressively correct faulty texts by focusing on different error types:
        </Typography>

        <Stack spacing={2}>
          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SpellcheckIcon sx={{ fontSize: 40, color: '#e74c3c' }} />
              <Box>
                <Typography variant="h6" color="#e74c3c">
                  Step 1: Spelling Correction
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Identify and fix misspelled words like "gatefod", "slogen", "animasion"
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ArticleIcon sx={{ fontSize: 40, color: '#3498db' }} />
              <Box>
                <Typography variant="h6" color="#3498db">
                  Step 2: Grammar Correction
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fix subject-verb agreement, articles, tense consistency
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AutoFixHighIcon sx={{ fontSize: 40, color: '#27ae60' }} />
              <Box>
                <Typography variant="h6" color="#27ae60">
                  Step 3: Coherence & Vocabulary Enhancement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add connectors, improve flow, upgrade vocabulary for sophistication
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Paper>

      {/* Start Button */}
      <Stack direction="row" justifyContent="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleStart}
          sx={{
            minWidth: 300,
            background: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)'
            }
          }}
        >
          Start Error Correction Challenge
        </Button>
      </Stack>
    </Box>
  )
}
