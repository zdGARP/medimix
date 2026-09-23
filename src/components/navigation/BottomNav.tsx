import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ViewRoute } from '../../types';
import { Home, Camera, Pill, Bell, Sparkles } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentRoute, setCurrentRoute, accessibility } = useApp();

  const isTa = accessibility.language === 'ta';

  const navItems: { route: ViewRoute; label: string; icon: React.ReactNode }[] = [
    { route: 'home', label: isTa ? 'முகப்பு' : 'Home', icon: <Home className="w-5 h-5" /> },
    { route: 'cabinet', label: isTa ? 'மருந்துகள்' : 'Cabinet', icon: <Pill className="w-5 h-5" /> },
    { route: 'reminders', label: isTa ? 'நினைவூட்டல்' : 'Reminders', icon: <Bell className="w-5 h-5" /> },
    { route: 'rescue', label: isTa ? 'மீட்பு முறை' : 'Rescue', icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E9E8E5] px-2 py-2 flex items-center justify-around shadow-sm"
    >
      {/* Home & Cabinet */}
      {navItems.slice(0, 2).map(item => (
        <button
          key={item.route}
          onClick={() => setCurrentRoute(item.route)}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[64px] min-h-[48px] rounded-xl transition-all ${
            currentRoute === item.route || (item.route === 'home' && currentRoute === 'scan')
              ? 'text-[#287F78] font-bold bg-[#E6F4EF] border border-[#C6EADF]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {item.icon}
          <span className="text-[11px] mt-1 font-semibold">{item.label}</span>
        </button>
      ))}

      {/* Primary Center Scan Button */}
      <button
        onClick={() => setCurrentRoute('home')}
        className="relative -top-4 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-[#2FA89B] hover:bg-[#287F78] text-white shadow-md shadow-[#2FA89B]/25 ring-4 ring-white active:scale-95 transition-transform"
        aria-label="Scan Medicine Strip"
      >
        <Camera className="w-7 h-7" />
        <span className="text-[9px] font-extrabold tracking-wider uppercase mt-0.5">
          {isTa ? 'ஸ்கேன்' : 'SCAN'}
        </span>
      </button>

      {/* Reminders & Rescue */}
      {navItems.slice(2).map(item => (
        <button
          key={item.route}
          onClick={() => setCurrentRoute(item.route)}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[64px] min-h-[48px] rounded-xl transition-all ${
            currentRoute === item.route
              ? 'text-[#287F78] font-bold bg-[#E6F4EF] border border-[#C6EADF]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {item.icon}
          <span className="text-[11px] mt-1 font-semibold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
