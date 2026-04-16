'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'

export default function PartnerResetPassword() {
  const router = useRouter()
  const [step, setStep] = useState<'request' | 'confirm'>('request')
  const [formData, setFormData] = useState({
    username: '',
    token: '',
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

  const validateRequestForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) newErrors.username = 'Username or email is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateConfirmForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.token.trim()) newErrors.token = 'Reset token is required'
    if (!formData.newPassword.trim()) newErrors.newPassword = 'New password is required'
    if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters'
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateRequestForm()) return

    setIsSubmitting(true)
    setErrors({})
    setSuccess('')

    try {
      const response = await fetch('/api/partners/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSuccess('Password reset instructions have been sent to your email. Please check your inbox for the reset token.')
        setStep('confirm')
      } else {
        setErrors({ 
          submit: result.message || 'Failed to send reset instructions. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Reset request error:', error)
      setErrors({ 
        submit: 'Network error. Please check your connection and try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateConfirmForm()) return

    setIsSubmitting(true)
    setErrors({})
    setSuccess('')

    try {
      const response = await fetch('/api/partners/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formData.token,
          newPassword: formData.newPassword
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSuccess('Password has been reset successfully. You can now login with your new password.')
        setTimeout(() => {
          router.push('/partners/login')
        }, 3000)
      } else {
        setErrors({ 
          submit: result.message || 'Failed to reset password. Please check your token and try again.' 
        })
      }
    } catch (error) {
      console.error('Reset confirmation error:', error)
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
            Reset your password
          </p>
        </div>
      </div>

      {/* Reset Form */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {step === 'request' ? 'Request Password Reset' : 'Reset Your Password'}
          </h2>
          
          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter your username or email"
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.username ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                {errors.username && (
                  <p className="text-red-400 text-sm mt-1">{errors.username}</p>
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
                {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reset Token
                </label>
                <input
                  type="text"
                  value={formData.token}
                  onChange={(e) => handleInputChange('token', e.target.value)}
                  placeholder="Enter the reset token from your email"
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.token ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                {errors.token && (
                  <p className="text-red-400 text-sm mt-1">{errors.token}</p>
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
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link 
                href="/partners/login" 
                className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                Back to Login
              </Link>
            </div>
            
            {step === 'confirm' && (
              <div className="text-center">
                <button
                  onClick={() => setStep('request')}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Request another reset token
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-emerald-400">
            {step === 'request' ? 'How it works:' : 'Instructions:'}
          </h3>
          <ul className="text-sm text-gray-300 space-y-2">
            {step === 'request' ? (
              <>
                <li>• Enter your username or email address</li>
                <li>• We'll send a reset token to your registered email</li>
                <li>• Use the token to create a new password</li>
                <li>• Tokens expire after 1 hour for security</li>
              </>
            ) : (
              <>
                <li>• Check your email for the reset token</li>
                <li>• Enter the token exactly as it appears</li>
                <li>• Create a strong new password (min 6 characters)</li>
                <li>• You'll be redirected to login after successful reset</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
