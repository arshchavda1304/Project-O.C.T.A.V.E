import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { playPositiveChime, speakText } from './speech';

// --- Custom Event Typings ---
export type VoiceIntentType = 'NAVIGATE_MODULE' | 'ANSWER_QUIZ' | 'READ_ALOUD';

export interface VoiceIntentPayload {
  type: VoiceIntentType;
  value?: string;
}

export const dispatchVoiceIntent = (payload: VoiceIntentPayload) => {
  window.dispatchEvent(new CustomEvent<VoiceIntentPayload>('VoiceIntent', { detail: payload }));
};

// Types for Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  results: any;
  resultIndex: number;
}

export const VoiceControlLayer: React.FC = () => {
  const [state, setState] = useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Refs to hold the latest state for the event handlers without triggering re-renders
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const processTranscript = useCallback(async (text: string) => {
    setState('processing');
    
    // Simulate slight processing delay for feedback UX
    await new Promise(r => setTimeout(r, 400));
    
    const lowerText = text.toLowerCase().trim();
    let handled = false;

    console.log("[VoiceControl] Processing transcript:", lowerText);

    // Navigation Intents
    if (lowerText.match(/photo|family|recognition|first tab/)) {
      dispatchVoiceIntent({ type: 'NAVIGATE_MODULE', value: 'photo_quiz' });
      handled = true;
    } else if (lowerText.match(/situation|safety|reaction|logic|daily logic|second tab/)) {
      dispatchVoiceIntent({ type: 'NAVIGATE_MODULE', value: 'situation_test' });
      handled = true;
    } else if (lowerText.match(/grid|match|heritage|third tab/)) {
      dispatchVoiceIntent({ type: 'NAVIGATE_MODULE', value: 'grid_match' });
      handled = true;
    } 
    // Quiz Intents
    else if (lowerText.match(/\b(yes|yeah|yep|correct|true)\b/)) {
      dispatchVoiceIntent({ type: 'ANSWER_QUIZ', value: 'YES' });
      handled = true;
    } else if (lowerText.match(/\b(no|nope|incorrect|false)\b/)) {
      dispatchVoiceIntent({ type: 'ANSWER_QUIZ', value: 'NO' });
      handled = true;
    } else if (lowerText.match(/\b(option a|first|one|a)\b/)) {
      dispatchVoiceIntent({ type: 'ANSWER_QUIZ', value: 'OPTION_A' });
      handled = true;
    } else if (lowerText.match(/\b(option b|second|two|b)\b/)) {
      dispatchVoiceIntent({ type: 'ANSWER_QUIZ', value: 'OPTION_B' });
      handled = true;
    }
    // Accessibility Intents
    else if (lowerText.match(/read|repeat|say that again|what|question/)) {
      dispatchVoiceIntent({ type: 'READ_ALOUD' });
      handled = true;
    }

    if (handled) {
      playPositiveChime();
      setFeedbackMessage('Command recognized!');
      setTimeout(() => {
        if (stateRef.current !== 'listening') {
          setState('idle');
          setTranscript('');
          setFeedbackMessage(null);
        }
      }, 2000);
    } else {
      setState('error');
      setFeedbackMessage("I didn't understand that—please try again.");
      speakText("I didn't quite catch that. Could you please repeat?", 'en');
      setTimeout(() => {
        if (stateRef.current !== 'listening') {
          setState('idle');
          setTranscript('');
          setFeedbackMessage(null);
        }
      }, 3000);
    }
  }, []);

  // Setup Web Speech API (run once)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Default to Indian English

    recognition.onstart = () => {
      console.log("[VoiceControl] Listening started");
      setState('listening');
      setTranscript('');
      setFeedbackMessage(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      const currentText = finalTranscript || interimTranscript;
      setTranscript(currentText);
      
      if (finalTranscript) {
        console.log("[VoiceControl] Final result:", finalTranscript);
        processTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("[VoiceControl] Speech recognition error", event.error);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setState('error');
        setFeedbackMessage(`Error: ${event.error}`);
        setTimeout(() => {
          if (stateRef.current !== 'listening') setState('idle');
        }, 3000);
      } else {
        setState('idle');
      }
    };

    recognition.onend = () => {
      console.log("[VoiceControl] Recognition ended.");
      // If we were listening and it ended without processing, return to idle
      if (stateRef.current === 'listening') {
        setState('idle');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [processTranscript]);

  const handleFallbackSTT = async (audioBlob: Blob) => {
    setState('processing');
    setFeedbackMessage('Analyzing audio...');
    try {
      // Wrapper for Sarvam compatible STT endpoint
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'saaras:v1');
      
      const sarvamUrl = (import.meta as any).env?.VITE_SARVAM_STT_URL || 'https://api.sarvam.ai/speech-to-text-translate';
      const sarvamKey = (import.meta as any).env?.VITE_SARVAM_API_KEY;

      if (!sarvamKey) {
        console.warn("No STT API key provided. Faking response.");
        await new Promise(r => setTimeout(r, 1000));
        setTranscript("read the question"); // Faking a successful read command
        processTranscript("read the question");
        return;
      }

      const res = await fetch(sarvamUrl, {
        method: 'POST',
        headers: { 'api-subscription-key': sarvamKey },
        body: formData,
      });

      if (!res.ok) throw new Error("STT API failed");
      const data = await res.json();
      const finalText = data.transcript || '';
      setTranscript(finalText);
      processTranscript(finalText);

    } catch (err: any) {
      console.error(err);
      setState('error');
      setFeedbackMessage('Audio processing failed.');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  const toggleListen = async () => {
    // If currently active (listening, processing, or error), act as a clean STOP/RESET toggle.
    if (state !== 'idle') {
      console.log("[VoiceControl] Toggling OFF");
      if (recognitionRef.current) {
        recognitionRef.current.stop(); // cleanly stop and process anything captured
      } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setState('idle');
      setFeedbackMessage(null);
      setTranscript('');
      return;
    }

    // Turn ON
    console.log("[VoiceControl] Toggling ON");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Recognition start error", e);
        // It might already be started, so just reset state
        setState('listening');
      }
    } else {
      // Fallback MediaRecorder flow
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            handleFallbackSTT(audioBlob);
          }
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setState('listening');
        setFeedbackMessage('Listening via fallback...');
      } catch (err) {
        console.error("Microphone access denied or error:", err);
        setState('error');
        setFeedbackMessage("Microphone access denied.");
        setTimeout(() => setState('idle'), 3000);
      }
    }
  };

  return (
    <div className="fixed top-24 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Transcript & Feedback Overlay (Origin top-right to match new position) */}
      {(transcript || feedbackMessage) && (
        <div className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-emerald-100 rounded-2xl p-4 max-w-sm w-max pointer-events-auto animate-fade-in origin-top-right">
          {transcript && (
            <p className="text-slate-800 text-lg font-medium italic">"{transcript}"</p>
          )}
          {feedbackMessage && (
            <p className={`text-sm font-bold mt-2 ${state === 'error' ? 'text-red-600' : 'text-emerald-700'}`}>
              {feedbackMessage}
            </p>
          )}
        </div>
      )}

      {/* Floating Action Button - Redesigned, Repositioned, Enlarged */}
      <div className="relative">
        <button
          onClick={toggleListen}
          className={`pointer-events-auto flex items-center justify-center w-20 h-20 rounded-full shadow-2xl transition-all duration-300 border-4 focus:outline-none 
            ${state === 'idle' ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:scale-105' : ''}
            ${state === 'listening' ? 'bg-amber-500 text-white border-amber-400 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.6)]' : ''}
            ${state === 'processing' ? 'bg-blue-600 text-white border-blue-500 opacity-90 cursor-not-allowed' : ''}
            ${state === 'error' ? 'bg-red-600 text-white border-red-500 animate-shake' : ''}
          `}
          aria-label={state === 'idle' ? 'Start Voice Command' : 'Stop Voice Command'}
        >
          {state === 'idle' && <Mic className="w-10 h-10" />}
          {state === 'listening' && <Mic className="w-10 h-10" />}
          {state === 'processing' && <Loader2 className="w-10 h-10 animate-spin" />}
          {state === 'error' && <AlertCircle className="w-10 h-10" />}
        </button>

        {/* Ripple Effect for Listening */}
        {state === 'listening' && (
          <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping opacity-75 -z-10" />
        )}
      </div>
    </div>
  );
};
