/**
 * Sentence Builder Game - Premium Edition
 * An animated drag-and-drop word construction game with snap animations,
 * color-coded parts of speech, progressive difficulty, and star ratings.
 */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { motion, AnimatePresence, Reorder } from 'framer-motion'

// ─── CONSTANTS ───────────────────────────────────────────────
const WORD_COLORS = [
  'linear-gradient(135deg, #667eea, #764ba2)', // purple
  'linear-gradient(135deg, #f093fb, #f5576c)', // pink
  'linear-gradient(135deg, #4facfe, #00f2fe)', // blue
  'linear-gradient(135deg, #43e97b, #38f9d7)', // green
  'linear-gradient(135deg, #fa709a, #fee140)', // gold-pink
  'linear-gradient(135deg, #a18cd1, #fbc2eb)', // lavender
  'linear-gradient(135deg, #ffecd2, #fcb69f)', // peach
  'linear-gradient(135deg, #ff9a9e, #fecfef)', // rose
]

const CONFETTI_COLORS = ['#ffd740', '#00e676', '#ff4081', '#448aff', '#e040fb', '#ff6e40', '#69f0ae', '#40c4ff']

// ─── HELPERS ─────────────────────────────────────────────────
function getWordColor(index) {
  return WORD_COLORS[index % WORD_COLORS.length]
}

function extractTargetWords(template, answer) {
  if (!answer || !template) return []
  const cleanAnswer = answer.replace(/^\d+\.\s*/, '').trim()
  const cleanTemplate = template.replace(/^\d+\.\s*/, '').trim()
  const gapMatches = cleanTemplate.match(/_{3,}/g) || []
  if (gapMatches.length === 0) return []

  const templateParts = cleanTemplate.split(/_{3,}/)
  const targetWords = []
  let remainingAnswer = cleanAnswer

  for (let i = 0; i < templateParts.length; i++) {
    const part = templateParts[i].trim()
    if (part) {
      const partIndex = remainingAnswer.toLowerCase().indexOf(part.toLowerCase())
      if (partIndex > 0) {
        const gapWord = remainingAnswer.substring(0, partIndex).trim().replace(/[.,!?]$/g, '')
        if (gapWord) targetWords.push(gapWord)
      }
      if (partIndex >= 0) {
        remainingAnswer = remainingAnswer.substring(partIndex + part.length).trim()
      }
    }
  }
  if (remainingAnswer.trim()) {
    targetWords.push(remainingAnswer.trim().replace(/[.,!?]$/g, ''))
  }
  return targetWords
}

