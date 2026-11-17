import type { Metadata } from 'next';
import { LandingHome } from '@/components/landing/landing-home';

export const metadata: Metadata = {
  title: 'MEPROCENT SRL | Ingeniería de confiabilidad e integridad industrial',
  description:
    'Inspección API 653, mantenimiento predictivo e integridad mecánica. San Nicolás, Buenos Aires. Soluciones industriales con respaldo técnico certificado.',
  openGraph: {
    title: 'MEPROCENT — Soluciones industriales',
    description:
      'Inspeccionamos, evaluamos y protegemos tus activos industriales. Confiabilidad, vibraciones e integridad mecánica.',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: '/landing-hero.jpg', width: 1200, height: 630, alt: 'MEPROCENT Soluciones Industriales' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'MEPROCENT Soluciones Industriales SRL',
  description: 'Ingeniería de confiabilidad, mantenimiento predictivo e integridad mecánica industrial.',
  areaServed: 'Argentina',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'San Nicolás de los Arroyos',
    addressRegion: 'Buenos Aires',
    addressCountry: 'AR',
  },
  telephone: '+54-336-4322386',
  email: 'lucianocenturion@meprocent.com.ar',
  url: 'https://meprocent.com.ar',
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingHome />
    </>
  );
}