"""
Exercise Builder Data Models
Dynamic exercise creation and workflow management system
"""

from datetime import datetime
import json
import uuid

class ExerciseTypeTemplate:
    """Template for different exercise types"""
    
    # Available exercise type templates
    EXERCISE_TYPES = {
        'storytelling': {
            'name': 'Storytelling Task',
            'description': 'Students write short stories or narratives',
            'parameters': {
                'min_words': {'type': 'number', 'default': 50, 'description': 'Minimum word count'},
                'max_words': {'type': 'number', 'default': 200, 'description': 'Maximum word count'},
                'prompt_text': {'type': 'text', 'required': True, 'description': 'Story prompt'},
                'cultural_context': {'type': 'text', 'description': 'Cultural context for the story'},
                'time_limit': {'type': 'number', 'default': 300, 'description': 'Time limit in seconds'}
            },
            'assessment_criteria': ['grammar', 'vocabulary', 'creativity', 'cultural_relevance'],
            'component': 'StorytellingComponent'
        },
        
        'role_suggestion': {
            'name': 'Role Suggestion Task',
            'description': 'Students suggest roles for team members',
            'parameters': {
                'scenario': {'type': 'text', 'required': True, 'description': 'Role assignment scenario'},
                'available_roles': {'type': 'list', 'required': True, 'description': 'List of available roles'},
                'team_members': {'type': 'list', 'required': True, 'description': 'Team member names'},
                'reasoning_required': {'type': 'boolean', 'default': True, 'description': 'Require reasoning for suggestions'}
            },
            'assessment_criteria': ['logic', 'communication', 'teamwork_understanding'],
            'component': 'RoleSuggestionComponent'
        },
        
        'matching_game': {
            'name': 'Drag & Drop Matching',
            'description': 'Match items to their descriptions',
            'parameters': {
                'items': {'type': 'object', 'required': True, 'description': 'Items to match'},
                'randomize_items': {'type': 'boolean', 'default': True, 'description': 'Randomize item order'},
                'allow_multiple_attempts': {'type': 'boolean', 'default': True, 'description': 'Allow retrying'},
                'success_threshold': {'type': 'number', 'default': 80, 'description': 'Percentage needed to pass'}
            },
            'assessment_criteria': ['accuracy', 'comprehension'],
            'component': 'MatchingGameComponent'
        },
        
        'fill_gaps': {
            'name': 'Fill in the Blanks',
            'description': 'Complete sentences with missing words',
            'parameters': {
                'sentences': {'type': 'list', 'required': True, 'description': 'Sentences with blanks'},
                'word_bank': {'type': 'list', 'description': 'Available words (optional)'},
                'case_sensitive': {'type': 'boolean', 'default': False, 'description': 'Case sensitive answers'},
                'partial_credit': {'type': 'boolean', 'default': True, 'description': 'Allow partial scoring'}
            },
            'assessment_criteria': ['grammar', 'vocabulary', 'comprehension'],
            'component': 'FillGapsComponent'
        },
        
        'dialogue_practice': {
            'name': 'Dialogue Practice',
            'description': 'Interactive conversation practice',
            'parameters': {
                'dialogue_lines': {'type': 'list', 'required': True, 'description': 'Dialogue structure'},
                'response_options': {'type': 'object', 'description': 'Multiple choice options'},
                'free_response': {'type': 'boolean', 'default': False, 'description': 'Allow free text responses'},
                'character_voices': {'type': 'object', 'description': 'Character to voice mapping'}
            },
            'assessment_criteria': ['appropriateness', 'fluency', 'cultural_awareness'],
            'component': 'DialoguePracticeComponent'
        },
        
        'listening_comprehension': {
            'name': 'Listening Comprehension',
            'description': 'Audio-based comprehension exercises',
            'parameters': {
                'audio_file': {'type': 'file', 'required': True, 'description': 'Audio file URL'},
                'transcript': {'type': 'text', 'description': 'Audio transcript (for admin)'},
                'questions': {'type': 'list', 'required': True, 'description': 'Comprehension questions'},
                'playback_limit': {'type': 'number', 'default': 3, 'description': 'Max audio replays'},
                'question_type': {'type': 'select', 'options': ['multiple_choice', 'short_answer', 'true_false'], 'default': 'multiple_choice'}
            },
            'assessment_criteria': ['listening_skills', 'comprehension', 'attention_to_detail'],
            'component': 'ListeningComprehensionComponent'
        },
        
        'peer_negotiation': {
            'name': 'Peer Negotiation',
            'description': 'Diplomatic discussion and agreement tasks',
            'parameters': {
                'scenario': {'type': 'text', 'required': True, 'description': 'Negotiation scenario'},
                'positions': {'type': 'list', 'required': True, 'description': 'Different viewpoints'},
                'resolution_types': {'type': 'list', 'description': 'Acceptable resolution types'},
                'diplomacy_required': {'type': 'boolean', 'default': True, 'description': 'Require diplomatic language'}
            },
            'assessment_criteria': ['diplomacy', 'persuasion', 'conflict_resolution'],
            'component': 'PeerNegotiationComponent'
        },
        
        'creative_writing': {
            'name': 'Creative Writing',
            'description': 'Open-ended creative writing tasks',
            'parameters': {
                'writing_type': {'type': 'select', 'options': ['poem', 'essay', 'letter', 'report', 'story'], 'required': True},
                'topic_guidelines': {'type': 'text', 'description': 'Writing guidelines and topic'},
                'min_length': {'type': 'number', 'default': 100, 'description': 'Minimum word count'},
                'style_requirements': {'type': 'text', 'description': 'Style and tone requirements'},
                'cultural_integration': {'type': 'boolean', 'default': False, 'description': 'Require cultural elements'}
            },
            'assessment_criteria': ['creativity', 'grammar', 'structure', 'cultural_integration'],
            'component': 'CreativeWritingComponent'
        },
        
        'cultural_analysis': {
            'name': 'Cultural Analysis',
            'description': 'Analyze cultural elements and contexts',
            'parameters': {
                'cultural_element': {'type': 'text', 'required': True, 'description': 'Cultural element to analyze'},
                'analysis_type': {'type': 'select', 'options': ['comparison', 'description', 'significance', 'impact'], 'required': True},
                'reference_materials': {'type': 'list', 'description': 'Reference materials provided'},
                'perspective_required': {'type': 'boolean', 'default': True, 'description': 'Require personal perspective'}
            },
            'assessment_criteria': ['cultural_understanding', 'analytical_thinking', 'communication'],
            'component': 'CulturalAnalysisComponent'
        }
    }

