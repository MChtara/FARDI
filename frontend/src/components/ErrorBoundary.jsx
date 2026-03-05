import React from 'react'
import { Box, Paper, Typography, Button, Alert } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HomeIcon from '@mui/icons-material/Home'

/**
 * Error Boundary Component for Phase 5
 * Catches React errors and displays user-friendly error messages
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
    
    // Log to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: sendErrorToService(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    window.location.href = '/dashboard'
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="error">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              We encountered an unexpected error. Don't worry, your progress has been saved.
            </Typography>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                <Typography variant="body2" fontWeight="bold">Error Details:</Typography>
                <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Typography>
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
              >
                Go to Dashboard
              </Button>
            </Box>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
