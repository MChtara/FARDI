/**
 * Achievement Showcase Component
 * Displays user's achievements and progress
 */
import { useState, useEffect } from 'react';
import './AchievementShowcase.css';

const AchievementShowcase = ({ showLocked = false, limit = null }) => {
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, [showLocked]);

  const fetchAchievements = async () => {
    try {
      const url = `/api/gamification/achievements?include_locked=${showLocked}`;
      const response = await fetch(url, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'common': '#95A5A6',
      'uncommon': '#27AE60',
      'rare': '#3498DB',
      'epic': '#9B59B6',
      'legendary': '#F39C12'
    };
    return colors[rarity] || colors.common;
  };

  if (loading) {
    return (
      <div className="achievement-showcase">
        <div className="showcase-loading">Loading achievements...</div>
      </div>
    );
  }

  if (!achievements) {
    return null;
  }

  const displayedUnlocked = limit
    ? achievements.unlocked.slice(0, limit)
    : achievements.unlocked;

  const displayedLocked = limit && showLocked
    ? achievements.locked?.slice(0, limit)
    : achievements.locked || [];

  const completionPercentage = achievements.total_available > 0
    ? (achievements.total_unlocked / achievements.total_available * 100)
    : 0;

  return (
    <div className="achievement-showcase">
      <div className="showcase-header">
        <div className="showcase-title">
          <h2>Achievements</h2>
          <div className="achievement-count">
            {achievements.total_unlocked} / {achievements.total_available}
          </div>
        </div>
        <div className="achievement-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="progress-text">
            {Math.round(completionPercentage)}% Complete
          </div>
        </div>
      </div>

      {displayedUnlocked.length > 0 && (
        <div className="achievements-section">
          <h3 className="section-title">Unlocked</h3>
          <div className="achievements-grid">
            {displayedUnlocked.map(achievement => (
              <AchievementCard
                key={achievement.achievement_id}
                achievement={achievement}
                locked={false}
                onClick={() => setSelectedAchievement(achievement)}
                rarityColor={getRarityColor(achievement.rarity)}
              />
            ))}
          </div>
        </div>
      )}

      {showLocked && displayedLocked.length > 0 && (
        <div className="achievements-section">
          <h3 className="section-title">Locked</h3>
          <div className="achievements-grid">
            {displayedLocked.map(achievement => (
              <AchievementCard
                key={achievement.achievement_id}
                achievement={achievement}
                locked={true}
                onClick={() => setSelectedAchievement(achievement)}
                rarityColor={getRarityColor(achievement.rarity)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          rarityColor={getRarityColor(selectedAchievement.rarity)}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  );
};

const AchievementCard = ({ achievement, locked, onClick, rarityColor }) => {
  return (
    <div
      className={`achievement-card ${locked ? 'locked' : 'unlocked'}`}
      onClick={onClick}
      style={{ borderColor: locked ? '#ccc' : rarityColor }}
    >
      <div className="achievement-icon-container">
        <img
          src={`/static/assets/icons/${achievement.icon}`}
          alt={achievement.name}
          className={`achievement-icon ${locked ? 'locked-icon' : ''}`}
        />
        {!locked && (
          <div
            className="rarity-badge"
            style={{ backgroundColor: rarityColor }}
          >
            {achievement.rarity}
          </div>
        )}
      </div>
      <div className="achievement-info">
        <div className="achievement-name">{achievement.name}</div>
        {!locked && achievement.unlocked_at && (
          <div className="achievement-date">
            {new Date(achievement.unlocked_at).toLocaleDateString()}
          </div>
        )}
        {locked && (
          <div className="achievement-locked-label">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
            </svg>
            Locked
          </div>
        )}
      </div>
    </div>
  );
};

const AchievementModal = ({ achievement, rarityColor, onClose }) => {
  return (
    <div className="achievement-modal-overlay" onClick={onClose}>
      <div
        className="achievement-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: rarityColor }}
      >
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header" style={{ borderBottomColor: rarityColor }}>
          <div className="modal-icon-container">
            <img
              src={`/static/assets/icons/${achievement.icon}`}
              alt={achievement.name}
              className="modal-icon"
            />
          </div>
          <div
            className="modal-rarity-badge"
            style={{ backgroundColor: rarityColor }}
          >
            {achievement.rarity}
          </div>
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{achievement.name}</h2>
          <p className="modal-description">{achievement.description}</p>

          {achievement.xp_reward > 0 && (
            <div className="modal-reward">
              <div className="reward-label">XP Reward</div>
              <div className="reward-value">+{achievement.xp_reward} XP</div>
            </div>
          )}

          {achievement.unlocked_at && (
            <div className="modal-unlocked">
              <div className="unlocked-label">Unlocked on</div>
              <div className="unlocked-date">
                {new Date(achievement.unlocked_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          )}

          {achievement.condition && (
            <div className="modal-condition">
              <div className="condition-label">How to unlock</div>
              <div className="condition-text">
                {formatCondition(achievement.condition)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const formatCondition = (condition) => {
  const { type, count, level, step } = condition;

  const templates = {
    'action_items_completed': `Complete ${count} action items`,
    'phase_completed': `Complete ${count} phase(s)`,
    'streak': `Maintain a ${count}-day streak`,
    'perfect_scores': `Get ${count} perfect scores`,
    'speed_bonuses': `Earn ${count} speed bonuses`,
    'remedial_level_completed': `Complete ${count} ${level} remedial activities`,
    'step_completed': `Complete all activities in ${step}`,
    'early_activity': `Complete activities before 9 AM on ${count} days`,
    'late_activity': `Complete activities after 10 PM on ${count} days`,
    'friends_count': `Connect with ${count} friends`,
    'peer_help': `Help ${count} peers in study groups`
  };

  return templates[type] || 'Complete the required task';
};

export default AchievementShowcase;
