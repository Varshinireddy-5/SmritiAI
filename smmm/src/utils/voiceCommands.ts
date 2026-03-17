export interface VoiceCommandResponse {
  response: string;
  route?: string;
  action?: string;
}

export function getVoiceCommandResponse(spokenText: string): VoiceCommandResponse {
  const text = spokenText.toLowerCase().trim();
  
  console.log('Processing voice command:', text);

  // Navigation commands
  if (text.includes('go to') || text.includes('navigate to') || text.includes('open')) {
    if (text.includes('health') || text.includes('medical')) {
      return {
        response: 'Navigating to health memories',
        route: '/health'
      };
    }
    if (text.includes('memories') || text.includes('memory')) {
      return {
        response: 'Opening all memories',
        route: '/memories'
      };
    }
    if (text.includes('voice') || text.includes('record')) {
      return {
        response: 'Opening voice capture',
        route: '/voice'
      };
    }
    if (text.includes('home') || text.includes('dashboard')) {
      return {
        response: 'Going to home dashboard',
        route: '/'
      };
    }
  }

  // Action commands
  if (text.includes('new memory') || text.includes('record memory') || text.includes('voice note')) {
    return {
      response: 'Starting new voice memory recording',
      action: 'start_recording'
    };
  }

  if (text.includes('what time') || text.includes('current time')) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      response: `The current time is ${timeString}`
    };
  }

  if (text.includes('date') || text.includes('today\'s date')) {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return {
      response: `Today is ${dateString}`
    };
  }

  if (text.includes('help') || text.includes('what can you do')) {
    return {
      response: 'I can help you navigate to health, memories, or voice capture. I can also record new memories, tell you the time and date. Try saying "Go to health" or "What time is it?"'
    };
  }

  // Default response
  return {
    response: 'I heard you say: ' + spokenText + '. You can try commands like "Go to health" or "New memory"'
  };
}