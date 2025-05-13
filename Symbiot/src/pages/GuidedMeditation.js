import React, { useState } from 'react';

const GuidedMeditation = () => {
  const [selectedMeditation, setSelectedMeditation] = useState('');
  const [relaxSound, setRelaxSound] = useState('');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#1F2833] rounded-3xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-[#66FCF1] mb-6">🧘 Guided Meditation</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {["Breathing", "Visualization", "Relaxation Sounds"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMeditation(type)}
              className={`rounded-xl py-2 px-4 font-semibold transition duration-300 ${
                selectedMeditation === type
                  ? "bg-[#66FCF1] text-[#0B0C10]"
                  : "bg-[#0B0C10] border border-[#45A29E] hover:bg-[#45A29E] text-[#CFC6C7]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {selectedMeditation === "Breathing" && (
          <div className="mt-6 bg-[#0B0C10] p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-[#66FCF1] mb-4">4-7-8 Breathing Technique</h3>
            <p className="text-[#CFC6C7] mb-4">
              This technique helps reduce anxiety and helps with sleep:
            </p>
            <ol className="text-left text-[#CFC6C7] space-y-2 mb-6 ml-6 list-decimal">
              <li>Exhale completely through your mouth</li>
              <li>Inhale quietly through your nose for 4 seconds</li>
              <li>Hold your breath for 7 seconds</li>
              <li>Exhale completely through your mouth for 8 seconds</li>
              <li>Repeat the cycle 3-4 times</li>
            </ol>
            <button className="bg-[#66FCF1] text-[#0B0C10] px-6 py-2 rounded-lg font-semibold">
              Start Guided Session
            </button>
          </div>
        )}

        {selectedMeditation === "Visualization" && (
          <div className="mt-6 bg-[#0B0C10] p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-[#66FCF1] mb-4">Peaceful Place Visualization</h3>
            <p className="text-[#CFC6C7] mb-6">
              Close your eyes and imagine a peaceful place where you feel safe and calm. It could be a beach, forest, or any place that brings you comfort.
            </p>
            <button className="bg-[#66FCF1] text-[#0B0C10] px-6 py-2 rounded-lg font-semibold">
              Start Guided Session
            </button>
          </div>
        )}

        {selectedMeditation === "Relaxation Sounds" && (
          <div className="mt-6 bg-[#0B0C10] p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-[#66FCF1] mb-4">Select a Sound:</h3>
            <select
              onChange={(e) => setRelaxSound(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1F2833] border border-[#45A29E] text-[#CFC6C7] mb-6"
              value={relaxSound}
            >
              <option value="">Select a sound</option>
              <option value="waves">🌊 Ocean Waves</option>
              <option value="rain">🌧️ Rain Sounds</option>
              <option value="wind">🍃 Soft Wind</option>
            </select>
            {relaxSound && (
              <button className="bg-[#66FCF1] text-[#0B0C10] px-6 py-2 rounded-lg font-semibold">
                Play {relaxSound === "waves" ? "Ocean Waves" : relaxSound === "rain" ? "Rain Sounds" : "Soft Wind"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidedMeditation;
