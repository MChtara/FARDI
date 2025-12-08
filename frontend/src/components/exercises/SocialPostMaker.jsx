/**
 * SocialPostMaker - Social Media Post Exercise Component
 * 
 * A writing exercise styled as different social media platforms:
 * - Instagram, Facebook, X (Twitter), LinkedIn, Reddit
 * - Randomly selects platform on each load
 * - User fills in the post content
 */
import React, { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Typography,
    Paper,
    Avatar,
    IconButton,
    TextField,
    Button,
    Stack,
    Chip,
    Divider
} from '@mui/material'
// Icons
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import ShareIcon from '@mui/icons-material/Share'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import RepeatIcon from '@mui/icons-material/Repeat'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SendIcon from '@mui/icons-material/Send'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import PublicIcon from '@mui/icons-material/Public'
import VerifiedIcon from '@mui/icons-material/Verified'

// Platform configurations
const PLATFORMS = {
    instagram: {
        name: 'Instagram',
        bgColor: '#000000',
        cardBg: '#000000',
        textColor: '#ffffff',
        accentColor: '#E1306C',
        secondaryColor: '#8e8e8e'
    },
    facebook: {
        name: 'Facebook',
        bgColor: '#18191a',
        cardBg: '#242526',
        textColor: '#e4e6eb',
        accentColor: '#2374e1',
        secondaryColor: '#b0b3b8'
    },
    twitter: {
        name: 'X',
        bgColor: '#000000',
        cardBg: '#16181c',
        textColor: '#e7e9ea',
        accentColor: '#1d9bf0',
        secondaryColor: '#71767b'
    },
    linkedin: {
        name: 'LinkedIn',
        bgColor: '#000000',
        cardBg: '#1b1f23',
        textColor: '#ffffff',
        accentColor: '#0a66c2',
        secondaryColor: '#ffffff99'
    },
    reddit: {
        name: 'Reddit',
        bgColor: '#030303',
        cardBg: '#1a1a1b',
        textColor: '#d7dadc',
        accentColor: '#ff4500',
        secondaryColor: '#818384'
    }
}

