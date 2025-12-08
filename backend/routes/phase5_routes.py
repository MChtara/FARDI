"""
Phase 5 Advanced Features API Routes
Power-ups, Collectibles, Avatar Customization, and Adaptive Learning
"""

from flask import Blueprint, request, jsonify
from routes.auth_routes import login_required
from services.powerup_service import PowerUpService
from services.collectible_service import CollectibleService
from services.avatar_service import AvatarService
from services.adaptive_service import AdaptiveService

# Create blueprint
phase5_bp = Blueprint('phase5', __name__, url_prefix='/api/phase5')

# Initialize services
powerup_service = PowerUpService()
collectible_service = CollectibleService()
avatar_service = AvatarService()
adaptive_service = AdaptiveService()


# ============================================================
# POWER-UPS ENDPOINTS
# ============================================================

@phase5_bp.route('/powerups', methods=['GET'])
@login_required
def get_powerups():
    """Get all available power-ups"""
    try:
        powerups = powerup_service.get_available_powerups()
        return jsonify({"success": True, "powerups": powerups})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/powerups/inventory', methods=['GET'])
@login_required
def get_powerup_inventory():
    """Get user's power-up inventory"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        inventory = powerup_service.get_user_inventory(user_id)
        active_effects = powerup_service.get_active_effects(user_id)
        
        return jsonify({
            "success": True,
            "inventory": inventory,
            "active_effects": active_effects
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/powerups/purchase', methods=['POST'])
@login_required
def purchase_powerup():
    """Purchase a power-up with XP"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        powerup_type = data.get('powerup_type')
        
        if not powerup_type:
            return jsonify({"success": False, "message": "Power-up type required"}), 400
        
        result = powerup_service.purchase_powerup(user_id, powerup_type)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/powerups/use', methods=['POST'])
@login_required
def use_powerup():
    """Use a power-up"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        powerup_type = data.get('powerup_type')
        activity_id = data.get('activity_id')
        
        if not powerup_type:
            return jsonify({"success": False, "message": "Power-up type required"}), 400
        
        result = powerup_service.use_powerup(user_id, powerup_type, activity_id)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================
# COLLECTIBLES ENDPOINTS
# ============================================================

@phase5_bp.route('/collectibles', methods=['GET'])
@login_required
def get_all_collectibles():
    """Get all available collectibles"""
    try:
        collectibles = collectible_service.get_all_collectibles()
        return jsonify({"success": True, "collectibles": collectibles})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/collectibles/collection', methods=['GET'])
@login_required
def get_user_collection():
    """Get user's collectible collection"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        collection_data = collectible_service.get_user_collection(user_id)
        stats = collectible_service.get_collection_stats(user_id)
        
        return jsonify({
            "success": True,
            **collection_data,
            "stats": stats
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/collectibles/drop', methods=['POST'])
@login_required
def drop_collectible():
    """Award a random collectible (called after activity completion)"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        source = data.get('source', 'activity')
        
        collectible = collectible_service.drop_collectible(user_id, source)
        
        if collectible:
            return jsonify({
                "success": True,
                "dropped": True,
                "collectible": collectible
            })
        else:
            return jsonify({
                "success": True,
                "dropped": False,
                "message": "No collectible dropped this time"
            })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================
# AVATAR ENDPOINTS
# ============================================================

@phase5_bp.route('/avatar/items', methods=['GET'])
@login_required
def get_avatar_items():
    """Get available avatar items"""
    try:
        category = request.args.get('category')
        items = avatar_service.get_available_items(category)
        
        return jsonify({"success": True, "items": items})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/avatar', methods=['GET'])
@login_required
def get_user_avatar():
    """Get user's current avatar"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        avatar = avatar_service.get_user_avatar(user_id)
        owned_items = avatar_service.get_user_owned_items(user_id)
        
        return jsonify({
            "success": True,
            "avatar": avatar,
            "owned_items": owned_items
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/avatar/purchase', methods=['POST'])
@login_required
def purchase_avatar_item():
    """Purchase an avatar item"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        item_id = data.get('item_id')
        
        if not item_id:
            return jsonify({"success": False, "message": "Item ID required"}), 400
        
        result = avatar_service.purchase_item(user_id, item_id)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/avatar/customize', methods=['POST'])
@login_required
def customize_avatar():
    """Update user's avatar customization"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        outfit_id = data.get('outfit_id')
        accessory_id = data.get('accessory_id')
        background_id = data.get('background_id')
        
        result = avatar_service.customize_avatar(user_id, outfit_id, accessory_id, background_id)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================
# ADAPTIVE LEARNING ENDPOINTS
# ============================================================

@phase5_bp.route('/adaptive/performance', methods=['GET'])
@login_required
def get_performance_summary():
    """Get user's overall performance summary"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        summary = adaptive_service.get_performance_summary(user_id)
        
        return jsonify({"success": True, **summary})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/adaptive/track', methods=['POST'])
@login_required
def track_performance():
    """Track performance on an activity"""
    try:
        from flask import session
        user_id = session.get('user_id')
        data = request.get_json()
        
        activity_id = data.get('activity_id')
        success = data.get('success', False)
        score = data.get('score', 0.0)
        activity_type = data.get('activity_type', 'remedial')
        
        if not activity_id:
            return jsonify({"success": False, "message": "Activity ID required"}), 400
        
        result = adaptive_service.track_performance(user_id, activity_id, success, score, activity_type)
        
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@phase5_bp.route('/adaptive/review', methods=['GET'])
@login_required
def get_review_activities():
    """Get activities due for review (spaced repetition)"""
    try:
        from flask import session
        user_id = session.get('user_id')
        
        activities = adaptive_service.get_activities_for_review(user_id)
        
        return jsonify({
            "success": True,
            "activities": activities,
            "count": len(activities)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
