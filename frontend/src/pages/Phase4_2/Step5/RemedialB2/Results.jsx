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
    const taskA = parseInt(sessionStorage.getItem('phase4_2_step5_remedialB2_taskA') || '0');
    const taskB = parseInt(sessionStorage.getItem('phase4_2_step5_remedialB2_taskB') || '0');
    const taskC = parseInt(sessionStorage.getItem('phase4_2_step5_remedialB2_taskC') || '0');
    const taskD = parseInt(sessionStorage.getItem('phase4_2_step5_remedialB2_taskD') || '0');
    const total = taskA + taskB + taskC + taskD;

    setScores({
      taskA,
      taskB,
      taskC,
      taskD,
      total
    });
  }, []);

  const maxScore = 34; // 4 + 10 + 8 + 12
  const passThreshold = 24; // 70%
  const passed = scores.total >= passThreshold;
  const percentage = ((scores.total / maxScore) * 100).toFixed(1);

  const handleRetry = () => {
    sessionStorage.removeItem('phase4_2_step5_remedialB2_taskA');
    sessionStorage.removeItem('phase4_2_step5_remedialB2_taskB');
    sessionStorage.removeItem('phase4_2_step5_remedialB2_taskC');
    sessionStorage.removeItem('phase4_2_step5_remedialB2_taskD');
    navigate('/phase4_2/step/5/remedial/b2/task/a');
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
            ? "Congratulations! You've successfully completed the B2 remedial activities. Your post correction and rewriting skills are impressive!"
            : "You've completed all tasks, but you need more practice. Review the areas where you need improvement and try again. Keep working hard!"
        }
        variant={passed ? 'success' : 'info'}
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary" align="center">
          B2 Remedial Activities - Results
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
                <TableCell>Role-Play Saga (Dialogue Completion)</TableCell>
                <TableCell align="center">{scores.taskA}</TableCell>
                <TableCell align="center">4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Task B</TableCell>
                <TableCell>Analysis Odyssey (Full Post Rewrite)</TableCell>
                <TableCell align="center">{scores.taskB}</TableCell>
                <TableCell align="center">10</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Task C</TableCell>
                <TableCell>Matching Game (Error Types to Corrections)</TableCell>
                <TableCell align="center">{scores.taskC}</TableCell>
                <TableCell align="center">8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Task D</TableCell>
                <TableCell>Spelling & Explain</TableCell>
                <TableCell align="center">{scores.taskD}</TableCell>
                <TableCell align="center">12</TableCell>
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
                <strong>Task A (Role-Play Saga):</strong> {scores.taskA >= 3 ? '✓ Good' : '✗ Needs improvement'} -
                {scores.taskA >= 3
                  ? ' You can correct post errors in context effectively.'
                  : ' Review grammar, articles, and sentence structure.'}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Task B (Analysis Odyssey):</strong> {scores.taskB >= 7 ? '✓ Good' : '✗ Needs improvement'} -
                {scores.taskB >= 7
                  ? ' Your post rewriting skills are strong!'
                  : ' Focus on coherence, vocabulary, and engaging tone.'}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Task C (Matching Game):</strong> {scores.taskC >= 6 ? '✓ Good' : '✗ Needs improvement'} -
                {scores.taskC >= 6
                  ? ' You can identify error types well!'
                  : ' Practice distinguishing different error categories.'}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Task D (Spelling & Explain):</strong> {scores.taskD >= 8 ? '✓ Good' : '✗ Needs improvement'} -
                {scores.taskD >= 8
                  ? ' You know spellings and meanings well!'
                  : ' Review social media vocabulary and explanations.'}
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
