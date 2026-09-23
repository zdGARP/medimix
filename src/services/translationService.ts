// Define a local translation dictionary for static UI strings
// Only a few strings are strictly needed here, dynamic text uses Gemini
const localDictionary: Record<string, Record<string, string>> = {
  en: {
    cameraGuide: "Place the medicine strip inside the frame. We'll guide you.",
    searchPlaceholder: "Search medicines by name, strength, or manufacturer...",
    highConfidence: "Confirmed Match",
    mediumConfidence: "Possible match — more evidence needed.",
    lowConfidence: "Medicine could not be identified reliably.",
    expiryCannotVerify: "Expiry cannot be verified.",
    savedMedicines: "Your Saved Medicines",
    scanMedicine: "Scan medicine",
    notAvailable: "Not available"
  },
  ta: {
    cameraGuide: "மருந்து அட்டையை சட்டகத்திற்குள் வைக்கவும். வழிகாட்டுகிறோம்.",
    searchPlaceholder: "மருந்துப் பெயரைத் தேடுக...",
    highConfidence: "உறுதிப்படுத்தப்பட்ட பொருத்தம்",
    mediumConfidence: "சாத்தியமான பொருத்தம் — மேலும் தகவல் தேவை.",
    lowConfidence: "மருந்தை நம்பகமாக அடையாளம் காண முடியவில்லை.",
    expiryCannotVerify: "காலாவதி தேதியை சரிபார்க்க முடியவில்லை.",
    savedMedicines: "உங்கள் மருந்துகள்",
    scanMedicine: "மருந்தை ஸ்கேன் செய்",
    notAvailable: "கிடைக்கவில்லை"
  }
};

export const getStaticTranslation = (key: string, langCode: string, fallback = ""): string => {
  if (localDictionary[langCode] && localDictionary[langCode][key]) {
    return localDictionary[langCode][key];
  }
  if (localDictionary['en'] && localDictionary['en'][key]) {
    return localDictionary['en'][key];
  }
  return fallback;
};

// Cache for dynamic translations to avoid repeating API calls for the same text
const translationCache = new Map<string, string>();

/**
 * Translates dynamic text using the secure backend endpoint
 * Preserves medicine names, numerical values, and dates.
 */
export const translateDynamicText = async (text: string, targetLangCode: string): Promise<string> => {
  if (!text) return text;
  if (targetLangCode === 'en') return text; // No need to translate English to English

  const cacheKey = `${targetLangCode}_${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, targetLanguage: targetLangCode })
    });

    if (!response.ok) {
      console.warn('[TranslationService] Translation API error, falling back to English', await response.text());
      return text;
    }

    const data = await response.json();
    if (data.success && data.translatedText) {
      translationCache.set(cacheKey, data.translatedText);
      return data.translatedText;
    }

    return text;
  } catch (err) {
    console.error('[TranslationService] Exception during translation:', err);
    return text; // Fallback to English on error
  }
};
