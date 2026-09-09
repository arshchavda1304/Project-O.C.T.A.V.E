import React from 'react';
import { Language } from './types';
import { translations } from './translations';
import { WifiOff, CheckCircle2, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  language: Language;
  isOnline: boolean;
  unsyncedCount: number;
  syncSuccessNotice: boolean;
  onManualSync: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  language,
  isOnline,
  unsyncedCount,
  syncSuccessNotice,
  onManualSync,
}) => {
  const t = translations[language];

  if (syncSuccessNotice) {
    return (
      <aside aria-label="Synchronization alert" className="bg-emerald-700 text-white px-4 py-3 shadow-md border-b-2 border-emerald-900 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-black text-base sm:text-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-300 stroke-[2.5] shrink-0" />
            <span>{t.syncedSuccess}</span>
          </div>
          <span className="text-xs bg-emerald-900/60 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Cloud Connected
          </span>
        </div>
      </aside>
    );
  }

  if (!isOnline) {
    return (
      <aside aria-label="Offline mode alert" className="bg-amber-600 text-slate-950 px-4 py-3 shadow-md border-b-2 border-amber-800 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 font-black text-base sm:text-lg">
            <WifiOff className="w-6 h-6 text-slate-950 stroke-[2.5] shrink-0 animate-pulse" />
            <div>
              <span>{t.offlineStatus}</span>
              <span className="font-semibold text-slate-900 text-sm ml-2">
                — {unsyncedCount} {t.changesPendingSync}
              </span>
            </div>
          </div>

          <button
            onClick={onManualSync}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Connection / Reconnect</span>
          </button>
        </div>
      </aside>
    );
  }

  return null;
};
