import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://excellenciariziki.com';
  const pages = [
    ['', 1], ['/ecole/', .8], ['/formations/', .9], ['/vie-scolaire/', .8],
    ['/actualites/', .8], ['/communiques/', .8], ['/contact/', .9],
  ] as const;
  return pages.map(([path,priority]) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: 'weekly', priority }));
}
