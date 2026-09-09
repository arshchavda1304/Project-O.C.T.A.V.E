import React, { useState, useEffect } from 'react';
import {
  Language,
  ChecklistItem,
  FamilyPhotoItem,
  CaregiverNote,
  Patient,
  ClinicalNote,
  CaregiverUser,
  DoctorUser,
  UserAccount,
} from './types';
import { translations } from './translations';
import {
  INITIAL_PATIENTS,
  INITIAL_CHECKLIST,
  INITIAL_FAMILY_PHOTOS,
  INITIAL_CAREGIVER_NOTES,
  INITIAL_CAREGIVERS,
  INITIAL_DOCTORS,
  MOCK_ACCOUNTS,
} from './initialData';
import { loadFromStorage, saveToStorage } from './storage';
import { LoginScreen } from './LoginScreen';
import { DoctorPortalLayout } from './DoctorPortalLayout';
import { CaretakerPortalLayout } from './CaretakerPortalLayout';
import { PatientPortalLayout } from './PatientPortalLayout';
import { OfflineBanner } from './OfflineBanner';
import { playPositiveChime } from './speech';
import { AudioControlsBar } from './AudioControlsBar';

export default function App() {
  // 1. Language & Accessibility Preferences
  const [language, setLanguage] = useState<Language>(() =>
    loadFromStorage<Language>('smriti_language', 'en')
  );

  const [textSize, setTextSize] = useState<'normal' | 'large' | 'extralarge'>(() =>
    loadFromStorage<'normal' | 'large' | 'extralarge'>('smriti_text_size', 'normal')
  );

  // 2. Active Authenticated User Session (null = Show Login Screen)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    loadFromStorage<UserAccount | null>('smriti_auth_user', null)
  );
  const [assistingCaregiverUser, setAssistingCaregiverUser] = useState<UserAccount | null>(null);

  // 3. System Entities & Role States
  const [caregivers] = useState<CaregiverUser[]>(INITIAL_CAREGIVERS);
  const [doctors, setDoctors] = useState<DoctorUser[]>(INITIAL_DOCTORS);
  const [activeDoctorId, setActiveDoctorId] = useState<string>(() => {
    return currentUser?.role === 'doctor' && currentUser.doctorId ? currentUser.doctorId : 'doc-1';
  });

  // 4. Offline & Connectivity State
  const [realOnline, setRealOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() =>
    loadFromStorage<boolean>('smriti_simulated_offline', false)
  );
  const [unsyncedCount, setUnsyncedCount] = useState<number>(() =>
    loadFromStorage<number>('smriti_unsynced_count', 0)
  );
  const [syncSuccessNotice, setSyncSuccessNotice] = useState<boolean>(false);
  const [lastSyncMessage, setLastSyncMessage] = useState<string | null>(null);

  const effectiveOnline = realOnline && !isSimulatedOffline;

  // 5. Core Application Data (shared across roles with backward-compatibility merge)
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() =>
    loadFromStorage<ChecklistItem[]>('smriti_checklist', INITIAL_CHECKLIST)
  );

  const [familyPhotos, setFamilyPhotos] = useState<FamilyPhotoItem[]>(() =>
    loadFromStorage<FamilyPhotoItem[]>('smriti_family_photos', INITIAL_FAMILY_PHOTOS)
  );

  const [caregiverNotes, setCaregiverNotes] = useState<CaregiverNote[]>(() =>
    loadFromStorage<CaregiverNote[]>('smriti_caregiver_notes', INITIAL_CAREGIVER_NOTES)
  );

  const [patients, setPatients] = useState<Patient[]>(() => {
    const cached = loadFromStorage<Patient[]>('smriti_patients', INITIAL_PATIENTS);
    return cached.map((p) => {
      const init = INITIAL_PATIENTS.find((ip) => ip.id === p.id);
      return {
        ...init,
        ...p,
        sharingPermissions: p.sharingPermissions || init?.sharingPermissions || {
          caregivers: { 'care-1': true, 'care-2': false },
          doctors: { 'doc-1': true, 'doc-2': false },
        },
        emergencyContact: p.emergencyContact || init?.emergencyContact || {
          name: 'Ananya Borah',
          relation: 'Daughter (Primary Caregiver)',
          phone: '+91 98640-12345',
        },
        emergencyNotes: p.emergencyNotes ?? init?.emergencyNotes,
        stateNE: p.stateNE || init?.stateNE || 'Assam',
        linkedCaregiverId: p.linkedCaregiverId || init?.linkedCaregiverId || 'care-1',
        linkedDoctorIds: p.linkedDoctorIds || init?.linkedDoctorIds || ['doc-1'],
      };
    });
  });

  const [doctorNotifiedBanner, setDoctorNotifiedBanner] = useState<boolean>(false);

  // Sync active doctor with logged in doctor
  useEffect(() => {
    if (currentUser?.role === 'doctor' && currentUser.doctorId) {
      setActiveDoctorId(currentUser.doctorId);
    }
  }, [currentUser]);

  // Save changes to localStorage
  useEffect(() => {
    saveToStorage('smriti_language', language);
  }, [language]);

  useEffect(() => {
    saveToStorage('smriti_text_size', textSize);
  }, [textSize]);

  useEffect(() => {
    saveToStorage('smriti_auth_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage('smriti_simulated_offline', isSimulatedOffline);
  }, [isSimulatedOffline]);

  useEffect(() => {
    saveToStorage('smriti_unsynced_count', unsyncedCount);
  }, [unsyncedCount]);

  useEffect(() => {
    saveToStorage('smriti_checklist', checklist);
  }, [checklist]);

  useEffect(() => {
    saveToStorage('smriti_family_photos', familyPhotos);
  }, [familyPhotos]);

  useEffect(() => {
    saveToStorage('smriti_caregiver_notes', caregiverNotes);
  }, [caregiverNotes]);

  useEffect(() => {
    saveToStorage('smriti_patients', patients);
  }, [patients]);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => {
      setRealOnline(true);
      if (!isSimulatedOffline) {
        handleTriggerSync();
      }
    };

    const handleOffline = () => {
      setRealOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline]);

  const handleTriggerSync = () => {
    setSyncSuccessNotice(true);
    playPositiveChime();
    setLastSyncMessage(translations[language].syncedSuccess);
    setUnsyncedCount(0);

    setTimeout(() => {
      setSyncSuccessNotice(false);
    }, 4500);
  };

  const handleToggleSimulatedOffline = () => {
    if (isSimulatedOffline) {
      setIsSimulatedOffline(false);
      handleTriggerSync();
    } else {
      setIsSimulatedOffline(true);
      setSyncSuccessNotice(false);
      setLastSyncMessage(null);
    }
  };

  const recordOfflineChange = () => {
    if (!effectiveOnline) {
      setUnsyncedCount((prev) => prev + 1);
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'doctor' && user.doctorId) {
      setActiveDoctorId(user.doctorId);
    }
  };

  const handleSignOut = () => {
    setAssistingCaregiverUser(null);
    setCurrentUser(null);
    saveToStorage('smriti_auth_user', null);
  };

  const handleReturnToCaregiver = () => {
    if (assistingCaregiverUser) {
      setCurrentUser(assistingCaregiverUser);
      setAssistingCaregiverUser(null);
    }
  };

  // Cross-Role Data Handlers
  const handleSavePatientProfile = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    recordOfflineChange();
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
    recordOfflineChange();
  };

  const handleAddFamilyPhoto = (newPhoto: FamilyPhotoItem) => {
    setFamilyPhotos((prev) => [newPhoto, ...prev]);
    recordOfflineChange();
  };

  const handleDeleteFamilyPhoto = (id: string) => {
    setFamilyPhotos((prev) => prev.filter((p) => p.id !== id));
    recordOfflineChange();
  };

  const handleAddCaregiverNote = (text: string, category: CaregiverNote['category']) => {
    const newNote: CaregiverNote = {
      id: `cnote-${Date.now()}`,
      timestamp: 'Just now',
      text,
      category,
      notifiedDoctor: false,
    };
    setCaregiverNotes((prev) => [newNote, ...prev]);
    recordOfflineChange();
  };

  const handleNotifyDoctor = () => {
    setDoctorNotifiedBanner(true);
    playPositiveChime();
    recordOfflineChange();

    setCaregiverNotes((prev) =>
      prev.map((n, idx) => (idx === 0 ? { ...n, notifiedDoctor: true } : n))
    );

    setTimeout(() => {
      setDoctorNotifiedBanner(false);
    }, 4500);
  };

  const handleAddClinicalNote = (patientId: string, noteText: string) => {
    const activeDoc = doctors.find((d) => d.id === activeDoctorId) || doctors[0];
    const newClinicalNote: ClinicalNote = {
      id: `cn-${Date.now()}`,
      patientId,
      author: activeDoc.name,
      date: 'Today, Just now',
      category: 'Observation',
      text: noteText,
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            clinicalNotes: [newClinicalNote, ...p.clinicalNotes],
          };
        }
        return p;
      })
    );
    recordOfflineChange();
  };

  // Live telemetry update when patient plays games
  const handlePatientGameActivity = (patientId: string) => {
    recordOfflineChange();
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const updatedAccuracy = Math.min(100, p.memoryAccuracy + 1);
          const updatedEngagement = Math.min(100, p.engagementScore + 1);
          const lastScore = p.trend30Days[p.trend30Days.length - 1];
          const newTrend = [...p.trend30Days.slice(1), Math.min(100, lastScore + 1)];

          return {
            ...p,
            memoryAccuracy: updatedAccuracy,
            engagementScore: updatedEngagement,
            trend30Days: newTrend,
          };
        }
        return p;
      })
    );
  };

  const textScaleClass =
    textSize === 'extralarge'
      ? 'text-scale-extralarge'
      : textSize === 'large'
      ? 'text-scale-large'
      : 'text-scale-normal';

  // SCENARIO 1: NOT LOGGED IN -> RENDER AUTH LOGIN PORTAL
  if (!currentUser) {
    return (
      <div className={`min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col justify-between ${textScaleClass}`}>
        <main className="flex-1 flex items-center justify-center">
          <LoginScreen
            language={language}
            onLoginSuccess={handleLoginSuccess}
          />
        </main>
        <footer className="bg-[#143E2B] text-emerald-100 py-4 px-4 text-center text-xs font-semibold">
          {translations[language].appName} • Multi-User Tele-Care System for North East India
        </footer>
        <AudioControlsBar language={language} />
      </div>
    );
  }

  // SCENARIO 2: LOGGED IN AS DOCTOR -> DEDICATED DOCTOR PORTAL
  if (currentUser.role === 'doctor') {
    const currentDoc =
      doctors.find((d) => d.id === activeDoctorId) || doctors[0];

    return (
      <div className={textScaleClass}>
        <OfflineBanner
          language={language}
          isOnline={effectiveOnline}
          unsyncedCount={unsyncedCount}
          syncSuccessNotice={syncSuccessNotice}
          onManualSync={handleTriggerSync}
        />
        <DoctorPortalLayout
          language={language}
          onLanguageChange={setLanguage}
          currentUser={currentUser}
          currentDoctor={currentDoc}
          allDoctors={doctors}
          patients={patients}
          onSelectDoctor={setActiveDoctorId}
          onAddClinicalNote={handleAddClinicalNote}
          onSignOut={handleSignOut}
          isOnline={effectiveOnline}
          isSimulatedOffline={isSimulatedOffline}
          onToggleSimulatedOffline={handleToggleSimulatedOffline}
          unsyncedCount={unsyncedCount}
          onSwitchRole={handleLoginSuccess}
        />
        <AudioControlsBar language={language} />
      </div>
    );
  }

  // SCENARIO 3: LOGGED IN AS CARETAKER -> DEDICATED CARETAKER PORTAL
  if (currentUser.role === 'caregiver') {
    const currentCaregiver =
      caregivers.find((c) => c.id === currentUser.caregiverId) || caregivers[0];
    const linkedPatient =
      patients.find((p) => p.id === currentCaregiver.patientId) || patients[0];

    return (
      <div className={textScaleClass}>
        <OfflineBanner
          language={language}
          isOnline={effectiveOnline}
          unsyncedCount={unsyncedCount}
          syncSuccessNotice={syncSuccessNotice}
          onManualSync={handleTriggerSync}
        />
        <CaretakerPortalLayout
          language={language}
          onLanguageChange={setLanguage}
          currentUser={currentUser}
          currentCaregiver={currentCaregiver}
          linkedPatient={linkedPatient}
          allCaregivers={caregivers}
          allDoctors={doctors}
          onSavePatient={handleSavePatientProfile}
          checklist={checklist}
          onToggleChecklist={handleToggleChecklist}
          familyPhotos={familyPhotos}
          onAddFamilyPhoto={handleAddFamilyPhoto}
          onDeleteFamilyPhoto={handleDeleteFamilyPhoto}
          caregiverNotes={caregiverNotes}
          onAddCaregiverNote={handleAddCaregiverNote}
          onNotifyDoctor={handleNotifyDoctor}
          doctorNotifiedBanner={doctorNotifiedBanner}
          onSignOut={handleSignOut}
          onLaunchPatientExercises={() => {
            // Save current caregiver session, then switch to patient view
            const targetPatientAccount = MOCK_ACCOUNTS.find(
              (a) => a.role === 'patient' && a.patientId === linkedPatient.id
            );
            if (targetPatientAccount) {
              setAssistingCaregiverUser(currentUser);
              setCurrentUser(targetPatientAccount);
            }
          }}
          isOnline={effectiveOnline}
          isSimulatedOffline={isSimulatedOffline}
          onToggleSimulatedOffline={handleToggleSimulatedOffline}
          unsyncedCount={unsyncedCount}
          onSwitchRole={handleLoginSuccess}
        />
        <AudioControlsBar language={language} />
      </div>
    );
  }

  // SCENARIO 4: LOGGED IN AS ELDER PATIENT -> PURE COGNITIVE MEMORY GYM
  if (currentUser.role === 'patient') {
    const currentPatient =
      patients.find((p) => p.id === currentUser.patientId) || patients[0];

    return (
      <div className={textScaleClass}>
        {/* Caregiver Assisted Mode banner — shown when caregiver guided elder into exercises */}
        {assistingCaregiverUser && (
          <div className="bg-indigo-700 text-white px-4 py-2.5 sticky top-0 z-50 shadow-md border-b-2 border-indigo-900 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-bold text-sm">
              🤝 Caregiver Assisted Mode — Guiding <span className="text-indigo-200">{currentPatient.name}</span>
            </span>
            <button
              id="btn-return-to-caretaker-hub"
              onClick={handleReturnToCaregiver}
              className="px-4 py-1.5 rounded-xl bg-white text-indigo-800 font-black text-xs hover:bg-indigo-100 transition-colors active:scale-95 cursor-pointer"
            >
              ← Return to Caretaker Hub
            </button>
          </div>
        )}
        <OfflineBanner
          language={language}
          isOnline={effectiveOnline}
          unsyncedCount={unsyncedCount}
          syncSuccessNotice={syncSuccessNotice}
          onManualSync={handleTriggerSync}
        />
        <PatientPortalLayout
          language={language}
          onLanguageChange={setLanguage}
          textSize={textSize}
          onTextSizeChange={setTextSize}
          currentUser={currentUser}
          currentPatient={currentPatient}
          familyPhotos={familyPhotos}
          onGameActivityCompleted={() => handlePatientGameActivity(currentPatient.id)}
          onSignOut={assistingCaregiverUser ? handleReturnToCaregiver : handleSignOut}
          onSwitchRole={handleLoginSuccess}
        />
        <AudioControlsBar language={language} />
      </div>
    );
  }

  return null;
}
