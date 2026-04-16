'use client'

import { uploadFileToSupabase } from '../../../lib/supabase'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CountryStateSelector from '@/components/CountryStateSelector'
import { validateFile } from '@/lib/supabase-storage'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Header from '@/components/Header'

interface LogisticsApplicationForm {
  companyName: string
  companyRegistrationNumber: string
  taxId: string
  contactPersonName: string
  contactEmail: string
  contactPhone: string
  companyWebsite: string
  headquartersAddress: string
  serviceAreas: string[] // Can be country codes (e.g., "NG") or state codes (e.g., "NG-LA")
  operatingHours: Record<string, { start: string; end: string }>
  vehicleFleet: Record<string, { count: number; photos: string[] }>
  totalRiders: number
  averageDailyDeliveries: number
  yearsInOperation: number
  insuranceCoverage: Record<string, any>
  serviceCategories: string[]
  companyLogo: File | null
  registrationDocuments: string[]
  insuranceDocuments: string[]
  fleetDocuments: string[]
}

export default function LogisticsPartnerApplication() {
  const router = useRouter()
  const [formData, setFormData] = useState<LogisticsApplicationForm>({
    companyName: '',
    companyRegistrationNumber: '',
    taxId: '',
    contactPersonName: '',
    contactEmail: '',
    contactPhone: '',
    companyWebsite: '',
    headquartersAddress: '',
    serviceAreas: [],
    operatingHours: {},
    vehicleFleet: {},
    totalRiders: 0,
    averageDailyDeliveries: 0,
    yearsInOperation: 0,
    insuranceCoverage: {},
    serviceCategories: [],
    companyLogo: null,
    registrationDocuments: [],
    insuranceDocuments: [],
    fleetDocuments: []
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Debug: Log errors state to verify it exists
  console.log('Errors state:', errors)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [trackingId, setTrackingId] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear document error when user selects files successfully
    if (field === 'registrationDocuments' || field === 'insuranceDocuments' || field === 'fleetDocuments') {
      if (errors?.documents) {
        setErrors((prev: Record<string, string>) => ({ ...prev, documents: '' }))
      }
    }
    if (errors?.[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Contact person name is required'
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) newErrors.contactEmail = 'Invalid email format'
    if (!formData.headquartersAddress.trim()) newErrors.headquartersAddress = 'Address is required'
    if (formData.serviceAreas.length === 0) newErrors.serviceAreas = 'At least one service area is required'
    if (Object.keys(formData.vehicleFleet).length === 0) newErrors.vehicleFleet = 'Vehicle fleet information is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Create FormData to include files
      const submitData = new FormData()
      
      // Map frontend field names to backend field names
      const fieldMapping = {
        companyName: 'company_name',
        companyRegistrationNumber: 'company_registration_number',
        taxId: 'tax_id',
        contactPersonName: 'contact_person_name',
        contactEmail: 'contact_email',
        contactPhone: 'contact_phone',
        companyWebsite: 'company_website',
        headquartersAddress: 'headquarters_address',
        serviceAreas: 'service_areas',
        operatingHours: 'operating_hours',
        vehicleFleet: 'vehicle_fleet',
        totalRiders: 'total_riders',
        averageDailyDeliveries: 'average_daily_deliveries',
        yearsInOperation: 'years_in_operation',
        insuranceCoverage: 'insurance_coverage',
        serviceCategories: 'service_categories',
        registrationDocuments: 'registration_document_urls',
        insuranceDocuments: 'insurance_document_urls',
        fleetDocuments: 'fleet_document_urls'
      }
      
      // Add all form fields with correct backend names
      Object.entries(fieldMapping).forEach(([frontendKey, backendKey]) => {
        const value = formData[frontendKey as keyof LogisticsApplicationForm]
        // Convert arrays and objects to JSON strings
        if (Array.isArray(value) || typeof value === 'object') {
          submitData.append(backendKey, JSON.stringify(value))
        } else {
          submitData.append(backendKey, String(value))
        }
      })
      
      // Add company logo if it exists
      if (formData.companyLogo) {
        submitData.append('companyLogo', formData.companyLogo)
      }
      
      // Documents are already uploaded to Supabase, just send the URLs
      if (formData.registrationDocuments && formData.registrationDocuments.length > 0) {
        submitData.append('registration_document_urls', JSON.stringify(formData.registrationDocuments))
      }
      if (formData.insuranceDocuments && formData.insuranceDocuments.length > 0) {
        submitData.append('insurance_document_urls', JSON.stringify(formData.insuranceDocuments))
      }
      if (formData.fleetDocuments && formData.fleetDocuments.length > 0) {
        submitData.append('fleet_document_urls', JSON.stringify(formData.fleetDocuments))
      }

      const response = await fetch('/api/logistics-partners/apply', {
        method: 'POST',
        body: submitData, // FormData instead of JSON
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        setTrackingId(result.trackingId)
        setIsSubmitted(true)
      } else {
        setErrors({ 
          submit: result.message || 'Failed to submit application. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Application submission error:', error)
      setErrors({ 
        submit: 'Network error. Please check your connection and try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return <ThankYouScreen trackingId={trackingId} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onDownloadClick={() => {}} />
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Become Our Logistics Partner
          </h1>
          <p className="text-xl text-emerald-100">
            Join our growing network and expand your delivery business
          </p>
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8">
        {/* Company Information Section */}
        <FormSection title="Company Information">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              label="Company Name *"
              value={formData.companyName}
              onChange={(value) => handleInputChange('companyName', value)}
              error={errors?.companyName}
              required
            />
            <FormField
              label="Contact Person Name *"
              value={formData.contactPersonName}
              onChange={(value) => handleInputChange('contactPersonName', value)}
              error={errors?.contactPersonName}
              required
            />
            <FormField
              label="Contact Email *"
              value={formData.contactEmail}
              onChange={(value) => handleInputChange('contactEmail', value)}
              error={errors?.contactEmail}
              type="email"
              required
            />
            <FormField
              label="Contact Phone"
              value={formData.contactPhone}
              onChange={(value) => handleInputChange('contactPhone', value)}
              type="tel"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <FormField
              label="Company Registration Number *"
              value={formData.companyRegistrationNumber}
              onChange={(value) => handleInputChange('companyRegistrationNumber', value)}
              error={errors?.companyRegistrationNumber}
              required
            />
            <FormField
              label="Tax ID *"
              value={formData.taxId}
              onChange={(value) => handleInputChange('taxId', value)}
              error={errors?.taxId}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <FormField
              label="Company Website"
              value={formData.companyWebsite}
              onChange={(value) => {
                // Auto-format URL if user doesn't include protocol
                if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                  handleInputChange('companyWebsite', `https://${value}`);
                } else {
                  handleInputChange('companyWebsite', value);
                }
              }}
              type="url"
              placeholder="yourcompany.com"
              helperText="Enter your company website (optional). We'll automatically add https:// if needed. Examples: fretiko.com, delivery.company.com"
              error={
                formData.companyWebsite && 
                formData.companyWebsite !== '' && 
                !formData.companyWebsite.match(/^https?:\/\/.+\..+/) 
                  ? 'Please enter a valid website URL'
                  : undefined
              }
            />
            <FormField
              label="Years in Operation"
              value={formData.yearsInOperation?.toString() || '0'}
              onChange={(value) => handleInputChange('yearsInOperation', parseInt(value) || 0)}
              type="number"
              min="0"
            />
          </div>

          <div className="mt-6">
            <FormField
              label="Headquarters Address *"
              value={formData.headquartersAddress}
              onChange={(value) => handleInputChange('headquartersAddress', value)}
              error={errors?.headquartersAddress}
              required
              textarea
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Logo
            </label>
            <div className="flex items-center space-x-4">
              {formData.companyLogo ? (
                <div className="relative">
                  <img 
                    src={URL.createObjectURL(formData.companyLogo)} 
                    alt="Company Logo" 
                    className="h-16 w-16 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('companyLogo', null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="h-16 w-16 border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Logo</span>
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
                      handleInputChange('companyLogo', file)
                    } else if (file) {
                      setErrors(prev => ({ ...prev, companyLogo: 'Logo must be less than 2MB' }))
                    }
                  }}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded cursor-pointer text-sm"
                >
                  Choose Logo
                </label>
                <p className="text-gray-400 text-xs mt-1">PNG, JPG, GIF up to 2MB</p>
              </div>
            </div>
          </div>
        </FormSection>

        {/* Service Areas Section */}
        <FormSection title="Service Areas">
          <CountryStateSelector
            selectedAreas={formData.serviceAreas}
            onChange={(areas) => handleInputChange('serviceAreas', areas)}
            error={errors?.serviceAreas}
          />
        </FormSection>

        {/* Fleet Information Section */}
        <FormSection title="Fleet Information">
          <VehicleFleetForm
            vehicleFleet={formData.vehicleFleet}
            onChange={(fleet) => handleInputChange('vehicleFleet', fleet)}
            error={errors?.vehicleFleet}
          />
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <FormField
              label="Total Riders"
              value={formData.totalRiders.toString()}
              onChange={(value) => handleInputChange('totalRiders', parseInt(value) || 0)}
              type="number"
              min="0"
            />
            <FormField
              label="Average Daily Deliveries"
              value={formData.averageDailyDeliveries.toString()}
              onChange={(value) => handleInputChange('averageDailyDeliveries', parseInt(value) || 0)}
              type="number"
              min="0"
            />
          </div>
        </FormSection>

        {/* Service Categories Section */}
        <FormSection title="Service Categories">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Select services you provide
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Intracity Delivery',
                'Intercity Delivery', 
                'Express Delivery',
                'Cargo/Freight',
                'Food Delivery',
                'Grocery Delivery',
                'Package Delivery',
                'Document Delivery'
              ].map(category => (
                <label key={category} className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.serviceCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('serviceCategories', [...formData.serviceCategories, category])
                      } else {
                        handleInputChange('serviceCategories', formData.serviceCategories.filter(c => c !== category))
                      }
                    }}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </FormSection>

        {/* Documents Section */}
        <FormSection title="Supporting Documents">
          <div className="space-y-6">
            <DocumentUpload
              title="Company Registration Documents"
              description="Upload business registration, tax clearance, etc."
              documents={formData.registrationDocuments}
              onChange={(docs) => handleInputChange('registrationDocuments', docs)}
              onFilesChange={(files) => setUploadedFiles(files)}
              documentType="registration"
              errors={errors}
              setErrors={setErrors}
            />
            <DocumentUpload
              title="Insurance Documents"
              description="Upload vehicle insurance, liability insurance, etc."
              documents={formData.insuranceDocuments}
              onChange={(docs) => handleInputChange('insuranceDocuments', docs)}
              onFilesChange={(files) => setUploadedFiles(files)}
              documentType="insurance"
              errors={errors}
              setErrors={setErrors}
            />
            <DocumentUpload
              title="Fleet Documents"
              description="Upload vehicle registration, fleet photos, etc."
              documents={formData.fleetDocuments}
              onChange={(docs) => handleInputChange('fleetDocuments', docs)}
              onFilesChange={(files) => setUploadedFiles(files)}
              documentType="fleet"
              errors={errors}
              setErrors={setErrors}
            />
          </div>
        </FormSection>

        {/* Error Display */}
        {errors?.submit && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center gap-2">
            {isSubmitting && <LoadingSpinner size="sm" />}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
      </form>
    </div>
  )
}

interface FormFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  placeholder?: string
  required?: boolean
  textarea?: boolean
  min?: string
  helperText?: string
}

function FormField({ label, value, onChange, error, type = 'text', placeholder, required, textarea, min, helperText }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      )}
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      {helperText && <p className="text-gray-400 text-xs mt-1">{helperText}</p>}
    </div>
  )
}

