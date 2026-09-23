import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { ViewRoute } from '../../types';
import { 
  Home, 
  Sparkles, 
  Fingerprint, 
  Layers, 
  Pill, 
  Bell, 
  Settings, 
  Volume2, 
  ShieldCheck, 
  HelpCircle,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRoute, setCurrentRoute, accessibility } = useApp();
  const isTa = accessibility.language === 'ta';

  // State for Advanced dropdown expand/collapse
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Primary Dashboard Modules directly visible under YOUR SPACE
  const primaryMenuItems: { route: ViewRoute; label: string; icon: React.ReactNode }[] = [
    { route: 'home', label: isTa ? 'முகப்பு' : 'Home', icon: <Home className="w-5 h-5" /> },
    { route: 'cabinet', label: isTa ? 'மருந்துகள்' : 'Medicine cabinet', icon: <Pill className="w-5 h-5" /> },
    { route: 'reminders', label: isTa ? 'நினைவூட்டல்கள்' : 'Reminders', icon: <Bell className="w-5 h-5" /> },
  ];

  // Modules inside the 5th "Advanced" expandable section
  const advancedChildItems: { route: ViewRoute; label: string; icon: React.ReactNode }[] = [
    { route: 'rescue', label: isTa ? 'MedMatch மீட்பு' : 'MedMatch Rescue', icon: <Sparkles className="w-4 h-4 text-[#9E5D24]" /> },
    { route: 'fingerprint', label: isTa ? 'மருந்து விரல்ரேகை' : 'Medicine Fingerprint', icon: <Fingerprint className="w-4 h-4" /> },
    { route: 'candidates', label: isTa ? 'சாத்தியமான மருந்துகள்' : 'Candidate Matches', icon: <Layers className="w-4 h-4" /> },
    { route: 'accessibility', label: isTa ? 'அணுகல்தன்மை அமைப்புகள்' : 'Accessibility Settings', icon: <Settings className="w-4 h-4" /> },
    { route: 'language', label: isTa ? 'குரல் உதவி' : 'Language / Voice UI', icon: <Volume2 className="w-4 h-4" /> },
    { route: 'security', label: isTa ? 'பாதுகாப்பு & விரல்ரேகை' : 'Biometric Security', icon: <ShieldCheck className="w-4 h-4" /> },
    { route: 'how_it_works', label: isTa ? 'இது எவ்வாறு இயங்குகிறது' : 'How It Works', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  // Auto-expand Advanced section if current active route belongs to Advanced children
  useEffect(() => {
    const isAdvancedRoute = advancedChildItems.some(item => item.route === currentRoute);
    if (isAdvancedRoute) {
      setIsAdvancedOpen(true);
    }
  }, [currentRoute]);

  const isAdvancedActive = advancedChildItems.some(item => item.route === currentRoute);

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-[#E9E8E5] p-5 min-h-[calc(100vh-64px)] shrink-0">
      
      {/* Sidebar Header Section Title (Matching Reference Screenshot 2) */}
      <div className="mb-3 px-1">
        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">
          YOUR SPACE
        </span>
      </div>

      {/* Primary & Advanced Navigation List */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        
        {/* 1. Home */}
        {/* 2. Scan medicine */}
        {/* 3. Medicine cabinet */}
        {/* 4. Reminders */}
        {primaryMenuItems.map(item => {
          const isActive = currentRoute === item.route || (item.route === 'home' && currentRoute === 'scan');
          return (
            <button
              key={item.route}
              onClick={() => setCurrentRoute(item.route)}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-[16px] text-sm font-bold transition-all ${
                isActive
                  ? 'bg-[#E6F4EF] text-[#287F78] border-2 border-[#2FA89B] shadow-xs'
                  : 'text-slate-700 hover:bg-[#F6F7F5] hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#2FA89B]' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {isActive && (
                <ChevronRight className="w-4 h-4 text-[#2FA89B]" />
              )}
            </button>
          );
        })}

        {/* 5. 5th Top-Level Sidebar Item: "Advanced" Expandable Dropdown */}
        <div className="pt-1">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-[16px] text-sm font-bold transition-all ${
              isAdvancedActive
                ? 'bg-[#F1EFF7] text-[#6B5A94] border border-[#DDD8EC]'
                : 'text-slate-700 hover:bg-[#F6F7F5] hover:text-slate-900 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal className={`w-5 h-5 ${isAdvancedActive ? 'text-[#6B5A94]' : 'text-slate-500'}`} />
              <span className="truncate">{isTa ? 'மேம்பட்ட அமைப்புகள்' : 'Advanced'}</span>
            </div>

            {isAdvancedOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-500 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />
            )}
          </button>

          {/* Expandable Child Modules inside Advanced */}
          {isAdvancedOpen && (
            <div className="mt-1.5 ml-3 pl-3 border-l-2 border-[#E9E8E5] space-y-1 animate-in fade-in duration-150">
              {advancedChildItems.map(child => {
                const isChildActive = currentRoute === child.route;
                return (
                  <button
                    key={child.route}
                    onClick={() => setCurrentRoute(child.route)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-bold transition-all ${
                      isChildActive
                        ? 'bg-[#E6F4EF] text-[#287F78] border border-[#C6EADF]'
                        : 'text-slate-600 hover:bg-[#F6F7F5] hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={isChildActive ? 'text-[#2FA89B]' : 'text-slate-400'}>
                        {child.icon}
                      </span>
                      <span className="truncate">{child.label}</span>
                    </div>

                    {isChildActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2FA89B] shrink-0"></span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Accessibility Status Footer Card */}
      <div className="mt-6 p-3.5 rounded-2xl bg-[#F6F7F5] border border-[#E9E8E5] text-xs">
        <div className="flex items-center justify-between text-slate-600 mb-1">
          <span className="font-bold">{isTa ? 'அணுகல் பயன்முறை' : 'Accessibility Mode'}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#2FA89B]"></span>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-700 mt-2">
          {accessibility.highContrast && (
            <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-300 font-semibold">
              High Contrast
            </span>
          )}
          {accessibility.largeText && (
            <span className="px-2 py-0.5 rounded bg-[#E6F4EF] text-[#287F78] border border-[#C6EADF] font-semibold">
              Large Text
            </span>
          )}
          {accessibility.voiceFirstMode && (
            <span className="px-2 py-0.5 rounded bg-[#F1EFF7] text-[#6B5A94] border border-[#DDD8EC] font-semibold">
              Voice-First
            </span>
          )}
          {!accessibility.highContrast && !accessibility.largeText && !accessibility.voiceFirstMode && (
            <span className="text-slate-500 italic">Standard Light Theme</span>
          )}
        </div>
      </div>
    </aside>
  );
};
