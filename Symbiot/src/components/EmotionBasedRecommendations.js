import React, { useState, useEffect } from 'react';
import { auth, db, doc, getDoc } from '../firebase';
import { getTopicRecommendations } from '../utils/emotionRecommendations';
import { syllabusData } from '../pages/Syllabus'; // Import syllabus data

const EmotionBasedRecommendations = ({ emotion }) => {
  const [userCourse, setUserCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchUserCourse = async () => {
      try {
        const user = auth.currentUser;
        
        if (!user) {
          console.log('No user logged in');
          setLoading(false);
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCourse();
  }, []);

  useEffect(() => {
    if (!loading && userCourse && emotion) {
      // Get recommendations based on emotion and course
      const recs = getTopicRecommendations(emotion, userCourse, syllabusData);
      setRecommendations(recs);
    }
  }, [loading, userCourse, emotion]);

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-[#1F2833] rounded-lg animate-pulse">
        <div className="h-6 bg-[#0B0C10] rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-[#0B0C10] rounded w-full mb-2"></div>
        <div className="h-4 bg-[#0B0C10] rounded w-5/6"></div>
      </div>
    );
  }

  if (!userCourse) {
    return (
      <div className="mt-4 p-4 bg-[#1F2833] rounded-lg">
        <h3 className="text-lg font-medium text-[#66FCF1]">Course Recommendations</h3>
        <p className="text-[#CFC6C7]">
          No course information found. Please update your profile with your course details.
        </p>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  const { emotionProfile, recommendedTopics, message } = recommendations;

  return (
    <div className="mt-6 bg-[#1F2833] rounded-lg overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-medium text-[#66FCF1] mb-2">
          Learning Recommendations for {userCourse}
        </h3>
        
        <div className="mb-4">
          <p className="text-[#CFC6C7] mb-2">{emotionProfile.description}</p>
          
          <div className="bg-[#0B0C10] p-3 rounded-lg mb-3">
            <p className="text-sm font-medium text-[#66FCF1] mb-1">Recommended Learning Approach:</p>
            <p className="text-[#CFC6C7] capitalize">{emotionProfile.learningStyle}</p>
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#66FCF1] hover:text-[#45A29E] text-sm flex items-center"
          >
            {expanded ? 'Show less' : 'Show more details'}
            <span className="ml-1">{expanded ? '▲' : '▼'}</span>
          </button>
          
          {expanded && (
            <div className="mt-3 space-y-3">
              <div className="bg-[#0B0C10] p-3 rounded-lg">
                <p className="text-sm font-medium text-[#66FCF1] mb-1">Focus on:</p>
                <ul className="list-disc list-inside text-[#CFC6C7]">
                  {emotionProfile.focusAreas.map((area, index) => (
                    <li key={index} className="capitalize">{area}</li>
                  ))}
                </ul>
              </div>
              
              {emotionProfile.avoidContentTypes.length > 0 && (
                <div className="bg-[#0B0C10] p-3 rounded-lg">
                  <p className="text-sm font-medium text-[#66FCF1] mb-1">Consider avoiding:</p>
                  <ul className="list-disc list-inside text-[#CFC6C7]">
                    {emotionProfile.avoidContentTypes.map((type, index) => (
                      <li key={index} className="capitalize">{type}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        
        {message ? (
          <p className="text-[#CFC6C7]">{message}</p>
        ) : (
          <div>
            <h4 className="font-medium text-[#66FCF1] mb-2">Recommended Topics:</h4>
            <ul className="space-y-2">
              {recommendedTopics.map(({ topic, youtube, reference }) => (
                <li key={topic} className="bg-[#0B0C10] p-3 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h5 className="font-medium text-[#CFC6C7] mb-2 sm:mb-0">{topic}</h5>
                    <div className="flex space-x-2">
                      <a
                        href={youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                      >
                        YouTube
                      </a>
                      <a
                        href={reference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-[#66FCF1] text-[#0B0C10] rounded-md text-sm hover:bg-[#45A29E]"
                      >
                        Reference
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionBasedRecommendations;
