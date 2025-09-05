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

# Phase 2
PHASE_2_POINTS = {"A1": 1, "A2": 2, "B1": 3, "B2": 4}
PHASE_2_SUCCESS_THRESHOLD = 20  

PHASE_2_STEPS = {
    "step_1": {
        "title": "Assigning Roles",
        "description": "Work with the team to assign roles for the cultural event",
        "scenario": "You're gathered in the vibrant committee room at the university, surrounded by colorful posters of past cultural events. Ms. Mabrouki, SKANDER, Emna, Ryan, and Lilia are buzzing with excitement about the event. Your action plan starts here: reflect on your Phase 1 journey, assign roles for tasks like decorations, music, food, and promotion, and ensure everyone's on board.",
        "action_items": [
            {
                "id": "storytelling_intro",
                "speaker": "Ms. Mabrouki",
                "question": "Let's start by sharing how our orientation in Phase 1 inspired us for this event. What did you learn about our team or the event theme that excites you for planning?",
                "instruction": "Type or say a short story (2-3 sentences) about your experience from Phase 1 (e.g., orientation meeting, email invitation, choosing the event theme, role brainstorming). Make it lively to inspire the team!",
                "hint": "Mention the cultural theme or a teammate's idea from Phase 1.",
                "expected_responses": {
                    "A1": "I like orientation. Theme is culture.",
                    "A2": "In Phase 1, I learn about team. Theme is fun.",
                    "B1": "In Phase 1, we chose a cultural theme, and I liked Emna's idea for music.",
                    "B2": "During Phase 1's orientation, we selected a vibrant Tunisian cultural theme, and SKANDER's leadership inspired me to plan this event."
                },
                "assessment_focus": ["vocabulary_range", "grammar_syntax", "connection_to_phase1"]
            },
            {
                "id": "role_suggestion",
                "speaker": "Ms. Mabrouki",
                "question": "Let's shape our action plan! Who would be great for creating the decorations, and what makes them perfect for it?",
                "instruction": "Type or say your suggestion, explaining why the person fits the role based on their skills or interests.",
                "hint": "Mention a skill like creativity or teamwork.",
                "expected_responses": {
                    "A1": "Emna do decorations. She like art.",
                    "A2": "I think Emna for decorations because she likes art.",
                    "B1": "I suggest Emna for decorations since she's creative and good at art.",
                    "B2": "I propose Emna for the decoration role in our action plan, as her creativity and artistic skills will create a vibrant atmosphere."
                },
                "assessment_focus": ["vocabulary_range", "grammar_syntax", "reasoning"]
            },
            {
                "id": "peer_negotiation",
                "speaker": "SKANDER",
                "question": "I think Ryan would be perfect for decorations because he's so organized. What's your take?",
                "instruction": "Type or say your response, agreeing with SKANDER or defending your choice. Be polite and explain your thoughts to build the action plan together.",
                "hint": "Try agreeing or explaining your choice politely.",
                "expected_responses": {
                    "A1": "Okay, Ryan do it.",
                    "A2": "Maybe Ryan is good because he is organized.",
                    "B1": "I agree, Ryan's organization skills could work well for decorations.",
                    "B2": "I see your point; Ryan's organizational skills make him a strong candidate for decorations in our action plan."
                },
                "assessment_focus": ["politeness", "negotiation", "reasoning"]
            },
            {
                "id": "role_confirmation",
                "speaker": "System",
                "question": "Write one or two sentences to confirm the final roles for two team members (e.g., Emna and Ryan) in the action plan. Make sure your sentences are clear and fit the team's vision for the cultural event.",
                "instruction": "Write one or two sentences to confirm the final roles for two team members (e.g., Emna and Ryan) in the action plan. Make sure your sentences are clear and fit the team's vision for the cultural event.",
                "hint": "Mention who does what clearly.",
                "expected_responses": {
                    "A1": "Emna do music. Ryan do decorations.",
                    "A2": "Emna is for music, and Ryan is for decorations.",
                    "B1": "Emna will handle music, and Ryan will manage decorations.",
                    "B2": "Emna is assigned to music, while Ryan will oversee decorations with his organizational skills for our action plan."
                },
                "assessment_focus": ["grammar_syntax", "clarity", "coherence"]
            },
            {
                "id": "team_reflection",
                "speaker": "Lilia",
                "question": "How do these roles help our cultural event come to life?",
                "instruction": "Type or say a short response (1-2 sentences) explaining how the assigned roles (e.g., Emna's music, Ryan's decorations) will make the event special. Connect it to the cultural theme from Phase 1.",
                "hint": "Link roles to the cultural theme.",
                "expected_responses": {
                    "A1": "Music is good for event.",
                    "A2": "Emna's music make event fun.",
                    "B1": "Emna's music will make the event lively, and Ryan's decorations will show our culture.",
                    "B2": "Emna's music will bring Tunisian traditions to life, while Ryan's decorations will create a vibrant cultural atmosphere for our event."
                },
                "assessment_focus": ["cultural_connection", "elaboration", "coherence"]
            }
        ],
        "success_threshold": 20,
        "success_feedback": "Wow, [Player]! Your action plan for assigning roles is brilliant and full of energy! You've captured the spirit of our cultural event perfectly. Ready to schedule our first meeting? Let's move to Step 2: Scheduling Meetings!",
        "remedial_feedback": "Great start, [Player]! You're bringing our cultural event to life, but let's add a bit more sparkle to your skills. Join us for some fun action items to prepare for the next step in our action plan!"
    },
    
    "step_2": {
        "title": "Scheduling Meetings",
        "description": "Coordinate meeting times and agendas with the team",
        "scenario": "You're back in the lively committee room, filled with energy and colorful Tunisian decorations. The team is ready to schedule meetings to organize the cultural event's tasks (e.g., decorations, music, food, promotion). Your action plan needs a clear schedule to keep everyone on track.",
        "action_items": [
            {
                "id": "meeting_proposal",
                "speaker": "Ms. Mabrouki",
                "question": "Let's schedule our first planning meeting! When should we meet, and why is that time perfect for our team?",
                "instruction": "Type or say a short proposal (2-3 sentences) suggesting a day, time, and reason tied to the team's needs or event goals.",
                "hint": "Suggest a day and time, like 'Friday at 3 PM,' and a reason.",
                "expected_responses": {
                    "A1": "Meet Friday. It good for team.",
                    "A2": "I suggest Friday at 3 PM because team is free.",
                    "B1": "Let's meet on Friday at 3 PM since most team members are available then.",
                    "B2": "I propose Friday at 3 PM for our meeting, as it suits everyone's schedule and gives us time to plan the cultural event."
                },
                "assessment_focus": ["vocabulary_range", "grammar_syntax", "reasoning"]
            },
            {
                "id": "purpose_explanation",
                "speaker": "Emna",
                "question": "Why is this meeting important for our cultural event?",
                "instruction": "Type or say a short response (1-2 sentences) explaining how the meeting will help the team (e.g., plan decorations or music) and connect to the cultural theme.",
                "hint": "Mention a task like decorations or music.",
                "expected_responses": {
                    "A1": "Meeting help plan event.",
                    "A2": "Meeting is for plan music and decorations.",
                    "B1": "The meeting will help us plan music and decorations for the cultural event.",
                    "B2": "This meeting will help us organize music and decorations to showcase Tunisian traditions in our event."
                },
                "assessment_focus": ["vocabulary_range", "grammar_syntax", "cultural_connection"]
            },
            {
                "id": "schedule_negotiation",
                "speaker": "SKANDER",
                "question": "I think Wednesday at 5 PM works better because it's quieter on campus. What's your take?",
                "instruction": "Type or say your response, agreeing with SKANDER or proposing another time with a reason.",
                "hint": "Agree politely or suggest another time with a reason.",
                "expected_responses": {
                    "A1": "Okay, Wednesday good.",
                    "A2": "Maybe Wednesday at 5 PM is good because quiet.",
                    "B1": "I agree, Wednesday at 5 PM works since it's quieter on campus.",
                    "B2": "I see your point; Wednesday at 5 PM is great because the quiet campus helps us focus on our action plan."
                },
                "assessment_focus": ["politeness", "negotiation", "reasoning"]
            },
            {
                "id": "agenda_setting",
                "speaker": "Ryan",
                "question": "What should we discuss in this meeting to keep our action plan on track?",
                "instruction": "Type or say a short response (1-2 sentences) suggesting two topics (e.g., decorations budget, music selection) for the meeting agenda.",
                "hint": "Suggest topics like music or decorations.",
                "expected_responses": {
                    "A1": "Talk music and decorations.",
                    "A2": "We discuss music selection and decorations budget.",
                    "B1": "We should discuss the music selection and decorations budget to plan the event.",
                    "B2": "Let's discuss the music selection and decorations budget to ensure our cultural event shines."
                },
                "assessment_focus": ["vocabulary_range", "organization", "relevance"]
            },
            {
                "id": "meeting_confirmation",
                "speaker": "Lilia",
                "question": "Let's confirm our meeting details for the action plan!",
                "instruction": "Type or say one or two sentences to confirm the meeting day, time, and one key topic, ensuring it fits the cultural event's goals.",
                "hint": "Confirm the day, time, and a topic like music.",
                "expected_responses": {
                    "A1": "Meet Friday. Talk music.",
                    "A2": "Meeting is Friday at 3 PM to talk music.",
                    "B1": "We'll meet on Friday at 3 PM to discuss music selection.",
                    "B2": "Our meeting is set for Friday at 3 PM to discuss music selection for our cultural event."
                },
                "assessment_focus": ["grammar_syntax", "clarity", "coherence"]
            }
        ],
        "success_threshold": 20,
        "success_feedback": "Fantastic, [Player]! Your meeting schedule is perfectly planned, setting our cultural event on the right track! Ready to organize tasks? Let's move to Step 3: Planning Tasks!",
        "remedial_feedback": "Great start, [Player]! Your scheduling ideas are coming together, but let's polish them with some fun action items to prepare for the next step!"
    },
    
    "step_3": {
        "title": "Planning Tasks",
        "description": "Organize specific tasks and assign responsibilities",
        "scenario": "The committee room is buzzing with creativity as the team plans specific tasks for the cultural event (e.g., designing decorations, selecting music). Your action plan needs detailed tasks to ensure the event reflects Tunisian culture. Listen to and collaborate with Ms. Mabrouki, SKANDER, Emna, Ryan, and Lilia to propose and finalize tasks.",
        "action_items": [
            {
                "id": "task_proposal",
                "speaker": "Ms. Mabrouki",
                "question": "What tasks should we start with to make our event shine?",
                "instruction": "Type or say a short proposal (2-3 sentences) suggesting two tasks (e.g., designing decorations, choosing music) and why they're important for the cultural event.",
                "hint": "Suggest tasks like designing decorations or selecting music.",
                "expected_responses": {
                    "A1": "Do decorations. Pick music.",
                    "A2": "Design decorations because it look nice. Pick music for event.",
                    "B1": "We should design decorations to show culture and pick music to make it fun.",
                    "B2": "Let's design decorations to reflect Tunisian culture and select music to create a festive atmosphere."
                },
                "assessment_focus": ["vocabulary_range", "grammar_syntax", "cultural_relevance"]
            },
            {
                "id": "task_purpose",
                "speaker": "Emna",
                "question": "Why are these tasks important for our cultural event?",
                "instruction": "Type or say a short response (1-2 sentences) explaining how one task (e.g., designing decorations) supports the cultural theme from Phase 1.",
                "hint": "Explain how a task like decorations connects to Tunisian culture.",
                "expected_responses": {
                    "A1": "Decorations make event nice.",
                    "A2": "Decorations is important for culture.",
                    "B1": "Decorations will show Tunisian culture at our event.",
                    "B2": "Designing decorations will showcase Tunisian traditions, making our event vibrant."
                },
                "assessment_focus": ["vocabulary_range", "cultural_connection", "elaboration"]
            },
            {
                "id": "task_negotiation",
                "speaker": "SKANDER",
                "question": "I suggest focusing on food planning first to highlight Tunisian cuisine. What's your take?",
                "instruction": "Type or say a response (1-2 sentences), agreeing or proposing another task with a reason, ensuring polite collaboration.",
                "hint": "Agree politely or suggest another task with a reason.",
                "expected_responses": {
                    "A1": "Okay, food good.",
                    "A2": "Maybe food is good because it show culture.",
                    "B1": "I agree, food planning highlights Tunisian cuisine.",
                    "B2": "I see your point; food planning is key to showcase Tunisian cuisine in our action plan."
                },
                "assessment_focus": ["politeness", "negotiation", "cultural_awareness"]
            },
            {
                "id": "task_assignment",
                "speaker": "Ryan",
                "question": "Who should handle these tasks in our action plan?",
                "instruction": "Type or say a short response (1-2 sentences) assigning two tasks to team members (e.g., Emna for music, Ryan for decorations) with reasons based on Step 1 roles.",
                "hint": "Assign tasks with reasons, like 'Emna for music because she's creative.'",
                "expected_responses": {
                    "A1": "Emna do music. Ryan do decorations.",
                    "A2": "Emna for music because she like songs. Ryan for decorations.",
                    "B1": "Emna should handle music since she's creative, and Ryan should do decorations.",
                    "B2": "Emna should handle music due to her creativity, while Ryan manages decorations for our cultural event."
                },
                "assessment_focus": ["grammar_syntax", "reasoning", "role_consistency"]
            },
            {
                "id": "task_listening",
                "speaker": "Lilia",
                "question": "Listen to my task suggestion for the cultural event!",
                "instruction": "Listen carefully and then type or say a short response (1-2 sentences) summarizing Lilia's suggestions and saying if you agree or suggest another task.",
                "hint": "Summarize Lilia's tasks (poster, Malouf music) and agree or suggest another task.",
                "audio_text": "I think we should create a poster to promote the event and select Malouf music to highlight Tunisian culture. These will make our event vibrant!",
                "expected_responses": {
                    "A1": "Poster and music. I like it.",
                    "A2": "Lilia say poster and Malouf music. I agree it good.",
                    "B1": "Lilia suggests a poster and Malouf music, and I agree they will promote the event.",
                    "B2": "Lilia proposes creating a poster and selecting Malouf music, which I agree will enhance our event's cultural appeal."
                },
                "assessment_focus": ["listening_comprehension", "vocabulary_range", "cultural_awareness"]
            }
        ],
        "success_threshold": 20,
        "success_feedback": "Incredible, [Player]! Your task plans and listening skills are vibrant and ready to make our cultural event shine! Let's finalize the action plan in the Final Writing Activity!",
        "remedial_feedback": "Great work, [Player]! Your task ideas and listening are coming together, but let's polish them with some challenging action items to make it shine!"
    },
    
    "final_writing": {
        "title": "Drafting the Action Plan",
        "description": "Create the final action plan document",
        "scenario": "The committee room is filled with excitement as the team prepares the final action plan for the cultural event. Ms. Mabrouki says, 'Let's write a section of our action plan to summarize our roles, meeting schedule, and tasks!' Your job is to draft a clear, organized plan, incorporating what you hear from the team, building on Steps 1-3 and the cultural theme from Phase 1.",
        "action_items": [
            {
                "id": "role_summary",
                "speaker": "Ms. Mabrouki",
                "question": "Summarize the roles for our action plan.",
                "instruction": "Type or say 2-3 sentences describing two team members' roles (e.g., Emna for music, Ryan for decorations) and why they were chosen, referencing Step 1.",
                "hint": "Mention roles from Step 1, like 'Emna for music,' with reasons.",
                "expected_responses": {
                    "A1": "Emna do music. Ryan do decorations.",
                    "A2": "Emna is for music because she like songs. Ryan is for decorations.",
                    "B1": "Emna handles music since she's creative, and Ryan manages decorations.",
                    "B2": "Emna is assigned music due to her creativity, while Ryan oversees decorations to reflect Tunisian culture."
                },
                "assessment_focus": ["vocabulary_range", "grammar_syntax", "role_clarity"]
            },
            {
                "id": "schedule_summary",
                "speaker": "SKANDER",
                "question": "Include our meeting schedule in the action plan.",
                "instruction": "Type or say 1-2 sentences summarizing the meeting day, time, and purpose from Step 2.",
                "hint": "Mention day, time, purpose from Step 2.",
                "expected_responses": {
                    "A1": "Meet Friday. Plan event.",
                    "A2": "Meeting is Friday at 3 PM for plan.",
                    "B1": "We meet on Friday at 3 PM to plan music and decorations.",
                    "B2": "Our meeting is set for Friday at 3 PM to organize music and decorations for the cultural event."
                },
                "assessment_focus": ["grammar_syntax", "clarity", "schedule_accuracy"]
            },
            {
                "id": "task_summary",
                "speaker": "Emna",
                "question": "List the tasks in our action plan.",
                "instruction": "Type or say 2-3 sentences listing two tasks (e.g., designing decorations, selecting music) from Step 3 and their importance.",
                "hint": "List tasks from Step 3, like music selection.",
                "expected_responses": {
                    "A1": "Do decorations. Pick music.",
                    "A2": "Design decorations for culture. Pick music for fun.",
                    "B1": "We'll design decorations to show culture and select music for the event.",
                    "B2": "We'll design decorations to reflect Tunisian culture and select music to create a festive atmosphere."
                },
                "assessment_focus": ["vocabulary_range", "task_clarity", "cultural_relevance"]
            },
            {
                "id": "plan_listening",
                "speaker": "Ryan",
                "question": "Listen to my action plan summary!",
                "instruction": "Listen carefully and then type or say 1-2 sentences summarizing Ryan's plan points and saying if you agree or suggest a change.",
                "hint": "Summarize Ryan's points (Emna for Malouf music, Friday meeting) and agree or suggest a change.",
                "audio_text": "Our team has Emna for Malouf music because she's creative, and we meet Friday to plan decorations.",
                "expected_responses": {
                    "A1": "Emna do music. I agree.",
                    "A2": "Ryan say Emna for Malouf music and meet Friday. It good.",
                    "B1": "Ryan says Emna handles Malouf music and we meet Friday, and I agree it's a good plan.",
                    "B2": "Ryan notes Emna handles Malouf music and we meet Friday to plan decorations, which I agree aligns with our cultural goals."
                },
                "assessment_focus": ["listening_comprehension", "summary_skills", "agreement_expression"]
            },
            {
                "id": "complete_draft",
                "speaker": "Lilia",
                "question": "Write a short action plan section for our event!",
                "instruction": "Type or say 4-5 sentences combining roles (Step 1), meeting schedule (Step 2), tasks (Step 3), and cultural goals from Phase 1.",
                "hint": "Include roles, schedule, tasks, and culture from Phase 1.",
                "expected_responses": {
                    "A1": "Emna do music. Ryan do decorations. Meet Friday. Event is nice.",
                    "A2": "Emna is for music because she like songs. Ryan do decorations. Meet Friday at 3 PM. Event show culture.",
                    "B1": "Emna handles music, and Ryan manages decorations. We meet Friday at 3 PM to plan. Tasks are music and decorations for culture.",
                    "B2": "Emna is assigned Malouf music due to her creativity, and Ryan oversees decorations to reflect Tunisian culture. We'll meet Friday at 3 PM to plan music selection and decorations, ensuring our cultural event shines."
                },
                "assessment_focus": ["coherence", "integration", "cultural_connection", "comprehensive_planning"]
            }
        ],
        "success_threshold": 20,
        "success_feedback": "Wow, [Player]! Your action plan and listening skills are a masterpiece, ready to make our cultural event unforgettable! You've completed Phase 2—time to celebrate your planning skills!",
        "remedial_feedback": "Great effort, [Player]! Your action plan and listening are taking shape, but let's polish them with some challenging action items to make it shine!"
    }
}

