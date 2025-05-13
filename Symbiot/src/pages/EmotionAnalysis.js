import React, { useState, useRef, useEffect } from 'react';
import { auth } from '../firebase';
import EmotionBasedRecommendations from '../components/EmotionBasedRecommendations';
import OnlineCourseRecommendations from '../components/OnlineCourseRecommendations';

const EmotionAnalysis = () => {
  // State variables
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [emotionResult, setEmotionResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);
  const timerRef = useRef(null);

  // Constants
  const MAX_RECORDING_DURATION = 15; // seconds
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  console.log('Using API URL:', API_URL); // Debug log

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start countdown before recording
  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          startRecording();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  // Start recording video
  const startRecording = async () => {
    try {
      setError('');
      setRecordingComplete(false);
      setEmotionResult(null);

      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      mediaStreamRef.current = stream;

      // Display video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaChunksRef.current = [];

      // Collect video data
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        const mediaBlob = new Blob(mediaChunksRef.current, { type: 'video/webm' });
        uploadVideoForAnalysis(mediaBlob);
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);

      // Set up timer to track recording duration
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;

          // Automatically stop recording after MAX_RECORDING_DURATION
          if (newDuration >= MAX_RECORDING_DURATION) {
            stopRecording();
          }

          return newDuration;
        });
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to access camera and microphone. Please ensure you have granted the necessary permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingComplete(true);
    }
  };

  // Upload video for emotion analysis
  const uploadVideoForAnalysis = async (mediaBlob) => {
    try {
      setIsUploading(true);
      setError('');

      console.log('Creating video file from blob...');
      const videoFile = new File([mediaBlob], 'emotion_analysis.webm', {
        type: 'video/webm'
      });

      console.log('Preparing form data...');
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('blog_post', notes);

      console.log(`Sending request to ${API_URL}/upload-video-and-blog/...`);

      // For demo purposes, let's simulate a successful response
      // This will be replaced with actual API call when backend is ready
      setTimeout(() => {
        // Enhanced mock emotion analysis with more varied results
        const mockEmotions = [
          "happy", "sad", "angry", "neutral", "surprised", "fearful", "disgusted", "excited", "content"
        ];

        // Weighted emotion selection - make some emotions more likely based on facial expressions
        const getWeightedEmotion = () => {
          // This simulates analyzing facial features in the video
          // In a real implementation, this would be done by ML models
          const weights = {
            "happy": 0.25,    // Common emotion
            "neutral": 0.20,  // Common emotion
            "sad": 0.15,      // Somewhat common
            "surprised": 0.10,
            "angry": 0.10,
            "content": 0.08,
            "excited": 0.05,
            "fearful": 0.04,
            "disgusted": 0.03 // Rare emotion
          };

          // Random number between 0 and 1
          const random = Math.random();
          let cumulativeWeight = 0;

          // Select emotion based on weight
          for (const [emotion, weight] of Object.entries(weights)) {
            cumulativeWeight += weight;
            if (random <= cumulativeWeight) {
              return emotion;
            }
          }

          // Fallback
          return "neutral";
        };

        // Get emotions for video and audio
        const videoEmotion = getWeightedEmotion();
        const audioEmotion = getWeightedEmotion();

        // More sophisticated emotion fusion algorithm
        // In real implementation, this would consider confidence scores and context
        let finalEmotion;

        // If both emotions match, that's definitely the final emotion
        if (videoEmotion === audioEmotion) {
          finalEmotion = videoEmotion;
        }
        // If audio detects strong emotions, prioritize those
        else if (["sad", "angry", "fearful"].includes(audioEmotion)) {
          finalEmotion = audioEmotion;
        }
        // If video shows strong emotions, prioritize those
        else if (["happy", "surprised", "excited"].includes(videoEmotion)) {
          finalEmotion = videoEmotion;
        }
        // Default to video emotion in other cases
        else {
          finalEmotion = videoEmotion;
        }

        const mockResult = {
          emotion: {
            video: videoEmotion,
            audio: audioEmotion,
            final: finalEmotion
          },
          blog_post: notes
        };

        console.log('Mock emotion analysis result:', mockResult);
        setEmotionResult(mockResult.emotion);
        setIsUploading(false);
      }, 2000);

      /* Uncomment this when backend is ready
      // Now send the actual request
      const response = await fetch(`${API_URL}/upload-video-and-blog/`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Emotion analysis result:', result);

      // Process and display the emotion result
      if (result.emotion) {
        setEmotionResult(result.emotion);
      } else {
        setError('No emotion data received from the server.');
      }
      */

    } catch (err) {
      console.error('Error uploading video:', err);
      setError(`Failed to analyze video: ${err.message}`);
      setIsUploading(false);
    }
  };

  // Reset the component state
  const resetAnalysis = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }

    setIsRecording(false);
    setRecordingComplete(false);
    setRecordingDuration(0);
    setEmotionResult(null);
    setIsUploading(false);
    setError('');
    setNotes('');

    // Restart camera preview
    startCamera();
  };

  // Start camera without recording
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please ensure you have granted the necessary permissions.');
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Get emotion color based on detected emotion
  const getEmotionColor = (emotion) => {
    const emotionColors = {
      happy: 'bg-green-500',      // Green for happy
      sad: 'bg-blue-500',         // Blue for sad
      angry: 'bg-red-500',        // Red for angry
      neutral: 'bg-gray-500',     // Gray for neutral
      surprised: 'bg-purple-500', // Purple for surprised
      fearful: 'bg-yellow-500',   // Yellow for fearful
      disgusted: 'bg-orange-500', // Orange for disgusted
      excited: 'bg-pink-500',     // Pink for excited
      content: 'bg-teal-500'      // Teal for content
    };

    // Convert to lowercase and find matching color, default to gray if not found
    return emotionColors[emotion?.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#CFC6C7]">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-[#66FCF1] mb-6">AI Emotion Analysis</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Video preview */}
          <div className="bg-[#1F2833] rounded-lg overflow-hidden">
            <div className="relative aspect-video bg-black">
              {isCountingDown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
                  <div className="text-6xl font-bold text-white">{countdown}</div>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {isRecording && (
                <div className="absolute top-2 right-2 flex items-center bg-red-500 text-white px-2 py-1 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse mr-2"></div>
                  <span>{formatTime(recordingDuration)} / {formatTime(MAX_RECORDING_DURATION)}</span>
                </div>
              )}
            </div>

            <div className="p-3">
              <p className="font-medium">Video Feed</p>
              <p className="text-sm text-gray-400">
                Record a short video to analyze your emotions
              </p>
            </div>
          </div>

          {/* Results or notes */}
          <div className="bg-[#1F2833] rounded-lg overflow-hidden">
            {emotionResult ? (
              <div className="p-4">
                <h2 className="text-xl font-semibold text-[#66FCF1] mb-3">Analysis Results</h2>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className={`w-4 h-4 rounded-full ${getEmotionColor(emotionResult.final)} mr-2`}></div>
                    <span className="font-medium">Primary Emotion: </span>
                    <span className="ml-2 capitalize">{emotionResult.final || 'Unknown'}</span>
                  </div>

                  {emotionResult.video && (
                    <div className="flex items-center mb-2">
                      <div className={`w-4 h-4 rounded-full ${getEmotionColor(emotionResult.video)} mr-2`}></div>
                      <span className="font-medium">Video Analysis: </span>
                      <span className="ml-2 capitalize">{emotionResult.video}</span>
                    </div>
                  )}

                  {emotionResult.audio && (
                    <div className="flex items-center mb-2">
                      <div className={`w-4 h-4 rounded-full ${getEmotionColor(emotionResult.audio)} mr-2`}></div>
                      <span className="font-medium">Audio Analysis: </span>
                      <span className="ml-2 capitalize">{emotionResult.audio}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Recommendations:</h3>
                  <ul className="list-disc list-inside text-sm">
                    {emotionResult.final === 'happy' && (
                      <>
                        <li>Continue engaging in activities that bring you joy</li>
                        <li>Share your positive energy with others</li>
                        <li>Practice gratitude to maintain this positive state</li>
                      </>
                    )}
                    {emotionResult.final === 'sad' && (
                      <>
                        <li>Consider talking to someone you trust about your feelings</li>
                        <li>Engage in gentle self-care activities</li>
                        <li>Try mindfulness or breathing exercises</li>
                      </>
                    )}
                    {emotionResult.final === 'angry' && (
                      <>
                        <li>Take a few deep breaths to calm your nervous system</li>
                        <li>Consider a short break from the situation if possible</li>
                        <li>Try physical activity to release tension</li>
                      </>
                    )}
                    {emotionResult.final === 'neutral' && (
                      <>
                        <li>Consider activities that might boost your mood</li>
                        <li>Practice mindfulness to increase emotional awareness</li>
                        <li>Engage in creative or stimulating activities</li>
                      </>
                    )}
                    {emotionResult.final === 'surprised' && (
                      <>
                        <li>Take a moment to process the unexpected information</li>
                        <li>Consider how this surprise affects your plans</li>
                        <li>Share your experience with someone if it was significant</li>
                      </>
                    )}
                    {emotionResult.final === 'fearful' && (
                      <>
                        <li>Practice deep breathing to calm your nervous system</li>
                        <li>Identify the source of your fear and assess if it's realistic</li>
                        <li>Consider talking to someone you trust about your concerns</li>
                      </>
                    )}
                    {emotionResult.final === 'disgusted' && (
                      <>
                        <li>Remove yourself from the situation if possible</li>
                        <li>Focus on neutral or pleasant sensory experiences</li>
                        <li>Consider if this reaction is providing useful information</li>
                      </>
                    )}
                    {emotionResult.final === 'excited' && (
                      <>
                        <li>Channel your energy into productive activities</li>
                        <li>Share your enthusiasm with others</li>
                        <li>Make plans to maintain this positive momentum</li>
                      </>
                    )}
                    {emotionResult.final === 'content' && (
                      <>
                        <li>Take time to appreciate this balanced emotional state</li>
                        <li>Notice what factors contribute to your contentment</li>
                        <li>Consider journaling about what brings you peace</li>
                      </>
                    )}
                    {!['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful', 'disgusted', 'excited', 'content'].includes(emotionResult.final) && (
                      <li>Take time to acknowledge and process your emotions</li>
                    )}
                  </ul>
                </div>

                {/* Add course-specific recommendations based on emotion */}
                {emotionResult?.final && (
                  <>
                    {/* Online course recommendations from external APIs */}
                    <OnlineCourseRecommendations emotion={emotionResult.final} />

                    {/* Local course recommendations (optional - can be removed) */}
                    {/* <EmotionBasedRecommendations emotion={emotionResult.final} /> */}
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 h-full flex flex-col">
                <h2 className="text-xl font-semibold text-[#66FCF1] mb-3">Notes (Optional)</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about your current mood or situation..."
                  className="flex-grow bg-[#0B0C10] text-[#CFC6C7] p-3 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#66FCF1]"
                  disabled={isRecording || isUploading}
                />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {!isRecording && !isUploading && !recordingComplete && (
            <button
              type="button"
              onClick={startCountdown}
              className="flex items-center bg-[#66FCF1] text-[#0B0C10] px-4 py-2 rounded-lg hover:bg-[#45A29E] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Record icon">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="currentColor" />
              </svg>
              Start Recording
            </button>
          )}

          {isRecording && (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Stop icon">
                <rect x="6" y="6" width="12" height="12" strokeWidth="2" />
              </svg>
              Stop Recording
            </button>
          )}

          {(recordingComplete || emotionResult) && !isUploading && (
            <button
              type="button"
              onClick={resetAnalysis}
              className="flex items-center bg-[#1F2833] text-[#CFC6C7] px-4 py-2 rounded-lg hover:bg-[#0B0C10] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Reset icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              New Analysis
            </button>
          )}

          {isUploading && (
            <div className="flex items-center bg-[#1F2833] text-[#CFC6C7] px-4 py-2 rounded-lg">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Video...
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-[#1F2833] p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-[#66FCF1] mb-3">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Start Recording" to begin a short video recording (max 15 seconds)</li>
            <li>Speak naturally and express your thoughts or feelings</li>
            <li>Our AI will analyze your facial expressions and voice tone</li>
            <li>View your emotion analysis results and personalized recommendations</li>
          </ol>
          <p className="mt-3 text-sm text-gray-400">
            Note: Your privacy is important to us. Videos are processed securely and not stored after analysis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmotionAnalysis;
