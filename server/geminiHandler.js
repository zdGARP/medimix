import fs from 'fs';
import path from 'path';

/**
 * Load GEMINI_API_KEY from environment variables or .env/.env.local files
 */
function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }

  // Try reading from .env.local or .env in current directory
  const envPaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
          const match = line.match(/^\s*GEMINI_API_KEY\s*=\s*(.*)\s*$/);
          if (match) {
            let key = match[1].trim();
            if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
              key = key.slice(1, -1);
            }
            if (key) return key;
          }
        }
      } catch (err) {
        console.warn(`[GeminiServer] Error reading ${envPath}:`, err);
      }
    }
  }

  return null;
}

/**
 * Server-side function to analyze medicine images using Gemini Multimodal API
 * @param {string[]} imagesArray - Array of base64 data URLs or image URLs
 */
export async function processMedicineImagesWithGemini(imagesArray) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.error('❌ [GeminiServer] GEMINI_API_KEY is not set in environment variables or .env.local!');
    return {
      success: false,
      error: 'API_KEY_MISSING',
      message: 'GEMINI_API_KEY is missing on the server.'
    };
  }

  if (!imagesArray || !Array.isArray(imagesArray) || imagesArray.length === 0) {
    return {
      success: false,
      error: 'INVALID_IMAGES',
      message: 'No image provided for analysis.'
    };
  }

  // Prepare Gemini API multimodal parts
  const parts = [];

  // Prompt Instructions
  const promptText = `
You are an expert Medicine Packaging OCR & Visual Evidence Extractor for an accessibility application (MediRead AI).
Analyze the provided medicine packaging image(s).

CRITICAL INSTRUCTIONS:
1. Extract ONLY information that is strictly visible in the image.
2. Do NOT invent medicine names or details if they are not explicitly visible.
3. If text is partially readable, damaged, or torn (e.g. "...CETAM...", "500 m..."), put the exact visible substring in "partialTextFragments". Do NOT attempt to complete the word into a full medicine name.
4. If strength (e.g. "500 mg", "10 mg") is visible, extract it into "strength". Otherwise set to null.
5. If manufacturer (e.g. "GlaxoSmithKline", "Pfizer", "Micro Labs") is visible, extract it into "manufacturer". Otherwise set to null.
6. If batch number, manufacturing date, or expiry date are visible, extract them. If unreadable, missing, or torn, set to null.
7. Assess image quality metrics (blur, glare, darkness, cropping, occlusion, perspective, readability) as "LOW", "MEDIUM", or "HIGH".
8. Assess overall evidence quality as "LOW", "MEDIUM", or "HIGH". If no readable text or medicine packaging clues are found, set overallEvidenceQuality to "LOW".
9. SYNTHETIC PROFILE FALLBACK: If you can confidently identify the medicine from the packaging, construct a "synthesizedProfile" object containing the generic or brand name, strength, dosage form, manufacturer, and a brief description of its clinical uses/instructions. If you cannot identify the medicine, set "synthesizedProfile" to null.

Return ONLY a JSON object matching this exact structure:
{
  "rawText": ["string"],
  "partialTextFragments": ["string"],
  "strength": "string or null",
  "manufacturer": "string or null",
  "batchNumber": "string or null",
  "manufacturingDate": "string or null",
  "expiryDate": "string or null",
  "dosageForm": "string or null",
  "visualClues": ["string"],
  "packagingClues": ["string"],
  "logoClues": ["string"],
  "tabletClues": ["string"],
  "imageQuality": {
    "blur": "LOW",
    "glare": "LOW",
    "darkness": "LOW",
    "cropping": "LOW",
    "occlusion": "LOW",
    "perspective": "LOW",
    "readability": "LOW"
  },
  "overallEvidenceQuality": "LOW",
  "synthesizedProfile": {
    "name": "string",
    "strength": "string",
    "dosageForm": "string",
    "manufacturer": "string",
    "instructions": "string"
  } // or null
}
`;

  parts.push({ text: promptText });

  // Add images to parts
  for (const imgSrc of imagesArray) {
    if (typeof imgSrc === 'string' && imgSrc.startsWith('data:image/')) {
      const mimeTypeMatch = imgSrc.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
      const base64Data = imgSrc.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

      parts.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }
  }

  const modelsToTry = [
    'gemini-3.6-flash',
    'gemini-1.5-flash-8b',
    'gemini-2.5-flash', 
    'gemini-1.5-flash-latest', 
    'gemini-1.5-flash', 
    'gemini-1.0-pro-vision-latest',
    'gemini-pro-vision'
  ];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[GeminiServer] Model ${model} returned HTTP ${response.status}:`, errText);
        lastError = `HTTP ${response.status}: ${errText}`;
        continue;
      }

      const resData = await response.json();
      const rawResponseText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawResponseText) {
        console.warn(`[GeminiServer] Model ${model} returned empty content response.`);
        lastError = 'EMPTY_RESPONSE';
        continue;
      }

      // Parse JSON from model output
      let cleanJsonStr = rawResponseText.trim();
      if (cleanJsonStr.startsWith('```json')) {
        cleanJsonStr = cleanJsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanJsonStr.startsWith('```')) {
        cleanJsonStr = cleanJsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsedEvidence = JSON.parse(cleanJsonStr);

      // Validate & Normalize structured output
      const normalizedEvidence = {
        rawText: Array.isArray(parsedEvidence.rawText) ? parsedEvidence.rawText : [],
        partialTextFragments: Array.isArray(parsedEvidence.partialTextFragments) ? parsedEvidence.partialTextFragments : [],
        strength: typeof parsedEvidence.strength === 'string' ? parsedEvidence.strength : null,
        manufacturer: typeof parsedEvidence.manufacturer === 'string' ? parsedEvidence.manufacturer : null,
        batchNumber: typeof parsedEvidence.batchNumber === 'string' ? parsedEvidence.batchNumber : null,
        manufacturingDate: typeof parsedEvidence.manufacturingDate === 'string' ? parsedEvidence.manufacturingDate : null,
        expiryDate: typeof parsedEvidence.expiryDate === 'string' ? parsedEvidence.expiryDate : null,
        dosageForm: typeof parsedEvidence.dosageForm === 'string' ? parsedEvidence.dosageForm : null,
        visualClues: Array.isArray(parsedEvidence.visualClues) ? parsedEvidence.visualClues : [],
        packagingClues: Array.isArray(parsedEvidence.packagingClues) ? parsedEvidence.packagingClues : [],
        logoClues: Array.isArray(parsedEvidence.logoClues) ? parsedEvidence.logoClues : [],
        tabletClues: Array.isArray(parsedEvidence.tabletClues) ? parsedEvidence.tabletClues : [],
        imageQuality: {
          blur: ['LOW', 'MEDIUM', 'HIGH'].includes(parsedEvidence.imageQuality?.blur) ? parsedEvidence.imageQuality.blur : 'LOW',
          glare: ['LOW', 'MEDIUM', 'HIGH'].includes(parsedEvidence.imageQuality?.glare) ? parsedEvidence.imageQuality.glare : 'LOW',
          darkness: ['LOW', 'MEDIUM', 'HIGH'].includes(parsedEvidence.imageQuality?.darkness) ? parsedEvidence.imageQuality.darkness : 'LOW',
          cropping: ['LOW', 'MEDIUM', 'HIGH'].includes(parsedEvidence.imageQuality?.cropping) ? parsedEvidence.imageQuality.cropping : 'LOW',
          occlusion: ['LOW', 'MEDIUM', 'HIGH'].includes(parsedEvidence.imageQuality?.occlusion) ? parsedEvidence.imageQuality.occlusion : 'LOW',
          perspective: ['LOW', 'MEDIUM', 'HIGH'].includes(parsedEvidence.imageQuality?.perspective) ? parsedEvidence.imageQuality.perspective : 'LOW',
          readability: ['LOW', 'MEDIUM', 'HIGH'].includes(parsedEvidence.imageQuality?.readability) ? parsedEvidence.imageQuality.readability : 'MEDIUM'
        },
        overallEvidenceQuality: ['LOW', 'MEDIUM', 'HIGH'].includes(parsedEvidence.overallEvidenceQuality) ? parsedEvidence.overallEvidenceQuality : 'LOW',
        synthesizedProfile: parsedEvidence.synthesizedProfile && typeof parsedEvidence.synthesizedProfile === 'object' ? {
          name: parsedEvidence.synthesizedProfile.name || 'Unknown Medicine',
          strength: parsedEvidence.synthesizedProfile.strength || '',
          dosageForm: parsedEvidence.synthesizedProfile.dosageForm || 'Tablet',
          manufacturer: parsedEvidence.synthesizedProfile.manufacturer || 'Unknown',
          instructions: parsedEvidence.synthesizedProfile.instructions || 'Consult a healthcare professional for usage.'
        } : null
      };

      console.log('✅ [GeminiServer] Structured evidence extracted successfully:', normalizedEvidence);

      return {
        success: true,
        evidence: normalizedEvidence
      };
    } catch (err) {
      console.warn(`[GeminiServer] Error with model ${model}:`, err);
      lastError = err.message || 'SERVER_EXCEPTION';
    }
  }

  return {
    success: false,
    error: 'GEMINI_API_FAILURE',
    message: `All Gemini models failed. Last error: ${lastError}`
  };
}

