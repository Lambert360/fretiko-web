'use client'

import { useState, useEffect } from 'react'
import { Search, Building, Users, Target, Award, Globe } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/Header'

// Simple inline components since UI components aren't available
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-lg p-6 ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-2xl font-bold text-white ${className}`}>
    {children}
  </h2>
)

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>
    {children}
  </div>
)

interface AboutSection {
  id: string
  title: string
  content: string
  section: string
  order_num: number
  icon: React.ReactNode
  image?: string
  is_active: boolean
}

export default function AboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        // Fetch real about content from API
        const response = await fetch('/api/about')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch about content: ${response.statusText}`)
        }

        const result = await response.json()
        
        if (result.success) {
          // Debug: Log exact API response structure
          console.log('SECTIONS:', result.sections)
          
          // Map icons based on section name and process image URLs
          const sectionsWithIcons = result.sections.map((section: any) => {
            console.log(`Section ${section.section}:`, section.image)
            
            // Handle both full URLs and relative paths
            let imageUrl = section.image
            if (imageUrl && !imageUrl.startsWith('http')) {
              // Convert relative path to full Supabase URL
              imageUrl = `https://piytfaopdlxltdczdvtk.supabase.co/storage/v1/object/public/website-content/about_content${imageUrl}`
              console.log(`Converted ${section.section} URL:`, imageUrl)
            }
            
            let icon = <Building className="w-8 h-8 text-emerald-400" />
            
            switch (section.section?.toLowerCase()) {
              case 'mission':
                icon = <Target className="w-8 h-8 text-emerald-400" />
                break
              case 'vision':
                icon = <Globe className="w-8 h-8 text-blue-400" />
                break
              case 'team':
                icon = <Users className="w-8 h-8 text-purple-400" />
                break
              case 'achievements':
                icon = <Award className="w-8 h-8 text-yellow-400" />
                break
              default:
                icon = <Building className="w-8 h-8 text-emerald-400" />
            }
            
            return {
              ...section,
              image: imageUrl,
              icon
            }
          })
          
          setSections(sectionsWithIcons)
        } else {
          console.error('API returned error:', result.error)
          setSections([])
        }
      } catch (error) {
        console.error('Failed to fetch about content:', error)
        setSections([])
      } finally {
        setLoading(false)
      }
    }

    fetchAboutContent()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onDownloadClick={() => {}} />
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            About Fretiko
          </h1>
          <p className="text-xl text-emerald-100 mb-8">
            Revolutionizing commerce across Africa through technology and partnership
          </p>
        </div>
      </div>

      {/* About Sections */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-16">
          {sections.map((section, index) => (
            <div key={section.id} className={`grid gap-8 items-center ${index % 2 === 0 ? 'md:grid-cols-[1fr_1fr]' : 'md:grid-cols-[1fr_1fr]'}`}>
              <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                <div className="bg-emerald-600/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  {section.icon}
                </div>
                {section.image && (
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-full h-48 object-cover rounded-lg mt-4"
                  />
                )}
              </div>
              <div className={index % 2 === 0 ? 'order-2' : 'order-1'}>
                <Card>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none text-gray-300">
                      {section.content.split('\n').map((paragraph, pIndex) => {
                        if (paragraph.startsWith('##')) {
                          return (
                            <h3 key={pIndex} className="text-xl font-semibold text-white mb-4 mt-6">
                              {paragraph.replace('##', '')}
                            </h3>
                          )
                        } else if (paragraph.startsWith('###')) {
                          return (
                            <h4 key={pIndex} className="text-lg font-medium text-emerald-400 mb-3 mt-4">
                              {paragraph.replace('###', '')}
                            </h4>
                          )
                        } else if (paragraph.startsWith('-')) {
                          return (
                            <li key={pIndex} className="flex items-start text-gray-300 ml-4 mb-2">
                              <span className="text-emerald-400 mr-2">•</span>
                              <span>{paragraph.replace('-', '')}</span>
                            </li>
                          )
                        } else if (paragraph.trim()) {
                          return (
                            <p key={pIndex} className="mb-4 leading-relaxed">
                              {paragraph}
                            </p>
                          )
                        }
                        return null
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fretiko by Numbers</h2>
            <p className="text-gray-400 text-lg">
              Our impact in measurable terms
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">100K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <div className="text-gray-300">Delivery Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">99.5%</div>
              <div className="text-gray-300">On-Time Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">40+</div>
              <div className="text-gray-300">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Revolution?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Whether you're a business looking for better visibilty or a partner ready to grow
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/partnership" 
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Become a Partner
            </a>
            <a 
              href="/careers" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Join Our Team
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
