import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Camera, 
  Search, 
  Fingerprint, 
  ShieldCheck, 
  Volume2, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const { setCurrentRoute } = useApp();

  const steps = [
    {
      num: '01',
      icon: <Camera className="w-6 h-6 text-sky-600" />,
      bg: 'bg-sky-50 border-sky-100',
      title: '📷 Scan Packaging',
      desc: 'Capture 1-4 clear or angled photos of the medicine strip, foil blister, or box label.'
    },
    {
      num: '02',
      icon: <Search className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100',
      title: '🔍 Recover Evidence (MedMatch Rescue)',
      desc: 'When packaging is torn or blurry, AI extracts partial text fragments, dosage numbers, and logo clues.'
    },
    {
      num: '03',
      icon: <Fingerprint className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
      title: '🧩 Build Medicine Fingerprint',
      desc: 'Aggregates textual clues, strength, manufacturer logos, pack geometry, and tablet shape into a digital fingerprint.'
    },
    {
      num: '04',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
      title: '🛡 Assess Confidence & Verify',
      desc: 'Ranks candidate matches with HIGH, MEDIUM, or LOW confidence ratings, requiring user review.'
    },
    {
      num: '05',
      icon: <Volume2 className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-100',
      title: '🔊 Explain & Read Out Loud',
      desc: 'Presents accessible information with high contrast typography and spoken voice audio in English or Tamil.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-white via-sky-50/70 to-blue-50/40 border border-sky-100 p-8 rounded-3xl text-center space-y-3 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          MedMatch Rescue Architecture
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Not just OCR.
        </h1>

        <p className="text-base sm:text-lg text-slate-700 max-w-xl mx-auto font-medium">
          When the strip is unclear, MediRead AI tries to recover the evidence that remains instead of failing with a generic error.
        </p>
      </div>

      {/* Visual Pipeline Diagram Flow */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 text-center uppercase tracking-wider text-sky-700">
          Complete User Journey Architecture
        </h2>

        {/* Diagram Flow Box */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold text-slate-800 py-4 px-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-xs">Unclear Strip</span>
          <span className="text-sky-600">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">Evidence Recovery</span>
          <span className="text-sky-600">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 border border-purple-300">Medicine Fingerprint</span>
          <span className="text-sky-600">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-xs">Candidate Matching</span>
          <span className="text-sky-600">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">Confidence & Verification</span>
          <span className="text-sky-600">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-900 border border-sky-300">Accessible Result</span>
        </div>

        {/* Detailed 5 Steps List */}
        <div className="space-y-4 pt-4">
          {steps.map(s => (
            <div 
              key={s.num}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 flex items-start gap-4 transition-all shadow-xs"
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${s.bg}`}>
                {s.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-extrabold text-sky-700">{s.num}</span>
                  <h3 className="font-extrabold text-base text-slate-900">{s.title}</h3>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary CTA */}
      <button
        onClick={() => setCurrentRoute('scan')}
        className="w-full py-4 px-8 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-lg shadow-md shadow-sky-500/20 flex items-center justify-center gap-3 transition-transform active:scale-98"
      >
        <Camera className="w-6 h-6" />
        <span>Try Scanning Now</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
