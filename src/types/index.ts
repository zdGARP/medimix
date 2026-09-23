export type ViewRoute = 
  | 'home'
  | 'scan'
  | 'analysis'
  | 'rescue'
  | 'fingerprint'
  | 'candidates'
  | 'result'
  | 'verification'
  | 'cabinet'
  | 'details'
  | 'reminders'
  | 'accessibility'
  | 'language'
  | 'security'
  | 'how_it_works';

export type DemoState = 
  | 'clear_high_confidence'
  | 'damaged_rescue'
  | 'medium_confidence'
  | 'low_confidence'
  | 'expiry_unreadable'
  | 'empty_cabinet'
  | 'tamil_mode';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ExpiryStatus = 'NOT_EXPIRED' | 'EXPIRING_SOON' | 'EXPIRED' | 'CANNOT_VERIFY';

export interface EvidenceFragment {
  id: string;
  type: 'text' | 'strength' | 'manufacturer' | 'expiry' | 'packaging' | 'tablet' | 'voice';
  label: string;
  value: string;
  confidence: number; // 0 - 100
  status: 'matched' | 'partial' | 'missing' | 'unclear';
  boundingBox?: { top: number; left: number; width: number; height: number };
}

export interface CandidateMatch {
  id: string;
  name: string;
  strength: string;
  manufacturer: string;
  matchReasons: string[];
  evidenceCoveragePercent: number;
  confidenceLevel: ConfidenceLevel;
  visualSimilarity: number;
  packagingType: string;
  isBestMatch?: boolean;
}

export interface MedicineItem {
  id: string;
  name: string;
  strength: string;
  manufacturer: string;
  batchNumber: string;
  mfgDate: string;
  expiryDate: string;
  expiryStatus?: ExpiryStatus;
  isExpired: boolean;
  dosageForm: string;
  instructions: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number; // e.g. 92
  matchReasons: string[];
  recoveredEvidence: EvidenceFragment[];
  imageSrc: string;
  audioTextEn: string;
  audioTextTa: string;
  savedAt: string;
  verificationStatus: 'verified_by_user' | 'pending_verification' | 'pharmacist_reviewed';
}

export interface ReminderItem {
  id: string;
  medicineId?: string;
  medicineName: string;
  strength: string;
  time: string;
  frequency: string;
  type: 'dose' | 'expiry';
  expiryDate?: string;
  active: boolean;
  notes?: string;
}

export interface AccessibilitySettings {
  voiceFirstMode: boolean;
  largeText: boolean;
  highContrast: boolean;
  autoReadResults: boolean;
  voiceGuidance: boolean;
  speechRate: 'slow' | 'normal' | 'fast';
  language: string;
}

export type AngleType = 'Front' | 'Back' | 'Close-up' | 'Expiry';

export interface CapturedPhoto {
  id: string;
  type: 'front' | 'back' | 'expiry' | 'tablet';
  angleLabel: AngleType;
  file?: File | Blob;
  previewUrl: string;
  timestamp: number;
}

export interface ExtractedEvidence {
  rawText: string[];
  partialTextFragments: string[];
  strength: string | null;
  manufacturer: string | null;
  batchNumber: string | null;
  manufacturingDate: string | null;
  expiryDate: string | null;
  dosageForm: string | null;
  visualClues: string[];
  packagingClues: string[];
  logoClues: string[];
  tabletClues: string[];
  imageQuality: {
    blur: 'LOW' | 'MEDIUM' | 'HIGH';
    glare: 'LOW' | 'MEDIUM' | 'HIGH';
    darkness: 'LOW' | 'MEDIUM' | 'HIGH';
    cropping: 'LOW' | 'MEDIUM' | 'HIGH';
    occlusion: 'LOW' | 'MEDIUM' | 'HIGH';
    perspective: 'LOW' | 'MEDIUM' | 'HIGH';
    readability: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  overallEvidenceQuality: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MedicineFingerprint {
  textFragments: string[];
  strength: string | null;
  manufacturer: string | null;
  logo: string | null;
  packagingShape: string | null;
  tabletVisual: string | null;
  voiceContext?: string | null;
}
