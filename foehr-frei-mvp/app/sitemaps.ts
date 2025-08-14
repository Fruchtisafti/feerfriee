// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://feerfriee.vercel.app';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/impressum`, lastModified: now },
    { url: `${base}/datenschutz`, lastModified: now },
  ];
}
