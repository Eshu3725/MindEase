import React, { useState, useEffect, useRef } from 'react';
import { auth, db, doc, getDoc } from '../firebase';
import { analyzeTextMood } from '../services/textMoodAnalysisService';
import { analyzeInput } from '../services/inputAnalysisService';
import { generateResponse } from '../services/responseGenerationService';
import { fetchCourseContent } from '../services/courseContentService';
import { getCachedItem, setCachedItem } from '../utils/cacheUtil';

const AICompanion = () => {
  const [userCourse, setUserCourse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [conversationMemory, setConversationMemory] = useState({
    previousInputs: [],
    previousResponses: [],
    lastInputType: null,
    repetitiveInputCount: 0,
    mentionedTopics: [],
    userMoods: []
  });
  const messagesEndRef = useRef(null);

  // Fetch user's course from Firebase
  useEffect(() => {
    const fetchUserCourse = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.log('No user logged in');
          return;
        }

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserCourse(userData.course || '');
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user course:', error);
      }
    };

    fetchUserCourse();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    // Using a timeout to ensure the DOM has updated
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]); // Only depend on the length of messages

  // Initial greeting
  useEffect(() => {
    const greetings = [
      "Hi there! I'm your AI learning companion. How are you feeling today?",
      "Hello! I'm your AI study assistant. How's your mood today?",
      "Welcome! I'm here to help with your studies. How are you feeling right now?",
      "Greetings! I'm your AI learning partner. How's your day going?",
      "Hi! I'm your personalized study companion. How are you feeling today?"
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    setMessages([
      {
        type: 'ai',
        text: `${randomGreeting} Tell me about your mood or what's on your mind, and I'll recommend study approaches that might work best for you right now.`
      }
    ]);
  }, []);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      type: 'user',
      text: userInput
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Advanced input analysis
      const inputAnalysis = analyzeInput(userInput);

      // Traditional mood analysis for backward compatibility
      const moodAnalysis = analyzeTextMood(userInput);

      // Update conversation memory
      setConversationMemory(prevMemory => {
        // Store previous inputs and responses (limited to last 5)
        const updatedInputs = [...prevMemory.previousInputs, userInput].slice(-5);

        // Track mentioned topics
        const updatedTopics = [...new Set([...prevMemory.mentionedTopics, ...inputAnalysis.topics])].slice(-5);

        // Track user moods
        const updatedMoods = [...prevMemory.userMoods, moodAnalysis.mood].slice(-3);

        // Check for repetitive inputs
        const isRepetitive = prevMemory.lastInputType === inputAnalysis.questionTypes[0];
        const repetitiveCount = isRepetitive ? prevMemory.repetitiveInputCount + 1 : 0;

        return {
          previousInputs: updatedInputs,
          previousResponses: prevMemory.previousResponses,
          lastInputType: inputAnalysis.questionTypes[0] || null,
          repetitiveInputCount: repetitiveCount,
          mentionedTopics: updatedTopics,
          userMoods: updatedMoods
        };
      });

      // Fetch content recommendations based on mood and course
      let content = null;

      if (userCourse) {
        try {
          // Create cache key
          const cacheKey = `content_${userCourse}_${moodAnalysis.mood}`;

          // Check cache first
          content = getCachedItem(cacheKey);

          if (!content) {
            // Fetch fresh content
            content = await fetchCourseContent(userCourse, moodAnalysis.mood);

            // Cache the result
            setCachedItem(cacheKey, content);
          }

          setRecommendations(content);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
          // Continue even if recommendations fail
        }
      }

      // Generate AI response using our new service
      setTimeout(() => {
        // Generate response based on input analysis
        const aiResponse = generateResponse(inputAnalysis, conversationMemory, userCourse);

        // Update conversation memory with the new response
        setConversationMemory(prevMemory => {
          const updatedResponses = [...prevMemory.previousResponses, aiResponse].slice(-5);
          return {
            ...prevMemory,
            previousResponses: updatedResponses
          };
        });

        setMessages(prev => [...prev, {
          type: 'ai',
          text: aiResponse
        }]);

        setIsLoading(false);
        if (content) {
          setShowRecommendations(true);
        }
      }, 1000);
    } catch (error) {
      console.error('Error in message processing:', error);

      // Fallback response for error cases
      setTimeout(() => {
        const fallbackResponses = [
          "I'm having trouble understanding right now. Could you rephrase that?",
          "Something went wrong on my end. Could you try asking in a different way?",
          "I apologize, but I'm having difficulty processing that. Could you be more specific?",
          "I seem to be having a technical issue. Could you try a different question?",
          "I'm sorry, but I couldn't quite follow that. Could you elaborate?"
        ];

        const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

        setMessages(prev => [...prev, {
          type: 'ai',
          text: fallbackResponse
        }]);

        setIsLoading(false);
      }, 1000);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-[#1F2833] rounded-lg overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-[#0B0C10] p-4 border-b border-[#45A29E]">
        <h3 className="text-[#66FCF1] font-medium">AI Learning Companion</h3>
        <p className="text-[#CFC6C7] text-sm">
          Share how you're feeling, and I'll recommend study approaches
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={`message-${index}-${message.type}`}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-[#45A29E] text-white'
                  : 'bg-[#0B0C10] text-[#CFC6C7]'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#0B0C10] text-[#CFC6C7] rounded-lg p-3 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#66FCF1] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#66FCF1] animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-[#66FCF1] animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recommendations Section */}
      {showRecommendations && recommendations && (
        <div className="bg-[#0B0C10] p-4 border-t border-[#45A29E] max-h-[250px] overflow-y-auto">
          <h4 className="text-[#66FCF1] font-medium mb-3">Recommended Resources</h4>

          {/* Videos */}
          {recommendations.videos && recommendations.videos.length > 0 && (
            <div className="mb-3">
              <h5 className="text-[#CFC6C7] text-sm font-medium mb-2">Videos for your current mood:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recommendations.videos.slice(0, 2).map((video) => (
                  <a
                    key={`video-${video.id}`}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-[#1F2833] rounded p-2 hover:bg-[#1F2833]/80 transition-colors"
                  >
                    <div className="w-16 h-12 flex-shrink-0 mr-2">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[#CFC6C7] text-xs line-clamp-2">{video.title}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {recommendations.resources && recommendations.resources.length > 0 && (
            <div>
              <h5 className="text-[#CFC6C7] text-sm font-medium mb-2">Learning resources:</h5>
              <div className="space-y-2">
                {recommendations.resources.slice(0, 2).map((resource, index) => (
                  <a
                    key={`resource-${resource.source}-${index}`}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#1F2833] rounded p-2 hover:bg-[#1F2833]/80 transition-colors"
                  >
                    <p className="text-[#CFC6C7] text-xs font-medium">{resource.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{resource.source}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-[#45A29E]">
        <div className="flex">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me how you're feeling today..."
            className="flex-1 bg-[#0B0C10] text-[#CFC6C7] rounded-l-lg p-3 focus:outline-none resize-none"
            rows="2"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
            className="bg-[#66FCF1] text-[#0B0C10] px-4 rounded-r-lg font-medium hover:bg-[#45A29E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;
