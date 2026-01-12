/**
 * Word Builder Blocks Game
 * Players arrange letter blocks to spell words that fill in the gaps
 * Letters are scrambled from all target words in a phrase
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Paper, Typography, Button, Chip, IconButton, Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './WordBuilder.css';

export default function WordBuilder({ exercise, onComplete, onProgress }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedLetters, setSelectedLetters] = useState({});
    const [availableLetters, setAvailableLetters] = useState([]);
    const [activeGap, setActiveGap] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [hintsUsed, setHintsUsed] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [completedPhrases, setCompletedPhrases] = useState([]);

    const templates = exercise?.templates || [];
    const correctAnswers = exercise?.correct_answers || [];
    const currentTemplate = templates[currentIndex] || '';
    const currentAnswer = correctAnswers[currentIndex] || '';

    // Extract target words by comparing template and answer
    const getTargetWords = useMemo(() => {
        if (!currentAnswer || !currentTemplate) return [];

        // Remove numbering like "1. "
        const cleanAnswer = currentAnswer.replace(/^\d+\.\s*/, '').trim();
        const cleanTemplate = currentTemplate.replace(/^\d+\.\s*/, '').trim();

        // Count gaps
        const gapMatches = cleanTemplate.match(/_{3,}/g) || [];
        const numGaps = gapMatches.length;

        if (numGaps === 0) return [];

        // Split template into parts (non-gap text)
        const templateParts = cleanTemplate.split(/_{3,}/);

        // Now extract the words that fill the gaps from the answer
        const targetWords = [];
        let remainingAnswer = cleanAnswer;

        for (let i = 0; i < templateParts.length; i++) {
            const part = templateParts[i].trim();

            if (part) {
                // Find this part in the remaining answer
                const partIndex = remainingAnswer.toLowerCase().indexOf(part.toLowerCase());

                if (partIndex > 0) {
                    // There's a gap word before this part
                    const gapWord = remainingAnswer.substring(0, partIndex).trim().replace(/[.,!?]$/g, '');
                    if (gapWord) {
                        targetWords.push(gapWord);
                    }
                }

                if (partIndex >= 0) {
                    // Move past this part in the answer
                    remainingAnswer = remainingAnswer.substring(partIndex + part.length).trim();
                }
            }
        }

        // If there's remaining text, it's the last gap word
        if (remainingAnswer.trim()) {
            targetWords.push(remainingAnswer.trim().replace(/[.,!?]$/g, ''));
        }

        // Validate we got the right number of words
        if (targetWords.length !== numGaps) {
            console.warn(`Expected ${numGaps} gaps but found ${targetWords.length} words:`, targetWords);
        }

        return targetWords;
    }, [currentTemplate, currentAnswer]);

    // Generate scrambled letters from all target words
    useEffect(() => {
        if (getTargetWords.length === 0) return;

        // Combine all letters from all target words (remove spaces, keep original case)
        const allLetters = getTargetWords
            .join('')
            .replace(/\s+/g, '')
            .split('');

        // Shuffle the letters
        const shuffled = [...allLetters].sort(() => Math.random() - 0.5);

        const lettersWithIds = shuffled.map((letter, idx) => ({
            id: `${currentIndex}-${idx}`,
            letter,
            used: false
        }));

        setAvailableLetters(lettersWithIds);
        setSelectedLetters({});
        setActiveGap(0);
        setFeedback(null);
    }, [currentIndex, getTargetWords]);

    const gapCount = useMemo(() => {
        return (currentTemplate.match(/_{3,}/g) || []).length;
    }, [currentTemplate]);

    // Handle letter click - add to active gap
    const handleLetterClick = (letterObj) => {
        if (letterObj.used) return;

        // Check if gap is already full
        const targetWord = getTargetWords[activeGap] || '';
        const maxLetters = targetWord.replace(/\s+/g, '').length;
        const currentLetters = (selectedLetters[activeGap] || []).length;

        if (currentLetters >= maxLetters) return; // Gap is full

        setSelectedLetters(prev => ({
            ...prev,
            [activeGap]: [...(prev[activeGap] || []), letterObj]
        }));

        setAvailableLetters(prev =>
            prev.map(l => l.id === letterObj.id ? { ...l, used: true } : l)
        );
    };

    // Handle removing a letter from a gap
    const handleRemoveLetter = (letterObj, gapIndex) => {
        setSelectedLetters(prev => ({
            ...prev,
            [gapIndex]: (prev[gapIndex] || []).filter(l => l.id !== letterObj.id)
        }));

        setAvailableLetters(prev =>
            prev.map(l => l.id === letterObj.id ? { ...l, used: false } : l)
        );
    };

    // Handle clicking on a gap to select it
    const handleGapClick = (gapIndex) => {
        setActiveGap(gapIndex);
    };

    const checkAnswers = () => {
        const userWords = [];
        for (let i = 0; i < gapCount; i++) {
            const letters = selectedLetters[i] || [];
            userWords.push(letters.map(l => l.letter).join('').toLowerCase());
        }

        // Compare without spaces
        const targetLower = getTargetWords.map(w => w.toLowerCase().replace(/\s+/g, ''));

        let correctCount = 0;
        userWords.forEach((word, idx) => {
            if (word === targetLower[idx]) correctCount++;
        });

        const allCorrect = correctCount === gapCount && gapCount > 0;

        if (allCorrect) {
            const points = 10 + (combo * 2);
            setScore(prev => prev + points);
            setCombo(prev => prev + 1);
            setFeedback({ type: 'success', message: `Perfect! +${points} points` });
            setCompletedPhrases(prev => [...prev, currentIndex]);

            setTimeout(() => {
                if (currentIndex < templates.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    handleComplete();
                }
            }, 1500);
        } else {
            setCombo(0);
            setFeedback({
                type: 'error',
                message: `Not quite right. ${correctCount}/${gapCount} correct`,
                correctWords: getTargetWords
            });
        }

        if (onProgress) {
            onProgress({ correct: allCorrect, score });
        }
    };

    const handleComplete = () => {
        setCompleted(true);

        if (onComplete) {
            onComplete({
                score,
                totalPhrases: templates.length,
                hintsUsed: hintsUsed.length
            });
        }

        window.dispatchEvent(new CustomEvent('xp-awarded', {
            detail: { xp_amount: score + 50, reason: 'word_builder_complete' }
        }));
    };

    const handleReset = () => {
        setSelectedLetters({});
        setAvailableLetters(prev => prev.map(l => ({ ...l, used: false })));
        setFeedback(null);
    };

    const useHint = (gapIndex) => {
        if (hintsUsed.includes(`${currentIndex}-${gapIndex}`)) return;

        const targetWord = getTargetWords[gapIndex];
        if (!targetWord) return;

        const firstLetter = targetWord.replace(/\s+/g, '')[0]?.toUpperCase();
        if (!firstLetter) return;

        const letterObj = availableLetters.find(l => !l.used && l.letter === firstLetter);
        if (letterObj) {
            setActiveGap(gapIndex);
            setTimeout(() => handleLetterClick(letterObj), 100);
        }

        setHintsUsed(prev => [...prev, `${currentIndex}-${gapIndex}`]);
        setScore(prev => Math.max(0, prev - 5));
    };

    // Render template with clickable gaps
    const renderTemplate = () => {
        const cleanTemplate = currentTemplate.replace(/^\d+\.\s*/, '');
        const parts = cleanTemplate.split(/_{3,}/);

        // Create word structure visualization (shows spaces between words)
        const getWordStructure = (gapIdx) => {
            const targetWord = getTargetWords[gapIdx];
            if (!targetWord) return null;

            // Split by spaces to show word boundaries
            const words = targetWord.split(/\s+/);
            return words.map((word, wIdx) => (
                <React.Fragment key={wIdx}>
                    {wIdx > 0 && <Box className="word-space">•</Box>}
                    <Box className="word-slots">
                        {word.split('').map((_, lIdx) => (
                            <Box key={lIdx} className="letter-slot">_</Box>
                        ))}
                    </Box>
                </React.Fragment>
            ));
        };

        return (
            <Box className="template-display">
                {parts.map((part, idx) => (
                    <React.Fragment key={idx}>
                        <Typography component="span" className="template-part">
                            {part}
                        </Typography>
                        {idx < parts.length - 1 && (
                            <Box
                                className={`gap-slot ${activeGap === idx ? 'active' : ''}`}
                                onClick={() => handleGapClick(idx)}
                            >
                                {(selectedLetters[idx] || []).length > 0 ? (
                                    <Box className="placed-letters-row">
                                        {(() => {
                                            const targetWord = getTargetWords[idx] || '';
                                            const words = targetWord.split(/\s+/);
                                            const letterPositions = []; // positions where spaces should appear
                                            let pos = 0;
                                            words.forEach((word, wIdx) => {
                                                pos += word.length;
                                                if (wIdx < words.length - 1) {
                                                    letterPositions.push(pos);
                                                }
                                            });

                                            const letters = selectedLetters[idx] || [];
                                            return letters.map((letterObj, lIdx) => (
                                                <React.Fragment key={letterObj.id}>
                                                    <Box
                                                        className="placed-letter"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveLetter(letterObj, idx);
                                                        }}
                                                    >
                                                        {letterObj.letter}
                                                    </Box>
                                                    {letterPositions.includes(lIdx + 1) && (
                                                        <Box className="auto-space" />
                                                    )}
                                                </React.Fragment>
                                            ));
                                        })()}
                                    </Box>
                                ) : (
                                    <Box className="word-structure">
                                        {getWordStructure(idx)}
                                    </Box>
                                )}
                                <Tooltip title="Get hint (-5 pts)">
                                    <IconButton
                                        size="small"
                                        className="hint-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            useHint(idx);
                                        }}
                                        disabled={hintsUsed.includes(`${currentIndex}-${idx}`)}
                                    >
                                        <LightbulbIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </React.Fragment>
                ))}
            </Box>
        );
    };

    if (completed) {
        return (
            <Box className="word-builder complete">
                <Paper className="complete-card" elevation={5}>
                    <EmojiEventsIcon className="trophy-icon" />
                    <Typography variant="h4">Well Done!</Typography>
                    <Typography variant="body1">
                        You completed all {templates.length} phrases!
                    </Typography>
                    <Box className="stats">
                        <Chip icon={<StarIcon />} label={`Score: ${score}`} color="primary" />
                        <Chip label={`Hints: ${hintsUsed.length}`} variant="outlined" />
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            setCompleted(false);
                            setCurrentIndex(0);
                            setScore(0);
                            setCombo(0);
                            setHintsUsed([]);
                            setCompletedPhrases([]);
                        }}
                    >
                        Play Again
                    </Button>
                </Paper>
            </Box>
        );
    }

    if (templates.length === 0) {
        return (
            <Box className="word-builder error">
                <Typography>No templates available for this exercise.</Typography>
            </Box>
        );
    }

    return (
        <Box className="word-builder">
            {/* Header */}
            <Paper className="wb-header" elevation={2}>
                <Box className="header-left">
                    <Typography variant="h6">Word Builder</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {exercise?.instruction || 'Arrange letters to fill the gaps'}
                    </Typography>
                </Box>
                <Box className="header-right">
                    <Chip icon={<StarIcon />} label={`${score}`} color="primary" />
                    {combo > 1 && (
                        <Chip label={`${combo}x Combo`} color="warning" size="small" />
                    )}
                </Box>
            </Paper>

            {/* Progress */}
            <Box className="progress-bar">
                {templates.map((_, idx) => (
                    <Box
                        key={idx}
                        className={`progress-dot ${idx === currentIndex ? 'active' : ''} ${completedPhrases.includes(idx) ? 'completed' : ''}`}
                    />
                ))}
            </Box>

            {/* Main Game Area */}
            <Paper className="game-area" elevation={3}>
                {/* Template with gaps */}
                <Box className="phrase-section">
                    <Typography variant="overline" color="textSecondary">
                        Phrase {currentIndex + 1} of {templates.length}
                    </Typography>
                    {renderTemplate()}
                </Box>

                {/* Active Gap Indicator */}
                <Box className="active-gap-indicator">
                    <Typography variant="body2">
                        Click on a gap to select it, then click letters to fill it
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        <strong>Filling: Gap {activeGap + 1}</strong>
                        {getTargetWords[activeGap] && (
                            <span> ({getTargetWords[activeGap].replace(/\s/g, '').length} letters needed)</span>
                        )}
                    </Typography>
                </Box>

                {/* Available Letters */}
                <Box className="letters-section">
                    <Typography variant="overline" color="textSecondary">
                        Available Letters
                    </Typography>
                    <Box className="letter-pool">
                        {availableLetters.map((letterObj) => (
                            <Chip
                                key={letterObj.id}
                                label={letterObj.letter}
                                className={`letter-block ${letterObj.used ? 'used' : ''}`}
                                onClick={() => handleLetterClick(letterObj)}
                                disabled={letterObj.used}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Feedback */}
                {feedback && (
                    <Box className={`feedback ${feedback.type}`}>
                        <Typography variant="body1">{feedback.message}</Typography>
                        {feedback.correctWords && (
                            <Typography variant="caption">
                                Correct: {feedback.correctWords.map((w, i) => `Gap ${i + 1}: "${w}"`).join(' | ')}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Actions */}
                <Box className="actions">
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={checkAnswers}
                        disabled={Object.keys(selectedLetters).length === 0}
                    >
                        Check Answer
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
