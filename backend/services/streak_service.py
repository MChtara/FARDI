"""
Streak Service - Handles daily activity streaks and freeze tokens
"""
from typing import Dict, Any, Optional
from datetime import date, datetime, timedelta
from models.gamification_models import UserStreaks
from models.gamification_data import STREAK_REWARDS, FREEZE_TOKEN_COST
from services.xp_service import XPService


class StreakService:
    """Service for managing user activity streaks"""

    def __init__(self, db_connection):
        self.conn = db_connection
        self.streak_model = UserStreaks(db_connection)
        self.xp_service = XPService(db_connection)

    def record_activity(self, user_id: int) -> Dict[str, Any]:
        """
        Record user activity and update streak

        Args:
            user_id: User ID

        Returns:
            Dict with streak info and any bonuses earned
        """
        # Update streak
        streak_data = self.streak_model.update_streak(user_id)

        result = {
            "current_streak": streak_data["current_streak"],
            "longest_streak": streak_data["longest_streak"],
            "freeze_tokens": streak_data["freeze_tokens"],
            "streak_bonus": None,
            "milestone_reached": False
        }

        # Check for streak milestone rewards
        current_streak = streak_data["current_streak"]
        if current_streak in STREAK_REWARDS:
            # Award streak bonus XP
            bonus_result = self.xp_service.award_streak_bonus(user_id, current_streak)
            if bonus_result:
                result["streak_bonus"] = bonus_result
                result["milestone_reached"] = True

        # Check for freeze token rewards (every 7 days)
        if current_streak > 0 and current_streak % 7 == 0:
            self.streak_model.add_freeze_token(user_id)
            result["freeze_token_earned"] = True
            result["freeze_tokens"] = streak_data["freeze_tokens"] + 1

        return result

    def get_streak_status(self, user_id: int) -> Dict[str, Any]:
        """
        Get current streak status for a user

        Args:
            user_id: User ID

        Returns:
            Dict with streak information and status
        """
        streak_data = self.streak_model.get_user_streak(user_id)
        if not streak_data:
            streak_data = self.streak_model.create_user_streak(user_id)

        today = date.today()
        last_activity = streak_data["last_activity_date"]

        # Determine streak status
        if last_activity:
            last_date = date.fromisoformat(last_activity)
            days_since = (today - last_date).days

            if days_since == 0:
                status = "active_today"
                at_risk = False
            elif days_since == 1:
                status = "can_continue"
                at_risk = True
            else:
                status = "broken"
                at_risk = False
        else:
            status = "not_started"
            at_risk = False

        # Calculate next milestone
        next_milestone = self._get_next_milestone(streak_data["current_streak"])

        return {
            "current_streak": streak_data["current_streak"],
            "longest_streak": streak_data["longest_streak"],
            "freeze_tokens": streak_data["freeze_tokens"],
            "last_activity_date": streak_data["last_activity_date"],
            "status": status,
            "at_risk": at_risk,
            "days_until_break": 1 if at_risk else 0,
            "next_milestone": next_milestone,
            "can_use_freeze": at_risk and streak_data["freeze_tokens"] > 0
        }

    def use_freeze_token(self, user_id: int) -> Dict[str, Any]:
        """
        Use a streak freeze token to protect streak

        Args:
            user_id: User ID

        Returns:
            Dict with success status and updated streak info
        """
        streak_status = self.get_streak_status(user_id)

        # Check if freeze can be used
        if not streak_status["can_use_freeze"]:
            return {
                "success": False,
                "error": "Cannot use freeze token now",
                "reason": "Streak not at risk or no tokens available"
            }

        # Use the freeze token
        success = self.streak_model.use_freeze_token(user_id)

        if success:
            updated_status = self.get_streak_status(user_id)
            return {
                "success": True,
                "message": "Streak protected! Your streak is safe for today.",
                "streak_status": updated_status
            }
        else:
            return {
                "success": False,
                "error": "Failed to use freeze token"
            }

    def purchase_freeze_token(self, user_id: int) -> Dict[str, Any]:
        """
        Purchase a freeze token with XP

        Args:
            user_id: User ID

        Returns:
            Dict with success status and updated info
        """
        # Check if user has enough XP
        progression = self.xp_service.get_user_progression(user_id)
        if progression["total_xp"] < FREEZE_TOKEN_COST:
            return {
                "success": False,
                "error": "Not enough XP",
                "required": FREEZE_TOKEN_COST,
                "current": progression["total_xp"]
            }

        # Deduct XP (negative award)
        self.xp_service.award_xp(
            user_id=user_id,
            reason="freeze_token_purchase",
            activity_type="purchase"
        )

        # Add freeze token
        updated_streak = self.streak_model.add_freeze_token(user_id)

        return {
            "success": True,
            "message": f"Freeze token purchased for {FREEZE_TOKEN_COST} XP",
            "freeze_tokens": updated_streak["freeze_tokens"],
            "xp_remaining": progression["total_xp"] - FREEZE_TOKEN_COST
        }

    def get_streak_leaderboard(self, limit: int = 10) -> list:
        """
        Get top users by current streak

        Args:
            limit: Number of users to return

        Returns:
            List of top streak users
        """
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT us.user_id, us.current_streak, us.longest_streak, u.username
            FROM user_streaks us
            JOIN users u ON us.user_id = u.id
            WHERE us.current_streak > 0
            ORDER BY us.current_streak DESC, us.longest_streak DESC
            LIMIT ?
        """, (limit,))

        leaderboard = []
        for row in cursor.fetchall():
            leaderboard.append({
                "user_id": row[0],
                "username": row[1] if len(row) > 3 else f"User {row[0]}",
                "current_streak": row[1],
                "longest_streak": row[2]
            })

        return leaderboard

    def check_broken_streaks(self) -> list:
        """
        Check for streaks that should be broken (daily maintenance task)

        Returns:
            List of user IDs whose streaks were broken
        """
        cursor = self.conn.cursor()
        yesterday = (date.today() - timedelta(days=1)).isoformat()

        # Find users whose last activity was more than 1 day ago and still have active streaks
        cursor.execute("""
            SELECT user_id, current_streak, freeze_tokens
            FROM user_streaks
            WHERE current_streak > 0
              AND last_activity_date < ?
        """, (yesterday,))

        broken_streaks = []
        for row in cursor.fetchall():
            user_id, current_streak, freeze_tokens = row

            # Reset streak to 0
            cursor.execute("""
                UPDATE user_streaks
                SET current_streak = 0, updated_at = ?
                WHERE user_id = ?
            """, (datetime.now(), user_id))

            broken_streaks.append({
                "user_id": user_id,
                "broken_streak": current_streak
            })

        self.conn.commit()
        return broken_streaks

    @staticmethod
    def _get_next_milestone(current_streak: int) -> Optional[Dict[str, Any]]:
        """Get the next streak milestone"""
        milestones = sorted(STREAK_REWARDS.keys())

        for milestone in milestones:
            if milestone > current_streak:
                reward = STREAK_REWARDS[milestone]
                return {
                    "streak": milestone,
                    "days_remaining": milestone - current_streak,
                    "xp_reward": reward["xp"],
                    "message": reward["message"]
                }

        return None

    def get_streak_statistics(self, user_id: int) -> Dict[str, Any]:
        """
        Get detailed streak statistics for a user

        Args:
            user_id: User ID

        Returns:
            Dict with comprehensive streak stats
        """
        streak_data = self.streak_model.get_user_streak(user_id)
        if not streak_data:
            return {
                "current_streak": 0,
                "longest_streak": 0,
                "total_active_days": 0,
                "freeze_tokens": 0,
                "milestones_reached": []
            }

        # Get total active days from xp_history
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT COUNT(DISTINCT DATE(timestamp))
            FROM xp_history
            WHERE user_id = ?
        """, (user_id,))
        total_active_days = cursor.fetchone()[0]

        # Get milestones reached
        milestones_reached = [
            {"streak": milestone, "xp": data["xp"]}
            for milestone, data in STREAK_REWARDS.items()
            if milestone <= streak_data["longest_streak"]
        ]

        return {
            "current_streak": streak_data["current_streak"],
            "longest_streak": streak_data["longest_streak"],
            "total_active_days": total_active_days,
            "freeze_tokens": streak_data["freeze_tokens"],
            "milestones_reached": milestones_reached,
            "consistency_rate": (streak_data["longest_streak"] / total_active_days * 100)
            if total_active_days > 0 else 0
        }
