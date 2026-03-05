import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Box, Typography, Button, IconButton, Chip } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { phase5API } from '../../lib/phase5_api.jsx'

// ─── CONSTANTS ───────────────────────────────────────────────
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const GRID_SIZE = 16 // 4x4 letter grid
const VOWELS = 'AEIOU'

// ─── HELPERS ─────────────────────────────────────────────────
function generateLetterPool(targetWords) {
  const letters = []
  const targetLetters = targetWords.join('').toUpperCase().split('')

  // Ensure all letters from target words are in the pool
  targetLetters.forEach(l => letters.push(l))

  // Fill remaining with weighted random (more vowels for playability)
  while (letters.length < GRID_SIZE) {
    if (Math.random() < 0.4) {
      letters.push(VOWELS[Math.floor(Math.random() * VOWELS.length)])
    } else {
      letters.push(ALPHABET[Math.floor(Math.random() * ALPHABET.length)])
    }
  }

  // Shuffle using Fisher-Yates
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]]
  }

  return letters.slice(0, GRID_SIZE).map((letter, i) => ({
    id: i,
    letter,
    selected: false,
    matched: false,
    shake: false,
  }))
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
    maxWidth: 800,
    mx: 'auto',
    userSelect: 'none',
  },
  gameBoard: {
    background: 'linear-gradient(145deg, #0f0c29, #302b63, #24243e)',
    borderRadius: 4,
    p: 3,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
  },
  timerBar: {
    height: 6,
    borderRadius: 3,
    background: 'rgba(255,255,255,0.1)',
    mb: 3,
    overflow: 'hidden',
  },
  timerFill: (pct, urgent) => ({
    height: '100%',
    borderRadius: 3,
    background: urgent
      ? 'linear-gradient(90deg, #ff4757, #ff6b81)'
      : 'linear-gradient(90deg, #00d2ff, #3a7bd5)',
    transition: 'width 1s linear',
    width: `${pct}%`,
  }),
  letterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 1.5,
    mb: 3,
    maxWidth: 360,
    mx: 'auto',
  },
  letterTile: (selected, matched) => ({
    width: '100%',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    cursor: matched ? 'default' : 'pointer',
    fontSize: '1.5rem',
    fontWeight: 900,
    fontFamily: '"Segoe UI", system-ui, sans-serif',
    letterSpacing: 1,
    border: '2px solid',
    borderColor: matched
      ? '#00e676'
      : selected
        ? '#ffd740'
        : 'rgba(255,255,255,0.2)',
    background: matched
      ? 'linear-gradient(145deg, #00c853, #00e676)'
      : selected
        ? 'linear-gradient(145deg, #ff8f00, #ffa000)'
        : 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
    color: matched ? '#fff' : selected ? '#fff' : 'rgba(255,255,255,0.9)',
    boxShadow: matched
      ? '0 4px 20px rgba(0,230,118,0.4)'
      : selected
        ? '0 4px 20px rgba(255,167,38,0.4)'
        : '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.15s ease',
    '&:hover': matched ? {} : {
      transform: 'scale(1.05)',
      borderColor: selected ? '#ffd740' : 'rgba(255,255,255,0.5)',
    },
  }),
  wordDisplay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 56,
    mb: 2,
    gap: 0.5,
  },
  wordLetter: {
    width: 40,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #ffd740, #ffab00)',
    borderRadius: 1.5,
    fontSize: '1.3rem',
    fontWeight: 900,
    color: '#1a1a2e',
    boxShadow: '0 3px 10px rgba(255,215,64,0.3)',
  },
  targetWordsBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    justifyContent: 'center',
    mb: 3,
  },
  targetChip: (found) => ({
    px: 2,
    py: 0.5,
    borderRadius: 2,
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    background: found
      ? 'linear-gradient(135deg, #00c853, #00e676)'
      : 'rgba(255,255,255,0.08)',
    color: found ? '#fff' : 'rgba(255,255,255,0.5)',
    border: '1px solid',
    borderColor: found ? '#00e676' : 'rgba(255,255,255,0.1)',
    textDecoration: found ? 'none' : 'none',
    transition: 'all 0.3s ease',
  }),
  scoreDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: '#ffd740',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    mt: 2,
  },
  comboText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 10,
  },
  startScreen: {
    textAlign: 'center',
    py: 6,
  },
  completionScreen: {
    textAlign: 'center',
    py: 4,
  },
}

