/**
 * Gamification Events Utility
 * Helper functions for triggering gamification events and awarding XP
 */

/**
 * Award XP for completing an activity
 * @param {Object} params - Activity parameters
 * @param {string} params.activity_type - Type of activity (e.g., 'action_item', 'remedial_A1')
 * @param {string} params.activity_id - Activity identifier
 * @param {boolean} params.is_perfect - Whether user got perfect score
 * @param {boolean} params.is_first_try - Whether completed on first try
 * @param {boolean} params.speed_bonus - Whether user earned speed bonus
 * @returns {Promise<Object>} Result with XP and achievement data
 */
export const awardActivityXP = async ({
  activity_type,
  activity_id,
  is_perfect = false,
  is_first_try = false,
  speed_bonus = false
}) => {
  try {
    const response = await fetch('/api/gamification/internal/award-activity-xp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        activity_type,
        activity_id,
        is_perfect,
        is_first_try,
        speed_bonus
      })
    });

    if (!response.ok) {
      throw new Error('Failed to award XP');
    }

    const result = await response.json();

    // Trigger UI events
    if (result.success) {
      // XP awarded event
      triggerXPEvent(result.total_xp_awarded, activity_type);

      // Level up event
      if (result.progression.leveled_up) {
        triggerLevelUpEvent(
          result.progression.current_level,
          result.progression.level_info.title
        );
      }

      // Achievement unlock events
      if (result.new_achievements && result.new_achievements.length > 0) {
        result.new_achievements.forEach(achievement => {
          triggerAchievementEvent(achievement);
        });
      }
    }

    return result;
  } catch (error) {
    console.error('Error awarding XP:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Record user activity for streak tracking
 * @returns {Promise<Object>} Streak data
 */
export const recordActivity = async () => {
  try {
    const response = await fetch('/api/gamification/streak/record', {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to record activity');
    }

    const result = await response.json();

    // Trigger streak milestone event if reached
    if (result.milestone_reached && result.streak_bonus) {
      triggerStreakMilestoneEvent(
        result.current_streak,
        result.streak_bonus.message
      );
    }

    return result;
  } catch (error) {
    console.error('Error recording activity:', error);
    return null;
  }
};

/**
 * Trigger XP gained event for UI feedback
 * @param {number} xp_amount - Amount of XP awarded
 * @param {string} reason - Reason for XP award
 */
export const triggerXPEvent = (xp_amount, reason) => {
  const event = new CustomEvent('xp-awarded', {
    detail: { xp_amount, reason }
  });
  window.dispatchEvent(event);
};

/**
 * Trigger level up event for UI feedback
 * @param {number} new_level - New level number
 * @param {string} level_title - Title of new level
 */
export const triggerLevelUpEvent = (new_level, level_title) => {
  const event = new CustomEvent('level-up', {
    detail: { new_level, level_title }
  });
  window.dispatchEvent(event);
};

/**
 * Trigger achievement unlock event for UI feedback
 * @param {Object} achievement - Achievement data
 */
export const triggerAchievementEvent = (achievement) => {
  const event = new CustomEvent('achievement-unlocked', {
    detail: { achievement }
  });
  window.dispatchEvent(event);
};

/**
 * Trigger streak milestone event for UI feedback
 * @param {number} streak - Streak count
 * @param {string} message - Milestone message
 */
export const triggerStreakMilestoneEvent = (streak, message) => {
  const event = new CustomEvent('streak-milestone', {
    detail: { streak, message }
  });
  window.dispatchEvent(event);
};

/**
 * Calculate if user earned speed bonus based on completion time
 * @param {number} startTime - Activity start timestamp (ms)
 * @param {number} endTime - Activity end timestamp (ms)
 * @param {number} targetTime - Target time in seconds (default: 60)
 * @returns {boolean} Whether speed bonus was earned
 */
export const calculateSpeedBonus = (startTime, endTime, targetTime = 60) => {
  const elapsedSeconds = (endTime - startTime) / 1000;
  return elapsedSeconds <= targetTime;
};

/**
 * Calculate if activity was completed with perfect score
 * @param {number} score - User's score
 * @param {number} maxScore - Maximum possible score
 * @returns {boolean} Whether perfect score was achieved
 */
export const isPerfectScore = (score, maxScore) => {
  return score >= maxScore;
};

/**
 * Get unseen achievements and mark them as seen
 * @returns {Promise<Array>} List of unseen achievements
 */
export const getUnseenAchievements = async () => {
  try {
    const response = await fetch('/api/gamification/achievements/unseen', {
      credentials: 'include'
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const achievements = data.achievements || [];

    // Mark as seen
    if (achievements.length > 0) {
      const achievementIds = achievements.map(a => a.achievement_id);
      await markAchievementsSeen(achievementIds);
    }

    return achievements;
  } catch (error) {
    console.error('Error fetching unseen achievements:', error);
    return [];
  }
};

/**
 * Mark achievements as seen
 * @param {Array<string>} achievementIds - List of achievement IDs
 */
export const markAchievementsSeen = async (achievementIds) => {
  try {
    await fetch('/api/gamification/achievements/seen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ achievement_ids: achievementIds })
    });
  } catch (error) {
    console.error('Error marking achievements as seen:', error);
  }
};

/**
 * Show notification for new achievements
 * This should be called when loading a page to check for unseen achievements
 */
export const checkAndShowNewAchievements = async () => {
  const unseenAchievements = await getUnseenAchievements();

  unseenAchievements.forEach(achievement => {
    // Trigger achievement event with delay to avoid overwhelming user
    setTimeout(() => {
      triggerAchievementEvent(achievement);
    }, 1000);
  });
};

export default {
  awardActivityXP,
  recordActivity,
  triggerXPEvent,
  triggerLevelUpEvent,
  triggerAchievementEvent,
  triggerStreakMilestoneEvent,
  calculateSpeedBonus,
  isPerfectScore,
  getUnseenAchievements,
  markAchievementsSeen,
  checkAndShowNewAchievements
};
