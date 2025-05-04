'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Link from 'next/link'

// Custom GitHub icon component
function GitHubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

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
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/abdalrohman/next_translator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm"
          >
            <GitHubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </Link>
        </div>
        <div className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} Next Translator
        </div>
      </motion.div>
    </footer>
  )
}
