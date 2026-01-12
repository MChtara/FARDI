"""
Gamification API Routes
Endpoints for XP, achievements, streaks, and progression
"""
from flask import Blueprint, request, jsonify, session
from functools import wraps
import sqlite3
from services.xp_service import XPService
from services.achievement_service import AchievementService
from services.streak_service import StreakService
from models.gamification_data import PLAYER_LEVELS, ACHIEVEMENTS, RARITY_TIERS

gamification_bp = Blueprint('gamification', __name__, url_prefix='/api/gamification')


def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect('fardi.db')
    conn.row_factory = sqlite3.Row
    return conn


def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated_function


# ============================================================
# PROGRESSION & XP ENDPOINTS
# ============================================================

@gamification_bp.route('/progression', methods=['GET'])
@require_auth
def get_progression():
    """Get user's current progression and XP"""
    user_id = session['user_id']
    conn = get_db_connection()

    try:
        xp_service = XPService(conn)
        progression = xp_service.get_user_progression(user_id)
        return jsonify(progression), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/xp/history', methods=['GET'])
@require_auth
def get_xp_history():
    """Get user's XP transaction history"""
    user_id = session['user_id']
    limit = request.args.get('limit', 50, type=int)

    conn = get_db_connection()
    try:
        xp_service = XPService(conn)
        history = xp_service.get_xp_history(user_id, limit)
        return jsonify({"history": history, "total": len(history)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/xp/daily', methods=['GET'])
@require_auth
def get_daily_xp():
    """Get XP earned today"""
    user_id = session['user_id']
    conn = get_db_connection()

    try:
        xp_service = XPService(conn)
        daily_xp = xp_service.get_daily_xp(user_id)
        return jsonify({"daily_xp": daily_xp}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/levels', methods=['GET'])
def get_all_levels():
    """Get information about all player levels"""
    return jsonify({"levels": PLAYER_LEVELS}), 200


# ============================================================
# ACHIEVEMENT ENDPOINTS
# ============================================================

@gamification_bp.route('/achievements', methods=['GET'])
@require_auth
def get_achievements():
    """Get user's achievements (unlocked and optionally locked)"""
    user_id = session['user_id']
    include_locked = request.args.get('include_locked', 'false').lower() == 'true'

    conn = get_db_connection()
    try:
        achievement_service = AchievementService(conn)
        achievements = achievement_service.get_user_achievements(user_id, include_locked)
        return jsonify(achievements), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/achievements/unseen', methods=['GET'])
@require_auth
def get_unseen_achievements():
    """Get achievements that haven't been shown to the user yet"""
    user_id = session['user_id']
    conn = get_db_connection()

    try:
        achievement_service = AchievementService(conn)
        unseen = achievement_service.get_unseen_achievements(user_id)
        return jsonify({"achievements": unseen}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/achievements/seen', methods=['POST'])
@require_auth
def mark_achievements_seen():
    """Mark achievements as seen"""
    user_id = session['user_id']
    data = request.json
    achievement_ids = data.get('achievement_ids', [])

    if not achievement_ids:
        return jsonify({"error": "No achievement IDs provided"}), 400

    conn = get_db_connection()
    try:
        achievement_service = AchievementService(conn)
        achievement_service.mark_achievements_seen(user_id, achievement_ids)
        return jsonify({"success": True, "marked_seen": len(achievement_ids)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/achievements/<achievement_id>/progress', methods=['GET'])
@require_auth
def get_achievement_progress(achievement_id):
    """Get progress toward a specific achievement"""
    user_id = session['user_id']
    conn = get_db_connection()

    try:
        achievement_service = AchievementService(conn)
        progress = achievement_service.get_achievement_progress(user_id, achievement_id)
        return jsonify(progress), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/achievements/catalog', methods=['GET'])
def get_achievement_catalog():
    """Get all available achievements with rarity info"""
    catalog = []
    for ach_id, ach_data in ACHIEVEMENTS.items():
        catalog.append({
            "achievement_id": ach_id,
            "name": ach_data["name"],
            "description": ach_data["description"],
            "icon": ach_data["icon"],
            "rarity": ach_data["rarity"],
            "xp_reward": ach_data["xp_reward"]
        })

    return jsonify({
        "achievements": catalog,
        "total": len(catalog),
        "rarity_tiers": RARITY_TIERS
    }), 200


# ============================================================
# STREAK ENDPOINTS
# ============================================================

@gamification_bp.route('/streak', methods=['GET'])
@require_auth
def get_streak_status():
    """Get user's current streak status"""
    user_id = session['user_id']
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        status = streak_service.get_streak_status(user_id)
        return jsonify(status), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/streak/record', methods=['POST'])
@require_auth
def record_activity():
    """Record user activity and update streak"""
    user_id = session['user_id']
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        result = streak_service.record_activity(user_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/streak/freeze', methods=['POST'])
@require_auth
def use_freeze_token():
    """Use a streak freeze token"""
    user_id = session['user_id']
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        result = streak_service.use_freeze_token(user_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/streak/freeze/purchase', methods=['POST'])
@require_auth
def purchase_freeze_token():
    """Purchase a freeze token with XP"""
    user_id = session['user_id']
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        result = streak_service.purchase_freeze_token(user_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/streak/statistics', methods=['GET'])
@require_auth
def get_streak_statistics():
    """Get detailed streak statistics"""
    user_id = session['user_id']
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        stats = streak_service.get_streak_statistics(user_id)
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@gamification_bp.route('/streak/leaderboard', methods=['GET'])
def get_streak_leaderboard():
    """Get streak leaderboard"""
    limit = request.args.get('limit', 10, type=int)
    conn = get_db_connection()

    try:
        streak_service = StreakService(conn)
        leaderboard = streak_service.get_streak_leaderboard(limit)
        return jsonify({"leaderboard": leaderboard}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# ============================================================
# DASHBOARD ENDPOINT
# ============================================================

@gamification_bp.route('/dashboard', methods=['GET'])
@require_auth
def get_dashboard():
    """Get comprehensive gamification dashboard data"""
    user_id = session['user_id']
    conn = get_db_connection()

    try:
        xp_service = XPService(conn)
        achievement_service = AchievementService(conn)
        streak_service = StreakService(conn)

        # Get all data
        progression = xp_service.get_user_progression(user_id)
        daily_xp = xp_service.get_daily_xp(user_id)
        achievements = achievement_service.get_user_achievements(user_id, include_locked=False)
        unseen_achievements = achievement_service.get_unseen_achievements(user_id)
        streak = streak_service.get_streak_status(user_id)

        dashboard = {
            "progression": progression,
            "daily_xp": daily_xp,
            "achievements": {
                "total_unlocked": achievements["total_unlocked"],
                "total_available": achievements["total_available"],
                "completion_percentage": (achievements["total_unlocked"] / achievements["total_available"] * 100)
                if achievements["total_available"] > 0 else 0,
                "recent": achievements["unlocked"][:5]  # Last 5 unlocked
            },
            "unseen_achievements": unseen_achievements,
            "streak": streak
        }

        return jsonify(dashboard), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# ============================================================
# INTERNAL ENDPOINTS (for activity completion)
# ============================================================

@gamification_bp.route('/internal/award-activity-xp', methods=['POST'])
@require_auth
def award_activity_xp():
    """
    Internal endpoint to award XP when an activity is completed
    Called by the main assessment routes
    """
    user_id = session['user_id']
    data = request.json

    activity_type = data.get('activity_type')
    activity_id = data.get('activity_id')
    is_perfect = data.get('is_perfect', False)
    is_first_try = data.get('is_first_try', False)
    speed_bonus = data.get('speed_bonus', False)

    if not activity_type or not activity_id:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    try:
        xp_service = XPService(conn)
        achievement_service = AchievementService(conn)

        # Award XP
        xp_result = xp_service.award_activity_xp(
            user_id=user_id,
            activity_type=activity_type,
            activity_id=activity_id,
            is_perfect=is_perfect,
            is_first_try=is_first_try,
            speed_bonus=speed_bonus
        )

        # Check for achievement unlocks
        event_data = {
            "activity_type": activity_type,
            "activity_id": activity_id,
            "is_perfect": is_perfect
        }

        new_achievements = achievement_service.check_and_unlock_achievements(
            user_id=user_id,
            event_type="action_item_completed",
            event_data=event_data
        )

        result = {
            **xp_result,
            "new_achievements": new_achievements
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
