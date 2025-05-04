'use client'

// Define the interface for a translation response
export interface TranslationResponse {
  translatedText: string
  detectedLanguage?: string
  error?: string
}

// Define the interface for a translation history item
export interface TranslationHistoryItem {
  id: string
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  timestamp: number
}

// Maximum number of history items to store
const MAX_HISTORY_ITEMS = 50

// Function to translate text
export async function translate(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
): Promise<TranslationResponse> {
  try {
    // Don't translate empty text
    if (!text.trim()) {
      return { translatedText: '' }
    }

    // Don't translate if source and target languages are the same
    if (sourceLanguage === targetLanguage) {
      return { translatedText: text }
    }

    // Call the translation API route
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage,
      }),
    })

    const data = await response.json()

    // Handle API errors
    if (!response.ok) {
      throw new Error(data.error || 'Translation failed')
    }

    const translatedText = data.translatedText

    // If translation is successful, add to history
    if (translatedText) {
      addToTranslationHistory({
        id: generateId(),
        sourceText: text,
        translatedText,
        sourceLanguage,
        targetLanguage,
        timestamp: Date.now(),
      })
    }

    return { translatedText }
  } catch (error) {
    console.error('Translation service error:', error)

    return {
      translatedText: '',
      error: error instanceof Error ? error.message : 'Unknown translation error',
    }
  }
}

// Function to detect the language of a text
export async function detect(text: string): Promise<string> {
  try {
    // Don't attempt to detect language of empty text
    if (!text.trim()) {
      return 'en' // Default to English
    }

    // Call the language detection API route
    const response = await fetch('/api/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    const data = await response.json()

    // Handle API errors
    if (!response.ok) {
      throw new Error(data.error || 'Language detection failed')
    }

    return data.detectedLanguage || 'en'
  } catch (error) {
    console.error('Language detection error:', error)

    return 'en' // Default to English on error
  }
}

// Function to get the translation history from local storage
export function getTranslationHistory(): TranslationHistoryItem[] {
  if (typeof window === 'undefined') {
    return [] // Return empty array on server
  }

  try {
    const stored = localStorage.getItem('translationHistory')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading translation history from localStorage:', error)
  }

  return []
}

// Function to add a translation to the history
export function addToTranslationHistory(item: TranslationHistoryItem): void {
  if (typeof window === 'undefined') return

  try {
    const history = getTranslationHistory()

    // Add new item at the beginning
    const updatedHistory = [item, ...history]

    // Limit the number of items
    const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem('translationHistory', JSON.stringify(limitedHistory))
  } catch (error) {
    console.error('Error storing translation history in localStorage:', error)
  }
}

// Function to clear the translation history
export function clearTranslationHistory(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem('translationHistory')
  } catch (error) {
    console.error('Error clearing translation history from localStorage:', error)
  }
}

// Function to delete a specific translation history item
export function deleteTranslationHistoryItem(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const history = getTranslationHistory()
    const updatedHistory = history.filter((item) => item.id !== id)

    localStorage.setItem('translationHistory', JSON.stringify(updatedHistory))
  } catch (error) {
    console.error('Error deleting translation history item from localStorage:', error)
  }
}

// Helper function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
