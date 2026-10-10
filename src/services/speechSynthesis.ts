import { VoiceSettings } from '../types';

class UltronSpeechSynthesis {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  public isSpeaking: boolean = false;
  private onSpeakingChangeCallbacks: ((speaking: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public getPreferredVoice(uri?: string): SpeechSynthesisVoice | null {
    const list = this.getVoices();
    if (list.length === 0) return null;

    if (uri) {
      const match = list.find(v => v.voiceURI === uri);
      if (match) return match;
    }

    // Heuristics for deep / robotic / villainous voice:
    // 1. British / UK English male
    // 2. Deep male voices (David, Daniel, George, Guy, Oliver)
    // 3. Fallback to English
    const priorityKeywords = ['uk english male', 'david', 'daniel', 'male', 'george', 'guy', 'robot', 'en-gb'];
    for (const kw of priorityKeywords) {
      const found = list.find(v => v.name.toLowerCase().includes(kw) || v.lang.toLowerCase().includes(kw));
      if (found) return found;
    }

    const englishVoice = list.find(v => v.lang.startsWith('en'));
    return englishVoice || list[0];
  }

  public onSpeakingChange(cb: (speaking: boolean) => void) {
    this.onSpeakingChangeCallbacks.push(cb);
    return () => {
      this.onSpeakingChangeCallbacks = this.onSpeakingChangeCallbacks.filter(c => c !== cb);
    };
  }

  private setSpeaking(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onSpeakingChangeCallbacks.forEach(cb => cb(speaking));
  }

  public cleanTextForSpeech(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // remove markdown bold
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/•/g, ', ')             // pause between bullet points
      .replace(/#/g, '')
      .replace(/\[.*?\]/g, '')         // remove tags like [GEOGRAPHY]
      .replace(/https?:\/\/\S+/g, 'link')
      .trim();
  }

  public speak(
    text: string,
    settings: VoiceSettings,
    onEnd?: () => void
  ): boolean {
    if (!this.synth) return false;

    // Cancel any ongoing speech
    this.stop();

    const clean = this.cleanTextForSpeech(text);
    if (!clean) return false;

    const utterance = new SpeechSynthesisUtterance(clean);
    
    // Ultron voice tuning: deep pitch, controlled cadence
    utterance.pitch = Math.max(0.3, Math.min(2.0, settings.pitch));
    utterance.rate = Math.max(0.5, Math.min(2.0, settings.rate));
    utterance.volume = Math.max(0.0, Math.min(1.0, settings.volume));

    const voice = this.getPreferredVoice(settings.voiceURI);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.setSpeaking(true);
    };

    utterance.onend = () => {
      this.setSpeaking(false);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Ultron speech error:', e);
      this.setSpeaking(false);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.setSpeaking(false);
    this.currentUtterance = null;
  }
}

export const ultronSpeech = new UltronSpeechSynthesis();
