import React from 'react';

const EmergencyHelp = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#66FCF1] mb-6">🚨 Emergency Help</h1>
      
      <div className="bg-red-600 text-white p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-2">If you're in immediate danger:</h2>
        <p className="text-lg">
          Call emergency services: <span className="font-bold text-xl">911</span> (US) or your local emergency number
        </p>
      </div>
      
      <div className="bg-[#1F2833] rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-[#66FCF1] mb-4">Crisis Hotlines</h2>
        <ul className="space-y-4">
          <li className="bg-[#0B0C10] p-4 rounded-lg">
            <h3 className="font-semibold text-[#66FCF1]">National Suicide Prevention Lifeline</h3>
            <p className="text-[#CFC6C7]">1-800-273-8255</p>
            <p className="text-sm text-[#CFC6C7]">Available 24/7</p>
          </li>
          <li className="bg-[#0B0C10] p-4 rounded-lg">
            <h3 className="font-semibold text-[#66FCF1]">Crisis Text Line</h3>
            <p className="text-[#CFC6C7]">Text HOME to 741741</p>
            <p className="text-sm text-[#CFC6C7]">Available 24/7</p>
          </li>
          <li className="bg-[#0B0C10] p-4 rounded-lg">
            <h3 className="font-semibold text-[#66FCF1]">Trevor Project (LGBTQ+ Youth)</h3>
            <p className="text-[#CFC6C7]">1-866-488-7386</p>
            <p className="text-sm text-[#CFC6C7]">Available 24/7</p>
          </li>
        </ul>
      </div>
      
      <div className="bg-[#1F2833] rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-[#66FCF1] mb-4">Grounding Techniques</h2>
        <p className="text-[#CFC6C7] mb-4">
          If you're feeling overwhelmed, try this 5-4-3-2-1 technique:
        </p>
        <ul className="list-disc pl-6 text-[#CFC6C7] space-y-2">
          <li><span className="text-[#66FCF1] font-semibold">5:</span> Name five things you can see</li>
          <li><span className="text-[#66FCF1] font-semibold">4:</span> Name four things you can touch/feel</li>
          <li><span className="text-[#66FCF1] font-semibold">3:</span> Name three things you can hear</li>
          <li><span className="text-[#66FCF1] font-semibold">2:</span> Name two things you can smell</li>
          <li><span className="text-[#66FCF1] font-semibold">1:</span> Name one thing you can taste</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyHelp;
