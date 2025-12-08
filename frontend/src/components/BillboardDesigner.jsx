import React, { useState } from 'react'
import { Box, Typography, Paper, Button, TextField, LinearProgress } from '@mui/material'
import { CheckCircle, Close } from '@mui/icons-material'

const BillboardDesigner = ({ templates, answers, onChange, correctAnswers = [] }) => {
    const [currentPhrase, setCurrentPhrase] = useState(0)
    const [currentInput, setCurrentInput] = useState('')
    const [filledSections, setFilledSections] = useState([])
    const [showingFeedback, setShowingFeedback] = useState(false)
    const [allCompletedSections, setAllCompletedSections] = useState([])

    if (!templates || templates.length === 0) return null

    const totalPhrases = templates.length
    const canProceed = currentInput.trim().length > 10

    const characterAvatars = {
        'Emna': '/static/images/avatars/emna.svg',
        'Ryan': '/static/images/avatars/ryan.svg',
        'Lilia': '/static/images/avatars/lilia.svg',
        'Skander': '/static/images/avatars/skander.svg',
        'SKANDER': '/static/images/avatars/skander.svg',
        'Yassine': '/static/images/avatars/mabrouki.svg',
        'Haythem': '/static/images/avatars/mabrouki.svg',
        'Decorations': '/static/images/avatars/ryan.svg'
    }

    const posterSections = [
        { title: 'Music', color: '#FF6B9D', icon: '🎵', bgGradient: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)' },
        { title: 'Decorations', color: '#FFA07A', icon: '🎨', bgGradient: 'linear-gradient(135deg, #FFA07A 0%, #FF7F50 100%)' },
        { title: 'Food', color: '#FFD93D', icon: '🍕', bgGradient: 'linear-gradient(135deg, #FFD93D 0%, #FFC107 100%)' },
        { title: 'Promotion', color: '#6BCF7F', icon: '📣', bgGradient: 'linear-gradient(135deg, #6BCF7F 0%, #4CAF50 100%)' },
        { title: 'Event', color: '#4D96FF', icon: '🎪', bgGradient: 'linear-gradient(135deg, #4D96FF 0%, #2196F3 100%)' },
        { title: 'General', color: '#9D84B7', icon: '✨', bgGradient: 'linear-gradient(135deg, #9D84B7 0%, #7E57C2 100%)' }
    ]

    const detectSection = (sentence) => {
        const lower = sentence.toLowerCase()
        if (lower.includes('music') || lower.includes('songs')) return 0
        if (lower.includes('decor') || lower.includes('organized')) return 1
        if (lower.includes('food') || lower.includes('cooking')) return 2
        if (lower.includes('promo') || lower.includes('lilia')) return 3
        if (lower.includes('event') || lower.includes('will have')) return 4
        return 5
    }

    const parseSentence = (sentence, isCorrect) => {
        const words = sentence.split(/\s+/)
        const character = words.find(w => Object.keys(characterAvatars).includes(w)) ||
            (sentence.toLowerCase().includes('decorations') ? 'Decorations' : 'Person')

        return {
            character,
            avatar: characterAvatars[character] || characterAvatars['Ryan'],
            sectionIndex: detectSection(sentence),
            sentence,
            isCorrect
        }
    }

    const validateAnswer = (userAnswer, phraseIndex) => {
        if (!correctAnswers || correctAnswers.length === 0) return true

        const correctAnswer = correctAnswers[phraseIndex]
        if (!correctAnswer) return true

        const normalizeAnswer = (ans) => {
            return ans
                .replace(/^\d+\.\s*/, '')
                .toLowerCase()
                .replace(/[.,!?]/g, '')
                .trim()
        }

        const userNormalized = normalizeAnswer(userAnswer)
        const correctNormalized = normalizeAnswer(correctAnswer)

        // Must match exactly
        return userNormalized === correctNormalized
    }

    const handleNext = () => {
        if (!canProceed) return

        const isCorrect = validateAnswer(currentInput, currentPhrase)
        const key = `w_${currentPhrase}`
        onChange(key, currentInput)

        const parsed = parseSentence(currentInput, isCorrect)
        const updatedCompleted = [...allCompletedSections, parsed]
        setAllCompletedSections(updatedCompleted)

        setShowingFeedback(true)
        setFilledSections([parsed])

        if (navigator.vibrate) {
            if (isCorrect) {
                navigator.vibrate([100, 50, 100])
            } else {
                navigator.vibrate([200, 100, 200, 100, 200])
            }
        }

        const isLastPhrase = currentPhrase >= totalPhrases - 1

        setTimeout(() => {
            if (isLastPhrase) {
                setShowingFeedback(true)
                setFilledSections(updatedCompleted)
            } else {
                setShowingFeedback(false)
                setFilledSections([])
                setCurrentPhrase(currentPhrase + 1)
                setCurrentInput('')
            }
        }, 2500)
    }

    const progress = ((currentPhrase) / totalPhrases) * 100
    const isComplete = currentPhrase >= totalPhrases && !showingFeedback

    return (
        <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', py: 4, px: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Event Poster Designer
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 8, borderRadius: 2, maxWidth: 400, mx: 'auto' }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {currentPhrase} / {totalPhrases} Complete
                </Typography>
            </Box>

            {showingFeedback && filledSections.length > 0 && (
                <Paper
                    elevation={12}
                    sx={{
                        p: 4,
                        mb: 4,
                        bgcolor: 'grey.100',
                        animation: 'slideDown 0.5s ease-out',
                        '@keyframes slideDown': {
                            from: { opacity: 0, transform: 'translateY(-50px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}
                >
                    <Box sx={{
                        display: filledSections.length === 1 ? 'flex' : 'grid',
                        gridTemplateColumns: filledSections.length > 1 ? 'repeat(3, 1fr)' : undefined,
                        gap: filledSections.length > 1 ? 3 : 0,
                        justifyContent: 'center'
                    }}>
                        {filledSections.map((filled, idx) => {
                            const section = posterSections[filled.sectionIndex]

                            return (
                                <Paper
                                    key={idx}
                                    elevation={8}
                                    sx={{
                                        p: filledSections.length === 1 ? 4 : 3,
                                        width: filledSections.length === 1 ? 300 : 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: filled.isCorrect ? section.bgGradient : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                                        border: '4px solid',
                                        borderColor: filled.isCorrect ? section.color : '#c62828',
                                        animation: 'buildIn 0.8s ease-out',
                                        minHeight: filledSections.length > 1 ? 250 : 'auto',
                                        '@keyframes buildIn': {
                                            '0%': {
                                                opacity: 0,
                                                transform: 'scale(0.3) rotate(-10deg)',
                                            },
                                            '60%': {
                                                transform: 'scale(1.1) rotate(2deg)',
                                            },
                                            '100%': {
                                                opacity: 1,
                                                transform: 'scale(1) rotate(0deg)',
                                            }
                                        }
                                    }}
                                >
                                    <Typography
                                        variant={filledSections.length === 1 ? "h5" : "h6"}
                                        fontWeight="bold"
                                        color="white"
                                        sx={{ mb: filledSections.length === 1 ? 3 : 2 }}
                                    >
                                        {section.icon} {section.title}
                                    </Typography>

                                    {filled.isCorrect ? (
                                        <>
                                            <Box
                                                component="img"
                                                src={filled.avatar}
                                                alt={filled.character}
                                                sx={{
                                                    width: filledSections.length === 1 ? 100 : 70,
                                                    height: filledSections.length === 1 ? 100 : 70,
                                                    borderRadius: '50%',
                                                    border: '4px solid white',
                                                    bgcolor: 'white',
                                                    mb: 2,
                                                    boxShadow: 4,
                                                    animation: 'popIn 0.6s ease-out 0.5s both'
                                                }}
                                            />

                                            <Typography
                                                variant={filledSections.length === 1 ? "h4" : "h6"}
                                                fontWeight="bold"
                                                color="white"
                                                sx={{
                                                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                                                    mb: filledSections.length === 1 ? 2 : 1,
                                                    animation: 'popIn 0.6s ease-out 0.7s both'
                                                }}
                                            >
                                                {filled.character}
                                            </Typography>

                                            <CheckCircle sx={{
                                                color: 'white',
                                                fontSize: filledSections.length === 1 ? 60 : 40,
                                                animation: 'popIn 0.6s ease-out 0.9s both'
                                            }} />
                                        </>
                                    ) : (
                                        <>
                                            <Box
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    borderRadius: '50%',
                                                    border: '6px solid white',
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 2,
                                                    animation: 'shake 0.5s ease-out 0.3s'
                                                }}
                                            >
                                                <Close sx={{
                                                    color: 'white',
                                                    fontSize: 100,
                                                    fontWeight: 'bold'
                                                }} />
                                            </Box>

                                            <Typography
                                                variant="h5"
                                                fontWeight="bold"
                                                color="white"
                                                sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}
                                            >
                                                Try Again
                                            </Typography>
                                        </>
                                    )}
                                </Paper>
                            )
                        })}
                    </Box>
                </Paper>
            )}

            {!isComplete && !showingFeedback && (
                <Paper sx={{ p: 4, bgcolor: 'background.paper', border: '2px solid', borderColor: 'primary.main' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Sentence {currentPhrase + 1} of {totalPhrases}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
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
                        autoFocus
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                fontSize: '1.1rem'
                            }
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color={canProceed ? 'success.main' : 'text.secondary'}>
                            {currentInput.trim().length} characters {canProceed ? '✓' : '(min 10)'}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            disabled={!canProceed}
                            onClick={handleNext}
                            sx={{ minWidth: 200, py: 1.5 }}
                        >
                            Check Answer →
                        </Button>
                    </Box>
                </Paper>
            )}

            {isComplete && (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" color="success.dark">
                        All Sentences Complete!
                    </Typography>
                    <Typography variant="body1">
                        Click Submit to continue.
                    </Typography>
                </Paper>
            )}

            <style>
                {`
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              transform: scale(1.15);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-15px) rotate(-5deg); }
            75% { transform: translateX(15px) rotate(5deg); }
          }
        `}
            </style>
        </Box>
    )
}

export default BillboardDesigner
