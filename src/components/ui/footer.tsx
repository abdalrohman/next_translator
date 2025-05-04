'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-4 text-center"
      >
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>Built with</span>
          <Heart className="h-4 w-4 text-red-500" />
          <span>using Next.js, Shadcn/UI, and Langchain</span>
        </div>
        <div className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} Next Translator
        </div>
      </motion.div>
    </footer>
  )
}
