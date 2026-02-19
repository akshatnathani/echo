# Echoic - AI-Powered Music Recognition Platform

A Shazam-inspired music recognition app with advanced features including:
- 🎵 AI-powered music identification
- 🗺️ Global echo map showing what music people are discovering worldwide
- 📻 Live radio stations from around the world
- 🎨 Visual mood-based music exploration

## Features

### 1. **Registration & Authentication**
- User registration with email and password
- OAuth integration (Google, Spotify)
- Secure session management

### 2. **Music Identification (Home Page)**
- Tap to listen and identify music playing around you
- AI-powered recognition engine
- Display track details: name, artist, album, genre, BPM
- Match percentage indicator
- Add tracks to your library

### 3. **Sonic Map**
- Interactive visualization of global music echoes
- Filter by BPM range and vibe tags (Dreamy, Ethereal, Dark, etc.)
- See what music people are discovering in real-time
- Mood quadrants: Energetic/Calm × Positive/Melancholic
- AI-powered recommendations based on listening history

### 4. **Trending Echoes**
- Live feed of most popular tracks by location
- World map with pulse indicators showing activity
- Statistics: active listeners, countries mapped

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Tailwind CSS** for styling
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **Express Validator** for input validation
- **CORS** with whitelist protection

## Security Features ⚡

✅ **Password Security**: Bcrypt hashing with salt  
✅ **JWT Authentication**: Secure token-based auth  
✅ **Input Validation**: Express-validator on all endpoints  
✅ **Rate Limiting**: Protection against brute force  
✅ **CORS Protection**: Whitelist-based origins  
✅ **Security Headers**: Helmet.js implementation  
✅ **Error Handling**: Global error middleware  
✅ **Environment Validation**: Required vars checked on startup  

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- npm or yarn

### Installation

**Quick Setup (Windows PowerShell):**
```powershell
# Run the automated setup script
.\setup.ps1
```

**Manual Setup:**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd echo
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env and configure:
   # - MongoDB URI (local or Atlas)
   # - JWT secret (generate secure 32+ char string)
   # - Allowed origins for CORS
   
   # Start the server
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   
   # The .env file is already configured for local development
   
   # Start the development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## Project Structure

```
echo/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── app/            # Router and providers
│   │   ├── features/       # Feature-based modules
│   │   │   ├── auth/       # Login & Registration
│   │   │   ├── identify/   # Music identification (Home)
│   │   │   └── map/        # Sonic Map visualization
│   │   ├── lib/            # Utilities and API client
│   │   ├── components/     # Reusable UI components
│   │   └── styles/         # Global styles
│   └── package.json
│
└── server/                  # Backend Node.js application
    ├── models/             # MongoDB models
    │   ├── User.js
    │   └── Echo.js (rate limited: 5/15min)
- `POST /api/auth/login` - User login (rate limited: 5/15min)

### Music Identification
- `POST /api/identify` - Identify music from audio sample (rate limited: 10/min, JWT optional)

### Echoes
- `GET /api/echoes` - Get all recent echoes (JWT optional)
- `GET /api/echoes/nearby` - Get echoes near a location (JWT optional)

### Health
- `GET /health` - Server health check
## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login

### Music Identification
- `POST /api/identify` - Identify music from audio sample

### Echoes
- `GET /api/echoes` - Get all recent echoes
- `GET /api/echoes/nearby` - Get echoes near a location

## Environment Variables

### Server (.env)
```envsecure_random_string_min_32_characters
JWT_EXPIRE=7d
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Generate secure JWT secret:**
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# PowerShell
[CJWT-based authentication with bcrypt password hashing
- Secure token storage in localStorage
- Simulated audio capture
- Mock geolocation data
- Rate limiting on all endpoints
- Input validation and sanitization

### Production Considerations
1. **Security** ✅ IMPLEMENTED
   - ✅ Hash passwords using bcrypt
   - ✅ Implement JWT authentication
   - ✅ Add rate limiting
   - ✅ Secure CORS configuration
   - ✅ Input validation and sanitization
   - ✅ Security headers (Helmet)
   - ⚠️ Consider refresh tokens
   - ⚠️ Add CAPTCHA for registration

2. **Music Recognition**
   - Integrate with actual music recognition APIs (AudD, ACRCloud, etc.)
   - Implement actual audio capture and processing
   - Add fingerprinting algorithm

3. **Geolocation**
   - Use browser Geolocation API
   - Implement IP-based fallback
   - Add location permission handling

4. **Database**
   - ✅ Add indexes for performance
   - ✅ Implement data validation
   - Set up backup strategy
   - Add database migrations

5. **Features to Add**
   - User playlists
   - Social features (follow users, share tracks)
   - Radio station streaming
   - AI-generated music stories
   - Search functionality
   - User profiles
   - Refresh token rotationeolocation API
   - Implement IP-based fallback
   - Add location permission handling

4. **Database**
   - Add indexes for performance
   - Implement data validation
   - Set up backup strategy

5. **Features to Add**
   - User playlists
   - Social features (follow users, share tracks)
   - Radio station streaming
   - AI-generated music stories
   - Search functionality
   - User profiles (auto-reload)
npm start        # Start production server
```

### Setup
```powershell
.\setup.ps1      # Automated setup (Windows PowerShell)
```

## Testing

### Run Security Tests
```bash
# Test rate limiting
for i in {1..20}; do curl http://localhost:5000/api/echoes; done

# Test authentication
curl http://localhost:5000/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"SecurePass123"}'
```

See [SECURITY.md](SECURITY.md) for comprehensive security testing guide.

## Contributing

This is a personal project template. Feel free to fork and customize for your own use.

## License

ISC

---

**Note**: This project implements production-grade security features including password hashing, JWT authentication, rate limiting, input validation, and CORS protection. For actual music recognition, integrate with services like AudD, ACRCloud, or Shazam API
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Server
```bash
npm run dev      # Start with nodemon
```

## Contributing

This is a personal project template. Feel free to fork and customize for your own use.

## License

ISC

---

**Note**: This is a development version with mock data for demonstration purposes. For production use, integrate real music recognition APIs and implement proper security measures.
