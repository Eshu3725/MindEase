/**
 * Service for analyzing user's mood based on text input
 * Uses a simple rule-based approach for mood detection
 */

// Emotion keywords and their associated patterns
const emotionPatterns = {
  happy: [
    /happy|joy|excited|great|wonderful|fantastic|excellent|awesome|delighted|pleased|thrilled|cheerful|content|glad|positive|smile|laugh/i,
    /having fun|feeling good|good mood|great day|love it|enjoying|excited about/i
  ],

  sad: [
    /sad|unhappy|depressed|down|blue|gloomy|miserable|heartbroken|disappointed|upset|discouraged|hopeless|grief|sorrow/i,
    /feeling down|bad day|not feeling well|lost|alone|lonely|miss|missing|hard time|struggling with/i
  ],

  angry: [
    /angry|mad|furious|annoyed|irritated|frustrated|outraged|enraged|hostile|bitter|resentful|indignant|irate/i,
    /pissed off|fed up|had enough|so annoying|hate|can't stand|sick of|tired of|bothers me/i
  ],

  fearful: [
    /afraid|scared|frightened|terrified|anxious|worried|nervous|uneasy|apprehensive|concerned|dread|panic|terror|horror/i,
    /fear of|worried about|nervous about|scared of|afraid of|terrified of|anxious about|panic attack/i
  ],

  surprised: [
    /surprised|shocked|amazed|astonished|stunned|startled|unexpected|wow|whoa|unbelievable|incredible|remarkable/i,
    /can't believe|didn't expect|never thought|who knew|surprising|out of nowhere|blown away/i
  ],

  disgusted: [
    /disgusted|gross|revolting|nauseated|repulsed|sickened|appalled|horrified|offended|dislike|aversion/i,
    /makes me sick|can't stomach|turned off by|grossed out|put off|distasteful|offensive/i
  ],

  neutral: [
    /okay|fine|alright|so-so|average|neutral|indifferent|neither|balanced|moderate|standard|typical/i,
    /just okay|doing fine|nothing special|as usual|normal day|regular|ordinary|common|everyday/i
  ],

  confused: [
    /confused|puzzled|perplexed|unsure|uncertain|unclear|ambiguous|bewildered|disoriented|lost|doubtful/i,
    /don't understand|not sure|what do you mean|how does|why is|can you explain|need help with|struggling to understand/i
  ],

  tired: [
    /tired|exhausted|sleepy|fatigued|drained|weary|worn out|lethargic|drowsy|sluggish|beat|spent/i,
    /need sleep|lack of energy|no energy|low energy|need rest|haven't slept|sleep deprived|burned out/i
  ],

  stressed: [
    /stressed|overwhelmed|pressured|burdened|overloaded|tense|strained|frazzled|swamped|busy|hectic/i,
    /too much|can't handle|lot of pressure|deadline|running out of time|no time|behind schedule/i
  ],

  curious: [
    /curious|interested|intrigued|fascinated|wonder|questioning|inquisitive|eager|keen|captivated/i,
    /want to know|tell me about|how does|what is|why does|interested in learning|want to learn/i
  ],

  motivated: [
    /motivated|inspired|determined|driven|ambitious|enthusiastic|eager|passionate|dedicated|committed/i,
    /want to achieve|going to|planning to|working on|trying to|aiming to|goal|objective|purpose/i
  ]
};

