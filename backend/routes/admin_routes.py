"""
Admin routes for student progress tracking and AI evaluation monitoring
"""
import logging
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, session
from routes.auth_routes import login_required, admin_required, assessment_history, user_manager

logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin', __name__)

def admin_only(f):
    """Decorator to ensure only admins can access"""
    def decorated_function(*args, **kwargs):
        if not session.get('is_admin'):
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@admin_bp.route('/api/admin/users', methods=['GET'])
@login_required
@admin_only
def get_all_users():
    """Get all users with their progress summary"""
    try:
        all_users = user_manager.get_all_users()

        users_with_stats = []
        for user in all_users:
            user_id = user.get('user_id')

            # Get Phase 1 progress
            phase1_history = assessment_history.get_user_history(user_id)
            latest_phase1 = phase1_history[0] if phase1_history else None

            # Get Phase 2 progress
            phase2_progress = assessment_history.get_phase2_progress(user_id)
            phase2_score = phase2_progress.get('overall_score', 0)
            phase2_total = phase2_progress.get('max_score', 100)

            users_with_stats.append({
                'user_id': user_id,
                'username': user.get('username'),
                'first_name': user.get('first_name', ''),
                'last_name': user.get('last_name', ''),
                'email': user.get('email', ''),
                'is_admin': user.get('is_admin', False),
                'created_at': user.get('created_at'),
                'last_login': user.get('last_login'),
                'phase1_level': latest_phase1.get('overall_level') if latest_phase1 else None,
                'phase1_date': latest_phase1.get('timestamp') if latest_phase1 else None,
                'phase2_score': phase2_score,
                'phase2_percentage': round((phase2_score / phase2_total * 100) if phase2_total > 0 else 0, 1),
                'phase2_steps_completed': len(phase2_progress.get('steps_completed', [])),
                'total_remedial_activities': len(phase2_progress.get('remedial_activities', []))
            })

        return jsonify({
            "success": True,
            "data": {
                "users": users_with_stats,
                "total_count": len(users_with_stats)
            }
        })
    except Exception as e:
        logger.error(f"Error getting users: {str(e)}")
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/api/admin/student/<user_id>/progress', methods=['GET'])
@login_required
@admin_only
def get_student_progress(user_id):
    """Get detailed progress for a specific student"""
    try:
        # Get user info
        user = user_manager.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Phase 1 history
        phase1_history = assessment_history.get_user_history(user_id)

        # Phase 2 detailed progress
        phase2_progress = assessment_history.get_phase2_progress(user_id)

        # Get all responses with AI evaluations
        responses_with_ai = []
        for step_data in phase2_progress.get('steps', []):
            for response in step_data.get('responses', []):
                responses_with_ai.append({
                    'step_id': step_data.get('step_id'),
                    'action_item_id': response.get('action_item_id'),
                    'timestamp': response.get('timestamp'),
                    'response_text': response.get('response'),
                    'score': response.get('score'),
                    'ai_evaluation': response.get('ai_evaluation'),
                    'cefr_level': response.get('cefr_level'),
                    'assessment_focus': response.get('assessment_focus')
                })

        # Get remedial activities with AI evaluations
        remedial_with_ai = []
        for activity in phase2_progress.get('remedial_activities', []):
            remedial_with_ai.append({
                'step_id': activity.get('step_id'),
                'level': activity.get('level'),
                'activity_id': activity.get('activity_id'),
                'activity_index': activity.get('activity_index'),
                'timestamp': activity.get('timestamp'),
                'completed': activity.get('completed'),
                'score': activity.get('score'),
                'responses': activity.get('responses', {}),
                'ai_evaluation': activity.get('ai_evaluation')
            })

        return jsonify({
            "success": True,
            "data": {
                "user": {
                    'user_id': user_id,
                    'username': user.get('username'),
                    'first_name': user.get('first_name', ''),
                    'last_name': user.get('last_name', ''),
                    'email': user.get('email', ''),
                    'created_at': user.get('created_at'),
                    'last_login': user.get('last_login')
                },
                "phase1_history": phase1_history,
                "phase2_progress": phase2_progress,
                "responses_with_ai": responses_with_ai,
                "remedial_with_ai": remedial_with_ai,
                "summary": {
                    'total_phase1_attempts': len(phase1_history),
                    'current_level': phase1_history[0].get('overall_level') if phase1_history else None,
                    'phase2_score': phase2_progress.get('overall_score', 0),
                    'phase2_max': phase2_progress.get('max_score', 100),
                    'phase2_percentage': round((phase2_progress.get('overall_score', 0) / phase2_progress.get('max_score', 100) * 100) if phase2_progress.get('max_score', 0) > 0 else 0, 1),
                    'steps_completed': len(phase2_progress.get('steps_completed', [])),
                    'total_responses': len(responses_with_ai),
                    'total_remedial_activities': len(remedial_with_ai),
                    'remedial_completed': len([a for a in remedial_with_ai if a.get('completed')])
                }
            }
        })
    except Exception as e:
        logger.error(f"Error getting student progress: {str(e)}")
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/api/admin/analytics', methods=['GET'])
@login_required
@admin_only
def get_admin_analytics():
    """Get overall system analytics"""
    try:
        all_users = user_manager.get_all_users()

        # Aggregate statistics
        total_users = len(all_users)
        total_assessments = 0
        level_distribution = {'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0, 'Unknown': 0}
        phase2_scores = []
        ai_evaluations_count = 0
        recent_activity = []

        for user in all_users:
            if user.get('is_admin'):
                continue

            user_id = user.get('user_id')

            # Phase 1 data
            phase1_history = assessment_history.get_user_history(user_id)
            total_assessments += len(phase1_history)

            if phase1_history:
                latest_level = phase1_history[0].get('overall_level')
                level_distribution[latest_level or 'Unknown'] += 1

                recent_activity.append({
                    'user': user.get('username'),
                    'type': 'Phase 1 Assessment',
                    'timestamp': phase1_history[0].get('timestamp'),
                    'result': latest_level
                })

            # Phase 2 data
            phase2_progress = assessment_history.get_phase2_progress(user_id)
            if phase2_progress.get('overall_score'):
                phase2_scores.append(phase2_progress.get('overall_score', 0))

            # Count AI evaluations
            for step_data in phase2_progress.get('steps', []):
                for response in step_data.get('responses', []):
                    if response.get('ai_evaluation'):
                        ai_evaluations_count += 1

            for activity in phase2_progress.get('remedial_activities', []):
                if activity.get('ai_evaluation'):
                    ai_evaluations_count += 1

                if activity.get('completed'):
                    recent_activity.append({
                        'user': user.get('username'),
                        'type': 'Remedial Activity',
                        'timestamp': activity.get('timestamp'),
                        'result': f"{activity.get('level')} - Activity {activity.get('activity_index', 0)}"
                    })

        # Sort recent activity by timestamp
        recent_activity.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        recent_activity = recent_activity[:20]  # Top 20

        # Calculate averages
        avg_phase2_score = sum(phase2_scores) / len(phase2_scores) if phase2_scores else 0

        return jsonify({
            "success": True,
            "data": {
                "overview": {
                    'total_users': total_users,
                    'total_assessments': total_assessments,
                    'ai_evaluations_count': ai_evaluations_count,
                    'avg_phase2_score': round(avg_phase2_score, 1)
                },
                "level_distribution": level_distribution,
                "phase2_scores": {
                    'average': round(avg_phase2_score, 1),
                    'count': len(phase2_scores),
                    'scores': phase2_scores
                },
                "recent_activity": recent_activity
            }
        })
    except Exception as e:
        logger.error(f"Error getting analytics: {str(e)}")
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/api/admin/ai-evaluations', methods=['GET'])
@login_required
@admin_only
def get_ai_evaluations():
    """Get all AI evaluations across all students"""
    try:
        all_users = user_manager.get_all_users()
        all_evaluations = []

        for user in all_users:
            if user.get('is_admin'):
                continue

            user_id = user.get('user_id')
            username = user.get('username')

            # Get Phase 2 progress
            phase2_progress = assessment_history.get_phase2_progress(user_id)

            # Extract all responses with AI evaluations
            for step_data in phase2_progress.get('steps', []):
                for response in step_data.get('responses', []):
                    if response.get('ai_evaluation'):
                        all_evaluations.append({
                            'user_id': user_id,
                            'username': username,
                            'context': 'Phase 2 Step Response',
                            'step_id': step_data.get('step_id'),
                            'action_item_id': response.get('action_item_id'),
                            'timestamp': response.get('timestamp'),
                            'response_text': response.get('response'),
                            'score': response.get('score'),
                            'ai_evaluation': response.get('ai_evaluation'),
                            'cefr_level': response.get('cefr_level')
                        })

            # Extract remedial activity AI evaluations
            for activity in phase2_progress.get('remedial_activities', []):
                if activity.get('ai_evaluation'):
                    all_evaluations.append({
                        'user_id': user_id,
                        'username': username,
                        'context': 'Remedial Activity',
                        'step_id': activity.get('step_id'),
                        'level': activity.get('level'),
                        'activity_id': activity.get('activity_id'),
                        'timestamp': activity.get('timestamp'),
                        'responses': activity.get('responses', {}),
                        'score': activity.get('score'),
                        'ai_evaluation': activity.get('ai_evaluation')
                    })

        # Sort by timestamp
        all_evaluations.sort(key=lambda x: x.get('timestamp', ''), reverse=True)

        return jsonify({
            "success": True,
            "data": {
                "evaluations": all_evaluations,
                "total_count": len(all_evaluations)
            }
        })
    except Exception as e:
        logger.error(f"Error getting AI evaluations: {str(e)}")
        return jsonify({"error": str(e)}), 500
