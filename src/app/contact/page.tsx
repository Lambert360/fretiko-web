'use client'

import { useState } from 'react'
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
  MapPin, 
  Clock,
  Send,
  HelpCircle,
  Users,
  Globe,
  Package,
  CreditCard,
  Handshake
} from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'medium'
      })
    }, 3000)
  }

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      status: 'online',
      href: '/support'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      action: '+234-816-FRETIKO',
      status: 'available',
      href: 'tel:2348162525349'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      action: 'support@fretiko.com',
      status: 'responsive',
      href: 'mailto:support@fretiko.com'
    }
  ]

  const departments = [
    {
      icon: Users,
      name: 'Customer Support',
      email: 'support@fretiko.com',
      description: 'General inquiries, account issues, and technical support',
      responseTime: 'Within 24 hours'
    },
    {
      icon: Package,
      name: 'Order Support',
      email: 'support@fretiko.com',
      description: 'Order tracking, delivery issues, and product questions',
      responseTime: 'Within 12 hours'
    },
    {
      icon: CreditCard,
      name: 'Payment Support',
      email: 'billing@fretiko.com',
      description: 'Payment issues, refunds, and billing inquiries',
      responseTime: 'Within 6 hours'
    },
    {
      icon: Handshake,
      name: 'Partnerships',
      email: 'partnerships@fretiko.com',
      description: 'Business partnerships, collaborations, and B2B inquiries',
      responseTime: 'Within 48 hours'
    }
  ]

  const faqItems = [
    {
      question: 'How quickly will I receive a response?',
      answer: 'Response times vary by department. General inquiries typically receive responses within 24 hours, while urgent issues are prioritized for faster response.'
    },
    {
      question: 'What information should I include in my message?',
      answer: 'Include your account email, order number (if applicable), and a detailed description of your issue. The more information you provide, the faster we can help you.'
    },
    {
      question: 'Can I track my support request?',
      answer: 'Yes! After submitting a support request, you\'ll receive a ticket ID. You can track your request status in the Support Center.'
    },
    {
      question: 'Do you offer phone support in multiple languages?',
      answer: 'Currently, phone support is available in English and Spanish. For other languages, please use our email or chat support.'
    }
  ]

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-black">
        <Header onDownloadClick={() => {}} />
        
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="neon-text text-3xl font-bold mb-4">Message Sent!</h1>
            <p className="text-white/70 text-lg mb-8">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <div className="glass-effect rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-white/60 text-sm mb-4">
                <strong>Reference ID:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-white/60 text-sm">
                We've sent a confirmation email to {formData.email}. You can track your request status in the Support Center.
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <Header onDownloadClick={() => {}} />
      
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="neon-text text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            We're here to help! Get in touch with our support team through any of the channels below.
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactOptions.map((option, index) => (
            <Card key={index} className="glass-effect border-white/10 hover:border-neon-cyan/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-neon-cyan/20 rounded-xl flex items-center justify-center">
                    <option.icon className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {option.status}
                  </Badge>
                </div>
                <h3 className="text-white font-semibold mb-2">{option.title}</h3>
                <p className="text-white/60 text-sm mb-4">{option.description}</p>
                <a 
                  href={option.href}
                  className="text-neon-cyan hover:text-neon-cyan/80 text-sm font-medium transition-colors"
                >
                  {option.action} →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-sm block mb-2">Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                        className="bg-white/5 border-white/20 text-white placeholder-white/40"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm block mb-2">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="bg-white/5 border-white/20 text-white placeholder-white/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/70 text-sm block mb-2">Subject *</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief description of your issue"
                      required
                      className="bg-white/5 border-white/20 text-white placeholder-white/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-sm block mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-neon-cyan"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing & Payment</option>
                        <option value="order">Order Issue</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm block mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-neon-cyan"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-white/70 text-sm block mb-2">Message *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please describe your issue in detail..."
                      required
                      rows={6}
                      className="bg-white/5 border-white/20 text-white placeholder-white/40 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-neon-cyan hover:bg-neon-cyan/80 text-black font-semibold"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Departments */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Departments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="border-b border-white/10 pb-4 last:border-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-neon-purple/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <dept.icon className="w-4 h-4 text-neon-purple" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{dept.name}</h4>
                        <a href={`mailto:${dept.email}`} className="text-neon-cyan text-xs hover:underline">
                          {dept.email}
                        </a>
                        <p className="text-white/60 text-xs mt-1">{dept.description}</p>
                        <p className="text-white/50 text-xs mt-1">{dept.responseTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-white/70 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-neon-cyan text-xs">
                      24/7 support available for urgent issues
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Quick FAQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📧 Legal Questions</h3>
                    <ul className="space-y-2 text-white/70">
                      <li><strong>Email:</strong> support@fretiko.com</li>
                      <li><strong>Response Time:</strong> Within 7 business days</li>
                      <li><strong>For:</strong> Terms interpretation, legal compliance</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🏢 General Contact</h3>
                    <ul className="space-y-2 text-white/70">
                      <li><strong>Email:</strong> support@fretiko.com</li>
                      <li><strong>Phone:</strong> +234-8147308687</li>
                      <li><strong>Phone:</strong> +234-8162525349</li>
                      <li><strong>Hours:</strong> Mon-Fri, 9AM-6PM WAT</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📍 Mailing Address</h3>
                    <ul className="space-y-2 text-white/70">
                      <li>Fretiko Limited</li>
                      <li>Legal Department</li>
                      <li>Port Harcourt, Nigeria</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📋 Document Requests</h3>
                    <ul className="space-y-2 text-white/70">
                      <li><strong>Email:</strong> support@fretiko.com</li>
                      <li><strong>For:</strong> Copies of agreements, policies</li>
                      <li><strong>Format:</strong> PDF or printed copies available</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location */}
        <Card className="glass-effect border-white/10 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-5 h-5 text-neon-cyan" />
              <h3 className="text-white font-semibold">Our Office</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-white/70">
                  Fretiko Limited<br />
                  Port Harcourt, Nigeria
                </p>
              </div>
              <div>
                <div className="space-y-2 text-white/70 text-sm">
                  <p><strong>Phone:</strong> +234-8147308687</p>
                  <p><strong>Phone:</strong> +234-8162525349</p>
                  <p><strong>Email:</strong> support@fretiko.com</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
