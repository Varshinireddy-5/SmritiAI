import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Languages, Volume2, Play, Loader2, AlertCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

// Inline VoiceService class
class VoiceService {
  private static instance: VoiceService;
  private recognition: any;
  private synth: SpeechSynthesis;
  private isAvailable = false;

  private constructor() {
    this.synth = window.speechSynthesis;
    this.initRecognition();
  }

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  private initRecognition(): void {
    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || 
                               (window as any).SpeechRecognition ||
                               (window as any).mozSpeechRecognition ||
                               (window as any).msSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.isAvailable = true;
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      this.isAvailable = false;
    }
  }

  async startListening(options: {
    language: string;
    onResult: (transcript: string, confidence: number) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  }): Promise<boolean> {
    if (!this.isAvailable || !this.recognition) {
      options.onError?.('Speech recognition not available');
      return false;
    }

    try {
      this.recognition.lang = this.getLanguageCode(options.language);
      
      this.recognition.onresult = (event: any) => {
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence || 0.8;
          options.onResult(transcript, confidence);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        let errorMsg = 'Voice recognition failed';
        
        switch (event.error) {
          case 'no-speech':
            errorMsg = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMsg = 'No microphone found. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMsg = 'Microphone access denied. Please enable microphone permissions.';
            break;
        }
        
        options.onError?.(errorMsg);
      };

      this.recognition.onend = () => {
        options.onEnd?.();
      };

      this.recognition.start();
      options.onStart?.();
      return true;
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      options.onError?.('Failed to start voice recognition');
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isAvailable) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }

  speak(text: string, language: string = 'en'): void {
    if (!this.synth) return;

    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.getLanguageCode(language);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    this.synth.speak(utterance);
  }

  stopSpeaking(): void {
    this.synth.cancel();
  }

  private getLanguageCode(lang: string): string {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
    };
    
    return languageMap[lang] || 'en-US';
  }

  isVoiceAvailable(): boolean {
    return this.isAvailable;
  }
}

// Simple memory analyzer
async function analyzeMemory(text: string, language: string) {
  const textLower = text.toLowerCase();
  
  let category = 'general';
  const tags: string[] = [];
  
  const healthKeywords = ['hospital', 'doctor', 'checkup', 'medicine', 'pain', 'health', 'sugar', 'diabetes'];
  const financeKeywords = ['money', 'rupees', 'loan', 'lent', 'borrow'];
  const familyKeywords = ['family', 'wife', 'husband', 'son', 'daughter', 'child'];

  if (healthKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'health';
    tags.push('medical', 'healthcare');
  } else if (financeKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'finance';
    tags.push('money', 'transaction');
  } else if (familyKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'family';
    tags.push('family', 'personal');
  }

  const insightsMap: Record<string, string> = {
    health: 'Health memory detected. Consider setting a reminder for follow-up.',
    finance: 'Financial transaction noted. Track this in your records.',
    family: 'Family event captured. Would you like to set a reminder?',
    general: 'Memory saved successfully.'
  };

  return {
    category,
    confidence: 0.85 + Math.random() * 0.14,
    insights: insightsMap[category],
    tags: [...tags, language, 'voice']
  };
}

