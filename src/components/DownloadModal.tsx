'use client'

import { useState } from 'react'

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    if (value && !validateEmail(value)) {
      setError('Please enter a valid email address')
    } else {
      setError('')
    }
  }

  const handleDownload = async () => {
    if (validateEmail(email)) {
      setIsConfirming(true)
    }
  }

  const handleConfirmDownload = async () => {
    try {
      // Store email and send welcome message
      const response = await fetch('/api/collect-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Direct APK download
        const link = document.createElement('a')
        link.href = 'https://github.com/Lambert360/app-releases/releases/download/v0.1.0/Fretiko.apk'
        link.download = 'fretiko.apk'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        onClose()
        setEmail('')
        setIsConfirming(false)
      } else {
        setError(result.error || 'Something went wrong')
        setIsConfirming(false)
      }
    } catch (error) {
      console.error('Download error:', error)
      setError('Failed to process. Please try again.')
      setIsConfirming(false)
    }
  }

  const handleCancel = () => {
    setIsConfirming(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-black text-xl font-bold">Download Fretiko</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isConfirming ? (
          <div className="space-y-5">
            {/* Store badges — primary */}
            <div>
              <p className="text-gray-500 text-sm mb-3">Get the app from your store</p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.kinging.fretikomobile"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex items-center gap-4 bg-black hover:bg-gray-900 rounded-xl px-5 py-3.5 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none">
                    <path d="M3.18 23.76a2 2 0 0 0 2.09-.13L18 16l-3.35-3.35L3.18 23.76Z" fill="#34A853"/>
                    <path d="M21.54 10.27a2 2 0 0 0 0-3.48L18.71 5.3 15.05 9l3.66 3.66 2.83-1.39Z" fill="#FBBC04"/>
                    <path d="M3.18.24A2 2 0 0 0 2 2.06v19.88a2 2 0 0 0 1.18 1.82L15.05 12 3.18.24Z" fill="#4285F4"/>
                    <path d="M15.05 12 3.18.24a2 2 0 0 1 2.09-.13L18.71 5.3 15.05 12Z" fill="#EA4335"/>
                    <path d="M18.71 18.7 5.27 23.63a2 2 0 0 1-2.09-.13L15.05 12l3.66 3.66Z" fill="#EA4335"/>
                  </svg>
                  <div>
                    <p className="text-white/60 text-[10px] leading-none uppercase tracking-widest">Get it on</p>
                    <p className="text-white text-base font-semibold leading-tight mt-0.5">Google Play</p>
                  </div>
                </a>

                <a
                  href="https://apps.apple.com/no/app/fretiko/id6766225628?l=nb"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex items-center gap-4 bg-black hover:bg-gray-900 rounded-xl px-5 py-3.5 transition-colors"
                >
                  <svg viewBox="0 0 814 1000" className="w-6 h-7 shrink-0" fill="white">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-47.4-148.2-106.6zM500.2 181c-34.1 3.7-82.5 28.3-100.2 55.2-14.8 23.1-26.1 58.2-21.5 88.1 4.6 2.1 9.4 3.2 14.3 3.2 31.5 0 75.5-24.5 91.3-50.1 13.9-22.7 21.1-56.4 16.1-96.4z"/>
                  </svg>
                  <div>
                    <p className="text-white/60 text-[10px] leading-none uppercase tracking-widest">Download on the</p>
                    <p className="text-white text-base font-semibold leading-tight mt-0.5">App Store</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs">or download APK directly</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* APK download — secondary */}
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email for APK download"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black text-sm"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleDownload}
                disabled={!email || !!error}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors font-semibold text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download APK
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>

            <h4 className="text-xl font-semibold text-gray-900">Confirm APK Download</h4>

            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-600 mb-2"><strong>Email:</strong> {email}</p>
              <p className="text-sm text-gray-600">
                You&apos;ll receive a welcome email and the Fretiko APK will download immediately.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Confirm Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
