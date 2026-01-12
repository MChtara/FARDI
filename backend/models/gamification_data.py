"""
Gamification Data and Constants
Contains XP rewards, player levels, achievements, and other gamification-related data
"""

# ============================================================
# XP REWARDS SYSTEM
# ============================================================
XP_REWARDS = {
    # Main activities (Phase 1)
    "action_item_completed": 50,
    "action_item_perfect": 100,
    "step_completed": 200,
    "phase_1_completed": 1000,
    "phase_2_completed": 1000,

    # Remedial activities
    "remedial_A1_completed": 20,
    "remedial_A2_completed": 30,
    "remedial_B1_completed": 40,
    "remedial_perfect": 50,

    # Bonuses
    "first_try_success": 50,
    "streak_bonus_3": 25,
    "streak_bonus_5": 50,
    "streak_bonus_10": 100,
    "streak_bonus_20": 250,
    "speed_bonus": 15,
    "comeback_bonus": 30,
    "perfect_score": 75,

    # Daily engagement
    "daily_login": 10,
    "daily_goal_met": 40,
}

# ============================================================
# PLAYER LEVELS
# ============================================================
PLAYER_LEVELS = [
    {
        "level": 1,
        "title": "Cultural Novice",
        "xp_required": 0,
        "unlock": "Basic exercises",
        "icon": "level-1-novice.svg"
    },
    {
        "level": 2,
        "title": "Event Assistant",
        "xp_required": 500,
        "unlock": "Voice responses",
        "icon": "level-2-assistant.svg"
    },
    {
        "level": 3,
        "title": "Planning Coordinator",
        "xp_required": 1500,
        "unlock": "Timed challenges",
        "icon": "level-3-coordinator.svg"
    },
    {
        "level": 4,
        "title": "Cultural Ambassador",
        "xp_required": 3000,
        "unlock": "Peer challenges",
        "icon": "level-4-ambassador.svg"
    },
    {
        "level": 5,
        "title": "Event Master",
        "xp_required": 5000,
        "unlock": "Leaderboards",
        "icon": "level-5-master.svg"
    },
    {
        "level": 6,
        "title": "Heritage Guardian",
        "xp_required": 7500,
        "unlock": "Advanced features",
        "icon": "level-6-guardian.svg"
    },
    {
        "level": 7,
        "title": "Tunisian Legend",
        "xp_required": 10000,
        "unlock": "All features",
        "icon": "level-7-legend.svg"
    }
]

