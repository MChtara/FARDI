import React, { useState } from 'react'
import { Box, Typography, Paper, Button, Chip, Stack } from '@mui/material'
import { CheckCircle, Cancel } from '@mui/icons-material'

const GapFillStory = ({ templates, wordBank, answers, onChange }) => {
  const [selectedWord, setSelectedWord] = useState(null)

  if (!templates || templates.length === 0 || !wordBank) return null

  const handleWordClick = (word) => {
    setSelectedWord(word)
  }

  const handleBlankClick = (templateIndex, blankIndex) => {
    if (!selectedWord) return

    const key = `g_${templateIndex}_${blankIndex}`
    onChange(key, selectedWord)
    setSelectedWord(null)

    // Vibration feedback
    if (navigator.vibrate) navigator.vibrate(50)
  }

  const handleClearBlank = (templateIndex, blankIndex) => {
    const key = `g_${templateIndex}_${blankIndex}`
    onChange(key, '')
  }

  // Count how many words have been used
  const usedWords = Object.values(answers).filter(v => v).length
  const totalBlanks = templates.reduce((sum, template) => {
    return sum + (template.match(/_{3,}/g) || []).length
  }, 0)

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', py: 4 }}>
      {/* Word Bank - Always Visible */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.light' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
          Word Bank - Click a word, then click a blank
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {wordBank.map((word, wi) => (
            <Chip
              key={wi}
              label={word}
              onClick={() => handleWordClick(word)}
              sx={{
                fontSize: '1.1rem',
                py: 2.5,
                px: 2,
                cursor: 'pointer',
                bgcolor: selectedWord === word ? 'primary.main' : 'background.paper',
                color: selectedWord === word ? 'white' : 'text.primary',
                border: '2px solid',
                borderColor: selectedWord === word ? 'primary.dark' : 'divider',
                transform: selectedWord === word ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  bgcolor: selectedWord === word ? 'primary.dark' : 'grey.100'
                }
              }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {selectedWord ? `Selected: "${selectedWord}" - Now click a blank to fill it` : 'Select a word from above'}
          </Typography>
          <Chip
            label={`${usedWords} / ${totalBlanks} Filled`}
            color={usedWords === totalBlanks ? 'success' : 'default'}
            size="small"
          />
        </Box>
      </Paper>

      {/* Story with Blanks */}
      <Stack spacing={3}>
        {templates.map((template, ti) => {
          // Split by blanks
          const parts = template.split(/_{3,}/)
          const blankCount = (template.match(/_{3,}/g) || []).length

          return (
            <Paper key={ti} sx={{ p: 3 }} variant="outlined">
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, fontSize: '1.1rem' }}>
                {parts.map((part, pi) => (
                  <React.Fragment key={pi}>
                    <Typography component="span" sx={{ fontSize: '1.1rem', lineHeight: 2 }}>
                      {part}
                    </Typography>
                    {pi < parts.length - 1 && (() => {
                      const key = `g_${ti}_${pi}`
                      const filledWord = answers[key]

                      return (
                        <Box
                          onClick={() => {
                            if (filledWord) {
                              handleClearBlank(ti, pi)
                            } else {
                              handleBlankClick(ti, pi)
                            }
                          }}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            minWidth: '120px',
                            height: '40px',
                            px: 2,
                            border: '2px dashed',
                            borderColor: filledWord ? 'success.main' : (selectedWord ? 'primary.main' : 'grey.400'),
                            borderRadius: 1,
                            bgcolor: filledWord ? 'success.light' : (selectedWord ? 'primary.light' : 'grey.50'),
                            cursor: filledWord ? 'pointer' : (selectedWord ? 'pointer' : 'default'),
                            transition: 'all 0.2s',
                            position: 'relative',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              borderStyle: 'solid',
                              borderColor: filledWord ? 'error.main' : 'primary.dark'
                            }
                          }}
                        >
                          {filledWord ? (
                            <>
                              <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'success.dark', flex: 1 }}>
                                {filledWord}
                              </Typography>
                              <Cancel sx={{ fontSize: '1rem', color: 'error.main', ml: 0.5 }} />
                            </>
                          ) : (
                            <Typography sx={{ fontSize: '0.9rem', color: 'grey.500', fontStyle: 'italic' }}>
                              {selectedWord ? 'Click here' : '...'}
                            </Typography>
                          )}
                        </Box>
                      )
                    })()}
                  </React.Fragment>
                ))}
              </Box>
            </Paper>
          )
        })}
      </Stack>

      {/* Completion Message */}
      {usedWords === totalBlanks && (
        <Paper sx={{ p: 3, mt: 4, textAlign: 'center', bgcolor: 'success.light' }}>
          <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="success.dark">
            All Blanks Filled!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click Submit below to continue.
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default GapFillStory
