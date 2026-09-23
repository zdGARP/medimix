import type { MedicineItem, CandidateMatch, EvidenceFragment, ReminderItem } from '../types';

export const MOCK_HIGH_CONFIDENCE_MEDICINE: MedicineItem = {
  id: 'med-001',
  name: 'Paracetamol',
  strength: '500 mg',
  manufacturer: 'XYZ Pharma Labs',
  batchNumber: 'BT-992014',
  mfgDate: 'Jan 2025',
  expiryDate: 'Dec 2027',
  isExpired: false,
  dosageForm: 'Oral Tablet',
  instructions: 'Take 1 tablet every 6 hours after meals for fever or pain. Do not exceed 4 tablets in 24 hours.',
  confidenceLevel: 'HIGH',
  confidenceScore: 94,
  matchReasons: [
    'Medicine printed text matched 100%',
    'Dosage strength (500 mg) verified',
    'Manufacturer name & logo confirmed',
    'Packaging foil pattern & color matched'
  ],
  recoveredEvidence: [
    { id: 'e1', type: 'text', label: 'Medicine Text', value: 'PARACETAMOL IP', confidence: 98, status: 'matched' },
    { id: 'e2', type: 'strength', label: 'Strength', value: '500 mg', confidence: 96, status: 'matched' },
    { id: 'e3', type: 'manufacturer', label: 'Manufacturer', value: 'XYZ Pharma', confidence: 92, status: 'matched' },
    { id: 'e4', type: 'expiry', label: 'Expiry Date', value: 'EXP: 12/2027', confidence: 90, status: 'matched' },
    { id: 'e5', type: 'packaging', label: 'Packaging Foil', value: 'Silver Blister Pack (10 Tabs)', confidence: 95, status: 'matched' },
    { id: 'e6', type: 'tablet', label: 'Tablet Shape', value: 'White Round Flat Face', confidence: 88, status: 'matched' }
  ],
  imageSrc: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
  audioTextEn: 'Your medicine is Paracetamol 500 milligrams manufactured by XYZ Pharma Labs. Expiry date is December 2027. It is not expired.',
  audioTextTa: 'இந்த மருந்து பாராசிட்டமால் 500 மில்லிகிராம், XYZ பார்மா தயாரித்தது. காலாவதி தேதி டிசம்பர் 2027.',
  savedAt: '2026-09-23',
  verificationStatus: 'verified_by_user'
};

export const MOCK_DAMAGED_RESCUE_EVIDENCE: EvidenceFragment[] = [
  { 
    id: 'r1', 
    type: 'text', 
    label: 'Partial Text', 
    value: '...CETAM...', 
    confidence: 72, 
    status: 'partial',
    boundingBox: { top: 28, left: 35, width: 40, height: 18 }
  },
  { 
    id: 'r2', 
    type: 'strength', 
    label: 'Strength Clue', 
    value: '500 mg', 
    confidence: 88, 
    status: 'matched',
    boundingBox: { top: 52, left: 20, width: 25, height: 14 }
  },
  { 
    id: 'r3', 
    type: 'manufacturer', 
    label: 'Manufacturer Clue', 
    value: 'XYZ Pharma', 
    confidence: 65, 
    status: 'partial',
    boundingBox: { top: 70, left: 50, width: 35, height: 16 }
  },
  { 
    id: 'r4', 
    type: 'expiry', 
    label: 'Expiry Stamp', 
    value: 'Torn / Faded', 
    confidence: 15, 
    status: 'missing',
    boundingBox: { top: 85, left: 15, width: 30, height: 10 }
  }
];

