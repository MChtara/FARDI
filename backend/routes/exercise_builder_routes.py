"""
Exercise Builder API Routes
Admin interface for creating and managing dynamic exercises and workflows
"""

from flask import Blueprint, request, jsonify, session
import json
import uuid
from datetime import datetime
import logging

from routes.auth_routes import login_required, db_manager
from models.auth import admin_required
from models.exercise_builder import (
    ExerciseTypeTemplate, WorkflowNode, ExerciseWorkflow, 
    ExerciseInstance, ConditionEvaluator, CharacterManager, 
    CulturalThemeManager
)

logger = logging.getLogger(__name__)

# Create blueprint
exercise_builder_bp = Blueprint('exercise_builder', __name__, url_prefix='/api/admin/exercises')

# ==============================================================================
# EXERCISE TYPE MANAGEMENT
# ==============================================================================

@exercise_builder_bp.route('/types', methods=['GET'])
@admin_required
def get_exercise_types():
    """Get all available exercise types and their templates"""
    try:
        return jsonify({
            'success': True,
            'exercise_types': ExerciseTypeTemplate.EXERCISE_TYPES
        })
    except Exception as e:
        logger.error(f"Error fetching exercise types: {str(e)}")
        return jsonify({'error': 'Failed to fetch exercise types'}), 500

@exercise_builder_bp.route('/types/<exercise_type>', methods=['GET'])
@admin_required
def get_exercise_type_details(exercise_type):
    """Get detailed information about a specific exercise type"""
    try:
        if exercise_type not in ExerciseTypeTemplate.EXERCISE_TYPES:
            return jsonify({'error': 'Exercise type not found'}), 404
            
        template = ExerciseTypeTemplate.EXERCISE_TYPES[exercise_type]
        return jsonify({
            'success': True,
            'template': template
        })
    except Exception as e:
        logger.error(f"Error fetching exercise type {exercise_type}: {str(e)}")
        return jsonify({'error': 'Failed to fetch exercise type'}), 500

# ==============================================================================
# WORKFLOW MANAGEMENT
# ==============================================================================

@exercise_builder_bp.route('/workflows', methods=['GET'])
@admin_required
def get_workflows():
    """Get all workflows with pagination and filtering"""
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        search = request.args.get('search', '')
        difficulty = request.args.get('difficulty', '')
        
        conn = db_manager.get_connection()
        
        # Build query with filters
        query = """
            SELECT w.*, u.username as creator_name
            FROM workflows w
            LEFT JOIN users u ON w.creator_id = u.id
            WHERE w.is_active = 1
        """
        params = []
        
        if search:
            query += " AND (w.name LIKE ? OR w.description LIKE ?)"
            params.extend([f"%{search}%", f"%{search}%"])
            
        if difficulty:
            query += " AND w.difficulty_level = ?"
            params.append(difficulty)
            
        # Count total
        count_query = query.replace("SELECT w.*, u.username as creator_name", "SELECT COUNT(*)")
        total = conn.execute(count_query, params).fetchone()[0]
        
        # Add pagination
        query += " ORDER BY w.created_at DESC LIMIT ? OFFSET ?"
        params.extend([per_page, (page - 1) * per_page])
        
        workflows = []
        for row in conn.execute(query, params).fetchall():
            workflow_dict = dict(row)
            # Parse JSON fields
            if workflow_dict['cultural_themes']:
                workflow_dict['cultural_themes'] = json.loads(workflow_dict['cultural_themes'])
            if workflow_dict['tags']:
                workflow_dict['tags'] = json.loads(workflow_dict['tags'])
            workflows.append(workflow_dict)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'workflows': workflows,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        })
        
    except Exception as e:
        logger.error(f"Error fetching workflows: {str(e)}")
        return jsonify({'error': 'Failed to fetch workflows'}), 500

