export class VoiceRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  private onResultCallback: ((text: string, confidence: number) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onStartCallback: (() => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStartCallback?.();
    };

    this.recognition.onresult = (event: any) => {
      const result = event.results[0][0];
      const transcript = result.transcript.trim();
      const confidence = result.confidence;
      
      this.onResultCallback?.(transcript, confidence);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.onErrorCallback?.(event.error);
      this.stop();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEndCallback?.();
    };
  }

  start(language: string = 'en-US') {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported in this browser');
    }

    if (this.isListening) {
      this.stop();
      return;
    }

    this.recognition.lang = this.getLanguageCode(language);
    this.recognition.start();
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  setOnResult(callback: (text: string, confidence: number) => void) {
    this.onResultCallback = callback;
  }

  setOnError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  setOnStart(callback: () => void) {
    this.onStartCallback = callback;
  }

  setOnEnd(callback: () => void) {
    this.onEndCallback = callback;
  }

  private getLanguageCode(language: string): string {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'ta': 'ta-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
    };
    return languageMap[language] || 'en-US';
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

// AI Categorization Service
export class VoiceCategorizationService {
  static categorizeText(text: string): {
    category: string;
    confidence: number;
    entities: string[];
    sentiment: string;
  } {
    const lowerText = text.toLowerCase();
    
    // Health-related patterns
    if (this.matchesPatterns(lowerText, [
      'doctor', 'hospital', 'clinic', 'health', 'medical', 'checkup', 'appointment',
      'medicine', 'prescription', 'symptoms', 'pain', 'fever', 'blood', 'pressure',
      'sugar', 'diabetes', 'heart', 'cough', 'cold', 'headache', 'operation',
      'surgery', 'dentist', 'eye', 'vision', 'allergy', 'asthma'
    ])) {
      return {
        category: 'health',
        confidence: 0.85,
        entities: this.extractEntities(text, ['doctor', 'hospital', 'medicine']),
        sentiment: this.analyzeSentiment(text)
      };
    }

    // Finance-related patterns
    if (this.matchesPatterns(lowerText, [
      'money', 'rupee', 'payment', 'bill', 'loan', 'debt', 'credit', 'bank',
      'withdraw', 'deposit', 'transfer', 'salary', 'income', 'expense',
      'investment', 'stock', 'mutual fund', 'insurance', 'premium',
      'tax', 'gst', 'emi', 'interest', 'cash', 'digital payment'
    ])) {
      return {
        category: 'finance',
        confidence: 0.82,
        entities: this.extractEntities(text, ['amount', 'person', 'date']),
        sentiment: this.analyzeSentiment(text)
      };
    }

    // Education-related patterns
    if (this.matchesPatterns(lowerText, [
      'school', 'college', 'university', 'teacher', 'student', 'exam',
      'marks', 'result', 'admission', 'fee', 'tuition', 'homework',
      'project', 'assignment', 'semester', 'degree', 'certificate',
      'study', 'learn', 'course', 'training', 'workshop'
    ])) {
      return {
        category: 'education',
        confidence: 0.80,
        entities: this.extractEntities(text, ['institution', 'person', 'date']),
        sentiment: this.analyzeSentiment(text)
      };
    }

    // Family & Personal patterns
    if (this.matchesPatterns(lowerText, [
      'family', 'wife', 'husband', 'children', 'son', 'daughter', 'parents',
      'birthday', 'anniversary', 'celebration', 'wedding', 'marriage',
      'relative', 'friend', 'visit', 'meeting', 'party', 'gift',
      'vacation', 'holiday', 'travel', 'trip', 'picnic'
    ])) {
      return {
        category: 'personal',
        confidence: 0.78,
        entities: this.extractEntities(text, ['person', 'relationship', 'date']),
        sentiment: this.analyzeSentiment(text)
      };
    }

    // Work & Professional patterns
    if (this.matchesPatterns(lowerText, [
      'work', 'job', 'office', 'meeting', 'client', 'project', 'deadline',
      'colleague', 'boss', 'manager', 'salary', 'promotion', 'interview',
      'resign', 'join', 'training', 'conference', 'business', 'company'
    ])) {
      return {
        category: 'work',
        confidence: 0.79,
        entities: this.extractEntities(text, ['company', 'person', 'date']),
        sentiment: this.analyzeSentiment(text)
      };
    }

    // Default category
    return {
      category: 'general',
      confidence: 0.65,
      entities: [],
      sentiment: 'neutral'
    };
  }

  private static matchesPatterns(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => text.includes(pattern));
  }

  private static extractEntities(text: string, types: string[]): string[] {
    const entities: string[] = [];
    
    // Extract amounts (like 2000 rupees, $500)
    const amountMatches = text.match(/\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(?:rupees?|rs|₹|dollars?|\$)?\b/i);
    if (amountMatches && amountMatches[1]) {
      entities.push(`${amountMatches[1]} amount`);
    }

    // Extract dates (today, tomorrow, 15th January, next week)
    const datePatterns = [
      /\b(today|tomorrow|yesterday)\b/i,
      /\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
      /\b(next|this)\s+(week|month|year)\b/i,
      /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/
    ];
    
    datePatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) entities.push(match[0] + ' date');
    });

    // Extract people names (capitalized words that aren't at start of sentence)
    const nameMatches = text.match(/\b(?:Dr\.|Mr\.|Mrs\.|Ms\.)?\s*([A-Z][a-z]+)\b/g);
    if (nameMatches) {
      nameMatches.forEach(name => {
        if (!['I', 'Today', 'Tomorrow', 'Yesterday'].includes(name)) {
          entities.push(name);
        }
      });
    }

    return entities.slice(0, 5); // Limit to 5 entities
  }

  private static analyzeSentiment(text: string): string {
    const positiveWords = ['good', 'happy', 'excited', 'great', 'wonderful', 'excellent', 'positive'];
    const negativeWords = ['bad', 'sad', 'pain', 'problem', 'issue', 'worry', 'concern', 'negative'];
    
    const lowerText = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 1;
    });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }
}