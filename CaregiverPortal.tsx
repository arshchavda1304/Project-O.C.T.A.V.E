import React, { useState, useRef } from 'react';
import {
  Language,
  ChecklistItem,
  FamilyPhotoItem,
  CaregiverNote,
  Patient,
  CaregiverUser,
  DoctorUser,
} from './types';
import { translations } from './translations';
import {
  CheckSquare,
  Square,
  Upload,
  HeartHandshake,
  CheckCircle2,
  Bell,
  Clock,
  Sparkles,
  UserCheck,
  Send,
  Trash2,
  User,
  Gamepad2,
  Images,
  FileText,
  ChevronRight,
  Shield,
  MapPin,
} from 'lucide-react';
import { playPositiveChime } from './speech';
import { CaregiverPatientProfileForm } from './CaregiverPatientProfileForm';
import { PatientFaceManager } from './PatientFaceManager';

interface CaregiverPortalProps {
  language: Language;
  patient: Patient;
  caregiver: CaregiverUser;
  allCaregivers: CaregiverUser[];
  allDoctors: DoctorUser[];
  onSavePatient: (updatedPatient: Patient) => void;
  checklist: ChecklistItem[];
  onToggleChecklist: (id: string) => void;
  familyPhotos: FamilyPhotoItem[];
  onAddFamilyPhoto: (photo: FamilyPhotoItem) => void;
  onDeleteFamilyPhoto?: (id: string) => void;
  caregiverNotes: CaregiverNote[];
  onAddCaregiverNote: (text: string, category: CaregiverNote['category']) => void;
  onNotifyDoctor: () => void;
  doctorNotifiedBanner: boolean;
  onLaunchPatientExercises?: () => void;
}

