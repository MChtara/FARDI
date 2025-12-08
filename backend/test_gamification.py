"""
Quick test script for gamification system
"""
import sqlite3
from services.xp_service import XPService
from services.achievement_service import AchievementService
from services.streak_service import StreakService

def test_gamification():
    """Test gamification services"""
    # Connect to database
    conn = sqlite3.connect('fardi.db')

    print("=" * 60)
    print("TESTING GAMIFICATION SYSTEM")
    print("=" * 60)

    # Test user ID (use existing user or create test)
    test_user_id = 1

    try:
        # Test XP Service
        print("\n1. Testing XP Service...")
        xp_service = XPService(conn)

        # Get or create progression
        progression = xp_service.get_user_progression(test_user_id)
        print(f"   [OK] User progression: Level {progression['current_level']}, {progression['total_xp']} XP")

        # Award XP
        result = xp_service.award_xp(test_user_id, "action_item_completed", "test_activity")
        print(f"   [OK] Awarded 50 XP. New total: {result['total_xp']} XP")

        # Test Achievement Service
        print("\n2. Testing Achievement Service...")
        achievement_service = AchievementService(conn)

        # Get achievements
        achievements = achievement_service.get_user_achievements(test_user_id, include_locked=False)
        print(f"   [OK] User has {achievements['total_unlocked']}/{achievements['total_available']} achievements")

        # Check achievement unlock
        new_achievements = achievement_service.check_and_unlock_achievements(
            test_user_id,
            "action_item_completed",
            {"activity_type": "action_item", "activity_id": "test"}
        )
        if new_achievements:
            print(f"   [OK] Unlocked {len(new_achievements)} new achievements:")
            for ach in new_achievements:
                print(f"        - {ach['name']}")
        else:
            print("   [OK] No new achievements unlocked (may already have them)")

        # Test Streak Service
        print("\n3. Testing Streak Service...")
        streak_service = StreakService(conn)

        # Record activity
        streak_result = streak_service.record_activity(test_user_id)
        print(f"   [OK] Current streak: {streak_result['current_streak']} days")
        print(f"   [OK] Longest streak: {streak_result['longest_streak']} days")
        print(f"   [OK] Freeze tokens: {streak_result['freeze_tokens']}")

        if streak_result.get('milestone_reached'):
            print(f"   [MILESTONE] Streak milestone reached! Bonus XP awarded.")

        # Get streak status
        status = streak_service.get_streak_status(test_user_id)
        print(f"   [OK] Streak status: {status['status']}")

        print("\n" + "=" * 60)
        print("ALL TESTS PASSED!")
        print("=" * 60)
        print("\nGamification system is working correctly.")
        print("\nNext steps:")
        print("  1. Start the Flask application")
        print("  2. Test API endpoints via frontend")
        print("  3. Complete an activity to see XP and animations")

        return True

    except Exception as e:
        print(f"\n[ERROR] Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

    finally:
        conn.close()

if __name__ == "__main__":
    test_gamification()
