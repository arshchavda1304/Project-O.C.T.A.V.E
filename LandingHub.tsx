import React from 'react';
import { Language, PortalType } from './types';
import { translations } from './translations';
import { Gamepad2, HeartHandshake, Stethoscope, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { playPositiveChime } from './speech';
import { ReadAloudButton } from './ReadAloudButton';

interface LandingHubProps {
  language: Language;
  onSelectPortal: (portal: PortalType) => void;
  activePhotoCount: number;
  checklistCompletionPercent: number;
}

export const LandingHub: React.FC<LandingHubProps> = ({
  language,
  onSelectPortal,
  activePhotoCount,
  checklistCompletionPercent,
}) => {
  const t = translations[language];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Visual Welcome Banner */}
      <div className="mb-8 sm:mb-12 text-center bg-white rounded-3xl p-6 sm:p-10 border-3 border-[#166534]/20 shadow-sm">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-[#14532D] font-bold text-sm sm:text-base mb-4 border border-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>North Eastern Region Care Initiative • অসম • মণিপুৰ • ত্ৰিপুৰা • নাগালেণ্ড</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
          {t.appSubtitle}
        </h2>
        <p className="text-xl sm:text-2xl text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed mb-4">
          {t.tagline}
        </p>

        <div className="flex justify-center">
          <ReadAloudButton
            id="btn-speak-hub-welcome"
            text={`${t.appSubtitle}. ${t.tagline}`}
            language={language}
            variant="pill"
            size="md"
          />
        </div>
      </div>

      {/* 3 Massive Role-Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Card 1: Patient Portal */}
        <div
          id="card-portal-patient"
          className="group bg-white rounded-3xl border-4 border-emerald-600 hover:border-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
        >
          <div className="p-6 sm:p-8 flex-1">
            <div className="flex items-start justify-between gap-3 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center border-2 border-emerald-300 shadow-sm">
                <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
              </div>

              <ReadAloudButton
                id="btn-speak-patient-portal"
                text={`${t.portalPatientTitle}. ${t.portalPatientSubtitle}`}
                language={language}
                size="lg"
              />
            </div>

            <div className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-sm mb-3">
              ১. ৰোগীৰ বাবে • For Elders
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-3 group-hover:text-emerald-800 transition-colors">
              {t.portalPatientTitle}
            </h3>

            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mb-6 font-medium">
              {t.portalPatientSubtitle}
            </p>

            <div className="space-y-2.5 pt-4 border-t-2 border-slate-100 text-slate-800 text-base font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>{t.modulePhotoQuiz}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>{t.moduleSituationTest}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>{t.moduleGridMatch}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 pt-0">
            <button
              id="btn-open-patient-portal"
              onClick={() => {
                playPositiveChime();
                onSelectPortal('patient');
              }}
              className="w-full py-5 px-6 rounded-2xl bg-[#15803D] hover:bg-[#166534] active:bg-[#14532D] text-white font-black text-xl sm:text-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-emerald-400"
            >
              <span>{t.portalPatientTitle}</span>
              <ChevronRight className="w-7 h-7 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Card 2: Caregiver Portal */}
        <div
          id="card-portal-caregiver"
          className="group bg-white rounded-3xl border-4 border-amber-600 hover:border-amber-700 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
        >
          <div className="p-6 sm:p-8 flex-1">
            <div className="flex items-start justify-between gap-3 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center border-2 border-amber-300 shadow-sm">
                <HeartHandshake className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
              </div>

              <ReadAloudButton
                id="btn-speak-caregiver-portal"
                text={`${t.portalCaregiverTitle}. ${t.portalCaregiverSubtitle}`}
                language={language}
                size="lg"
              />
            </div>

            <div className="inline-block px-3 py-1 rounded-lg bg-amber-100 text-amber-950 font-bold text-sm mb-3">
              ২. পৰিয়াল আৰু যত্নকাৰী • Family Care
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-3 group-hover:text-amber-800 transition-colors">
              {t.portalCaregiverTitle}
            </h3>

            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mb-6 font-medium">
              {t.portalCaregiverSubtitle}
            </p>

            <div className="space-y-2.5 pt-4 border-t-2 border-slate-100 text-slate-800 text-base font-semibold">
              <div className="flex items-center justify-between">
                <span>{t.routineSectionTitle}</span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-sm">
                  {checklistCompletionPercent}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t.photoPreviewTitle}</span>
                <span className="font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full text-sm">
                  {activePhotoCount} photos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>{t.btnNotifyDoctor}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 pt-0">
            <button
              id="btn-open-caregiver-portal"
              onClick={() => {
                playPositiveChime();
                onSelectPortal('caregiver');
              }}
              className="w-full py-5 px-6 rounded-2xl bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-slate-950 font-black text-xl sm:text-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-amber-300"
            >
              <span>{t.portalCaregiverTitle}</span>
              <ChevronRight className="w-7 h-7 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Card 3: Doctor Dashboard */}
        <div
          id="card-portal-doctor"
          className="group bg-white rounded-3xl border-4 border-slate-700 hover:border-slate-900 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
        >
          <div className="p-6 sm:p-8 flex-1">
            <div className="flex items-start justify-between gap-3 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center border-2 border-slate-300 shadow-sm">
                <Stethoscope className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
              </div>

              <ReadAloudButton
                id="btn-speak-doctor-portal"
                text={`${t.portalDoctorTitle}. ${t.portalDoctorSubtitle}`}
                language={language}
                size="lg"
              />
            </div>

            <div className="inline-block px-3 py-1 rounded-lg bg-slate-200 text-slate-900 font-bold text-sm mb-3">
              ৩. ক্লিনিকেল পৰ্যবেক্ষণ • Medical Tele-Care
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-3 group-hover:text-slate-800 transition-colors">
              {t.portalDoctorTitle}
            </h3>

            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mb-6 font-medium">
              {t.portalDoctorSubtitle}
            </p>

            <div className="space-y-2.5 pt-4 border-t-2 border-slate-100 text-slate-800 text-base font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span>{t.patientListTitle} (4 Active)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span>{t.cognitiveTrendTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span>{t.clinicalNotesTitle}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 pt-0">
            <button
              id="btn-open-doctor-portal"
              onClick={() => {
                playPositiveChime();
                onSelectPortal('doctor');
              }}
              className="w-full py-5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-black text-xl sm:text-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-slate-600"
            >
              <span>{t.portalDoctorTitle}</span>
              <ChevronRight className="w-7 h-7 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* Regional Accessibility & Offline Assurance Footer Note */}
      <div className="mt-10 sm:mt-14 bg-[#FAF7F0] border-2 border-emerald-800/20 rounded-2xl p-5 sm:p-6 text-center text-slate-700 font-medium flex flex-col sm:flex-row items-center justify-center gap-3 text-base sm:text-lg">
        <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
        <span>
          {t.offlineModeNotice}
        </span>
      </div>
    </div>
  );
};
