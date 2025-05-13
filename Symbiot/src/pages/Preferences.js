import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, doc, updateDoc } from '../firebase';

const Preferences = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated via session storage
    const uid = sessionStorage.getItem("uid");
    if (!uid) {
      alert("User not found. Please sign up again.");
      navigate('/signup');
    }
  }, [navigate]);

  const selectPreference = async (preference) => {
    const uid = sessionStorage.getItem("uid");
    if (!uid) {
      alert("Session expired. Please sign up again.");
      navigate('/signup');
      return;
    }

    try {
      await updateDoc(doc(db, "users", uid), {
        preference: preference
      });

      alert("Preference saved! Redirecting to dashboard...");
      // Keep the UID in session storage for now
      navigate('/dashboard');
    } catch (error) {
      alert(`Error saving preference: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-semibold text-center text-white mb-8">
        Select Your Analysis Preference
      </h2>

      <div className="flex flex-wrap justify-center gap-5">
        <div className="preference-card">
          <img
            src="https://img.icons8.com/color/96/video-call.png"
            alt="Audio Video Icon"
            className="preference-card-img"
          />
          <h3 className="preference-card-title text-xl font-medium">
            Audio & Video Based Analysis
          </h3>
          <p className="preference-card-text">
            Interact using your voice or camera for a more immersive AI experience.
          </p>
          <button
            type="button"
            onClick={() => selectPreference('audio_video')}
            className="preference-card-button"
          >
            Select
          </button>
        </div>

        <div className="preference-card">
          <img
            src="https://img.icons8.com/color/96/chat-message.png"
            alt="Text Icon"
            className="preference-card-img"
          />
          <h3 className="preference-card-title text-xl font-medium">
            Text Based Analysis
          </h3>
          <p className="preference-card-text">
            Communicate through text chat for a more traditional AI interaction.
          </p>
          <button
            type="button"
            onClick={() => selectPreference('text')}
            className="preference-card-button"
          >
            Select
          </button>
        </div>

        <div className="preference-card">
          <img
            src="https://img.icons8.com/color/96/artificial-intelligence.png"
            alt="AI Companion Icon"
            className="preference-card-img"
          />
          <h3 className="preference-card-title text-xl font-medium">
            AI Learning Companion
          </h3>
          <p className="preference-card-text">
            Get personalized study recommendations based on your mood and learning style.
          </p>
          <button
            type="button"
            onClick={() => selectPreference('ai_companion')}
            className="preference-card-button"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
