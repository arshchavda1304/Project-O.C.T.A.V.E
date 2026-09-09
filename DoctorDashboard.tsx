import React, { useState } from 'react';
import { Language, Patient, ClinicalNote, DoctorUser } from './types';
import { translations } from './translations';
import {
  Stethoscope,
  Activity,
  Brain,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Calendar,
  MapPin,
  Save,
  TrendingUp,
  AlertTriangle,
  Lock,
  Unlock,
  User,
  ShieldAlert,
} from 'lucide-react';
import { playPositiveChime } from './speech';

interface DoctorDashboardProps {
  language: Language;
  patients: Patient[];
  activePatientId: string;
  onSelectPatient: (id: string) => void;
  onAddClinicalNote: (patientId: string, noteText: string) => void;
  currentDoctor: DoctorUser;
  allDoctors: DoctorUser[];
  onSelectDoctor?: (doctorId: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  language,
  patients,
  activePatientId,
  onSelectPatient,
  onAddClinicalNote,
  currentDoctor,
  allDoctors,
  onSelectDoctor,
}) => {
  const t = translations[language];
  const [newNoteText, setNewNoteText] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0];

  // Check consent permission for current doctor
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
    const x = paddingX + (idx / (trendData.length - 1)) * (graphWidth - 2 * paddingX);
    const y = graphHeight - paddingY - ((val - minScore) / (maxScore - minScore)) * (graphHeight - 2 * paddingY);
    return { x, y, val, day: idx + 1 };
  });

  const svgPathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaPathD = `${svgPathD} L ${points[points.length - 1].x} ${graphHeight - paddingY} L ${points[0].x} ${graphHeight - paddingY} Z`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fade-in">
      {/* Header with Doctor Identity and Triage Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-700/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-sm mb-2">
            <Stethoscope className="w-4 h-4 text-slate-700" />
            <span>{t.portalDoctorTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950">
            {t.doctorHeader}
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-700 font-semibold mt-2">
            <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded-xl border border-slate-300">
              🩺 {t.loggedInAs}: <strong>{currentDoctor.name}</strong> ({currentDoctor.qualification})
            </span>
            <span className="bg-[#FAF7F0] text-slate-700 px-3 py-1 rounded-xl border border-slate-300">
              🏥 {currentDoctor.hospital}
            </span>
          </div>
        </div>

        {/* Doctor Switcher if multiple doctors exist */}
        {allDoctors.length > 1 && onSelectDoctor && (
          <div className="bg-[#FAF7F0] p-3 rounded-2xl border-2 border-slate-300 shrink-0">
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Switch Physician View:
            </label>
            <select
              value={currentDoctor.id}
              onChange={(e) => onSelectDoctor(e.target.value)}
              className="bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 cursor-pointer"
            >
              {allDoctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: Patient Triage Sidebar + Clinical Analytics Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PATIENT SIDEBAR (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-slate-700 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-4 flex items-center justify-between">
              <span>{t.patientListTitle}</span>
              <span className="text-xs bg-slate-200 text-slate-800 px-2.5 py-1 rounded-full font-bold">
                {patients.length} Active Records
              </span>
            </h3>

            <div className="space-y-3">
              {patients.map((pat) => {
                const isSelected = pat.id === activePatient.id;
                const patConsent =
                  pat.sharingPermissions?.doctors?.[currentDoctor.id] !== false;

                const riskColor =
                  pat.riskLevel === 'Stable'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : pat.riskLevel === 'Monitoring'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-red-100 text-red-900 border-red-300';

                const riskLabel =
                  pat.riskLevel === 'Stable'
                    ? t.riskStable
                    : pat.riskLevel === 'Monitoring'
                    ? t.riskMonitoring
                    : t.riskAttention;

                return (
                  <button
                    key={pat.id}
                    id={`btn-select-patient-${pat.id}`}
                    onClick={() => onSelectPatient(pat.id)}
                    className={`w-full p-4 rounded-2xl border-3 text-left transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-slate-900 text-white border-black shadow-md ring-4 ring-slate-300'
                        : 'bg-[#FAF9F6] hover:bg-white text-slate-900 border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-black text-lg">{pat.name}</span>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                          isSelected ? 'bg-white/20 text-white border-white/30' : riskColor
                        }`}
                      >
                        {riskLabel}
                      </span>
                    </div>

                    <p
                      className={`text-xs font-semibold mb-2 ${
                        isSelected ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {pat.age} yrs • {pat.stateNE || pat.location.split(',')[0]}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/50">
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                        {pat.stage.split('(')[0]}
                      </span>

                      {/* Consent indicator pill */}
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
                        {patConsent ? '✓ Sharing Active' : '🔒 Paused'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACTIVE PATIENT CLINICAL TELEMETRY & NOTES (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Patient Identity Card */}
          <div className="bg-white rounded-3xl p-6 border-3 border-slate-700 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                    {activePatient.name}
                  </h3>
                  <span className="text-xs font-bold bg-slate-200 text-slate-800 px-3 py-1 rounded-full">
                    {activePatient.age} Years
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>{activePatient.location} {activePatient.stateNE ? `(${activePatient.stateNE})` : ''}</span>
                  <span>• {activePatient.stage}</span>
                </p>

                {activePatient.emergencyContact && (
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Emergency Contact: {activePatient.emergencyContact.name} ({activePatient.emergencyContact.relation}) - {activePatient.emergencyContact.phone}
                  </p>
                )}
              </div>

              {/* Consent Status Badge */}
              <div
                className={`px-4 py-2 rounded-2xl border-2 flex items-center gap-2 self-start sm:self-center font-bold text-sm ${
                  isConsentGranted
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-400'
                    : 'bg-red-50 text-red-950 border-red-400'
                }`}
              >
                {isConsentGranted ? (
                  <>
                    <Unlock className="w-4 h-4 text-emerald-700" />
                    <span>{t.sharingEnabled}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-red-700" />
                    <span>{t.sharingDisabled}</span>
                  </>
                )}
              </div>
            </div>

            {activePatient.emergencyNotes && (
              <div className="mt-3 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs font-semibold text-amber-900">
                <span className="font-bold">Care Notes / Alerts:</span> {activePatient.emergencyNotes}
              </div>
            )}
          </div>

          {/* PRIVACY & CONSENT ENFORCEMENT CHECK */}
          {!isConsentGranted ? (
            /* Telemetry Locked / Suspended Notice */
            <div
              id="notice-telemetry-suspended"
              className="bg-red-50 border-3 border-red-400 p-6 sm:p-8 rounded-3xl text-red-950 shadow-md space-y-4 animate-fade-in"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-200 flex items-center justify-center text-red-800 shrink-0 mt-0.5">
                  <Lock className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black">
                    {t.telemetrySuspendedNotice}
                  </h4>
                  <p className="text-sm font-semibold text-red-800 mt-1">
                    Data Transmission Restricted by Patient Consent Policy
                  </p>
                </div>
              </div>

              <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-red-200 text-sm font-medium text-slate-800 leading-relaxed space-y-2">
                <p>
                  🔒 Under the <strong>National Digital Health Mission (ABDM) Patient-Managed Consent Architecture</strong>, patient {activePatient.name} or their primary caregiver has paused telemetry synchronization for your account ({currentDoctor.name}).
                </p>
                <p className="text-xs text-slate-600">
                  Real-time cognitive metrics, memory accuracy percentages, and the 30-day longitudinal recovery sparkline are paused until permissions are re-enabled in the caregiver portal.
                </p>
              </div>

              {/* Historical static records remain visible */}
              <div className="pt-2">
                <p className="text-xs font-bold text-red-900 uppercase tracking-wider mb-2">
                  Emergency Medical Directive Access:
                </p>
                <p className="text-xs text-slate-600">
                  You may still review previously stored clinical directives and append observational instructions below.
                </p>
              </div>
            </div>
          ) : (
            /* CONSENT GRANTED: FULL TELEMETRY METRICS + 30-DAY TREND GRAPH */
            <>
              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Metric 1 */}
                <div className="bg-white rounded-2xl p-5 border-3 border-emerald-600 shadow-sm">
                  <p className="text-xs uppercase font-bold text-emerald-800 tracking-wider mb-1">
                    {t.metricEngagement}
                  </p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950">
                      {activePatient.engagementScore}%
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                      High
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Daily app interaction rate
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="bg-white rounded-2xl p-5 border-3 border-amber-600 shadow-sm">
                  <p className="text-xs uppercase font-bold text-amber-800 tracking-wider mb-1">
                    {t.metricMemory}
                  </p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950">
                      {activePatient.memoryAccuracy}%
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      Stable
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Family quiz & logic match
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="bg-white rounded-2xl p-5 border-3 border-slate-700 shadow-sm">
                  <p className="text-xs uppercase font-bold text-slate-700 tracking-wider mb-1">
                    {t.metricAdherence}
                  </p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950">
                      {activePatient.adherenceRate}%
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-900">
                      Optimal
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Care routine compliance
                  </p>
                </div>
              </div>

              {/* Interactive 30-Day Cognitive Trend Line Graph */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-700 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b-2 border-slate-200">
                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-emerald-700" />
                      <span>{t.cognitiveTrendTitle}</span>
                    </h4>
                    <p className="text-sm text-slate-600 font-medium">
                      {t.cognitiveTrendSub}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                    {t.last30Days}
                  </span>
                </div>

                {/* Responsive SVG Chart */}
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[640px] relative">
                    <svg
                      viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                      className="w-full h-auto select-none"
                    >
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#15803D" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#15803D" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
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
                              x={paddingX - 10}
                              y={y + 4}
                              fontSize="11"
                              fill="#94A3B8"
                              fontWeight="bold"
                              textAnchor="end"
                            >
                              {level}
                            </text>
                          </g>
                        );
                      })}

                      {/* Filled Area */}
                      <path d={areaPathD} fill="url(#trendGradient)" />

                      {/* Line Path */}
                      <path
                        d={svgPathD}
                        fill="none"
                        stroke="#166534"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Interactive Data Points */}
                      {points.map((pt, idx) => (
                        <circle
                          key={idx}
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredTrendIndex === idx ? 6 : 3.5}
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

          {/* Clinical Directives & Observations (Always available for doctor record keeping) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-700 shadow-lg space-y-6">
            <div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
                <FileText className="w-6 h-6 text-slate-800" />
                <span>{t.clinicalNotesTitle}</span>
              </h4>
              <p className="text-sm text-slate-600 font-medium">
                Append medication adjustments, observations, or therapy recommendations for {activePatient.name}
              </p>
            </div>

            {/* Note Save Confirmation */}
            {saveSuccessMsg && (
              <div
                id="notice-clinical-saved"
                className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold text-base flex items-center gap-3 animate-fade-in"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveObservation} className="space-y-4">
              <textarea
                rows={3}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder={t.clinicalNotesPlaceholder}
                className="w-full p-4 rounded-2xl border-2 border-slate-300 focus:border-slate-800 focus:outline-none text-base font-medium bg-slate-50"
                required
              />

              <button
                id="btn-save-clinical-note"
                type="submit"
                className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-base shadow-md flex items-center gap-2 cursor-pointer border-2 border-slate-600"
              >
                <Save className="w-5 h-5" />
                <span>{t.btnSaveObservation}</span>
              </button>
            </form>

            {/* Longitudinal Medical Timeline */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h5 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                {t.recentObservations}:
              </h5>

              {(activePatient.clinicalNotes || []).length === 0 ? (
                <p className="text-sm text-slate-500 italic">No notes recorded yet.</p>
              ) : (
                (activePatient.clinicalNotes || []).map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-[#FAF9F6] border-2 border-slate-200 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-200 text-slate-800">
                        {note.category}
                      </span>
                      <span>{note.author} • {note.date}</span>
                    </div>
                    <p className="text-sm sm:text-base font-medium text-slate-900">
                      {note.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
