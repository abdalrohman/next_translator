'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, VolumeX, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface TranslationOutputProps {
  text: string
  language: string
  isLoading?: boolean
}

export function TranslationOutput({ text, language, isLoading = false }: TranslationOutputProps) {
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)

  // Check if speech synthesis is supported
  useEffect(() => {
    setIsSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  // Copy text to clipboard
  const copyToClipboard = async () => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  // Speak the translated text
  const speakText = () => {
    if (!text || !isSpeechSupported) return

    // Stop any ongoing speech
    window.speechSynthesis.cancel()

    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text)

    // Set the language
    utterance.lang = language

    // Set event handlers
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    // Speak the text
    window.speechSynthesis.speak(utterance)
  }

  // Stop speaking
  const stopSpeaking = () => {
    if (isSpeechSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (isSpeechSupported) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSpeechSupported])

  return (
    <div className="flex flex-col gap-2">
      <Card className="relative overflow-hidden">
        {/* Loading overlay */}
        {isLoading && (
          <div className="bg-background/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
              <p className="text-muted-foreground text-sm">Translating...</p>
            </div>
          </div>
        )}

        <CardContent className="p-4">
          {text ? (
            <p className="text-base whitespace-pre-wrap">{text}</p>
          ) : (
            <p className="text-muted-foreground">
              {isLoading ? 'Translating...' : 'Translation will appear here'}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        {/* Copy button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          disabled={!text || isLoading}
          className="rounded-full"
          aria-label="Copy translation"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={copied ? 'copied' : 'copy'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </motion.div>
          </AnimatePresence>
          <span className="ml-2">{copied ? 'Copied' : 'Copy'}</span>
        </Button>

        {/* Text-to-speech button */}
        {isSpeechSupported && (
          <Button
            variant="ghost"
            size="sm"
            onClick={isSpeaking ? stopSpeaking : speakText}
            disabled={!text || isLoading}
            className={`rounded-full ${isSpeaking ? 'bg-primary/20' : ''}`}
            aria-label={isSpeaking ? 'Stop speaking' : 'Speak translation'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isSpeaking ? 'speaking' : 'not-speaking'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </motion.div>
            </AnimatePresence>
            <span className="ml-2">{isSpeaking ? 'Stop' : 'Listen'}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
