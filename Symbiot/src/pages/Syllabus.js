import React, { useState, useEffect } from 'react';
import OnlineCourseSyllabus from '../components/OnlineCourseSyllabus';
import { auth } from '../firebase';

// Legacy syllabusData (can be used as fallback)
export const syllabusData = {
  "Computer Science": [
    {
      topic: "Introduction to Programming",
      youtube: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
      reference: "https://www.codecademy.com/learn/learn-how-to-code"
    },
    {
      topic: "Data Structures",
      youtube: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
      reference: "https://www.geeksforgeeks.org/data-structures/"
    }
  ],
  "Psychology": [
    {
      topic: "Introduction to Psychology",
      youtube: "https://www.youtube.com/watch?v=vo4pMVb0R6M",
      reference: "https://ocw.mit.edu/courses/9-00sc-introduction-to-psychology-fall-2011/"
    },
    {
      topic: "Cognitive Psychology",
      youtube: "https://www.youtube.com/watch?v=R-sVnmmw6WY",
      reference: "https://www.simplypsychology.org/cognitive.html"
    }
  ],
  "Mathematics": [
    {
      topic: "Calculus Basics",
      youtube: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
      reference: "https://www.khanacademy.org/math/calculus-1"
    },
    {
      topic: "Linear Algebra",
      youtube: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
      reference: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
    }
  ]
};

const Syllabus = () => {
  const [expanded, setExpanded] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(() => {
    return JSON.parse(localStorage.getItem("completedTopics")) || {};
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLegacySyllabus, setShowLegacySyllabus] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const toggleSubject = subject => {
    setExpanded(expanded === subject ? null : subject);
  };

  const handleKeyDown = (e, subject) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSubject(subject);
    }
  };

  const handleVisit = (subject, topic) => {
    setTimeout(() => {
      const updated = {
        ...completedTopics,
        [`${subject}-${topic}`]: true
      };
      setCompletedTopics(updated);
      localStorage.setItem("completedTopics", JSON.stringify(updated));
    }, 10000); // 10 seconds delay
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <h1 className="text-3xl font-bold text-[#66FCF1]">📘 Course Syllabus</h1>

      {isLoggedIn ? (
        <>
          <p className="text-[#CFC6C7]">
            Below is your personalized course syllabus based on your selected course.
            These materials are fetched from leading educational platforms to provide you with
            the most relevant and up-to-date content.
          </p>

          {/* Online Course Syllabus Component */}
          <OnlineCourseSyllabus />

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowLegacySyllabus(!showLegacySyllabus)}
              className="px-4 py-2 bg-[#1F2833] text-[#66FCF1] rounded-md hover:bg-[#0B0C10] transition-colors"
            >
              {showLegacySyllabus ? 'Hide General Syllabus' : 'Show General Syllabus'}
            </button>
          </div>

          {showLegacySyllabus && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-[#66FCF1] mb-4">General Syllabus</h2>
              <p className="text-[#CFC6C7] mb-4">
                Explore additional educational resources organized by subject. Topics are marked as completed after 10 seconds of viewing.
              </p>

              {/* Legacy Syllabus Content */}
              {Object.entries(syllabusData).map(([subject, topics]) => (
                <div key={subject} className="bg-[#1F2833] shadow-md rounded-xl p-4 transition-all duration-300 mb-4">
                  <button
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    onKeyDown={(e) => handleKeyDown(e, subject)}
                    aria-expanded={expanded === subject}
                    className="w-full cursor-pointer flex justify-between items-center text-xl font-semibold text-[#66FCF1] hover:text-[#45A29E] bg-transparent border-none"
                  >
                    <span>{subject}</span>
                    <span>{expanded === subject ? '−' : '+'}</span>
                  </button>

                  {expanded === subject && (
                    <ul className="mt-3 space-y-3">
                      {topics.map(({ topic, youtube, reference }) => {
                        const key = `${subject}-${topic}`;
                        const isCompleted = completedTopics[key];

                        return (
                          <li key={topic} className={`p-3 rounded-lg ${isCompleted ? 'bg-[#45A29E]/20' : 'bg-[#0B0C10]'}`}>
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-[#CFC6C7]">
                                {isCompleted && <span className="text-green-400 mr-2">✓</span>}
                                {topic}
                              </h3>
                              <div className="flex space-x-2">
                                <a
                                  href={youtube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => handleVisit(subject, topic)}
                                  className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                                >
                                  YouTube
                                </a>
                                <a
                                  href={reference}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => handleVisit(subject, topic)}
                                  className="px-3 py-1 bg-[#66FCF1] text-[#0B0C10] rounded-md text-sm hover:bg-[#45A29E]"
                                >
                                  Reference
                                </a>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-[#CFC6C7] mb-4">
            Please log in to view your personalized course syllabus. For now, you can explore our general syllabus below.
          </p>

          {/* Legacy Syllabus for non-logged in users */}
          {Object.entries(syllabusData).map(([subject, topics]) => (
            <div key={subject} className="bg-[#1F2833] shadow-md rounded-xl p-4 transition-all duration-300 mb-4">
              <button
                type="button"
                onClick={() => toggleSubject(subject)}
                onKeyDown={(e) => handleKeyDown(e, subject)}
                aria-expanded={expanded === subject}
                className="w-full cursor-pointer flex justify-between items-center text-xl font-semibold text-[#66FCF1] hover:text-[#45A29E] bg-transparent border-none"
              >
                <span>{subject}</span>
                <span>{expanded === subject ? '−' : '+'}</span>
              </button>

              {expanded === subject && (
                <ul className="mt-3 space-y-3">
                  {topics.map(({ topic, youtube, reference }) => {
                    const key = `${subject}-${topic}`;
                    const isCompleted = completedTopics[key];

                    return (
                      <li key={topic} className={`p-3 rounded-lg ${isCompleted ? 'bg-[#45A29E]/20' : 'bg-[#0B0C10]'}`}>
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-[#CFC6C7]">
                            {isCompleted && <span className="text-green-400 mr-2">✓</span>}
                            {topic}
                          </h3>
                          <div className="flex space-x-2">
                            <a
                              href={youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleVisit(subject, topic)}
                              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                            >
                              YouTube
                            </a>
                            <a
                              href={reference}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleVisit(subject, topic)}
                              className="px-3 py-1 bg-[#66FCF1] text-[#0B0C10] rounded-md text-sm hover:bg-[#45A29E]"
                            >
                              Reference
                            </a>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Syllabus;
