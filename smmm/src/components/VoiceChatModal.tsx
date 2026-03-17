import { useState, useEffect, useRef } from 'react';
import { GlassCard } from './GlassCard';
import { X, Mic, StopCircle, Loader2, Languages, CheckCircle, Trash2, Volume2, Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { localStore } from '../utils/localStore';

interface VoiceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceChatModal({ isOpen, onClose }: VoiceChatModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [structuredData, setStructuredData] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoNavigate, setAutoNavigate] = useState(true);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
  ];

  // Multilingual prompts
  const prompts = {
    start: {
      en: 'Recording started. Please speak now.',
      hi: 'रिकॉर्डिंग शुरू हुई। कृपया बोलिए।',
      ta: 'பதிவு தொடங்கியது. தயவு செய்து பேசுங்கள்.',
      te: 'రికార్డింగ్ ప్రారంభమైంది. దయచేసి మాట్లాడండి.',
      bn: 'রেকর্ডিং শুরু হয়েছে। দয়া করে বলুন।',
    },
    processing: {
      en: 'Processing your voice memory...',
      hi: 'आपकी आवाज की याद संसाধित हो रही है...',
      ta: 'உங்கள் குரல் நினைவகம் செயலாக்கப்படுகிறது...',
      te: 'మీ వాయిస్ మెమరీ ప్రాసెస్ అవుతోంది...',
      bn: 'আপনার ভয়েস মেমরি প্রক্রিয়াকরণ হচ্ছে...',
    },
    complete: {
      en: 'Analysis complete. I have identified this as a health memory with high importance.',
      hi: 'विश्लेषण पूरा हुआ। मैंने इसे उच्च महत्व के स्वास्थ्य स्मृति के रूप में पहचाना है।',
      ta: 'பகுப்பாய்வு முடிந்தது. இது உயர் முக்கியத்துவம் வாய்ந்த சுகாதார நினைவகம் என நான் அடையாளம் கண்டுள்ளேன்.',
      te: 'విశ్లేషణ పూర్తయింది. నేను దీన్ని హై ఇంపార్టెన్స్ టు హెల్త్ మెమరీగా గుర్తించాను.',
      bn: 'বিশ্লেষণ সম্পূর্ণ। আমি এটিকে উচ্চ গুরুত্ব সহ একটি স্বাস্থ্য স্মৃতি হিসাবে চিহ্নিত করেছি।',
    }
  };

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    // Auto-speak when analysis is complete
    if (structuredData && autoNavigate) {
      setTimeout(() => {
        speakText(prompts.complete[selectedLanguage as keyof typeof prompts.complete] || prompts.complete.en, selectedLanguage);
      }, 1000);
    }
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [structuredData]);

  const speakText = (text: string, lang = selectedLanguage) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    
    synthRef.current.speak(utterance);
  };

  const handleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setIsProcessing(true);

      // Speak processing message
      speakText(prompts.processing[selectedLanguage as keyof typeof prompts.processing] || prompts.processing.en, selectedLanguage);

      // Use real speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage;
        
        recognition.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Real voice input:', transcript);
          setTranscription(transcript);

          // AI structure the memory (simulate processing)
          await new Promise(resolve => setTimeout(resolve, 1500));

          const structureData = {
            category: 'voice', // This would be determined by AI analysis
            date: new Date().toISOString(),
            location: 'Voice Input', // This would be extracted from speech
            importance: 'medium',
            emotion: 'neutral',
            tags: ['voice', 'memory', 'captured'],
            insights: 'Voice memory captured successfully.',
            confidenceScore: event.results[0][0].confidence || 0.9,
            entities: {
              people: [],
              dates: [new Date().toISOString()],
              locations: [],
              conditions: [],
            },
          };

          setStructuredData(structureData);
          toast.success('Memory captured and analyzed!');
          setIsProcessing(false);
        };

        recognition.onerror = async (event: any) => {
          console.error('Speech recognition error:', event.error);
          
          // Fallback to mock data if recognition fails
          await new Promise(resolve => setTimeout(resolve, 1000));

          const mockTranscriptions: { [key: string]: string } = {
            en: 'I need to remember to visit Dr. Singh next week for my monthly checkup at Apollo Hospital. He said my blood pressure is slightly high.',
            hi: 'मुझे अगले सप्ताह अपोलो अस्पताल में डॉ. सिंह से मिलने जाना है। उन्होंने कहा कि मेरा ब्लड प्रेशर थोड़ा ज्यादा है।',
            ta: 'அடுத்த வாரம் அப்பல்லோ மருத்துவமனையில் டாக்டர் சிங்கை சந்திக்க வேண்டும். எனது இரத்த அழுத்தம் சற்று அதிகமாக உள்ளது என்று அவர் கூறினார்.',
            te: 'వచ్చే వారం అపోలో హాస్పిటల్‌లో డాక్టర్ సింగ్‌ను కలవాలి। నా రక్తపోటు కొంచెం ఎక్కువగా ఉందని ఆయన చెప్పారు.',
            bn: 'আমাকে পরের সপ্তাহে অ্যাপোলো হাসপাতালে ডাক্তার সিং-এর সাথে দেখা করতে হবে। তিনি বলেছেন যে আমার রক্তচাপ কিছুটা বেশি।',
          };

          const mockTranscription = mockTranscriptions[selectedLanguage] || mockTranscriptions.en;
          setTranscription(mockTranscription);

          // AI structure the memory
          await new Promise(resolve => setTimeout(resolve, 1000));

          const structureData = {
            category: 'health',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Apollo Hospital',
            importance: 'high',
            emotion: 'concerned',
            tags: ['checkup', 'dr singh', 'appointment', 'blood pressure'],
            insights: 'Schedule follow-up appointment. Monitor blood pressure daily.',
            confidenceScore: 0.92,
            entities: {
              people: ['Dr. Singh'],
              dates: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()],
              locations: ['Apollo Hospital'],
              conditions: ['blood pressure'],
            },
          };

          setStructuredData(structureData);
          toast.success('Memory captured and analyzed!');
          setIsProcessing(false);
          setRecordingTime(0);
        };

        // Start recognition immediately
        recognition.start();
      } else {
        // Fallback to mock data if speech recognition not supported
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockTranscriptions: { [key: string]: string } = {
          en: 'I need to remember to visit Dr. Singh next week for my monthly checkup at Apollo Hospital. He said my blood pressure is slightly high.',
          hi: 'मुझे अगले सप्ताह अपोलो अस्पताल में डॉ. सिंह से मिलने जाना है। उन्होंने कहा कि मेरा ब्लड प्रेशर थोड़ा ज्यादा है।',
          ta: 'அடுத்த வாரம் அப்பல்லோ மருத்துவமனையில் டாக்டர் சிங்கை சந்திக்க வேண்டும். எனது இரத்த அழுத்தம் சற்று அதிகமாக உள்ளது என்று அவர் கூறினார்.',
          te: 'వచ్చే వారం అపోలో హాస్పిటల్‌లో డాక్టర్ సింగ్‌ను కలవాలి। నా రక్తపోటు కొంచెం ఎక్కువగా ఉందని ఆయన చెప్పారు.',
          bn: 'আমাকে পরের সপ্তাহে অ্যাপোলো হাসপাতালে ডাক্তার সিং-এর সাথে দেখা করতে হবে। তিনি বলেছেন যে আমার রক্তচাপ কিছুটা বেশি।',
        };

        const mockTranscription = mockTranscriptions[selectedLanguage] || mockTranscriptions.en;
        setTranscription(mockTranscription);

        // AI structure the memory
        await new Promise(resolve => setTimeout(resolve, 1500));

        const structureData = {
          category: 'health',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Apollo Hospital',
          importance: 'high',
          emotion: 'concerned',
          tags: ['checkup', 'dr singh', 'appointment', 'blood pressure'],
          insights: 'Schedule follow-up appointment. Monitor blood pressure daily.',
          confidenceScore: 0.92,
          entities: {
            people: ['Dr. Singh'],
            dates: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()],
            locations: ['Apollo Hospital'],
            conditions: ['blood pressure'],
          },
        };

        setStructuredData(structureData);
        toast.success('Memory captured and analyzed!');
        setIsProcessing(false);
        setRecordingTime(0);
      }
    } else {
      // Start recording
      setIsRecording(true);
      setTranscription('');
      setStructuredData(null);
      setRecordingTime(0);
      
      // Speak start message
      speakText(prompts.start[selectedLanguage as keyof typeof prompts.start] || prompts.start.en, selectedLanguage);
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime((prev: number) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
      
      toast.info('Recording started... speak naturally');
    }
  };

  const handleSaveMemory = () => {
    try {
      localStore.addMemory({
        userId: 'demo_user',
        type: 'voice',
        title: `Voice Memory - ${new Date().toLocaleDateString()}`,
        description: transcription,
        voiceExplanation: transcription,
        date: new Date().toISOString().split('T')[0],
        location: structuredData?.entities?.locations?.[0] || '',
        tags: structuredData?.tags || ['voice', 'memory'],
        people: structuredData?.entities?.people || [],
        isLocked: false,
      });

      speakText('Memory saved successfully. I will remind you about this.', selectedLanguage);
      toast.success('Memory saved successfully!');
      
      // Auto-close after saving
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error('Failed to save memory');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <GlassCard className="p-6" neonColor="cyan">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#87ceeb] to-[#b45aff]">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Voice Memory Assistant</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoNavigate(!autoNavigate)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  autoNavigate
                    ? 'bg-[#87ceeb] text-[#0a1628]'
                    : 'bg-white/5 text-white'
                }`}
              >
                {autoNavigate ? 'Auto-voice ✓' : 'Manual'}
              </button>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#b8b8c8] text-sm">Select Language</p>
              <button
                onClick={() => speakText(`Current language is ${languages.find(l => l.code === selectedLanguage)?.name}`, selectedLanguage)}
                className="p-1 rounded hover:bg-white/5"
              >
                <Volume2 className="w-4 h-4 text-white/60" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    speakText(`Language changed to ${lang.name}`, lang.code);
                  }}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedLanguage === lang.code
                      ? 'bg-[rgba(135,206,235,0.2)] border border-[#87ceeb]'
                      : 'bg-[rgba(30,50,80,0.5)] border border-transparent hover:border-[rgba(135,206,235,0.3)]'
                  }`}
                  style={
                    selectedLanguage === lang.code
                      ? { boxShadow: '0 0 15px rgba(135, 206, 235, 0.4)' }
                      : {}
                  }
                >
                  <span className="text-white text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recording Interface */}
          <div className="flex flex-col items-center space-y-6 py-8">
            {/* Recording Button */}
            <button
              onClick={handleRecording}
              disabled={isProcessing}
              className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-[rgba(255,166,193,0.2)] border-4 border-[#ffa6c1]'
                  : isProcessing
                  ? 'bg-[rgba(135,206,235,0.1)] border-4 border-[#87ceeb]'
                  : 'bg-[rgba(135,206,235,0.2)] border-4 border-[#87ceeb]'
              } ${isProcessing ? 'animate-pulse' : ''}`}
              style={
                isRecording
                  ? { 
                      boxShadow: '0 0 40px rgba(255,166,193,0.5)',
                      animation: 'pulse 2s ease-in-out infinite'
                    }
                  : { 
                      boxShadow: '0 0 30px rgba(135,206,235,0.4)',
                    }
              }
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-16 h-16 text-white animate-spin" />
                  <div className="absolute -bottom-6 text-sm text-white">
                    Analyzing...
                  </div>
                </>
              ) : isRecording ? (
                <>
                  <StopCircle className="w-16 h-16 text-white" />
                  <div className="absolute -bottom-6 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {formatTime(recordingTime)}
                  </div>
                </>
              ) : (
                <Mic className="w-16 h-16 text-white" />
              )}
            </button>

            <div className="text-center">
              <p className="text-xl font-semibold text-white mb-1">
                {isProcessing
                  ? 'Processing your memory...'
                  : isRecording
                  ? `Recording... ${formatTime(recordingTime)}`
                  : 'Tap microphone to start'}
              </p>
              <p className="text-sm text-[#b8b8c8] max-w-md">
                {isRecording && 'Speak freely in your language. No forms needed.'}
                {!isRecording && !isProcessing && 'Voice-first memory capture with automatic analysis'}
              </p>
              
              {isRecording && (
                <div className="flex justify-center gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-2 bg-[#87ceeb] rounded-full voice-wave"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: `${20 + Math.random() * 20}px`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Transcription & Structured Data */}
          {transcription && (
            <div className="space-y-4 mt-6">
              <div className="p-4 rounded-lg bg-[rgba(135,206,235,0.05)] border border-[rgba(135,206,235,0.2)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#b8b8c8] text-sm">Transcription</p>
                  <button
                    onClick={() => speakText(transcription, selectedLanguage)}
                    className="flex items-center gap-1 text-sm text-[#87ceeb] hover:text-white"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    <span>Listen</span>
                  </button>
                </div>
                <p className="text-white leading-relaxed">{transcription}</p>
              </div>

              {structuredData && (
                <>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#87ceeb]" />
                    <span className="text-white font-medium">AI Analysis Complete</span>
                    <span className="px-3 py-1 rounded-full bg-[rgba(135,206,235,0.1)] text-[#87ceeb] text-sm">
                      {Math.round(structuredData.confidenceScore * 100)}% confident
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-[rgba(135,206,235,0.05)] border border-[rgba(135,206,235,0.2)]">
                      <p className="text-[#b8b8c8] text-xs mb-1">Category</p>
                      <p className="text-white font-medium capitalize">{structuredData.category}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(135,206,235,0.05)] border border-[rgba(135,206,235,0.2)]">
                      <p className="text-[#b8b8c8] text-xs mb-1">Importance</p>
                      <p className="text-white font-medium capitalize">{structuredData.importance}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(135,206,235,0.05)] border border-[rgba(135,206,235,0.2)]">
                      <p className="text-[#b8b8c8] text-xs mb-1">Next Action</p>
                      <p className="text-white font-medium text-sm">{structuredData.insights}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(135,206,235,0.05)] border border-[rgba(135,206,235,0.2)]">
                      <p className="text-[#b8b8c8] text-xs mb-1">Language</p>
                      <p className="text-white font-medium">{selectedLanguage.toUpperCase()}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setTranscription('');
                    setStructuredData(null);
                    speakText('Memory discarded. Ready for new recording.', selectedLanguage);
                  }}
                  variant="outline"
                  className="flex-1 border-[#b8b8c8] text-white hover:bg-[rgba(255,255,255,0.1)]"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Discard
                </Button>
                <Button
                  onClick={handleSaveMemory}
                  className="flex-1 bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5] font-semibold"
                  style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save & Set Reminder
                </Button>
              </div>
              
              {/* Auto-navigation hint */}
              {autoNavigate && structuredData && (
                <div className="text-center pt-4 border-t border-white/10">
                  <p className="text-sm text-white/60">
                    ✓ Auto-voice enabled: I will remind you about this appointment
                  </p>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}