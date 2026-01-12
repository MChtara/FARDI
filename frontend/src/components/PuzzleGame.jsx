import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Button } from '@mui/material'

const PuzzleGame = ({ items, descriptions, answers, onChange, onComplete }) => {
    const [draggedItem, setDraggedItem] = useState(null)
    const [wrongPieces, setWrongPieces] = useState(new Set())
    const [isAssembling, setIsAssembling] = useState(false)
    const [isExploding, setIsExploding] = useState(false)
    const [assembledPieces, setAssembledPieces] = useState(new Set())

    // Shuffle array helper (Fisher-Yates shuffle)
    const shuffleArray = (array) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    // Puzzle piece positions (2x3 grid with slight randomness)
    const piecePositions = [
        { row: 0, col: 0, rotation: -5 },
        { row: 0, col: 1, rotation: 3 },
        { row: 0, col: 2, rotation: -2 },
        { row: 1, col: 0, rotation: 4 },
        { row: 1, col: 1, rotation: -3 },
        { row: 1, col: 2, rotation: 2 }
    ]

    // Get items as array and randomize order
    const itemsArray = items || Object.keys(descriptions || {})
    const descriptionsObj = descriptions || {}

    // Randomize once on mount
    const [randomizedItems] = useState(() => shuffleArray(itemsArray))
    const [randomizedLabels] = useState(() => shuffleArray(itemsArray))

    const handleDragStart = (item) => {
        setDraggedItem(item)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
    }

    const handleDrop = (targetItem, description) => {
        if (!draggedItem) return

        const isCorrect = descriptionsObj[draggedItem] === description

        if (isCorrect) {
            // Correct match - vibrate and glow
            onChange(draggedItem, draggedItem)
            setAssembledPieces(prev => new Set([...prev, targetItem]))

            // Vibration feedback
            if (navigator.vibrate) {
                navigator.vibrate(50)
            }

            // Remove from wrong pieces if it was there
            setWrongPieces(prev => {
                const next = new Set(prev)
                next.delete(targetItem)
                return next
            })
        } else {
            // Wrong match - shake animation
            setWrongPieces(prev => new Set([...prev, targetItem]))
            setTimeout(() => {
                setWrongPieces(prev => {
                    const next = new Set(prev)
                    next.delete(targetItem)
                    return next
                })
            }, 500)
        }

        setDraggedItem(null)
    }

    // Check if all pieces are correctly matched
    const isComplete = randomizedItems.length === Object.keys(answers || {}).length &&
        randomizedItems.every(item => answers[item] === item)

    useEffect(() => {
        if (isComplete && onComplete) {
            onComplete()
        }
    }, [isComplete, onComplete])

    return (
        <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', py: 4 }}>
            {/* Puzzle Pieces Grid - Centered */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 3,
                mb: 4,
                justifyItems: 'center',
                px: 2,
                position: 'relative'
            }}>
                {randomizedItems.map((item, index) => {
                    const position = piecePositions[index]
                    const description = descriptionsObj[item]
                    const isMatched = answers[item] === item
                    const isWrong = wrongPieces.has(item)
                    const selectedLabel = answers[item]

                    return (
                        <Paper
                            key={item}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(item, description)}
                            sx={{
                                p: 3,
                                minHeight: 150,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                backgroundColor: isMatched ? 'success.light' : isWrong ? 'error.light' : 'background.paper',
                                border: '2px solid',
                                borderColor: isMatched ? 'success.main' : isWrong ? 'error.main' : 'divider',
                                transform: isAssembling
                                    ? 'translate(0, 0) rotate(0deg)'
                                    : `rotate(${position.rotation}deg)`,
                                boxShadow: isMatched ? '0 0 20px rgba(76, 175, 80, 0.5)' : isWrong ? '0 0 20px rgba(244, 67, 54, 0.5)' : 3,
                                cursor: 'pointer',
                                transition: isAssembling ? 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'all 0.3s',
                                animation: isWrong ? 'shake 0.5s' : isMatched ? 'vibrate 0.3s' : 'none',
                                '@keyframes shake': {
                                    '0%, 100%': { transform: `translateX(0) rotate(${position.rotation}deg)` },
                                    '25%': { transform: `translateX(-10px) rotate(${position.rotation}deg)` },
                                    '75%': { transform: `translateX(10px) rotate(${position.rotation}deg)` }
                                },
                                '@keyframes vibrate': {
                                    '0%, 100%': { transform: 'translate(0, 0)' },
                                    '25%': { transform: 'translate(-2px, 2px)' },
                                    '50%': { transform: 'translate(2px, -2px)' },
                                    '75%': { transform: 'translate(-2px, -2px)' }
                                },
                                '&:hover': {
                                    transform: `rotate(${position.rotation}deg) scale(1.02)`,
                                    boxShadow: 6
                                }
                            }}
                        >
                            {/* Puzzle piece number */}
                            <Typography
                                variant="caption"
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    color: 'text.secondary',
                                    fontWeight: 'bold'
                                }}
                            >
                                {index + 1}
                            </Typography>

                            {/* Description text */}
                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: 'center',
                                    color: isMatched ? 'success.dark' : 'text.primary',
                                    fontWeight: isMatched ? 'bold' : 'normal'
                                }}
                            >
                                {description}
                            </Typography>

                            {/* Matched label */}
                            {selectedLabel && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        px: 2,
                                        py: 1,
                                        bgcolor: isMatched ? 'success.main' : 'primary.main',
                                        color: 'white',
                                        borderRadius: 2,
                                        fontWeight: 'bold',
                                        animation: isMatched ? 'pulse 0.5s' : 'none',
                                        '@keyframes pulse': {
                                            '0%': { transform: 'scale(1)' },
                                            '50%': { transform: 'scale(1.1)' },
                                            '100%': { transform: 'scale(1)' }
                                        }
                                    }}
                                >
                                    {selectedLabel}
                                </Box>
                            )}

                            {/* Drop zone indicator */}
                            {draggedItem && !selectedLabel && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        border: '3px dashed',
                                        borderColor: 'primary.main',
                                        borderRadius: 1,
                                        opacity: 0.5,
                                        pointerEvents: 'none'
                                    }}
                                />
                            )}

                            {/* Checkmark for correct matches */}
                            {isMatched && (
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        fontSize: '2rem'
                                    }}
                                >
                                    ✓
                                </Typography>
                            )}
                        </Paper>
                    )
                })}
            </Box>

            {/* Draggable Labels - Centered */}
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'center',
                mb: 3,
                px: 2
            }}>
                {randomizedLabels.map(item => {
                    const isUsed = Object.values(answers || {}).includes(item)

                    return (
                        <Box
                            key={item}
                            draggable={!isUsed}
                            onDragStart={() => handleDragStart(item)}
                            onDragEnd={handleDragEnd}
                            sx={{
                                px: 3,
                                py: 1.5,
                                bgcolor: isUsed ? 'grey.300' : draggedItem === item ? 'primary.dark' : 'primary.main',
                                color: 'white',
                                borderRadius: 2,
                                cursor: isUsed ? 'not-allowed' : 'grab',
                                fontWeight: 'bold',
                                opacity: isUsed ? 0.5 : 1,
                                transform: draggedItem === item ? 'scale(1.1)' : 'scale(1)',
                                transition: 'all 0.2s',
                                userSelect: 'none',
                                '&:hover': {
                                    bgcolor: isUsed ? 'grey.300' : 'primary.dark',
                                    transform: isUsed ? 'scale(1)' : 'scale(1.05)'
                                },
                                '&:active': {
                                    cursor: isUsed ? 'not-allowed' : 'grabbing'
                                }
                            }}
                        >
                            {item}
                        </Box>
                    )
                })}
            </Box>

            {/* Progress Indicator */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                    {Object.keys(answers || {}).length} / {randomizedItems.length} Matched
                </Typography>
                {isComplete && (
                    <Typography variant="body1" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                        🎉 Puzzle Complete! Click Submit to continue.
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export default PuzzleGame
