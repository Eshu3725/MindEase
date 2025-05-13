const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: String,
  textInput: String,
  emotion: String,
  confidence: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mood', moodSchema);
