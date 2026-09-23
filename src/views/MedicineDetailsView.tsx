import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Bell, 
  ArrowLeft
} from 'lucide-react';
import { VoiceButton } from '../components/ui/VoiceButton';

export const MedicineDetailsView: React.FC = () => {
  const { 
    activeMedicineResult, 
    setCurrentRoute, 
    deleteSavedMedicine, 
    promptBiometricAuth, 
    accessibility 
  } = useApp();
  const isTa = accessibility.language === 'ta';

  const med = activeMedicineResult;

  if (!med) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <p className="text-slate-500 font-medium">No medicine details available.</p>
        <button
          onClick={() => setCurrentRoute('cabinet')}
          className="py-2.5 px-5 rounded-xl bg-[#2FA89B] text-white font-bold text-xs"
        >
          Go to Medicine Cabinet
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    promptBiometricAuth(() => {
      deleteSavedMedicine(med.id);
      setCurrentRoute('cabinet');
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Back CTA */}
      <button
        onClick={() => setCurrentRoute('cabinet')}
        className="text-xs font-bold text-slate-600 hover:text-sky-700 flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Medicine Cabinet</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 font-extrabold text-xs">
                {med.strength}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs">
                ✓ User Verified
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">{med.name}</h1>
            <p className="text-sm text-slate-500 font-medium">{med.manufacturer}</p>
          </div>

          <VoiceButton 
            textToSpeak={isTa ? med.audioTextTa : med.audioTextEn}
            label="Listen Audio"
            size="md"
            variant="primary"
          />
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Dosage Form
            </span>
            <p className="font-extrabold text-base text-slate-900">{med.dosageForm}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Batch & Manufacturing
            </span>
            <p className="font-extrabold text-base text-slate-900">{med.batchNumber}</p>
            <p className="text-xs text-slate-500">Mfg: {med.mfgDate}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Expiry Date
            </span>
            <p className="font-extrabold text-lg text-emerald-950">{med.expiryDate}</p>
            <p className="text-xs text-emerald-800 font-semibold">Status: NOT EXPIRED</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Active Reminder
            </span>
            <p className="font-extrabold text-base text-slate-900">08:00 AM Daily</p>
            <p className="text-xs text-sky-700 font-semibold">Take with water</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Directions & Dosage Instructions
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed font-medium">
            {med.instructions}
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentRoute('reminders')}
          className="py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4" />
          <span>Edit Medicine Reminders</span>
        </button>

        <button
          onClick={handleDelete}
          className="py-3.5 px-6 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-sm flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4 text-rose-600" />
          <span>Delete Medicine (Requires Biometric PIN)</span>
        </button>
      </div>
    </div>
  );
};
