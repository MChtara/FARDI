import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Paper, Typography, Stack, Button, CircularProgress } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import PrintIcon from '@mui/icons-material/Print'
import { useAuth } from '../lib/api.jsx'

export default function Certificate() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [certificateData, setCertificateData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided')
      setLoading(false)
      return
    }

    fetch(`/api/certificate?session_id=${encodeURIComponent(sessionId)}`, {
      credentials: 'include'
    })
      .then(r => r.ok ? r.json() : Promise.reject('Failed to load certificate'))
      .then(setCertificateData)
      .catch(e => setError(e.message || e))
      .finally(() => setLoading(false))
  }, [sessionId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Trigger download functionality
    window.location.href = `/certificate-download?session_id=${encodeURIComponent(sessionId)}`
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    )
  }

  const playerName = certificateData?.player_name || user?.first_name || user?.username || 'Student'
  const level = certificateData?.overall_level || 'B1'
  const completionDate = certificateData?.completion_date || new Date().toLocaleDateString()

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      {/* Certificate Actions */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          startIcon={<PrintIcon />}
          variant="outlined"
          onClick={handlePrint}
        >
          Print Certificate
        </Button>
        <Button
          startIcon={<DownloadIcon />}
          variant="contained"
          onClick={handleDownload}
        >
          Download PDF
        </Button>
      </Stack>

      {/* Certificate */}
      <Paper
        elevation={8}
        sx={{
          p: 6,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          border: '8px solid #1e3a8a',
          '@media print': {
            boxShadow: 'none',
            border: '8px solid #1e3a8a'
          }
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'serif',
            fontWeight: 'bold',
            color: '#1e3a8a',
            mb: 2
          }}
        >
          Certificate of Achievement
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
          CEFR English Language Assessment
        </Typography>

        <Typography variant="h5" sx={{ mb: 2 }}>
          This is to certify that
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontFamily: 'serif',
            fontWeight: 'bold',
            color: '#1e3a8a',
            mb: 4,
            borderBottom: '2px solid #1e3a8a',
            pb: 1,
            display: 'inline-block'
          }}
        >
          {playerName}
        </Typography>

        <Typography variant="h5" sx={{ mb: 2 }}>
          has successfully completed the English language assessment
        </Typography>

        <Typography variant="h5" sx={{ mb: 4 }}>
          and achieved
        </Typography>

        <Box
          sx={{
            bgcolor: '#1e3a8a',
            color: 'white',
            py: 2,
            px: 4,
            borderRadius: 2,
            mb: 4,
            display: 'inline-block'
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            CEFR Level {level}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Completion Date: {completionDate}
        </Typography>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 6 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ borderTop: '2px solid #1e3a8a', width: 200, mb: 1 }} />
            <Typography variant="body2">Assessment Authority</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ borderTop: '2px solid #1e3a8a', width: 200, mb: 1 }} />
            <Typography variant="body2">Date</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}