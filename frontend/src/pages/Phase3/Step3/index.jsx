import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SchoolIcon from '@mui/icons-material/School'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import DescriptionIcon from '@mui/icons-material/Description'

/**
 * Phase 3 Step 3: Explain - Sponsorship & Budgeting
 * Students move from exploration to explicit understanding
 */

export default function Phase3Step3Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    navigate('/app/phase3/step/3/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3: Sponsorship & Budgeting
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 3: Explain - Understanding Financial Concepts
        </Typography>
        <Typography variant="body1">
          Learn to explain costs, justify funding choices, and use cause-effect language
        </Typography>
      </Paper>

      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
          <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Scenario
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="In this step, we move from exploration to explicit understanding. I'll explain how event budgets work using a simplified breakdown of the Global Cultures Festival. You'll learn why certain costs exist and how sponsors or ticket sales cover those costs. Then you'll practice explaining and justifying these financial decisions yourself."
        />
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'success.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Today you will learn to:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 3 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              Explain why costs exist in event budgets
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Justify funding choices clearly
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Use cause-effect language accurately (because, so, due to)
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Sample Budget Explanation */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        <MonetizationOnIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Example: Festival Budget Breakdown
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error.main">
                Why We Need Money
              </Typography>
              <Box sx={{ backgroundColor: '#fff3e0', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 2, color: '#000' }}>
                  <strong>Example Explanation:</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, fontStyle: 'italic', color: '#000' }}>
                  "We need a sponsor <strong>because</strong> the stage and sound system are expensive."
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, fontStyle: 'italic', color: '#000' }}>
                  "The budget has many expenses, <strong>so</strong> we need funding from multiple sources."
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#000' }}>
                  "Ticket sales are necessary <strong>due to</strong> the high venue rental costs."
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.main">
                How We Get Money
              </Typography>
              <Box sx={{ backgroundColor: '#e8f5e9', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 2, color: '#000' }}>
                  <strong>Funding Sources:</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#000' }}>
                  • <strong>Sponsors:</strong> Companies that give money upfront
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#000' }}>
                  • <strong>Ticket Sales:</strong> Money from attendees during the event
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#000' }}>
                  • <strong>Grants:</strong> Money from institutions or organizations
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  • <strong>Donations:</strong> Voluntary contributions from supporters
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Key Language Focus */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'warning.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          <DescriptionIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Key Language Focus
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Vocabulary:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, pl: 2 }}>
              budget, sponsor, funding, cost, expense, donation, ticket sales, profit, loss
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Connectors:</strong>
            </Typography>
            <Typography variant="body2" sx={{ pl: 2 }}>
              <strong>because</strong> (reason), <strong>so</strong> (result), <strong>due to</strong> (cause)
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Learning Outcomes */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          What You Will Practice
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Interaction 1
                </Typography>
                <Typography variant="body2">
                  <strong>Guided Explanation:</strong> Identify and underline reasons in budget explanations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Interaction 2
                </Typography>
                <Typography variant="body2">
                  <strong>Sentence Transformation:</strong> Combine sentences using "because" or "so"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Interaction 3
                </Typography>
                <Typography variant="body2">
                  <strong>Justification Practice:</strong> Write explanations for budget items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Start Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleStartActivities}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2 }}
        >
          Start Learning Activities
        </Button>
      </Box>
    </Box>
  )
}