export const CaregiverPortal: React.FC<CaregiverPortalProps> = ({
  language,
  patient,
  caregiver,
  allCaregivers,
  allDoctors,
  onSavePatient,
  checklist,
  onToggleChecklist,
  familyPhotos,
  onAddFamilyPhoto,
  onDeleteFamilyPhoto,
  caregiverNotes,
  onAddCaregiverNote,
  onNotifyDoctor,
  doctorNotifiedBanner,
  onLaunchPatientExercises,
}) => {
  const t = translations[language];

  // Active sub-tab in Caregiver Portal
  const [activeTab, setActiveTab] = useState<'profile' | 'routine' | 'photos' | 'notes' | 'security' | 'wanderguard'>('profile');

  // Photo Uploader state
  const [photoName, setPhotoName] = useState('');
  const [photoRelation, setPhotoRelation] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Caregiver Note State
  const [newNoteText, setNewNoteText] = useState('');
  const [noteCategory, setNoteCategory] = useState<CaregiverNote['category']>('Mood');

  // Wander Guard State
  const [wanderGuardStatus, setWanderGuardStatus] = useState<string | null>(null);

  // Checklist Calculations
  const completedCount = checklist.filter((item) => item.completed).length;
  const completionPercentage = Math.round((completedCount / checklist.length) * 100);

  // SVG Progress Ring calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoPreview) return;

    const newPhoto: FamilyPhotoItem = {
      id: `fam-custom-${Date.now()}`,
      name: photoName.trim() || 'Family Member',
      relation: photoRelation.trim() || 'Loved One',
      imageUrl: photoPreview,
      isCustomUpload: true,
      uploadedAt: new Date().toLocaleDateString(),
      correctAnswer: true,
    };

    onAddFamilyPhoto(newPhoto);
    playPositiveChime();
    setUploadSuccessMsg(t.photoSyncSuccess);

    // Reset input fields
    setPhotoName('');
    setPhotoRelation('');
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => {
      setUploadSuccessMsg(null);
    }, 4500);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    onAddCaregiverNote(newNoteText.trim(), noteCategory);
    playPositiveChime();
    setNewNoteText('');
  };

  const handleSetHomeBase = () => {
    if (!navigator.geolocation) {
      setWanderGuardStatus('Geolocation is not supported by your browser.');
      return;
    }
    
    setWanderGuardStatus('Fetching current location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const OTP_SERVER_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OTP_SERVER_URL || 'http://127.0.0.1:4001';
          const res = await fetch(`${OTP_SERVER_URL}/api/wander-guard/home`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          });
          const data = await res.json();
          if (data.success) {
            setWanderGuardStatus('Home base successfully updated!');
            playPositiveChime();
            setTimeout(() => setWanderGuardStatus(null), 4000);
          } else {
            setWanderGuardStatus('Failed to update home base.');
          }
        } catch (err) {
          console.error(err);
          setWanderGuardStatus('Network error while updating home base.');
        }
      },
      (error) => {
        console.error(error);
        setWanderGuardStatus('Error fetching location. Please ensure location permissions are granted.');
      }
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10 animate-fade-in">
      {/* Header Banner with Caregiver & Linked Patient Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-600/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-sm mb-2">
            <HeartHandshake className="w-4 h-4 text-amber-800" />
            <span>{t.portalCaregiverTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950">
            {t.caregiverHeader}
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-700 font-semibold mt-2">
            <span className="bg-amber-100/70 text-amber-950 px-3 py-1 rounded-xl border border-amber-300">
              👤 {t.loggedInAs}: <strong>{caregiver.name} ({caregiver.relation})</strong>
            </span>
            <span className="bg-emerald-100/70 text-emerald-950 px-3 py-1 rounded-xl border border-emerald-300">
              👴 {t.linkedPatientLabel}: <strong>{patient.name}</strong> ({patient.age}y, {patient.stateNE || patient.location})
            </span>
          </div>
        </div>

        {/* Action Group: Guide in Exercises + Notify Doctor */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          {onLaunchPatientExercises && (
            <button
              id="btn-caregiver-launch-patient-exercises"
              onClick={onLaunchPatientExercises}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-[#15803D] hover:bg-[#166534] active:bg-[#14532D] text-white font-black text-base shadow-md border-2 border-emerald-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Gamepad2 className="w-5 h-5 stroke-[2.5]" />
              <span>{t.guidePatientTest}</span>
            </button>
          )}

          <button
            id="btn-caregiver-notify-doctor"
            onClick={onNotifyDoctor}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-black text-base shadow-md border-2 border-red-400 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Bell className="w-5 h-5 stroke-[2.5]" />
            <span>{t.btnNotifyDoctor}</span>
          </button>
        </div>
      </div>

      {/* Doctor Alert Confirmation Banner */}
      {doctorNotifiedBanner && (
        <div className="p-5 rounded-2xl bg-red-100 border-3 border-red-500 text-red-950 font-black text-xl flex items-center gap-3 shadow-md animate-pulse">
          <Bell className="w-7 h-7 text-red-700 shrink-0" />
          <span>{t.doctorNotifiedAlert}</span>
        </div>
      )}

      {/* Portal Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#F3EFEA] p-2 rounded-2xl border-2 border-amber-200">
        <button
          id="tab-btn-profile"
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-3 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-amber-600 text-slate-950 shadow-md ring-2 ring-amber-300'
              : 'text-slate-800 hover:bg-amber-100'
          }`}
        >
          <User className="w-5 h-5 stroke-[2.5]" />
          <span>{t.tabProfileSetup}</span>
        </button>

        <button
          id="tab-btn-routine"
          onClick={() => setActiveTab('routine')}
          className={`px-5 py-3 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'routine'
              ? 'bg-amber-600 text-slate-950 shadow-md ring-2 ring-amber-300'
              : 'text-slate-800 hover:bg-amber-100'
          }`}
        >
          <CheckSquare className="w-5 h-5 stroke-[2.5]" />
          <span>{t.tabDailyRoutine} ({completionPercentage}%)</span>
        </button>

        <button
          id="tab-btn-photos"
          onClick={() => setActiveTab('photos')}
          className={`px-5 py-3 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'photos'
              ? 'bg-amber-600 text-slate-950 shadow-md ring-2 ring-amber-300'
              : 'text-slate-800 hover:bg-amber-100'
          }`}
        >
          <Images className="w-5 h-5 stroke-[2.5]" />
          <span>{t.tabMemoryStudio} ({familyPhotos.length})</span>
        </button>

        <button
          id="tab-btn-notes"
          onClick={() => setActiveTab('notes')}
          className={`px-5 py-3 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-amber-600 text-slate-950 shadow-md ring-2 ring-amber-300'
              : 'text-slate-800 hover:bg-amber-100'
          }`}
        >
          <FileText className="w-5 h-5 stroke-[2.5]" />
          <span>{t.tabCaregiverLog}</span>
        </button>

        <button
          id="tab-btn-security"
          onClick={() => setActiveTab('security')}
          className={`px-5 py-3 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-emerald-600 text-slate-950 shadow-md ring-2 ring-emerald-300'
              : 'text-slate-800 hover:bg-emerald-100'
          }`}
        >
          <Shield className="w-5 h-5 stroke-[2.5]" />
          <span>Face Security Management</span>
        </button>

        <button
          id="tab-btn-wanderguard"
          onClick={() => setActiveTab('wanderguard')}
          className={`px-5 py-3 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'wanderguard'
              ? 'bg-rose-600 text-slate-50 shadow-md ring-2 ring-rose-300'
              : 'text-slate-800 hover:bg-rose-100'
          }`}
        >
          <MapPin className="w-5 h-5 stroke-[2.5]" />
          <span>Wander Guard (Geofencing)</span>
        </button>
      </div>

      {/* TAB CONTENT 1: PATIENT SETUP & PROFILE FORM */}
      {activeTab === 'profile' && (
        <div className="space-y-8">
          <CaregiverPatientProfileForm
            language={language}
            patient={patient}
            caregiver={caregiver}
            allCaregivers={allCaregivers}
            allDoctors={allDoctors}
            onSavePatient={onSavePatient}
          />
        </div>
      )}

      {/* TAB CONTENT 5: FACE SECURITY MANAGEMENT */}
      {activeTab === 'security' && (
        <div className="space-y-8 animate-fade-in">
          <PatientFaceManager />
        </div>
      )}

      {/* TAB CONTENT 6: WANDER GUARD SETTINGS */}
      {activeTab === 'wanderguard' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-rose-500 shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-3 mb-2">
              <MapPin className="w-8 h-8 text-rose-600 stroke-[2.5]" />
              <span>Wander Guard Settings</span>
            </h3>
            <p className="text-lg text-slate-700 font-medium mb-6">
              Set the current location as the safe home base. If the patient wanders more than 100 meters from this location, an emergency SOS email will be sent immediately.
            </p>

            <button
              onClick={handleSetHomeBase}
              className="py-4 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-lg sm:text-xl shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border-2 border-rose-400 active:scale-95 transition-all"
            >
              <MapPin className="w-6 h-6" />
              <span>Set Current Location as Home Base</span>
            </button>

            {wanderGuardStatus && (
              <div className={`mt-4 p-4 rounded-xl font-bold text-lg inline-block border-2 ${
                wanderGuardStatus.includes('success') 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : wanderGuardStatus.includes('Fetching')
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-red-100 text-red-800 border-red-300'
              }`}>
                {wanderGuardStatus}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: DAILY ROUTINE CHECKLIST */}
      {activeTab === 'routine' && (
        <div id="section-daily-checklist" className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-500 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b-2 border-slate-200">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-3">
                <CheckSquare className="w-8 h-8 text-amber-600 stroke-[2.5]" />
                <span>{t.routineSectionTitle}</span>
              </h3>
              <p className="text-lg text-slate-700 font-medium mt-1">
                {t.routineSectionDesc} for <strong>{patient.name}</strong>
              </p>
            </div>

            {/* Interactive Visual Daily Progress Ring */}
            <div className="flex items-center gap-4 bg-[#FAF7F0] px-5 py-3 rounded-2xl border-2 border-amber-300">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#E2E8F0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#D97706"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute font-black text-xl text-slate-900">
                  {completionPercentage}%
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-600">Daily Goal</p>
                <p className="text-lg font-black text-slate-950">
                  {completedCount} / {checklist.length} Completed
                </p>
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            {checklist.map((item) => {
              const labelText =
                item.labelKey in t
                  ? (t as unknown as Record<string, string>)[item.labelKey]
                  : item.labelKey;

              return (
                <div
                  key={item.id}
                  id={`checklist-item-${item.id}`}
                  onClick={() => {
                    playPositiveChime();
                    onToggleChecklist(item.id);
                  }}
                  className={`p-5 rounded-2xl border-3 flex items-center justify-between gap-4 cursor-pointer transition-all duration-150 shadow-sm ${
                    item.completed
                      ? 'bg-emerald-50/70 border-emerald-500 text-slate-900'
                      : 'bg-[#FAF8F5] border-slate-300 text-slate-900 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                        item.completed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border-2 border-slate-300 text-transparent'
                      }`}
                    >
                      {item.completed && <CheckCircle2 className="w-6 h-6 stroke-[3]" />}
                    </div>

                    <div>
                      <p
                        className={`text-xl font-black ${
                          item.completed ? 'line-through text-slate-600' : 'text-slate-950'
                        }`}
                      >
                        {labelText}
                      </p>
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-4 h-4 text-amber-700" />
                        <span>Scheduled: {item.time}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-xl font-black text-sm uppercase tracking-wider ${
                      item.completed
                        ? 'bg-emerald-200 text-emerald-950'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {item.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: FAMILY PHOTO STUDIO */}
      {activeTab === 'photos' && (
        <div id="section-photo-uploader" className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-600 shadow-xl space-y-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-3">
              <Upload className="w-8 h-8 text-amber-700 stroke-[2.5]" />
              <span>{t.photoUploaderTitle}</span>
            </h3>
            <p className="text-lg text-slate-700 font-medium mt-1">
              {t.photoUploaderDesc}
            </p>
          </div>

          {/* Sync Success Alert */}
          {uploadSuccessMsg && (
            <div
              id="notice-photo-synced"
              className="p-5 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold text-lg flex items-center gap-3 animate-fade-in"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}

          {/* Upload Form */}
          <form onSubmit={handleUploadSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo Picker */}
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  {t.choosePhotoBtn}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-2xl border-2 border-slate-300 bg-slate-50 font-medium text-slate-700 cursor-pointer focus:border-amber-600"
                  required
                />
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  PNG, JPG, or WebP. Processed entirely on-device offline.
                </p>
              </div>

              {/* Photo Preview if selected */}
              {photoPreview && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F5] border-2 border-amber-300">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-xl object-cover border-2 border-amber-500 shadow-sm"
                  />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                      Ready to Sync
                    </p>
                    <p className="text-base font-black text-slate-900">{photoName || 'Name'}</p>
                    <p className="text-sm font-semibold text-slate-600">{photoRelation || 'Relation'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  {t.inputPersonName}
                </label>
                <input
                  type="text"
                  value={photoName}
                  onChange={(e) => setPhotoName(e.target.value)}
                  placeholder="e.g. Rahul Borah"
                  className="w-full p-3.5 text-base font-medium rounded-2xl border-2 border-slate-300 focus:border-amber-600 focus:outline-none bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">
                  {t.inputRelationship}
                </label>
                <input
                  type="text"
                  value={photoRelation}
                  onChange={(e) => setPhotoRelation(e.target.value)}
                  placeholder="e.g. Eldest Son, Guwahati"
                  className="w-full p-3.5 text-base font-medium rounded-2xl border-2 border-slate-300 focus:border-amber-600 focus:outline-none bg-slate-50"
                  required
                />
              </div>
            </div>

            <button
              id="btn-submit-family-photo"
              type="submit"
              className="py-4 px-8 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-slate-950 font-black text-lg sm:text-xl shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border-2 border-amber-400 active:scale-95 transition-all"
            >
              <Upload className="w-5 h-5" />
              <span>{t.btnSyncToQuiz}</span>
            </button>
          </form>

          {/* List of currently active memory photos */}
          <div className="pt-6 border-t-2 border-slate-200">
            <h4 className="text-xl font-black text-slate-950 mb-4">
              {t.photoPreviewTitle} ({familyPhotos.length} active in quiz)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {familyPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-slate-300 flex flex-col justify-between"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.name}
                    className="w-full h-36 rounded-xl object-cover border border-slate-200 mb-2"
                  />
                  <div>
                    <p className="font-black text-slate-900 text-base">{photo.name}</p>
                    <p className="text-xs font-bold text-slate-600">{photo.relation}</p>
                    {photo.isCustomUpload && (
                      <span className="text-[10px] font-extrabold uppercase bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full inline-block mt-1">
                        Caregiver Added
                      </span>
                    )}
                  </div>
                  {onDeleteFamilyPhoto && (
                    <button
                      onClick={() => onDeleteFamilyPhoto(photo.id)}
                      className="mt-2 text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 self-end cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: CAREGIVER LOG & NOTES */}
      {activeTab === 'notes' && (
        <div id="section-caregiver-notes" className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-700 shadow-xl space-y-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-3">
              <FileText className="w-8 h-8 text-slate-700 stroke-[2.5]" />
              <span>{t.notesSectionTitle}</span>
            </h3>
            <p className="text-lg text-slate-700 font-medium mt-1">
              {t.notesSectionDesc}
            </p>
          </div>

          {/* New Note Form */}
          <form onSubmit={handleSaveNote} className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-800 mr-2">Category:</span>
              {(['Mood', 'Appetite', 'Sleep', 'General'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setNoteCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    noteCategory === cat
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder={t.inputNotePlaceholder}
              className="w-full p-4 text-base sm:text-lg font-medium rounded-2xl border-2 border-slate-300 focus:border-slate-800 focus:outline-none bg-slate-50"
              required
            />

            <button
              id="btn-save-caregiver-note"
              type="submit"
              className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-base shadow-md flex items-center gap-2 cursor-pointer border-2 border-slate-600"
            >
              <Send className="w-5 h-5" />
              <span>{t.btnSaveNote}</span>
            </button>
          </form>

          {/* List of recent notes */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="text-xl font-black text-slate-900 mb-3">
              {t.recentNotesList}
            </h4>

            {caregiverNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-[#FAF9F6] border-2 border-slate-200 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold">
                      {note.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {note.timestamp}
                    </span>
                  </div>

                  {note.notifiedDoctor && (
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300 flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      Doctor Alerted
                    </span>
                  )}
                </div>

                <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
