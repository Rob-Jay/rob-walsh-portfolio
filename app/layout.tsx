import type { Metadata } from 'next'
import '../src/index.css'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
