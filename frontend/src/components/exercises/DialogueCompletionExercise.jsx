/**
 * Dialogue Completion Exercise Component
 * Interactive conversation exercise where students complete dialogue with appropriate responses
 */
import { useState, useEffect, useRef } from 'react';
import './DialogueCompletionExercise.css';

const DialogueCompletionExercise = ({
  exerciseData,
  onComplete,
  onProgress
}) => {
  const [dialogueState, setDialogueState] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInputs, setUserInputs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    initializeDialogue();
  }, [exerciseData]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages appear
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [dialogueState]);

  const initializeDialogue = () => {
    const initialDialogue = [];

    // Add initial NPC message if exists
    if (exerciseData.initialMessage) {
      initialDialogue.push({
        speaker: exerciseData.npcName || 'Instructor',
        message: exerciseData.initialMessage,
        isNPC: true,
        timestamp: Date.now()
      });
    }

    setDialogueState(initialDialogue);
    setCurrentTurnIndex(0);
    setUserInputs({});
    setFeedback(null);
    setIsComplete(false);
  };

  const getCurrentTurn = () => {
    return exerciseData.turns[currentTurnIndex];
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleTextInput = (turnId, text) => {
    setUserInputs(prev => ({
      ...prev,
      [turnId]: text
    }));
  };

  const handleSubmitResponse = () => {
    const currentTurn = getCurrentTurn();

    let userResponse;
    let isCorrect = false;

    if (currentTurn.type === 'multiple_choice') {
      userResponse = selectedOption;
      isCorrect = selectedOption === currentTurn.correctAnswer;
    } else if (currentTurn.type === 'text_input') {
      userResponse = userInputs[currentTurn.id] || '';
      isCorrect = checkTextAnswer(userResponse, currentTurn.acceptedAnswers);
    }

    // Add user's response to dialogue
    const newDialogue = [
      ...dialogueState,
      {
        speaker: 'You',
        message: userResponse,
        isNPC: false,
        isCorrect: isCorrect,
        timestamp: Date.now()
      }
    ];

    // Add NPC response/feedback
    if (currentTurn.npcResponse) {
      newDialogue.push({
        speaker: exerciseData.npcName || 'Instructor',
        message: isCorrect ? currentTurn.npcResponse.correct : currentTurn.npcResponse.incorrect,
        isNPC: true,
        timestamp: Date.now() + 500
      });
    }

    setDialogueState(newDialogue);
    setFeedback({
      isCorrect,
      message: isCorrect ? 'Great response!' : 'Not quite right. Try again!'
    });

    if (onProgress) {
      onProgress({
        turnIndex: currentTurnIndex,
        correct: isCorrect
      });
    }

    // Move to next turn or complete
    if (isCorrect) {
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);

        if (currentTurnIndex < exerciseData.turns.length - 1) {
          setCurrentTurnIndex(prev => prev + 1);
        } else {
          completeExercise(newDialogue);
        }
      }, 2000);
    }
  };

  const checkTextAnswer = (userAnswer, acceptedAnswers) => {
    const normalized = userAnswer.toLowerCase().trim();
    return acceptedAnswers.some(answer =>
      normalized.includes(answer.toLowerCase()) ||
      answer.toLowerCase().includes(normalized)
    );
  };

  const completeExercise = (finalDialogue) => {
    const correctCount = finalDialogue.filter(turn =>
      !turn.isNPC && turn.isCorrect
    ).length;

    const totalTurns = exerciseData.turns.length;
    const finalScore = (correctCount / totalTurns) * 100;

    setScore(finalScore);
    setIsComplete(true);

    if (onComplete) {
      onComplete({
        score: finalScore,
        correctCount,
        totalTurns,
        isPerfect: correctCount === totalTurns,
        dialogue: finalDialogue
      });
    }
  };

  const handleRetry = () => {
    setFeedback(null);
    setSelectedOption(null);
  };

  const currentTurn = !isComplete ? getCurrentTurn() : null;

  return (
    <div className="dialogue-completion-exercise">
      <div className="exercise-header">
        <div className="npc-info">
          {exerciseData.npcAvatar && (
            <img
              src={exerciseData.npcAvatar}
              alt={exerciseData.npcName}
              className="npc-avatar"
            />
          )}
          <div className="npc-details">
            <div className="npc-name">{exerciseData.npcName || 'Instructor'}</div>
            <div className="npc-role">{exerciseData.npcRole || 'Your conversation partner'}</div>
          </div>
        </div>

        <div className="progress-indicator">
          Turn {currentTurnIndex + 1} / {exerciseData.turns.length}
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container" ref={chatContainerRef}>
        {dialogueState.map((turn, index) => (
          <ChatBubble key={index} turn={turn} />
        ))}

        {feedback && (
          <div className={`feedback-bubble ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
            {feedback.message}
          </div>
        )}
      </div>

      {/* Input Area */}
      {!isComplete && currentTurn && (
        <div className="input-area">
          <div className="turn-prompt">{currentTurn.prompt}</div>

          {currentTurn.type === 'multiple_choice' && (
            <div className="options-list">
              {currentTurn.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                  disabled={feedback !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentTurn.type === 'text_input' && (
            <div className="text-input-container">
              <textarea
                className="text-input"
                placeholder="Type your response..."
                value={userInputs[currentTurn.id] || ''}
                onChange={(e) => handleTextInput(currentTurn.id, e.target.value)}
                disabled={feedback !== null}
                rows={3}
              />
            </div>
          )}

          <div className="action-buttons">
            {feedback && !feedback.isCorrect && (
              <button className="retry-button" onClick={handleRetry}>
                Try Again
              </button>
            )}
            <button
              className="submit-button"
              onClick={handleSubmitResponse}
              disabled={
                feedback !== null ||
                (currentTurn.type === 'multiple_choice' && !selectedOption) ||
                (currentTurn.type === 'text_input' && !userInputs[currentTurn.id])
              }
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Completion Summary */}
      {isComplete && (
        <div className="completion-summary">
          <div className="summary-icon">
            {score === 100 ? '🎉' : '👍'}
          </div>
          <div className="summary-score">Score: {Math.round(score)}%</div>
          <div className="summary-message">
            {score === 100
              ? 'Perfect dialogue! You responded appropriately to all situations.'
              : 'Good conversation! Review the dialogue to improve your responses.'}
          </div>
          <button className="restart-button" onClick={initializeDialogue}>
            Start New Dialogue
          </button>
        </div>
      )}
    </div>
  );
};

const ChatBubble = ({ turn }) => {
  return (
    <div className={`chat-bubble ${turn.isNPC ? 'npc-bubble' : 'user-bubble'} ${turn.isCorrect === false ? 'incorrect-bubble' : ''}`}>
      <div className="bubble-speaker">{turn.speaker}</div>
      <div className="bubble-message">{turn.message}</div>
      <div className="bubble-timestamp">
        {new Date(turn.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

export default DialogueCompletionExercise;
