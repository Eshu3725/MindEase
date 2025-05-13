import React from 'react';

const Journals = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#66FCF1] mb-6">📓 Journal</h1>
      <div className="bg-[#1F2833] rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-[#66FCF1] mb-4">Write your thoughts</h2>
        <textarea 
          className="w-full h-64 p-4 bg-[#0B0C10] text-[#CFC6C7] border border-[#45A29E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66FCF1]"
          placeholder="How are you feeling today? What's on your mind?"
        ></textarea>
        <div className="flex justify-end mt-4">
          <button className="bg-[#66FCF1] text-[#0B0C10] px-6 py-2 rounded-lg font-semibold hover:bg-[#45A29E] transition duration-300">
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default Journals;