@exercise_builder_bp.route('/workflows', methods=['POST'])
@admin_required
def create_workflow():
    """Create a new workflow"""
    try:
        logger.info(f"Creating workflow - Session: {session}")
        data = request.get_json()
        logger.info(f"Request data: {data}")
        user_id = session.get('user_id')
        logger.info(f"User ID from session: {user_id}")
        
        # Create workflow object
        workflow = ExerciseWorkflow(
            name=data.get('name', 'Untitled Workflow'),
            description=data.get('description', '')
        )
        
        # Set metadata
        workflow.metadata.update({
            'creator_id': user_id,
            'difficulty_level': data.get('difficulty_level', 'intermediate'),
            'estimated_time': data.get('estimated_time', 30),
            'cultural_themes': data.get('cultural_themes', []),
            'tags': data.get('tags', [])
        })
        
        # Skip validation for new empty workflows - they'll be validated when nodes are added
        # errors = workflow.validate_workflow()
        # if errors:
        #     return jsonify({'error': 'Workflow validation failed', 'details': errors}), 400
        
        # Save to database with FBP format
        fbp_data = {
            'nodes': {},
            'edges': [],
            'start_node_id': 'start'
        }
        
        conn = db_manager.get_connection()
        conn.execute('''
            INSERT INTO workflows (
                id, name, description, workflow_data, creator_id,
                difficulty_level, estimated_time, cultural_themes, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            workflow.id, workflow.name, workflow.description,
            json.dumps(fbp_data), user_id,
            workflow.metadata['difficulty_level'],
            workflow.metadata['estimated_time'],
            json.dumps(workflow.metadata['cultural_themes']),
            json.dumps(workflow.metadata['tags'])
        ))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'workflow_id': workflow.id,
            'message': 'Workflow created successfully'
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating workflow: {str(e)}")
        return jsonify({'error': 'Failed to create workflow'}), 500

@exercise_builder_bp.route('/workflows/<workflow_id>', methods=['GET'])
@admin_required
def get_workflow(workflow_id):
    """Get a specific workflow with full details"""
    try:
        conn = db_manager.get_connection()
        workflow_row = conn.execute('''
            SELECT w.*, u.username as creator_name
            FROM workflows w
            LEFT JOIN users u ON w.creator_id = u.id
            WHERE w.id = ?
        ''', (workflow_id,)).fetchone()
        
        if not workflow_row:
            return jsonify({'error': 'Workflow not found'}), 404
        
        workflow_dict = dict(workflow_row)
        
        # Parse JSON fields
        if workflow_dict['workflow_data']:
            try:
                workflow_dict['workflow_data'] = json.loads(workflow_dict['workflow_data'])
            except (json.JSONDecodeError, TypeError) as e:
                logger.error(f"Invalid workflow_data JSON: {workflow_dict['workflow_data']}")
                # Provide default FBP structure for invalid data
                workflow_dict['workflow_data'] = {
                    'nodes': {},
                    'edges': [],
                    'start_node_id': 'start'
                }
        if workflow_dict['cultural_themes']:
            workflow_dict['cultural_themes'] = json.loads(workflow_dict['cultural_themes'])
        if workflow_dict['tags']:
            workflow_dict['tags'] = json.loads(workflow_dict['tags'])
        
        # Get exercise instances for this workflow
        exercises = conn.execute('''
            SELECT * FROM exercise_instances WHERE workflow_id = ?
        ''', (workflow_id,)).fetchall()
        
        workflow_dict['exercises'] = [
            {
                **dict(ex),
                'configuration': json.loads(ex['configuration']) if ex['configuration'] else {},
                'metadata': json.loads(ex['metadata']) if ex['metadata'] else {}
            }
            for ex in exercises
        ]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'workflow': workflow_dict
        })
        
    except Exception as e:
        logger.error(f"Error fetching workflow {workflow_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch workflow'}), 500

@exercise_builder_bp.route('/workflows/<workflow_id>', methods=['PUT'])
@admin_required
def update_workflow(workflow_id):
    """Update an existing workflow"""
    try:
        data = request.get_json()
        
        conn = db_manager.get_connection()
        
        # Check if workflow exists
        existing = conn.execute('SELECT id FROM workflows WHERE id = ?', (workflow_id,)).fetchone()
        if not existing:
            return jsonify({'error': 'Workflow not found'}), 404
        
        # Update workflow
        conn.execute('''
            UPDATE workflows SET
                name = ?, description = ?, workflow_data = ?,
                updated_at = CURRENT_TIMESTAMP, difficulty_level = ?,
                estimated_time = ?, cultural_themes = ?, tags = ?
            WHERE id = ?
        ''', (
            data.get('name'),
            data.get('description'),
            json.dumps(data.get('workflow_data', {})),
            data.get('difficulty_level'),
            data.get('estimated_time'),
            json.dumps(data.get('cultural_themes', [])),
            json.dumps(data.get('tags', [])),
            workflow_id
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Workflow updated successfully'
        })
        
    except Exception as e:
        logger.error(f"Error updating workflow {workflow_id}: {str(e)}")
        return jsonify({'error': 'Failed to update workflow'}), 500

@exercise_builder_bp.route('/workflows/<workflow_id>', methods=['DELETE'])
@admin_required
def delete_workflow(workflow_id):
    """Delete a workflow (soft delete)"""
    try:
        conn = db_manager.get_connection()
        
        # Check if workflow exists
        existing = conn.execute('SELECT id FROM workflows WHERE id = ?', (workflow_id,)).fetchone()
        if not existing:
            return jsonify({'error': 'Workflow not found'}), 404
        
        # Soft delete
        conn.execute('UPDATE workflows SET is_active = 0 WHERE id = ?', (workflow_id,))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Workflow deleted successfully'
        })
        
    except Exception as e:
        logger.error(f"Error deleting workflow {workflow_id}: {str(e)}")
        return jsonify({'error': 'Failed to delete workflow'}), 500

# ==============================================================================
# INDIVIDUAL EXERCISES MANAGEMENT
# ==============================================================================

@exercise_builder_bp.route('/library', methods=['GET'])
@admin_required
def get_exercise_library():
    """Get all individual exercises from the library"""
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        search = request.args.get('search', '')
        exercise_type = request.args.get('type', '')
        
        conn = db_manager.get_connection()
        
        # Build query with filters
        query = """
            SELECT e.*, u.username as creator_name
            FROM exercises e
            LEFT JOIN users u ON e.creator_id = u.id
            WHERE e.is_active = 1
        """
        params = []
        
        if search:
            query += " AND (e.name LIKE ? OR e.description LIKE ?)"
            params.extend([f"%{search}%", f"%{search}%"])
            
        if exercise_type:
            query += " AND e.exercise_type = ?"
            params.append(exercise_type)
            
        # Count total
        count_query = query.replace("SELECT e.*, u.username as creator_name", "SELECT COUNT(*)")
        total = conn.execute(count_query, params).fetchone()[0]
        
        # Add pagination
        query += " ORDER BY e.created_at DESC LIMIT ? OFFSET ?"
        params.extend([per_page, (page - 1) * per_page])
        
        exercises = []
        for row in conn.execute(query, params).fetchall():
            exercise_dict = dict(row)
            # Parse JSON fields
            if exercise_dict['difficulty_levels']:
                exercise_dict['difficulty_levels'] = json.loads(exercise_dict['difficulty_levels'])
            if exercise_dict['correct_answers']:
                exercise_dict['correct_answers'] = json.loads(exercise_dict['correct_answers'])
            if exercise_dict['wrong_answers']:
                exercise_dict['wrong_answers'] = json.loads(exercise_dict['wrong_answers'])
            if exercise_dict['parameters']:
                exercise_dict['parameters'] = json.loads(exercise_dict['parameters'])
            if exercise_dict['cultural_themes']:
                exercise_dict['cultural_themes'] = json.loads(exercise_dict['cultural_themes'])
            if exercise_dict['tags']:
                exercise_dict['tags'] = json.loads(exercise_dict['tags'])
            exercises.append(exercise_dict)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'exercises': exercises,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        })
        
    except Exception as e:
        logger.error(f"Error fetching exercise library: {str(e)}")
        return jsonify({'error': 'Failed to fetch exercise library'}), 500

@exercise_builder_bp.route('/library', methods=['POST'])
@admin_required
def create_individual_exercise():
    """Create a new individual exercise"""
    try:
        data = request.get_json()
        user_id = session.get('user_id')
        
        # Validate exercise type
        exercise_type = data.get('exercise_type')
        if exercise_type not in ExerciseTypeTemplate.EXERCISE_TYPES:
            return jsonify({'error': 'Invalid exercise type'}), 400
        
        exercise_id = str(uuid.uuid4())
        
        # Save to database
        conn = db_manager.get_connection()
        conn.execute('''
            INSERT INTO exercises (
                id, name, description, exercise_type, difficulty_levels,
                correct_answers, wrong_answers, ai_instructions, parameters,
                cultural_themes, tags, creator_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            exercise_id,
            data.get('name', 'Untitled Exercise'),
            data.get('description', ''),
            exercise_type,
            json.dumps(data.get('difficulty_levels', {})),
            json.dumps(data.get('correct_answers', {})),
            json.dumps(data.get('wrong_answers', {})),
            data.get('ai_instructions', ''),
            json.dumps(data.get('parameters', {})),
            json.dumps(data.get('cultural_themes', [])),
            json.dumps(data.get('tags', [])),
            user_id
        ))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'exercise_id': exercise_id,
            'message': 'Exercise created successfully'
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating individual exercise: {str(e)}")
        return jsonify({'error': 'Failed to create exercise'}), 500

