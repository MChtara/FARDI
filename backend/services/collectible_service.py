"""
Collectibles Service
Handles collectible drops, user collections, and rarity system
"""

import random
import sqlite3
from typing import Dict, List, Optional
from datetime import datetime

# Rarity drop rates
DROP_RATES = {
    "common": 0.40,
    "uncommon": 0.30,
    "rare": 0.20,
    "epic": 0.08,
    "legendary": 0.02
}

# Rarity colors for UI
RARITY_COLORS = {
    "common": "#95A5A6",
    "uncommon": "#27AE60",
    "rare": "#3498DB",
    "epic": "#9B59B6",
    "legendary": "#F39C12"
}


class CollectibleService:
    """Service for managing collectibles"""
    
    def __init__(self, db_path='instance/fardi.db'):
        self.db_path = db_path
    
    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def get_all_collectibles(self) -> List[Dict]:
        """Get all available collectibles"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT collectible_id, name, description, rarity, icon, category
            FROM collectibles
            ORDER BY 
                CASE rarity
                    WHEN 'legendary' THEN 1
                    WHEN 'epic' THEN 2
                    WHEN 'rare' THEN 3
                    WHEN 'uncommon' THEN 4
                    WHEN 'common' THEN 5
                END,
                name
        ''')
        
        collectibles = []
        for row in cursor.fetchall():
            collectibles.append({
                "id": row['collectible_id'],
                "name": row['name'],
                "description": row['description'],
                "rarity": row['rarity'],
                "icon": row['icon'],
                "category": row['category'],
                "color": RARITY_COLORS.get(row['rarity'], "#95A5A6")
            })
        
        conn.close()
        return collectibles
    
    def get_user_collection(self, user_id: int) -> Dict:
        """Get user's collectible collection"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get all collectibles with user's ownership status
        cursor.execute('''
            SELECT 
                c.collectible_id,
                c.name,
                c.description,
                c.rarity,
                c.icon,
                c.category,
                uc.quantity,
                uc.acquired_at
            FROM collectibles c
            LEFT JOIN user_collectibles uc ON c.collectible_id = uc.collectible_id AND uc.user_id = ?
            ORDER BY 
                CASE c.rarity
                    WHEN 'legendary' THEN 1
                    WHEN 'epic' THEN 2
                    WHEN 'rare' THEN 3
                    WHEN 'uncommon' THEN 4
                    WHEN 'common' THEN 5
                END,
                c.name
        ''', (user_id,))
        
        collection = []
        total_collectibles = 0
        owned_collectibles = 0
        
        for row in cursor.fetchall():
            total_collectibles += 1
            owned = row['quantity'] is not None and row['quantity'] > 0
            
            if owned:
                owned_collectibles += 1
            
            collection.append({
                "id": row['collectible_id'],
                "name": row['name'],
                "description": row['description'],
                "rarity": row['rarity'],
                "icon": row['icon'],
                "category": row['category'],
                "color": RARITY_COLORS.get(row['rarity'], "#95A5A6"),
                "owned": owned,
                "quantity": row['quantity'] or 0,
                "acquired_at": row['acquired_at']
            })
        
        completion_percentage = (owned_collectibles / total_collectibles * 100) if total_collectibles > 0 else 0
        
        conn.close()
        
        return {
            "collection": collection,
            "total": total_collectibles,
            "owned": owned_collectibles,
            "completion_percentage": round(completion_percentage, 1)
        }
    
    def drop_collectible(self, user_id: int, source: str = "activity") -> Optional[Dict]:
        """
        Award a random collectible to user based on rarity drop rates
        Returns: collectible data if dropped, None if no drop
        """
        # Determine if a collectible drops (80% chance)
        if random.random() > 0.8:
            return None
        
        # Select rarity based on drop rates
        rarity = self._select_rarity()
        
        # Get a random collectible of that rarity
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT collectible_id, name, description, rarity, icon, category
            FROM collectibles
            WHERE rarity = ?
            ORDER BY RANDOM()
            LIMIT 1
        ''', (rarity,))
        
        result = cursor.fetchone()
        
        if not result:
            conn.close()
            return None
        
        collectible_id = result['collectible_id']
        
        # Check if user already has this collectible
        cursor.execute('''
            SELECT quantity FROM user_collectibles
            WHERE user_id = ? AND collectible_id = ?
        ''', (user_id, collectible_id))
        
        existing = cursor.fetchone()
        is_new = existing is None
        
        # Add to user's collection
        cursor.execute('''
            INSERT INTO user_collectibles (user_id, collectible_id, quantity)
            VALUES (?, ?, 1)
            ON CONFLICT(user_id, collectible_id)
            DO UPDATE SET quantity = quantity + 1
        ''', (user_id, collectible_id))
        
        conn.commit()
        conn.close()
        
        return {
            "id": collectible_id,
            "name": result['name'],
            "description": result['description'],
            "rarity": result['rarity'],
            "icon": result['icon'],
            "category": result['category'],
            "color": RARITY_COLORS.get(result['rarity'], "#95A5A6"),
            "is_new": is_new,
            "source": source
        }
    
    def _select_rarity(self) -> str:
        """Select a rarity based on drop rates"""
        rand = random.random()
        cumulative = 0.0
        
        for rarity, rate in DROP_RATES.items():
            cumulative += rate
            if rand <= cumulative:
                return rarity
        
        return "common"  # Fallback
    
    def get_collection_stats(self, user_id: int) -> Dict:
        """Get user's collection statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get counts by rarity
        cursor.execute('''
            SELECT 
                c.rarity,
                COUNT(DISTINCT c.collectible_id) as total,
                COUNT(DISTINCT uc.collectible_id) as owned
            FROM collectibles c
            LEFT JOIN user_collectibles uc ON c.collectible_id = uc.collectible_id AND uc.user_id = ?
            GROUP BY c.rarity
        ''', (user_id,))
        
        stats_by_rarity = {}
        for row in cursor.fetchall():
            stats_by_rarity[row['rarity']] = {
                "total": row['total'],
                "owned": row['owned'],
                "percentage": round((row['owned'] / row['total'] * 100) if row['total'] > 0 else 0, 1)
            }
        
        # Get total stats
        cursor.execute('''
            SELECT COUNT(DISTINCT collectible_id) as total FROM collectibles
        ''')
        total_collectibles = cursor.fetchone()['total']
        
        cursor.execute('''
            SELECT COUNT(DISTINCT collectible_id) as owned
            FROM user_collectibles
            WHERE user_id = ?
        ''', (user_id,))
        owned_collectibles = cursor.fetchone()['owned']
        
        conn.close()
        
        return {
            "total": total_collectibles,
            "owned": owned_collectibles,
            "completion_percentage": round((owned_collectibles / total_collectibles * 100) if total_collectibles > 0 else 0, 1),
            "by_rarity": stats_by_rarity
        }
