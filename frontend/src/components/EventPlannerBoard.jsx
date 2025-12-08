import React, { useState } from 'react'
import { Box, Typography, Paper, Button, TextField, LinearProgress } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

const EventPlannerBoard = ({ exercise, templates: templatesProp, answers, onChange }) => {
    const [currentPhrase, setCurrentPhrase] = useState(0)
    const [currentInput, setCurrentInput] = useState('')
    const [completedCards, setCompletedCards] = useState([])

    // Extract templates from multiple possible sources
    const templates = templatesProp ||
        exercise?.templates ||
        exercise?.planning_template ||
        exercise?.planning_items ||
        []

    if (!templates || templates.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No planning items available
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    This activity doesn't have planning templates configured.
                </Typography>
            </Box>
        )
    }

    const totalPhrases = templates.length
    const isLastPhrase = currentPhrase >= totalPhrases - 1
    const canProceed = currentInput.trim().length > 10 // Minimum 10 characters

    // Character SVG mapping
    const characterAvatars = {
        'Emna': '/static/images/avatars/emna.svg',
        'Ryan': '/static/images/avatars/ryan.svg',
        'Lilia': '/static/images/avatars/lilia.svg',
        'Skander': '/static/images/avatars/skander.svg',
        'SKANDER': '/static/images/avatars/skander.svg',
        'Yassine': '/static/images/avatars/mabrouki.svg',
        'Haythem': '/static/images/avatars/mabrouki.svg'
    }

    // Task icons based on keywords
    const getTaskIcon = (text) => {
        const lower = text.toLowerCase()
        if (lower.includes('music') || lower.includes('songs')) return '🎵'
        if (lower.includes('decor') || lower.includes('art')) return '🎨'
        if (lower.includes('food') || lower.includes('cooking')) return '🍕'
        if (lower.includes('promo')) return '📣'
        if (lower.includes('schedule')) return '📋'
        if (lower.includes('setup')) return '🎪'
        return '✨'
    }

    // Extract character, task, and reason from sentence
    const parseSentence = (sentence) => {
        const words = sentence.split(/\s+/)
        const character = words.find(w => Object.keys(characterAvatars).includes(w)) || 'Person'
        const task = sentence.includes('does') ? sentence.split('does')[1]?.split('because')[0]?.trim() :
            sentence.includes('for') ? sentence.split('for')[1]?.split('because')[0]?.trim() :
                sentence.includes('will') ? sentence.split('will')[1]?.split('.')[0]?.trim() : 'Task'
        const reason = sentence.includes('because') ? sentence.split('because')[1]?.split('.')[0]?.trim() : ''

        return { character, task, reason }
    }

    const handleNext = () => {
        if (!canProceed) return

        // Save answer
        const key = `w_${currentPhrase}`
        onChange(key, currentInput)

        // Parse and create card data
        const parsed = parseSentence(currentInput)
        setCompletedCards([...completedCards, {
            ...parsed,
            sentence: currentInput,
            icon: getTaskIcon(currentInput),
            avatar: characterAvatars[parsed.character] || characterAvatars['Ryan']
        }])

        // Move to next or finish
        if (currentPhrase < totalPhrases - 1) {
            setCurrentPhrase(currentPhrase + 1)
            setCurrentInput('')
        }
    }

    const progress = ((currentPhrase + 1) / totalPhrases) * 100

    return (
        <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', py: 4 }}>
            {/* Progress Bar */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" color="primary">
                        Event Planning Team Builder
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {completedCards.length} / {totalPhrases} Complete
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 8, borderRadius: 1 }}
                />
            </Box>

            {/* Team Board - Completed Cards */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 3,
                mb: 4,
                minHeight: 400
            }}>
                {completedCards.map((card, index) => (
                    <Paper
                        key={index}
                        elevation={3}
                        sx={{
                            p: 3,
                            bgcolor: 'background.paper',
                            border: '2px solid',
                            borderColor: 'success.main',
                            animation: 'slideIn 0.5s ease-out',
                            '@keyframes slideIn': {
                                from: {
                                    opacity: 0,
                                    transform: 'translateX(-50px) scale(0.9)'
                                },
                                to: {
                                    opacity: 1,
                                    transform: 'translateX(0) scale(1)'
                                }
                            }
                        }}
                    >
                        {/* Character Avatar */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box
                                component="img"
                                src={card.avatar}
                                alt={card.character}
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    border: '3px solid',
                                    borderColor: 'primary.main',
                                    bgcolor: 'white',
                                    mr: 2
                                }}
                            />
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {card.character}
                                </Typography>
                                <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                            </Box>
                        </Box>

                        {/* Task */}
                        <Box sx={{
                            p: 2,
                            bgcolor: 'primary.light',
                            borderRadius: 1,
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Typography variant="h5">{card.icon}</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {card.task}
                            </Typography>
                        </Box>

                        {/* Reason */}
                        {card.reason && (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                "{card.reason}"
                            </Typography>
                        )}
                    </Paper>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: totalPhrases - completedCards.length }).map((_, index) => (
                    <Paper
                        key={`empty-${index}`}
                        variant="outlined"
                        sx={{
                            p: 3,
                            border: '2px dashed',
                            borderColor: index === 0 ? 'primary.main' : 'divider',
                            bgcolor: index === 0 ? 'action.hover' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 180,
                            animation: index === 0 ? 'pulse 2s infinite' : 'none',
                            '@keyframes pulse': {
                                '0%, 100%': { opacity: 0.6 },
                                '50%': { opacity: 1 }
                            }
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {index === 0 ? 'Add team member...' : 'Slot ' + (completedCards.length + index + 1)}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            {/* Input Section - Only show if not complete */}
            {completedCards.length < totalPhrases && (
                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                        Sentence {currentPhrase + 1}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Template: {templates[currentPhrase]}
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Write your complete sentence here..."
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color={canProceed ? 'success.main' : 'text.secondary'}>
                            {currentInput.trim().length} characters
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            disabled={!canProceed}
                            onClick={handleNext}
                            sx={{ minWidth: 150 }}
                        >
                            {isLastPhrase && canProceed ? 'Complete Team' : 'Add to Team →'}
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Completion Message */}
            {completedCards.length === totalPhrases && (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" color="success.dark">
                        Event Team Complete!
                    </Typography>
                    <Typography variant="body1">
                        All {totalPhrases} team members have been assigned. Click Submit to continue.
                    </Typography>
                </Paper>
            )}
        </Box>
    )
}

export default EventPlannerBoard
