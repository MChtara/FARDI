"""
XP Service - Handles all XP-related operations and rewards
"""
from typing import Dict, Any, Optional
from models.gamification_models import UserProgression, XPHistory
from models.gamification_data import XP_REWARDS, PLAYER_LEVELS


class XPService:
    """Service for managing XP rewards and progression"""

    def __init__(self, db_connection):
        self.conn = db_connection
        self.progression_model = UserProgression(db_connection)
        self.history_model = XPHistory(db_connection)

    def award_xp(self, user_id: int, reason: str, activity_id: Optional[str] = None,
                 activity_type: Optional[str] = None, multiplier: float = 1.0) -> Dict[str, Any]:
        """
        Award XP to a user for a specific reason

        Args:
            user_id: User ID
            reason: Reason key from XP_REWARDS
            activity_id: Optional activity identifier
            activity_type: Optional activity type
            multiplier: XP multiplier for bonuses

        Returns:
            Dict with XP details and level up info
        """
        # Get base XP amount
        base_xp = XP_REWARDS.get(reason, 0)
        if base_xp == 0:
            return {
                "success": False,
                "error": f"Unknown XP reason: {reason}"
            }

        # Apply multiplier
        xp_amount = int(base_xp * multiplier)

        # Log XP transaction
        self.history_model.add_xp_entry(
            user_id=user_id,
            xp_amount=xp_amount,
            reason=reason,
            activity_id=activity_id,
            activity_type=activity_type
        )

        # Update user progression
        progression = self.progression_model.update_xp(user_id, xp_amount)

        return {
            "success": True,
            "xp_awarded": xp_amount,
            "reason": reason,
            "total_xp": progression["total_xp"],
            "current_level": progression["current_level"],
            "xp_to_next_level": progression["xp_to_next_level"],
            "leveled_up": progression.get("leveled_up", False),
            "level_info": self.get_level_info(progression["current_level"]) if progression.get("leveled_up") else None
        }

    def award_activity_xp(self, user_id: int, activity_type: str, activity_id: str,
                           is_perfect: bool = False, is_first_try: bool = False,
                           speed_bonus: bool = False) -> Dict[str, Any]:
        """
        Award XP for completing an activity with bonuses

        Args:
            user_id: User ID
            activity_type: Type of activity (e.g., 'action_item', 'remedial_A1')
            activity_id: Activity identifier
            is_perfect: Whether user got perfect score
            is_first_try: Whether completed on first try
            speed_bonus: Whether user earned speed bonus

        Returns:
            Dict with total XP and all bonuses applied
        """
        total_xp = 0
        bonuses = []

        # Base XP for completion
        if activity_type == "action_item":
            base_reason = "action_item_perfect" if is_perfect else "action_item_completed"
        elif "remedial" in activity_type:
            if is_perfect:
                base_reason = "remedial_perfect"
            else:
                base_reason = activity_type.replace("remedial_", "remedial_") + "_completed"
        else:
            base_reason = "action_item_completed"

        result = self.award_xp(user_id, base_reason, activity_id, activity_type)
        total_xp += result["xp_awarded"]

        # First try bonus
        if is_first_try and not is_perfect:  # Perfect already includes first try
            bonus_result = self.award_xp(user_id, "first_try_success", activity_id, "bonus")
            total_xp += bonus_result["xp_awarded"]
            bonuses.append({"type": "first_try_success", "xp": bonus_result["xp_awarded"]})

        # Speed bonus
        if speed_bonus:
            bonus_result = self.award_xp(user_id, "speed_bonus", activity_id, "bonus")
            total_xp += bonus_result["xp_awarded"]
            bonuses.append({"type": "speed_bonus", "xp": bonus_result["xp_awarded"]})

        return {
            "success": True,
            "total_xp_awarded": total_xp,
            "base_xp": result["xp_awarded"],
            "bonuses": bonuses,
            "progression": {
                "total_xp": result["total_xp"],
                "current_level": result["current_level"],
                "xp_to_next_level": result["xp_to_next_level"],
                "leveled_up": result["leveled_up"],
                "level_info": result.get("level_info")
            }
        }

    def award_streak_bonus(self, user_id: int, streak_count: int) -> Optional[Dict[str, Any]]:
        """Award bonus XP for streak milestones"""
        from models.gamification_data import STREAK_REWARDS

        if streak_count in STREAK_REWARDS:
            reward = STREAK_REWARDS[streak_count]
            result = self.award_xp(
                user_id=user_id,
                reason=f"streak_bonus_{streak_count}",
                activity_type="streak_milestone"
            )

            return {
                "success": True,
                "streak": streak_count,
                "xp_awarded": result["xp_awarded"],
                "message": reward["message"],
                "progression": {
                    "total_xp": result["total_xp"],
                    "current_level": result["current_level"],
                    "leveled_up": result.get("leveled_up", False)
                }
            }

        return None

    def get_user_progression(self, user_id: int) -> Dict[str, Any]:
        """Get complete progression data for a user"""
        progression = self.progression_model.get_user_progression(user_id)
        if not progression:
            progression = self.progression_model.create_user_progression(user_id)

        level_info = self.get_level_info(progression["current_level"])
        next_level_info = self.get_level_info(progression["current_level"] + 1)

        return {
            "total_xp": progression["total_xp"],
            "current_level": progression["current_level"],
            "xp_to_next_level": progression["xp_to_next_level"],
            "xp_in_current_level": progression["total_xp"] - level_info["xp_required"],
            "xp_needed_for_next": next_level_info["xp_required"] - progression["total_xp"] if next_level_info else 0,
            "level_info": level_info,
            "next_level_info": next_level_info,
            "progress_percentage": self.calculate_level_progress(progression)
        }

    def get_xp_history(self, user_id: int, limit: int = 50) -> list:
        """Get user's XP transaction history"""
        return self.history_model.get_user_history(user_id, limit)

    def get_daily_xp(self, user_id: int) -> int:
        """Get XP earned today"""
        return self.history_model.get_total_xp_today(user_id)

    @staticmethod
    def get_level_info(level: int) -> Optional[Dict[str, Any]]:
        """Get information about a specific level"""
        if 1 <= level <= len(PLAYER_LEVELS):
            return PLAYER_LEVELS[level - 1]
        return None

    @staticmethod
    def calculate_level_progress(progression: Dict[str, Any]) -> float:
        """Calculate progress percentage within current level"""
        current_level = progression["current_level"]
        total_xp = progression["total_xp"]

        current_level_info = XPService.get_level_info(current_level)
        next_level_info = XPService.get_level_info(current_level + 1)

        if not next_level_info:
            return 100.0

        xp_in_level = total_xp - current_level_info["xp_required"]
        xp_needed_for_level = next_level_info["xp_required"] - current_level_info["xp_required"]

        if xp_needed_for_level == 0:
            return 100.0

        return min(100.0, (xp_in_level / xp_needed_for_level) * 100)