function generateDistractors(targetWords) {
  const allDistractors = [
    'they', 'we', 'and', 'the', 'for', 'with', 'very', 'also',
    'have', 'been', 'will', 'can', 'should', 'must', 'might',
    'not', 'but', 'from', 'into', 'about', 'some', 'more',
    'just', 'only', 'even', 'still', 'both', 'such', 'much',
  ]
  const targetLower = targetWords.map(w => w.toLowerCase())
  const available = allDistractors.filter(d => !targetLower.includes(d))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(3, shuffled.length))
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── STYLES ──────────────────────────────────────────────────
const styles = {
  container: {
    maxWidth: 900,
    mx: 'auto',
    userSelect: 'none',
  },
  gameBoard: {
    background: 'linear-gradient(145deg, #1a1a2e, #16213e, #0f3460)',
    borderRadius: 4,
    p: { xs: 2, sm: 3 },
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    minHeight: 500,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
  },
  progressBar: {
    display: 'flex',
    gap: 0.8,
    justifyContent: 'center',
    mb: 3,
  },
  progressDot: (active, completed) => ({
    width: active ? 36 : 28,
    height: 8,
    borderRadius: 4,
    background: completed
      ? 'linear-gradient(90deg, #00e676, #69f0ae)'
      : active
        ? 'linear-gradient(90deg, #ffd740, #ffab00)'
        : 'rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
    boxShadow: completed
      ? '0 0 10px rgba(0,230,118,0.3)'
      : active
        ? '0 0 10px rgba(255,215,64,0.3)'
        : 'none',
  }),
  sentenceArea: {
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    mb: 3,
    minHeight: 120,
  },
  templateText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: { xs: '1rem', sm: '1.2rem' },
    lineHeight: 2.8,
    fontWeight: 500,
  },
  gap: (active, filled, correct, wrong) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: { xs: 80, sm: 100 },
    minHeight: 44,
    px: 2,
    mx: 0.5,
    borderRadius: 2,
    border: '2px dashed',
    borderColor: wrong
      ? '#ff4757'
      : correct
        ? '#00e676'
        : filled
          ? '#4facfe'
          : active
            ? '#ffd740'
            : 'rgba(255,255,255,0.2)',
    borderStyle: filled ? 'solid' : 'dashed',
    background: wrong
      ? 'rgba(255,71,87,0.15)'
      : correct
        ? 'rgba(0,230,118,0.15)'
        : filled
          ? 'rgba(79,172,254,0.1)'
          : active
            ? 'rgba(255,215,64,0.08)'
            : 'rgba(255,255,255,0.03)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    verticalAlign: 'middle',
    position: 'relative',
    '&:hover': {
      borderColor: filled ? '#ff4757' : '#ffd740',
      background: filled ? 'rgba(255,71,87,0.1)' : 'rgba(255,215,64,0.08)',
    },
  }),
  wordBank: {
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    mb: 3,
  },
  wordChip: (color, used) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 2.5,
    py: 1.2,
    borderRadius: 2,
    fontSize: { xs: '0.85rem', sm: '1rem' },
    fontWeight: 700,
    letterSpacing: 0.5,
    background: used ? 'rgba(255,255,255,0.04)' : color,
    color: used ? 'rgba(255,255,255,0.2)' : '#fff',
    cursor: used ? 'default' : 'pointer',
    boxShadow: used ? 'none' : '0 4px 15px rgba(0,0,0,0.3)',
    transform: used ? 'scale(0.9)' : 'scale(1)',
    transition: 'all 0.2s ease',
    textShadow: used ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
    border: used ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0.15)',
  }),
  placedWord: {
    fontSize: { xs: '0.85rem', sm: '0.95rem' },
    fontWeight: 700,
    color: '#fff',
    letterSpacing: 0.5,
  },
  gapNumber: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#ffd740',
    color: '#1a1a2e',
    fontSize: '0.65rem',
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(255,215,64,0.4)',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    mt: 2,
  },
  scorePanel: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  starContainer: {
    display: 'flex',
    gap: 0.5,
  },
}

// ─── WORD CHIP COMPONENT ─────────────────────────────────────
function WordChipButton({ word, colorIndex, used, onClick }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{
        scale: used ? 0.9 : 1,
        rotate: 0,
        opacity: used ? 0.4 : 1,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileHover={used ? {} : { scale: 1.08, y: -3 }}
      whileTap={used ? {} : { scale: 0.92 }}
      style={{ display: 'inline-block' }}
    >
      <Box
        onClick={() => !used && onClick()}
        sx={styles.wordChip(getWordColor(colorIndex), used)}
      >
        {word}
      </Box>
    </motion.div>
  )
}

// ─── SCORE POPUP ─────────────────────────────────────────────
function ScorePopup({ text, color = '#ffd740' }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -100, scale: 1.8 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 30,
        color,
        fontWeight: 900,
        fontSize: '2.2rem',
        textShadow: `0 2px 20px ${color}60`,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </motion.div>
  )
}

// ─── CONFETTI ────────────────────────────────────────────────
function Confetti({ count = 30 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
          }}
          animate={{
            opacity: 0,
            x: (Math.random() - 0.5) * 400,
            y: Math.random() * -300 - 50,
            rotate: Math.random() * 720 - 360,
            scale: 0,
          }}
          transition={{
            duration: 1.2 + Math.random() * 0.5,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />
      ))}
    </>
  )
}

