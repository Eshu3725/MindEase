const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // The user information is available in req.user after token verification
    const { uid, email, name, picture } = req.user;

    // Find user in database or create if not exists
    let user = await User.findOne({ uid });

    if (!user) {
      // Create new user record if not found
      user = new User({
        uid,
        email,
        fullname: name || email.split('@')[0],
        photoURL: picture || '',
        provider: req.user.firebase?.sign_in_provider || 'unknown'
      });
      await user.save();
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    res.status(200).json({
      uid,
      email,
      name: user.fullname || name || email.split('@')[0],
      picture: user.photoURL || picture || null,
      course: user.course || '',
      gender: user.gender || '',
      preference: user.preference || '',
      provider: user.provider
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user preferences
router.post('/preferences', verifyToken, async (req, res) => {
  try {
    const { preference } = req.body;
    const userId = req.user.uid;

    // Find user and update preferences
    const user = await User.findOneAndUpdate(
      { uid: userId },
      { preference },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Preferences updated successfully',
      user: {
        uid: user.uid,
        email: user.email,
        name: user.fullname,
        preference: user.preference
      }
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Verify token endpoint - useful for client-side token validation
router.get('/verify-token', verifyToken, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

// Social login callback endpoint
router.post('/social-auth', verifyToken, async (req, res) => {
  try {
    const { provider, fullname, course, gender } = req.body;
    const { uid, email, name, picture } = req.user;

    // Find user or create if not exists
    let user = await User.findOne({ uid });

    if (!user) {
      // Create new user
      user = new User({
        uid,
        email,
        fullname: fullname || name || email.split('@')[0],
        course: course || '',
        gender: gender || '',
        photoURL: picture || '',
        provider: provider || req.user.firebase?.sign_in_provider || 'unknown'
      });
    } else {
      // Update existing user
      user.fullname = fullname || user.fullname || name || email.split('@')[0];
      user.course = course || user.course;
      user.gender = gender || user.gender;
      user.photoURL = picture || user.photoURL;
      user.provider = provider || user.provider;
      user.lastLoginAt = new Date();
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.fullname,
        picture: user.photoURL,
        course: user.course,
        gender: user.gender,
        preference: user.preference,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Error in social authentication:', error);
    res.status(500).json({ error: 'Failed to process social authentication' });
  }
});

module.exports = router;
