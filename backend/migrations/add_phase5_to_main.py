"""
Add Phase 5 tables to main fardi.db
"""

import sqlite3

def migrate_phase5_to_main_db():
    """Add Phase 5 tables to backend/fardi.db"""
    conn = sqlite3.connect('fardi.db')
    cursor = conn.cursor()
    
    try:
        # Phase 5 tables
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
        
        # Update user_powerups to match Phase 5 schema
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_powerups_new (
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
        
        # Copy data if old table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='user_powerups'")
        if cursor.fetchone():
            cursor.execute('INSERT OR IGNORE INTO user_powerups_new SELECT * FROM user_powerups')
            cursor.execute('DROP TABLE user_powerups')
        
        cursor.execute('ALTER TABLE user_powerups_new RENAME TO user_powerups')
        
        # Update user_collectibles to match Phase 5 schema
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_collectibles_new (
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
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='user_collectibles'")
        if cursor.fetchone():
            cursor.execute('INSERT OR IGNORE INTO user_collectibles_new SELECT * FROM user_collectibles')
            cursor.execute('DROP TABLE user_collectibles')
        
        cursor.execute('ALTER TABLE user_collectibles_new RENAME TO user_collectibles')
        
        # Seed collectibles
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
        
        # Seed avatar items
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
        print("✅ Phase 5 tables added to fardi.db successfully")
        print("✅ Seeded collectibles and avatar items")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Migration failed: {str(e)}")
        raise
    finally:
        conn.close()

if __name__ == '__main__':
    migrate_phase5_to_main_db()
