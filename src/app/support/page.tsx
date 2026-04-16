'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/toast'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Send,
  Search,
  FileText,
  Users,
  Headphones,
  Globe,
  Package,
  CreditCard,
  Handshake
} from 'lucide-react'

export default function SupportPage() {
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    priority: 'medium',
    message: ''
  })
  const [attachment, setAttachment] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // FAQ Categories
  const categories = [
    { id: 'all', name: 'All Categories', icon: HelpCircle },
    { id: 'account', name: 'Account Issues', icon: Users },
    { id: 'orders', name: 'Orders & Delivery', icon: Package },
    { id: 'payments', name: 'Payments & Refunds', icon: CreditCard },
    { id: 'technical', name: 'Technical Support', icon: AlertCircle },
    { id: 'partnership', name: 'Partnership', icon: Handshake }
  ]

  // FAQ Data
  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click the "Sign Up" button on the homepage and fill in your details. You\'ll receive a confirmation email to verify your account.',
      popular: true
    },
    {
      id: 2,
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'Go to "My Orders" in your dashboard and click on the order you want to track. You\'ll see real-time updates on your delivery status.',
      popular: true
    },
    {
      id: 3,
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, bank transfers, and mobile payment options including PayPal and Apple Pay.',
      popular: false
    },
    {
      id: 4,
      category: 'orders',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. The product must be unused and in original packaging. Some items may have different return terms.',
      popular: true
    },
    {
      id: 5,
      category: 'technical',
      question: 'I can\'t log into my account. What should I do?',
      answer: 'First, try resetting your password using the "Forgot Password" link. If that doesn\'t work, clear your browser cache and try again. Contact support if issues persist.',
      popular: false
    },
    {
      id: 6,
      category: 'partnership',
      question: 'How can I become a Fretiko partner?',
      answer: 'Visit our Partnership page and fill out the application form. We review all applications within 5-7 business days.',
      popular: false
    }
  ]

  // Support Options
  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team instantly',
      icon: MessageCircle,
      availability: 'Available 24/7',
      action: 'Start Chat',
      color: 'bg-green-500'
    },
    {
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: Phone,
      availability: 'Mon-Fri, 9AM-6PM',
      action: 'Call Now',
      color: 'bg-blue-500'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      availability: 'Response within 24 hours',
      action: 'Send Email',
      color: 'bg-purple-500'
    },
    {
      title: 'Help Center',
      description: 'Browse our comprehensive guides',
      icon: FileText,
      availability: 'Available 24/7',
      action: 'Browse Articles',
      color: 'bg-orange-500'
    }
  ]

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create FormData for file upload
      const submissionData = new FormData()
      submissionData.append('name', formData.name)
      submissionData.append('email', formData.email)
      submissionData.append('subject', formData.subject)
      submissionData.append('category', formData.category)
      submissionData.append('priority', formData.priority)
      submissionData.append('message', formData.message)
      
      // Add attachment file if provided
      if (attachment) {
        submissionData.append('attachment', attachment)
      }
      
      // Submit to backend API
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        body: submissionData,
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit support ticket')
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        priority: 'medium',
        message: ''
      })
      setAttachment(null)
      
      addToast({
        title: 'Support Ticket Submitted',
        description: 'We\'ll get back to you within 24 hours.',
        type: 'success'
      })
    } catch (error) {
      console.error('Failed to submit support ticket:', error)
      addToast({
        title: 'Submission Failed',
        description: 'Failed to submit support ticket. Please try again.',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onDownloadClick={() => {}} />
      {/* Hero Section */}
      <section className="relative py-20 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Headphones className="w-20 h-20 mx-auto mb-6 text-emerald-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Get instant support from our dedicated team. We're here to help you 24/7.
          </p>
          
          {/* Quick Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-14 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get Support Your Way</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:border-emerald-500 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm">{option.description}</p>
                    <div className="flex items-center justify-center mb-4">
                      <Clock className="w-4 h-4 text-emerald-400 mr-2" />
                      <span className="text-xs text-emerald-400">{option.availability}</span>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-300">Find quick answers to common questions</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>

          {/* FAQ List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    {faq.popular && (
                      <Badge className="bg-emerald-600">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No FAQs found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-gray-300">Send us a message and we'll get back to you</p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Submit Support Ticket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('subject', e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('category', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border-gray-600 text-white rounded-md"
                    >
                      <option value="">Select a category</option>
                      <option value="account">Account Issues</option>
                      <option value="orders">Orders & Delivery</option>
                      <option value="payments">Payments & Refunds</option>
                      <option value="technical">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('priority', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border-gray-600 text-white rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('message', e.target.value)}
                    placeholder="Please describe your issue in detail..."
                    rows={6}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Attachment (Optional)</label>
                  <Input
                    type="file"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttachment(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Upload screenshots, documents, or other files that help explain your issue (Max 10MB)
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 text-lg"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Response Time Promise */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Our Support Promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
              <p className="text-gray-300">Live Chat Support</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">&lt; 1 Hour</div>
              <p className="text-gray-300">Email Response Time</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">100%</div>
              <p className="text-gray-300">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
