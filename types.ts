export type Language = 'en' | 'as' | 'mni' | 'trp' | 'nag';

export type UserRole = 'patient' | 'caregiver' | 'doctor';

export type PortalType = 'login' | 'hub' | 'patient' | 'caregiver' | 'doctor';

export type PatientModuleType = 'photo_quiz' | 'situation_test' | 'grid_match';

export type RiskLevel = 'Stable' | 'Monitoring' | 'Attention Required';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
  secondaryPhone?: string;
}

export interface PatientSharingPermissions {
  caregivers: Record<string, boolean>; // caregiverId -> boolean
  doctors: Record<string, boolean>;    // doctorId -> boolean
}

export interface CaregiverUser {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  patientId: string;
}

export interface DoctorUser {
  id: string;
  name: string;
  qualification: string;
  hospital: string;
  assignedPatientIds: string[];
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  avatar?: string;
  doctorId?: string;
  caregiverId?: string;
  patientId?: string;
  accessCode?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  location: string;
  stateNE?: string;
  stage: string;
  riskLevel: RiskLevel;
  avatarSeed: string;
  engagementScore: number;
  memoryAccuracy: number;
  adherenceRate: number;
  trend30Days: number[];
  clinicalNotes: ClinicalNote[];
  linkedCaregiverId: string;
  linkedDoctorIds: string[];
  emergencyContact: EmergencyContact;
  emergencyNotes?: string;
  sharingPermissions: PatientSharingPermissions;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  author: string;
  date: string;
  category: 'Observation' | 'Medication' | 'Cognitive Metric' | 'Family Update';
  text: string;
}

export interface ChecklistItem {
  id: string;
  labelKey: string;
  time: string;
  category: 'medicine' | 'hydration' | 'meal' | 'activity' | 'sleep';
  completed: boolean;
}

export interface FamilyPhotoItem {
  id: string;
  name: string;
  relation: string;
  imageUrl: string;
  isCustomUpload?: boolean;
  uploadedAt?: string;
  promptQuestionKey?: string;
  correctAnswer: boolean;
}

export interface CaregiverNote {
  id: string;
  timestamp: string;
  text: string;
  category: 'Mood' | 'Appetite' | 'Sleep' | 'General';
  notifiedDoctor: boolean;
}

export interface SituationScenario {
  id: string;
  iconName: string;
  promptKey: string;
  scenarioType: 'safety' | 'weather' | 'health';
  region?: string;
  promptText?: string;
  optionA: {
    labelKey: string;
    isCorrect: boolean;
    icon: string;
    text?: string;
  };
  optionB: {
    labelKey: string;
    isCorrect: boolean;
    icon: string;
    text?: string;
  };
}

export interface GridMemoryCard {
  id: string;
  symbolKey: string;
  titleKey: string;
  iconName: string;
  color: string;
}
