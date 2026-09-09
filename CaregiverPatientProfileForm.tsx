import React, { useState, useEffect } from 'react';
import {
  Language,
  Patient,
  CaregiverUser,
  DoctorUser,
  PatientSharingPermissions,
} from './types';
import { translations } from './translations';
import {
  User,
  Shield,
  Save,
  CheckCircle2,
  Phone,
  MapPin,
  Heart,
  FileText,
  Lock,
  Unlock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { playPositiveChime } from './speech';

interface CaregiverPatientProfileFormProps {
  language: Language;
  patient: Patient;
  caregiver: CaregiverUser;
  allCaregivers: CaregiverUser[];
  allDoctors: DoctorUser[];
  onSavePatient: (updatedPatient: Patient) => void;
}

const NE_STATES = [
  'Assam',
  'Manipur',
  'Meghalaya',
  'Tripura',
  'Nagaland',
  'Mizoram',
  'Arunachal Pradesh',
  'Sikkim',
];

const STAGE_OPTIONS = [
  'Stage 1 (Mild Forgetfulness)',
  'Stage 2 (Moderate Impairment)',
  'Stage 3 (Advanced Cognitive Decline)',
];

export const CaregiverPatientProfileForm: React.FC<CaregiverPatientProfileFormProps> = ({
  language,
  patient,
  caregiver,
  allCaregivers,
  allDoctors,
  onSavePatient,
}) => {
  const t = translations[language];

  // Form State initialized with patient data
  const [name, setName] = useState(patient.name);
  const [age, setAge] = useState<number | string>(patient.age);
  const [stateNE, setStateNE] = useState(patient.stateNE || 'Assam');
  const [location, setLocation] = useState(patient.location);
  const [stage, setStage] = useState(patient.stage);
  const [emergencyName, setEmergencyName] = useState(patient.emergencyContact?.name || '');
  const [emergencyRelation, setEmergencyRelation] = useState(patient.emergencyContact?.relation || '');
  const [emergencyPhone, setEmergencyPhone] = useState(patient.emergencyContact?.phone || '');
  const [emergencySecondaryPhone, setEmergencySecondaryPhone] = useState(patient.emergencyContact?.secondaryPhone || '');
  const [emergencyNotes, setEmergencyNotes] = useState(patient.emergencyNotes || '');

  // Privacy & Consent Permissions
  const [permissions, setPermissions] = useState<PatientSharingPermissions>(() => {
    return (
      patient.sharingPermissions || {
        caregivers: { [caregiver.id]: true },
        doctors: { 'doc-1': true, 'doc-2': false },
      }
    );
  });

  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Sync if patient changes (e.g. different account selected)
  useEffect(() => {
    setName(patient.name);
    setAge(patient.age);
    setStateNE(patient.stateNE || 'Assam');
    setLocation(patient.location);
    setStage(patient.stage);
    setEmergencyName(patient.emergencyContact?.name || '');
    setEmergencyRelation(patient.emergencyContact?.relation || '');
    setEmergencyPhone(patient.emergencyContact?.phone || '');
    setEmergencySecondaryPhone(patient.emergencyContact?.secondaryPhone || '');
    setEmergencyNotes(patient.emergencyNotes || '');
    setPermissions(
      patient.sharingPermissions || {
        caregivers: { [caregiver.id]: true },
        doctors: { 'doc-1': true, 'doc-2': false },
      }
    );
  }, [patient, caregiver]);

  const handleToggleCaregiverPermission = (caregiverId: string) => {
    setPermissions((prev) => ({
      ...prev,
      caregivers: {
        ...prev.caregivers,
        [caregiverId]: !prev.caregivers[caregiverId],
      },
    }));
  };

  const handleToggleDoctorPermission = (doctorId: string) => {
    setPermissions((prev) => ({
      ...prev,
      doctors: {
        ...prev.doctors,
        [doctorId]: !prev.doctors[doctorId],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPatient: Patient = {
      ...patient,
      name: name.trim() || patient.name,
      age: Number(age) || patient.age,
      stateNE,
      location: location.trim() || patient.location,
      stage,
      emergencyContact: {
        name: emergencyName.trim(),
        relation: emergencyRelation.trim(),
        phone: emergencyPhone.trim(),
        secondaryPhone: emergencySecondaryPhone.trim(),
      },
      emergencyNotes: emergencyNotes.trim(),
      sharingPermissions: permissions,
    };

    onSavePatient(updatedPatient);
    playPositiveChime();
    setSavedSuccessMsg(t.profileSavedSuccess);

    setTimeout(() => {
      setSavedSuccessMsg(null);
    }, 4500);
  };

  return (
    <form
      id="form-caregiver-patient-profile"
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-600/30 shadow-md space-y-8"
    >
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-bold text-xs sm:text-sm mb-2">
            <User className="w-4 h-4 text-amber-800" />
            <span>{t.profileSetupTitle}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
            {t.profileSetupTitle}
          </h3>
          <p className="text-slate-600 text-base font-medium mt-1">
            {t.profileSetupSubtitle}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-amber-900">
          <span className="font-bold">{t.loggedInAs}:</span> {caregiver.name} ({caregiver.relation})
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccessMsg && (
        <div
          id="notice-profile-saved"
          className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold text-base flex items-center gap-3 animate-fade-in"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* SECTION 1: Patient Personal Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
          <User className="w-5 h-5 text-amber-700" />
          <span>1. Personal & Regional Demographics</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Patient Name */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="input-patient-name">
              {t.fieldPatientName} <span className="text-red-500">*</span>
            </label>
            <input
              id="input-patient-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-600 focus:bg-amber-50/20 text-slate-900 font-semibold text-base transition-colors"
              placeholder="e.g. Ramesh Borah"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="input-patient-age">
              {t.fieldAge} <span className="text-red-500">*</span>
            </label>
            <input
              id="input-patient-age"
              type="number"
              min="40"
              max="115"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-600 focus:bg-amber-50/20 text-slate-900 font-semibold text-base transition-colors"
              placeholder="e.g. 74"
            />
          </div>

          {/* North East State */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="select-patient-state">
              {t.fieldStateNE} <span className="text-red-500">*</span>
            </label>
            <select
              id="select-patient-state"
              value={stateNE}
              onChange={(e) => setStateNE(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-600 bg-white text-slate-900 font-semibold text-base transition-colors cursor-pointer"
            >
              {NE_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District / City / Village */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="input-patient-location">
              {t.fieldCityLocation} <span className="text-red-500">*</span>
            </label>
            <input
              id="input-patient-location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-600 focus:bg-amber-50/20 text-slate-900 font-semibold text-base transition-colors"
              placeholder="e.g. Guwahati, Kamrup Metro"
            />
          </div>

          {/* Cognitive Impairment Stage */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="select-patient-stage">
              {t.fieldMedicalStage} <span className="text-red-500">*</span>
            </label>
            <select
              id="select-patient-stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-600 bg-white text-slate-900 font-semibold text-base transition-colors cursor-pointer"
            >
              {STAGE_OPTIONS.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Emergency Contact & Care Alerts */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
          <Phone className="w-5 h-5 text-red-600" />
          <span>2. Emergency Contacts & Medical Alerts</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="input-emergency-name">
              {t.fieldEmergencyName} <span className="text-red-500">*</span>
            </label>
            <input
              id="input-emergency-name"
              type="text"
              required
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-600 text-slate-900 font-semibold text-base"
              placeholder="e.g. Ananya Borah"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="input-emergency-relation">
              {t.fieldEmergencyRelation} <span className="text-red-500">*</span>
            </label>
            <input
              id="input-emergency-relation"
              type="text"
              required
              value={emergencyRelation}
              onChange={(e) => setEmergencyRelation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-600 text-slate-900 font-semibold text-base"
              placeholder="e.g. Daughter (Primary Caregiver)"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="input-emergency-phone">
              {t.fieldEmergencyPhone} <span className="text-red-500">*</span>
            </label>
            <input
              id="input-emergency-phone"
              type="tel"
              required
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-600 text-slate-900 font-semibold text-base"
              placeholder="e.g. +91 98640-12345"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="input-emergency-secondary">
              Secondary Contact Phone (Optional)
            </label>
            <input
              id="input-emergency-secondary"
              type="tel"
              value={emergencySecondaryPhone}
              onChange={(e) => setEmergencySecondaryPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-600 text-slate-900 font-semibold text-base"
              placeholder="e.g. +91 98640-67890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-800 mb-1.5" htmlFor="textarea-emergency-notes">
              {t.fieldEmergencyNotes}
            </label>
            <textarea
              id="textarea-emergency-notes"
              rows={3}
              value={emergencyNotes}
              onChange={(e) => setEmergencyNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-600 text-slate-900 font-medium text-base resize-none"
              placeholder="Enter special routines, allergies, sundowning habits, or soothing tips..."
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Patient-Managed Access Sharing (Consent Logic) */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="bg-emerald-50/60 rounded-2xl p-5 border-2 border-emerald-300">
          <div className="flex items-start gap-3 mb-2">
            <Shield className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-lg font-black text-slate-950">
                {t.privacyConsentTitle}
              </h4>
              <p className="text-sm text-slate-700 font-medium mt-0.5 leading-relaxed">
                {t.privacyConsentSub}
              </p>
            </div>
          </div>
          <p className="text-xs text-emerald-900 font-medium mt-2 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300">
            ℹ️ {t.consentNotice}
          </p>
        </div>

        {/* Doctor Sharing Consent List */}
        <div className="space-y-3">
          <h5 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            {t.registeredDoctors} (Clinical Telemetry Access):
          </h5>

          <div className="space-y-2.5">
            {allDoctors.map((doc) => {
              const isAllowed = (permissions.doctors ?? {})[doc.id] !== false;
              return (
                <div
                  key={doc.id}
                  id={`consent-toggle-doctor-${doc.id}`}
                  className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    isAllowed
                      ? 'bg-emerald-50/40 border-emerald-400'
                      : 'bg-slate-50 border-slate-300 opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isAllowed
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isAllowed ? <Unlock className="w-5 h-5 text-emerald-800" /> : <Lock className="w-5 h-5 text-slate-600" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 block text-base">
                        {doc.name}
                      </span>
                      <span className="text-xs text-slate-600 block">
                        {doc.qualification} • {doc.hospital}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isAllowed
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {isAllowed ? t.sharingEnabled : t.sharingDisabled}
                    </span>

                    <button
                      type="button"
                      id={`btn-toggle-doctor-consent-${doc.id}`}
                      onClick={() => handleToggleDoctorPermission(doc.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border-2 ${
                        isAllowed
                          ? 'bg-red-600 hover:bg-red-700 text-white border-red-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                      }`}
                    >
                      {isAllowed ? 'Revoke Access' : 'Grant Access'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Caregiver Sharing Consent List */}
        <div className="space-y-3 pt-3">
          <h5 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            {t.registeredCaregivers} (Routine & Checklist Access):
          </h5>

          <div className="space-y-2.5">
            {allCaregivers.map((cg) => {
              const isAllowed = (permissions.caregivers ?? {})[cg.id] !== false;
              const isSelf = cg.id === caregiver.id;
              return (
                <div
                  key={cg.id}
                  id={`consent-toggle-caregiver-${cg.id}`}
                  className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    isAllowed
                      ? 'bg-amber-50/40 border-amber-400'
                      : 'bg-slate-50 border-slate-300 opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isAllowed
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Heart className="w-5 h-5 text-amber-800" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-950 block text-base">
                        {cg.name} ({cg.relation}) {isSelf && <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold ml-1">You</span>}
                      </span>
                      <span className="text-xs text-slate-600 block">
                        Phone: {cg.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isAllowed
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isAllowed ? t.sharingEnabled : t.sharingDisabled}
                    </span>

                    <button
                      type="button"
                      disabled={isSelf}
                      id={`btn-toggle-caregiver-consent-${cg.id}`}
                      onClick={() => handleToggleCaregiverPermission(cg.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                        isSelf
                          ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                          : isAllowed
                          ? 'bg-slate-700 hover:bg-slate-800 text-white border-slate-800 cursor-pointer'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 cursor-pointer'
                      }`}
                      title={isSelf ? 'Primary managing caregiver cannot revoke own access' : ''}
                    >
                      {isAllowed ? 'Pause Sync' : 'Allow Sync'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium">
          Changes will persist offline in local storage and synchronize automatically upon network availability.
        </p>

        <button
          type="submit"
          id="btn-save-patient-profile"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-slate-950 font-black text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-amber-400 active:scale-95"
        >
          <Save className="w-5 h-5 stroke-[2.5]" />
          <span>{t.btnSavePatientProfile}</span>
        </button>
      </div>
    </form>
  );
};
