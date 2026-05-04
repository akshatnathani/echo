"""
Echo - Audio Recognition Web Application
=============================================

A Flask-based web application for audio fingerprinting and music recognition.
Uses spectral analysis to generate fingerprints and match songs from a database.

Features:
- User authentication (login/register/logout)
- Audio file upload and recognition
- Song library management
- Recognition history tracking
- Admin song upload with automatic fingerprinting

Routes:
- /: Home page
- /login: User login
- /register: User registration
- /logout: User logout
- /recognize: Audio upload and recognition
- /library: View all fingerprinted songs
- /history: View recognition history
- /admin/upload: Admin song upload and fingerprinting

Dependencies:
- Flask: Web framework
- Flask-Login: User authentication
- Flask-SQLAlchemy: Database ORM
- Flask-CORS: CORS support
- librosa: Audio processing
- numpy: Numerical computations

Author: Echo Team
Version: 1.0.0
"""

from flask import Flask, request, redirect, session, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import logging
from datetime import datetime
from config import Config
from models import db, User, RecognitionHistory, Song, AudioFingerprint

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for React frontend
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://localhost:3000'])

# Initialize database
db.init_app(app)

# Initialize login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'

@login_manager.user_loader
def load_user(user_id):
    """Load user by ID for Flask-Login."""
    try:
        return db.session.get(User, int(user_id))
    except Exception as e:
        logger.error(f"Error loading user {user_id}: {e}")
        return None

# Create tables
with app.app_context():
    try:
        db.create_all()
        logger.info("Database tables created successfully")
        
        # Create admin user if not exists
        admin = User.query.filter_by(username=app.config['ADMIN_USERNAME']).first()
        if not admin:
            admin = User(username=app.config['ADMIN_USERNAME'], is_admin=True)
            admin.set_password(app.config['ADMIN_PASSWORD'])
            db.session.add(admin)
            db.session.commit()
            logger.info("Admin user created successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")

# Ensure directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('songs', exist_ok=True)
os.makedirs('downloaded_songs', exist_ok=True)
logger.info("Required directories created/verified")

def allowed_file(filename):
    """Check if file has allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Routes
@app.route('/')
def home():
    """Redirect to React frontend."""
    return redirect('http://localhost:5173/')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login - API only, no templates."""
    try:
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            
            if not username or not password:
                return jsonify({'error': 'Username and password are required'}), 400
            
            user = User.query.filter_by(username=username).first()
            
            if user and user.check_password(password):
                login_user(user)
                logger.info(f"User {username} logged in successfully")
                return jsonify({'message': 'Login successful', 'user': {'id': user.id, 'username': user.username, 'is_admin': user.is_admin}})
            else:
                logger.warning(f"Failed login attempt for username: {username}")
                return jsonify({'error': 'Invalid username or password'}), 401
        
        # GET request - redirect to React frontend
        return redirect('http://localhost:5173/login')
    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify({'error': 'An error occurred during login'}), 500

@app.route('/register', methods=['GET', 'POST'])
def register():
    """Handle user registration - API only, no templates."""
    try:
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            
            if not username or not password:
                return jsonify({'error': 'Username and password are required'}), 400
            
            if len(username) < 3:
                return jsonify({'error': 'Username must be at least 3 characters long'}), 400
            
            if len(password) < 6:
                return jsonify({'error': 'Password must be at least 6 characters long'}), 400
            
            if User.query.filter_by(username=username).first():
                logger.warning(f"Registration attempt with existing username: {username}")
                return jsonify({'error': 'Username already exists'}), 400
            
            user = User(username=username)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
            
            logger.info(f"New user registered: {username}")
            return jsonify({'message': 'Registration successful'})
        
        # GET request - redirect to React frontend
        return redirect('http://localhost:5173/register')
    except Exception as e:
        logger.error(f"Error during registration: {e}")
        db.session.rollback()
        return jsonify({'error': 'An error occurred during registration'}), 500

@app.route('/logout')
@login_required
def logout():
    """Handle user logout."""
    logout_user()
    return redirect('http://localhost:5173/login')

@app.route('/user')
@login_required
def get_current_user():
    """Get current authenticated user info for API calls."""
    try:
        return jsonify({
            'id': current_user.id,
            'username': current_user.username,
            'is_admin': current_user.is_admin
        })
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        return jsonify({'error': 'Failed to get user info'}), 500

