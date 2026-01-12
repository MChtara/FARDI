/**
 * Chat Messenger Sim Component
 * Digital Communication themed component for listening_story_writing, listening_research, listening_reflection
 * Features: Chat bubble interface, Typing indicators, Emoji reactions, Voice notes
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Paper, Typography, TextField, Button, IconButton, Avatar,
    Chip, LinearProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MicIcon from '@mui/icons-material/Mic';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CelebrationIcon from '@mui/icons-material/Celebration';
import StarIcon from '@mui/icons-material/Star';
import './ChatMessengerSim.css';

// Team avatars
const TEAM_AVATARS = {
    'Emna': { color: '#FF6B9D', initials: 'EM' },
    'Ryan': { color: '#4D96FF', initials: 'RY' },
    'Lilia': { color: '#6BCF7F', initials: 'LI' },
    'SKANDER': { color: '#FFD93D', initials: 'SK' },
    'Ms. Mabrouki': { color: '#9D84B7', initials: 'MM' },
    'Team': { color: '#667eea', initials: 'TM' },
    'Manager': { color: '#f5576c', initials: 'MG' }
};

const EMOJI_REACTIONS = ['👍', '❤️', '🎉', '🔥', '👏'];

export default function ChatMessengerSim({ exercise, onComplete, onProgress }) {
    const [audioPlayed, setAudioPlayed] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [currentInput, setCurrentInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(null);
    const [score, setScore] = useState(0);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const audioScript = exercise?.audio_script || '';
    const templates = exercise?.templates || [];
    const guidedQuestions = exercise?.guided_questions || [];

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle audio playback
    const handlePlayAudio = useCallback(() => {
        setAudioPlaying(true);

        // Add voice note message
        setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'voice',
            sender: 'Team',
            content: audioScript,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'playing'
        }]);

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(audioScript);
            utterance.rate = 0.9;
            utterance.onend = () => {
                setAudioPlaying(false);
                setAudioPlayed(true);
                // Update message status
                setMessages(prev => prev.map(msg =>
                    msg.type === 'voice' ? { ...msg, status: 'played' } : msg
                ));
                // Show first prompt after delay
                setTimeout(() => {
                    addPromptMessage();
                }, 1000);
            };
            speechSynthesis.speak(utterance);
        } else {
            setTimeout(() => {
                setAudioPlaying(false);
                setAudioPlayed(true);
                setMessages(prev => prev.map(msg =>
                    msg.type === 'voice' ? { ...msg, status: 'played' } : msg
                ));
                setTimeout(() => {
                    addPromptMessage();
                }, 1000);
            }, 3000);
        }
    }, [audioScript]);

    const addPromptMessage = () => {
        const prompt = guidedQuestions[currentPromptIndex] || templates[currentPromptIndex];
        if (!prompt) return;

        // Simulate typing indicator
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'prompt',
                sender: 'Team',
                content: prompt,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reactions: []
            }]);
            inputRef.current?.focus();
        }, 1500);
    };

    const handleSendMessage = () => {
        if (!currentInput.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            sender: 'You',
            content: currentInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
            reactions: []
        };

        setMessages(prev => [...prev, userMessage]);
        setCurrentInput('');

        // Calculate score based on response length and keywords
        const exampleAnswer = exercise?.example_of_answers?.[currentPromptIndex] || '';
        const keywords = exampleAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const matchedKeywords = keywords.filter(kw => currentInput.toLowerCase().includes(kw));
        const points = Math.min(20, 5 + matchedKeywords.length * 3 + Math.floor(currentInput.length / 20));

        setScore(prev => prev + points);

        // Update message status and add team reaction
        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
            ));
        }, 500);

        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === userMessage.id ? { ...msg, status: 'read' } : msg
            ));

            // Add reaction from team
            if (points >= 10) {
                setMessages(prev => prev.map(msg =>
                    msg.id === userMessage.id ? {
                        ...msg,
                        reactions: ['👍', '🎉']
                    } : msg
                ));
            }
        }, 1000);

        if (onProgress) {
            onProgress({ correct: points >= 10, points });
        }

        // Move to next prompt or complete
        const nextIndex = currentPromptIndex + 1;
        if (nextIndex < Math.max(templates.length, guidedQuestions.length)) {
            setCurrentPromptIndex(nextIndex);
            setTimeout(() => {
                addPromptMessage();
            }, 2000);
        } else {
            // Chat complete
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'system',
                    content: 'Great conversation! All questions answered.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);

                if (onComplete) {
                    onComplete({
                        score,
                        correctCount: currentPromptIndex + 1,
                        totalCount: Math.max(templates.length, guidedQuestions.length),
                        isPerfect: true
                    });
                }
            }, 1500);
        }
    };

    const handleReaction = (messageId, emoji) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                const reactions = msg.reactions || [];
                if (reactions.includes(emoji)) {
                    return { ...msg, reactions: reactions.filter(r => r !== emoji) };
                } else {
                    return { ...msg, reactions: [...reactions, emoji] };
                }
            }
            return msg;
        }));
        setShowEmojiPicker(null);
        if (navigator.vibrate) navigator.vibrate(30);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Audio instruction screen
    if (!audioPlayed) {
        return (
            <Box className="chat-messenger">
                <Paper className="chat-container voice-intro" elevation={4}>
                    <Box className="chat-header">
                        <Avatar sx={{ bgcolor: TEAM_AVATARS['Team'].color }}>
                            {TEAM_AVATARS['Team'].initials}
                        </Avatar>
                        <Box className="header-info">
                            <Typography variant="subtitle1">Team Chat</Typography>
                            <Typography variant="caption" className="online-status">
                                {audioPlaying ? 'Recording...' : 'Voice message received'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="voice-intro-content">
                        <Box className="voice-note-card">
                            <MicIcon className="mic-icon" />
                            <Box className="voice-waveform">
                                {[...Array(20)].map((_, i) => (
                                    <Box
                                        key={i}
                                        className={`wave-bar ${audioPlaying ? 'playing' : ''}`}
                                        style={{ animationDelay: `${i * 0.05}s` }}
                                    />
                                ))}
                            </Box>
                            <IconButton
                                onClick={handlePlayAudio}
                                disabled={audioPlaying}
                                className="play-btn"
                            >
                                {audioPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            {audioPlaying ? 'Playing voice message...' : 'Tap to play voice message'}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            {exercise?.instruction || 'Listen and respond to the team message'}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        );
    }

    return (
        <Box className="chat-messenger">
            <Paper className="chat-container" elevation={4}>
                {/* Chat Header */}
                <Box className="chat-header">
                    <Avatar sx={{ bgcolor: TEAM_AVATARS['Team'].color }}>
                        {TEAM_AVATARS['Team'].initials}
                    </Avatar>
                    <Box className="header-info">
                        <Typography variant="subtitle1">Team Chat</Typography>
                        <Typography variant="caption" className="online-status">
                            {isTyping ? 'typing...' : 'Online'}
                        </Typography>
                    </Box>
                    <Box className="header-right">
                        <Chip
                            icon={<StarIcon />}
                            label={score}
                            size="small"
                            color="primary"
                        />
                    </Box>
                </Box>

                {/* Messages Area */}
                <Box className="messages-area">
                    {messages.map((message) => (
                        <Box
                            key={message.id}
                            className={`message ${message.type} ${message.sender === 'You' ? 'outgoing' : 'incoming'}`}
                        >
                            {message.sender !== 'You' && message.type !== 'system' && (
                                <Avatar
                                    className="message-avatar"
                                    sx={{
                                        bgcolor: TEAM_AVATARS[message.sender]?.color || '#667eea',
                                        width: 32,
                                        height: 32
                                    }}
                                >
                                    {TEAM_AVATARS[message.sender]?.initials || message.sender[0]}
                                </Avatar>
                            )}

                            <Box className="message-content">
                                {message.type === 'voice' && (
                                    <Box className="voice-message">
                                        <MicIcon className="mic-icon small" />
                                        <Box className="voice-waves small">
                                            {[...Array(10)].map((_, i) => (
                                                <Box
                                                    key={i}
                                                    className={`wave-bar ${message.status === 'playing' ? 'playing' : ''}`}
                                                />
                                            ))}
                                        </Box>
                                        <Typography variant="caption">
                                            {message.status === 'playing' ? 'Playing...' : 'Voice message'}
                                        </Typography>
                                    </Box>
                                )}

                                {message.type === 'system' && (
                                    <Box className="system-message">
                                        <CelebrationIcon />
                                        <Typography variant="body2">{message.content}</Typography>
                                    </Box>
                                )}

                                {(message.type === 'prompt' || message.type === 'user') && (
                                    <>
                                        <Typography variant="body2">{message.content}</Typography>
                                        <Box className="message-meta">
                                            <Typography variant="caption">{message.time}</Typography>
                                            {message.sender === 'You' && (
                                                <span className="status-icon">
                                                    {message.status === 'read' ? (
                                                        <DoneAllIcon className="read" />
                                                    ) : message.status === 'delivered' ? (
                                                        <DoneAllIcon />
                                                    ) : (
                                                        <CheckIcon />
                                                    )}
                                                </span>
                                            )}
                                        </Box>
                                    </>
                                )}

                                {/* Reactions */}
                                {message.reactions?.length > 0 && (
                                    <Box className="reactions">
                                        {message.reactions.map((emoji, i) => (
                                            <span key={i} className="reaction">{emoji}</span>
                                        ))}
                                    </Box>
                                )}

                                {/* Emoji picker trigger */}
                                {message.type !== 'system' && message.type !== 'voice' && (
                                    <IconButton
                                        className="reaction-btn"
                                        size="small"
                                        onClick={() => setShowEmojiPicker(
                                            showEmojiPicker === message.id ? null : message.id
                                        )}
                                    >
                                        <EmojiEmotionsIcon fontSize="small" />
                                    </IconButton>
                                )}

                                {/* Emoji picker */}
                                {showEmojiPicker === message.id && (
                                    <Box className="emoji-picker">
                                        {EMOJI_REACTIONS.map(emoji => (
                                            <span
                                                key={emoji}
                                                className="emoji-option"
                                                onClick={() => handleReaction(message.id, emoji)}
                                            >
                                                {emoji}
                                            </span>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <Box className="message incoming typing">
                            <Avatar
                                className="message-avatar"
                                sx={{ bgcolor: TEAM_AVATARS['Team'].color, width: 32, height: 32 }}
                            >
                                TM
                            </Avatar>
                            <Box className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </Box>
                        </Box>
                    )}

                    <div ref={messagesEndRef} />
                </Box>

                {/* Input Area */}
                <Box className="input-area">
                    <TextField
                        inputRef={inputRef}
                        fullWidth
                        multiline
                        maxRows={3}
                        placeholder="Type your response..."
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                        size="small"
                        className="message-input"
                    />
                    <IconButton
                        onClick={handleSendMessage}
                        disabled={!currentInput.trim()}
                        className="send-btn"
                        color="primary"
                    >
                        <SendIcon />
                    </IconButton>
                </Box>

                {/* Progress indicator */}
                <LinearProgress
                    variant="determinate"
                    value={(currentPromptIndex / Math.max(templates.length, guidedQuestions.length, 1)) * 100}
                    className="chat-progress"
                />
            </Paper>
        </Box>
    );
}
