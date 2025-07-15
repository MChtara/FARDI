"""
Helper functions for game calculations and utilities
"""
from datetime import datetime
from models.game_data import ACHIEVEMENTS, DIALOGUE_QUESTIONS

def determine_overall_level(assessment_data):
    """Determine the overall CEFR level based on all responses with weighted scoring"""
    # Convert CEFR levels to numeric values
    level_values = {
        "A1": 1,
        "A2": 2,
        "B1": 3,
        "B2": 4,
        "C1": 5
    }

    # Question type weights (some skills may be weighted more heavily)
    type_weights = {
        "introduction": 0.8,
        "motivation": 1.0,
        "cultural_knowledge": 1.0,
        "listening": 1.2,
        "creativity": 0.9,
        "social_interaction": 1.2,
        "problem_solving": 1.1,
        "skills_discussion": 0.9,
        "writing": 1.2
    }

    # Calculate weighted average score
    total_weighted = 0
    total_weights = 0

    for assessment in assessment_data:
        level = assessment.get("level")
        assessment_type = assessment.get("type", "")

        if level in level_values:
            weight = type_weights.get(assessment_type, 1.0)
            total_weighted += level_values[level] * weight
            total_weights += weight

    if total_weights == 0:
        return "B1"  # Default

    average = total_weighted / total_weights

    # Convert back to CEFR level
    if average < 1.5:
        return "A1"
    elif average < 2.5:
        return "A2"
    elif average < 3.5:
        return "B1"
    elif average < 4.5:
        return "B2"
    else:
        return "C1"

def skill_levels_from_assessments(assessments):
    """Extract skill levels from assessment data"""
    # Initialize skill assessment collections
    skill_assessments = {
        "vocabulary": [],
        "grammar": [],
        "spelling": [],
        "fluency": [],
        "comprehension": []
    }

    # Collect assessments by skill type
    for assessment in assessments:
        if "vocabulary_assessment" in assessment:
            skill_assessments["vocabulary"].append(assessment)
        if "grammar_assessment" in assessment:
            skill_assessments["grammar"].append(assessment)
        if "spelling_assessment" in assessment:
            skill_assessments["spelling"].append(assessment)
        if "fluency_assessment" in assessment:
            skill_assessments["fluency"].append(assessment)
        if "comprehension_assessment" in assessment:
            skill_assessments["comprehension"].append(assessment)

    # Determine level for each skill
    skill_levels = {}
    for skill, skill_assessments_list in skill_assessments.items():
        if skill_assessments_list:
            skill_levels[skill] = determine_overall_level(skill_assessments_list)
        else:
            skill_levels[skill] = "B1"  # Default to B1 if no assessments

    return skill_levels

def calculate_achievements(assessments, start_time):
    """Calculate achievements based on user performance"""
    achievements_earned = []

    # Calculate time spent
    time_spent = (datetime.now() - start_time).total_seconds() / 60  # in minutes
    if time_spent < 5:
        achievements_earned.append("quick_thinker")

    # Check for consistent performance
    levels = [a.get("level") for a in assessments if "level" in a]
    if len(set(levels)) == 1 and len(levels) > 3:
        achievements_earned.append("consistent_performer")

    # Check for vocabulary mastery
    vocab_strengths = sum(1 for a in assessments if a.get("vocabulary_assessment", "").lower().find("advanced") >= 0)
    if vocab_strengths >= 3:
        achievements_earned.append("vocabulary_master")

    # Check for grammar expertise
    grammar_strengths = sum(1 for a in assessments if a.get("grammar_assessment", "").lower().find("excellent") >= 0)
    if grammar_strengths >= 3:
        achievements_earned.append("grammar_expert")

    # Check for communication skills
    if any(a.get("level") in ["B2", "C1"] for a in assessments if a.get("type") == "social_interaction"):
        achievements_earned.append("communicator")

    return achievements_earned

def calculate_xp(assessments):
    """Calculate experience points based on user performance"""
    base_xp = 0

    # Base XP from question types
    for assessment in assessments:
        for question in DIALOGUE_QUESTIONS:
            if question["type"] == assessment.get("type"):
                base_xp += question.get("xp_reward", 10)
                break

    # Level multiplier
    level_multipliers = {
        "A1": 1.0,
        "A2": 1.2,
        "B1": 1.5,
        "B2": 1.8,
        "C1": 2.0
    }

    level_bonus = 0
    for assessment in assessments:
        level = assessment.get("level")
        if level in level_multipliers:
            level_bonus += level_multipliers[level] * 5

    return int(base_xp + level_bonus)

def get_challenges_by_level(level):
    """Get bonus challenges appropriate for each CEFR level"""
    challenges_by_level = {
        "A1": [
            "Introduce yourself and mention three hobbies you enjoy",
            "Describe your favorite food using at least 5 adjectives",
            "Talk about your daily routine using present tense"
        ],
        "A2": [
            "Describe your last vacation using past tense",
            "Explain why you like or dislike a particular type of music",
            "Give directions from your home to the nearest store"
        ],
        "B1": [
            "Discuss the advantages and disadvantages of social media",
            "Describe a problem in your community and suggest a solution",
            "Talk about your plans for the future using different future forms"
        ],
        "B2": [
            "Discuss how technology has changed education in the last decade",
            "Present arguments for and against working from home",
            "Describe a book or film that made a strong impression on you and explain why"
        ],
        "C1": [
            "Discuss the impact of climate change on future generations",
            "Analyze the cultural significance of a traditional celebration",
            "Present your views on how to balance economic growth with environmental protection"
        ]
    }
    
    return challenges_by_level.get(level, challenges_by_level["B1"])

def get_tips_by_level(level):
    """Get language learning tips appropriate for each CEFR level"""
    tips_by_level = {
        "A1": [
            "Try to learn 5-10 new vocabulary words each day",
            "Practice using simple present tense ('I go', 'She likes')",
            "Use conjunctions like 'and' and 'but' to connect simple sentences",
            "Learn common everyday phrases like 'How are you?' and 'I would like'"
        ],
        "A2": [
            "Practice using the past tense to talk about completed actions",
            "Use 'because' to give reasons for your opinions",
            "Learn vocabulary related to specific topics like travel or food",
            "Try asking more complex questions using 'why' and 'how'"
        ],
        "B1": [
            "Practice using conditional sentences with 'if' and 'would'",
            "Express opinions using phrases like 'I believe that' or 'In my opinion'",
            "Use connecting words like 'however', 'therefore', and 'moreover'",
            "Replace basic adjectives with more specific ones (e.g., 'fascinating' instead of 'interesting')"
        ],
        "B2": [
            "Use a variety of tenses to add complexity to your sentences",
            "Practice using passive voice when appropriate",
            "Include idiomatic expressions in your responses",
            "Develop arguments with clear supporting points and examples"
        ],
        "C1": [
            "Incorporate sophisticated vocabulary and academic language",
            "Use complex sentence structures with multiple clauses",
            "Express subtle nuances of meaning through precise word choice",
            "Practice using specialized vocabulary in your field of interest"
        ]
    }
    
    return tips_by_level.get(level, tips_by_level["B1"])

def get_xp_reward_by_level(level):
    """Get XP reward amounts based on CEFR level"""
    xp_rewards = {
        "A1": 15,
        "A2": 20,
        "B1": 25,
        "B2": 30,
        "C1": 40
    }
    return xp_rewards.get(level, 25)