# ============================================================
# ACHIEVEMENTS SYSTEM
# ============================================================
ACHIEVEMENTS = {
    # Progress Milestones
    "first_steps": {
        "id": "first_steps",
        "name": "First Steps",
        "description": "Complete your first action item",
        "icon": "achievement-first-steps.svg",
        "rarity": "common",
        "xp_reward": 50,
        "condition": {"type": "action_items_completed", "count": 1}
    },
    "getting_started": {
        "id": "getting_started",
        "name": "Getting Started",
        "description": "Complete 5 action items",
        "icon": "achievement-getting-started.svg",
        "rarity": "common",
        "xp_reward": 100,
        "condition": {"type": "action_items_completed", "count": 5}
    },
    "committed_learner": {
        "id": "committed_learner",
        "name": "Committed Learner",
        "description": "Complete 20 action items",
        "icon": "achievement-committed.svg",
        "rarity": "uncommon",
        "xp_reward": 250,
        "condition": {"type": "action_items_completed", "count": 20}
    },
    "phase_master": {
        "id": "phase_master",
        "name": "Phase Master",
        "description": "Complete an entire phase",
        "icon": "achievement-phase-master.svg",
        "rarity": "rare",
        "xp_reward": 500,
        "condition": {"type": "phase_completed", "count": 1}
    },

    # Streak Achievements
    "on_fire": {
        "id": "on_fire",
        "name": "On Fire",
        "description": "Maintain a 3-day streak",
        "icon": "achievement-fire-3.svg",
        "rarity": "common",
        "xp_reward": 100,
        "condition": {"type": "streak", "count": 3}
    },
    "dedicated": {
        "id": "dedicated",
        "name": "Dedicated",
        "description": "Maintain a 7-day streak",
        "icon": "achievement-fire-7.svg",
        "rarity": "uncommon",
        "xp_reward": 250,
        "condition": {"type": "streak", "count": 7}
    },
    "unstoppable": {
        "id": "unstoppable",
        "name": "Unstoppable",
        "description": "Maintain a 14-day streak",
        "icon": "achievement-fire-14.svg",
        "rarity": "rare",
        "xp_reward": 500,
        "condition": {"type": "streak", "count": 14}
    },
    "legend": {
        "id": "legend",
        "name": "Legend",
        "description": "Maintain a 30-day streak",
        "icon": "achievement-fire-30.svg",
        "rarity": "epic",
        "xp_reward": 1000,
        "condition": {"type": "streak", "count": 30}
    },

    # Performance Achievements
    "perfectionist": {
        "id": "perfectionist",
        "name": "Perfectionist",
        "description": "Get a perfect score on 5 activities",
        "icon": "achievement-perfect.svg",
        "rarity": "uncommon",
        "xp_reward": 200,
        "condition": {"type": "perfect_scores", "count": 5}
    },
    "speed_demon": {
        "id": "speed_demon",
        "name": "Speed Demon",
        "description": "Complete 10 activities with speed bonus",
        "icon": "achievement-speed.svg",
        "rarity": "uncommon",
        "xp_reward": 200,
        "condition": {"type": "speed_bonuses", "count": 10}
    },
    "comeback_kid": {
        "id": "comeback_kid",
        "name": "Comeback Kid",
        "description": "Return after a break and complete 3 activities",
        "icon": "achievement-comeback.svg",
        "rarity": "common",
        "xp_reward": 150,
        "condition": {"type": "comeback", "count": 3}
    },

    # CEFR Level Achievements
    "a1_master": {
        "id": "a1_master",
        "name": "A1 Master",
        "description": "Complete 10 A1 remedial activities",
        "icon": "achievement-a1.svg",
        "rarity": "common",
        "xp_reward": 150,
        "condition": {"type": "remedial_level_completed", "level": "A1", "count": 10}
    },
    "a2_master": {
        "id": "a2_master",
        "name": "A2 Master",
        "description": "Complete 10 A2 remedial activities",
        "icon": "achievement-a2.svg",
        "rarity": "uncommon",
        "xp_reward": 200,
        "condition": {"type": "remedial_level_completed", "level": "A2", "count": 10}
    },
    "b1_master": {
        "id": "b1_master",
        "name": "B1 Master",
        "description": "Complete 10 B1 remedial activities",
        "icon": "achievement-b1.svg",
        "rarity": "rare",
        "xp_reward": 300,
        "condition": {"type": "remedial_level_completed", "level": "B1", "count": 10}
    },

    # Cultural Theme Achievements
    "culture_enthusiast": {
        "id": "culture_enthusiast",
        "name": "Culture Enthusiast",
        "description": "Complete all Step 1 activities",
        "icon": "achievement-culture.svg",
        "rarity": "uncommon",
        "xp_reward": 250,
        "condition": {"type": "step_completed", "step": "step_1"}
    },
    "event_planner": {
        "id": "event_planner",
        "name": "Event Planner",
        "description": "Complete all Step 2 activities",
        "icon": "achievement-planner.svg",
        "rarity": "uncommon",
        "xp_reward": 250,
        "condition": {"type": "step_completed", "step": "step_2"}
    },
    "team_coordinator": {
        "id": "team_coordinator",
        "name": "Team Coordinator",
        "description": "Complete all Step 3 activities",
        "icon": "achievement-coordinator.svg",
        "rarity": "uncommon",
        "xp_reward": 250,
        "condition": {"type": "step_completed", "step": "step_3"}
    },
    "cultural_ambassador": {
        "id": "cultural_ambassador",
        "name": "Cultural Ambassador",
        "description": "Complete all Step 4 activities",
        "icon": "achievement-ambassador.svg",
        "rarity": "rare",
        "xp_reward": 300,
        "condition": {"type": "step_completed", "step": "step_4"}
    },

    # Special Achievements
    "early_bird": {
        "id": "early_bird",
        "name": "Early Bird",
        "description": "Complete activities before 9 AM on 5 days",
        "icon": "achievement-early.svg",
        "rarity": "uncommon",
        "xp_reward": 200,
        "condition": {"type": "early_activity", "count": 5}
    },
    "night_owl": {
        "id": "night_owl",
        "name": "Night Owl",
        "description": "Complete activities after 10 PM on 5 days",
        "icon": "achievement-night.svg",
        "rarity": "uncommon",
        "xp_reward": 200,
        "condition": {"type": "late_activity", "count": 5}
    },
    "social_butterfly": {
        "id": "social_butterfly",
        "name": "Social Butterfly",
        "description": "Connect with 5 friends (Phase 3)",
        "icon": "achievement-social.svg",
        "rarity": "uncommon",
        "xp_reward": 200,
        "condition": {"type": "friends_count", "count": 5}
    },
    "helpful_peer": {
        "id": "helpful_peer",
        "name": "Helpful Peer",
        "description": "Help 10 peers in study groups (Phase 3)",
        "icon": "achievement-helpful.svg",
        "rarity": "rare",
        "xp_reward": 300,
        "condition": {"type": "peer_help", "count": 10}
    }
}

