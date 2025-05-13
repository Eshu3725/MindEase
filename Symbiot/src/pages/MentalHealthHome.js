import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import MoodSelector from '../components/MoodSelector';
import QuickAccessCards from '../components/QuickAccessCards';

const MentalHealthHome = () => {
  const [selectedMood, setSelectedMood] = useState('');

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#CFC6C7] py-6 overflow-x-hidden">
      <HeroSection />

      <section className="bg-[#1F2833] shadow-lg rounded-2xl p-6 mt-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-[#66FCF1]">
          How are you feeling today?
        </h2>
        <MoodSelector onMoodSelect={setSelectedMood} />
        <QuickAccessCards mood={selectedMood} />
      </section>
    </div>
  );
};

export default MentalHealthHome;
