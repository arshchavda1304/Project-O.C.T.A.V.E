import React, { useState, useEffect } from 'react';
import { Language, PortalType, UserRole } from './types';
import { translations } from './translations';
import {
  Volume2,
  VolumeX,
  Globe,
  ArrowLeft,
  Wifi,
  WifiOff,
  RefreshCw,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { stopSpeech } from './speech';

interface HeaderProps {
  currentPortal: PortalType;
  onSelectPortal: (portal: PortalType) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  textSize: 'normal' | 'large' | 'extralarge';
  onTextSizeChange: (size: 'normal' | 'large' | 'extralarge') => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  unsyncedCount: number;
  lastSyncMessage: string | null;
  activeRole?: UserRole | null;
  activeUserName?: string;
  onSwitchRole?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPortal,
  onSelectPortal,
  language,
  onLanguageChange,
  textSize,
  onTextSizeChange,
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  unsyncedCount,
  lastSyncMessage,
  activeRole,
  activeUserName,
  onSwitchRole,
}) => {
  const t = translations[language];
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const handleSpeechCheck = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setIsSpeaking(window.speechSynthesis.speaking);
      }
    };
    const interval = setInterval(handleSpeechCheck, 300);
    return () => clearInterval(interval);
  }, []);

  const handleStopAudio = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  return (
    <header id="app-main-header" className="bg-[#143E2B] text-white border-b-4 border-[#1E5D40] shadow-md sticky top-0 z-40">
      {/* Top emergency / sync notification bar if offline or recently synced */}
      <div className="bg-[#0C261B] px-4 py-2 border-b border-[#1E5D40]/50 text-xs sm:text-sm font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <Wifi className="w-3.5 h-3.5" />
              {t.onlineStatus}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <WifiOff className="w-3.5 h-3.5" />
              {t.offlineStatus} ({unsyncedCount} {t.changesPendingSync})
            </span>
          )}

          {lastSyncMessage && (
            <span className="text-emerald-300 font-medium hidden md:inline">
              ✓ {lastSyncMessage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-offline-simulation"
            onClick={onToggleSimulatedOffline}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-[#1C4D37] hover:bg-[#256346] text-emerald-100 border border-emerald-600/40 transition-colors flex items-center gap-1 cursor-pointer"
            title="Test offline-first synchronization"
          >
            <RefreshCw className="w-3 h-3" />
            {isSimulatedOffline ? t.returnToOnline : t.simulateOffline}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
          {/* Back to Login / Role Selection */}
          {currentPortal !== 'login' && (
            <button
              id="btn-back-to-hub"
              onClick={() => {
                stopSpeech();
                if (onSwitchRole) onSwitchRole();
                else onSelectPortal('login');
              }}
              className="px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 transition-all shadow-sm border-2 border-amber-300 active:scale-95 cursor-pointer"
              aria-label={t.switchRole}
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{t.switchRole}</span>
              <span className="sm:hidden">Roles</span>
            </button>
          )}

          <div
            className="cursor-pointer"
            onClick={() => {
              stopSpeech();
              onSelectPortal('login');
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center shadow-inner border border-emerald-300">
                স্মৃ
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  {t.appName}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200 font-medium line-clamp-1 max-w-md">
                  {t.appSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Badge, Accessibility & Language Controls */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 sm:gap-4 w-full md:w-auto">
          {/* Active User Badge */}
          {activeUserName && currentPortal !== 'login' && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C261B] text-emerald-300 border border-emerald-600/40 text-xs font-bold">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{activeUserName}</span>
            </div>
          )}

          {/* Audio Stopper if talking */}
          {isSpeaking && (
            <button
              id="btn-stop-audio"
              onClick={handleStopAudio}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-1.5 animate-pulse cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              {t.audioStop}
            </button>
          )}

          {/* Text Size Adjuster */}
          <div className="flex items-center bg-[#0C261B] rounded-xl p-1 border border-emerald-600/40">
            <span className="text-xs text-emerald-200 px-2 font-medium hidden sm:inline">
              {t.textSize}:
            </span>
            <button
              id="btn-text-size-normal"
              onClick={() => onTextSizeChange('normal')}
              className={`px-2.5 py-1 text-sm font-bold rounded-lg transition-all ${
                textSize === 'normal'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
              title="Standard text size"
            >
              A
            </button>
            <button
              id="btn-text-size-large"
              onClick={() => onTextSizeChange('large')}
              className={`px-2.5 py-1 text-base font-bold rounded-lg transition-all ${
                textSize === 'large'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
              title="Large text size (+20%)"
            >
              A+
            </button>
            <button
              id="btn-text-size-extralarge"
              onClick={() => onTextSizeChange('extralarge')}
              className={`px-2.5 py-1 text-lg font-bold rounded-lg transition-all ${
                textSize === 'extralarge'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
              title="Extra large text size (+40%)"
            >
              A++
            </button>
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center bg-[#0C261B] rounded-xl px-2.5 py-1.5 border-2 border-emerald-500/50 shadow-sm">
            <Globe className="w-4 h-4 text-emerald-300 mr-2 shrink-0" />
            <select
              id="select-app-language"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-white font-bold text-sm sm:text-base focus:outline-none cursor-pointer pr-1"
              aria-label={t.languageSelectLabel}
            >
              <option value="en" className="bg-[#0C261B] text-white">English</option>
              <option value="as" className="bg-[#0C261B] text-white">অসমীয়া (Assamese)</option>
              <option value="mni" className="bg-[#0C261B] text-white">মৈতৈলোন্ (Manipuri)</option>
              <option value="trp" className="bg-[#0C261B] text-white">ককবরক (Tripuri)</option>
              <option value="nag" className="bg-[#0C261B] text-white">Nagamese (Nagaland)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
