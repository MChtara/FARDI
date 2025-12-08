"""
Initialize gamification database tables
Run this script to add gamification tables to the existing database
"""
import sqlite3
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_gamification_tables():
    """Initialize all gamification tables in the database"""
    db_path = os.path.join(os.path.dirname(__file__), 'fardi.db')

    if not os.path.exists(db_path):
        logger.error(f"Database not found at {db_path}")
        return False

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Read SQL file
    sql_file = os.path.join(os.path.dirname(__file__), 'migrations', 'add_gamification_tables.sql')

    if not os.path.exists(sql_file):
        logger.error(f"SQL migration file not found at {sql_file}")
        return False

    logger.info(f"Reading SQL from {sql_file}")

    with open(sql_file, 'r') as f:
        sql_script = f.read()

    try:
        # Execute the SQL script
        cursor.executescript(sql_script)
        conn.commit()
        logger.info("Successfully created gamification tables")

        # Verify tables were created
        cursor.execute("""
            SELECT name FROM sqlite_master
            WHERE type='table' AND name LIKE '%user_%'
        """)
        tables = cursor.fetchall()
        logger.info(f"Found {len(tables)} gamification tables:")
        for table in tables:
            logger.info(f"  - {table[0]}")

        return True

    except Exception as e:
        logger.error(f"Error creating gamification tables: {e}")
        conn.rollback()
        return False

    finally:
        conn.close()


def verify_gamification_schema():
    """Verify that all required gamification tables exist"""
    db_path = os.path.join(os.path.dirname(__file__), 'fardi.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    required_tables = [
        'user_progression',
        'xp_history',
        'user_achievements',
        'user_streaks',
        'leaderboard_entries',
        'friendships',
        'user_powerups',
        'user_collectibles'
    ]

    missing_tables = []

    for table in required_tables:
        cursor.execute("""
            SELECT name FROM sqlite_master
            WHERE type='table' AND name=?
        """, (table,))
        result = cursor.fetchone()

        if result:
            logger.info(f"[OK] Table '{table}' exists")
        else:
            logger.warning(f"[MISSING] Table '{table}' not found")
            missing_tables.append(table)

    conn.close()

    if missing_tables:
        logger.error(f"Missing {len(missing_tables)} tables: {', '.join(missing_tables)}")
        return False
    else:
        logger.info("All gamification tables present")
        return True


if __name__ == "__main__":
    print("=" * 60)
    print("FARDI Gamification Database Initialization")
    print("=" * 60)
    print()

    # Check if tables already exist
    print("Checking existing schema...")
    exists = verify_gamification_schema()

    if exists:
        print("\nGamification tables already exist!")
        response = input("Do you want to recreate them? This will drop existing data. (yes/no): ")
        if response.lower() != 'yes':
            print("Aborted.")
            exit(0)

        # Drop existing tables
        db_path = os.path.join(os.path.dirname(__file__), 'fardi.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        tables_to_drop = [
            'user_progression', 'xp_history', 'user_achievements', 'user_streaks',
            'leaderboard_entries', 'friendships', 'user_powerups', 'user_collectibles'
        ]

        for table in tables_to_drop:
            try:
                cursor.execute(f"DROP TABLE IF EXISTS {table}")
                print(f"Dropped table: {table}")
            except Exception as e:
                print(f"Error dropping {table}: {e}")

        conn.commit()
        conn.close()
        print()

    # Create tables
    print("Creating gamification tables...")
    success = init_gamification_tables()

    if success:
        print("\n" + "=" * 60)
        print("SUCCESS! Gamification database initialized.")
        print("=" * 60)
        print("\nYou can now:")
        print("  1. Start the Flask application")
        print("  2. Use the gamification API endpoints")
        print("  3. Award XP and track achievements")
    else:
        print("\n" + "=" * 60)
        print("ERROR: Failed to initialize gamification database")
        print("=" * 60)
        exit(1)
