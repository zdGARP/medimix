import { supabase } from '../lib/supabase';
import type { 
  ExtractedEvidence, 
  ConfidenceLevel, 
  EvidenceFragment, 
  CandidateMatch, 
  MedicineItem, 
  ExpiryStatus,
  MedicineFingerprint 
} from '../types';

export interface DbMedicine {
  id: string;
  generic_name: string;
  brand_name: string | null;
  strength: string | null;
  dosage_form: string | null;
  manufacturer: string | null;
  aliases: string[] | null;
  normalized_name: string | null;
  normalized_manufacturer: string | null;
  created_at: string;
  updated_at: string;
}

// Local mock catalog fallback
const LOCAL_MOCK_MEDICINES: DbMedicine[] = [
  {
    id: 'med_mock_1',
    generic_name: 'Paracetamol',
    brand_name: 'Calpol 500',
    strength: '500 mg',
    dosage_form: 'Tablet',
    manufacturer: 'GlaxoSmithKline',
    aliases: ['acetaminophen', 'paracetamol 500', 'calpol', 'crocin'],
    normalized_name: 'paracetamol',
    normalized_manufacturer: 'glaxosmithkline',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'med_mock_2',
    generic_name: 'Paracetamol',
    brand_name: 'Dolo 650',
    strength: '650 mg',
    dosage_form: 'Tablet',
    manufacturer: 'Micro Labs Ltd',
    aliases: ['dolo', 'dolo650', 'paracetamol'],
    normalized_name: 'paracetamol',
    normalized_manufacturer: 'micro labs ltd',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'med_mock_3',
    generic_name: 'Cetirizine Hydrochloride',
    brand_name: 'Cetzine 10',
    strength: '10 mg',
    dosage_form: 'Tablet',
    manufacturer: 'Dr. Reddys Laboratories',
    aliases: ['cetirizine', 'cetzine', 'okacet'],
    normalized_name: 'cetirizine hydrochloride',
    normalized_manufacturer: 'dr reddys laboratories',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'med_mock_4',
    generic_name: 'Amoxicillin',
    brand_name: 'Mox 500',
    strength: '500 mg',
    dosage_form: 'Capsule',
    manufacturer: 'Sun Pharmaceutical Industries',
    aliases: ['amoxicillin 500', 'mox', 'amoxil'],
    normalized_name: 'amoxicillin',
    normalized_manufacturer: 'sun pharmaceutical industries',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'med_mock_5',
    generic_name: 'Ibuprofen',
    brand_name: 'Brufen 400',
    strength: '400 mg',
    dosage_form: 'Tablet',
    manufacturer: 'Abbott Healthcare',
    aliases: ['ibuprofen 400', 'brufen', 'advil'],
    normalized_name: 'ibuprofen',
    normalized_manufacturer: 'abbott healthcare',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'med_mock_6',
    generic_name: 'Azithromycin',
    brand_name: 'Azithral 500',
    strength: '500 mg',
    dosage_form: 'Tablet',
    manufacturer: 'Alembic Pharmaceuticals',
    aliases: ['azithromycin 500', 'azithral'],
    normalized_name: 'azithromycin',
    normalized_manufacturer: 'alembic pharmaceuticals',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'med_mock_7',
    generic_name: 'Pantoprazole Sodium',
    brand_name: 'Pan 40',
    strength: '40 mg',
    dosage_form: 'Tablet',
    manufacturer: 'Alkem Laboratories',
    aliases: ['pantoprazole', 'pan40', 'pantocid'],
    normalized_name: 'pantoprazole sodium',
    normalized_manufacturer: 'alkem laboratories',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function getMedicineById(id: string): Promise<DbMedicine | null> {
  if (!id) return null;

  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) return data as DbMedicine;
  } catch (err) {
    console.warn(`[MedicineService] Exception fetching by id ${id}:`, err);
  }

  return LOCAL_MOCK_MEDICINES.find(m => m.id === id) || null;
}

