/**
 * Signal Decoder Component
 * Tech/Repair themed component for listening_dialogue_gap_fill and listening_role_play
 * Features: Glitch text effects, Waveform visualizer, corrupted text repair
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Paper, Typography, TextField, Button, Chip, IconButton,
    LinearProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import StarIcon from '@mui/icons-material/Star';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import './SignalDecoder.css';

export default function SignalDecoder({ exercise, onComplete, onProgress }) {
    const [audioPlayed, setAudioPlayed] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [repairProgress, setRepairProgress] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [signalStrength, setSignalStrength] = useState(100);
    const [score, setScore] = useState(0);
    const [glitchEffect, setGlitchEffect] = useState(false);

    const inputRefs = useRef({});

    const dialogueLines = exercise?.dialogue_lines || [];
    const wordBank = exercise?.word_bank || [];
    const correctAnswers = exercise?.correct_answers || [];
    const guidedQuestions = exercise?.guided_questions || [];

    // Get user lines (lines with templates)
    const userLines = dialogueLines.filter(line => line.template);

    // Calculate repair progress
    useEffect(() => {
        const filledCount = Object.values(answers).filter(v => v && v.trim()).length;
        const totalGaps = userLines.reduce((sum, line) => {
            const gaps = (line.template?.match(/_{3,}/g) || []).length;
            return sum + gaps;
        }, 0);
        setRepairProgress(totalGaps > 0 ? (filledCount / totalGaps) * 100 : 0);
    }, [answers, userLines]);

    const handlePlayAudio = useCallback(() => {
        if (!exercise?.audio_script) return;

        setAudioPlaying(true);
        setGlitchEffect(true);

        // Simulate signal interference
        const interferenceInterval = setInterval(() => {
            setSignalStrength(prev => Math.max(20, prev - Math.random() * 30 + 15));
        }, 500);

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(exercise.audio_script);
            utterance.rate = 0.85;
            utterance.onend = () => {
                setAudioPlaying(false);
                setAudioPlayed(true);
                setGlitchEffect(false);
                setSignalStrength(100);
                clearInterval(interferenceInterval);
            };
            speechSynthesis.speak(utterance);
        } else {
            setTimeout(() => {
                setAudioPlaying(false);
                setAudioPlayed(true);
                setGlitchEffect(false);
                setSignalStrength(100);
                clearInterval(interferenceInterval);
            }, 4000);
        }
    }, [exercise?.audio_script]);

    const startGame = () => {
        setGameStarted(true);
        setCurrentLineIndex(0);
        setAnswers({});
        setScore(0);
        setFeedback(null);
    };

    const handleInputChange = (lineIndex, gapIndex, value) => {
        const key = `${lineIndex}-${gapIndex}`;
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleRepairLine = () => {
        // Validate current line's answers
        const currentLine = userLines[currentLineIndex];
        if (!currentLine) return;

        const template = currentLine.template;
        const gaps = (template.match(/_{3,}/g) || []).length;

        let correctCount = 0;
        const correctAnswer = correctAnswers[currentLineIndex];

        // Check each gap
        for (let i = 0; i < gaps; i++) {
            const userAnswer = answers[`${currentLineIndex}-${i}`]?.toLowerCase().trim();
            if (userAnswer && correctAnswer?.toLowerCase().includes(userAnswer)) {
                correctCount++;
            }
        }

        const isFullyCorrect = correctCount === gaps;
        const points = isFullyCorrect ? 20 : correctCount * 5;

        setScore(prev => prev + points);

        if (isFullyCorrect) {
            setFeedback({ type: 'success', message: `Signal repaired! +${points} points` });
            if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
        } else if (correctCount > 0) {
            setFeedback({ type: 'partial', message: `Partial repair: ${correctCount}/${gaps} gaps fixed` });
        } else {
            setFeedback({ type: 'error', message: 'Signal still corrupted...' });
            setGlitchEffect(true);
            setTimeout(() => setGlitchEffect(false), 500);
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }

        if (onProgress) {
            onProgress({ correct: isFullyCorrect, points });
        }

        // Move to next line or complete
        setTimeout(() => {
            setFeedback(null);
            if (currentLineIndex < userLines.length - 1) {
                setCurrentLineIndex(prev => prev + 1);
            } else {
                // Game complete
                if (onComplete) {
                    onComplete({
                        score,
                        correctCount: Math.round(repairProgress / 100 * userLines.length),
                        totalCount: userLines.length,
                        isPerfect: repairProgress === 100
                    });
                }
            }
        }, 1500);
    };

    // Render glitch text effect
    const renderGlitchText = (text) => {
        if (!glitchEffect) return text;

        const glitchChars = '█▓▒░╔╗╚╝║═';
        return text.split('').map((char, i) => {
            if (Math.random() > 0.7) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
        }).join('');
    };

    // Render template with inputs
    const renderTemplate = (template, lineIndex) => {
        const parts = template.split(/_{3,}/);
        const gapCount = parts.length - 1;

        return (
            <Box className="template-repair">
                {parts.map((part, idx) => (
                    <React.Fragment key={idx}>
                        <Typography
                            component="span"
                            className={`template-text ${glitchEffect ? 'glitch' : ''}`}
                        >
                            {renderGlitchText(part)}
                        </Typography>
                        {idx < gapCount && (
                            <TextField
                                inputRef={el => inputRefs.current[`${lineIndex}-${idx}`] = el}
                                size="small"
                                variant="outlined"
                                className="repair-input"
                                value={answers[`${lineIndex}-${idx}`] || ''}
                                onChange={(e) => handleInputChange(lineIndex, idx, e.target.value)}
                                placeholder="[REPAIR]"
                                autoComplete="off"
                            />
                        )}
                    </React.Fragment>
                ))}
            </Box>
        );
    };

    // Audio instruction screen
    if (!audioPlayed && exercise?.audio_script) {
        return (
            <Box className="signal-decoder">
                <Paper className="audio-screen" elevation={4}>
                    <Box className="signal-icon-container">
                        <SignalWifiStatusbar4BarIcon className={`signal-icon ${audioPlaying ? 'receiving' : ''}`} />
                        <Box className="signal-rings">
                            {[1, 2, 3].map(i => (
                                <Box key={i} className={`ring ring-${i}`} />
                            ))}
                        </Box>
                    </Box>

                    <Typography variant="h4" gutterBottom className="title">
                        Incoming Signal
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        A corrupted transmission has been detected. Listen to decode the message.
                    </Typography>

                    {/* Signal strength meter */}
                    <Box className="signal-meter">
                        <Typography variant="caption">Signal Strength</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={signalStrength}
                            className={`signal-bar ${signalStrength < 50 ? 'weak' : ''}`}
                        />
                        <Typography variant="caption">{Math.round(signalStrength)}%</Typography>
                    </Box>

                    {/* Waveform visualizer */}
                    <Box className="waveform">
                        {[...Array(20)].map((_, i) => (
                            <Box
                                key={i}
                                className={`wave-bar ${audioPlaying ? 'active' : ''}`}
                                style={{
                                    animationDelay: `${i * 0.05}s`,
                                    height: audioPlaying ? `${20 + Math.random() * 40}px` : '10px'
                                }}
                            />
                        ))}
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={audioPlaying ? <VolumeUpIcon /> : <PlayArrowIcon />}
                        onClick={handlePlayAudio}
                        disabled={audioPlaying}
                        className="receive-btn"
                    >
                        {audioPlaying ? 'Receiving...' : 'Receive Transmission'}
                    </Button>
                </Paper>
            </Box>
        );
    }

    // Start game screen
    if (!gameStarted) {
        return (
            <Box className="signal-decoder">
                <Paper className="start-screen" elevation={4}>
                    <BuildIcon className="build-icon" />
                    <Typography variant="h4" gutterBottom>
                        Signal Decoder
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {exercise?.instruction || 'Repair the corrupted transmission by filling in the missing words.'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        {userLines.length} corrupted segments to repair
                    </Typography>

                    {/* Word bank preview */}
                    {wordBank.length > 0 && (
                        <Box className="word-bank-preview">
                            <Typography variant="caption">Available repair tools:</Typography>
                            <Box className="word-chips">
                                {wordBank.map((word, i) => (
                                    <Chip key={i} label={word} size="small" variant="outlined" />
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        onClick={startGame}
                        startIcon={<BuildIcon />}
                    >
                        Begin Repair
                    </Button>
                </Paper>
            </Box>
        );
    }

    // Game complete
    if (currentLineIndex >= userLines.length) {
        return (
            <Box className="signal-decoder complete">
                <Paper className="complete-screen" elevation={5}>
                    <CheckCircleIcon className="complete-icon" />
                    <Typography variant="h3">Transmission Restored!</Typography>
                    <Typography variant="h5" sx={{ mt: 2 }}>Score: {score}</Typography>
                    <Box className="stats" sx={{ mt: 2 }}>
                        <Chip
                            icon={<StarIcon />}
                            label={`${Math.round(repairProgress)}% Repaired`}
                            color={repairProgress === 100 ? 'success' : 'primary'}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            setGameStarted(false);
                            setAudioPlayed(false);
                        }}
                        startIcon={<ReplayIcon />}
                        sx={{ mt: 3 }}
                    >
                        New Transmission
                    </Button>
                </Paper>
            </Box>
        );
    }

    const currentLine = userLines[currentLineIndex];

    return (
        <Box className="signal-decoder">
            {/* Header */}
            <Paper className="decoder-header" elevation={2}>
                <Box className="header-left">
                    <SignalWifiStatusbar4BarIcon />
                    <Typography variant="h6">Signal Decoder</Typography>
                </Box>
                <Box className="header-right">
                    <Chip icon={<StarIcon />} label={score} color="primary" />
                    <Chip
                        label={`${currentLineIndex + 1}/${userLines.length}`}
                        variant="outlined"
                    />
                </Box>
            </Paper>

            {/* Repair Progress */}
            <Paper className="progress-bar" elevation={1}>
                <Typography variant="caption">Repair Progress</Typography>
                <LinearProgress
                    variant="determinate"
                    value={repairProgress}
                    className="repair-progress"
                />
                <Typography variant="caption">{Math.round(repairProgress)}%</Typography>
            </Paper>

            {/* Word Bank */}
            {wordBank.length > 0 && (
                <Paper className="word-bank" elevation={2}>
                    <Typography variant="subtitle2" gutterBottom>
                        Repair Tools (Word Bank)
                    </Typography>
                    <Box className="word-chips">
                        {wordBank.map((word, i) => (
                            <Chip
                                key={i}
                                label={word}
                                className="word-chip"
                                onClick={() => {
                                    // Find first empty input and fill it
                                    const template = currentLine.template;
                                    const gaps = (template.match(/_{3,}/g) || []).length;
                                    for (let g = 0; g < gaps; g++) {
                                        if (!answers[`${currentLineIndex}-${g}`]) {
                                            handleInputChange(currentLineIndex, g, word);
                                            break;
                                        }
                                    }
                                }}
                            />
                        ))}
                    </Box>
                </Paper>
            )}

            {/* Feedback */}
            {feedback && (
                <Box className={`feedback-popup ${feedback.type}`}>
                    {feedback.type === 'success' && <CheckCircleIcon />}
                    {feedback.type === 'error' && <ErrorIcon />}
                    <Typography>{feedback.message}</Typography>
                </Box>
            )}

            {/* Corrupted Line Display */}
            <Paper className={`corrupted-line ${glitchEffect ? 'glitch-container' : ''}`} elevation={3}>
                <Box className="line-header">
                    <Typography variant="subtitle2" color="primary">
                        {currentLine.speaker}:
                    </Typography>
                    <Chip label="CORRUPTED" color="error" size="small" />
                </Box>

                {currentLine.template && renderTemplate(currentLine.template, currentLineIndex)}

                <Button
                    variant="contained"
                    onClick={handleRepairLine}
                    className="repair-btn"
                    startIcon={<BuildIcon />}
                >
                    Repair Segment
                </Button>
            </Paper>

            {/* All dialogue lines display */}
            <Paper className="dialogue-display" elevation={1}>
                <Typography variant="subtitle2" gutterBottom>
                    Full Transmission:
                </Typography>
                {dialogueLines.map((line, idx) => (
                    <Box
                        key={idx}
                        className={`dialogue-line ${line.template ? 'needs-repair' : ''} ${idx < currentLineIndex ? 'repaired' : ''} ${idx === currentLineIndex ? 'current' : ''}`}
                    >
                        <Typography variant="caption" color="primary">
                            {line.speaker}:
                        </Typography>
                        <Typography variant="body2">
                            {line.text || (idx <= currentLineIndex ? line.template?.replace(/_{3,}/g, '[___]') : '[CORRUPTED]')}
                        </Typography>
                        {idx < currentLineIndex && line.template && (
                            <CheckCircleIcon className="repaired-icon" />
                        )}
                    </Box>
                ))}
            </Paper>
        </Box>
    );
}
