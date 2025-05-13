import React, { useState, useEffect } from 'react';

const MoodSelector = ({ onMoodSelect }) => {
  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '😴', label: 'Tired' },
  ];

  const [selectedMood, setSelectedMood] = useState(null);

  // Load saved mood from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedMood');
    if (saved) {
      const parsedMood = JSON.parse(saved);
      setSelectedMood(parsedMood);
      if (onMoodSelect) onMoodSelect(parsedMood.label);
    }
  }, [onMoodSelect]);

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    localStorage.setItem('selectedMood', JSON.stringify(mood));
    if (onMoodSelect) onMoodSelect(mood.label);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex space-x-6 text-5xl my-4">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => handleMoodClick(mood)}
            className={`transition-transform transform hover:scale-110 ${
              selectedMood?.label === mood.label ? 'ring-4 ring-[#66FCF1] rounded-full' : ''
            }`}
            title={mood.label}
            aria-label={`Select mood: ${mood.label}`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      {selectedMood && (
        <p className="mt-4 text-lg text-[#66FCF1]">
          You're feeling <strong>{selectedMood.label}</strong> today
        </p>
      )}
    </div>
  );
};

export default MoodSelector;
