import { NextRequest, NextResponse } from 'next/server'
import { translateWithLangChain } from '@/lib/langchain'
import { getLanguageByCode } from '@/lib/languages'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { text, sourceLanguage, targetLanguage } = body

    // Validate input
    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields: text, sourceLanguage, targetLanguage' },
        { status: 400 },
      )
    }

    // Don't translate if source and target languages are the same
    if (sourceLanguage === targetLanguage) {
      return NextResponse.json({ translatedText: text })
    }

    // Get language names
    const sourceLanguageObj = getLanguageByCode(sourceLanguage)
    const targetLanguageObj = getLanguageByCode(targetLanguage)

    if (!sourceLanguageObj || !targetLanguageObj) {
      return NextResponse.json({ error: 'Invalid language code' }, { status: 400 })
    }

    // Translate the text
    const translatedText = await translateWithLangChain(text, sourceLanguage, targetLanguage)

    // Return the translated text
    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('Translation API error:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown translation error' },
      { status: 500 },
    )
  }
}
