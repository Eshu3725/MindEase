const express = require('express');
const { checkInMood, getMoodHistory } = require('../controllers/moodController');
const router = express.Router();

router.post('/mood-checkin', checkInMood);
router.get('/emotion-history', getMoodHistory);

module.exports = router;
