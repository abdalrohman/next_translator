export interface Language {
  code: string
  name: string
  nativeName: string
  flag?: string
}

// List of languages supported by Gemini for translation
// This list can be expanded as Gemini adds support for more languages
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
]

// Helper function to get a language by code
export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code)
}

// Helper function to get user's browser language if supported
export function getBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en' // Default to English on server

  const browserLang = navigator.language.split('-')[0]
  const isSupported = SUPPORTED_LANGUAGES.some((lang) => lang.code === browserLang)

  return isSupported ? browserLang : 'en'
}

// Helper function to get language preferences from local storage
export function getStoredLanguagePreferences(): { source: string; target: string } {
  if (typeof window === 'undefined') {
    return { source: 'en', target: 'ar' } // Default values on server
  }

  try {
    const stored = localStorage.getItem('translatorLanguagePreferences')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading language preferences from localStorage:', error)
  }

  // Default to browser language as source and English/Spanish as target
  const browserLang = getBrowserLanguage()
  const target = browserLang === 'en' ? 'ar' : 'en' // Default to Spanish if English is browser language

  return { source: browserLang, target }
}

// Helper function to store language preferences in local storage
export function storeLanguagePreferences(source: string, target: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('translatorLanguagePreferences', JSON.stringify({ source, target }))
  } catch (error) {
    console.error('Error storing language preferences in localStorage:', error)
  }
}
