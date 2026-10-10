export interface RecognitionCallbacks {
  onWakeWordDetected: (transcript: string) => void;
  onCommandReceived: (command: string) => void;
  onInterimResult: (interim: string) => void;
  onStatusChange: (status: 'idle' | 'listening' | 'wake_detected' | 'error', errorMsg?: string) => void;
}

// Fix for Web Speech Recognition types in TypeScript
type SpeechRecognitionInstance = any;

class UltronSpeechRecognition {
  private recognition: SpeechRecognitionInstance | null = null;
  private isContinuousListening: boolean = false;
  private isUserRecording: boolean = false;
  private callbacks: RecognitionCallbacks | null = null;
  private isSupported: boolean = false;
  private restartTimeout: any = null;
  private wakeWordRegex = /\b(?:hey\s+ultron|ultron|ok\s+ultron|okay\s+ultron)\b/i;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.isSupported = true;
      }
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public init(callbacks: RecognitionCallbacks) {
    this.callbacks = callbacks;
    if (!this.isSupported) {
      callbacks.onStatusChange('error', 'Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      if (this.callbacks) {
        this.callbacks.onStatusChange(this.isUserRecording ? 'listening' : 'idle');
      }
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      const activeText = (final || interim).trim();
      if (!activeText) return;

      if (this.callbacks && interim) {
        this.callbacks.onInterimResult(interim);
      }

      // Check for wake word
      if (this.wakeWordRegex.test(activeText)) {
        // Strip wake word to extract command if any
        const commandAfterWake = activeText
          .replace(this.wakeWordRegex, '')
          .replace(/^[,.\s]+/, '')
          .trim();

        if (this.callbacks) {
          this.callbacks.onWakeWordDetected(activeText);
        }

        if (final && commandAfterWake.length > 1) {
          if (this.callbacks) {
            this.callbacks.onCommandReceived(commandAfterWake);
          }
        }
        return;
      }

      // If user is actively recording manual command
      if (this.isUserRecording && final) {
        if (this.callbacks) {
          this.callbacks.onCommandReceived(final.trim());
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Normal silence timeout in continuous listening
        return;
      }
      console.warn('Speech recognition status:', event.error);
      if (event.error === 'not-allowed') {
        if (this.callbacks) {
          this.callbacks.onStatusChange('error', 'Microphone access denied. Grant mic permission.');
        }
        this.isContinuousListening = false;
        this.isUserRecording = false;
      }
    };

    this.recognition.onend = () => {
      // Auto-restart if continuous wake word listening is turned on
      if (this.isContinuousListening) {
        clearTimeout(this.restartTimeout);
        this.restartTimeout = setTimeout(() => {
          this.safeStart();
        }, 300);
      } else {
        if (this.callbacks) {
          this.callbacks.onStatusChange('idle');
        }
      }
    };
  }

  private safeStart() {
    if (!this.recognition) return;
    try {
      this.recognition.start();
    } catch {
      // Already active or transition in progress
    }
  }

  public startWakeWordListening() {
    this.isContinuousListening = true;
    this.safeStart();
  }

  public stopWakeWordListening() {
    this.isContinuousListening = false;
    clearTimeout(this.restartTimeout);
    if (this.recognition && !this.isUserRecording) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  public startManualRecording() {
    this.isUserRecording = true;
    this.safeStart();
    if (this.callbacks) {
      this.callbacks.onStatusChange('listening');
    }
  }

  public stopManualRecording() {
    this.isUserRecording = false;
    if (!this.isContinuousListening && this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
    if (this.callbacks) {
      this.callbacks.onStatusChange('idle');
    }
  }

  public isRecording(): boolean {
    return this.isUserRecording;
  }
}

export const ultronSpeechRecognition = new UltronSpeechRecognition();
