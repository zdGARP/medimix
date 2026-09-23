import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { translateDynamicText } from '../services/translationService';
import type { 
  ViewRoute, 
  DemoState, 
  AccessibilitySettings, 
  MedicineItem, 
  ReminderItem, 
  CandidateMatch,
  EvidenceFragment,
  ExtractedEvidence,
  MedicineFingerprint 
} from '../types';
import { 
  MOCK_HIGH_CONFIDENCE_MEDICINE, 
  MOCK_DAMAGED_RESCUE_EVIDENCE, 
  MOCK_CANDIDATE_MATCHES, 
  MOCK_SAVED_CABINET_MEDICINES, 
  MOCK_REMINDERS 
} from '../mock/data';
import { analyzeMedicineImages } from '../services/geminiService';
import { searchMedicinesByEvidence } from '../services/medicineService';
import { analyzeImageQuality, preprocessImage } from '../services/opencvService';

interface AppContextType {
  currentRoute: ViewRoute;
  setCurrentRoute: (route: ViewRoute) => void;
  demoState: DemoState;
  setDemoState: (state: DemoState) => void;
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleVoiceFirst: () => void;
  toggleLanguage: () => void;
  
  // Audio state & functions
  isSpeaking: boolean;
  activeSpokenText: string | null;
  speakText: (text: string, langOverride?: 'en' | 'ta') => void;
  stopSpeaking: () => void;

  // Medicine Data
  activeMedicineResult: MedicineItem | null;
  recoveredEvidence: EvidenceFragment[];
  candidateMatches: CandidateMatch[];
  savedMedicines: MedicineItem[];
  addSavedMedicine: (med: MedicineItem) => void;
  deleteSavedMedicine: (id: string) => void;

  // Real vs Demo Pipeline State
  isRealAnalysis: boolean;
  realAnalysisLoading: boolean;
  realAnalysisError: string | null;
  lastExtractedEvidence: ExtractedEvidence | null;
  lastFingerprint: MedicineFingerprint | null;
  runRealMedicineAnalysis: () => Promise<void>;

  // Reminders
  reminders: ReminderItem[];
  toggleReminder: (id: string) => void;
  addReminder: (reminder: ReminderItem) => void;

  // Captured camera photos
  capturedPhotos: string[];
  addCapturedPhoto: (photoSrc: string) => void;
  clearCapturedPhotos: () => void;

