import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Camera, 
  Mic, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { VoiceButton } from '../components/ui/VoiceButton';

export const RescueModeView: React.FC = () => {
  const { setCurrentRoute, accessibility } = useApp();
  const isTa = accessibility.language === 'ta';

  const [activeBoxHover, setActiveBoxHover] = useState<string | null>(null);
  const [userContextInput, setUserContextInput] = useState<string>('');

  const rescueAudioEn = "MedMatch Rescue Mode activated. Your medicine packaging is damaged or blurry, but we recovered partial clues: CETAM text fragment, 500 milligrams strength, and XYZ Pharma logo clue. Expiry date could not be read. You can add more photos or describe what you remember.";
  const rescueAudioTa = "MedMatch மீட்பு முறை செயல்படுத்தப்பட்டது. அட்டையில் சில எழுத்துக்கள் சிதைந்துள்ள போதிலும், 'CETAM', 500mg மற்றும் தயாரிப்பாளர் பெயர் மீட்கப்பட்டுள்ளது. மேலும் படம் எடுக்க அல்லது கூற பொத்தான்களைப் பயன்படுத்தவும்.";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Rescue Header (Warm Soft Peach / Pale Amber Background) */}
      <div className="bg-[#F8EFE7] border border-[#F2D7C2] p-6 rounded-[24px] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white text-[#9E5D24] border border-[#F2D7C2] shrink-0 shadow-xs">
              <Sparkles className="w-7 h-7 text-[#9E5D24]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#9E5D24]">
                ⚡ MedMatch Rescue Mode
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
                {isTa ? 'சேதமடைந்த அட்டை தடய மீட்பு முறை' : 'Partial Evidence Recovery Engine for Unclear Packaging'}
              </p>
            </div>
          </div>

          <VoiceButton 
            textToSpeak={isTa ? rescueAudioTa : rescueAudioEn}
            label={isTa ? '🔊 என்ன செய்வது?' : '🔊 "Tell me what to do"'}
            size="md"
            variant="secondary"
          />
        </div>

        <p className="text-slate-700 text-sm sm:text-base leading-relaxed pt-2 border-t border-[#F2D7C2] font-medium">
          {isTa 
            ? 'உங்கள் மருந்து அட்டை தெளிவாக இல்லை. எனினும், கிடைத்த தகவல்களைக் கொண்டு மருந்தைக் கண்டறிய முயல்கிறோம்.'
            : 'Your medicine strip is difficult to read or damaged. MediRead AI does not give up — we recovered partial text, dosage, and manufacturer clues below.'}
        </p>
      </div>

      {/* Damaged Medicine Strip Image with Interactive Bounding Boxes */}
      <div className="bg-white border border-[#E9E8E5] rounded-[24px] p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#2FA89B]" />
            <span>Interactive Damaged Strip Evidence Detection</span>
          </h2>
          <span className="text-xs text-[#9E5D24] font-mono font-bold bg-[#F8EFE7] px-3 py-1 rounded-full border border-[#F2D7C2]">
            3 Evidence Chips Recovered
          </span>
        </div>

        {/* Visual Mock Image with Overlay Bounding Boxes (Thin Teal Outline + Subtle Translucent Fill) */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#F6F7F5] border border-[#E9E8E5] min-h-[300px] flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80" 
            alt="Damaged Medicine Strip Scan" 
            className="w-full h-80 object-cover filter blur-[0.5px] contrast-105 brightness-95"
          />
          <div className="absolute inset-0 bg-slate-900/10"></div>

          {/* Bounding Box 1: ...CETAM... */}
          <div 
            onMouseEnter={() => setActiveBoxHover('r1')}
            onMouseLeave={() => setActiveBoxHover(null)}
            className="absolute top-[28%] left-[25%] w-[42%] h-[20%] rescue-bounding-box rounded-xl cursor-pointer flex items-center justify-between px-3"
          >
            <span className="bg-white/95 text-[#287F78] text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-[#C6EADF] shadow-xs">
              Fragment: "...CETAM..."
            </span>
            <span className="text-[10px] text-[#287F78] font-bold bg-[#E6F4EF] px-1.5 py-0.5 rounded border border-[#C6EADF]">72%</span>
          </div>

          {/* Bounding Box 2: 500 mg */}
          <div 
            onMouseEnter={() => setActiveBoxHover('r2')}
            onMouseLeave={() => setActiveBoxHover(null)}
            className="absolute top-[55%] left-[20%] w-[25%] h-[18%] rescue-bounding-box rounded-xl cursor-pointer flex items-center justify-between px-2"
          >
            <span className="bg-white/95 text-[#287F78] text-xs font-mono font-bold px-2 py-0.5 rounded border border-[#C6EADF] shadow-xs">
              Strength: "500 mg"
            </span>
            <span className="text-[10px] text-[#287F78] font-bold bg-[#E6F4EF] px-1 py-0.5 rounded border border-[#C6EADF]">88%</span>
          </div>

          {/* Bounding Box 3: XYZ Pharma */}
          <div 
            onMouseEnter={() => setActiveBoxHover('r3')}
            onMouseLeave={() => setActiveBoxHover(null)}
            className="absolute top-[72%] left-[50%] w-[38%] h-[18%] rescue-bounding-box rounded-xl cursor-pointer flex items-center justify-between px-2"
          >
            <span className="bg-white/95 text-[#287F78] text-xs font-mono font-bold px-2 py-0.5 rounded border border-[#C6EADF] shadow-xs">
              Logo: "XYZ Pharma"
            </span>
            <span className="text-[10px] text-[#287F78] font-bold bg-[#E6F4EF] px-1 py-0.5 rounded border border-[#C6EADF]">65%</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 italic text-center font-medium">
          {activeBoxHover 
            ? `* Inspected bounding fragment ${activeBoxHover} (Extracted clue)` 
            : '* Hover or tap bounding boxes above to inspect individual evidence fragments extracted from torn foil.'}
        </p>
      </div>

      {/* Recovered Evidence Summary Checklist (Soft Pastel Chips) */}
      <div className="bg-white border border-[#E9E8E5] rounded-[24px] p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#2FA89B]" />
          <span>Evidence Recovery Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#E6F4EF] border border-[#C6EADF] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2FA89B] shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Partial Medicine Text</p>
              <p className="text-xs text-[#287F78] font-mono font-bold">Matched "...CETAM..."</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#E6F4EF] border border-[#C6EADF] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2FA89B] shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Dosage Strength</p>
              <p className="text-xs text-[#287F78] font-mono font-bold">Matched "500 mg"</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#E6F4EF] border border-[#C6EADF] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2FA89B] shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Manufacturer Clue</p>
              <p className="text-xs text-[#287F78] font-mono font-bold">XYZ Pharma Logo Fragment</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7EDEF] border border-[#F3CDD4] flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">Expiry Date</p>
              <p className="text-xs text-[#9F2E40] font-mono font-bold">⚠ Torn / Not Readable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add More Evidence Actions */}
      <div className="bg-white border border-[#E9E8E5] rounded-[24px] p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#2FA89B]" />
          <span>Add More Evidence to Improve Match Accuracy</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button 
            onClick={() => setCurrentRoute('scan')}
            className="p-3 rounded-2xl bg-[#F6F7F5] hover:bg-slate-100 text-slate-800 border border-[#E9E8E5] font-bold text-xs flex flex-col items-center gap-2 text-center transition-colors"
          >
            <Camera className="w-5 h-5 text-[#2FA89B]" />
            <span>Scan Front</span>
          </button>

          <button 
            onClick={() => setCurrentRoute('scan')}
            className="p-3 rounded-2xl bg-[#F6F7F5] hover:bg-slate-100 text-slate-800 border border-[#E9E8E5] font-bold text-xs flex flex-col items-center gap-2 text-center transition-colors"
          >
            <Camera className="w-5 h-5 text-[#2FA89B]" />
            <span>Scan Back</span>
          </button>

          <button 
            onClick={() => setCurrentRoute('scan')}
            className="p-3 rounded-2xl bg-[#F6F7F5] hover:bg-slate-100 text-slate-800 border border-[#E9E8E5] font-bold text-xs flex flex-col items-center gap-2 text-center transition-colors"
          >
            <Camera className="w-5 h-5 text-[#2FA89B]" />
            <span>Close-up</span>
          </button>

          <button 
            onClick={() => setCurrentRoute('language')}
            className="p-3 rounded-2xl bg-[#F6F7F5] hover:bg-slate-100 text-slate-800 border border-[#E9E8E5] font-bold text-xs flex flex-col items-center gap-2 text-center transition-colors"
          >
            <Mic className="w-5 h-5 text-[#6B5A94]" />
            <span>Voice Input</span>
          </button>
        </div>

        {/* User Context Input Field */}
        <div className="pt-2">
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Tell us what you remember (e.g. "Given for fever", "White round pill"):
          </label>
          <input 
            type="text"
            value={userContextInput}
            onChange={(e) => setUserContextInput(e.target.value)}
            placeholder="Type or speak what doctor prescribed this for..."
            className="w-full bg-[#F6F7F5] border border-[#E9E8E5] rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#2FA89B] focus:bg-white focus:outline-none shadow-xs font-medium"
          />
        </div>
      </div>

      {/* Main Flow Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentRoute('fingerprint')}
          className="py-3.5 px-6 rounded-[14px] bg-[#F8EFE7] hover:bg-[#F2D7C2] text-[#9E5D24] border border-[#F2D7C2] font-extrabold text-base shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <Layers className="w-5 h-5 text-[#9E5D24]" />
          <span>Build Medicine Fingerprint</span>
        </button>

        <button
          onClick={() => setCurrentRoute('candidates')}
          className="py-3.5 px-6 rounded-[14px] bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-base shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <span>View Candidate Matches</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
