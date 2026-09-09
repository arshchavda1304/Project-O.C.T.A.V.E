import { Language } from './types';
import { translations } from './translations';
import { speakText as fallbackSpeakText, stopSpeech as fallbackStopSpeech } from './speech';

export type TtsPlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused';

export interface TtsState {
  status: TtsPlaybackStatus;
  currentText: string;
  language: Language;
  provider: 'Edge TTS' | 'Bhashini' | 'Web Speech' | 'Offline Synthesizer';
  voiceCode?: string;
  audioDuration?: number;
  currentTime?: number;
}

export interface TtsOptions {
  onStart?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

// Edge TTS supported languages
const EDGE_TTS_LANGUAGES: Language[] = ['as', 'en', 'trp'];

// Edge TTS Voice Mapping
export const EDGE_VOICE_MAP: Record<string, string> = {
  as: 'as-IN-YashicaNeural',
  en: 'en-IN-NeerjaNeural',
  trp: 'bn-IN-TanishaaNeural',
  hi: 'hi-IN-SwaraNeural',
};

// Bhashini Target Languages
export const BHASHINI_LANGUAGES: string[] = ['mni', 'brx', 'lus', 'nag'];

// Resolve backend URL
const TTS_SERVER_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_TTS_SERVER_URL || 'http://localhost:5005';

class TtsManager {
  private state: TtsState = {
    status: 'idle',
    currentText: '',
    language: 'en',
    provider: 'Edge TTS',
  };

  private listeners = new Set<(state: TtsState) => void>();
  private audioElement: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;
  private activeOptions?: TtsOptions;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  public getState(): TtsState {
    return { ...this.state };
  }

  public subscribe(callback: (state: TtsState) => void): () => void {
    this.listeners.add(callback);
    callback(this.getState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((cb) => {
      try {
        cb(currentState);
      } catch (err) {
        console.error('Error in TTS subscriber callback:', err);
      }
    });
  }

  /**
   * Determine TTS routing provider based on the selected language
   */
  public getRoutingProvider(lang: Language): { provider: 'Edge TTS' | 'Bhashini'; voiceCode: string } {
    if (EDGE_TTS_LANGUAGES.includes(lang)) {
      return {
        provider: 'Edge TTS',
        voiceCode: EDGE_VOICE_MAP[lang] || 'en-IN-NeerjaNeural',
      };
    }
    return {
      provider: 'Bhashini',
      voiceCode: lang,
    };
  }

  /**
   * Main Read Aloud function with dynamic routing & Web Audio API playback
   */
  public async playText(
    text: string,
    lang: Language,
    options?: TtsOptions
  ): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText) return;

    // If already playing this exact text, toggle pause/play
    if (this.state.currentText === cleanText && this.state.status === 'playing') {
      this.pause();
      return;
    }
    if (this.state.currentText === cleanText && this.state.status === 'paused') {
      this.resume();
      return;
    }

    // Stop existing audio first
    this.stop();
    this.activeOptions = options;

    const routing = this.getRoutingProvider(lang);

    this.state = {
      status: 'loading',
      currentText: cleanText,
      language: lang,
      provider: routing.provider,
      voiceCode: routing.voiceCode,
    };
    this.notify();
    options?.onStart?.();

    try {
      // Resume Web Audio context if suspended
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      // Call Python TTS routing server
      const response = await fetch(`${TTS_SERVER_URL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanText,
          language: lang,
          voice: routing.voiceCode,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS server responded with status ${response.status}`);
      }

      const contentType = response.headers.get('Content-Type') || '';
      const ttsProviderHeader = response.headers.get('X-TTS-Provider') || routing.provider;

      // Check if server returned raw audio stream (MPEG or WAV)
      if (contentType.includes('audio') || contentType.includes('octet-stream')) {
        const audioBlob = await response.blob();
        await this.playAudioBlob(audioBlob, ttsProviderHeader as 'Edge TTS' | 'Bhashini');
        return;
      }