  // Biometric Auth Modal
  isBiometricModalOpen: boolean;
  biometricSuccessCallback: (() => void) | null;
  promptBiometricAuth: (onSuccess: () => void) => void;
  closeBiometricModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<ViewRoute>('home');
  const [demoState, setDemoStateInternal] = useState<DemoState>('clear_high_confidence');

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    voiceFirstMode: false,
    largeText: false,
    highContrast: false,
    autoReadResults: true,
    voiceGuidance: true,
    speechRate: 'normal',
    language: 'en'
  });

  const [savedMedicines, setSavedMedicines] = useState<MedicineItem[]>(MOCK_SAVED_CABINET_MEDICINES);
  const [reminders, setReminders] = useState<ReminderItem[]>(MOCK_REMINDERS);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpokenText, setActiveSpokenText] = useState<string | null>(null);

  // Biometric modal state
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [biometricSuccessCallback, setBiometricSuccessCallback] = useState<(() => void) | null>(null);

  // Demo state data
  const [activeMedicineResult, setActiveMedicineResult] = useState<MedicineItem | null>(MOCK_HIGH_CONFIDENCE_MEDICINE);
  const [recoveredEvidence, setRecoveredEvidence] = useState<EvidenceFragment[]>(MOCK_HIGH_CONFIDENCE_MEDICINE.recoveredEvidence);
  const [candidateMatches, setCandidateMatches] = useState<CandidateMatch[]>(MOCK_CANDIDATE_MATCHES);

  // Multilingual Context
  const languageContext = useLanguage();

  // Real Pipeline Execution State
  const [isRealAnalysis, setIsRealAnalysis] = useState<boolean>(false);
  const [realAnalysisLoading, setRealAnalysisLoading] = useState<boolean>(false);
  const [realAnalysisError, setRealAnalysisError] = useState<string | null>(null);
  const [lastExtractedEvidence, setLastExtractedEvidence] = useState<ExtractedEvidence | null>(null);
  const [lastFingerprint, setLastFingerprint] = useState<MedicineFingerprint | null>(null);

  // Sync state when Demo State Switcher is used
  const setDemoState = (newState: DemoState) => {
    setIsRealAnalysis(false);
    setRealAnalysisError(null);
    setDemoStateInternal(newState);

    if (newState === 'clear_high_confidence') {
      setActiveMedicineResult(MOCK_HIGH_CONFIDENCE_MEDICINE);
      setRecoveredEvidence(MOCK_HIGH_CONFIDENCE_MEDICINE.recoveredEvidence);
      setCandidateMatches(MOCK_CANDIDATE_MATCHES);
      setCurrentRoute('result');
    } else if (newState === 'damaged_rescue') {
      setRecoveredEvidence(MOCK_DAMAGED_RESCUE_EVIDENCE);
      setCandidateMatches(MOCK_CANDIDATE_MATCHES);
      setCurrentRoute('rescue');
    } else if (newState === 'medium_confidence') {
      setActiveMedicineResult({
        ...MOCK_HIGH_CONFIDENCE_MEDICINE,
        confidenceLevel: 'MEDIUM',
        confidenceScore: 68,
        name: 'Paracetamol (?)',
        matchReasons: ['Dosage 500mg matches', 'Partial text matches'],
        recoveredEvidence: MOCK_DAMAGED_RESCUE_EVIDENCE
      });
      setRecoveredEvidence(MOCK_DAMAGED_RESCUE_EVIDENCE);
      setCurrentRoute('result');
    } else if (newState === 'low_confidence') {
      setActiveMedicineResult({
        ...MOCK_HIGH_CONFIDENCE_MEDICINE,
        confidenceLevel: 'LOW',
        confidenceScore: 32,
        name: 'Unconfirmed Medicine',
        matchReasons: ['Low textual clarity', 'Packaging unrecognized'],
        recoveredEvidence: MOCK_DAMAGED_RESCUE_EVIDENCE
      });
      setRecoveredEvidence(MOCK_DAMAGED_RESCUE_EVIDENCE);
      setCurrentRoute('result');
    } else if (newState === 'expiry_unreadable') {
      setActiveMedicineResult({
        ...MOCK_HIGH_CONFIDENCE_MEDICINE,
        expiryDate: 'Cannot Verify',
        expiryStatus: 'CANNOT_VERIFY',
        isExpired: false,
        matchReasons: ['Medicine name matched', '⚠ Expiry date unreadable / torn strip']
      });
      setCurrentRoute('result');
    } else if (newState === 'empty_cabinet') {
      setSavedMedicines([]);
      setCurrentRoute('cabinet');
    } else if (newState === 'tamil_mode') {
      // Legacy demo state, now no-op or handled via language selector
      setCurrentRoute('home');
    }
  };

  /**
   * Run Real Pipeline: Calls Gemini API via secure server endpoint + runs Supabase Candidate Search
   */
  const runRealMedicineAnalysis = async () => {
    setIsRealAnalysis(true);
    setRealAnalysisLoading(true);
    setRealAnalysisError(null);
    setActiveMedicineResult(null);
    setRecoveredEvidence([]);
    setCandidateMatches([]);
    setLastExtractedEvidence(null);
    setLastFingerprint(null);

    if (capturedPhotos.length === 0) {
      setRealAnalysisError('No captured or uploaded medicine photos found.');
      setRealAnalysisLoading(false);
      return;
    }

    try {
      // 1. OpenCV Image Quality Analysis
      const firstPhoto = capturedPhotos[0];
      console.log('[MEDIREAD] Image captured');
      const qualityResult = await analyzeImageQuality(firstPhoto);
      console.log('[MEDIREAD] OpenCV result:', qualityResult);

      if (qualityResult.quality === 'LOW') {
        const reasonStr = qualityResult.reasons.join(', ');
        setRealAnalysisError(`Image quality is too low to analyze (${reasonStr}). Please retake the photo in better lighting or focus.`);
        setRealAnalysisError(`Image quality is too low to analyze (${reasonStr}). Please retake the photo in better lighting or focus.`);
        setActiveMedicineResult(null);
        setCurrentRoute('result');
        setRealAnalysisLoading(false);
        return;
      }

      // 2. OpenCV Image Preprocessing (Contrast/Sharpness if needed)
      const preprocessedPhoto = await preprocessImage(firstPhoto);
      const processedPhotos = [preprocessedPhoto, ...capturedPhotos.slice(1)];

      // 3. Call Gemini API via /api/analyze-medicine endpoint
      console.log('[MEDIREAD] Gemini request started');
      const geminiRes = await analyzeMedicineImages(processedPhotos);
      console.log('[MEDIREAD] Gemini raw response status:', geminiRes.success);

      if (!geminiRes.success || !geminiRes.evidence) {
        setRealAnalysisError(geminiRes.message || 'Analysis service unavailable.');
        setActiveMedicineResult(null);
        setRealAnalysisLoading(false);
        return;
      }

      const extracted = geminiRes.evidence;
      console.log('[MEDIREAD] Gemini parsed evidence:', JSON.stringify(extracted, null, 2));
      setLastExtractedEvidence(extracted);

      // 4. Query Supabase Candidate Matching Engine
      const pipelineResult = await searchMedicinesByEvidence(extracted, capturedPhotos[0]);
      console.log('[MEDIREAD] Supabase candidates:', pipelineResult.candidateMatches.length);
      console.log('[MEDIREAD] Matching result:', JSON.stringify({
        hasReliableEvidence: pipelineResult.hasReliableEvidence,
        confidenceLevel: pipelineResult.confidenceLevel,
        confidenceScore: pipelineResult.confidenceScore
      }));

      // 5. Dynamic Translation of User-Facing Reasons
      const { selectedLanguage } = languageContext;
      
      if (pipelineResult.medicineResult && pipelineResult.medicineResult.matchReasons) {
        const translatedReasons = await Promise.all(
          pipelineResult.medicineResult.matchReasons.map(r => translateDynamicText(r, selectedLanguage.code))
        );

        const translatedResult: any = {
          ...pipelineResult.medicineResult,
          matchReasons: translatedReasons
        };
        setActiveMedicineResult(translatedResult);
      } else {
        setActiveMedicineResult(pipelineResult.medicineResult);
      }

      setLastFingerprint(pipelineResult.fingerprint);
      setRecoveredEvidence(pipelineResult.recoveredEvidence);
      setCandidateMatches(pipelineResult.candidateMatches);

      console.log('[MEDIREAD] Final result:', pipelineResult.medicineResult?.name || 'NULL_RESULT');
      setRealAnalysisLoading(false);
    } catch (err: any) {
      console.error('[AppContext] Real analysis exception:', err);
      setRealAnalysisError('Analysis service unavailable.');
      setActiveMedicineResult(null);
      setRealAnalysisLoading(false);
    }
  };

  // Web Speech API Voice synthesis
  const speakText = (text: string, langOverride?: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();

    const targetTtsLocale = langOverride || languageContext.selectedLanguage.ttsLocale;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find the best voice for the locale
    const voices = window.speechSynthesis.getVoices();
    const exactVoice = voices.find(v => v.lang.replace('_', '-') === targetTtsLocale);
    const langVoice = voices.find(v => v.lang.split('-')[0] === targetTtsLocale.split('-')[0]);
    
    if (exactVoice) {
      utterance.voice = exactVoice;
      utterance.lang = exactVoice.lang;
    } else if (langVoice) {
      utterance.voice = langVoice;
      utterance.lang = langVoice.lang;
    } else {
      utterance.lang = targetTtsLocale;
      console.warn(`No exact voice found for ${targetTtsLocale}, falling back.`);
    }

    if (accessibility.speechRate === 'slow') utterance.rate = 0.75;
    else if (accessibility.speechRate === 'fast') utterance.rate = 1.25;
    else utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveSpokenText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpokenText(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpokenText(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveSpokenText(null);
  };

  // Toggle Accessibility shortcuts
  const toggleHighContrast = () => {
    setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleLargeText = () => {
    setAccessibility(prev => ({ ...prev, largeText: !prev.largeText }));
  };

  const toggleVoiceFirst = () => {
    setAccessibility(prev => ({ ...prev, voiceFirstMode: !prev.voiceFirstMode }));
  };

  const toggleLanguage = () => {
    // Deprecated via AppContext - now managed by LanguageContext selector
  };

  // Cabinet & Reminder Actions
  const addSavedMedicine = (med: MedicineItem) => {
    setSavedMedicines(prev => [med, ...prev.filter(m => m.id !== med.id)]);
  };

  const deleteSavedMedicine = (id: string) => {
    setSavedMedicines(prev => prev.filter(m => m.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const addReminder = (reminder: ReminderItem) => {
    setReminders(prev => [reminder, ...prev]);
  };

  const addCapturedPhoto = (photoSrc: string) => {
    setCapturedPhotos(prev => [...prev, photoSrc]);
  };

  const clearCapturedPhotos = () => {
    setCapturedPhotos([]);
  };

  // Biometric Auth Modal Prompt
  const promptBiometricAuth = (onSuccess: () => void) => {
    setBiometricSuccessCallback(() => onSuccess);
    setIsBiometricModalOpen(true);
  };

  const closeBiometricModal = () => {
    setIsBiometricModalOpen(false);
    setBiometricSuccessCallback(null);
  };

  // Effect to sync CSS body classes for accessibility
  useEffect(() => {
    if (accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (accessibility.largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [accessibility.highContrast, accessibility.largeText]);

  return (
    <AppContext.Provider value={{
      currentRoute,
      setCurrentRoute,
      demoState,
      setDemoState,
      accessibility: {
        ...accessibility,
        language: languageContext.selectedLanguage.code
      },
      setAccessibility,
      toggleHighContrast,
      toggleLargeText,
      toggleVoiceFirst,
      toggleLanguage,
      isSpeaking,
      activeSpokenText,
      speakText,
      stopSpeaking,
      activeMedicineResult,
      recoveredEvidence,
      candidateMatches,
      savedMedicines,
      addSavedMedicine,
      deleteSavedMedicine,
      isRealAnalysis,
      realAnalysisLoading,
      realAnalysisError,
      lastExtractedEvidence,
      lastFingerprint,
      runRealMedicineAnalysis,
      reminders,
      toggleReminder,
      addReminder,
      capturedPhotos,
      addCapturedPhoto,
      clearCapturedPhotos,
      isBiometricModalOpen,
      biometricSuccessCallback,
      promptBiometricAuth,
      closeBiometricModal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
