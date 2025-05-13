/**
 * Response Generation Service
 * Generates varied and contextual responses based on input analysis
 */

import { analyzeTextMood } from './textMoodAnalysisService';

// Response templates for different question types
const questionResponses = {
  howTo: [
    "Here's a step-by-step approach you could try: {suggestion}",
    "One effective method is to {suggestion}",
    "I'd recommend starting with {suggestion}",
    "Based on your current mood, you might want to {suggestion}",
    "A good approach would be to {suggestion}",
    "Consider trying this approach: {suggestion}"
  ],
  
  factual: [
    "From what I understand, {information}",
    "According to my knowledge, {information}",
    "Here's what I know about that: {information}",
    "I can tell you that {information}",
    "The information I have suggests that {information}"
  ],
  
  opinion: [
    "In my view, {opinion}",
    "I think {opinion}",
    "From my perspective, {opinion}",
    "Based on what I know, {opinion}",
    "My take on this is that {opinion}"
  ],
  
  clarification: [
    "Let me clarify: {clarification}",
    "To be more specific, {clarification}",
    "What I meant was {clarification}",
    "To put it another way, {clarification}",
    "Let me explain that better: {clarification}"
  ],
  
  personal: [
    "I'm your AI learning companion, designed to help you with your studies based on your emotional state.",
    "I'm here to provide personalized learning recommendations based on how you're feeling.",
    "I'm an AI assistant that adapts to your mood to suggest the most effective study approaches.",
    "I'm your adaptive learning companion, focused on helping you learn effectively regardless of your mood.",
    "I'm an AI designed to understand your emotional state and provide tailored learning suggestions."
  ],
  
  preference: [
    "As an AI, I don't have personal preferences, but I can suggest what might work well for you based on your mood.",
    "While I don't have personal likes or dislikes, I can recommend what might be most effective for your current state of mind.",
    "I don't experience preferences like humans do, but I can analyze what approaches might suit your current mood best.",
    "Rather than my preferences, I'm designed to understand what would work best for you right now.",
    "I'm focused on what would be most helpful for you, rather than having preferences of my own."
  ]
};

// Response templates for different topics
const topicResponses = {
  study: {
    positive: [
      "Your positive mood is perfect for tackling challenging study material. Consider diving into complex topics or trying creative learning approaches.",
      "With your current positive energy, it's a great time to explore new study techniques or tackle difficult subjects.",
      "Your good mood creates an excellent opportunity for collaborative learning or tackling subjects you find challenging.",
      "This positive state is ideal for making connections between different subjects or exploring the practical applications of what you're learning."
    ],
    negative: [
      "When you're not feeling your best, it can help to focus on reviewing familiar material or breaking your study sessions into smaller chunks.",
      "For your current mood, gentle study approaches like summarizing what you already know or working on simple practice problems might be best.",
      "Consider taking a more structured approach to studying right now, with clear goals and frequent breaks.",
      "It might help to focus on subjects you enjoy or find easier when you're feeling this way. Small wins can help improve your mood."
    ],
    neutral: [
      "Your balanced mood is well-suited for analytical study approaches and methodical learning.",
      "This neutral state is good for objective analysis and systematic study methods.",
      "With your current mindset, you might find it effective to alternate between different subjects or study techniques.",
      "Your balanced state is ideal for critical thinking and detailed analysis of complex material."
    ]
  },
  
  subject: {
    positive: [
      "Your enthusiasm could be channeled into exploring advanced concepts in this subject or making connections to real-world applications.",
      "With your current energy, you might enjoy tackling the more challenging aspects of this subject or exploring it from creative angles.",
      "Your positive mood is perfect for diving deep into this subject and exploring its complexities.",
      "This is a great time to challenge yourself with advanced material or try teaching concepts to others to deepen your understanding."
    ],
    negative: [
      "When approaching this subject in your current mood, focus on the fundamentals and take small, manageable steps.",
      "It might help to review the basics of this subject or focus on aspects you already feel confident about.",
      "Consider using visual aids or different learning formats to make this subject more approachable right now.",
      "Breaking this subject down into smaller, more digestible parts might make it feel less overwhelming."
    ],
    neutral: [
      "Your balanced perspective is ideal for methodical progress through this subject material.",
      "This neutral state allows for objective analysis and systematic learning of the subject.",
      "You're in a good position to evaluate different approaches to this subject and determine what works best for you.",
      "Your current mindset is well-suited for building a comprehensive understanding of this subject."
    ]
  }
};

