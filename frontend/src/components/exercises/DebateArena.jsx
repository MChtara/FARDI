/**
 * Debate Arena Component
 * An engaging negotiation game where student debates against SKANDER
 * Features: Visual battle arena, persuasion bar, gap-fill dialogue, power-ups
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Paper, Typography, TextField, Button, IconButton, Chip,
    Tooltip, Fade, Grow, Zoom, Slide, Avatar
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import PersonIcon from '@mui/icons-material/Person';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import './DebateArena.css';

// Character definitions with MUI icons
const CHARACTERS = {
    student: {
        name: 'You',
        color: '#4facfe',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        icon: PersonIcon
    },
    skander: {
        name: 'SKANDER',
        color: '#f093fb',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        icon: RecordVoiceOverIcon
    }
};

// Power-up definitions
const POWER_UPS = {
    hint: { icon: <LightbulbIcon />, name: 'Hint', description: 'Reveal part of the answer' },
    skip: { icon: <SkipNextIcon />, name: 'Skip', description: 'Skip this question' },
    double: { icon: <StarIcon />, name: '2X Points', description: 'Double points for next answer' }
};

export default function DebateArena({ exercise, onComplete, onProgress }) {
    // Game state
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [persuasion, setPersuasion] = useState(50);
    const [answers, setAnswers] = useState({});
    const [showInput, setShowInput] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [gameState, setGameState] = useState('playing');
    const [combo, setCombo] = useState(0);
    const [doublePointsActive, setDoublePointsActive] = useState(false);
    const [hintsUsed, setHintsUsed] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [shakeCharacter, setShakeCharacter] = useState(null);

    const inputRefs = useRef({});
    const dialogueRef = useRef(null);

    // Get current dialogue line
    const dialogueLines = exercise?.dialogue_lines || [];
    const correctAnswers = exercise?.correct_answers || [];
    const guidedQuestions = exercise?.guided_questions || [];
    const currentLine = dialogueLines[currentDialogueIndex];

    // Find which answer index we're on
    const currentAnswerIndex = dialogueLines
        .slice(0, currentDialogueIndex + 1)
        .filter(line => line.speaker === 'You').length - 1;

    // Show input after a delay when it's user's turn
    useEffect(() => {
        if (!currentLine) return;

        setShowInput(false);

        if (currentLine.template) {
            const timer = setTimeout(() => {
                setShowInput(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentDialogueIndex, currentLine]);

    // Focus first input when shown
    useEffect(() => {
        if (showInput && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [showInput]);

    // Scroll dialogue into view
    useEffect(() => {
        if (dialogueRef.current) {
            dialogueRef.current.scrollTop = dialogueRef.current.scrollHeight;
        }
    }, [currentDialogueIndex]);

    // Check for game end conditions
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (persuasion >= 85) {
            setGameState('victory');
            handleGameEnd(true);
        } else if (persuasion <= 15) {
            setGameState('defeat');
            handleGameEnd(false);
        }
    }, [persuasion, gameState]);

    const handleGameEnd = (isVictory) => {
        const xpEarned = isVictory ? 100 + (combo * 10) + totalScore : 25;

        window.dispatchEvent(new CustomEvent('xp-awarded', {
            detail: {
                xp_amount: xpEarned,
                reason: isVictory ? 'debate_victory' : 'debate_attempt',
                new_total: xpEarned
            }
        }));

        if (onComplete) {
            onComplete({
                score: persuasion,
                isVictory,
                xpEarned,
                comboMax: combo,
                totalScore
            });
        }
    };

    const getExpectedWords = (answerIndex) => {
        const answer = correctAnswers[answerIndex];
        if (!answer) return [];
        const cleanAnswer = answer.replace(/^\d+\.\s*/, '').toLowerCase();
        return cleanAnswer.split(/\s+/).filter(word => word.length > 2);
    };

    const handleAnswerSubmit = () => {
        const userAnswer = Object.values(answers).join(' ').toLowerCase().trim();
        if (!userAnswer) return;

        const expectedWords = getExpectedWords(currentAnswerIndex);
        const matchedWords = expectedWords.filter(word =>
            userAnswer.includes(word.toLowerCase())
        );
        const matchPercentage = expectedWords.length > 0
            ? matchedWords.length / expectedWords.length
            : 0;

        const isCorrect = matchPercentage >= 0.5;
        const isPartiallyCorrect = matchPercentage >= 0.3;

        let points = 0;
        if (isCorrect) {
            points = doublePointsActive ? 20 : 10;
            setPersuasion(prev => Math.min(100, prev + (doublePointsActive ? 12 : 8)));
            setCombo(prev => prev + 1);
            setShakeCharacter('skander');
        } else if (isPartiallyCorrect) {
            points = 5;
            setPersuasion(prev => Math.min(100, prev + 3));
            setCombo(0);
        } else {
            setPersuasion(prev => Math.max(0, prev - 8));
            setCombo(0);
            setShakeCharacter('student');
        }

        setTotalScore(prev => prev + points);
        setDoublePointsActive(false);

        setFeedback({
            type: isCorrect ? 'success' : isPartiallyCorrect ? 'partial' : 'error',
            message: isCorrect ? `Great! +${points} points` :
                isPartiallyCorrect ? 'Close! +5 points' :
                    'Not quite right...',
            correctAnswer: correctAnswers[currentAnswerIndex]
        });

        setTimeout(() => setShakeCharacter(null), 500);

        setTimeout(() => {
            setFeedback(null);
            setAnswers({});
            setShowHint(false);
            moveToNextDialogue();
        }, 2000);

        if (onProgress) {
            onProgress({ correct: isCorrect, points });
        }
    };

    const moveToNextDialogue = () => {
        if (currentDialogueIndex < dialogueLines.length - 1) {
            setCurrentDialogueIndex(prev => prev + 1);
        } else if (gameState === 'playing') {
            if (persuasion >= 50) {
                setGameState('victory');
                handleGameEnd(true);
            } else {
                setGameState('defeat');
                handleGameEnd(false);
            }
        }
    };

    const handleInputChange = (gapIndex, value) => {
        setAnswers(prev => ({ ...prev, [gapIndex]: value }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAnswerSubmit();
        }
    };

    const useHint = () => {
        if (hintsUsed.includes(currentAnswerIndex)) return;
        const answer = correctAnswers[currentAnswerIndex];
        if (answer) {
            setHintsUsed(prev => [...prev, currentAnswerIndex]);
            setShowHint(true);
        }
    };

    const useSkip = () => {
        setPersuasion(prev => Math.max(0, prev - 3));
        setAnswers({});
        moveToNextDialogue();
    };

    const useDoublePoints = () => {
        setDoublePointsActive(true);
    };

    // Render gap-fill template with proper parsing
    const renderTemplate = (template) => {
        if (!template) return null;

        // Split by multiple underscores (e.g., __________)
        const parts = template.split(/_{3,}/);
        const gapCount = parts.length - 1;

        return (
            <Box className="template-container">
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        <Typography component="span" className="template-text">
                            {part}
                        </Typography>
                        {index < gapCount && (
                            <TextField
                                inputRef={el => inputRefs.current[index] = el}
                                size="small"
                                variant="outlined"
                                className="gap-input"
                                value={answers[index] || ''}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="type here..."
                                autoComplete="off"
                                sx={{ mx: 1, minWidth: 120 }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </Box>
        );
    };

    // Render character avatar with icon
    const renderCharacterAvatar = (character, expression) => {
        const CharIcon = CHARACTERS[character].icon;
        const isWinning = character === 'student' ? persuasion > 50 : persuasion < 50;

        return (
            <Avatar
                className={`character-icon ${isWinning ? 'winning' : ''}`}
                sx={{
                    width: 80,
                    height: 80,
                    bgcolor: CHARACTERS[character].color,
                    boxShadow: isWinning ? `0 0 20px ${CHARACTERS[character].color}` : 'none'
                }}
            >
                <CharIcon sx={{ fontSize: 48 }} />
            </Avatar>
        );
    };

    const renderGameEnd = () => {
        const isVictory = gameState === 'victory';

        return (
            <Zoom in>
                <Box className={`game-end-overlay ${isVictory ? 'victory' : 'defeat'}`}>
                    <Paper className="game-end-card" elevation={10}>
                        <Box className="game-end-icon">
                            {isVictory ? (
                                <EmojiEventsIcon className="trophy-icon" />
                            ) : (
                                <SentimentVeryDissatisfiedIcon className="defeat-icon" />
                            )}
                        </Box>
                        <Typography variant="h3" className="game-end-title">
                            {isVictory ? 'Victory!' : 'Nice Try!'}
                        </Typography>
                        <Typography variant="body1" className="game-end-subtitle">
                            {isVictory
                                ? 'You convinced SKANDER with your negotiation skills!'
                                : "SKANDER won this round. Practice makes perfect!"}
                        </Typography>

                        <Box className="game-end-stats">
                            <Chip
                                icon={<StarIcon />}
                                label={`Score: ${totalScore}`}
                                color="primary"
                                className="stat-chip"
                            />
                            <Chip
                                label={`Max Combo: ${combo}x`}
                                variant="outlined"
                                className="stat-chip"
                            />
                            <Chip
                                label={`Persuasion: ${Math.round(persuasion)}%`}
                                color={isVictory ? 'success' : 'warning'}
                                className="stat-chip"
                            />
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            className="play-again-btn"
                            onClick={() => {
                                setGameState('playing');
                                setCurrentDialogueIndex(0);
                                setPersuasion(50);
                                setAnswers({});
                                setCombo(0);
                                setTotalScore(0);
                                setHintsUsed([]);
                                setShowHint(false);
                            }}
                        >
                            Play Again
                        </Button>
                    </Paper>
                </Box>
            </Zoom>
        );
    };

    if (!exercise || dialogueLines.length === 0) {
        return (
            <Box className="debate-arena-error">
                <Typography>No dialogue data available for this activity.</Typography>
            </Box>
        );
    }

    return (
        <Box className="debate-arena">
            {/* Arena Header */}
            <Fade in timeout={500}>
                <Paper className="arena-header" elevation={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <RecordVoiceOverIcon />
                        <Typography variant="h5" className="arena-title">
                            Debate Arena
                        </Typography>
                    </Box>
                    <Typography variant="body2" className="arena-instruction">
                        {exercise.instruction}
                    </Typography>

                    {combo > 0 && (
                        <Grow in>
                            <Chip
                                icon={<LocalFireDepartmentIcon />}
                                label={`${combo}x Combo!`}
                                color="warning"
                                className="combo-chip"
                            />
                        </Grow>
                    )}
                </Paper>
            </Fade>

            {/* Character Arena */}
            <Box className="arena-container">
                {/* Student Side */}
                <Grow in timeout={600}>
                    <Paper
                        className={`character-card student ${shakeCharacter === 'student' ? 'shake' : ''}`}
                        elevation={4}
                        style={{ background: CHARACTERS.student.gradient }}
                    >
                        <Box className="character-avatar">
                            {renderCharacterAvatar('student')}
                        </Box>
                        <Typography variant="h6" className="character-name">
                            {CHARACTERS.student.name}
                        </Typography>
                        <Box className="character-meter">
                            <Typography variant="caption">Your Persuasion</Typography>
                            <Box className="meter-fill student-fill"
                                style={{ width: `${Math.max(0, persuasion - 50) * 2}%` }}
                            />
                        </Box>
                    </Paper>
                </Grow>

                {/* VS Badge */}
                <Zoom in timeout={800}>
                    <Box className="vs-badge">
                        <Typography variant="h4">VS</Typography>
                    </Box>
                </Zoom>

                {/* SKANDER Side */}
                <Grow in timeout={600}>
                    <Paper
                        className={`character-card skander ${shakeCharacter === 'skander' ? 'shake' : ''}`}
                        elevation={4}
                        style={{ background: CHARACTERS.skander.gradient }}
                    >
                        <Box className="character-avatar">
                            {renderCharacterAvatar('skander')}
                        </Box>
                        <Typography variant="h6" className="character-name">
                            {CHARACTERS.skander.name}
                        </Typography>
                        <Box className="character-meter">
                            <Typography variant="caption">SKANDER's Lead</Typography>
                            <Box className="meter-fill skander-fill"
                                style={{ width: `${Math.max(0, 50 - persuasion) * 2}%` }}
                            />
                        </Box>
                    </Paper>
                </Grow>
            </Box>

            {/* Persuasion Tug-of-War Bar */}
            <Box className="persuasion-container">
                <Typography variant="caption" className="persuasion-label left">You</Typography>
                <Box className="persuasion-bar-wrapper">
                    <Box className="persuasion-bar">
                        <Box
                            className="persuasion-fill"
                            style={{
                                width: `${persuasion}%`,
                                background: persuasion >= 50
                                    ? `linear-gradient(90deg, #4facfe ${100 - persuasion}%, #00f2fe)`
                                    : `linear-gradient(90deg, #f5576c, #f093fb ${persuasion}%)`
                            }}
                        />
                        <Box
                            className="persuasion-marker"
                            style={{ left: `${persuasion}%` }}
                        />
                    </Box>
                </Box>
                <Typography variant="caption" className="persuasion-label right">SKANDER</Typography>
            </Box>

            {/* Dialogue Area */}
            <Paper className="dialogue-container" elevation={2} ref={dialogueRef}>
                {dialogueLines.slice(0, currentDialogueIndex + 1).map((line, index) => {
                    const isCurrentLine = index === currentDialogueIndex;
                    const isUserLine = line.speaker === 'You';

                    return (
                        <Slide key={index} direction={isUserLine ? 'left' : 'right'} in timeout={400}>
                            <Box className={`dialogue-bubble ${isUserLine ? 'user' : 'opponent'} ${isCurrentLine ? 'current' : ''}`}>
                                <Typography variant="subtitle2" className="speaker-name">
                                    {line.speaker}
                                </Typography>

                                {isUserLine && line.template ? (
                                    // User's turn - show template with inputs
                                    showInput ? (
                                        <>
                                            {renderTemplate(line.template)}

                                            {showHint && (
                                                <Fade in>
                                                    <Box className="hint-box">
                                                        <LightbulbIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                        <Typography variant="caption" color="primary">
                                                            Hint: {correctAnswers[currentAnswerIndex]?.replace(/^\d+\.\s*/, '').split(' ').slice(0, 3).join(' ')}...
                                                        </Typography>
                                                    </Box>
                                                </Fade>
                                            )}

                                            <Button
                                                variant="contained"
                                                className="submit-answer-btn"
                                                onClick={handleAnswerSubmit}
                                                disabled={Object.keys(answers).length === 0 || Object.values(answers).every(v => !v)}
                                            >
                                                Send Response
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography className="dialogue-text" sx={{ opacity: 0.7 }}>
                                            Your turn to respond...
                                        </Typography>
                                    )
                                ) : (
                                    // Opponent's line - show text and continue button if current
                                    <>
                                        <Typography className="dialogue-text">
                                            {line.text}
                                        </Typography>
                                        {isCurrentLine && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                className="continue-btn"
                                                onClick={moveToNextDialogue}
                                                sx={{ mt: 1 }}
                                            >
                                                Continue
                                            </Button>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Slide>
                    );
                })}

                {/* Feedback popup */}
                {feedback && (
                    <Zoom in>
                        <Box className={`feedback-popup ${feedback.type}`}>
                            <Typography variant="body1">{feedback.message}</Typography>
                            {feedback.type !== 'success' && feedback.correctAnswer && (
                                <Typography variant="caption" className="correct-answer">
                                    Correct: {feedback.correctAnswer?.replace(/^\d+\.\s*/, '') || feedback.correctAnswer}
                                </Typography>
                            )}
                        </Box>
                    </Zoom>
                )}
            </Paper>

            {/* Power-ups Bar */}
            <Fade in timeout={900}>
                <Box className="powerups-bar">
                    <Tooltip title={POWER_UPS.hint.description} arrow>
                        <span>
                            <IconButton
                                className="powerup-btn hint"
                                onClick={useHint}
                                disabled={hintsUsed.includes(currentAnswerIndex) || !showInput}
                            >
                                {POWER_UPS.hint.icon}
                                <span className="powerup-label">Hint</span>
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title={POWER_UPS.skip.description} arrow>
                        <span>
                            <IconButton
                                className="powerup-btn skip"
                                onClick={useSkip}
                                disabled={!showInput}
                            >
                                {POWER_UPS.skip.icon}
                                <span className="powerup-label">Skip</span>
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title={POWER_UPS.double.description} arrow>
                        <span>
                            <IconButton
                                className={`powerup-btn double ${doublePointsActive ? 'active' : ''}`}
                                onClick={useDoublePoints}
                                disabled={doublePointsActive || !showInput}
                            >
                                {POWER_UPS.double.icon}
                                <span className="powerup-label">2X</span>
                            </IconButton>
                        </span>
                    </Tooltip>

                    {doublePointsActive && (
                        <Chip
                            label="2X Active!"
                            color="warning"
                            size="small"
                            className="double-active-chip"
                        />
                    )}
                </Box>
            </Fade>

            {/* Score display */}
            <Box className="score-display">
                <Chip
                    icon={<StarIcon />}
                    label={`Score: ${totalScore}`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            {/* Victory/Defeat Overlay */}
            {(gameState === 'victory' || gameState === 'defeat') && renderGameEnd()}
        </Box>
    );
}
