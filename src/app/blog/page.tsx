'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Clock, User, Tag, Calendar, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

// Simple inline components since UI components aren't available
const InlineCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-lg p-6 ${className}`}>
    {children}
  </div>
)

const InlineCardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

const InlineCardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-2xl font-bold text-white ${className}`}>
    {children}
  </h2>
)

const InlineCardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>
    {children}
  </div>
)

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
  reading_time?: number
  published_at: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch real blog posts from API
        const response = await fetch('/api/blog')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.statusText}`)
        }

        const result = await response.json()
        
        if (result.success) {
          setPosts(result.posts || [])
        } else {
          console.error('API returned error:', result.error)
          setPosts([])
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Filter posts based on search and tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onDownloadClick={() => {}} />
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Fretiko Blog
          </h1>
          <p className="text-xl text-emerald-100 mb-8">
            Insights, updates, and stories from the future of African commerce
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All Posts
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                #{tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Blog Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-4">No posts found</h3>
              <p className="text-gray-400">
                {searchTerm || selectedTag 
                  ? "No posts match your search criteria." 
                  : "No blog posts available yet."}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-gray-900 border-gray-800 hover:border-emerald-500 transition-colors">
                  {post.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                  )}
                  <InlineCardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-emerald-600 text-white">
                        {post.tags[0]}
                      </Badge>
                      {post.reading_time && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.reading_time} min read
                        </div>
                      )}
                    </div>
                    <InlineCardTitle>{post.title}</InlineCardTitle>
                  </InlineCardHeader>
                  <InlineCardContent className="mb-4">
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400 text-sm">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link href={`/blog/${post.slug}`}>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </InlineCardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
