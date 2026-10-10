export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  category?: 'fact' | 'launcher' | 'social' | 'gemini' | 'system' | 'memory';
  launcherAction?: {
    type: string;
    target?: string;
    url?: string;
    title: string;
  };
}

export interface UltronMemory {
  id: string;
  key: string;
  value: string;
  statement: string;
  category: 'preference' | 'personal' | 'fact' | 'directive';
  timestamp: string;
}

export interface VoiceSettings {
  pitch: number;      // 0.5 to 1.5, default 0.65 (deep robotic)
  rate: number;       // 0.7 to 1.3, default 0.90 (slow deliberate)
  volume: number;     // 0.0 to 1.0, default 1.0
  voiceURI: string;   // Selected voice URI
  autoSpeak: boolean; // Auto-speak responses
  wakeWordEnabled: boolean; // Continuous wake word listening
  soundEffects: boolean; // Cybernetic audio feedback
}

export interface CoreFact {
  id: number;
  domain: 'GEOGRAPHY' | 'CIVICS' | 'HISTORY' | 'SCIENCE' | 'MATHEMATICS' | 'GENERAL KNOWLEDGE' | 'PERSONALITY';
  input: string;
  output: string;
  keywords: string[];
  ultronResponse: string;
}

export type AssistantState = 'idle' | 'listening' | 'wake_detected' | 'processing' | 'speaking';