export async function searchMedicines(query: string): Promise<DbMedicine[]> {
  const cleanQuery = (query || '').trim().toLowerCase();
  if (!cleanQuery) return LOCAL_MOCK_MEDICINES;

  try {
    const filterString = `generic_name.ilike.%${cleanQuery}%,brand_name.ilike.%${cleanQuery}%,strength.ilike.%${cleanQuery}%,manufacturer.ilike.%${cleanQuery}%,normalized_name.ilike.%${cleanQuery}%`;

    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .or(filterString)
      .limit(20);

    if (!error && data && data.length > 0) return data as DbMedicine[];
  } catch (err) {
    console.warn('[MedicineService] Supabase search exception:', err);
  }

  return searchMedicinesFromLocal(cleanQuery);
}

function searchMedicinesFromLocal(query: string): DbMedicine[] {
  if (!query) return LOCAL_MOCK_MEDICINES;

  return LOCAL_MOCK_MEDICINES.filter(med => {
    const genericMatch = med.generic_name.toLowerCase().includes(query);
    const brandMatch = med.brand_name?.toLowerCase().includes(query);
    const strengthMatch = med.strength?.toLowerCase().includes(query);
    const mfgMatch = med.manufacturer?.toLowerCase().includes(query);
    const aliasMatch = med.aliases?.some(a => a.toLowerCase().includes(query));

    return genericMatch || brandMatch || strengthMatch || mfgMatch || aliasMatch;
  });
}

export interface MatchingPipelineResult {
  hasReliableEvidence: boolean;
  medicineResult: MedicineItem | null;
  recoveredEvidence: EvidenceFragment[];
  candidateMatches: CandidateMatch[];
  fingerprint: MedicineFingerprint;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  expiryStatus: ExpiryStatus;
}

/**
 * Core Evidence Matching Engine: Runs Gemini Extracted Evidence through Supabase Catalog
 */
