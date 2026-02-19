const express = require('express');
const router = express.Router();
const Echo = require('../models/Echo');
const { identifyValidation, validate } = require('../middleware/validator');
const { identifyLimiter } = require('../middleware/rateLimiter');
const { optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// Mock music database for demo
const mockTracks = [
  { 
    name: 'Midnight Protocol', 
    artist: 'Synthwave Collective', 
    album: 'Neon Dreams',
    genre: 'Electronic', 
    bpm: 128,
    matchPercentage: 93
  },
  { 
    name: 'Summer Breeze', 
    artist: 'The Acoustic Souls', 
    album: 'Warm Days',
    genre: 'Pop', 
    bpm: 85,
    matchPercentage: 87
  },
  { 
    name: 'Urban Jungle', 
    artist: 'Hip Hop Alliance', 
    album: 'Street Stories',
    genre: 'Hip Hop', 
    bpm: 95,
    matchPercentage: 91
  },
  { 
    name: 'Moonlight Serenade', 
    artist: 'Jazz Quartet', 
    album: 'Late Night Sessions',
    genre: 'Jazz', 
    bpm: 72,
    matchPercentage: 89
  },
  {
    name: 'Digital Dreams',
    artist: 'Cyber Echo',
    album: 'Future Sounds',
    genre: 'Electronic',
    bpm: 140,
    matchPercentage: 95
  }
];

// Identify music from audio sample
router.post('/', 
  identifyLimiter,
  optionalAuth,
  identifyValidation,
  validate,
  asyncHandler(async (req, res) => {
    const { audioData, location } = req.body;
    const userId = req.userId;

    // Simulate audio processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock identification - return a random track
    const identifiedTrack = mockTracks[Math.floor(Math.random() * mockTracks.length)];

    // Save echo to database if user is logged in and location available
    if (userId && location && location.latitude && location.longitude) {
      const echo = new Echo({
        userId,
        trackName: identifiedTrack.name,
        artist: identifiedTrack.artist,
        album: identifiedTrack.album,
        genre: identifiedTrack.genre,
        bpm: identifiedTrack.bpm,
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        },
        city: location.city,
        country: location.country
      });

      await echo.save();
    }

    res.json({
      success: true,
      track: identifiedTrack
    });
  })
);

module.exports = router;
