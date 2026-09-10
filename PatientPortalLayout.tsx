import React, { useState, useRef, useEffect } from 'react';
import { Language, Patient, FamilyPhotoItem, UserAccount } from './types';
import { translations } from './translations';
import {
  Gamepad2,
  Volume2,
  LogOut,
  Globe,
  Sparkles,
  Heart,
  Music,
} from 'lucide-react';
import { PatientPortal } from './PatientPortal';
import { speakText, stopSpeech } from './speech';
import { VoiceControlLayer } from './VoiceControlLayer';

import { RoleToggleBar } from './RoleToggleBar';

interface PatientPortalLayoutProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  textSize: 'normal' | 'large' | 'extralarge';
  onTextSizeChange: (size: 'normal' | 'large' | 'extralarge') => void;
  currentUser: UserAccount;
  currentPatient: Patient;
  familyPhotos: FamilyPhotoItem[];
  onGameActivityCompleted: (moduleName: string) => void;
  onSignOut: () => void;
  onSwitchRole?: (newUser: UserAccount) => void;
}

export const PatientPortalLayout: React.FC<PatientPortalLayoutProps> = ({
  language,
  onLanguageChange,
  textSize,
  onTextSizeChange,
  currentUser,
  currentPatient,
  familyPhotos,
  onGameActivityCompleted,
  onSignOut,
  onSwitchRole,
}) => {
  const t = translations[language];

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showVolumeWarning, setShowVolumeWarning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        // Ensure volume cap
        if (audioRef.current.volume > 0.5) {
          audioRef.current.volume = 0.5;
        }
        audioRef.current.play().catch(err => console.log('Audio playback failed', err));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  useEffect(() => {
    const handleVolumeChange = () => {
      if (audioRef.current && audioRef.current.volume > 0.5) {
        audioRef.current.volume = 0.5;
        setShowVolumeWarning(true);
      }
    };
    
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.addEventListener('volumechange', handleVolumeChange);
    }
    
    return () => {
      if (audioEl) {
        audioEl.removeEventListener('volumechange', handleVolumeChange);
      }
    };
  }, []);

  const handleSpeakWelcome = () => {
    speakText(
      `Welcome, ${currentPatient.name}. Take your time with today's calm memory exercises. There is no rush.`,
      language
    );
  };

  const currentHour = new Date().getHours();
  let greetingText = "Good morning ☀️";
  if (currentHour >= 12 && currentHour < 17) {
    greetingText = "Good afternoon 🌤️";
  } else if (currentHour >= 17) {
    greetingText = "Good evening 🌙";
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 flex flex-col">
      {/* Role Toggle Bar with Auth Bypass (Demo / Quick Access) */}
      {onSwitchRole && (
        <RoleToggleBar
          currentRole={currentUser.role}
          onSwitchRole={onSwitchRole}
        />
      )}

      {/* 1. DEDICATED ELDER-FRIENDLY HEADER */}
      <header className="bg-[#fdfbf7] text-slate-900 border-b-[4px] border-amber-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Elder Personalized Greeting */}
          <div className="flex flex-col gap-4 w-full md:w-auto text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 flex items-center justify-center md:justify-start gap-4">
              {greetingText}, {currentPatient.name.split(' ')[0]}
            </h1>
            <p className="text-2xl sm:text-3xl text-slate-600 font-medium">
              Today is {todayName}. It is so nice to see you. What would you like to do today?
            </p>
          </div>

          {/* Right Controls: Text Scaler, Language, Simple Exit Button */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 w-full md:w-auto">
            {/* Text Sizing */}
            <div className="flex items-center bg-white rounded-full p-2 border-[4px] border-amber-100">
              <span className="text-xl text-slate-900 px-4 font-semibold">Text size:</span>
              <button
                type="button"
                onClick={() => onTextSizeChange('normal')}
                className={`px-6 py-3 text-xl font-semibold rounded-full transition-all ${
                  textSize === 'normal' ? 'bg-amber-200 text-slate-900' : 'text-slate-900 hover:bg-amber-50'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onTextSizeChange('large')}
                className={`px-6 py-3 text-2xl font-semibold rounded-full transition-all ${
                  textSize === 'large' ? 'bg-amber-200 text-slate-900' : 'text-slate-900 hover:bg-amber-50'
                }`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => onTextSizeChange('extralarge')}
                className={`px-6 py-3 text-3xl font-semibold rounded-full transition-all ${
                  textSize === 'extralarge' ? 'bg-amber-200 text-slate-900' : 'text-slate-900 hover:bg-amber-50'
                }`}
              >
                A++
              </button>
            </div>

            {/* Music Toggle */}
            <button
              type="button"
              onClick={toggleMusic}
              className={`flex items-center gap-3 px-8 py-4 rounded-full border-[4px] border-amber-200 text-2xl font-semibold transition-all cursor-pointer ${
                isMusicPlaying ? 'bg-amber-200 text-slate-900' : 'bg-white text-slate-900'
              }`}
              title="Turn Music On / Off"
            >
              <Music className="w-8 h-8 shrink-0 text-amber-700" />
              <span>Music</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-white rounded-full px-6 py-4 border-[4px] border-amber-200 text-2xl font-semibold text-slate-900">
              <Globe className="w-8 h-8 text-amber-700 mr-3 shrink-0" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-slate-900 font-semibold cursor-pointer pr-2 focus:outline-none"
              >
                <option value="en" className="bg-white text-slate-900">English</option>
                <option value="as" className="bg-white text-slate-900">অসমীয়া</option>
                <option value="mni" className="bg-white text-slate-900">মৈতৈলোন্</option>
                <option value="trp" className="bg-white text-slate-900">ককবরক</option>
                <option value="nag" className="bg-white text-slate-900">Nagamese</option>
              </select>
            </div>

            {/* Log Out / Exit */}
            <button
              type="button"
              id="btn-patient-sign-out"
              onClick={() => {
                stopSpeech();
                onSignOut();
              }}
              className="px-8 py-4 rounded-full bg-rose-50 hover:bg-rose-100 text-slate-900 font-semibold text-2xl flex items-center gap-3 border-[4px] border-rose-200 cursor-pointer active:scale-95"
            >
              <Heart className="w-8 h-8 text-rose-600" />
              <span>I am finished for now</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. PURE ELDER MEMORY GAMES CONTENT */}
      <main className="flex-1 pb-16">
        <PatientPortal
          language={language}
          patient={currentPatient}
          familyPhotos={familyPhotos}
          onGameActivityCompleted={onGameActivityCompleted}
        />
      </main>

      {/* Reassuring Calm Footer */}
      <footer className="bg-amber-50 text-slate-900 py-8 px-6 border-t-[4px] border-amber-100 text-center text-2xl font-medium">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <Heart className="w-6 h-6 text-rose-500" />
          <span>Take your time today. We are so glad you are here.</span>
        </div>
      </footer>
      
      {/* Voice Control Accessibility Layer */}
      <VoiceControlLayer />

      {/* Background Audio */}
      <audio ref={audioRef} src="/audio 2.wav" loop />

      {/* Safety Pop-Up Modal */}
      {showVolumeWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#E3F2FD] rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-scale-in text-center border-4 border-[#BBDEFB]">
            <h2 className="text-2xl font-black text-[#1565C0] mb-4 flex items-center justify-center gap-2">
              <Volume2 className="w-8 h-8" />
              Volume Adjusted
            </h2>
            <p className="text-[#0D47A1] text-lg font-semibold mb-8">
              Volume was a bit too loud! We safely reduced it to a comfortable level for you.
            </p>
            <button
              onClick={() => setShowVolumeWarning(false)}
              className="bg-[#1976D2] hover:bg-[#1565C0] active:scale-95 transition-all text-white font-black text-xl px-8 py-3 rounded-2xl shadow-lg cursor-pointer w-full"
            >
              Okay, thank you
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