@exercise_builder_bp.route('/library/<exercise_id>', methods=['GET'])
@admin_required
def get_individual_exercise(exercise_id):
    """Get a specific exercise from the library"""
    try:
        conn = db_manager.get_connection()
        exercise_row = conn.execute('''
            SELECT e.*, u.username as creator_name
            FROM exercises e
            LEFT JOIN users u ON e.creator_id = u.id
            WHERE e.id = ? AND e.is_active = 1
        ''', (exercise_id,)).fetchone()
        
        if not exercise_row:
            return jsonify({'error': 'Exercise not found'}), 404
        
        exercise_dict = dict(exercise_row)
        
        # Parse JSON fields
        if exercise_dict['difficulty_levels']:
            exercise_dict['difficulty_levels'] = json.loads(exercise_dict['difficulty_levels'])
        if exercise_dict['correct_answers']:
            exercise_dict['correct_answers'] = json.loads(exercise_dict['correct_answers'])
        if exercise_dict['wrong_answers']:
            exercise_dict['wrong_answers'] = json.loads(exercise_dict['wrong_answers'])
        if exercise_dict['parameters']:
            exercise_dict['parameters'] = json.loads(exercise_dict['parameters'])
        if exercise_dict['cultural_themes']:
            exercise_dict['cultural_themes'] = json.loads(exercise_dict['cultural_themes'])
        if exercise_dict['tags']:
            exercise_dict['tags'] = json.loads(exercise_dict['tags'])
        
        conn.close()
        
        return jsonify({
            'success': True,
            'exercise': exercise_dict
        })
        
    except Exception as e:
        logger.error(f"Error fetching exercise {exercise_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch exercise'}), 500

@exercise_builder_bp.route('/library/<exercise_id>', methods=['PUT'])
@admin_required
def update_individual_exercise(exercise_id):
    """Update an individual exercise"""
    try:
        data = request.get_json()
        
        conn = db_manager.get_connection()
        
        # Check if exercise exists
        existing = conn.execute('SELECT id FROM exercises WHERE id = ? AND is_active = 1', (exercise_id,)).fetchone()
        if not existing:
            return jsonify({'error': 'Exercise not found'}), 404
        
        # Update exercise
        conn.execute('''
            UPDATE exercises SET
                name = ?, description = ?, exercise_type = ?, difficulty_levels = ?,
                correct_answers = ?, wrong_answers = ?, ai_instructions = ?, parameters = ?,
                cultural_themes = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            data.get('name'),
            data.get('description'),
            data.get('exercise_type'),
            json.dumps(data.get('difficulty_levels', {})),
            json.dumps(data.get('correct_answers', {})),
            json.dumps(data.get('wrong_answers', {})),
            data.get('ai_instructions', ''),
            json.dumps(data.get('parameters', {})),
            json.dumps(data.get('cultural_themes', [])),
            json.dumps(data.get('tags', [])),
            exercise_id
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Exercise updated successfully'
        })
        
    except Exception as e:
        logger.error(f"Error updating exercise {exercise_id}: {str(e)}")
        return jsonify({'error': 'Failed to update exercise'}), 500

@exercise_builder_bp.route('/library/<exercise_id>', methods=['DELETE'])
@admin_required
def delete_individual_exercise(exercise_id):
    """Delete an individual exercise (soft delete)"""
    try:
        conn = db_manager.get_connection()
        
        # Check if exercise exists
        existing = conn.execute('SELECT id FROM exercises WHERE id = ? AND is_active = 1', (exercise_id,)).fetchone()
        if not existing:
            return jsonify({'error': 'Exercise not found'}), 404
        
        # Soft delete
        conn.execute('UPDATE exercises SET is_active = 0 WHERE id = ?', (exercise_id,))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Exercise deleted successfully'
        })
        
    except Exception as e:
        logger.error(f"Error deleting exercise {exercise_id}: {str(e)}")
        return jsonify({'error': 'Failed to delete exercise'}), 500

# ==============================================================================
# EXERCISE INSTANCE MANAGEMENT
# ==============================================================================

@exercise_builder_bp.route('/workflows/<workflow_id>/exercises', methods=['POST'])
@admin_required
def create_exercise_instance(workflow_id):
    """Create a new exercise instance within a workflow"""
    try:
        data = request.get_json()
        
        # Validate exercise type
        exercise_type = data.get('exercise_type')
        if exercise_type not in ExerciseTypeTemplate.EXERCISE_TYPES:
            return jsonify({'error': 'Invalid exercise type'}), 400
        
        # Create exercise instance
        exercise = ExerciseInstance(
            exercise_type=exercise_type,
            config=data.get('configuration', {}),
            metadata=data.get('metadata', {})
        )
        
        # Save to database
        conn = db_manager.get_connection()
        conn.execute('''
            INSERT INTO exercise_instances (
                id, workflow_id, exercise_type, configuration, metadata
            ) VALUES (?, ?, ?, ?, ?)
        ''', (
            exercise.id, workflow_id, exercise.type,
            json.dumps(exercise.config), json.dumps(exercise.metadata)
        ))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'exercise_id': exercise.id,
            'message': 'Exercise created successfully'
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating exercise: {str(e)}")
        return jsonify({'error': 'Failed to create exercise'}), 500

# ==============================================================================
# CHARACTER MANAGEMENT
# ==============================================================================

@exercise_builder_bp.route('/characters', methods=['GET'])
@admin_required
def get_characters():
    """Get all available characters (built-in and custom)"""
    try:
        # Get built-in characters
        builtin_characters = CharacterManager.get_all_characters()
        
        # Get custom characters from database
        conn = db_manager.get_connection()
        custom_chars = conn.execute('''
            SELECT * FROM custom_characters WHERE is_active = 1
        ''').fetchall()
        
        custom_characters = {}
        for char in custom_chars:
            char_dict = dict(char)
            if char_dict['specialties']:
                char_dict['specialties'] = json.loads(char_dict['specialties'])
            custom_characters[char_dict['id']] = char_dict
        
        conn.close()
        
        return jsonify({
            'success': True,
            'builtin_characters': builtin_characters,
            'custom_characters': custom_characters
        })
        
    except Exception as e:
        logger.error(f"Error fetching characters: {str(e)}")
        return jsonify({'error': 'Failed to fetch characters'}), 500

@exercise_builder_bp.route('/characters', methods=['POST'])
@admin_required
def create_custom_character():
    """Create a custom character"""
    try:
        data = request.get_json()
        user_id = session.get('user_id')
        
        character_id = str(uuid.uuid4())
        
        conn = db_manager.get_connection()
        conn.execute('''
            INSERT INTO custom_characters (
                id, name, role, personality, avatar_url, voice_id,
                cultural_background, specialties, creator_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            character_id, data.get('name'), data.get('role'),
            data.get('personality'), data.get('avatar_url'), data.get('voice_id'),
            data.get('cultural_background'), json.dumps(data.get('specialties', [])),
            user_id
        ))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'character_id': character_id,
            'message': 'Character created successfully'
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating character: {str(e)}")
        return jsonify({'error': 'Failed to create character'}), 500

# ==============================================================================
# CULTURAL THEMES MANAGEMENT
# ==============================================================================

@exercise_builder_bp.route('/themes', methods=['GET'])
@admin_required
def get_cultural_themes():
    """Get all cultural themes"""
    try:
        themes = CulturalThemeManager.THEMES
        return jsonify({
            'success': True,
            'themes': themes
        })
    except Exception as e:
        logger.error(f"Error fetching themes: {str(e)}")
        return jsonify({'error': 'Failed to fetch themes'}), 500

# ==============================================================================
# WORKFLOW TEMPLATES
# ==============================================================================

@exercise_builder_bp.route('/templates', methods=['GET'])
@admin_required
def get_workflow_templates():
    """Get all workflow templates"""
    try:
        conn = db_manager.get_connection()
        templates = conn.execute('''
            SELECT wt.*, u.username as creator_name
            FROM workflow_templates wt
            LEFT JOIN users u ON wt.creator_id = u.id
            WHERE wt.is_public = 1 OR wt.creator_id = ?
            ORDER BY wt.usage_count DESC, wt.created_at DESC
        ''', (session.get('user_id'),)).fetchall()
        
        template_list = []
        for template in templates:
            template_dict = dict(template)
            if template_dict['template_data']:
                template_dict['template_data'] = json.loads(template_dict['template_data'])
            template_list.append(template_dict)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'templates': template_list
        })
        
    except Exception as e:
        logger.error(f"Error fetching templates: {str(e)}")
        return jsonify({'error': 'Failed to fetch templates'}), 500

