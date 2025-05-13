/**
 * This utility maps emotions to learning recommendations
 * It provides personalized syllabus recommendations based on emotional state
 */

// Map emotions to learning approaches
const emotionLearningMap = {
  // Positive emotions
  happy: {
    learningStyle: "exploratory",
    description: "You're in a positive mood! This is a great time for creative and exploratory learning.",
    recommendedContentTypes: ["interactive exercises", "group discussions", "challenging concepts"],
    avoidContentTypes: [],
    focusAreas: ["new concepts", "creative problem-solving", "collaborative work"]
  },
  
  excited: {
    learningStyle: "energetic",
    description: "Your excitement can be channeled into energetic learning sessions!",
    recommendedContentTypes: ["hands-on projects", "interactive simulations", "challenging problems"],
    avoidContentTypes: ["passive reading"],
    focusAreas: ["practical applications", "complex problems", "skill development"]
  },
  
  content: {
    learningStyle: "reflective",
    description: "Your balanced emotional state is perfect for thoughtful, reflective learning.",
    recommendedContentTypes: ["comprehensive readings", "analytical exercises", "detailed studies"],
    avoidContentTypes: [],
    focusAreas: ["deep understanding", "connecting concepts", "analytical thinking"]
  },
  
  // Neutral emotions
  neutral: {
    learningStyle: "balanced",
    description: "Your neutral state allows for flexible learning approaches.",
    recommendedContentTypes: ["varied content", "balanced theory and practice"],
    avoidContentTypes: [],
    focusAreas: ["foundational concepts", "systematic learning", "building knowledge base"]
  },
  
  // Challenging emotions
  sad: {
    learningStyle: "gentle",
    description: "When feeling down, gentle and structured learning can be most effective.",
    recommendedContentTypes: ["short, achievable modules", "positive reinforcement", "familiar topics"],
    avoidContentTypes: ["overwhelming content", "high-pressure activities"],
    focusAreas: ["review and reinforcement", "small achievements", "comfortable topics"]
  },
  
  angry: {
    learningStyle: "focused",
    description: "Channel your energy into focused, structured learning.",
    recommendedContentTypes: ["problem-solving", "physical activities", "practical applications"],
    avoidContentTypes: ["theoretical discussions", "ambiguous content"],
    focusAreas: ["concrete tasks", "clear objectives", "tangible results"]
  },
  
  fearful: {
    learningStyle: "supportive",
    description: "When anxious, supportive and structured learning environments work best.",
    recommendedContentTypes: ["step-by-step guides", "clear instructions", "familiar content"],
    avoidContentTypes: ["high-stakes assessments", "ambiguous tasks"],
    focusAreas: ["building confidence", "incremental challenges", "structured progression"]
  },
  
  surprised: {
    learningStyle: "adaptive",
    description: "Surprise can be channeled into curiosity and new perspectives.",
    recommendedContentTypes: ["novel concepts", "perspective-shifting content", "creative approaches"],
    avoidContentTypes: [],
    focusAreas: ["connecting unexpected ideas", "exploring new angles", "creative thinking"]
  },
  
  disgusted: {
    learningStyle: "clarifying",
    description: "This emotion might indicate a need for clarity and purpose in learning.",
    recommendedContentTypes: ["clear, structured content", "purpose-driven learning", "practical applications"],
    avoidContentTypes: ["abstract concepts", "ambiguous content"],
    focusAreas: ["relevance and purpose", "practical value", "clear objectives"]
  }
};

// Get topic recommendations based on emotion and course
const getTopicRecommendations = (emotion, course, syllabusData) => {
  // Default to neutral if emotion not found
  const emotionProfile = emotionLearningMap[emotion.toLowerCase()] || emotionLearningMap.neutral;
  
  // Get course topics if available, otherwise return empty array
  const courseTopics = syllabusData[course] || [];
  
  // If no course topics are available, return general recommendation
  if (courseTopics.length === 0) {
    return {
      emotionProfile,
      recommendedTopics: [],
      message: `No specific topics found for ${course}. Consider exploring introductory content.`
    };
  }
  
  // Return emotion profile and all topics for the course
  return {
    emotionProfile,
    recommendedTopics: courseTopics,
    message: null
  };
};

export { emotionLearningMap, getTopicRecommendations };
