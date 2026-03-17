import React, { useState } from 'react';
import Avatar3D from '../components/Avatar3D';

const Avatar3DDemo: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const handleStartListening = () => {
    setIsListening(true);
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  const handleSendMessage = () => {
    if (customMessage.trim()) {
      setIsSpeaking(true);
      // Simulate speaking duration
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const predefinedMessages = [
    "Hello! I'm your 3D AI assistant. How can I help you today?",
    "I can answer questions about time, weather, and have conversations with you!",
    "Try asking me about the current time or date!",
    "I'm here to assist you with various queries and tasks."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            3D AI Avatar Assistant
          </h1>
          <p className="text-xl text-gray-300">
            Meet your interactive 3D AI companion that can talk and answer your questions!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Section */}
          <div className="flex justify-center">
            <Avatar3D
              isListening={isListening}
              isSpeaking={isSpeaking}
              message={customMessage}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
            />
          </div>

          {/* Controls Section */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Custom Message
              </h3>
              <div className="space-y-4">
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type a message for the avatar to speak..."
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-blue-400 focus:outline-none resize-none"
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!customMessage.trim()}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Make Avatar Speak
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Quick Messages
              </h3>
              <div className="space-y-2">
                {predefinedMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => setCustomMessage(message)}
                    className="w-full p-3 text-left bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 text-sm"
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Features
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  3D CSS animations with realistic movements
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Speech recognition for voice input
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Text-to-speech for responses
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Interactive facial expressions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Floating particle effects
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Basic AI conversation capabilities
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-3">
              How to Use
            </h3>
            <div className="text-gray-300 space-y-2 text-left">
              <p><strong>Voice Interaction:</strong> Click the microphone button and speak to the avatar</p>
              <p><strong>Text Input:</strong> Type a message and click "Make Avatar Speak"</p>
              <p><strong>Quick Messages:</strong> Use predefined messages for instant interaction</p>
              <p><strong>Supported Queries:</strong> Ask about time, date, weather, or have general conversations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar3DDemo;