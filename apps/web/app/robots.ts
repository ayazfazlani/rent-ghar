import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://propertydealer.pk';

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/properties',
        '/blog',
        '/images/',
        '/assets/',
        '/css/',
        '/js/',
      ],
      disallow: [
        '/search',
        '/*?*',
        '/filter',
        '/tag',
        '/admin',
        '/login',
        '/register',
        '/dashboard',
        '/*page=',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
