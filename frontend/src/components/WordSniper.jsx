import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Button, Chip } from '@mui/material'
import { CheckCircle, Cancel, TrendingUp } from '@mui/icons-material'

const WordSniper = ({ sentences, answers, onChange, globalWordBank = null, correctAnswers = [] }) => {
    const [currentPhrase, setCurrentPhrase] = useState(0)
    const [selectedWord, setSelectedWord] = useState(null)
    const [hits, setHits] = useState(0)
    const [misses, setMisses] = useState(0)
    const [targetHit, setTargetHit] = useState(null)
    const [showValidation, setShowValidation] = useState(false)

    if (!sentences || sentences.length === 0) return null

    const sentence = sentences[currentPhrase]
    const template = sentence.text || ''
    const blanks = sentence.blanks || []

    // Generate word bank: use globalWordBank if provided, otherwise from current phrase blanks
    const wordBank = globalWordBank
        ? [...globalWordBank]
        : [...blanks].sort(() => Math.random() - 0.5)

    // Count how many blanks are already filled for this phrase
    const previousBlanks = sentences.slice(0, currentPhrase).reduce(
        (acc, s) => acc + (s.blanks?.length || 0),
        0
    )

    const blanksFilled = blanks.filter((_, bi) => {
        const key = `g_${previousBlanks + bi}`
        return answers[key] && answers[key] !== ''
    }).length

    const allFilled = blanksFilled === blanks.length
    const isLastPhrase = currentPhrase >= sentences.length - 1

    const handleWordSelect = (word) => {
        setSelectedWord(word)
    }

    const handleTargetClick = (blankIndex) => {
        if (!selectedWord) return

        const key = `g_${previousBlanks + blankIndex}`

        // If using global word bank, skip validation (all words are acceptable)
        if (globalWordBank) {
            onChange(key, selectedWord)
            setHits(hits + 1)
            setTargetHit({ index: blankIndex, correct: true })

            // Vibration feedback
            if (navigator.vibrate) navigator.vibrate(50)

            // Clear effects after animation
            setTimeout(() => {
                setSelectedWord(null)
                setTargetHit(null)
            }, 500)
        } else {
            // Original validation logic for fill_gaps
            const correctWord = blanks[blankIndex]
            const isCorrect = selectedWord === correctWord

            if (isCorrect) {
                onChange(key, selectedWord)
                setHits(hits + 1)
                setTargetHit({ index: blankIndex, correct: true })

                // Vibration feedback
                if (navigator.vibrate) navigator.vibrate(50)
            } else {
                setMisses(misses + 1)
                setTargetHit({ index: blankIndex, correct: false })
            }

            // Clear effects after animation
            setTimeout(() => {
                setSelectedWord(null)
                setTargetHit(null)
            }, 500)
        }
    }

    const handleNext = () => {
        // Show validation for current phrase before moving to next
        if (globalWordBank && correctAnswers.length > 0) {
            setShowValidation(true)
            // Wait for user to see validation, then move to next phrase
            setTimeout(() => {
                if (currentPhrase < sentences.length - 1) {
                    setCurrentPhrase(currentPhrase + 1)
                    setShowValidation(false)
                }
            }, 1500)
        } else {
            // Original behavior for fill_gaps
            if (currentPhrase < sentences.length - 1) {
                setCurrentPhrase(currentPhrase + 1)
            }
        }
    }

    const handleReset = () => {
        // Clear all answers for current phrase
        const blankIndices = Array.from({ length: blanks.length }, (_, i) => i)
        blankIndices.forEach(bi => {
            const key = `g_${previousBlanks + bi}`
            onChange(key, '')
        })
        setSelectedWord(null)
    }

    // Split template by blanks
    const parts = template.split(/_{3,}/)

    return (
        <Box sx={{
            width: '100%',
            maxWidth: 1000,
            mx: 'auto',
            py: 4,
            cursor: selectedWord ? 'crosshair' : 'default'
        }}>
            {/* Stats Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, px: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip
                        label={`Phrase ${currentPhrase + 1} / ${sentences.length}`}
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                    />
                    {globalWordBank && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleReset}
                            sx={{ textTransform: 'none' }}
                        >
                            Reset Phrase
                        </Button>
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip
                        icon={<CheckCircle />}
                        label={`Hits: ${hits}`}
                        color="success"
                        variant="outlined"
                    />
                    <Chip
                        icon={<Cancel />}
                        label={`Misses: ${misses}`}
                        color="error"
                        variant="outlined"
                    />
                    <Chip
                        icon={<TrendingUp />}
                        label={`Accuracy: ${hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0}%`}
                        color="info"
                        variant="outlined"
                    />
                </Box>
            </Box>

            {/* Sentence with Target Blanks */}
            <Paper
                sx={{
                    p: 4,
                    mb: 4,
                    bgcolor: 'grey.900',
                    color: 'white',
                    minHeight: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, fontSize: '1.5rem' }}>
                    {parts.map((part, pi) => (
                        <React.Fragment key={pi}>
                            <Typography component="span" sx={{ fontSize: '1.5rem', color: 'white' }}>
                                {part}
                            </Typography>
                            {pi < blanks.length && (() => {
                                const key = `g_${previousBlanks + pi}`
                                const filled = answers[key]
                                const isTarget = targetHit?.index === pi

                                // Check if answer is correct (for gap_fill_story with validation)
                                let isCorrect = true
                                if (globalWordBank && showValidation && filled && correctAnswers.length > currentPhrase) {
                                    const correctAnswer = correctAnswers[currentPhrase]
                                    // Simple check: does the correct answer contain the filled word
                                    isCorrect = correctAnswer && correctAnswer.toLowerCase().includes(filled.toLowerCase())
                                }

                                // Determine background color
                                let bgColor = 'background.paper'
                                if (filled) {
                                    if (globalWordBank) {
                                        // For gap_fill_story
                                        if (showValidation) {
                                            bgColor = isCorrect ? 'success.main' : 'error.main'
                                        } else {
                                            bgColor = '#1565C0' // Deep blue when filled but not validated
                                        }
                                    } else {
                                        // For fill_gaps
                                        bgColor = 'success.main'
                                    }
                                } else if (isTarget) {
                                    bgColor = targetHit.correct ? 'success.light' : 'error.light'
                                }

                                // Determine border color
                                let borderColor = 'divider'
                                if (filled) {
                                    if (globalWordBank && showValidation) {
                                        borderColor = isCorrect ? 'success.dark' : 'error.dark'
                                    } else if (globalWordBank) {
                                        borderColor = '#0D47A1' // Darker blue border
                                    } else {
                                        borderColor = 'success.dark'
                                    }
                                } else if (selectedWord) {
                                    borderColor = 'error.main'
                                }

                                return (
                                    <Paper
                                        onClick={() => handleTargetClick(pi)}
                                        sx={{
                                            px: 3,
                                            py: 1,
                                            minWidth: 120,
                                            textAlign: 'center',
                                            bgcolor: bgColor,
                                            border: '3px solid',
                                            borderColor: borderColor,
                                            transform: isTarget ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'all 0.3s',
                                            animation: isTarget
                                                ? targetHit.correct
                                                    ? 'targetHit 0.5s'
                                                    : 'targetMiss 0.5s'
                                                : 'none',
                                            '@keyframes targetHit': {
                                                '0%': { transform: 'scale(1)' },
                                                '50%': { transform: 'scale(1.2)', boxShadow: '0 0 30px rgba(76, 175, 80, 0.8)' },
                                                '100%': { transform: 'scale(1)' }
                                            },
                                            '@keyframes targetMiss': {
                                                '0%, 100%': { transform: 'translateX(0)' },
                                                '25%': { transform: 'translateX(-10px)' },
                                                '75%': { transform: 'translateX(10px)' }
                                            },
                                            '&:hover': selectedWord && !filled
                                                ? {
                                                    borderColor: 'warning.main',
                                                    transform: 'scale(1.05)',
                                                    boxShadow: '0 0 20px rgba(255, 152, 0, 0.5)'
                                                }
                                                : {}
                                        }}
                                    >
                                        {filled ? (
                                            <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
                                                {filled}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                [ Target ]
                                            </Typography>
                                        )}
                                    </Paper>
                                )
                            })()}
                        </React.Fragment>
                    ))}
                </Box>
            </Paper>

            {/* Word Bank */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, justifyContent: 'center' }}>
                {wordBank.map((word, wi) => {
                    // If using global word bank, words can be reused, so don't disable them
                    const isUsedInCurrentPhrase = globalWordBank
                        ? false  // Global word bank allows reuse
                        : blanks.some((_, bi) => {
                            const key = `g_${previousBlanks + bi}`
                            return answers[key] === word
                        })
                    const isUsed = isUsedInCurrentPhrase
                    const isSelected = selectedWord === word

                    return (
                        <Paper
                            key={wi}
                            onClick={() => !isUsed && handleWordSelect(word)}
                            sx={{
                                px: 3,
                                py: 2,
                                cursor: isUsed ? 'not-allowed' : 'pointer',
                                bgcolor: isUsed
                                    ? 'grey.300'
                                    : isSelected
                                        ? 'warning.main'
                                        : 'primary.main',
                                color: isUsed ? 'text.disabled' : 'white',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                opacity: isUsed ? 0.5 : 1,
                                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                transition: 'all 0.2s',
                                border: isSelected ? '3px solid' : '2px solid',
                                borderColor: isSelected ? 'warning.dark' : 'transparent',
                                animation: isSelected ? 'pulse 1s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%, 100%': { boxShadow: '0 0 0 rgba(255, 152, 0, 0)' },
                                    '50%': { boxShadow: '0 0 20px rgba(255, 152, 0, 0.8)' }
                                },
                                '&:hover': !isUsed
                                    ? {
                                        transform: 'scale(1.1)',
                                        bgcolor: isSelected ? 'warning.dark' : 'primary.dark'
                                    }
                                    : {}
                            }}
                        >
                            {word}
                        </Paper>
                    )
                })}
            </Box>

        {/* Progress and Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1">
            {blanksFilled} / {blanks.length} targets hit
        </Typography>
        {allFilled && !isLastPhrase && (
            <Button
                variant="contained"
                size="large"
                onClick={handleNext}
                sx={{ minWidth: 200 }}
            >
                Next Phrase →
            </Button>
        )}
        {allFilled && isLastPhrase && (
            <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                All Phrases Complete! Click Submit.
            </Typography>
        )}
    </Box>
        </Box >
    )
}

export default WordSniper
