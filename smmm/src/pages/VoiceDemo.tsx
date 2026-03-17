import React from 'react';
import VoiceInterface from '../components/VoiceInterface';
import { VoiceCapture } from '../components/VoiceCapture';

const VoiceDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Enhanced Voice Interface Demo
          </h1>
          <p className="text-xl text-gray-300">
            Test the new voice navigation and command system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Navigation Interface */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-2xl font-semibold text-white mb-4">
              🎤 Immediate Voice Navigation
            </h3>
            <p className="text-gray-300 mb-6">
              Click the microphone and speak immediately. No delays!
            </p>
            
            <div className="flex justify-center mb-6">
              <VoiceInterface />
            </div>

            <div className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <h4 className="text-green-400 font-medium mb-2">✅ Try These Commands:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• "Go to health" or just "Health"</li>
                  <li>• "Show memories" or "Memories"</li>
                  <li>• "Open vault" or "Vault"</li>
                  <li>• "Settings" or "Go to settings"</li>
                  <li>• "Emergency" or "SOS"</li>
                  <li>• "What time is it?"</li>
                  <li>• "Hello" or "Hi"</li>
                </ul>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <h4 className="text-blue-400 font-medium mb-2">🚀 Features:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Real-time speech recognition</li>
                  <li>• Immediate command processing</li>
                  <li>• Instant navigation</li>
                  <li>• Voice feedback responses</li>
                  <li>• Natural language understanding</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Voice Memory Capture */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-2xl font-semibold text-white mb-4">
              📝 Real Voice Memory Capture
            </h3>
            <p className="text-gray-300 mb-6">
              Enhanced voice capture with real speech recognition:
            </p>
            
            <div className="space-y-4">
              <VoiceCapture />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-3">
              Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <h4 className="text-white font-medium">Voice Navigation:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Real speech recognition</li>
                  <li>✓ Natural language commands</li>
                  <li>✓ Auto-navigation to pages</li>
                  <li>✓ Voice feedback responses</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-medium">Voice Capture:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Live transcription</li>
                  <li>✓ Multi-language support</li>
                  <li>✓ Voice playback</li>
                  <li>✓ Smart processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceDemo;