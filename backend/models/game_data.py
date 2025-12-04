"""
Game data and constants for the CEFR language assessment game
"""

POINTS_PER_LEVEL = {"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5}

ACHIEVEMENTS = {
    "quick_thinker": {"name": "Quick Thinker", "description": "Completed the assessment in under 5 minutes"},
    "consistent_performer": {"name": "Consistent Performer", "description": "Achieved the same level across all questions"},
    "vocabulary_master": {"name": "Vocabulary Master", "description": "Used advanced vocabulary in responses"},
    "grammar_expert": {"name": "Grammar Expert", "description": "Showed excellent grammar skills"},
    "communicator": {"name": "Master Communicator", "description": "Excelled in the social interaction tasks"}
}

CEFR_LEVELS = {
    "A1": "Beginner - Can understand and use familiar everyday expressions and very basic phrases.",
    "A2": "Elementary - Can communicate in simple and routine tasks requiring a simple and direct exchange of information.",
    "B1": "Intermediate - Can deal with most situations likely to arise while traveling in an area where the language is spoken.",
    "B2": "Upper Intermediate - Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible.",
    "C1": "Advanced - Can express ideas fluently and spontaneously without much obvious searching for expressions.",
}

NPCS = {
    "Ms. Mabrouki": {
        "role": "Event Coordinator",
        "description": "Facilitates discussions, provides guidance.",
        "personality": "Organized, encouraging, and detail-oriented",
        "avatar": "mabrouki.svg",
        "background": "Has coordinated over 20 cultural events across Tunisia"
    },
    "SKANDER": {
        "role": "Student Council President",
        "description": "Engages players in team activities.",
        "personality": "Charismatic, energetic, and visionary",
        "avatar": "skander.svg",
        "background": "Third-year politics student with a passion for cultural heritage"
    },
    "Emna": {
        "role": "Committee Member",
        "description": "Manages finances and logistics",
        "personality": "Practical, precise, and reliable",
        "avatar": "emna.svg",
        "background": "Business student who has worked on several community projects"
    },
    "Ryan": {
        "role": "Committee Member",
        "description": "Coordinates social media and outreach",
        "personality": "Creative, tech-savvy, and social",
        "avatar": "ryan.svg",
        "background": "Communications major with experience in digital marketing"
    },
    "Lilia": {
        "role": "Committee Member",
        "description": "Handles artistic direction and cultural authenticity",
        "personality": "Artistic, thoughtful, and passionate about tradition",
        "avatar": "lilia.svg",
        "background": "Art history student and part-time tour guide at a local museum"
    }
}

BADGES = {
    "A1": {"name": "Newcomer", "icon": "newcomer.jpg", "description": "You've taken your first steps!"},
    "A2": {"name": "Explorer", "icon": "badge-a2.png", "description": "You're finding your way around."},
    "B1": {"name": "Adventurer", "icon": "badge-b1.png", "description": "You can navigate most situations."},
    "B2": {"name": "Navigator", "icon": "badge-b2.png", "description": "You communicate with confidence."},
    "C1": {"name": "Ambassador", "icon": "badge-c1.png", "description": "You express yourself with sophistication."},
}

PROGRESS_LEVELS = [
    {"name": "Orientation", "description": "Meet the team and get acquainted", "icon": "orientation.png"},
    {"name": "Planning", "description": "Contribute to event planning discussions",
        "icon": "planning.png", "required_level": "A2"},
    {"name": "Coordination", "description": "Coordinate with other team members",
        "icon": "coordination.png", "required_level": "B1"},
    {"name": "Execution", "description": "Help execute the cultural event", "icon": "execution.png", "required_level": "B2"},
    {"name": "Leadership", "description": "Take on leadership responsibilities",
        "icon": "leadership.png", "required_level": "C1"}
]

DIALOGUE_QUESTIONS = [
    {
        "step": 1,
        "speaker": "Ms. Mabrouki",
        "question": "Welcome to the Cultural Event Planning Committee! I'm Ms. Mabrouki, the Event Coordinator. We're excited to have you onboard. Before we start, let's get to know you better and see how you can contribute to our event. Can you introduce yourself?",
        "type": "introduction",
        "skill": "self-expression",
        "xp_reward": 10,
        "scene": "meeting_room",
        "assessment_criteria": {
            "vocabulary_range": 0.3,
            "grammar_accuracy": 0.2,
            "fluency": 0.3,
            "relevance": 0.2
        },
        "example_responses": {
            "A1": "I am [Name]. I am happy to be here.",
            "A2": "Hi, I am [Name]. I like events, and I want to help.",
            "B1": "Hi, I'm [Name]. I have participated in student events before, and I am excited to join.",
            "B2": "Good morning, I'm [Name]. I have experience in event planning and I'm eager to contribute.",
            "C1": "I'm [Player]. I'm eager to contribute to the committee as I have a deep appreciation for cultural diversity and teamwork."
        }
    },
    {
        "step": 2,
        "speaker": "Ms. Mabrouki",
        "question": "Can you tell me why you want to join the committee?",
        "type": "motivation",
        "skill": "reasoning",
        "xp_reward": 15,
        "scene": "meeting_room",
        "assessment_criteria": {
            "vocabulary_range": 0.2,
            "grammar_accuracy": 0.2,
            "reasoning_depth": 0.4,
            "coherence": 0.2
        },
        "example_responses": {
            "A1": "I like events.",
            "A2": "I want to join because I like culture.",
            "B1": "I'd like to help with the event because I enjoy working with people.",
            "B2": "I'm interested in joining because I'm passionate about cultural traditions.",
            "C1": "I'm eager to contribute to the committee as I have a deep appreciation for cultural diversity and teamwork."
        }
    },
    {
        "step": 3,
        "speaker": "Ms. Mabrouki",
        "question": "What do you know about Tunisian culture?",
        "type": "cultural_knowledge",
        "skill": "world_knowledge",
        "xp_reward": 20,
        "scene": "meeting_room",
        "assessment_criteria": {
            "vocabulary_range": 0.2,
            "factual_accuracy": 0.4,
            "elaboration": 0.2,
            "cultural_sensitivity": 0.2
        },
        "example_responses": {
            "A1": "It is nice. They have food.",
            "A2": "Tunisian culture has good food and music.",
            "B1": "I know Tunisia has traditional dances and tasty dishes like couscous.",
            "B2": "Tunisian culture is rich with history, like Carthage, and famous for its music and cuisine.",
            "C1": "Tunisian culture is a vibrant blend of Arab, Berber, and Mediterranean influences, seen in its architecture and festivals."
        }
    },
    {
        "step": 4,
        "speaker": "SKANDER",
        "question": "Listen carefully and repeat exactly what I say: We could have a dance show or a food tasting.",
        "type": "listening",
        "skill": "listening_comprehension",
        "xp_reward": 15,
        "scene": "meeting_room",
        "audio_cue": "skander_suggestion.mp3",
        "assessment_criteria": {
            "accuracy": 0.8,
            "grammar_accuracy": 0.1,
            "rephrasing_ability": 0.1
        },
        "expected_sentence": "We could have a dance show or a food tasting.",
        "example_responses": {
            "A1": "Dance... food.",
            "A2": "Dance show or food.",
            "B1": "We could have a dance show or food tasting.",
            "B2": "We could have a dance show or a food tasting.",
            "C1": "We could have a dance show or a food tasting."
        }
    },
    {
        "step": 5,
        "speaker": "Ms. Mabrouki",
        "question": "Imagine we need a theme for the event. What idea do you have?",
        "type": "creativity",
        "skill": "ideation",
        "xp_reward": 25,
        "scene": "meeting_room",
        "assessment_criteria": {
            "originality": 0.4,
            "vocabulary_range": 0.2,
            "coherence": 0.2,
            "elaboration": 0.2
        },
        "example_responses": {
            "A1": "A party with food.",
            "A2": "Maybe a theme with Tunisian food and colors.",
            "B1": "I suggest a theme about Tunisian traditions, like a market.",
            "B2": "How about a 'Tunisian Heritage Night' with music, food stalls, and crafts?",
            "C1": "I propose a 'Journey Through Tunisian Heritage' theme with interactive exhibits and live performances."
        }
    },
    {
        "step": 6,
        "speaker": "Emna",
        "question": "Hi there! I'm Emna, one of the committee members.",
        "instruction": "Greet Emna and ask her a question about the event.",
        "type": "social_interaction",
        "skill": "conversation",
        "xp_reward": 20,
        "scene": "coffee_break",
        "assessment_criteria": {
            "politeness": 0.3,
            "question_formation": 0.3,
            "grammar_accuracy": 0.2,
            "appropriateness": 0.2
        },
        "example_responses": {
            "A1": "Hi. You like event?",
            "A2": "Hello, Emna. What you do for event?",
            "B1": "Hi, Emna! What are you planning for the event?",
            "B2": "Hello, Emna! Could you tell me what role you're taking in the event?",
            "C1": "Hi, Emna! I'm curious—what specific contributions are you planning for this event?"
        }
    },
    {
        "step": 7,
        "speaker": "Ms. Mabrouki",
        "question": "If a problem happens, like a delay, what would you do?",
        "type": "problem_solving",
        "skill": "strategic_thinking",
        "xp_reward": 30,
        "scene": "meeting_room",
        "scenario_image": "delay_scenario.jpg",
        "assessment_criteria": {
            "solution_quality": 0.4,
            "conditional_expressions": 0.2,
            "coherence": 0.2,
            "proactivity": 0.2
        },
        "example_responses": {
            "A1": "I tell someone.",
            "A2": "I tell Ms. Mabrouki about the problem.",
            "B1": "I'd inform you and try to find a solution quickly.",
            "B2": "I'd report it to you immediately and suggest moving another activity forward.",
            "C1": "I'd promptly notify you, assess the situation, and propose rescheduling to keep things on track."
        }
    },
    {
        "step": 8,
        "speaker": "Ryan",
        "question": "What skills do you think are important for this committee?",
        "type": "skills_discussion",
        "skill": "abstract_thinking",
        "xp_reward": 20,
        "scene": "brainstorming_area",
        "assessment_criteria": {
            "vocabulary_range": 0.3,
            "concept_development": 0.3,
            "reasoning": 0.2,
            "relevance": 0.2
        },
        "example_responses": {
            "A1": "Talk and work.",
            "A2": "Talking good and working with people.",
            "B1": "I think communication and teamwork are important.",
            "B2": "Skills like effective communication, organization, and collaboration are key.",
            "C1": "In my view, strong interpersonal skills, organization, and adaptability are essential."
        }
    },
    {
        "step": 9,
        "speaker": "Lilia",
        "question": "Can you write a one-sentence invitation to the event?",
        "type": "writing",
        "skill": "written_expression",
        "xp_reward": 25,
        "scene": "creative_corner",
        "assessment_criteria": {
            "grammar_accuracy": 0.25,
            "vocabulary_range": 0.25,
            "style_appropriateness": 0.25,
            "conciseness": 0.25
        },
        "example_responses": {
            "A1": "Come to party.",
            "A2": "Please come to our event with food.",
            "B1": "Join us for a fun cultural event this weekend!",
            "B2": "We invite you to celebrate Tunisian culture with us on Saturday!",
            "C1": "You're cordially invited to experience an unforgettable celebration of Tunisian heritage this Saturday."
        }
    }
]

ASSESSMENT_CRITERIA = {
    "vocabulary_range": {
        "description": "Tracks word complexity and variety",
        "A1": "Uses very basic vocabulary (e.g., 'nice', 'good', 'bad')",
        "A2": "Uses common, everyday vocabulary with some topic-specific words",
        "B1": "Uses sufficient vocabulary for familiar topics with some circumlocution",
        "B2": "Uses a broad vocabulary with good command of idiomatic expressions",
        "C1": "Uses sophisticated vocabulary precisely and appropriately (e.g., 'cordially', 'vibrant')"
    },
    "grammar_accuracy": {
        "description": "Evaluates structure, tenses, and connectors",
        "A1": "Uses very simple structures with frequent errors (e.g., 'I tell someone')",
        "A2": "Uses basic patterns correctly but still makes systematic errors",
        "B1": "Shows reasonable accuracy in familiar contexts, uses present/past/future",
        "B2": "Shows good grammatical control with occasional slips (e.g., conditional forms)",
        "C1": "Maintains consistent grammatical control of complex language (e.g., 'I'd propose rescheduling')"
    },
    "fluency_detail": {
        "description": "Assesses coherence, elaboration, and flow",
        "A1": "Uses single words or very short, isolated phrases",
        "A2": "Uses simple phrases connected with basic linkers ('and', 'but', 'because')",
        "B1": "Produces straightforward connected text on familiar topics",
        "B2": "Produces clear, detailed text with appropriate connectors",
        "C1": "Produces fluent, well-structured discourse with controlled use of organizational patterns"
    },
    "comprehension_relevance": {
        "description": "Ensures responses match the task",
        "A1": "Shows minimal understanding of the question",
        "A2": "Shows basic understanding but may miss details",
        "B1": "Shows good understanding of the main points",
        "B2": "Shows detailed understanding and responds appropriately",
        "C1": "Shows complete understanding and responds with nuance and sophistication"
    }
}

# Phase 2 Data - Loaded from JSON via phase2_loader
from .phase2_loader import PHASE_2_STEPS, PHASE_2_REMEDIAL_ACTIVITIES, PHASE_2_POINTS, PHASE_2_SUCCESS_THRESHOLD  

