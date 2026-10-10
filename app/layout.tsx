import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://excellenciariziki.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'EXCELLENCIA COLLÈGE RIZIKI', template: '%s | EXCELLENCIA COLLÈGE RIZIKI' },
  description: 'Site officiel de EXCELLENCIA COLLÈGE RIZIKI à Kampempa : maternelle, primaire, éducation de base et Humanités. Discipline, Travail, Excellence.',
  applicationName: 'EXCELLENCIA COLLÈGE RIZIKI',
  manifest: '/manifest.webmanifest',
  alternates: { canonical: '/' },
  keywords: ['EXCELLENCIA COLLÈGE RIZIKI','Collège Riziki','école à Kampempa','école à Lubumbashi','maternelle','primaire','secondaire','mécanique automobile','mécanique générale','électricité générale','commerciale de gestion','pédagogie générale','coupe et couture','sciences'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    type: 'website', locale: 'fr_CD', siteName: 'EXCELLENCIA COLLÈGE RIZIKI', url: '/',
    title: 'EXCELLENCIA COLLÈGE RIZIKI',
    description: 'Discipline, Travail, Excellence — découvrez l’école, ses formations, ses réalisations, actualités et communiqués.',
    images: [{ url: '/images/final/1000240773.webp', width: 1200, height: 630, alt: 'Campus de EXCELLENCIA COLLÈGE RIZIKI' }],
  },
  twitter: { card: 'summary_large_image', title: 'EXCELLENCIA COLLÈGE RIZIKI', description: 'Discipline, Travail, Excellence', images: ['/images/final/1000240773.webp'] },
  icons: { icon: '/brand/logo-icon.svg', apple: '/brand/logo-clean.png' },
  category: 'education',
  authors: [{ name: 'EXCELLENCIA COLLÈGE RIZIKI' }],
  creator: 'EXCELLENCIA COLLÈGE RIZIKI',
  publisher: 'EXCELLENCIA COLLÈGE RIZIKI',
};

export const viewport: Viewport = { themeColor: '#0b2f6b', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><a className="skipLink" href="#contenu">Aller au contenu</a>{children}</body></html>;
}
