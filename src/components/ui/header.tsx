'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { motion } from 'framer-motion'
import { Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function Header() {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)

  const shortcuts = [
    { key: 'Ctrl/Cmd + Enter', description: 'Translate text' },
    { key: 'Esc', description: 'Clear input' },
    { key: 'Ctrl/Cmd + Shift + S', description: 'Swap languages' },
    { key: 'Ctrl/Cmd + C', description: 'Copy translation' },
    { key: 'Ctrl/Cmd + L', description: 'Listen to translation' },
    { key: 'Tab / Shift + Tab', description: 'Navigate between elements' },
  ]

  return (
    <header className="w-full py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="relative h-10 w-10 sm:h-12 sm:w-12"
          >
            <Image
              src="/logo.svg"
              alt="Next Translator Logo"
              fill
              className="dark:invert-[0.85]"
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Next Translator
            </h1>
          </motion.div>
        </Link>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsShortcutsOpen(true)}
                >
                  <Keyboard className="h-5 w-5" />
                  <span className="sr-only">Keyboard shortcuts</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Keyboard shortcuts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ThemeSwitcher />
        </div>
      </div>

      <Dialog open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Use these keyboard shortcuts to navigate the translator more efficiently.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium">{shortcut.description}</span>
                <kbd className="bg-muted text-muted-foreground rounded px-2 py-1 font-mono text-xs">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
