/**
 * Rhythm Matcher Component
 * Audio-Visual Matching game for listening_drag_drop exercises
 * Features: Card flip animation, Audio playback on hover, Combo counter
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Paper, Typography, Button, Chip, IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import './RhythmMatcher.css';

export default function RhythmMatcher({ exercise, onComplete, onProgress }) {
    const [audioPlayed, setAudioPlayed] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [matches, setMatches] = useState({});
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [shuffledTerms, setShuffledTerms] = useState([]);
    const [shuffledDefinitions, setShuffledDefinitions] = useState([]);
    const [flippedCards, setFlippedCards] = useState(new Set());
    const [wrongMatch, setWrongMatch] = useState(null);

    const audioRef = useRef(null);
    const pairs = exercise?.pairs || [];
    const guidedQuestions = exercise?.guided_questions || [];

    // Shuffle arrays on mount
    useEffect(() => {
        if (pairs.length > 0) {
            const terms = pairs.map(p => p.term);
            const definitions = pairs.map(p => p.definition);
            setShuffledTerms(shuffleArray([...terms]));
            setShuffledDefinitions(shuffleArray([...definitions]));
        }
    }, [pairs]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const handlePlayAudio = useCallback(() => {
        if (!exercise?.audio_script) return;

        setAudioPlaying(true);

        // Use speech synthesis or audio API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(exercise.audio_script);
            utterance.rate = 0.9;
            utterance.onend = () => {
                setAudioPlaying(false);
                setAudioPlayed(true);
            };
            speechSynthesis.speak(utterance);
        } else {
            // Fallback - just mark as played after a delay
            setTimeout(() => {
                setAudioPlaying(false);
                setAudioPlayed(true);
            }, 3000);
        }
    }, [exercise?.audio_script]);

    const startGame = () => {
        setGameStarted(true);
        setMatches({});
        setScore(0);
        setCombo(0);
        setSelectedTerm(null);
        setFlippedCards(new Set());
    };

    const handleTermClick = (term) => {
        if (matches[term]) return; // Already matched

        setSelectedTerm(term);
        setFlippedCards(prev => new Set([...prev, `term-${term}`]));

        // Vibration feedback
        if (navigator.vibrate) navigator.vibrate(30);
    };

    const handleDefinitionClick = (definition) => {
        if (!selectedTerm) return;

        // Find the correct pair
        const correctPair = pairs.find(p => p.term === selectedTerm);
        const isCorrect = correctPair?.definition === definition;

        setFlippedCards(prev => new Set([...prev, `def-${definition}`]));

        if (isCorrect) {
            // Correct match!
            const newCombo = combo + 1;
            const points = 10 + (newCombo * 5);

            setMatches(prev => ({ ...prev, [selectedTerm]: definition }));
            setScore(prev => prev + points);
            setCombo(newCombo);
            setFeedback({ type: 'success', message: `+${points} points!`, combo: newCombo });

            // Vibration
            if (navigator.vibrate) navigator.vibrate([50, 30, 50]);

            // Check if game complete
            const newMatchCount = Object.keys(matches).length + 1;
            if (newMatchCount === pairs.length) {
                setTimeout(() => {
                    const finalScore = score + points;
                    if (onComplete) {
                        onComplete({
                            score: finalScore,
                            correctCount: pairs.length,
                            totalCount: pairs.length,
                            isPerfect: true
                        });
                    }
                }, 1000);
            }

            if (onProgress) {
                onProgress({ correct: true, points });
            }
        } else {
            // Wrong match
            setCombo(0);
            setWrongMatch({ term: selectedTerm, definition });
            setFeedback({ type: 'error', message: 'Not a match!' });

            // Shake animation
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

            // Remove from flipped after animation
            setTimeout(() => {
                setFlippedCards(prev => {
                    const next = new Set(prev);
                    next.delete(`term-${selectedTerm}`);
                    next.delete(`def-${definition}`);
                    return next;
                });
                setWrongMatch(null);
            }, 800);

            if (onProgress) {
                onProgress({ correct: false });
            }
        }

        setTimeout(() => {
            setFeedback(null);
            setSelectedTerm(null);
        }, 800);
    };

    const isTermMatched = (term) => !!matches[term];
    const isDefinitionMatched = (definition) => Object.values(matches).includes(definition);
    const allMatched = Object.keys(matches).length === pairs.length;

    // Render audio instruction screen
    if (!audioPlayed && exercise?.audio_script) {
        return (
            <Box className="rhythm-matcher">
                <Paper className="audio-instruction" elevation={4}>
                    <VolumeUpIcon className="audio-icon" />
                    <Typography variant="h5" gutterBottom>
                        Listen First!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Listen to the audio carefully before matching the cards.
                    </Typography>

                    <Box className="audio-script-preview">
                        <Typography variant="caption" color="text.secondary">
                            Audio content preview:
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                            "{exercise.audio_script.substring(0, 100)}..."
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={audioPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        onClick={handlePlayAudio}
                        disabled={audioPlaying}
                        className="play-audio-btn"
                    >
                        {audioPlaying ? 'Playing...' : 'Play Audio'}
                    </Button>

                    {audioPlaying && (
                        <Box className="audio-wave">
                            {[...Array(5)].map((_, i) => (
                                <Box key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </Box>
                    )}
                </Paper>
            </Box>
        );
    }

    // Render start game screen
    if (!gameStarted) {
        return (
            <Box className="rhythm-matcher">
                <Paper className="start-screen" elevation={4}>
                    <Typography variant="h4" gutterBottom>
                        Rhythm Matcher
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {exercise?.instruction || 'Match the terms with their definitions!'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        {pairs.length} pairs to match
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={startGame}
                        startIcon={<PlayArrowIcon />}
                    >
                        Start Matching
                    </Button>
                </Paper>
            </Box>
        );
    }

    // Victory screen
    if (allMatched) {
        return (
            <Box className="rhythm-matcher victory">
                <Paper className="victory-card" elevation={5}>
                    <EmojiEventsIcon className="trophy-icon" />
                    <Typography variant="h3">Perfect Match!</Typography>
                    <Typography variant="h5" sx={{ mt: 2 }}>Score: {score}</Typography>
                    <Box className="stats" sx={{ mt: 2 }}>
                        <Chip icon={<StarIcon />} label={`${pairs.length}/${pairs.length} Matched`} color="success" />
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            setGameStarted(false);
                            setMatches({});
                            setScore(0);
                            setCombo(0);
                            setShuffledTerms(shuffleArray(pairs.map(p => p.term)));
                            setShuffledDefinitions(shuffleArray(pairs.map(p => p.definition)));
                        }}
                        startIcon={<ReplayIcon />}
                        sx={{ mt: 3 }}
                    >
                        Play Again
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box className="rhythm-matcher">
            {/* Header */}
            <Paper className="game-header" elevation={2}>
                <Box className="header-left">
                    <Typography variant="h6">Rhythm Matcher</Typography>
                    <Typography variant="caption">{exercise?.instruction}</Typography>
                </Box>
                <Box className="header-right">
                    <Chip icon={<StarIcon />} label={score} color="primary" />
                    {combo > 1 && (
                        <Chip
                            icon={<LocalFireDepartmentIcon />}
                            label={`${combo}x Combo`}
                            color="warning"
                            className="combo-chip"
                        />
                    )}
                    <Chip
                        label={`${Object.keys(matches).length}/${pairs.length}`}
                        variant="outlined"
                    />
                </Box>
            </Paper>

            {/* Feedback popup */}
            {feedback && (
                <Box className={`feedback-popup ${feedback.type}`}>
                    <Typography variant="h6">{feedback.message}</Typography>
                </Box>
            )}

            {/* Game Board */}
            <Box className="game-board">
                {/* Terms Column */}
                <Box className="cards-column terms">
                    <Typography variant="subtitle2" className="column-title">Terms</Typography>
                    {shuffledTerms.map((term, index) => {
                        const isMatched = isTermMatched(term);
                        const isSelected = selectedTerm === term;
                        const isWrong = wrongMatch?.term === term;

                        return (
                            <Paper
                                key={`term-${index}`}
                                className={`card term-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${isWrong ? 'wrong' : ''}`}
                                onClick={() => !isMatched && handleTermClick(term)}
                                elevation={isSelected ? 6 : 2}
                            >
                                <Typography variant="body1" className="card-text">
                                    {term}
                                </Typography>
                                {isMatched && <CheckCircleIcon className="match-icon" />}
                            </Paper>
                        );
                    })}
                </Box>

                {/* Definitions Column */}
                <Box className="cards-column definitions">
                    <Typography variant="subtitle2" className="column-title">Definitions</Typography>
                    {shuffledDefinitions.map((definition, index) => {
                        const isMatched = isDefinitionMatched(definition);
                        const isWrong = wrongMatch?.definition === definition;

                        return (
                            <Paper
                                key={`def-${index}`}
                                className={`card definition-card ${isMatched ? 'matched' : ''} ${isWrong ? 'wrong' : ''} ${selectedTerm && !isMatched ? 'clickable' : ''}`}
                                onClick={() => !isMatched && selectedTerm && handleDefinitionClick(definition)}
                                elevation={2}
                            >
                                <Typography variant="body2" className="card-text">
                                    {definition}
                                </Typography>
                                {isMatched && <CheckCircleIcon className="match-icon" />}
                            </Paper>
                        );
                    })}
                </Box>
            </Box>

            {/* Instructions */}
            <Paper className="instructions-bar" elevation={1}>
                <Typography variant="body2" color="text.secondary">
                    {selectedTerm
                        ? `Selected: "${selectedTerm}" - Now click its matching definition`
                        : 'Click a term on the left to select it, then click its matching definition on the right'}
                </Typography>
            </Paper>
        </Box>
    );
}
