import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
