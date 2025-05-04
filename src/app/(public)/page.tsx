import { TranslatorInterface } from '@/components/translator-interface'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Next Translator
        </h1>
        <ThemeSwitcher />
      </div>

      <p className="text-muted-foreground text-lg">
        Translate text between multiple languages using the power of Gemini AI.
      </p>

      <TranslatorInterface />
    </div>
  )
}
