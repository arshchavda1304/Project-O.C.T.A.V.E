import React, { useState, useEffect } from 'react';
import { Language, UserAccount } from './types';
import { translations } from './translations';
import { MOCK_ACCOUNTS } from './initialData';
import {
  Mail,
  User,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Lock,
  HeartHandshake,
  Stethoscope,
  Activity,
  Gamepad2,
  HeartPulse,
} from 'lucide-react';
import { playPositiveChime } from './speech';
import { ReadAloudButton } from './ReadAloudButton';

interface LoginScreenProps {
  language: Language;
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onLoginSuccess,
}) => {
  const t = translations[language] || translations['en'];

  // Two-stage flow: 'credentials' -> 'otp'
  const [stage, setStage] = useState<'credentials' | 'otp'>('credentials');

  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const otpServerUrl =
    (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_OTP_SERVER_URL) ||
    'http://localhost:4001';

  // Cooldown countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle Demo Auto-fill
  const handleDemoFill = (role: 'doctor' | 'caregiver' | 'patient') => {
    if (role === 'doctor') {
      setName('Dr. Pranab Baruah');
      setEmail('dr.baruah@projectoctave.org');
    } else if (role === 'caregiver') {
      setName('Ananya Saikia');
      setEmail('ananya@projectoctave.org');
    } else {
      setName('Bhaben Kalita');
      setEmail('bhaben@projectoctave.org');
    }
  };

  // Stage 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address (Gmail).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email format (e.g. yourname@gmail.com).');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${otpServerUrl}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        playPositiveChime();
        setStage('otp');
        setInfoMessage(`A 6-digit verification code has been dispatched to ${trimmedEmail}`);
        setResendCooldown(45);
      } else {
        const errorText =
          data?.message || 'Unable to send OTP verification email. Please verify OTP server is running.';
        setErrorMessage(errorText);
      }
    } catch (err: any) {
      console.error('Failed to trigger OTP:', err);
      setErrorMessage(
        'Connection to OTP server failed. Please ensure the OTP service is running on port 4001.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 2: Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const code = otp.join('').trim();
    if (code.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${otpServerUrl}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: code }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        playPositiveChime();

        // Check if an existing mock account matches this email
        const existing = MOCK_ACCOUNTS.find(
          (acc) => acc.email.toLowerCase() === email.trim().toLowerCase()
        );

        // If no mock account matches exactly, default to a patient role for demonstration
        const authenticatedUser: UserAccount = existing || {
          id: `user-${Date.now()}`,
          email: email.trim().toLowerCase(),
          name: name.trim(),
          role: 'patient',
          password: '',
          patientId: 'pat-1',
        };

        onLoginSuccess(authenticatedUser);
      } else {
        setErrorMessage(data?.message || 'Wrong OTP entered. Please check and try again.');
      }
    } catch (err: any) {
      console.error('Failed to verify OTP:', err);
      setErrorMessage(
        'Verification request failed. Please check your network connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input changes (auto-advance)
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      pasted.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      document.getElementById(`otp-input-${Math.min(pasted.length, 5)}`)?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMessage(null);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  // Handle backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#E5E7EB] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        
        {/* ---------------------------------------------------------
            LEFT PANEL: Branding & Visuals
            --------------------------------------------------------- */}
        <div className="lg:w-[45%] bg-[#114A31] p-10 lg:p-12 flex flex-col relative overflow-hidden">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#206A4B] rounded-full text-xs font-bold text-[#34D399] w-max mb-10">
            <Activity className="w-4 h-4" />
            North East Tele-Care Network
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-2 leading-tight">
            Project<br />O.C.T.A.V.E.
          </h1>
          <p className="text-[#34D399] text-sm font-bold tracking-wide uppercase mb-6 max-w-xs">
            Optimized Care Through Assisted Virtual Empowerment
          </p>
          
          <p className="text-emerald-50/90 text-base leading-relaxed max-w-sm mb-10">
            Unified, offline-first cognitive and clinical care platform serving elders, family caregivers, and physicians across Assam, Manipur, Tripura, and Nagaland.
          </p>

          {/* Feature Cards */}
          <div className="flex flex-col gap-4 mb-10">
            <div className="bg-[#185A3E] border border-[#206A4B] rounded-xl p-4 flex items-center gap-4">
              <Stethoscope className="text-[#34D399] w-6 h-6 shrink-0" />
              <span className="text-white text-sm font-medium">Physician EHR & Longitudinal Cognitive Analytics</span>
            </div>
            <div className="bg-[#185A3E] border border-[#206A4B] rounded-xl p-4 flex items-center gap-4">
              <HeartPulse className="text-[#34D399] w-6 h-6 shrink-0" />
              <span className="text-white text-sm font-medium">Caregiver Routine Sync & Emergency Triggers</span>
            </div>
            <div className="bg-[#185A3E] border border-[#206A4B] rounded-xl p-4 flex items-center gap-4">
              <Gamepad2 className="text-[#34D399] w-6 h-6 shrink-0" />
              <span className="text-white text-sm font-medium">Adaptive Memory Gym & Native Regional Audio</span>
            </div>
          </div>

          {/* Footer of Left Panel */}
          <div className="mt-auto flex justify-between items-center text-[#34D399] text-xs font-bold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> ABDM Consent Compliant
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" /> 100% Offline-Ready
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------
            RIGHT PANEL: Authentication Flow
            --------------------------------------------------------- */}
        <div className="lg:w-[55%] p-10 lg:p-14 flex flex-col bg-white">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> SECURE PASSCODE SIGN-IN
            </div>
            <ReadAloudButton
              id="btn-login-read"
              text={
                stage === 'credentials' 
                  ? "Enter your name and Gmail address. We will instantly email you a 6-digit authentication code." 
                  : "Enter the 6-digit authentication code sent to your email."
              }
              language={language}
              size="sm"
            />
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-sm flex items-start gap-3 shadow-sm mb-8">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" /> 
              <div>
                <strong className="block mb-1 text-red-900">Authentication Alert</strong>
                {errorMessage}
              </div>
            </div>
          )}
          
          {infoMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-start gap-3 shadow-sm mb-8">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" /> 
              <div>
                <strong className="block mb-1 text-emerald-900">Success</strong>
                {infoMessage}
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center">
            {/* STAGE 1: CREDENTIALS */}
            {stage === 'credentials' && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Sign In with Email</h2>
                <p className="text-slate-600 text-sm mb-8">
                  Enter your name and Gmail address. We will instantly email you a 6-digit authentication code.
                </p>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none font-semibold text-slate-800 bg-[#EEF2F6] focus:bg-white border-2 border-transparent focus:border-[#114A31] transition-all"
                        placeholder="e.g. Ramesh Kalita"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">Email Address (Gmail)</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none font-semibold text-slate-800 bg-[#EEF2F6] focus:bg-white border-2 border-transparent focus:border-[#114A31] transition-all"
                        placeholder="you@gmail.com"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      We will send a high-contrast one-time passcode valid for 5 minutes.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-[#0D5235] hover:bg-[#0A4029] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
                  >
                    {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : null}
                    {isLoading ? 'Requesting Code...' : 'Get Verification Code'}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>

                {/* Quick Demo Profiles */}
                <div className="mt-10">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    QUICK DEMO PROFILES:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleDemoFill('doctor')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-full text-xs font-bold text-slate-700 transition-colors"
                    >
                      <Stethoscope className="w-4 h-4 text-[#0D5235]" /> Dr. Baruah (Doctor)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoFill('caregiver')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-full text-xs font-bold text-slate-700 transition-colors"
                    >
                      <HeartHandshake className="w-4 h-4 text-[#D97706]" /> Ananya (Caregiver)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoFill('patient')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-full text-xs font-bold text-slate-700 transition-colors"
                    >
                      <Gamepad2 className="w-4 h-4 text-[#D97706]" /> Bhaben (Elder)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: OTP VERIFICATION */}
            {stage === 'otp' && (
              <div className="animate-fade-in">
                <button
                  onClick={() => { setStage('credentials'); setErrorMessage(null); setInfoMessage(null); }}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Email Input
                </button>

                <h2 className="text-3xl font-black text-slate-900 mb-2">Enter Verification Code</h2>
                <p className="text-slate-600 text-sm mb-8">
                  We've sent a 6-digit code to <span className="font-bold text-slate-900">{email}</span>
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 sm:w-16 sm:h-16 text-center text-3xl font-black rounded-xl outline-none text-slate-900 bg-[#EEF2F6] focus:bg-white border-2 border-transparent focus:border-[#114A31] transition-all"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading || otp.join('').length !== 6}
                      className="w-full py-4 rounded-xl font-bold text-lg bg-[#0D5235] hover:bg-[#0A4029] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                      {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
                      {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                    </button>

                    <div className="text-center text-sm font-medium text-slate-600">
                      Didn't receive the code?{' '}
                      <button
                        type="button"
                        disabled={resendCooldown > 0 || isLoading}
                        onClick={() => handleSendOtp()}
                        className="font-bold text-[#0D5235] hover:underline disabled:opacity-50 disabled:no-underline transition-colors"
                      >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend now'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer of Right Panel */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> End-to-End Encrypted Session
            </div>
            <div>Version 2.0 • O.C.T.A.V.E.</div>
          </div>

        </div>
      </div>
    </div>
  );
};
