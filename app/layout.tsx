import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Font files live in the repo (OFL, from Fontsource), so builds never depend on Google Fonts.
// next/font adds size-matched fallbacks, so text doesn't jump when the fonts load.
const sans = localFont({
  src: './fonts/SpaceGrotesk-Variable.woff2',
  weight: '300 700',
  variable: '--font-sans-face',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})
const mono = localFont({
  src: './fonts/JetBrainsMono-Variable.woff2',
  weight: '100 800',
  variable: '--font-mono-face',
  display: 'swap',
  fallback: ['monospace'],
})

const SITE_URL = 'https://rob-walsh-homepage.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  title: 'Rob Walsh — Senior Software Engineer',
  description:
    'Senior Software Engineer based in Dublin, Ireland. Java, Spring Boot, microservices, AI/LLM systems.',
  openGraph: {
    title: 'Rob Walsh — Senior Software Engineer',
    description: 'Senior SE at Mastercard, Dublin. Java, Spring Boot, AI/LLM.',
    url: SITE_URL,
    siteName: 'Rob Walsh Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rob Walsh — Senior Software Engineer',
    description: 'Senior SE at Mastercard, Dublin. Java, Spring Boot, AI/LLM.',
    images: ['/opengraph-image.png'],
  },
}

// Runs before first paint so the page never flashes the wrong theme.
const THEME_SCRIPT = `try {
  var saved = localStorage.getItem('theme');
  var system = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = saved === 'light' || saved === 'dark' ? saved : system;
} catch (e) {}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
