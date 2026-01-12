/**
 * Streak Display Component
 * Shows user's current streak and status
 */
import { useState, useEffect } from 'react';
import './StreakDisplay.css';

const StreakDisplay = ({ compact = false }) => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreakStatus();
  }, []);

  const fetchStreakStatus = async () => {
    try {
      const response = await fetch('/api/gamification/streak', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setStreakData(data);
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseFreezeToken = async () => {
    try {
      const response = await fetch('/api/gamification/streak/freeze', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStreakData(result.streak_status);
          alert(result.message);
        } else {
          alert(result.error || 'Could not use freeze token');
        }
      }
    } catch (error) {
      console.error('Error using freeze token:', error);
      alert('Failed to use freeze token');
    }
  };

  if (loading) {
    return <div className={`streak-display ${compact ? 'compact' : ''}`}>Loading...</div>;
  }

  if (!streakData) {
    return null;
  }

  const { current_streak, longest_streak, freeze_tokens, status, at_risk, next_milestone } = streakData;

  const getStreakIcon = () => {
    if (current_streak >= 30) return 'streak-legendary';
    if (current_streak >= 14) return 'streak-epic';
    if (current_streak >= 7) return 'streak-hot';
    if (current_streak >= 3) return 'streak-warm';
    return 'streak-start';
  };

  const getStatusColor = () => {
    if (at_risk) return '#ef4444';
    if (status === 'active_today') return '#4ade80';
    return '#f59e0b';
  };

  const getStatusText = () => {
    if (status === 'active_today') return 'Active today';
    if (status === 'can_continue') return 'Continue today!';
    if (status === 'broken') return 'Start a new streak';
    return 'Not started';
  };

  if (compact) {
    return (
      <div className="streak-display compact">
        <div className="streak-icon-compact">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: getStatusColor() }}>
            <path d="M12,2C12,2 7,6.2 7,11C7,14.31 9.69,17 13,17C16.31,17 19,14.31 19,11C19,6.2 14,2 14,2H12M13,14C11.21,14 9.76,12.55 9.76,10.76C9.76,8.97 11.21,7.5 13,7.5V9.5C12.31,9.5 11.76,10.05 11.76,10.76C11.76,11.47 12.31,12 13,12V14Z" />
          </svg>
        </div>
        <div className="streak-compact-info">
          <div className="streak-number">{current_streak}</div>
          <div className="streak-label">day streak</div>
        </div>
      </div>
    );
  }

  return (
    <div className="streak-display">
      <div className="streak-header">
        <div className="streak-icon-large">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: getStatusColor() }}>
            <path d="M12,2C12,2 7,6.2 7,11C7,14.31 9.69,17 13,17C16.31,17 19,14.31 19,11C19,6.2 14,2 14,2H12M13,14C11.21,14 9.76,12.55 9.76,10.76C9.76,8.97 11.21,7.5 13,7.5V9.5C12.31,9.5 11.76,10.05 11.76,10.76C11.76,11.47 12.31,12 13,12V14Z" />
          </svg>
        </div>
        <div className="streak-info">
          <div className="streak-current">
            <span className="streak-number-large">{current_streak}</span>
            <span className="streak-days-label">Day Streak</span>
          </div>
          <div className="streak-status" style={{ color: getStatusColor() }}>
            {getStatusText()}
          </div>
        </div>
      </div>

      {at_risk && freeze_tokens > 0 && (
        <div className="streak-warning">
          <div className="warning-text">
            Your streak is at risk! Use a freeze token to protect it.
          </div>
          <button
            className="use-freeze-button"
            onClick={handleUseFreezeToken}
          >
            Use Freeze Token ({freeze_tokens} available)
          </button>
        </div>
      )}

      <div className="streak-stats">
        <div className="streak-stat">
          <div className="stat-label">Longest Streak</div>
          <div className="stat-value">{longest_streak} days</div>
        </div>
        <div className="streak-stat">
          <div className="stat-label">Freeze Tokens</div>
          <div className="stat-value">{freeze_tokens}</div>
        </div>
      </div>

      {next_milestone && (
        <div className="streak-milestone">
          <div className="milestone-header">Next Milestone</div>
          <div className="milestone-info">
            <div className="milestone-streak">{next_milestone.streak} days</div>
            <div className="milestone-reward">+{next_milestone.xp_reward} XP</div>
          </div>
          <div className="milestone-progress">
            <div className="milestone-progress-bar">
              <div
                className="milestone-progress-fill"
                style={{
                  width: `${(current_streak / next_milestone.streak) * 100}%`
                }}
              />
            </div>
            <div className="milestone-remaining">
              {next_milestone.days_remaining} days to go
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakDisplay;
