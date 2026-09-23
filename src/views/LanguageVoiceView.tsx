import React from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, Globe, Mic, Play } from 'lucide-react';

export const LanguageVoiceView: React.FC = () => {
  const { accessibility, speakText, isSpeaking, toggleLanguage } = useApp();
  const isTa = accessibility.language === 'ta';

  const textEn = "Your medicine appears to be Paracetamol 500 milligrams manufactured by XYZ Pharma. Expiry date is December 2027.";
  const textTa = "இந்த மருந்து Paracetamol 500 milligram என்று தெரிகிறது. XYZ பார்மா தயாரித்தது. காலாவதி தேதி டிசம்பர் 2027.";

  const activeText = isTa ? textTa : textEn;

  const handleListen = () => {
    speakText(activeText);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-2 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
            <Mic className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Voice Assistant & Language Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Bi-lingual natural voice engine supporting English and Tamil for visually impaired users.
            </p>
          </div>
        </div>
      </div>

      {/* Voice Wave Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-sm">
        {/* Animated Wave visualizer */}
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-sky-100 border-2 border-purple-300 flex items-center justify-center relative shadow-xs">
          {isSpeaking && (
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 animate-ping"></div>
          )}
          <Volume2 className={`w-14 h-14 ${isSpeaking ? 'text-purple-700 animate-pulse' : 'text-slate-500'}`} />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-mono font-bold text-purple-800 uppercase tracking-widest block">
            {isTa ? 'தமிழ் குரல் வெளியீடு' : 'Spoken Speech Readout'}
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            "{activeText}"
          </p>
        </div>

        {/* Listen Again CTA Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleListen}
            className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-base shadow-md shadow-purple-500/20 flex items-center justify-center gap-3 transition-transform active:scale-98"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{isTa ? 'மீண்டும் கேள் (Listen Again)' : 'Listen Again Out Loud'}</span>
          </button>

          <button
            onClick={toggleLanguage}
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm flex items-center justify-center gap-2 shadow-xs"
          >
            <Globe className="w-5 h-5 text-sky-600" />
            <span>Switch to {isTa ? 'English' : 'தமிழ்'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
