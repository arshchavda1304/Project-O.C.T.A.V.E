import React, { useEffect, useState } from 'react';
import { Play, Pause, Square, Volume2, Sparkles, X } from 'lucide-react';
import { ttsManager, TtsState } from './ttsService';
import { translations } from './translations';
import { Language } from './types';

interface AudioControlsBarProps {
  language: Language;
}

export const AudioControlsBar: React.FC<AudioControlsBarProps> = ({ language }) => {
  const [state, setState] = useState<TtsState>(ttsManager.getState());
  const [dismissed, setDismissed] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const unsubscribe = ttsManager.subscribe((newState) => {
      setState(newState);
      if (newState.status === 'playing' || newState.status === 'loading') {
        setDismissed(false);
      }
    });
    return unsubscribe;
  }, []);

  if (state.status === 'idle' || dismissed) {
    return null;
  }

  const isPlaying = state.status === 'playing';
  const isPaused = state.status === 'paused';
  const isLoading = state.status === 'loading';

  return (
    <aside
      aria-label="Audio Playback Controller"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl bg-slate-900/95 backdrop-blur-md text-white px-4 sm:px-6 py-3.5 rounded-3xl shadow-2xl border-2 border-emerald-500/50 animate-fade-in flex items-center justify-between gap-3 sm:gap-4"
    >
      {/* Left info: Icon & text preview */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-2xl bg-emerald-700/80 border border-emerald-400/50 flex items-center justify-center shrink-0">
          <Volume2 className={`w-5 h-5 text-emerald-200 ${isPlaying ? 'animate-pulse' : ''}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{state.provider}</span>
            </span>

            {state.voiceCode && (
              <span className="text-[10px] text-slate-400 font-mono truncate hidden sm:inline">
                {state.voiceCode}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate" title={state.currentText}>
            {isLoading ? 'Buffering spoken audio...' : state.currentText}
          </p>
        </div>
      </div>

      {/* Center Wave Animation */}
      {isPlaying && (
        <div className="hidden sm:flex items-center gap-1 h-5 px-2">
          <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.4s] h-3" />
          <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.2s] h-5" />
          <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s] h-4" />
          <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.1s] h-5" />
          <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2" />
        </div>
      )}

      {/* Right controls: Play/Pause, Stop, Close */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Play/Pause Toggle */}
        <button
          type="button"
          onClick={() => {
            if (isPlaying) {
              ttsManager.pause();
            } else if (isPaused) {
              ttsManager.resume();
            }
          }}
          disabled={isLoading}
          className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
          title={isPlaying ? t.audioPause || 'Pause' : t.audioResume || 'Resume'}
          aria-label={isPlaying ? 'Pause' : 'Resume'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>

        {/* Stop Button */}
        <button
          type="button"
          onClick={() => ttsManager.stop()}
          className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
          title={t.audioStop || 'Stop'}
          aria-label="Stop playback"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>

        {/* Dismiss controller */}
        <button
          type="button"
          onClick={() => {
            ttsManager.stop();
            setDismissed(true);
          }}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          title="Dismiss"
          aria-label="Dismiss player"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
