"""
Workflow Importer - Convert existing exercise data to FBP workflows
"""

from flask import Blueprint, jsonify, request
import json
import uuid
from datetime import datetime

from routes.auth_routes import db_manager
from models.auth import admin_required
from models.game_data import DIALOGUE_QUESTIONS, NPCS
from models.phase2_loader import PHASE_2_STEPS, PHASE_2_REMEDIAL_ACTIVITIES

workflow_importer_bp = Blueprint('workflow_importer', __name__, url_prefix='/api/admin/workflow-importer')

def create_fbp_node(node_id, node_type, position, data):
    """Create a standardized FBP node"""
    return {
        'id': node_id,
        'type': node_type,
        'position': position,
        'data': data
    }

def create_fbp_edge(edge_id, source, target, animated=True, source_handle=None):
    """Create a standardized FBP edge"""
    edge = {
        'id': edge_id,
        'source': source,
        'target': target,
        'animated': animated
    }
    if source_handle:
        edge['sourceHandle'] = source_handle
    return edge

def convert_phase1_to_workflow():
    """Convert Phase 1 dialogue questions to FBP workflow"""
    workflow_id = str(uuid.uuid4())
    nodes = {}
    edges = []
    
    # Start node
    nodes['start'] = create_fbp_node(
        'start', 'start', 
        {'x': 50, 'y': 100}, 
        {'label': 'Start', 'type': 'start'}
    )
    
    # Horizontal layout
    x_spacing = 250
    base_x = 200
    main_y = 100
    assessment_y = 200
    remedial_y = 50
    
    for i, question in enumerate(DIALOGUE_QUESTIONS):
        step_num = question['step']
        speaker = question['speaker']
        current_x = base_x + (i * x_spacing)
        
        # Main exercise node
        main_id = f'step_{step_num}_main'
        nodes[main_id] = create_fbp_node(
            main_id, 'exercise',
            {'x': current_x, 'y': main_y},
            {
                'label': f'Step {step_num}',
                'exerciseType': question['type'],
                'speaker': speaker,
                'skill': question['skill']
            }
        )
        
        # Assessment condition
        condition_id = f'step_{step_num}_assessment'
        nodes[condition_id] = create_fbp_node(
            condition_id, 'condition',
            {'x': current_x, 'y': assessment_y},
            {
                'label': 'Check',
                'condition': 'pass/fail',
                'conditionType': 'score'
            }
        )
        
        # Connect main exercise to assessment
        edges.append(create_fbp_edge(
            f'e_{step_num}_main_to_assess',
            main_id, condition_id
        ))
        
        # Connect from previous step
        if i == 0:
            # Connect start to first step
            edges.append(create_fbp_edge(
                'e_start_to_first',
                'start', main_id
            ))
        else:
            # Connect from previous assessment
            prev_condition = f'step_{DIALOGUE_QUESTIONS[i-1]["step"]}_assessment'
            edges.append(create_fbp_edge(
                f'e_prev_{step_num}',
                prev_condition, main_id,
                source_handle='pass'
            ))
        
        # Add remedial path (basic remedial for Phase 1)
        if step_num <= 5:  # First half gets basic remedial
            remedial_id = f'step_{step_num}_remedial'
            nodes[remedial_id] = create_fbp_node(
                remedial_id, 'exercise',
                {'x': current_x, 'y': remedial_y},
                {
                    'label': f'Practice',
                    'exerciseType': 'remedial-basic'
                }
            )
            
            # Connect assessment fail to remedial
            edges.append(create_fbp_edge(
                f'e_{step_num}_fail_to_remedial',
                condition_id, remedial_id,
                source_handle='fail'
            ))
    
    # End node
    final_x = base_x + (len(DIALOGUE_QUESTIONS) * x_spacing)
    nodes['end'] = create_fbp_node(
        'end', 'end',
        {'x': final_x, 'y': main_y},
        {'label': 'End', 'type': 'end'}
    )
    
    # Connect last assessment to end
    last_condition = f'step_{DIALOGUE_QUESTIONS[-1]["step"]}_assessment'
    edges.append(create_fbp_edge(
        'e_final_to_end',
        last_condition, 'end',
        source_handle='pass'
    ))
    
    # Create workflow data
    workflow_data = {
        'nodes': nodes,
        'edges': edges,
        'start_node_id': 'start'
    }
    
    return {
        'id': workflow_id,
        'name': 'Phase 1: Cultural Event Interview',
        'description': 'Main dialogue sequence with CEFR assessment and basic remedials',
        'workflow_data': json.dumps(workflow_data),
        'difficulty_level': 'mixed',
        'estimated_time': 45,
        'cultural_themes': ['cultural_event', 'interview', 'teamwork'],
        'tags': ['phase1', 'dialogue', 'assessment']
    }

