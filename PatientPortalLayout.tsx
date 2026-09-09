import React from 'react';
import { Language, Patient, FamilyPhotoItem, UserAccount } from './types';
import { translations } from './translations';
import {
  Gamepad2,
  Volume2,
  LogOut,
  Globe,
  Sparkles,
  Heart,
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

  const handleSpeakWelcome = () => {
    speakText(
      `Welcome, ${currentPatient.name}. Take your time with today's calm memory exercises. There is no rush.`,
      language
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col animate-fade-in">
      {/* Role Toggle Bar with Auth Bypass (Demo / Quick Access) */}
      {onSwitchRole && (
        <RoleToggleBar
          currentRole={currentUser.role}
          onSwitchRole={onSwitchRole}
        />
      )}

      {/* 1. DEDICATED ELDER-FRIENDLY HEADER */}
      <header className="bg-[#143E2B] text-white border-b-4 border-[#1E5D40] shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Elder Personalized Greeting */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-inner border-2 border-emerald-300">
                স্মৃ
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  Welcome, {currentPatient.name.split(' ')[0]}!
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 font-medium">
                  {currentPatient.location} • O.C.T.A.V.E. Care Portal
                </p>
              </div>
            </div>

            {/* Read aloud greeting */}
            <button
              type="button"
              id="btn-patient-speak-welcome"
              onClick={handleSpeakWelcome}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 shadow cursor-pointer transition-transform active:scale-95"
              title="Listen Aloud"
              aria-label="Listen Aloud"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          {/* Right Controls: Text Scaler, Language, Simple Exit Button */}
          <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
            {/* Text Sizing */}
            <div className="flex items-center bg-[#0C261B] rounded-xl p-1 border border-emerald-600/40">
              <span className="text-xs text-emerald-300 px-2 font-bold">Text:</span>
              <button
                type="button"
                onClick={() => onTextSizeChange('normal')}
                className={`px-3 py-1 text-sm font-bold rounded-lg transition-all ${
                  textSize === 'normal' ? 'bg-emerald-500 text-slate-950' : 'text-emerald-200'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onTextSizeChange('large')}
                className={`px-3 py-1 text-base font-bold rounded-lg transition-all ${
                  textSize === 'large' ? 'bg-emerald-500 text-slate-950' : 'text-emerald-200'
                }`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => onTextSizeChange('extralarge')}
                className={`px-3 py-1 text-lg font-bold rounded-lg transition-all ${
                  textSize === 'extralarge' ? 'bg-emerald-500 text-slate-950' : 'text-emerald-200'
                }`}
              >
                A++
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-[#0C261B] rounded-xl px-3 py-1.5 border border-emerald-500/50 text-xs font-bold text-white">
              <Globe className="w-4 h-4 text-emerald-300 mr-2 shrink-0" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-white font-bold cursor-pointer pr-1 focus:outline-none"
              >
                <option value="en" className="bg-[#0C261B] text-white">English</option>
                <option value="as" className="bg-[#0C261B] text-white">অসমীয়া</option>
                <option value="mni" className="bg-[#0C261B] text-white">মৈতৈলোন্</option>
                <option value="trp" className="bg-[#0C261B] text-white">ককবরক</option>
                <option value="nag" className="bg-[#0C261B] text-white">Nagamese</option>
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
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow border-2 border-amber-300 cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" />
              <span>Exit / Sign Out</span>
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
      <footer className="bg-[#143E2B] text-emerald-200 py-4 px-4 border-t-2 border-[#1E5D40] text-center text-xs font-semibold">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-emerald-400" />
          <span>Every memory is precious. Take your time, rest whenever you wish.</span>
        </div>
      </footer>
      
      {/* Voice Control Accessibility Layer */}
      <VoiceControlLayer />
    </div>
  );
};
