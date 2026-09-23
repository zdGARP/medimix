import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { getStaticTranslation } from '../services/translationService';
import { 
  Pill, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  ArrowRight,
  Lock,
  Trash2
} from 'lucide-react';
import { VoiceButton } from '../components/ui/VoiceButton';

export const MedicineCabinetView: React.FC = () => {
  const { 
    savedMedicines, 
    deleteSavedMedicine, 
    setCurrentRoute, 
    promptBiometricAuth 
  } = useApp();
  const { selectedLanguage } = useLanguage();
  const lang = selectedLanguage.code;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedicines = savedMedicines.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.strength.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteWithAuth = (id: string) => {
    promptBiometricAuth(() => {
      deleteSavedMedicine(id);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <Pill className="w-7 h-7 text-sky-600" />
              <span>{getStaticTranslation('myMedicineCabinet', lang, 'My Medicine Cabinet')}</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {getStaticTranslation('cabinetSubtitle', lang, 'Your personal saved medicines and active reminders.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Security Tag */}
          <span 
            onClick={() => setCurrentRoute('security')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100 transition-colors"
            title="Biometric Protection Active"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>🔐 Protected</span>
          </span>

          <button
            onClick={() => setCurrentRoute('scan')}
            className="py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{getStaticTranslation('addMedicine', lang, 'Add Medicine')}</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={getStaticTranslation('searchPlaceholder', lang, 'Search medicines by name, strength, or manufacturer...')}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none shadow-xs font-medium"
        />
      </div>

      {/* Medicines Cards List */}
      {filteredMedicines.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4 shadow-xs">
          <Pill className="w-16 h-16 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">
            {getStaticTranslation('emptyCabinet', lang, 'Your Medicine Cabinet is Empty')}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto font-medium">
            Scan your medicine packaging using MediRead AI to identify, verify, and store items safely in your cabinet.
          </p>
          <button
            onClick={() => setCurrentRoute('scan')}
            className="py-3 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-xs"
          >
            Scan your first medicine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMedicines.map(med => (
            <div 
              key={med.id}
              className="bg-white border border-slate-200 hover:border-sky-300 rounded-3xl p-5 space-y-4 transition-all shadow-xs group relative"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 font-extrabold text-xs">
                      {med.strength}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      {med.verificationStatus === 'verified_by_user' ? '✓ Verified' : 'Pending'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 group-hover:text-sky-700 transition-colors">
                    {med.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">{med.manufacturer}</p>
                </div>

                <button
                  onClick={() => handleDeleteWithAuth(med.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Medicine (Biometric Prompt)"
                  aria-label="Delete Medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Expiry & Reminder Pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Expiry: <strong>{med.expiryDate}</strong></span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Daily Dose: 8:00 AM</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <VoiceButton 
                  textToSpeak={med.name + " " + med.strength}
                  label="Listen"
                  size="sm"
                  variant="secondary"
                />

                <button
                  onClick={() => setCurrentRoute('details')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
