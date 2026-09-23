export interface Language {
  code: string;
  name: string;
  nativeName: string;
  locale: string;
  ttsLocale: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', locale: 'en-IN', ttsLocale: 'en-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', locale: 'ta-IN', ttsLocale: 'ta-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', locale: 'hi-IN', ttsLocale: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', locale: 'te-IN', ttsLocale: 'te-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', locale: 'kn-IN', ttsLocale: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', locale: 'ml-IN', ttsLocale: 'ml-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', locale: 'bn-IN', ttsLocale: 'bn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', locale: 'mr-IN', ttsLocale: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', locale: 'gu-IN', ttsLocale: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', locale: 'pa-IN', ttsLocale: 'pa-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', locale: 'ur-IN', ttsLocale: 'ur-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', locale: 'or-IN', ttsLocale: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', locale: 'as-IN', ttsLocale: 'as-IN' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', locale: 'es-ES', ttsLocale: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', locale: 'fr-FR', ttsLocale: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', locale: 'de-DE', ttsLocale: 'de-DE' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', locale: 'ar-SA', ttsLocale: 'ar-SA' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', locale: 'pt-BR', ttsLocale: 'pt-BR' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', locale: 'id-ID', ttsLocale: 'id-ID' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', locale: 'ja-JP', ttsLocale: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', locale: 'ko-KR', ttsLocale: 'ko-KR' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', locale: 'zh-CN', ttsLocale: 'zh-CN' }
];

export const getLanguageByCode = (code: string): Language => {
  return languages.find(lang => lang.code === code) || languages[0]; // Default to English
};
