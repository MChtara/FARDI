"""
Power-Up Service
Handles power-up purchases, inventory management, and usage
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
import sqlite3

# Power-Up Definitions
POWERUPS = {
    "hint_token": {
        "name": "Hint Token",
        "description": "Reveal one answer in an activity",
        "cost": 50,
        "icon": "💡",
        "effect": "reveal_answer",
        "category": "assistance"
    },
    "time_freeze": {
        "name": "Time Freeze",
        "description": "Pause the timer for 30 seconds",
        "cost": 100,
        "icon": "⏸️",
        "effect": "pause_timer_30",
        "category": "time"
    },
    "double_xp": {
        "name": "Double XP",
        "description": "Earn 2x XP for 1 hour",
        "cost": 150,
        "icon": "⭐",
        "effect": "2x_xp_1_hour",
        "category": "boost"
    },
    "skip_ticket": {
        "name": "Skip Ticket",
        "description": "Skip one activity (1 per day limit)",
        "cost": 200,
        "icon": "⏭️",
        "effect": "skip_activity",
        "category": "progression",
        "daily_limit": 1
    }
}


class PowerUpService:
    """Service for managing user power-ups"""
    
    def __init__(self, db_path='instance/fardi.db'):
        self.db_path = db_path
    
    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def get_available_powerups(self) -> List[Dict]:
        """Get list of all available power-ups"""
        powerups_list = []
        for powerup_id, powerup_data in POWERUPS.items():
            powerups_list.append({
                "id": powerup_id,
                **powerup_data
            })
        return powerups_list
    
    def get_user_inventory(self, user_id: int) -> Dict[str, int]:
        """Get user's power-up inventory"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT powerup_type, quantity
            FROM user_powerups
            WHERE user_id = ?
        ''', (user_id,))
        
        inventory = {}
        for row in cursor.fetchall():
            inventory[row['powerup_type']] = row['quantity']
        
        conn.close()
        return inventory
    
    def purchase_powerup(self, user_id: int, powerup_type: str) -> Dict:
        """
        Purchase a power-up with XP
        Returns: {"success": bool, "message": str, "new_balance": int}
        """
        if powerup_type not in POWERUPS:
            return {"success": False, "message": "Invalid power-up type"}
        
        powerup = POWERUPS[powerup_type]
        cost = powerup["cost"]
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Get user's current XP
            cursor.execute('SELECT total_xp FROM gamification_progression WHERE user_id = ?', (user_id,))
            result = cursor.fetchone()
            
            if not result:
                return {"success": False, "message": "User progression not found"}
            
            current_xp = result['total_xp']
            
            if current_xp < cost:
                return {
                    "success": False,
                    "message": f"Insufficient XP. Need {cost} XP, have {current_xp} XP",
                    "current_xp": current_xp,
                    "cost": cost
                }
            
            # Deduct XP
            new_xp = current_xp - cost
            cursor.execute('''
                UPDATE gamification_progression
                SET total_xp = ?
                WHERE user_id = ?
            ''', (new_xp, user_id))
            
            # Add power-up to inventory
            cursor.execute('''
                INSERT INTO user_powerups (user_id, powerup_type, quantity)
                VALUES (?, ?, 1)
                ON CONFLICT(user_id, powerup_type)
                DO UPDATE SET quantity = quantity + 1, updated_at = CURRENT_TIMESTAMP
            ''', (user_id, powerup_type))
            
            conn.commit()
            
            return {
                "success": True,
                "message": f"Purchased {powerup['name']}!",
                "new_balance": new_xp,
                "powerup": powerup
            }
            
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": f"Purchase failed: {str(e)}"}
        finally:
            conn.close()
    
    def use_powerup(self, user_id: int, powerup_type: str, activity_id: Optional[str] = None) -> Dict:
        """
        Use a power-up
        Returns: {"success": bool, "message": str, "effect": str}
        """
        if powerup_type not in POWERUPS:
            return {"success": False, "message": "Invalid power-up type"}
        
        powerup = POWERUPS[powerup_type]
        
        # Check daily limit for skip tickets
        if powerup_type == "skip_ticket":
            if not self._check_daily_limit(user_id, powerup_type):
                return {"success": False, "message": "Daily limit reached for skip tickets"}
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Check if user has the power-up
            cursor.execute('''
                SELECT quantity FROM user_powerups
                WHERE user_id = ? AND powerup_type = ?
            ''', (user_id, powerup_type))
            
            result = cursor.fetchone()
            
            if not result or result['quantity'] <= 0:
                return {"success": False, "message": "You don't have this power-up"}
            
            # Deduct from inventory
            cursor.execute('''
                UPDATE user_powerups
                SET quantity = quantity - 1, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ? AND powerup_type = ?
            ''', (user_id, powerup_type))
            
            # Record usage
            cursor.execute('''
                INSERT INTO powerup_usage (user_id, powerup_type, activity_id, effect_data)
                VALUES (?, ?, ?, ?)
            ''', (user_id, powerup_type, activity_id, powerup['effect']))
            
            conn.commit()
            
            return {
                "success": True,
                "message": f"Used {powerup['name']}!",
                "effect": powerup['effect'],
                "powerup": powerup
            }
            
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": f"Usage failed: {str(e)}"}
        finally:
            conn.close()
    
    def _check_daily_limit(self, user_id: int, powerup_type: str) -> bool:
        """Check if user has exceeded daily limit for a power-up"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        today = datetime.now().date()
        cursor.execute('''
            SELECT COUNT(*) as count
            FROM powerup_usage
            WHERE user_id = ? AND powerup_type = ?
            AND DATE(used_at) = ?
        ''', (user_id, powerup_type, today))
        
        result = cursor.fetchone()
        conn.close()
        
        daily_limit = POWERUPS[powerup_type].get('daily_limit', 999)
        return result['count'] < daily_limit
    
    def get_active_effects(self, user_id: int) -> List[Dict]:
        """Get currently active power-up effects (e.g., double XP)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get double XP usage in last hour
        one_hour_ago = datetime.now() - timedelta(hours=1)
        cursor.execute('''
            SELECT powerup_type, used_at, effect_data
            FROM powerup_usage
            WHERE user_id = ? AND powerup_type = 'double_xp'
            AND used_at > ?
            ORDER BY used_at DESC
            LIMIT 1
        ''', (user_id, one_hour_ago))
        
        active_effects = []
        result = cursor.fetchone()
        
        if result:
            used_at = datetime.fromisoformat(result['used_at'])
            expires_at = used_at + timedelta(hours=1)
            
            if datetime.now() < expires_at:
                active_effects.append({
                    "type": "double_xp",
                    "name": "Double XP",
                    "multiplier": 2.0,
                    "expires_at": expires_at.isoformat(),
                    "remaining_seconds": int((expires_at - datetime.now()).total_seconds())
                })
        
        conn.close()
        return active_effects
