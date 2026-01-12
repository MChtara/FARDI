/**
 * Feedback Animations Component
 * Handles visual feedback: confetti, XP pop-ups, level-up animations, achievement unlocks
 */
import { useEffect, useState } from 'react';
import './FeedbackAnimations.css';

const FeedbackAnimations = () => {
  const [activeAnimations, setActiveAnimations] = useState([]);
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    // Listen for gamification events
    window.addEventListener('xp-awarded', handleXPAwarded);
    window.addEventListener('level-up', handleLevelUp);
    window.addEventListener('achievement-unlocked', handleAchievementUnlock);
    window.addEventListener('streak-milestone', handleStreakMilestone);

    return () => {
      window.removeEventListener('xp-awarded', handleXPAwarded);
      window.removeEventListener('level-up', handleLevelUp);
      window.removeEventListener('achievement-unlocked', handleAchievementUnlock);
      window.removeEventListener('streak-milestone', handleStreakMilestone);
    };
  }, []);

  const handleXPAwarded = (event) => {
    const { xp_amount, reason } = event.detail;

    const animation = {
      id: Date.now(),
      type: 'xp',
      xp: xp_amount,
      reason: formatReason(reason),
      duration: 2000
    };

    addAnimation(animation);
    playSound('xp-gain');
  };

  const handleLevelUp = (event) => {
    const { new_level, level_title } = event.detail;

    const animation = {
      id: Date.now(),
      type: 'level-up',
      level: new_level,
      title: level_title,
      duration: 3000
    };

    addAnimation(animation);
    triggerConfetti();
    playSound('level-up');
  };

  const handleAchievementUnlock = (event) => {
    const { achievement } = event.detail;

    const animation = {
      id: Date.now(),
      type: 'achievement',
      achievement: achievement,
      duration: 3000
    };

    addAnimation(animation);
    triggerConfetti();
    playSound('achievement');
  };

  const handleStreakMilestone = (event) => {
    const { streak, message } = event.detail;

    const animation = {
      id: Date.now(),
      type: 'streak',
      streak: streak,
      message: message,
      duration: 2500
    };

    addAnimation(animation);
    triggerConfetti();
    playSound('streak');
  };

  const addAnimation = (animation) => {
    setActiveAnimations(prev => [...prev, animation]);

    setTimeout(() => {
      removeAnimation(animation.id);
    }, animation.duration);
  };

  const removeAnimation = (id) => {
    setActiveAnimations(prev => prev.filter(anim => anim.id !== id));
  };

  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  const playSound = (soundType) => {
    // Sound playback (if audio files are available)
    try {
      const audio = new Audio(`/static/assets/sounds/${soundType}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silently fail if sound can't play
      });
    } catch (error) {
      // Sound not available
    }
  };

  const formatReason = (reason) => {
    const reasonMap = {
      'action_item_completed': 'Activity Complete',
      'action_item_perfect': 'Perfect Score!',
      'first_try_success': 'First Try Bonus',
      'speed_bonus': 'Speed Bonus',
      'streak_bonus_3': '3-Day Streak',
      'streak_bonus_5': '5-Day Streak',
      'streak_bonus_10': '10-Day Streak',
      'remedial_A1_completed': 'A1 Practice',
      'remedial_A2_completed': 'A2 Practice',
      'remedial_B1_completed': 'B1 Practice'
    };

    return reasonMap[reason] || 'XP Earned';
  };

  return (
    <>
      {/* Confetti Effect */}
      {confettiActive && <ConfettiEffect />}

      {/* Active Animations */}
      <div className="feedback-animations-container">
        {activeAnimations.map(animation => (
          <AnimationComponent key={animation.id} animation={animation} />
        ))}
      </div>
    </>
  );
};

const AnimationComponent = ({ animation }) => {
  const { type } = animation;

  if (type === 'xp') {
    return <XPAnimation animation={animation} />;
  } else if (type === 'level-up') {
    return <LevelUpAnimation animation={animation} />;
  } else if (type === 'achievement') {
    return <AchievementAnimation animation={animation} />;
  } else if (type === 'streak') {
    return <StreakAnimation animation={animation} />;
  }

  return null;
};

const XPAnimation = ({ animation }) => {
  return (
    <div className="xp-popup">
      <div className="xp-popup-content">
        <div className="xp-amount">+{animation.xp} XP</div>
        <div className="xp-reason">{animation.reason}</div>
      </div>
    </div>
  );
};

const LevelUpAnimation = ({ animation }) => {
  return (
    <div className="level-up-modal">
      <div className="level-up-content">
        <div className="level-up-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <div className="level-up-text">
          <div className="level-up-title">Level Up!</div>
          <div className="level-up-level">Level {animation.level}</div>
          <div className="level-up-name">{animation.title}</div>
        </div>
      </div>
    </div>
  );
};

const AchievementAnimation = ({ animation }) => {
  const { achievement } = animation;

  return (
    <div className="achievement-popup">
      <div className="achievement-content">
        <div className="achievement-header">
          <div className="achievement-icon-wrapper">
            <img
              src={`/static/assets/icons/${achievement.icon}`}
              alt={achievement.name}
              className="achievement-icon"
            />
          </div>
          <div className="achievement-badge">Achievement Unlocked!</div>
        </div>
        <div className="achievement-name">{achievement.name}</div>
        <div className="achievement-description">{achievement.description}</div>
        {achievement.xp_reward > 0 && (
          <div className="achievement-xp">+{achievement.xp_reward} XP</div>
        )}
      </div>
    </div>
  );
};

const StreakAnimation = ({ animation }) => {
  return (
    <div className="streak-popup">
      <div className="streak-content">
        <div className="streak-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12,2 7,6.2 7,11C7,14.31 9.69,17 13,17C16.31,17 19,14.31 19,11C19,6.2 14,2 14,2H12M13,14C11.21,14 9.76,12.55 9.76,10.76C9.76,8.97 11.21,7.5 13,7.5V9.5C12.31,9.5 11.76,10.05 11.76,10.76C11.76,11.47 12.31,12 13,12V14Z" />
          </svg>
        </div>
        <div className="streak-text">
          <div className="streak-days">{animation.streak} Day Streak!</div>
          <div className="streak-message">{animation.message}</div>
        </div>
      </div>
    </div>
  );
};

const ConfettiEffect = () => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    color: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className="confetti-container">
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            backgroundColor: piece.color
          }}
        />
      ))}
    </div>
  );
};

export default FeedbackAnimations;
