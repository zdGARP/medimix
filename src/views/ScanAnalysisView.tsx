import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Fingerprint, 
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

export const ScanAnalysisView: React.FC = () => {
  const { 
    setCurrentRoute, 
    demoState, 
    setDemoState,
    accessibility, 
    isRealAnalysis, 
    realAnalysisLoading, 
    realAnalysisError, 
    runRealMedicineAnalysis,
    activeMedicineResult 
  } = useApp();
  const isTa = accessibility.language === 'ta';

  const [completedSteps, setCompletedSteps] = useState<number>(0);

  const stages = [
    { title: isTa ? 'படத்தின் தரம் சரிபார்க்கப்பட்டது' : 'Image quality checked', detail: 'Lighting & contrast validated' },
    { title: isTa ? 'எழுத்து துண்டுகள் கண்டறியப்பட்டன' : 'Text fragments detected', detail: 'Extracting visible OCR tokens' },
    { title: isTa ? 'மருந்தின் அளவு பகுப்பாய்வு செய்யப்பட்டது' : 'Strength analyzed', detail: 'Searching dosage numbers' },
    { title: isTa ? 'தயாரிப்பாளர் தடயம் பெறப்பட்டது' : 'Manufacturer clues detected', detail: 'Evaluating brand & logo fragments' },
    { title: isTa ? 'பொட்டலம் பகுப்பாய்வு செய்யப்பட்டது' : 'Packaging analyzed', detail: 'Blister geometry & shape matched' },
    { title: isTa ? 'மருந்து விரல்ரேகை உருவாக்கப்படுகிறது' : 'Building medicine fingerprint', detail: 'Aggregating multi-source evidence' },
    { title: isTa ? 'சாத்தியமான மருந்துகள் ஒப்பிடப்படுகின்றன' : 'Matching Supabase medicine database', detail: 'Querying clinical catalog' },
    { title: isTa ? 'நம்பிக்கை நிலை சரிபார்க்கப்படுகிறது' : 'Checking confidence rating', detail: 'Safety threshold calculation' }
  ];

  // Trigger real pipeline on mount if real photo was used
  useEffect(() => {
    if (isRealAnalysis) {
      runRealMedicineAnalysis();
    }
  }, []);

  // Step animation loop
  useEffect(() => {
    if (realAnalysisLoading) {
      const timer = setInterval(() => {
        setCompletedSteps(prev => {
          if (prev < stages.length - 1) return prev + 1;
          return prev;
        });
      }, 500);
      return () => clearInterval(timer);
    } else {
      setCompletedSteps(stages.length);
    }
  }, [realAnalysisLoading, stages.length]);

  const handleProceed = () => {
    if (!isRealAnalysis && demoState === 'damaged_rescue') {
      setCurrentRoute('rescue');
    } else if (activeMedicineResult?.confidenceLevel === 'LOW') {
      setCurrentRoute('result');
    } else {
      setCurrentRoute('result');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6 pb-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F4EF] border border-[#C6EADF] text-[#287F78] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#2FA89B] animate-spin" style={{ animationDuration: '3s' }} />
          {isTa ? 'AI பகுப்பாய்வு நடைபெறுகிறது' : 'Evidence Recovery Engine'}
        </div>
        <h1 className="text-3xl font-medium text-slate-800 tracking-tight">
          {isTa ? 'உங்கள் மருந்து பகுப்பாய்வு செய்யப்படுகிறது' : 'Analyzing Your Medicine'}
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          {isTa ? 'கிடைக்கக்கூடிய அனைத்து தடயங்களிலிருந்தும் தகவலை மீட்கிறோம்...' : 'Extracting text, dosage strength, manufacturer clues, and packaging fingerprints...'}
        </p>
      </div>

      {/* ERROR STATE: Service Unavailable */}
      {isRealAnalysis && realAnalysisError && (
        <div className="bg-white border border-amber-200 rounded-[24px] p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">Analysis service unavailable.</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {realAnalysisError}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => runRealMedicineAnalysis()}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try again</span>
            </button>
            <button
              onClick={() => setDemoState('clear_high_confidence')}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#E9E8E5] font-bold text-sm flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span>Use demo mode</span>
            </button>
          </div>
        </div>
      )}

      {/* ERROR STATE: No Reliable Evidence Detected */}
      {isRealAnalysis && !realAnalysisLoading && !realAnalysisError && !activeMedicineResult && (
        <div className="bg-white border border-[#E9E8E5] rounded-[24px] p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
            <AlertTriangle className="w-7 h-7 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">No reliable medicine evidence detected.</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The uploaded image does not appear to contain readable text, dosage information, or recognized medicine packaging clues.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentRoute('home')}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
            >
              <span>Take a clearer photo</span>
            </button>
            <button
              onClick={() => setDemoState('clear_high_confidence')}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#E9E8E5] font-bold text-sm flex items-center justify-center gap-2"
            >
              <span>Use demo mode</span>
            </button>
          </div>
        </div>
      )}

      {/* NORMAL PROCESSING & SUCCESS VIEW */}
      {(!isRealAnalysis || (!realAnalysisError && (realAnalysisLoading || activeMedicineResult))) && (
        <div className="relative bg-white border border-[#E9E8E5] rounded-[24px] p-8 text-center space-y-6 shadow-xs">
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            {realAnalysisLoading ? (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-[#C6EADF] animate-ping" style={{ animationDuration: '2s' }}></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-[#2FA89B] border-r-[#287F78] border-b-[#C6EADF] border-l-transparent animate-spin"></div>
                <Fingerprint className="w-14 h-14 text-[#2FA89B] animate-pulse" />
              </>
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#E6F4EF] border-2 border-[#C6EADF] flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-[#2FA89B]" />
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-[#287F78] uppercase tracking-widest block mb-1">
              {realAnalysisLoading ? 'Processing Evidence...' : 'Evidence Extraction & Search Complete'}
            </span>
            <p className="text-slate-800 font-bold text-lg">
              {realAnalysisLoading ? stages[completedSteps]?.title : 'Analysis complete!'}
            </p>
          </div>

          {/* Step Checklist */}
          <div className="space-y-2.5 text-left pt-2 border-t border-[#E9E8E5]">
            {stages.map((stage, idx) => {
              const isDone = !realAnalysisLoading || idx <= completedSteps;
              const isCurrent = realAnalysisLoading && idx === completedSteps;

              return (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isDone 
                      ? 'bg-[#E6F4EF] border-[#C6EADF] text-[#287F78]'
                      : isCurrent
                      ? 'bg-white border-[#2FA89B] text-slate-800 font-bold shadow-xs'
                      : 'bg-[#F6F7F5] border-[#E9E8E5] text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2FA89B] shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#2FA89B] animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 block shrink-0"></span>
                    )}
                    <div>
                      <p className="font-semibold">{stage.title}</p>
                      <p className="text-[10px] text-slate-500">{stage.detail}</p>
                    </div>
                  </div>
                  {isDone && <span className="text-[10px] font-mono text-[#287F78] font-bold">VERIFIED</span>}
                </div>
              );
            })}
          </div>

          {/* Action Button once processing completes */}
          {!realAnalysisLoading && (
            <button
              onClick={handleProceed}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-base shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-98 animate-in fade-in zoom-in duration-300"
            >
              <span>
                {activeMedicineResult?.confidenceLevel === 'LOW'
                  ? 'View Low Confidence Assessment'
                  : 'View Identification Result'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
