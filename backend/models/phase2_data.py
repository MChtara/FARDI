"""
Phase 2 Game Data - Cultural Event Planning and Teamwork
Based on Phase 2- Final.txt specifications
"""

# Phase 2 Step Structure
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
                "type": "text_response",
                "expected_responses": {
                    "A1": "I like orientation. Theme is culture.",
                    "A2": "In Phase 1, I learn about team. Theme is fun.",
                    "B1": "In Phase 1, we chose a cultural theme, and I liked Emna's idea for music.",
                    "B2": "During Phase 1's orientation, we selected a vibrant Tunisian cultural theme, and SKANDER's leadership inspired me to plan this event."
                },
                "assessment_focus": ["vocabulary", "grammar", "relevance"]
            },
            {
                "id": "role_suggestion",
                "speaker": "Ms. Mabrouki",
                "question": "Let's shape our action plan! Who would be great for creating the decorations, and what makes them perfect for it?",
                "instruction": "Type or say your suggestion, explaining why the person fits the role based on their skills or interests.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Emna do decorations. She like art.",
                    "A2": "I think Emna for decorations because she likes art.",
                    "B1": "I suggest Emna for decorations since she's creative and good at art.",
                    "B2": "I propose Emna for the decoration role in our action plan, as her creativity and artistic skills will create a vibrant atmosphere."
                },
                "assessment_focus": ["vocabulary", "grammar", "reasoning"]
            },
            {
                "id": "peer_negotiation",
                "speaker": "SKANDER",
                "question": "I think Ryan would be perfect for decorations because he's so organized. What's your take?",
                "instruction": "Type or say your response, agreeing with SKANDER or defending your choice. Be polite and explain your thoughts to build the action plan together.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Okay, Ryan do it.",
                    "A2": "Maybe Ryan is good because he is organized.",
                    "B1": "I agree, Ryan's organization skills could work well for decorations.",
                    "B2": "I see your point; Ryan's organizational skills make him a strong candidate for decorations in our action plan."
                },
                "assessment_focus": ["politeness", "vocabulary", "reasoning"]
            },
            {
                "id": "role_confirmation",
                "speaker": "Team",
                "question": "Confirm the final roles for two team members in the action plan.",
                "instruction": "Write one or two sentences to confirm the final roles for two team members (e.g., Emna and Ryan) in the action plan. Make sure your sentences are clear and fit the team's vision for the cultural event.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Emna do music. Ryan do decorations.",
                    "A2": "Emna is for music, and Ryan is for decorations.",
                    "B1": "Emna will handle music, and Ryan will manage decorations.",
                    "B2": "Emna is assigned to music, while Ryan will oversee decorations with his organizational skills for our action plan."
                },
                "assessment_focus": ["grammar", "vocabulary", "coherence"]
            },
            {
                "id": "team_reflection",
                "speaker": "Lilia",
                "question": "How do these roles help our cultural event come to life?",
                "instruction": "Type or say a short response (1-2 sentences) explaining how the assigned roles (e.g., Emna's music, Ryan's decorations) will make the event special. Connect it to the cultural theme from Phase 1.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Music is good for event.",
                    "A2": "Emna's music make event fun.",
                    "B1": "Emna's music will make the event lively, and Ryan's decorations will show our culture.",
                    "B2": "Emna's music will bring Tunisian traditions to life, while Ryan's decorations will create a vibrant cultural atmosphere for our event."
                },
                "assessment_focus": ["vocabulary", "grammar", "cultural_connections"]
            }
        ],
        "success_threshold": 20,
        "success_feedback": "Wow, [Player]! Your action plan for assigning roles is brilliant and full of energy! You've captured the spirit of our cultural event perfectly. Ready to schedule our first meeting? Let's move to [Step 2: Scheduling Meetings]!",
        "remedial_feedback": "Great start, [Player]! You're bringing our cultural event to life, but let's add a bit more sparkle to your skills. Join us for some fun action items to prepare for the next step in our action plan!"
    },
    
    "step_2": {
        "title": "Scheduling Meetings",
        "description": "Schedule meetings to organize the cultural event's tasks",
        "scenario": "You're back in the lively committee room, filled with energy and colorful Tunisian decorations. The team is ready to schedule meetings to organize the cultural event's tasks (e.g., decorations, music, food, promotion). Your action plan needs a clear schedule to keep everyone on track.",
        "action_items": [
            {
                "id": "meeting_proposal",
                "speaker": "Ms. Mabrouki",
                "question": "Let's schedule our first planning meeting! When should we meet, and why is that time perfect for our team?",
                "instruction": "Type or say a short proposal (2-3 sentences) suggesting a day, time, and reason tied to the team's needs or event goals.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Meet Friday. It good for team.",
                    "A2": "I suggest Friday at 3 PM because team is free.",
                    "B1": "Let's meet on Friday at 3 PM since most team members are available then.",
                    "B2": "I propose Friday at 3 PM for our meeting, as it suits everyone's schedule and gives us time to plan the cultural event."
                },
                "assessment_focus": ["vocabulary", "grammar", "relevance"]
            },
            {
                "id": "purpose_explanation",
                "speaker": "Emna",
                "question": "Why is this meeting important for our cultural event?",
                "instruction": "Type or say a short response (1-2 sentences) explaining how the meeting will help the team (e.g., plan decorations or music) and connect to the cultural theme.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Meeting help plan event.",
                    "A2": "Meeting is for plan music and decorations.",
                    "B1": "The meeting will help us plan music and decorations for the cultural event.",
                    "B2": "This meeting will help us organize music and decorations to showcase Tunisian traditions in our event."
                },
                "assessment_focus": ["vocabulary", "grammar", "cultural_connections"]
            },
            {
                "id": "schedule_negotiation",
                "speaker": "SKANDER",
                "question": "I think Wednesday at 5 PM works better because it's quieter on campus. What's your take?",
                "instruction": "Type or say your response, agreeing with SKANDER or proposing another time with a reason.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Okay, Wednesday good.",
                    "A2": "Maybe Wednesday at 5 PM is good because quiet.",
                    "B1": "I agree, Wednesday at 5 PM works since it's quieter on campus.",
                    "B2": "I see your point; Wednesday at 5 PM is great because the quiet campus helps us focus on our action plan."
                },
                "assessment_focus": ["politeness", "vocabulary", "reasoning"]
            },
            {
                "id": "agenda_setting",
                "speaker": "Ryan",
                "question": "What should we discuss in this meeting to keep our action plan on track?",
                "instruction": "Type or say a short response (1-2 sentences) suggesting two topics (e.g., decorations budget, music selection) for the meeting agenda.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Talk music and decorations.",
                    "A2": "We discuss music selection and decorations budget.",
                    "B1": "We should discuss the music selection and decorations budget to plan the event.",
                    "B2": "Let's discuss the music selection and decorations budget to ensure our cultural event shines."
                },
                "assessment_focus": ["vocabulary", "grammar", "relevance"]
            },
            {
                "id": "meeting_confirmation",
                "speaker": "Lilia",
                "question": "Let's confirm our meeting details for the action plan!",
                "instruction": "Type or say one or two sentences to confirm the meeting day, time, and one key topic, ensuring it fits the cultural event's goals.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Meet Friday. Talk music.",
                    "A2": "Meeting is Friday at 3 PM to talk music.",
                    "B1": "We'll meet on Friday at 3 PM to discuss music selection.",
                    "B2": "Our meeting is set for Friday at 3 PM to discuss music selection for our cultural event."
                },
                "assessment_focus": ["grammar", "vocabulary", "cultural_relevance"]
            }
        ],
        "success_threshold": 20,
        "success_feedback": "Fantastic, [Player]! Your meeting schedule is perfectly planned, setting our cultural event on the right track! Ready to organize tasks? Let's move to [Step 3: Planning Tasks]!",
        "remedial_feedback": "Great start, [Player]! Your scheduling ideas are coming together, but let's polish them with some fun action items to prepare for the next step!"
    },
    
    "step_3": {
        "title": "Planning Tasks",
        "description": "Plan specific tasks for the cultural event with listening comprehension",
        "scenario": "The committee room is buzzing with creativity as the team plans specific tasks for the cultural event (e.g., designing decorations, selecting music). Your action plan needs detailed tasks to ensure the event reflects Tunisian culture.",
        "action_items": [
            {
                "id": "task_proposal",
                "speaker": "Ms. Mabrouki",
                "question": "What tasks should we start with to make our event shine?",
                "instruction": "Type or say a short proposal (2-3 sentences) suggesting two tasks (e.g., designing decorations, choosing music) and why they're important for the cultural event.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Do decorations. Pick music.",
                    "A2": "Design decorations because it look nice. Pick music for event.",
                    "B1": "We should design decorations to show culture and pick music to make it fun.",
                    "B2": "Let's design decorations to reflect Tunisian culture and select music to create a festive atmosphere."
                },
                "assessment_focus": ["vocabulary", "grammar", "cultural_relevance"]
            },
            {
                "id": "task_purpose_explanation",
                "speaker": "Emna",
                "question": "Why are these tasks important for our cultural event?",
                "instruction": "Type or say a short response (1-2 sentences) explaining how one task (e.g., designing decorations) supports the cultural theme from Phase 1.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Decorations make event nice.",
                    "A2": "Decorations is important for culture.",
                    "B1": "Decorations will show Tunisian culture at our event.",
                    "B2": "Designing decorations will showcase Tunisian traditions, making our event vibrant."
                },
                "assessment_focus": ["vocabulary", "grammar", "cultural_connections"]
            },
            {
                "id": "task_negotiation",
                "speaker": "SKANDER",
                "question": "I suggest focusing on food planning first to highlight Tunisian cuisine. What's your take?",
                "instruction": "Type or say a response (1-2 sentences), agreeing or proposing another task with a reason, ensuring polite collaboration.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Okay, food good.",
                    "A2": "Maybe food is good because it show culture.",
                    "B1": "I agree, food planning highlights Tunisian cuisine.",
                    "B2": "I see your point; food planning is key to showcase Tunisian cuisine in our action plan."
                },
                "assessment_focus": ["politeness", "vocabulary", "reasoning"]
            },
            {
                "id": "task_assignment",
                "speaker": "Ryan",
                "question": "Who should handle these tasks in our action plan?",
                "instruction": "Type or say a short response (1-2 sentences) assigning two tasks to team members (e.g., Emna for music, Ryan for decorations) with reasons based on Step 1 roles.",
                "type": "text_response",
                "expected_responses": {
                    "A1": "Emna do music. Ryan do decorations.",
                    "A2": "Emna for music because she like songs. Ryan for decorations.",
                    "B1": "Emna should handle music since she's creative, and Ryan should do decorations.",
                    "B2": "Emna should handle music due to her creativity, while Ryan manages decorations for our cultural event."
                },
                "assessment_focus": ["grammar", "vocabulary", "reasoning"]
            },
            {
                "id": "task_listening_comprehension",
                "speaker": "Lilia",
                "question": "Listen to my task suggestion for the cultural event!",
                "instruction": "Audio: 'I think we should create a poster to promote the event and select Malouf music to highlight Tunisian culture. These will make our event vibrant!' Type or say a short response (1-2 sentences) summarizing Lilia's suggestions and saying if you agree or suggest another task.",
                "type": "listening_response",
                "audio_content": "I think we should create a poster to promote the event and select Malouf music to highlight Tunisian culture. These will make our event vibrant!",
                "expected_responses": {
                    "A1": "Poster and music. I like it.",
                    "A2": "Lilia say poster and Malouf music. I agree it good.",
                    "B1": "Lilia suggests a poster and Malouf music, and I agree they will promote the event.",
                    "B2": "Lilia proposes creating a poster and selecting Malouf music, which I agree will enhance our event's cultural appeal."
                },
                "assessment_focus": ["listening_comprehension", "vocabulary", "response_clarity"]
            }
        ],
        "success_threshold": 20,
        "success_feedback": "Incredible, [Player]! Your task plans and listening skills are vibrant and ready to make our cultural event shine! Let's finalize the action plan in the [Final Writing Activity]!",
        "remedial_feedback": "Great work, [Player]! Your task ideas and listening are coming together, but let's polish them with some challenging action items to prepare for the final plan!"
    },
    
    "final_writing": {
        "title": "Drafting the Action Plan",
        "description": "Write a comprehensive action plan combining all previous steps",
        "scenario": "The committee room is filled with excitement as the team prepares the final action plan for the cultural event. Ms. Mabrouki says, \"Let's write a section of our action plan to summarize our roles, meeting schedule, and tasks!\" Your job is to draft a clear, organized plan, incorporating what you hear from the team, building on Steps 1-3 and the cultural theme from Phase 1.",
        "action_items": [
            {
                "id": "role_summary",
                "speaker": "Ms. Mabrouki",
                "question": "Summarize the roles for our action plan.",
                "instruction": "Type or say 2-3 sentences describing two team members' roles (e.g., Emna for music, Ryan for decorations) and why they were chosen, referencing Step 1.",
                "type": "text_response",
                "hint": "Mention roles from Step 1, like 'Emna for music,' with reasons.",
                "expected_responses": {
                    "A1": "Emna do music. Ryan do decorations.",
                    "A2": "Emna is for music because she like songs. Ryan is for decorations.",
                    "B1": "Emna handles music since she's creative, and Ryan manages decorations.",
                    "B2": "Emna is assigned music due to her creativity, while Ryan oversees decorations to reflect Tunisian culture."
                },
                "assessment_focus": ["vocabulary", "grammar", "relevance"]
            },
            {
                "id": "schedule_summary",
                "speaker": "SKANDER",
                "question": "Include our meeting schedule in the action plan.",
                "instruction": "Type or say 1-2 sentences summarizing the meeting day, time, and purpose from Step 2.",
                "type": "text_response",
                "hint": "Mention day, time, purpose from Step 2.",
                "expected_responses": {
                    "A1": "Meet Friday. Plan event.",
                    "A2": "Meeting is Friday at 3 PM for plan.",
                    "B1": "We meet on Friday at 3 PM to plan music and decorations.",
                    "B2": "Our meeting is set for Friday at 3 PM to organize music and decorations for the cultural event."
                },
                "assessment_focus": ["grammar", "vocabulary", "relevance"]
            },
            {
                "id": "task_summary",
                "speaker": "Emna",
                "question": "List the tasks in our action plan.",
                "instruction": "Type or say 2-3 sentences listing two tasks (e.g., designing decorations, selecting music) from Step 3 and their importance.",
                "type": "text_response",
                "hint": "List tasks from Step 3, like music selection.",
                "expected_responses": {
                    "A1": "Do decorations. Pick music.",
                    "A2": "Design decorations for culture. Pick music for fun.",
                    "B1": "We'll design decorations to show culture and select music for the event.",
                    "B2": "We'll design decorations to reflect Tunisian culture and select music to create a festive atmosphere."
                },
                "assessment_focus": ["vocabulary", "grammar", "relevance"]
            },
            {
                "id": "plan_listening_comprehension",
                "speaker": "Ryan",
                "question": "Listen to my action plan summary!",
                "instruction": "Type or say 1-2 sentences summarizing Ryan's plan points and saying if you agree or suggest a change.",
                "type": "listening_response",
                "hint": "Summarize Ryan's points (Emna for Malouf music, Friday meeting) and agree or suggest a change.",
                "audio_content": "Our team has Emna for Malouf music because she's creative, and we meet Friday to plan decorations.",
                "expected_responses": {
                    "A1": "Emna do music. I agree.",
                    "A2": "Ryan say Emna for Malouf music and meet Friday. It good.",
                    "B1": "Ryan says Emna handles Malouf music and we meet Friday, and I agree it's a good plan.",
                    "B2": "Ryan notes Emna handles Malouf music and we meet Friday to plan decorations, which I agree aligns with our cultural goals."
                },
                "assessment_focus": ["listening_comprehension", "vocabulary", "response_clarity"]
            },
            {
                "id": "action_plan_draft",
                "speaker": "Lilia",
                "question": "Write a short action plan section for our event!",
                "instruction": "Type or say 4-5 sentences combining roles (Step 1), meeting schedule (Step 2), tasks (Step 3), and cultural goals from Phase 1.",
                "type": "text_response",
                "hint": "Include roles, schedule, tasks, and culture from Phase 1.",
                "expected_responses": {
                    "A1": "Emna do music. Ryan do decorations. Meet Friday. Event is nice.",
                    "A2": "Emna is for music because she like songs. Ryan do decorations. Meet Friday at 3 PM. Event show culture.",
                    "B1": "Emna handles music, and Ryan manages decorations. We meet Friday at 3 PM to plan. Tasks are music and decorations for culture.",
                    "B2": "Emna is assigned Malouf music due to her creativity, and Ryan oversees decorations to reflect Tunisian culture. We'll meet Friday at 3 PM to plan music selection and decorations, ensuring our cultural event shines."
                },
                "assessment_focus": ["coherence", "vocabulary", "grammar", "cultural_ties"]
            }
        ],
        "success_threshold": 20,
        "success_feedback": "Wow, [Player]! Your action plan and listening skills are a masterpiece, ready to make our cultural event unforgettable! You've completed Phase 2-time to celebrate your planning skills!",
        "remedial_feedback": "Great effort, [Player]! Your action plan and listening are taking shape, but let's polish them with some challenging action items to make it shine!"
    }
}

