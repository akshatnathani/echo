const express = require('express');
const router = express.Router();
const Echo = require('../models/Echo');
const { asyncHandler } = require('../middleware/errorHandler');
const { query } = require('express-validator');
const { validate } = require('../middleware/validator');

// Get recent echoes for map visualization
router.get('/',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 500 })
      .withMessage('Limit must be between 1 and 500')
      .toInt()
  ],
  validate,
  asyncHandler(async (req, res) => {
    const limit = req.query.limit || 100;
    
    const echoes = await Echo.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'fullName')
      .lean();

    // Transform data for map display
    const mapEchoes = echoes.map(echo => ({
      id: echo._id,
      trackName: echo.trackName,
      artist: echo.artist,
      genre: echo.genre,
      bpm: echo.bpm,
      latitude: echo.location.coordinates[1],
      longitude: echo.location.coordinates[0],
      city: echo.city,
      country: echo.country,
      timestamp: echo.timestamp,
      user: echo.userId ? echo.userId.fullName : 'Anonymous'
    }));

    res.json({
      success: true,
      echoes: mapEchoes,
      total: mapEchoes.length
    });
  })
);

// Get echoes near a location
router.get('/nearby',
  [
    query('longitude')
      .notEmpty()
      .withMessage('Longitude is required')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Invalid longitude')
      .toFloat(),
    query('latitude')
      .notEmpty()
      .withMessage('Latitude is required')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Invalid latitude')
      .toFloat(),
    query('maxDistance')
      .optional()
      .isInt({ min: 100, max: 100000 })
      .withMessage('Max distance must be between 100 and 100000 meters')
      .toInt()
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    const echoes = await Echo.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
    .limit(50)
    .populate('userId', 'fullName')
    .lean();

    res.json({
      success: true,
      echoes: echoes.map(echo => ({
        id: echo._id,
        trackName: echo.trackName,
        artist: echo.artist,
        latitude: echo.location.coordinates[1],
        longitude: echo.location.coordinates[0],
        timestamp: echo.timestamp
      }))
    });
  })
);

module.exports = router;
