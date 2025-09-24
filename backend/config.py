"""
Configuration settings for the CEFR assessment game
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    
    # Session configuration
    SESSION_TYPE = 'filesystem'
    SESSION_FILE_DIR = os.path.join(os.path.dirname(__file__), 'sessions')
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    
    # API Keys
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    SAPLING_API_KEY = os.getenv("SAPLING_API_KEY")
    
    # API URLs
    SAPLING_API_URL = "https://api.sapling.ai/api/v1/aidetect"
    
    # Model settings
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    MAX_TOKENS = 10000
    TEMPERATURE = 0.7
    
    # File paths
    STATIC_FOLDER = 'static'
    AUDIO_FOLDER = os.path.join(STATIC_FOLDER, 'audio')
    IMAGES_FOLDER = os.path.join(STATIC_FOLDER, 'images')
    AVATARS_FOLDER = os.path.join(IMAGES_FOLDER, 'avatars')
    
    @staticmethod
    def init_app(app):
        """Initialize application with configuration"""
        # Create necessary directories
        os.makedirs(Config.SESSION_FILE_DIR, exist_ok=True)
        os.makedirs(Config.AUDIO_FOLDER, exist_ok=True)
        os.makedirs(Config.IMAGES_FOLDER, exist_ok=True)
        os.makedirs(Config.AVATARS_FOLDER, exist_ok=True)

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True
    DEBUG = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}