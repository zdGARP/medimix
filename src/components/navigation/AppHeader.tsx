import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Pill, Eye, Type, Volume2, Globe, ShieldCheck, Settings, Sparkles } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    accessibility, 
    toggleHighContrast, 
    toggleLargeText, 
    isSpeaking,
    stopSpeaking
  } = useApp();
  
  // Add language context
  const { selectedLanguage, setSelectedLanguageCode, availableLanguages } = useLanguage();

  return (
    <header className="bg-white border-b border-[#E9E8E5] px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-xs">
      {/* Brand Logo & Name */}
      <div 
        onClick={() => setCurrentRoute('home')}
        className="flex items-center gap-3 cursor-pointer group"
        role="button"
        tabIndex={0}
        aria-label="MediRead AI Home"
      >
        <div className="w-10 h-10 rounded-xl bg-[#2FA89B] hover:bg-[#287F78] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
          <Pill className="w-6 h-6 rotate-45" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg md:text-xl tracking-tight text-slate-800 group-hover:text-[#287F78] transition-colors">
              MediRead <span className="text-[#2FA89B]">AI</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F8EFE7] text-[#9E5D24] border border-[#F2D7C2] flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#9E5D24]" />
              MedMatch Rescue
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
            Scan • Recover • Verify • Understand
          </p>
        </div>
      </div>

      {/* Accessibility Toolbar Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Active Audio Stop indicator if currently speaking */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="px-2.5 py-1 rounded-full bg-[#F7EDEF] text-[#9F2E40] border border-[#F3CDD4] text-xs font-semibold flex items-center gap-1 animate-pulse"
            aria-label="Stop Voice Readout"
          >
            <Volume2 className="w-4 h-4 text-[#9F2E40]" />
            <span className="hidden sm:inline">Stop Audio</span>
          </button>
        )}

        {/* High Contrast Toggle */}
        <button
          onClick={toggleHighContrast}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            accessibility.highContrast 
              ? 'bg-yellow-400 text-black border-yellow-500 font-bold' 
              : 'bg-[#F6F7F5] text-slate-700 border-[#E9E8E5] hover:bg-slate-100'
          }`}
          title="Toggle High Contrast Mode"
          aria-label="Toggle High Contrast"
        >
          <Eye className="w-4 h-4 text-slate-600" />
          <span className="hidden md:inline">Contrast</span>
        </button>

        {/* Large Text Toggle */}
        <button
          onClick={toggleLargeText}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            accessibility.largeText 
              ? 'bg-[#2FA89B] text-white border-[#287F78] font-bold' 
              : 'bg-[#F6F7F5] text-slate-700 border-[#E9E8E5] hover:bg-slate-100'
          }`}
          title="Toggle Large Text Mode"
          aria-label="Toggle Large Text"
        >
          <Type className="w-4 h-4" />
          <span className="hidden md:inline">Large Text</span>
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative group/lang">
          <div className="px-3 py-2 rounded-xl bg-[#F6F7F5] hover:bg-slate-100 text-slate-700 border border-[#E9E8E5] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
            <Globe className="w-4 h-4 text-[#2FA89B]" />
            <span className="hidden sm:inline">{selectedLanguage.name}</span>
            <span className="sm:hidden">{selectedLanguage.code.toUpperCase()}</span>
            <span className="text-[10px] ml-1 opacity-60">▼</span>
          </div>
          
          <div className="absolute right-0 top-full mt-2 w-48 max-h-64 overflow-y-auto bg-white border border-[#E9E8E5] rounded-xl shadow-lg opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all z-50">
            {availableLanguages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguageCode(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-[#F6F7F5] flex items-center justify-between ${
                  selectedLanguage.code === lang.code ? 'text-[#2FA89B] bg-[#E6F4EF]' : 'text-slate-700'
                }`}
              >
                <span>{lang.name}</span>
                <span className="text-slate-400 text-[10px]">{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Security Badge */}
        <button
          onClick={() => setCurrentRoute('security')}
          className="p-2 rounded-xl bg-[#E6F4EF] text-[#287F78] border border-[#C6EADF] hover:bg-[#DDF3EF] transition-colors hidden sm:flex items-center gap-1"
          title="Biometric Cabinet Security Active"
          aria-label="Security Status"
        >
          <ShieldCheck className="w-4 h-4 text-[#2FA89B]" />
        </button>

        {/* Accessibility Settings Screen Link */}
        <button
          onClick={() => setCurrentRoute('accessibility')}
          className={`p-2 rounded-xl border transition-colors ${
            currentRoute === 'accessibility' 
              ? 'bg-[#2FA89B] text-white border-[#287F78]' 
              : 'bg-[#F6F7F5] text-slate-700 border-[#E9E8E5] hover:bg-slate-100'
          }`}
          aria-label="Accessibility Settings"
          title="Accessibility Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
