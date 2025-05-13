const express = require("express");
const router = express.Router();
const { analyzeJournal } = require("../controllers/aiController");

router.post("/analyze-journal", analyzeJournal);

module.exports = router;
