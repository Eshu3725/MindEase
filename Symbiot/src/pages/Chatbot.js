import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';

const API_URL = 'http://localhost:5000/api'; // Update with your actual backend URL

// Fallback responses for when the backend is unavailable
const FALLBACK_RESPONSES = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    responses: [
      "Hello! How are you feeling today?",
      "Hi there! I'm here to support you. How can I help?",
      "Hey! It's good to see you. How's your day going?"
    ]
  },
  {
    keywords: ['sad', 'unhappy', 'depressed', 'down', 'blue'],
    responses: [
      "I'm sorry to hear you're feeling down. Remember that it's okay to feel this way sometimes. Would you like to talk about what's bothering you?",
      "It sounds like you're going through a difficult time. Remember that these feelings won't last forever. What might help you feel a bit better right now?",
      "I understand feeling sad can be really tough. Have you tried any self-care activities today that might help lift your mood?"
    ]
  },
  {
    keywords: ['anxious', 'worried', 'nervous', 'stress', 'stressed'],
    responses: [
      "Anxiety can be really challenging. Have you tried any breathing exercises? Taking slow, deep breaths can help calm your nervous system.",
      "When you're feeling anxious, it can help to ground yourself. Try naming 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
      "I understand anxiety can feel overwhelming. Remember that you've gotten through difficult moments before, and you can get through this too."
    ]
  },
  {
    keywords: ['happy', 'good', 'great', 'wonderful', 'amazing', 'excellent'],
    responses: [
      "I'm so glad to hear you're feeling good! What's contributed to your positive mood today?",
      "That's wonderful! Celebrating these positive moments is important. What are you most grateful for right now?",
      "It's great that you're feeling happy! Is there something specific that's bringing you joy today?"
    ]
  },
  {
    keywords: ['tired', 'exhausted', 'sleepy', 'fatigue'],
    responses: [
      "Being tired can really affect how we feel. Have you been able to get enough rest lately?",
      "Feeling exhausted can make everything harder. Is there a way you could schedule some extra rest time today?",
      "When we're tired, even small tasks can feel overwhelming. Be gentle with yourself and prioritize rest when you can."
    ]
  },
  {
    keywords: ['help', 'support', 'resources'],
    responses: [
      "I'm here to support you. Would you like to talk about specific resources for mental health support?",
      "There are many resources available to help. Would you like to explore some options together?",
      "Support comes in many forms. Would you prefer to talk about professional help, self-help strategies, or community resources?"
    ]
  }
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm your AI companion. How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [mood, setMood] = useState('');

  // Get current user's mood from localStorage if available
  useEffect(() => {
    const savedMood = localStorage.getItem('selectedMood');
    if (savedMood) {
      try {
        const parsedMood = JSON.parse(savedMood);
        setMood(parsedMood.label);
      } catch (e) {
        console.error('Error parsing mood:', e);
      }
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get user ID for conversation tracking
  const getUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : 'anonymous';
  };

  // Function to get a fallback response based on user input
  const getFallbackResponse = (input) => {
    const lowercaseInput = input.toLowerCase();

    // Check for keyword matches
    for (const category of FALLBACK_RESPONSES) {
      for (const keyword of category.keywords) {
        if (lowercaseInput.includes(keyword)) {
          // Return a random response from this category
          const responses = category.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }

    // If no keyword matches, return a generic response
    const genericResponses = [
      "I'm here to listen. Could you tell me more about that?",
      "Thank you for sharing. How does that make you feel?",
      "I understand. What do you think might help in this situation?",
      "That's interesting. Would you like to explore this topic further?",
      "I appreciate you opening up. Is there anything specific you'd like guidance on?"
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    const userInput = input;
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      console.log('Sending request to:', `${API_URL}/ai/analyze-emotion`);
      console.log('User input:', userInput);

      // First, analyze the emotion in the message
      const emotionResponse = await fetch(`${API_URL}/ai/analyze-emotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userInput
        }),
      });

      console.log('Emotion response status:', emotionResponse.status);

      if (!emotionResponse.ok) {
        const errorText = await emotionResponse.text();
        console.error('Emotion analysis error response:', errorText);
        throw new Error(`Failed to analyze emotion: ${emotionResponse.status} ${errorText}`);
      }

      const emotionData = await emotionResponse.json();
      console.log('Emotion data:', emotionData);

      // Then, send the message to the AI chatbot with emotion context
      console.log('Sending chat request to:', `${API_URL}/ai/chat`);
      const chatPayload = {
        message: userInput,
        userId: getUserId(),
        mood: mood || emotionData.primaryEmotion,
        emotionIntensity: emotionData.intensity
      };
      console.log('Chat request payload:', chatPayload);

      const chatResponse = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatPayload),
      });

      console.log('Chat response status:', chatResponse.status);

      if (!chatResponse.ok) {
        const errorText = await chatResponse.text();
        console.error('Chat error response:', errorText);
        throw new Error(`Failed to get response from AI: ${chatResponse.status} ${errorText}`);
      }

      const data = await chatResponse.json();
      console.log('Chat response data:', data);

      // Add AI response to messages
      setMessages(prev => [...prev, {
        text: data.response,
        sender: 'bot',
        emotion: emotionData.primaryEmotion,
        suggestion: emotionData.suggestion
      }]);
    } catch (err) {
      console.error('Error communicating with AI:', err);

      // Create a more detailed error message for debugging
      const errorMessage = err.message || 'Unknown error';
      const detailedError = `Sorry, I had trouble responding. Error: ${errorMessage}`;

      // Check if this is a connection error that we can handle with fallback
      const isConnectionError =
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('404') ||
        errorMessage.includes('500');

      if (isConnectionError) {
        // Use fallback mode without showing error message
        console.log('Using fallback mode due to connection error');

        // Get a context-aware fallback response based on the user's input
        const fallbackResponse = getFallbackResponse(userInput);

        // Only show the fallback response, not the error
        setMessages(prev => [...prev, {
          text: fallbackResponse,
          sender: 'bot',
          isFallback: true
        }]);

        // Set a subtle notification about offline mode at the bottom
        setError('Using offline mode due to connection issues.');
      } else {
        // For other errors, show the error message
        setError(detailedError);
        setMessages(prev => [...prev, {
          text: 'Sorry, I had trouble responding. Please try again.',
          sender: 'bot',
          isError: true,
          detailedError: errorMessage
        }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#66FCF1] mb-6">🤖 AI Companion</h1>

      {mood && (
        <div className="mb-4 bg-[#1F2833] p-3 rounded-lg text-[#CFC6C7] flex items-center">
          <span className="mr-2">Current mood:</span>
          <span className="text-[#66FCF1] font-medium">{mood}</span>
        </div>
      )}

      <div className="bg-[#1F2833] rounded-xl shadow-lg overflow-hidden flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-3 ${
                  message.sender === 'user'
                    ? 'bg-[#45A29E] text-white'
                    : message.isError
                      ? 'bg-red-900/30 text-[#CFC6C7] border border-red-700'
                      : 'bg-[#0B0C10] text-[#CFC6C7]'
                }`}
              >
                {message.text}

                {/* Show emotion analysis and suggestion for bot messages */}
                {message.sender === 'bot' && message.emotion && (
                  <div className="mt-2 pt-2 border-t border-[#45A29E]/30 text-xs text-[#66FCF1]/70">
                    <div>Detected emotion: {message.emotion}</div>
                    {message.suggestion && (
                      <div className="mt-1 italic">{message.suggestion}</div>
                    )}
                  </div>
                )}

                {/* Show detailed error for debugging */}
                {message.sender === 'bot' && message.isError && message.detailedError && (
                  <div className="mt-2 pt-2 border-t border-red-500/30 text-xs text-red-400/70">
                    <details>
                      <summary className="cursor-pointer">Show error details</summary>
                      <div className="mt-1 whitespace-pre-wrap">{message.detailedError}</div>
                    </details>
                  </div>
                )}

                {/* Show fallback indicator - very subtle */}
                {message.sender === 'bot' && message.isFallback && (
                  <div className="mt-2 pt-2 border-t border-[#45A29E]/20 text-xs text-[#45A29E]/50">
                    <div className="text-[10px]">offline mode</div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#0B0C10] text-[#CFC6C7] rounded-xl p-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#66FCF1] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[#66FCF1] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[#66FCF1] animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Error message - different styling based on if it's offline mode or a real error */}
          {error && (
            <div className={`text-center text-xs py-2 ${
              error.includes('offline mode')
                ? 'text-[#45A29E]/70'
                : 'text-red-400'
            }`}>
              {error}
            </div>
          )}

          {/* Auto-scroll reference */}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-[#45A29E] bg-[#0B0C10]">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#1F2833] text-[#CFC6C7] p-3 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#66FCF1]"
              disabled={isTyping}
            />
            <button
              type="submit"
              className={`px-4 rounded-r-lg font-semibold transition-colors ${
                isTyping
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-[#66FCF1] text-[#0B0C10] hover:bg-[#45A29E]'
              }`}
              disabled={isTyping}
            >
              {isTyping ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
