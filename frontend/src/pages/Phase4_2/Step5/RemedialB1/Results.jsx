import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { CharacterMessage } from '../../../../components/Avatar.jsx';

const Results = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState({
    taskA: 0,
    taskB: 0,
    taskC: 0,
    taskD: 0,
    total: 0
  });

  useEffect(() => {
    const taskA = parseInt(sessionStorage.getItem('phase4_2_step5_remedialB1_taskA') || '0');
    const taskB = parseInt(sessionStorage.getItem('phase4_2_step5_remedialB1_taskB') || '0');
    const taskC = parseInt(sessionStorage.getItem('phase4_2_step5_remedialB1_taskC') || '0');
    const taskD = parseInt(sessionStorage.getItem('phase4_2_step5_remedialB1_taskD') || '0');
    const total = taskA + taskB + taskC + taskD;

    setScores({
      taskA,
      taskB,
      taskC,
      taskD,
      total
    });
  }, []);

  const maxScore = 30; // 8 + 8 + 6 + 8
  const passThreshold = 21; // 70%
  const passed = scores.total >= passThreshold;
  const percentage = ((scores.total / maxScore) * 100).toFixed(1);

  const handleRetry = () => {
    // Clear scores
    sessionStorage.removeItem('phase4_2_step5_remedialB1_taskA');
    sessionStorage.removeItem('phase4_2_step5_remedialB1_taskB');
    sessionStorage.removeItem('phase4_2_step5_remedialB1_taskC');
    sessionStorage.removeItem('phase4_2_step5_remedialB1_taskD');
    navigate('/phase4_2/step/5/remedial/b1/task/a');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CharacterMessage
        character="Ms. Mabrouki"
        message={
          passed
            ? "Congratulations! You've successfully completed the B1 remedial activities. Your understanding of social media post corrections is excellent!"
            : "You've completed all tasks, but you need a bit more practice. Review the areas where you lost points and try again. You can do it!"
        }
        variant={passed ? 'success' : 'info'}
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary" align="center">
          B1 Remedial Activities - Results
        </Typography>

        <Alert severity={passed ? 'success' : 'warning'} sx={{ mt: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {passed ? '✓ Passed!' : '✗ Not Passed'}
          </Typography>
          <Typography variant="h6">
            Total Score: {scores.total}/{maxScore} ({percentage}%)
          </Typography>
          <Typography variant="body2">
            Pass Threshold: {passThreshold}/{maxScore} (70%)
          </Typography>
        </Alert>

        <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><strong>Task</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell align="center"><strong>Your Score</strong></TableCell>
                <TableCell align="center"><strong>Max Score</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Task A</TableCell>
                <TableCell>Negotiation Battle (Gap Fill)</TableCell>
                <TableCell align="center">{scores.taskA}</TableCell>
                <TableCell align="center">8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Task B</TableCell>
                <TableCell>Definition Duel (Sentence Correction)</TableCell>
                <TableCell align="center">{scores.taskB}</TableCell>
                <TableCell align="center">8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Task C</TableCell>
                <TableCell>Wordshake Quiz (Error Identification)</TableCell>
                <TableCell align="center">{scores.taskC}</TableCell>
                <TableCell align="center">6</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Task D</TableCell>
                <TableCell>Quizlet Flashcards (Self-Assessment)</TableCell>
                <TableCell align="center">{scores.taskD}</TableCell>
                <TableCell align="center">8</TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell colSpan={2}><strong>TOTAL</strong></TableCell>
                <TableCell align="center"><strong>{scores.total}</strong></TableCell>
                <TableCell align="center"><strong>{maxScore}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Performance Analysis:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1">
                <strong>Task A (Negotiation Battle):</strong> {scores.taskA >= 6 ? '✓ Good' : '✗ Needs improvement'} -
                {scores.taskA >= 6
                  ? ' You understand grammar and sentence structure well.'
                  : ' Review subject-verb agreement, prepositions, and your/you\'re.'}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Task B (Definition Duel):</strong> {scores.taskB >= 6 ? '✓ Good' : '✗ Needs improvement'} -
                {scores.taskB >= 6
                  ? ' Your sentence correction skills are strong.'
                  : ' Focus on articles, vocabulary choice, and coherence.'}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Task C (Wordshake Quiz):</strong> {scores.taskC >= 4 ? '✓ Good' : '✗ Needs improvement'} -
                {scores.taskC >= 4
                  ? ' You can identify error types effectively.'
                  : ' Practice distinguishing spelling, grammar, and vocabulary errors.'}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Task D (Quizlet Flashcards):</strong> {scores.taskD >= 6 ? '✓ Good' : '✗ Needs improvement'} -
                {scores.taskD >= 6
                  ? ' You\'ve learned most corrections.'
                  : ' Review all flashcards and their explanations.'}
              </Typography>
            </li>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRetry}
            size="large"
          >
            Retry Remedial Activities
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDashboard}
            size="large"
          >
            Return to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Results;