export const MOCK_CANDIDATE_MATCHES: CandidateMatch[] = [
  {
    id: 'cand-1',
    name: 'Paracetamol 500 mg',
    strength: '500 mg',
    manufacturer: 'XYZ Pharma Labs',
    matchReasons: ['Partial text ...CETAM... matches', 'Exact 500 mg strength match', 'Manufacturer logo fragment matches'],
    evidenceCoveragePercent: 88,
    confidenceLevel: 'HIGH',
    visualSimilarity: 91,
    packagingType: '10 Tablet Blister Strip',
    isBestMatch: true
  },
  {
    id: 'cand-2',
    name: 'Acetaminophen 500 mg',
    strength: '500 mg',
    manufacturer: 'Generic Care Inc',
    matchReasons: ['Strength matches 500 mg', 'Synonym compound match'],
    evidenceCoveragePercent: 54,
    confidenceLevel: 'MEDIUM',
    visualSimilarity: 60,
    packagingType: '10 Tablet Foil Strip'
  },
  {
    id: 'cand-3',
    name: 'Cetirizine 10 mg',
    strength: '10 mg',
    manufacturer: 'XYZ Pharma',
    matchReasons: ['Manufacturer name match only'],
    evidenceCoveragePercent: 22,
    confidenceLevel: 'LOW',
    visualSimilarity: 35,
    packagingType: '10 Tablet Strip'
  }
];

export const MOCK_SAVED_CABINET_MEDICINES: MedicineItem[] = [
  MOCK_HIGH_CONFIDENCE_MEDICINE,
  {
    id: 'med-002',
    name: 'Amoxicillin',
    strength: '250 mg',
    manufacturer: 'HealthMed Ltd',
    batchNumber: 'HM-44120',
    mfgDate: 'Nov 2024',
    expiryDate: 'Oct 2026',
    isExpired: false,
    dosageForm: 'Capsule',
    instructions: 'Take 1 capsule 3 times daily after food as directed by doctor.',
    confidenceLevel: 'HIGH',
    confidenceScore: 96,
    matchReasons: ['Text fully legible', 'Batch number verified'],
    recoveredEvidence: [],
    imageSrc: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    audioTextEn: 'Amoxicillin 250 milligrams capsule. Expiry date October 2026.',
    audioTextTa: 'அமோக்சிசில்லிங் 250 மில்லிகிராம் கேப்சூல். காலாவதி அக்டோபர் 2026.',
    savedAt: '2026-09-15',
    verificationStatus: 'verified_by_user'
  },
  {
    id: 'med-003',
    name: 'Metformin',
    strength: '500 mg',
    manufacturer: 'Aero Labs',
    batchNumber: 'AL-88902',
    mfgDate: 'Mar 2024',
    expiryDate: 'Feb 2027',
    isExpired: false,
    dosageForm: 'Tablet',
    instructions: 'Take 1 tablet twice daily with morning and evening meals.',
    confidenceLevel: 'HIGH',
    confidenceScore: 91,
    matchReasons: ['Legible tablet stamp', 'Barcode scan matched'],
    recoveredEvidence: [],
    imageSrc: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&auto=format&fit=crop&q=80',
    audioTextEn: 'Metformin 500 milligrams tablet. Expiry date February 2027.',
    audioTextTa: 'மெட்ஃப்பார்மின் 500 மில்லிகிராம் மாத்திரை. காலாவதி பிப்ரவரி 2027.',
    savedAt: '2026-09-10',
    verificationStatus: 'verified_by_user'
  }
];

export const MOCK_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    medicineId: 'med-001',
    medicineName: 'Paracetamol',
    strength: '500 mg',
    time: '08:00 AM',
    frequency: 'Daily after breakfast',
    type: 'dose',
    active: true,
    notes: 'Take with full glass of water'
  },
  {
    id: 'rem-2',
    medicineId: 'med-003',
    medicineName: 'Metformin',
    strength: '500 mg',
    time: '08:30 PM',
    frequency: 'Daily after dinner',
    type: 'dose',
    active: true,
    notes: 'Take with food'
  },
  {
    id: 'rem-3',
    medicineId: 'med-002',
    medicineName: 'Amoxicillin',
    strength: '250 mg',
    time: 'Oct 2026',
    frequency: 'Expiry warning',
    type: 'expiry',
    expiryDate: 'Oct 2026',
    active: true,
    notes: 'Medicine expires in 1 month'
  }
];
