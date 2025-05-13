/**
 * Advanced Input Analysis Service
 * Analyzes user input to determine intent, questions, and topics
 */

// Question patterns for detecting different types of questions
const questionPatterns = {
  howTo: [
    /how (do|can|should|would) (i|you|we|they|one)/i,
    /what('s| is) the (best|right|proper|recommended) way to/i,
    /what steps (should|do) (i|you|we|they)/i,
    /guide|tutorial|instructions|steps|process/i
  ],
  
  factual: [
    /what (is|are|was|were)/i,
    /who (is|are|was|were)/i,
    /where (is|are|was|were)/i,
    /when (is|are|was|were)/i,
    /why (is|are|was|were)/i,
    /can you (tell|explain)/i,
    /do you know/i
  ],
  
  opinion: [
    /what do you think/i,
    /how do you feel/i,
    /your (thoughts|opinion|take|perspective)/i,
    /would you recommend/i,
    /is it (good|bad|worth|better)/i,
    /should i/i
  ],
  
  clarification: [
    /what do you mean/i,
    /can you clarify/i,
    /i don't understand/i,
    /that doesn't make sense/i,
    /confused|unclear|ambiguous/i
  ],
  
  personal: [
    /how are you/i,
    /what('s| is) your name/i,
    /who are you/i,
    /tell me about yourself/i,
    /what can you do/i,
    /your (capabilities|functions|features)/i
  ],
  
  preference: [
    /do you (like|enjoy|prefer|love|hate)/i,
    /what('s| is) your favorite/i,
    /would you rather/i
  ]
};

// Topic detection patterns
const topicPatterns = {
  study: [
    /study(ing)?|learn(ing)?|education|school|college|university|course|class|lecture|assignment|homework|exam|test|quiz|grade/i
  ],
  
  subject: [
    /math|mathematics|algebra|calculus|geometry|trigonometry/i,
    /science|biology|chemistry|physics|astronomy|geology/i,
    /history|geography|economics|politics|sociology|psychology/i,
    /literature|language|grammar|writing|reading|poetry|essay/i,
    /art|music|painting|drawing|sculpture|photography/i,
    /computer|programming|coding|software|hardware|technology/i
  ],
  
  career: [
    /job|career|profession|work|employment|resume|interview|hiring|salary|wage/i,
    /company|business|industry|market|startup|entrepreneur/i
  ],
  
  health: [
    /health|fitness|exercise|workout|diet|nutrition|food|eating|sleep|rest|stress|anxiety|depression|mental health/i
  ],
  
  entertainment: [
    /movie|film|tv|television|show|series|episode|actor|actress|director|book|novel|author|game|gaming|play/i
  ],
  
  technology: [
    /computer|laptop|phone|smartphone|tablet|device|software|app|application|website|internet|online|digital/i
  ],
  
  personal: [
    /family|friend|relationship|partner|spouse|marriage|dating|love|emotion|feeling|life|personal/i
  ]
};

// Sentiment patterns
const sentimentPatterns = {
  positive: [
    /good|great|excellent|amazing|wonderful|fantastic|awesome|brilliant|outstanding|superb|terrific|fabulous/i,
    /happy|glad|pleased|delighted|content|satisfied|joy|enjoy|love|like|appreciate|grateful|thankful/i,
    /excited|thrilled|enthusiastic|eager|interested|curious|motivated|inspired|impressed|hopeful/i
  ],
  
  negative: [
    /bad|terrible|horrible|awful|poor|disappointing|frustrating|annoying|irritating|infuriating/i,
    /sad|unhappy|upset|depressed|miserable|gloomy|disappointed|discouraged|disheartened/i,
    /angry|mad|furious|outraged|enraged|hostile|bitter|resentful|indignant|irate/i,
    /afraid|scared|frightened|terrified|anxious|worried|nervous|uneasy|apprehensive|concerned/i,
    /confused|puzzled|perplexed|unsure|uncertain|unclear|ambiguous|bewildered|disoriented/i,
    /tired|exhausted|sleepy|fatigued|drained|weary|worn out|lethargic|drowsy|sluggish/i,
    /stressed|overwhelmed|pressured|burdened|overloaded|tense|strained|frazzled|swamped/i
  ],
  
  neutral: [
    /okay|fine|alright|so-so|average|neutral|indifferent|neither|balanced|moderate|standard|typical/i,
    /normal|regular|ordinary|common|everyday|usual|routine|standard|conventional|traditional/i
  ]
};

// Command patterns
const commandPatterns = {
  help: [
    /help( me)?|assist( me)?|support( me)?/i,
    /i need (help|assistance|support)/i
  ],
  
  suggestion: [
    /suggest|recommend|advise|propose|offer/i,
    /give me (a|some) (suggestion|recommendation|advice|idea|tip)/i,
    /what should i/i
  ],
  
  explanation: [
    /explain|describe|elaborate|clarify|define/i,
    /tell me (about|how|why|what|when|where)/i,
    /i want to (know|understand|learn)/i
  ]
};

/**
 * Analyzes user input to determine intent, questions, topics, and sentiment
 * @param {string} input - The user's input text
 * @returns {Object} - Analysis results
 */
const analyzeInput = (input) => {
  if (!input || input.trim() === '') {
    return {
      isEmpty: true,
      isQuestion: false,
      questionTypes: [],
      topics: [],
      sentiment: 'neutral',
      commands: [],
      originalInput: input
    };
  }
  
  const cleanInput = input.trim();
  
  // Detect if input is a question
  const isQuestion = /\?$/.test(cleanInput) || 
                    /^(what|who|where|when|why|how|can|could|would|should|is|are|do|does|did)/i.test(cleanInput);
  
  // Detect question types
  const questionTypes = [];
  for (const [type, patterns] of Object.entries(questionPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(cleanInput)) {
        questionTypes.push(type);
        break;
      }
    }
  }
  
  // Detect topics
  const topics = [];
  for (const [topic, patterns] of Object.entries(topicPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(cleanInput)) {
        topics.push(topic);
        break;
      }
    }
  }
  
  // Detect sentiment
  let sentiment = 'neutral';
  let sentimentScore = {
    positive: 0,
    negative: 0,
    neutral: 0
  };
  
  for (const [type, patterns] of Object.entries(sentimentPatterns)) {
    for (const pattern of patterns) {
      const matches = cleanInput.match(pattern);
      if (matches) {
        sentimentScore[type] += matches.length;
      }
    }
  }
  
  // Determine dominant sentiment
  if (sentimentScore.positive > sentimentScore.negative && 
      sentimentScore.positive > sentimentScore.neutral) {
    sentiment = 'positive';
  } else if (sentimentScore.negative > sentimentScore.positive && 
             sentimentScore.negative > sentimentScore.neutral) {
    sentiment = 'negative';
  }
  
  // Detect commands
  const commands = [];
  for (const [command, patterns] of Object.entries(commandPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(cleanInput)) {
        commands.push(command);
        break;
      }
    }
  }
  
  return {
    isEmpty: false,
    isQuestion,
    questionTypes: [...new Set(questionTypes)],
    topics: [...new Set(topics)],
    sentiment,
    commands: [...new Set(commands)],
    originalInput: cleanInput
  };
};

export { analyzeInput };
