import React, { useState, useRef } from 'react';
import {
  Language,
  ChecklistItem,
  FamilyPhotoItem,
  CaregiverNote,
  Patient,
  CaregiverUser,
  DoctorUser,
  UserAccount,
} from './types';
import { translations } from './translations';
import {
  HeartHandshake,
  User,
  CheckSquare,
  Images,
  FileText,
  Bell,
  LogOut,
  Upload,
  Clock,
  CheckCircle2,
  Trash2,
  Send,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  Gamepad2,
  Shield,
  MapPin,
} from 'lucide-react';
import { playPositiveChime } from './speech';
import { CaregiverPatientProfileForm } from './CaregiverPatientProfileForm';
import { PatientFaceManager } from './PatientFaceManager';
import { RoleToggleBar } from './RoleToggleBar';

interface CaretakerPortalLayoutProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: UserAccount;
  currentCaregiver: CaregiverUser;
  linkedPatient: Patient;
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
  onSignOut: () => void;
  onLaunchPatientExercises: () => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  unsyncedCount: number;
  onSwitchRole?: (newUser: UserAccount) => void;
}

export const CaretakerPortalLayout: React.FC<CaretakerPortalLayoutProps> = ({
  language,
  onLanguageChange,
  currentUser,
  currentCaregiver,
  linkedPatient,
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
  onSignOut,
  onLaunchPatientExercises,
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  unsyncedCount,
  onSwitchRole,
}) => {
  const t = translations[language];

  // Active sub-tab in Caretaker Portal
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
  const completionPercentage = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  // Progress Ring
  const radius = 42;
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
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col animate-fade-in">
      {/* Role Toggle Bar with Auth Bypass (Demo / Quick Access) */}
      {onSwitchRole && (
        <RoleToggleBar
          currentRole={currentUser.role}
          onSwitchRole={onSwitchRole}
        />
      )}

      {/* 1. DEDICATED CARETAKER HEADER */}
      <header className="bg-[#78350F] text-white border-b-4 border-amber-600 shadow-lg sticky top-0 z-40">
        {/* Offline sync sub-bar */}
        <div className="bg-[#451A03] px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-amber-800">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Wifi className="w-3.5 h-3.5" />
                Caregiver Sync Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-200 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <WifiOff className="w-3.5 h-3.5" />
                Offline Mode ({unsyncedCount} records queued)
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleSimulatedOffline}
            className="px-2 py-0.5 rounded bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs flex items-center gap-1 border border-amber-700 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            {isSimulatedOffline ? 'Reconnect' : 'Simulate Offline'}
          </button>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 border border-amber-300 flex items-center justify-center font-black shadow-inner">
                <HeartHandshake className="w-6 h-6 stroke-[2.5]" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  O.C.T.A.V.E. <span className="text-xs bg-amber-900 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-md font-bold">Caretaker Hub</span>
                </h1>
                <p className="text-xs text-amber-200 font-medium">
                  Caretaker: <strong>{currentCaregiver.name}</strong> • Linked to <strong>{linkedPatient.name}</strong> ({linkedPatient.age}y)
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls: Quick Exercise Launcher, Emergency Doctor Alert, Language, Sign Out */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-end">
            {/* Guide Patient in Exercises */}
            <button
              type="button"
              id="btn-caretaker-launch-patient"
              onClick={onLaunchPatientExercises}
              className="px-3.5 py-1.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow border border-emerald-400 cursor-pointer transition-transform active:scale-95"
              title="Launch elder games directly on this device"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Guide {linkedPatient.name.split(' ')[0]}</span>
            </button>

            {/* Emergency Doctor Alert */}
            <button
              type="button"
              id="btn-caretaker-notify-doctor"
              onClick={onNotifyDoctor}
              className="px-3.5 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow border border-red-400 cursor-pointer transition-transform active:scale-95"
            >
              <Bell className="w-4 h-4" />
              <span>Alert Doctor</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-amber-900/80 px-2.5 py-1 rounded-xl border border-amber-600 text-xs text-white">
              <Globe className="w-3.5 h-3.5 text-amber-300 mr-1.5" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-white font-bold cursor-pointer pr-1 focus:outline-none"
              >
                <option value="en" className="bg-amber-950 text-white">English</option>
                <option value="as" className="bg-amber-950 text-white">অসমীয়া</option>
                <option value="mni" className="bg-amber-950 text-white">মৈতৈলোন্</option>
                <option value="trp" className="bg-amber-950 text-white">ককবরক</option>
                <option value="nag" className="bg-amber-950 text-white">Nagamese</option>
              </select>
            </div>

            {/* Dedicated Sign Out Button */}
            <button
              type="button"
              id="btn-caretaker-sign-out"
              onClick={onSignOut}
              className="px-3.5 py-1.5 rounded-xl bg-red-800 hover:bg-red-900 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow border border-red-600 cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CARETAKER DASHBOARD CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Doctor Alert Sent Banner */}
        {doctorNotifiedBanner && (
          <div className="p-4 rounded-2xl bg-red-100 border-3 border-red-500 text-red-950 font-black text-lg flex items-center gap-3 shadow animate-pulse">
            <Bell className="w-6 h-6 text-red-700 shrink-0" />
            <span>Emergency notice transmitted to Dr. P. Baruah and on-duty regional neurologists!</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#F3EFEA] p-2 rounded-2xl border-2 border-amber-300 shadow-sm">
          <button
            type="button"
            id="caretaker-tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-600 text-slate-950 shadow-md ring-2 ring-amber-300'
                : 'text-slate-800 hover:bg-amber-100'
            }`}
          >
            <User className="w-4 h-4 stroke-[2.5]" />
            <span>Patient Setup & Profile Form</span>
          </button>

          <button
            type="button"
            id="caretaker-tab-routine"
            onClick={() => setActiveTab('routine')}
            className={`px-5 py-2.5 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'routine'
                ? 'bg-amber-600 text-slate-950 shadow-md ring-2 ring-amber-300'
                : 'text-slate-800 hover:bg-amber-100'
            }`}
          >
            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
            <span>Daily Routine Checklist ({completionPercentage}%)</span>
          </button>

          <button
            type="button"
            id="caretaker-tab-photos"
            onClick={() => setActiveTab('photos')}
            className={`px-5 py-2.5 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-amber-600 text-slate-950 shadow-md ring-2 ring-amber-300'
                : 'text-slate-800 hover:bg-amber-100'
            }`}
          >
            <Images className="w-4 h-4 stroke-[2.5]" />
            <span>Reminiscence Photo Studio ({familyPhotos.length})</span>
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
            <span>Daily Notes & Mood Log</span>
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
              patient={linkedPatient}
              caregiver={currentCaregiver}
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

        {/* TAB 2: DAILY ROUTINE CHECKLIST */}
        {activeTab === 'routine' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-500 shadow-md space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <h3 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                  <CheckSquare className="w-7 h-7 text-amber-600" />
                  <span>Daily Care Routine for {linkedPatient.name}</span>
                </h3>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  Keep daily hydration, medication, and sleep habits strictly regular to minimize disorientation.
                </p>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center gap-4 bg-[#FAF7F0] px-4 py-2.5 rounded-2xl border border-amber-300">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} stroke="#E2E8F0" strokeWidth="10" fill="transparent" />
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
                  <span className="absolute font-black text-sm text-slate-900">
                    {completionPercentage}%
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Today's Progress</p>
                  <p className="text-base font-black text-slate-950">
                    {completedCount} / {checklist.length} Completed
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {checklist.map((item) => {
                const labelText =
                  item.labelKey in t
                    ? (t as unknown as Record<string, string>)[item.labelKey]
                    : item.labelKey;

                return (
                  <div
                    key={item.id}
                    id={`caretaker-checklist-${item.id}`}
                    onClick={() => {
                      playPositiveChime();
                      onToggleChecklist(item.id);
                    }}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      item.completed
                        ? 'bg-emerald-50/70 border-emerald-400 text-slate-900'
                        : 'bg-[#FAF8F5] border-slate-300 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                          item.completed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border-2 border-slate-300 text-transparent'
                        }`}
                      >
                        {item.completed && <CheckCircle2 className="w-5 h-5 stroke-[3]" />}
                      </div>

                      <div>
                        <p
                          className={`text-base sm:text-lg font-black ${
                            item.completed ? 'line-through text-slate-500' : 'text-slate-950'
                          }`}
                        >
                          {labelText}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Scheduled: {item.time}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-xl font-bold text-xs uppercase ${
                        item.completed
                          ? 'bg-emerald-200 text-emerald-950'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {item.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: REMINISCENCE PHOTO STUDIO */}
        {activeTab === 'photos' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-600 shadow-md space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                <Upload className="w-7 h-7 text-amber-700" />
                <span>Family Memory Photo Studio for {linkedPatient.name}</span>
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-1">
                Uploaded family portraits automatically sync directly into {linkedPatient.name}'s daily Family Recognition Memory Quiz!
              </p>
            </div>

            {uploadSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-500 text-emerald-950 font-bold text-sm flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">
                    Select Family Member Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 font-medium text-xs text-slate-700 cursor-pointer focus:border-amber-600"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Stored securely offline in device storage.
                  </p>
                </div>

                {photoPreview && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-amber-300">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-amber-500"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                        Ready to Sync
                      </span>
                      <p className="text-sm font-black text-slate-900">{photoName || 'Name'}</p>
                      <p className="text-xs text-slate-600">{photoRelation || 'Relation'}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">
                    Person's Full Name
                  </label>
                  <input
                    type="text"
                    value={photoName}
                    onChange={(e) => setPhotoName(e.target.value)}
                    placeholder="e.g. Rahul Borah"
                    className="w-full p-3 text-sm font-medium rounded-xl border-2 border-slate-300 focus:border-amber-600 focus:outline-none bg-slate-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">
                    Relationship to {linkedPatient.name}
                  </label>
                  <input
                    type="text"
                    value={photoRelation}
                    onChange={(e) => setPhotoRelation(e.target.value)}
                    placeholder="e.g. Eldest Son, Guwahati"
                    className="w-full p-3 text-sm font-medium rounded-xl border-2 border-slate-300 focus:border-amber-600 focus:outline-none bg-slate-50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-slate-950 font-black text-sm shadow flex items-center gap-2 cursor-pointer border border-amber-400 active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Sync Photo to Patient Quiz</span>
              </button>
            </form>

            {/* Active Quiz Photos */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-base font-black text-slate-950 mb-3">
                Active Photos in {linkedPatient.name}'s Quiz ({familyPhotos.length}):
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {familyPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-[#FAF8F5] p-3 rounded-2xl border border-slate-300 flex flex-col justify-between"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.name}
                      className="w-full h-32 rounded-xl object-cover border border-slate-200 mb-2"
                    />
                    <div>
                      <p className="font-black text-slate-900 text-sm">{photo.name}</p>
                      <p className="text-xs font-semibold text-slate-600">{photo.relation}</p>
                      {photo.isCustomUpload && (
                        <span className="text-[9px] font-extrabold uppercase bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full inline-block mt-1">
                          Caregiver Added
                        </span>
                      )}
                    </div>
                    {onDeleteFamilyPhoto && (
                      <button
                        onClick={() => onDeleteFamilyPhoto(photo.id)}
                        className="mt-2 text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 self-end cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DAILY NOTES & MOOD LOG */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-700 shadow-md space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                <FileText className="w-7 h-7 text-slate-700" />
                <span>Daily Caregiver Notes & Observations</span>
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-1">
                Document daily behavioral patterns, sundowning symptoms, or diet shifts for {linkedPatient.name}.
              </p>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 mr-2">Category:</span>
                {(['Mood', 'Appetite', 'Sleep', 'General'] as const).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setNoteCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      noteCategory === cat
                        ? 'bg-slate-800 text-white shadow'
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
                placeholder="Describe how the patient felt today, meal completion, or afternoon alertness..."
                className="w-full p-3.5 text-sm font-medium rounded-xl border-2 border-slate-300 focus:border-slate-800 focus:outline-none bg-slate-50"
                required
              />

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer border border-slate-600"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </form>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Recent Observations:
              </h4>

              {caregiverNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 shadow-sm space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {note.category}
                    </span>
                    <span>{note.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