def convert_phase2_step_to_workflow(step_id, step_data):
    """Convert a Phase 2 step to FBP workflow"""
    workflow_id = str(uuid.uuid4())
    nodes = {}
    edges = []
    
    # Start node
    nodes['start'] = create_fbp_node(
        'start', 'start',
        {'x': 50, 'y': 100},
        {'label': 'Start', 'type': 'start'}
    )
    
    # Horizontal layout
    x_spacing = 300
    base_x = 200
    main_y = 100
    assessment_y = 200
    remedial_a1_y = 50
    remedial_a2_y = 250
    
    # Process action items
    for i, action in enumerate(step_data['action_items']):
        action_id = action['id']
        current_x = base_x + (i * x_spacing)
        
        # Main activity node
        main_node_id = f'{action_id}_main'
        nodes[main_node_id] = create_fbp_node(
            main_node_id, 'exercise',
            {'x': current_x, 'y': main_y},
            {
                'label': action_id.replace('_', ' ').title(),
                'exerciseType': action['type'],
                'speaker': action['speaker']
            }
        )
        
        # Assessment node
        assess_id = f'{action_id}_assessment'
        nodes[assess_id] = create_fbp_node(
            assess_id, 'condition',
            {'x': current_x, 'y': assessment_y},
            {
                'label': 'Check',
                'condition': 'pass/fail',
                'conditionType': 'accuracy'
            }
        )
        
        # Connect main to assessment
        edges.append(create_fbp_edge(
            f'e_{action_id}_to_assess',
            main_node_id, assess_id
        ))
        
        # Connect from start or previous
        if i == 0:
            edges.append(create_fbp_edge(
                'e_start_to_first',
                'start', main_node_id
            ))
        else:
            prev_assess = f'{step_data["action_items"][i-1]["id"]}_assessment'
            edges.append(create_fbp_edge(
                f'e_prev_to_{action_id}',
                prev_assess, main_node_id,
                source_handle='pass'
            ))
        
        # Add remedial activities if they exist
        if step_id in PHASE_2_REMEDIAL_ACTIVITIES:
            remedials = PHASE_2_REMEDIAL_ACTIVITIES[step_id]
            
            # A1 remedial path
            if 'A1' in remedials:
                a1_remedial_id = f'{action_id}_remedial_a1'
                nodes[a1_remedial_id] = create_fbp_node(
                    a1_remedial_id, 'exercise',
                    {'x': current_x, 'y': remedial_a1_y},
                    {
                        'label': 'A1',
                        'exerciseType': 'phase2-remedial',
                        'level': 'A1'
                    }
                )
                
                edges.append(create_fbp_edge(
                    f'e_{action_id}_fail_a1',
                    assess_id, a1_remedial_id,
                    source_handle='fail'
                ))
            
            # A2 remedial path  
            if 'A2' in remedials:
                a2_remedial_id = f'{action_id}_remedial_a2'
                nodes[a2_remedial_id] = create_fbp_node(
                    a2_remedial_id, 'exercise',
                    {'x': current_x, 'y': remedial_a2_y},
                    {
                        'label': 'A2',
                        'exerciseType': 'phase2-remedial',
                        'level': 'A2'
                    }
                )
                
                edges.append(create_fbp_edge(
                    f'e_{action_id}_fail_a2',
                    assess_id, a2_remedial_id,
                    source_handle='fail'
                ))
    
    # End node
    final_x = base_x + (len(step_data['action_items']) * x_spacing)
    nodes['end'] = create_fbp_node(
        'end', 'end',
        {'x': final_x, 'y': main_y},
        {'label': 'End', 'type': 'end'}
    )
    
    # Connect final assessment to end
    if step_data['action_items']:
        final_assess = f'{step_data["action_items"][-1]["id"]}_assessment'
        edges.append(create_fbp_edge(
            'e_final_to_end',
            final_assess, 'end',
            source_handle='pass'
        ))
    
    workflow_data = {
        'nodes': nodes,
        'edges': edges,
        'start_node_id': 'start'
    }
    
    return {
        'id': workflow_id,
        'name': f'Phase 2: {step_data["title"]}',
        'description': step_data['description'],
        'workflow_data': json.dumps(workflow_data),
        'difficulty_level': 'intermediate',
        'estimated_time': 30,
        'cultural_themes': ['teamwork', 'planning', 'cultural_event'],
        'tags': ['phase2', step_id, 'collaborative']
    }

