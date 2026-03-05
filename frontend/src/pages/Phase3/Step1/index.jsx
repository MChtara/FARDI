import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { CharacterMessage } from '../../../components/Avatar.jsx'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

/**
 * Phase 3 Step 1: Intro - Sponsorship & Budgeting
 * Scenario setup for financial planning
 */

export default function Phase3Step1Intro() {
  const navigate = useNavigate()

  const handleStartActivities = () => {
    navigate('/app/phase3/step/1/interaction/1')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="h4" gutterBottom>
          Phase 3: Sponsorship & Budgeting
        </Typography>
        <Typography variant="h5" gutterBottom>
          Step 1: Engage - Financial Planning Introduction
        </Typography>
        <Typography variant="body1">
          Activate your knowledge of money, events, and sponsorship
        </Typography>
      </Paper>

    
      {/* Scenario Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
          Scenario
        </Typography>
        <CharacterMessage
          speaker="Ms. Mabrouki"
          message="We have great ideas, but ideas alone don't pay for events. Before we talk about numbers or emails, let's think about how events get money and how that money is used."
        />
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            The Cultural Committee meets for the first financial planning session. Ms. Mabrouki displays:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 3 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              A simple event budget table (food, music, decoration, promotion)
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              A slide with logos of sponsors from a previous university event
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Budget & Sponsorship Visual Examples */}
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        Financial Planning Examples
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Budget Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Typography variant="h6">
                  Event Budget Example
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
                  <strong>Food:</strong> $500
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
                  <strong>Music:</strong> $300
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
                  <strong>Decoration:</strong> $200
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
                  <strong>Promotion:</strong> $150
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', color: 'success.main' }}>
                  Total Budget: $1,150
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sponsorship Example */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">
                  Funding Sources
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1, color: '#333' }}>
                  <strong>Sponsorship:</strong> Companies give money or support
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1, color: '#333' }}>
                  <strong>Ticket Sales:</strong> Attendees pay entry fees
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1, color: '#333' }}>
                  <strong>Donations:</strong> Money given for free
                </Typography>
                <Typography component="li" variant="body2" sx={{ color: '#333' }}>
                  <strong>University Grant:</strong> Official funding from institution
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Key Concepts */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'warning.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Key Financial Concepts
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
              <strong>Budget:</strong> A plan for how money will be spent
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
              <strong>Cost/Expense:</strong> Money that is spent
            </Typography>
            <Typography variant="body2" sx={{ color: '#333' }}>
              <strong>Funding:</strong> Money given to support a project
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
              <strong>Sponsor:</strong> Person/company that gives money or support
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
              <strong>Donation:</strong> Money given for free
            </Typography>
            <Typography variant="body2" sx={{ color: '#333' }}>
              <strong>Profit:</strong> Money left after expenses
            </Typography>
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
          Start Vocabulary Activities
        </Button>
      </Box>
    </Box>
  )
}
