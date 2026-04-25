'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { MapPin, Briefcase, DollarSign, Users, Clock, Send, Building, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'

interface JobListing {
  id: string
  title: string
  description: string
  requirements: string[]
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  department: string
  salary: string
  publishedAt: string
  status: 'draft' | 'published'
}

const MAX_TEXT_LENGTH = 1000

interface JobApplicationForm {
  jobId: string
  jobTitle: string
  name: string
  email: string
  phone: string
  experience: string
  education: string
  portfolio: string
  coverLetter: string
  resume: File | null
}

export default function CareersPage() {
  const { addToast } = useToast()
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)
  const [applicationForm, setApplicationForm] = useState<JobApplicationForm>({
    jobId: '',
    jobTitle: '',
    name: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    portfolio: '',
    coverLetter: '',
    resume: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch real job listings from API
        const response = await fetch('/api/careers/jobs')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`)
        }

        const result = await response.json()
        
        if (result.success) {
          setJobs(result.jobs || [])
        } else {
          console.error('API returned error:', result.error)
          setJobs([])
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleApplyForJob = (job: JobListing) => {
    setSelectedJob(job)
    setApplicationForm({
      ...applicationForm,
      jobId: job.id,
      jobTitle: job.title
    })
    setShowApplicationForm(true)
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!applicationForm.name || !applicationForm.email || !applicationForm.phone) {
      alert('Please fill in all required fields')
      return
    }
    
    // Check character limits
    if (applicationForm.coverLetter.length > MAX_TEXT_LENGTH) {
      alert(`Cover letter is too long. Please keep it under ${MAX_TEXT_LENGTH} characters.`)
      return
    }
    if (applicationForm.experience.length > MAX_TEXT_LENGTH) {
      alert(`Experience description is too long. Please keep it under ${MAX_TEXT_LENGTH} characters.`)
      return
    }
    if (applicationForm.education.length > MAX_TEXT_LENGTH) {
      alert(`Education description is too long. Please keep it under ${MAX_TEXT_LENGTH} characters.`)
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('jobId', applicationForm.jobId)
      formData.append('jobTitle', applicationForm.jobTitle)
      formData.append('name', applicationForm.name)
      formData.append('email', applicationForm.email)
      formData.append('phone', applicationForm.phone)
      formData.append('experience', applicationForm.experience)
      formData.append('education', applicationForm.education)
      formData.append('portfolio', applicationForm.portfolio)
      formData.append('coverLetter', applicationForm.coverLetter)
      
      // Add resume file if provided
      if (applicationForm.resume) {
        formData.append('resume', applicationForm.resume)
      }
      
      // Submit to backend API
      const response = await fetch('/api/careers/applications', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }
      
      addToast({
        title: 'Application Submitted',
        description: 'Your application has been submitted successfully! We will contact you soon.',
        type: 'success'
      })
      setShowApplicationForm(false)
      setApplicationForm({
        jobId: '',
        jobTitle: '',
        name: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
        portfolio: '',
        coverLetter: '',
        resume: null
      })
      setSelectedJob(null)
    } catch (error) {
      console.error('Failed to submit application:', error)
      addToast({
        title: 'Application Failed',
        description: 'Failed to submit application. Please try again.',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-600'
      case 'part-time': return 'bg-blue-600'
      case 'contract': return 'bg-purple-600'
      case 'internship': return 'bg-orange-600'
      default: return 'bg-gray-600'
    }
  }

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
            Join Our Team
          </h1>
          <p className="text-xl text-emerald-100 mb-8">
            Help us shape the future of Commerce
          </p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-emerald-200">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">40+</div>
              <div className="text-emerald-200">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-emerald-200">Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
          <p className="text-gray-400 text-lg">
            Find your opportunity to make an impact
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {jobs.map((job) => (
            <Card key={job.id} className="bg-gray-900 border-gray-800 hover:border-emerald-500 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-2xl text-white mb-2">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Badge className={`${getJobTypeColor(job.type)} text-white`}>
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {job.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <span className="text-emerald-400 mr-2">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Department</h4>
                    <p className="text-gray-300">{job.department}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Salary</h4>
                    <p className="text-gray-300">{job.salary}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Posted {new Date(job.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <Button 
                    onClick={() => handleApplyForJob(job)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedJob && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Apply for {selectedJob.title}
                </h2>
                <p className="text-gray-400">
                  {selectedJob.location} • {selectedJob.type}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-400 border-gray-600 hover:text-white"
              >
                ×
              </Button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <Input
                    value={applicationForm.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={applicationForm.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={applicationForm.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                    placeholder="+234 123 456 7890"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resume/CV *
                  </label>
                  <Input
                    type="file"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplicationForm({ ...applicationForm, resume: e.target.files?.[0] || null })}
                    accept=".pdf,.doc,.docx"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Professional Experience
                  </label>
                  <span className={`text-xs ${
                    applicationForm.experience.length > MAX_TEXT_LENGTH * 0.9
                      ? applicationForm.experience.length >= MAX_TEXT_LENGTH
                        ? 'text-red-400 font-medium'
                        : 'text-yellow-400'
                      : 'text-gray-400'
                  }`}>
                    {applicationForm.experience.length}/{MAX_TEXT_LENGTH}
                  </span>
                </div>
                <Textarea
                  value={applicationForm.experience}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    if (e.target.value.length <= MAX_TEXT_LENGTH) {
                      setApplicationForm({ ...applicationForm, experience: e.target.value })
                    }
                  }}
                  placeholder="Tell us about your relevant experience..."
                  rows={4}
                  maxLength={MAX_TEXT_LENGTH}
                  className={`bg-gray-800 text-white ${
                    applicationForm.experience.length >= MAX_TEXT_LENGTH
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-700'
                  }`}
                />
                {applicationForm.experience.length >= MAX_TEXT_LENGTH && (
                  <p className="text-xs text-red-400 mt-1">Maximum character limit reached.</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Education
                  </label>
                  <span className={`text-xs ${
                    applicationForm.education.length > MAX_TEXT_LENGTH * 0.9
                      ? applicationForm.education.length >= MAX_TEXT_LENGTH
                        ? 'text-red-400 font-medium'
                        : 'text-yellow-400'
                      : 'text-gray-400'
                  }`}>
                    {applicationForm.education.length}/{MAX_TEXT_LENGTH}
                  </span>
                </div>
                <Textarea
                  value={applicationForm.education}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    if (e.target.value.length <= MAX_TEXT_LENGTH) {
                      setApplicationForm({ ...applicationForm, education: e.target.value })
                    }
                  }}
                  placeholder="Your educational background..."
                  rows={3}
                  maxLength={MAX_TEXT_LENGTH}
                  className={`bg-gray-800 text-white ${
                    applicationForm.education.length >= MAX_TEXT_LENGTH
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-700'
                  }`}
                />
                {applicationForm.education.length >= MAX_TEXT_LENGTH && (
                  <p className="text-xs text-red-400 mt-1">Maximum character limit reached.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Portfolio/Website
                </label>
                <Input
                  value={applicationForm.portfolio}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplicationForm({ ...applicationForm, portfolio: e.target.value })}
                  placeholder="https://your-portfolio.com"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Cover Letter *
                  </label>
                  <span className={`text-xs ${
                    applicationForm.coverLetter.length > MAX_TEXT_LENGTH * 0.9
                      ? applicationForm.coverLetter.length >= MAX_TEXT_LENGTH
                        ? 'text-red-400 font-medium'
                        : 'text-yellow-400'
                      : 'text-gray-400'
                  }`}>
                    {applicationForm.coverLetter.length}/{MAX_TEXT_LENGTH}
                  </span>
                </div>
                <Textarea
                  value={applicationForm.coverLetter}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    if (e.target.value.length <= MAX_TEXT_LENGTH) {
                      setApplicationForm({ ...applicationForm, coverLetter: e.target.value })
                    }
                  }}
                  placeholder="Why are you interested in this position and why would you be a great fit?"
                  rows={6}
                  required
                  maxLength={MAX_TEXT_LENGTH}
                  className={`bg-gray-800 text-white ${
                    applicationForm.coverLetter.length >= MAX_TEXT_LENGTH
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-700'
                  }`}
                />
                {applicationForm.coverLetter.length >= MAX_TEXT_LENGTH && (
                  <p className="text-xs text-red-400 mt-1">Maximum character limit reached.</p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApplicationForm(false)}
                  className="border-gray-600 text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Why Work With Us */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work at Fretiko?</h2>
            <p className="text-gray-400 text-lg">
              Join a team that's transforming logistics across Africa
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-emerald-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Make an Impact</h3>
              <p className="text-gray-300">
                Help thousands of businesses grow and succeed with better logistics solutions
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow With Us</h3>
              <p className="text-gray-300">
                Work with talented people and advance your career in a fast-growing startup
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Competitive Benefits</h3>
              <p className="text-gray-300">
                Enjoy competitive salary, equity, flexible work, and comprehensive benefits
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
