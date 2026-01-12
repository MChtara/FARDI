/**
 * Sentence Builder Game
 * Players drag word chips into sentence template gaps
 * Words are extracted from correct answers
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Paper, Typography, Button, Chip, IconButton, Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './SentenceBuilder.css';

export default function SentenceBuilder({ exercise, onComplete, onProgress }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedWords, setSelectedWords] = useState({});
    const [availableWords, setAvailableWords] = useState([]);
    const [activeGap, setActiveGap] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [completedSentences, setCompletedSentences] = useState([]);

    const templates = exercise?.templates || [];
    const correctAnswers = exercise?.correct_answers || [];
    const currentTemplate = templates[currentIndex] || '';
    const currentAnswer = correctAnswers[currentIndex] || '';

    // Extract target words from correct answer
    const getTargetWords = useMemo(() => {
        if (!currentAnswer || !currentTemplate) return [];

        const cleanAnswer = currentAnswer.replace(/^\d+\.\s*/, '').trim();
        const cleanTemplate = currentTemplate.replace(/^\d+\.\s*/, '').trim();

        const gapMatches = cleanTemplate.match(/_{3,}/g) || [];
        const numGaps = gapMatches.length;

        if (numGaps === 0) return [];

        const templateParts = cleanTemplate.split(/_{3,}/);
        const targetWords = [];
        let remainingAnswer = cleanAnswer;

        for (let i = 0; i < templateParts.length; i++) {
            const part = templateParts[i].trim();

            if (part) {
                const partIndex = remainingAnswer.toLowerCase().indexOf(part.toLowerCase());

                if (partIndex > 0) {
                    const gapWord = remainingAnswer.substring(0, partIndex).trim().replace(/[.,!?]$/g, '');
                    if (gapWord) {
                        targetWords.push(gapWord);
                    }
                }

                if (partIndex >= 0) {
                    remainingAnswer = remainingAnswer.substring(partIndex + part.length).trim();
                }
            }
        }

        if (remainingAnswer.trim()) {
            targetWords.push(remainingAnswer.trim().replace(/[.,!?]$/g, ''));
        }

        return targetWords;
    }, [currentTemplate, currentAnswer]);

    // Generate word bank from target words + some distractors
    useEffect(() => {
        if (getTargetWords.length === 0) return;

        // Add all target words
        const words = [...getTargetWords];

        // Add some distractor words based on context
        const distractors = ['they', 'we', 'and', 'the', 'for', 'with', 'very', 'also'];
        const numDistractors = Math.min(3, distractors.length);

        for (let i = 0; i < numDistractors; i++) {
            const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
            if (!words.includes(randomDistractor)) {
                words.push(randomDistractor);
            }
        }

        // Shuffle the words
        const shuffled = [...words].sort(() => Math.random() - 0.5);

        const wordsWithIds = shuffled.map((word, idx) => ({
            id: `${currentIndex}-${idx}`,
            word,
            used: false
        }));

        setAvailableWords(wordsWithIds);
        setSelectedWords({});
        setActiveGap(0);
        setFeedback(null);
    }, [currentIndex, getTargetWords]);

    const gapCount = useMemo(() => {
        return (currentTemplate.match(/_{3,}/g) || []).length;
    }, [currentTemplate]);

    // Handle word click - add to active gap
    const handleWordClick = (wordObj) => {
        if (wordObj.used) return;

        // Check if gap already has a word
        if (selectedWords[activeGap]) return;

        setSelectedWords(prev => ({
            ...prev,
            [activeGap]: wordObj
        }));

        setAvailableWords(prev =>
            prev.map(w => w.id === wordObj.id ? { ...w, used: true } : w)
        );

        // Auto-move to next empty gap
        for (let i = 0; i < gapCount; i++) {
            const nextGap = (activeGap + 1 + i) % gapCount;
            if (!selectedWords[nextGap] && nextGap !== activeGap) {
                setActiveGap(nextGap);
                break;
            }
        }
    };

    // Handle removing a word from a gap
    const handleRemoveWord = (gapIndex) => {
        const wordObj = selectedWords[gapIndex];
        if (!wordObj) return;

        setSelectedWords(prev => {
            const newSelected = { ...prev };
            delete newSelected[gapIndex];
            return newSelected;
        });

        setAvailableWords(prev =>
            prev.map(w => w.id === wordObj.id ? { ...w, used: false } : w)
        );
    };

    const checkAnswers = () => {
        const userWords = [];
        for (let i = 0; i < gapCount; i++) {
            const wordObj = selectedWords[i];
            userWords.push(wordObj ? wordObj.word.toLowerCase() : '');
        }

        const targetLower = getTargetWords.map(w => w.toLowerCase());

        let correctCount = 0;
        userWords.forEach((word, idx) => {
            if (word === targetLower[idx]) correctCount++;
        });

        const allCorrect = correctCount === gapCount && gapCount > 0;

        if (allCorrect) {
            const points = 15;
            setScore(prev => prev + points);
            setFeedback({ type: 'success', message: `Perfect! +${points} points` });
            setCompletedSentences(prev => [...prev, currentIndex]);

            setTimeout(() => {
                if (currentIndex < templates.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    handleComplete();
                }
            }, 1500);
        } else {
            setFeedback({
                type: 'error',
                message: `${correctCount}/${gapCount} correct. Try again!`,
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
                totalSentences: templates.length
            });
        }

        window.dispatchEvent(new CustomEvent('xp-awarded', {
            detail: { xp_amount: score + 50, reason: 'sentence_builder_complete' }
        }));
    };

    const handleReset = () => {
        setSelectedWords({});
        setAvailableWords(prev => prev.map(w => ({ ...w, used: false })));
        setFeedback(null);
        setActiveGap(0);
    };

    // Render template with gaps
    const renderTemplate = () => {
        const cleanTemplate = currentTemplate.replace(/^\d+\.\s*/, '');
        const parts = cleanTemplate.split(/_{3,}/);

        return (
            <Box className="sentence-template">
                {parts.map((part, idx) => (
                    <React.Fragment key={idx}>
                        <Typography component="span" className="template-text">
                            {part}
                        </Typography>
                        {idx < parts.length - 1 && (
                            <Box
                                className={`word-slot ${activeGap === idx ? 'active' : ''} ${selectedWords[idx] ? 'filled' : ''}`}
                                onClick={() => {
                                    if (selectedWords[idx]) {
                                        handleRemoveWord(idx);
                                    } else {
                                        setActiveGap(idx);
                                    }
                                }}
                            >
                                {selectedWords[idx] ? (
                                    <Chip
                                        label={selectedWords[idx].word}
                                        className="placed-word"
                                        onDelete={() => handleRemoveWord(idx)}
                                        size="small"
                                    />
                                ) : (
                                    <span className="slot-placeholder">
                                        {getTargetWords[idx] ? `(${idx + 1})` : '___'}
                                    </span>
                                )}
                            </Box>
                        )}
                    </React.Fragment>
                ))}
            </Box>
        );
    };

    if (completed) {
        return (
            <Box className="sentence-builder complete">
                <Paper className="complete-card" elevation={5}>
                    <EmojiEventsIcon className="trophy-icon" />
                    <Typography variant="h4">Excellent!</Typography>
                    <Typography variant="body1">
                        You completed all {templates.length} sentences!
                    </Typography>
                    <Box className="stats">
                        <Chip icon={<StarIcon />} label={`Score: ${score}`} color="primary" />
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            setCompleted(false);
                            setCurrentIndex(0);
                            setScore(0);
                            setCompletedSentences([]);
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
            <Box className="sentence-builder error">
                <Typography>No templates available for this exercise.</Typography>
            </Box>
        );
    }

    return (
        <Box className="sentence-builder">
            {/* Header */}
            <Paper className="sb-header" elevation={2}>
                <Box className="header-left">
                    <Typography variant="h6">Sentence Builder</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {exercise?.instruction || 'Complete the sentences with the right words'}
                    </Typography>
                </Box>
                <Box className="header-right">
                    <Chip icon={<StarIcon />} label={`${score}`} color="primary" />
                </Box>
            </Paper>

            {/* Progress */}
            <Box className="progress-bar">
                {templates.map((_, idx) => (
                    <Box
                        key={idx}
                        className={`progress-dot ${idx === currentIndex ? 'active' : ''} ${completedSentences.includes(idx) ? 'completed' : ''}`}
                    />
                ))}
            </Box>

            {/* Main Game Area */}
            <Paper className="game-area" elevation={3}>
                {/* Sentence number */}
                <Typography variant="overline" color="textSecondary">
                    Sentence {currentIndex + 1} of {templates.length}
                </Typography>

                {/* Template */}
                <Box className="template-section">
                    {renderTemplate()}
                </Box>

                {/* Active gap indicator */}
                <Box className="gap-indicator">
                    <Typography variant="body2" color="primary">
                        Filling gap <strong>{activeGap + 1}</strong> of {gapCount}
                    </Typography>
                </Box>

                {/* Word Bank */}
                <Box className="word-bank">
                    <Typography variant="overline" color="textSecondary">
                        Word Bank - Click a word to place it
                    </Typography>
                    <Box className="words-container">
                        {availableWords.map((wordObj) => (
                            <Chip
                                key={wordObj.id}
                                label={wordObj.word}
                                className={`word-chip ${wordObj.used ? 'used' : ''}`}
                                onClick={() => handleWordClick(wordObj)}
                                disabled={wordObj.used}
                                variant={wordObj.used ? 'outlined' : 'filled'}
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
                                Correct: {feedback.correctWords.join(' | ')}
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
                        endIcon={<CheckCircleIcon />}
                        onClick={checkAnswers}
                        disabled={Object.keys(selectedWords).length < gapCount}
                    >
                        Check Sentence
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
