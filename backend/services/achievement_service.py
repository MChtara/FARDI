"""
Achievement Service - Handles achievement unlocking and tracking
"""
from typing import Dict, Any, List, Optional
from models.gamification_models import UserAchievements
from models.gamification_data import ACHIEVEMENTS
from services.xp_service import XPService


class AchievementService:
    """Service for managing achievements"""

    def __init__(self, db_connection):
        self.conn = db_connection
        self.achievement_model = UserAchievements(db_connection)
        self.xp_service = XPService(db_connection)

    def check_and_unlock_achievements(self, user_id: int, event_type: str,
                                       event_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Check if any achievements should be unlocked based on an event

        Args:
            user_id: User ID
            event_type: Type of event (e.g., 'action_item_completed', 'streak_updated')
            event_data: Data about the event (e.g., counts, values)

        Returns:
            List of newly unlocked achievements with their details
        """
        newly_unlocked = []

        # Get all achievements that could match this event
        potential_achievements = self._get_relevant_achievements(event_type)

        for achievement_id, achievement_data in potential_achievements.items():
            # Skip if already unlocked
            if self.achievement_model.has_achievement(user_id, achievement_id):
                continue

            # Check if conditions are met
            if self._check_achievement_condition(user_id, achievement_data, event_data):
                # Unlock achievement
                if self.achievement_model.unlock_achievement(user_id, achievement_id):
                    # Award XP bonus
                    xp_reward = achievement_data.get("xp_reward", 0)
                    if xp_reward > 0:
                        self.xp_service.award_xp(
                            user_id=user_id,
                            reason="achievement_unlock",
                            activity_id=achievement_id,
                            activity_type="achievement"
                        )

                    newly_unlocked.append({
                        "achievement_id": achievement_id,
                        "name": achievement_data["name"],
                        "description": achievement_data["description"],
                        "icon": achievement_data["icon"],
                        "rarity": achievement_data["rarity"],
                        "xp_reward": xp_reward
                    })

        return newly_unlocked

    def get_user_achievements(self, user_id: int, include_locked: bool = False) -> Dict[str, Any]:
        """
        Get all achievements for a user

        Args:
            user_id: User ID
            include_locked: Whether to include locked achievements

        Returns:
            Dict with unlocked and optionally locked achievements
        """
        unlocked = self.achievement_model.get_user_achievements(user_id)
        unlocked_ids = {ach["achievement_id"] for ach in unlocked}

        # Enrich with achievement data
        unlocked_full = []
        for ach in unlocked:
            ach_data = ACHIEVEMENTS.get(ach["achievement_id"])
            if ach_data:
                unlocked_full.append({
                    **ach,
                    "name": ach_data["name"],
                    "description": ach_data["description"],
                    "icon": ach_data["icon"],
                    "rarity": ach_data["rarity"],
                    "xp_reward": ach_data["xp_reward"]
                })

        result = {
            "unlocked": unlocked_full,
            "total_unlocked": len(unlocked_full),
            "total_available": len(ACHIEVEMENTS)
        }

        if include_locked:
            locked = []
            for ach_id, ach_data in ACHIEVEMENTS.items():
                if ach_id not in unlocked_ids:
                    locked.append({
                        "achievement_id": ach_id,
                        "name": ach_data["name"],
                        "description": ach_data["description"],
                        "icon": ach_data["icon"],
                        "rarity": ach_data["rarity"],
                        "xp_reward": ach_data["xp_reward"],
                        "condition": ach_data["condition"]
                    })
            result["locked"] = locked

        return result

    def get_unseen_achievements(self, user_id: int) -> List[Dict[str, Any]]:
        """Get achievements that haven't been shown to the user yet"""
        unseen = self.achievement_model.get_unseen_achievements(user_id)

        # Enrich with achievement data
        unseen_full = []
        for ach in unseen:
            ach_data = ACHIEVEMENTS.get(ach["achievement_id"])
            if ach_data:
                unseen_full.append({
                    **ach,
                    "name": ach_data["name"],
                    "description": ach_data["description"],
                    "icon": ach_data["icon"],
                    "rarity": ach_data["rarity"],
                    "xp_reward": ach_data["xp_reward"]
                })

        return unseen_full

    def mark_achievements_seen(self, user_id: int, achievement_ids: List[str]):
        """Mark achievements as seen by the user"""
        self.achievement_model.mark_achievements_seen(user_id, achievement_ids)

    def _get_relevant_achievements(self, event_type: str) -> Dict[str, Dict[str, Any]]:
        """Get achievements that could be triggered by this event type"""
        relevant = {}

        event_mapping = {
            "action_item_completed": ["action_items_completed"],
            "phase_completed": ["phase_completed"],
            "streak_updated": ["streak"],
            "perfect_score": ["perfect_scores"],
            "speed_bonus": ["speed_bonuses"],
            "comeback": ["comeback"],
            "remedial_completed": ["remedial_level_completed"],
            "step_completed": ["step_completed"],
            "early_activity": ["early_activity"],
            "late_activity": ["late_activity"],
            "friend_added": ["friends_count"],
            "peer_help": ["peer_help"]
        }

        condition_types = event_mapping.get(event_type, [])

        for ach_id, ach_data in ACHIEVEMENTS.items():
            if ach_data["condition"]["type"] in condition_types:
                relevant[ach_id] = ach_data

        return relevant

    def _check_achievement_condition(self, user_id: int, achievement_data: Dict[str, Any],
                                      event_data: Dict[str, Any]) -> bool:
        """Check if achievement conditions are met"""
        condition = achievement_data["condition"]
        condition_type = condition["type"]

        # Get current count from database or event data
        current_count = self._get_condition_count(user_id, condition_type, event_data)

        # Check count requirement
        required_count = condition.get("count", 1)
        if current_count < required_count:
            return False

        # Check level requirement (for remedial activities)
        if "level" in condition:
            required_level = condition["level"]
            event_level = event_data.get("level")
            if event_level != required_level:
                return False

        # Check step requirement
        if "step" in condition:
            required_step = condition["step"]
            event_step = event_data.get("step")
            if event_step != required_step:
                return False

        return True

    def _get_condition_count(self, user_id: int, condition_type: str,
                              event_data: Dict[str, Any]) -> int:
        """Get the current count for a specific condition type"""
        cursor = self.conn.cursor()

        if condition_type == "action_items_completed":
            cursor.execute("""
                SELECT COUNT(*) FROM xp_history
                WHERE user_id = ? AND reason IN ('action_item_completed', 'action_item_perfect')
            """, (user_id,))
            return cursor.fetchone()[0]

        elif condition_type == "phase_completed":
            cursor.execute("""
                SELECT COUNT(*) FROM xp_history
                WHERE user_id = ? AND reason LIKE '%_phase_%_completed'
            """, (user_id,))
            return cursor.fetchone()[0]

        elif condition_type == "streak":
            from models.gamification_models import UserStreaks
            streak_model = UserStreaks(self.conn)
            streak = streak_model.get_user_streak(user_id)
            return streak["current_streak"] if streak else 0

        elif condition_type == "perfect_scores":
            cursor.execute("""
                SELECT COUNT(*) FROM xp_history
                WHERE user_id = ? AND reason LIKE '%perfect%'
            """, (user_id,))
            return cursor.fetchone()[0]

        elif condition_type == "speed_bonuses":
            cursor.execute("""
                SELECT COUNT(*) FROM xp_history
                WHERE user_id = ? AND reason = 'speed_bonus'
            """, (user_id,))
            return cursor.fetchone()[0]

        elif condition_type == "comeback":
            # This should be set in event_data
            return event_data.get("comeback_count", 0)

        elif condition_type == "remedial_level_completed":
            level = event_data.get("level", "")
            cursor.execute("""
                SELECT COUNT(*) FROM xp_history
                WHERE user_id = ? AND reason LIKE ?
            """, (user_id, f"remedial_{level}%"))
            return cursor.fetchone()[0]

        elif condition_type == "step_completed":
            # Check if specific step is completed
            step = event_data.get("step", "")
            cursor.execute("""
                SELECT COUNT(*) FROM xp_history
                WHERE user_id = ? AND activity_id LIKE ?
            """, (user_id, f"{step}%"))
            # This is simplified; real implementation needs better tracking
            return cursor.fetchone()[0]

        elif condition_type == "early_activity":
            cursor.execute("""
                SELECT COUNT(DISTINCT DATE(timestamp)) FROM xp_history
                WHERE user_id = ? AND strftime('%H', timestamp) < '09'
            """, (user_id,))
            return cursor.fetchone()[0]

        elif condition_type == "late_activity":
            cursor.execute("""
                SELECT COUNT(DISTINCT DATE(timestamp)) FROM xp_history
                WHERE user_id = ? AND strftime('%H', timestamp) >= '22'
            """, (user_id,))
            return cursor.fetchone()[0]

        elif condition_type == "friends_count":
            cursor.execute("""
                SELECT COUNT(*) FROM friendships
                WHERE user_id = ? AND status = 'accepted'
            """, (user_id,))
            return cursor.fetchone()[0]

        elif condition_type == "peer_help":
            # Phase 3 feature - placeholder
            return event_data.get("peer_help_count", 0)

        return 0

    def get_achievement_progress(self, user_id: int, achievement_id: str) -> Dict[str, Any]:
        """Get progress toward a specific achievement"""
        achievement_data = ACHIEVEMENTS.get(achievement_id)
        if not achievement_data:
            return {"error": "Achievement not found"}

        # Check if already unlocked
        if self.achievement_model.has_achievement(user_id, achievement_id):
            return {
                "achievement_id": achievement_id,
                "unlocked": True,
                "progress": 100.0
            }

        # Calculate current progress
        condition = achievement_data["condition"]
        required_count = condition.get("count", 1)
        current_count = self._get_condition_count(user_id, condition["type"], {})

        progress_percentage = min(100.0, (current_count / required_count) * 100)

        return {
            "achievement_id": achievement_id,
            "unlocked": False,
            "current_count": current_count,
            "required_count": required_count,
            "progress": progress_percentage
        }
