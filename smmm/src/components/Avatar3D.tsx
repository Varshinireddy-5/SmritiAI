import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import './Avatar3D.css';

interface Avatar3DProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  message?: string;
  onStartListening?: () => void;
  onStopListening?: () => void;
  onVoiceCommand?: (command: string, response: string) => void;
}

export const Avatar3D: React.FC<Avatar3DProps> = ({
  isListening = false,
  isSpeaking = false,
  message = '',
  onStartListening,
  onStopListening,
  onVoiceCommand
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsActive(true);
        setIsProcessing(false);
        console.log('Voice recognition started');
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        console.log('Voice input received:', transcript);
        setIsProcessing(true);
        handleUserQuery(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsActive(false);
        onStopListening?.();
        console.log('Voice recognition ended');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsActive(false);
        setIsProcessing(false);
        onStopListening?.();
      };
    }
  }, []);

  // Handle text-to-speech
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      speechRef.current = new SpeechSynthesisUtterance(text);
      speechRef.current.rate = 0.9;
      speechRef.current.pitch = 1.1;
      speechRef.current.volume = 0.8;
      
      speechRef.current.onstart = () => setIsActive(true);
      speechRef.current.onend = () => setIsActive(false);
      
      speechSynthesis.speak(speechRef.current);
    }
  };

  // Simple AI response logic
  const handleUserQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    let response = '';

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      response = 'Hello! I\'m your 3D AI assistant. How can I help you today?';
    } else if (lowerQuery.includes('time')) {
      response = `The current time is ${new Date().toLocaleTimeString()}`;
    } else if (lowerQuery.includes('date')) {
      response = `Today is ${new Date().toLocaleDateString()}`;
    } else if (lowerQuery.includes('weather')) {
      response = 'I don\'t have access to weather data right now, but you can check your local weather app!';
    } else if (lowerQuery.includes('name')) {
      response = 'I\'m Avatar, your 3D AI assistant!';
    } else if (lowerQuery.includes('help')) {
      response = 'I can help you with basic questions about time, date, or just have a conversation. Try asking me something!';
    } else {
      response = 'That\'s interesting! I\'m still learning, but I\'m here to help with basic questions and conversation.';
    }

    setCurrentMessage(response);
    speak(response);
  };

  const toggleListening = () => {
    if (isActive) {
      recognitionRef.current?.stop();
      setIsActive(false);
      onStopListening?.();
    } else {
      recognitionRef.current?.start();
      setIsActive(true);
      onStartListening?.();
    }
  };

  // Handle external message prop
  useEffect(() => {
    if (message && message !== currentMessage) {
      setCurrentMessage(message);
      speak(message);
    }
  }, [message]);

  return (
    <div className="avatar-container">
      <div className={`avatar-3d ${isActive ? 'active' : ''} ${isSpeaking ? 'speaking' : ''}`}>
        {/* Head */}
        <div className="avatar-head">
          <div className="face">
            {/* Eyes */}
            <div className="eyes">
              <div className={`eye left ${isActive ? 'blink' : ''}`}>
                <div className="pupil"></div>
              </div>
              <div className={`eye right ${isActive ? 'blink' : ''}`}>
                <div className="pupil"></div>
              </div>
            </div>
            
            {/* Mouth */}
            <div className={`mouth ${isSpeaking || isActive ? 'talking' : ''}`}>
              <div className="mouth-inner"></div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="avatar-body">
          <div className="chest"></div>
          <div className="shoulders">
            <div className="shoulder left"></div>
            <div className="shoulder right"></div>
          </div>
        </div>

        {/* Floating particles for active state */}
        {isActive && (
          <div className="particles">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="avatar-controls">
        <button 
          className={`voice-button ${isActive ? 'active' : ''}`}
          onClick={toggleListening}
        >
          {isActive ? '🎤 Listening...' : '🎤 Click to Talk'}
        </button>
        
        {currentMessage && (
          <div className="message-bubble">
            <p>{currentMessage}</p>
          </div>
        )}
      </div>

      {/* Status indicators */}
      <div className="status-indicators">
        {isListening && <div className="status listening">Listening</div>}
        {isSpeaking && <div className="status speaking">Speaking</div>}
      </div>
    </div>
  );
};

export default Avatar3D;