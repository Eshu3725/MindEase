import React from 'react';
import { auth } from '../firebase';

const HeroSection = () => {
  const user = auth.currentUser;
  const displayName = user ? (user.displayName || user.email) : 'there';

  return (
    <section className="mb-10 text-center px-4 pt-6">
      <h1 className="text-4xl md:text-5xl font-bold text-[#66FCF1] mb-4">
        Welcome to MindEase 💙
      </h1>
      <p className="text-lg md:text-xl text-[#CFC6C7] max-w-2xl mx-auto">
        Hi {displayName}, this is your personal space for self-care, emotional check-ins, and wellness support.
      </p>
    </section>
  );
};

export default HeroSection;
