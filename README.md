# SoundID - Audio Fingerprinting and Recognition System

A complete audio fingerprinting and music recognition platform built with Python/Flask backend, React frontend, and comprehensive testing with Selenium WebDriver and TestNG.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Testing with Selenium & TestNG](#testing-with-selenium--testng)
- [XSLT Reporting](#xslt-reporting)
- [API Documentation](#api-documentation)
- [Audio Fingerprinting](#audio-fingerprinting)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## Overview

SoundID is a Shazam-inspired music recognition system that uses audio fingerprinting to identify songs from audio files. The system consists of:

- **Backend**: Flask web server with audio fingerprinting using spectral analysis
- **Frontend**: React TypeScript application for user interface
- **Database**: SQLite/MySQL for storing users, songs, fingerprints, and recognition history
- **Testing**: Selenium WebDriver tests with TestNG and data-driven testing
- **Reporting**: XSLT-based HTML reports for TestNG test results

## Tech Stack

### Backend (Python/Flask)
- **Flask**: Web framework
- **Flask-Login**: User authentication with session management
- **Flask-SQLAlchemy**: ORM for database operations
- **Flask-CORS**: CORS support for React frontend
- **librosa**: Audio processing and spectral analysis
- **numpy**: Numerical computations for fingerprinting

### Frontend (React/TypeScript)
- **React 19**: UI library
- **TypeScript**: Type safety
- **React Router**: Navigation
- **TanStack Query**: Data fetching and caching
- **Tailwind CSS**: Styling
- **Vite**: Build tool and dev server

### Testing
- **Selenium WebDriver**: Browser automation
- **TestNG**: Test framework with data-driven testing
- **Maven**: Build and dependency management
- **Apache Ant**: XSLT report generation

### Database
- **SQLite**: Default lightweight database
- **MySQL**: Alternative production database

## Project Structure

```
echo/
├── echo/                          # Backend Flask application
│   ├── app.py                     # Main Flask application
│   ├── audio_fingerprinter.py     # Audio fingerprinting logic
│   ├── models.py                  # SQLAlchemy database models
│   ├── config.py                  # Configuration settings
│   ├── fingerprint/                # Additional fingerprinting modules
│   │   └── recognizer.py          # AudioRecognizer class
│   ├── templates/                 # Flask HTML templates
│   ├── static/                    # Static files
│   ├── songs/                     # Uploaded song files
│   ├── fingerprint_db/             # Fingerprint database
│   ├── uploads/                   # Temporary upload directory
│   └── requirements.txt            # Python dependencies
│
├── client/                        # Frontend React application
│   ├── src/
│   │   ├── app/                   # Router and providers
│   │   │   ├── router.tsx         # React Router configuration
│   │   │   └── provider.tsx       # App providers
│   │   ├── features/              # Feature modules
│   │   │   ├── auth/              # Login & Register
│   │   │   ├── recognize/         # Audio recognition
│   │   │   ├── library/           # Song library
│   │   │   ├── history/           # Recognition history
│   │   │   ├── admin/             # Admin upload
│   │   │   ├── dashboard/         # Dashboard
│   │   │   └── ai/                # AI stories
│   │   ├── contexts/              # React contexts
│   │   │   ├── AuthContext.tsx    # Authentication context
│   │   │   └── ThemeContext.tsx   # Theme context
│   │   ├── lib/                   # Utilities
│   │   │   ├── api.ts             # API client
│   │   │   ├── auth.ts            # Auth utilities
│   │   │   └── audio.ts           # Audio utilities
│   │   ├── components/            # Reusable components
│   │   └── styles/                # Global styles
│   ├── package.json               # Node dependencies
│   ├── vite.config.ts             # Vite configuration
│   └── tailwind.config.ts         # Tailwind configuration
│
├── selenium-tests/                # Selenium WebDriver tests
│   ├── src/test/java/com/echo/
│   │   ├── tests/                 # Test classes
│   │   │   ├── LoginTest.java     # Login tests (data-driven)
│   │   │   ├── RegistrationTest.java # Registration tests (data-driven)
│   │   │   ├── RecognizeTest.java # Recognition tests (data-driven)
│   │   │   ├── LibraryTest.java    # Library tests (data-driven)
│   │   │   └── HistoryTest.java   # History tests (data-driven)
│   │   ├── pages/                 # Page Objects
│   │   │   ├── LoginPage.java
│   │   │   ├── RegisterPage.java
│   │   │   ├── RecognizePage.java
│   │   │   ├── LibraryPage.java
│   │   │   └── HistoryPage.java
│   │   └── BaseTest.java          # Base test class
│   ├── src/test/resources/
│   │   └── testng.xml             # TestNG configuration
│   ├── pom.xml                    # Maven configuration
│   ├── build.xml                  # Ant build for XSLT reports
│   ├── testng-results.xsl         # XSLT stylesheet for reports
│   └── XSLT_REPORTING_SETUP.md    # XSLT reporting guide
│
└── README.md                      # This file
```

## Features

### Core Features
- **User Authentication**: Registration, login, logout with session management
- **Audio Recognition**: Upload audio files (MP3/WAV) for fingerprinting and recognition
- **Song Library**: View all fingerprinted songs with search functionality
- **Recognition History**: Track user's recognition attempts with confidence scores
- **Admin Upload**: Admin-only feature to upload songs with automatic fingerprinting

### Audio Fingerprinting
- Spectral analysis using Short-Time Fourier Transform (STFT)
- Peak detection in frequency domain
- Hash generation from peak pairs for efficient matching
- Confidence-based recognition with configurable thresholds

### Testing
- Data-driven testing with TestNG for multiple test scenarios
- Page Object Model pattern for maintainable tests
- XSLT-based HTML reports for test results
- Comprehensive coverage of authentication, recognition, library, and history features

## Installation

### Prerequisites

**Backend:**
- Python 3.8 or higher
- pip (Python package manager)

**Frontend:**
- Node.js 18 or higher
- npm or yarn

**Testing:**
- Java 11 or higher
- Maven
- Apache Ant (for XSLT reports)

### Backend Setup

```bash
cd echo

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Testing with Selenium & TestNG

### Why Selenium WebDriver?

Selenium WebDriver is used for end-to-end testing to ensure the web application works correctly across different browsers. It simulates real user interactions like clicking buttons, filling forms, and navigating pages.

### Why TestNG?

TestNG is a testing framework that provides:
- **Data-driven testing**: Run tests with multiple data sets using @DataProvider
- **Parallel execution**: Run tests in parallel for faster execution
- **Test configuration**: XML-based configuration for test suites
- **Reporting**: Built-in XML reports that can be transformed with XSLT

### Running Tests

```bash
cd selenium-tests

# Run all tests
mvn clean test

# Run specific test class
mvn test -Dtest=LoginTest

# Run with specific browser (update testng.xml)
mvn test -Dbrowser=chrome
```

### Test Structure

**Data-Driven Testing:**
- `LoginTest.java`: Tests login with multiple valid/invalid credentials
- `RegistrationTest.java`: Tests registration with various data scenarios
- `RecognizeTest.java`: Tests audio recognition with different file types
- `LibraryTest.java`: Tests library search functionality
- `HistoryTest.java`: Tests history filtering options

**Page Object Model:**
- Each page has a corresponding Page Object class
- Encapsulates page elements and actions
- Makes tests maintainable and reusable

## XSLT Reporting

### What is XSLT?

XSLT (Extensible Stylesheet Language Transformations) is used to transform XML documents into other formats like HTML. In this project, XSLT transforms TestNG's XML test results into beautiful HTML reports.

### Why XSLT Reporting?

- **Better visualization**: HTML reports are more readable than raw XML
- **Custom styling**: XSLT allows custom styling and formatting
- **Offline viewing**: Reports can be viewed without internet connection
- **Sharing**: Easy to share reports with stakeholders

### Setting Up XSLT Reports

1. **Install Apache Ant**
   - Download from https://ant.apache.org/
   - Extract to `C:\apache-ant-1.10.14`
   - Add to PATH: `ANT_HOME=C:\apache-ant-1.10.14` and `%ANT_HOME%\bin` to PATH

2. **Run Tests First**
   ```bash
   mvn clean test
   ```
   This generates `test-output/testng-results.xml`

3. **Generate XSLT Report**
   ```bash
   cd selenium-tests
   ant -f build.xml generate-report
   ```
   This generates `test-output/XSLT_Report.html`

4. **View Report**
   Open `test-output/XSLT_Report.html` in your browser

See `selenium-tests/XSLT_REPORTING_SETUP.md` for detailed instructions.

## API Documentation

### Authentication Endpoints

#### POST /login
Login with username and password.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `username`, `password`

**Response (JSON):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "is_admin": true
  }
}
```

#### POST /register
Register a new user.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `username`, `password`

**Response (JSON):**
```json
{
  "message": "Registration successful"
}
```

#### GET /user
Get current authenticated user info (requires login).

**Response (JSON):**
```json
{
  "id": 1,
  "username": "admin",
  "is_admin": true
}
```

#### GET /logout
Logout current user.

### Recognition Endpoints

#### POST /recognize
Upload audio file for recognition.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `audio_file` (MP3 or WAV)

**Response (JSON):**
```json
{
  "song_name": "Song Name",
  "confidence": 0.85,
  "recognized": true
}
```

#### GET /history
Get recognition history for current user (requires login).

**Response (JSON):**
```json
[
  {
    "id": 1,
    "song_name": "Song Name",
    "confidence": 0.85,
    "recognized": true,
    "timestamp": "2024-01-01T12:00:00"
  }
]
```

### Library Endpoints

#### GET /library
Get all fingerprinted songs (requires login).

**Response (JSON):**
```json
[
  {
    "id": 1,
    "name": "Song Name",
    "singer_name": "Artist Name",
    "file_path": "/songs/song.mp3",
    "fingerprinted": true,
    "created_at": "2024-01-01T12:00:00"
  }
]
```

#### POST /admin/upload
Upload song with automatic fingerprinting (admin only).

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `audio_file`, `song_name`, `singer_name`

**Response (JSON):**
```json
{
  "message": "Song 'Song Name' by Artist Name uploaded and fingerprinted successfully!"
}
```

## Audio Fingerprinting

### How It Works

1. **Audio Loading**: Load audio file using librosa
2. **Spectrogram Generation**: Compute Short-Time Fourier Transform (STFT)
3. **Peak Detection**: Find local maxima in the spectrogram
4. **Hash Generation**: Create hash from peak pairs within time windows
5. **Database Matching**: Compare query fingerprint against stored fingerprints
6. **Confidence Scoring**: Calculate match confidence based on peak overlap

### Key Components

**AudioFingerprinter Class** (`audio_fingerprinter.py`):
- `load_audio()`: Load audio file
- `compute_spectrogram()`: Generate spectrogram
- `find_peaks()`: Detect spectral peaks
- `create_fingerprint_hash()`: Generate MD5 hash from peaks
- `match_fingerprints()`: Compare two fingerprints
- `match_with_database()`: Match against database

**AudioRecognizer Class** (`fingerprint/recognizer.py`):
- Feature extraction (MFCC, Chroma, Spectral Contrast, ZCR)
- Fingerprint storage and retrieval
- Similarity-based matching

### Why This Approach?

- **Spectral Analysis**: Robust to noise and compression artifacts
- **Hash-based Matching**: Fast comparison using MD5 hashes
- **Peak Pairs**: Captures temporal and frequency relationships
- **Confidence Scoring**: Provides match quality assessment

## Development

### Backend Development

```bash
cd echo
python app.py
```

The Flask app will run on `http://localhost:5000` with auto-reload enabled.

### Frontend Development

```bash
cd client
npm run dev
```

The React app will run on `http://localhost:5173` with hot module replacement.

### API Proxy Configuration

The Vite dev server is configured to proxy API requests to the Flask backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

This means:
- Frontend calls `/api/user`
- Vite rewrites to `/user` and forwards to Flask backend
- Backend route is `/user` (not `/api/user`)

### CORS Configuration

The Flask backend is configured to accept requests from the React frontend:

```python
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://localhost:3000'])
```

### Adding New Features

**Backend:**
1. Add route in `app.py`
2. Add model in `models.py` if needed
3. Update API client in frontend

**Frontend:**
1. Create feature folder in `src/features/`
2. Add route in `src/app/router.tsx`
3. Create page component
4. Add API methods in `src/lib/api.ts`

**Tests:**
1. Create Page Object in `selenium-tests/src/test/java/com/echo/pages/`
2. Create test class in `selenium-tests/src/test/java/com/echo/tests/`
3. Add to `testng.xml`

## Troubleshooting

### Backend Issues

**Database locked error:**
- Stop the Flask server
- Delete `instance/echo.db` (SQLite database)
- Restart the server (will recreate database)

**Audio processing errors:**
- Ensure librosa is installed: `pip install librosa numpy scipy`
- Check audio file format (MP3 or WAV only)
- Verify file is not corrupted

### Frontend Issues

**CORS errors:**
- Verify backend is running on port 5000
- Check CORS configuration in `app.py`
- Ensure frontend is on allowed origins list

**API errors:**
- Check browser console for error messages
- Verify backend logs for errors
- Ensure user is logged in for protected routes

### Testing Issues

**Selenium tests fail:**
- Ensure Flask backend is running on port 5000
- Check that WebDriver is installed for your browser
- Verify test data in testng.xml

**XSLT report not generating:**
- Ensure Apache Ant is installed and in PATH
- Verify `test-output/testng-results.xml` exists
- Check build.xml configuration

### Common Commands

```bash
# Backend
cd echo
python app.py                    # Start Flask server
pip install -r requirements.txt  # Install dependencies

# Frontend
cd client
npm install                      # Install dependencies
npm run dev                      # Start dev server
npm run build                    # Build for production

# Testing
cd selenium-tests
mvn clean test                   # Run Selenium tests
ant -f build.xml generate-report  # Generate XSLT report
```

## License

ISC

## Contributing

This is a personal project. Feel free to fork and customize for your own use.
