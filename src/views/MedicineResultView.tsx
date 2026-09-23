import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  BookmarkCheck, 
  Camera, 
  HelpCircle,
  Pill,
  Calendar,
  Building,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { VoiceButton } from '../components/ui/VoiceButton';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { EvidenceCard } from '../components/ui/EvidenceCard';
import confetti from 'canvas-confetti';

export const MedicineResultView: React.FC = () => {
  const { 
    activeMedicineResult, 
    addSavedMedicine, 
    setCurrentRoute, 
    accessibility, 
    realAnalysisError,
    lastExtractedEvidence 
  } = useApp();
  const isTa = accessibility.language === 'ta';

  const [showEvidence, setShowEvidence] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // If no result found or service error
  if (!activeMedicineResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6 pb-16">
        <div className="bg-white border border-[#E9E8E5] p-8 rounded-[24px] text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <AlertTriangle className="w-7 h-7" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-800">
              {realAnalysisError ? 'Analysis Service Unavailable' : 'No Reliable Medicine Evidence Detected'}
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
              {realAnalysisError || 'The captured photo did not contain readable text, dosage numbers, or recognized medicine packaging clues. We will not display a guessed medicine.'}
            </p>
          </div>

          {/* Show extracted partial clues if any existed */}
          {lastExtractedEvidence && (lastExtractedEvidence.rawText.length > 0 || lastExtractedEvidence.strength) && (
            <div className="p-4 rounded-xl bg-[#F6F7F5] border border-[#E9E8E5] text-left text-xs space-y-2">
              <span className="font-bold text-slate-700 block">Extracted Clues Found:</span>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                {lastExtractedEvidence.strength && <li>Strength: <strong>{lastExtractedEvidence.strength}</strong></li>}
                {lastExtractedEvidence.rawText.map((txt, i) => <li key={i}>Text: "{txt}"</li>)}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentRoute('home')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Take a clearer photo</span>
            </button>
            <button
              onClick={() => setCurrentRoute('rescue')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#F8EFE7] hover:bg-[#F2D7C2] text-[#9E5D24] border border-[#F2D7C2] font-bold text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#9E5D24]" />
              <span>Try Rescue Mode</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const med = activeMedicineResult;
  const isHigh = med.confidenceLevel === 'HIGH';
  const isMedium = med.confidenceLevel === 'MEDIUM';
  const isLow = med.confidenceLevel === 'LOW';

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  };

  const handleSave = () => {
    addSavedMedicine(med);
    setIsSaved(true);
    triggerConfetti();
    setTimeout(() => {
      setCurrentRoute('verification');
    }, 800);
  };

  const audioText = isTa ? med.audioTextTa : med.audioTextEn;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Result Status Header */}
      <div className={`border p-6 rounded-[24px] space-y-4 shadow-xs ${
        isHigh ? 'bg-[#E6F4EF] border-[#C6EADF] text-slate-800' :
        isMedium ? 'bg-[#FFF4DD] border-[#FDE6B5] text-slate-800' :
        'bg-[#F7EDEF] border-[#F3CDD4] text-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {isTa ? 'கண்டறிதல் முடிவு' : 'Identification Result'}
            </span>
          </div>

          <ConfidenceBadge level={med.confidenceLevel} score={med.confidenceScore} />
        </div>

        {/* Medicine Main Title */}
        {isLow ? (
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#9F2E40]">
              🔴 MEDICINE COULD NOT BE IDENTIFIED RELIABLY
            </h1>
            <p className="text-base text-slate-700 font-medium">
              We do not have enough readable text or evidence to safely verify this medicine. We will not present a guessed medicine name.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
              {med.name} <span className="text-[#2F9188] font-bold">{med.strength}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-semibold">
              Verified from extracted evidence • <strong className="text-slate-800">{med.manufacturer}</strong>
            </p>
          </div>
        )}

        {/* Voice Readout Button */}
        <div className="pt-2 flex items-center justify-between">
          <VoiceButton 
            textToSpeak={audioText}
            label={isTa ? '🔊 தகவலைக் கேள்' : '🔊 Listen to this information'}
            size="lg"
            variant="primary"
          />

          <span className="text-xs text-slate-500 font-medium hidden sm:block">
            Voice guidance available in EN & தமிழ்
          </span>
        </div>
      </div>

      {/* Low Confidence Rejection Panel */}
      {isLow && (
        <div className="bg-[#F7EDEF] border border-[#F3CDD4] p-6 rounded-[22px] space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-[#9F2E40] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
            <span>Safety First Directive</span>
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            Patient safety is our primary priority. Because the strip packaging is heavily torn or missing critical identifying fragments, please choose one of the recommended verification options below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => setCurrentRoute('home')}
              className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-[#E9E8E5] font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <Camera className="w-4 h-4 text-[#2FA89B]" />
              <span>Scan Clearer Image</span>
            </button>
            <button
              onClick={() => setCurrentRoute('rescue')}
              className="py-3 px-4 rounded-xl bg-[#F8EFE7] hover:bg-[#F2D7C2] text-[#9E5D24] border border-[#F2D7C2] font-bold text-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#9E5D24]" />
              <span>Try Rescue Mode</span>
            </button>
            <button
              onClick={() => setCurrentRoute('verification')}
              className="py-3 px-4 rounded-xl bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-white" />
              <span>Pharmacist Verification</span>
            </button>
          </div>
        </div>
      )}

      {/* High / Medium Confidence Details Grid */}
      {!isLow && (
        <>
          {/* Why this match? */}
          <div className="bg-white border border-[#E9E8E5] rounded-[22px] p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2FA89B]" />
              <span>Why this match?</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {med.matchReasons.map((reason, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F6F7F5] border border-[#E9E8E5] text-xs font-semibold text-slate-700 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2FA89B] shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            {/* Collapsible Recovered Evidence Toggle */}
            <div className="pt-2">
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F6F7F5] hover:bg-slate-100 border border-[#E9E8E5] text-xs font-bold text-[#287F78] flex items-center justify-between transition-colors"
              >
                <span>{showEvidence ? 'Hide Recovered Evidence Details' : 'View Recovered Evidence Details'}</span>
                {showEvidence ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showEvidence && (
                <div className="mt-3 animate-in fade-in duration-200">
                  <EvidenceCard evidence={med.recoveredEvidence} />
                </div>
              )}
            </div>
          </div>

          {/* Structured Medicine Data Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Medicine Name & Strength */}
            <div className="bg-white border border-[#E9E8E5] p-5 rounded-2xl space-y-1 shadow-xs">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <Pill className="w-4 h-4 text-[#2FA89B]" />
                <span>Medicine & Dosage</span>
              </div>
              <p className="text-xl font-extrabold text-slate-800">{med.name}</p>
              <p className="text-sm text-[#287F78] font-bold">{med.strength} ({med.dosageForm})</p>
            </div>

            {/* Manufacturer */}
            <div className="bg-white border border-[#E9E8E5] p-5 rounded-2xl space-y-1 shadow-xs">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <Building className="w-4 h-4 text-[#6B5A94]" />
                <span>Manufacturer</span>
              </div>
              <p className="text-xl font-extrabold text-slate-800">{med.manufacturer}</p>
              <p className="text-xs text-slate-500 font-mono font-bold">Batch: {med.batchNumber}</p>
            </div>

            {/* Expiry Card */}
            <div className={`border p-5 rounded-2xl space-y-1 shadow-xs ${
              med.expiryStatus === 'CANNOT_VERIFY' || med.expiryDate === 'Cannot Verify' || med.expiryDate === 'Unreadable / Unverified'
                ? 'bg-[#F6F7F5] border-[#E9E8E5] text-slate-700' 
                : 'bg-[#E6F4EF] border-[#C6EADF] text-[#287F78]'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-[#2FA89B]" />
                  <span>Expiry Information</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  med.expiryStatus === 'CANNOT_VERIFY' || med.expiryDate === 'Cannot Verify' || med.expiryDate === 'Unreadable / Unverified'
                    ? 'bg-white text-slate-700 border border-slate-300' 
                    : 'bg-white text-[#287F78] border border-[#C6EADF]'
                }`}>
                  {med.expiryStatus === 'CANNOT_VERIFY' || med.expiryDate === 'Cannot Verify' || med.expiryDate === 'Unreadable / Unverified' ? 'CANNOT VERIFY' : 'NOT EXPIRED'}
                </span>
              </div>
              <p className="text-xl font-bold text-slate-800">{med.expiryDate}</p>
              <p className="text-xs text-slate-600 font-medium">
                {med.expiryStatus === 'CANNOT_VERIFY' || med.expiryDate === 'Cannot Verify' || med.expiryDate === 'Unreadable / Unverified' 
                  ? '⚠ Date unreadable or missing from photo' 
                  : 'Manufactured: ' + med.mfgDate}
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-white border border-[#E9E8E5] p-5 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#2FA89B]" />
              <span>Standard Usage & Dosage</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {med.instructions}
            </p>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {!isLow && (
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`py-3.5 px-8 rounded-[14px] font-bold text-lg shadow-xs flex items-center justify-center gap-3 transition-all active:scale-98 ${
              isSaved 
                ? 'bg-[#287F78] text-white' 
                : 'bg-[#2FA89B] hover:bg-[#287F78] text-white'
            }`}
          >
            <BookmarkCheck className="w-6 h-6" />
            <span>{isSaved ? '✓ Saved to Cabinet!' : 'Save Medicine & Set Reminder'}</span>
          </button>
        )}

        <button
          onClick={() => setCurrentRoute('home')}
          className="py-3.5 px-6 rounded-[14px] bg-white hover:bg-slate-50 text-slate-800 border border-[#E9E8E5] font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Camera className="w-5 h-5 text-[#2FA89B]" />
          <span>{isTa ? 'மற்றொரு மருந்தை ஸ்கேன் செய்' : 'Scan Another Medicine'}</span>
        </button>
      </div>
    </div>
  );
};