class WorkflowNode:
    """Represents a node in the workflow (exercise, condition, or action)"""
    
    def __init__(self, node_id=None, node_type='exercise', config=None):
        self.id = node_id or str(uuid.uuid4())
        self.type = node_type  # 'exercise', 'condition', 'action', 'end'
        self.config = config or {}
        self.connections = []  # List of connected node IDs
        self.position = {'x': 0, 'y': 0}  # For visual editor
        
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'config': self.config,
            'connections': self.connections,
            'position': self.position
        }

class ExerciseWorkflow:
    """Complete workflow definition"""
    
    def __init__(self, workflow_id=None, name='', description=''):
        self.id = workflow_id or str(uuid.uuid4())
        self.name = name
        self.description = description
        self.nodes = {}  # Dict of node_id -> WorkflowNode
        self.start_node_id = None
        self.metadata = {
            'created_at': datetime.now().isoformat(),
            'version': '1.0',
            'creator_id': None,
            'tags': [],
            'difficulty_level': 'intermediate',
            'estimated_time': 30,  # minutes
            'cultural_themes': []
        }
        
    def add_node(self, node):
        """Add a node to the workflow"""
        self.nodes[node.id] = node
        if self.start_node_id is None:
            self.start_node_id = node.id
            
    def connect_nodes(self, from_node_id, to_node_id, condition=None):
        """Connect two nodes with optional condition"""
        if from_node_id in self.nodes:
            connection = {'target': to_node_id}
            if condition:
                connection['condition'] = condition
            self.nodes[from_node_id].connections.append(connection)
            
    def validate_workflow(self):
        """Validate the workflow structure"""
        errors = []
        
        # Check for start node
        if not self.start_node_id:
            errors.append("No start node defined")
            
        # Check for unreachable nodes
        reachable = set()
        self._find_reachable_nodes(self.start_node_id, reachable)
        
        for node_id in self.nodes:
            if node_id not in reachable:
                errors.append(f"Node {node_id} is unreachable")
                
        # Check for missing end nodes
        has_end = any(node.type == 'end' for node in self.nodes.values())
        if not has_end:
            errors.append("No end node found in workflow")
            
        return errors
        
    def _find_reachable_nodes(self, node_id, reachable):
        """Recursively find all reachable nodes"""
        if node_id in reachable or node_id not in self.nodes:
            return
            
        reachable.add(node_id)
        node = self.nodes[node_id]
        
        for connection in node.connections:
            self._find_reachable_nodes(connection['target'], reachable)
            
    def to_dict(self):
        """Convert workflow to dictionary for storage"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'start_node_id': self.start_node_id,
            'nodes': {node_id: node.to_dict() for node_id, node in self.nodes.items()},
            'metadata': self.metadata
        }

class ExerciseInstance:
    """Instance of an exercise with specific configuration"""
    
    def __init__(self, exercise_type, config, metadata=None):
        self.id = str(uuid.uuid4())
        self.type = exercise_type
        self.config = config
        self.metadata = metadata or {}
        self.created_at = datetime.now()
        
        # Validate configuration against template
        self.validate_config()
        
    def validate_config(self):
        """Validate configuration against exercise type template"""
        if self.type not in ExerciseTypeTemplate.EXERCISE_TYPES:
            raise ValueError(f"Unknown exercise type: {self.type}")
            
        template = ExerciseTypeTemplate.EXERCISE_TYPES[self.type]
        required_params = [
            name for name, param in template['parameters'].items() 
            if param.get('required', False)
        ]
        
        missing_params = [
            param for param in required_params 
            if param not in self.config
        ]
        
        if missing_params:
            raise ValueError(f"Missing required parameters: {missing_params}")
            
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'config': self.config,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat()
        }

# Workflow condition evaluators
class ConditionEvaluator:
    """Evaluates conditions for workflow progression"""
    
    @staticmethod
    def evaluate_score_condition(user_score, condition_config):
        """Evaluate score-based conditions"""
        operator = condition_config.get('operator', 'gte')  # gte, lte, eq, gt, lt
        threshold = condition_config.get('threshold', 0)
        
        if operator == 'gte':
            return user_score >= threshold
        elif operator == 'lte':
            return user_score <= threshold
        elif operator == 'eq':
            return user_score == threshold
        elif operator == 'gt':
            return user_score > threshold
        elif operator == 'lt':
            return user_score < threshold
        else:
            return False
            
    @staticmethod
    def evaluate_level_condition(user_level, condition_config):
        """Evaluate CEFR level conditions"""
        target_levels = condition_config.get('levels', [])
        return user_level in target_levels
        
    @staticmethod
    def evaluate_custom_condition(user_data, condition_config):
        """Evaluate custom JavaScript-like conditions"""
        # This would need a safe expression evaluator
        # For now, return a simple implementation
        expression = condition_config.get('expression', 'true')
        
        # Simple variable substitution (in production, use a proper expression parser)
        for key, value in user_data.items():
            expression = expression.replace(f"${{{key}}}", str(value))
            
        # Evaluate simple conditions (extend as needed)
        try:
            # This is a simplified evaluator - in production use a proper expression parser
            return eval(expression, {"__builtins__": {}}, {})
        except:
            return False

# Character and Asset Management
class CharacterManager:
    """Manages characters available in exercises"""
    
    CHARACTERS = {
        'ms_mabrouki': {
            'name': 'Ms. Mabrouki',
            'role': 'Event Coordinator',
            'personality': 'Organized, encouraging, detail-oriented',
            'avatar': 'mabrouki.svg',
            'voice': 'female_professional',
            'cultural_background': 'Tunisian university administrator',
            'specialties': ['organization', 'guidance', 'cultural_events']
        },
        'skander': {
            'name': 'SKANDER',
            'role': 'Student Council President',
            'personality': 'Charismatic, energetic, visionary',
            'avatar': 'skander.svg',
            'voice': 'male_energetic',
            'cultural_background': 'Third-year politics student',
            'specialties': ['leadership', 'motivation', 'student_affairs']
        },
        'emna': {
            'name': 'Emna',
            'role': 'Committee Member',
            'personality': 'Practical, precise, reliable',
            'avatar': 'emna.svg',
            'voice': 'female_calm',
            'cultural_background': 'Business student',
            'specialties': ['logistics', 'finance', 'planning']
        },
        'ryan': {
            'name': 'Ryan',
            'role': 'Committee Member',
            'personality': 'Creative, tech-savvy, social',
            'avatar': 'ryan.svg',
            'voice': 'male_friendly',
            'cultural_background': 'Communications major',
            'specialties': ['social_media', 'outreach', 'technology']
        },
        'lilia': {
            'name': 'Lilia',
            'role': 'Committee Member',
            'personality': 'Artistic, culturally-aware, passionate',
            'avatar': 'lilia.svg',
            'voice': 'female_artistic',
            'cultural_background': 'Fine Arts student',
            'specialties': ['decoration', 'cultural_content', 'aesthetics']
        }
    }
    
    @classmethod
    def get_character(cls, character_id):
        return cls.CHARACTERS.get(character_id)
        
    @classmethod
    def get_all_characters(cls):
        return cls.CHARACTERS
        
    @classmethod
    def add_custom_character(cls, character_id, character_data):
        cls.CHARACTERS[character_id] = character_data

# Cultural Theme Management
class CulturalThemeManager:
    """Manages cultural themes and elements"""
    
    THEMES = {
        'tunisian_traditions': {
            'name': 'Tunisian Traditions',
            'elements': ['malouf_music', 'traditional_patterns', 'calligraphy', 'ceramics'],
            'contexts': ['festivals', 'weddings', 'religious_celebrations'],
            'vocabulary': ['heritage', 'tradition', 'culture', 'celebration']
        },
        'university_life': {
            'name': 'University Life',
            'elements': ['student_council', 'academic_events', 'campus_activities'],
            'contexts': ['orientation', 'graduation', 'cultural_week'],
            'vocabulary': ['academic', 'student', 'education', 'knowledge']
        },
        'modern_tunisia': {
            'name': 'Modern Tunisia',
            'elements': ['technology', 'business', 'innovation'],
            'contexts': ['entrepreneurship', 'digital_transformation'],
            'vocabulary': ['innovation', 'progress', 'development', 'future']
        }
    }
    
    @classmethod
    def get_theme(cls, theme_id):
        return cls.THEMES.get(theme_id)
        
    @classmethod
    def get_theme_vocabulary(cls, theme_id):
        theme = cls.get_theme(theme_id)
        return theme['vocabulary'] if theme else []