export default function SocialPostMaker({ exercise, onComplete, onProgress }) {
    const [postContent, setPostContent] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [platform, setPlatform] = useState(null)

    // Randomly select platform on mount
    useEffect(() => {
        const platforms = Object.keys(PLATFORMS)
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)]
        setPlatform(randomPlatform)
    }, [])

    const config = platform ? PLATFORMS[platform] : PLATFORMS.instagram

    // Get user name and exercise info
    const userName = 'You'
    const instruction = exercise?.instruction || 'Write your post'
    const guidedQuestions = exercise?.guided_questions || []
    const exampleAnswers = exercise?.example_of_answers || []
    const minWords = 10

    // Check if content meets minimum requirements
    const wordCount = postContent.trim().split(/\s+/).filter(w => w).length
    const isValid = wordCount >= minWords

    // Handle submit
    const handleSubmit = () => {
        if (isValid) {
            setIsSubmitted(true)
            onComplete?.({
                isPerfect: true,
                answer: postContent
            })
        }
    }

    // Report progress
    useEffect(() => {
        onProgress?.({ answer: postContent })
    }, [postContent, onProgress])

    // Get current time
    const getTimeAgo = () => 'Just now'

    // Render guided questions helper
    const renderGuidedQuestions = () => {
        if (!guidedQuestions || guidedQuestions.length === 0) return null

        return (
            <Box sx={{
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 1.5,
                p: 1.5,
                mb: 1.5,
                border: '1px solid rgba(255,255,255,0.08)'
            }}>
                <Typography sx={{
                    color: config.accentColor,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    💡 Consider these points:
                </Typography>
                <Stack spacing={0.75}>
                    {guidedQuestions.map((question, idx) => (
                        <Typography
                            key={idx}
                            sx={{
                                color: config.secondaryColor,
                                fontSize: '0.8rem',
                                pl: 1,
                                borderLeft: `2px solid ${config.accentColor}40`
                            }}
                        >
                            {question}
                        </Typography>
                    ))}
                </Stack>
            </Box>
        )
    }

    // Render example answers helper
    const renderExampleAnswers = () => {
        if (!exampleAnswers || exampleAnswers.length === 0) return null

        return (
            <Box sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 1.5,
                p: 1.5,
                mb: 1.5,
                border: '1px solid rgba(255,255,255,0.12)'
            }}>
                <Typography sx={{
                    color: config.accentColor,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    ✨ Example responses:
                </Typography>
                <Stack spacing={0.75}>
                    {exampleAnswers.map((example, idx) => (
                        <Typography
                            key={idx}
                            sx={{
                                color: config.textColor,
                                fontSize: '0.75rem',
                                pl: 1,
                                borderLeft: `2px solid ${config.accentColor}60`,
                                fontStyle: 'italic',
                                opacity: 0.8
                            }}
                        >
                            {example}
                        </Typography>
                    ))}
                </Stack>
            </Box>
        )
    }

    if (!platform) return null

    // Render Instagram Style
    const renderInstagram = () => (
        <Paper sx={{ bgcolor: config.cardBg, borderRadius: 2, overflow: 'hidden', maxWidth: 470 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: config.accentColor }}>Y</Avatar>
                <Typography sx={{ color: config.textColor, fontWeight: 600, fontSize: '0.875rem', flex: 1 }}>
                    {userName}
                </Typography>
                <IconButton size="small" sx={{ color: config.textColor }}>
                    <MoreHorizIcon />
                </IconButton>
            </Stack>

            {/* Image placeholder */}
            <Box sx={{
                width: '100%',
                height: 300,
                bgcolor: '#262626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography sx={{ color: config.secondaryColor }}>📷 Your photo here</Typography>
            </Box>

            {/* Actions */}
            <Stack direction="row" sx={{ p: 1 }}>
                <IconButton sx={{ color: config.textColor }}><FavoriteBorderIcon /></IconButton>
                <IconButton sx={{ color: config.textColor }}><ChatBubbleOutlineIcon /></IconButton>
                <IconButton sx={{ color: config.textColor }}><SendIcon /></IconButton>
                <Box sx={{ flex: 1 }} />
                <IconButton sx={{ color: config.textColor }}><BookmarkBorderIcon /></IconButton>
            </Stack>

            {/* Likes */}
            <Typography sx={{ px: 2, color: config.textColor, fontWeight: 600, fontSize: '0.875rem' }}>
                0 likes
            </Typography>

            {/* Caption input */}
            <Box sx={{ p: 2, pt: 1 }}>
                <Typography sx={{ color: config.secondaryColor, fontSize: '0.8rem', mb: 1 }}>
                    {instruction}
                </Typography>
                {renderGuidedQuestions()}
                {renderExampleAnswers()}
                <TextField
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Write your caption..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    disabled={isSubmitted}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: config.textColor,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
                        }
                    }}
                />
            </Box>
        </Paper>
    )

    // Render Facebook Style
    const renderFacebook = () => (
        <Paper sx={{ bgcolor: config.cardBg, borderRadius: 2, overflow: 'hidden', maxWidth: 500 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2, pb: 1 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: config.accentColor }}>Y</Avatar>
                <Box>
                    <Typography sx={{ color: config.textColor, fontWeight: 600, fontSize: '0.9rem' }}>
                        {userName}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography sx={{ color: config.secondaryColor, fontSize: '0.75rem' }}>
                            {getTimeAgo()}
                        </Typography>
                        <PublicIcon sx={{ fontSize: 12, color: config.secondaryColor }} />
                    </Stack>
                </Box>
                <Box sx={{ flex: 1 }} />
                <IconButton sx={{ color: config.secondaryColor }}><MoreHorizIcon /></IconButton>
            </Stack>

            {/* Post content */}
            <Box sx={{ px: 2, pb: 2 }}>
                <Typography sx={{ color: config.secondaryColor, fontSize: '0.8rem', mb: 1 }}>
                    {instruction}
                </Typography>
                {renderGuidedQuestions()}
                {renderExampleAnswers()}
                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    disabled={isSubmitted}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: config.textColor,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            fontSize: '1.1rem',
                            '& fieldset': { borderColor: 'transparent' }
                        }
                    }}
                />
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            {/* Actions */}
            <Stack direction="row" justifyContent="space-around" sx={{ py: 0.5, px: 1 }}>
                <Stack alignItems="center" spacing={0} sx={{ cursor: 'pointer', py: 0.5, px: 2, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ThumbUpOutlinedIcon sx={{ fontSize: 18, color: config.secondaryColor }} />
                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.7rem', mt: 0.25 }}>Like</Typography>
                </Stack>
                <Stack alignItems="center" spacing={0} sx={{ cursor: 'pointer', py: 0.5, px: 2, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: config.secondaryColor }} />
                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.7rem', mt: 0.25 }}>Comment</Typography>
                </Stack>
                <Stack alignItems="center" spacing={0} sx={{ cursor: 'pointer', py: 0.5, px: 2, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ShareIcon sx={{ fontSize: 18, color: config.secondaryColor }} />
                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.7rem', mt: 0.25 }}>Share</Typography>
                </Stack>
            </Stack>
        </Paper>
    )

    // Render X (Twitter) Style
    const renderTwitter = () => (
        <Paper sx={{ bgcolor: config.cardBg, borderRadius: 2, overflow: 'hidden', maxWidth: 550, border: '1px solid #2f3336' }}>
            <Stack direction="row" spacing={1.5} sx={{ p: 2 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: config.accentColor }}>Y</Avatar>
                <Box sx={{ flex: 1 }}>
                    {/* Header */}
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography sx={{ color: config.textColor, fontWeight: 700, fontSize: '0.9rem' }}>
                            {userName}
                        </Typography>
                        <VerifiedIcon sx={{ fontSize: 16, color: config.accentColor }} />
                        <Typography sx={{ color: config.secondaryColor, fontSize: '0.9rem' }}>
                            @you · {getTimeAgo()}
                        </Typography>
                    </Stack>

                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.8rem', mt: 0.5, mb: 1 }}>
                        {instruction}
                    </Typography>
                    {renderGuidedQuestions()}
                    {renderExampleAnswers()}

                    {/* Tweet content */}
                    <TextField
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="What's happening?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        disabled={isSubmitted}
                        inputProps={{ maxLength: 280 }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: config.textColor,
                                fontSize: '1.1rem',
                                '& fieldset': { borderColor: 'transparent' },
                                '&:hover fieldset': { borderColor: 'transparent' }
                            }
                        }}
                    />

                    {/* Character count */}
                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.75rem', textAlign: 'right' }}>
                        {postContent.length}/280
                    </Typography>

                    {/* Actions */}
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, pl: 0 }}>
                        <IconButton size="small" sx={{ color: config.secondaryColor }}><ChatBubbleOutlineIcon sx={{ fontSize: 18 }} /></IconButton>
                        <IconButton size="small" sx={{ color: config.secondaryColor }}><RepeatIcon sx={{ fontSize: 18 }} /></IconButton>
                        <IconButton size="small" sx={{ color: config.secondaryColor }}><FavoriteBorderIcon sx={{ fontSize: 18 }} /></IconButton>
                        <IconButton size="small" sx={{ color: config.secondaryColor }}><ShareIcon sx={{ fontSize: 18 }} /></IconButton>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    )

    // Render LinkedIn Style
    const renderLinkedIn = () => (
        <Paper sx={{ bgcolor: config.cardBg, borderRadius: 2, overflow: 'hidden', maxWidth: 550, border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Header */}
            <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ p: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: config.accentColor }}>Y</Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: config.textColor, fontWeight: 600, fontSize: '0.9rem' }}>
                        {userName}
                    </Typography>
                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.75rem' }}>
                        Student | Learning English
                    </Typography>
                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.7rem' }}>
                        {getTimeAgo()} · 🌐
                    </Typography>
                </Box>
                <IconButton sx={{ color: config.secondaryColor }}><MoreHorizIcon /></IconButton>
            </Stack>

            {/* Post content */}
            <Box sx={{ px: 2, pb: 2 }}>
                <Typography sx={{ color: config.secondaryColor, fontSize: '0.8rem', mb: 1 }}>
                    {instruction}
                </Typography>
                {renderGuidedQuestions()}
                {renderExampleAnswers()}
                <TextField
                    multiline
                    rows={5}
                    fullWidth
                    placeholder="Share your thoughts..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    disabled={isSubmitted}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: config.textColor,
                            bgcolor: 'rgba(255,255,255,0.03)',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
                        }
                    }}
                />
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            {/* Reactions */}
            <Stack direction="row" justifyContent="space-between" sx={{ px: 2, py: 1 }}>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: 'pointer', py: 0.5, px: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ThumbUpOutlinedIcon sx={{ fontSize: 16, color: config.secondaryColor }} />
                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.75rem' }}>Like</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: 'pointer', py: 0.5, px: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: config.secondaryColor }} />
                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.75rem' }}>Comment</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: 'pointer', py: 0.5, px: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <RepeatIcon sx={{ fontSize: 16, color: config.secondaryColor }} />
                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.75rem' }}>Repost</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: 'pointer', py: 0.5, px: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <SendIcon sx={{ fontSize: 16, color: config.secondaryColor }} />
                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.75rem' }}>Send</Typography>
                </Stack>
            </Stack>
        </Paper>
    )

    // Render Reddit Style
    const renderReddit = () => (
        <Paper sx={{ bgcolor: config.cardBg, borderRadius: 1, overflow: 'hidden', maxWidth: 600, border: '1px solid #343536' }}>
            <Stack direction="row">
                {/* Vote column */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 1,
                    bgcolor: 'rgba(255,255,255,0.02)'
                }}>
                    <IconButton size="small" sx={{ color: config.secondaryColor }}><ArrowUpwardIcon /></IconButton>
                    <Typography sx={{ color: config.textColor, fontWeight: 600, fontSize: '0.8rem' }}>0</Typography>
                    <IconButton size="small" sx={{ color: config.secondaryColor }}><ArrowDownwardIcon /></IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, p: 1.5 }}>
                    {/* Header */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 20, height: 20, bgcolor: config.accentColor, fontSize: '0.6rem' }}>r/</Avatar>
                        <Typography sx={{ color: config.textColor, fontWeight: 600, fontSize: '0.75rem' }}>
                            r/EnglishLearning
                        </Typography>
                        <Typography sx={{ color: config.secondaryColor, fontSize: '0.7rem' }}>
                            • Posted by u/{userName.toLowerCase()} • {getTimeAgo()}
                        </Typography>
                    </Stack>

                    <Typography sx={{ color: config.secondaryColor, fontSize: '0.8rem', mt: 1, mb: 0.5 }}>
                        {instruction}
                    </Typography>
                    {renderGuidedQuestions()}
                    {renderExampleAnswers()}

                    {/* Post content */}
                    <TextField
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Write your post..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        disabled={isSubmitted}
                        sx={{
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                                color: config.textColor,
                                bgcolor: 'rgba(255,255,255,0.03)',
                                '& fieldset': { borderColor: '#343536' }
                            }
                        }}
                    />

                    {/* Actions */}
                    <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                        <Button size="small" startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />} sx={{ color: config.secondaryColor, textTransform: 'none', fontSize: '0.75rem' }}>
                            0 Comments
                        </Button>
                        <Button size="small" startIcon={<ShareIcon sx={{ fontSize: 16 }} />} sx={{ color: config.secondaryColor, textTransform: 'none', fontSize: '0.75rem' }}>
                            Share
                        </Button>
                        <Button size="small" startIcon={<BookmarkBorderIcon sx={{ fontSize: 16 }} />} sx={{ color: config.secondaryColor, textTransform: 'none', fontSize: '0.75rem' }}>
                            Save
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    )

    // Render the selected platform
    const renderPlatform = () => {
        switch (platform) {
            case 'instagram': return renderInstagram()
            case 'facebook': return renderFacebook()
            case 'twitter': return renderTwitter()
            case 'linkedin': return renderLinkedIn()
            case 'reddit': return renderReddit()
            default: return renderInstagram()
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            py: 2
        }}>
            {/* Platform badge */}
            <Chip
                label={`📱 ${config.name}`}
                sx={{
                    bgcolor: config.accentColor,
                    color: 'white',
                    fontWeight: 600
                }}
            />

            {/* Platform UI */}
            {renderPlatform()}

            {/* Word count & Submit */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ color: isValid ? '#4ade80' : '#f87171', fontSize: '0.85rem' }}>
                    {wordCount} / {minWords} words minimum
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitted}
                    sx={{
                        bgcolor: config.accentColor,
                        '&:hover': { bgcolor: config.accentColor, filter: 'brightness(1.1)' }
                    }}
                >
                    {isSubmitted ? '✓ Posted!' : 'Post'}
                </Button>
            </Stack>
        </Box>
    )
}
