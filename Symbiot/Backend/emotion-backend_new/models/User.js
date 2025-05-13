const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    default: ''
  },
  course: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  photoURL: {
    type: String,
    default: ''
  },
  provider: {
    type: String,
    default: 'password'
  },
  preference: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