// ─── STAR RATING ────────────────────────────────────────────
function StarRating({ filled, total = 3 }) {
  return (
    <Box sx={styles.starContainer}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
            ...(i < filled ? {} : {}),
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay: i * 0.15 + 0.3,
          }}
        >
          <Typography
            sx={{
              fontSize: '1.5rem',
              filter: i < filled ? 'none' : 'grayscale(1) opacity(0.3)',
              transition: 'filter 0.3s ease',
            }}
          >
            {'\u2B50'}
          </Typography>
        </motion.div>
      ))}
    </Box>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function SentenceBuilder({ exercise, onComplete, onProgress }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedWords, setSelectedWords] = useState({})
  const [availableWords, setAvailableWords] = useState([])
  const [activeGap, setActiveGap] = useState(0)
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [completedSentences, setCompletedSentences] = useState([])
  const [sentenceResults, setSentenceResults] = useState([]) // { correct: boolean }[]
  const [popups, setPopups] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [correctWords, setCorrectWords] = useState(null) // for showing correct answer on wrong
  const popupIdRef = useRef(0)

  const templates = exercise?.templates || []
  const correctAnswers = exercise?.correct_answers || []
  const currentTemplate = templates[currentIndex] || ''
  const currentAnswer = correctAnswers[currentIndex] || ''

  // Extract target words
  const targetWords = useMemo(
    () => extractTargetWords(currentTemplate, currentAnswer),
    [currentTemplate, currentAnswer]
  )

  // Count gaps
  const gapCount = useMemo(
    () => (currentTemplate.match(/_{3,}/g) || []).length,
    [currentTemplate]
  )

  // Generate word bank when sentence changes
  useEffect(() => {
    if (targetWords.length === 0) return

    const distractors = generateDistractors(targetWords)
    const allWords = [...targetWords, ...distractors]
    const shuffled = shuffleArray(allWords)

    setAvailableWords(
      shuffled.map((word, idx) => ({
        id: `${currentIndex}-${idx}`,
        word,
        used: false,
        colorIndex: idx,
      }))
    )
    setSelectedWords({})
    setActiveGap(0)
    setFeedback(null)
    setCorrectWords(null)
  }, [currentIndex, targetWords])

  // Add popup
  const addPopup = useCallback((text, color) => {
    const id = ++popupIdRef.current
    setPopups(prev => [...prev, { id, text, color }])
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 1100)
  }, [])

  // Handle word click
  const handleWordClick = useCallback((wordObj) => {
    if (wordObj.used || feedback) return
    if (selectedWords[activeGap]) return

    setSelectedWords(prev => ({ ...prev, [activeGap]: wordObj }))
    setAvailableWords(prev =>
      prev.map(w => w.id === wordObj.id ? { ...w, used: true } : w)
    )

    // Auto-advance to next empty gap
    for (let i = 1; i <= gapCount; i++) {
      const nextGap = (activeGap + i) % gapCount
      if (!selectedWords[nextGap] && nextGap !== activeGap) {
        setActiveGap(nextGap)
        break
      }
    }
  }, [activeGap, selectedWords, gapCount, feedback])

  // Handle removing a word from a gap
  const handleRemoveWord = useCallback((gapIndex) => {
    if (feedback) return
    const wordObj = selectedWords[gapIndex]
    if (!wordObj) return

    setSelectedWords(prev => {
      const next = { ...prev }
      delete next[gapIndex]
      return next
    })
    setAvailableWords(prev =>
      prev.map(w => w.id === wordObj.id ? { ...w, used: false } : w)
    )
    setActiveGap(gapIndex)
  }, [selectedWords, feedback])

  // Check answers
  const checkAnswers = useCallback(() => {
    const userWords = []
    for (let i = 0; i < gapCount; i++) {
      const wordObj = selectedWords[i]
      userWords.push(wordObj ? wordObj.word.toLowerCase() : '')
    }

    const targetLower = targetWords.map(w => w.toLowerCase())
    let correctCount = 0
    userWords.forEach((word, idx) => {
      if (word === targetLower[idx]) correctCount++
    })

    const allCorrect = correctCount === gapCount && gapCount > 0

    if (allCorrect) {
      const points = 1
      setScore(prev => prev + points)
      setFeedback('correct')
      setCompletedSentences(prev => [...prev, currentIndex])
      setSentenceResults(prev => [...prev, { correct: true }])
      setShowConfetti(true)
      addPopup('+1 PERFECT!', '#00e676')
      setTimeout(() => setShowConfetti(false), 1200)

      if (onProgress) onProgress({ correct: true, score: score + points })

      setTimeout(() => {
        if (currentIndex < templates.length - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          handleComplete(score + points)
        }
      }, 1800)
    } else {
      setFeedback('wrong')
      setCorrectWords(targetWords)
      setSentenceResults(prev => [...prev, { correct: false }])
      addPopup('Not quite...', '#ff4757')

      if (onProgress) onProgress({ correct: false, score })

      setTimeout(() => {
        if (currentIndex < templates.length - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          handleComplete(score)
        }
      }, 2500)
    }
  }, [selectedWords, targetWords, gapCount, currentIndex, templates.length, score, onProgress])

  // Handle game complete
  const handleComplete = useCallback((finalScore) => {
    setCompleted(true)
    if (onComplete) {
      onComplete({
        score: finalScore,
        totalSentences: templates.length,
      })
    }
    window.dispatchEvent(new CustomEvent('xp-awarded', {
      detail: { xp_amount: finalScore + 50, reason: 'sentence_builder_complete' }
    }))
  }, [templates.length, onComplete])

  // Reset game
  const handleReset = useCallback(() => {
    setSelectedWords({})
    setAvailableWords(prev => prev.map(w => ({ ...w, used: false })))
    setFeedback(null)
    setCorrectWords(null)
    setActiveGap(0)
  }, [])

  // Play again from start
  const handlePlayAgain = () => {
    setCompleted(false)
    setCurrentIndex(0)
    setScore(0)
    setCompletedSentences([])
    setSentenceResults([])
    setPopups([])
    setFeedback(null)
    setCorrectWords(null)
  }

  // All gaps filled?
  const allFilled = Object.keys(selectedWords).length >= gapCount

  // Render template with interactive gaps
  const renderTemplate = () => {
    const cleanTemplate = currentTemplate.replace(/^\d+\.\s*/, '')
    const parts = cleanTemplate.split(/_{3,}/)

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            {part && (
              <Typography component="span" sx={styles.templateText}>
                {part}
              </Typography>
            )}
            {idx < parts.length - 1 && (
              <motion.div
                style={{ display: 'inline-flex', position: 'relative' }}
                animate={
                  activeGap === idx && !selectedWords[idx] && !feedback
                    ? { scale: [1, 1.03, 1] }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Box
                  sx={styles.gap(
                    activeGap === idx && !feedback,
                    !!selectedWords[idx],
                    feedback === 'correct' && !!selectedWords[idx],
                    feedback === 'wrong' && !!selectedWords[idx]
                  )}
                  onClick={() => {
                    if (feedback) return
                    if (selectedWords[idx]) {
                      handleRemoveWord(idx)
                    } else {
                      setActiveGap(idx)
                    }
                  }}
                >
                  {/* Gap number badge */}
                  {!selectedWords[idx] && !feedback && (
                    <Box sx={styles.gapNumber}>{idx + 1}</Box>
                  )}

                  <AnimatePresence mode="popLayout">
                    {selectedWords[idx] ? (
                      <motion.div
                        key={selectedWords[idx].id}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: -10 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      >
                        <Typography sx={styles.placedWord}>
                          {selectedWords[idx].word}
                        </Typography>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}
                      >
                        {activeGap === idx ? 'tap a word' : `gap ${idx + 1}`}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Box>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </Box>
    )
  }

  // ─── RENDER: COMPLETED ─────────────────────────────────────
  if (completed) {
    const stars = score === templates.length ? 3 : score >= templates.length * 0.6 ? 2 : score > 0 ? 1 : 0

    return (
      <Box sx={styles.container}>
        <Box sx={styles.gameBoard}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Typography sx={{ fontSize: '4rem', mb: 1 }}>
                {stars === 3 ? '\uD83C\uDFC6' : stars === 2 ? '\u2B50' : stars === 1 ? '\uD83D\uDC4D' : '\uD83D\uDCAA'}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Typography
                variant="h4"
                sx={{ color: '#ffd740', fontWeight: 900, mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}
              >
                {stars === 3 ? 'PERFECT!' : stars === 2 ? 'GREAT JOB!' : stars === 1 ? 'GOOD EFFORT!' : 'KEEP PRACTICING!'}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <StarRating filled={stars} />
            </motion.div>

            {/* Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, my: 4 }}>
              {[
                { label: 'Score', value: score, color: '#ffd740' },
                { label: 'Correct', value: sentenceResults.filter(r => r.correct).length, color: '#00e676' },
                { label: 'Total', value: templates.length, color: '#448aff' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.12 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: stat.color, fontWeight: 900, fontSize: '2.2rem' }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 2 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {/* Sentence results */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
              {sentenceResults.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.08 }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: r.correct
                        ? 'linear-gradient(135deg, #00c853, #00e676)'
                        : 'linear-gradient(135deg, #ff4757, #ff6b81)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      boxShadow: r.correct
                        ? '0 2px 10px rgba(0,230,118,0.3)'
                        : '0 2px 10px rgba(255,71,87,0.3)',
                    }}
                  >
                    {r.correct ? '\u2713' : '\u2717'}
                  </Box>
                </motion.div>
              ))}
            </Box>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handlePlayAgain}
                sx={{
                  px: 5, py: 1.5, fontWeight: 700, borderRadius: 3,
                  background: 'rgba(255,255,255,0.1)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '1rem',
                  '&:hover': { background: 'rgba(255,255,255,0.15)' },
                }}
              >
                PLAY AGAIN
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Box>
    )
  }

  // ─── RENDER: NO TEMPLATES ─────────────────────────────────
  if (templates.length === 0) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.gameBoard}>
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>
              No sentences available for this exercise.
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  // ─── RENDER: GAME ──────────────────────────────────────────
  return (
    <Box sx={styles.container}>
      <Box sx={styles.gameBoard}>
        {/* Popups & Effects */}
        <AnimatePresence>
          {popups.map(p => <ScorePopup key={p.id} text={p.text} color={p.color} />)}
          {showConfetti && <Confetti key="confetti" />}
        </AnimatePresence>

        {/* Header */}
        <Box sx={styles.header}>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 2 }}>
              Sentence Builder
            </Typography>
            <Typography sx={{ color: '#ffd740', fontWeight: 900, fontSize: '1.3rem', lineHeight: 1 }}>
              {exercise?.instruction || 'Complete the sentences'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 2 }}>
              Score
            </Typography>
            <Typography sx={{ color: '#ffd740', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>
              {score}/{templates.length}
            </Typography>
          </Box>
        </Box>

        {/* Progress bar */}
        <Box sx={styles.progressBar}>
          {templates.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Box sx={styles.progressDot(idx === currentIndex, completedSentences.includes(idx))} />
            </motion.div>
          ))}
        </Box>

        {/* Sentence counter */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 2 }}>
            Sentence {currentIndex + 1} of {templates.length}
          </Typography>
        </Box>

        {/* Sentence template with gaps */}
        <Box sx={styles.sentenceArea}>
          {renderTemplate()}
        </Box>

        {/* Gap indicator */}
        {!feedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography sx={{
                color: '#ffd740',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}>
                {allFilled
                  ? 'All gaps filled! Click "Check" to verify.'
                  : `Filling gap ${activeGap + 1} of ${gapCount} \u2022 Tap a word below`}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Correct answer reveal */}
        {feedback === 'wrong' && correctWords && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Box sx={{
              textAlign: 'center',
              mb: 2,
              p: 2,
              borderRadius: 2,
              background: 'rgba(255,71,87,0.1)',
              border: '1px solid rgba(255,71,87,0.2)',
            }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 2, mb: 0.5 }}>
                Correct Answer
              </Typography>
              <Typography sx={{ color: '#ff6b81', fontWeight: 700, fontSize: '1rem' }}>
                {correctWords.join(' \u2022 ')}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Correct animation feedback */}
        {feedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Box sx={{
              textAlign: 'center',
              mb: 2,
              p: 2,
              borderRadius: 2,
              background: 'rgba(0,230,118,0.1)',
              border: '1px solid rgba(0,230,118,0.2)',
            }}>
              <Typography sx={{ color: '#00e676', fontWeight: 800, fontSize: '1.1rem' }}>
                {'\u2713'} Perfect Sentence!
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Word bank */}
        <Box sx={styles.wordBank}>
          <Typography sx={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: 2,
            mb: 2,
            textAlign: 'center',
          }}>
            Word Bank
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, justifyContent: 'center' }}>
            {availableWords.map((wordObj) => (
              <WordChipButton
                key={wordObj.id}
                word={wordObj.word}
                colorIndex={wordObj.colorIndex}
                used={wordObj.used}
                onClick={() => handleWordClick(wordObj)}
              />
            ))}
          </Box>
        </Box>

        {/* Action buttons */}
        <Box sx={styles.actionBar}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleReset}
              disabled={Object.keys(selectedWords).length === 0 || !!feedback}
              sx={{
                px: 3, py: 1, borderRadius: 2, fontWeight: 700,
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': { background: 'rgba(255,255,255,0.1)' },
                '&:disabled': { opacity: 0.3 },
              }}
            >
              RESET
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={checkAnswers}
              disabled={!allFilled || !!feedback}
              sx={{
                px: 5, py: 1, borderRadius: 2, fontWeight: 800,
                background: allFilled && !feedback
                  ? 'linear-gradient(135deg, #ffd740, #ffab00)'
                  : 'rgba(255,255,255,0.06)',
                color: allFilled && !feedback ? '#1a1a2e' : 'rgba(255,255,255,0.3)',
                boxShadow: allFilled && !feedback ? '0 4px 15px rgba(255,215,64,0.3)' : 'none',
                '&:hover': {
                  background: allFilled && !feedback
                    ? 'linear-gradient(135deg, #ffab00, #ff8f00)'
                    : 'rgba(255,255,255,0.1)',
                },
                '&:disabled': { opacity: 0.3 },
              }}
            >
              CHECK
            </Button>
          </motion.div>
        </Box>

        {/* Progress text */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}>
            {completedSentences.length} of {templates.length} correct
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
