import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Eye, 
  Type, 
  Volume2, 
  Globe, 
  Check, 
  Sliders, 
  Settings 
} from 'lucide-react';

export const AccessibilitySettingsView: React.FC = () => {
  const { accessibility, setAccessibility } = useApp();
  const isTa = accessibility.language === 'ta';

  const toggle = (key: keyof typeof accessibility) => {
    setAccessibility(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key]
    }));
  };

  const setSpeechSpeed = (speed: 'slow' | 'normal' | 'fast') => {
    setAccessibility(prev => ({ ...prev, speechRate: speed }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-2 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isTa ? 'அணுகல்தன்மை அமைப்புகள்' : 'Accessibility Settings'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {isTa 
                ? 'முதியோர்கள் மற்றும் பார்வை குறைபாடு உள்ளவர்களுக்கான பெரிய பொத்தான்கள் மற்றும் குரல் அமைப்புகள்' 
                : 'Tailor high-contrast display, speech readout rate, and font sizes for maximum legibility.'}
            </p>
          </div>
        </div>
      </div>

      {/* Accessibility Large Toggle Controls */}
      <div className="space-y-4">
        {/* High Contrast */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-yellow-50 text-yellow-700 border border-yellow-200">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">
                {isTa ? 'உயர்ந்த மாறுபாடு (High Contrast)' : 'High Contrast Display'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                True black and yellow high-contrast colors for low vision readability.
              </p>
            </div>
          </div>

          <button
            onClick={() => toggle('highContrast')}
            className={`w-16 h-9 rounded-full p-1 border transition-colors flex items-center shrink-0 ${
              accessibility.highContrast 
                ? 'bg-yellow-400 border-yellow-500 justify-end' 
                : 'bg-slate-200 border-slate-300 justify-start'
            }`}
            aria-label="Toggle High Contrast"
          >
            <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center">
              {accessibility.highContrast && <Check className="w-4 h-4 text-yellow-600" />}
            </div>
          </button>
        </div>

        {/* Large Text */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200">
              <Type className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">
                {isTa ? 'பெரிய எழுத்துக்கள் (Large Text)' : 'Large Typography Scaling'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Enlarges all headings, body text, and touch target buttons.
              </p>
            </div>
          </div>

          <button
            onClick={() => toggle('largeText')}
            className={`w-16 h-9 rounded-full p-1 border transition-colors flex items-center shrink-0 ${
              accessibility.largeText 
                ? 'bg-sky-600 border-sky-600 justify-end' 
                : 'bg-slate-200 border-slate-300 justify-start'
            }`}
            aria-label="Toggle Large Text"
          >
            <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center">
              {accessibility.largeText && <Check className="w-4 h-4 text-sky-600" />}
            </div>
          </button>
        </div>

        {/* Voice-First Mode */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200">
              <Volume2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">
                {isTa ? 'குரல்-முதல் முறை (Voice-First)' : 'Voice-First Navigation Mode'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Automatically reads out scan results and evidence summaries out loud.
              </p>
            </div>
          </div>

          <button
            onClick={() => toggle('voiceFirstMode')}
            className={`w-16 h-9 rounded-full p-1 border transition-colors flex items-center shrink-0 ${
              accessibility.voiceFirstMode 
                ? 'bg-purple-600 border-purple-600 justify-end' 
                : 'bg-slate-200 border-slate-300 justify-start'
            }`}
            aria-label="Toggle Voice-First Mode"
          >
            <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center">
              {accessibility.voiceFirstMode && <Check className="w-4 h-4 text-purple-600" />}
            </div>
          </button>
        </div>
      </div>

      {/* Speech Speed Selector */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-sky-600" />
          <span>Speech Readout Speed (TTS Rate)</span>
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {(['slow', 'normal', 'fast'] as const).map(speed => (
            <button
              key={speed}
              onClick={() => setSpeechSpeed(speed)}
              className={`py-3.5 px-4 rounded-2xl border text-sm font-extrabold capitalize transition-all ${
                accessibility.speechRate === speed
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {speed === 'slow' ? '🐢 Slow (0.75x)' : speed === 'normal' ? '🚶 Normal (1.0x)' : '⚡ Fast (1.25x)'}
            </button>
          ))}
        </div>
      </div>

      {/* Language Toggle Selection */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-600" />
          <span>Spoken Language & Interface</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setAccessibility(prev => ({ ...prev, language: 'en' }))}
            className={`py-4 px-6 rounded-2xl border text-base font-extrabold flex items-center justify-center gap-2 transition-all ${
              accessibility.language === 'en'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>English (US/UK)</span>
          </button>

          <button
            onClick={() => setAccessibility(prev => ({ ...prev, language: 'ta' }))}
            className={`py-4 px-6 rounded-2xl border text-base font-extrabold flex items-center justify-center gap-2 transition-all ${
              accessibility.language === 'ta'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>தமிழ் (Tamil)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
