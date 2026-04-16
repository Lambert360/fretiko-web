'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function ApplicationTracking() {
  const [trackingId, setTrackingId] = useState('')
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }

    setIsSearching(true)
    setError('')
    setTrackingResult(null)

    try {
      const response = await fetch(`/api/logistics-partners/track/${trackingId}`)
      const result = await response.json()

      if (response.ok && result.success) {
        setTrackingResult(result.application)
      } else {
        setError(result.message || 'Application not found')
      }
    } catch (error) {
      console.error('Tracking error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      case 'under_review': return 'bg-yellow-500'
      case 'in_progress': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified'
      case 'rejected': return 'Rejected'
      case 'under_review': return 'Under Review'
      case 'in_progress': return 'In Progress'
      default: status
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onDownloadClick={() => {}} />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Track Your Application
          </h1>
          <p className="text-emerald-100">
            Check the status of your logistics partnership application
          </p>
        </div>
      </div>

      {/* Tracking Form */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Application Status
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tracking ID
              </label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID (e.g., LPA123ABC45)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              {isSearching ? 'Searching...' : 'Track Application'}
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center">
              <Link 
                href="/partners/login" 
                className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                ← Back to Partner Login
              </Link>
            </div>
          </div>
        </div>

        {/* Apply Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Not yet applied?{' '}
            <Link 
              href="/partnership/logistics" 
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Apply Now
            </Link>
          </p>
        </div>
      </div>

      {/* Results */}
      {trackingResult && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Application Details</h2>
            
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(trackingResult.status)}`}>
                  {getStatusText(trackingResult.status)}
                </span>
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-400">Company Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-400">Company Name:</span>
                      <p className="text-white ml-2">{trackingResult.company_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Tracking ID:</span>
                      <p className="text-white ml-2 font-mono">{trackingResult.tracking_id}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Contact Person:</span>
                      <p className="text-white ml-2">{trackingResult.contact_person_name}</p>
                    </div>
                    <div>
                      <span className="text-400">Contact Email:</span>
                      <p className="text-white ml-2">{trackingResult.contact_email}</p>
                    </div>
                    {trackingResult.contact_phone && (
                      <div>
                        <span className="text-gray-400">Contact Phone:</span>
                        <p className="text-white ml-2">{trackingResult.contact_phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-emerald-400">Application Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-400">Submitted:</span>
                      <p className="text-white ml-2">
                        {new Date(trackingResult.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Service Areas:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {trackingResult.service_areas?.map((area: string, index: number) => (
                          <span key={index} className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    {trackingResult.years_in_operation && (
                      <div>
                        <span className="text-gray-400">Years in Operation:</span>
                        <p className="text-white ml-2">{trackingResult.years_in_operation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              {trackingResult.admin_notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-emerald-400">Admin Notes</h3>
                  <p className="text-gray-300 bg-gray-800 p-3 rounded-lg">
                    {trackingResult.admin_notes}
                  </p>
                </div>
              )}

              {/* Rejection Reason */}
              {trackingResult.rejection_reason && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-400">Rejection Reason</h3>
                  <p className="text-red-300 bg-red-900/20 p-3 rounded-lg">
                    {trackingResult.rejection_reason}
                  </p>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-emerald-400">Next Steps</h3>
                {trackingResult.status === 'in_progress' && (
                  <p className="text-gray-300">
                    Your application is currently being reviewed. We will contact you via email once there are updates.
                  </p>
                )}
                {trackingResult.status === 'under_review' && (
                  <p className="text-gray-300">
                    Your application is under review by our team. This process typically takes 3-5 business days.
                  </p>
                )}
                {trackingResult.status === 'verified' && (
                  <p className="text-gray-300">
                    Congratulations! Your application has been verified. You can now access your partner dashboard using the credentials sent to your email.
                  </p>
                )}
                {trackingResult.status === 'rejected' && (
                  <p className="text-gray-300">
                    Unfortunately, your application was not approved at this time. You may reapply after addressing the feedback provided.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
