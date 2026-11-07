import App from '../src/App'
import ProfileContent from './ProfileContent'

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rob Walsh',
  jobTitle: 'Senior Software Engineer',
  url: 'https://rob-walsh-homepage.vercel.app',
  email: 'mailto:robertjaywalsh@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Dublin', addressCountry: 'IE' },
  worksFor: { '@type': 'Organization', name: 'Mastercard' },
  alumniOf: { '@type': 'Organization', name: 'J.P. Morgan' },
  knowsAbout: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'LLM systems', 'RAG'],
  sameAs: ['https://www.linkedin.com/in/robert-walsh-937703218/', 'https://github.com/Rob-Jay'],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema).replace(/</g, '\u003c'),
        }}
      />
      <ProfileContent />
      <App />
    </>
  )
}