@exercise_builder_bp.route('/templates/<template_id>/use', methods=['POST'])
@admin_required
def use_workflow_template(template_id):
    """Create a new workflow from a template"""
    try:
        conn = db_manager.get_connection()
        
        # Get template
        template = conn.execute('''
            SELECT * FROM workflow_templates WHERE id = ?
        ''', (template_id,)).fetchone()
        
        if not template:
            return jsonify({'error': 'Template not found'}), 404
        
        # Parse template data
        template_data = json.loads(template['template_data'])
        
        # Create new workflow from template
        data = request.get_json()
        workflow_name = data.get('name', f"{template['name']} - Copy")
        
        workflow = ExerciseWorkflow(name=workflow_name)
        # Apply template structure to workflow
        # ... (implement template application logic)
        
        # Update usage count
        conn.execute('UPDATE workflow_templates SET usage_count = usage_count + 1 WHERE id = ?', (template_id,))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'workflow_id': workflow.id,
            'message': 'Workflow created from template'
        })
        
    except Exception as e:
        logger.error(f"Error using template {template_id}: {str(e)}")
        return jsonify({'error': 'Failed to use template'}), 500

# ==============================================================================
# ASSESSMENT RUBRICS
# ==============================================================================

@exercise_builder_bp.route('/rubrics', methods=['GET'])
@admin_required
def get_assessment_rubrics():
    """Get all assessment rubrics"""
    try:
        conn = db_manager.get_connection()
        rubrics = conn.execute('''
            SELECT ar.*, u.username as creator_name
            FROM assessment_rubrics ar
            LEFT JOIN users u ON ar.creator_id = u.id
            ORDER BY ar.is_default DESC, ar.created_at DESC
        ''').fetchall()
        
        rubric_list = []
        for rubric in rubrics:
            rubric_dict = dict(rubric)
            if rubric_dict['criteria']:
                rubric_dict['criteria'] = json.loads(rubric_dict['criteria'])
            if rubric_dict['scoring_scale']:
                rubric_dict['scoring_scale'] = json.loads(rubric_dict['scoring_scale'])
            if rubric_dict['exercise_types']:
                rubric_dict['exercise_types'] = json.loads(rubric_dict['exercise_types'])
            rubric_list.append(rubric_dict)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'rubrics': rubric_list
        })
        
    except Exception as e:
        logger.error(f"Error fetching rubrics: {str(e)}")
        return jsonify({'error': 'Failed to fetch rubrics'}), 500

