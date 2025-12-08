/**
 * Gamification Dashboard Component
 * Comprehensive view of all gamification features
 */
import { useState, useEffect } from 'react';
import XPCounter from './XPCounter';
import StreakDisplay from './StreakDisplay';
import AchievementShowcase from './AchievementShowcase';
import FeedbackAnimations from './FeedbackAnimations';
import './GamificationDashboard.css';

const GamificationDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/gamification/dashboard', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="gamification-dashboard loading">
        <div className="loading-spinner">Loading your progress...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="gamification-dashboard error">
        <p>Unable to load gamification data</p>
      </div>
    );
  }

  const { progression, daily_xp, achievements, streak } = dashboardData;

  return (
    <div className="gamification-dashboard">
      <FeedbackAnimations />

      <div className="dashboard-header">
        <h1>Your Progress</h1>
        <p className="dashboard-subtitle">Track your learning journey</p>
      </div>

      {/* Top Stats Row */}
      <div className="dashboard-stats-row">
        <div className="stat-card xp-stat">
          <XPCounter showDetails={true} />
        </div>

        <div className="stat-card streak-stat">
          <StreakDisplay />
        </div>
      </div>

      {/* Daily Progress */}
      <div className="daily-progress-section">
        <h2>Today's Progress</h2>
        <div className="daily-xp-card">
          <div className="daily-xp-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
            </svg>
          </div>
          <div className="daily-xp-info">
            <div className="daily-xp-label">XP Earned Today</div>
            <div className="daily-xp-value">{daily_xp} XP</div>
          </div>
        </div>

        {/* Daily Goals */}
        <DailyGoals dailyXP={daily_xp} />
      </div>

      {/* Achievements Section */}
      <div className="achievements-section-dashboard">
        <div className="section-header">
          <h2>Recent Achievements</h2>
          <div className="achievement-summary">
            {achievements.total_unlocked} / {achievements.total_available} unlocked
            ({Math.round(achievements.completion_percentage)}%)
          </div>
        </div>

        {achievements.recent && achievements.recent.length > 0 ? (
          <div className="recent-achievements-grid">
            {achievements.recent.map((achievement) => (
              <RecentAchievementCard
                key={achievement.achievement_id}
                achievement={achievement}
              />
            ))}
          </div>
        ) : (
          <div className="no-achievements">
            <p>No achievements yet. Keep learning to unlock them!</p>
          </div>
        )}

        <button
          className="view-all-button"
          onClick={() => window.location.href = '/app/achievements'}
        >
          View All Achievements
        </button>
      </div>

      {/* Level Progress */}
      <div className="level-progress-section">
        <h2>Level Progress</h2>
        <LevelProgressChart progression={progression} />
      </div>
    </div>
  );
};

const DailyGoals = ({ dailyXP }) => {
  const goals = [
    { label: 'Beginner', target: 100, color: '#3b82f6' },
    { label: 'Intermediate', target: 250, color: '#8b5cf6' },
    { label: 'Advanced', target: 500, color: '#f59e0b' }
  ];

  return (
    <div className="daily-goals">
      <h3>Daily Goals</h3>
      <div className="goals-list">
        {goals.map((goal) => {
          const progress = Math.min(100, (dailyXP / goal.target) * 100);
          const achieved = dailyXP >= goal.target;

          return (
            <div key={goal.label} className={`goal-item ${achieved ? 'achieved' : ''}`}>
              <div className="goal-header">
                <span className="goal-label">{goal.label}</span>
                <span className="goal-target">{goal.target} XP</span>
              </div>
              <div className="goal-progress-bar">
                <div
                  className="goal-progress-fill"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: goal.color
                  }}
                />
              </div>
              {achieved && (
                <div className="goal-achieved-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                  Completed!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RecentAchievementCard = ({ achievement }) => {
  const rarityColors = {
    'common': '#95A5A6',
    'uncommon': '#27AE60',
    'rare': '#3498DB',
    'epic': '#9B59B6',
    'legendary': '#F39C12'
  };

  return (
    <div
      className="recent-achievement-card"
      style={{ borderColor: rarityColors[achievement.rarity] }}
    >
      <img
        src={`/static/assets/icons/${achievement.icon}`}
        alt={achievement.name}
        className="recent-achievement-icon"
      />
      <div className="recent-achievement-name">{achievement.name}</div>
      <div className="recent-achievement-date">
        {new Date(achievement.unlocked_at).toLocaleDateString()}
      </div>
    </div>
  );
};

const LevelProgressChart = ({ progression }) => {
  if (!progression) return null;

  const { current_level, level_info, next_level_info, progress_percentage } = progression;

  return (
    <div className="level-progress-chart">
      <div className="level-visual">
        <div className="current-level-badge">
          <img
            src={`/static/assets/icons/${level_info.icon}`}
            alt={level_info.title}
            className="level-badge-icon"
          />
          <div className="level-badge-info">
            <div className="level-badge-number">Level {current_level}</div>
            <div className="level-badge-title">{level_info.title}</div>
          </div>
        </div>

        <div className="level-connector">
          <div className="connector-line">
            <div
              className="connector-progress"
              style={{ width: `${progress_percentage}%` }}
            />
          </div>
          <div className="connector-percentage">{Math.round(progress_percentage)}%</div>
        </div>

        {next_level_info && (
          <div className="next-level-badge faded">
            <img
              src={`/static/assets/icons/${next_level_info.icon}`}
              alt={next_level_info.title}
              className="level-badge-icon"
            />
            <div className="level-badge-info">
              <div className="level-badge-number">Level {current_level + 1}</div>
              <div className="level-badge-title">{next_level_info.title}</div>
            </div>
          </div>
        )}
      </div>

      {next_level_info && (
        <div className="level-unlock-preview">
          <div className="unlock-label">Next unlock:</div>
          <div className="unlock-feature">{next_level_info.unlock}</div>
        </div>
      )}
    </div>
  );
};

export default GamificationDashboard;
