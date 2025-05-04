import { NextRequest, NextResponse } from 'next/server'
import { detectLanguageWithLangChain } from '@/lib/langchain'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { text } = body

    // Validate input
    if (!text) {
      return NextResponse.json({ error: 'Missing required field: text' }, { status: 400 })
    }

    // Don't attempt to detect language of empty text
    if (!text.trim()) {
      return NextResponse.json({ detectedLanguage: 'en' })
    }

    // Detect the language
    const detectedLanguage = await detectLanguageWithLangChain(text)

    // Return the detected language
    return NextResponse.json({ detectedLanguage })
  } catch (error) {
    console.error('Language detection API error:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown language detection error' },
      { status: 500 },
    )
  }
}
