/**
 * Service for fetching course content from external APIs
 * Provides dynamic recommendations based on emotion and course
 */

// YouTube API key (in a real app, this would be stored in environment variables)
const YOUTUBE_API_KEY = 'AIzaSyATSN1sAjas0MiKmo6RDMdUCZ1aXZReBus';

// List of educational APIs and resources
const RESOURCES = {
  // Khan Academy topics mapping
  khanAcademy: {
    "Computer Science": "computer-programming",
    "Mathematics": "math",
    "Physics": "physics",
    "Chemistry": "chemistry",
    "Biology": "biology",
    "Economics": "economics-finance-domain",
    "Arts & Humanities": "humanities",
    "Medicine": "health-and-medicine"
  },

  // MIT OpenCourseWare departments
  mitOpenCourseWare: {
    "Computer Science": "electrical-engineering-and-computer-science",
    "Mathematics": "mathematics",
    "Physics": "physics",
    "Chemistry": "chemistry",
    "Biology": "biology",
    "Economics": "economics",
    "Business Administration": "management",
    "Mechanical Engineering": "mechanical-engineering",
    "Civil Engineering": "civil-and-environmental-engineering"
  },

  // Coursera subject mapping
  coursera: {
    "Computer Science": "computer-science",
    "Data Science": "data-science",
    "Business": "business",
    "Mathematics": "math-and-logic",
    "Psychology": "psychology",
    "Language Learning": "language-learning",
    "Information Technology": "information-technology"
  }
};

/**
 * Fetch YouTube videos related to a course and emotion
 * @param {string} course - The course name
 * @param {string} emotion - The detected emotion
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} - Array of video objects
 */
