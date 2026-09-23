import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Fingerprint, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  FileText,
  Package,
  Eye,
  Volume2
} from 'lucide-react';
import { VoiceButton } from '../components/ui/VoiceButton';

export const FingerprintView: React.FC = () => {
  const { setCurrentRoute, accessibility } = useApp();
  const isTa = accessibility.language === 'ta';

  const clues = [
    { label: 'Visible Text', value: '...CETAM...', status: 'Matched', icon: <FileText className="w-5 h-5 text-[#2FA89B]" /> },
    { label: 'Dosage Strength', value: '500 mg', status: 'Verified', icon: <Sparkles className="w-5 h-5 text-[#287F78]" /> },
    { label: 'Manufacturer', value: 'XYZ Pharma', status: 'Partial Logo', icon: <Package className="w-5 h-5 text-[#9E5D24]" /> },
    { label: 'Pack Geometry', value: '10 Tablets Blister', status: 'Matched', icon: <Package className="w-5 h-5 text-[#2FA89B]" /> },
    { label: 'Logo Signature', value: 'Detected Fragment', status: 'Verified', icon: <CheckCircle2 className="w-5 h-5 text-[#287F78]" /> },
    { label: 'Tablet Shape', value: 'White Round Flat Face', status: 'Visual Match', icon: <Eye className="w-5 h-5 text-[#6B5A94]" /> },
    { label: 'User Context', value: 'Prescribed for Fever', status: 'User Input', icon: <Volume2 className="w-5 h-5 text-[#6B5A94]" /> }
  ];

  const audioTextEn = "Medicine Fingerprint constructed. Combined evidence includes partial text CETAM, dosage strength 500 milligrams, XYZ Pharma logo clue, 10 tablet blister pack geometry, and white round tablet visual shape. Tap Find Matches to compare candidates.";
  const audioTextTa = "மருந்து விரல்ரேகை உருவாக்கப்பட்டது. சேகரிக்கப்பட்ட சான்றுகளிலிருந்து 500 மில்லிகிராம், CETAM மற்றும் அட்டை வடிவம் ஒப்பிடப்படுகிறது.";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E9E8E5] p-6 rounded-[22px] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F1EFF7] border border-[#DDD8EC] text-[#6B5A94] flex items-center justify-center shrink-0">
            <Fingerprint className="w-7 h-7 animate-pulse text-[#6B5A94]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Medicine Fingerprint
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {isTa ? 'மீட்கப்பட்ட அனைத்து தடயங்களின் கூட்டுத் தொகுப்பு' : 'Combining textual, dosage, packaging, and visual evidence into a digital fingerprint.'}
            </p>
          </div>
        </div>

        <VoiceButton 
          textToSpeak={isTa ? audioTextTa : audioTextEn}
          label="Listen Summary"
          size="md"
          variant="secondary"
        />
      </div>

      {/* Interactive Fingerprint Radar Graphic & Evidence Grid (Soft Lavender/Mint Card) */}
      <div className="bg-[#F1EFF7] border border-[#DDD8EC] rounded-[24px] p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#DDD8EC]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2FA89B] animate-ping"></span>
            <span className="text-xs font-extrabold text-[#6B5A94] uppercase tracking-widest">
              Digital Evidence Matrix
            </span>
          </div>
          <span className="text-xs text-slate-600 bg-white px-3 py-1 rounded-full border border-[#DDD8EC] font-mono font-bold shadow-xs">
            Evidence collected from 3 photos + voice input
          </span>
        </div>

        {/* Clues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {clues.map((c, i) => (
            <div 
              key={i}
              className="bg-white border border-[#DDD8EC] hover:border-[#2FA89B] p-3.5 rounded-2xl flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-[#F6F7F5] border border-[#E9E8E5] group-hover:scale-105 transition-transform shadow-xs">
                  {c.icon}
                </div>
                <div className="truncate">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {c.label}
                  </span>
                  <span className="font-extrabold text-sm text-slate-800 truncate block">
                    {c.value}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E6F4EF] text-[#287F78] border border-[#C6EADF] shrink-0">
                {c.status}
              </span>
            </div>
          ))}
        </div>

        {/* Safety Disclaimer */}
        <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-[#DDD8EC] font-medium shadow-xs">
          ℹ Note: This medicine fingerprint aggregates multi-source evidence to rank candidate matches. It does not replace professional clinical evaluation.
        </p>
      </div>

      {/* Main Action Button */}
      <button
        onClick={() => setCurrentRoute('candidates')}
        className="w-full py-4 px-8 rounded-[14px] bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-lg shadow-xs flex items-center justify-center gap-3 transition-transform active:scale-98"
      >
        <Layers className="w-6 h-6" />
        <span>Find Candidate Matches</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
