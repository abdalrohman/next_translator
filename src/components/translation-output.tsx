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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + C to copy output
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection()?.toString()) {
        e.preventDefault()
        if (text && !isLoading) {
          copyToClipboard()
        }
      }

      // Ctrl/Cmd + L to listen to output
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault()
        if (text && !isLoading && isSpeechSupported) {
          if (isSpeaking) {
            stopSpeaking()
          } else {
            speakText()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [text, isLoading, isSpeaking, isSpeechSupported])

  return (
    <div className="flex flex-col gap-3">
      <Card className="relative overflow-hidden shadow-sm transition-all hover:shadow-md">
        {/* Loading overlay */}
        {isLoading && (
          <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
              <p className="text-muted-foreground text-sm">Translating...</p>
            </div>
          </div>
        )}

        <CardContent className="min-h-[200px] p-4">
          {text ? (
            <p className="text-base whitespace-pre-wrap">{text}</p>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-center">
                {isLoading ? 'Translating...' : 'Translation will appear here'}
              </p>
            </div>
          )}
        </CardContent>

        {isSpeaking && (
          <motion.div
            className="bg-primary/10 text-primary absolute right-2 bottom-2 rounded-full px-3 py-1 text-xs font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            Speaking...
          </motion.div>
        )}
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {/* Copy button */}
        <Button
          variant="outline"
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
              className="mr-1"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </motion.div>
          </AnimatePresence>
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </Button>

        {/* Text-to-speech button */}
        {isSpeechSupported && (
          <Button
            variant="outline"
            size="sm"
            onClick={isSpeaking ? stopSpeaking : speakText}
            disabled={!text || isLoading}
            className={`rounded-full transition-all ${isSpeaking ? 'bg-primary/10 text-primary border-primary/30' : ''}`}
            aria-label={isSpeaking ? 'Stop speaking' : 'Speak translation'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isSpeaking ? 'speaking' : 'not-speaking'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="mr-1"
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </motion.div>
            </AnimatePresence>
            <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
          </Button>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      {text && (
        <div className="text-muted-foreground text-center text-xs">
          Press <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">Ctrl/Cmd + L</kbd>{' '}
          to listen
        </div>
      )}
    </div>
  )
}
