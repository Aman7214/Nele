import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Phone, ArrowRight, Check, ChevronLeft, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AreaLocation } from '../types';
import { NeleLogo } from './NeleLogo';

export const AuthScreen: React.FC = () => {
  const { 
    loginDemoUser, 
    loginWithPhone, 
    loginWithGoogle, 
    setCurrentView,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [fullName, setFullName] = useState<string>('Ramesh Kulkarni');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  
  // OTP state
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(30);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Profile completion modal state (for first time signups)
  const [showProfileComplete, setShowProfileComplete] = useState<boolean>(false);
  const [profileArea, setProfileArea] = useState<AreaLocation>('Raichur');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length !== 10) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (activeTab === 'signup' && !agreedToTerms) {
      setOtpError('Please accept the Terms and Privacy Policy');
      return;
    }
    setOtpError(null);
    setIsOtpSent(true);
    setTimer(30);
    setOtpDigits(['', '', '', '', '', '']);
    showToast('OTP sent: Use demo code 123456');
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpDigits];
      pasted.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtpDigits(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otpDigits];
    newOtp[index] = digit;
    setOtpDigits(newOtp);
    setOtpError(null);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otpDigits.join('');
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits of OTP');
      return;
    }

    if (attemptsLeft <= 1) {
      setOtpError('Too many failed attempts. Try again in 1 hour.');
      return;
    }

    if (code === '123456' || code.length === 6) {
      if (activeTab === 'signup') {
        setShowProfileComplete(true);
      } else {
        loginWithPhone(phoneNumber, fullName || 'Ramesh Kulkarni');
      }
    } else {
      setAttemptsLeft(prev => prev - 1);
      setOtpError(`Invalid OTP. ${attemptsLeft - 1} attempts left.`);
    }
  };

  const handleAutoFillDemoOtp = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setOtpError(null);
  };

  const handleFinishProfile = () => {
    loginWithPhone(phoneNumber, fullName || 'Ramesh Kulkarni');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 bg-[#ffffff] overflow-y-auto no-scrollbar select-none">
      {/* Top Navigation Row: Back to Tour + Brand Logo */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e5edf5]">
        <button
          type="button"
          onClick={() => setCurrentView('onboarding')}
          className="flex items-center gap-1 text-xs text-[#64748d] hover:text-[#533afd] cursor-pointer"
        >
          <ChevronLeft size={14} />
          <span>Intro tour</span>
        </button>
        <NeleLogo variant="compact" />
      </div>

      {/* Brand Header */}
      <div className="pt-3 text-left">
        <h1 className="text-2xl font-semibold text-[#061b31] tracking-tight">
          {activeTab === 'signup' ? 'Create your account' : 'Sign in to your account'}
        </h1>
        <p className="text-xs text-[#50617a] mt-1">
          Direct property deals across Raichur district with zero broker charges.
        </p>
      </div>

      {/* Main Authentication Flow */}
      <div className="my-auto w-full py-2 space-y-3">
        {/* Tab Switcher: Create Account & Sign In */}
        <div className="flex bg-[#f8fafd] p-0.5 rounded-[4px] border border-[#e5edf5]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setIsOtpSent(false);
              setOtpError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-normal rounded-[3px] transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-[#ffffff] text-[#061b31] border border-[#e5edf5] font-medium'
                : 'text-[#64748d] hover:text-[#061b31]'
            }`}
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setIsOtpSent(false);
              setOtpError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-normal rounded-[3px] transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-[#ffffff] text-[#061b31] border border-[#e5edf5] font-medium'
                : 'text-[#64748d] hover:text-[#061b31]'
            }`}
          >
            Sign in
          </button>
        </div>

        {/* Mobile Input or OTP code form */}
        {!isOtpSent ? (
          <div className="space-y-3">
            {activeTab === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-normal text-[#50617a] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full h-10 px-3 stripe-input text-xs font-normal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-[#50617a] mb-1">
                    Locality / Taluk
                  </label>
                  <select
                    value={profileArea}
                    onChange={e => setProfileArea(e.target.value as AreaLocation)}
                    className="w-full h-10 px-3 stripe-input text-xs font-normal bg-white"
                  >
                    <option value="Raichur">Raichur City</option>
                    <option value="Manvi">Manvi</option>
                    <option value="Sindhanur">Sindhanur</option>
                    <option value="Lingasugur">Lingasugur</option>
                    <option value="Mudgal">Mudgal</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-normal text-[#50617a] mb-1">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="h-10 px-3 bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] flex items-center justify-center font-normal text-xs text-[#50617a]">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="flex-1 h-10 px-3 stripe-input text-sm font-normal tabular-nums"
                />
              </div>
            </div>

            {activeTab === 'signup' && (
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 accent-[#533afd] w-3.5 h-3.5 rounded-[2px]"
                />
                <span className="text-[11px] text-[#64748d] font-normal leading-tight">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentView('terms')}
                    className="text-[#533afd] hover:underline"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentView('privacy_policy')}
                    className="text-[#533afd] hover:underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
            )}

            {otpError && (
              <p className="text-xs font-normal text-[#e11d48] bg-[#fff1f2] p-2 rounded-[4px] border border-[#fecdd3]">
                {otpError}
              </p>
            )}

            <button
              onClick={() => handleSendOtp()}
              className="w-full h-10 stripe-btn-primary gap-2 mt-1 cursor-pointer"
            >
              <Phone size={14} />
              <span>{activeTab === 'signup' ? 'Create account & send OTP' : 'Send verification OTP'}</span>
            </button>
          </div>
        ) : (
          /* OTP Screen */
          <div className="space-y-3">
            <div className="bg-[#f8fafd] p-3.5 border border-[#e5edf5] rounded-[4px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#061b31]">
                  Enter 6-digit code
                </span>
                <span className="text-[11px] font-normal text-[#64748d] tabular-nums">
                  sent to +91 {phoneNumber}
                </span>
              </div>

              {/* 6 Box Input with 4px radius and hairline borders */}
              <div className="flex justify-between gap-1.5 my-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => {
                      otpInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    className="w-10 h-11 text-center text-base font-normal stripe-input p-0 tabular-nums focus:border-[#533afd]"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-xs font-normal text-[#e11d48] mb-2">{otpError}</p>
              )}

              {/* Demo Hint Helper */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleAutoFillDemoOtp}
                  className="text-xs text-[#533afd] font-normal hover:underline cursor-pointer"
                >
                  Auto-fill 123456
                </button>

                {timer > 0 ? (
                  <span className="text-[11px] font-normal text-[#64748d] tabular-nums">
                    Resend in {timer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-[11px] text-[#533afd] hover:underline"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="h-10 px-3.5 stripe-btn-ghost text-xs"
              >
                Change #
              </button>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="flex-1 h-10 stripe-btn-primary gap-2"
              >
                <span>Verify & Sign in</span>
                <Check size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* Quick Demo Login Hero Action */}
        <div className="bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-3 space-y-2 mt-2">
          <div className="text-xs font-medium text-[#061b31]">
            Demo Access
          </div>
          <button
            type="button"
            onClick={loginDemoUser}
            className="w-full h-9 stripe-btn-primary text-xs gap-1.5 cursor-pointer"
          >
            <span>Continue as Ramesh Kulkarni (Owner)</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Alternative Sign-in & Guest Options */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full h-9 stripe-btn-ghost gap-2 text-xs font-normal cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="w-full h-9 bg-white hover:bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] text-xs text-[#50617a] hover:text-[#061b31] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Explore Marketplace as Guest</span>
            <ArrowRight size={13} className="text-[#533afd]" />
          </button>
        </div>
      </div>

      {/* Footnote */}
      <div className="pt-2 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-normal text-[#64748d]">
          <ShieldCheck size={13} className="text-[#533afd]" />
          <span>Mobile identity protected with masked relay</span>
        </div>
      </div>

      {/* Profile Completion Modal */}
      {showProfileComplete && (
        <div className="fixed inset-0 bg-[#061b31]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-5 w-full max-w-sm">
            <h3 className="text-xl font-light text-[#061b31] tracking-[-0.02em] mb-1">
              Complete your profile
            </h3>
            <p className="text-xs text-[#64748d] mb-4">
              Select your primary district locality for direct listings.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-normal text-[#50617a] mb-1">Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full h-10 px-3 stripe-input"
                />
              </div>

              <div>
                <label className="block text-xs font-normal text-[#50617a] mb-1">Locality</label>
                <select
                  value={profileArea}
                  onChange={e => setProfileArea(e.target.value as AreaLocation)}
                  className="w-full h-10 px-3 stripe-input"
                >
                  <option value="Raichur">Raichur City</option>
                  <option value="Manvi">Manvi</option>
                  <option value="Sindhanur">Sindhanur</option>
                  <option value="Lingasugur">Lingasugur</option>
                  <option value="Mudgal">Mudgal</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleFinishProfile}
                className="flex-1 h-10 stripe-btn-ghost text-xs"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleFinishProfile}
                className="flex-1 h-10 stripe-btn-primary text-xs"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
