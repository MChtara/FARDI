"""
Assessment Service for evaluating CEFR language levels and analyzing responses
"""
import json
import logging
from difflib import SequenceMatcher
from services.ai_service import AIService
from models.game_data import DIALOGUE_QUESTIONS

logger = logging.getLogger(__name__)

class AssessmentService:
    def __init__(self):
        self.ai_service = AIService()

    def assess_response(self, question, answer, question_type=None):
        """Use Groq or local model to assess the CEFR level of a response"""
        try:
            # Special handling for listening questions
            if question_type == "listening":
                # Get the expected sentence from DIALOGUE_QUESTIONS
                expected_sentence = ""
                for q in DIALOGUE_QUESTIONS:
                    if q["type"] == "listening":
                        expected_sentence = q.get("expected_sentence", "We could have a dance show or a food tasting.")
                        break

                # Use specialized assessment for listening
                return self.assess_listening_response(expected_sentence, answer)

            # Get detailed prompt with example responses and criteria
            prompt = self._get_level_assessment_prompt(question, answer, question_type)

            logger.info(f"Sending prompt to Groq for assessment: {prompt[:100]}...")

            # Call Groq API for assessment
            if self.ai_service.client:
                response = self.ai_service.client.chat.completions.create(
                    model=self.ai_service.model,
                    messages=[
                        {"role": "system", "content": "You are an expert language assessor specializing in CEFR levels."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=self.ai_service.max_tokens,
                    temperature=0.3  # Lower temperature for more consistent assessments
                )

                result = response.choices[0].message.content
                logger.info(f"Groq response received, length: {len(result)}")

                # Parse the JSON response
                try:
                    assessment = json.loads(result)

                    # Extract what we need and ensure all fields exist
                    clean_assessment = {
                        "level": assessment.get("level", "B1"),
                        "justification": assessment.get("justification", "No justification provided"),
                        "vocabulary_assessment": assessment.get("vocabulary_assessment", ""),
                        "grammar_assessment": assessment.get("grammar_assessment", ""),
                        "spelling_assessment": assessment.get("spelling_assessment", ""),
                        "comprehension_assessment": assessment.get("comprehension_assessment", ""),
                        "fluency_assessment": assessment.get("fluency_assessment", ""),
                        "specific_strengths": assessment.get("specific_strengths", []),
                        "specific_areas_for_improvement": assessment.get("specific_areas_for_improvement", []),
                        "tips_for_improvement": assessment.get("tips_for_improvement", "")
                    }
                    return clean_assessment

                except json.JSONDecodeError:
                    logger.error(f"Failed to parse JSON from Groq response: {result}")
                    # Use fallback assessment method
                    return self._fallback_assessment(answer)
            else:
                # Use fallback assessment method
                return self._fallback_assessment(answer)

        except Exception as e:
            logger.error(f"Error assessing response with Groq: {str(e)}")
            # Use fallback assessment method
            return self._fallback_assessment(answer)

    def assess_listening_response(self, expected_sentence, user_response):
        """
        Compare a user's listening response to the expected sentence and determine accuracy level
        """
        # Clean up responses for comparison (lowercase, remove extra whitespace)
        expected_clean = " ".join(expected_sentence.lower().split())
        user_clean = " ".join(user_response.lower().split())
        
        # Calculate similarity ratio
        similarity = SequenceMatcher(None, expected_clean, user_clean).ratio()
        
        # Count words from original sentence that appear in response
        expected_words = set(expected_clean.split())
        user_words = set(user_clean.split())
        matching_words = expected_words.intersection(user_words)
        word_match_ratio = len(matching_words) / len(expected_words) if expected_words else 0
        
        # Determine CEFR level based on accuracy
        if similarity >= 0.9:  # Near perfect reproduction
            level = "C1"
            justification = "The response almost perfectly reproduces the original sentence."
        elif similarity >= 0.75:  # Good reproduction with minor variations
            level = "B2"
            justification = "The response accurately captures the original sentence with only minor variations."
        elif similarity >= 0.5 or word_match_ratio >= 0.6:  # Captures essence with some errors
            level = "B1"
            justification = "The response captures the main idea and most key words, but has notable differences."
        elif similarity >= 0.3 or word_match_ratio >= 0.3:  # Gets main idea but misses details
            level = "A2"
            justification = "The response captures some key words but misses significant details."
        else:  # Minimal comprehension
            level = "A1"
            justification = "The response shows minimal comprehension of the original sentence."
        
        # Detailed assessments
        vocabulary_assessment = "Unable to assess vocabulary as the response is too short." if len(user_response) < 5 else \
                               "Basic vocabulary usage is evident in the response." if level in ["A1", "A2"] else \
                               "Good vocabulary usage is evident in the response." if level == "B1" else \
                               "Strong vocabulary usage is evident in the response."
        
        grammar_assessment = "Unable to assess grammar as the response is too short." if len(user_response) < 5 else \
                            "Basic grammatical structures are present." if level in ["A1", "A2"] else \
                            "Good grammatical control is evident." if level == "B1" else \
                            "Strong grammatical control is demonstrated."
        
        comprehension_assessment = f"Similarity score: {similarity:.2f}. Captured {len(matching_words)}/{len(expected_words)} key words."
        
        fluency_assessment = "Unable to assess fluency as the response is too short." if len(user_response) < 5 else \
                            "Limited fluency is demonstrated." if level in ["A1", "A2"] else \
                            "Good fluency is demonstrated." if level == "B1" else \
                            "Excellent fluency is demonstrated."
        
        spelling_assessment = "Unable to assess spelling as the response is too short." if len(user_response) < 5 else \
                             "Basic spelling skills are demonstrated." if level in ["A1", "A2"] else \
                             "Good spelling accuracy is evident." if level == "B1" else \
                             "Excellent spelling accuracy is demonstrated."
        
        # Prepare assessment object
        assessment = {
            "level": level,
            "justification": justification,
            "vocabulary_assessment": vocabulary_assessment,
            "grammar_assessment": grammar_assessment,
            "spelling_assessment": spelling_assessment,
            "comprehension_assessment": comprehension_assessment,
            "fluency_assessment": fluency_assessment,
            "specific_strengths": [],
            "specific_areas_for_improvement": [],
            "tips_for_improvement": "Practice active listening and repeating phrases exactly as heard."
        }
        
        # Add specific strengths
        if similarity >= 0.9:
            assessment["specific_strengths"].append("Excellent recall of the complete sentence")
        elif word_match_ratio >= 0.7:
            assessment["specific_strengths"].append("Good recall of key vocabulary")
        elif len(user_response) > 0:
            assessment["specific_strengths"].append("Attempted to provide a response")
        
        # Add areas for improvement
        missing_words = expected_words - user_words
        if missing_words:
            assessment["specific_areas_for_improvement"].append(
                f"Did not include these key words: {', '.join(list(missing_words)[:3])}")
        if len(user_response) < 5:
            assessment["specific_areas_for_improvement"].append("Response is too short to demonstrate listening comprehension")
        
        # More specific tips based on performance
        if similarity < 0.5:
            assessment["tips_for_improvement"] = "Try repeating sentences immediately after hearing them to improve recall. Focus on remembering both the beginning and end of sentences."
        
        return assessment

    def check_ai_response(self, text):
        """Check if response is AI-generated using the AI service"""
        return self.ai_service.check_with_sapling_api(text)

    def _get_keyword_analysis(self, text):
        """Analyze keywords in text to help determine vocabulary level"""
        # Advanced vocabulary (C1-B2)
        advanced_words = ['magnificent', 'sophisticated', 'extraordinary', 'consequently', 'nevertheless',
                          'furthermore', 'cordially', 'promptly', 'assess', 'vibrant', 'heritage',
                          'interactive', 'unforgettable', 'proposal', 'initiative', 'perspective']

        # Intermediate vocabulary (B1-B2)
        intermediate_words = ['suggest', 'celebrate', 'experience', 'traditional', 'important',
                              'specific', 'participate', 'inform', 'organization', 'coordination',
                              'immediately', 'effective', 'communication', 'collaboration', 'teamwork']

        # Basic vocabulary (A1-A2)
        basic_words = ['nice', 'good', 'bad', 'like', 'want', 'tell', 'see', 'food', 'help',
                       'work', 'talk', 'party', 'join', 'event', 'come', 'go', 'make', 'do']

        # Count occurrences
        text_lower = text.lower()
        advanced_count = sum(1 for word in advanced_words if word in text_lower)
        intermediate_count = sum(1 for word in intermediate_words if word in text_lower)
        basic_count = sum(1 for word in basic_words if word in text_lower)

        return {
            "advanced_count": advanced_count,
            "intermediate_count": intermediate_count,
            "basic_count": basic_count
        }

    def _get_grammar_analysis(self, text):
        """Analyze grammatical structures in text to help determine grammar level"""
        # Check for conditional structures (B2-C1)
        conditional_patterns = ['would', 'could', 'might', 'if i were', 'should']
        has_conditionals = any(pattern in text.lower() for pattern in conditional_patterns)

        # Check for complex sentences (B1-C1)
        complex_connectors = ['although', 'however', 'therefore', 'nevertheless', 'consequently',
                              'furthermore', 'moreover', 'meanwhile', 'whereas', 'despite']
        has_complex_sentences = any(connector in text.lower() for connector in complex_connectors)

        # Check for basic sentence structure (A1-A2)
        sentence_count = text.count('.') + text.count('!') + text.count('?')
        word_count = len(text.split())
        average_sentence_length = word_count / max(1, sentence_count)

        return {
            "has_conditionals": has_conditionals,
            "has_complex_sentences": has_complex_sentences,
            "average_sentence_length": average_sentence_length,
            "word_count": word_count
        }

    def _get_level_assessment_prompt(self, question, answer, question_type=None):
        """Create a detailed prompt for the AI to assess the CEFR level of a response"""
        # Get the example responses for this question type if available
        example_responses = {}
        if question_type:
            for q in DIALOGUE_QUESTIONS:
                if q["type"] == question_type and "example_responses" in q:
                    example_responses = q["example_responses"]
                    break

        # Generate examples section if we have examples
        examples_section = ""
        if example_responses:
            examples_section = "Here are some example responses at different CEFR levels for this type of question:\n\n"
            for level, example in example_responses.items():
                examples_section += f"{level}: \"{example}\"\n"

        # Get assessment criteria for this question type
        assessment_criteria_section = ""
        if question_type:
            for q in DIALOGUE_QUESTIONS:
                if q["type"] == question_type and "assessment_criteria" in q:
                    criteria = q["assessment_criteria"]
                    assessment_criteria_section = "Assessment criteria for this question type:\n\n"
                    for criterion, weight in criteria.items():
                        assessment_criteria_section += f"- {criterion.replace('_', ' ').title()}: {weight*100}% of the assessment\n"
                    break

        # Perform preliminary analysis to help guide the AI for non-listening questions
        keyword_analysis = self._get_keyword_analysis(answer)
        grammar_analysis = self._get_grammar_analysis(answer)

        analysis_section = f"""
        Preliminary analysis:
        - Word count: {grammar_analysis['word_count']}
        - Average sentence length: {grammar_analysis['average_sentence_length']:.1f} words
        - Advanced vocabulary words: {keyword_analysis['advanced_count']}
        - Intermediate vocabulary words: {keyword_analysis['intermediate_count']}
        - Basic vocabulary words: {keyword_analysis['basic_count']}
        - Uses conditional structures: {'Yes' if grammar_analysis['has_conditionals'] else 'No'}
        - Uses complex sentence connectors: {'Yes' if grammar_analysis['has_complex_sentences'] else 'No'}
        """

        # Multilingual instructions
        multilingual_instructions = """
        IMPORTANT - MULTILINGUAL ASSESSMENT:
        
        Students may use words from other languages in their responses (such as French, Arabic, etc.). 
        This is NOT an error, but demonstrates linguistic awareness and should be viewed positively.
        
        When you encounter non-English words:
        1. Recognize them as intentional vocabulary from another language
        2. Use your multilingual knowledge to understand their meaning
        3. Consider this as a positive aspect in the assessment
        4. ALWAYS RESPOND IN ENGLISH ONLY, regardless of what language the student used
        
        Consider this code-switching as a demonstration of cultural and linguistic awareness.
        """

        # Professional English instructions
        professional_english_instructions = """
        PROFESSIONAL ENGLISH ASSESSMENT CRITERIA:

        Pay special attention to:

        1. CAPITALIZATION:
        - "I" must always be capitalized (not "i")
        - Proper nouns should be capitalized
        - Beginning of sentences should be capitalized
        
        2. CONTRACTIONS AND FORMALITY:
        - A1-A2: Contractions (I'm, don't, can't) are acceptable
        - B1: Should show awareness of when to use contractions vs. full forms
        - B2-C1: Should use appropriate formality level - avoid contractions in formal contexts, use full forms

        These elements are indicators of language maturity and professionalism.
        """

        return f"""
        You are an expert language assessor specializing in CEFR levels.
        
        Analyze the following response and determine the CEFR level (A1, A2, B1, B2, or C1).
        
        Question: "{question}"
        Response: "{answer}"
        
        {assessment_criteria_section}
        {examples_section}
        {analysis_section}
        {multilingual_instructions}
        {professional_english_instructions}

        Assess using these criteria:
        1. VOCABULARY RANGE: Complexity and variety of vocabulary
        2. GRAMMAR AND SYNTAX: Sentence structure, tense usage, grammatical accuracy
        3. SPELLING ACCURACY: Accuracy of spelling throughout the response
        4. PROFESSIONAL ENGLISH STANDARDS: Capitalization, contractions, formality
        5. COMPREHENSION AND RELEVANCE: How well the response addresses the question
        6. FLUENCY AND DETAIL: Coherence, elaboration, and natural flow

        Format as JSON:
        {{
            "level": "A1/A2/B1/B2/C1",
            "justification": "Your explanation",
            "vocabulary_assessment": "Analysis with examples",
            "grammar_assessment": "Analysis with examples",
            "spelling_assessment": "Analysis with examples",
            "professional_english_assessment": "Analysis of formality and standards",
            "comprehension_assessment": "Analysis of understanding",
            "fluency_assessment": "Analysis of coherence",
            "specific_strengths": ["Strength 1", "Strength 2"],
            "specific_areas_for_improvement": ["Area 1", "Area 2"],
            "tips_for_improvement": "Concrete suggestions"
        }}
        
        Do not include any text outside of the JSON object.
        """

    def _fallback_assessment(self, answer):
        """Fallback method when Groq API is unavailable"""
        keyword_analysis = self._get_keyword_analysis(answer)
        grammar_analysis = self._get_grammar_analysis(answer)

        # Simple rule-based assessment
        level = "B1"  # Default
        word_count = grammar_analysis['word_count']

        if word_count < 10:
            level = "A1"
        elif word_count < 20:
            level = "A2"
        elif word_count > 50 and grammar_analysis['has_complex_sentences']:
            level = "B2"
        elif word_count > 70 and grammar_analysis['has_conditionals'] and keyword_analysis['advanced_count'] > 2:
            level = "C1"

        # Basic spelling assessment based on level
        spelling_assessment = {
            "A1": "Spelling expected to be basic with frequent errors.",
            "A2": "Spelling expected to be reasonably accurate for simple words.",
            "B1": "Spelling expected to be mostly accurate with some errors.",
            "B2": "Spelling expected to be generally accurate.",
            "C1": "Spelling expected to be consistently accurate."
        }.get(level, "Unable to assess spelling.")

        return {
            "level": level,
            "justification": f"Assessment based on word count: {word_count}, advanced terms: {keyword_analysis['advanced_count']}, complex structures: {'yes' if grammar_analysis['has_complex_sentences'] else 'no'}",
            "vocabulary_assessment": f"Basic: {keyword_analysis['basic_count']}, Intermediate: {keyword_analysis['intermediate_count']}, Advanced: {keyword_analysis['advanced_count']}",
            "grammar_assessment": f"Average sentence length: {grammar_analysis['average_sentence_length']:.1f}",
            "spelling_assessment": spelling_assessment,
            "comprehension_assessment": "Unable to determine comprehension without context",
            "fluency_assessment": f"Text length suggests {'limited' if word_count < 20 else 'reasonable' if word_count < 50 else 'good'} fluency",
            "specific_strengths": ["Attempts to communicate effectively", "Uses vocabulary appropriately for level"],
            "specific_areas_for_improvement": [],
            "tips_for_improvement": "Continue practicing with more complex sentences and vocabulary"
        }