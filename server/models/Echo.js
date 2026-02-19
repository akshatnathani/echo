const mongoose = require('mongoose');

const EchoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trackName: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: String,
  genre: String,
  bpm: Number,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  city: String,
  country: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

EchoSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Echo', EchoSchema);
