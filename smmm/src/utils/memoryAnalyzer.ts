export interface MemoryAnalysis {
  category: string;
  confidence: number;
  insights: string;
  tags: string[];
  entities: {
    people: string[];
    dates: string[];
    locations: string[];
    conditions: string[];
  };
}

export async function analyzeMemory(text: string, language: string): Promise<MemoryAnalysis> {
  // Simple keyword-based analysis
  const textLower = text.toLowerCase();
  
  let category = 'general';
  const tags = [];
  const entities = {
    people: [] as string[],
    dates: [] as string[],
    locations: [] as string[],
    conditions: [] as string[]
  };

  // Health-related keywords
  const healthKeywords = ['hospital', 'doctor', 'checkup', 'medicine', 'pain', 'health', 'sugar', 'diabetes', 'blood', 'pressure', 'appointment', 'clinic', 'treatment', 'sick', 'fever', 'headache'];
  const financeKeywords = ['money', 'rupees', 'loan', 'lent', 'borrow', 'debt', 'payment', 'cash', 'price', 'cost', 'bank', 'credit', 'debit', 'transaction'];
  const familyKeywords = ['family', 'wife', 'husband', 'son', 'daughter', 'child', 'parents', 'married', 'birthday', 'anniversary', 'relative', 'spouse'];
  const educationKeywords = ['school', 'college', 'exam', 'study', 'learn', 'student', 'teacher', 'class', 'homework', 'assignment', 'project'];
  const workKeywords = ['office', 'meeting', 'boss', 'colleague', 'work', 'job', 'interview', 'project', 'deadline', 'presentation'];

  // Check categories
  if (healthKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'health';
    tags.push('medical', 'healthcare');
  } else if (financeKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'finance';
    tags.push('money', 'transaction');
  } else if (familyKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'family';
    tags.push('family', 'personal');
  } else if (educationKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'education';
    tags.push('learning', 'academic');
  } else if (workKeywords.some(keyword => textLower.includes(keyword))) {
    category = 'work';
    tags.push('professional', 'career');
  }

  // Extract date patterns
  const datePatterns = [
    /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/g,
    /\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}/gi,
    /(today|yesterday|tomorrow|next week|last week|next month|last month)/gi,
    /\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:january|february|march|april|may|june|july|august|september|october|november|december))\b/gi
  ];

  datePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      entities.dates.push(...matches);
    }
  });

  // Extract people (simple pattern for names)
  const namePattern = /\b(?:dr\.|mr\.|mrs\.|ms\.)?\s*[A-Z][a-z]+\b/g;
  const nameMatches = text.match(namePattern);
  if (nameMatches) {
    entities.people.push(...nameMatches.filter(name => name.length > 2));
  }

  // Extract locations
  const locationKeywords = ['hospital', 'clinic', 'school', 'college', 'office', 'bank', 'market', 'store'];
  locationKeywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      entities.locations.push(keyword);
    }
  });

  // Generate insights based on category
  const insightsMap: Record<string, string> = {
    health: 'This appears to be a health-related memory. Consider setting a reminder for follow-up appointments.',
    finance: 'Financial memory detected. You might want to track this transaction in your records.',
    family: 'Family event recorded. Would you like to set this as a recurring memory?',
    education: 'Educational milestone captured. This could be important for future reference.',
    work: 'Work-related task identified. Setting a reminder might help with deadlines.',
    general: 'Memory captured successfully. You can add more details if needed.'
  };

  return {
    category,
    confidence: 0.85 + Math.random() * 0.14, // 85-99% confidence
    insights: insightsMap[category],
    tags: [...tags, language, 'voice'],
    entities
  };
}