// Response templates for different commands
const commandResponses = {
  help: [
    "I'd be happy to help. What specific aspect are you looking for assistance with?",
    "I'm here to assist you. Could you tell me more about what you need help with?",
    "I'll do my best to help you. What particular challenge are you facing?",
    "I'm ready to support you. What would you like help with specifically?",
    "I'm here to provide assistance. Could you share more details about what you need?"
  ],
  
  suggestion: [
    "Based on your current mood, I'd suggest {suggestion}",
    "Given how you're feeling, you might want to try {suggestion}",
    "A recommendation that might work well for you right now is {suggestion}",
    "Considering your state of mind, I'd recommend {suggestion}",
    "An approach that could be effective for you now is {suggestion}"
  ],
  
  explanation: [
    "Let me explain that for you. {explanation}",
    "Here's an explanation: {explanation}",
    "I'd be happy to clarify that. {explanation}",
    "To explain this concept: {explanation}",
    "Here's what you should know about that: {explanation}"
  ]
};

// Fallback responses when no specific pattern is matched
const fallbackResponses = [
  "I'm not sure I understand what you're asking. Could you rephrase that or provide more details?",
  "I'd like to help, but I'm having trouble understanding your question. Could you elaborate?",
  "I'm not quite following. Could you explain what you're looking for in different words?",
  "I want to assist you, but I'm not sure what you're asking. Could you provide more context?",
  "I'm sorry, but I'm having difficulty understanding your request. Could you be more specific?"
];

// Greeting responses
const greetingResponses = [
  "Hello! How are you feeling today? I can suggest study approaches based on your mood.",
  "Hi there! How's your mood today? I can recommend learning strategies that match how you're feeling.",
  "Welcome! How are you doing? I'd love to suggest study techniques tailored to your current emotional state.",
  "Greetings! How are you feeling? I can provide personalized learning recommendations based on your mood.",
  "Hello! How's your day going? I can help with study approaches that work well with your current mood."
];

/**
 * Generates a response based on input analysis and mood
 * @param {Object} inputAnalysis - Analysis of user input
 * @param {Object} conversationContext - Context from previous interactions
 * @param {string} course - User's course if available
 * @returns {string} - Generated response
 */
const generateResponse = (inputAnalysis, conversationContext, course) => {
  // Handle empty input
  if (inputAnalysis.isEmpty) {
    return getRandomResponse(fallbackResponses);
  }
  
  // Check if it's a greeting
  if (/^(hi|hello|hey|greetings|howdy|hiya)/i.test(inputAnalysis.originalInput) && 
      inputAnalysis.originalInput.split(' ').length < 4) {
    return getRandomResponse(greetingResponses);
  }
  
  // Analyze mood from input
  const moodAnalysis = analyzeTextMood(inputAnalysis.originalInput);
  
  // Check for repetitive responses
  if (conversationContext && conversationContext.lastResponseType === inputAnalysis.questionTypes[0] && 
      conversationContext.repetitiveResponseCount > 1) {
    return generateVarietyResponse(moodAnalysis, course);
  }
  
  // Generate response based on input type
  if (inputAnalysis.isQuestion && inputAnalysis.questionTypes.length > 0) {
    return generateQuestionResponse(inputAnalysis, moodAnalysis, course);
  } else if (inputAnalysis.commands.length > 0) {
    return generateCommandResponse(inputAnalysis, moodAnalysis, course);
  } else if (inputAnalysis.topics.length > 0) {
    return generateTopicResponse(inputAnalysis, moodAnalysis, course);
  } else {
    // Generate mood-based response if no specific pattern is matched
    return generateMoodResponse(moodAnalysis, course);
  }
};

