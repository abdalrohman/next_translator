import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { getLanguageByCode } from './languages'
import { getGoogleApiKey } from './env'

// Initialize the Gemini model with LangChain
export function getGeminiModel() {
  const apiKey = getGoogleApiKey()

  return new ChatGoogleGenerativeAI({
    apiKey: apiKey,
    model: 'gemini-2.5-flash-preview-04-17',
    maxOutputTokens: 8192,
    temperature: 0.2, // Lower temperature for more deterministic output
    topP: 0.8,
    topK: 40,
  })
}

// Create a translation chain using LangChain
export function createTranslationChain() {
  const model = getGeminiModel()

  // Create a prompt template for translation
  const translationPrompt = PromptTemplate.fromTemplate(`
You are a professional translator with expertise in multiple languages.

TASK:
Translate the following text from {sourceLanguageName} to {targetLanguageName}.

SOURCE TEXT:
"""
{text}
"""

INSTRUCTIONS:
1. Maintain the original meaning, tone, and nuance in your translation.
2. Preserve formatting, including paragraphs, bullet points, and special characters.
3. If there are idioms or cultural references, adapt them appropriately for the target language.
4. Do not add any explanations or notes to the translation.
5. Return ONLY the translated text, nothing else.

TRANSLATION:
`)

  // Create a chain that processes the input, formats the prompt, sends it to the model, and parses the output
  return RunnableSequence.from([translationPrompt, model, new StringOutputParser()])
}

// Create a language detection chain using LangChain
export function createLanguageDetectionChain() {
  const model = getGeminiModel()

  // Create a prompt template for language detection
  const detectionPrompt = PromptTemplate.fromTemplate(`
You are a language detection expert.

TASK:
Detect the language of the following text and return only the ISO 639-1 language code.

TEXT:
"""
{text}
"""

INSTRUCTIONS:
1. Analyze the text and determine the language.
2. Return ONLY the ISO 639-1 language code (e.g., 'en' for English, 'es' for Spanish).
3. If you're unsure, return 'en' as the default.

LANGUAGE CODE:
`)

  // Create a chain that processes the input, formats the prompt, sends it to the model, and parses the output
  return RunnableSequence.from([detectionPrompt, model, new StringOutputParser()])
}

// Function to translate text using the translation chain
export async function translateWithLangChain(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
): Promise<string> {
  try {
    // Don't translate if source and target languages are the same
    if (sourceLanguage === targetLanguage) {
      return text
    }

    // Get language names
    const sourceLanguageObj = getLanguageByCode(sourceLanguage)
    const targetLanguageObj = getLanguageByCode(targetLanguage)

    if (!sourceLanguageObj || !targetLanguageObj) {
      throw new Error('Invalid language code')
    }

    // Create the translation chain
    const translationChain = createTranslationChain()

    // Invoke the chain with the input
    const translatedText = await translationChain.invoke({
      text,
      sourceLanguageName: sourceLanguageObj.name,
      targetLanguageName: targetLanguageObj.name,
    })

    return translatedText.trim()
  } catch (error) {
    console.error('Translation error:', error)
    throw error
  }
}

// Function to detect language using the language detection chain
export async function detectLanguageWithLangChain(text: string): Promise<string> {
  try {
    // Don't attempt to detect language of empty text
    if (!text.trim()) {
      return 'en' // Default to English
    }

    // Create the language detection chain
    const detectionChain = createLanguageDetectionChain()

    // Invoke the chain with the input
    const detectedLanguage = await detectionChain.invoke({
      text,
    })

    // Clean up the response to get just the language code
    const cleanedCode = detectedLanguage.trim().toLowerCase().slice(0, 2)

    return cleanedCode || 'en'
  } catch (error) {
    console.error('Language detection error:', error)

    return 'en' // Default to English on error
  }
}
