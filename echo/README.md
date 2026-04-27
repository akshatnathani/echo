# SoundID - Audio Recognition Web App

A web-based audio fingerprinting and recognition system inspired by Shazam. Users can upload or record audio clips to identify songs from a local fingerprinted database. All recognized songs are stored and displayed in a library.

## Features

- **User Authentication**: Register, login, and logout with session management
- **Audio Recognition**: Upload audio files (MP3/WAV) to identify songs
- **Song Library**: View all songs in the fingerprint database
- **Recognition History**: Track all your recognition attempts
- **Admin Upload**: Admin users can upload and fingerprint new songs
- **Selenium-Testable**: All interactive elements have unique HTML IDs for automated testing

## Tech Stack

- **Backend**: Python 3.10+, Flask
- **Audio Fingerprinting**: Dejavu
- **Database**: SQLite (default) or MySQL
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Testing**: Selenium WebDriver (Java)

## Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- ffmpeg (required for audio processing)
  - Windows: Download from https://ffmpeg.org/download.html
  - Linux: `sudo apt install ffmpeg`
  - macOS: `brew install ffmpeg`

## Installation

1. **Clone the repository** (if applicable)
   ```bash
   cd echo/echo
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/macOS
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables** (optional)
   Create a `.env` file or set environment variables:
   ```env
   SECRET_KEY=your-secret-key-here
   DATABASE_TYPE=sqlite
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

## Running the Application

1. **Start the Flask server**
   ```bash
   python app.py
   ```

2. **Access the application**
   - Open your browser and navigate to: `http://localhost:5000`

## Default Credentials

- **Admin Username**: `admin`
- **Admin Password**: `admin123`

## Usage

### 1. Register a New Account
- Navigate to `/register`
- Enter a username and password
- Click "Register"

### 2. Login
- Navigate to `/login`
- Enter your credentials
- Click "Login"

### 3. Upload Songs (Admin Only)
- Login as admin
- Navigate to `/admin/upload`
- Enter song name and select audio file (MP3/WAV)
- Click "Upload Song"
- The song will be automatically fingerprinted

### 4. Recognize Audio
- Navigate to `/recognize`
- Upload an audio file (MP3/WAV)
- Click "Recognize"
- View the recognition result

### 5. View Song Library
- Navigate to `/library`
- See all songs in the database
- Check fingerprinting status

### 6. View Recognition History
- Navigate to `/history`
- See all your past recognition attempts
- View timestamps, song names, and confidence scores

## Project Structure

```
echo/
├── app.py                  # Flask app entry point
├── config.py               # DB and app config
├── models.py               # User, History, Song models
├── fingerprint/
│   ├── __init__.py
│   └── recognizer.py       # Dejavu wrapper
├── templates/
│   ├── base.html           # Base template
│   ├── login.html
│   ├── register.html
│   ├── recognize.html
│   ├── library.html
│   ├── history.html
│   └── admin_upload.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── songs/                  # Seeded audio files
├── uploads/                # Uploaded audio for recognition
├── fingerprint_db/         # Dejavu fingerprint database
├── requirements.txt
└── README.md
```

## Selenium Testing

The application is designed to be Selenium-testable with all interactive elements having unique HTML IDs.

### Selenium Test Cases

| Test ID | Description |
|---------|-------------|
| TC-01 | Load login page — assert title contains "Login" |
| TC-02 | Login with valid credentials — assert redirect to `/recognize` |
| TC-03 | Login with invalid credentials — assert error message visible |
| TC-04 | Upload audio file — assert recognition result element appears |
| TC-05 | Navigate to library — assert song list is non-empty |
| TC-06 | Logout — assert redirect to login page |
| TC-07 | Access `/recognize` without login — assert redirect to `/login` |

### Key HTML IDs for Selenium

- `#flash-message` - Flash messages container
- `#login-form` - Login form
- `#username` - Username input
- `#password` - Password input
- `#login-submit` - Login submit button
- `#register-form` - Registration form
- `#recognize-form` - Recognition form
- `#audio_file` - Audio file input
- `#recognize-submit` - Recognition submit button
- `#recognition-result` - Recognition result container
- `#song-library` - Song library list
- `#history-table` - Recognition history table

## Database Configuration

### SQLite (Default)
- No additional setup required
- Database file: `soundid.db`
- Fingerprint database: `fingerprint_db/fingerprints.db`

### MySQL (Optional)
Set environment variables:
```env
DATABASE_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=soundid
```

## Troubleshooting

### Dejavu Installation Issues
If you encounter issues with Dejavu, try using a fork with SQLite support:
```bash
pip install git+https://github.com/worldveil/dejavu.git
```

### FFmpeg Not Found
Ensure ffmpeg is installed and in your system PATH:
```bash
ffmpeg -version
```

### Port Already in Use
If port 5000 is in use, modify the port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

## Development Notes

- The app runs in debug mode by default
- Session persistence is enabled
- Passwords are hashed using Werkzeug's security functions
- All routes except home, login, and register require authentication
- Admin routes require admin privileges

## License

ISC

## Contributing

This is a personal project. Feel to fork and customize for your own use.
