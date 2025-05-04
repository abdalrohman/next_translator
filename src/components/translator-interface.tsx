'use client'

import { useState, useEffect } from 'react'
import { LanguageSelector } from '@/components/language-selector'
import { TranslationInput } from '@/components/translation-input'
import { TranslationOutput } from '@/components/translation-output'
import { HistoryPanel } from '@/components/history-panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getStoredLanguagePreferences, storeLanguagePreferences } from '@/lib/languages'
import { translate, TranslationHistoryItem } from '@/lib/translation'
import { motion } from 'framer-motion'
import { History, Languages } from 'lucide-react'

export function TranslatorInterface() {
  // State for source and target languages
  const [sourceLanguage, setSourceLanguage] = useState<string>('en')
  const [targetLanguage, setTargetLanguage] = useState<string>('es')

  // State for input and output text
  const [inputText, setInputText] = useState<string>('')
  const [outputText, setOutputText] = useState<string>('')

  // State for loading and error
  const [isTranslating, setIsTranslating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('translator')

  // Load language preferences from local storage
  useEffect(() => {
    const { source, target } = getStoredLanguagePreferences()
    setSourceLanguage(source)
    setTargetLanguage(target)
  }, [])

  // Store language preferences when they change
  useEffect(() => {
    storeLanguagePreferences(sourceLanguage, targetLanguage)
  }, [sourceLanguage, targetLanguage])

  // Handle source language change
  const handleSourceLanguageChange = (language: string) => {
    setSourceLanguage(language)
  }

  // Handle target language change
  const handleTargetLanguageChange = (language: string) => {
    setTargetLanguage(language)
  }

  // Handle input text change
  const handleInputChange = (text: string) => {
    setInputText(text)

    // Clear output when input is cleared
    if (!text) {
      setOutputText('')
    }
  }

  // Handle translation
  const handleTranslate = async () => {
    if (!inputText || isTranslating) return

    try {
      setIsTranslating(true)
      setError(null)

      // Detect language if auto-detection is enabled
      const actualSourceLanguage = sourceLanguage

      // Translate the text
      const result = await translate(inputText, actualSourceLanguage, targetLanguage)

      if (result.error) {
        setError(result.error)
      } else {
        setOutputText(result.translatedText)
      }
    } catch (err) {
      console.error('Translation error:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsTranslating(false)
    }
  }

  // Handle clearing input
  const handleClearInput = () => {
    setInputText('')
    setOutputText('')
    setError(null)
  }

  // Handle selecting a history item
  const handleSelectHistoryItem = (item: TranslationHistoryItem) => {
    setSourceLanguage(item.sourceLanguage)
    setTargetLanguage(item.targetLanguage)
    setInputText(item.sourceText)
    setOutputText(item.translatedText)
    setActiveTab('translator')
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl">
          <TabsTrigger value="translator" className="gap-2 rounded-l-lg">
            <Languages className="h-4 w-4" />
            <span>Translator</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 rounded-r-lg">
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="translator" className="mt-6">
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LanguageSelector
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              onSourceLanguageChange={handleSourceLanguageChange}
              onTargetLanguageChange={handleTargetLanguageChange}
              disabled={isTranslating}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TranslationInput
                value={inputText}
                onChange={handleInputChange}
                onTranslate={handleTranslate}
                onClear={handleClearInput}
                language={sourceLanguage}
                isTranslating={isTranslating}
              />

              <TranslationOutput
                text={outputText}
                language={targetLanguage}
                isLoading={isTranslating}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/15 text-destructive rounded-lg p-4 shadow-sm"
              >
                <p className="font-medium">Error: {error}</p>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HistoryPanel onSelectHistoryItem={handleSelectHistoryItem} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
