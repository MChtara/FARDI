import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ExploreIcon from '@mui/icons-material/Explore'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

/**
 * Phase 3 Step 2: Explore - Sponsorship & Budgeting
 * Students actively explore how sponsorship and budgeting work in real events
 */

export default function Phase3Step2Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    navigate('/app/phase3/step/2/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3: Sponsorship & Budgeting
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 2: Explore - Financial Planning in Action
        </Typography>
        <Typography variant="body1">
          Discover how sponsorship and budgeting work in real events
        </Typography>
      </Paper>

      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
          <ExploreIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Scenario
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="The organizing committee is reviewing sample sponsorship offers and a simplified festival budget. I'm sharing a basic budget table showing venue, logistics, and promotion costs, along with three sponsor profiles. Let's explore how money flows into and out of the event."
        />
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Today's committee session focuses on:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 3 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              Analyzing a sample budget table with costs and income
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Reviewing three different sponsor profiles and offers
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Understanding how to match funding sources to event needs
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Sample Budget Display */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        Sample Event Budget
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Costs Column */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Typography variant="h6" color="error.main">
                  Event Costs (Money Out)
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: '#fff3e0', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>Venue rental:</strong> $800
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>Sound equipment:</strong> $500
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>Catering & refreshments:</strong> $600
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>Promotion & printing:</strong> $200
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>Decoration & setup:</strong> $300
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, pt: 2, borderTop: 2, borderColor: 'error.main', fontWeight: 'bold', color: 'error.main' }}>
                  Total Expenses: $2,400
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Income Column */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Typography variant="h6" color="success.main">
                  Income Sources (Money In)
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: '#e8f5e9', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>Ticket sales:</strong> $1,000 (estimated)
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>Main sponsor (TechCorp):</strong> $800
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>Food sponsor (CaféPlus):</strong> $400
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>University grant:</strong> $300
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#333' }}>
                  <strong>Donations:</strong> $100 (estimated)
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, pt: 2, borderTop: 2, borderColor: 'success.main', fontWeight: 'bold', color: 'success.main' }}>
                  Total Income: $2,600
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sample Sponsor Profiles */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        Sample Sponsor Profiles
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                TechCorp
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Type:</strong> Technology company
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Offer:</strong> $800 cash
              </Typography>
              <Typography variant="body2">
                <strong>Wants:</strong> Logo on all promotional materials
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                CaféPlus
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Type:</strong> Local restaurant
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Offer:</strong> $400 + free coffee
              </Typography>
              <Typography variant="body2">
                <strong>Wants:</strong> Exclusive food vendor rights
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                PrintShop
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Type:</strong> Printing service
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Offer:</strong> Free poster printing
              </Typography>
              <Typography variant="body2">
                <strong>Wants:</strong> Name mentioned in social media
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Key Concepts */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'warning.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Key Learning Focus
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Recognition:</strong> Identify costs vs. income sources
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Selection:</strong> Choose appropriate funding for specific needs
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Explanation:</strong> Explain why sponsors are needed
            </Typography>
            <Typography variant="body2">
              <strong>Connection:</strong> Link funding sources to budget items
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Start Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="info"
          size="large"
          onClick={handleStartActivities}
          startIcon={<PlayArrowIcon />}
          sx={{ px: 6, py: 2 }}
        >
          Start Exploration Activities
        </Button>
      </Box>
    </Box>
  )
}