# Comprehensive Remedial Activities with Fill-in-the-Blank Exercises
PHASE_2_REMEDIAL_ACTIVITIES = {
    'step_1': {
        "A1": [
            {
                "id": "cultural_role_matching",
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
                "success_feedback": "Amazing, [Player]! Your role knowledge is ready for our cultural event! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "Nice try, [Player]! Let's practice more to make our action plan shine. Join me for the next task!",
                "success_threshold": 6,
                "expected_answers": ["decorations", "music", "food", "promotion", "art", "organized"]
            },
            {
                "id": "role_story_builder",
                "task_type": "fill_gaps",
                "speaker": "Emna",
                "instruction": "Let's tell a story about our team's roles! Fill in 6 gaps to describe who does what for our cultural event.",
                "title": "Role Story Builder",
                "sentences": [
                    {"text": "__________ can do __________ because she __________ art.", "blanks": ["Emna", "decorations", "likes"]},
                    {"text": "__________ can do __________ because he is __________.", "blanks": ["Ryan", "promotion", "organized"]},
                    {"text": "I suggest __________ for __________ role.", "blanks": ["Emna", "music"]},
                    {"text": "__________ is good for __________ because she __________.", "blanks": ["Emna", "music", "likes"]},
                    {"text": "__________ will do __________ for the event.", "blanks": ["Ryan", "decorations"]},
                    {"text": "__________ is __________ at planning tasks.", "blanks": ["Ryan", "good"]}
                ],
                "word_bank": ["Emna", "Ryan", "decorations", "music", "likes", "good", "organized", "creative"],
                "success_feedback": "Wow, [Player]! Your role stories are perfect! Ready for [Step 2: Scheduling Meetings]?",
                "remedial_feedback": "Good effort, [Player]! Let's keep building our event story!",
                "success_threshold": 15,
                "expected_answers": ["Emna", "decorations", "likes", "Ryan", "promotion", "organized", "Emna", "music", "Emna", "music", "likes", "Ryan", "decorations", "Ryan", "good"]
            },
            {
                "id": "cultural_role_dialogue",
                "task_type": "dialogue",
                "speaker": "Ryan",
                "instruction": "Let's practice talking about our roles! Fill in 6 gaps in this dialogue.",
                "title": "Cultural Role Dialogue",
                "dialogue": [
                    {"type": "character", "speaker": "Ryan", "text": "Who's good for decorations?"},
                    {"type": "user_input", "text": "__________ should do __________ __________ she likes art.", "blanks": ["Emna", "decorations", "because"]},
                    {"type": "character", "speaker": "Ryan", "text": "What about music?"},
                    {"type": "user_input", "text": "I suggest __________ for music __________ she loves songs.", "blanks": ["Emna", "because"]},
                    {"type": "character", "speaker": "Ryan", "text": "Confirm one role."},
                    {"type": "user_input", "text": "__________ __________ do __________.", "blanks": ["Emna", "will", "music"]}
                ],
                "word_bank": ["Emna", "Ryan", "decorations", "music", "because", "will"],
                "expected_answers": ["Emna", "decorations", "because", "Emna", "because", "Emna", "will", "music"],
                "success_feedback": "Great job, [Player]! Your suggestions are spot-on! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "Nice work, [Player]! Let's try one more task!",
                "success_threshold": 8,
                "expected_answers": ['Emna', 'decorations', 'because', 'Emna', 'because', 'Emna', 'will', 'music']
            },
            {
                "id": "role_reflection_writing",
                "task_type": "fill_gaps",
                "speaker": "Lilia",
                "instruction": "Let's reflect on our roles! Write 6 short sentences about who does what and why.",
                "title": "Role Reflection Writing",
                "sentences": [
                    {"text": "__________ does __________ because __________.", "blanks": ["Emna", "music", "she loves songs"]},
                    {"text": "__________ handles __________ because __________.", "blanks": ["Ryan", "decorations", "he is organized"]},
                    {"text": "I suggest __________ for __________.", "blanks": ["Emna", "music"]},
                    {"text": "__________ is good for __________ because __________.", "blanks": ["Ryan", "planning", "he is organized"]},
                    {"text": "The event will have __________ by __________.", "blanks": ["music", "Emna"]},
                    {"text": "__________ helps the event because __________.", "blanks": ["Ryan", "creativity"]}
                ],
                "word_bank": ["Emna", "Ryan", "music", "decorations", "she loves songs", "he is organized", "creativity"],
                "expected_answers": [
                    ["Emna", "music", "she loves songs"],
                    ["Ryan", "decorations", "he is organized"],
                    ["Emna", "music"],
                    ["Emna", "music", "she loves songs"],
                    ["music", "Emna"],
                    ["Emna", "she loves songs"]
                ],
                "success_feedback": "Amazing, [Player]! Your reflections are ready for our cultural event! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "You're getting there, [Player]! Let's review with Ms. Mabrouki to prepare for the next step!",
                "success_threshold": 15,
                "expected_answers": ['Emna', 'music', 'she loves songs', 'Ryan', 'decorations', 'he is organized', 'Emna', 'music', 'Ryan', 'planning', 'he is organized', 'music', 'Emna', 'Ryan', 'creativity']
            }
        ],
        
        "A2": [
            {
                "id": "roleplay_dialogue_practice",
                "task_type": "dialogue",
                "speaker": "SKANDER",
                "instruction": "Let's practice suggesting roles for our action plan! Fill in 6 gaps in this dialogue.",
                "title": "Role-Play Dialogue Practice",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "Who's good for decorations?"},
                    {"type": "user_input", "text": "__________ should do __________ __________ she __________ art.", "blanks": ["Emna", "decorations", "because", "likes"]},
                    {"type": "character", "speaker": "SKANDER", "text": "What about Ryan?"},
                    {"type": "user_input", "text": "__________ Ryan is good __________ he is organized.", "blanks": ["I think", "because"]},
                    {"type": "character", "speaker": "SKANDER", "text": "Confirm one role."},
                    {"type": "user_input", "text": "__________ will do __________.", "blanks": ["Emna", "music"]}
                ],
                "word_bank": ["Emna", "decorations", "because", "likes", "I think", "music"],
                "expected_answers": ["Emna", "decorations", "because", "likes", "I think", "because", "Emna", "music"],
                "success_feedback": "Awesome, [Player]! Your suggestions are perfect! Ready for [Step 2: Scheduling Meetings]?",
                "remedial_feedback": "Good effort, [Player]! Let's try another task to strengthen our plan!",
                "success_threshold": 8,
                "expected_answers": ['Emna', 'decorations', 'because', 'likes', 'I think', 'because', 'Emna', 'music']
            },
            {
                "id": "sentence_expansion_challenge",
                "task_type": "fill_gaps",
                "speaker": "Emna",
                "instruction": "Let's expand our ideas for the event! Rewrite 6 short sentences to add details using 'because' or 'and.'",
                "title": "Sentence Expansion Challenge",
                "sentences": [
                    {"text": "Emna do music → Emna do music __________ she likes songs.", "blanks": ["because"]},
                    {"text": "Ryan do decorations → Ryan do decorations __________ he is organized.", "blanks": ["because"]},
                    {"text": "I suggest Emna → I suggest Emna __________ __________.", "blanks": ["for", "music"]},
                    {"text": "Ryan is good → Ryan is good __________ __________.", "blanks": ["at", "planning"]},
                    {"text": "Emna do art → Emna do art __________ __________.", "blanks": ["with", "creativity"]},
                    {"text": "Ryan help event → Ryan help event __________ __________.", "blanks": ["by", "organizing"]}
                ],
                "word_bank": ["because", "and", "for", "music", "at", "planning", "with", "creativity", "by", "organizing"],
                "expected_answers": ["because", "because", "for music", "at planning", "with creativity", "by organizing"],
                "success_feedback": "Great job, [Player]! Your sentences are ready for our plan! Ready for [Step 2: Scheduling Meetings]?",
                "remedial_feedback": "Nice try, [Player]! Let's practice more to make our plans shine!",
                "success_threshold": 10,
                "expected_answers": ['because', 'because', 'for', 'music', 'at', 'planning', 'with', 'creativity', 'by', 'organizing']
            },
            {
                "id": "cultural_role_research",
                "task_type": "cultural_research",
                "speaker": "Ryan",
                "instruction": "Let's research cultural roles for our event! Choose one role and explain its cultural importance.",
                "title": "Cultural Role Research",
                "research_prompts": [
                    {"text": "I chose __________ role because __________.", "blanks": ["music", "it's important for culture"]},
                    {"text": "__________ music helps our event because __________.", "blanks": ["Tunisian", "it shows tradition"]},
                    {"text": "This role makes our event __________ and __________.", "blanks": ["cultural", "meaningful"]}
                ],
                "word_bank": ["music", "decorations", "Tunisian", "cultural", "meaningful", "it's important for culture", "it shows tradition"],
                "hint": "Focus on cultural significance of roles.",
                "success_feedback": "Excellent research, [Player]! Your cultural understanding is ready! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "Good work! Let's try one more cultural activity!",
                "success_threshold": 6,
                "expected_answers": ['music', "it's important for culture", 'Tunisian', 'it shows tradition', 'cultural', 'meaningful']
            },
            {
                "id": "team_role_planning",
                "task_type": "team_planning",
                "speaker": "Lilia",
                "instruction": "Let's plan team roles for our cultural event! Assign roles with reasons.",
                "title": "Team Role Planning",
                "planning_template": [
                    {"text": "Emna does __________ because __________.", "blanks": ["music", "she's creative"]},
                    {"text": "Ryan does __________ because __________.", "blanks": ["decorations", "he's organized"]},
                    {"text": "Lilia does __________ to __________ the event.", "blanks": ["promotion", "advertise"]}
                ],
                "word_bank": ["music", "decorations", "promotion", "advertise", "she's creative", "he's organized"],
                "hint": "Assign roles with clear reasons.",
                "success_feedback": "Amazing planning, [Player]! Your team roles are perfect! Ready for [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "You're close! Let's review with Ms. Mabrouki!",
                "success_threshold": 6,
                "expected_answers": ['music', "she's creative", 'decorations', "he's organized", 'promotion', 'advertise']
            }
        ],
        
        "B1": [
            {
                "id": "negotiation_roleplay",
                "task_type": "dialogue",
                "speaker": "SKANDER",
                "instruction": "Let's practice negotiating roles for our action plan! Fill in 6 gaps in this dialogue to suggest and agree on roles.",
                "title": "Negotiation Role-Play",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "Who's great for decorations?"},
                    {"type": "user_input", "text": "I suggest __________ because she's __________.", "blanks": ["Emna", "creative"]},
                    {"type": "character", "speaker": "SKANDER", "text": "Ryan's organized for decorations."},
                    {"type": "user_input", "text": "__________ Ryan's skills are good __________.", "blanks": ["I agree", "too"]},
                    {"type": "character", "speaker": "SKANDER", "text": "Why Emna for music?"},
                    {"type": "user_input", "text": "__________ Emna __________ music experience.", "blanks": ["because", "has"]}
                ],
                "word_bank": ["Emna", "creative", "I agree", "too", "because", "has"],
                "expected_answers": ["Emna", "creative", "I agree", "too", "because", "has"],
                "success_feedback": "Excellent, [Player]! Your negotiation skills are ready! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "Good job, [Player]! Let's practice more to perfect our plan!",
                "success_threshold": 6,
                "expected_answers": ['Emna', 'creative', 'I agree', 'too', 'because', 'has']
            },
            {
                "id": "role_assignment_report",
                "task_type": "fill_gaps",
                "speaker": "Emna",
                "instruction": "Let's write a role assignment report! Document who does what and why. Choose the correct words for each blank.",
                "title": "Role Assignment Report",
                "sentences": [
                    {"text": "Emna is assigned __________ because __________.", "blanks": ["music", "she's creative"], "choices": [["music", "decorations", "food"], ["she's creative", "he's organized", "they're experienced"]]},
                    {"text": "Ryan handles __________ to __________ our culture.", "blanks": ["decorations", "showcase"], "choices": [["decorations", "music", "promotion"], ["showcase", "celebrate", "display"]]},
                    {"text": "These assignments will make our event __________ and __________.", "blanks": ["vibrant", "cultural"], "choices": [["vibrant", "organized", "creative"], ["cultural", "musical", "traditional"]]}
                ],
                "hint": "Include reasoning for each role assignment.",
                "success_feedback": "Great work, [Player]! Your assignment report is professional! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "Nice effort! Let's try another role activity!",
                "success_threshold": 6,
                "expected_answers": ['music', "she's creative", 'decorations', 'showcase', 'vibrant', 'cultural']
            },
            {
                "id": "cultural_role_reflection",
                "task_type": "fill_gaps",
                "speaker": "Ryan",
                "instruction": "Let's reflect on cultural roles! Explain how roles support Tunisian culture in our event. Choose the correct words for each blank.",
                "title": "Cultural Role Reflection",
                "sentences": [
                    {"text": "Music roles help our event because __________.", "blanks": ["they showcase Tunisian traditions"], "choices": [["they showcase Tunisian traditions", "they are fun", "people like music"]]},
                    {"text": "Decoration roles add __________ to our __________.", "blanks": ["culture", "celebration"], "choices": [["culture", "color", "beauty"], ["celebration", "event", "party"]]},
                    {"text": "I suggest adding __________ role to enhance __________.", "blanks": ["food", "cultural experience"], "choices": [["food", "music", "art"], ["cultural experience", "the party", "team spirit"]]}
                ],
                "hint": "Connect roles to Tunisian cultural elements.",
                "success_feedback": "Fantastic, [Player]! Your cultural reflection shines! Let's move to [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "Good work! Let's try one more cultural task!",
                "success_threshold": 5,
                "expected_answers": ['they showcase Tunisian traditions', 'culture', 'celebration', 'food', 'cultural experience']
            },
            {
                "id": "event_role_proposal",
                "task_type": "fill_gaps",
                "speaker": "Lilia",
                "instruction": "Let's create a role proposal! Propose roles and assignments for our cultural event. Choose the correct words for each blank.",
                "title": "Event Role Proposal",
                "sentences": [
                    {"text": "The event includes __________ role to make it __________.", "blanks": ["music", "vibrant"], "choices": [["music", "food", "art"], ["vibrant", "successful", "cultural"]]},
                    {"text": "We'll assign __________ to __________ our heritage.", "blanks": ["decorations", "showcase"], "choices": [["decorations", "promotion", "catering"], ["showcase", "celebrate", "honor"]]},
                    {"text": "I propose adding __________ and __________ roles to complete our team.", "blanks": ["food", "promotion"], "choices": [["food", "music", "security"], ["promotion", "photography", "logistics"]]}
                ],
                "hint": "Include multiple roles with cultural justification.",
                "success_feedback": "Amazing, [Player]! Your role proposal completes Step 1 beautifully! Ready for [Step 2: Scheduling Meetings]!",
                "remedial_feedback": "You're close! Let's review with Ms. Mabrouki!",
                "success_threshold": 6,
                "expected_answers": ['music', 'vibrant', 'decorations', 'showcase', 'food', 'promotion']
            }
        ]
    },
    
    'step_2': {
        "A1": [
            {
                "id": "schedule_matching_game",
                "task_type": "matching",
                "speaker": "SKANDER",
                "instruction": "Let's practice scheduling! Match 6 meeting details to their purposes.",
                "title": "Schedule Matching Game",
                "matching_items": {
                    "Friday 3 PM": "Best time for team to meet",
                    "music": "Plan Tunisian songs",
                    "decorations": "Plan cultural visuals",
                    "quiet time": "Good for focus",
                    "budget": "Discuss event costs",
                    "teamwork": "Work together"
                },
                "success_feedback": "Awesome, [Player]! Your schedule is ready! Let's move to [Step 3]!",
                "remedial_feedback": "Nice try! Let's practice more for our plan!",
                "success_threshold": 6,
                "expected_answers": ["Friday 3 PM", "music", "decorations", "quiet time", "budget", "teamwork"]
            },
            {
                "id": "schedule_sentence_builder",
                "task_type": "fill_gaps",
                "speaker": "Emna",
                "instruction": "Let's build sentences for our schedule! Fill in 6 gaps.",
                "title": "Schedule Sentence Builder",
                "sentences": [
                    {"text": "Meet __________ __________ __________ team is free.", "blanks": ["Friday", "3 PM", "because"]},
                    {"text": "__________ helps plan __________.", "blanks": ["Meeting", "music"]},
                    {"text": "I suggest __________ to __________ music.", "blanks": ["Friday", "discuss"]}
                ],
                "word_bank": ["Friday", "3 PM", "because", "Meeting", "music", "discuss"],
                "success_feedback": "Perfect, [Player]! Ready for [Step 3]!",
                "remedial_feedback": "Good effort! Let's try another task!",
                "success_threshold": 7,
                "expected_answers": ['Friday', '3 PM', 'because', 'Meeting', 'music', 'Friday', 'discuss']
            },
            {
                "id": "schedule_dialogue_practice",
                "task_type": "dialogue",
                "speaker": "Ryan",
                "instruction": "Let's practice scheduling dialogue! Fill in gaps to discuss meeting times.",
                "title": "Schedule Dialogue Practice",
                "dialogue": [
                    {"type": "character", "speaker": "Ryan", "text": "When should we meet?"},
                    {"type": "user_input", "text": "I suggest __________ at __________ because __________.", "blanks": ["Friday", "3 PM", "team is free"]},
                    {"type": "character", "speaker": "Ryan", "text": "What should we discuss?"},
                    {"type": "user_input", "text": "We talk about __________ and __________.", "blanks": ["music", "decorations"]},
                    {"type": "character", "speaker": "Ryan", "text": "Confirm the meeting."},
                    {"type": "user_input", "text": "Meet __________ to plan __________.", "blanks": ["Friday", "event"]}
                ],
                "word_bank": ["Friday", "3 PM", "team is free", "music", "decorations", "event"],
                "success_feedback": "Great dialogue, [Player]! Your scheduling skills are ready! Let's move to [Step 3]!",
                "remedial_feedback": "Good work! Let's try one more scheduling task!",
                "success_threshold": 7,
                "expected_answers": ['Friday', '3 PM', 'team is free', 'music', 'decorations', 'Friday', 'event']
            },
            {
                "id": "meeting_purpose_writing",
                "task_type": "fill_gaps",
                "speaker": "Lilia",
                "instruction": "Let's write about meeting purposes! Complete sentences about why we meet.",
                "title": "Meeting Purpose Writing",
                "sentences": [
                    {"text": "We meet to __________ our __________.", "blanks": ["plan", "event"]},
                    {"text": "Meeting helps __________ __________ together.", "blanks": ["team", "work"]},
                    {"text": "I suggest __________ to discuss __________.", "blanks": ["Friday", "music"]},
                    {"text": "Team will plan __________ and __________.", "blanks": ["decorations", "food"]},
                    {"text": "Meeting makes our event __________ and __________.", "blanks": ["organized", "successful"]},
                    {"text": "We schedule __________ for __________ planning.", "blanks": ["time", "cultural"]}
                ],
                "word_bank": ["plan", "event", "team", "work", "Friday", "music", "decorations", "food", "organized", "successful", "time", "cultural"],
                "success_feedback": "Excellent writing, [Player]! Your meeting purposes are clear! Ready for [Step 3]!",
                "remedial_feedback": "You're getting there! Let's review with Ms. Mabrouki!",
                "success_threshold": 12,
                "expected_answers": ['plan', 'event', 'team', 'work', 'Friday', 'music', 'decorations', 'food', 'organized', 'successful', 'time', 'cultural']
            }
        ],
        
        "A2": [
            {
                "id": "schedule_negotiation_dialogue",
                "task_type": "dialogue",
                "speaker": "SKANDER",
                "instruction": "Let's practice negotiating meeting times! Use connectors like 'because' and 'however'.",
                "title": "Schedule Negotiation Dialogue",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "I think Wednesday at 5 PM works better."},
                    {"type": "user_input", "text": "I see your point, __________ I suggest Friday __________ it's quieter.", "blanks": ["however", "because"]},
                    {"type": "character", "speaker": "SKANDER", "text": "What about the agenda?"},
                    {"type": "user_input", "text": "We should discuss __________ and __________ planning.", "blanks": ["music", "decoration"]},
                    {"type": "character", "speaker": "SKANDER", "text": "Agree on final time?"},
                    {"type": "user_input", "text": "Let's meet __________ at __________ to plan our event.", "blanks": ["Friday", "3 PM"]}
                ],
                "word_bank": ["however", "because", "music", "decoration", "Friday", "3 PM"],
                "success_feedback": "Great negotiation, [Player]! Your diplomatic skills shine! Ready for [Step 3]!",
                "remedial_feedback": "Good effort! Let's try another scheduling activity!",
                "success_threshold": 6,
                "expected_answers": ['however', 'because', 'music', 'decoration', 'Friday', '3 PM']
            },
            {
                "id": "agenda_expansion_exercise",
                "task_type": "sentence_expansion",
                "speaker": "Emna",
                "instruction": "Let's expand meeting agenda items! Add details and connectors.",
                "title": "Agenda Expansion Exercise",
                "expansion_exercises": [
                    {"text": "Discuss music → We discuss music __________ choose Tunisian songs.", "blanks": ["to"]},
                    {"text": "Plan decorations → We plan decorations __________ they show culture.", "blanks": ["because"]},
                    {"text": "Set budget → We set budget __________ buy materials.", "blanks": ["to"]},
                    {"text": "Assign tasks → We assign tasks __________ everyone has a role.", "blanks": ["so"]}
                ],
                "word_bank": ["to", "because", "so", "however"],
                "success_feedback": "Perfect expansion, [Player]! Your agenda details are thorough! Ready for [Step 3]!",
                "remedial_feedback": "Nice try! Let's keep practicing agenda planning!",
                "success_threshold": 4,
                "expected_answers": ['to', 'because', 'to', 'so']
            },
            {
                "id": "meeting_cultural_research",
                "task_type": "cultural_research",
                "speaker": "Ryan",
                "instruction": "Let's research meeting purposes for cultural events! Explain the cultural importance.",
                "title": "Meeting Cultural Research",
                "research_prompts": [
                    {"text": "Cultural meetings help because __________.", "blanks": ["they preserve traditions"]},
                    {"text": "Planning __________ events requires __________ discussion.", "blanks": ["Tunisian", "careful"]},
                    {"text": "Our meeting will ensure __________ authenticity in the event.", "blanks": ["cultural"]}
                ],
                "word_bank": ["they preserve traditions", "Tunisian", "careful", "cultural"],
                "success_feedback": "Excellent research, [Player]! Your cultural understanding is deep! Ready for [Step 3]!",
                "remedial_feedback": "Good work! Let's try one more cultural task!",
                "success_threshold": 4,
                "expected_answers": ['they preserve traditions', 'Tunisian', 'careful', 'cultural']
            },
            {
                "id": "schedule_team_coordination",
                "task_type": "team_planning",
                "speaker": "Lilia",
                "instruction": "Let's coordinate team schedules! Plan when each member is available.",
                "title": "Schedule Team Coordination",
                "planning_template": [
                    {"text": "Emna is free __________ because __________.", "blanks": ["Friday", "no classes"]},
                    {"text": "Ryan prefers __________ for __________ planning.", "blanks": ["afternoon", "detailed"]},
                    {"text": "Team meets __________ to discuss __________ and __________.", "blanks": ["Friday 3PM", "music", "decorations"]}
                ],
                "word_bank": ["Friday", "no classes", "afternoon", "detailed", "Friday 3PM", "music", "decorations"],
                "success_feedback": "Amazing coordination, [Player]! Your team scheduling is perfect! Ready for [Step 3]!",
                "remedial_feedback": "You're close! Let's review with Ms. Mabrouki!",
                "success_threshold": 7,
                "expected_answers": ['Friday', 'no classes', 'afternoon', 'detailed', 'Friday 3PM', 'music', 'decorations']
            }
        ],
        
        "B1": [
            {
                "id": "meeting_proposal_negotiation",
                "task_type": "negotiation_roleplay",
                "speaker": "SKANDER",
                "instruction": "Let's practice formal meeting proposals! Use professional language and reasoning.",
                "title": "Meeting Proposal Negotiation",
                "negotiation_dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "I propose Wednesday evening for better focus."},
                    {"type": "user_input", "text": "I appreciate your suggestion, __________ I believe Friday afternoon would __________ our objectives better.", "blanks": ["however", "serve"]},
                    {"type": "character", "speaker": "SKANDER", "text": "What makes Friday ideal?"},
                    {"type": "user_input", "text": "Friday allows __________ preparation time and __________ team availability.", "blanks": ["adequate", "optimal"]}
                ],
                "word_bank": ["however", "serve", "adequate", "optimal"],
                "success_feedback": "Excellent negotiation, [Player]! Your professional communication is outstanding! Ready for [Step 3]!",
                "remedial_feedback": "Good job! Let's practice more professional dialogue!",
                "success_threshold": 4,
                "expected_answers": ['however', 'serve', 'adequate', 'optimal']
            },
            {
                "id": "agenda_detailed_planning",
                "task_type": "assignment_report",
                "speaker": "Emna",
                "instruction": "Let's create a detailed meeting agenda! Include time allocations and objectives.",
                "title": "Agenda Detailed Planning",
                "report_template": [
                    {"text": "Meeting objective: __________ and __________ the cultural event.", "blanks": ["Plan", "organize"]},
                    {"text": "First agenda item: __________ music selection for __________ minutes.", "blanks": ["Discuss", "20"]},
                    {"text": "Second item: __________ decoration themes to __________ Tunisian culture.", "blanks": ["Review", "reflect"]}
                ],
                "word_bank": ["Plan", "organize", "Discuss", "20", "Review", "reflect"],
                "success_feedback": "Great planning, [Player]! Your agenda is comprehensive! Ready for [Step 3]!",
                "remedial_feedback": "Nice effort! Let's try another planning task!",
                "success_threshold": 6,
                "expected_answers": ['Plan', 'organize', 'Discuss', '20', 'Review', 'reflect']
            },
            {
                "id": "cultural_meeting_reflection",
                "task_type": "cultural_reflection",
                "speaker": "Ryan",
                "instruction": "Let's reflect on cultural meeting practices! Connect to Tunisian traditions.",
                "title": "Cultural Meeting Reflection",
                "reflection_prompts": [
                    {"text": "Traditional Tunisian meetings emphasize __________ and __________.", "blanks": ["respect", "collaboration"]},
                    {"text": "Our meeting will honor these values by __________ everyone's input.", "blanks": ["valuing"]},
                    {"text": "Cultural planning requires __________ and __________ consideration.", "blanks": ["thoughtful", "respectful"]}
                ],
                "word_bank": ["respect", "collaboration", "valuing", "thoughtful", "respectful"],
                "success_feedback": "Fantastic reflection, [Player]! Your cultural awareness is profound! Ready for [Step 3]!",
                "remedial_feedback": "Good work! Let's try one more cultural task!",
                "success_threshold": 5,
                "expected_answers": ['respect', 'collaboration', 'valuing', 'thoughtful', 'respectful']
            },
            {
                "id": "meeting_outcome_proposal",
                "task_type": "event_proposal",
                "speaker": "Lilia",
                "instruction": "Let's propose meeting outcomes! Design a comprehensive meeting plan.",
                "title": "Meeting Outcome Proposal",
                "proposal_framework": [
                    {"text": "Our meeting will achieve __________ by establishing clear __________.", "blanks": ["success", "objectives"]},
                    {"text": "We'll allocate __________ time for __________ and decoration planning.", "blanks": ["sufficient", "music"]},
                    {"text": "Final outcome: A __________ action plan for our __________ event.", "blanks": ["detailed", "cultural"]}
                ],
                "word_bank": ["success", "objectives", "sufficient", "music", "detailed", "cultural"],
                "success_feedback": "Amazing proposal, [Player]! Your meeting planning is masterful! Ready for [Step 3]!",
                "remedial_feedback": "You're close! Let's review with Ms. Mabrouki!",
                "success_threshold": 6,
                "expected_answers": ['success', 'objectives', 'sufficient', 'music', 'detailed', 'cultural']
            }
        ]
    },
    
    'step_3': {
        "A1": [
            {
                "id": "task_listening_matching",
                "task_type": "listening_matching",
                "speaker": "SKANDER",
                "instruction": "Listen to my detailed task plan for our cultural event!",
                "title": "Task Listening and Matching Challenge",
                "audio_content": "We need decorations with Tunisian patterns, Malouf music to highlight culture, and a poster to promote the event. Emna is good for music, Ryan for decorations, and Lilia for posters.",
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
                "success_feedback": "Wow, [Player]! Your listening and matching are perfect! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Good start, [Player]! Let's practice more listening and tasks to shine!",
                "success_threshold": 8,
                "expected_answers": ["decorations", "Tunisian patterns", "Malouf music", "poster", "Emna", "Ryan", "Lilia", "culture"]
            },
            {
                "id": "task_listening_dialogue",
                "task_type": "dialogue_completion",
                "speaker": "Emna",
                "instruction": "Listen to our task discussion!",
                "title": "Task Listening and Dialogue",
                "audio_content": "We need decorations and music for culture. Emna does music, Ryan does decorations.",
                "dialogue": [
                    {"type": "character", "speaker": "Emna", "text": "We need decorations and music."},
                    {"type": "user_input", "text": "I agree, __________ does __________ and __________ does decorations.", "blanks": ["Emna", "music", "Ryan"]},
                    {"type": "character", "speaker": "Emna", "text": "What about posters?"},
                    {"type": "user_input", "text": "__________ can do __________ for promotion.", "blanks": ["Lilia", "posters"]},
                    {"type": "character", "speaker": "Emna", "text": "Confirm the tasks."},
                    {"type": "user_input", "text": "Tasks are __________, __________, and __________.", "blanks": ["music", "decorations", "posters"]}
                ],
                "word_bank": ["Emna", "music", "Ryan", "Lilia", "posters", "decorations"],
                "success_feedback": "Perfect, [Player]! Your task dialogue is ready! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Good effort! Let's try another listening task!",
                "success_threshold": 8,
                "expected_answers": ['Emna', 'music', 'Ryan', 'Lilia', 'posters', 'music', 'decorations', 'posters']
            },
            {
                "id": "task_story_building",
                "task_type": "story_writing",
                "speaker": "Ryan",
                "instruction": "Let's tell a story about our tasks!",
                "title": "Task Story Building",
                "story_template": [
                    {"text": "Our team plans __________ with __________ patterns.", "blanks": ["decorations", "Tunisian"]},
                    {"text": "__________ picks __________ music for culture.", "blanks": ["Emna", "Malouf"]},
                    {"text": "We make __________ to promote the __________.", "blanks": ["posters", "event"]}
                ],
                "word_bank": ["decorations", "Tunisian", "Emna", "Malouf", "posters", "event"],
                "success_feedback": "Great story, [Player]! Your task story is perfect! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Nice work! Let's try one more task activity!",
                "success_threshold": 6,
                "expected_answers": ['decorations', 'Tunisian', 'Emna', 'Malouf', 'posters', 'event']
            },
            {
                "id": "task_list_writing",
                "task_type": "fill_gaps",
                "speaker": "Lilia",
                "instruction": "Let's write our task list!",
                "title": "Task List Writing",
                "sentences": [
                    {"text": "Task 1: __________ does __________ music.", "blanks": ["Emna", "Malouf"]},
                    {"text": "Task 2: __________ makes __________ with patterns.", "blanks": ["Ryan", "decorations"]},
                    {"text": "Task 3: __________ creates __________ for promotion.", "blanks": ["Lilia", "posters"]},
                    {"text": "All tasks help our __________ event.", "blanks": ["cultural"]},
                    {"text": "Tasks show __________ traditions.", "blanks": ["Tunisian"]},
                    {"text": "Our event will be __________ and __________.", "blanks": ["vibrant", "cultural"]}
                ],
                "word_bank": ["Emna", "Malouf", "Ryan", "decorations", "Lilia", "posters", "cultural", "Tunisian", "vibrant"],
                "success_feedback": "Amazing list, [Player]! Your task planning is complete! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "You're getting there! Let's review with Ms. Mabrouki!",
                "success_threshold": 10,
                "expected_answers": ['Emna', 'Malouf', 'Ryan', 'decorations', 'Lilia', 'posters', 'cultural', 'Tunisian', 'vibrant', 'cultural']
            }
        ],
        
        "A2": [
            {
                "id": "task_listening_expansion",
                "task_type": "listening_expansion",
                "speaker": "SKANDER",
                "instruction": "Listen to my task plan and expand it!",
                "title": "Task Listening and Expansion",
                "audio_content": "We need decorations, music, and posters. Add details with 'because' and 'to'.",
                "expansion_exercises": [
                    {"text": "Decorations → We need decorations __________ show Tunisian culture.", "blanks": ["to"]},
                    {"text": "Music → We pick Malouf music __________ it's traditional.", "blanks": ["because"]},
                    {"text": "Posters → We make posters __________ promote the event.", "blanks": ["to"]},
                    {"text": "Tasks → These tasks are important __________ they create atmosphere.", "blanks": ["because"]}
                ],
                "word_bank": ["to", "because"],
                "success_feedback": "Great expansion, [Player]! Your task details are thorough! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Good effort! Let's try another task activity!",
                "success_threshold": 4,
                "expected_answers": ['to', 'because', 'to', 'because']
            },
            {
                "id": "cultural_task_research",
                "task_type": "cultural_research",
                "speaker": "Emna",
                "instruction": "Let's research cultural tasks! Explain their importance.",
                "title": "Cultural Task Research",
                "research_prompts": [
                    {"text": "Malouf music is important because __________.", "blanks": ["it represents Tunisian heritage"]},
                    {"text": "Traditional decorations help because __________.", "blanks": ["they create authentic atmosphere"]},
                    {"text": "Cultural promotion ensures __________.", "blanks": ["community participation"]}
                ],
                "word_bank": ["it represents Tunisian heritage", "they create authentic atmosphere", "community participation"],
                "success_feedback": "Excellent research, [Player]! Your cultural understanding is deep! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Good work! Let's try one more cultural task!",
                "success_threshold": 3,
                "expected_answers": ['it represents Tunisian heritage', 'they create authentic atmosphere', 'community participation']
            },
            {
                "id": "task_assignment_planning",
                "task_type": "team_planning",
                "speaker": "Ryan",
                "instruction": "Let's plan task assignments! Assign tasks with reasons.",
                "title": "Task Assignment Planning",
                "planning_template": [
                    {"text": "Emna handles __________ because __________.", "blanks": ["music", "she's musical"]},
                    {"text": "Ryan manages __________ because __________.", "blanks": ["decorations", "he's artistic"]},
                    {"text": "Lilia creates __________ to __________ the event.", "blanks": ["posters", "advertise"]}
                ],
                "word_bank": ["music", "she's musical", "decorations", "he's artistic", "posters", "advertise"],
                "success_feedback": "Amazing planning, [Player]! Your task assignments are perfect! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "You're close! Let's review with Ms. Mabrouki!",
                "success_threshold": 6,
                "expected_answers": ['music', "she's musical", 'decorations', "he's artistic", 'posters', 'advertise']
            },
            {
                "id": "task_priority_setting",
                "task_type": "priority_planning",
                "speaker": "Lilia",
                "instruction": "Let's set task priorities! Order tasks by importance.",
                "title": "Task Priority Setting",
                "priority_framework": [
                    {"text": "First priority: __________ because it's the __________ of our event.", "blanks": ["music", "heart"]},
                    {"text": "Second priority: __________ to create __________ atmosphere.", "blanks": ["decorations", "visual"]},
                    {"text": "Third priority: __________ for __________ promotion.", "blanks": ["posters", "effective"]}
                ],
                "word_bank": ["music", "heart", "decorations", "visual", "posters", "effective"],
                "success_feedback": "Fantastic prioritization, [Player]! Your task planning is complete! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Good work! Let's finalize with Ms. Mabrouki!",
                "success_threshold": 6,
                "expected_answers": ['music', 'heart', 'decorations', 'visual', 'posters', 'effective']
            }
        ],
        
        "B1": [
            {
                "id": "task_negotiation_dialogue",
                "task_type": "negotiation_roleplay",
                "speaker": "SKANDER",
                "instruction": "Let's negotiate task priorities! Use professional reasoning.",
                "title": "Task Negotiation Dialogue",
                "negotiation_dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "I suggest focusing on decorations first."},
                    {"type": "user_input", "text": "I understand your perspective, __________ I believe music should be our __________ priority.", "blanks": ["however", "primary"]},
                    {"type": "character", "speaker": "SKANDER", "text": "What's your reasoning?"},
                    {"type": "user_input", "text": "Music establishes the __________ foundation and __________ all other elements.", "blanks": ["cultural", "influences"]}
                ],
                "word_bank": ["however", "primary", "cultural", "influences"],
                "success_feedback": "Excellent negotiation, [Player]! Your professional reasoning is outstanding! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Good job! Let's practice more professional dialogue!",
                "success_threshold": 4,
                "expected_answers": ['however', 'primary', 'cultural', 'influences']
            },
            {
                "id": "comprehensive_task_analysis",
                "task_type": "analysis_report",
                "speaker": "Emna",
                "instruction": "Let's analyze our tasks comprehensively! Include cultural impact.",
                "title": "Comprehensive Task Analysis",
                "analysis_template": [
                    {"text": "Music task: __________ Malouf music to __________ Tunisian traditions.", "blanks": ["Selecting", "preserve"]},
                    {"text": "Decoration task: __________ visual elements that __________ cultural identity.", "blanks": ["Creating", "represent"]},
                    {"text": "Promotion task: __________ community __________ through effective outreach.", "blanks": ["Ensuring", "engagement"]}
                ],
                "word_bank": ["Selecting", "preserve", "Creating", "represent", "Ensuring", "engagement"],
                "success_feedback": "Outstanding analysis, [Player]! Your task understanding is comprehensive! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Nice effort! Let's try another analytical task!",
                "success_threshold": 6,
                "expected_answers": ['Selecting', 'preserve', 'Creating', 'represent', 'Ensuring', 'engagement']
            },
            {
                "id": "cultural_impact_reflection",
                "task_type": "cultural_reflection",
                "speaker": "Ryan",
                "instruction": "Let's reflect on cultural impact! Connect tasks to Tunisian heritage.",
                "title": "Cultural Impact Reflection",
                "reflection_prompts": [
                    {"text": "Our tasks preserve __________ by __________ traditional elements.", "blanks": ["heritage", "incorporating"]},
                    {"text": "Cultural authenticity requires __________ attention to __________ details.", "blanks": ["careful", "historical"]},
                    {"text": "These efforts contribute to __________ and __________ awareness.", "blanks": ["cultural", "community"]}
                ],
                "word_bank": ["heritage", "incorporating", "careful", "historical", "cultural", "community"],
                "success_feedback": "Profound reflection, [Player]! Your cultural awareness is exceptional! Let's move to the [Final Writing Activity]!",
                "remedial_feedback": "Good work! Let's try one more cultural task!",
                "success_threshold": 6,
                "expected_answers": ['heritage', 'incorporating', 'careful', 'historical', 'cultural', 'community']
            },
            {
                "id": "strategic_task_proposal",
                "task_type": "strategic_proposal",
                "speaker": "Lilia",
                "instruction": "Let's create a strategic task proposal! Include implementation timeline.",
                "title": "Strategic Task Proposal",
                "proposal_framework": [
                    {"text": "Phase 1: __________ and __________ music selection within two weeks.", "blanks": ["Research", "finalize"]},
                    {"text": "Phase 2: __________ decoration themes and __________ materials.", "blanks": ["Develop", "source"]},
                    {"text": "Phase 3: __________ promotional campaign and __________ community outreach.", "blanks": ["Launch", "coordinate"]}
                ],
                "word_bank": ["Research", "finalize", "Develop", "source", "Launch", "coordinate"],
                "success_feedback": "Exceptional strategy, [Player]! Your task proposal is masterful! Ready for the [Final Writing Activity]!",
                "remedial_feedback": "You're close! Let's review with Ms. Mabrouki!",
                "success_threshold": 6,
                "expected_answers": ['Research', 'finalize', 'Develop', 'source', 'Launch', 'coordinate']
            }
        ]
    },
    
    'final_writing': {
        "A1": [
            {
                "id": "plan_listening_matching_challenge",
                "task_type": "listening_matching",
                "speaker": "SKANDER",
                "instruction": "Listen to my detailed action plan!",
                "title": "Plan Listening and Matching Challenge",
                "audio_content": "Emna handles Malouf music to make the event vibrant. Ryan designs decorations with Tunisian tiles. We meet Friday at 3 PM to plan. Lilia makes posters for promotion.",
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
                "hint": "Listen for roles, tasks, and schedule.",
                "success_feedback": "Awesome, [Player]! Your listening and matching are perfect! You've completed Phase 2!",
                "remedial_feedback": "Nice try! Let's practice more listening and planning!",
                "success_threshold": 8,
                "expected_answers": ["Emna", "Malouf music", "Ryan", "Tunisian tiles", "Friday 3 PM", "Lilia", "posters", "culture"]
            },
            {
                "id": "plan_listening_dialogue_completion",
                "task_type": "dialogue_completion",
                "speaker": "Emna",
                "instruction": "Listen to our plan discussion!",
                "title": "Plan Listening and Dialogue Completion",
                "audio_content": "Emna handles Malouf music because it's traditional. Ryan designs decorations with Tunisian tiles. We meet Friday at 3 PM. What's your idea?",
                "dialogue": [
                    {"type": "character", "speaker": "Emna", "text": "Emna handles Malouf music because it's traditional."},
                    {"type": "user_input", "text": "I agree, __________ should __________ __________ because __________.", "blanks": ["Emna", "handle", "music", "it's traditional"]},
                    {"type": "character", "speaker": "Emna", "text": "What about decorations?"},
                    {"type": "user_input", "text": "__________ designs __________ to __________ because __________.", "blanks": ["Ryan", "decorations", "show culture", "they're beautiful"]},
                    {"type": "character", "speaker": "Emna", "text": "Confirm one role."},
                    {"type": "user_input", "text": "__________ __________ do __________.", "blanks": ["Emna", "will", "music"]}
                ],
                "word_bank": ["Emna", "Ryan", "decorations", "music", "handle", "will", "show culture", "it's traditional", "they're beautiful"],
                "hint": "Respond to Emna's plan and suggest tasks.",
                "success_feedback": "Perfect, [Player]! Your listening and dialogue are ready! You've completed Phase 2!",
                "remedial_feedback": "Good effort! Let's try another listening task!",
                "success_threshold": 11,
                "expected_answers": ['Emna', 'handle', 'music', "it's traditional", 'Ryan', 'decorations', 'show culture', "they're beautiful", 'Emna', 'will', 'music']
            },
            {
                "id": "plan_listening_story_writing",
                "task_type": "story_writing",
                "speaker": "Ryan",
                "instruction": "Listen to my plan story!",
                "title": "Plan Listening and Story Writing",
                "audio_content": "Our team plans Malouf music with Emna to make the event vibrant. Ryan uses Tunisian tiles for decorations to show culture. We meet Friday at 3 PM to plan.",
                "story_template": [
                    {"text": "The team plans __________ with __________ to __________ because __________.", "blanks": ["Malouf music", "Emna", "make vibrant", "it's traditional"]},
                    {"text": "__________ uses __________ to __________ because __________.", "blanks": ["Ryan", "Tunisian tiles", "show culture", "they're beautiful"]},
                    {"text": "We meet __________ to plan __________.", "blanks": ["Friday at 3 PM", "decorations"]}
                ],
                "word_bank": ["Malouf music", "Emna", "Ryan", "Tunisian tiles", "make vibrant", "show culture", "Friday at 3 PM", "decorations", "it's traditional", "they're beautiful"],
                "hint": "Use Ryan's plan and add two tasks.",
                "success_feedback": "Great job, [Player]! Your listening and story are perfect! You've completed Phase 2!",
                "remedial_feedback": "Nice work! Let's try one more listening task!",
                "success_threshold": 10,
                "expected_answers": ['Malouf music', 'Emna', 'make vibrant', "it's traditional", 'Ryan', 'Tunisian tiles', 'show culture', "they're beautiful", 'Friday at 3 PM', 'decorations']
            },
            {
                "id": "plan_listening_proposal_writing",
                "task_type": "proposal_writing",
                "speaker": "Lilia",
                "instruction": "Listen to my plan proposal!",
                "title": "Plan Listening and Proposal Writing",
                "audio_content": "I propose posters with Tunisian colors to promote the event, Malouf music for tradition, and decorations with Tunisian tiles.",
                "proposal_template": [
                    {"text": "I propose __________ with __________ to __________ because __________.", "blanks": ["posters", "Tunisian colors", "promote event", "they attract guests"]},
                    {"text": "I also suggest __________ to __________ because __________.", "blanks": ["Malouf music", "reflect tradition", "it's cultural"]},
                    {"text": "__________ is assigned __________ because __________.", "blanks": ["Emna", "music", "she's creative"]}
                ],
                "word_bank": ["posters", "Tunisian colors", "promote event", "Malouf music", "reflect tradition", "Emna", "music", "they attract guests", "it's cultural", "she's creative"],
                "hint": "Include Lilia's poster task and add two tasks with assignments.",
                "success_feedback": "Amazing, [Player]! Your listening and proposal are complete! You've finished Phase 2!",
                "remedial_feedback": "You're close! Let's review with Ms. Mabrouki!",
                "success_threshold": 10,
                "expected_answers": ['posters', 'Tunisian colors', 'promote event', 'they attract guests', 'Malouf music', 'reflect tradition', "it's cultural", 'Emna', 'music', "she's creative"]
            }
        ],
        
        "A2": [
            {
                "id": "plan_listening_roleplay_dialogue",
                "task_type": "roleplay_dialogue",
                "speaker": "SKANDER",
                "instruction": "Listen to my plan role-play!",
                "title": "Plan Listening and Role-Play Dialogue",
                "audio_content": "Let's assign Malouf music to Emna and decorations with Tunisian tiles to Ryan. What's your idea?",
                "dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "Let's assign Malouf music to Emna."},
                    {"type": "user_input", "text": "I agree, Emna should __________ Malouf music because __________.", "blanks": ["pick", "it's vibrant"]},
                    {"type": "character", "speaker": "SKANDER", "text": "What about decorations?"},
                    {"type": "user_input", "text": "Ryan should __________ decorations with __________ because __________.", "blanks": ["design", "Tunisian tiles", "they show culture"]},
                    {"type": "character", "speaker": "SKANDER", "text": "Any other suggestions?"},
                    {"type": "user_input", "text": "Maybe __________ can help with __________ too.", "blanks": ["Lilia", "posters"]}
                ],
                "word_bank": ["pick", "design", "Lilia", "posters", "it's vibrant", "Tunisian tiles", "they show culture"],
                "hint": "Use connectors like 'because' for reasoning.",
                "success_feedback": "Great, [Player]! Your listening and dialogue are ready! You've completed Phase 2!",
                "remedial_feedback": "Good effort! Let's try another listening task!",
                "success_threshold": 7,
                "expected_answers": ['pick', "it's vibrant", 'design', 'Tunisian tiles', 'they show culture', 'Lilia', 'posters']
            },
            {
                "id": "plan_listening_sentence_expansion",
                "task_type": "sentence_expansion",
                "speaker": "Emna",
                "instruction": "Listen and expand my plan!",
                "title": "Plan Listening and Sentence Expansion",
                "audio_content": "Malouf music is vibrant, decorations with Tunisian tiles are cultural.",
                "expansion_exercises": [
                    {"text": "Malouf music is vibrant → Emna picks Malouf music __________ it's vibrant.", "blanks": ["because"]},
                    {"text": "Decorations are cultural → Ryan designs decorations __________ Tunisian tiles __________ show culture.", "blanks": ["with", "to"]},
                    {"text": "Event needs promotion → Lilia creates __________ __________ promote the event.", "blanks": ["posters", "to"]}
                ],
                "word_bank": ["because", "with", "to", "posters"],
                "hint": "Add connectors and cultural details.",
                "success_feedback": "Perfect, [Player]! Your listening and sentences shine! You've completed Phase 2!",
                "remedial_feedback": "Nice try! Let's keep practicing listening!",
                "success_threshold": 5,
                "expected_answers": ['because', 'with', 'to', 'posters', 'to']
            },
            {
                "id": "plan_listening_cultural_research",
                "task_type": "cultural_research",
                "speaker": "Ryan",
                "instruction": "Listen and research a plan element!",
                "title": "Plan Listening and Cultural Research",
                "audio_content": "We need Malouf music and Tunisian tiles. Research a cultural element.",
                "research_prompts": [
                    {"text": "I chose __________ because __________.", "blanks": ["Malouf music", "it's vibrant"]},
                    {"text": "__________ tiles are important because __________.", "blanks": ["Tunisian", "they show tradition"]},
                    {"text": "These elements make our event __________ and __________.", "blanks": ["cultural", "exciting"]}
                ],
                "word_bank": ["Malouf music", "Tunisian", "cultural", "exciting", "it's vibrant", "they show tradition"],
                "hint": "Focus on cultural significance.",
                "success_feedback": "Great job, [Player]! Your listening and research are ready! You've completed Phase 2!",
                "remedial_feedback": "Good work! Let's try one more listening task!",
                "success_threshold": 6,
                "expected_answers": ['Malouf music', "it's vibrant", 'Tunisian', 'they show tradition', 'cultural', 'exciting']
            },
            {
                "id": "plan_listening_team_plan",
                "task_type": "team_planning",
                "speaker": "Lilia",
                "instruction": "Listen to my team plan!",
                "title": "Plan Listening and Team Plan",
                "audio_content": "Emna does Malouf music, Ryan does Tunisian tiles, Lilia does posters.",
                "planning_template": [
                    {"text": "Emna does __________ because __________.", "blanks": ["Malouf music", "it's vibrant"]},
                    {"text": "Ryan does __________ because __________.", "blanks": ["Tunisian tiles", "they show culture"]},
                    {"text": "Lilia does __________ to __________ the event.", "blanks": ["posters", "promote"]}
                ],
                "word_bank": ["Malouf music", "Tunisian tiles", "posters", "promote", "it's vibrant", "they show culture"],
                "hint": "Assign tasks with cultural reasons.",
                "success_feedback": "Amazing, [Player]! Your listening and plan are complete! You've finished Phase 2!",
                "remedial_feedback": "You're close! Let's review with Ms. Mabrouki!",
                "success_threshold": 6,
                "expected_answers": ['Malouf music', "it's vibrant", 'Tunisian tiles', 'they show culture', 'posters', 'promote']
            }
        ],
        "B1": [
            {
                "id": "plan_listening_negotiation_roleplay",
                "task_type": "negotiation_roleplay",
                "speaker": "SKANDER",
                "instruction": "Listen to my plan negotiation!",
                "title": "Plan Listening and Negotiation Role-Play",
                "audio_content": "I suggest Malouf music and Tunisian tiles for decorations.",
                "negotiation_dialogue": [
                    {"type": "character", "speaker": "SKANDER", "text": "I suggest Malouf music for the event."},
                    {"type": "user_input", "text": "I see your point, I suggest Malouf music because __________.", "blanks": ["it's vibrant"]},
                    {"type": "character", "speaker": "SKANDER", "text": "What about Tunisian tiles?"},
                    {"type": "user_input", "text": "I agree, __________ tiles would __________ our cultural theme.", "blanks": ["Tunisian", "enhance"]}
                ],
                "word_bank": ["it's vibrant", "Tunisian", "enhance"],
                "hint": "Use polite phrases and cultural reasoning.",
                "success_feedback": "Excellent, [Player]! Your listening and negotiation are perfect! You've completed Phase 2!",
                "remedial_feedback": "Good job! Let's practice more listening!",
                "success_threshold": 3,
                "expected_answers": ["it's vibrant", 'Tunisian', 'enhance']
            },
            {
                "id": "plan_listening_assignment_report",
                "task_type": "assignment_report",
                "speaker": "Emna",
                "instruction": "Listen to my assignments!",
                "title": "Plan Listening and Assignment Report",
                "audio_content": "Emna does Malouf music, Ryan does Tunisian tiles.",
                "report_template": [
                    {"text": "Emna is assigned __________ because __________.", "blanks": ["Malouf music", "it's traditional"]},
                    {"text": "Ryan handles __________ to __________ our culture.", "blanks": ["Tunisian tiles", "showcase"]},
                    {"text": "These assignments will make our event __________ and __________.", "blanks": ["vibrant", "cultural"]}
                ],
                "word_bank": ["Malouf music", "Tunisian tiles", "showcase", "vibrant", "cultural", "it's traditional"],
                "hint": "Include cultural reasoning.",
                "success_feedback": "Great work, [Player]! Your listening and assignments are ready! You've completed Phase 2!",
                "remedial_feedback": "Nice effort! Let's try another listening task!",
                "success_threshold": 6,
                "expected_answers": ['Malouf music', "it's traditional", 'Tunisian tiles', 'showcase', 'vibrant', 'cultural']
            },
            {
                "id": "plan_listening_cultural_reflection",
                "task_type": "cultural_reflection",
                "speaker": "Ryan",
                "instruction": "Listen to my plan reflection!",
                "title": "Plan Listening and Cultural Reflection",
                "audio_content": "Malouf music and Tunisian tiles make the event cultural.",
                "reflection_prompts": [
                    {"text": "Malouf music makes the event __________ because __________.", "blanks": ["vibrant", "it's traditional"]},
                    {"text": "Tunisian tiles add __________ to our __________.", "blanks": ["culture", "decorations"]},
                    {"text": "I suggest adding __________ to enhance __________.", "blanks": ["posters", "promotion"]}
                ],
                "word_bank": ["vibrant", "culture", "decorations", "posters", "promotion", "it's traditional"],
                "hint": "Add one new task with cultural ties.",
                "success_feedback": "Fantastic, [Player]! Your listening and reflections shine! You've completed Phase 2!",
                "remedial_feedback": "Good work! Let's try one more listening task!",
                "success_threshold": 6,
                "expected_answers": ['vibrant', "it's traditional", 'culture', 'decorations', 'posters', 'promotion']
            },
            {
                "id": "plan_listening_event_proposal",
                "task_type": "event_proposal",
                "speaker": "Lilia",
                "instruction": "Listen to my event proposal!",
                "title": "Plan Listening and Event Proposal",
                "audio_content": "We need Malouf music, Tunisian tiles, and posters for culture.",
                "proposal_framework": [
                    {"text": "The event includes __________ to make it __________.", "blanks": ["Malouf music", "vibrant"]},
                    {"text": "We'll use __________ to __________ our heritage.", "blanks": ["Tunisian tiles", "showcase"]},
                    {"text": "I propose adding __________ and __________ to complete our plan.", "blanks": ["food", "lighting"]}
                ],
                "word_bank": ["Malouf music", "vibrant", "Tunisian tiles", "showcase", "food", "lighting"],
                "hint": "Include two new tasks and assignments.",
                "success_feedback": "Amazing, [Player]! Your listening and proposal complete Phase 2!",
                "remedial_feedback": "You're close! Let's review with Ms. Mabrouki!",
                "success_threshold": 6,
                "expected_answers": ['Malouf music', 'vibrant', 'Tunisian tiles', 'showcase', 'food', 'lighting']
            }
        ]
    }
}

# Points and progression
PHASE_2_POINTS = {"A1": 1, "A2": 2, "B1": 3, "B2": 4}
PHASE_2_SUCCESS_THRESHOLD = 20