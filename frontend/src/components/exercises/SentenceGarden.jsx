/**
 * SentenceGarden - Plant Growth Sentence Expansion Component
 * 
 * A gamified sentence expansion where:
 * - Plant starts as seed
 * - Grows based on word count of expansion
 * - Visual stages: seed → sprout → small plant → full plant → flower
 */
import React, { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    LinearProgress,
    Stack
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Plant growth stages with emoji visuals
const GROWTH_STAGES = [
    { name: 'Seed', emoji: '🌰', minWords: 0, color: '#8B4513' },
    { name: 'Sprouting', emoji: '🌱', minWords: 5, color: '#90EE90' },
    { name: 'Growing', emoji: '🌿', minWords: 15, color: '#32CD32' },
    { name: 'Blooming', emoji: '🌻', minWords: 25, color: '#FFD700' },
    { name: 'Flourishing', emoji: '🌺', minWords: 40, color: '#FF69B4' }
]

export default function SentenceGarden({ exercise, onComplete, onProgress }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentInput, setCurrentInput] = useState('')
    const [answers, setAnswers] = useState({})
    const [showSuccess, setShowSuccess] = useState(false)
    const [totalWords, setTotalWords] = useState(0)

    const templates = exercise?.templates || []
    const guidedQuestions = exercise?.guided_questions || []
    const totalTemplates = templates.length

    // Get current word count
    const wordCount = currentInput.trim().split(/\s+/).filter(w => w).length

    // Determine current growth stage
    const currentStage = useMemo(() => {
        let stage = GROWTH_STAGES[0]
        for (const s of GROWTH_STAGES) {
            if (wordCount >= s.minWords) {
                stage = s
            }
        }
        return stage
    }, [wordCount])

    // Check if can proceed (minimum 10 words)
    const minRequired = 10
    const canProceed = wordCount >= minRequired

    // Handle next phrase
    const handleNext = () => {
        if (!canProceed) return

        const key = `expansion_${currentIndex}`
        const newAnswers = { ...answers, [key]: currentInput }
        setAnswers(newAnswers)
        setTotalWords(prev => prev + wordCount)

        // Show success animation
        setShowSuccess(true)

        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100])
        }

        onProgress?.({ answers: newAnswers, totalWords: totalWords + wordCount })

        setTimeout(() => {
            setShowSuccess(false)
            if (currentIndex < totalTemplates - 1) {
                setCurrentIndex(prev => prev + 1)
                setCurrentInput('')
            } else {
                // Complete
                onComplete?.({
                    isPerfect: true,
                    answers: newAnswers,
                    totalWords: totalWords + wordCount
                })
            }
        }, 1500)
    }

    const progress = ((currentIndex + (showSuccess ? 1 : 0)) / totalTemplates) * 100
    const isComplete = currentIndex >= totalTemplates - 1 && showSuccess

    if (!templates || templates.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography>No templates available</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{
            width: '100%',
            maxWidth: 800,
            mx: 'auto',
            py: 3,
            px: 2
        }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    🌱 Sentence Garden
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Expand the sentence to grow your plant!
                </Typography>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ mb: 3 }}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(144, 238, 144, 0.2)',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: '#32CD32'
                        }
                    }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                    {currentIndex + (showSuccess ? 1 : 0)} / {totalTemplates} sentences expanded
                </Typography>
            </Box>

            {/* Success Animation */}
            {showSuccess && (
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        mb: 3,
                        textAlign: 'center',
                        bgcolor: '#e8f5e9',
                        border: '2px solid #4caf50',
                        animation: 'fadeIn 0.5s ease-out',
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'scale(0.9)' },
                            to: { opacity: 1, transform: 'scale(1)' }
                        }
                    }}
                >
                    <Typography sx={{ fontSize: '4rem', mb: 1 }}>
                        {currentStage.emoji}
                    </Typography>
                    <CheckCircleIcon sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h6" color="success.dark" fontWeight="bold">
                        Beautiful! Your plant grew!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        +{wordCount} words added
                    </Typography>
                </Paper>
            )}

            {/* Main Game Area */}
            {!showSuccess && (
                <Paper
                    elevation={4}
                    sx={{
                        p: 3,
                        bgcolor: '#1a1a2e',
                        border: '2px solid',
                        borderColor: currentStage.color,
                        borderRadius: 3
                    }}
                >
                    {/* Plant Display */}
                    <Box sx={{
                        textAlign: 'center',
                        py: 3,
                        mb: 3,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        position: 'relative'
                    }}>
                        {/* Soil */}
                        <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 120,
                            height: 20,
                            bgcolor: '#8B4513',
                            borderRadius: '50%'
                        }} />

                        {/* Plant */}
                        <Typography sx={{
                            fontSize: '5rem',
                            transition: 'all 0.5s ease',
                            transform: `scale(${0.6 + (GROWTH_STAGES.indexOf(currentStage) * 0.15)})`,
                            filter: `brightness(${0.7 + (GROWTH_STAGES.indexOf(currentStage) * 0.1)})`
                        }}>
                            {currentStage.emoji}
                        </Typography>

                        {/* Stage Label */}
                        <Typography
                            variant="caption"
                            sx={{
                                color: currentStage.color,
                                fontWeight: 600,
                                mt: 1,
                                display: 'block'
                            }}
                        >
                            {currentStage.name}
                        </Typography>
                    </Box>

                    {/* Word Count Progress */}
                    <Box sx={{ mb: 3 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'grey.400' }}>
                                Words: {wordCount}
                            </Typography>
                            <Typography variant="caption" sx={{ color: canProceed ? '#4caf50' : 'grey.400' }}>
                                {canProceed ? '✓ Ready!' : `Need ${minRequired - wordCount} more`}
                            </Typography>
                        </Stack>
                        <Box sx={{
                            height: 8,
                            bgcolor: 'rgba(255,255,255,0.1)',
                            borderRadius: 4,
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                height: '100%',
                                width: `${Math.min((wordCount / 40) * 100, 100)}%`,
                                bgcolor: currentStage.color,
                                borderRadius: 4,
                                transition: 'all 0.3s ease'
                            }} />
                        </Box>

                        {/* Growth markers */}
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5, px: 0.5 }}>
                            {GROWTH_STAGES.map((stage, idx) => (
                                <Typography
                                    key={idx}
                                    sx={{
                                        fontSize: '0.7rem',
                                        opacity: wordCount >= stage.minWords ? 1 : 0.4,
                                        transition: 'opacity 0.3s'
                                    }}
                                >
                                    {stage.emoji}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>

                    {/* Original Phrase */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: 'grey.500', mb: 0.5, display: 'block' }}>
                            Phrase {currentIndex + 1} of {totalTemplates}:
                        </Typography>
                        <Paper sx={{
                            p: 2,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            border: '1px dashed rgba(255,255,255,0.2)'
                        }}>
                            <Typography sx={{
                                color: '#e0e0e0',
                                fontStyle: 'italic',
                                fontSize: '1.1rem'
                            }}>
                                "{templates[currentIndex].replace(/_+/g, '________')}"
                            </Typography>
                        </Paper>
                    </Box>

                    {/* Guided Questions */}
                    {guidedQuestions && guidedQuestions.length > 0 && (
                        <Box sx={{
                            mb: 2,
                            p: 1.5,
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            borderRadius: 2,
                            border: '1px solid rgba(76, 175, 80, 0.3)'
                        }}>
                            <Typography sx={{
                                color: '#4caf50',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                mb: 0.5,
                                textTransform: 'uppercase'
                            }}>
                                💡 Tip:
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'grey.400',
                                    fontSize: '0.85rem',
                                    pl: 1,
                                    borderLeft: '2px solid rgba(76, 175, 80, 0.5)'
                                }}
                            >
                                {guidedQuestions[currentIndex] || guidedQuestions[0]}
                            </Typography>
                        </Box>
                    )}

                    {/* Input Area */}
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Expand this sentence here... Add details, descriptions, and more!"
                        variant="outlined"
                        autoFocus
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.05)',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&:hover fieldset': { borderColor: currentStage.color },
                                '&.Mui-focused fieldset': { borderColor: currentStage.color }
                            }
                        }}
                    />

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={!canProceed}
                        onClick={handleNext}
                        sx={{
                            py: 1.5,
                            bgcolor: canProceed ? '#4caf50' : 'grey.700',
                            '&:hover': { bgcolor: '#45a049' },
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                    >
                        {currentIndex >= totalTemplates - 1 ? '🌸 Finish Garden' : '🌱 Plant & Grow Next'}
                    </Button>
                </Paper>
            )}

            {/* Completion Celebration */}
            {isComplete && (
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        mt: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                        border: '3px solid #4caf50'
                    }}
                >
                    <Typography sx={{ fontSize: '4rem', mb: 1 }}>
                        🌺🌻🌸🌷🌹
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="success.dark" gutterBottom>
                        🎉 Garden Complete!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Total words written: {totalWords}
                    </Typography>
                </Paper>
            )}
        </Box>
    )
}
