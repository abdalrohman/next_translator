'use client'

import { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Copy, Check, X, Mic, MicOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLanguageByCode } from '@/lib/languages'

interface TranslationInputProps {
  value: string
  onChange: (value: string) => void
  onTranslate: () => void
  onClear: () => void
  language: string
  placeholder?: string
  isTranslating?: boolean
  characterLimit?: number
}

export function TranslationInput({
  value,
  onChange,
  onTranslate,
  onClear,
  language,
  placeholder = 'Enter text to translate',
  isTranslating = false,
  characterLimit = 5000,
}: TranslationInputProps) {
  const [copied, setCopied] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Check if speech recognition is supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsRecognitionSupported(!!SpeechRecognition)
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (isRecognitionSupported) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      // Configure recognition
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        // Set language if supported
        const languageObj = getLanguageByCode(language)
        if (languageObj) {
          recognitionRef.current.lang = language
        }

        // Handle results
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join('')

          // Update the input value
          onChange(transcript)
        }

        // Handle end of recognition
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        // Handle errors
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', (event as any).error)
          setIsListening(false)
        }
      }
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isRecognitionSupported, language, onChange])

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Copy text to clipboard
  const copyToClipboard = async () => {
    if (!value) return

    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  // Calculate remaining characters
  const remainingChars = characterLimit - (value?.length || 0)
  const isOverLimit = remainingChars < 0

  // Focus the textarea when it's rendered
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to translate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (value && !isTranslating && !isOverLimit) {
          onTranslate()
        }
      }

      // Escape to clear input
      if (e.key === 'Escape') {
        e.preventDefault()
        if (value && !isTranslating) {
          onClear()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [value, isTranslating, isOverLimit, onTranslate, onClear])

  return (
    <div className="relative flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`min-h-[200px] resize-none p-4 text-base shadow-inner ${
            isOverLimit ? 'border-red-500 focus-visible:ring-red-500' : ''
          }`}
          disabled={isTranslating}
        />

        {isListening && (
          <motion.div
            className="bg-primary/10 text-primary absolute right-2 bottom-2 rounded-full px-3 py-1 text-xs font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            Listening...
          </motion.div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Speech recognition button */}
          {isRecognitionSupported && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSpeechRecognition}
              disabled={isTranslating}
              className={`rounded-full transition-all ${isListening ? 'bg-primary/10 text-primary border-primary/30' : ''}`}
              aria-label={isListening ? 'Stop listening' : 'Start speech recognition'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isListening ? 'listening' : 'not-listening'}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isListening ? (
                    <MicOff className="mr-1 h-4 w-4" />
                  ) : (
                    <Mic className="mr-1 h-4 w-4" />
                  )}
                </motion.div>
              </AnimatePresence>
              <span>{isListening ? 'Stop' : 'Speak'}</span>
            </Button>
          )}

          {/* Copy button */}
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            disabled={!value || isTranslating}
            className="rounded-full"
            aria-label="Copy text"
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
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </motion.div>
            </AnimatePresence>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>

          {/* Clear button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            disabled={!value || isTranslating}
            className="rounded-full"
            aria-label="Clear text"
          >
            <X className="mr-1 h-4 w-4" />
            <span>Clear</span>
          </Button>
        </div>

        {/* Character counter */}
        <div className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
          {remainingChars} / {characterLimit}
        </div>
      </div>

      {/* Translate button */}
      <Button
        onClick={onTranslate}
        disabled={!value || isTranslating || isOverLimit}
        className="mt-1 rounded-lg"
        size="lg"
      >
        {isTranslating ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Translating...
          </span>
        ) : (
          'Translate'
        )}
      </Button>

      {/* Keyboard shortcut hint */}
      <div className="text-muted-foreground mt-1 text-center text-xs">
        Press{' '}
        <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">Ctrl/Cmd + Enter</kbd> to
        translate
      </div>
    </div>
  )
}