      // Check if server returned fallback JSON
      const jsonResponse = await response.json();
      if (jsonResponse.fallback) {
        console.warn(`[TTS Service] Received fallback directive:`, jsonResponse.message || jsonResponse);
        this.fallbackToBrowserSpeech(cleanText, lang, options);
        return;
      }

      throw new Error('Unexpected TTS response format');
    } catch (error) {
      console.warn('[TTS Service] Server call failed or offline, seamlessly using browser Web Speech API:', error);
      this.fallbackToBrowserSpeech(cleanText, lang, options);
    }
  }

  /**
   * Play audio blob using HTML5 Audio & Web Audio API
   */
  private async playAudioBlob(
    blob: Blob,
    provider: 'Edge TTS' | 'Bhashini'
  ): Promise<void> {
    this.cleanupAudio();

    this.currentObjectUrl = URL.createObjectURL(blob);
    this.audioElement = new Audio(this.currentObjectUrl);

    this.audioElement.onplay = () => {
      this.state.status = 'playing';
      this.state.provider = provider;
      this.notify();
      this.activeOptions?.onPlay?.();
    };

    this.audioElement.onpause = () => {
      if (this.state.status === 'playing') {
        this.state.status = 'paused';
        this.notify();
        this.activeOptions?.onPause?.();
      }
    };

    this.audioElement.onended = () => {
      this.cleanupAudio();
      this.state.status = 'idle';
      this.state.currentText = '';
      this.notify();
      this.activeOptions?.onEnd?.();
    };

    this.audioElement.onerror = () => {
      console.error('[TTS Service] Audio element playback error');
      this.cleanupAudio();
      this.state.status = 'idle';
      this.notify();
      this.activeOptions?.onError?.(new Error('Audio playback failed'));
    };

    try {
      await this.audioElement.play();
    } catch (err) {
      console.error('[TTS Service] Audio play call rejected:', err);
      this.cleanupAudio();
      this.state.status = 'idle';
      this.notify();
      this.activeOptions?.onError?.(err);
    }
  }

  /**
   * Resilient fallback to browser SpeechSynthesis / Web Audio
   */
  private fallbackToBrowserSpeech(
    text: string,
    lang: Language,
    options?: TtsOptions
  ) {
    this.cleanupAudio();
    this.state.status = 'playing';
    this.state.provider = 'Web Speech';
    this.notify();
    options?.onPlay?.();

    fallbackSpeakText(
      text,
      lang,
      () => {
        this.state.status = 'playing';
        this.notify();
      },
      () => {
        this.state.status = 'idle';
        this.state.currentText = '';
        this.notify();
        options?.onEnd?.();
      }
    );
  }

  /**
   * Pause current playback
   */
  public pause(): void {
    if (this.audioElement && this.state.status === 'playing') {
      this.audioElement.pause();
      this.state.status = 'paused';
      this.notify();
      this.activeOptions?.onPause?.();
    } else if (this.state.provider === 'Web Speech' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.state.status = 'paused';
      this.notify();
      this.activeOptions?.onPause?.();
    }
  }

  /**
   * Resume paused playback
   */
  public resume(): void {
    if (this.audioElement && this.state.status === 'paused') {
      this.audioElement.play().catch(console.error);
      this.state.status = 'playing';
      this.notify();
      this.activeOptions?.onPlay?.();
    } else if (this.state.provider === 'Web Speech' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.state.status = 'playing';
      this.notify();
      this.activeOptions?.onPlay?.();
    }
  }

  /**
   * Stop current playback completely
   */
  public stop(): void {
    this.cleanupAudio();
    fallbackStopSpeech();
    this.state.status = 'idle';
    this.state.currentText = '';
    this.notify();
    this.activeOptions?.onStop?.();
  }

  private cleanupAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }
}

// Global Singleton Instance
export const ttsManager = new TtsManager();

/**
 * Convenience helper to extract translated text by key or use provided string
 */
export const extractTranslatedText = (
  textOrKey: string,
  lang: Language
): string => {
  const dict = translations[lang] as unknown as Record<string, string>;
  if (textOrKey in dict && typeof dict[textOrKey] === 'string') {
    return dict[textOrKey];
  }
  return textOrKey;
};
