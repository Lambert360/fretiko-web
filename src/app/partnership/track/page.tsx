'use client'

import { useState } from 'react'

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'in_progress':
      return {
        icon: '⏳',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-900/50',
        borderColor: 'border-yellow-500',
        title: 'Application In Progress',
        description: 'Your application is currently being reviewed by our team'
      }
    case 'under_review':
      return {
        icon: '👀',
        color: 'text-blue-400',
        bgColor: 'bg-blue-900/50',
        borderColor: 'border-blue-500',
        title: 'Under Review',
        description: 'Our team is actively reviewing your application'
      }
    case 'verified':
      return {
        icon: '✅',
        color: 'text-green-400',
        bgColor: 'bg-green-900/50',
        borderColor: 'border-green-500',
        title: 'Application Approved',
        description: 'Congratulations! Your application has been approved'
      }
    case 'rejected':
      return {
        icon: '❌',
        color: 'text-red-400',
        bgColor: 'bg-red-900/50',
        borderColor: 'border-red-500',
        title: 'Application Rejected',
        description: 'Your application was not approved'
      }
    default:
      return {
        icon: '❓',
        color: 'text-gray-400',
        bgColor: 'bg-gray-900/50',
        borderColor: 'border-gray-500',
        title: 'Unknown Status',
        description: 'Unable to determine application status'
      }
  }
}

export default function TrackApplication() {
  const [trackingId, setTrackingId] = useState('')
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/logistics-partners/track/${trackingId}`)
      const data = await response.json()

      if (data.success) {
        setApplication(data.application)
        setSearched(true)
      } else {
        setError(data.message || 'Application not found')
        setApplication(null)
      }
    } catch (error) {
      setError('Network error. Please try again.')
      setApplication(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Track Your Application
          </h1>
          <p className="text-xl text-emerald-100">
            Enter your tracking ID to check your application status
          </p>
        </div>
      </div>

      {/* Tracking Section */}
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter your tracking ID (e.g., FP123456)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {searched && !application && !error && (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-4">🔍</div>
              <p>No application found with this tracking ID.</p>
              <p className="text-sm mt-2">Please check your tracking ID and try again.</p>
            </div>
          )}
        </div>

        {/* Application Status Display */}
        {application && (
          <div className="mt-8">
            <ApplicationStatusCard application={application} />
          </div>
        )}

        {/* Help Section */}
        {!searched && (
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                If you're having trouble tracking your application or have questions, 
                please contact our partnership team.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> partnerships@fretiko.com</p>
                <p><strong>Phone:</strong> +234 123 456 7890</p>
                <p><strong>Hours:</strong> Monday - Friday, 9AM - 5PM WAT</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ApplicationStatusCardProps {
  application: any
}

function ApplicationStatusCard({ application }: ApplicationStatusCardProps) {
  const statusConfig = getStatusConfig(application.status)
  const submittedDate = new Date(application.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className={`${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-xl p-6`}>
        <div className="text-center">
          <div className="text-5xl mb-4">{statusConfig.icon}</div>
          <h2 className={`text-2xl font-bold mb-2 ${statusConfig.color}`}>
            {statusConfig.title}
          </h2>
          <p className="text-gray-300">{statusConfig.description}</p>
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Application Details</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400">Company Name</span>
            <span className="font-medium">{application.company_name}</span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400">Tracking ID</span>
            <span className="font-mono font-medium">{application.tracking_id}</span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400">Contact Email</span>
            <span className="font-medium">{application.contact_email}</span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400">Submitted Date</span>
            <span className="font-medium">{submittedDate}</span>
          </div>

          {application.reviewed_at && (
            <div className="flex justify-between py-3 border-b border-gray-800">
              <span className="text-gray-400">Last Reviewed</span>
              <span className="font-medium">
                {new Date(application.reviewed_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}

          {application.rejection_reason && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-red-400 mb-2">Rejection Reason</h4>
              <p className="text-gray-300">{application.rejection_reason}</p>
            </div>
          )}

          {application.admin_notes && (
            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-400 mb-2">Admin Notes</h4>
              <p className="text-gray-300">{application.admin_notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <NextStepsSection status={application.status} />
    </div>
  )
}

interface NextStepsSectionProps {
  status: string
}

function NextStepsSection({ status }: NextStepsSectionProps) {
  const getNextSteps = (status: string) => {
    switch (status) {
      case 'in_progress':
      case 'under_review':
        return {
          title: 'What happens next?',
          steps: [
            'Our team will review your application within 3-5 business days',
            'We may contact you for additional information',
            'You will receive an email notification when there\'s an update',
            'Check back here for the latest status'
          ]
        }
      case 'verified':
        return {
          title: 'Congratulations! Next Steps:',
          steps: [
            'Check your email for the approval notification',
            'Your partner dashboard will be available within 24 hours',
            'Start onboarding your riders through the mobile app',
            'Begin receiving delivery requests in your service areas'
          ]
        }
      case 'rejected':
        return {
          title: 'What you can do:',
          steps: [
            'Review the rejection reason provided',
            'Address the mentioned issues in your application',
            'Consider reapplying after making improvements',
            'Contact us if you need clarification on the rejection'
          ]
        }
      default:
        return {
          title: 'Next Steps',
          steps: ['Contact our support team for assistance']
        }
    }
  }

  const nextSteps = getNextSteps(status)

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4">{nextSteps.title}</h3>
      <ul className="space-y-3">
        {nextSteps.steps.map((step, index) => (
          <li key={index} className="flex items-start">
            <span className="text-emerald-400 mr-3 mt-1">•</span>
            <span className="text-gray-300">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
