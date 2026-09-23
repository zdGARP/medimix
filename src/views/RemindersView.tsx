import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Calendar, Plus, Clock, Check } from 'lucide-react';
import { VoiceButton } from '../components/ui/VoiceButton';

export const RemindersView: React.FC = () => {
  const { reminders, toggleReminder, addReminder, accessibility } = useApp();
  const isTa = accessibility.language === 'ta';

  const [activeTab, setActiveTab] = useState<'dose' | 'expiry'>('dose');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newTime, setNewTime] = useState('09:00 AM');

  const filteredReminders = reminders.filter(r => r.type === activeTab);

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    addReminder({
      id: `rem-${Date.now()}`,
      medicineName: newMedName,
      strength: '500 mg',
      time: newTime,
      frequency: 'Daily',
      type: activeTab,
      active: true
    });
    setNewMedName('');
    setShowAddModal(false);
  };

  const audioTextEn = "Reminders screen. You have active dose reminders for Paracetamol at 8:00 AM and Metformin at 8:30 PM. Expiry warnings are set for October 2026.";
  const audioTextTa = "நினைவூட்டல்கள் பக்கம். பாராசிட்டமால் காலை 8 மணிக்கும் மெட்ஃப்பார்மின் இரவு 8:30 மணிக்கும் நினைவூட்டல் அமைக்கப்பட்டுள்ளது.";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-7 h-7 text-sky-600" />
            <span>{isTa ? 'நினைவூட்டல்கள்' : 'Medicine & Expiry Reminders'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            {isTa ? 'மருந்து சாப்பிடும் நேரம் மற்றும் காலாவதி எச்சரிக்கைகள்' : 'Never miss a dose and receive warnings before medicines expire.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <VoiceButton 
            textToSpeak={isTa ? audioTextTa : audioTextEn}
            label="Listen"
            size="md"
            variant="secondary"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isTa ? 'நினைவூட்டல் சேர்' : 'Add Reminder'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('dose')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'dose' 
              ? 'border-sky-600 text-sky-700' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Medicine Dose Reminders</span>
        </button>

        <button
          onClick={() => setActiveTab('expiry')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'expiry' 
              ? 'border-sky-600 text-sky-700' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Expiry Warnings</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 font-medium shadow-xs">
            No active reminders found for this section.
          </div>
        ) : (
          filteredReminders.map(rem => (
            <div 
              key={rem.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl border ${
                  rem.type === 'dose' 
                    ? 'bg-sky-50 border-sky-200 text-sky-700' 
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  {rem.type === 'dose' ? <Clock className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-900">{rem.medicineName}</h3>
                    <span className="text-xs text-sky-700 font-bold">{rem.strength}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {rem.frequency} • <strong className="text-slate-900">{rem.time}</strong>
                  </p>
                  {rem.notes && <p className="text-[11px] text-slate-500 italic mt-0.5">{rem.notes}</p>}
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleReminder(rem.id)}
                className={`w-14 h-8 rounded-full p-1 border transition-colors flex items-center ${
                  rem.active 
                    ? 'bg-emerald-500 border-emerald-400 justify-end' 
                    : 'bg-slate-200 border-slate-300 justify-start'
                }`}
                aria-label="Toggle Reminder"
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                  {rem.active && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Simple Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateReminder} className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Add New Reminder</h3>
            
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Medicine Name</label>
              <input 
                type="text"
                required
                value={newMedName}
                onChange={e => setNewMedName(e.target.value)}
                placeholder="e.g. Paracetamol 500mg"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Time / Frequency</label>
              <input 
                type="text"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                placeholder="e.g. 08:00 AM Daily"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs hover:bg-sky-500"
              >
                Save Reminder
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
