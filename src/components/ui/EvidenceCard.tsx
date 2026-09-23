import React from 'react';
import type { EvidenceFragment } from '../../types';
import { Check, AlertCircle, FileSearch, Sparkles } from 'lucide-react';

interface EvidenceCardProps {
  evidence: EvidenceFragment[];
  title?: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, title = 'Recovered Evidence Clues' }) => {
  return (
    <div className="bg-white border border-[#E9E8E5] rounded-[18px] p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E9E8E5]">
        <div className="flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-[#2FA89B]" />
          <h3 className="font-bold text-base text-slate-800">{title}</h3>
        </div>
        <span className="text-xs text-slate-600 bg-[#F6F7F5] px-2.5 py-1 rounded-full border border-[#E9E8E5] font-medium">
          {evidence.length} Signals Captured
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {evidence.map(item => {
          let statusIcon = <Check className="w-4 h-4 text-[#2FA89B]" />;
          let statusBg = 'bg-[#E6F4EF] border-[#C6EADF] text-[#287F78]';

          if (item.status === 'partial') {
            statusIcon = <Sparkles className="w-4 h-4 text-[#D97706]" />;
            statusBg = 'bg-[#FFF4DD] border-[#FDE6B5] text-[#9A6200]';
          } else if (item.status === 'missing' || item.status === 'unclear') {
            statusIcon = <AlertCircle className="w-4 h-4 text-[#DC2626]" />;
            statusBg = 'bg-[#F7EDEF] border-[#F3CDD4] text-[#9F2E40]';
          }

          return (
            <div 
              key={item.id}
              className={`p-3 rounded-xl border flex items-start gap-3 ${statusBg}`}
            >
              <div className="mt-0.5 p-1 rounded-lg bg-white border border-[#E9E8E5] shrink-0 shadow-xs">
                {statusIcon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white border border-[#E9E8E5] font-bold">
                    {item.confidence}% Match
                  </span>
                </div>
                <p className="font-extrabold text-sm truncate">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
