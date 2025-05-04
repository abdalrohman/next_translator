import { ThemeSwitcher } from '@/components/ui/theme-switcher'

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Next Translator</h1>
      <div>
        <ThemeSwitcher />
      </div>
    </div>
  )
}
