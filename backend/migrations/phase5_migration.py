"""
Database Migration Script for Phase 5 Advanced Features
Creates tables for power-ups, collectibles, avatar customization, and adaptive learning
"""

import sqlite3
from datetime import datetime

def migrate_phase5(db_path='instance/fardi.db'):
    """Run Phase 5 database migrations"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 1. Power-Ups Tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_powerups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                powerup_type VARCHAR(50) NOT NULL,
                quantity INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, powerup_type)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS powerup_usage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                powerup_type VARCHAR(50) NOT NULL,
                activity_id VARCHAR(100),
                used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                effect_data TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        
        # 2. Collectibles Tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS collectibles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                collectible_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                rarity VARCHAR(20) NOT NULL,
                icon VARCHAR(100),
                category VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_collectibles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                collectible_id VARCHAR(50) NOT NULL,
                acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                quantity INTEGER DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (collectible_id) REFERENCES collectibles(collectible_id),
                UNIQUE(user_id, collectible_id)
            )
        ''')
        
        # 3. Avatar Customization Tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS avatar_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                category VARCHAR(50) NOT NULL,
                cost INTEGER NOT NULL,
                icon VARCHAR(100),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_avatar (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                outfit_id VARCHAR(50),
                accessory_id VARCHAR(50),
                background_id VARCHAR(50),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_avatar_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                item_id VARCHAR(50) NOT NULL,
                purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (item_id) REFERENCES avatar_items(item_id),
                UNIQUE(user_id, item_id)
            )
        ''')
        
        # 4. Adaptive Learning Tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS performance_tracking (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                activity_id VARCHAR(100) NOT NULL,
                activity_type VARCHAR(50),
                success_rate FLOAT,
                attempts INTEGER DEFAULT 1,
                last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                mastery_level FLOAT DEFAULT 0.0,
                difficulty_level VARCHAR(20),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS spaced_repetition (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                activity_id VARCHAR(100) NOT NULL,
                next_review_date DATE,
                review_count INTEGER DEFAULT 0,
                ease_factor FLOAT DEFAULT 2.5,
                interval_days INTEGER DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, activity_id)
            )
        ''')
        
        # Create indexes for performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_powerups_user ON user_powerups(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_collectibles_user ON user_collectibles(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_performance_user ON performance_tracking(user_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_powerup_usage_user ON powerup_usage(user_id)')
        
        conn.commit()
        print("✅ Phase 5 database migration completed successfully")
        
        # Seed initial data
        seed_phase5_data(cursor, conn)
        
        return True
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Migration failed: {str(e)}")
        raise
    finally:
        conn.close()


def seed_phase5_data(cursor, conn):
    """Seed initial collectibles and avatar items"""
    
    # Seed Collectibles
    collectibles_data = [
        ('chechia', 'Chechia Hat', 'Traditional Tunisian hat worn by men', 'common', 'chechia.png', 'cultural'),
        ('mosaic_tile', 'Mosaic Tile', 'Beautiful handcrafted mosaic tile', 'uncommon', 'mosaic.png', 'cultural'),
        ('malouf', 'Malouf Instrument', 'Traditional Tunisian musical instrument', 'rare', 'malouf.png', 'cultural'),
        ('carthage_coin', 'Carthage Coin', 'Ancient coin from Carthage era', 'legendary', 'coin.png', 'cultural'),
        ('jasmine', 'Jasmine Flower', 'National flower of Tunisia', 'common', 'jasmine.png', 'nature'),
        ('olive_branch', 'Olive Branch', 'Symbol of peace and prosperity', 'uncommon', 'olive.png', 'nature'),
        ('palm_tree', 'Date Palm', 'Iconic Tunisian palm tree', 'rare', 'palm.png', 'nature'),
        ('medina_key', 'Medina Key', 'Ancient key to the old medina', 'legendary', 'key.png', 'artifact'),
    ]
    
    for collectible in collectibles_data:
        cursor.execute('''
            INSERT OR IGNORE INTO collectibles (collectible_id, name, description, rarity, icon, category)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', collectible)
    
    # Seed Avatar Items
    avatar_items_data = [
        ('traditional_dress', 'Traditional Dress', 'outfit', 500, 'dress_traditional.png', 'Classic Tunisian traditional outfit'),
        ('modern_tunisian', 'Modern Tunisian', 'outfit', 300, 'dress_modern.png', 'Contemporary Tunisian style'),
        ('casual_wear', 'Casual Wear', 'outfit', 100, 'dress_casual.png', 'Everyday casual clothing'),
        ('chechia_acc', 'Chechia', 'accessory', 200, 'acc_chechia.png', 'Traditional Tunisian hat'),
        ('jasmine_acc', 'Jasmine Flower', 'accessory', 100, 'acc_jasmine.png', 'Beautiful jasmine flower'),
        ('necklace', 'Traditional Necklace', 'accessory', 250, 'acc_necklace.png', 'Handcrafted traditional jewelry'),
        ('medina_bg', 'Medina Background', 'background', 400, 'bg_medina.png', 'Historic medina setting'),
        ('beach_bg', 'Sidi Bou Said', 'background', 400, 'bg_beach.png', 'Beautiful coastal town'),
        ('desert_bg', 'Sahara Desert', 'background', 300, 'bg_desert.png', 'Golden desert landscape'),
    ]
    
    for item in avatar_items_data:
        cursor.execute('''
            INSERT OR IGNORE INTO avatar_items (item_id, name, category, cost, icon, description)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', item)
    
    conn.commit()
    print("✅ Seeded collectibles and avatar items")


if __name__ == '__main__':
    migrate_phase5()