interface FormSectionProps {
  title: string
  children: React.ReactNode
}

function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">{title}</h2>
      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
        {children}
      </div>
    </div>
  )
}

interface VehicleFleetFormProps {
  vehicleFleet: Record<string, { count: number; photos: string[] }>
  onChange: (fleet: Record<string, { count: number; photos: string[] }>) => void
  error?: string
}

function VehicleFleetForm({ vehicleFleet, onChange, error }: VehicleFleetFormProps) {
  const vehicleTypes = [
    { type: 'wheelbarrow', label: 'Wheelbarrow', icon: '🛒' },
    { type: 'bike', label: 'Bicycle', icon: '🚴' },
    { type: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
    { type: 'car', label: 'Car', icon: '🚗' },
    { type: 'van', label: 'Van', icon: '🚐' },
    { type: 'truck', label: 'Truck', icon: '🚚' }
  ]

  const handleVehicleChange = (vehicleType: string, count: number) => {
    const newFleet = { ...vehicleFleet }
    if (count > 0) {
      newFleet[vehicleType] = { count, photos: newFleet[vehicleType]?.photos || [] }
    } else {
      delete newFleet[vehicleType]
    }
    onChange(newFleet)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-4">
        Vehicle Fleet *
      </label>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicleTypes.map(({ type, label, icon }) => (
          <div key={type} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{icon}</span>
              <span className="font-medium">{label}</span>
            </div>
            <input
              type="number"
              min="0"
              value={vehicleFleet[type]?.count || 0}
              onChange={(e) => handleVehicleChange(type, parseInt(e.target.value) || 0)}
              placeholder="Number of vehicles"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  )
}

interface DocumentUploadProps {
  title: string
  description: string
  documents: string[]
  onChange: (docs: string[]) => void
  onFilesChange: (files: File[]) => void
  documentType: 'registration' | 'insurance' | 'fleet'
  errors?: Record<string, string>
  setErrors?: (errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void
}

function DocumentUpload({ title, description, documents, onChange, onFilesChange, documentType, errors, setErrors }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    
    try {
      // Validate files
      const validationResults: { valid: boolean; error?: string }[] = []
      for (let i = 0; i < files.length; i++) {
        const result = validateFile(files[i], {
          maxSizeMB: 10,
          allowedTypes: [
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]
        })
        validationResults.push(result)
      }

      const invalidFiles = validationResults.filter(result => !result.valid)
      if (invalidFiles.length > 0) {
        alert(`Invalid files: ${invalidFiles.map(f => f.error).join(', ')}`)
        setIsUploading(false)
        return
      }

      // Upload files directly to Supabase
      const uploadedUrls: string[] = []
      const newFiles = [...uploadedFiles, ...Array.from(files)]
      setUploadedFiles(newFiles)
      onFilesChange(newFiles) // Pass files to parent
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
          const folder = `${documentType}-documents`
          const url = await uploadFileToSupabase(file, 'partnership-documents', folder)
          uploadedUrls.push(url)
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error)
          throw new Error(`Failed to upload ${file.name}: ${error}`)
        }
      }
      
      // Add new Supabase URLs to existing documents
      const newDocs = [...documents, ...uploadedUrls]
      onChange(newDocs)
      
      // Show success message instead of alert
      if (files.length > 0 && setErrors) {
        setErrors((prev: Record<string, string>) => ({ 
          ...prev, 
          documents: `${files.length} file(s) selected and ready for upload.` 
        }))
      }
    } catch (error) {
      console.error('File selection error:', error)
      if (setErrors) {
        setErrors((prev: Record<string, string>) => ({ 
          ...prev, 
          documents: 'File selection failed. Please try again.' 
        }))
      }
    } finally {
      setIsUploading(false)
    }
  }

  const removeDocument = (index: number) => {
    onChange(documents.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      <div className="space-y-3">
        {/* Upload Button */}
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id={`file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`}
          />
          <label
            htmlFor={`file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="cursor-pointer"
          >
            <div className="text-emerald-400 text-sm font-medium flex items-center gap-2">
              {isUploading && <LoadingSpinner size="sm" />}
              {isUploading ? 'Uploading...' : 'Click to upload documents'}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              PDF, JPG, PNG up to 10MB each
            </div>
          </label>
        </div>

        {/* Error Display */}
        {errors?.documents && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {errors.documents}
          </div>
        )}

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
                <span className="text-sm text-gray-300">{doc}</span>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface ThankYouScreenProps {
  trackingId: string | null
}

function ThankYouScreen({ trackingId }: ThankYouScreenProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">
          Application Submitted Successfully!
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Thank you for your interest in partnering with Fretiko. Our team will review your application and get back to you within 3-5 business days.
        </p>
        
        {trackingId && (
          <div className="bg-emerald-900/50 border border-emerald-500 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-2">Your Tracking ID</h3>
            <div className="text-2xl font-bold text-emerald-400">{trackingId}</div>
            <p className="text-sm text-gray-300 mt-2">
              Save this ID to track your application status
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/partnership/track'}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Track Application Status
          </button>
          <div>
            <button
              onClick={() => window.location.href = '/partnership'}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Partnership Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
