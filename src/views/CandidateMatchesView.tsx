import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Camera, 
  CheckCircle2
} from 'lucide-react';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';

export const CandidateMatchesView: React.FC = () => {
  const { setCurrentRoute, candidateMatches, accessibility } = useApp();
  const isTa = accessibility.language === 'ta';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E9E8E5] p-6 rounded-[22px] space-y-2 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4EF] border border-[#C6EADF] text-[#287F78] text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-[#2FA89B]" />
          {isTa ? 'சாத்தியமான மருந்துகள் ஒப்பீடு' : 'Candidate Comparison Matrix'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          {isTa ? 'சாத்தியமான மருந்துப் பொருத்தங்கள்' : 'Possible Matches'}
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          {isTa 
            ? 'சேகரிக்கப்பட்ட தடயங்களின் அடிப்படையில் ஒத்த மருந்துகள் பட்டியலிடப்பட்டுள்ளன.' 
            : 'We evaluated candidate medicines against your recovered evidence fingerprint.'}
        </p>
      </div>

      {/* Candidate Match Cards */}
      <div className="space-y-4">
        {candidateMatches.map((cand, idx) => (
          <div 
            key={cand.id}
            className={`bg-white border rounded-[22px] p-6 transition-all space-y-4 shadow-xs ${
              cand.isBestMatch 
                ? 'border-2 border-[#2FA89B] bg-[#E6F4EF]/30 ring-2 ring-[#2FA89B]/10' 
                : 'border-[#E9E8E5] hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9E8E5]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#F6F7F5] text-slate-700 font-extrabold text-sm flex items-center justify-center border border-[#E9E8E5] shrink-0">
                  #{idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-800">{cand.name}</h2>
                    {cand.isBestMatch && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#2FA89B] text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3" /> Best Evidence Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {cand.manufacturer} • {cand.packagingType}
                  </p>
                </div>
              </div>

              <ConfidenceBadge level={cand.confidenceLevel} score={cand.evidenceCoveragePercent} />
            </div>

            {/* Evidence Match Reasons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Why this candidate matches:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {cand.matchReasons.map((reason, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#F6F7F5] border border-[#E9E8E5] text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2FA89B] shrink-0" />
                    <span className="truncate">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Coverage Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-500">Evidence Coverage:</span>
                <span className={cand.isBestMatch ? 'text-[#287F78]' : 'text-slate-700'}>
                  {cand.evidenceCoveragePercent}% Match
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#F6F7F5] rounded-full overflow-hidden border border-[#E9E8E5]">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    cand.confidenceLevel === 'HIGH' ? 'bg-[#2FA89B]' :
                    cand.confidenceLevel === 'MEDIUM' ? 'bg-[#D97706]' :
                    'bg-[#DC2626]'
                  }`}
                  style={{ width: `${cand.evidenceCoveragePercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <button
          onClick={() => setCurrentRoute('result')}
          className="py-3.5 px-6 rounded-[14px] bg-[#2FA89B] hover:bg-[#287F78] text-white font-bold text-base shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <span>Review Best Evidence Match</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentRoute('scan')}
          className="py-3.5 px-6 rounded-[14px] bg-white hover:bg-slate-50 text-slate-800 border border-[#E9E8E5] font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Camera className="w-5 h-5 text-[#2FA89B]" />
          <span>Scan More Evidence</span>
        </button>
      </div>
    </div>
  );
};
