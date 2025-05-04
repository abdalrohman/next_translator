import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import './globals.css'

const appName = 'Next Translator'
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'
const appDescription = 'Next Translator application.'

// Configure Geist font with optimized loading strategy
const geistSans = Geist({
  display: 'swap', // Use swap to ensure text is visible while fonts are loading
  subsets: ['latin'],
  variable: '--font-geist-sans',
  preload: true, // Preload the font for better performance
  fallback: ['system-ui', 'sans-serif'], // Add fallback fonts
  adjustFontFallback: true, // Adjust the fallback font to match the metrics of the web font
})

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  keywords: ['translation', 'translator', 'next translator'],
  authors: [
    {
      name: '${appName} Team',
      url: defaultUrl,
    },
  ],
  creator: appName,
  publisher: appName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  applicationName: appName,
  appleWebApp: {
    capable: true,
    title: appName,
    statusBarStyle: 'default',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: defaultUrl,
    title: appName,
    description: appDescription,
    siteName: appName,
    images: [
      {
        url: `${defaultUrl}/og-image.png`,
        width: 1260,
        height: 630,
        alt: appName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: appDescription,
    images: [`${defaultUrl}/twitter-image.png`],
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicons/favicon.ico',
    apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        url: '/favicons/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/favicons/favicon-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        rel: 'maskable-icon',
      },
      {
        url: '/favicons/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        url: '/favicons/favicon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        rel: 'maskable-icon',
      },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    types: {
      'application/manifest+json': '/manifest.json',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
              <Header />
            </div>
            <main className="flex-1" id="main-content">
              <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-8 lg:py-12">
                {children}
              </div>
            </main>
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
              <Footer />
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
