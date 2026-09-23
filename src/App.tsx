import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { testSupabaseConnection } from './lib/supabase';
import { AppHeader } from './components/navigation/AppHeader';
import { BottomNav } from './components/navigation/BottomNav';
import { Sidebar } from './components/navigation/Sidebar';
import { BiometricModal } from './components/ui/BiometricModal';

import { HomeView } from './views/HomeView';
import { ScanMedicineView } from './views/ScanMedicineView';
import { ScanAnalysisView } from './views/ScanAnalysisView';
import { RescueModeView } from './views/RescueModeView';
import { FingerprintView } from './views/FingerprintView';
import { CandidateMatchesView } from './views/CandidateMatchesView';
import { MedicineResultView } from './views/MedicineResultView';
import { VerificationView } from './views/VerificationView';
import { MedicineCabinetView } from './views/MedicineCabinetView';
import { MedicineDetailsView } from './views/MedicineDetailsView';
import { RemindersView } from './views/RemindersView';
import { AccessibilitySettingsView } from './views/AccessibilitySettingsView';
import { LanguageVoiceView } from './views/LanguageVoiceView';
import { BiometricView } from './views/BiometricView';
import { HowItWorksView } from './views/HowItWorksView';

const MainRouter: React.FC = () => {
  const { currentRoute } = useApp();

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const renderView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'scan':
        return <ScanMedicineView />;
      case 'analysis':
        return <ScanAnalysisView />;
      case 'rescue':
        return <RescueModeView />;
      case 'fingerprint':
        return <FingerprintView />;
      case 'candidates':
        return <CandidateMatchesView />;
      case 'result':
        return <MedicineResultView />;
      case 'verification':
        return <VerificationView />;
      case 'cabinet':
        return <MedicineCabinetView />;
      case 'details':
        return <MedicineDetailsView />;
      case 'reminders':
        return <RemindersView />;
      case 'accessibility':
        return <AccessibilitySettingsView />;
      case 'language':
        return <LanguageVoiceView />;
      case 'security':
        return <BiometricView />;
      case 'how_it_works':
        return <HowItWorksView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-slate-800 font-sans selection:bg-[#E6F4EF] selection:text-[#287F78]">
      {/* Main Accessible App Header (Starts directly at top) */}
      <AppHeader />

      {/* App Main Body Layout with Desktop Sidebar & Mobile Bottom Nav */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto mb-16 md:mb-0">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Biometric Verification Modal */}
      <BiometricModal />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <MainRouter />
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
