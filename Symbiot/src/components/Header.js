import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isActive = (path) => location.pathname === path;

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-[#1F2833] py-4 shadow-md fixed top-0 w-full z-50">
      <nav className="flex justify-between items-center px-6 md:px-12">
        <Link to="/dashboard" className="text-[#66FCF1] text-2xl font-bold">
          MindEase
        </Link>
        <div className="flex items-center space-x-4 text-[#CFC6C7]">
          <Link
            to="/dashboard"
            className={`transition ${
              isActive('/dashboard') ? 'text-[#66FCF1]' : 'hover:text-[#45A29E]'
            }`}
          >
            Home
          </Link>
          <Link
            to="/resources"
            className={`transition ${
              isActive('/resources') ? 'text-[#66FCF1]' : 'hover:text-[#45A29E]'
            }`}
          >
            Resources
          </Link>
          <Link
            to="/chatbot"
            className={`transition ${
              isActive('/chatbot') ? 'text-[#66FCF1]' : 'hover:text-[#45A29E]'
            }`}
          >
            Chatbot
          </Link>
          <Link
            to="/syllabus"
            className={`transition ${
              isActive('/syllabus') ? 'text-[#66FCF1]' : 'hover:text-[#45A29E]'
            }`}
          >
            Syllabus
          </Link>
          <Link
            to="/contact"
            className={`transition ${
              isActive('/contact') ? 'text-[#66FCF1]' : 'hover:text-[#45A29E]'
            }`}
          >
            Contact Us
          </Link>

          {/* Video Chat button - only visible when authenticated */}
          {isAuthenticated && (
            <Link
              to="/video-chat"
              className={`transition ${
                isActive('/video-chat')
                  ? 'text-[#66FCF1] bg-[#0B0C10] px-3 py-1 rounded-lg'
                  : 'bg-[#66FCF1] text-[#0B0C10] hover:bg-[#45A29E] px-3 py-1 rounded-lg'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Video camera icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video Chat
              </span>
            </Link>
          )}

          {/* Emotion Analysis button - only visible when authenticated */}
          {isAuthenticated && (
            <Link
              to="/emotion-analysis"
              className={`transition ${
                isActive('/emotion-analysis')
                  ? 'text-[#66FCF1] bg-[#0B0C10] px-3 py-1 rounded-lg'
                  : 'bg-purple-500 text-white hover:bg-purple-600 px-3 py-1 rounded-lg'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Emotion analysis icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Emotion Analysis
              </span>
            </Link>
          )}

          {/* AI Companion button - only visible when authenticated */}
          {isAuthenticated && (
            <Link
              to="/ai-companion"
              className={`transition ${
                isActive('/ai-companion')
                  ? 'text-[#66FCF1] bg-[#0B0C10] px-3 py-1 rounded-lg'
                  : 'bg-green-500 text-white hover:bg-green-600 px-3 py-1 rounded-lg'
              }`}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="AI companion icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                AI Companion
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