// Learning style recommendations based on mood
const moodLearningStyles = {
  happy: {
    description: "Your positive mood is great for creative and exploratory learning!",
    learningStyle: "Exploratory and creative learning",
    recommendedApproaches: [
      "Try challenging, novel concepts",
      "Engage in group discussions or collaborative projects",
      "Explore creative applications of what you're learning"
    ]
  },

  sad: {
    description: "When feeling down, gentle and supportive learning approaches work best.",
    learningStyle: "Supportive and structured learning",
    recommendedApproaches: [
      "Focus on small, achievable goals",
      "Review familiar material before tackling new concepts",
      "Use positive reinforcement and celebrate small wins"
    ]
  },

  angry: {
    description: "Channel your energy into focused, practical learning tasks.",
    learningStyle: "Practical and focused learning",
    recommendedApproaches: [
      "Work on problem-solving exercises",
      "Focus on practical applications",
      "Break complex tasks into manageable steps"
    ]
  },

  fearful: {
    description: "When feeling anxious, structured and clear learning paths help build confidence.",
    learningStyle: "Structured and guided learning",
    recommendedApproaches: [
      "Follow step-by-step tutorials",
      "Start with the basics and build gradually",
      "Use familiar learning methods that have worked for you before"
    ]
  },

  surprised: {
    description: "Your curious state of mind is perfect for exploring new perspectives!",
    learningStyle: "Exploratory and innovative learning",
    recommendedApproaches: [
      "Connect new concepts to what you already know",
      "Explore different perspectives on the topic",
      "Try unconventional learning approaches"
    ]
  },

  disgusted: {
    description: "When feeling averse, focus on clear, relevant content with obvious value.",
    learningStyle: "Clear and purposeful learning",
    recommendedApproaches: [
      "Focus on the practical value and relevance of what you're learning",
      "Use clean, well-organized learning materials",
      "Set clear objectives for your learning session"
    ]
  },

  neutral: {
    description: "Your balanced state is good for comprehensive, analytical learning.",
    learningStyle: "Balanced and analytical learning",
    recommendedApproaches: [
      "Take a systematic approach to the subject",
      "Balance theory with practical applications",
      "Engage in critical thinking and analysis"
    ]
  },

  confused: {
    description: "When confused, focus on clarifying fundamentals before moving forward.",
    learningStyle: "Clarifying and foundational learning",
    recommendedApproaches: [
      "Review basic concepts and terminology",
      "Seek clear explanations and examples",
      "Ask questions and verify your understanding"
    ]
  },

  tired: {
    description: "When tired, shorter, more engaging learning sessions are most effective.",
    learningStyle: "Brief and engaging learning",
    recommendedApproaches: [
      "Keep learning sessions short (15-25 minutes)",
      "Use multimedia and interactive content",
      "Take frequent breaks and vary your activities"
    ]
  },

  stressed: {
    description: "When stressed, organized and manageable learning approaches help reduce overwhelm.",
    learningStyle: "Organized and manageable learning",
    recommendedApproaches: [
      "Break learning into small, manageable chunks",
      "Create a clear study plan with priorities",
      "Use relaxation techniques before studying"
    ]
  },

  curious: {
    description: "Your curiosity is perfect for deep, inquiry-based learning!",
    learningStyle: "Inquiry-based and exploratory learning",
    recommendedApproaches: [
      "Follow your questions and interests",
      "Explore connections between different topics",
      "Seek out diverse resources and perspectives"
    ]
  },

  motivated: {
    description: "Your motivation is perfect for goal-oriented, challenging learning!",
    learningStyle: "Goal-oriented and challenging learning",
    recommendedApproaches: [
      "Set specific learning goals and track your progress",
      "Challenge yourself with advanced material",
      "Apply what you learn to real-world projects"
    ]
  }
};

/**
 * Analyze text to determine the user's mood
 * @param {string} text - The text to analyze
 * @returns {Object} - The detected mood and learning recommendations
 */
const analyzeTextMood = (text) => {
  if (!text || text.trim() === '') {
    return {
      mood: 'neutral',
      confidence: 0,
      ...moodLearningStyles.neutral
    };
  }

  // Check for explicit negative mood statements first
  const negativePatterns = [
    /not (?:in a |feeling )?good/i,
    /not (?:in a |feeling )?great/i,
    /not (?:in a |feeling )?well/i,
    /not (?:in a |feeling )?happy/i,
    /not (?:in a |feeling )?positive/i,
    /bad mood/i,
    /feeling bad/i,
    /feeling down/i,
    /feeling sad/i,
    /feeling terrible/i,
    /feeling awful/i,
    /feeling depressed/i
  ];

  // Check for explicit negative mood statements
  for (const pattern of negativePatterns) {
    if (pattern.test(text)) {
      // If we find an explicit negative mood statement, default to sad
      return {
        mood: 'sad',
        confidence: 0.8,
        ...moodLearningStyles.sad
      };
    }
  }

  // Count matches for each emotion
  const emotionScores = {};

  for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
    emotionScores[emotion] = 0;

    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        emotionScores[emotion] += matches.length;
      }
    }
  }

  // Find the emotion with the highest score
  let detectedMood = 'neutral';
  let highestScore = 0;

  for (const [emotion, score] of Object.entries(emotionScores)) {
    if (score > highestScore) {
      highestScore = score;
      detectedMood = emotion;
    }
  }

  // Calculate confidence (0-1)
  const totalScore = Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
  const confidence = totalScore > 0 ? highestScore / totalScore : 0;

  // Get learning recommendations for the detected mood
  const learningRecommendations = moodLearningStyles[detectedMood] || moodLearningStyles.neutral;

  return {
    mood: detectedMood,
    confidence,
    ...learningRecommendations
  };
};

export { analyzeTextMood, moodLearningStyles };
