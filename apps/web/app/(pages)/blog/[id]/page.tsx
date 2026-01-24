'use client'
import { useParams } from 'next/navigation';
import BlogDetailPage from '@/components/BlogDetailPage';
import { getPostById, getRelatedPosts } from '@/data/blogData';

export default function BlogPostPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);
  
  const post = getPostById(postId);
  
  if (!post) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Post Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <a 
            href="/blog" 
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Blog
          </a>
        </div>
      </main>
    );
  }
  
  const relatedPosts = getRelatedPosts(postId);

  return (
    <main className="min-h-screen">
      <BlogDetailPage post={post} relatedPosts={relatedPosts} />
    </main>
  );
}