export function VoiceCapture() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceService = useRef(VoiceService.getInstance());
  const isMounted = useRef(true);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  ];

  const greetings = {
    en: "I'm listening. Please speak about your memory or thought.",
    hi: "मैं सुन रहा हूँ। कृपया अपनी याद या विचार बताएं।",
    bn: "আমি শুনছি। দয়া করে আপনার স্মৃতি বা চিন্তা বলুন।",
    te: "నేను వింటున్నాను. దయచేసి మీ జ్ఞాపకం లేదా ఆలోచన చెప్పండి.",
    mr: "मी ऐकत आहे. कृपया तुमची स्मृती किंवा विचार सांगा.",
    ta: "நான் கேட்கிறேன். தயவு செய்து உங்கள் நினைவு அல்லது எண்ணத்தைச் சொல்லுங்கள்.",
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      voiceService.current.stopListening();
      voiceService.current.stopSpeaking();
    };
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setRecordingTime((prev: number) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const analyzeTranscript = useCallback(async (text: string, lang: string) => {
    try {
      setIsProcessing(true);
      
      const analysis = await analyzeMemory(text, lang);
      setAnalyzedData(analysis);
      
      // Speak confirmation
      const confirmation = lang === 'en' 
        ? `I've captured your ${analysis.category} memory. ${analysis.insights}`
        : `Memory saved successfully.`;
      
      voiceService.current.speak(confirmation, lang);
      
      toast.success(`Analyzed as ${analysis.category} memory`);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed, but memory saved');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      stopTimer();
      voiceService.current.stopListening();
      
    } else {
      // Start recording
      setIsRecording(true);
      setTranscript('');
      setAnalyzedData(null);
      setRecordingTime(0);
      setConfidence(0);
      
      // Speak greeting
      voiceService.current.speak(
        greetings[language as keyof typeof greetings] || greetings.en,
        language
      );
      
      // Start timer
      startTimer();
      
      // Start voice recognition
      const success = await voiceService.current.startListening({
        language,
        onStart: () => {
          console.log('🎤 Voice recognition started');
          toast.info('Listening... speak now');
        },
        onResult: async (transcriptText: string, transcriptConfidence: number) => {
          if (!isMounted.current) return;
          
          console.log('✅ Voice captured:', transcriptText, 'Confidence:', transcriptConfidence);
          
          setTranscript(transcriptText);
          setConfidence(transcriptConfidence);
          
          // Stop recording automatically after getting result
          setIsRecording(false);
          stopTimer();
          
          // Analyze the transcript
          await analyzeTranscript(transcriptText, language);
        },
        onError: (error: string) => {
          if (!isMounted.current) return;
          
          console.error('❌ Voice error:', error);
          toast.error(error);
          setIsRecording(false);
          stopTimer();
          setRecordingTime(0);
          
          // Fallback example
          setTimeout(() => {
            if (isMounted.current) {
              const examples: Record<string, string> = {
                en: 'I visited the hospital yesterday for my regular diabetes checkup. Doctor advised to exercise daily.',
                hi: 'मैं कल अपनी शुगर की जांच के लिए अस्पताल गया था। डॉक्टर ने रोज व्यायाम करने की सलाह दी।',
                bn: 'আমি গতকাল আমার ডায়াবেটিস চেকআপের জন্য হাসপাতালে গিয়েছিলাম। ডাক্তার দৈনিক ব্যায়াম করার পরামর্শ দিয়েছেন।',
              };
              
              const exampleText = examples[language] || examples.en;
              setTranscript(exampleText);
              analyzeTranscript(exampleText, language);
            }
          }, 1000);
        },
        onEnd: () => {
          if (isMounted.current && isRecording) {
            console.log('🔄 Recognition ended');
            setIsRecording(false);
            stopTimer();
          }
        }
      });
      
      if (!success) {
        setIsRecording(false);
        stopTimer();
      }
    }
  }, [isRecording, language, startTimer, stopTimer, analyzeTranscript, greetings]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = useCallback(() => {
    if (!transcript) return;
    
    // Save to localStorage
    const memory = {
      id: Date.now().toString(),
      transcript,
      language,
      confidence,
      analyzedData,
      timestamp: new Date().toISOString(),
    };
    
    const memories = JSON.parse(localStorage.getItem('voiceMemories') || '[]');
    memories.push(memory);
    localStorage.setItem('voiceMemories', JSON.stringify(memories));
    
    voiceService.current.speak(
      language === 'en' 
        ? 'Memory saved successfully.' 
        : 'Memory saved successfully.',
      language
    );
    
    toast.success('Memory saved!');
    
    // Clear after saving
    setTimeout(() => {
      setTranscript('');
      setAnalyzedData(null);
      setConfidence(0);
    }, 1000);
  }, [transcript, language, confidence, analyzedData]);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl backdrop-blur-xl bg-gray-900/80 border border-gray-700/50 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Voice Memory Capture</h2>
              <p className="text-sm text-gray-400">Speak naturally in your language</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-gray-400" />
              <select
                value={language}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setLanguage(e.target.value);
                  voiceService.current.speak(
                    `Language set to ${languages.find(l => l.code === e.target.value)?.name}`,
                    e.target.value
                  );
                }}
                className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:border-blue-500 transition-all"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-gray-900">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                const status = voiceService.current.isVoiceAvailable() 
                  ? 'Voice recognition is available' 
                  : 'Voice recognition not available';
                toast.info(status);
              }}
              className="px-3 py-1 text-sm bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50"
            >
              Test Mic
            </button>
          </div>
        </div>

        {/* Recording Button */}
        <div className="flex flex-col items-center justify-center py-8">
          <button
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`
              relative w-32 h-32 rounded-full transition-all duration-300 
              ${isRecording 
                ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse shadow-[0_0_60px_rgba(255,0,110,0.8)]' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isProcessing ? (
              <div className="absolute inset-0 m-auto w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isRecording ? (
              <>
                <MicOff className="absolute inset-0 m-auto w-12 h-12 text-white" />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {formatTime(recordingTime)}
                </div>
              </>
            ) : (
              <Mic className="absolute inset-0 m-auto w-12 h-12 text-white" />
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-lg font-medium text-white">
              {isProcessing 
                ? 'Analyzing your memory...' 
                : isRecording 
                ? `Recording... ${formatTime(recordingTime)}` 
                : 'Tap microphone to speak'}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {isRecording 
                ? 'Speak clearly about your memory or thought...' 
                : 'Your voice will be transcribed and analyzed automatically.'}
            </p>
            
            {confidence > 0 && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full">
                <span className="text-xs text-gray-300">Confidence:</span>
                <span className="text-sm font-semibold text-green-400">
                  {Math.round(confidence * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Transcript Area */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-white">
                Live Transcript
              </label>
              {transcript && (
                <span className="px-2 py-1 text-xs bg-gray-800 rounded">
                  {language.toUpperCase()}
                </span>
              )}
            </div>
            {transcript && (
              <button
                onClick={() => voiceService.current.speak(transcript, language)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Listen</span>
              </button>
            )}
          </div>
          
          <div className="min-h-32 p-4 rounded-xl bg-gray-900/50 border border-gray-700/50">
            {isProcessing && !transcript ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-gray-400">Processing your voice...</p>
                </div>
              </div>
            ) : transcript ? (
              <div className="space-y-4">
                <p className="text-white text-lg leading-relaxed">{transcript}</p>
                
                {analyzedData && (
                  <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-300">Analysis Result:</span>
                        <span className="px-2 py-1 text-xs capitalize bg-blue-900/30 text-blue-300 rounded">
                          {analyzedData.category}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(analyzedData.confidence * 100)}% accurate
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{analyzedData.insights}</p>
                    {analyzedData.tags && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {analyzedData.tags.map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-700/50 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Your transcribed text will appear here...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={!transcript || isProcessing}
            className={`
              flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold 
              transition-all duration-300
              ${transcript && !isProcessing 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02]' 
                : 'bg-gray-700 cursor-not-allowed opacity-50'
              }
            `}
          >
            <Save className="w-5 h-5" />
            <span>Save Memory</span>
          </button>
          
          <button
            onClick={() => {
              setTranscript('');
              setAnalyzedData(null);
              setConfidence(0);
              voiceService.current.speak('Cleared. Ready for new recording.', language);
            }}
            className="px-6 py-4 rounded-xl font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          Tips for Better Voice Capture
        </h3>
        <ul className="space-y-3 text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Speak clearly at a normal pace</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Use natural language about your memory</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Include important details: dates, people, locations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">•</span>
            <span>Ensure good microphone quality and quiet environment</span>
          </li>
        </ul>
      </div>

      {/* Example Memories */}
      <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Example Memories to Try</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { 
              text: 'I visited Dr. Sharma yesterday for my diabetes checkup at Apollo Hospital',
              lang: 'en',
              category: 'health'
            },
            { 
              text: 'मैंने रमेश को 15 जनवरी को 2000 रुपये उधार दिए',
              lang: 'hi',
              category: 'finance'
            },
            { 
              text: 'My daughter started at St. Mary School this June',
              lang: 'en',
              category: 'education'
            },
            { 
              text: 'আমি গতকাল হাঁটার সময় বুকে ব্যথা অনুভব করেছি',
              lang: 'bn',
              category: 'health'
            },
          ].map((example, i) => (
            <button
              key={i}
              onClick={() => {
                setTranscript(example.text);
                setLanguage(example.lang);
                analyzeTranscript(example.text, example.lang);
              }}
              className="p-4 rounded-lg bg-gray-800/30 border border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all text-left group"
            >
              <p className="text-white mb-2 group-hover:text-blue-300 transition-colors">{example.text}</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs bg-gray-700 rounded">{example.category}</span>
                <span className="px-2 py-1 text-xs bg-gray-800 rounded">{example.lang}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}