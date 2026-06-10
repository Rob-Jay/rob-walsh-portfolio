import type { Metadata } from 'next'
import '../src/index.css'

export const metadata: Metadata = {
  title: 'Rob Walsh — Senior Software Engineer',
  description:
    'Senior Software Engineer based in Dublin, Ireland. Java, Spring Boot, microservices, AI/LLM systems.',
  openGraph: {
    title: 'Rob Walsh — Senior Software Engineer',
    description: 'Senior SE at Mastercard, Dublin. Java, Spring Boot, AI/LLM.',
    url: 'https://rob-jay.github.io/rob-walsh-portfolio/',
    siteName: 'Rob Walsh Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rob Walsh — Senior Software Engineer',
    description: 'Senior SE at Mastercard, Dublin. Java, Spring Boot, AI/LLM.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