export async function searchMedicinesByEvidence(
  evidence: ExtractedEvidence,
  capturedPhotoUrl: string
): Promise<MatchingPipelineResult> {
  const {
    rawText = [],
    partialTextFragments = [],
    strength,
    manufacturer,
    expiryDate,
    batchNumber,
    dosageForm,
    packagingClues = [],
    logoClues = [],
    tabletClues = [],
    overallEvidenceQuality
  } = evidence;

  // 1. Build Medicine Fingerprint
  const fingerprint: MedicineFingerprint = {
    textFragments: [...rawText, ...partialTextFragments],
    strength: strength || null,
    manufacturer: manufacturer || null,
    logo: logoClues.length > 0 ? logoClues.join(', ') : null,
    packagingShape: packagingClues.length > 0 ? packagingClues.join(', ') : 'blister strip',
    tabletVisual: tabletClues.length > 0 ? tabletClues.join(', ') : null,
    voiceContext: null
  };

  // 2. Check if ANY evidence was detected at all
  const hasRawText = rawText.length > 0 || partialTextFragments.length > 0;
  const hasFeatures = Boolean(strength || manufacturer || logoClues.length > 0 || packagingClues.length > 0);

  if (!hasRawText && !hasFeatures) {
    // Unrelated image or no readable text/packaging
    return {
      hasReliableEvidence: false,
      medicineResult: null,
      recoveredEvidence: [],
      candidateMatches: [],
      fingerprint,
      confidenceLevel: 'LOW',
      confidenceScore: 0,
      expiryStatus: 'CANNOT_VERIFY'
    };
  }

  // 3. Query DB candidates using all search tokens
  const searchTokens: string[] = [];

  [...rawText, ...partialTextFragments].forEach(t => {
    const clean = t.replace(/[^a-zA-Z0-9]/g, ' ').trim();
    if (clean.length >= 3) searchTokens.push(clean);
  });

  if (strength) searchTokens.push(strength);
  if (manufacturer) searchTokens.push(manufacturer);

  // Fetch candidates from Supabase / local catalog
  let allCandidates: DbMedicine[] = [];

  for (const token of searchTokens.slice(0, 4)) {
    const results = await searchMedicines(token);
    results.forEach(r => {
      if (!allCandidates.some(c => c.id === r.id)) {
        allCandidates.push(r);
      }
    });
  }

  if (allCandidates.length === 0) {
    // Check if we at least have an AI fallback profile before giving up completely
    if (!evidence.synthesizedProfile || !evidence.synthesizedProfile.name) {
      return {
        hasReliableEvidence: false,
        medicineResult: null,
        recoveredEvidence: [],
        candidateMatches: [],
        fingerprint,
        confidenceLevel: 'LOW',
        confidenceScore: 0,
        expiryStatus: 'CANNOT_VERIFY'
      };
    }
  }

  // 4. Score each candidate against extracted evidence
  const scoredCandidates = allCandidates.map(candidate => {
    let score = 0;
    const matchReasons: string[] = [];
    const matchedEvidence: EvidenceFragment[] = [];

    const normGen = candidate.generic_name.toLowerCase();
    const normBrand = (candidate.brand_name || '').toLowerCase();
    const normMfg = (candidate.manufacturer || '').toLowerCase();
    const normStrength = (candidate.strength || '').toLowerCase();

    // Text & Partial Fragment matching
    let textMatched = false;
    for (const fragment of [...rawText, ...partialTextFragments]) {
      const fragLower = fragment.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!fragLower || fragLower.length < 3) continue;

      if (normGen.includes(fragLower) || fragLower.includes(normGen)) {
        score += 35;
        textMatched = true;
        matchReasons.push(`Generic name matched text fragment ("${fragment}")`);
        matchedEvidence.push({
          id: `ev_gen_${candidate.id}`,
          type: 'text',
          label: 'Generic Name Match',
          value: candidate.generic_name,
          confidence: 90,
          status: 'matched'
        });
      } else if (normBrand.includes(fragLower) || fragLower.includes(normBrand)) {
        score += 35;
        textMatched = true;
        matchReasons.push(`Brand name matched text fragment ("${fragment}")`);
        matchedEvidence.push({
          id: `ev_brand_${candidate.id}`,
          type: 'text',
          label: 'Brand Name Match',
          value: candidate.brand_name || '',
          confidence: 90,
          status: 'matched'
        });
      } else if (candidate.aliases?.some(a => a.toLowerCase().includes(fragLower))) {
        score += 25;
        textMatched = true;
        matchReasons.push(`Alias matched partial fragment ("${fragment}")`);
        matchedEvidence.push({
          id: `ev_alias_${candidate.id}`,
          type: 'text',
          label: 'Alias Fragment Match',
          value: fragment,
          confidence: 75,
          status: 'partial'
        });
      }
    }

    // Strength matching
    if (strength && normStrength) {
      const extractedStrDigits = strength.replace(/[^0-9]/g, '');
      const dbStrDigits = normStrength.replace(/[^0-9]/g, '');

      if (extractedStrDigits && dbStrDigits && extractedStrDigits === dbStrDigits) {
        score += 25;
        matchReasons.push(`Dosage strength matched (${candidate.strength})`);
        matchedEvidence.push({
          id: `ev_strength_${candidate.id}`,
          type: 'strength',
          label: 'Strength Match',
          value: candidate.strength || '',
          confidence: 95,
          status: 'matched'
        });
      }
    }

    // Manufacturer matching
    if (manufacturer && normMfg) {
      const mfgLower = manufacturer.toLowerCase();
      if (normMfg.includes(mfgLower) || mfgLower.includes(normMfg)) {
        score += 15;
        matchReasons.push(`Manufacturer matched (${candidate.manufacturer})`);
        matchedEvidence.push({
          id: `ev_mfg_${candidate.id}`,
          type: 'manufacturer',
          label: 'Manufacturer Match',
          value: candidate.manufacturer || '',
          confidence: 85,
          status: 'matched'
        });
      }
    }

    // Dosage Form / Packaging matching
    if (dosageForm && candidate.dosage_form) {
      if (candidate.dosage_form.toLowerCase().includes(dosageForm.toLowerCase())) {
        score += 10;
        matchReasons.push(`Dosage form matched (${candidate.dosage_form})`);
      }
    }

    // Visual clue bonus
    if (packagingClues.length > 0 || logoClues.length > 0) {
      score += 5;
    }

    return {
      candidate,
      score: Math.min(score, 100),
      matchReasons,
      matchedEvidence,
      textMatched
    };
  });

  // Sort candidates by score descending
  scoredCandidates.sort((a, b) => b.score - a.score);
  const bestMatch = scoredCandidates.length > 0 ? scoredCandidates[0] : null;

  // AI Fallback: If no strong DB match, but AI synthesized a profile
  if (!bestMatch || bestMatch.score < 50) {
    if (evidence.synthesizedProfile && evidence.synthesizedProfile.name) {
      const synth = evidence.synthesizedProfile;
      const synthesizedId = `synth_${Date.now()}`;
      
      const synthMedicine: MedicineItem = {
        id: synthesizedId,
        name: synth.name,
        strength: synth.strength || 'Unknown',
        manufacturer: synth.manufacturer || 'Unknown',
        batchNumber: evidence.batchNumber || 'Unknown',
        mfgDate: evidence.manufacturingDate || 'Unknown',
        expiryDate: evidence.expiryDate || 'Unknown',
        isExpired: false,
        dosageForm: synth.dosageForm || 'Tablet',
        instructions: synth.instructions || 'Always consult a physician before using this medication.',
        confidenceLevel: 'MEDIUM',
        confidenceScore: 65,
        matchReasons: ['AI Visual Identification (Not found in catalog)'],
        recoveredEvidence: [
          { id: 'synth_1', type: 'text', label: 'AI Synthesis', value: synth.name, confidence: 90, status: 'matched' }
        ],
        imageSrc: capturedPhotoUrl,
        audioTextEn: `Identified visually as ${synth.name} ${synth.strength}. This medicine is not in our verified clinical catalog. Please verify with a pharmacist. ${synth.instructions}`,
        audioTextTa: '',
        savedAt: new Date().toISOString(),
        verificationStatus: 'pending_verification'
      };

      const synthMatch: CandidateMatch = {
        candidate: {
          id: synthesizedId,
          generic_name: synth.name,
          brand_name: null,
          strength: synth.strength,
          dosage_form: synth.dosageForm,
          manufacturer: synth.manufacturer,
          aliases: [],
          normalized_name: synth.name.toLowerCase(),
          normalized_manufacturer: synth.manufacturer.toLowerCase(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        score: 65,
        matchReasons: ['Dynamically synthesized from image evidence'],
        matchedEvidence: synthMedicine.recoveredEvidence
      };

      return {
        hasReliableEvidence: true,
        medicineResult: synthMedicine,
        recoveredEvidence: synthMedicine.recoveredEvidence,
        candidateMatches: [synthMatch],
        fingerprint,
        confidenceLevel: 'MEDIUM',
        confidenceScore: 65,
        expiryStatus: 'CANNOT_VERIFY'
      };
    }
  }

  // 5. Expiry Status Determination
  let expiryStatus: ExpiryStatus = 'CANNOT_VERIFY';
  let formattedExpiryText = 'Unreadable / Unverified';
  let isExpired = false;

  if (expiryDate) {
    formattedExpiryText = expiryDate;
    expiryStatus = 'NOT_EXPIRED';
    // Check if contains past year (e.g. 2020, 2021, 2022, 2023, 2024, 2025)
    const yearMatch = expiryDate.match(/20\d\d/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0], 10);
      if (year < 2026) {
        isExpired = true;
        expiryStatus = 'EXPIRED';
      }
    }
  }

  // 6. Confidence Rating Engine
  let confidenceLevel: ConfidenceLevel = 'LOW';
  let confidenceScore = bestMatch ? bestMatch.score : 0;

  if (!bestMatch || bestMatch.score < 25 || !bestMatch.textMatched) {
    // Insufficient text matching
    confidenceLevel = 'LOW';
    if (confidenceScore > 30) confidenceScore = 30;
  } else if (bestMatch.score >= 70 && overallEvidenceQuality === 'HIGH' && bestMatch.matchedEvidence.length >= 2) {
    confidenceLevel = 'HIGH';
  } else if (bestMatch.score >= 35) {
    confidenceLevel = 'MEDIUM';
  } else {
    confidenceLevel = 'LOW';
  }

  // Create CandidateMatches array for UI
  const candidateMatches: CandidateMatch[] = scoredCandidates.slice(0, 4).map(sc => ({
    id: sc.candidate.id,
    name: sc.candidate.brand_name ? `${sc.candidate.brand_name} (${sc.candidate.generic_name})` : sc.candidate.generic_name,
    strength: sc.candidate.strength || 'N/A',
    manufacturer: sc.candidate.manufacturer || 'Unknown',
    matchReasons: sc.matchReasons.length > 0 ? sc.matchReasons : ['Packaging similarity'],
    evidenceCoveragePercent: sc.score,
    confidenceLevel: sc.score >= 70 ? 'HIGH' : sc.score >= 35 ? 'MEDIUM' : 'LOW',
    visualSimilarity: sc.score,
    packagingType: sc.candidate.dosage_form || 'Blister',
    isBestMatch: sc.candidate.id === bestMatch?.candidate.id
  }));

  // Build top MedicineItem result
  let topResult: MedicineItem | null = null;

  if (bestMatch && confidenceLevel === 'HIGH') {
    const medName = bestMatch.candidate.brand_name 
      ? `${bestMatch.candidate.brand_name} (${bestMatch.candidate.generic_name})`
      : bestMatch.candidate.generic_name;

    const matchedEv = bestMatch.matchedEvidence;

    if (expiryDate) {
      matchedEv.push({
        id: 'ev_expiry_read',
        type: 'expiry',
        label: 'Expiry Stamp Read',
        value: expiryDate,
        confidence: 85,
        status: 'matched'
      });
    } else {
      matchedEv.push({
        id: 'ev_expiry_missing',
        type: 'expiry',
        label: 'Expiry Date',
        value: 'Unreadable / Missing',
        confidence: 0,
        status: 'unclear'
      });
    }

    topResult = {
      id: bestMatch.candidate.id,
      name: medName,
      strength: strength || bestMatch.candidate.strength || 'N/A',
      manufacturer: manufacturer || bestMatch.candidate.manufacturer || 'Unknown',
      batchNumber: batchNumber || 'Unverified',
      mfgDate: 'N/A',
      expiryDate: formattedExpiryText,
      expiryStatus,
      isExpired,
      dosageForm: dosageForm || bestMatch.candidate.dosage_form || 'Tablet',
      instructions: 'Consult doctor or pharmacist before consumption.',
      confidenceLevel,
      confidenceScore,
      matchReasons: bestMatch.matchReasons.length > 0 ? bestMatch.matchReasons : ['Packaging evidence matched'],
      recoveredEvidence: matchedEv,
      imageSrc: capturedPhotoUrl,
      audioTextEn: `Medicine result: ${medName}, strength ${strength || bestMatch.candidate.strength || ''}. Expiry status: ${formattedExpiryText}.`,
      audioTextTa: `மருந்து முடிவு: ${medName}, அளவு ${strength || bestMatch.candidate.strength || ''}.`,
      savedAt: new Date().toLocaleDateString(),
      verificationStatus: 'pending_verification'
    };
  }

  return {
    hasReliableEvidence: Boolean(topResult),
    medicineResult: topResult,
    recoveredEvidence: topResult ? topResult.recoveredEvidence : [],
    candidateMatches,
    fingerprint,
    confidenceLevel,
    confidenceScore,
    expiryStatus
  };
}
