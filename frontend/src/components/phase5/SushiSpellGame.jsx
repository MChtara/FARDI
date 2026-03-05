import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Box, Typography, Button, Chip } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { phase5API } from '../../lib/phase5_api.jsx'

// ─── CONSTANTS ───────────────────────────────────────────────
const BELT_SPEED = 3500 // ms for plate to cross
const SPAWN_INTERVAL = 800 // ms between new plates
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const SUSHI_EMOJI = ['\uD83C\uDF63', '\uD83C\uDF65', '\uD83C\uDF71', '\uD83E\uDD61', '\uD83C\uDF5B', '\uD83C\uDF5A', '\uD83C\uDF64']
const PLATE_COLORS = [
  'linear-gradient(135deg, #e74c3c, #c0392b)',
  'linear-gradient(135deg, #3498db, #2980b9)',
  'linear-gradient(135deg, #2ecc71, #27ae60)',
  'linear-gradient(135deg, #f39c12, #e67e22)',
  'linear-gradient(135deg, #9b59b6, #8e44ad)',
  'linear-gradient(135deg, #1abc9c, #16a085)',
]

// ─── HELPERS ─────────────────────────────────────────────────
function getRandomPlateStyle() {
  return {
    color: PLATE_COLORS[Math.floor(Math.random() * PLATE_COLORS.length)],
    sushi: SUSHI_EMOJI[Math.floor(Math.random() * SUSHI_EMOJI.length)],
  }
}

function generateLetterQueue(targetWords) {
  const allLetters = targetWords.join('').toUpperCase().split('')
  // Add extra random letters for variety
  const extras = Math.max(10, allLetters.length)
  for (let i = 0; i < extras; i++) {
    allLetters.push(ALPHABET[Math.floor(Math.random() * ALPHABET.length)])
  }
  // Shuffle
  for (let i = allLetters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allLetters[i], allLetters[j]] = [allLetters[j], allLetters[i]]
  }
  return allLetters
}

// ─── STYLES ──────────────────────────────────────────────────
const styles = {
  container: {
    maxWidth: 800,
    mx: 'auto',
    userSelect: 'none',
  },
  gameBoard: {
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
    mb: 2,
  },
  beltContainer: {
    position: 'relative',
    height: 120,
    mb: 3,
    overflow: 'hidden',
    borderRadius: 2,
    background: 'rgba(255,255,255,0.03)',
    border: '2px solid rgba(255,255,255,0.08)',
  },
  beltTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    background: 'repeating-linear-gradient(90deg, #333 0px, #333 20px, #555 20px, #555 40px)',
    borderRadius: '0 0 8px 8px',
  },
  plate: (plateColor) => ({
    position: 'absolute',
    top: 15,
    width: 80,
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: plateColor,
    cursor: 'pointer',
    border: '3px solid rgba(255,255,255,0.3)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.4), inset 0 -3px 6px rgba(0,0,0,0.2)',
    transition: 'transform 0.1s ease',
    '&:hover': { transform: 'scale(1.1)' },
  }),
  plateLetter: {
    fontSize: '1.6rem',
    fontWeight: 900,
    color: '#fff',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    lineHeight: 1,
  },
  plateSushi: {
    fontSize: '0.9rem',
    mt: 0.3,
  },
  spellingArea: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 1,
    minHeight: 70,
    mb: 3,
    p: 2,
    borderRadius: 3,
    background: 'rgba(255,255,255,0.04)',
    border: '2px dashed rgba(255,255,255,0.1)',
  },
  spelledLetter: {
    width: 44,
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    fontSize: '1.4rem',
    fontWeight: 900,
    color: '#1a1a2e',
    cursor: 'pointer',
  },
  targetWordsRow: {
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
    background: found ? 'linear-gradient(135deg, #00c853, #00e676)' : 'rgba(255,255,255,0.06)',
    color: found ? '#fff' : 'rgba(255,255,255,0.4)',
    border: '1px solid',
    borderColor: found ? '#00e676' : 'rgba(255,255,255,0.08)',
    transition: 'all 0.3s ease',
  }),
  actionBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    mt: 2,
  },
  timerBar: {
    height: 5,
    borderRadius: 3,
    background: 'rgba(255,255,255,0.08)',
    mb: 3,
    overflow: 'hidden',
  },
  timerFill: (pct, urgent) => ({
    height: '100%',
    borderRadius: 3,
    background: urgent ? 'linear-gradient(90deg, #ff6b6b, #ee5a24)' : 'linear-gradient(90deg, #e74c3c, #c0392b)',
    transition: 'width 1s linear',
    width: `${pct}%`,
  }),
}

