import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SchoolIcon from '@mui/icons-material/School'
import CreateIcon from '@mui/icons-material/Create'
import CampaignIcon from '@mui/icons-material/Campaign'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

/**
 * Phase 3 Step 4: Apply - Sponsorship & Budgeting
 * Students create authentic outputs: mini budget and sponsor pitch
 */

export default function Phase3Step4Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    navigate('/app/phase3/step/4/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'warning.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3: Sponsorship & Budgeting
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 4: Apply - Create Real Documents
        </Typography>
        <Typography variant="body1">
          Design a mini event budget and create a persuasive sponsor pitch
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
          message="Now that we understand budgets and sponsorship, it's time to create our own! You will design a budget and convince a sponsor to support the festival. This is your chance to apply everything you've learned about financial planning and persuasive communication."
        />
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'warning.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            In this step, you will:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 3 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              Create a mini budget with costs and funding sources
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Write a persuasive sponsor pitch
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Justify your financial decisions clearly
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Learning Outcomes Preview */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        <CreateIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        What You Will Create
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" color="primary">
                  Task 1: Budget Creation
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Design a mini budget for the Global Cultures Festival including:
              </Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  At least 4 cost items (venue, sound, promotion, logistics)
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  At least 1 funding source (sponsor, ticket sales, donation)
                </Typography>
                <Typography component="li" variant="body2">
                  Clear categories and justifications
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CampaignIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Typography variant="h6" color="success.main">
                  Task 2: Sponsor Pitch
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Write a persuasive pitch to convince a company to sponsor the festival:
              </Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Explain what the festival is
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Justify why funding is needed
                </Typography>
                <Typography component="li" variant="body2">
                  Show what the sponsor gains (visibility, image, values)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Start Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="warning"
          size="large"
          onClick={handleStartActivities}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2 }}
        >
          Start Creating Your Budget & Pitch
        </Button>
      </Box>
    </Box>
  )
}
