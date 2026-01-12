/**
 * Drag and Drop Exercise Component
 * Interactive exercise where students drag items to correct positions
 * Use cases: matching pairs, sorting, categorization
 */
import { useState, useEffect } from 'react';
import './DragAndDropExercise.css';

const DragAndDropExercise = ({
  exerciseData,
  onComplete,
  onProgress
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZones, setDropZones] = useState({});
  const [sourceItems, setSourceItems] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    initializeExercise();
  }, [exerciseData]);

  const initializeExercise = () => {
    // Initialize source items (items to be dragged)
    const items = exerciseData.items.map((item, index) => ({
      id: `item-${index}`,
      content: item.content,
      correctZone: item.correctZone,
      type: item.type || 'text'
    }));

    // Shuffle items for randomization
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setSourceItems(shuffled);

    // Initialize drop zones
    const zones = {};
    exerciseData.dropZones.forEach(zone => {
      zones[zone.id] = {
        label: zone.label,
        accepts: zone.accepts || 'all',
        item: null
      };
    });
    setDropZones(zones);

    setIsComplete(false);
    setFeedback({});
    setScore(0);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);

    // Add dragging class for visual feedback
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, zoneId) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (!draggedItem) return;

    // Check if zone already has an item
    if (dropZones[zoneId].item) {
      // Return the existing item to source
      setSourceItems(prev => [...prev, dropZones[zoneId].item]);
    }

    // Place new item in zone
    const newDropZones = { ...dropZones };
    newDropZones[zoneId].item = draggedItem;
    setDropZones(newDropZones);

    // Remove item from source
    setSourceItems(prev => prev.filter(item => item.id !== draggedItem.id));

    // Provide immediate feedback
    checkItemPlacement(draggedItem, zoneId);

    setAttempts(prev => prev + 1);

    // Check if exercise is complete
    checkCompletion(newDropZones);
  };

  const handleDropToSource = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (!draggedItem) return;

    // Find which zone had this item and remove it
    const newDropZones = { ...dropZones };
    for (const zoneId in newDropZones) {
      if (newDropZones[zoneId].item?.id === draggedItem.id) {
        newDropZones[zoneId].item = null;
        break;
      }
    }
    setDropZones(newDropZones);

    // Add item back to source
    setSourceItems(prev => [...prev, draggedItem]);
  };

  const checkItemPlacement = (item, zoneId) => {
    const isCorrect = item.correctZone === zoneId;

    const newFeedback = { ...feedback };
    newFeedback[item.id] = {
      status: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect ? 'Correct!' : 'Try a different position'
    };
    setFeedback(newFeedback);

    // Auto-clear feedback after 2 seconds
    setTimeout(() => {
      setFeedback(prev => {
        const updated = { ...prev };
        delete updated[item.id];
        return updated;
      });
    }, 2000);

    if (onProgress) {
      onProgress({
        attempts: attempts + 1,
        correct: isCorrect
      });
    }
  };

  const checkCompletion = (zones) => {
    // Check if all zones are filled
    const allFilled = Object.values(zones).every(zone => zone.item !== null);

    if (allFilled) {
      // Calculate score
      let correctCount = 0;
      for (const zoneId in zones) {
        const item = zones[zoneId].item;
        if (item && item.correctZone === zoneId) {
          correctCount++;
        }
      }

      const totalItems = exerciseData.items.length;
      const finalScore = (correctCount / totalItems) * 100;
      setScore(finalScore);
      setIsComplete(true);

      if (onComplete) {
        onComplete({
          score: finalScore,
          correctCount,
          totalItems,
          attempts,
          isPerfect: correctCount === totalItems
        });
      }
    }
  };

  const handleReset = () => {
    initializeExercise();
    setAttempts(0);
  };

  const handleSubmit = () => {
    // Force check all placements
    const allCorrect = Object.entries(dropZones).every(([zoneId, zone]) => {
      return zone.item && zone.item.correctZone === zoneId;
    });

    const correctCount = Object.entries(dropZones).filter(([zoneId, zone]) => {
      return zone.item && zone.item.correctZone === zoneId;
    }).length;

    const totalItems = exerciseData.items.length;
    const finalScore = (correctCount / totalItems) * 100;

    setScore(finalScore);
    setIsComplete(true);

    if (onComplete) {
      onComplete({
        score: finalScore,
        correctCount,
        totalItems,
        attempts,
        isPerfect: allCorrect
      });
    }
  };

  return (
    <div className="drag-drop-exercise">
      <div className="exercise-header">
        <h3>{exerciseData.instruction || 'Drag items to their correct positions'}</h3>
        {exerciseData.hint && (
          <div className="exercise-hint">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
            </svg>
            {exerciseData.hint}
          </div>
        )}
      </div>

      <div className="exercise-content">
        {/* Source Area (draggable items) */}
        <div
          className="source-area"
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, 'source')}
          onDragLeave={handleDragLeave}
          onDrop={handleDropToSource}
        >
          <div className="source-label">Drag from here:</div>
          <div className="source-items">
            {sourceItems.map(item => (
              <DraggableItem
                key={item.id}
                item={item}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                feedback={feedback[item.id]}
              />
            ))}
          </div>
        </div>

        {/* Drop Zones */}
        <div className="drop-zones">
          {Object.entries(dropZones).map(([zoneId, zone]) => (
            <DropZone
              key={zoneId}
              zoneId={zoneId}
              zone={zone}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              feedback={zone.item ? feedback[zone.item.id] : null}
            />
          ))}
        </div>
      </div>

      <div className="exercise-actions">
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={Object.values(dropZones).some(zone => zone.item === null)}
        >
          Check Answers
        </button>
      </div>

      {isComplete && (
        <div className={`exercise-result ${score === 100 ? 'perfect' : 'partial'}`}>
          <div className="result-score">Score: {Math.round(score)}%</div>
          <div className="result-message">
            {score === 100 ? 'Perfect! All items correctly placed!' : 'Good effort! Review incorrect placements.'}
          </div>
        </div>
      )}
    </div>
  );
};

const DraggableItem = ({ item, onDragStart, onDragEnd, feedback }) => {
  return (
    <div
      className={`draggable-item ${feedback ? feedback.status : ''}`}
      draggable="true"
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
    >
      {item.type === 'text' && <span>{item.content}</span>}
      {item.type === 'image' && <img src={item.content} alt="Draggable item" />}
      {feedback && (
        <div className={`item-feedback ${feedback.status}`}>
          {feedback.status === 'correct' ? '✓' : '✗'}
        </div>
      )}
    </div>
  );
};

const DropZone = ({
  zoneId,
  zone,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
  feedback
}) => {
  return (
    <div
      className={`drop-zone ${zone.item ? 'filled' : 'empty'} ${feedback ? feedback.status : ''}`}
      onDragOver={onDragOver}
      onDragEnter={(e) => onDragEnter(e, zoneId)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, zoneId)}
    >
      <div className="zone-label">{zone.label}</div>
      {zone.item && (
        <div
          className="dropped-item"
          draggable="true"
          onDragStart={(e) => onDragStart(e, zone.item)}
          onDragEnd={onDragEnd}
        >
          {zone.item.type === 'text' && <span>{zone.item.content}</span>}
          {zone.item.type === 'image' && <img src={zone.item.content} alt="Dropped item" />}
        </div>
      )}
    </div>
  );
};

export default DragAndDropExercise;