// ─── LETTER TILE COMPONENT ──────────────────────────────────
function LetterTile({ tile, onClick, index }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{
        scale: 1,
        rotate: 0,
        ...(tile.shake ? { x: [0, -4, 4, -4, 4, 0] } : {}),
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: index * 0.03,
      }}
      whileTap={tile.matched ? {} : { scale: 0.9 }}
    >
      <Box
        onClick={() => !tile.matched && onClick(tile)}
        sx={styles.letterTile(tile.selected, tile.matched)}
      >
        {tile.matched ? '\u2713' : tile.letter}
      </Box>
    </motion.div>
  )
}

// ─── FLOATING SCORE POPUP ───────────────────────────────────
function ScorePopup({ text, color = '#ffd740' }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -80, scale: 1.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 20,
        color,
        fontWeight: 900,
        fontSize: '2rem',
        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
      }}
    >
      {text}
    </motion.div>
  )
}

// ─── PARTICLE EFFECT ────────────────────────────────────────
function Particles({ count = 12 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }}
          animate={{
            opacity: 0,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            scale: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: ['#ffd740', '#00e676', '#ff4081', '#448aff', '#e040fb'][i % 5],
            pointerEvents: 'none',
            zIndex: 15,
          }}
        />
      ))}
    </>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function WordshakeGame({
  step,
  interaction,
  targetTime = 180,
  targetWords = [],
  onComplete,
  subphase = 1,
}) {
  // State
  const [gameState, setGameState] = useState('idle') // idle | playing | complete
  const [tiles, setTiles] = useState([])
  const [currentWord, setCurrentWord] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(targetTime)
  const [popups, setPopups] = useState([])
  const [showParticles, setShowParticles] = useState(false)
  const [tracked, setTracked] = useState(false)
  const timerRef = useRef(null)
  const popupIdRef = useRef(0)

  // Normalize target words
  const normalizedTargets = useMemo(
    () => targetWords.map(w => w.toUpperCase().trim()),
    [targetWords]
  )

  // ─── Timer ──────────────────────────────────────────
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setGameState('complete')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [gameState])

  // ─── Track completion ───────────────────────────────
  useEffect(() => {
    if (gameState === 'complete' && !tracked) {
      trackCompletion()
    }
  }, [gameState, tracked])

  const trackCompletion = async () => {
    if (tracked) return
    setTracked(true)

    const finalScore = foundWords.length > 0 ? 1 : 0
    const storagePrefix = subphase === 2
      ? `phase5_subphase2_step${step}_interaction${interaction}`
      : `phase5_step${step}_interaction${interaction}`

    sessionStorage.setItem(`${storagePrefix}_score`, finalScore.toString())
    sessionStorage.setItem(`${storagePrefix}_completed`, 'true')

    try {
      await phase5API.trackGame(step, interaction, {
        time_played: targetTime - timeLeft,
        completed: true,
        words_found: foundWords.length,
        score: score,
        engagement_score: Math.min(100, Math.round((foundWords.length / normalizedTargets.length) * 100)),
      }, subphase)
    } catch (err) {
      console.error('Error tracking game:', err)
    }

    if (onComplete) {
      onComplete({
        time_played: targetTime - timeLeft,
        completed: true,
        words_found: foundWords.length,
        score: finalScore,
      })
    }
  }

  // ─── Start game ─────────────────────────────────────
  const startGame = () => {
    setTiles(generateLetterPool(targetWords))
    setCurrentWord([])
    setFoundWords([])
    setScore(0)
    setCombo(0)
    setTimeLeft(targetTime)
    setTracked(false)
    setGameState('playing')
  }

  // ─── Shuffle tiles ──────────────────────────────────
  const shuffleTiles = () => {
    setTiles(prev => {
      const unmatched = prev.filter(t => !t.matched)
      const matched = prev.filter(t => t.matched)
      const shuffled = shuffleArray(unmatched)
      return [...shuffled, ...matched].map((t, i) => ({ ...t, id: i }))
    })
    setCurrentWord([])
    setTiles(prev => prev.map(t => ({ ...t, selected: false })))
  }

  // ─── Select letter ─────────────────────────────────
  const selectLetter = useCallback((tile) => {
    if (gameState !== 'playing' || tile.matched) return

    if (tile.selected) {
      // Deselect: remove this tile and all after it in currentWord
      const idx = currentWord.findIndex(t => t.id === tile.id)
      if (idx >= 0) {
        const removed = currentWord.slice(idx)
        setCurrentWord(prev => prev.slice(0, idx))
        setTiles(prev => prev.map(t =>
          removed.some(r => r.id === t.id) ? { ...t, selected: false } : t
        ))
      }
    } else {
      setCurrentWord(prev => [...prev, tile])
      setTiles(prev => prev.map(t =>
        t.id === tile.id ? { ...t, selected: true } : t
      ))
    }
  }, [gameState, currentWord])

  // ─── Submit word ────────────────────────────────────
  const submitWord = () => {
    const word = currentWord.map(t => t.letter).join('')

    if (word.length < 2) {
      addPopup('Too short!', '#ff4757')
      clearSelection()
      return
    }

    if (foundWords.includes(word)) {
      addPopup('Already found!', '#ff4757')
      clearSelection()
      return
    }

    const isTarget = normalizedTargets.includes(word)
    const isLongEnough = word.length >= 3

    if (isTarget || isLongEnough) {
      // SUCCESS
      const newCombo = combo + 1
      const basePoints = word.length * 10
      const comboBonus = Math.min(newCombo, 5) * 5
      const targetBonus = isTarget ? 50 : 0
      const totalPoints = basePoints + comboBonus + targetBonus

      setFoundWords(prev => [...prev, word])
      setScore(prev => prev + totalPoints)
      setCombo(newCombo)
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 800)

      let popupText = `+${totalPoints}`
      if (isTarget) popupText = `TARGET! +${totalPoints}`
      if (newCombo >= 3) popupText += ` x${newCombo}`
      addPopup(popupText, isTarget ? '#00e676' : '#ffd740')

      // Mark letters as matched if it's a target word
      if (isTarget) {
        setTiles(prev => prev.map(t =>
          currentWord.some(cw => cw.id === t.id)
            ? { ...t, selected: false, matched: true }
            : t
        ))
      } else {
        clearSelection()
      }

      setCurrentWord([])
    } else {
      // FAIL
      setCombo(0)
      addPopup('Not a valid word', '#ff4757')
      // Shake the tiles
      setTiles(prev => prev.map(t =>
        currentWord.some(cw => cw.id === t.id) ? { ...t, shake: true } : t
      ))
      setTimeout(() => {
        setTiles(prev => prev.map(t => ({ ...t, shake: false })))
        clearSelection()
      }, 400)
    }
  }

  const clearSelection = () => {
    setCurrentWord([])
    setTiles(prev => prev.map(t => t.matched ? t : { ...t, selected: false }))
  }

  const addPopup = (text, color) => {
    const id = ++popupIdRef.current
    setPopups(prev => [...prev, { id, text, color }])
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 900)
  }

  // ─── Format time ────────────────────────────────────
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  const timePct = (timeLeft / targetTime) * 100
  const isUrgent = timeLeft < 30

  // ─── RENDER: IDLE ───────────────────────────────────
  if (gameState === 'idle') {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.gameBoard}>
          <Box sx={styles.startScreen}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Typography variant="h3" sx={{ color: '#ffd740', fontWeight: 900, mb: 1, fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
                WORDSHAKE
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, fontSize: '1rem' }}>
              Form words from the letter grid. Find target words for bonus points!
            </Typography>

            {targetWords.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 1.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 2 }}>
                  Target Words
                </Typography>
                <Box sx={styles.targetWordsBar}>
                  {targetWords.map((w, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <Box sx={styles.targetChip(false)}>{w}</Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
              <span>{formatTime(targetTime)} time limit</span>
              <span>{GRID_SIZE} letters</span>
              <span>{targetWords.length} targets</span>
            </Box>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={startGame}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffd740, #ffab00)',
                  color: '#1a1a2e',
                  '&:hover': { background: 'linear-gradient(135deg, #ffab00, #ff8f00)' },
                  boxShadow: '0 4px 20px rgba(255,215,64,0.4)',
                }}
              >
                START GAME
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Box>
    )
  }

  // ─── RENDER: COMPLETE ───────────────────────────────
  if (gameState === 'complete') {
    const targetHits = foundWords.filter(w => normalizedTargets.includes(w)).length
    return (
      <Box sx={styles.container}>
        <Box sx={styles.gameBoard}>
          <Box sx={styles.completionScreen}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
              <Typography sx={{ fontSize: '3.5rem', mb: 1 }}>
                {targetHits === normalizedTargets.length ? '\uD83C\uDFC6' : targetHits > 0 ? '\u2B50' : '\u23F0'}
              </Typography>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Typography variant="h4" sx={{ color: '#ffd740', fontWeight: 900, mb: 1 }}>
                {targetHits === normalizedTargets.length ? 'PERFECT!' : targetHits > 0 ? 'GREAT JOB!' : 'TIME\'S UP!'}
              </Typography>
            </motion.div>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, my: 3 }}>
              {[
                { label: 'Score', value: score, color: '#ffd740' },
                { label: 'Words', value: foundWords.length, color: '#448aff' },
                { label: 'Targets', value: `${targetHits}/${normalizedTargets.length}`, color: '#00e676' },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.15 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: stat.color, fontWeight: 900, fontSize: '2rem' }}>{stat.value}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {foundWords.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 2, mb: 1 }}>
                  Words Found
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, justifyContent: 'center' }}>
                  {foundWords.map((w, i) => (
                    <Chip
                      key={i}
                      label={w}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        background: normalizedTargets.includes(w) ? '#00e676' : 'rgba(255,255,255,0.1)',
                        color: normalizedTargets.includes(w) ? '#1a1a2e' : 'rgba(255,255,255,0.7)',
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={startGame}
                sx={{
                  px: 4, py: 1.5, fontWeight: 700, borderRadius: 3,
                  background: 'rgba(255,255,255,0.1)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
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

  // ─── RENDER: PLAYING ────────────────────────────────
  return (
    <Box sx={styles.container}>
      <Box sx={styles.gameBoard}>
        <AnimatePresence>
          {popups.map(p => <ScorePopup key={p.id} text={p.text} color={p.color} />)}
          {showParticles && <Particles key="particles" />}
        </AnimatePresence>

        {/* Header */}
        <Box sx={styles.header}>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 2 }}>
              Score
            </Typography>
            <Typography sx={{ color: '#ffd740', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>
              {score}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            {combo >= 2 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Typography sx={{ color: '#ff4081', fontWeight: 800, fontSize: '0.8rem' }}>
                  COMBO x{combo}
                </Typography>
              </motion.div>
            )}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 2 }}>
              Time
            </Typography>
            <Typography sx={{
              color: isUrgent ? '#ff4757' : '#fff',
              fontWeight: 900,
              fontSize: '1.5rem',
              lineHeight: 1,
              ...(isUrgent ? { animation: 'pulse 1s infinite' } : {}),
            }}>
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>

        {/* Timer bar */}
        <Box sx={styles.timerBar}>
          <Box sx={styles.timerFill(timePct, isUrgent)} />
        </Box>

        {/* Target words */}
        <Box sx={styles.targetWordsBar}>
          {targetWords.map((w, i) => {
            const found = foundWords.includes(w.toUpperCase())
            return (
              <motion.div
                key={i}
                animate={found ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Box sx={styles.targetChip(found)}>{w}</Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Current word display */}
        <Box sx={styles.wordDisplay}>
          <AnimatePresence mode="popLayout">
            {currentWord.map((tile, i) => (
              <motion.div
                key={`${tile.id}-${i}`}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Box sx={styles.wordLetter}>{tile.letter}</Box>
              </motion.div>
            ))}
          </AnimatePresence>
          {currentWord.length === 0 && (
            <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Tap letters to form a word
            </Typography>
          )}
        </Box>

        {/* Letter grid */}
        <Box sx={styles.letterGrid}>
          {tiles.map((tile, i) => (
            <LetterTile
              key={tile.id}
              tile={tile}
              index={i}
              onClick={selectLetter}
            />
          ))}
        </Box>

        {/* Action buttons */}
        <Box sx={styles.actionBar}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={clearSelection}
              disabled={currentWord.length === 0}
              sx={{
                px: 3, py: 1, borderRadius: 2, fontWeight: 700,
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': { background: 'rgba(255,255,255,0.1)' },
                '&:disabled': { opacity: 0.3 },
              }}
            >
              CLEAR
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={shuffleTiles}
              sx={{
                px: 3, py: 1, borderRadius: 2, fontWeight: 700,
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': { background: 'rgba(255,255,255,0.1)' },
              }}
            >
              SHUFFLE
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={submitWord}
              disabled={currentWord.length < 2}
              sx={{
                px: 4, py: 1, borderRadius: 2, fontWeight: 800,
                background: currentWord.length >= 2
                  ? 'linear-gradient(135deg, #ffd740, #ffab00)'
                  : 'rgba(255,255,255,0.06)',
                color: currentWord.length >= 2 ? '#1a1a2e' : 'rgba(255,255,255,0.3)',
                boxShadow: currentWord.length >= 2 ? '0 4px 15px rgba(255,215,64,0.3)' : 'none',
                '&:hover': {
                  background: currentWord.length >= 2
                    ? 'linear-gradient(135deg, #ffab00, #ff8f00)'
                    : 'rgba(255,255,255,0.1)',
                },
                '&:disabled': { opacity: 0.3 },
              }}
            >
              SUBMIT
            </Button>
          </motion.div>
        </Box>

        {/* Words found counter */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
            {foundWords.length} word{foundWords.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
