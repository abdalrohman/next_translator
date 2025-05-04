'use client'

import { useState, useEffect, useCallback } from 'react'
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '@/lib/languages'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowRightLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface LanguageSelectorProps {
  sourceLanguage: string
  targetLanguage: string
  onSourceLanguageChange: (language: string) => void
  onTargetLanguageChange: (language: string) => void
  disabled?: boolean
}

export function LanguageSelector({
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  disabled = false,
}: LanguageSelectorProps) {
  const [isSwapping, setIsSwapping] = useState(false)

  // Swap source and target languages
  const handleSwapLanguages = useCallback(() => {
    setIsSwapping(true)
    onSourceLanguageChange(targetLanguage)
    onTargetLanguageChange(sourceLanguage)

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsSwapping(false)
    }, 500)
  }, [targetLanguage, sourceLanguage, onSourceLanguageChange, onTargetLanguageChange])

  // Get language objects
  const sourceLanguageObj = getLanguageByCode(sourceLanguage)
  const targetLanguageObj = getLanguageByCode(targetLanguage)

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + S to swap languages
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault()
        if (!disabled) {
          handleSwapLanguages()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [sourceLanguage, targetLanguage, disabled, handleSwapLanguages])

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <div className="flex-1">
        <Select value={sourceLanguage} onValueChange={onSourceLanguageChange} disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {sourceLanguageObj ? (
                <span className="flex items-center gap-2">
                  <span className="text-lg">{sourceLanguageObj.flag}</span>
                  <span>{sourceLanguageObj.name}</span>
                </span>
              ) : (
                'Select language'
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <span className="flex items-center gap-2">
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {language.name !== language.nativeName && (
                    <span className="text-muted-foreground">({language.nativeName})</span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-shrink-0">
        <motion.div
          animate={isSwapping ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 10 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapLanguages}
            disabled={disabled}
            className="rounded-full"
            aria-label="Swap languages"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      <div className="flex-1">
        <Select value={targetLanguage} onValueChange={onTargetLanguageChange} disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {targetLanguageObj ? (
                <span className="flex items-center gap-2">
                  <span className="text-lg">{targetLanguageObj.flag}</span>
                  <span>{targetLanguageObj.name}</span>
                </span>
              ) : (
                'Select language'
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <span className="flex items-center gap-2">
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {language.name !== language.nativeName && (
                    <span className="text-muted-foreground">({language.nativeName})</span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