const fetchYouTubeVideos = async (course, emotion, maxResults = 3) => {
  try {
    // Create search query based on course and learning style from emotion
    const learningStyles = {
      happy: "interactive engaging",
      sad: "gentle supportive",
      angry: "focused practical",
      neutral: "comprehensive",
      surprised: "innovative creative",
      fearful: "step-by-step guided",
      disgusted: "clear structured",
      excited: "challenging advanced",
      content: "in-depth analytical"
    };

    const style = learningStyles[emotion.toLowerCase()] || "comprehensive";
    const query = `${course} ${style} tutorial lecture`;

    console.log(`Searching for: ${query}`);

    // MOCK IMPLEMENTATION - In a real app, this would call the YouTube API
    // This mock data simulates YouTube API responses for different courses
    const mockVideos = {
      "Computer Science": [
        {
          id: "zOjov-2OZ0E",
          title: "Introduction to Programming - Basics",
          description: "Learn the fundamentals of programming in this comprehensive tutorial",
          thumbnail: "https://i.ytimg.com/vi/zOjov-2OZ0E/mqdefault.jpg",
          url: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
          source: 'YouTube'
        },
        {
          id: "RBSGKlAvoiM",
          title: "Data Structures Easy to Advanced Course",
          description: "Learn all about data structures in this comprehensive course",
          thumbnail: "https://i.ytimg.com/vi/RBSGKlAvoiM/mqdefault.jpg",
          url: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
          source: 'YouTube'
        }
      ],
      "Mathematics": [
        {
          id: "WUvTyaaNkzM",
          title: "Calculus 1 - Full College Course",
          description: "Learn Calculus in this full college course",
          thumbnail: "https://i.ytimg.com/vi/WUvTyaaNkzM/mqdefault.jpg",
          url: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
          source: 'YouTube'
        },
        {
          id: "fNk_zzaMoSs",
          title: "Linear Algebra - Full College Course",
          description: "Learn Linear Algebra in this full college course",
          thumbnail: "https://i.ytimg.com/vi/fNk_zzaMoSs/mqdefault.jpg",
          url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
          source: 'YouTube'
        }
      ],
      "Psychology": [
        {
          id: "vo4pMVb0R6M",
          title: "Introduction to Psychology",
          description: "Comprehensive introduction to the field of psychology",
          thumbnail: "https://i.ytimg.com/vi/vo4pMVb0R6M/mqdefault.jpg",
          url: "https://www.youtube.com/watch?v=vo4pMVb0R6M",
          source: 'YouTube'
        },
        {
          id: "R-sVnmmw6WY",
          title: "Cognitive Psychology - Attention and Memory",
          description: "Learn about cognitive processes in this detailed lecture",
          thumbnail: "https://i.ytimg.com/vi/R-sVnmmw6WY/mqdefault.jpg",
          url: "https://www.youtube.com/watch?v=R-sVnmmw6WY",
          source: 'YouTube'
        }
      ]
    };

    // Find videos for the course or return default videos
    let videos = [];

    // Try to find exact match
    if (mockVideos[course]) {
      videos = mockVideos[course];
    } else {
      // Try to find partial match
      for (const [courseName, courseVideos] of Object.entries(mockVideos)) {
        if (course.toLowerCase().includes(courseName.toLowerCase()) ||
            courseName.toLowerCase().includes(course.toLowerCase())) {
          videos = courseVideos;
          break;
        }
      }

      // If still no match, use Computer Science as default
      if (videos.length === 0) {
        videos = mockVideos["Computer Science"];
      }
    }

    // Simulate delay for API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return videos.slice(0, maxResults);
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};

/**
 * Get Khan Academy resources for a course
 * @param {string} course - The course name
 * @returns {Array} - Array of resource objects
 */
const getKhanAcademyResources = (course) => {
  // Find the closest matching topic
  let topic = null;
  for (const [courseName, topicSlug] of Object.entries(RESOURCES.khanAcademy)) {
    if (course.toLowerCase().includes(courseName.toLowerCase())) {
      topic = topicSlug;
      break;
    }
  }

  if (!topic) {
    return [];
  }

  // Return formatted resources
  return [
    {
      title: `${course} Fundamentals`,
      description: `Learn the basics of ${course} with Khan Academy's comprehensive curriculum.`,
      url: `https://www.khanacademy.org/${topic}`,
      source: 'Khan Academy'
    }
  ];
};

/**
 * Get MIT OpenCourseWare resources for a course
 * @param {string} course - The course name
 * @returns {Array} - Array of resource objects
 */
const getMITOpenCourseWareResources = (course) => {
  // Find the closest matching department
  let department = null;
  for (const [courseName, deptSlug] of Object.entries(RESOURCES.mitOpenCourseWare)) {
    if (course.toLowerCase().includes(courseName.toLowerCase())) {
      department = deptSlug;
      break;
    }
  }

  if (!department) {
    return [];
  }

  // Return formatted resources
  return [
    {
      title: `MIT OpenCourseWare: ${course}`,
      description: `Free MIT courses and materials for ${course}.`,
      url: `https://ocw.mit.edu/search/?d=${department}`,
      source: 'MIT OpenCourseWare'
    }
  ];
};

/**
 * Get Coursera courses for a subject
 * @param {string} course - The course name
 * @returns {Array} - Array of resource objects
 */
const getCourseraResources = (course) => {
  // Find the closest matching subject
  let subject = null;
  for (const [courseName, subjectSlug] of Object.entries(RESOURCES.coursera)) {
    if (course.toLowerCase().includes(courseName.toLowerCase())) {
      subject = subjectSlug;
      break;
    }
  }

  if (!subject) {
    return [];
  }

  // Return formatted resources
  return [
    {
      title: `Coursera: ${course} Courses`,
      description: `Online courses in ${course} from top universities and companies.`,
      url: `https://www.coursera.org/browse/${subject}`,
      source: 'Coursera'
    }
  ];
};

/**
 * Fetch course content from multiple sources
 * @param {string} course - The course name
 * @param {string} emotion - The detected emotion
 * @returns {Promise<Object>} - Object containing resources from different sources
 */
const fetchCourseContent = async (course, emotion) => {
  try {
    // Fetch YouTube videos
    const youtubeVideos = await fetchYouTubeVideos(course, emotion);

    // Get resources from other platforms
    const khanAcademy = getKhanAcademyResources(course);
    const mitOpenCourseWare = getMITOpenCourseWareResources(course);
    const coursera = getCourseraResources(course);

    // Combine all resources
    return {
      videos: youtubeVideos,
      resources: [...khanAcademy, ...mitOpenCourseWare, ...coursera]
    };
  } catch (error) {
    console.error("Error fetching course content:", error);
    return { videos: [], resources: [] };
  }
};

export { fetchCourseContent };
