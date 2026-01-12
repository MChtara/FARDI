/**
 * Phase 2 Exercise Renderer with Gamified Components
 * Routes exercises to appropriate gamified components based on task type
 *
 * Task Type Mapping:
 * - drag_and_drop -> PuzzleGame
 * - listening_drag_drop -> RhythmMatcher
 * - gap_fill -> WordSniper
 * - gap_fill_story -> GapFillStory
 * - negotiation_gap_fill, listening_negotiation -> DebateArena
 * - dialogue_completion -> ConversationTetris
 * - listening_dialogue_gap_fill, listening_role_play -> SignalDecoder
 * - writing, listening_proposal_writing, listening_proposal -> BillboardDesigner
 * - sentence_expansion, reflection_gap_fill, listening_expansion -> PhraseExpander
 * - listening_story_writing, listening_research, listening_reflection -> ChatMessengerSim
 * - listening_team_plan, listening_assignment -> EventPlannerBoard
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, Button, Stack, Card, CardContent,
  IconButton, Chip, Alert, Fade, Grow, Zoom
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// Import gamified components
import PuzzleGame from './PuzzleGame';
import WordSniper from './WordSniper';
import GapFillStory from './GapFillStory';
import BillboardDesigner from './BillboardDesigner';
import PhraseExpander from './PhraseExpander';
import EventPlannerBoard from './EventPlannerBoard';
import {
  DebateArena,
  ConversationTetris,
  RhythmMatcher,
  SignalDecoder,
  ChatMessengerSim
} from './exercises';

import { evaluateWriting } from '../services/aiEvaluationService';
import './Phase2ExerciseRenderer.css';

// Task type to component mapping
const TASK_COMPONENT_MAP = {
  // Drag and drop types
  'drag_and_drop': 'PuzzleGame',
  'listening_drag_drop': 'RhythmMatcher',

  // Gap fill types
  'gap_fill': 'WordSniper',
  'gap_fill_story': 'GapFillStory',

  // Negotiation/Debate types
  'negotiation_gap_fill': 'DebateArena',
  'listening_negotiation': 'DebateArena',

  // Dialogue types
  'dialogue_completion': 'ConversationTetris',
  'listening_dialogue_gap_fill': 'SignalDecoder',
  'listening_role_play': 'SignalDecoder',

  // Writing types
  'writing': 'BillboardDesigner',
  'listening_proposal_writing': 'BillboardDesigner',
  'listening_proposal': 'BillboardDesigner',

  // Expansion types
  'sentence_expansion': 'PhraseExpander',
  'reflection_gap_fill': 'PhraseExpander',
  'listening_expansion': 'PhraseExpander',

  // Chat/Story types
  'listening_story_writing': 'ChatMessengerSim',
  'listening_research': 'ChatMessengerSim',
  'listening_reflection': 'ChatMessengerSim',

  // Planning types
  'listening_team_plan': 'EventPlannerBoard',
  'listening_assignment': 'EventPlannerBoard'
};

export default function Phase2ExerciseRenderer({ exercise, onComplete, onProgress }) {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const audioRef = useRef(null);

  // Determine which component to render
  const componentType = TASK_COMPONENT_MAP[exercise?.type] || 'default';

  // Check if exercise requires audio first
  const requiresAudio = exercise?.type?.includes('listening') && exercise?.audio_script;

  useEffect(() => {
    // Reset state when exercise changes
    setAnswers({});
    setShowResult(false);
    setFeedback(null);
    setAudioPlayed(false);
  }, [exercise]);

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handlePlayAudio = () => {
    if (exercise?.audio_script) {
      setAudioPlaying(true);

      // Use speech synthesis
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(exercise.audio_script);
        utterance.rate = 0.9;
        utterance.onend = () => {
          setAudioPlaying(false);
          setAudioPlayed(true);
        };
        utterance.onerror = () => {
          setAudioPlaying(false);
          setAudioPlayed(true);
        };
        speechSynthesis.speak(utterance);
      } else {
        // Fallback
        setTimeout(() => {
          setAudioPlaying(false);
          setAudioPlayed(true);
        }, 3000);
      }
    }
  };

  const handleComponentComplete = (result) => {
    setFeedback(result);
    setShowResult(true);
    if (onComplete) {
      onComplete(result);
    }
  };

  const handleSubmit = async () => {
    setIsEvaluating(true);

    try {
      // For writing tasks, use AI evaluation
      if (['writing', 'sentence_expansion', 'listening_proposal_writing', 'listening_proposal'].includes(exercise?.type)) {
        const response = Object.values(answers).join(' ');
        const result = await evaluateWriting({
          response,
          prompt: exercise?.ai_evaluation_prompt || '',
          context: exercise?.instruction || '',
          taskType: exercise?.type
        });

        setFeedback({
          score: result.score,
          correct: result.is_correct ? 1 : 0,
          total: 1,
          percentage: result.score,
          aiResult: result
        });
        setShowResult(true);

        if (onComplete) {
          onComplete({
            score: result.score,
            correctCount: result.is_correct ? 1 : 0,
            totalCount: 1,
            isPerfect: result.score >= 80,
            aiEvaluation: result
          });
        }
      } else {
        // Standard validation for other types
        let correctCount = 0;
        let totalCount = 0;

        if (exercise?.correct_answers) {
          totalCount = exercise.correct_answers.length;
          exercise.correct_answers.forEach((correct, index) => {
            const userAnswer = answers[`g_${index}`] || answers[index] || '';
            if (userAnswer.toLowerCase().trim() === correct.toLowerCase().trim()) {
              correctCount++;
            }
          });
        } else if (exercise?.pairs) {
          totalCount = exercise.pairs.length;
          exercise.pairs.forEach((pair, index) => {
            if (answers[pair.term] === pair.term) {
              correctCount++;
            }
          });
        }

        const score = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

        setFeedback({ score, correct: correctCount, total: totalCount, percentage: score });
        setShowResult(true);

        if (onComplete) {
          onComplete({
            score,
            correctCount,
            totalCount,
            isPerfect: correctCount === totalCount
          });
        }
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      setFeedback({ score: 70, correct: 1, total: 1, percentage: 70 });
      setShowResult(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResult(false);
    setFeedback(null);
  };

  // Render audio player for listening exercises
  const renderAudioPlayer = () => {
    if (!requiresAudio) return null;

    return (
      <Zoom in timeout={600}>
        <Paper className="audio-player" elevation={3}>
          <Box className="audio-controls">
            <IconButton
              className={`play-button ${audioPlaying ? 'playing' : ''}`}
              onClick={handlePlayAudio}
              disabled={audioPlaying}
              color="primary"
              size="large"
            >
              {audioPlaying ? <VolumeUpIcon /> : <PlayArrowIcon />}
            </IconButton>
            <Box className="audio-info">
              <Typography variant="subtitle1">
                {audioPlaying ? 'Playing audio...' : audioPlayed ? 'Audio played - Complete the exercise' : 'Click to play audio'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Listen carefully before answering
              </Typography>
            </Box>
            {audioPlayed && (
              <Chip label="Listened" color="success" size="small" icon={<CheckCircleIcon />} />
            )}
          </Box>
        </Paper>
      </Zoom>
    );
  };

  // Render the appropriate gamified component
  const renderExerciseComponent = () => {
    // For listening exercises, show audio first
    if (requiresAudio && !audioPlayed) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Please listen to the audio before starting the exercise.
          </Typography>
        </Box>
      );
    }

    switch (componentType) {
      case 'PuzzleGame':
        return (
          <PuzzleGame
            items={exercise.pairs?.map(p => p.term) || []}
            descriptions={exercise.pairs?.reduce((acc, p) => ({ ...acc, [p.term]: p.definition }), {}) || {}}
            answers={answers}
            onChange={handleAnswerChange}
            onComplete={() => handleComponentComplete({ isPerfect: true })}
          />
        );

      case 'RhythmMatcher':
        return (
          <RhythmMatcher
            exercise={exercise}
            onComplete={handleComponentComplete}
            onProgress={onProgress}
          />
        );

      case 'WordSniper':
        // Transform templates to sentences format for WordSniper
        const sentences = exercise.templates?.map((template, i) => {
          const blankCount = (template.match(/_{3,}/g) || []).length;
          const blanks = [];
          for (let b = 0; b < blankCount; b++) {
            blanks.push(exercise.correct_answers?.[i] || '');
          }
          return { text: template, blanks };
        }) || [];

        return (
          <WordSniper
            sentences={sentences}
            answers={answers}
            onChange={handleAnswerChange}
            globalWordBank={exercise.word_bank}
            correctAnswers={exercise.correct_answers}
          />
        );

      case 'GapFillStory':
        return (
          <GapFillStory
            templates={exercise.templates || []}
            wordBank={exercise.word_bank || []}
            answers={answers}
            onChange={handleAnswerChange}
          />
        );

      case 'DebateArena':
        return (
          <DebateArena
            exercise={exercise}
            onComplete={handleComponentComplete}
            onProgress={onProgress}
          />
        );

      case 'ConversationTetris':
        return (
          <ConversationTetris
            exercise={exercise}
            onComplete={handleComponentComplete}
            onProgress={onProgress}
          />
        );

      case 'SignalDecoder':
        return (
          <SignalDecoder
            exercise={exercise}
            onComplete={handleComponentComplete}
            onProgress={onProgress}
          />
        );

      case 'BillboardDesigner':
        return (
          <BillboardDesigner
            templates={exercise.templates || []}
            answers={answers}
            onChange={handleAnswerChange}
            correctAnswers={exercise.correct_answers}
          />
        );

      case 'PhraseExpander':
        return (
          <PhraseExpander
            templates={exercise.templates || []}
            answers={answers}
            onChange={handleAnswerChange}
          />
        );

      case 'ChatMessengerSim':
        return (
          <ChatMessengerSim
            exercise={exercise}
            onComplete={handleComponentComplete}
            onProgress={onProgress}
          />
        );

      case 'EventPlannerBoard':
        return (
          <EventPlannerBoard
            templates={exercise.templates || []}
            answers={answers}
            onChange={handleAnswerChange}
          />
        );

      default:
        // Fallback to basic rendering
        return renderDefaultExercise();
    }
  };

  // Default exercise renderer for unsupported types
  const renderDefaultExercise = () => {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {exercise?.instruction || 'Complete the exercise'}
        </Typography>

        {exercise?.templates?.map((template, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="body1">{template}</Typography>
          </Box>
        ))}

        {exercise?.word_bank && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {exercise.word_bank.map((word, i) => (
              <Chip key={i} label={word} variant="outlined" />
            ))}
          </Box>
        )}
      </Paper>
    );
  };

  // Render result feedback
  const renderResult = () => {
    if (!showResult || !feedback) return null;

    const isPerfect = feedback.percentage >= 80;

    return (
      <Zoom in>
        <Alert
          severity={isPerfect ? 'success' : feedback.percentage >= 50 ? 'info' : 'warning'}
          className="result-alert"
          icon={isPerfect ? <CheckCircleIcon /> : <ErrorIcon />}
        >
          <Typography variant="h6" gutterBottom>
            {isPerfect ? 'Excellent work!' : feedback.percentage >= 50 ? 'Good effort!' : 'Keep practicing!'}
          </Typography>
          <Typography>
            Score: {Math.round(feedback.percentage)}%
            {feedback.correct !== undefined && feedback.total !== undefined && (
              <> ({feedback.correct} / {feedback.total})</>
            )}
          </Typography>
          {feedback.aiResult?.feedback && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {feedback.aiResult.feedback}
            </Typography>
          )}
          {feedback.aiResult?.suggestions?.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {feedback.aiResult.suggestions.map((suggestion, i) => (
                <Typography key={i} variant="caption" display="block">
                  Tip: {suggestion}
                </Typography>
              ))}
            </Box>
          )}
        </Alert>
      </Zoom>
    );
  };

  // Check if component handles its own submission
  const selfSubmitting = ['DebateArena', 'ConversationTetris', 'RhythmMatcher', 'SignalDecoder', 'ChatMessengerSim'].includes(componentType);

  return (
    <Box className="phase2-exercise-renderer">
      {/* Exercise Header */}
      <Fade in timeout={400}>
        <Card className="exercise-header" elevation={3}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box className="exercise-icon">
                {exercise?.type?.includes('listening') ? '🎧' :
                  exercise?.type?.includes('writing') ? '✍️' :
                    exercise?.type?.includes('drag') ? '🎯' :
                      exercise?.type?.includes('debate') || exercise?.type?.includes('negotiation') ? '💬' :
                        '📝'}
              </Box>
              <Box>
                <Typography variant="h5" className="exercise-title">
                  {exercise?.instruction || 'Complete the exercise'}
                </Typography>
                <Chip
                  label={exercise?.type?.replace(/_/g, ' ').toUpperCase() || 'EXERCISE'}
                  size="small"
                  color="primary"
                  className="exercise-type-chip"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Fade>

      {/* Audio Player for listening exercises */}
      {renderAudioPlayer()}

      {/* Exercise Content */}
      <Box className="exercise-content">
        {renderExerciseComponent()}
      </Box>

      {/* Result Display */}
      {renderResult()}

      {/* Action Buttons */}
      {!selfSubmitting && (
        <Fade in timeout={800}>
          <Box className="exercise-actions">
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={showResult || isEvaluating || (requiresAudio && !audioPlayed)}
              className="submit-button"
            >
              {isEvaluating ? 'Evaluating...' : 'Submit Answer'}
            </Button>
            {showResult && (
              <Button
                variant="outlined"
                size="large"
                onClick={handleRetry}
                className="retry-button"
                startIcon={<ReplayIcon />}
              >
                Try Again
              </Button>
            )}
          </Box>
        </Fade>
      )}
    </Box>
  );
}
