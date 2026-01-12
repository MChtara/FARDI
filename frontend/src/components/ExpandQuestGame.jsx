import React, { useState } from 'react'
import { Box, Paper, Typography, TextField, Button, Stack, LinearProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ParkIcon from '@mui/icons-material/Park'

/**
 * Expand Quest Game Component
 * Expand sentences with connectors to "grow" a virtual tree
 * Longer expansions give taller tree
 */

const ExpandQuestGame = ({ prompts = [], onComplete }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [userInput, setUserInput] = useState(prompts[0]?.prompt ? `${prompts[0].prompt} ` : '')
  const [completedPrompts, setCompletedPrompts] = useState([])
  const [gameComplete, setGameComplete] = useState(false)
  const [treeHeight, setTreeHeight] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [totalScore, setTotalScore] = useState(0)

  const currentPrompt = prompts[currentPromptIndex]

  const evaluateExpansion = (input, prompt) => {
    const inputLower = input.toLowerCase().trim()

    // Check if user included required connector (because or and)
    const hasConnector = inputLower.includes('because') || inputLower.includes(' and ')

    // Check if sentence is expanded (contains more words than just the prompt)
    const promptWords = prompt.toLowerCase().split(/\s+/).length
    const inputWords = inputLower.split(/\s+/).length
    const isExpanded = inputWords > promptWords

    // Check for logical addition (added meaningful content)
    const addedContent = inputWords - promptWords >= 2 // At least 2 new words

    // Check if includes promotion vocabulary (poster, video, etc.)
    const hasPromotionTerms = /poster|video|slogan|billboard|commercial|eye-catcher|feature|ad/i.test(input)

    return {
      hasConnector,
      isExpanded,
      addedContent,
      hasPromotionTerms,
      isValid: hasConnector && isExpanded && addedContent
    }
  }

  const handleSkip = () => {
    // Skip without points
    const newCompletedPrompts = [...completedPrompts, {
      prompt: currentPrompt.prompt,
      userAnswer: '[Skipped]',
      growth: 0,
      score: 0,
      hasPromotionTerms: false,
      skipped: true
    }]

    setCompletedPrompts(newCompletedPrompts)
    setFeedback('')

    // Move to next or complete
    if (currentPromptIndex + 1 < prompts.length) {
      const nextPrompt = prompts[currentPromptIndex + 1]
      setUserInput(`${nextPrompt.prompt} `)
      setTimeout(() => {
        setCurrentPromptIndex(currentPromptIndex + 1)
      }, 500)
    } else {
      // Game complete
      setUserInput('')
      setTimeout(() => {
        setGameComplete(true)
        if (onComplete) {
          const withPromotionTerms = newCompletedPrompts.filter(p => p.hasPromotionTerms).length
          const meetsRequirement = withPromotionTerms >= 4

          onComplete({
            score: Math.round(totalScore),
            totalPrompts: prompts.length,
            treeHeight: treeHeight,
            completed: true,
            meetsRequirement: meetsRequirement,
            promotionTermsCount: withPromotionTerms
          })
        }
      }, 800)
    }
  }

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setFeedback('Please write a sentence.')
      return
    }

    // Check if user just left the prompt without adding anything
    if (userInput.trim() === currentPrompt.prompt.trim()) {
      setFeedback('Please expand the sentence by adding "because" or "and" with more information.')
      return
    }

    // First do basic validation
    const evaluation = evaluateExpansion(userInput, currentPrompt.prompt)

    if (!evaluation.isValid) {
      // Provide specific feedback for basic errors
      if (!evaluation.hasConnector) {
        setFeedback('Please use "because" or "and" to connect your ideas.')
      } else if (!evaluation.addedContent) {
        setFeedback('Please add more details to expand the sentence (at least 2 more words).')
      } else {
        setFeedback('Please expand the sentence by adding logical information.')
      }
      return
    }

    // If basic validation passes, use AI to evaluate quality
    setFeedback('Evaluating your expansion...')

    try {
      const response = await fetch('/api/evaluate-expansion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          prompt: currentPrompt.prompt,
          expansion: userInput,
          example: currentPrompt.example
        })
      })

      const result = await response.json()

      if (result.isValid) {
        // AI says it's good! Fixed growth: 20px, score: +1
        const growth = 20
        const score = 1

        const newCompletedPrompts = [...completedPrompts, {
          prompt: currentPrompt.prompt,
          userAnswer: userInput,
          growth: growth,
          score: score,
          hasPromotionTerms: evaluation.hasPromotionTerms,
          aiFeedback: result.feedback
        }]

        setCompletedPrompts(newCompletedPrompts)
        setTreeHeight(treeHeight + growth)
        setTotalScore(totalScore + score)
        setFeedback('')

        // Move to next or complete
        if (currentPromptIndex + 1 < prompts.length) {
          const nextPrompt = prompts[currentPromptIndex + 1]
          setUserInput(`${nextPrompt.prompt} `)
          setTimeout(() => {
            setCurrentPromptIndex(currentPromptIndex + 1)
          }, 800)
        } else {
          // Game complete! Calculate final score
          setUserInput('')
          setTimeout(() => {
            setGameComplete(true)
            if (onComplete) {
              // Count how many have poster/video terms
              const withPromotionTerms = newCompletedPrompts.filter(p => p.hasPromotionTerms).length
              const meetsRequirement = withPromotionTerms >= 4 // Must have poster/video in at least 4

              onComplete({
                score: Math.round(totalScore + score),
                totalPrompts: prompts.length,
                treeHeight: treeHeight + growth,
                completed: true,
                meetsRequirement: meetsRequirement,
                promotionTermsCount: withPromotionTerms
              })
            }
          }, 1000)
        }
      } else {
        // AI says it needs improvement
        setFeedback(result.feedback || 'Please try to make your expansion more logical and meaningful.')
      }
    } catch (error) {
      console.error('AI evaluation failed:', error)
      // Fallback to accepting if basic validation passed
      setFeedback('Could not evaluate with AI. Your expansion looks good based on basic checks!')

      // Accept the answer with fixed growth: 20px, score: +1
      const growth = 20
      const score = 1

      const newCompletedPrompts = [...completedPrompts, {
        prompt: currentPrompt.prompt,
        userAnswer: userInput,
        growth: growth,
        score: score,
        hasPromotionTerms: evaluation.hasPromotionTerms
      }]

      setCompletedPrompts(newCompletedPrompts)
      setTreeHeight(treeHeight + growth)
      setTotalScore(totalScore + score)
      setFeedback('')

      if (currentPromptIndex + 1 < prompts.length) {
        const nextPrompt = prompts[currentPromptIndex + 1]
        setUserInput(`${nextPrompt.prompt} `)
        setTimeout(() => {
          setCurrentPromptIndex(currentPromptIndex + 1)
        }, 800)
      } else {
        setUserInput('')
        setTimeout(() => {
          setGameComplete(true)
          if (onComplete) {
            const withPromotionTerms = newCompletedPrompts.filter(p => p.hasPromotionTerms).length
            const meetsRequirement = withPromotionTerms >= 4

            onComplete({
              score: Math.round(totalScore + score),
              totalPrompts: prompts.length,
              treeHeight: treeHeight + growth,
              completed: true,
              meetsRequirement: meetsRequirement,
              promotionTermsCount: withPromotionTerms
            })
          }
        }, 1000)
      }
    }
  }

  if (gameComplete) {
    const promotionTermsCount = completedPrompts.filter(p => p.hasPromotionTerms).length
    const meetsRequirement = promotionTermsCount >= 4

    return (
      <Paper elevation={6} sx={{ p: 6, textAlign: 'center', backgroundColor: meetsRequirement ? 'success.light' : 'warning.light' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color={meetsRequirement ? 'success.dark' : 'warning.dark'}>
          🌳 Expand Quest Complete!
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Your tree grew to {treeHeight}px tall!
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Final Score: {totalScore} points
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You expanded all {prompts.length} sentences!
        </Typography>

        {/* Requirement Check */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: meetsRequirement ? 'success.main' : 'warning.main' }}>
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
            Promotion Vocabulary Used: {promotionTermsCount} / 8
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            {meetsRequirement
              ? '✓ Great! You used poster/video/promotional terms in at least 4 sentences!'
              : '⚠ Try to use more promotional vocabulary (poster, video, billboard, etc.) in your expansions.'}
          </Typography>
        </Paper>

        {/* Final Tree */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <ParkIcon sx={{ fontSize: Math.min(treeHeight, 300), color: meetsRequirement ? 'success.dark' : 'warning.dark' }} />
        </Box>
      </Paper>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto' }}>
      {/* Progress */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: 'success.light' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body1" fontWeight="bold" color="success.dark">
            Progress: {completedPrompts.length} / {prompts.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(completedPrompts.length / prompts.length) * 100}
            sx={{ flexGrow: 1, height: 10, borderRadius: 1 }}
            color="success"
          />
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <ParkIcon sx={{ color: 'success.dark' }} />
            <Typography variant="body2" fontWeight="bold" color="success.dark">
              {treeHeight}px
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Tree Growth Visualization */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center', backgroundColor: 'grey.50', minHeight: 200 }}>
        <Typography variant="h6" gutterBottom>
          Your Growing Tree
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: 150 }}>
          <ParkIcon
            sx={{
              fontSize: Math.max(treeHeight, 40),
              color: 'success.main',
              transition: 'font-size 0.5s ease-out'
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Expand sentences to make your tree grow taller!
        </Typography>
      </Paper>

      {/* Current Prompt */}
      <Paper elevation={4} sx={{ p: 3, mb: 3, backgroundColor: 'primary.light' }}>
        <Typography variant="h6" gutterBottom color="primary.dark">
          Expand this sentence:
        </Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: 'primary.dark' }}>
          "{currentPrompt?.prompt}"
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          💡 Use "because" or "and" to add more information
        </Typography>
      </Paper>

      {/* Input Area */}
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          label="Your expanded sentence"
          placeholder="Expand the sentence using 'because' or 'and'..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          sx={{ mb: 2 }}
        />

        {feedback && (
          <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
            {feedback}
          </Typography>
        )}

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!userInput.trim() || userInput.trim() === currentPrompt?.prompt?.trim()}
            size="large"
            sx={{ flexGrow: 1 }}
          >
            Submit Expansion
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSkip}
            size="large"
            sx={{ minWidth: 120 }}
          >
            Skip (0 pts)
          </Button>
        </Stack>
      </Paper>

      {/* Completed Prompts */}
      {completedPrompts.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Completed Expansions:
          </Typography>
          <Stack spacing={2}>
            {completedPrompts.map((item, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 2,
                  backgroundColor: item.skipped ? 'grey.200' : 'success.light',
                  border: '2px solid',
                  borderColor: item.skipped ? 'grey.400' : 'success.main'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <CheckCircleIcon sx={{ color: item.skipped ? 'grey.600' : 'success.dark', mt: 0.5 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Prompt: "{item.prompt}"
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" color={item.skipped ? 'text.secondary' : 'text.primary'}>
                      {item.userAnswer}
                    </Typography>
                  </Box>
                  <Stack alignItems="center">
                    <ParkIcon sx={{ color: item.skipped ? 'grey.600' : 'success.dark', fontSize: 30 }} />
                    <Typography variant="caption" color={item.skipped ? 'grey.700' : 'success.dark'} fontWeight="bold">
                      +{item.growth}px
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default ExpandQuestGame