/**
 * Generates a response for questions
 */
const generateQuestionResponse = (inputAnalysis, moodAnalysis, course) => {
  const questionType = inputAnalysis.questionTypes[0];
  
  if (questionResponses[questionType]) {
    let response = getRandomResponse(questionResponses[questionType]);
    
    // Replace placeholders with content
    if (response.includes('{suggestion}')) {
      const suggestion = getRecommendationForMood(moodAnalysis);
      response = response.replace('{suggestion}', suggestion);
    }
    
    if (response.includes('{information}') || 
        response.includes('{opinion}') || 
        response.includes('{clarification}')) {
      const content = getContentForTopic(inputAnalysis.topics[0], moodAnalysis.mood);
      response = response.replace(/{information}|{opinion}|{clarification}/g, content);
    }
    
    // Add course-specific information if available
    if (course) {
      response += ` Since you're studying ${course}, you might find it helpful to relate these concepts to your coursework.`;
    }
    
    return response;
  }
  
  return generateMoodResponse(moodAnalysis, course);
};

/**
 * Generates a response for commands
 */
const generateCommandResponse = (inputAnalysis, moodAnalysis, course) => {
  const command = inputAnalysis.commands[0];
  
  if (commandResponses[command]) {
    let response = getRandomResponse(commandResponses[command]);
    
    // Replace placeholders with content
    if (response.includes('{suggestion}')) {
      const suggestion = getRecommendationForMood(moodAnalysis);
      response = response.replace('{suggestion}', suggestion);
    }
    
    if (response.includes('{explanation}')) {
      const content = getContentForTopic(inputAnalysis.topics[0], moodAnalysis.mood);
      response = response.replace('{explanation}', content);
    }
    
    // Add course-specific information if available
    if (course) {
      response += ` This approach can be particularly effective for your ${course} studies.`;
    }
    
    return response;
  }
  
  return generateMoodResponse(moodAnalysis, course);
};

/**
 * Generates a response based on detected topics
 */
const generateTopicResponse = (inputAnalysis, moodAnalysis, course) => {
  const topic = inputAnalysis.topics[0];
  let sentiment = inputAnalysis.sentiment;
  
  // Default to mood-based sentiment if input sentiment is neutral
  if (sentiment === 'neutral') {
    sentiment = moodAnalysis.mood === 'happy' || moodAnalysis.mood === 'excited' || 
                moodAnalysis.mood === 'content' ? 'positive' : 
                moodAnalysis.mood === 'sad' || moodAnalysis.mood === 'angry' || 
                moodAnalysis.mood === 'fearful' ? 'negative' : 'neutral';
  }
  
  if (topicResponses[topic] && topicResponses[topic][sentiment]) {
    let response = getRandomResponse(topicResponses[topic][sentiment]);
    
    // Add course-specific information if available
    if (course) {
      response += ` For your ${course} studies specifically, ${getRecommendationForCourse(course, moodAnalysis.mood)}.`;
    }
    
    return response;
  }
  
  return generateMoodResponse(moodAnalysis, course);
};

/**
 * Generates a response based on mood analysis
 */
const generateMoodResponse = (moodAnalysis, course) => {
  const { mood, description, recommendedApproaches } = moodAnalysis;
  
  let response = `I sense that you're feeling ${mood}. ${description} `;
  
  if (recommendedApproaches && recommendedApproaches.length > 0) {
    const approach = recommendedApproaches[Math.floor(Math.random() * recommendedApproaches.length)];
    response += `One effective approach might be to ${approach.toLowerCase()}. `;
  }
  
  if (course) {
    response += `Since you're studying ${course}, I've prepared some learning resources that might work well with your current mood.`;
  } else {
    response += `I'd recommend focusing on ${moodAnalysis.learningStyle.toLowerCase()} right now. Would you like some specific study suggestions?`;
  }
  
  return response;
};

