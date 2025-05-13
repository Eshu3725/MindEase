import React from 'react';
import AICompanion from '../components/AICompanion';

const AICompanionPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-[#66FCF1] mb-6">🤖 AI Learning Companion</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AICompanion />
        </div>
        
        <div className="bg-[#1F2833] rounded-lg p-4">
          <h2 className="text-xl font-semibold text-[#66FCF1] mb-4">How It Works</h2>
          
          <div className="space-y-4 text-[#CFC6C7]">
            <div>
              <h3 className="font-medium mb-1">1. Share Your Mood</h3>
              <p className="text-sm">
                Tell the AI companion how you're feeling or what's on your mind. The more details you provide, the better the analysis will be.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">2. Mood Analysis</h3>
              <p className="text-sm">
                The AI analyzes your text to understand your current emotional state and learning readiness.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">3. Personalized Recommendations</h3>
              <p className="text-sm">
                Based on your mood and course, the AI suggests learning approaches and resources that might work best for you right now.
              </p>
            </div>
            
            <div className="bg-[#0B0C10] p-3 rounded-lg mt-6">
              <h3 className="font-medium text-[#66FCF1] mb-2">Why This Matters</h3>
              <p className="text-sm">
                Research shows that our emotional state significantly impacts how we learn. By adapting your study approach to your current mood, you can optimize your learning efficiency and make studying more enjoyable.
              </p>
            </div>
            
            <div className="bg-[#0B0C10] p-3 rounded-lg">
              <h3 className="font-medium text-[#66FCF1] mb-2">Privacy Note</h3>
              <p className="text-sm">
                Your conversations with the AI companion are not stored permanently. The analysis happens in your browser and is only used to provide you with better learning recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanionPage;
