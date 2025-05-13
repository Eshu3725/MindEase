import React from 'react';

// Extended resources list
const resources = [
  {
    title: "Mindfulness Basics",
    description: "Learn how to stay present and reduce stress with simple mindfulness exercises.",
    link: "https://www.mindful.org/meditation/mindfulness-getting-started/",
  },
  {
    title: "MoodGym",
    description: "A fun, interactive way to learn cognitive behavior therapy skills.",
    link: "https://moodgym.com.au/",
  },
  {
    title: "Headspace",
    description: "Guided meditations and mental wellness resources for beginners.",
    link: "https://www.headspace.com/",
  },
  {
    title: "BetterHelp",
    description: "Affordable online therapy with licensed therapists. Speak with a professional from the comfort of your home.",
    link: "https://www.betterhelp.com/",
  },
  {
    title: "Calm App",
    description: "Sleep stories, meditation guides, and relaxing music to help with anxiety and sleep.",
    link: "https://www.calm.com/",
  },
  {
    title: "7 Cups",
    description: "Free emotional support from trained listeners and online therapy with licensed therapists.",
    link: "https://www.7cups.com/",
  },
  {
    title: "Anxiety and Depression Association of America",
    description: "Resources for understanding and managing anxiety and depression.",
    link: "https://adaa.org/",
  },
  {
    title: "Mental Health America",
    description: "Tools, screening, and resources to help with various mental health conditions.",
    link: "https://www.mhanational.org/",
  }
];

const Resources = () => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-[#66FCF1] mb-6">🌱 Helpful Resources</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res, index) => (
          <a
            key={index}
            href={res.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-[#1F2833] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-[#45A29E] hover:scale-105"
          >
            <h3 className="text-xl font-bold text-[#66FCF1] mb-2">{res.title}</h3>
            <p className="text-[#CFC6C7] mb-4">{res.description}</p>
            <div className="text-[#66FCF1] font-semibold">Visit →</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Resources;
