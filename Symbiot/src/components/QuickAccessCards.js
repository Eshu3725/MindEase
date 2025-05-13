import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickAccessCards = ({ mood }) => {
  const navigate = useNavigate();

  // Default actions
  const actions = [
    { label: '🧘 Guided Meditation', path: '/guided-meditation' },
    { label: '📓 Journaling', path: '/journals' },
    { label: '🤖 Talk to AI Companion', path: '/chatbot' },
    { label: '🚨 Emergency Help', path: '/emergency-help' },
  ];

  // Mood-specific recommendations
  const getMoodRecommendations = () => {
    switch (mood) {
      case 'Sad':
        return 'Consider trying a guided meditation or talking to our AI companion about what\'s bothering you.';
      case 'Angry':
        return 'Journaling can help process your feelings, or try a calming meditation session.';
      case 'Tired':
        return 'A short relaxation meditation might help restore your energy.';
      case 'Happy':
        return 'Great! Consider journaling about what\'s going well to reflect on later.';
      default:
        return '';
    }
  };

  const moodRecommendation = getMoodRecommendations();

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold text-[#66FCF1] mb-4">Quick Support Tools</h2>
      
      {moodRecommendation && (
        <p className="mb-6 text-[#CFC6C7] bg-[#0B0C10] p-4 rounded-lg border border-[#45A29E]">
          <span className="font-bold">Recommendation:</span> {moodRecommendation}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, idx) => (
          <div
            key={idx}
            onClick={() => navigate(action.path)}
            className="bg-[#0B0C10] rounded-xl shadow-md p-6 cursor-pointer hover:bg-[#45A29E] transition duration-300 hover:scale-105 border border-[#45A29E]"
          >
            <h3 className="text-lg font-semibold text-[#CFC6C7]">{action.label}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickAccessCards;
