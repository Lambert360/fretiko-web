'use client'

import { useState } from 'react'
import Header from '@/components/Header'

export default function GeneralPartnership() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    partnershipType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/partnerships/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting application:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Thank You for Your Interest!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            We've received your partnership inquiry and our team will get back to you within 2-3 business days.
          </p>
          <button
            onClick={() => window.location.href = '/partnership'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Partnership Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onDownloadClick={() => {}} />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Explore Partnership Opportunities
          </h1>
          <p className="text-xl text-blue-100">
            Let's discuss how we can work together to create value
          </p>
        </div>
      </div>

      {/* Partnership Types */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-12">
          Partnership Opportunities
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PartnershipTypeCard
            icon="🤝"
            title="Strategic Partnerships"
            description="Long-term strategic collaborations for mutual growth"
            features={['Joint ventures', 'Co-marketing', 'Technology integration']}
          />
          <PartnershipTypeCard
            icon="📱"
            title="Technology Partners"
            description="Integrate your technology with our platform"
            features={['API integrations', 'White-label solutions', 'Custom development']}
          />
          <PartnershipTypeCard
            icon="🎯"
            title="Marketing Partners"
            description="Promote Fretiko to your audience"
            features={['Affiliate programs', 'Co-branded campaigns', 'Referral partnerships']}
          />
          <PartnershipTypeCard
            icon="💼"
            title="Business Solutions"
            description="Custom solutions for enterprise clients"
            features={['B2B delivery', 'Corporate accounts', 'Volume discounts']}
          />
          <PartnershipTypeCard
            icon="🌍"
            title="International Expansion"
            description="Partner with us for global growth"
            features={['Market entry', 'Local partnerships', 'Regulatory support']}
          />
          <PartnershipTypeCard
            icon="💡"
            title="Innovation Partners"
            description="Collaborate on new features and services"
            features={['Beta programs', 'Pilot projects', 'R&D partnerships']}
          />
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Get in Touch
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Your Name"
                value={formData.name}
                onChange={(value) => handleInputChange('name', value)}
                required
              />
              <FormField
                label="Email Address"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                type="email"
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Company/Organization"
                value={formData.company}
                onChange={(value) => handleInputChange('company', value)}
              />
              <FormField
                label="Phone Number"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                type="tel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Partnership Type *
              </label>
              <select
                value={formData.partnershipType}
                onChange={(e) => handleInputChange('partnershipType', e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a partnership type</option>
                <option value="strategic">Strategic Partnership</option>
                <option value="technology">Technology Partnership</option>
                <option value="marketing">Marketing Partnership</option>
                <option value="business">Business Solutions</option>
                <option value="international">International Expansion</option>
                <option value="innovation">Innovation Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                required
                placeholder="Tell us about your partnership idea and how we can work together..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {isSubmitting ? 'Sending...' : 'Send Partnership Inquiry'}
            </button>
          </form>
        </div>
      </div>

      {/* Contact Information */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-8">Other Ways to Connect</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-300">partnerships@fretiko.com</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-300">+234 816 252 5349</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="font-semibold mb-2">Office</h3>
              <p className="text-gray-300">Port Harcourt, Nigeria</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface PartnershipTypeCardProps {
  icon: string
  title: string
  description: string
  features: string[]
}

function PartnershipTypeCard({ icon, title, description, features }: PartnershipTypeCardProps) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm text-gray-400">
            <span className="text-blue-400 mr-2">•</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface FormFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}

function FormField({ label, value, onChange, type = 'text', required }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )
}
