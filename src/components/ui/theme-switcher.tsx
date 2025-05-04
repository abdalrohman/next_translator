'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Laptop, Moon, Sun, Check } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-9" /> // Prevent layout shift
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const ICON_SIZE = 16

  // Animation variants for the icon container
  const iconContainerVariants = {
    initial: { rotate: 0 },
    animate: { rotate: isOpen ? 30 : 0 },
    transition: { duration: 0.2 },
  }

  // Animation variants for the icons
  const iconVariants = {
    initial: { scale: 0.6, opacity: 0, rotate: -30 },
    animate: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0.6, opacity: 0, rotate: 30 },
    transition: { type: 'spring', stiffness: 200, damping: 10 },
  }

  // Get icon and color based on current theme
  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return <Sun key="light" size={ICON_SIZE} className="text-amber-500" />
      case 'dark':
        return <Moon key="dark" size={ICON_SIZE} className="text-indigo-400" />
      default:
        return <Laptop key="system" size={ICON_SIZE} className="text-slate-400" />
    }
  }

  // Theme options
  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun size={ICON_SIZE} className="text-amber-500" /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={ICON_SIZE} className="text-indigo-400" /> },
    {
      value: 'system',
      label: 'System',
      icon: <Laptop size={ICON_SIZE} className="text-slate-400" />,
    },
  ]

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <DropdownMenu onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'relative h-9 w-9 rounded-full transition-colors focus-visible:ring-offset-2',
                  isOpen && 'bg-muted',
                )}
              >
                <motion.div className="flex items-center justify-center" {...iconContainerVariants}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentTheme}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={iconVariants}
                    >
                      {getThemeIcon(currentTheme as string)}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Change theme</p>
          </TooltipContent>
          <DropdownMenuContent
            className="border-muted/30 w-36 rounded-lg p-2 shadow-lg backdrop-blur-sm"
            align="end"
          >
            <div className="space-y-1">
              {themeOptions.map((item) => (
                <motion.div
                  key={item.value}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => setTheme(item.value)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-sm',
                      theme === item.value
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted/50 text-foreground',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {theme === item.value && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check size={14} className="text-primary" />
                      </motion.div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  )
}

export { ThemeSwitcher }
