import React from 'react';
import stickerGif from '../assets/Sticker.gif';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-left-section">
        <img src={stickerGif} alt="Chatbot" className="w-full max-w-[250px] h-auto" />
      </div>
      <div className="auth-right-section">
        <div className="auth-form-box">
          <div className="auth-logo">
            <img
              src="https://img.icons8.com/fluency/48/000000/chatbot.png"
              alt="Logo"
              className="w-12"
            />
            <h2 className="text-2xl text-primary-dark">
              MIND<span className="text-primary-light">EASE</span>
            </h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
