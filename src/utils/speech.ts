export interface SpeechOptions {
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
  }
  
  export class SpeechService {
    // Fix 1: Mark as readonly since it's never reassigned
    private readonly synthesis: SpeechSynthesis;
    private currentUtterance: SpeechSynthesisUtterance | null = null;
    private isSpeakingCallback: ((speaking: boolean) => void) | null = null;
  
    constructor() {
    this.synthesis = window.speechSynthesis;
  }

  async requestPermission(): Promise<boolean> {
    try {
      if (!('speechSynthesis' in window)) {
        return false;
      }

      // Some browsers require user interaction before allowing speech
      if (document.visibilityState === 'visible') {
        // Try a short test utterance
        const test = new SpeechSynthesisUtterance('');
        test.volume = 0;
        this.synthesis.speak(test);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async speak(text: string, options: SpeechOptions = {}, onSpeakingChange?: (speaking: boolean) => void): Promise<void> {
    try {
      await this.requestPermission();

      if (this.currentUtterance) {
        this.synthesis.cancel();
      }

      this.isSpeakingCallback = onSpeakingChange || null;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      utterance.lang = options.lang || 'en-US';
  
        utterance.onstart = () => {
          this.isSpeakingCallback?.(true);
        };
  
        utterance.onend = () => {
          this.isSpeakingCallback?.(false);
          this.currentUtterance = null;
          resolve();
        };
  
        utterance.onerror = (event) => {
          this.isSpeakingCallback?.(false);
          this.currentUtterance = null;
          // Fix 2: Reject with an Error object instead of the event
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };
  
        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
      });
    }
  
    stop() {
      this.synthesis.cancel();
      this.isSpeakingCallback?.(false);
      this.currentUtterance = null;
    }
  
    pause() {
      this.synthesis.pause();
    }
  
    resume() {
      this.synthesis.resume();
    }
  
    isSpeaking(): boolean {
      return this.synthesis.speaking;
    }
  }
  
  export const speechService = new SpeechService();