const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeJournal = async (req, res) => {
  try {
    const { entry } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`Respond empathetically to the following journal entry and provide helpful tips. Keep the response concise, supportive, and around 50–60 words total in a single paragraph: "${entry}"`);
    const text = result.response.text();

    res.json({ analysis: text });
  } catch (error) {
    res.status(500).json({ message: "Gemini error", error: error.message });
  }
};

module.exports = { analyzeJournal };
