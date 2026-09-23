import type { ExtractedEvidence } from '../types';

/**
 * Fallback local OCR engine using OCR.space API.
 * This runs completely in the browser and requires no personal API key.
 * It is used when the Gemini API is rate-limited or unavailable.
 */
export async function runLocalOcrFallback(imageStr: string): Promise<ExtractedEvidence> {
  console.log('[LocalOCR] Starting OCR.space fallback analysis...');
  
  try {
    const formData = new URLSearchParams();
    formData.append('base64Image', imageStr);
    formData.append('apikey', 'helloworld'); // Free public key
    formData.append('language', 'eng');
    formData.append('OCREngine', '2'); // Engine 2 is much better for noisy/shiny packaging

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });

    const data = await response.json();
    const text = data.ParsedResults?.[0]?.ParsedText || '';
    
    console.log('[LocalOCR] Extracted raw text from OCR.space:\n', text);
    
    // Clean and split the text into meaningful tokens for the database search
    const rawTokens = text.split(/[\s\n,]+/).map((t: string) => t.trim()).filter((t: string) => t.length > 2);
    
    // Fallback doesn't know about visual clues, so we leave them empty
    const evidence: ExtractedEvidence = {
      rawText: rawTokens,
      partialTextFragments: [],
      strength: null,
      manufacturer: null,
      batchNumber: null,
      manufacturingDate: null,
      expiryDate: null,
      dosageForm: null,
      visualClues: [],
      packagingClues: [],
      logoClues: [],
      tabletClues: [],
      imageQuality: {
        blur: 'LOW',
        glare: 'LOW',
        darkness: 'LOW',
        cropping: 'LOW',
        occlusion: 'LOW',
        perspective: 'LOW',
        readability: 'MEDIUM'
      },
      overallEvidenceQuality: 'MEDIUM',
      synthesizedProfile: null
    };
    
    return evidence;
  } catch (err) {
    console.error('[LocalOCR] OCR fallback failed:', err);
    throw new Error('Local OCR extraction failed.');
  }
}

