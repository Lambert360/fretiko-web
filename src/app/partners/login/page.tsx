'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'

export default function PartnerLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch('/api/partners/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Store token and redirect to dashboard
        if (result.token) {
          localStorage.setItem('partner_token', result.token)
        }
        
        // Check if password change is required
        if (result.requiresPasswordChange) {
          router.push('/partners/change-password')
        } else {
          router.push('/partners/dashboard')
        }
      } else {
        setErrors({ 
          submit: result.message || 'Login failed. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ 
        submit: 'Network error. Please check your connection and try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onDownloadClick={() => {}} />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Partner Portal
          </h1>
          <p className="text-emerald-100">
            Access your logistics partner dashboard
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Sign In
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username or Company ID
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter your username"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.username ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link 
                href="/partners/track" 
                className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                Track Application Status
              </Link>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              Not yet a partner?{' '}
              <Link 
                href="/partnership/logistics" 
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Apply Now
              </Link>
            </div>

            <div className="text-center">
              <Link 
                href="/partners/reset-password" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-emerald-400">Security Notice</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• This portal is for verified logistics partners only</li>
            <li>• Keep your login credentials secure and confidential</li>
            <li>• Log out after each session, especially on shared devices</li>
            <li>• Contact support immediately if you suspect unauthorized access</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
