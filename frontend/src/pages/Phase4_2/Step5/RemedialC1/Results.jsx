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
    const taskA = parseInt(sessionStorage.getItem('phase4_2_step5_remedialC1_taskA') || '0');
    const taskB = parseInt(sessionStorage.getItem('phase4_2_step5_remedialC1_taskB') || '0');
    const taskC = parseInt(sessionStorage.getItem('phase4_2_step5_remedialC1_taskC') || '0');
    const taskD = parseInt(sessionStorage.getItem('phase4_2_step5_remedialC1_taskD') || '0');
    const total = taskA + taskB + taskC + taskD;

    setScores({
      taskA,
      taskB,
      taskC,
      taskD,
      total
    });
  }, []);

  const maxScore = 40; // 4 + 12 + 12 + 12
  const passThreshold = 28; // 70%
  const passed = scores.total >= passThreshold;
  const percentage = ((scores.total / maxScore) * 100).toFixed(1);

  const handleRetry = () => {
    sessionStorage.removeItem('phase4_2_step5_remedialC1_taskA');
    sessionStorage.removeItem('phase4_2_step5_remedialC1_taskB');
    sessionStorage.removeItem('phase4_2_step5_remedialC1_taskC');
    sessionStorage.removeItem('phase4_2_step5_remedialC1_taskD');
    navigate('/phase4_2/step/5/remedial/c1/task/a');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CharacterMessage
        character="EMNA"
        message={
          passed
            ? "Congratulations! You've successfully completed the C1 remedial activities. Your mastery of advanced grammar, sophisticated vocabulary, and critical analysis is exemplary. You demonstrate true C1-level proficiency!"
            : "You've completed all tasks at C1 level, which is highly challenging. Review the areas needing improvement, particularly advanced grammar structures, discourse markers, and critical analysis. With practice, you'll achieve mastery!"
        }
        variant={passed ? 'success' : 'info'}
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom color="primary" align="center">
          C1 Remedial Activities - Results
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
                <TableCell>Debate Simulation (Advanced Dialogue)</TableCell>
                <TableCell align="center">{scores.taskA}</TableCell>
                <TableCell align="center">4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Task B</TableCell>
                <TableCell>Analysis Odyssey (Sophisticated Rewrite)</TableCell>
                <TableCell align="center">{scores.taskB}</TableCell>
                <TableCell align="center">12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Task C</TableCell>
                <TableCell>Advanced Quiz (Identify & Fix Complex Errors)</TableCell>
                <TableCell align="center">{scores.taskC}</TableCell>
                <TableCell align="center">12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Task D</TableCell>
                <TableCell>Critique Game (Advanced Error Critique)</TableCell>
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
                <strong>Task A (Debate Simulation):</strong> {scores.taskA >= 3 ? '✓ Excellent' : '✗ Needs improvement'} -
                {scores.taskA >= 3
                  ? ' You understand advanced grammar structures including articles, passive voice, subjunctive mood, and conditionals.'
                  : ' Review articles (a, the), passive voice constructions, subjunctive mood, and conditional forms.'}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Task B (Analysis Odyssey):</strong> {scores.taskB >= 9 ? '✓ Excellent' : '✗ Needs improvement'} -
                {scores.taskB >= 9
                  ? ' Your sophisticated rewriting demonstrates C1-level mastery of grammar, vocabulary, and discourse.'
                  : ' Focus on perfect grammar, sophisticated vocabulary, coherent structure with discourse markers.'}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Task C (Advanced Quiz):</strong> {scores.taskC >= 9 ? '✓ Excellent' : '✗ Needs improvement'} -
                {scores.taskC >= 9
                  ? ' You excel at identifying and correcting complex grammatical errors.'
                  : ' Study relative clauses, conditionals, infinitives, subjunctive mood, articles, and prepositions.'}
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Task D (Critique Game):</strong> {scores.taskD >= 9 ? '✓ Excellent' : '✗ Needs improvement'} -
                {scores.taskD >= 9
                  ? ' Your critical analysis and correction skills are outstanding!'
                  : ' Develop ability to identify and explain errors in register, coherence, vocabulary, grammar, pragmatics, and style.'}
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
