/**
 * XP Counter Component
 * Displays user's current XP, level, and progress to next level
 */
import { useState, useEffect } from 'react';
import './XPCounter.css';

const XPCounter = ({ showDetails = true, compact = false }) => {
  const [progression, setProgression] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatingXP, setAnimatingXP] = useState(false);

  useEffect(() => {
    fetchProgression();
  }, []);

  const fetchProgression = async () => {
    try {
      const response = await fetch('/api/gamification/progression', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProgression(data);
      }
    } catch (error) {
      console.error('Error fetching progression:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleXPUpdate = (event) => {
    // Listen for XP update events
    const { xp_awarded, new_total } = event.detail;

    if (progression) {
      setAnimatingXP(true);
      setTimeout(() => {
        setProgression({
          ...progression,
          total_xp: new_total
        });
        setAnimatingXP(false);
      }, 300);
    }
  };

  useEffect(() => {
    window.addEventListener('xp-awarded', handleXPUpdate);
    return () => window.removeEventListener('xp-awarded', handleXPUpdate);
  }, [progression]);

  if (loading) {
    return (
      <div className={`xp-counter ${compact ? 'compact' : ''}`}>
        <div className="xp-counter-loading">Loading...</div>
      </div>
    );
  }

  if (!progression) {
    return null;
  }

  const { total_xp, current_level, level_info, progress_percentage } = progression;

  if (compact) {
    return (
      <div className="xp-counter compact">
        <div className="xp-compact-display">
          <div className="level-badge-small">
            <img
              src={`/static/assets/icons/${level_info.icon}`}
              alt={level_info.title}
              className="level-icon-small"
            />
            <span className="level-number">{current_level}</span>
          </div>
          <div className="xp-value-small">
            <span className={`xp-number ${animatingXP ? 'animating' : ''}`}>
              {total_xp.toLocaleString()}
            </span>
            <span className="xp-label">XP</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xp-counter">
      <div className="xp-header">
        <div className="level-info">
          <div className="level-badge">
            <img
              src={`/static/assets/icons/${level_info.icon}`}
              alt={level_info.title}
              className="level-icon"
            />
            <div className="level-details">
              <div className="level-number">Level {current_level}</div>
              <div className="level-title">{level_info.title}</div>
            </div>
          </div>
        </div>

        <div className="xp-display">
          <div className={`xp-value ${animatingXP ? 'animating' : ''}`}>
            {total_xp.toLocaleString()} XP
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          <div className="xp-progress-bar">
            <div
              className="xp-progress-fill"
              style={{ width: `${progress_percentage}%` }}
            >
              <span className="progress-percentage">
                {Math.round(progress_percentage)}%
              </span>
            </div>
          </div>

          <div className="xp-progress-details">
            <span className="xp-current">
              {progression.xp_in_current_level} XP
            </span>
            <span className="xp-separator">/</span>
            <span className="xp-needed">
              {progression.xp_needed_for_next} XP to next level
            </span>
          </div>

          {progression.next_level_info && (
            <div className="next-level-preview">
              <div className="next-level-label">Next:</div>
              <div className="next-level-title">
                {progression.next_level_info.title}
              </div>
              <div className="next-level-unlock">
                Unlocks: {progression.next_level_info.unlock}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default XPCounter;