/**
 * Generates a variety response when responses are getting repetitive
 */
const generateVarietyResponse = (moodAnalysis, course) => {
  const varietyResponses = [
    "Let's try a different approach this time. ",
    "I notice we've been discussing similar things. Let's explore something new. ",
    "How about we look at this from a fresh perspective? ",
    "Let's change direction a bit. ",
    "I'd like to offer a different kind of suggestion this time. "
  ];
  
  let response = getRandomResponse(varietyResponses);
  
  const learningApproaches = [
    "try a completely different learning environment",
    "consider taking a short break before returning to your studies",
    "experiment with a new study technique like the Pomodoro method",
    "try explaining the concepts to someone else or even to an imaginary student",
    "create visual maps or diagrams of the material",
    "record yourself explaining difficult concepts and listen back",
    "find real-world applications for what you're learning"
  ];
  
  response += `One idea might be to ${learningApproaches[Math.floor(Math.random() * learningApproaches.length)]}. `;
  
  if (course) {
    response += `Would you like me to suggest some specific ${course} resources that align with this approach?`;
  } else {
    response += `Would you like to tell me more about what you're studying so I can provide more specific suggestions?`;
  }
  
  return response;
};

/**
 * Gets a recommendation based on mood
 */
const getRecommendationForMood = (moodAnalysis) => {
  if (moodAnalysis.recommendedApproaches && moodAnalysis.recommendedApproaches.length > 0) {
    return moodAnalysis.recommendedApproaches[
      Math.floor(Math.random() * moodAnalysis.recommendedApproaches.length)
    ].toLowerCase();
  }
  
  return "focus on what interests you most and take breaks when needed";
};

/**
 * Gets content for a specific topic
 */
const getContentForTopic = (topic, mood) => {
  // This would ideally be expanded with more specific content
  const topicContent = {
    study: "effective study techniques include active recall, spaced repetition, and teaching concepts to others",
    subject: "approaching this subject with a growth mindset can help you overcome challenges and deepen your understanding",
    career: "balancing your studies with career planning can help you apply what you're learning to real-world scenarios",
    health: "maintaining a balance between studying and self-care is crucial for long-term success",
    technology: "using technology mindfully can enhance your learning experience without becoming a distraction",
    personal: "your personal experiences and perspectives can enrich your learning process"
  };
  
  return topicContent[topic] || "focusing on your current interests while being mindful of your emotional state can enhance learning";
};

/**
 * Gets a recommendation for a specific course
 */
const getRecommendationForCourse = (course, mood) => {
  // This would ideally be expanded with course-specific recommendations
  const positiveRecommendations = [
    "try tackling the most challenging concepts first while your energy is high",
    "consider exploring advanced topics or optional materials that extend beyond the core curriculum",
    "you might benefit from collaborative study sessions or discussion groups"
  ];
  
  const negativeRecommendations = [
    "focus on reviewing fundamental concepts and building confidence with the basics",
    "break complex topics into smaller, more manageable parts",
    "consider using visual aids or alternative learning formats that might feel less demanding"
  ];
  
  const neutralRecommendations = [
    "a systematic approach to covering all the required material might be most effective",
    "balancing theory with practical applications can help solidify your understanding",
    "alternating between different topics within the course can help maintain engagement"
  ];
  
  if (mood === 'happy' || mood === 'excited' || mood === 'content') {
    return positiveRecommendations[Math.floor(Math.random() * positiveRecommendations.length)];
  } else if (mood === 'sad' || mood === 'angry' || mood === 'fearful') {
    return negativeRecommendations[Math.floor(Math.random() * negativeRecommendations.length)];
  } else {
    return neutralRecommendations[Math.floor(Math.random() * neutralRecommendations.length)];
  }
};

/**
 * Gets a random response from an array of responses
 */
const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

export { generateResponse };
