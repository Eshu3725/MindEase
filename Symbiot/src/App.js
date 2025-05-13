import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Preferences from './pages/Preferences';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// MindEase Components
import Header from './components/Header';
import MentalHealthHome from './pages/MentalHealthHome';
import Journals from './pages/Journals';
import GuidedMeditation from './pages/GuidedMeditation';
import EmergencyHelp from './pages/EmergencyHelp';
import Chatbot from './pages/Chatbot';
import Resources from './pages/Resources';
import Syllabus from './pages/Syllabus';
import ContactUs from './pages/ContactUs';
import VideoChat from './pages/VideoChat';
import EmotionAnalysis from './pages/EmotionAnalysis';
import AICompanionPage from './pages/AICompanionPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - Full screen with gradient background */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-r from-background-gradient-start to-background-gradient-end flex justify-center items-center p-5">
              <Navigate to="/login" />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="min-h-screen bg-gradient-to-r from-background-gradient-start to-background-gradient-end flex justify-center items-center p-5">
              <Login />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="min-h-screen bg-gradient-to-r from-background-gradient-start to-background-gradient-end flex justify-center items-center p-5">
              <Signup />
            </div>
          }
        />
        <Route
          path="/reset-password"
          element={
            <div className="min-h-screen bg-gradient-to-r from-background-gradient-start to-background-gradient-end flex justify-center items-center p-5">
              <ResetPassword />
            </div>
          }
        />
        <Route
          path="/preferences"
          element={
            <div className="min-h-screen bg-gradient-to-r from-background-gradient-start to-background-gradient-end flex justify-center items-center p-5">
              <Preferences />
            </div>
          }
        />

        {/* MindEase Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <MentalHealthHome />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/journals"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <Journals />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/guided-meditation"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <GuidedMeditation />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency-help"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <EmergencyHelp />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <Chatbot />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <Resources />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/syllabus"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <Syllabus />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <ContactUs />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-chat"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <VideoChat />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/emotion-analysis"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <EmotionAnalysis />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-companion"
          element={
            <ProtectedRoute>
              <div className="bg-[#0B0C10] min-h-screen text-[#CFC6C7]">
                <Header />
                <div className="pt-20 px-4 md:px-8">
                  <AICompanionPage />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
