import { MetadataRoute } from 'next';
import { cities, propertyTypes } from '@/lib/data';

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Helper to convert city/type to slug
  const toSlug = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  // 1. Static Pages
  const staticPages = [
    '',
    '/about',
    '/blog',
    '/contact',
    '/properties',
    '/properties/rent',
    '/properties/sale',
    '/hotels',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Category Pages
  const categoryPages: MetadataRoute.Sitemap = [];
  cities.forEach(city => {
    const citySlug = toSlug(city);
    categoryPages.push({
      url: `${BASE_URL}/properties/rent/${citySlug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
    categoryPages.push({
      url: `${BASE_URL}/properties/sale/${citySlug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    propertyTypes.forEach(type => {
      const typeSlug = type.toLowerCase();
      categoryPages.push({
        url: `${BASE_URL}/properties/rent/${citySlug}/${typeSlug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
      categoryPages.push({
        url: `${BASE_URL}/properties/sale/${citySlug}/${typeSlug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });
  });

  // 3. Dynamic Properties
  let dynamicProperties: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${API_URL}/api/properties`, { next: { revalidate: 3600 } });
    if (response.ok) {
      const properties = await response.json();
      dynamicProperties = (properties || []).map((prop: any) => ({
        url: `${BASE_URL}/properties/${prop.slug}`,
        lastModified: new Date(prop.updatedAt || prop.createdAt || currentDate),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Sitemap Properties Fetch Error:', error);
  }

  // 4. Dynamic Blogs
  let dynamicBlogs: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${API_URL}/api/blog/published`, { next: { revalidate: 3600 } });
    if (response.ok) {
      const blogs = await response.json();
      dynamicBlogs = (blogs || []).map((blog: any) => ({
        url: `${BASE_URL}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt || currentDate),
        changeFrequency: 'monthly',
        priority: 0.5,
      }));
    }
  } catch (error) {
    console.error('Sitemap Blogs Fetch Error:', error);
  }

  return [...staticPages, ...categoryPages, ...dynamicProperties, ...dynamicBlogs];
}
