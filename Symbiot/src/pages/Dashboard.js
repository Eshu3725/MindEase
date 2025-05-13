import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <img
            src="https://img.icons8.com/fluency/48/000000/chatbot.png"
            alt="Logo"
            className="w-10"
          />
          <h1 className="text-2xl font-bold text-primary-dark">
            MIND<span className="text-primary-light">EASE</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Your Dashboard</h2>
        <p className="text-gray-600">
          This is a placeholder dashboard. In a real application, you would see your personalized content here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Your Profile</h3>
          <p className="text-gray-600 mb-3">Email: {user.email}</p>
          <button
            type="button"
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            Edit Profile
          </button>
        </div>

        <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
          <h3 className="text-lg font-medium text-purple-800 mb-2">AI Assistant</h3>
          <p className="text-gray-600 mb-3">Start a conversation with your AI assistant</p>
          <Link
            to="/chatbot"
            className="inline-flex items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Chat icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Start Chat
          </Link>
        </div>

        <div className="bg-green-50 p-5 rounded-lg border border-green-100">
          <h3 className="text-lg font-medium text-green-800 mb-2">Video & Voice Chat</h3>
          <p className="text-gray-600 mb-3">Connect with others through video and voice calls</p>
          <Link
            to="/video-chat"
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Video camera icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Start Video Chat
          </Link>
        </div>

        <div className="bg-pink-50 p-5 rounded-lg border border-pink-100">
          <h3 className="text-lg font-medium text-pink-800 mb-2">Emotion Analysis</h3>
          <p className="text-gray-600 mb-3">AI-powered analysis of your emotions via video</p>
          <Link
            to="/emotion-analysis"
            className="inline-flex items-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Emotion analysis icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Analyze Emotions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