@workflow_importer_bp.route('/import-existing', methods=['POST'])
@admin_required
def import_existing_workflows():
    """Import existing exercise data as visual workflows"""
    try:
        data = request.get_json() or {}
        import_phase1 = data.get('import_phase1', True)
        import_phase2 = data.get('import_phase2', True)
        
        imported_workflows = []
        conn = db_manager.get_connection()
        
        # Import Phase 1 as single workflow
        if import_phase1:
            phase1_workflow = convert_phase1_to_workflow()
            
            conn.execute('''
                INSERT INTO workflows (
                    id, name, description, workflow_data, creator_id,
                    difficulty_level, estimated_time, cultural_themes, tags,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                phase1_workflow['id'],
                phase1_workflow['name'],
                phase1_workflow['description'],
                phase1_workflow['workflow_data'],
                1,  # System import
                phase1_workflow['difficulty_level'],
                phase1_workflow['estimated_time'],
                json.dumps(phase1_workflow['cultural_themes']),
                json.dumps(phase1_workflow['tags']),
                datetime.now().isoformat()
            ))
            imported_workflows.append(phase1_workflow['name'])
        
        # Import Phase 2 steps as separate workflows
        if import_phase2:
            for step_id, step_data in PHASE_2_STEPS.items():
                step_workflow = convert_phase2_step_to_workflow(step_id, step_data)
                
                conn.execute('''
                    INSERT INTO workflows (
                        id, name, description, workflow_data, creator_id,
                        difficulty_level, estimated_time, cultural_themes, tags,
                        created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    step_workflow['id'],
                    step_workflow['name'],
                    step_workflow['description'],
                    step_workflow['workflow_data'],
                    1,  # System import
                    step_workflow['difficulty_level'],
                    step_workflow['estimated_time'],
                    json.dumps(step_workflow['cultural_themes']),
                    json.dumps(step_workflow['tags']),
                    datetime.now().isoformat()
                ))
                imported_workflows.append(step_workflow['name'])
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': f'Successfully imported {len(imported_workflows)} workflows',
            'imported': imported_workflows
        })
        
    except Exception as e:
        return jsonify({'error': f'Import failed: {str(e)}'}), 500

@workflow_importer_bp.route('/preview', methods=['GET'])
@admin_required  
def preview_existing_data():
    """Preview what would be imported"""
    try:
        preview = {
            'phase1': {
                'name': 'Phase 1: Cultural Event Interview',
                'steps': len(DIALOGUE_QUESTIONS),
                'speakers': list(set(q['speaker'] for q in DIALOGUE_QUESTIONS)),
                'skills': list(set(q['skill'] for q in DIALOGUE_QUESTIONS))
            },
            'phase2': {
                'steps': len(PHASE_2_STEPS),
                'step_names': [step['title'] for step in PHASE_2_STEPS.values()],
                'remedial_levels': list(PHASE_2_REMEDIAL_ACTIVITIES.keys())
            }
        }
        
        return jsonify({
            'success': True,
            'preview': preview
        })
        
    except Exception as e:
        return jsonify({'error': f'Preview failed: {str(e)}'}), 500