PHASE_2_REMEDIAL_ACTIVITIES = {
    'step_1': {
        "A1": [
            {
                "id": "a1_matching",
                "task_type": "matching",
                "speaker": "SKANDER",
                "instruction": "Let's warm up for our action plan! Match 6 event roles to their descriptions to get ready for planning.",
                "title": "Cultural Role Matching Game",
                "matching_items": {
                    "decorations": "Make the room colorful and cultural",
                    "music": "Play Tunisian songs for the event",
                    "food": "Prepare traditional dishes",
                    "promotion": "Share event news with students",
                    "art": "Skill for drawing or design",
                    "organized": "Skill for planning and order"
                },
                "word_bank": ["decorations", "music", "organized", "promotion", "art", "food"],
                "success_feedback": "Amazing, [Player]! Your role knowledge is ready for our cultural event! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "Nice try, [Player]! Let's practice more to make our action plan shine. Join me for the next task!",
                "success_threshold": 6,
                "expected_answers": ["decorations", "music", "food", "promotion", "art", "organized"]
            },
            {
                "id": "a1_fill_gaps",
                "task_type": "fill_gaps",
                "speaker": "Emna",
                "instruction": "Let’s tell a story about our team’s roles! Fill in 6 gaps to describe who does what for our cultural event.",
                "title": "Role Story Builder",
                "sentences": [
                    {"text": "<select class='word-bank'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> can do <select class='word-bank'><option value=''>Select</option><option>decorations</option><option>music</option></select> because she <select class='word-bank'><option value=''>Select</option><option>likes</option><option>good</option></select> art.", "blanks": ["Emna", "decorations", "likes"]},
                    {"text": "<select class='word-bank'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> can do <select class='word-bank'><option value=''>Select</option><option>promotion</option><option>food</option></select> because he is <select class='word-bank'><option value=''>Select</option><option>organized</option><option>good</option></select>.", "blanks": ["Ryan", "promotion", "organized"]},
                    {"text": "I suggest <select class='word-bank'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> for <select class='word-bank'><option value=''>Select</option><option>music</option><option>art</option></select> role.", "blanks": ["Emna", "music"]},
                    {"text": "<select class='word-bank'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> is good for <select class='word-bank'><option value=''>Select</option><option>decorations</option><option>food</option></select> because she <select class='word-bank'><option value=''>Select</option><option>likes</option><option>good</option></select>.", "blanks": ["Emna", "decorations", "likes"]},
                    {"text": "<select class='word-bank'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> will do <select class='word-bank'><option value=''>Select</option><option>music</option><option>organized</option></select> for the event.", "blanks": ["Emna", "music"]},
                    {"text": "<select class='word-bank'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> is <select class='word-bank'><option value=''>Select</option><option>good</option><option>organized</option></select> at planning tasks.", "blanks": ["Ryan", "organized"]}
                ],
                "word_bank": ["Emna", "Ryan", "decorations", "music", "promotion", "food", "art", "likes", "good", "organized"],
                "success_feedback": "Wow, [Player]! Your role stories are perfect! Ready for [Step 2: Scheduling Meetings]?",
                "remedial_feedback": "Good effort, [Player]! Let’s keep building our event story!",
                "success_threshold": 15,
                "expected_answers": ["Emna", "decorations", "likes", "Ryan", "promotion", "organized", "Emna", "music", "Emna", "decorations", "likes", "Emna", "music", "Ryan", "organized"]
            },
            {
                "id": "a1_dialogue",
                "task_type": "dialogue",
                "speaker": "Ryan",
                "instruction": "Let’s practice talking about our roles! Fill in 6 gaps in this dialogue.",
                "title": "Cultural Role Dialogue",
                "dialogue": [
                    {"type": "character", "speaker": "Ryan", "text": "Who’s good for decorations?"},
                    {"type": "user_input", "text": "<select class='word-bank'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> should do <select class='word-bank'><option value=''>Select</option><option>decorations</option><option>music</option></select> because she <select class='word-bank'><option value=''>Select</option><option>likes</option><option>good</option></select> art.", "blanks": ["Emna", "decorations", "likes"]},
                    {"type": "character", "speaker": "Ryan", "text": "What about music?"},
                    {"type": "user_input", "text": "I suggest <select class='word-bank'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> for music because she loves <select class='word-bank'><option value=''>Select</option><option>songs</option><option>art</option></select>.", "blanks": ["Emna", "songs"]},
                    {"type": "character", "speaker": "Ryan", "text": "Confirm one role."},
                    {"type": "user_input", "text": "<select class='word-bank'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> will do <select class='word-bank'><option value=''>Select</option><option>promotion</option><option>food</option></select>.", "blanks": ["Ryan", "promotion"]}
                ],
                "word_bank": ["Emna", "Ryan", "decorations", "music", "promotion", "food", "likes", "good", "songs", "art"],
                "success_feedback": "Great job, [Player]! Your suggestions are spot-on! Let’s move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "Nice work, [Player]! Let’s try one more task!",
                "success_threshold": 7,
                "expected_answers": ["Emna", "decorations", "likes", "Emna", "songs", "Ryan", "promotion"]
            },
            {
                "id": "a1_writing",
                "task_type": "fill_gaps",  
                "speaker": "Lilia",
                "instruction": "Let's reflect on our roles! Fill in the blanks to complete 6 sentences about who does what and why.",
                "title": "Role Reflection Writing",
                "sentences": [
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> does <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>likes</option><option>good</option></select>.",
                        "blanks": ["Emna", "music", "likes"]
                    },
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> handles <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>organized</option><option>good</option></select>.",
                        "blanks": ["Ryan", "decorations", "organized"]
                    },
                    {
                        "text": "I suggest <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>promotion</option></select>.",
                        "blanks": ["Emna", "music"]
                    },
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> is good for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>likes</option><option>organized</option></select>.",
                        "blanks": ["Emna", "music", "likes"]
                    },
                    {
                        "text": "The event will have <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>food</option></select> by <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select>.",
                        "blanks": ["music", "Emna"]
                    },
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> helps the event because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>organized</option><option>likes songs</option></select>.",
                        "blanks": ["Ryan", "organized"]
                    }
                ],
                "word_bank": ["Emna", "Ryan", "decorations", "music", "promotion", "food", "likes", "good", "songs", "art", "organized"],
                "success_feedback": "Amazing, [Player]! Your reflections are ready for our cultural event! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "You're getting there, [Player]! Let's review with Ms. Mabrouki to prepare for the next step!",
                "success_threshold": 15,
                "expected_answers": ["Emna", "music", "likes", "Ryan", "decorations", "organized", "Emna", "music", "Emna", "music", "likes", "music", "Emna", "Ryan", "organized"]
            }
        ],
        'A2': [
            {
                "id": "role_play_dialogue",
                "title": "Role-Play Dialogue Practice",
                "speaker": "SKANDER",
                "instruction": "Let's practice suggesting roles for our action plan! Fill in 6 gaps in this dialogue.",
                "task_type": "dialogue",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "Who's good for decorations?"},
                    {"type": "user_input", "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> should do <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorations</option><option>music</option></select> because she <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>likes</option><option>loves</option></select> art."},
                    {"type": "character", "speaker": "SKANDER", "text": "What about Ryan?"},
                    {"type": "user_input", "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>I think</option><option>Maybe</option></select> Ryan is good because he is <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>organized</option><option>creative</option></select>."},
                    {"type": "character", "speaker": "SKANDER", "text": "Confirm one role."},
                    {"type": "user_input", "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> will do <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> for our event."}
                ],
                "word_bank": ["Emna", "Ryan", "decorations", "music", "because", "likes", "loves", "I think", "Maybe", "will", "organized", "creative"],
                "success_feedback": "Awesome, [Player]! Your suggestions are perfect! Ready for [Step 2: Scheduling Meetings]?",
                "remedial_feedback": "Good effort, [Player]! Let's try another task to strengthen our plan!",
                "success_threshold": 6,
                "expected_answers": ["Emna", "decorations", "likes", "I think", "organized", "Emna", "music"]
            },  
            {
                "id": "sentence_expansion",
                "title": "Sentence Expansion Challenge",
                "speaker": "EMNA",
                "instruction": "Let's expand our ideas for the event! Fill in the gaps to complete 6 expanded sentences.",
                "task_type": "fill_gaps",
                "sentences": [
                    {
                        "text": "Emna do music → Emna do music <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>because</option><option>and</option></select> she likes songs.",
                        "blanks": ["because"]
                    },
                    {
                        "text": "Ryan do decorations → Ryan do decorations <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>because</option><option>and</option></select> he is organized.",
                        "blanks": ["because"]
                    },
                    {
                        "text": "I suggest Emna → I suggest Emna <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>for</option><option>with</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select>.",
                        "blanks": ["for", "music"]
                    },
                    {
                        "text": "Ryan is good → Ryan is good <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>at</option><option>for</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorations</option><option>planning</option></select>.",
                        "blanks": ["at", "decorations"]
                    },
                    {
                        "text": "Emna do art → Emna do art <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>and</option><option>with</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>creativity</option></select>.",
                        "blanks": ["and", "music"]
                    },
                    {
                        "text": "Ryan help event → Ryan help event <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>with</option><option>by</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>planning</option><option>organizing</option></select>.",
                        "blanks": ["with", "planning"]
                    }
                ],
                "word_bank": ["because", "and", "for", "music", "decorations", "creative", "organized", "planning", "at", "with", "by", "creativity"],
                "success_feedback": "Great job, [Player]! Your sentences are ready for our plan! Ready for [Step 2: Scheduling Meetings]?",
                "remedial_feedback": "Nice try, [Player]! Let's practice more to make our plans shine!",
                "success_threshold": 10,
                "expected_answers": ["because", "because", "for", "music", "at", "decorations", "and", "music", "with", "planning"]
            },
            {
    "id": "cultural_story_rewrite",
    "title": "Cultural Story Rewrite",
    "speaker": "Ryan",
    "instruction": "Let's rewrite a story about our team's roles! Fill in 6 gaps to describe our action plan.",
    "task_type": "fill_gaps",
    "sentences": [
        {
            "text": "Our team <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>chose</option><option>picked</option></select> Emna for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because she loves songs.",
            "blanks": ["chose", "music"]
        },
        {
            "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> will do <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorations</option><option>music</option></select> because he is <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>organized</option><option>creative</option></select>.",
            "blanks": ["Ryan", "decorations", "organized"]
        },
        {
            "text": "The event <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>will</option><option>can</option></select> have <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> by Emna.",
            "blanks": ["will", "music"]
        },
        {
            "text": "I suggest <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decoration</option></select> role.",
            "blanks": ["Emna", "music"]
        },
        {
            "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> is good <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>at</option><option>for</option></select> decorations.",
            "blanks": ["Ryan", "at"]
        },
        {
            "text": "The action plan <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>works</option><option>helps</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>everyone</option><option>teams</option></select> for success.",
            "blanks": ["works", "everyone"]
        }
    ],
    "word_bank": ["chose", "picked", "Emna", "Ryan", "music", "decorations", "will", "organized", "creative", "at", "for", "works", "helps"],
    "success_feedback": "Fantastic, [Player]! Your story is perfect! Ready for [Step 2: Scheduling Meetings]?",
    "remedial_feedback": "Good work, [Player]! Let's try one more task to boost our event!",
    "success_threshold": 13,
    "expected_answers": ["chose", "music", "Ryan", "decorations", "organized", "will", "music", "Emna", "music", "Ryan", "at", "works", "everyone"]
},
            {
                "id": "role_confirmation_practice",
                "title": "Role Confirmation Practice",
                "speaker": "Lilia",
                "instruction": "Let's confirm our roles for the action plan! Write 6 sentences about who does what and why.",
                "task_type": "fill_gaps",
                "sentences": [
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> will do <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>creative</option><option>organized</option></select>.",
                        "blanks": ["Emna", "music", "creative"]
                    },
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> handles <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>organized</option><option>creative</option></select>.",
                        "blanks": ["Ryan", "decorations", "organized"]
                    },
                    {
                        "text": "The team chose <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select>.",
                        "blanks": ["Emna", "music"]
                    },
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> is good for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>creative</option><option>organized</option></select>.",
                        "blanks": ["Emna", "music", "creative"]
                    },
                    {
                        "text": "The event will have <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> by <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select>.",
                        "blanks": ["music", "Emna"]
                    },
                    {
                        "text": "Our action plan includes <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>teamwork</option><option>planning</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>success</option><option>culture</option></select>.",
                        "blanks": ["teamwork", "success"]
                    }
                ],
                "word_bank": ["Emna", "Ryan", "music", "decorations", "creative", "organized", "teamwork", "planning", "success", "culture", "handles", "chose"],
                "success_feedback": "Amazing, [Player]! Your confirmations are ready! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "You're close, [Player]! Let's review with Ms. Mabrouki to prepare for the next step!",
                "success_threshold": 15,
                "expected_answers": ["Emna", "music", "creative", "Ryan", "decorations", "organized", "Emna", "music", "Emna", "music", "creative", "music", "Emna", "teamwork", "success"]
            }
      ],
        'B1': [
            {
                "id": "negotiation_roleplay",
                "title": "Negotiation Role-Play",
                "speaker": "SKANDER",
                "instruction": "Let's practice negotiating roles for our action plan! Fill in 6 gaps in this dialogue to suggest and agree on roles.",
                "task_type": "dialogue",
                "dialogue": [
                    {
                        "type": "character",
                        "speaker": "SKANDER",
                        "text": "Who's great for decorations?"
                    },
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> is great because she is <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>creative</option><option>organized</option></select>.",
                        "blanks": ["Emna", "creative"]
                    },
                    {
                        "type": "character",
                        "speaker": "SKANDER",
                        "text": "Ryan's organized for decorations."
                    },
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>I agree</option><option>I see</option></select> Ryan is good <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>because</option><option>so</option></select> he is organized.",
                        "blanks": ["I agree", "because"]
                    },
                    {
                        "type": "character",
                        "speaker": "SKANDER",
                        "text": "Why Emna for music?"
                    },
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> has <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>art</option></select> experience.",
                        "blanks": ["Emna", "music"]
                    }
                ],
                "word_bank": ["I suggest", "I agree", "I see", "because", "has", "creative", "organized", "Emna", "Ryan", "music", "art", "so"],
                "success_feedback": "Excellent, [Player]! Your negotiation skills are ready! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "Good job, [Player]! Let's practice more to perfect our plan!",
                "success_threshold": 6,
                "expected_answers": ["Emna", "creative", "I agree", "because", "Emna", "music"]
            },
            {
                "id": "role_confirmation_writing",
                "title": "Role Confirmation Writing",
                "speaker": "EMNA",
                "instruction": "Let's confirm our roles for the event! Fill in the gaps to complete 6 sentences about roles with reasons.",
                "task_type": "fill_gaps",
                "sentences": [
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> will handle <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because she is <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>creative</option><option>organized</option></select>.",
                        "blanks": ["Emna", "music", "creative"]
                    },
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> is assigned to <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because he is <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>creative</option><option>organized</option></select>.",
                        "blanks": ["Ryan", "decorations", "organized"]
                    },
                    {
                        "text": "I suggest <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because she has <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>experience</option><option>skills</option></select>.",
                        "blanks": ["Emna", "music", "experience"]
                    },
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> will manage <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorations</option><option>music</option></select> and <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>promotion</option><option>planning</option></select>.",
                        "blanks": ["Ryan", "decorations", "promotion"]
                    },
                    {
                        "text": "The team chose <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because she is <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>creative</option><option>organized</option></select>.",
                        "blanks": ["Emna", "music", "creative"]
                    },
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> is good for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because he is <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>creative</option><option>organized</option></select>.",
                        "blanks": ["Ryan", "decorations", "organized"]
                    }
                ],
                "word_bank": ["Emna", "Ryan", "music", "decorations", "because", "will", "handle", "creative", "organized", "experience"],
                "success_feedback": "Great work, [Player]! Your confirmations are perfect! Ready for [Step 2: Scheduling Meetings]?",
                "remedial_feedback": "Nice effort, [Player]! Let's try another task to polish our plans!",
                "success_threshold": 18,
                "expected_answers": ["Emna", "music", "creative", "Ryan", "decorations", "organized", "Emna", "music", "experience", "Ryan", "decorations", "promotion", "Emna", "music", "creative", "Ryan", "decorations", "organized"]
            },
            {
    "id": "cultural_reflection_practice",
    "title": "Cultural Reflection Practice",
    "speaker": "Ryan",
    "instruction": "Let's reflect on how our roles make the event special! Fill in 6 gaps to explain why roles matter.",
    "task_type": "fill_gaps",
    "sentences": [
        {
            "text": "Emna's <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> helps because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>cultural</option><option>fun</option></select>.",
            "blanks": ["music", "cultural"]
        },
        {
            "text": "Ryan's <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>organization</option><option>creativity</option></select> makes the event <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>organized</option><option>beautiful</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>planning</option><option>artistic</option></select>.",
            "blanks": ["organization", "organized", "planning"]
        },
        {
            "text": "The <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decoration</option></select> role is important for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>atmosphere</option><option>teamwork</option></select>.",
            "blanks": ["music", "atmosphere"]
        },
        {
            "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> will make the event <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>vibrant</option><option>smooth</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>organization</option></select>.",
            "blanks": ["Emna", "vibrant", "music"]
        },
        {
            "text": "Our action plan includes <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>traditions</option><option>meetings</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>authenticity</option><option>efficiency</option></select>.",
            "blanks": ["traditions", "authenticity"]
        },
        {
            "text": "The cultural event needs <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>teamwork</option><option>planning</option></select> to <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>succeed</option><option>showcase</option></select>.",
            "blanks": ["teamwork", "succeed"]
        }
    ],
    "word_bank": ["music", "decorations", "organization", "creativity", "Emna", "Ryan", "traditions", "teamwork", "atmosphere", "vibrant", "organized"],
    "success_feedback": "Fantastic, [Player]! Your reflections make our event shine! Let's move to [Step 2: Scheduling Meetings]!",
    "remedial_feedback": "Good work, [Player]! Let's try one more task to boost our event's vibe!",
    "success_threshold": 14,
    "expected_answers": ["music", "cultural", "organization", "organized", "planning", "music", "atmosphere", "Emna", "vibrant", "music", "traditions", "authenticity", "teamwork", "succeed"]
},
            {
    "id": "storytelling_revision",
    "title": "Storytelling Revision",
    "speaker": "Lilia",
    "instruction": "Let's rewrite a story about our event roles! Write 6 sentences to describe our action plan and its cultural impact.",
    "task_type": "fill_gaps",
    "sentences": [
        {
            "text": "Our team chose <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>she loves songs</option><option>he is organized</option></select>.",
            "blanks": ["Emna", "music", "she loves songs"]
        },
        {
            "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> will create <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Tunisian atmosphere</option><option>organized plans</option></select> to show <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>cultural heritage</option><option>team spirit</option></select>.",
            "blanks": ["Emna", "Tunisian atmosphere", "cultural heritage"]
        },
        {
            "text": "The event will feature <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Malouf music</option><option>decorations</option></select> by <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select>.",
            "blanks": ["Malouf music", "Emna"]
        },
        {
            "text": "I suggest <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music coordination</option><option>decoration planning</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>she understands culture</option><option>he plans well</option></select>.",
            "blanks": ["Emna", "music coordination", "she understands culture"]
        },
        {
            "text": "Our action plan makes the event <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>culturally authentic</option><option>well organized</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>it includes Tunisian traditions</option><option>everyone has clear roles</option></select>.",
            "blanks": ["culturally authentic", "it includes Tunisian traditions"]
        },
        {
            "text": "The cultural event will <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>celebrate heritage</option><option>bring people together</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>it showcases traditions</option><option>teamwork makes it special</option></select>.",
            "blanks": ["celebrate heritage", "it showcases traditions"]
        }
    ],
    "word_bank": ["Emna", "Ryan", "music", "decorations", "Tunisian atmosphere", "Malouf music", "cultural heritage", "culturally authentic", "celebrate heritage"],
    "success_feedback": "Amazing, [Player]! Your story brings our event to life! Let's move to [Step 2: Scheduling Meetings]!",
    "remedial_feedback": "You're close, [Player]! Let's review with Ms. Mabrouki to prepare for the next step!",
    "success_threshold": 15,
    "expected_answers": ["Emna", "music", "she loves songs", "Emna", "Tunisian atmosphere", "cultural heritage", "Malouf music", "Emna", "Emna", "music coordination", "she understands culture", "culturally authentic", "it includes Tunisian traditions", "celebrate heritage", "it showcases traditions"]
}
    ]
    },
    "step_2": {
        "A1": [
            {
                "id": "schedule_matching",
                "title": "Schedule Matching Game",
                "speaker": "SKANDER",
                "instruction": "Let's practice scheduling! Match 6 meeting details to their purposes.",
                "task_type": "matching",
                "matching_items": {
                    "Friday 3 PM": "Best time for team to meet",
                    "music": "Plan Tunisian songs",
                    "decorations": "Plan cultural visuals",
                    "quiet time": "Good for focus",
                    "budget": "Discuss event costs",
                    "teamwork": "Work together"
                },
                "word_bank": ["Friday 3 PM", "music", "decorations", "quiet time", "budget", "teamwork"],
                "success_feedback": "Awesome, [Player]! Your schedule is ready! Let's move to [Step 3]!",
                "remedial_feedback": "Nice try! Let's practice more for our plan!",
                "success_threshold": 6,
                "expected_answers": ["Friday 3 PM", "music", "decorations", "quiet time", "budget", "teamwork"]
            },
            {
                "id": "schedule_sentence_builder",
                "title": "Schedule Sentence Builder",
                "speaker": "Emna",
                "instruction": "Let's build sentences for our schedule! Fill in 6 gaps.",
                "task_type": "fill_gaps",
                "sentences": [
                    {
                        "text": "Meet <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Friday</option><option>Monday</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>3 PM</option><option>5 PM</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>because</option><option>when</option></select> team is free.",
                        "blanks": ["Friday", "3 PM", "because"]
                    },
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> helps plan <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select>.",
                        "blanks": ["Emna", "music"]
                    },
                    {
                        "text": "I suggest <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Friday</option><option>Monday</option></select> to <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>discuss</option><option>plan</option></select> music.",
                        "blanks": ["Friday", "discuss"]
                    }
                ],
                "word_bank": ["Friday", "3 PM", "because", "Emna", "music", "discuss", "team"],
                "success_feedback": "Perfect, [Player]! Ready for [Step 3]!",
                "remedial_feedback": "Good effort! Let's try another task!",
                "success_threshold": 6,
                "expected_answers": ["Friday", "3 PM", "because", "Emna", "music", "Friday", "discuss"]
            },
            {
                "id": "schedule_dialogue",
                "title": "Schedule Dialogue",
                "speaker": "Ryan",
                "instruction": "Let's talk about scheduling! Fill in 6 gaps.",
                "task_type": "dialogue",
                "dialogue": [
                    {"type": "character", "speaker": "Ryan", "text": "When's the meeting?"},
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Friday</option><option>Monday</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>3 PM</option><option>5 PM</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>because</option><option>when</option></select> team is free.",
                        "blanks": ["Friday", "3 PM", "because"]
                    },
                    {"type": "character", "speaker": "Ryan", "text": "What will we discuss?"},
                    {
                        "type": "user_input",
                        "text": "We will <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>discuss</option><option>plan</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> and <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>budget</option><option>schedule</option></select>.",
                        "blanks": ["discuss", "music", "budget"]
                    }
                ],
                "word_bank": ["Friday", "3 PM", "because", "discuss", "music", "budget", "team"],
                "success_feedback": "Great job, [Player]! Let's move to [Step 3]!",
                "remedial_feedback": "Nice work! Let's try one more task!",
                "success_threshold": 6,
                "expected_answers": ["Friday", "3 PM", "because", "discuss", "music", "budget"]
            },
            {
                "id": "schedule_confirmation_writing",
                "title": "Schedule Confirmation Writing",
                "speaker": "Lilia",
                "instruction": "Confirm our schedule! Write 6 sentences.",
                "task_type": "fill_gaps",
                "sentences": [
                    {
                        "text": "Meeting is <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Friday</option><option>Monday</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>3 PM</option><option>5 PM</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>team is free</option><option>room is quiet</option></select>.",
                        "blanks": ["Friday", "3 PM", "team is free"]
                    },
                    {
                        "text": "We <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>will discuss</option><option>can plan</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> selection.",
                        "blanks": ["will discuss", "music"]
                    },
                    {
                        "text": "The meeting helps our <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>cultural event</option><option>team planning</option></select>.",
                        "blanks": ["cultural event"]
                    }
                ],
                "word_bank": ["Friday", "3 PM", "team is free", "will discuss", "music", "cultural event"],
                "success_feedback": "Amazing, [Player]! Ready for [Step 3]!",
                "remedial_feedback": "You're close! Let's review with Ms. Mabrouki!",
                "success_threshold": 6,
                "expected_answers": ["Friday", "3 PM", "team is free", "will discuss", "music", "cultural event"]
            }
        ],
        "A2": [
            {
                "id": "schedule_roleplay_dialogue",
                "title": "Schedule Role-Play Dialogue",
                "speaker": "SKANDER",
                "instruction": "Let's practice scheduling dialogues! Fill in 6 gaps.",
                "task_type": "dialogue",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "Who's good for decorations?"},
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> should do <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorations</option><option>music</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>because</option><option>since</option></select> she <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>likes</option><option>loves</option></select> art.",
                        "blanks": ["Emna", "decorations", "because", "likes"]
                    },
                    {"type": "character", "speaker": "SKANDER", "text": "What about Ryan?"},
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>I think</option><option>Maybe</option></select> Ryan is good <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>because</option><option>since</option></select> he is organized.",
                        "blanks": ["I think", "because"]
                    }
                ],
                "word_bank": ["Emna", "Ryan", "decorations", "music", "because", "since", "likes", "loves", "I think", "Maybe"],
                "success_feedback": "Awesome, [Player]! Your suggestions are perfect! Ready for [Step 3]?",
                "remedial_feedback": "Good effort, [Player]! Let's try another task to strengthen our plan!",
                "success_threshold": 6,
                "expected_answers": ["Emna", "decorations", "because", "likes", "I think", "because"]
            },
            {
                "id": "sentence_expansion_schedule",
                "title": "Schedule Sentence Expansion Challenge",
                "speaker": "Emna",
                "instruction": "Let's expand our ideas for the schedule! Rewrite 6 short sentences.",
                "task_type": "fill_gaps",
                "sentences": [
                    {
                        "text": "Meet Friday → Meet Friday at <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>3 PM</option><option>5 PM</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>team is free</option><option>room is quiet</option></select>.",
                        "blanks": ["3 PM", "team is free"]
                    },
                    {
                        "text": "Discuss music → Discuss music <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>and</option><option>with</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorations</option><option>budget</option></select> for event.",
                        "blanks": ["and", "decorations"]
                    },
                    {
                        "text": "Team works → Team works <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>together</option><option>well</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>for</option><option>on</option></select> cultural event.",
                        "blanks": ["together", "for"]
                    }
                ],
                "word_bank": ["3 PM", "team is free", "and", "decorations", "together", "for", "with", "budget"],
                "success_feedback": "Great job, [Player]! Your sentences are ready for our plan! Ready for [Step 3]?",
                "remedial_feedback": "Nice try, [Player]! Let's practice more to make our plans shine!",
                "success_threshold": 6,
                "expected_answers": ["3 PM", "team is free", "and", "decorations", "together", "for"]
            }
        ],
        "B1": [
            {
                "id": "negotiation_schedule_roleplay",
                "title": "Negotiation Schedule Role-Play",
                "speaker": "SKANDER",
                "instruction": "Negotiate the schedule! Fill in 6 gaps.",
                "task_type": "dialogue",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "I suggest Friday at 3 PM for our cultural event meeting."},
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>I agree</option><option>I think</option></select> Friday works <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>because</option><option>since</option></select> the team <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>is available</option><option>can meet</option></select>.",
                        "blanks": ["I agree", "because", "is available"]
                    },
                    {"type": "character", "speaker": "SKANDER", "text": "What should we focus on in the meeting?"},
                    {
                        "type": "user_input",
                        "text": "We should <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>prioritize</option><option>focus on</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music selection</option><option>decoration planning</option></select> and <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>budget discussion</option><option>timeline review</option></select>.",
                        "blanks": ["focus on", "music selection", "budget discussion"]
                    }
                ],
                "word_bank": ["I agree", "I think", "because", "since", "is available", "can meet", "prioritize", "focus on", "music selection", "decoration planning", "budget discussion", "timeline review"],
                "success_feedback": "Excellent, [Player]! Your negotiation skills are ready! Let's move to [Step 3]!",
                "remedial_feedback": "Good job, [Player]! Let's practice more to perfect our plan!",
                "success_threshold": 6,
                "expected_answers": ["I agree", "because", "is available", "focus on", "music selection", "budget discussion"]
            }
        ]
    },
    "step_3": {
        "A1": [
            {
                "id": "task_listening_matching",
                "title": "Task Listening and Matching Challenge",
                "speaker": "SKANDER",
                "instruction": "Listen to my detailed task plan for our cultural event!",
                "task_type": "matching",
                "audio_text": "We need decorations with Tunisian patterns, Malouf music to highlight culture, and a poster to promote the event. Emna is good for music, Ryan for decorations, and Lilia for posters.",
                "matching_items": {
                    "decorations": "Creates cultural visuals",
                    "Tunisian patterns": "Designs with traditional style",
                    "Malouf music": "Chooses traditional music",
                    "poster": "Promotes the event",
                    "Emna": "Music team member",
                    "Ryan": "Decorations team member",
                    "Lilia": "Poster team member",
                    "culture": "Event theme"
                },
                "word_bank": ["decorations", "Tunisian patterns", "Malouf music", "poster", "Emna", "Ryan", "Lilia", "culture"],
                "success_feedback": "Wow, [Player]! Your listening and matching are perfect! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Good start, [Player]! Let's practice more listening and tasks to shine!",
                "success_threshold": 8,
                "expected_answers": ["decorations", "Tunisian patterns", "Malouf music", "poster", "Emna", "Ryan", "Lilia", "culture"]
            },
            {
                "id": "task_listening_dialogue",
                "title": "Task Listening and Dialogue Completion",
                "speaker": "Emna",
                "instruction": "Listen to our task discussion and complete the dialogue!",
                "task_type": "dialogue",
                "audio_text": "I think Emna should pick Malouf music because it's traditional. Ryan can design decorations with Tunisian patterns. What do you suggest?",
                "dialogue": [
                    {"type": "character", "speaker": "Emna", "text": "I think Emna should pick Malouf music because it's traditional."},
                    {
                        "type": "user_input",
                        "text": "I agree, <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> should <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>pick</option><option>choose</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>traditional</option><option>cultural</option></select>.",
                        "blanks": ["Emna", "pick", "music", "traditional"]
                    },
                    {"type": "character", "speaker": "Emna", "text": "What about decorations?"},
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Ryan</option><option>Lilia</option></select> can <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>design</option><option>make</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorations</option><option>posters</option></select> to show <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>culture</option><option>traditions</option></select>.",
                        "blanks": ["Ryan", "design", "decorations", "culture"]
                    }
                ],
                "word_bank": ["Emna", "Ryan", "Lilia", "pick", "choose", "design", "make", "music", "decorations", "posters", "traditional", "cultural", "culture", "traditions"],
                "success_feedback": "Fantastic, [Player]! Your listening and dialogue are perfect! Ready for the [Final Writing Activity]?",
                "remedial_feedback": "Good effort, [Player]! Let's keep building our event story!",
                "success_threshold": 8,
                "expected_answers": ["Emna", "pick", "music", "traditional", "Ryan", "design", "decorations", "culture"]
            },
            {
                "id": "task_story_writing",
                "title": "Task Listening and Story Writing",
                "speaker": "Ryan",
                "instruction": "Listen to our task story and complete it!",
                "task_type": "fill_gaps", 
                "audio_text": "Listen carefully: Our team plans decorations with Tunisian patterns and Malouf music. Emna picks music, Ryan designs decorations, and Lilia makes posters. This creates a vibrant cultural event.",
                "sentences": [
                    {
                        "text": "Our team plans <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorations</option><option>music</option></select> with <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Tunisian patterns</option><option>cultural themes</option></select>.",
                        "blanks": ["decorations", "Tunisian patterns"]
                    },
                    {
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> picks <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Malouf music</option><option>traditional songs</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>cultural appeal</option><option>entertainment</option></select>.",
                        "blanks": ["Emna", "Malouf music", "cultural appeal"]
                    },
                    {
                        "text": "This creates a <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>vibrant</option><option>successful</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>cultural event</option><option>team project</option></select>.",
                        "blanks": ["vibrant", "cultural event"]
                    }
                ],
                "word_bank": ["decorations", "music", "Tunisian patterns", "cultural themes", "Emna", "Ryan", "Malouf music", "traditional songs", "cultural appeal", "entertainment", "vibrant", "successful", "cultural event", "team project"],
                "success_feedback": "Amazing story, [Player]! Your listening and creativity are perfect! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Good work, [Player]! Let's try one more listening task!",
                "success_threshold": 7,
                "expected_answers": ["decorations", "Tunisian patterns", "Emna", "Malouf music", "cultural appeal", "vibrant", "cultural event"]
            },
            {
                "id": "task_proposal_writing",
                "title": "Task Listening and Proposal Writing",
                "speaker": "Lilia",
                "instruction": "Listen to my task proposal and write your response!",
                "task_type": "fill_gaps",
                "audio_text": "I propose poster creation and Malouf music selection for our cultural event. These tasks will showcase Tunisian traditions and attract students to our vibrant celebration.",
                "sentences": [
                    {
                        "text": "Lilia proposes <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>poster creation</option><option>music selection</option></select> and <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Malouf music</option><option>traditional food</option></select>.",
                        "blanks": ["poster creation", "Malouf music"]
                    },
                    {
                        "text": "These tasks will <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>showcase</option><option>display</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Tunisian traditions</option><option>cultural heritage</option></select>.",
                        "blanks": ["showcase", "Tunisian traditions"]
                    },
                    {
                        "text": "I <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>agree</option><option>support</option></select> because it creates a <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>vibrant celebration</option><option>successful event</option></select>.",
                        "blanks": ["agree", "vibrant celebration"]
                    }
                ],
                "word_bank": ["poster creation", "music selection", "Malouf music", "traditional food", "showcase", "display", "Tunisian traditions", "cultural heritage", "agree", "support", "vibrant celebration", "successful event"],
                "success_feedback": "Incredible, [Player]! Your listening and proposal are ready! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "You're getting there, [Player]! Let's review with Ms. Mabrouki to prepare for the next step!",
                "success_threshold": 6,
                "expected_answers": ["poster creation", "Malouf music", "showcase", "Tunisian traditions", "agree", "vibrant celebration"]
            }
        ],
        "A2": [
            {
                "id": "task_roleplay_dialogue", 
                "title": "Task Listening and Role-Play Dialogue",
                "speaker": "SKANDER",
                "instruction": "Listen to my task role-play and respond!",
                "task_type": "dialogue",
                "audio_text": "Let's plan decorations with Tunisian patterns and Malouf music for culture. Who should handle these important tasks for our cultural event?",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "Let's plan decorations with Tunisian patterns and Malouf music for culture."},
                    {
                        "type": "user_input",
                        "text": "I suggest <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because she <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>loves</option><option>understands</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>traditional songs</option><option>cultural music</option></select>.",
                        "blanks": ["Emna", "music", "loves", "traditional songs"]
                    },
                    {"type": "character", "speaker": "SKANDER", "text": "Good! What about decorations?"},
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Ryan</option><option>Lilia</option></select> can <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>design</option><option>create</option></select> decorations with <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Tunisian patterns</option><option>cultural themes</option></select> because he is <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>organized</option><option>creative</option></select>.",
                        "blanks": ["Ryan", "design", "Tunisian patterns", "organized"]
                    }
                ],
                "word_bank": ["Emna", "Ryan", "Lilia", "music", "decorations", "loves", "understands", "traditional songs", "cultural music", "design", "create", "Tunisian patterns", "cultural themes", "organized", "creative"],
                "success_feedback": "Great, [Player]! Your listening and dialogue are perfect! Ready for the [Final Writing Activity]?",
                "remedial_feedback": "Good effort! Let's try another listening task!",
                "success_threshold": 8,
                "expected_answers": ["Emna", "music", "loves", "traditional songs", "Ryan", "design", "Tunisian patterns", "organized"]
            },
            {
                "id": "task_sentence_completion",
                "title": "Task Listening and Sentence Completion",
                "speaker": "Emna",
                "instruction": "Listen to my task explanation and complete the sentences!",
                "task_type": "fill_gaps",
                "audio_text": "Our cultural event needs specific tasks: decorations featuring Tunisian patterns, Malouf music selection, and promotional posters. Each team member contributes their unique skills.",
                "sentences": [
                    {
                        "text": "Our event needs <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorations</option><option>music</option></select> featuring <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Tunisian patterns</option><option>traditional designs</option></select>.",
                        "blanks": ["decorations", "Tunisian patterns"]
                    },
                    {
                        "text": "We also need <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Malouf music</option><option>traditional music</option></select> and <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>promotional posters</option><option>advertising materials</option></select>.",
                        "blanks": ["Malouf music", "promotional posters"]
                    },
                    {
                        "text": "Each member contributes <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>unique skills</option><option>special talents</option></select> for <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>cultural success</option><option>event success</option></select>.",
                        "blanks": ["unique skills", "cultural success"]
                    }
                ],
                "word_bank": ["decorations", "music", "Tunisian patterns", "traditional designs", "Malouf music", "traditional music", "promotional posters", "advertising materials", "unique skills", "special talents", "cultural success", "event success"],
                "success_feedback": "Perfect, [Player]! Your listening and sentences shine! Ready for the [Final Writing Activity]?",
                "remedial_feedback": "Nice try, [Player]! Let's practice more to make our plans shine!",
                "success_threshold": 6,
                "expected_answers": ["decorations", "Tunisian patterns", "Malouf music", "promotional posters", "unique skills", "cultural success"]
            }
        ],
        "B1": [
            {
                "id": "task_negotiation_roleplay",
                "title": "Task Listening and Negotiation Role-Play",
                "speaker": "SKANDER",
                "instruction": "Listen to my task negotiation and respond!",
                "task_type": "dialogue",
                "audio_text": "I propose food planning for authentic Tunisian cuisine and decorations with traditional Tunisian patterns. These elements will create cultural authenticity. What's your perspective on this approach?",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "I propose food planning for authentic Tunisian cuisine and decorations with traditional patterns."},
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>I agree</option><option>I appreciate</option></select> your approach because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>cultural authenticity</option><option>traditional elements</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>enhances</option><option>improves</option></select> our event.",
                        "blanks": ["I agree", "cultural authenticity", "enhances"]
                    },
                    {"type": "character", "speaker": "SKANDER", "text": "How should we prioritize these tasks?"},
                    {
                        "type": "user_input",
                        "text": "I suggest we <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>prioritize</option><option>focus on</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>food planning</option><option>decoration design</option></select> first, then <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>coordinate</option><option>integrate</option></select> with <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorative elements</option><option>visual components</option></select>.",
                        "blanks": ["prioritize", "food planning", "coordinate", "decorative elements"]
                    }
                ],
                "word_bank": ["I agree", "I appreciate", "cultural authenticity", "traditional elements", "enhances", "improves", "prioritize", "focus on", "food planning", "decoration design", "coordinate", "integrate", "decorative elements", "visual components"],
                "success_feedback": "Excellent, [Player]! Your listening and negotiation are perfect! Ready for the [Final Writing Activity]?",
                "remedial_feedback": "Good work, [Player]! Let's try one more task to boost our event's vibe!",
                "success_threshold": 8,
                "expected_answers": ["I agree", "cultural authenticity", "enhances", "prioritize", "food planning", "coordinate", "decorative elements"]
            }
        ]
    },
    "final_writing": {
        "A1": [
            {
                "id": "plan_listening_matching",
                "title": "Plan Listening and Matching Challenge",
                "speaker": "SKANDER",
                "instruction": "Listen to my detailed action plan!",
                "task_type": "matching",
                "audio_text": "Emna handles Malouf music to make the event vibrant. Ryan designs decorations with Tunisian tiles. We meet Friday at 3 PM to plan. Lilia makes posters for promotion.",
                "matching_items": {
                    "Emna": "Handles traditional music",
                    "Malouf music": "Vibrant cultural music",
                    "Ryan": "Designs cultural visuals",
                    "Tunisian tiles": "Traditional decoration style",
                    "Friday 3 PM": "Meeting time",
                    "Lilia": "Makes promotional materials",
                    "posters": "Poster team member",
                    "culture": "Event theme"
                },
                "word_bank": ["Emna", "Malouf music", "Ryan", "Tunisian tiles", "Friday 3 PM", "Lilia", "posters", "culture"],
                "success_feedback": "Awesome, [Player]! Your listening and matching are perfect! You've completed Phase 2!",
                "remedial_feedback": "Nice try! Let's practice more listening and planning!",
                "success_threshold": 8,
                "expected_answers": ["Emna", "Malouf music", "Ryan", "Tunisian tiles", "Friday 3 PM", "Lilia", "posters", "culture"]
            },
            {
                "id": "plan_dialogue_completion",
                "title": "Plan Listening and Dialogue Completion",
                "speaker": "Emna",
                "instruction": "Listen to our plan discussion and complete the dialogue!",
                "task_type": "dialogue",
                "audio_text": "Emna handles Malouf music because it's traditional. Ryan designs decorations with Tunisian tiles. We meet Friday at 3 PM. What's your feedback on our action plan?",
                "dialogue": [
                    {"type": "character", "speaker": "Emna", "text": "Emna handles Malouf music because it's traditional."},
                    {
                        "type": "user_input",
                        "text": "I agree, <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> should <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>handle</option><option>manage</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>music</option><option>decorations</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>traditional</option><option>cultural</option></select>.",
                        "blanks": ["Emna", "handle", "music", "traditional"]
                    },
                    {"type": "character", "speaker": "Emna", "text": "What about decorations?"},
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Ryan</option><option>Lilia</option></select> designs <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>decorations</option><option>posters</option></select> to <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>showcase</option><option>display</option></select> because <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>organized</option><option>creative</option></select>.",
                        "blanks": ["Ryan", "decorations", "showcase", "organized"]
                    }
                ],
                "word_bank": ["Emna", "Ryan", "Lilia", "handle", "manage", "music", "decorations", "posters", "traditional", "cultural", "showcase", "display", "organized", "creative"],
                "success_feedback": "Perfect, [Player]! Your listening and dialogue are ready! You've completed Phase 2!",
                "remedial_feedback": "Good effort! Let's try another listening task!",
                "success_threshold": 8,
                "expected_answers": ["Emna", "handle", "music", "traditional", "Ryan", "decorations", "showcase", "organized"]
            }
        ],
        "A2": [
            {
                "id": "plan_roleplay_dialogue",
                "title": "Plan Listening and Role-Play Dialogue",
                "speaker": "SKANDER",
                "instruction": "Listen to my plan role-play and respond!",
                "task_type": "dialogue",
                "audio_text": "Let's assign Malouf music to Emna and decorations with Tunisian tiles to Ryan. These assignments utilize their strengths effectively. What's your assessment of this plan?",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "Let's assign Malouf music to Emna and decorations with Tunisian tiles to Ryan."},
                    {
                        "type": "user_input",
                        "text": "I think <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>assigning</option><option>giving</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Malouf music</option><option>traditional music</option></select> to <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Emna</option><option>Ryan</option></select> works because she <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>understands</option><option>appreciates</option></select> culture.",
                        "blanks": ["assigning", "Malouf music", "Emna", "understands"]
                    },
                    {"type": "character", "speaker": "SKANDER", "text": "How about the decorations?"},
                    {
                        "type": "user_input",
                        "text": "<select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Ryan</option><option>Lilia</option></select> can <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>create</option><option>design</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>beautiful decorations</option><option>cultural displays</option></select> with <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>Tunisian tiles</option><option>traditional patterns</option></select>.",
                        "blanks": ["Ryan", "create", "beautiful decorations", "Tunisian tiles"]
                    }
                ],
                "word_bank": ["assigning", "giving", "Malouf music", "traditional music", "Emna", "Ryan", "Lilia", "understands", "appreciates", "create", "design", "beautiful decorations", "cultural displays", "Tunisian tiles", "traditional patterns"],
                "success_feedback": "Great work, [Player]! Your listening and plan are perfect! You've completed Phase 2!",
                "remedial_feedback": "Nice effort, [Player]! Let's try another task to polish our plans!",
                "success_threshold": 8,
                "expected_answers": ["assigning", "Malouf music", "Emna", "understands", "Ryan", "create", "beautiful decorations", "Tunisian tiles"]
            }
        ],
        "B1": [
            {
                "id": "plan_negotiation_roleplay",
                "title": "Plan Listening and Negotiation Role-Play",
                "speaker": "SKANDER",
                "instruction": "Listen to my plan negotiation and provide your professional assessment!",
                "task_type": "dialogue",
                "audio_text": "I suggest prioritizing Malouf music selection and coordinating Tunisian tiles for decorations. This integrated approach ensures cultural authenticity while maintaining aesthetic coherence. How do you evaluate this comprehensive strategy?",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "I suggest prioritizing Malouf music selection and coordinating Tunisian tiles for decorations."},
                    {
                        "type": "user_input",
                        "text": "I <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>appreciate</option><option>support</option></select> this <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>integrated approach</option><option>comprehensive strategy</option></select> because it <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>ensures</option><option>maintains</option></select> <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>cultural authenticity</option><option>traditional values</option></select>.",
                        "blanks": ["appreciate", "integrated approach", "ensures", "cultural authenticity"]
                    },
                    {"type": "character", "speaker": "SKANDER", "text": "How should we implement this plan effectively?"},
                    {
                        "type": "user_input",
                        "text": "I recommend we <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>coordinate</option><option>synchronize</option></select> the <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>musical elements</option><option>decorative components</option></select> with <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>visual aesthetics</option><option>artistic design</option></select> to achieve <select class='word-bank form-control d-inline w-auto'><option value=''>Select</option><option>aesthetic coherence</option><option>cultural harmony</option></select>.",
                        "blanks": ["coordinate", "musical elements", "visual aesthetics", "aesthetic coherence"]
                    }
                ],
                "word_bank": ["appreciate", "support", "integrated approach", "comprehensive strategy", "ensures", "maintains", "cultural authenticity", "traditional values", "coordinate", "synchronize", "musical elements", "decorative components", "visual aesthetics", "artistic design", "aesthetic coherence", "cultural harmony"],
                "success_feedback": "Outstanding, [Player]! Your listening and negotiation demonstrate excellent professional communication! You've completed Phase 2!",
                "remedial_feedback": "Good job, [Player]! Let's practice more to perfect our plan!",
                "success_threshold": 8,
                "expected_answers": ["appreciate", "integrated approach", "ensures", "cultural authenticity", "coordinate", "musical elements", "visual aesthetics", "aesthetic coherence"]
            }
        ]
    }
}