// ─── PLATE COMPONENT ─────────────────────────────────────────
function SushiPlate({ plate, onClick }) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: plate.x, opacity: 1 }}
      exit={{ opacity: 0, scale: 0, y: -50 }}
      transition={{
        x: { duration: BELT_SPEED / 1000, ease: 'linear' },
        opacity: { duration: 0.3 },
        scale: { duration: 0.2 },
      }}
      style={{ position: 'absolute', top: 15 }}
      whileHover={{ scale: 1.15, y: -5 }}
      whileTap={{ scale: 0.9 }}
    >
      <Box
        onClick={() => onClick(plate)}
        sx={{
          width: 80,
          height: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: plate.style.color,
          cursor: 'pointer',
          border: '3px solid rgba(255,255,255,0.3)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.4), inset 0 -3px 6px rgba(0,0,0,0.2)',
        }}
      >
        <Typography sx={styles.plateLetter}>{plate.letter}</Typography>
        <Typography sx={styles.plateSushi}>{plate.style.sushi}</Typography>
      </Box>
    </motion.div>
  )
}

// ─── SCORE POPUP ────────────────────────────────────────────
function FloatingScore({ text, color }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -80, scale: 1.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 20,
        color,
        fontWeight: 900,
        fontSize: '1.8rem',
        textShadow: '0 2px 15px rgba(0,0,0,0.5)',
      }}
    >
      {text}
    </motion.div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function SushiSpellGame({
  step,
  interaction,
  targetTime = 120,
  targetWords = [],
  onComplete,
  subphase = 1,
}) {
  const [gameState, setGameState] = useState('idle')
  const [plates, setPlates] = useState([])
  const [spelled, setSpelled] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(targetTime)
  const [popups, setPopups] = useState([])
  const [streak, setStreak] = useState(0)
  const [tracked, setTracked] = useState(false)

  const letterQueueRef = useRef([])
  const queueIndexRef = useRef(0)
  const spawnIntervalRef = useRef(null)
  const timerRef = useRef(null)
  const plateIdRef = useRef(0)
  const popupIdRef = useRef(0)
  const containerRef = useRef(null)

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

  // ─── Spawn plates ───────────────────────────────────
  useEffect(() => {
    if (gameState === 'playing') {
      const containerWidth = containerRef.current?.offsetWidth || 700

      spawnIntervalRef.current = setInterval(() => {
        const queue = letterQueueRef.current
        if (queueIndexRef.current >= queue.length) {
          // Regenerate queue
          letterQueueRef.current = generateLetterQueue(targetWords)
          queueIndexRef.current = 0
        }

        const letter = queue[queueIndexRef.current++]
        const id = ++plateIdRef.current

        setPlates(prev => {
          // Remove plates that have gone off screen
          const active = prev.filter(p => p.x < containerWidth + 100)
          return [...active, {
            id,
            letter,
            x: -100,
            targetX: containerWidth + 100,
            style: getRandomPlateStyle(),
          }]
        })

        // Animate plate position via a timeout (since we animate with framer-motion)
        // We set x to targetX after spawn
        setTimeout(() => {
          setPlates(prev => prev.map(p =>
            p.id === id ? { ...p, x: containerWidth + 100 } : p
          ))
        }, 50)

        // Remove plate after it crosses
        setTimeout(() => {
          setPlates(prev => prev.filter(p => p.id !== id))
        }, BELT_SPEED + 200)
      }, SPAWN_INTERVAL)
    }

    return () => clearInterval(spawnIntervalRef.current)
  }, [gameState, targetWords])

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
        words_spelled: foundWords.length,
        score,
        engagement_score: Math.min(100, Math.round((foundWords.length / normalizedTargets.length) * 100)),
      }, subphase)
    } catch (err) {
      console.error('Error tracking game:', err)
    }

    if (onComplete) {
      onComplete({
        time_played: targetTime - timeLeft,
        completed: true,
        words_spelled: foundWords.length,
        score: finalScore,
      })
    }
  }

  // ─── Start game ─────────────────────────────────────
  const startGame = () => {
    letterQueueRef.current = generateLetterQueue(targetWords)
    queueIndexRef.current = 0
    plateIdRef.current = 0
    setPlates([])
    setSpelled([])
    setFoundWords([])
    setScore(0)
    setStreak(0)
    setTimeLeft(targetTime)
    setTracked(false)
    setPopups([])
    setGameState('playing')
  }

  // ─── Grab plate ─────────────────────────────────────
  const grabPlate = useCallback((plate) => {
    if (gameState !== 'playing') return

    // Remove plate from belt
    setPlates(prev => prev.filter(p => p.id !== plate.id))

    // Add letter to spelling area
    setSpelled(prev => [...prev, { id: plate.id, letter: plate.letter, color: plate.style.color }])
  }, [gameState])

  // ─── Remove spelled letter ──────────────────────────
  const removeSpelledLetter = (index) => {
    setSpelled(prev => prev.filter((_, i) => i !== index))
  }

  // ─── Submit spelled word ────────────────────────────
  const submitWord = () => {
    const word = spelled.map(s => s.letter).join('')

    if (word.length < 2) {
      addPopup('Too short!', '#ff6b6b')
      return
    }

    if (foundWords.includes(word)) {
      addPopup('Already spelled!', '#ff6b6b')
      setSpelled([])
      return
    }

    const isTarget = normalizedTargets.includes(word)
    const isValidLength = word.length >= 3

    if (isTarget || isValidLength) {
      const newStreak = streak + 1
      const basePoints = word.length * 15
      const streakBonus = Math.min(newStreak, 5) * 10
      const targetBonus = isTarget ? 75 : 0
      const total = basePoints + streakBonus + targetBonus

      setFoundWords(prev => [...prev, word])
      setScore(prev => prev + total)
      setStreak(newStreak)
      setSpelled([])

      let msg = `+${total}`
      if (isTarget) msg = `\uD83C\uDF63 TARGET! +${total}`
      if (newStreak >= 3) msg += ` \uD83D\uDD25x${newStreak}`
      addPopup(msg, isTarget ? '#00e676' : '#ffd740')
    } else {
      setStreak(0)
      addPopup('Not valid!', '#ff6b6b')
      setSpelled([])
    }
  }

  const clearSpelled = () => setSpelled([])

  const addPopup = (text, color) => {
    const id = ++popupIdRef.current
    setPopups(prev => [...prev, { id, text, color }])
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 900)
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  const timePct = (timeLeft / targetTime) * 100
  const isUrgent = timeLeft < 20

  // ─── IDLE SCREEN ────────────────────────────────────
  if (gameState === 'idle') {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.gameBoard}>
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }}>
              <Typography sx={{ fontSize: '3.5rem', mb: 1 }}>{'\uD83C\uDF63'}</Typography>
              <Typography variant="h3" sx={{ color: '#e74c3c', fontWeight: 900, mb: 1, fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
                SUSHI SPELL
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, fontSize: '1rem' }}>
              Grab letters from the conveyor belt and spell target words!
            </Typography>

            {targetWords.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 1.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 2 }}>
                  Words to Spell
                </Typography>
                <Box sx={styles.targetWordsRow}>
                  {targetWords.map((w, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                      <Box sx={styles.targetChip(false)}>{w}</Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
              <span>{formatTime(targetTime)} time limit</span>
              <span>{targetWords.length} words</span>
            </Box>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={startGame}
                sx={{
                  px: 6, py: 2, fontSize: '1.1rem', fontWeight: 800, borderRadius: 3,
                  background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                  color: '#fff',
                  '&:hover': { background: 'linear-gradient(135deg, #c0392b, #a93226)' },
                  boxShadow: '0 4px 20px rgba(231,76,60,0.4)',
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

  // ─── COMPLETE SCREEN ────────────────────────────────
  if (gameState === 'complete') {
    const targetHits = foundWords.filter(w => normalizedTargets.includes(w)).length
    return (
      <Box sx={styles.container}>
        <Box sx={styles.gameBoard}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
              <Typography sx={{ fontSize: '3.5rem', mb: 1 }}>
                {targetHits === normalizedTargets.length ? '\uD83C\uDFC6' : targetHits > 0 ? '\uD83C\uDF63' : '\u23F0'}
              </Typography>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Typography variant="h4" sx={{ color: '#e74c3c', fontWeight: 900, mb: 1 }}>
                {targetHits === normalizedTargets.length ? 'PERFECT CHEF!' : targetHits > 0 ? 'WELL DONE!' : 'TIME\'S UP!'}
              </Typography>
            </motion.div>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, my: 3 }}>
              {[
                { label: 'Score', value: score, color: '#ffd740' },
                { label: 'Words', value: foundWords.length, color: '#3498db' },
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
                  Words Spelled
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

  // ─── PLAYING SCREEN ─────────────────────────────────
  return (
    <Box sx={styles.container}>
      <Box sx={styles.gameBoard}>
        <AnimatePresence>
          {popups.map(p => <FloatingScore key={p.id} text={p.text} color={p.color} />)}
        </AnimatePresence>

        {/* Header */}
        <Box sx={styles.header}>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 2 }}>Score</Typography>
            <Typography sx={{ color: '#ffd740', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{score}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            {streak >= 2 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Typography sx={{ color: '#ff6b6b', fontWeight: 800, fontSize: '0.8rem' }}>
                  STREAK {'\uD83D\uDD25'} x{streak}
                </Typography>
              </motion.div>
            )}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 2 }}>Time</Typography>
            <Typography sx={{ color: isUrgent ? '#ff6b6b' : '#fff', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>

        {/* Timer bar */}
        <Box sx={styles.timerBar}>
          <Box sx={styles.timerFill(timePct, isUrgent)} />
        </Box>

        {/* Target words */}
        <Box sx={styles.targetWordsRow}>
          {targetWords.map((w, i) => {
            const found = foundWords.includes(w.toUpperCase())
            return (
              <motion.div key={i} animate={found ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
                <Box sx={styles.targetChip(found)}>{w}</Box>
              </motion.div>
            )
          })}
        </Box>

        {/* Conveyor belt */}
        <Box ref={containerRef} sx={styles.beltContainer}>
          <AnimatePresence>
            {plates.map(plate => (
              <SushiPlate key={plate.id} plate={plate} onClick={grabPlate} />
            ))}
          </AnimatePresence>
          {/* Belt track decoration */}
          <Box sx={styles.beltTrack} />
          {/* Instruction overlay when no plates */}
          {plates.length === 0 && (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>
                Plates coming...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Spelling area */}
        <Box sx={styles.spellingArea}>
          <AnimatePresence mode="popLayout">
            {spelled.map((s, i) => (
              <motion.div
                key={`${s.id}-${i}`}
                initial={{ scale: 0, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Box
                  onClick={() => removeSpelledLetter(i)}
                  sx={{
                    ...styles.spelledLetter,
                    background: s.color,
                    '&:hover': { transform: 'scale(1.1)', opacity: 0.8 },
                    cursor: 'pointer',
                  }}
                >
                  {s.letter}
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
          {spelled.length === 0 && (
            <Typography sx={{ color: 'rgba(255,255,255,0.15)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Grab sushi plates to spell words
            </Typography>
          )}
        </Box>

        {/* Action buttons */}
        <Box sx={styles.actionBar}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={clearSpelled}
              disabled={spelled.length === 0}
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
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={submitWord}
              disabled={spelled.length < 2}
              sx={{
                px: 5, py: 1.2, borderRadius: 2, fontWeight: 800,
                background: spelled.length >= 2
                  ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
                  : 'rgba(255,255,255,0.06)',
                color: spelled.length >= 2 ? '#fff' : 'rgba(255,255,255,0.3)',
                boxShadow: spelled.length >= 2 ? '0 4px 15px rgba(231,76,60,0.3)' : 'none',
                '&:hover': {
                  background: spelled.length >= 2
                    ? 'linear-gradient(135deg, #c0392b, #a93226)'
                    : 'rgba(255,255,255,0.1)',
                },
                '&:disabled': { opacity: 0.3 },
              }}
            >
              SPELL IT! {'\uD83C\uDF63'}
            </Button>
          </motion.div>
        </Box>

        {/* Words found */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
            {foundWords.length} word{foundWords.length !== 1 ? 's' : ''} spelled
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
