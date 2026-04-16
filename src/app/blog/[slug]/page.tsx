import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Define the blog post interface
interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  status: string
  slug: string
  tags: string[]
  featured_image?: string
  reading_time: number
  published_at: string
  updated_at: string
  created_at: string
}

// Fetch blog post data
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/public/blog-posts/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for fresh content
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch blog post: ${response.statusText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Blog post fetch error:', error)
    return null
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

// Blog post page component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Parse content with markdown-like formatting
  const parseContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold text-white mb-6 mt-8">
            {paragraph.replace('# ', '')}
          </h1>
        )
      } else if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-semibold text-white mb-4 mt-6">
            {paragraph.replace('## ', '')}
          </h2>
        )
      } else if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-medium text-emerald-400 mb-3 mt-4">
            {paragraph.replace('### ', '')}
          </h3>
        )
      } else if (paragraph.startsWith('- ')) {
        return (
          <li key={index} className="flex items-start text-gray-300 ml-6 mb-2">
            <span className="text-emerald-400 mr-2 mt-1">-</span>
            <span>{paragraph.replace('- ', '')}</span>
          </li>
        )
      } else if (paragraph.trim()) {
        return (
          <p key={index} className="text-gray-300 mb-4 leading-relaxed">
            {paragraph}
          </p>
        )
      }
      return null
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Blog Post Header */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time} min read</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8">
            <Image
              src={post.featured_image}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 sm:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Blog Content */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-8">
            <div className="prose prose-invert prose-lg max-w-none">
              {parseContent(post.content)}
            </div>
          </CardContent>
        </Card>

        {/* Post Footer */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-400">
              Published on {formatDate(post.published_at)}
              {post.updated_at !== post.published_at && (
                <span className="ml-2">
                  (Updated on {formatDate(post.updated_at)})
                </span>
              )}
            </div>
            
            <Link 
              href="/blog" 
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
