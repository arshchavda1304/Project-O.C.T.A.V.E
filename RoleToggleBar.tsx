import React, { useState } from 'react';
import { UserRole, UserAccount } from './types';
import { MOCK_ACCOUNTS } from './initialData';
import {
  Gamepad2,
  Stethoscope,
  HeartHandshake,
  Zap,
  ChevronDown,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { playPositiveChime } from './speech';

interface RoleToggleBarProps {
  currentRole: UserRole;
  onSwitchRole: (newUser: UserAccount) => void;
}

export const RoleToggleBar: React.FC<RoleToggleBarProps> = ({
  currentRole,
  onSwitchRole,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Preset demo accounts configured in MOCK_ACCOUNTS
  const doctorAccount = MOCK_ACCOUNTS.find((a) => a.role === 'doctor') || {
    id: 'user-doc-1',
    email: 'dr.baruah@projectoctave.org',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Pranab Baruah, MD',
    doctorId: 'doc-1',
  };

  const caregiverAccount = MOCK_ACCOUNTS.find((a) => a.role === 'caregiver') || {
    id: 'user-care-1',
    email: 'ananya@projectoctave.org',
    password: 'caregiver123',
    role: 'caregiver',
    name: 'Ananya Saikia',
    caregiverId: 'care-1',
    patientId: 'pat-1',
  };

  const patientAccount = MOCK_ACCOUNTS.find((a) => a.role === 'patient') || {
    id: 'user-pat-1',
    email: 'bhaben@projectoctave.org',
    password: 'patient123',
    accessCode: 'BHABEN74',
    role: 'patient',
    name: 'Bhaben Kalita',
    patientId: 'pat-1',
  };

  const handleRoleSelect = (role: UserRole) => {
    playPositiveChime();
    let targetAccount: UserAccount;
    if (role === 'doctor') targetAccount = doctorAccount;
    else if (role === 'caregiver') targetAccount = caregiverAccount;
    else targetAccount = patientAccount;

    onSwitchRole(targetAccount);
  };

  return (
    <div className="bg-[#0C261B] border-b border-emerald-600/30 text-emerald-100 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Label: Demo Bypass indicator */}
        <div className="flex items-center gap-2 font-semibold">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold">
            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Hackathon Demo Mode</span>
          </span>
          <span className="hidden sm:inline text-emerald-300/80">
            Auth Bypass & Role Switcher:
          </span>
        </div>

        {/* Center/Right: 3-Way Role Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-[#143E2B] p-1 rounded-xl border border-emerald-500/30 shadow-inner">
          
          {/* Patient View Button */}
          <button
            type="button"
            id="toggle-role-patient"
            onClick={() => handleRoleSelect('patient')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              currentRole === 'patient'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
            }`}
            title="Switch to Patient Memory Gym view"
          >
            <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
            <span>Patient Portal</span>
            {currentRole === 'patient' && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          {/* Caretaker View Button */}
          <button
            type="button"
            id="toggle-role-caregiver"
            onClick={() => handleRoleSelect('caregiver')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              currentRole === 'caregiver'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
            }`}
            title="Instant bypass to Caregiver Management Hub"
          >
            <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
            <span>Caregiver Portal</span>
            {currentRole === 'caregiver' && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          {/* Doctor View Button */}
          <button
            type="button"
            id="toggle-role-doctor"
            onClick={() => handleRoleSelect('doctor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              currentRole === 'doctor'
                ? 'bg-sky-400 text-slate-950 shadow'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
            }`}
            title="Instant bypass to Doctor EHR & Clinical Directives"
          >
            <Stethoscope className="w-3.5 h-3.5 shrink-0" />
            <span>Doctor Portal</span>
            {currentRole === 'doctor' && <Check className="w-3 h-3 stroke-[3]" />}
          </button>
        </div>

        {/* Right Info: Instant Access status */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-emerald-300/70 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Session Auto-Persists in Storage</span>
        </div>

      </div>
    </div>
  );
};
