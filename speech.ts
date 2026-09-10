import { Language } from './types';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let audioCtx: AudioContext | null = null;

// Force early loading of voices so they are available immediately
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

export const playPositiveChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Gentle melodic chord C5 -> G5
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch {
    // Audio context not allowed before user gesture or unavailable
  }
};

export const playEncourageChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(523.25, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch {
    // Audio context safe fallback
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const speakText = (
  text: string,
  lang: string, // Accepting dynamically detected language codes
  onStart?: () => void,
  onEnd?: () => void
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onStart?.();
    setTimeout(() => {
      onEnd?.();
    }, 1500);
    return;
  }

  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance;

  // Elderly-friendly rate and pitch for optimal intelligibility and calm pacing
  utterance.rate = 0.85;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const normalizedLang = lang.split('-')[0].toLowerCase();
  
  // Requirement 3: Edge TTS Voice Mapping
  const edgeVoiceMap: Record<string, string> = {
    'en': 'en-IN-NeerjaNeural',
    'hi': 'hi-IN-SwaraNeural',
    'bn': 'bn-IN-TanishaaNeural',
    'ne': 'ne-NP-HemkalaNeural'
  };

  let matchedVoice = null;
  
  // 1. Try to find exact Edge TTS Neural Voices first (Requirement 3)
  if (edgeVoiceMap[normalizedLang]) {
    matchedVoice = voices.find(v => v.name.includes(edgeVoiceMap[normalizedLang]));
  } else if (normalizedLang === 'as' || normalizedLang === 'mni') {
    matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(normalizedLang) && v.name.includes('Neural'));
  }
  
  // 2. Global Fallback: Prioritize Web Voices (!localService) first!
  if (!matchedVoice) {
    // Try to find a Web Voice for the exact language first
    matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(normalizedLang) && !v.localService) ||
                   // Then any local voice for the exact language
                   voices.find(v => v.lang.toLowerCase().startsWith(normalizedLang));
  }
  
  // 3. Indic Fallback: If the specific regional language is missing entirely,
  // walk down a robust Indic fallback chain, always preferring Web Voices.
  if (!matchedVoice) {
    const fallbackChain = ['hi-in', 'hi', 'bn-in', 'bn', 'en-in', 'en'];
    for (const fallback of fallbackChain) {
      matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(fallback) && !v.localService) ||
                     voices.find(v => v.lang.toLowerCase().startsWith(fallback));
      if (matchedVoice) break;
    }
  }

  // 4. Final safety fallback
  if (!matchedVoice && voices.length > 0) {
    matchedVoice = voices[0];
  }

  if (matchedVoice) {
    utterance.voice = matchedVoice;
    utterance.lang = matchedVoice.lang; // Force the browser engine to align with the chosen voice
  } else {
    utterance.lang = lang; // Best effort if voices array is completely empty
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    if (currentUtterance === utterance) {
      currentUtterance = null;
      onEnd?.();
    }
  };

  utterance.onerror = () => {
    if (currentUtterance === utterance) {
      currentUtterance = null;
      onEnd?.();
    }
  };

  window.speechSynthesis.speak(utterance);
};
