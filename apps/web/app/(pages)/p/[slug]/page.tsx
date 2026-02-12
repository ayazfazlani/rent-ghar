"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { pageApi } from '@/lib/api/page/page.api'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageData {
  title: string
  content: string
  metaTitle?: string
  metaDescription?: string
}

export default function CustomPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [page, setPage] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true)
        const data = await pageApi.getPageBySlug(slug)
        setPage(data)
      } catch (err: any) {
        console.error('Error fetching page:', err)
        setError('Page not found or failed to load.')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPage()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading page content...</p>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Button onClick={() => router.push('/')}>Return Home</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">{page.title}</h1>
        <div
          className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  )
}
