import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Fingerprint, ShieldCheck, Check, X } from 'lucide-react';

export const BiometricModal: React.FC = () => {
  const { isBiometricModalOpen, biometricSuccessCallback, closeBiometricModal } = useApp();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isBiometricModalOpen) return null;

  const handleTouchFingerprint = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (biometricSuccessCallback) {
          biometricSuccessCallback();
        }
        closeBiometricModal();
      }, 700);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center animate-in fade-in zoom-in duration-200">
        <button
          onClick={closeBiometricModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h3 className="font-extrabold text-xl text-slate-900 mb-1">
          Biometric Verification
        </h3>
        <p className="text-xs text-slate-600 mb-6">
          Touch the fingerprint sensor below to authenticate access to your medicine cabinet.
        </p>

        {/* Animated Touch Target */}
        <button
          onClick={handleTouchFingerprint}
          disabled={isVerifying || isSuccess}
          className={`w-28 h-28 mx-auto rounded-full border-2 flex items-center justify-center transition-all ${
            isSuccess 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-600 scale-110'
              : isVerifying
              ? 'bg-sky-50 border-sky-500 text-sky-600 animate-pulse scale-105'
              : 'bg-slate-50 hover:bg-slate-100 border-sky-400 text-sky-600 hover:scale-105 shadow-md'
          }`}
          aria-label="Touch Fingerprint Sensor"
        >
          {isSuccess ? (
            <Check className="w-14 h-14 animate-in zoom-in duration-300" />
          ) : (
            <Fingerprint className={`w-14 h-14 ${isVerifying ? 'animate-fingerprint text-sky-700' : ''}`} />
          )}
        </button>

        <p className="mt-4 text-xs font-bold text-sky-700">
          {isSuccess 
            ? '✓ Access Granted!' 
            : isVerifying 
            ? 'Verifying biometric signature...' 
            : 'Tap fingerprint icon to verify'}
        </p>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
          <button
            onClick={() => {
              if (biometricSuccessCallback) biometricSuccessCallback();
              closeBiometricModal();
            }}
            className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
          >
            Bypass with Device PIN (Demo Mode)
          </button>
        </div>
      </div>
    </div>
  );
};
