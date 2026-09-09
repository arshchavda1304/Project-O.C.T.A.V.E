import React, { useState } from 'react';
import {
  Language,
  UserRole,
  Patient,
  CaregiverUser,
  DoctorUser,
} from './types';
import { translations } from './translations';
import {
  Gamepad2,
  HeartHandshake,
  Stethoscope,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { speakText, playPositiveChime } from './speech';

interface RoleLoginScreenProps {
  language: Language;
  patients: Patient[];
  caregivers: CaregiverUser[];
  doctors: DoctorUser[];
  onSelectRole: (role: UserRole, accountId?: string) => void;
}

export const RoleLoginScreen: React.FC<RoleLoginScreenProps> = ({
  language,
  patients,
  caregivers,
  doctors,
  onSelectRole,
}) => {
  const t = translations[language];
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-1');
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>('care-1');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-1');
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const handleSpeak = (text: string, key: string) => {
    setSpeakingKey(key);
    speakText(
      text,
      language,
      () => setSpeakingKey(key),
      () => setSpeakingKey(null)
    );
  };

  const handleLogin = (role: UserRole) => {
    playPositiveChime();
    if (role === 'patient') {
      onSelectRole('patient', selectedPatientId);
    } else if (role === 'caregiver') {
      onSelectRole('caregiver', selectedCaregiverId);
    } else {
      onSelectRole('doctor', selectedDoctorId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-fade-in">
      {/* Top Welcome & Region Header */}
      <div className="text-center bg-white rounded-3xl p-6 sm:p-10 border-3 border-[#166534]/20 shadow-md">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-[#14532D] font-bold text-sm sm:text-base mb-4 border border-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>North Eastern Regional Tele-Care Platform • অসম • মণিপুৰ • ত্ৰিপুৰা • নাগালেণ্ড</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight mb-3">
          {t.roleSelectionTitle}
        </h2>
        <p className="text-lg sm:text-2xl text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed">
          {t.roleSelectionSub}
        </p>
      </div>

      {/* Role Selection 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* CARD 1: PATIENT */}
        <div
          id="role-card-patient"
          className={`bg-white rounded-3xl border-4 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl ${
            selectedRole === 'patient'
              ? 'border-emerald-600 ring-4 ring-emerald-200'
              : 'border-emerald-500/40 hover:border-emerald-600'
          }`}
        >
          <div className="p-6 sm:p-8 flex-1">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center border-2 border-emerald-300 shadow-sm">
                <Gamepad2 className="w-9 h-9 stroke-[2.3]" />
              </div>

              <button
                id="btn-speak-patient-role"
                onClick={() => handleSpeak(`${t.rolePatientTitle}. ${t.rolePatientSub}`, 'patient')}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  speakingKey === 'patient'
                    ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                }`}
                aria-label={t.audioSpeak}
                title={t.audioSpeak}
              >
                <Volume2 className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <div className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm mb-3">
              ১. ৰোগীৰ পোৰ্টেল • For Elders
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2">
              {t.rolePatientTitle}
            </h3>

            <p className="text-base sm:text-lg text-slate-700 font-medium mb-6 leading-relaxed">
              {t.rolePatientSub}
            </p>

            {/* Quick Demo Account Selector */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border-2 border-emerald-200 mb-6 space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                {t.quickSelectAccount}:
              </label>
              <div className="space-y-2">
                {patients.slice(0, 2).map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPatientId === p.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="patient_account"
                        value={p.id}
                        checked={selectedPatientId === p.id}
                        onChange={() => {
                          setSelectedPatientId(p.id);
                          setSelectedRole('patient');
                        }}
                        className="accent-emerald-600 w-4 h-4"
                      />
                      <span className="text-sm">{p.name} ({p.age}y)</span>
                    </div>
                    <span className="text-xs text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                      {p.stateNE || p.location.split(',')[0]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <ul className="text-xs sm:text-sm text-slate-700 font-semibold space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5">✓ {t.modulePhotoQuiz}</li>
              <li className="flex items-center gap-1.5">✓ {t.moduleSituationTest}</li>
              <li className="flex items-center gap-1.5">✓ {t.moduleGridMatch}</li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 pt-0">
            <button
              id="btn-login-patient"
              onClick={() => handleLogin('patient')}
              className="w-full py-4 px-5 rounded-2xl bg-[#15803D] hover:bg-[#166534] active:bg-[#14532D] text-white font-black text-lg sm:text-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-emerald-400"
            >
              <span>{t.btnSelectRole}</span>
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* CARD 2: CAREGIVER */}
        <div
          id="role-card-caregiver"
          className={`bg-white rounded-3xl border-4 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl ${
            selectedRole === 'caregiver'
              ? 'border-amber-600 ring-4 ring-amber-200'
              : 'border-amber-500/40 hover:border-amber-600'
          }`}
        >
          <div className="p-6 sm:p-8 flex-1">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center border-2 border-amber-300 shadow-sm">
                <HeartHandshake className="w-9 h-9 stroke-[2.3]" />
              </div>

              <button
                id="btn-speak-caregiver-role"
                onClick={() => handleSpeak(`${t.roleCaregiverTitle}. ${t.roleCaregiverSub}`, 'caregiver')}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  speakingKey === 'caregiver'
                    ? 'bg-amber-600 text-white border-amber-700 animate-pulse'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                }`}
                aria-label={t.audioSpeak}
                title={t.audioSpeak}
              >
                <Volume2 className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <div className="inline-block px-3 py-1 rounded-lg bg-amber-100 text-amber-950 font-bold text-xs sm:text-sm mb-3">
              ২. পৰিয়ালৰ যত্নকাৰী • Family Caregiver
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2">
              {t.roleCaregiverTitle}
            </h3>

            <p className="text-base sm:text-lg text-slate-700 font-medium mb-6 leading-relaxed">
              {t.roleCaregiverSub}
            </p>

            {/* Quick Demo Account Selector */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border-2 border-amber-200 mb-6 space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                {t.quickSelectAccount}:
              </label>
              <div className="space-y-2">
                {caregivers.map((c) => {
                  const linkedPat = patients.find((p) => p.id === c.patientId);
                  return (
                    <label
                      key={c.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedCaregiverId === c.id
                          ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="caregiver_account"
                          value={c.id}
                          checked={selectedCaregiverId === c.id}
                          onChange={() => {
                            setSelectedCaregiverId(c.id);
                            setSelectedRole('caregiver');
                          }}
                          className="accent-amber-600 w-4 h-4"
                        />
                        <div className="text-left">
                          <span className="text-sm block">{c.name} ({c.relation})</span>
                          <span className="text-xs text-slate-500">{t.linkedPatientLabel}: {linkedPat?.name}</span>
                        </div>
                      </div>
                      <span className="text-xs text-amber-900 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                        Form Ready
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <ul className="text-xs sm:text-sm text-slate-700 font-semibold space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5">✓ {t.profileSetupTitle}</li>
              <li className="flex items-center gap-1.5">✓ {t.privacyConsentTitle}</li>
              <li className="flex items-center gap-1.5">✓ {t.routineSectionTitle}</li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 pt-0">
            <button
              id="btn-login-caregiver"
              onClick={() => handleLogin('caregiver')}
              className="w-full py-4 px-5 rounded-2xl bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-slate-950 font-black text-lg sm:text-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-amber-300"
            >
              <span>{t.btnSelectRole}</span>
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* CARD 3: DOCTOR */}
        <div
          id="role-card-doctor"
          className={`bg-white rounded-3xl border-4 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl ${
            selectedRole === 'doctor'
              ? 'border-slate-800 ring-4 ring-slate-300'
              : 'border-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="p-6 sm:p-8 flex-1">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center border-2 border-slate-300 shadow-sm">
                <Stethoscope className="w-9 h-9 stroke-[2.3]" />
              </div>

              <button
                id="btn-speak-doctor-role"
                onClick={() => handleSpeak(`${t.roleDoctorTitle}. ${t.roleDoctorSub}`, 'doctor')}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  speakingKey === 'doctor'
                    ? 'bg-slate-800 text-white border-slate-900 animate-pulse'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                }`}
                aria-label={t.audioSpeak}
                title={t.audioSpeak}
              >
                <Volume2 className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <div className="inline-block px-3 py-1 rounded-lg bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm mb-3">
              ৩. ক্লিনিকেল চিকিৎসক • Medical Doctor
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2">
              {t.roleDoctorTitle}
            </h3>

            <p className="text-base sm:text-lg text-slate-700 font-medium mb-6 leading-relaxed">
              {t.roleDoctorSub}
            </p>

            {/* Quick Demo Account Selector */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border-2 border-slate-300 mb-6 space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                {t.quickSelectAccount}:
              </label>
              <div className="space-y-2">
                {doctors.map((d) => (
                  <label
                    key={d.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedDoctorId === d.id
                        ? 'bg-slate-100 border-slate-800 text-slate-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="doctor_account"
                        value={d.id}
                        checked={selectedDoctorId === d.id}
                        onChange={() => {
                          setSelectedDoctorId(d.id);
                          setSelectedRole('doctor');
                        }}
                        className="accent-slate-800 w-4 h-4"
                      />
                      <div className="text-left">
                        <span className="text-sm block">{d.name}</span>
                        <span className="text-xs text-slate-500">{d.assignedPatientIds.length} Linked Patients</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-800 font-semibold bg-slate-200 px-2 py-0.5 rounded-full">
                      Triage
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <ul className="text-xs sm:text-sm text-slate-700 font-semibold space-y-1.5 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5">✓ 30-Day Longitudinal Sparklines</li>
              <li className="flex items-center gap-1.5">✓ Consent-Enforced Telemetry</li>
              <li className="flex items-center gap-1.5">✓ Clinical Directives & Notes</li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 pt-0">
            <button
              id="btn-login-doctor"
              onClick={() => handleLogin('doctor')}
              className="w-full py-4 px-5 rounded-2xl bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-black text-lg sm:text-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-slate-600"
            >
              <span>{t.btnSelectRole}</span>
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* Security & Offline Statement */}
      <div className="bg-[#FAF7F0] border-2 border-emerald-800/20 rounded-2xl p-5 sm:p-6 text-center text-slate-700 font-medium flex flex-col sm:flex-row items-center justify-center gap-3 text-sm sm:text-base">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        <span>
          {t.consentNotice}
        </span>
      </div>
    </div>
  );
};
