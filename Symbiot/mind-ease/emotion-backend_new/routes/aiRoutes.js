const express = require("express");
const router = express.Router();
const {
  analyzeJournal,
  chatWithAI,
  analyzeEmotion
} = require("../controllers/aiController");

// Journal analysis endpoint
router.post("/analyze-journal", analyzeJournal);

// Chatbot conversation endpoint
router.post("/chat", chatWithAI);

// Emotion analysis endpoint
router.post("/analyze-emotion", analyzeEmotion);

module.exports = router;
