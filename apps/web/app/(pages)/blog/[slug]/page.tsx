import type { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';
import { Blog } from '@/lib/types/blog';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// SEO Metadata Generation - Server Component
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Next.js 15: params is now a Promise, must await it
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentghar.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  try {
    // Fetch blog data for SEO
    const response = await fetch(`${apiUrl}/blog/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        title: 'Blog Post Not Found | RentGhar',
        description: 'The blog post you are looking for does not exist.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const blog: Blog = await response.json();

    // Get author name
    const authorName = typeof blog.author === 'object' && blog.author !== null && 'name' in blog.author
      ? blog.author.name
      : 'RentGhar Team';

    // Get category names
    const categories = Array.isArray(blog.categories) && blog.categories.length > 0
      ? blog.categories.map(cat => typeof cat === 'object' && 'name' in cat ? cat.name : 'Uncategorized')
      : ['Uncategorized'];

    // Get featured image or default
    const imageUrl = blog.featuredImage
      ? (blog.featuredImage.startsWith('http') 
          ? blog.featuredImage 
          : `${baseUrl}${blog.featuredImage.startsWith('/') ? '' : '/'}${blog.featuredImage}`)
      : `${baseUrl}/default-blog.jpg`;

    // Get canonical URL
    const canonicalUrl = blog.canonicalUrl || `${baseUrl}/blog/${blog.slug}`;
    const pageUrl = `${baseUrl}/blog/${blog.slug}`;

    // Meta title and description
    const metaTitle = blog.metaTitle || blog.title;
    const metaDescription = blog.metaDescription || blog.excerpt || blog.title.substring(0, 160);

    // Format date
    const publishedDate = blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString();
    const modifiedDate = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : publishedDate;

    return {
      title: `${metaTitle} | RentGhar Blog`,
      description: metaDescription,
      keywords: blog.tags?.join(', ') || categories.join(', '),
      authors: [{ name: authorName }],
      creator: authorName,
      publisher: 'RentGhar',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: 'article',
        title: metaTitle,
        description: metaDescription,
        url: pageUrl,
        siteName: 'RentGhar',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        locale: 'en_US',
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        authors: [authorName],
        section: categories[0] || 'General',
        tags: blog.tags || categories,
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [imageUrl],
        creator: '@rentghar',
        site: '@rentghar',
      },
      robots: {
        index: blog.status === 'published',
        follow: true,
        googleBot: {
          index: blog.status === 'published',
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'article:published_time': publishedDate,
        'article:modified_time': modifiedDate,
        'article:author': authorName,
        'article:section': categories[0] || 'General',
        ...(blog.tags && blog.tags.length > 0 && {
          'article:tag': blog.tags.join(', '),
        }),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | RentGhar',
      description: 'Read the latest blog posts about real estate in Pakistan.',
    };
  }
}

// Server Component - passes params to client component
export default async function BlogPostPage({ params }: PageProps) {
  // Next.js 15: params is now a Promise, must await it
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
