import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Mic, StopCircle, Languages, Loader2, CheckCircle, Play, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { localStore } from '../utils/localStore';

export function VoiceCapture() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [structuredData, setStructuredData] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  ];

  const handleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setIsProcessing(true);

      try {
        // Simulate voice transcription and AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock transcription based on language
        const mockTranscriptions: { [key: string]: string } = {
          en: 'I visited Dr. Singh at City Hospital yesterday for a diabetes checkup. He prescribed Metformin 500mg to take twice daily after meals.',
          hi: 'मैं कल शहर अस्पताल में डॉ. सिंह से मिला था। उन्होंने मुझे मधुमेह की जांच की और मेटफॉर्मिन 500mg दिन में दो बार खाने के बाद लेने की सलाह दी।',
          ta: 'நான் நேற்று நகர மருத்துவமனையில் டாக்டர் சிங்கை சந்தித்தேன். சர்க்கரை நோய் பரிசோதனைக்காக அவர் மெட்ஃபார்மின் 500mg தினமும் இரண்டு முறை உணவுக்குப் பிறகு எடுக்க அறிவுறுத்தினார்.',
          te: 'నేను నిన్న నగర ఆసుపత్రిలో డాక్టర్ సింగ్‌ను కలిశాను. మధుమేహ తనిఖీ కోసం అతను మెట్‌ఫార్మిన్ 500mg రోజుకు రెండుసార్లు భోజనం తర్వాత తీసుకోమని సూచించాడు.',
        };

        const mockTranscription = mockTranscriptions[selectedLanguage] || mockTranscriptions.en;
        setTranscription(mockTranscription);

        // AI structure the memory
        await new Promise(resolve => setTimeout(resolve, 1000));

        const structureData = {
          category: 'health',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          location: 'City Hospital',
          importance: 'high',
          emotion: 'concerned',
          tags: ['diabetes', 'checkup', 'medication', 'metformin', 'dr singh'],
          insights: 'Regular medication monitoring needed. Set reminder for twice daily dosage.',
          confidenceScore: 0.94,
          entities: {
            people: ['Dr. Singh'],
            places: ['City Hospital'],
            amounts: [500],
            dates: [new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()],
          },
        };

        setStructuredData(structureData);
        toast.success('Memory captured and analyzed!');
      } catch (error) {
        console.error('Error processing voice:', error);
        toast.error('Failed to process voice recording');
      } finally {
        setIsProcessing(false);
        setRecordingTime(0);
      }
    } else {
      // Start recording
      setIsRecording(true);
      setTranscription('');
      setStructuredData(null);
      setRecordingTime(0);
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
      
      toast.info('Recording started... speak naturally');
    }
  };

  const handleSaveMemory = () => {
    try {
      localStore.addMemory({
        userId: 'demo_user',
        text: transcription,
        structured: structuredData,
        language: selectedLanguage,
      });

      toast.success('Memory saved successfully!');
      setTranscription('');
      setStructuredData(null);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error('Failed to save memory');
    }
  };

  const handleUseSample = (sample: string) => {
    setTranscription(sample);
    setIsProcessing(true);
    
    setTimeout(() => {
      const structureData = {
        category: sample.includes('hospital') || sample.includes('doctor') ? 'health' : 
                  sample.includes('rupees') || sample.includes('lent') ? 'finance' : 
                  sample.includes('Aadhaar') || sample.includes('card') ? 'document' : 'personal',
        date: new Date().toISOString(),
        location: sample.includes('hospital') ? 'hospital' : 'home',
        importance: 'high',
        emotion: 'neutral',
        tags: sample.split(' ').filter(w => w.length > 4).slice(0, 5),
        insights: 'Sample memory processed',
        confidenceScore: 0.88,
      };
      setStructuredData(structureData);
      setIsProcessing(false);
      toast.success('Sample processed!');
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Voice Memory Capture</h1>
        <p className="text-[#b8b8c8]">Speak naturally in your language. We'll understand and remember.</p>
      </div>

      {/* Language Selection */}
      <GlassCard className="p-6" neonColor="purple">
        <div className="flex items-center gap-3 mb-4">
          <Languages className="w-5 h-5 text-[#d4a5ff]" />
          <h3 className="text-lg font-semibold text-white">Select Language</h3>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`p-3 rounded-lg transition-all ${ 
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
              <div className="text-2xl mb-1">{lang.flag}</div>
              <div className="text-xs text-white">{lang.name}</div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Recording Interface */}
      <GlassCard className="p-8" neonColor="cyan">
        <div className="flex flex-col items-center space-y-6">
          {/* Recording Button */}
          <button
            onClick={handleRecording}
            disabled={isProcessing}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-[rgba(255,166,193,0.2)] border-4 border-[#ffa6c1]'
                : 'bg-[rgba(135,206,235,0.2)] border-4 border-[#87ceeb]'
            }`}
            style={
              isRecording
                ? { 
                    boxShadow: '0 0 30px rgba(255,166,193,0.5)',
                    animation: 'pulse-glow 2s ease-in-out infinite'
                  }
                : { 
                    boxShadow: '0 0 20px rgba(135,206,235,0.4)',
                  }
            }
          >
            {isProcessing ? (
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            ) : isRecording ? (
              <StopCircle className="w-12 h-12 text-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </button>

          <div className="text-center">
            <p className="text-xl font-semibold text-white mb-1">
              {isProcessing
                ? 'Processing your memory...'
                : isRecording
                ? `Recording... ${formatTime(recordingTime)}`
                : 'Tap to start recording'}
            </p>
            <p className="text-sm text-[#b8b8c8]">
              {isRecording && 'Speak freely. No forms, no structure needed.'}
              {!isRecording && !isProcessing && 'Your voice will be converted to text and analyzed by AI'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Transcription & Structured Data */}
      {transcription && (
        <div className="space-y-4">
          <GlassCard className="p-6" neonColor="cyan">
            <h3 className="text-lg font-semibold text-white mb-3">Transcription</h3>
            <p className="text-white leading-relaxed">{transcription}</p>
          </GlassCard>

          {structuredData && (
            <GlassCard className="p-6" neonColor="purple">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-[#87ceeb]" />
                <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
                <span className="px-3 py-1 rounded-full bg-[rgba(135,206,235,0.1)] text-[#87ceeb] text-sm">
                  {Math.round(structuredData.confidenceScore * 100)}% confident
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[#b8b8c8] text-sm mb-1">Category</p>
                  <p className="text-white font-medium capitalize">{structuredData.category}</p>
                </div>
                <div>
                  <p className="text-[#b8b8c8] text-sm mb-1">Date</p>
                  <p className="text-white font-medium">
                    {new Date(structuredData.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[#b8b8c8] text-sm mb-1">Location</p>
                  <p className="text-white font-medium capitalize">{structuredData.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[#b8b8c8] text-sm mb-1">Importance</p>
                  <p className="text-white font-medium capitalize">{structuredData.importance}</p>
                </div>
                <div>
                  <p className="text-[#b8b8c8] text-sm mb-1">Emotion</p>
                  <p className="text-white font-medium capitalize">{structuredData.emotion || 'N/A'}</p>
                </div>
              </div>

              {structuredData.tags && structuredData.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-[#b8b8c8] text-sm mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {structuredData.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-[rgba(135,206,235,0.1)] text-[#87ceeb] text-sm border border-[rgba(135,206,235,0.3)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {structuredData.insights && (
                <div className="mt-4 p-4 rounded-lg bg-[rgba(135,206,235,0.05)] border border-[rgba(135,206,235,0.2)]">
                  <p className="text-[#b8b8c8] text-sm mb-1">AI Insight</p>
                  <p className="text-white">{structuredData.insights}</p>
                </div>
              )}
            </GlassCard>
          )}

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => {
                setTranscription('');
                setStructuredData(null);
              }}
              variant="outline"
              className="border-[#b8b8c8] text-white hover:bg-[rgba(255,255,255,0.1)]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Discard
            </Button>
            <Button
              onClick={handleSaveMemory}
              className="bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5] font-semibold"
              style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Memory
            </Button>
          </div>
        </div>
      )}

      {/* Examples */}
      <GlassCard className="p-6" neonColor="pink">
        <h3 className="text-lg font-semibold text-white mb-4">Try Example Memories</h3>
        <div className="space-y-3">
          {[
            'I went to hospital last Diwali for diabetes checkup with Dr. Sharma',
            'I lent 5000 rupees to Ramesh Kumar on January 15th. He will return it by March',
            'Doctor prescribed Metformin, one tablet morning and evening after meals',
            'My Aadhaar card is in the blue folder in bedroom cupboard',
            'Received pension of 15000 rupees on first of this month',
            'Granddaughter Priya got married on December 25th at the temple',
          ].map((example, i) => (
            <div 
              key={i} 
              className="p-4 rounded-lg bg-[rgba(30,50,80,0.5)] border border-[rgba(255,166,193,0.2)] hover:border-[rgba(255,166,193,0.5)] transition-all cursor-pointer group"
              onClick={() => handleUseSample(example)}
            >
              <div className="flex items-center justify-between">
                <p className="text-white text-sm flex-1">{example}</p>
                <Play className="w-4 h-4 text-[#ffa6c1] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
