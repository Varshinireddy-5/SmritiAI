import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Loader2, CheckCircle, Brain, Tag, Heart, DollarSign, GraduationCap, User, Briefcase, MessageSquare, Volume2, TestTube } from 'lucide-react';
import { toast } from 'sonner';
import { VoiceService } from '../utils/voiceService';
import { getVoiceCommandResponse } from '../utils/voiceCommands';

interface VoiceInterfaceProps {
  className?: string;
}

interface RecognitionResult {
  transcript: string;
  confidence: number;
  category: string;
  tags: string[];
  timestamp: string;
  language: string;
  isInterim?: boolean;
}

// Enhanced categorization function
function categorizeVoiceInput(text: string, language: string): {
  category: string;
  tags: string[];
  confidence: number;
  insights: string;
} {
  const textLower = text.toLowerCase();
  const tags: string[] = [];
  let category = 'general';
  let confidence = 0.7;
  let insights = '';

  // Health patterns
  const healthKeywords = ['hospital', 'doctor', 'checkup', 'medicine', 'pain', 'health', 'sugar', 'diabetes', 'blood pressure', 'fever', 'cough', 'headache', 'appointment', 'clinic', 'treatment'];
  if (healthKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'health';
    tags.push('medical', 'healthcare', 'wellness');
    confidence = 0.9;
    insights = 'Health-related memory detected. Consider tracking this in your health records.';
  }

  // Finance patterns
  const financeKeywords = ['money', 'rupees', 'loan', 'lent', 'borrow', 'payment', 'bill', 'bank', 'salary', 'expense', 'cost', 'price', 'buy', 'sell', 'invest'];
  if (financeKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'finance';
    tags.push('money', 'transaction', 'financial');
    confidence = 0.85;
    insights = 'Financial transaction noted. This could be tracked in your money records.';
  }

  // Family patterns
  const familyKeywords = ['family', 'wife', 'husband', 'son', 'daughter', 'child', 'parents', 'birthday', 'anniversary', 'mother', 'father', 'brother', 'sister'];
  if (familyKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'family';
    tags.push('family', 'personal', 'relationships');
    confidence = 0.8;
    insights = 'Family memory captured. Consider setting reminders for important dates.';
  }

  // Education patterns
  const educationKeywords = ['school', 'college', 'teacher', 'student', 'exam', 'study', 'homework', 'class', 'university', 'course', 'learn'];
  if (educationKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'education';
    tags.push('education', 'learning', 'academic');
    confidence = 0.82;
    insights = 'Educational memory recorded. Track progress and important dates.';
  }

  // Work patterns
  const workKeywords = ['work', 'job', 'office', 'meeting', 'client', 'project', 'colleague', 'boss', 'manager', 'company', 'business'];
  if (workKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'work';
    tags.push('work', 'professional', 'career');
    confidence = 0.83;
    insights = 'Work-related memory saved. Consider adding to your professional timeline.';
  }

  // Add language and voice tags
  tags.push(language, 'voice-input');

  return { category, tags, confidence, insights };
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recognitionResults, setRecognitionResults] = useState<RecognitionResult[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [microphoneStatus, setMicrophoneStatus] = useState<'unknown' | 'available' | 'denied'>('unknown');
  const [isTestingMic, setIsTestingMic] = useState(false);
  
  const voiceService = useRef(VoiceService.getInstance());
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  // Test microphone on component mount
  useEffect(() => {
    const testMic = async () => {
      const isAvailable = await voiceService.current.testMicrophone();
      setMicrophoneStatus(isAvailable ? 'available' : 'denied');
    };
    testMic();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart className="w-4 h-4 text-red-400" />;
      case 'finance': return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'family': return <User className="w-4 h-4 text-blue-400" />;
      case 'education': return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'work': return <Briefcase className="w-4 h-4 text-orange-400" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'border-red-500/30 bg-red-500/10';
      case 'finance': return 'border-green-500/30 bg-green-500/10';
      case 'family': return 'border-blue-500/30 bg-blue-500/10';
      case 'education': return 'border-purple-500/30 bg-purple-500/10';
      case 'work': return 'border-orange-500/30 bg-orange-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const handleVoiceCommand = useCallback(async (spokenText: string) => {
    console.log('🎯 Processing command:', spokenText);
    
    try {
      // Categorize the input
      const analysis = categorizeVoiceInput(spokenText, selectedLanguage);
      
      // Create recognition result
      const result: RecognitionResult = {
        transcript: spokenText,
        confidence: analysis.confidence,
        category: analysis.category,
        tags: analysis.tags,
        timestamp: new Date().toISOString(),
        language: selectedLanguage
      };

      // Add to results
      setRecognitionResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results

      // Get command response
      const commandResult = getVoiceCommandResponse(spokenText);
      setResponse(commandResult.response);
      
      // Speak the response (but don't wait for it)
      try {
        voiceService.current.speak(commandResult.response, selectedLanguage);
      } catch (speechError) {
        console.warn('Speech synthesis failed:', speechError);
      }
      
      // Navigate if needed
      if (commandResult.route) {
        navigate(commandResult.route);
        toast.success(`Navigated to ${commandResult.route}`);
      }
      
      // Show success toast with category
      toast.success(`${analysis.category.charAt(0).toUpperCase() + analysis.category.slice(1)} memory recognized!`);
      
      // Clear after delay
      setTimeout(() => {
        setTranscript('');
        setInterimTranscript('');
        setResponse('');
      }, 4000);
      
    } catch (error) {
      console.error('Error in handleVoiceCommand:', error);
      toast.error('Error processing voice command');
      setResponse('Error processing command');
    }
  }, [navigate, selectedLanguage]);

  const testMicrophone = useCallback(async () => {
    setIsTestingMic(true);
    const isAvailable = await voiceService.current.testMicrophone();
    setMicrophoneStatus(isAvailable ? 'available' : 'denied');
    setIsTestingMic(false);
    
    if (isAvailable) {
      toast.success('🎤 Microphone is working!');
      voiceService.current.speak('Microphone test successful!', selectedLanguage);
    } else {
      toast.error('❌ Microphone access denied. Please allow microphone permissions.');
    }
  }, [selectedLanguage]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      console.log('🛑 Stopping voice recognition...');
      voiceService.current.stopListening();
      setIsListening(false);
      setIsProcessing(false);
      return;
    }

    if (!voiceService.current.isVoiceAvailable()) {
      toast.error('Voice recognition not available. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (microphoneStatus === 'denied') {
      toast.error('Microphone access denied. Please allow microphone permissions and refresh the page.');
      return;
    }

    // Start listening
    setTranscript('');
    setInterimTranscript('');
    setResponse('');
    setIsProcessing(false);

    console.log('🚀 Starting voice recognition...');
    const success = await voiceService.current.startListening({
      language: selectedLanguage,
      onStart: () => {
        console.log('🎤 Voice recognition started');
        setIsListening(true);
        setIsProcessing(false);
        toast.info('🎤 Listening... Speak now!');
      },
      onResult: async (transcriptText: string, confidence: number) => {
        console.log('🎯 Voice result received:', transcriptText, 'Confidence:', confidence);
        
        // Immediately stop listening and show result
        setIsListening(false);
        setTranscript(transcriptText);
        setIsProcessing(true);
        
        try {
          // Process the command
          await handleVoiceCommand(transcriptText);
        } catch (error) {
          console.error('Error processing voice command:', error);
          toast.error('Error processing voice command');
        } finally {
          // Always stop processing after 2 seconds max
          setTimeout(() => {
            setIsProcessing(false);
          }, 2000);
        }
      },
      onError: (error: string) => {
        console.error('❌ Voice recognition error:', error);
        toast.error(error);
        setIsListening(false);
        setIsProcessing(false);
        
        // If microphone error, update status
        if (error.includes('Microphone') || error.includes('not-allowed')) {
          setMicrophoneStatus('denied');
        }
      },
      onEnd: () => {
        console.log('🔇 Voice recognition ended');
        setIsListening(false);
        
        // If we're still processing after recognition ends, stop it
        setTimeout(() => {
          if (isProcessing) {
            setIsProcessing(false);
            console.log('Force stopped processing due to timeout');
          }
        }, 3000);
      }
    });

    if (!success) {
      setIsListening(false);
      setIsProcessing(false);
    }
  }, [isListening, handleVoiceCommand, selectedLanguage, microphoneStatus, isProcessing]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Voice Interface */}
      <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-700/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Live Voice Recognition</h2>
              <p className="text-sm text-gray-400">
                Speak naturally and see real-time categorization
                {microphoneStatus === 'available' && <span className="text-green-400 ml-2">🎤 Ready</span>}
                {microphoneStatus === 'denied' && <span className="text-red-400 ml-2">❌ Mic Denied</span>}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Microphone Test Button */}
            <button
              onClick={testMicrophone}
              disabled={isTestingMic}
              className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600 text-white hover:bg-gray-700/50 transition-all flex items-center gap-2"
            >
              {isTestingMic ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4" />
              )}
              Test Mic
            </button>
            
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                voiceService.current.speak(`Language changed to ${languages.find(l => l.code === e.target.value)?.name}`, e.target.value);
              }}
              className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-gray-900">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Voice Button */}
        <div className="flex flex-col items-center justify-center py-8">
          <button
            onClick={toggleListening}
            disabled={microphoneStatus === 'denied'}
            className={`
              relative w-32 h-32 rounded-full transition-all duration-300
              ${isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_60px_rgba(255,0,110,0.8)]' 
                : microphoneStatus === 'denied'
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105'
              }
              shadow-lg hover:shadow-xl
            `}
            title={
              microphoneStatus === 'denied' 
                ? 'Microphone access denied' 
                : isListening 
                ? 'Stop listening' 
                : 'Start voice recognition'
            }
          >
            {isProcessing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin mb-2" />
                <span className="text-xs text-white font-bold">PROCESSING</span>
              </div>
            ) : isListening ? (
              <>
                <MicOff className="w-12 h-12 text-white absolute inset-0 m-auto" />
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  LISTENING
                </div>
              </>
            ) : (
              <Mic className="w-12 h-12 text-white absolute inset-0 m-auto" />
            )}
          </button>

          {/* Stop Processing Button */}
          {isProcessing && (
            <button
              onClick={() => {
                setIsProcessing(false);
                setIsListening(false);
                voiceService.current.stopListening();
                toast.info('Processing stopped');
              }}
              className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
            >
              Stop Processing
            </button>
          )}

          <div className="mt-6 text-center">
            <p className="text-xl font-medium text-white">
              {isProcessing 
                ? 'Analyzing your speech...' 
                : isListening 
                ? 'Listening... speak now!' 
                : microphoneStatus === 'denied'
                ? 'Microphone access required'
                : 'Tap to start voice recognition'}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {isProcessing
                ? 'Processing your voice input, please wait...'
                : isListening 
                ? 'Speak clearly about your memory or command...' 
                : 'Your voice will be transcribed and categorized in real-time.'}
            </p>
          </div>
        </div>

        {/* Live Transcript Display */}
        {(transcript || interimTranscript || response) && (
          <div className="mt-6 p-4 rounded-xl bg-gray-800/30 border border-gray-700">
            {(transcript || interimTranscript) && (
              <div className="mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Volume2 className="w-3 h-3" />
                  <span>Live Transcript:</span>
                  <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">
                    {selectedLanguage.toUpperCase()}
                  </span>
                </div>
                <div className="text-lg font-medium text-white bg-gray-900/50 p-4 rounded-lg">
                  <span className="text-white">{transcript}</span>
                  {interimTranscript && (
                    <span className="text-gray-400 italic"> {interimTranscript}</span>
                  )}
                </div>
              </div>
            )}

            {response && !isProcessing && (
              <div>
                <div className="flex items-center gap-2 text-green-300 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">AI Response:</span>
                </div>
                <div className="text-sm bg-gray-900/30 p-3 rounded-lg text-white">
                  {response}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recognition History with Categorization */}
      {recognitionResults.length > 0 && (
        <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-700/50 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Recognition History & Analysis</h3>
            </div>
            <button 
              onClick={() => setRecognitionResults([])}
              className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-3">
            {recognitionResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl border ${getCategoryColor(result.category)} transition-all hover:scale-[1.01] animate-in slide-in-from-top duration-300`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(result.category)}
                    <span className="font-bold text-white capitalize">{result.category}</span>
                    <span className="px-2 py-1 text-xs bg-gray-700 rounded">
                      {Math.round(result.confidence * 100)}% confident
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                <p className="text-white mb-3 leading-relaxed">"{result.transcript}"</p>
                
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex} 
                      className="px-2 py-1 text-xs bg-gray-800/50 text-gray-300 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Test Commands */}
      <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">🎤 Try These Voice Commands:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { text: "Go to health records", category: "navigation", color: "blue" },
            { text: "I visited the doctor yesterday for checkup", category: "health", color: "red" },
            { text: "I lent 5000 rupees to my friend Raj", category: "finance", color: "green" },
            { text: "My daughter's birthday is next week", category: "family", color: "blue" },
            { text: "What time is it right now?", category: "utility", color: "purple" },
            { text: "Show my memories and timeline", category: "navigation", color: "orange" }
          ].map((cmd, index) => (
            <button
              key={index}
              onClick={() => handleVoiceCommand(cmd.text)}
              className={`p-3 text-left rounded-lg bg-gray-800/30 border border-gray-700 hover:border-${cmd.color}-500/50 hover:bg-gray-800/50 transition-all group`}
            >
              <p className="text-white group-hover:text-blue-300 transition-colors text-sm">"{cmd.text}"</p>
              <span className="text-xs text-gray-500 capitalize">{cmd.category}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-300 text-sm">
            💡 <strong>Tip:</strong> Speak naturally! The AI will automatically categorize your speech into health, finance, family, work, education, or general topics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;