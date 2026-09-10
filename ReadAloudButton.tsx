import React, { useEffect, useState } from 'react';
import { Volume2, Pause, Play, Loader2, VolumeX } from 'lucide-react';
import { Language } from './types';
import { translations } from './translations';
import { ttsManager, TtsState, extractTranslatedText } from './ttsService';

interface ReadAloudButtonProps {
  text: string;
  language: Language;
  label?: string;
  variant?: 'icon-only' | 'pill' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({
  text,
  language,
  label,
  variant = 'icon-only',
  size = 'md',
  className = '',
  id,
}) => {
  const [ttsState, setTtsState] = useState<TtsState>(ttsManager.getState());
  const t = translations[language];

  useEffect(() => {
    const unsubscribe = ttsManager.subscribe((newState) => {
      setTtsState(newState);
    });
    return unsubscribe;
  }, []);

  // Step 1: Extract already translated text displayed on screen
  const resolvedText = extractTranslatedText(text, language);

  const isCurrentText = ttsState.currentText === resolvedText.trim();
  const isPlaying = isCurrentText && ttsState.status === 'playing';
  const isPaused = isCurrentText && ttsState.status === 'paused';
  const isLoading = isCurrentText && ttsState.status === 'loading';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!resolvedText || resolvedText.trim() === '') {
      console.warn("ReadAloud aborted: Text payload is empty.");
      return; 
    }

    if (isPlaying) {
      ttsManager.pause();
    } else if (isPaused) {
      ttsManager.resume();
    } else {
      ttsManager.playText(resolvedText, language);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ttsManager.stop();
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconSizeClass = iconSizes[size];

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <button
          type="button"
          id={id || `btn-read-aloud-${resolvedText.slice(0, 10).replace(/\s+/g, '-')}`}
          onClick={handleClick}
          aria-label={
            isPlaying
              ? t.audioPause || 'Pause Audio'
              : isPaused
              ? t.audioResume || 'Resume Audio'
              : t.audioSpeak || 'Read Aloud'
          }
          className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all cursor-pointer shadow-sm ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 ring-2 ring-amber-300'
              : isPaused
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
              : isLoading
              ? 'bg-slate-100 text-slate-600 border-slate-300 animate-pulse'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 active:scale-95'
          }`}
          title={
            isPlaying
              ? 'Click to Pause'
              : isPaused
              ? 'Click to Resume'
              : `Read Aloud (${ttsManager.getRoutingProvider(language).provider})`
          }
        >
          {isLoading ? (
            <Loader2 className={`${iconSizeClass} animate-spin`} />
          ) : isPlaying ? (
            <>
              <Pause className={`${iconSizeClass} fill-current`} />
              {/* Animated Wave Bars */}
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce" />
              </span>
            </>
          ) : isPaused ? (
            <Play className={`${iconSizeClass} fill-current`} />
          ) : (
            <Volume2 className={`${iconSizeClass} stroke-[2.3]`} />
          )}

          <span>
            {isPlaying
              ? t.audioPause || 'Pause'
              : isPaused
              ? t.audioResume || 'Resume'
              : label || t.audioSpeak || 'Read Aloud'}
          </span>
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 cursor-pointer"
            title="Stop Audio"
            aria-label="Stop Audio"
          >
            <VolumeX className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // Icon-only or compact variant
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        id={id || `btn-read-aloud-${resolvedText.slice(0, 10).replace(/\s+/g, '-')}`}
        onClick={handleClick}
        aria-label={
          isPlaying
            ? t.audioPause || 'Pause Audio'
            : isPaused
            ? t.audioResume || 'Resume Audio'
            : t.audioSpeak || 'Read Aloud'
        }
        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isPlaying
            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 ring-2 ring-amber-300 shadow-md animate-pulse'
            : isPaused
            ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
            : isLoading
            ? 'bg-slate-100 text-slate-500 border-slate-300'
            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300/80 active:scale-90 shadow-sm'
        }`}
        title={
          isPlaying
            ? 'Pause Reading'
            : isPaused
            ? 'Resume Reading'
            : `Read Aloud (${ttsManager.getRoutingProvider(language).provider})`
        }
      >
        {isLoading ? (
          <Loader2 className={`${iconSizeClass} animate-spin`} />
        ) : isPlaying ? (
          <Pause className={`${iconSizeClass} fill-current`} />
        ) : isPaused ? (
          <Play className={`${iconSizeClass} fill-current`} />
        ) : (
          <Volume2 className={`${iconSizeClass} stroke-[2.3]`} />
        )}
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={handleStop}
          className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 cursor-pointer shadow-sm"
          title="Stop Audio"
          aria-label="Stop Audio"
        >
          <VolumeX className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};
