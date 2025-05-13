import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';

const VideoChat = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  
  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Initialize camera and microphone
  const startMedia = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setLocalStream(stream);
      setIsCameraOn(true);
      setIsMicOn(true);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera and microphone. Please ensure you have granted the necessary permissions.');
    }
  };
  
  // Toggle camera
  const toggleCamera = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const isEnabled = !videoTracks[0].enabled;
        videoTracks[0].enabled = isEnabled;
        setIsCameraOn(isEnabled);
      }
    }
  };
  
  // Toggle microphone
  const toggleMic = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const isEnabled = !audioTracks[0].enabled;
        audioTracks[0].enabled = isEnabled;
        setIsMicOn(isEnabled);
      }
    }
  };
  
  // Share screen
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        // Save the camera stream to restore it later
        const oldStream = localStream;
        setLocalStream(screenStream);
        setIsScreenSharing(true);
        
        // When screen sharing stops
        screenStream.getVideoTracks()[0].onended = () => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = oldStream;
          }
          setLocalStream(oldStream);
          setIsScreenSharing(false);
        };
      } catch (err) {
        console.error('Error sharing screen:', err);
        setError('Failed to share screen. Please try again.');
      }
    } else {
      // Stop screen sharing
      localStream.getVideoTracks().forEach(track => track.stop());
      startMedia(); // Restart camera
      setIsScreenSharing(false);
    }
  };
  
  // Create or join a room
  const handleRoomAction = () => {
    if (isJoiningRoom) {
      // Join existing room
      if (!roomId.trim()) {
        setError('Please enter a valid room ID');
        return;
      }
      joinRoom(roomId);
    } else {
      // Create new room
      createRoom();
    }
  };
  
  // Create a new room
  const createRoom = () => {
    // In a real implementation, this would connect to a signaling server
    // and create a room with a unique ID
    const generatedRoomId = Math.random().toString(36).substring(2, 7);
    setRoomId(generatedRoomId);
    setIsInCall(true);
    
    // For demo purposes, we'll just show a success message
    alert(`Room created! Your room ID is: ${generatedRoomId}`);
  };
  
  // Join an existing room
  const joinRoom = (id) => {
    // In a real implementation, this would connect to a signaling server
    // and join the specified room
    setIsInCall(true);
    
    // For demo purposes, we'll just show a success message
    alert(`Joined room: ${id}`);
  };
  
  // End the call
  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setLocalStream(null);
    setRemoteStream(null);
    setIsInCall(false);
    setIsCameraOn(false);
    setIsMicOn(false);
    setIsScreenSharing(false);
  };
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [localStream]);
  
  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#CFC6C7]">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-[#66FCF1] mb-6">Video Chat</h1>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Local video */}
          <div className="bg-[#1F2833] rounded-lg overflow-hidden">
            <div className="relative aspect-video bg-black">
              {!localStream ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={startMedia}
                    className="bg-[#66FCF1] text-[#0B0C10] px-4 py-2 rounded-lg hover:bg-[#45A29E] transition-colors"
                  >
                    Start Camera
                  </button>
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-3">
              <p className="font-medium">You {user?.displayName ? `(${user.displayName})` : ''}</p>
            </div>
          </div>
          
          {/* Remote video */}
          <div className="bg-[#1F2833] rounded-lg overflow-hidden">
            <div className="relative aspect-video bg-black">
              {!remoteStream ? (
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                  {isInCall ? (
                    <p>Waiting for someone to join...</p>
                  ) : (
                    <p>Start a call or join a room to see the other participant here</p>
                  )}
                </div>
              ) : (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-3">
              <p className="font-medium">Remote User</p>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        {localStream && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={toggleCamera}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isCameraOn ? 'bg-[#66FCF1] text-[#0B0C10]' : 'bg-red-500 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Camera icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCameraOn ? 
                  "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" : 
                  "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"} />
              </svg>
              {isCameraOn ? 'Camera On' : 'Camera Off'}
            </button>
            
            <button
              type="button"
              onClick={toggleMic}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isMicOn ? 'bg-[#66FCF1] text-[#0B0C10]' : 'bg-red-500 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Microphone icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMicOn ? 
                  "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" : 
                  "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"} />
              </svg>
              {isMicOn ? 'Mic On' : 'Mic Off'}
            </button>
            
            <button
              type="button"
              onClick={toggleScreenShare}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isScreenSharing ? 'bg-[#66FCF1] text-[#0B0C10]' : 'bg-[#1F2833] text-[#CFC6C7]'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Screen share icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            </button>
            
            {isInCall && (
              <button
                type="button"
                onClick={endCall}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="End call icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                </svg>
                End Call
              </button>
            )}
          </div>
        )}
        
        {/* Room controls */}
        {!isInCall && (
          <div className="bg-[#1F2833] p-6 rounded-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-[#66FCF1] mb-4">
              {isJoiningRoom ? 'Join a Room' : 'Create a Room'}
            </h2>
            
            <div className="mb-4">
              <label htmlFor="roomId" className="block mb-2">
                {isJoiningRoom ? 'Enter Room ID' : 'Your Room ID'}
              </label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder={isJoiningRoom ? "Enter room ID..." : "Room ID will appear here..."}
                readOnly={!isJoiningRoom}
                className="w-full p-2 bg-[#0B0C10] border border-[#45A29E] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#66FCF1]"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleRoomAction}
                disabled={isJoiningRoom && !roomId.trim()}
                className="bg-[#66FCF1] text-[#0B0C10] px-4 py-2 rounded-lg hover:bg-[#45A29E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoiningRoom ? 'Join Room' : 'Create Room'}
              </button>
              
              <button
                type="button"
                onClick={() => setIsJoiningRoom(!isJoiningRoom)}
                className="bg-[#1F2833] border border-[#45A29E] text-[#CFC6C7] px-4 py-2 rounded-lg hover:bg-[#0B0C10] transition-colors"
              >
                {isJoiningRoom ? 'Create a Room Instead' : 'Join a Room Instead'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoChat;
