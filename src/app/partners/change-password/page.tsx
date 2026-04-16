'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'

export default function PartnerChangePassword() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword.trim()) newErrors.currentPassword = 'Current password is required'
    if (!formData.newPassword.trim()) newErrors.newPassword = 'New password is required'
    if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters'
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})
    setSuccess('')

    try {
      // Get token from localStorage
      const token = localStorage.getItem('partner_token')
      if (!token) {
        setErrors({ submit: 'Authentication required. Please login again.' })
        router.push('/partners/login')
        return
      }

      const response = await fetch('/api/partners/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSuccess('Password changed successfully! Redirecting to dashboard...')
        setTimeout(() => {
          router.push('/partners/dashboard')
        }, 2000)
      } else {
        setErrors({ 
          submit: result.message || 'Failed to change password. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Change password error:', error)
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
            Change your password
          </p>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Change Password
          </h2>
          
          <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">
              You need to change your password for security reasons. Please create a new password.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Enter your current password"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.currentPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Enter your new password"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.newPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your new password"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link 
                href="/partners/dashboard" 
                className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                Skip for now (not recommended)
              </Link>
            </div>
            
            <div className="text-center">
              <Link 
                href="/partners/login" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-emerald-400">Password Requirements:</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Must be at least 6 characters long</li>
            <li>• Should include uppercase and lowercase letters</li>
            <li>• Should include numbers and special characters</li>
            <li>• Must be different from your current password</li>
            <li>• Avoid using common words or personal information</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
