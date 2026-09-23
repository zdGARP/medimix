import React from 'react';
import { useApp } from '../../context/AppContext';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceButtonProps {
  textToSpeak: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  langOverride?: 'en' | 'ta';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  textToSpeak,
  label = 'Listen',
  size = 'md',
  variant = 'primary',
  langOverride
}) => {
  const { isSpeaking, activeSpokenText, speakText, stopSpeaking, accessibility } = useApp();
  const isTa = (langOverride || accessibility.language) === 'ta';

  const isCurrentActive = isSpeaking && activeSpokenText === textToSpeak;

  const handleClick = () => {
    if (isCurrentActive) {
      stopSpeaking();
    } else {
      speakText(textToSpeak, langOverride);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4 py-2.5 text-sm font-bold gap-2 min-h-[44px]',
    lg: 'px-6 py-3.5 text-base font-bold gap-3 min-h-[52px]'
  }[size];

  const variantClasses = {
    primary: isCurrentActive 
      ? 'bg-[#DC2626] text-white shadow-xs border-[#DC2626] animate-pulse' 
      : 'bg-[#2FA89B] hover:bg-[#287F78] text-white shadow-xs border-[#2FA89B]',
    secondary: isCurrentActive 
      ? 'bg-[#F7EDEF] text-[#9F2E40] border-[#F3CDD4]' 
      : 'bg-[#E6F4EF] hover:bg-[#DDF3EF] text-[#287F78] border-[#C6EADF]',
    outline: isCurrentActive
      ? 'bg-[#F7EDEF] text-[#9F2E40] border-[#F3CDD4]'
      : 'border border-[#2FA89B] hover:bg-[#EFF9F7] text-[#287F78] bg-white'
  }[variant];

  return (
    <button
      onClick={handleClick}
      className={`rounded-xl border flex items-center justify-center transition-all active:scale-95 ${sizeClasses} ${variantClasses}`}
      aria-label={`${label}: ${textToSpeak}`}
    >
      {isCurrentActive ? (
        <>
          <VolumeX className="w-5 h-5 text-white" />
          <span>{isTa ? 'ஆடியோவை நிறுத்து' : 'Stop Audio'}</span>
          <div className="flex items-center gap-0.5 ml-1">
            <span className="w-1 bg-white rounded-full animate-voice-wave-1"></span>
            <span className="w-1 bg-white rounded-full animate-voice-wave-2"></span>
            <span className="w-1 bg-white rounded-full animate-voice-wave-3"></span>
          </div>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 text-[#2FA89B]" />
          <span>{label}</span>
          {isTa && <span className="text-[10px] opacity-80">(தமிழ்)</span>}
        </>
      )}
    </button>
  );
};
