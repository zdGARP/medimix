import React from 'react';
import { useApp } from '../context/AppContext';
import { Fingerprint, ShieldCheck, Lock } from 'lucide-react';

export const BiometricView: React.FC = () => {
  const { setCurrentRoute, promptBiometricAuth } = useApp();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 text-center">
      {/* Visual Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-6 shadow-sm">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-50 border-2 border-sky-200 text-sky-600 flex items-center justify-center shadow-xs">
          <Fingerprint className="w-10 h-10 animate-fingerprint" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-widest block">
            Biometric Security Mode
          </span>
          <h1 className="text-3xl font-black text-slate-900">
            Protect your Medicine Cabinet
          </h1>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Use device biometric authentication (Fingerprint / Face ID) to protect sensitive personal medicine records and history.
          </p>
        </div>

        {/* Feature Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Protect saved prescription lists</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Secure medicine deletion actions</span>
          </div>
        </div>

        {/* Clarification Notice */}
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 text-left font-medium">
          ℹ Note: Biometric security protects your private cabinet. Fingerprint authentication is NOT required to perform quick medicine scans.
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              promptBiometricAuth(() => {
                setCurrentRoute('cabinet');
              });
            }}
            className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-base shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Fingerprint className="w-5 h-5" />
            <span>Enable Biometric Security</span>
          </button>

          <button
            onClick={() => setCurrentRoute('cabinet')}
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-sm"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
};