/**
 * Server-side function to translate dynamic text securely via Gemini
 */
export async function translateTextWithGemini(text, targetLanguage) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return { success: false, error: 'API_KEY_MISSING' };
  }

  if (!text || !targetLanguage) {
    return { success: false, error: 'INVALID_INPUT' };
  }

  const promptText = `
You are a medical translation assistant. Translate the following user-facing explanation into ${targetLanguage}.
CRITICAL RULES:
1. Preserve canonical medicine names exactly as written (e.g. "Paracetamol" stays "Paracetamol").
2. Preserve manufacturer names exactly as written.
3. Preserve dosage and numerical values (e.g. "500 mg").
4. Preserve dates.
5. Do NOT invent or add any medical information.
6. Return ONLY the translated text, no other commentary.

Text to translate:
"${text}"
`;

  try {
    const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.1 }
      })
    });

    if (!response.ok) {
      return { success: false, error: 'API_ERROR' };
    }

    const resData = await response.json();
    const rawResponseText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (rawResponseText) {
      return { success: true, translatedText: rawResponseText.trim() };
    }
    
    return { success: false, error: 'EMPTY_RESPONSE' };
  } catch (err) {
    console.error('[GeminiServer] Translation error:', err);
    return { success: false, error: 'EXCEPTION' };
  }
}
