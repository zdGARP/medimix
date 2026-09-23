import React from 'react';
import type { ConfidenceLevel } from '../../types';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  score?: number;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ level, score }) => {
  if (level === 'HIGH') {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F4EF] border border-[#C6EADF] text-[#287F78] font-extrabold text-xs sm:text-sm">
        <CheckCircle2 className="w-4 h-4 text-[#2FA89B] shrink-0" />
        <span>HIGH CONFIDENCE</span>
        {score && <span className="px-1.5 py-0.2 rounded bg-white text-[#287F78] text-[11px] font-mono font-bold border border-[#C6EADF]">{score}% Match</span>}
      </div>
    );
  }

  if (level === 'MEDIUM') {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF4DD] border border-[#FDE6B5] text-[#9A6200] font-extrabold text-xs sm:text-sm">
        <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
        <span>MEDIUM CONFIDENCE</span>
        {score && <span className="px-1.5 py-0.2 rounded bg-white text-[#9A6200] text-[11px] font-mono font-bold border border-[#FDE6B5]">{score}% Match</span>}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7EDEF] border border-[#F3CDD4] text-[#9F2E40] font-extrabold text-xs sm:text-sm">
      <ShieldAlert className="w-4 h-4 text-[#DC2626] shrink-0" />
      <span>MEDICINE NOT CONFIRMED</span>
      {score && <span className="px-1.5 py-0.2 rounded bg-white text-[#9F2E40] text-[11px] font-mono font-bold border border-[#F3CDD4]">{score}% Match</span>}
    </div>
  );
};
