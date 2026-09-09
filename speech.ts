import { Language } from './types';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let audioCtx: AudioContext | null = null;

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
  lang: Language,
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

  // Language mapping
  const langCodes: Record<Language, string[]> = {
    en: ['en-IN', 'en-GB', 'en-US'],
    as: ['as-IN', 'bn-IN', 'hi-IN', 'en-IN'],
    mni: ['mni-IN', 'bn-IN', 'hi-IN', 'en-IN'],
    trp: ['bn-IN', 'hi-IN', 'en-IN'],
    nag: ['en-IN', 'hi-IN', 'en-GB'],
  };

  const candidateCodes = langCodes[lang] || ['en-IN'];
  const voices = window.speechSynthesis.getVoices();

  let matchedVoice = null;
  for (const code of candidateCodes) {
    matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(code.toLowerCase().slice(0, 2)));
    if (matchedVoice) break;
  }

  if (matchedVoice) {
    utterance.voice = matchedVoice;
    utterance.lang = matchedVoice.lang;
  } else {
    utterance.lang = candidateCodes[0];
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
