import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DATABASE_TYPE = os.environ.get('DATABASE_TYPE') or 'sqlite'
    
    # SQLite database path
    SQLITE_DB = os.environ.get('SQLITE_DB') or 'soundid.db'
    
    # MySQL configuration (if using MySQL)
    MYSQL_HOST = os.environ.get('MYSQL_HOST') or 'localhost'
    MYSQL_USER = os.environ.get('MYSQL_USER') or 'root'
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD') or ''
    MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE') or 'soundid'
    
    # SQLAlchemy database URI
    if DATABASE_TYPE == 'sqlite':
        SQLALCHEMY_DATABASE_URI = f'sqlite:///{SQLITE_DB}'
    else:
        SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DATABASE}'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Fingerprint database configuration
    FINGERPRINT_DB_DIR = os.environ.get('FINGERPRINT_DB_DIR') or 'fingerprint_db'
    
    # Upload settings
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'mp3', 'wav'}
    
    # Admin credentials
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME') or 'admin'
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD') or 'admin123'
