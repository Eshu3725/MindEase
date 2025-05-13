const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store conversation history for each user
const conversationHistory = new Map();

// Helper function to get or create conversation history
const getConversationHistory = (userId) => {
  if (!conversationHistory.has(userId)) {
    conversationHistory.set(userId, [
      { role: "system", content: "You are MindEase AI, a supportive and empathetic mental health companion. Your goal is to provide helpful guidance, emotional support, and practical advice for mental wellbeing. You should be compassionate, non-judgmental, and focus on evidence-based approaches to mental health. Always prioritize user safety and wellbeing." }
    ]);
  }
  return conversationHistory.get(userId);
};

// Analyze journal entries
const analyzeJournal = async (req, res) => {
  try {
    const { entry } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`Respond empathetically to the following journal entry and provide helpful tips. Keep the response concise, supportive, and around 50 words total in a single paragraph: "${entry}"`);
    const text = result.response.text();

    res.json({ analysis: text });
  } catch (error) {
    res.status(500).json({ message: "Gemini error", error: error.message });
  }
};

// Chat with the AI companion
const chatWithAI = async (req, res) => {
  try {
    const { message, userId = "anonymous", mood } = req.body;

    // Get conversation history for this user
    const history = getConversationHistory(userId);

    // Add user message to history
    history.push({ role: "user", content: message });

    // Prepare context-aware prompt
    let prompt = "";
    if (mood) {
      prompt = `The user is feeling ${mood} today. `;
    }

    prompt += "Respond as a supportive mental health companion. Be empathetic, helpful, and provide practical advice when appropriate. Keep responses concise (2-3 sentences) but meaningful.";

    // Generate AI response
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 200,
      }
    });

    // Create chat session with history
    const chat = model.startChat({
      history: history.slice(0, -1).map(msg => ({
        role: msg.role === "system" ? "user" : msg.role,
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 200,
      }
    });

    // Get response
    const result = await chat.sendMessage(prompt + "\n\nUser: " + message);
    const response = result.response.text();

    // Add AI response to history (limit history to last 10 messages to prevent token limits)
    history.push({ role: "assistant", content: response });
    if (history.length > 12) { // Keep system message + 10 conversation turns
      history.splice(1, 2); // Remove oldest Q&A pair but keep system message
    }

    res.json({ response });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ message: "AI error", error: error.message });
  }
};

// Analyze user's emotional state
const analyzeEmotion = async (req, res) => {
  try {
    const { text } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`
      Analyze the emotional state in this text: "${text}"

      Respond with a JSON object in this exact format:
      {
        "primaryEmotion": "one of: happy, sad, angry, anxious, neutral, confused, excited",
        "intensity": "a number from 1-10",
        "suggestion": "a brief, supportive suggestion based on their emotional state"
      }

      Only return the JSON object, nothing else.
    `);

    const responseText = result.response.text();
    let emotionData;

    try {
      // Extract JSON from response (handling potential text wrapping)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emotionData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Invalid JSON format in response");
      }
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError, "Response was:", responseText);
      emotionData = {
        primaryEmotion: "neutral",
        intensity: 5,
        suggestion: "I'm not sure how you're feeling. Would you like to talk more about it?"
      };
    }

    res.json(emotionData);
  } catch (error) {
    console.error("Emotion analysis error:", error);
    res.status(500).json({ message: "Analysis error", error: error.message });
  }
};

module.exports = {
  analyzeJournal,
  chatWithAI,
  analyzeEmotion
};
