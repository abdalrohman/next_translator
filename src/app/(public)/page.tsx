import { TranslatorInterface } from '@/components/translator-interface'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <TranslatorInterface />
    </div>
  )
}
