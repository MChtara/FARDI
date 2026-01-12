"""
Avatar Customization Service
Handles avatar items, purchases, and customization
"""

import sqlite3
from typing import Dict, List, Optional


class AvatarService:
    """Service for avatar customization"""
    
    def __init__(self, db_path='instance/fardi.db'):
        self.db_path = db_path
    
    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def get_available_items(self, category: Optional[str] = None) -> List[Dict]:
        """Get all available avatar items, optionally filtered by category"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if category:
            cursor.execute('''
                SELECT item_id, name, category, cost, icon, description
                FROM avatar_items
                WHERE category = ?
                ORDER BY cost ASC
            ''', (category,))
        else:
            cursor.execute('''
                SELECT item_id, name, category, cost, icon, description
                FROM avatar_items
                ORDER BY category, cost ASC
            ''')
        
        items = []
        for row in cursor.fetchall():
            items.append({
                "id": row['item_id'],
                "name": row['name'],
                "category": row['category'],
                "cost": row['cost'],
                "icon": row['icon'],
                "description": row['description']
            })
        
        conn.close()
        return items
    
    def get_user_avatar(self, user_id: int) -> Dict:
        """Get user's current avatar configuration"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT outfit_id, accessory_id, background_id
            FROM user_avatar
            WHERE user_id = ?
        ''', (user_id,))
        
        result = cursor.fetchone()
        
        if not result:
            # Create default avatar
            cursor.execute('''
                INSERT INTO user_avatar (user_id, outfit_id, accessory_id)
                VALUES (?, 'casual_wear', NULL)
            ''', (user_id,))
            conn.commit()
            
            avatar = {
                "outfit_id": "casual_wear",
                "accessory_id": None,
                "background_id": None
            }
        else:
            avatar = {
                "outfit_id": result['outfit_id'],
                "accessory_id": result['accessory_id'],
                "background_id": result['background_id']
            }
        
        conn.close()
        return avatar
    
    def get_user_owned_items(self, user_id: int) -> List[str]:
        """Get list of item IDs owned by user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT item_id FROM user_avatar_items
            WHERE user_id = ?
        ''', (user_id,))
        
        owned_items = [row['item_id'] for row in cursor.fetchall()]
        
        # Add default item
        if 'casual_wear' not in owned_items:
            owned_items.append('casual_wear')
        
        conn.close()
        return owned_items
    
    def purchase_item(self, user_id: int, item_id: str) -> Dict:
        """
        Purchase an avatar item with XP
        Returns: {"success": bool, "message": str}
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Check if item exists
            cursor.execute('''
                SELECT cost, name FROM avatar_items
                WHERE item_id = ?
            ''', (item_id,))
            
            item = cursor.fetchone()
            
            if not item:
                return {"success": False, "message": "Item not found"}
            
            cost = item['cost']
            item_name = item['name']
            
            # Check if user already owns it
            cursor.execute('''
                SELECT 1 FROM user_avatar_items
                WHERE user_id = ? AND item_id = ?
            ''', (user_id, item_id))
            
            if cursor.fetchone():
                return {"success": False, "message": "You already own this item"}
            
            # Check user's XP
            cursor.execute('''
                SELECT total_xp FROM gamification_progression
                WHERE user_id = ?
            ''', (user_id,))
            
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
            
            # Add item to user's inventory
            cursor.execute('''
                INSERT INTO user_avatar_items (user_id, item_id)
                VALUES (?, ?)
            ''', (user_id, item_id))
            
            conn.commit()
            
            return {
                "success": True,
                "message": f"Purchased {item_name}!",
                "new_balance": new_xp,
                "item_id": item_id
            }
            
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": f"Purchase failed: {str(e)}"}
        finally:
            conn.close()
    
    def customize_avatar(self, user_id: int, outfit_id: Optional[str] = None,
                        accessory_id: Optional[str] = None,
                        background_id: Optional[str] = None) -> Dict:
        """
        Update user's avatar customization
        Returns: {"success": bool, "message": str}
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Get owned items
            owned_items = self.get_user_owned_items(user_id)
            
            # Validate ownership
            if outfit_id and outfit_id not in owned_items:
                return {"success": False, "message": "You don't own this outfit"}
            
            if accessory_id and accessory_id not in owned_items:
                return {"success": False, "message": "You don't own this accessory"}
            
            if background_id and background_id not in owned_items:
                return {"success": False, "message": "You don't own this background"}
            
            # Update avatar
            cursor.execute('''
                INSERT INTO user_avatar (user_id, outfit_id, accessory_id, background_id)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(user_id)
                DO UPDATE SET 
                    outfit_id = COALESCE(?, outfit_id),
                    accessory_id = COALESCE(?, accessory_id),
                    background_id = COALESCE(?, background_id),
                    updated_at = CURRENT_TIMESTAMP
            ''', (user_id, outfit_id, accessory_id, background_id,
                  outfit_id, accessory_id, background_id))
            
            conn.commit()
            
            return {
                "success": True,
                "message": "Avatar updated successfully!",
                "avatar": {
                    "outfit_id": outfit_id,
                    "accessory_id": accessory_id,
                    "background_id": background_id
                }
            }
            
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": f"Update failed: {str(e)}"}
        finally:
            conn.close()
