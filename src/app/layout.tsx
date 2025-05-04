import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
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
        width: 1200,
        height: 630,
        alt: appName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: appDescription,
    images: [`${defaultUrl}/og-image.png`],
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/favicons/favicon.ico',
    apple: [
      {
        url: '/favicons/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
    other: [
      {
        url: '/favicons/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        rel: 'apple-touch-icon',
      },
      {
        url: '/favicons/favicon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        url: '/favicons/favicon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        url: '/favicons/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        rel: 'apple-touch-startup-image',
      },
    ],
  },
  manifest: '/manifest.json',
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
            {/* Header */}
            <main className="flex-1" id="main-content">
              <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:py-16">
                {children}
              </div>
            </main>
            {/* Footer */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