@app.route('/recognize', methods=['GET', 'POST'])
@login_required
def recognize():
    """Handle audio file upload and recognition."""
    try:
        if request.method == 'POST':
            if 'audio_file' not in request.files:
                logger.warning("Recognition attempt without file upload")
                return jsonify({'error': 'No file uploaded'}), 400
            
            file = request.files['audio_file']
            if file.filename == '':
                logger.warning("Recognition attempt with empty filename")
                return jsonify({'error': 'No file selected'}), 400
            
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                logger.info(f"Audio file uploaded for recognition: {filename}")
                
                # Perform recognition using new fingerprinting system
                from audio_fingerprinter import AudioFingerprinter
                fingerprinter = AudioFingerprinter()
                
                try:
                    fingerprint_data = fingerprinter.generate_fingerprint(filepath)
                    query_peaks = fingerprint_data['peaks']
                    logger.info(f"Fingerprint generated with {fingerprint_data.get('num_peaks', 0)} peaks")
                    
                    # Load all fingerprints from database
                    db_fingerprints = []
                    fingerprints = AudioFingerprint.query.all()
                    for fp in fingerprints:
                        db_fingerprints.append({
                            'id': fp.id,
                            'song_id': fp.song_id,
                            'fingerprint_hash': fp.fingerprint_hash,
                            'peaks': json.loads(fp.peaks),
                            'duration': fp.duration,
                            'sample_rate': fp.sample_rate
                        })
                    
                    logger.info(f"Loaded {len(db_fingerprints)} fingerprints from database")
                    
                    # Match against database
                    matches = fingerprinter.match_with_database(query_peaks, db_fingerprints)
                    
                    if matches:
                        best_match = matches[0]
                        song = Song.query.get(best_match['song_id'])
                        song_name = song.name if song else "Unknown"
                        confidence = best_match['confidence']
                        recognized = True
                        logger.info(f"Song recognized: {song_name} with confidence {confidence:.2f}")
                    else:
                        song_name = "Unknown"
                        confidence = 0.0
                        recognized = False
                        logger.info("No match found in database")
                    
                    # Save to history
                    history = RecognitionHistory(
                        user_id=current_user.id,
                        song_name=song_name,
                        confidence=confidence,
                        recognized=recognized
                    )
                    db.session.add(history)
                    db.session.commit()
                    
                    return jsonify({
                        'song_name': song_name,
                        'confidence': confidence,
                        'recognized': recognized
                    })
                except Exception as e:
                    logger.error(f"Recognition failed for {filename}: {e}")
                    return jsonify({'error': f'Recognition failed: {str(e)}'}), 500
            else:
                logger.warning(f"Invalid file type uploaded: {file.filename}")
                return jsonify({'error': 'Invalid file type. Please upload MP3 or WAV.'}), 400
        
        # GET request - redirect to React frontend
        return redirect('http://localhost:5173/recognize')
    except Exception as e:
        logger.error(f"Error in recognize route: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/library')
@login_required
def library():
    """Get all fingerprinted songs from the library."""
    try:
        songs = Song.query.filter_by(fingerprinted=True).all()
        logger.info(f"Library requested by user {current_user.id}: {len(songs)} songs found")
        return jsonify([{
            'id': song.id,
            'name': song.name,
            'singer_name': song.singer_name,
            'file_path': song.file_path,
            'fingerprinted': song.fingerprinted,
            'created_at': song.created_at.isoformat() if song.created_at else None
        } for song in songs])
    except Exception as e:
        logger.error(f"Error fetching library: {e}", exc_info=True)
        return jsonify({'error': 'Failed to fetch library'}), 500

@app.route('/history')
@login_required
def history():
    """Get recognition history for the current user."""
    try:
        user_history = RecognitionHistory.query.filter_by(
            user_id=current_user.id
        ).order_by(RecognitionHistory.timestamp.desc()).all()
        logger.info(f"History requested by user {current_user.id}: {len(user_history)} entries")
        return jsonify([{
            'id': h.id,
            'song_name': h.song_name,
            'confidence': h.confidence,
            'recognized': h.recognized,
            'timestamp': h.timestamp.isoformat() if h.timestamp else None
        } for h in user_history])
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        return jsonify({'error': 'Failed to fetch history'}), 500

@app.route('/admin/upload', methods=['GET', 'POST'])
@login_required
def admin_upload():
    """Handle admin song upload and fingerprinting."""
    try:
        if not current_user.is_admin:
            logger.warning(f"Non-admin user {current_user.id} attempted to access admin upload")
            return jsonify({'error': 'Access denied. Admin only.'}), 403
        
        if request.method == 'POST':
            if 'audio_file' not in request.files:
                return jsonify({'error': 'No file uploaded'}), 400
            
            file = request.files['audio_file']
            song_name = request.form.get('song_name')
            singer_name = request.form.get('singer_name')
            
            if not song_name:
                return jsonify({'error': 'Song name is required'}), 400
            
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join('songs', filename)
                file.save(filepath)
                logger.info(f"Admin {current_user.id} uploading song: {song_name} by {singer_name}")
                
                # Check for duplicate
                existing_song = Song.query.filter_by(name=song_name, singer_name=singer_name).first()
                if existing_song:
                    logger.warning(f"Duplicate song upload attempt: {song_name} by {singer_name}")
                    return jsonify({'error': 'This song by this singer already exists in the library.'}), 400
                
                # Save song to database
                song = Song(name=song_name, singer_name=singer_name, file_path=filepath)
                db.session.add(song)
                db.session.commit()
                
                # Fingerprint the song using new system
                from audio_fingerprinter import AudioFingerprinter
                fingerprinter = AudioFingerprinter()
                
                try:
                    fingerprint_data = fingerprinter.generate_fingerprint(filepath)
                    logger.info(f"Fingerprint generated for {song_name}: {fingerprint_data.get('num_peaks', 0)} peaks")
                    
                    audio_fp = AudioFingerprint(
                        song_id=song.id,
                        fingerprint_hash=fingerprint_data['fingerprint_hash'],
                        peaks=json.dumps(fingerprint_data['peaks']),
                        duration=fingerprint_data['duration'],
                        sample_rate=fingerprint_data['sample_rate']
                    )
                    db.session.add(audio_fp)
                    song.fingerprinted = True
                    db.session.commit()
                    
                    logger.info(f"Song '{song_name}' by {singer_name} uploaded and fingerprinted successfully")
                    return jsonify({'message': f'Song "{song_name}" by {singer_name} uploaded and fingerprinted successfully!'})
                except Exception as e:
                    logger.error(f"Fingerprinting failed for {song_name}: {e}")
                    db.session.rollback()
                    return jsonify({'message': f'Song "{song_name}" by {singer_name} uploaded but fingerprinting failed: {str(e)}'})
            else:
                return jsonify({'error': 'Invalid file type. Please upload MP3 or WAV.'}), 400
        
        # GET request - redirect to React frontend
        return redirect('http://localhost:5173/admin/upload')
    except Exception as e:
        logger.error(f"Error in admin upload: {e}")
        return jsonify({'error': 'An unexpected error occurred during upload'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
