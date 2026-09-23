import React from 'react';
import { useApp } from '../../context/AppContext';
import type { DemoState } from '../../types';
import { Sparkles, AlertTriangle, CheckCircle, ShieldAlert, FileText, Volume2 } from 'lucide-react';

export const DemoStateBar: React.FC = () => {
  const { demoState, setDemoState } = useApp();

  const states: { id: DemoState; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'clear_high_confidence', label: 'Clear Strip (High)', icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'bg-[#E6F4EF] text-[#287F78] border-[#C6EADF]' },
    { id: 'damaged_rescue', label: 'Damaged Strip (Rescue)', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-[#F8EFE7] text-[#9E5D24] border-[#F2D7C2]' },
    { id: 'medium_confidence', label: 'Medium Confidence', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'bg-[#FFF4DD] text-[#9A6200] border-[#FDE6B5]' },
    { id: 'low_confidence', label: 'Low Confidence', icon: <ShieldAlert className="w-3.5 h-3.5" />, color: 'bg-[#F7EDEF] text-[#9F2E40] border-[#F3CDD4]' },
    { id: 'expiry_unreadable', label: 'Unreadable Expiry', icon: <FileText className="w-3.5 h-3.5" />, color: 'bg-[#F1EFF7] text-[#6B5A94] border-[#DDD8EC]' },
    { id: 'tamil_mode', label: 'Tamil Mode (தமிழ்)', icon: <Volume2 className="w-3.5 h-3.5" />, color: 'bg-[#E6F4EF] text-[#287F78] border-[#C6EADF]' },
    { id: 'empty_cabinet', label: 'Empty Cabinet', icon: <FileText className="w-3.5 h-3.5" />, color: 'bg-[#F6F7F5] text-slate-700 border-slate-300' },
  ];

  return (
    <div className="bg-white border-b border-[#E9E8E5] px-3 py-2 text-xs overflow-x-auto whitespace-nowrap sticky top-0 z-50 flex items-center gap-2 shadow-xs">
      <span className="text-[#287F78] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 px-2.5 py-0.5 rounded-full bg-[#E6F4EF] border border-[#C6EADF] text-[11px]">
        <Sparkles className="w-3.5 h-3.5 text-[#2FA89B]" />
        Demo Controls:
      </span>
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {states.map(s => (
          <button
            key={s.id}
            onClick={() => setDemoState(s.id)}
            className={`px-2.5 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${s.color} ${
              demoState === s.id 
                ? 'ring-2 ring-[#2FA89B] font-bold scale-105 shadow-xs' 
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
