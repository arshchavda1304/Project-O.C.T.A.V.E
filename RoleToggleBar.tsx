import React, { useState, useRef, useEffect } from 'react';
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
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ScanFace,
} from 'lucide-react';
import { playPositiveChime } from './speech';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';

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

  const [authModal, setAuthModal] = useState<{ role: 'doctor' | 'caregiver' } | null>(null);
  const [authId, setAuthId] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Security Face Verification State
  const [verificationState, setVerificationState] = useState<'checking_face' | 'login_fields'>('login_fields');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('Scanning face...');
  const [activeFaces, setActiveFaces] = useState<any[]>([]);
  const webcamRef = useRef<Webcam>(null);

  const OTP_SERVER_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OTP_SERVER_URL || 'http://127.0.0.1:4001';

  useEffect(() => {
    if (authModal && verificationState === 'checking_face' && !modelsLoaded) {
      const loadModels = async () => {
        try {
          const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
          ]);
          setModelsLoaded(true);
        } catch (error) {
          console.error("Error loading face models", error);
          setScanStatus("Failed to load security models.");
        }
      };
      loadModels();
    }
  }, [authModal, verificationState, modelsLoaded]);

  const stopWebcam = () => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleLiveScan = async () => {
    if (!webcamRef.current || !webcamRef.current.video || !modelsLoaded) return;
    
    try {
      const video = webcamRef.current.video;
      const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        let matchFound = false;
        for (const face of activeFaces) {
          const storedDescriptor = new Float32Array(face.descriptor);
          const distance = faceapi.euclideanDistance(storedDescriptor, detection.descriptor);
          if (distance < 0.55) {
            matchFound = true;
            break;
          }
        }
        
        if (matchFound) {
          // Patient recognized! Kick-out
          setScanStatus('Security Alert: Patient face recognized. Access restricted.');
          setTimeout(() => {
            handleCloseAuth();
          }, 3000);
        } else {
          // Pass-through
          setScanStatus('Authorized user detected. Proceeding to login...');
          setTimeout(() => {
            stopWebcam();
            setVerificationState('login_fields');
          }, 1500);
        }
      } else {
        setScanStatus('No face detected. Please position face clearly.');
      }
    } catch (err) {
      console.error(err);
      setScanStatus('Error during scan.');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authModal && verificationState === 'checking_face' && modelsLoaded && !scanStatus.includes('Alert') && !scanStatus.includes('Authorized')) {
      interval = setInterval(() => {
         handleLiveScan();
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [authModal, verificationState, modelsLoaded, scanStatus]);

  const handleCloseAuth = () => {
    stopWebcam();
    setAuthModal(null);
  };

  const handleRoleSelect = async (role: UserRole) => {
    playPositiveChime();
    if (role === 'patient') {
      onSwitchRole(patientAccount);
    } else {
      // Fetch active faces from backend
      try {
        const res = await fetch(`${OTP_SERVER_URL}/api/patient-faces`);
        const data = await res.json();
        const active = data.filter((face: any) => face.isActive === true);
        setActiveFaces(active);
        
        if (active.length > 0) {
          setVerificationState('checking_face');
          setScanStatus('Scanning face...');
        } else {
          setVerificationState('login_fields');
        }
      } catch (err) {
        console.error('Failed to fetch faces', err);
        setVerificationState('login_fields');
      }

      setAuthModal({ role });
      setAuthId('');
      setAuthPassword('');
      setAuthError('');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authModal) return;

    setIsLoading(true);
    setAuthError('');

    try {
      // OTP server is on port 4001 as defined in otpServer.js
      const OTP_SERVER_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OTP_SERVER_URL || 'http://127.0.0.1:4001';
      const response = await fetch(`${OTP_SERVER_URL}/api/verify-portal-switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: authModal.role,
          id: authId,
          password: authPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        let targetAccount: UserAccount;
        if (authModal.role === 'doctor') targetAccount = doctorAccount;
        else targetAccount = caregiverAccount;
        
        onSwitchRole(targetAccount);
        setAuthModal(null);
      } else {
        setAuthError(data.message || 'Invalid ID or password.');
      }
    } catch (err) {
      console.error('Auth fetch error:', err);
      setAuthError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
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

      {/* Authentication Modal */}
      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C261B]/80 backdrop-blur-md animate-fade-in text-slate-900 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl relative animate-scale-in overflow-hidden border border-emerald-100">
            {/* Stylish Header Area */}
            <div className="bg-gradient-to-br from-[#143E2B] to-[#1E5D40] p-6 sm:p-8 text-center relative overflow-hidden">
              {/* Decorative background circles */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-emerald-300/10 blur-2xl"></div>

              <button
                onClick={handleCloseAuth}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-lg transition-all cursor-pointer backdrop-blur-sm z-10"
              >
                ✕
              </button>
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  {authModal.role === 'doctor' ? (
                    <Stethoscope className="w-8 h-8 text-emerald-300" />
                  ) : (
                    <HeartHandshake className="w-8 h-8 text-amber-300" />
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
                  {authModal.role === 'doctor' ? 'Doctor Portal' : 'Caregiver Hub'}
                </h2>
                <p className="text-sm sm:text-base text-emerald-100/90 font-medium">
                  Please authenticate to access secure records
                </p>
              </div>
            </div>
            
            {/* Form Area */}
            <div className="p-6 sm:p-8 bg-[#FAFAFA]">
              {verificationState === 'checking_face' ? (
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ScanFace className="w-5 h-5" />
                    Security Verification
                  </h3>
                  <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden mb-6 shadow-inner flex items-center justify-center border-4 border-slate-200">
                    {!modelsLoaded ? (
                      <div className="text-white font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 animate-spin" />
                        Loading Security Models...
                      </div>
                    ) : (
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className={`p-4 rounded-xl w-full text-center font-bold transition-all ${
                    scanStatus.includes('Alert') ? 'bg-red-100 text-red-800 border-2 border-red-300 animate-wrong-shake' :
                    scanStatus.includes('Authorized') ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300 animate-correct-pulse' :
                    'bg-amber-100 text-amber-800 border-2 border-amber-200'
                  }`}>
                    {scanStatus}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5" autoComplete="off">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-2">Portal ID</label>
                    <input
                      type="text"
                      name="portal_id_unique"
                      autoComplete="off"
                      data-1p-ignore
                      value={authId}
                      onChange={(e) => setAuthId(e.target.value)}
                      className="w-full px-5 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none font-bold text-slate-900 text-lg shadow-sm transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-2">Secure Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="portal_password_unique"
                        autoComplete="new-password"
                        data-1p-ignore
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full px-5 py-3 pr-14 bg-white border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none font-bold text-slate-900 text-lg shadow-sm transition-all tracking-wide"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-2 flex items-center px-3 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer rounded-r-xl"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div className="text-sm font-bold text-red-600 bg-red-50/80 border border-red-200 p-3 rounded-xl text-center flex items-center justify-center gap-2 shadow-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 w-full bg-gradient-to-r from-[#143E2B] to-[#1E5D40] hover:from-[#0D291C] hover:to-[#143E2B] text-white py-3.5 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl disabled:opacity-70 transition-all duration-300 cursor-pointer transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Authenticating...' : 'Sign In Securely'}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
