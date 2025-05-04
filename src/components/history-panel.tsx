'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLanguageByCode } from '@/lib/languages'
import {
  TranslationHistoryItem,
  getTranslationHistory,
  clearTranslationHistory,
  deleteTranslationHistoryItem,
} from '@/lib/translation'

interface HistoryPanelProps {
  onSelectHistoryItem: (item: TranslationHistoryItem) => void
}

export function HistoryPanel({ onSelectHistoryItem }: HistoryPanelProps) {
  const [history, setHistory] = useState<TranslationHistoryItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load history from local storage
  useEffect(() => {
    setMounted(true)
    setHistory(getTranslationHistory())
  }, [])

  // Clear all history
  const handleClearHistory = () => {
    clearTranslationHistory()
    setHistory([])
  }

  // Delete a specific history item
  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering onSelectHistoryItem
    deleteTranslationHistoryItem(id)
    setHistory(history.filter((item) => item.id !== id))
  }

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // If not mounted yet (server-side), show loading state
  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading history...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Translation History</h2>
        {history.length > 0 && (
          <Button variant="destructive" size="sm" onClick={handleClearHistory} className="gap-1">
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
          <RotateCcw className="text-muted-foreground h-8 w-8" />
          <h3 className="text-lg font-medium">No history yet</h3>
          <p className="text-muted-foreground text-sm">Your translation history will appear here</p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="space-y-3">
            {history.map((item) => {
              const sourceLanguage = getLanguageByCode(item.sourceLanguage)
              const targetLanguage = getLanguageByCode(item.targetLanguage)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Card
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onSelectHistoryItem(item)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <span className="flex items-center gap-1">
                          {sourceLanguage && (
                            <span className="flex items-center gap-1">
                              <span>{sourceLanguage.flag}</span>
                              <span>{sourceLanguage.name}</span>
                            </span>
                          )}
                          <span className="mx-2">→</span>
                          {targetLanguage && (
                            <span className="flex items-center gap-1">
                              <span>{targetLanguage.flag}</span>
                              <span>{targetLanguage.name}</span>
                            </span>
                          )}
                        </span>
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          aria-label="Delete history item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <div className="line-clamp-1 text-sm">{item.sourceText}</div>
                        <div className="line-clamp-1 text-sm font-medium">
                          {item.translatedText}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
