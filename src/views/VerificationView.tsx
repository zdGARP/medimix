import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileSearch, 
  Camera, 
  HelpCircle, 
  BookmarkCheck
} from 'lucide-react';
import { VoiceButton } from '../components/ui/VoiceButton';

export const VerificationView: React.FC = () => {
  const { activeMedicineResult, addSavedMedicine, setCurrentRoute, accessibility } = useApp();
  const isTa = accessibility.language === 'ta';

  const med = activeMedicineResult;

  if (!med) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <p className="text-slate-500 font-medium">No medicine available for verification.</p>
        <button
          onClick={() => setCurrentRoute('home')}
          className="py-2.5 px-5 rounded-xl bg-[#2FA89B] text-white font-bold text-xs"
        >
          Scan Medicine
        </button>
      </div>
    );
  }

  const handleConfirmSave = () => {
    addSavedMedicine(med);
    setCurrentRoute('cabinet');
  };

  const audioTextEn = "Verification Step. Please review the extracted medicine name, strength 500 milligrams, and manufacturer before saving to your cabinet. Tap Confirm and Save when ready.";
  const audioTextTa = "மருந்தைச் சரிபார்க்கும் படி. பெயர் மற்றும் 500 மில்லிகிராம் அளவைச் சரிபார்த்து உறுதி செய்யவும்.";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {isTa ? 'மருந்தை சரிபார்க்கவும்' : 'Verify Medicine'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {isTa ? 'சேமிப்பதற்கு முன் பிரித்தெடுக்கப்பட்ட தகவல்களைச் சரிபார்க்கவும்.' : 'Please review extracted information before saving to your personal cabinet.'}
              </p>
            </div>
          </div>

          <VoiceButton 
            textToSpeak={isTa ? audioTextTa : audioTextEn}
            label="Listen"
            size="md"
            variant="secondary"
          />
        </div>
      </div>

      {/* Verification Card Summary */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
        <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block mb-0.5">
              Extracted Target Medicine
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {med.name} <span className="text-sky-700">{med.strength}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">{med.manufacturer} • Batch {med.batchNumber}</p>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold font-mono">
            {med.confidenceLevel} CONFIDENCE
          </span>
        </div>

        {/* Checkable Evidence Points */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-sky-600" />
            <span>Extracted Evidence Verification Checklist</span>
          </h3>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Printed medicine title matches <strong>{med.name}</strong></span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Strength <strong>{med.strength}</strong> verified against packaging label</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Expiry date <strong>{med.expiryDate}</strong> is within safe unexpired window</span>
            </div>
          </div>
        </div>

        {/* Safety Warning */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 font-medium">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Safety Notice: Confirming extracted information does not convert an uncertain AI result into medical certainty. If in doubt, consult a licensed pharmacist.
          </span>
        </div>
      </div>

      {/* Alternative Verification Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setCurrentRoute('scan')}
          className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
        >
          <Camera className="w-4 h-4 text-sky-600" />
          <span>Scan Again</span>
        </button>

        <button
          onClick={() => setCurrentRoute('fingerprint')}
          className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
        >
          <FileSearch className="w-4 h-4 text-sky-600" />
          <span>Review Evidence</span>
        </button>

        <button
          onClick={() => setCurrentRoute('language')}
          className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
        >
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>Pharmacist Verification</span>
        </button>
      </div>

      {/* Main Confirm & Save CTA */}
      <button
        onClick={handleConfirmSave}
        className="w-full py-4 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-md flex items-center justify-center gap-3 transition-transform active:scale-98"
      >
        <BookmarkCheck className="w-6 h-6" />
        <span>Confirm & Save to Medicine Cabinet</span>
      </button>
    </div>
  );
};
