import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { CharacterMessage } from '../../components/Avatar.jsx'
import SentenceEvaluator from '../../components/SentenceEvaluator.jsx'

/**
 * Phase 4 Step 1 Interaction 3: Using "slogan" in context with AI evaluation
 * Instructor: Emna
 */

const EXAMPLE_SENTENCES = {
    A1: 'Slogan good.',
    A2: 'The poster has slogan.',
    B1: 'We need a catchy slogan for the poster to attract students.',
    B2: 'A strong slogan like "Discover Global Cultures!" would make the poster more eye-catching and memorable.',
    C1: 'An effective slogan, such as "Unite in Diversity: Experience the World," would encapsulate the festival\'s ethos, enhancing the poster\'s persuasive impact and complementing the video\'s dynamic features.'
}

export default function Phase4Step1Interaction3() {
    const navigate = useNavigate()
    const [completed, setCompleted] = useState(false)
    const [evaluationResult, setEvaluationResult] = useState(null)

    const handleSentenceComplete = async (result) => {
        console.log('Sentence evaluation completed:', result)
        setCompleted(true)
        setEvaluationResult(result)

        // Calculate total score for Phase 4 Step 1
        try {
            // Retrieve scores from sessionStorage
            const interaction1Score = parseInt(sessionStorage.getItem('phase4_step1_interaction1_score') || '0')
            const interaction2Score = parseInt(sessionStorage.getItem('phase4_step1_interaction2_score') || '0')
            const interaction3Score = result.score || 1

            console.log('=== Phase 4 Step 1 - All Scores ===')
            console.log('Interaction 1 Score:', interaction1Score)
            console.log('Interaction 2 Score:', interaction2Score)
            console.log('Interaction 3 Score:', interaction3Score)

            // Send to backend for scoring and terminal logging
            const response = await fetch('/api/phase4/step/1/calculate-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    interaction1_score: interaction1Score,
                    interaction2_score: interaction2Score,
                    interaction3_score: interaction3Score
                })
            })

            const data = await response.json()

            if (data.success) {
                console.log('Backend scoring response:', data.data)
                console.log('Total Score:', data.data.total.score, '/', data.data.total.max_score)
                console.log('Remedial Level:', data.data.total.remedial_level)

                // Store remedial level for navigation
                const remedialLevel = data.data.total.remedial_level
                sessionStorage.setItem('phase4_remedial_level', remedialLevel)

                // Clear interaction scores after successful calculation
                sessionStorage.removeItem('phase4_step1_interaction1_score')
                sessionStorage.removeItem('phase4_step1_interaction2_score')
            } else {
                console.error('Error calculating score:', data.error)
            }
        } catch (error) {
            console.error('Failed to calculate total score:', error)
        }
    }

    const handleContinue = () => {
        // Check remedial level and redirect accordingly
        const remedialLevel = sessionStorage.getItem('phase4_remedial_level')

        console.log('=== NAVIGATION DEBUG ===')
        console.log('Remedial Level from sessionStorage:', remedialLevel)

        if (remedialLevel === 'Remedial A1') {
            console.log('Navigating to: /app/phase4/remedial/a1/taskA')
            navigate('/app/phase4/remedial/a1/taskA')
        } else if (remedialLevel === 'Remedial A2') {
            console.log('Navigating to: /app/phase4/remedial/a2/taskA')
            navigate('/app/phase4/remedial/a2/taskA')
        } else if (remedialLevel === 'Remedial B1') {
            console.log('Navigating to: /app/phase4/remedial/b1/taskA')
            navigate('/app/phase4/remedial/b1/taskA')
        } else if (remedialLevel === 'Remedial B2') {
            console.log('Navigating to: /app/phase4/remedial/b2/taskA')
            navigate('/app/phase4/remedial/b2/taskA')
        } else if (remedialLevel === 'Remedial C1') {
            console.log('Navigating to: /app/phase4/remedial/c1/taskA')
            navigate('/app/phase4/remedial/c1/taskA')
        } else {
            // Default: go to dashboard
            console.log('No remedial level found, navigating to dashboard')
            navigate('/app/dashboard')
        }
    }

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}
            >
                <Typography variant="h4" gutterBottom>
                    Phase 4: Marketing & Promotion
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Step 1: Engage - Interaction 3
                </Typography>
                <Typography variant="body1">
                    Write one sentence using the word <strong>"slogan"</strong> to promote the Global Cultures
                    Festival.
                </Typography>
            </Paper>

            {/* Instructor Message */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <CharacterMessage
                    speaker="Emna"
                    message="Great practice! Now, let's use one of our target words—'slogan'—in a sentence about our festival promotion, inspired by the poster and video examples."
                />
            </Paper>

            {/* Sentence Evaluator Component */}
            <SentenceEvaluator
                targetWord="slogan"
                hint="Start with 'Our slogan could be...' or 'The poster needs a slogan like...'"
                exampleSentences={EXAMPLE_SENTENCES}
                onComplete={handleSentenceComplete}
            />

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                {completed && (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleContinue}
                        size="large"
                    >
                        Continue to Remedial Phase
                    </Button>
                )}
            </Stack>
        </Box>
    )
}


