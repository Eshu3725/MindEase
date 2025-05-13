const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  console.log("📩 Received contact form data:", req.body);
  const { name, email, subject, note } = req.body;

  if (!name || !email || !subject || !note) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newContact = new Contact({ name, email, subject, note });
    await newContact.save();
    res.status(201).json({ message: "Message received!" });
  } catch (error) {
    console.error("❌ Error saving contact:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
