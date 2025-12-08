"""
Database models for gamification features
"""
from datetime import datetime, date
from typing import Optional, Dict, Any
import sqlite3


class UserProgression:
    """Manages user XP and leveling"""

    def __init__(self, db_connection):
        self.conn = db_connection

    def get_user_progression(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user's progression data"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT id, user_id, total_xp, current_level, xp_to_next_level,
                   created_at, updated_at
            FROM user_progression
            WHERE user_id = ?
        """, (user_id,))
        row = cursor.fetchone()

        if row:
            return {
                "id": row[0],
                "user_id": row[1],
                "total_xp": row[2],
                "current_level": row[3],
                "xp_to_next_level": row[4],
                "created_at": row[5],
                "updated_at": row[6]
            }
        return None

    def create_user_progression(self, user_id: int) -> Dict[str, Any]:
        """Initialize progression for a new user"""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO user_progression (user_id, total_xp, current_level, xp_to_next_level)
            VALUES (?, 0, 1, 500)
        """, (user_id,))
        self.conn.commit()

        return self.get_user_progression(user_id)

    def update_xp(self, user_id: int, xp_amount: int) -> Dict[str, Any]:
        """Add XP to user and handle level ups"""
        progression = self.get_user_progression(user_id)
        if not progression:
            progression = self.create_user_progression(user_id)

        new_total_xp = progression["total_xp"] + xp_amount
        current_level = progression["current_level"]
        xp_to_next = progression["xp_to_next_level"]

        # Check for level up
        from .gamification_data import PLAYER_LEVELS

        leveled_up = False
        while current_level < len(PLAYER_LEVELS):
            next_level_data = PLAYER_LEVELS[current_level]  # Index matches next level
            if new_total_xp >= next_level_data["xp_required"]:
                current_level += 1
                leveled_up = True
            else:
                xp_to_next = next_level_data["xp_required"]
                break

        # Update database
        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE user_progression
            SET total_xp = ?, current_level = ?, xp_to_next_level = ?, updated_at = ?
            WHERE user_id = ?
        """, (new_total_xp, current_level, xp_to_next, datetime.now(), user_id))
        self.conn.commit()

        result = self.get_user_progression(user_id)
        result["leveled_up"] = leveled_up
        return result


class XPHistory:
    """Manages XP transaction history"""

    def __init__(self, db_connection):
        self.conn = db_connection

    def add_xp_entry(self, user_id: int, xp_amount: int, reason: str,
                     activity_id: Optional[str] = None,
                     activity_type: Optional[str] = None) -> int:
        """Log an XP transaction"""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO xp_history (user_id, xp_amount, reason, activity_id, activity_type)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, xp_amount, reason, activity_id, activity_type))
        self.conn.commit()
        return cursor.lastrowid

    def get_user_history(self, user_id: int, limit: int = 50) -> list:
        """Get user's XP history"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT id, xp_amount, reason, activity_id, activity_type, timestamp
            FROM xp_history
            WHERE user_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        """, (user_id, limit))

        return [{
            "id": row[0],
            "xp_amount": row[1],
            "reason": row[2],
            "activity_id": row[3],
            "activity_type": row[4],
            "timestamp": row[5]
        } for row in cursor.fetchall()]

    def get_total_xp_today(self, user_id: int) -> int:
        """Get total XP earned today"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT SUM(xp_amount)
            FROM xp_history
            WHERE user_id = ? AND DATE(timestamp) = DATE('now')
        """, (user_id,))
        result = cursor.fetchone()
        return result[0] if result[0] else 0


class UserAchievements:
    """Manages user achievements"""

    def __init__(self, db_connection):
        self.conn = db_connection

    def unlock_achievement(self, user_id: int, achievement_id: str) -> bool:
        """Unlock an achievement for a user"""
        try:
            cursor = self.conn.cursor()
            cursor.execute("""
                INSERT INTO user_achievements (user_id, achievement_id, seen)
                VALUES (?, ?, FALSE)
            """, (user_id, achievement_id))
            self.conn.commit()
            return True
        except sqlite3.IntegrityError:
            # Achievement already unlocked
            return False

    def get_user_achievements(self, user_id: int) -> list:
        """Get all achievements for a user"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT achievement_id, unlocked_at, seen
            FROM user_achievements
            WHERE user_id = ?
            ORDER BY unlocked_at DESC
        """, (user_id,))

        return [{
            "achievement_id": row[0],
            "unlocked_at": row[1],
            "seen": row[2]
        } for row in cursor.fetchall()]

    def get_unseen_achievements(self, user_id: int) -> list:
        """Get achievements that haven't been shown to the user yet"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT achievement_id, unlocked_at
            FROM user_achievements
            WHERE user_id = ? AND seen = FALSE
            ORDER BY unlocked_at DESC
        """, (user_id,))

        return [{
            "achievement_id": row[0],
            "unlocked_at": row[1]
        } for row in cursor.fetchall()]

    def mark_achievements_seen(self, user_id: int, achievement_ids: list):
        """Mark achievements as seen"""
        cursor = self.conn.cursor()
        placeholders = ','.join('?' * len(achievement_ids))
        cursor.execute(f"""
            UPDATE user_achievements
            SET seen = TRUE
            WHERE user_id = ? AND achievement_id IN ({placeholders})
        """, [user_id] + achievement_ids)
        self.conn.commit()

    def has_achievement(self, user_id: int, achievement_id: str) -> bool:
        """Check if user has a specific achievement"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT COUNT(*) FROM user_achievements
            WHERE user_id = ? AND achievement_id = ?
        """, (user_id, achievement_id))
        return cursor.fetchone()[0] > 0


class UserStreaks:
    """Manages user activity streaks"""

    def __init__(self, db_connection):
        self.conn = db_connection

    def get_user_streak(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user's streak data"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT id, user_id, current_streak, longest_streak,
                   last_activity_date, freeze_tokens, created_at, updated_at
            FROM user_streaks
            WHERE user_id = ?
        """, (user_id,))
        row = cursor.fetchone()

        if row:
            return {
                "id": row[0],
                "user_id": row[1],
                "current_streak": row[2],
                "longest_streak": row[3],
                "last_activity_date": row[4],
                "freeze_tokens": row[5],
                "created_at": row[6],
                "updated_at": row[7]
            }
        return None

    def create_user_streak(self, user_id: int) -> Dict[str, Any]:
        """Initialize streak for a new user"""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO user_streaks (user_id, current_streak, longest_streak, freeze_tokens)
            VALUES (?, 0, 0, 0)
        """, (user_id,))
        self.conn.commit()
        return self.get_user_streak(user_id)

    def update_streak(self, user_id: int) -> Dict[str, Any]:
        """Update streak when user completes an activity"""
        streak = self.get_user_streak(user_id)
        if not streak:
            streak = self.create_user_streak(user_id)

        today = date.today()
        last_activity = streak["last_activity_date"]

        if last_activity:
            last_date = date.fromisoformat(last_activity)
            days_diff = (today - last_date).days

            if days_diff == 0:
                # Same day, no change to streak
                return streak
            elif days_diff == 1:
                # Consecutive day, increment streak
                new_streak = streak["current_streak"] + 1
                new_longest = max(new_streak, streak["longest_streak"])
            else:
                # Streak broken, reset to 1
                new_streak = 1
                new_longest = streak["longest_streak"]
        else:
            # First activity
            new_streak = 1
            new_longest = 1

        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE user_streaks
            SET current_streak = ?, longest_streak = ?,
                last_activity_date = ?, updated_at = ?
            WHERE user_id = ?
        """, (new_streak, new_longest, today.isoformat(), datetime.now(), user_id))
        self.conn.commit()

        return self.get_user_streak(user_id)

    def use_freeze_token(self, user_id: int) -> bool:
        """Use a streak freeze token"""
        streak = self.get_user_streak(user_id)
        if not streak or streak["freeze_tokens"] <= 0:
            return False

        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE user_streaks
            SET freeze_tokens = freeze_tokens - 1,
                last_activity_date = DATE('now'),
                updated_at = ?
            WHERE user_id = ?
        """, (datetime.now(), user_id))
        self.conn.commit()
        return True

    def add_freeze_token(self, user_id: int) -> Dict[str, Any]:
        """Grant a freeze token to the user"""
        streak = self.get_user_streak(user_id)
        if not streak:
            streak = self.create_user_streak(user_id)

        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE user_streaks
            SET freeze_tokens = freeze_tokens + 1, updated_at = ?
            WHERE user_id = ?
        """, (datetime.now(), user_id))
        self.conn.commit()

        return self.get_user_streak(user_id)