# ============================================================
# RARITY TIERS
# ============================================================
RARITY_TIERS = {
    "common": {
        "name": "Common",
        "color": "#95A5A6",
        "icon": "rarity-common.svg"
    },
    "uncommon": {
        "name": "Uncommon",
        "color": "#27AE60",
        "icon": "rarity-uncommon.svg"
    },
    "rare": {
        "name": "Rare",
        "color": "#3498DB",
        "icon": "rarity-rare.svg"
    },
    "epic": {
        "name": "Epic",
        "color": "#9B59B6",
        "icon": "rarity-epic.svg"
    },
    "legendary": {
        "name": "Legendary",
        "color": "#F39C12",
        "icon": "rarity-legendary.svg"
    }
}

# ============================================================
# STREAK SYSTEM
# ============================================================
STREAK_REWARDS = {
    3: {"xp": 25, "message": "3-day streak! Keep it up!"},
    5: {"xp": 50, "message": "5-day streak! You're on fire!"},
    7: {"xp": 100, "message": "7-day streak! One week strong!"},
    10: {"xp": 100, "message": "10-day streak! Amazing dedication!"},
    14: {"xp": 200, "message": "14-day streak! Two weeks of excellence!"},
    20: {"xp": 250, "message": "20-day streak! You're unstoppable!"},
    30: {"xp": 500, "message": "30-day streak! You're a legend!"},
}

FREEZE_TOKEN_COST = 100  # XP cost to purchase a streak freeze

# ============================================================
# DAILY GOALS
# ============================================================
DAILY_GOALS = {
    "beginner": {
        "xp_target": 100,
        "activities_target": 2,
        "reward_xp": 40
    },
    "intermediate": {
        "xp_target": 250,
        "activities_target": 4,
        "reward_xp": 60
    },
    "advanced": {
        "xp_target": 500,
        "activities_target": 6,
        "reward_xp": 100
    }
}

# ============================================================
# VISUAL FEEDBACK
# ============================================================
FEEDBACK_ANIMATIONS = {
    "level_up": {
        "duration": 3000,
        "sound": "level-up.mp3",
        "confetti": True,
        "color": "#F39C12"
    },
    "achievement_unlock": {
        "duration": 2500,
        "sound": "achievement.mp3",
        "confetti": True,
        "color": "#9B59B6"
    },
    "xp_gain": {
        "duration": 1500,
        "sound": "xp-gain.mp3",
        "confetti": False,
        "color": "#27AE60"
    },
    "streak_milestone": {
        "duration": 2000,
        "sound": "streak.mp3",
        "confetti": True,
        "color": "#E74C3C"
    },
    "perfect_score": {
        "duration": 2000,
        "sound": "perfect.mp3",
        "confetti": True,
        "color": "#3498DB"
    }
}
