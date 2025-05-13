import React, { useState, useEffect } from 'react';
import { auth, db, doc, getDoc } from '../firebase';
import { fetchCourseContent } from '../services/courseContentService';
import { getCachedItem, setCachedItem } from '../utils/cacheUtil';
import { emotionLearningMap } from '../utils/emotionRecommendations';

const OnlineCourseRecommendations = ({ emotion }) => {
  const [userCourse, setUserCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user's course from Firebase
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
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCourse();
  }, []);

  // Fetch course content when user course and emotion are available
  useEffect(() => {
    const getContent = async () => {
      if (!userCourse || !emotion) return;
      
      try {
        setLoading(true);
        
        // Create cache key
        const cacheKey = `content_${userCourse}_${emotion}`;
        
        // Check cache first
        const cachedContent = getCachedItem(cacheKey);
        if (cachedContent) {
          setContent(cachedContent);
          setLoading(false);
          return;
        }
        
        // Fetch fresh content
        const newContent = await fetchCourseContent(userCourse, emotion);
        
        // Cache the result
        setCachedItem(cacheKey, newContent);
        
        setContent(newContent);
      } catch (err) {
        console.error('Error fetching course content:', err);
        setError('Failed to fetch recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    getContent();
  }, [userCourse, emotion]);

  // Get emotion profile for learning recommendations
  const getEmotionProfile = () => {
    return emotionLearningMap[emotion.toLowerCase()] || emotionLearningMap.neutral;
  };

  if (loading) {
    return (
      <div className="mt-6 bg-[#1F2833] rounded-lg p-4">
        <h3 className="text-lg font-medium text-[#66FCF1] mb-4">
          Finding Online Resources...
        </h3>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#66FCF1]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 bg-[#1F2833] rounded-lg p-4">
        <h3 className="text-lg font-medium text-[#66FCF1] mb-2">
          Online Recommendations
        </h3>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!userCourse) {
    return (
      <div className="mt-6 bg-[#1F2833] rounded-lg p-4">
        <h3 className="text-lg font-medium text-[#66FCF1] mb-2">
          Online Recommendations
        </h3>
        <p className="text-[#CFC6C7]">
          No course information found. Please update your profile with your course details.
        </p>
      </div>
    );
  }

  if (!content || (!content.videos.length && !content.resources.length)) {
    return (
      <div className="mt-6 bg-[#1F2833] rounded-lg p-4">
        <h3 className="text-lg font-medium text-[#66FCF1] mb-2">
          Online Recommendations for {userCourse}
        </h3>
        <p className="text-[#CFC6C7]">
          No online resources found for {userCourse}. Try a different course or check back later.
        </p>
      </div>
    );
  }

  const emotionProfile = getEmotionProfile();

  return (
    <div className="mt-6 bg-[#1F2833] rounded-lg overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-medium text-[#66FCF1] mb-2">
          Online Recommendations for {userCourse}
        </h3>
        
        <div className="mb-4">
          <p className="text-[#CFC6C7] mb-2">{emotionProfile.description}</p>
          
          <div className="bg-[#0B0C10] p-3 rounded-lg mb-3">
            <p className="text-sm font-medium text-[#66FCF1] mb-1">Recommended Learning Approach:</p>
            <p className="text-[#CFC6C7] capitalize">{emotionProfile.learningStyle}</p>
          </div>
        </div>
        
        {/* YouTube Videos */}
        {content.videos.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-[#66FCF1] mb-3">Recommended Videos:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.videos.map(video => (
                <div key={video.id} className="bg-[#0B0C10] rounded-lg overflow-hidden">
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h5 className="font-medium text-[#CFC6C7] text-sm mb-1 line-clamp-2">
                        {video.title}
                      </h5>
                      <p className="text-xs text-gray-400">YouTube</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Other Resources */}
        {content.resources.length > 0 && (
          <div>
            <h4 className="font-medium text-[#66FCF1] mb-3">Educational Resources:</h4>
            <ul className="space-y-2">
              {content.resources.map((resource, index) => (
                <li key={index} className="bg-[#0B0C10] p-3 rounded-lg">
                  <div className="flex flex-col">
                    <h5 className="font-medium text-[#CFC6C7] mb-1">{resource.title}</h5>
                    <p className="text-sm text-gray-400 mb-2">{resource.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{resource.source}</span>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-[#66FCF1] text-[#0B0C10] rounded-md text-sm hover:bg-[#45A29E] transition-colors"
                      >
                        Visit
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

export default OnlineCourseRecommendations;
