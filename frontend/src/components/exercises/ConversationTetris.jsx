/**
 * Conversation Tetris Game
 * Arcade-style word catching game
 * Shows dialogue templates with gaps, words fall to fill each gap
 */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    Box, Paper, Typography, Button, Chip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import './ConversationTetris.css';

export default function ConversationTetris({ exercise, onComplete, onProgress }) {
    const [gameState, setGameState] = useState('ready'); // ready, playing, paused, won, lost
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentGapIndex, setCurrentGapIndex] = useState(0);
    const [filledGaps, setFilledGaps] = useState({});
    const [fallingWords, setFallingWords] = useState([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [combo, setCombo] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [speed, setSpeed] = useState(1);

    const gameAreaRef = useRef(null);
    const animationRef = useRef(null);
    const lastTimeRef = useRef(0);
    const wordIdRef = useRef(0);
    const spawnTimerRef = useRef(null);

    const dialogueLines = exercise?.dialogue_lines || [];
    const wordBank = exercise?.word_bank || [];
    const correctAnswers = exercise?.correct_answers || [];

    // Get user lines (lines with templates/gaps)
    const userLines = useMemo(() => {
        return dialogueLines.filter(line => line.template);
    }, [dialogueLines]);

    // Current line being filled
    const currentLine = userLines[currentLineIndex];

    // Parse gaps from template
    const currentGaps = useMemo(() => {
        if (!currentLine?.template) return [];
        const gaps = [];
        const parts = currentLine.template.split(/_{3,}/);
        // Number of gaps = parts.length - 1
        for (let i = 0; i < parts.length - 1; i++) {
            gaps.push({ index: i, filled: false });
        }
        return gaps;
    }, [currentLine]);

    // Get target words for current line from correct_answers
    const getTargetWords = useMemo(() => {
        const currentAnswer = correctAnswers[currentLineIndex];
        if (!currentLine?.template || !currentAnswer || typeof currentAnswer !== 'string') return [];

        const template = currentLine.template;
        const answer = currentAnswer.replace(/^\d+\.\s*/, '');

        // Split template by gaps
        const templateParts = template.split(/_{3,}/);
        const targetWords = [];
        let remainingAnswer = answer;

        for (let i = 0; i < templateParts.length; i++) {
            const part = templateParts[i].trim();

            if (part) {
                const partIndex = remainingAnswer.toLowerCase().indexOf(part.toLowerCase());

                if (partIndex > 0) {
                    const gapWord = remainingAnswer.substring(0, partIndex).trim();
                    if (gapWord) targetWords.push(gapWord);
                }

                if (partIndex >= 0) {
                    remainingAnswer = remainingAnswer.substring(partIndex + part.length).trim();
                }
            }
        }

        if (remainingAnswer.trim()) {
            targetWords.push(remainingAnswer.trim());
        }

        return targetWords;
    }, [currentLine, correctAnswers, currentLineIndex]);

    // Current target word
    const currentTargetWord = getTargetWords[currentGapIndex];

    // Spawn a new falling word
    const spawnWord = useCallback(() => {
        if (gameState !== 'playing' || !currentTargetWord) return;

        const gameArea = gameAreaRef.current;
        if (!gameArea) return;

        // 35% correct word, 65% from word bank (distractors)
        const isCorrect = Math.random() < 0.35;
        let word;

        if (isCorrect) {
            word = currentTargetWord;
        } else {
            // Pick random word from word bank
            const distractors = wordBank.filter(w => w.toLowerCase() !== currentTargetWord?.toLowerCase());
            if (distractors.length > 0) {
                word = distractors[Math.floor(Math.random() * distractors.length)];
            } else {
                word = currentTargetWord; // Fallback to correct if no distractors
            }
        }

        const areaWidth = gameArea.offsetWidth;
        const wordWidth = Math.min(150, word.length * 12 + 30);
        const maxX = areaWidth - wordWidth - 20;

        const newWord = {
            id: wordIdRef.current++,
            text: word,
            x: Math.max(10, Math.random() * maxX),
            y: -60,
            isCorrect: word.toLowerCase() === currentTargetWord?.toLowerCase(),
            speed: 0.8 + (speed * 0.3) + Math.random() * 0.4
        };

        setFallingWords(prev => [...prev, newWord]);
    }, [gameState, currentTargetWord, wordBank, speed]);

    // Game loop
    const gameLoop = useCallback((timestamp) => {
        if (gameState !== 'playing') return;

        const deltaTime = timestamp - lastTimeRef.current;
        lastTimeRef.current = timestamp;

        setFallingWords(prev => {
            const gameArea = gameAreaRef.current;
            const areaHeight = gameArea?.offsetHeight || 350;

            return prev
                .map(word => ({
                    ...word,
                    y: word.y + word.speed * (deltaTime / 16)
                }))
                .filter(word => {
                    if (word.y > areaHeight + 50) {
                        if (word.isCorrect) {
                            setLives(l => {
                                const newLives = l - 1;
                                if (newLives <= 0) {
                                    setGameState('lost');
                                }
                                return newLives;
                            });
                            setCombo(0);
                            triggerVibration(100);
                            setFeedback({ type: 'miss', message: 'Missed!' });
                            setTimeout(() => setFeedback(null), 800);
                        }
                        return false;
                    }
                    return true;
                });
        });

        animationRef.current = requestAnimationFrame(gameLoop);
    }, [gameState]);

    // Start game loop
    useEffect(() => {
        if (gameState === 'playing') {
            lastTimeRef.current = performance.now();
            animationRef.current = requestAnimationFrame(gameLoop);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [gameState, gameLoop]);

    // Spawn words periodically
    useEffect(() => {
        if (gameState !== 'playing') {
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
            return;
        }

        spawnTimerRef.current = setInterval(() => {
            spawnWord();
        }, Math.max(700, 1800 - (speed * 150)));

        return () => {
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        };
    }, [gameState, speed, spawnWord]);

    // Handle word click
    const handleWordClick = (word) => {
        if (gameState !== 'playing') return;

        setFallingWords(prev => prev.filter(w => w.id !== word.id));

        if (word.isCorrect) {
            const points = 10 + (combo * 5);
            setScore(s => s + points);
            setCombo(c => c + 1);

            // Fill the current gap
            setFilledGaps(prev => ({
                ...prev,
                [`${currentLineIndex}-${currentGapIndex}`]: word.text
            }));

            setFeedback({ type: 'correct', message: `+${points}` });
            triggerVibration(50);

            // Move to next gap or next line
            if (currentGapIndex < currentGaps.length - 1) {
                setTimeout(() => {
                    setCurrentGapIndex(i => i + 1);
                    setFallingWords([]); // Clear falling words for new gap
                }, 400);
            } else if (currentLineIndex < userLines.length - 1) {
                setTimeout(() => {
                    setCurrentLineIndex(i => i + 1);
                    setCurrentGapIndex(0);
                    setFallingWords([]);
                    setSpeed(s => Math.min(s + 0.2, 2.5));
                }, 600);
            } else {
                // Victory!
                setTimeout(() => {
                    setGameState('won');
                    if (onComplete) {
                        onComplete({ score: score + points, lives });
                    }
                }, 500);
            }

            setTimeout(() => setFeedback(null), 500);
        } else {
            setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) {
                    setGameState('lost');
                }
                return newLives;
            });
            setCombo(0);
            setFeedback({ type: 'wrong', message: 'Wrong!' });
            triggerVibration(200);

            const gameArea = gameAreaRef.current;
            if (gameArea) {
                gameArea.classList.add('shake');
                setTimeout(() => gameArea.classList.remove('shake'), 300);
            }

            setTimeout(() => setFeedback(null), 500);
        }
    };

    const triggerVibration = (duration) => {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    };

    const startGame = () => {
        setGameState('playing');
        setCurrentLineIndex(0);
        setCurrentGapIndex(0);
        setFilledGaps({});
        setFallingWords([]);
        setScore(0);
        setLives(3);
        setCombo(0);
        setSpeed(1);
        setFeedback(null);
    };

    const togglePause = () => {
        setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
    };

    // Render the dialogue with gaps
    const renderDialogue = () => {
        if (!currentLine) return null;

        const parts = currentLine.template.split(/_{3,}/);

        return (
            <Box className="dialogue-container">
                {/* Speaker info */}
                <Typography variant="caption" className="speaker-label">
                    {currentLine.speaker || 'You'}:
                </Typography>

                {/* Template with gaps */}
                <Box className="dialogue-template">
                    {parts.map((part, idx) => (
                        <React.Fragment key={idx}>
                            <span className="text-part">{part}</span>
                            {idx < parts.length - 1 && (
                                <span
                                    className={`gap-box ${idx === currentGapIndex ? 'active' : ''} ${filledGaps[`${currentLineIndex}-${idx}`] ? 'filled' : ''}`}
                                >
                                    {filledGaps[`${currentLineIndex}-${idx}`] || '???'}
                                </span>
                            )}
                        </React.Fragment>
                    ))}
                </Box>

                {/* Progress */}
                <Typography variant="caption" className="progress-info">
                    Line {currentLineIndex + 1}/{userLines.length} • Gap {currentGapIndex + 1}/{currentGaps.length}
                </Typography>
            </Box>
        );
    };

    // Victory screen
    if (gameState === 'won') {
        return (
            <Box className="conversation-tetris victory">
                <Paper className="victory-card" elevation={5}>
                    <EmojiEventsIcon className="trophy" />
                    <Typography variant="h3">Victory!</Typography>
                    <Typography variant="h5">Score: {score}</Typography>
                    <Box className="stats">
                        <Chip icon={<FavoriteIcon />} label={`Lives: ${lives}`} color="error" />
                    </Box>
                    <Button variant="contained" size="large" onClick={startGame}>
                        Play Again
                    </Button>
                </Paper>
            </Box>
        );
    }

    // Game over
    if (gameState === 'lost') {
        return (
            <Box className="conversation-tetris game-over">
                <Paper className="game-over-card" elevation={5}>
                    <Typography variant="h3">Game Over</Typography>
                    <Typography variant="h5">Score: {score}</Typography>
                    <Button variant="contained" size="large" onClick={startGame} startIcon={<RefreshIcon />}>
                        Try Again
                    </Button>
                </Paper>
            </Box>
        );
    }

    if (userLines.length === 0) {
        return (
            <Box className="conversation-tetris">
                <Typography>No dialogue templates found.</Typography>
            </Box>
        );
    }

    return (
        <Box className="conversation-tetris">
            {/* Header */}
            <Paper className="game-header" elevation={2}>
                <Box className="header-left">
                    <Typography variant="h6">Conversation Tetris</Typography>
                    <Typography variant="caption">
                        {exercise?.instruction || 'Catch the correct words!'}
                    </Typography>
                </Box>
                <Box className="header-right">
                    <Chip icon={<StarIcon />} label={score} color="primary" size="small" />
                    <Box className="lives">
                        {[...Array(3)].map((_, i) => (
                            <FavoriteIcon
                                key={i}
                                className={`heart ${i < lives ? 'active' : 'lost'}`}
                            />
                        ))}
                    </Box>
                    {combo > 1 && <Chip label={`${combo}x`} color="warning" size="small" />}
                </Box>
            </Paper>

            {/* Dialogue display */}
            {renderDialogue()}

            {/* Game Area */}
            <Paper className="game-area-container" elevation={3}>
                {gameState === 'ready' && (
                    <Box className="start-overlay">
                        <Typography variant="h4">Ready?</Typography>
                        <Typography variant="body1">
                            Catch the word: <strong>{currentTargetWord}</strong>
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PlayArrowIcon />}
                            onClick={startGame}
                        >
                            Start Game
                        </Button>
                    </Box>
                )}

                {gameState === 'paused' && (
                    <Box className="pause-overlay">
                        <Typography variant="h4">Paused</Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PlayArrowIcon />}
                            onClick={togglePause}
                        >
                            Resume
                        </Button>
                    </Box>
                )}

                <Box ref={gameAreaRef} className="game-area">
                    {/* Falling words */}
                    {fallingWords.map(word => (
                        <Box
                            key={word.id}
                            className="falling-word"
                            style={{
                                left: word.x,
                                top: word.y
                            }}
                            onClick={() => handleWordClick(word)}
                        >
                            {word.text}
                        </Box>
                    ))}

                    {/* Feedback popup */}
                    {feedback && (
                        <Box className={`feedback-popup ${feedback.type}`}>
                            {feedback.message}
                        </Box>
                    )}

                    {/* Target hint at bottom */}
                    <Box className="target-zone">
                        <Typography variant="body2">
                            🎯 Catch: <strong>{currentTargetWord}</strong>
                        </Typography>
                    </Box>
                </Box>

                {/* Controls */}
                {gameState === 'playing' && (
                    <Box className="game-controls">
                        <Button size="small" onClick={togglePause} startIcon={<PauseIcon />}>
                            Pause
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Word Bank Reference */}
            <Paper className="word-bank-ref" elevation={1}>
                <Typography variant="caption">Word Bank:</Typography>
                <Box className="word-bank-chips">
                    {wordBank.map((word, idx) => (
                        <Chip key={idx} label={word} size="small" variant="outlined" />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}
