const fs = require("fs");
const { sendToFastAPI } = require("../utils/fastapiClient");

exports.handleUpload = async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await sendToFastAPI(filePath);
    res.json({ success: true, result });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Video processing failed." });
  }
};
