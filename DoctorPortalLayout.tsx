import React, { useState } from 'react';
import { Language, Patient, DoctorUser, UserAccount } from './types';
import { translations } from './translations';
import {
  Stethoscope,
  LogOut,
  MapPin,
  TrendingUp,
  FileText,
  Lock,
  Unlock,
  Activity,
  Brain,
  CheckCircle2,
  Save,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { playPositiveChime } from './speech';
import { RoleToggleBar } from './RoleToggleBar';

interface DoctorPortalLayoutProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: UserAccount;
  currentDoctor: DoctorUser;
  allDoctors: DoctorUser[];
  patients: Patient[];
  onSelectDoctor: (doctorId: string) => void;
  onAddClinicalNote: (patientId: string, noteText: string) => void;
  onSignOut: () => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  unsyncedCount: number;
  onSwitchRole?: (newUser: UserAccount) => void;
}

export const DoctorPortalLayout: React.FC<DoctorPortalLayoutProps> = ({
  language,
  onLanguageChange,
  currentUser,
  currentDoctor,
  allDoctors,
  patients,
  onSelectDoctor,
  onAddClinicalNote,
  onSignOut,
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  unsyncedCount,
  onSwitchRole,
}) => {
  const t = translations[language];

  // Filter patients by this doctor's assigned list
  const assignedPatients = patients.filter((p) =>
    currentDoctor.assignedPatientIds.includes(p.id)
  );

  const [activePatientId, setActivePatientId] = useState<string>(
    assignedPatients[0]?.id || patients[0]?.id || 'pat-1'
  );

  const activePatient =
    patients.find((p) => p.id === activePatientId) || assignedPatients[0] || patients[0];

  const [newNoteText, setNewNoteText] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  // ABDM Patient Consent Check for current doctor
  const isConsentGranted =
    activePatient?.sharingPermissions?.doctors?.[currentDoctor.id] !== false;

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    onAddClinicalNote(activePatient.id, newNoteText.trim());
    playPositiveChime();
    setSaveSuccessMsg(t.clinicalSavedSuccess);
    setNewNoteText('');

    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  // 30-Day Trend Graph SVG Math
  const trendData = activePatient.trend30Days;
  const graphWidth = 700;
  const graphHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const minScore = 50;
  const maxScore = 100;

  const points = trendData.map((val, idx) => {
    const x = paddingX + (idx / Math.max(1, trendData.length - 1)) * (graphWidth - 2 * paddingX);
    const y = graphHeight - paddingY - ((val - minScore) / (maxScore - minScore)) * (graphHeight - 2 * paddingY);
    return { x, y, val, day: idx + 1 };
  });

  const svgPathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaPathD = `${svgPathD} L ${points[points.length - 1].x} ${graphHeight - paddingY} L ${points[0].x} ${graphHeight - paddingY} Z`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col animate-fade-in">
      {/* Role Toggle Bar with Auth Bypass (Demo / Quick Access) */}
      {onSwitchRole && (
        <RoleToggleBar
          currentRole={currentUser.role}
          onSwitchRole={onSwitchRole}
        />
      )}

      {/* 1. DEDICATED DOCTOR CLINICAL HEADER */}
      <header className="bg-slate-900 text-white border-b-4 border-slate-700 shadow-lg sticky top-0 z-40">
        {/* Offline sync sub-bar */}
        <div className="bg-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Wifi className="w-3.5 h-3.5" />
                Clinical Tele-Network Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <WifiOff className="w-3.5 h-3.5" />
                Offline Mode ({unsyncedCount} records queued)
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleSimulatedOffline}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            {isSimulatedOffline ? 'Reconnect' : 'Simulate Offline'}
          </button>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-slate-800 text-white border border-slate-600 flex items-center justify-center font-black shadow-inner">
                <Stethoscope className="w-6 h-6 text-emerald-400" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  O.C.T.A.V.E. <span className="text-xs bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold">Physician EHR</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  {currentDoctor.name} • {currentDoctor.hospital}
                </p>
              </div>
            </div>
          </div>

          {/* Right controls: Language, Switch Doctor, Sign Out */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-end">
            {/* Doctor Switcher if multiple */}
            {allDoctors.length > 1 && (
              <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-400 hidden sm:inline">Dr:</span>
                <select
                  value={currentDoctor.id}
                  onChange={(e) => onSelectDoctor(e.target.value)}
                  className="bg-transparent text-white font-bold cursor-pointer pr-1 focus:outline-none"
                >
                  {allDoctors.map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                      {d.name.split(',')[0]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Language Selector */}
            <div className="flex items-center bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700 text-xs text-white">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-white font-bold cursor-pointer pr-1 focus:outline-none"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="as" className="bg-slate-900 text-white">অসমীয়া</option>
                <option value="mni" className="bg-slate-900 text-white">মৈতৈলোন্</option>
                <option value="trp" className="bg-slate-900 text-white">ককবরক</option>
                <option value="nag" className="bg-slate-900 text-white">Nagamese</option>
              </select>
            </div>

            {/* Dedicated Sign Out Button */}
            <button
              type="button"
              id="btn-doctor-sign-out"
              onClick={onSignOut}
              className="px-3.5 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow border border-red-500 cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN DOCTOR DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Triage & Patient Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* SIDEBAR: ASSIGNED PATIENTS LIST (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-slate-300 shadow-md">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <h3 className="text-lg font-black text-slate-900">
                  Assigned Patients
                </h3>
                <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                  {assignedPatients.length} Active
                </span>
              </div>

              <div className="space-y-3">
                {assignedPatients.map((pat) => {
                  const isSelected = pat.id === activePatient.id;
                  const patConsent =
                    pat.sharingPermissions?.doctors?.[currentDoctor.id] !== false;

                  const riskColor =
                    pat.riskLevel === 'Stable'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : pat.riskLevel === 'Monitoring'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-red-100 text-red-900 border-red-300';

                  return (
                    <button
                      key={pat.id}
                      type="button"
                      id={`btn-doctor-select-patient-${pat.id}`}
                      onClick={() => setActivePatientId(pat.id)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-950 shadow-md ring-4 ring-slate-200'
                          : 'bg-[#FAF9F6] hover:bg-white text-slate-900 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-black text-base sm:text-lg">{pat.name}</span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            isSelected ? 'bg-white/20 text-white border-white/30' : riskColor
                          }`}
                        >
                          {pat.riskLevel}
                        </span>
                      </div>

                      <p
                        className={`text-xs font-semibold mb-2 ${
                          isSelected ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {pat.age} yrs • {pat.stateNE || pat.location}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/40">
                        <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                          {pat.stage.split('(')[0]}
                        </span>

                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            patConsent
                              ? isSelected
                                ? 'bg-emerald-800 text-emerald-100'
                                : 'bg-emerald-100 text-emerald-900'
                              : isSelected
                              ? 'bg-red-800 text-red-100'
                              : 'bg-red-100 text-red-900'
                          }`}
                        >
                          {patConsent ? '✓ Sharing Active' : '🔒 Consent Paused'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN COLUMN: ACTIVE PATIENT CLINICAL FILE & TELEMETRY (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Patient Demographic Card */}
            <div className="bg-white rounded-3xl p-6 border-3 border-slate-300 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                      {activePatient.name}
                    </h3>
                    <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-300">
                      {activePatient.age} Years • {activePatient.stateNE || 'North East'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>{activePatient.location}</span>
                    <span>• {activePatient.stage}</span>
                  </p>

                  {activePatient.emergencyContact && (
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Primary Caregiver: <strong>{activePatient.emergencyContact.name}</strong> ({activePatient.emergencyContact.relation}) • Phone: {activePatient.emergencyContact.phone}
                    </p>
                  )}
                </div>

                {/* Consent Badge */}
                <div
                  className={`px-3.5 py-1.5 rounded-xl border-2 flex items-center gap-1.5 font-bold text-xs ${
                    isConsentGranted
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-400'
                      : 'bg-red-50 text-red-950 border-red-400'
                  }`}
                >
                  {isConsentGranted ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Telemetry Sharing Active</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-red-700" />
                      <span>Data Sharing Paused</span>
                    </>
                  )}
                </div>
              </div>

              {activePatient.emergencyNotes && (
                <div className="mt-3 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs font-semibold text-amber-900">
                  <span className="font-bold">Care Notes:</span> {activePatient.emergencyNotes}
                </div>
              )}
            </div>

            {/* CONSENT CHECK: TELEMETRY & 30-DAY TRENDS */}
            {!isConsentGranted ? (
              /* Privacy Paused Banner */
              <div
                id="notice-doctor-telemetry-paused"
                className="bg-red-50 border-3 border-red-400 p-6 sm:p-8 rounded-3xl text-red-950 shadow-md space-y-3 animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-200 flex items-center justify-center text-red-800 shrink-0">
                    <Lock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">
                      Patient Telemetry Access Paused
                    </h4>
                    <p className="text-xs font-semibold text-red-800 mt-0.5">
                      Consent policy paused by patient {activePatient.name} or primary caregiver ({activePatient.emergencyContact?.name || 'Caregiver'})
                    </p>
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-700 bg-white/90 p-4 rounded-xl border border-red-200 leading-relaxed">
                  🔒 In compliance with the National Digital Health Mission (ABDM) patient consent guidelines, real-time exercise telemetry, daily accuracy rates, and 30-day longitudinal curves are withheld until permissions are re-enabled by the caregiver.
                </p>
              </div>
            ) : (
              /* Telemetry Metrics & Trend Graph */
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-5 border-2 border-emerald-600 shadow-sm">
                    <p className="text-xs uppercase font-bold text-emerald-800 tracking-wider mb-1">
                      Engagement Rate
                    </p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-black text-slate-950">
                        {activePatient.engagementScore}%
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                        High
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Daily app interaction rate
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border-2 border-amber-600 shadow-sm">
                    <p className="text-xs uppercase font-bold text-amber-800 tracking-wider mb-1">
                      Memory Retention
                    </p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-black text-slate-950">
                        {activePatient.memoryAccuracy}%
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        Stable
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Quiz & logic test accuracy
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border-2 border-slate-700 shadow-sm">
                    <p className="text-xs uppercase font-bold text-slate-700 tracking-wider mb-1">
                      Routine Adherence
                    </p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-black text-slate-950">
                        {activePatient.adherenceRate}%
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-900">
                        Optimal
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Checklist compliance
                    </p>
                  </div>
                </div>

                {/* 30-Day SVG Graph */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200">
                    <div>
                      <h4 className="text-xl font-black text-slate-950 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-700" />
                        <span>30-Day Longitudinal Cognitive Trajectory</span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Composite cognitive stability index for {activePatient.name}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      Past 30 Days (Score / 100)
                    </span>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[600px] relative">
                      <svg
                        viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                        className="w-full h-auto select-none"
                      >
                        <defs>
                          <linearGradient id="doctorTrendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#15803D" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#15803D" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {[60, 70, 80, 90, 100].map((level) => {
                          const y = graphHeight - paddingY - ((level - minScore) / (maxScore - minScore)) * (graphHeight - 2 * paddingY);
                          return (
                            <g key={level}>
                              <line
                                x1={paddingX}
                                y1={y}
                                x2={graphWidth - paddingX}
                                y2={y}
                                stroke="#E2E8F0"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                              />
                              <text
                                x={paddingX - 8}
                                y={y + 4}
                                fontSize="10"
                                fill="#94A3B8"
                                fontWeight="bold"
                                textAnchor="end"
                              >
                                {level}
                              </text>
                            </g>
                          );
                        })}

                        <path d={areaPathD} fill="url(#doctorTrendGradient)" />
                        <path
                          d={svgPathD}
                          fill="none"
                          stroke="#166534"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {points.map((pt, idx) => (
                          <circle
                            key={idx}
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredTrendIndex === idx ? 6 : 3}
                            fill={hoveredTrendIndex === idx ? '#166534' : '#22C55E'}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            className="cursor-pointer transition-all"
                            onMouseEnter={() => setHoveredTrendIndex(idx)}
                            onMouseLeave={() => setHoveredTrendIndex(null)}
                          />
                        ))}
                      </svg>

                      {hoveredTrendIndex !== null && (
                        <div
                          className="absolute bg-slate-950 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
                          style={{
                            left: `${(points[hoveredTrendIndex].x / graphWidth) * 100}%`,
                            top: `${(points[hoveredTrendIndex].y / graphHeight) * 100}%`,
                          }}
                        >
                          Day {points[hoveredTrendIndex].day}: {points[hoveredTrendIndex].val}% Score
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Clinical Directives & Notes */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-md space-y-6">
              <div>
                <h4 className="text-xl font-black text-slate-950 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-800" />
                  <span>Physician Directives & Observation Notes</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Author observations, medical instructions, or dosage adjustments for {activePatient.name}
                </p>
              </div>

              {saveSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold text-sm flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveObservation} className="space-y-3">
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Enter medical evaluation, Donepezil dosage advice, or speech exercise directives..."
                  className="w-full p-4 rounded-2xl border-2 border-slate-300 focus:border-slate-800 focus:outline-none text-sm font-medium bg-slate-50"
                  required
                />

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow flex items-center gap-2 cursor-pointer border border-slate-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Directive to Patient File</span>
                </button>
              </form>

              {/* Historical Notes */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Longitudinal Timeline:
                </h5>

                {(activePatient.clinicalNotes || []).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No notes authored yet.</p>
                ) : (
                  (activePatient.clinicalNotes || []).map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {note.category}
                        </span>
                        <span>{note.author} • {note.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-900">
                        {note.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
