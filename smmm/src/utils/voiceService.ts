export interface VoiceRecognitionOptions {
  language: string;
  onStart?: () => void;
  onResult: (transcript: string, confidence: number) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class VoiceService {
  private static instance: VoiceService;
  private recognition: any;
  private synth: SpeechSynthesis;
  private isAvailable = false;
  private isCurrentlyListening = false;

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
      // Check for different browser implementations
      const SpeechRecognition = (window as any).webkitSpeechRecognition || 
                               (window as any).SpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        
        // Configure recognition settings for better performance
        this.recognition.continuous = false;  // Don't keep listening
        this.recognition.interimResults = false;  // Only final results
        this.recognition.maxAlternatives = 1;  // Just one result
        
        this.isAvailable = true;
        console.log('✅ Speech recognition initialized successfully');
      } else {
        console.warn('❌ Speech recognition not supported in this browser');
        this.isAvailable = false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize speech recognition:', error);
      this.isAvailable = false;
    }
  }

  async startListening(options: VoiceRecognitionOptions): Promise<boolean> {
    if (!this.isAvailable || !this.recognition) {
      options.onError?.('Speech recognition not available. Please use Chrome, Edge, or Safari.');
      return false;
    }

    if (this.isCurrentlyListening) {
      console.log('Already listening, stopping first...');
      this.stopListening();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      // Set language
      this.recognition.lang = this.getLanguageCode(options.language);
      console.log(`🌐 Setting language to: ${this.recognition.lang}`);
      
      // Handle results - SIMPLIFIED
      this.recognition.onresult = (event: any) => {
        console.log('🎤 Speech recognition result received:', event);
        
        if (event.results && event.results.length > 0) {
          const result = event.results[0][0];
          const transcript = result.transcript.trim();
          const confidence = result.confidence || 0.8;
          
          console.log('✅ Final transcript:', transcript, 'Confidence:', confidence);
          
          // Only process if we have meaningful content
          if (transcript.length > 1) {
            this.isCurrentlyListening = false;
            options.onResult(transcript, confidence);
          }
        }
      };

      // Handle errors with specific messages
      this.recognition.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        this.isCurrentlyListening = false;
        
        let errorMsg = 'Voice recognition failed';
        
        switch (event.error) {
          case 'no-speech':
            errorMsg = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMsg = 'Microphone not found. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMsg = 'Microphone access denied. Please allow microphone permissions.';
            break;
          case 'network':
            errorMsg = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMsg = `Speech recognition error: ${event.error}`;
        }
        
        options.onError?.(errorMsg);
      };

      // Handle start
      this.recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
        this.isCurrentlyListening = true;
        options.onStart?.();
      };

      // Handle end
      this.recognition.onend = () => {
        console.log('🔇 Speech recognition ended');
        this.isCurrentlyListening = false;
        options.onEnd?.();
      };

      // Start recognition
      console.log('🚀 Starting speech recognition...');
      this.recognition.start();
      return true;
      
    } catch (error) {
      console.error('❌ Error starting voice recognition:', error);
      this.isCurrentlyListening = false;
      options.onError?.('Failed to start voice recognition. Please try again.');
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isCurrentlyListening) {
      try {
        console.log('� Stopping speech recognition...');
        this.recognition.stop();
        this.isCurrentlyListening = false;
      } catch (error) {
        console.error('❌ Error stopping recognition:', error);
      }
    }
  }

  speak(text: string, language: string = 'en'): void {
    if (!this.synth) {
      console.warn('Speech synthesis not available');
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();
    
    console.log('🔊 Speaking:', text);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.getLanguageCode(language);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    this.synth.speak(utterance);
  }

  stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
      console.log('🔇 Speech cancelled');
    }
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
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN'
    };
    
    return languageMap[lang] || 'en-US';
  }

  isVoiceAvailable(): boolean {
    return this.isAvailable;
  }

  isListening(): boolean {
    return this.isCurrentlyListening;
  }

  // Test microphone access
  async testMicrophone(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Clean up
      console.log('✅ Microphone test successful');
      return true;
    } catch (error) {
      console.error('❌ Microphone test failed:', error);
      return false;
    }
  }
}