# ==============================================================================
# WORKFLOW TESTING AND PREVIEW
# ==============================================================================

@exercise_builder_bp.route('/workflows/<workflow_id>/preview', methods=['POST'])
@admin_required
def preview_workflow(workflow_id):
    """Preview how a workflow will execute"""
    try:
        # Get workflow
        conn = db_manager.get_connection()
        workflow_row = conn.execute('SELECT * FROM workflows WHERE id = ?', (workflow_id,)).fetchone()
        
        if not workflow_row:
            return jsonify({'error': 'Workflow not found'}), 404
        
        workflow_data = json.loads(workflow_row['workflow_data'])
        
        # Simulate workflow execution
        preview_data = {
            'workflow': workflow_data,
            'estimated_steps': len(workflow_data.get('nodes', {})),
            'exercise_types': [],
            'validation_results': []
        }
        
        # Analyze workflow nodes
        for node_id, node in workflow_data.get('nodes', {}).items():
            if node['type'] == 'exercise':
                preview_data['exercise_types'].append(node['config'].get('exercise_type'))
        
        conn.close()
        
        return jsonify({
            'success': True,
            'preview': preview_data
        })
        
    except Exception as e:
        logger.error(f"Error previewing workflow {workflow_id}: {str(e)}")
        return jsonify({'error': 'Failed to preview workflow'}), 500