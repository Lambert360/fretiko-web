'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { uploadFileToSupabase } from '@/lib/supabase'
import CountryStateSelector from '@/components/CountryStateSelector'
import { Country, State } from 'country-state-city'
import { useToast } from '@/components/ui/toast'

interface PartnerData {
  id: string
  company_name: string
  partner_username: string
  contact_email: string
  contact_phone?: string
  company_website?: string
  headquarters_address?: string
  company_logo_url?: string
  service_areas: string[]
  service_categories?: string[]
  vehicle_fleet?: Record<string, { count: number; photos?: string[] }>
  registration_document_urls?: string[]
  insurance_document_urls?: string[]
  fleet_document_urls?: string[]
  partner_status: string
  verified_at: string
  preferred_currency?: string
  pricing_config?: Record<string, { base_price: number; per_km_rate: number }>
}

interface InterstateConfig {
  enabled: boolean
  basePrice: number
  perKmRate: number
  internationalBasePrice: number
  internationalPerKmRate: number
  estimatedDeliveryDaysMin: number
  estimatedDeliveryDaysMax: number
  internationalEnabled: boolean
  serviceAreas: string[]
}

interface InterstateOrder {
  id: string
  orderNumber: string
  status: string
  interstateStatus: 'pending_partner_acceptance' | 'accepted' | 'rejected' | 'in_transit' | 'delivered'
  isInternational?: boolean
  metadata?: { interstate_delivery?: { isInternational?: boolean } }
  totalAmount: number
  deliveryFee: number
  deliveryAddress?: { fullName?: string; city?: string; state?: string; country?: string; address?: string }
  deliveryInstructions?: string
  estimatedDeliveryDays?: number
  createdAt: string
  pickupPin?: string
  items?: Array<{
    id: string
    product_id?: string
    product_name?: string
    quantity?: number
    unit_price?: number
    total_price?: number
    product_image_url?: string | null
  }>
  buyer?: {
    id?: string
    name?: string
    phone?: string | null
    email?: string | null
    avatarUrl?: string | null
    location?: { address?: string; city?: string; state?: string; country?: string } | null
  }
  vendor?: {
    id?: string
    name?: string
    phone?: string | null
    email?: string | null
    avatarUrl?: string | null
    location?: { address?: string; city?: string; state?: string; country?: string } | null
  }
}

const VEHICLE_TYPES = [
  { value: 'wheelbarrow', label: 'Wheelbarrow' },
  { value: 'bike', label: 'Bike / Bicycle' },
  { value: 'car', label: 'Car' },
  { value: 'van', label: 'Van' },
  { value: 'truck', label: 'Truck' },
]

interface RiderActivity {
  id: string
  full_name: string
  vehicle_type: string
  status: string
  city?: string
  country?: string
  created_at: string
  updated_at: string
}

interface RiderData {
  id: string
  unique_rider_id?: string
  full_name: string
  country?: string
  state?: string
  vehicle_type: string
  verification_status: string
  driver_license_url?: string
  total_deliveries: number
  completed_deliveries: number
  customer_rating: number
  on_time_rate: number
  claimed_at?: string
  verified_at?: string
  created_at: string
}

interface DashboardData {
  partner: PartnerData
  statistics: {
    totalRiders: number
    activeRiders: number
    totalDeliveries: number
    completedDeliveries: number
    averageDeliveryTime: number
    onTimeDeliveryRate: number
    totalRevenue: number
    platformCommission: number
  }
  recentActivity: RiderActivity[]
  performanceMetrics: {
    totalDeliveries: number
    completedDeliveries: number
    averageRating: number
    onTimeRate: number
  }
}

export default function PartnerDashboard() {
  const router = useRouter()
  const { addToast } = useToast()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [ridersData, setRidersData] = useState<RiderData[]>([])
  const [ridersLoading, setRidersLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  const [pricingForm, setPricingForm] = useState<Record<string, { base_price: string; per_km_rate: string }>>({})
  const [pricingLoading, setPricingLoading] = useState(false)
  const [pricingError, setPricingError] = useState('')
  const [pricingSuccess, setPricingSuccess] = useState('')
  const [pricingExchangeRate, setPricingExchangeRate] = useState<number | null>(null)
  const [pricingRateLoading, setPricingRateLoading] = useState(false)
  const [pricingRateError, setPricingRateError] = useState('')

  const [interstateConfig, setInterstateConfig] = useState<InterstateConfig | null>(null)
  const [interstateConfigLoading, setInterstateConfigLoading] = useState(false)
  const [interstateConfigForm, setInterstateConfigForm] = useState({
    enabled: false, internationalEnabled: false,
    basePrice: '', perKmRate: '',
    internationalBasePrice: '', internationalPerKmRate: '',
    estimatedDeliveryDaysMin: '2', estimatedDeliveryDaysMax: '5',
  })
  const [interstateConfigSaving, setInterstateConfigSaving] = useState(false)
  const [interstateConfigError, setInterstateConfigError] = useState('')
  const [interstateConfigSuccess, setInterstateConfigSuccess] = useState('')

  const [interstateOrders, setInterstateOrders] = useState<InterstateOrder[]>([])
  const [interstateOrdersLoading, setInterstateOrdersLoading] = useState(false)
  const [interstateOrdersFilter, setInterstateOrdersFilter] = useState<'all' | 'interstate' | 'international'>('all')
  const [interstateActionLoadingId, setInterstateActionLoadingId] = useState<string | null>(null)
  const [interstateDetailOrder, setInterstateDetailOrder] = useState<InterstateOrder | null>(null)
  const [interstateImagePreviewUrl, setInterstateImagePreviewUrl] = useState<string | null>(null)

  const [walletData, setWalletData] = useState<any>(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const [bankAccounts, setBankAccounts] = useState<any[]>([])
  const [showAddBank, setShowAddBank] = useState(false)
  const [bankForm, setBankForm] = useState({ accountName: '', bankName: '', accountNumber: '', bankCode: '', accountType: 'savings', currency: 'NGN', country: 'NG', isDefault: false })
  const [bankFormLoading, setBankFormLoading] = useState(false)
  const [bankFormError, setBankFormError] = useState('')
  const [bankList, setBankList] = useState<{ code: string; name: string }[]>([])
  const [bankListLoading, setBankListLoading] = useState(false)
  const [bankSearchQuery, setBankSearchQuery] = useState('')
  const [verifiedAccountPreview, setVerifiedAccountPreview] = useState<{ accountName: string; accountNumber: string; bankCode: string } | null>(null)
  const [bankVerifyLoading, setBankVerifyLoading] = useState(false)
  const [bankVerifyError, setBankVerifyError] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawBankId, setWithdrawBankId] = useState('')
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [withdrawMessage, setWithdrawMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [confirmModal, setConfirmModal] = useState<{ riderId: string; riderName: string; action: 'terminate' | 'suspend' } | null>(null)

  const [showAddRider, setShowAddRider] = useState(false)
  const [addRiderLoading, setAddRiderLoading] = useState(false)
  const [addRiderError, setAddRiderError] = useState('')
  const [addRiderSuccess, setAddRiderSuccess] = useState('')
  const [lastCreatedRiderId, setLastCreatedRiderId] = useState<string | null>(null)
  const [riderForm, setRiderForm] = useState({
    full_name: '', country: '', state: '', city: '',
    vehicle_type: '', vehicle_make: '', vehicle_model: '',
    vehicle_year: '', license_plate: '', years_experience: ''
  })
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [licensePreview, setLicensePreview] = useState<string | null>(null)

  const [editingProfile, setEditingProfile] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileForm, setProfileForm] = useState<{
    contactEmail: string; contactPhone: string; companyWebsite: string;
    headquartersAddress: string; preferredCurrency: string;
    serviceAreas: string[]; serviceCategories: string[];
    vehicleFleet: Record<string, number>;
    companyLogoUrl: string;
    registrationDocUrls: string[]; insuranceDocUrls: string[]; fleetDocUrls: string[];
  }>({
    contactEmail: '', contactPhone: '', companyWebsite: '',
    headquartersAddress: '', preferredCurrency: 'NGN',
    serviceAreas: [], serviceCategories: [],
    vehicleFleet: {}, companyLogoUrl: '',
    registrationDocUrls: [], insuranceDocUrls: [], fleetDocUrls: [],
  })
  const [profileLogoFile, setProfileLogoFile] = useState<File | null>(null)
  const [profileLogoPreview, setProfileLogoPreview] = useState<string | null>(null)
  const [profileDocUploading, setProfileDocUploading] = useState<string | null>(null)

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    if (activeTab === 'riders' && ridersData.length === 0) {
      fetchRidersData(token)
    }
    if (activeTab === 'analytics' && !analyticsData) {
      fetchAnalyticsData(token)
    }
    if (activeTab === 'finance' && !walletData) {
      fetchWalletData()
    }
    if (activeTab === 'pricing' && pricingExchangeRate === null && !pricingRateLoading && dashboardData) {
      fetchPricingExchangeRate(dashboardData.partner.preferred_currency || 'NGN')
    }
    if (activeTab === 'interstate-config' && !interstateConfig) {
      fetchInterstateConfig(token)
    }
    if (activeTab === 'interstate-config' && pricingExchangeRate === null && !pricingRateLoading && dashboardData) {
      fetchPricingExchangeRate(dashboardData.partner.preferred_currency || 'NGN')
    }
    if (activeTab === 'interstate-orders') {
      fetchInterstateOrders(token)
    }
  }, [activeTab])

  // Re-initialise the pricing form with local-currency values once the exchange rate is available
  useEffect(() => {
    if (pricingExchangeRate !== null && dashboardData?.partner?.pricing_config) {
      initPricingForm(dashboardData.partner.pricing_config, pricingExchangeRate)
    }
  }, [pricingExchangeRate])

  // Re-initialise the interstate config form with local-currency values once the exchange rate is available
  useEffect(() => {
    if (interstateConfig) {
      initInterstateConfigForm(interstateConfig, pricingExchangeRate)
    }
  }, [pricingExchangeRate, interstateConfig])

  const fetchWalletData = async () => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    setWalletLoading(true)
    try {
      const [walletRes, bankRes] = await Promise.all([
        fetch('/api/partners/wallet', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/partners/wallet/bank-accounts', { headers: { 'Authorization': `Bearer ${token}` } }),
      ])
      const walletJson = await walletRes.json()
      const bankJson = await bankRes.json()
      if (walletJson.success) setWalletData(walletJson.data)
      if (bankJson.success) setBankAccounts(bankJson.data || [])
    } catch { /* ignore */ } finally {
      setWalletLoading(false)
    }
  }

  const CURRENCY_RATES_FROM_NGN: Record<string, number> = {
    NGN: 1, USD: 0.00063, GBP: 0.00050, EUR: 0.00058, GHS: 0.0091,
    KES: 0.082, ZAR: 0.012, EGP: 0.031, TZS: 1.65, UGX: 2.37,
    RWF: 0.84, XOF: 0.38, XAF: 0.38, CAD: 0.00086, AUD: 0.00097,
    INR: 0.053, AED: 0.0023, ZMW: 0.016, MZN: 0.040,
  }

  const convertFromNGN = (amount: number, toCurrency: string): number => {
    const rate = CURRENCY_RATES_FROM_NGN[toCurrency] ?? 1
    return amount * rate
  }

  const displayCurrency = dashboardData?.partner?.preferred_currency || walletData?.wallet?.preferredCurrency || 'NGN'
  const walletBaseCurrency = walletData?.wallet?.preferredCurrency || 'NGN'
  const needsConversion = displayCurrency !== walletBaseCurrency && walletBaseCurrency === 'NGN'

  const displayAmount = (amountNGN: number): string => {
    const converted = needsConversion ? convertFromNGN(amountNGN, displayCurrency) : amountNGN
    return converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const SUPPORTED_BANK_COUNTRIES = [
    { code: 'NG', name: 'Nigeria', currency: 'NGN' },
    { code: 'GH', name: 'Ghana', currency: 'GHS' },
    { code: 'KE', name: 'Kenya', currency: 'KES' },
    { code: 'UG', name: 'Uganda', currency: 'UGX' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF' },
    { code: 'ZM', name: 'Zambia', currency: 'ZMW' },
    { code: 'MZ', name: 'Mozambique', currency: 'MZN' },
  ]

  const filteredBankList = bankList.filter(b => b.name.toLowerCase().includes(bankSearchQuery.toLowerCase()))

  const fetchBankList = async (country: string) => {
    setBankListLoading(true)
    setBankList([])
    setBankSearchQuery('')
    try {
      const res = await fetch(`/api/partners/wallet/banks/${country}`)
      const json = await res.json()
      if (json.status === 'success') setBankList(json.data || [])
    } catch { /* ignore */ } finally { setBankListLoading(false) }
  }

  const handleBankCountryChange = (countryCode: string) => {
    const selected = SUPPORTED_BANK_COUNTRIES.find(c => c.code === countryCode)
    setBankForm(prev => ({ ...prev, country: countryCode, currency: selected?.currency || 'NGN', bankCode: '', bankName: '', accountName: '' }))
    setBankSearchQuery('')
    setVerifiedAccountPreview(null)
    setBankVerifyError('')
    fetchBankList(countryCode)
  }

  const handleBankSelection = (bankCode: string) => {
    const bank = bankList.find(b => b.code === bankCode)
    setBankForm(prev => ({ ...prev, bankCode, bankName: bank?.name || '', accountName: '' }))
    setVerifiedAccountPreview(null)
    setBankVerifyError('')
  }

  const handleVerifyBankAccount = async () => {
    if (!bankForm.accountNumber.trim()) { setBankVerifyError('Enter an account number.'); return }
    if (!bankForm.bankCode) { setBankVerifyError('Select a bank first.'); return }
    if (bankForm.accountNumber.trim().length < 10) { setBankVerifyError('Account number must be at least 10 digits.'); return }
    setBankVerifyLoading(true)
    setBankVerifyError('')
    setVerifiedAccountPreview(null)
    try {
      const res = await fetch('/api/partners/wallet/bank-accounts/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber: bankForm.accountNumber.trim(), bankCode: bankForm.bankCode }),
      })
      const json = await res.json()
      if (json.status === 'success' && json.data) {
        setVerifiedAccountPreview(json.data)
        setBankForm(prev => ({ ...prev, accountName: json.data.accountName }))
      } else {
        setBankVerifyError(json.message || 'Could not verify account. Please check the details.')
      }
    } catch { setBankVerifyError('Network error. Try again.') } finally { setBankVerifyLoading(false) }
  }

  const resetAddBankForm = () => {
    setBankForm({ accountName: '', bankName: '', accountNumber: '', bankCode: '', accountType: 'savings', currency: 'NGN', country: 'NG', isDefault: false })
    setBankList([])
    setBankSearchQuery('')
    setVerifiedAccountPreview(null)
    setBankVerifyError('')
    setBankFormError('')
  }

  const submitAddBankAccount = async () => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    if (!verifiedAccountPreview) {
      setBankFormError('Please verify the account before saving.')
      return
    }
    setBankFormLoading(true)
    setBankFormError('')
    try {
      const response = await fetch('/api/partners/wallet/bank-accounts', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: bankForm.bankName,
          bankCode: bankForm.bankCode,
          accountNumber: bankForm.accountNumber.trim(),
          accountType: bankForm.accountType,
          currency: bankForm.currency,
          country: bankForm.country,
          isDefault: bankForm.isDefault,
          preVerifiedAccountName: verifiedAccountPreview.accountName,
        }),
      })
      const result = await response.json()
      if (result.success) {
        setBankAccounts(prev => [...prev, result.data])
        setShowAddBank(false)
        resetAddBankForm()
      } else {
        setBankFormError(result.message || 'Failed to add account.')
      }
    } catch { setBankFormError('Network error.') } finally { setBankFormLoading(false) }
  }

  const deleteBank = async (id: string) => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    const res = await fetch(`/api/partners/wallet/bank-accounts/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    const result = await res.json()
    if (result.success) setBankAccounts(prev => prev.filter(a => a.id !== id))
  }

  const submitWithdrawal = async () => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    const amount = parseFloat(withdrawAmount)
    if (!amount || amount <= 0) { setWithdrawMessage({ type: 'error', text: 'Enter a valid amount.' }); return }
    if (!withdrawBankId) { setWithdrawMessage({ type: 'error', text: 'Select a bank account.' }); return }
    setWithdrawLoading(true)
    setWithdrawMessage(null)
    try {
      const response = await fetch('/api/partners/wallet/withdraw', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, bankAccountId: withdrawBankId }),
      })
      const result = await response.json()
      setWithdrawMessage({ type: result.success ? 'success' : 'error', text: result.message })
      if (result.success) {
        setWithdrawAmount('')
        fetchWalletData()
      }
    } catch { setWithdrawMessage({ type: 'error', text: 'Network error.' }) } finally { setWithdrawLoading(false) }
  }

  const initPricingForm = (
    config: Record<string, { base_price: number; per_km_rate: number }> = {},
    rate?: number
  ) => {
    // rate = fretiPerLocal (e.g. 0.00129 for NGN → Freti). localPerFreti = 1 / rate.
    // When no rate is available yet, fall back to showing the raw Freti value.
    const localPerFreti = rate && rate > 0 ? 1 / rate : null
    const form: Record<string, { base_price: string; per_km_rate: string }> = {}
    VEHICLE_TYPES.forEach(({ value }) => {
      const storedBp = config[value]?.base_price
      const storedKm = config[value]?.per_km_rate
      form[value] = {
        base_price: storedBp != null
          ? (localPerFreti ? (storedBp * localPerFreti).toFixed(2) : storedBp.toString())
          : '',
        per_km_rate: storedKm != null
          ? (localPerFreti ? (storedKm * localPerFreti).toFixed(2) : storedKm.toString())
          : '',
      }
    })
    setPricingForm(form)
  }

  const initInterstateConfigForm = (config: InterstateConfig | null, rate?: number | null) => {
    if (!config) return
    const localPerFreti = rate && rate > 0 ? 1 / rate : null
    const toLocal = (v?: number | null) =>
      v != null ? (localPerFreti ? (v * localPerFreti).toFixed(2) : v.toString()) : ''
    setInterstateConfigForm({
      enabled: config.enabled ?? false,
      internationalEnabled: config.internationalEnabled ?? false,
      basePrice: toLocal(config.basePrice),
      perKmRate: toLocal(config.perKmRate),
      internationalBasePrice: toLocal(config.internationalBasePrice),
      internationalPerKmRate: toLocal(config.internationalPerKmRate),
      estimatedDeliveryDaysMin: String(config.estimatedDeliveryDaysMin ?? 2),
      estimatedDeliveryDaysMax: String(config.estimatedDeliveryDaysMax ?? 5),
    })
  }

  const checkAuthentication = () => {
    const token = localStorage.getItem('partner_token')
    if (!token) {
      router.push('/partners/login')
      return
    }
    fetchDashboardData(token)
  }

  const fetchRidersData = async (token: string) => {
    try {
      setRidersLoading(true)
      const response = await fetch('/api/partners/riders', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const result = await response.json()
      if (result.success) {
        setRidersData(result.data?.riders || [])
      }
    } catch (err) {
      console.error('Riders fetch error:', err)
    } finally {
      setRidersLoading(false)
    }
  }

  const fetchAnalyticsData = async (token: string) => {
    try {
      setAnalyticsLoading(true)
      const response = await fetch('/api/partners/analytics', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const result = await response.json()
      if (result.success) {
        setAnalyticsData(result.data)
      }
    } catch (err) {
      console.error('Analytics fetch error:', err)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const fetchInterstateConfig = async (token: string) => {
    try {
      setInterstateConfigLoading(true)
      const response = await fetch('/api/partners/interstate-config', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const result = await response.json()
      if (result.success) {
        setInterstateConfig(result.data)
        // Form will be initialised by the useEffect that watches interstateConfig + pricingExchangeRate
      }
    } catch (err) {
      console.error('Interstate config fetch error:', err)
    } finally {
      setInterstateConfigLoading(false)
    }
  }

  const submitInterstateConfig = async () => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    if (!pricingExchangeRate) {
      setInterstateConfigError('Exchange rate not loaded yet. Please wait a moment and try again.')
      return
    }
    setInterstateConfigSaving(true)
    setInterstateConfigError('')
    setInterstateConfigSuccess('')
    try {
      // Convert local-currency inputs to Freti before persisting
      const rate = pricingExchangeRate
      const payload = {
        enabled: interstateConfigForm.enabled,
        internationalEnabled: interstateConfigForm.internationalEnabled,
        basePrice: parseFloat((parseFloat(interstateConfigForm.basePrice || '0') * rate).toFixed(6)),
        perKmRate: parseFloat((parseFloat(interstateConfigForm.perKmRate || '0') * rate).toFixed(6)),
        internationalBasePrice: parseFloat((parseFloat(interstateConfigForm.internationalBasePrice || '0') * rate).toFixed(6)),
        internationalPerKmRate: parseFloat((parseFloat(interstateConfigForm.internationalPerKmRate || '0') * rate).toFixed(6)),
        estimatedDeliveryDaysMin: parseInt(interstateConfigForm.estimatedDeliveryDaysMin || '2'),
        estimatedDeliveryDaysMax: parseInt(interstateConfigForm.estimatedDeliveryDaysMax || '5'),
      }
      const response = await fetch('/api/partners/interstate-config', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (result.success) {
        setInterstateConfigSuccess(result.message)
        setInterstateConfig(prev => prev ? { ...prev, ...payload } : prev)
        setTimeout(() => setInterstateConfigSuccess(''), 3000)
      } else {
        setInterstateConfigError(result.message || 'Failed to save configuration.')
      }
    } catch {
      setInterstateConfigError('Network error. Please try again.')
    } finally {
      setInterstateConfigSaving(false)
    }
  }

  const fetchInterstateOrders = async (token: string) => {
    try {
      setInterstateOrdersLoading(true)
      const response = await fetch('/api/partners/interstate-orders', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const result = await response.json()
      if (result.success) {
        setInterstateOrders(result.data || [])
      } else {
        addToast({ title: 'Fetch Failed', description: result.message || 'Failed to load interstate orders.', type: 'error' })
      }
    } catch (err) {
      console.error('Interstate orders fetch error:', err)
      addToast({ title: 'Network Error', description: 'Failed to load interstate orders. Please try again.', type: 'error' })
    } finally {
      setInterstateOrdersLoading(false)
    }
  }

  const handleInterstateOrderAction = async (orderId: string, action: 'accept' | 'reject') => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    setInterstateActionLoadingId(orderId)
    try {
      const response = await fetch(`/api/partners/interstate-orders/${orderId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: action === 'reject' ? JSON.stringify({}) : undefined,
      })
      const result = await response.json()
      if (result.success) {
        setInterstateOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, interstateStatus: action === 'accept' ? 'accepted' : 'rejected' } : o
        ))
        addToast({ title: action === 'accept' ? 'Order Accepted' : 'Order Rejected', description: action === 'accept' ? 'You can now manage this order.' : 'The order has been rejected.', type: action === 'accept' ? 'success' : 'info' })
      } else {
        addToast({ title: `Failed to ${action} order`, description: result.message || 'Unknown error', type: 'error' })
      }
    } catch {
      addToast({ title: 'Network Error', description: 'Please try again.', type: 'error' })
    } finally {
      setInterstateActionLoadingId(null)
    }
  }

  const handleInterstateOrderStatus = async (orderId: string, status: 'in_transit' | 'delivered') => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    setInterstateActionLoadingId(orderId)
    try {
      const response = await fetch(`/api/partners/interstate-orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const result = await response.json()
      if (result.success) {
        setInterstateOrders(prev => prev.map(o => o.id === orderId ? { ...o, interstateStatus: status } : o))
        addToast({ title: status === 'in_transit' ? 'Order In Transit' : 'Order Delivered', description: status === 'in_transit' ? 'Order marked as in transit.' : 'Order marked as delivered.', type: 'success' })
      } else {
        addToast({ title: 'Update Failed', description: result.message || 'Failed to update order status.', type: 'error' })
      }
    } catch {
      addToast({ title: 'Network Error', description: 'Please try again.', type: 'error' })
    } finally {
      setInterstateActionLoadingId(null)
    }
  }

  const openEditProfile = () => {
    if (!dashboardData) return
    const p = dashboardData.partner
    const existingFleet: Record<string, number> = {}
    Object.entries(p.vehicle_fleet || {}).forEach(([k, v]: [string, any]) => {
      existingFleet[k] = v?.count || 0
    })
    setProfileForm({
      contactEmail: p.contact_email || '',
      contactPhone: p.contact_phone || '',
      companyWebsite: p.company_website || '',
      headquartersAddress: p.headquarters_address || '',
      preferredCurrency: p.preferred_currency || 'NGN',
      serviceAreas: p.service_areas || [],
      serviceCategories: p.service_categories || [],
      vehicleFleet: existingFleet,
      companyLogoUrl: p.company_logo_url || '',
      registrationDocUrls: p.registration_document_urls || [],
      insuranceDocUrls: p.insurance_document_urls || [],
      fleetDocUrls: p.fleet_document_urls || [],
    })
    setProfileLogoFile(null)
    setProfileLogoPreview(p.company_logo_url || null)
    setProfileError('')
    setProfileSuccess('')
    setEditingProfile(true)
  }

  const handleProfileDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: 'registration' | 'insurance' | 'fleet') => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setProfileDocUploading(docType)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const url = await uploadFileToSupabase(file, 'partnership-documents', `${docType}-docs-updates`)
        urls.push(url)
      }
      if (docType === 'registration') setProfileForm(p => ({ ...p, registrationDocUrls: [...p.registrationDocUrls, ...urls] }))
      else if (docType === 'insurance') setProfileForm(p => ({ ...p, insuranceDocUrls: [...p.insuranceDocUrls, ...urls] }))
      else setProfileForm(p => ({ ...p, fleetDocUrls: [...p.fleetDocUrls, ...urls] }))
    } catch (err: any) {
      setProfileError(err.message || `Failed to upload ${docType} document.`)
    } finally {
      setProfileDocUploading(null)
    }
  }

  const submitEditProfile = async () => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')
    try {
      let logoUrl = profileForm.companyLogoUrl
      if (profileLogoFile) {
        try {
          logoUrl = await uploadFileToSupabase(profileLogoFile, 'partnership-documents', 'company-logos')
        } catch (err: any) {
          setProfileError(err.message || 'Failed to upload logo.')
          setProfileLoading(false)
          return
        }
      }
      const payload: Record<string, any> = {}
      if (profileForm.contactEmail) payload.contactEmail = profileForm.contactEmail
      if (profileForm.contactPhone) payload.contactPhone = profileForm.contactPhone
      if (profileForm.companyWebsite) payload.companyWebsite = profileForm.companyWebsite
      if (profileForm.headquartersAddress) payload.headquartersAddress = profileForm.headquartersAddress
      if (profileForm.preferredCurrency) payload.preferredCurrency = profileForm.preferredCurrency
      if (profileForm.serviceAreas.length > 0) payload.serviceAreas = profileForm.serviceAreas
      payload.serviceCategories = profileForm.serviceCategories
      const fleetPayload: Record<string, { count: number }> = {}
      Object.entries(profileForm.vehicleFleet).forEach(([k, count]) => { if (count > 0) fleetPayload[k] = { count } })
      if (Object.keys(fleetPayload).length > 0) payload.vehicleFleet = fleetPayload
      if (logoUrl) payload.companyLogoUrl = logoUrl
      if (profileForm.registrationDocUrls.length > 0) payload.registrationDocumentUrls = profileForm.registrationDocUrls
      if (profileForm.insuranceDocUrls.length > 0) payload.insuranceDocumentUrls = profileForm.insuranceDocUrls
      if (profileForm.fleetDocUrls.length > 0) payload.fleetDocumentUrls = profileForm.fleetDocUrls
      const response = await fetch('/api/partners/profile', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (result.success) {
        setProfileSuccess('Profile updated successfully.')
        if (dashboardData) {
          setDashboardData(prev => prev ? {
            ...prev,
            partner: { ...prev.partner, ...result.partner }
          } : prev)
        }
        setTimeout(() => setEditingProfile(false), 1200)
      } else {
        setProfileError(result.message || 'Failed to update profile.')
      }
    } catch {
      setProfileError('Network error. Please try again.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleLicenseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setLicenseFile(file)
    if (!file) { setLicensePreview(null); return }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = ev => setLicensePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setLicensePreview(null)
    }
  }

  const submitAddRider = async () => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    if (!riderForm.full_name || !riderForm.country || !riderForm.state || !riderForm.vehicle_type) {
      setAddRiderError('Full name, country, state, and vehicle type are required.')
      return
    }
    setAddRiderLoading(true)
    setAddRiderError('')
    setAddRiderSuccess('')
    try {
      let driverLicenseUrl: string | undefined

      if (licenseFile) {
        try {
          driverLicenseUrl = await uploadFileToSupabase(licenseFile, 'partnership-documents', 'driver-licenses')
        } catch (uploadErr: any) {
          setAddRiderError(uploadErr.message || 'Failed to upload license image.')
          setAddRiderLoading(false)
          return
        }
      }

      const rawCountry = riderForm.country.trim()
      const rawState = riderForm.state.trim()

      const country = Country.getAllCountries().find(
        c =>
          c.name.toLowerCase() === rawCountry.toLowerCase() ||
          c.isoCode.toLowerCase() === rawCountry.toLowerCase()
      )
      const countryCode = country?.isoCode

      const state = countryCode
        ? State.getStatesOfCountry(countryCode).find(
            s =>
              s.name.toLowerCase() === rawState.toLowerCase() ||
              s.isoCode.toLowerCase() === rawState.toLowerCase()
          )
        : null

      const payload: Record<string, any> = {
        full_name: riderForm.full_name,
        country: countryCode || rawCountry,
        state: state?.isoCode || rawState,
        vehicle_type: riderForm.vehicle_type,
      }
      if (riderForm.city) payload.city = riderForm.city
      if (riderForm.vehicle_make) payload.vehicle_make = riderForm.vehicle_make
      if (riderForm.vehicle_model) payload.vehicle_model = riderForm.vehicle_model
      if (riderForm.vehicle_year) payload.vehicle_year = parseInt(riderForm.vehicle_year)
      if (riderForm.license_plate) payload.license_plate = riderForm.license_plate
      if (riderForm.years_experience) payload.years_experience = parseInt(riderForm.years_experience)
      if (driverLicenseUrl) payload.driver_license_url = driverLicenseUrl

      const response = await fetch('/api/partners/riders', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (result.success) {
        setAddRiderSuccess(result.message)
        setLastCreatedRiderId(result.unique_rider_id || null)
        setRiderForm({ full_name: '', country: '', state: '', city: '', vehicle_type: '', vehicle_make: '', vehicle_model: '', vehicle_year: '', license_plate: '', years_experience: '' })
        setLicenseFile(null)
        setLicensePreview(null)
        fetchRidersData(token)
        setTimeout(() => { setShowAddRider(false); setAddRiderSuccess('') }, 4000)
      } else {
        setAddRiderError(result.message || 'Failed to add rider.')
      }
    } catch {
      setAddRiderError('Network error. Please try again.')
    } finally {
      setAddRiderLoading(false)
    }
  }

  const submitPricing = async () => {
    const token = localStorage.getItem('partner_token')
    if (!token) return

    if (!pricingExchangeRate) {
      setPricingError('Exchange rate not loaded yet. Please wait a moment and try again.')
      return
    }

    setPricingLoading(true)
    setPricingError('')
    setPricingSuccess('')
    try {
      // Convert every local-currency amount to Freti before persisting.
      // pricingExchangeRate = fretiPerLocal (e.g. 0.00129 for NGN).
      const fretiConfig: Record<string, { base_price: number; per_km_rate: number }> = {}
      for (const { value } of VEHICLE_TYPES) {
        const bp = parseFloat(pricingForm[value]?.base_price || '0')
        const km = parseFloat(pricingForm[value]?.per_km_rate || '0')
        if (bp > 0 && km > 0) {
          fretiConfig[value] = {
            base_price: parseFloat((bp * pricingExchangeRate).toFixed(6)),
            per_km_rate: parseFloat((km * pricingExchangeRate).toFixed(6)),
          }
        }
      }
      const response = await fetch('/api/partners/pricing', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing_config: fretiConfig }),
      })
      const result = await response.json()
      if (result.success) {
        setPricingSuccess(result.message)
        setDashboardData(prev => prev ? { ...prev, partner: { ...prev.partner, pricing_config: fretiConfig } } : prev)
        setTimeout(() => setPricingSuccess(''), 3000)
      } else {
        setPricingError(result.message || 'Failed to save pricing.')
      }
    } catch {
      setPricingError('Network error. Please try again.')
    } finally {
      setPricingLoading(false)
    }
  }

  const fetchPricingExchangeRate = async (currency: string) => {
    if (pricingRateLoading) return
    if (currency.toUpperCase() === 'USD') {
      setPricingExchangeRate(1.0)
      return
    }
    setPricingRateLoading(true)
    setPricingRateError('')
    try {
      const res = await fetch(
        `/api/partners/exchange-rate?localAmount=1&localCurrency=${encodeURIComponent(currency.toUpperCase())}`
      )
      const data = await res.json()
      if (typeof data.exchangeRate === 'number' && data.exchangeRate > 0) {
        setPricingExchangeRate(data.exchangeRate)
      } else {
        setPricingRateError('Could not fetch live exchange rate. Prices will be saved as-is.')
      }
    } catch {
      setPricingRateError('Exchange rate service unavailable.')
    } finally {
      setPricingRateLoading(false)
    }
  }

  const updateRiderStatus = async (riderId: string, action: 'suspend' | 'terminate' | 'reactivate') => {
    const token = localStorage.getItem('partner_token')
    if (!token) return
    try {
      const response = await fetch(`/api/partners/riders/${riderId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const result = await response.json()
      if (result.success) {
        setRidersData(prev => prev.map(r => {
          if (r.id !== riderId) return r
          const newStatus = action === 'suspend' ? 'suspended' : action === 'terminate' ? 'terminated' : 'active'
          return { ...r, verification_status: newStatus }
        }))
        addToast({ title: 'Rider Updated', description: `Rider has been ${action}ed.`, type: 'success' })
      } else {
        addToast({ title: 'Update Failed', description: result.message || 'Failed to update rider status.', type: 'error' })
      }
    } catch {
      addToast({ title: 'Network Error', description: 'Please try again.', type: 'error' })
    }
  }

  const fetchDashboardData = async (token: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/partners/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setDashboardData(result.data)
          initPricingForm(result.data?.partner?.pricing_config || {})
        } else {
          setError(result.message)
        }
      } else {
        setError('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('partner_token')
    router.push('/partners/login')
  }

  const COUNTRY_CURRENCY: Record<string, { currency: string; locale: string }> = {
    NG: { currency: 'NGN', locale: 'en-NG' },
    US: { currency: 'USD', locale: 'en-US' },
    GB: { currency: 'GBP', locale: 'en-GB' },
    GH: { currency: 'GHS', locale: 'en-GH' },
    KE: { currency: 'KES', locale: 'en-KE' },
    ZA: { currency: 'ZAR', locale: 'en-ZA' },
    EG: { currency: 'EGP', locale: 'en-EG' },
    ET: { currency: 'ETB', locale: 'en-ET' },
    TZ: { currency: 'TZS', locale: 'en-TZ' },
    UG: { currency: 'UGX', locale: 'en-UG' },
    RW: { currency: 'RWF', locale: 'en-RW' },
    SN: { currency: 'XOF', locale: 'fr-SN' },
    CI: { currency: 'XOF', locale: 'fr-CI' },
    CM: { currency: 'XAF', locale: 'fr-CM' },
    CA: { currency: 'CAD', locale: 'en-CA' },
    AU: { currency: 'AUD', locale: 'en-AU' },
    IN: { currency: 'INR', locale: 'en-IN' },
    AE: { currency: 'AED', locale: 'ar-AE' },
  }

  const CURRENCY_LOCALE: Record<string, string> = {
    NGN: 'en-NG', USD: 'en-US', GBP: 'en-GB', EUR: 'en-DE',
    GHS: 'en-GH', KES: 'en-KE', ZAR: 'en-ZA', EGP: 'en-EG',
    ETB: 'en-ET', TZS: 'en-TZ', UGX: 'en-UG', RWF: 'en-RW',
    XOF: 'fr-SN', XAF: 'fr-CM', CAD: 'en-CA', AUD: 'en-AU',
    INR: 'en-IN', AED: 'ar-AE',
  }

  const getPartnerCurrency = () => {
    const stored = dashboardData?.partner?.preferred_currency
    if (stored && CURRENCY_LOCALE[stored]) {
      return { currency: stored, locale: CURRENCY_LOCALE[stored] }
    }
    const primaryArea = dashboardData?.partner?.service_areas?.[0] ?? 'NG'
    const countryCode = primaryArea.split('-')[0]
    return COUNTRY_CURRENCY[countryCode] ?? { currency: 'NGN', locale: 'en-NG' }
  }

  const formatCurrency = (amount: number) => {
    const { currency, locale } = getPartnerCurrency()
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const fmtFreti = (v: number) => {
    if (v === 0) return '₣0';
    if (v < 0.01) return `₣${v.toFixed(5)}`;
    if (v < 1) return `₣${v.toFixed(4)}`;
    return `₣${v.toFixed(2)}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onDownloadClick={() => {}} />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{dashboardData.partner.company_name}</h1>
            <p className="text-emerald-100">Partner Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'riders', label: 'Riders' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'interstate-orders', label: 'Interstate/Intl Orders' },
              { id: 'interstate-config', label: 'Interstate/Intl Config' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'finance', label: 'Finance' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">Total Riders</h3>
                  <div className="text-emerald-400 text-2xl">👥</div>
                </div>
                <p className="text-3xl font-bold">{dashboardData.statistics.totalRiders}</p>
                <p className="text-gray-500 text-sm">{dashboardData.statistics.activeRiders} active</p>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">Total Deliveries</h3>
                  <div className="text-emerald-400 text-2xl">📦</div>
                </div>
                <p className="text-3xl font-bold">{dashboardData.statistics.totalDeliveries}</p>
                <p className="text-gray-500 text-sm">{dashboardData.statistics.completedDeliveries} completed</p>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">Total Revenue</h3>
                  <div className="text-emerald-400 text-2xl">💰</div>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(dashboardData.statistics.totalRevenue)}</p>
                <p className="text-gray-500 text-sm">{formatCurrency(dashboardData.statistics.platformCommission)} commission</p>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">On-Time Rate</h3>
                  <div className="text-emerald-400 text-2xl">⏰</div>
                </div>
                <p className="text-3xl font-bold">{dashboardData.statistics.onTimeDeliveryRate > 0 ? `${dashboardData.statistics.onTimeDeliveryRate}%` : '—'}</p>
                <p className="text-gray-500 text-sm">{dashboardData.statistics.averageDeliveryTime > 0 ? `Avg ${dashboardData.statistics.averageDeliveryTime} min` : 'No data yet'}</p>
              </div>
            </div>

            {/* Recent Rider Activity */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Recent Rider Activity</h2>
              {dashboardData.recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-4xl mb-3">🏍️</p>
                  <p className="font-medium">No rider activity yet</p>
                  <p className="text-sm mt-1">Rider applications will appear here once submitted.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-semibold">{item.full_name}</p>
                        <p className="text-gray-400 text-sm">{item.vehicle_type}{item.city ? ` · ${item.city}` : ''}{item.country ? `, ${item.country}` : ''}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'verified' ? 'bg-green-500/20 text-green-400'
                          : item.status === 'rejected' ? 'bg-red-500/20 text-red-400'
                          : item.status === 'under_review' ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        <p className="text-gray-500 text-xs mt-1">{formatDate(item.updated_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'riders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Rider Management</h2>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">{ridersData.length} rider{ridersData.length !== 1 ? 's' : ''}</span>
                <button
                  onClick={() => { setShowAddRider(true); setAddRiderError(''); setAddRiderSuccess(''); setLastCreatedRiderId(null) }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Rider
                </button>
              </div>
            </div>

            {lastCreatedRiderId && (
              <div className="bg-emerald-900/40 border border-emerald-500 rounded-xl px-5 py-4 flex items-start gap-3">
                <span className="text-emerald-400 text-xl">✓</span>
                <div>
                  <p className="text-emerald-300 font-semibold text-sm">Rider account created!</p>
                  <p className="text-gray-300 text-sm mt-1">Share this Rider ID with the rider so they can claim their account on the app:</p>
                  <div className="mt-2 flex items-center gap-3">
                    <code className="bg-gray-800 text-emerald-400 px-3 py-1 rounded-lg text-lg font-mono font-bold tracking-wider">{lastCreatedRiderId}</code>
                    <button onClick={() => { navigator.clipboard.writeText(lastCreatedRiderId); }} className="text-xs text-gray-400 hover:text-white transition-colors">Copy</button>
                  </div>
                </div>
                <button onClick={() => setLastCreatedRiderId(null)} className="ml-auto text-gray-500 hover:text-white">×</button>
              </div>
            )}

            <div className="glass-effect rounded-xl p-6">
              {ridersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              ) : ridersData.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-4xl mb-3">🏍️</p>
                  <p className="font-medium text-lg">No verified riders yet</p>
                  <p className="text-sm mt-1">Riders who complete verification and are linked to your company will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700 text-gray-400">
                        <th className="text-left py-3 px-3">Name</th>
                        <th className="text-left py-3 px-3">Rider ID</th>
                        <th className="text-left py-3 px-3">Vehicle</th>
                        <th className="text-left py-3 px-3">Status</th>
                        <th className="text-left py-3 px-3">Account</th>
                        <th className="text-left py-3 px-3">License</th>
                        <th className="text-left py-3 px-3">Deliveries</th>
                        <th className="text-left py-3 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ridersData.map((rider) => (
                        <tr key={rider.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                          <td className="py-3 px-3 font-medium">
                            <div>{rider.full_name}</div>
                            {rider.state && <div className="text-xs text-gray-500">{rider.state}</div>}
                          </td>
                          <td className="py-3 px-3">
                            {rider.unique_rider_id
                              ? <code className="bg-gray-800 text-emerald-400 px-2 py-0.5 rounded text-xs font-mono">{rider.unique_rider_id}</code>
                              : <span className="text-gray-600">—</span>
                            }
                          </td>
                          <td className="py-3 px-3 text-gray-300">{rider.vehicle_type}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rider.verification_status === 'active' ? 'bg-green-500/20 text-green-400'
                              : rider.verification_status === 'dormant' ? 'bg-gray-500/20 text-gray-400'
                              : rider.verification_status === 'suspended' ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                            }`}>
                              {rider.verification_status.charAt(0).toUpperCase() + rider.verification_status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {rider.claimed_at
                              ? <span className="text-xs text-green-400">Claimed</span>
                              : <span className="text-xs text-gray-500">Unclaimed</span>
                            }
                          </td>
                          <td className="py-3 px-3">
                            {rider.driver_license_url
                              ? <a href={rider.driver_license_url} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 underline">View</a>
                              : <span className="text-xs text-red-400">Missing</span>
                            }
                          </td>
                          <td className="py-3 px-3 text-gray-300">{rider.total_deliveries ?? 0}</td>
                          <td className="py-3 px-3">
                            <div className="flex gap-1">
                              {rider.verification_status === 'active' && (
                                <button
                                  onClick={() => setConfirmModal({ riderId: rider.id, riderName: rider.full_name, action: 'suspend' })}
                                  className="text-xs px-2 py-1 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 rounded transition-colors"
                                >
                                  Suspend
                                </button>
                              )}
                              {rider.verification_status === 'suspended' && (
                                <button
                                  onClick={() => updateRiderStatus(rider.id, 'reactivate')}
                                  className="text-xs px-2 py-1 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded transition-colors"
                                >
                                  Reactivate
                                </button>
                              )}
                              {rider.verification_status !== 'terminated' && (
                                <button
                                  onClick={() => setConfirmModal({ riderId: rider.id, riderName: rider.full_name, action: 'terminate' })}
                                  className="text-xs px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition-colors"
                                >
                                  Terminate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Analytics Overview</h2>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Fleet Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Deliveries</span>
                      <span className="font-semibold">{dashboardData.performanceMetrics.totalDeliveries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completed Deliveries</span>
                      <span className="font-semibold">{dashboardData.performanceMetrics.completedDeliveries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Rating</span>
                      <span className="font-semibold">{dashboardData.performanceMetrics.averageRating > 0 ? `⭐ ${dashboardData.performanceMetrics.averageRating}` : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fleet On-Time Rate</span>
                      <span className="font-semibold">{dashboardData.performanceMetrics.onTimeRate > 0 ? `${dashboardData.performanceMetrics.onTimeRate}%` : '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Revenue Summary</h3>
                  {analyticsData?.revenueBreakdown ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Revenue</span>
                        <span className="font-semibold">{formatCurrency(analyticsData.revenueBreakdown.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Platform Commission</span>
                        <span className="font-semibold text-yellow-400">{formatCurrency(analyticsData.revenueBreakdown.platformCommission)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-700 pt-4">
                        <span className="text-gray-300 font-medium">Net Revenue</span>
                        <span className="font-bold text-emerald-400">{formatCurrency(analyticsData.revenueBreakdown.netRevenue)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Revenue data not available.</p>
                  )}
                </div>

                <div className="glass-effect rounded-xl p-6 lg:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Top Performing Riders</h3>
                  {analyticsData?.riderPerformance?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-400 text-sm">
                            <th className="text-left py-3 px-4">Rider</th>
                            <th className="text-left py-3 px-4">Vehicle</th>
                            <th className="text-left py-3 px-4">Deliveries</th>
                            <th className="text-left py-3 px-4">Rating</th>
                            <th className="text-left py-3 px-4">On-Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.riderPerformance.map((r: any, i: number) => (
                            <tr key={i} className="border-b border-gray-800">
                              <td className="py-3 px-4 font-medium">{r.riderName}</td>
                              <td className="py-3 px-4 text-gray-300">{r.vehicleType}</td>
                              <td className="py-3 px-4">{r.deliveries}</td>
                              <td className="py-3 px-4">{r.rating > 0 ? `⭐ ${r.rating}` : '—'}</td>
                              <td className="py-3 px-4">{r.onTimeRate > 0 ? `${r.onTimeRate}%` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-3xl mb-2">📊</p>
                      <p>No rider performance data yet.</p>
                    </div>
                  )}
                </div>

                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {dashboardData.partner.service_areas.map((area, index) => (
                      <span key={index} className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Fleet Pricing</h2>
              <p className="text-gray-400 text-sm mt-1">Set your company&apos;s base fee and per-km rate for each vehicle type. These rates are automatically applied to all your riders&apos; profiles.</p>
            </div>

            {/* Currency info banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-3">
              <span className="text-blue-400 text-xl shrink-0">💱</span>
              <div className="text-sm space-y-1">
                <p className="text-blue-300 font-medium">Prices are entered in your local currency and automatically converted to Freti before saving.</p>
                <p className="text-gray-400">
                  <strong className="text-white">1 Freti = 1 USD</strong> — riders&apos; delivery prices are always shown to customers in Freti (₣).
                  The preview column shows what each input equals in Freti at today&apos;s exchange rate.
                </p>
                {pricingRateLoading && (
                  <p className="text-yellow-400 text-xs animate-pulse">⏳ Fetching live exchange rate for {dashboardData.partner.preferred_currency || 'NGN'}…</p>
                )}
                {pricingExchangeRate && !pricingRateLoading && (
                  <p className="text-emerald-400 text-xs">
                    ✓ Live rate: 1 {dashboardData.partner.preferred_currency || 'NGN'} = ₣{pricingExchangeRate.toFixed(6)} &nbsp;|&nbsp; 1 ₣ ≈ {(1 / pricingExchangeRate).toFixed(2)} {dashboardData.partner.preferred_currency || 'NGN'}
                  </p>
                )}
                {pricingRateError && <p className="text-red-400 text-xs">⚠ {pricingRateError}</p>}
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                      <th className="text-left py-3 px-3">Vehicle Type</th>
                      <th className="text-left py-3 px-3">Base Fee ({dashboardData.partner.preferred_currency || 'NGN'})</th>
                      <th className="text-left py-3 px-2 text-emerald-500/70">≈ Freti</th>
                      <th className="text-left py-3 px-3">Per KM ({dashboardData.partner.preferred_currency || 'NGN'})</th>
                      <th className="text-left py-3 px-2 text-emerald-500/70">≈ Freti/km</th>
                      <th className="text-left py-3 px-3 text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VEHICLE_TYPES.map(({ value, label }) => {
                      const bp = pricingForm[value]?.base_price || ''
                      const km = pricingForm[value]?.per_km_rate || ''
                      const isSet = parseFloat(bp) > 0 && parseFloat(km) > 0
                      const bpFreti = pricingExchangeRate && parseFloat(bp) > 0
                        ? (parseFloat(bp) * pricingExchangeRate)
                        : null
                      const kmFreti = pricingExchangeRate && parseFloat(km) > 0
                        ? (parseFloat(km) * pricingExchangeRate)
                        : null
                      const fmtFreti = (v: number) => v < 0.01 ? v.toFixed(5) : v.toFixed(4)
                      return (
                        <tr key={value} className="border-b border-gray-800">
                          <td className="py-4 px-3 font-medium capitalize">{label}</td>
                          <td className="py-4 px-3">
                            <input
                              type="number"
                              min="0"
                              placeholder="e.g. 500"
                              value={bp}
                              onChange={(e) => setPricingForm(prev => ({ ...prev, [value]: { ...prev[value], base_price: e.target.value } }))}
                              className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-4 px-2">
                            {bpFreti != null
                              ? <span className="text-emerald-400 text-xs font-mono">₣{fmtFreti(bpFreti)}</span>
                              : <span className="text-gray-600 text-xs">—</span>
                            }
                          </td>
                          <td className="py-4 px-3">
                            <input
                              type="number"
                              min="0"
                              placeholder="e.g. 50"
                              value={km}
                              onChange={(e) => setPricingForm(prev => ({ ...prev, [value]: { ...prev[value], per_km_rate: e.target.value } }))}
                              className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-4 px-2">
                            {kmFreti != null
                              ? <span className="text-emerald-400 text-xs font-mono">₣{fmtFreti(kmFreti)}</span>
                              : <span className="text-gray-600 text-xs">—</span>
                            }
                          </td>
                          <td className="py-4 px-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${isSet ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                              {isSet ? 'Configured' : 'Not set'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {pricingError && <p className="text-red-400 text-sm mt-4">{pricingError}</p>}
              {pricingSuccess && <p className="text-emerald-400 text-sm mt-4">✓ {pricingSuccess}</p>}

              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={submitPricing}
                  disabled={pricingLoading || pricingRateLoading || !pricingExchangeRate}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {pricingLoading ? 'Saving…' : pricingRateLoading ? 'Loading rate…' : 'Save Pricing'}
                </button>
                <p className="text-xs text-gray-500">Saving converts your local prices to Freti and immediately updates all active riders&apos; profiles.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interstate-orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Interstate & International Orders</h2>
              <p className="text-gray-400 text-sm mt-1">Orders that require delivery across states or countries, assigned to your company for fulfillment.</p>
            </div>

            {interstateOrdersLoading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
            ) : (
              <>
                {interstateOrders.length > 0 && (
                  <div className="flex gap-2">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'interstate', label: 'Interstate' },
                      { key: 'international', label: 'International' },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setInterstateOrdersFilter(f.key as any)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          interstateOrdersFilter === f.key
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}

                {interstateOrders
                  .filter((order) => {
                    if (interstateOrdersFilter === 'all') return true;
                    const isIntl = order.isInternational ?? order.metadata?.interstate_delivery?.isInternational ?? false;
                    return interstateOrdersFilter === 'international' ? isIntl : !isIntl;
                  })
                  .length === 0 ? (
                  <div className="glass-effect rounded-xl p-12 text-center">
                    <div className="text-4xl mb-3">🚛</div>
                    <p className="text-gray-400">No {interstateOrdersFilter === 'all' ? 'interstate' : interstateOrdersFilter} orders assigned yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interstateOrders
                      .filter((order) => {
                        if (interstateOrdersFilter === 'all') return true;
                        const isIntl = order.isInternational ?? order.metadata?.interstate_delivery?.isInternational ?? false;
                        return interstateOrdersFilter === 'international' ? isIntl : !isIntl;
                      })
                      .map((order) => {
                        const statusStyles: Record<string, string> = {
                          pending_partner_acceptance: 'bg-yellow-500/20 text-yellow-400',
                          accepted: 'bg-blue-500/20 text-blue-400',
                          rejected: 'bg-red-500/20 text-red-400',
                          in_transit: 'bg-purple-500/20 text-purple-400',
                          delivered: 'bg-green-500/20 text-green-400',
                        }
                        const statusLabels: Record<string, string> = {
                          pending_partner_acceptance: 'Pending Acceptance',
                          accepted: 'Accepted',
                          rejected: 'Rejected',
                          in_transit: 'In Transit',
                          delivered: 'Delivered',
                        }
                        const isInternational = order.isInternational ?? order.metadata?.interstate_delivery?.isInternational ?? false
                        const isLoading = interstateActionLoadingId === order.id
                        return (
                          <div key={order.id} className="glass-effect rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">Order #{order.orderNumber}</p>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isInternational ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                                    {isInternational ? 'International' : 'Interstate'}
                                  </span>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">{formatDate(order.createdAt)}</p>
                              </div>
                              <span className={`text-xs px-3 py-1 rounded-full ${statusStyles[order.interstateStatus] || 'bg-gray-700 text-gray-400'}`}>
                                {statusLabels[order.interstateStatus] || order.interstateStatus}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 cursor-pointer" onClick={() => setInterstateDetailOrder(order)}>
                              <div>
                                <p className="text-gray-500 text-xs">Delivery Fee</p>
                                <p className="font-medium text-emerald-400">{fmtFreti(order.deliveryFee)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Est. Delivery</p>
                                <p className="font-medium">{order.estimatedDeliveryDays ? `${order.estimatedDeliveryDays} day(s)` : '—'}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Destination</p>
                                <p className="font-medium">{order.deliveryAddress?.city || ''}{order.deliveryAddress?.state ? `, ${order.deliveryAddress.state}` : ''}{order.deliveryAddress?.country && isInternational ? `, ${order.deliveryAddress.country}` : ''}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Recipient</p>
                                <p className="font-medium">{order.deliveryAddress?.fullName || '—'}</p>
                              </div>
                            </div>

                            {order.interstateStatus !== 'pending_partner_acceptance' && order.pickupPin && (
                              <div className="flex gap-4 mb-4 text-xs">
                                <span className="bg-gray-800 px-3 py-1.5 rounded-lg">Pickup PIN: <strong className="text-emerald-400">{order.pickupPin}</strong></span>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => setInterstateDetailOrder(order)}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                View Details
                              </button>
                              {order.interstateStatus === 'pending_partner_acceptance' && (
                                <>
                                  <button
                                    onClick={() => handleInterstateOrderAction(order.id, 'accept')}
                                    disabled={isLoading}
                                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                  >
                                    {isLoading ? 'Processing…' : 'Accept'}
                                  </button>
                                  <button
                                    onClick={() => handleInterstateOrderAction(order.id, 'reject')}
                                    disabled={isLoading}
                                    className="bg-red-600/80 hover:bg-red-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                  >
                                    {isLoading ? 'Processing…' : 'Reject'}
                                  </button>
                                </>
                              )}
                              {order.interstateStatus === 'accepted' && (
                                <button
                                  onClick={() => handleInterstateOrderStatus(order.id, 'in_transit')}
                                  disabled={isLoading}
                                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                  {isLoading ? 'Processing…' : 'Mark In Transit'}
                                </button>
                              )}
                              {order.interstateStatus === 'in_transit' && (
                                <button
                                  onClick={() => handleInterstateOrderStatus(order.id, 'delivered')}
                                  disabled={isLoading}
                                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                  {isLoading ? 'Processing…' : 'Mark Delivered'}
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {interstateDetailOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setInterstateDetailOrder(null)}>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-lg font-bold">Order #{interstateDetailOrder.orderNumber}</h3>
                    <p className="text-gray-500 text-xs">{formatDate(interstateDetailOrder.createdAt)}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${(interstateDetailOrder.isInternational ?? false) ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                    {(interstateDetailOrder.isInternational ?? false) ? 'International' : 'Interstate'}
                  </span>
                </div>
                <button
                  onClick={() => setInterstateDetailOrder(null)}
                  className="text-gray-400 hover:text-white text-xl px-2"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">Total Amount</p>
                    <p className="text-lg font-semibold text-emerald-400">{fmtFreti(interstateDetailOrder.totalAmount)}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">Delivery Fee</p>
                    <p className="text-lg font-semibold text-emerald-400">{fmtFreti(interstateDetailOrder.deliveryFee)}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">Est. Delivery</p>
                    <p className="text-lg font-semibold">{interstateDetailOrder.estimatedDeliveryDays ? `${interstateDetailOrder.estimatedDeliveryDays} day(s)` : '—'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-gray-300">Buyer / Recipient</h4>
                    <div className="bg-gray-800/50 rounded-xl p-4 flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => interstateDetailOrder.buyer?.avatarUrl && setInterstateImagePreviewUrl(interstateDetailOrder.buyer.avatarUrl)}
                        className="relative shrink-0 rounded-full overflow-hidden w-14 h-14"
                        disabled={!interstateDetailOrder.buyer?.avatarUrl}
                      >
                        {interstateDetailOrder.buyer?.avatarUrl ? (
                          <Image
                            src={interstateDetailOrder.buyer.avatarUrl}
                            alt={interstateDetailOrder.buyer.name || 'Buyer'}
                            width={56}
                            height={56}
                            className="rounded-full object-cover w-14 h-14 hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                            {(interstateDetailOrder.buyer?.name || 'B').charAt(0)}
                          </div>
                        )}
                      </button>
                      <div className="text-sm space-y-1">
                        <p className="font-medium text-white">{interstateDetailOrder.buyer?.name || interstateDetailOrder.deliveryAddress?.fullName || '—'}</p>
                        {interstateDetailOrder.buyer?.phone && <p className="text-gray-400">📞 {interstateDetailOrder.buyer.phone}</p>}
                        {interstateDetailOrder.buyer?.email && <p className="text-gray-400">✉️ {interstateDetailOrder.buyer.email}</p>}
                        <div className="text-gray-500 text-xs mt-2">
                          <p>{interstateDetailOrder.deliveryAddress?.address || '—'}</p>
                          <p>{interstateDetailOrder.deliveryAddress?.city || ''}{interstateDetailOrder.deliveryAddress?.state ? `, ${interstateDetailOrder.deliveryAddress.state}` : ''}{interstateDetailOrder.deliveryAddress?.country ? `, ${interstateDetailOrder.deliveryAddress.country}` : ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-gray-300">Vendor / Pickup From</h4>
                    <div className="bg-gray-800/50 rounded-xl p-4 flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => interstateDetailOrder.vendor?.avatarUrl && setInterstateImagePreviewUrl(interstateDetailOrder.vendor.avatarUrl)}
                        className="relative shrink-0 rounded-full overflow-hidden w-14 h-14"
                        disabled={!interstateDetailOrder.vendor?.avatarUrl}
                      >
                        {interstateDetailOrder.vendor?.avatarUrl ? (
                          <Image
                            src={interstateDetailOrder.vendor.avatarUrl}
                            alt={interstateDetailOrder.vendor.name || 'Vendor'}
                            width={56}
                            height={56}
                            className="rounded-full object-cover w-14 h-14 hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                            {(interstateDetailOrder.vendor?.name || 'V').charAt(0)}
                          </div>
                        )}
                      </button>
                      <div className="text-sm space-y-1">
                        <p className="font-medium text-white">{interstateDetailOrder.vendor?.name || 'Vendor'}</p>
                        {interstateDetailOrder.vendor?.phone && <p className="text-gray-400">📞 {interstateDetailOrder.vendor.phone}</p>}
                        {interstateDetailOrder.vendor?.email && <p className="text-gray-400">✉️ {interstateDetailOrder.vendor.email}</p>}
                        <div className="text-gray-500 text-xs mt-2">
                          <p>{interstateDetailOrder.vendor?.location?.address || '—'}</p>
                          <p>{interstateDetailOrder.vendor?.location?.city || ''}{interstateDetailOrder.vendor?.location?.state ? `, ${interstateDetailOrder.vendor.location.state}` : ''}{interstateDetailOrder.vendor?.location?.country ? `, ${interstateDetailOrder.vendor.location.country}` : ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {interstateDetailOrder.items && interstateDetailOrder.items.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-300 mb-3">Items</h4>
                    <div className="space-y-2">
                      {interstateDetailOrder.items.map((item) => (
                        <div key={item.id} className="bg-gray-800/50 rounded-xl p-3 flex items-center gap-3">
                          {item.product_image_url ? (
                            <button
                              type="button"
                              onClick={() => setInterstateImagePreviewUrl(item.product_image_url ?? null)}
                              className="relative shrink-0 rounded-lg overflow-hidden w-12 h-12"
                            >
                              <Image
                                src={item.product_image_url}
                                alt={item.product_name || 'Product'}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover w-12 h-12 hover:opacity-90 transition-opacity"
                              />
                            </button>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-gray-500 text-xs shrink-0">
                              {item.product_name ? item.product_name.charAt(0).toUpperCase() : '?'}
                            </div>
                          )}
                          <div className="flex-1 text-sm">
                            <p className="font-medium">{item.product_name || 'Unnamed product'}</p>
                            <p className="text-gray-500 text-xs">Qty: {item.quantity || 1} × {fmtFreti(item.unit_price || 0)}</p>
                          </div>
                          <p className="text-emerald-400 text-sm font-medium">{fmtFreti(item.total_price || item.unit_price || 0)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {interstateDetailOrder.deliveryInstructions && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <h4 className="font-semibold text-sm text-yellow-400 mb-1">Delivery Instructions</h4>
                    <p className="text-sm text-gray-300">{interstateDetailOrder.deliveryInstructions}</p>
                  </div>
                )}

                {interstateDetailOrder.pickupPin && interstateDetailOrder.interstateStatus !== 'pending_partner_acceptance' && interstateDetailOrder.interstateStatus !== 'rejected' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-emerald-400">Pickup PIN</h4>
                      <p className="text-xs text-gray-400">Show this to the vendor when collecting the item.</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-400 tracking-widest">{interstateDetailOrder.pickupPin}</p>
                  </div>
                )}
                {interstateDetailOrder.interstateStatus === 'pending_partner_acceptance' && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-400">Pickup PIN</h4>
                      <p className="text-xs text-gray-500">Accept this order to reveal the pickup PIN.</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-600 tracking-widest">🔒</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {interstateImagePreviewUrl && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setInterstateImagePreviewUrl(null)}>
            <button
              onClick={() => setInterstateImagePreviewUrl(null)}
              className="absolute top-4 right-4 text-white text-3xl px-3 py-1 hover:bg-white/10 rounded-full"
            >
              ×
            </button>
            <Image
              src={interstateImagePreviewUrl}
              alt="Preview"
              width={800}
              height={800}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        )}

        {activeTab === 'interstate-config' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Interstate & International Delivery Config</h2>
              <p className="text-gray-400 text-sm mt-1">Configure pricing and estimated delivery time for orders shipped across states or countries.</p>
            </div>

            {interstateConfigLoading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
            ) : (
              <div className="glass-effect rounded-xl p-6 space-y-6 max-w-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Interstate Delivery</p>
                    <p className="text-gray-500 text-xs mt-1">Allow your company to receive interstate delivery orders.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={interstateConfigForm.enabled}
                      onChange={(e) => setInterstateConfigForm(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-checked:bg-emerald-600 rounded-full transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable International Delivery</p>
                    <p className="text-gray-500 text-xs mt-1">Allow your company to receive cross-country delivery orders.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={interstateConfigForm.internationalEnabled}
                      onChange={(e) => setInterstateConfigForm(prev => ({ ...prev, internationalEnabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-checked:bg-emerald-600 rounded-full transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-4 space-y-2">
                  {pricingRateLoading && (
                    <p className="text-yellow-400 text-xs animate-pulse">⏳ Fetching live exchange rate for {dashboardData.partner.preferred_currency || 'NGN'}…</p>
                  )}
                  {pricingExchangeRate && !pricingRateLoading && (
                    <p className="text-emerald-400 text-xs">
                      ✓ Live rate: 1 {dashboardData.partner.preferred_currency || 'NGN'} = ₣{pricingExchangeRate.toFixed(6)} &nbsp;|&nbsp; 1 ₣ ≈ {(1 / pricingExchangeRate).toFixed(2)} {dashboardData.partner.preferred_currency || 'NGN'}
                    </p>
                  )}
                  {pricingRateError && <p className="text-red-400 text-xs">⚠ {pricingRateError}</p>}
                  <p className="text-gray-500 text-xs">Enter prices in your local currency. Freti equivalents will be saved to the database.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Domestic Base Price ({dashboardData.partner.preferred_currency || 'NGN'})</label>
                    <input
                      type="number"
                      min="0"
                      value={interstateConfigForm.basePrice}
                      onChange={(e) => setInterstateConfigForm(prev => ({ ...prev, basePrice: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                      placeholder="e.g. 5000"
                    />
                    {pricingExchangeRate && parseFloat(interstateConfigForm.basePrice) > 0 && (
                      <p className="text-emerald-400 text-xs mt-1 font-mono">≈ ₣{(parseFloat(interstateConfigForm.basePrice) * pricingExchangeRate).toFixed(4)}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Domestic Per KM Rate ({dashboardData.partner.preferred_currency || 'NGN'})</label>
                    <input
                      type="number"
                      min="0"
                      value={interstateConfigForm.perKmRate}
                      onChange={(e) => setInterstateConfigForm(prev => ({ ...prev, perKmRate: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                      placeholder="e.g. 100"
                    />
                    {pricingExchangeRate && parseFloat(interstateConfigForm.perKmRate) > 0 && (
                      <p className="text-emerald-400 text-xs mt-1 font-mono">≈ ₣{(parseFloat(interstateConfigForm.perKmRate) * pricingExchangeRate).toFixed(4)}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">International Base Price ({dashboardData.partner.preferred_currency || 'NGN'})</label>
                    <input
                      type="number"
                      min="0"
                      value={interstateConfigForm.internationalBasePrice}
                      onChange={(e) => setInterstateConfigForm(prev => ({ ...prev, internationalBasePrice: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                      placeholder="e.g. 25000"
                    />
                    {pricingExchangeRate && parseFloat(interstateConfigForm.internationalBasePrice) > 0 && (
                      <p className="text-emerald-400 text-xs mt-1 font-mono">≈ ₣{(parseFloat(interstateConfigForm.internationalBasePrice) * pricingExchangeRate).toFixed(4)}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">International Per KM Rate ({dashboardData.partner.preferred_currency || 'NGN'})</label>
                    <input
                      type="number"
                      min="0"
                      value={interstateConfigForm.internationalPerKmRate}
                      onChange={(e) => setInterstateConfigForm(prev => ({ ...prev, internationalPerKmRate: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                      placeholder="e.g. 500"
                    />
                    {pricingExchangeRate && parseFloat(interstateConfigForm.internationalPerKmRate) > 0 && (
                      <p className="text-emerald-400 text-xs mt-1 font-mono">≈ ₣{(parseFloat(interstateConfigForm.internationalPerKmRate) * pricingExchangeRate).toFixed(4)}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Min Delivery Time (days)</label>
                    <input
                      type="number"
                      min="1"
                      value={interstateConfigForm.estimatedDeliveryDaysMin}
                      onChange={(e) => setInterstateConfigForm(prev => ({ ...prev, estimatedDeliveryDaysMin: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Max Delivery Time (days)</label>
                    <input
                      type="number"
                      min="1"
                      value={interstateConfigForm.estimatedDeliveryDaysMax}
                      onChange={(e) => setInterstateConfigForm(prev => ({ ...prev, estimatedDeliveryDaysMax: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-gray-400">
                  <p>Your service areas (<span className="text-gray-300">{interstateConfig?.serviceAreas?.join(', ') || 'none set'}</span>) determine which state-to-state routes you&apos;re eligible for. Update service areas in <strong className="text-white">Settings</strong>.</p>
                </div>

                {interstateConfigError && <p className="text-red-400 text-sm">{interstateConfigError}</p>}
                {interstateConfigSuccess && <p className="text-emerald-400 text-sm">✓ {interstateConfigSuccess}</p>}

                <button
                  onClick={submitInterstateConfig}
                  disabled={interstateConfigSaving || pricingRateLoading || !pricingExchangeRate}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {interstateConfigSaving ? 'Saving…' : pricingRateLoading ? 'Loading rate…' : 'Save Configuration'}
                </button>
                <p className="text-xs text-gray-500 mt-2">Saving converts your local prices to Freti and immediately updates your interstate delivery profile.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Finance</h2>

            {walletLoading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
            ) : walletData ? (
              <>
                {/* Balance cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-effect rounded-xl p-5">
                    <p className="text-gray-400 text-sm">Available Balance</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-1">
                      {displayCurrency} {displayAmount(Number(walletData.wallet.availableBalance))}
                    </p>
                  </div>
                  <div className="glass-effect rounded-xl p-5">
                    <p className="text-gray-400 text-sm">Pending Withdrawal</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-1">
                      {displayCurrency} {displayAmount(Number(walletData.wallet.pendingWithdrawal))}
                    </p>
                  </div>
                  <div className="glass-effect rounded-xl p-5">
                    <p className="text-gray-400 text-sm">Total Earned</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {displayCurrency} {displayAmount(Number(walletData.wallet.totalEarned))}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Withdraw */}
                  <div className="glass-effect rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
                    {withdrawMessage && (
                      <p className={`text-sm mb-3 ${withdrawMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{withdrawMessage.text}</p>
                    )}
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm block mb-1">Amount ({displayCurrency})</label>
                        <input
                          type="number" min="0" placeholder="0.00"
                          value={withdrawAmount}
                          onChange={e => setWithdrawAmount(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm block mb-1">Bank Account</label>
                        <select
                          value={withdrawBankId}
                          onChange={e => setWithdrawBankId(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="">Select account…</option>
                          {bankAccounts.map(a => (
                            <option key={a.id} value={a.id}>{a.bankName} — {a.accountNumber} ({a.accountName})</option>
                          ))}
                        </select>
                      </div>
                      {bankAccounts.length === 0 && (
                        <p className="text-xs text-yellow-400">Add a bank account below before withdrawing.</p>
                      )}
                      <button
                        onClick={submitWithdrawal}
                        disabled={withdrawLoading || bankAccounts.length === 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {withdrawLoading ? 'Submitting…' : 'Request Withdrawal'}
                      </button>
                    </div>
                  </div>

                  {/* Bank Accounts */}
                  <div className="glass-effect rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Bank Accounts</h3>
                      <button
                        onClick={() => {
                          if (showAddBank) {
                            setShowAddBank(false)
                            resetAddBankForm()
                          } else {
                            setShowAddBank(true)
                            fetchBankList(bankForm.country || 'NG')
                          }
                        }}
                        className="text-sm text-emerald-400 hover:text-emerald-300"
                      >
                        {showAddBank ? 'Cancel' : '+ Add Account'}
                      </button>
                    </div>

                    {showAddBank && (
                      <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 mb-4 space-y-3">
                        {bankFormError && <p className="text-red-400 text-xs">{bankFormError}</p>}

                        {/* Country */}
                        <div>
                          <label className="text-gray-400 text-xs block mb-1">Country</label>
                          <select
                            value={bankForm.country}
                            onChange={e => handleBankCountryChange(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          >
                            {SUPPORTED_BANK_COUNTRIES.map(c => (
                              <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>
                            ))}
                          </select>
                        </div>

                        {/* Bank search + select */}
                        <div>
                          <label className="text-gray-400 text-xs block mb-1">Bank</label>
                          {bankListLoading ? (
                            <div className="flex items-center gap-2 text-gray-400 text-xs py-1">
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div> Loading banks…
                            </div>
                          ) : bankList.length > 0 ? (
                            <>
                              <input
                                placeholder="Search bank…"
                                value={bankSearchQuery}
                                onChange={e => setBankSearchQuery(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-white text-xs mb-1 focus:border-emerald-500 focus:outline-none"
                              />
                              <select
                                value={bankForm.bankCode}
                                onChange={e => handleBankSelection(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                              >
                                <option value="">Select a bank…</option>
                                {filteredBankList.map(b => (
                                  <option key={b.code} value={b.code}>{b.name}</option>
                                ))}
                              </select>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => fetchBankList(bankForm.country)}
                              className="text-xs text-emerald-400 hover:text-emerald-300"
                            >Load banks for {bankForm.country}</button>
                          )}
                        </div>

                        {/* Account number + verify */}
                        <div>
                          <label className="text-gray-400 text-xs block mb-1">Account Number</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={20}
                              placeholder="Enter account number"
                              value={bankForm.accountNumber}
                              onChange={e => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 20)
                                setBankForm(prev => ({ ...prev, accountNumber: val, accountName: '' }))
                                setVerifiedAccountPreview(null)
                                setBankVerifyError('')
                              }}
                              className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyBankAccount}
                              disabled={bankVerifyLoading || !bankForm.bankCode || bankForm.accountNumber.length < 10}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs rounded font-medium transition-colors whitespace-nowrap"
                            >
                              {bankVerifyLoading ? 'Verifying…' : 'Verify'}
                            </button>
                          </div>
                          {bankVerifyError && <p className="text-red-400 text-xs mt-1">{bankVerifyError}</p>}
                        </div>

                        {/* Verified account name */}
                        {verifiedAccountPreview && (
                          <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-700/40 rounded px-3 py-2">
                            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                              <p className="text-emerald-300 text-sm font-medium">{verifiedAccountPreview.accountName}</p>
                              <p className="text-emerald-500 text-xs">Account verified</p>
                            </div>
                          </div>
                        )}

                        {/* Account type + set default */}
                        <div className="flex gap-3 items-center">
                          <div className="flex-1">
                            <label className="text-gray-400 text-xs block mb-1">Account Type</label>
                            <select
                              value={bankForm.accountType}
                              onChange={e => setBankForm(prev => ({ ...prev, accountType: e.target.value }))}
                              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-white text-sm"
                            >
                              <option value="savings">Savings</option>
                              <option value="current">Current</option>
                              <option value="checking">Checking</option>
                            </select>
                          </div>
                          <label className="flex items-center gap-1.5 text-sm text-gray-300 mt-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={bankForm.isDefault}
                              onChange={e => setBankForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                              className="rounded"
                            />
                            Set as default
                          </label>
                        </div>

                        <button
                          onClick={submitAddBankAccount}
                          disabled={bankFormLoading || !verifiedAccountPreview}
                          className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded text-sm font-medium transition-colors"
                        >
                          {bankFormLoading ? 'Saving…' : 'Save Account'}
                        </button>
                      </div>
                    )}

                    {bankAccounts.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No bank accounts yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {bankAccounts.map(a => (
                          <div key={a.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                            <div>
                              <p className="text-sm font-medium">{a.bankName}</p>
                              <p className="text-xs text-gray-400">{a.accountNumber} · {a.accountName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {a.isDefault && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Default</span>}
                              <button onClick={() => deleteBank(a.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction History */}
                {walletData.recentWithdrawals?.length > 0 && (
                  <div className="glass-effect rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Withdrawal History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-400">
                            <th className="text-left py-2 px-3">Reference</th>
                            <th className="text-left py-2 px-3">Amount</th>
                            <th className="text-left py-2 px-3">Bank</th>
                            <th className="text-left py-2 px-3">Status</th>
                            <th className="text-left py-2 px-3">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {walletData.recentWithdrawals.map((w: any) => (
                            <tr key={w.id} className="border-b border-gray-800">
                              <td className="py-2 px-3 font-mono text-xs text-gray-400">{w.reference || '—'}</td>
                              <td className="py-2 px-3 font-medium">{w.currency} {Number(w.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                              <td className="py-2 px-3 text-gray-300">{w.bankAccount ? `${w.bankAccount.bankName} ···${w.bankAccount.accountNumber.slice(-4)}` : '—'}</td>
                              <td className="py-2 px-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  w.status === 'completed' ? 'bg-green-500/20 text-green-400'
                                  : w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400'
                                  : w.status === 'processing' ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-red-500/20 text-red-400'
                                }`}>{w.status}</span>
                              </td>
                              <td className="py-2 px-3 text-gray-400 text-xs">{new Date(w.requestedAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Could not load wallet data.</p>
                <button onClick={fetchWalletData} className="mt-3 text-emerald-400 hover:text-emerald-300 text-sm">Retry</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Settings</h2>
              {!editingProfile && (
                <button onClick={openEditProfile} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Edit Profile
                </button>
              )}
            </div>

            {!editingProfile ? (
              <div className="space-y-6">
                {/* Company Profile — view */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Company Profile</h3>
                  <div className="flex items-start gap-5 mb-4">
                    {dashboardData.partner.company_logo_url ? (
                      <img src={dashboardData.partner.company_logo_url} alt="Logo" className="h-16 w-16 rounded-lg object-cover border border-gray-700 shrink-0" />
                    ) : (
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-xs shrink-0">No Logo</div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 flex-1">
                      <div><p className="text-xs text-gray-400">Company Name</p><p className="text-white font-medium">{dashboardData.partner.company_name}</p></div>
                      <div><p className="text-xs text-gray-400">Username</p><p className="text-white font-medium">{dashboardData.partner.partner_username}</p></div>
                      <div><p className="text-xs text-gray-400">Contact Email</p><p className="text-white font-medium">{dashboardData.partner.contact_email}</p></div>
                      <div><p className="text-xs text-gray-400">Contact Phone</p><p className="text-white font-medium">{dashboardData.partner.contact_phone || '—'}</p></div>
                      <div><p className="text-xs text-gray-400">Website</p><p className="text-white font-medium">{dashboardData.partner.company_website || '—'}</p></div>
                      <div><p className="text-xs text-gray-400">Currency</p><p className="text-white font-medium">{dashboardData.partner.preferred_currency || 'NGN'}</p></div>
                      <div className="md:col-span-2"><p className="text-xs text-gray-400">Headquarters</p><p className="text-white font-medium">{dashboardData.partner.headquarters_address || '—'}</p></div>
                      <div><p className="text-xs text-gray-400">Partner Since</p><p className="text-white font-medium">{formatDate(dashboardData.partner.verified_at)}</p></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <Link href="/partners/change-password" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">Change Password →</Link>
                  </div>
                </div>

                {/* Service Areas — view */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
                  {(dashboardData.partner.service_areas || []).length === 0 ? (
                    <p className="text-gray-500 text-sm">No service areas defined.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(dashboardData.partner.service_areas || []).map(area => (
                        <span key={area} className="bg-emerald-600/20 text-emerald-300 px-3 py-1 rounded-full text-sm border border-emerald-600/30">{area}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Services Offered — view */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Services Offered</h3>
                  {(dashboardData.partner.service_categories || []).length === 0 ? (
                    <p className="text-gray-500 text-sm">No services listed.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(dashboardData.partner.service_categories || []).map(s => (
                        <span key={s} className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-600/30">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vehicle Fleet — view */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Vehicle Fleet</h3>
                  {Object.keys(dashboardData.partner.vehicle_fleet || {}).length === 0 ? (
                    <p className="text-gray-500 text-sm">No fleet information.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(dashboardData.partner.vehicle_fleet || {}).map(([type, data]: [string, any]) => (
                        <div key={type} className="bg-gray-800 rounded-lg p-3">
                          <p className="text-white font-medium capitalize">{type}</p>
                          <p className="text-emerald-400 text-2xl font-bold">{data?.count ?? 0}</p>
                          <p className="text-gray-400 text-xs">vehicles</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Documents — view */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Documents</h3>
                  <div className="space-y-2">
                    {([
                      { label: 'Registration Documents', urls: dashboardData.partner.registration_document_urls || [] },
                      { label: 'Insurance Documents', urls: dashboardData.partner.insurance_document_urls || [] },
                      { label: 'Fleet Documents', urls: dashboardData.partner.fleet_document_urls || [] },
                    ] as { label: string; urls: string[] }[]).map(({ label, urls }) => (
                      <div key={label} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-sm text-gray-300">{label}</span>
                        <span className={`text-sm font-medium ${urls.length > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {urls.length > 0 ? `${urls.length} file${urls.length > 1 ? 's' : ''}` : 'Not uploaded'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            ) : (
              <div className="space-y-6">
                {profileError && <div className="bg-red-900/40 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">{profileError}</div>}
                {profileSuccess && <div className="bg-green-900/40 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-sm">{profileSuccess}</div>}

                {/* 1. Company Profile — edit */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-5">Company Profile</h3>
                  <div className="mb-5">
                    <label className="block text-sm text-gray-400 mb-2">Company Logo</label>
                    <div className="flex items-center gap-4">
                      {profileLogoPreview ? (
                        <img src={profileLogoPreview} alt="Logo" className="h-16 w-16 rounded-lg object-cover border border-gray-700 shrink-0" />
                      ) : (
                        <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-xs shrink-0">No Logo</div>
                      )}
                      <div>
                        <input type="file" accept="image/*" id="profile-logo-upload" className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0] || null
                            setProfileLogoFile(file)
                            if (file) setProfileLogoPreview(URL.createObjectURL(file))
                          }}
                        />
                        <label htmlFor="profile-logo-upload" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Choose Logo
                        </label>
                        <p className="text-gray-500 text-xs mt-1">PNG, JPG up to 2MB</p>
                      </div>
                      {profileLogoPreview && (
                        <button type="button" onClick={() => { setProfileLogoFile(null); setProfileLogoPreview(null); setProfileForm(p => ({ ...p, companyLogoUrl: '' })) }} className="text-red-400 hover:text-red-300 text-sm">
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
                      <input type="email" value={profileForm.contactEmail} onChange={e => setProfileForm(p => ({ ...p, contactEmail: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Contact Phone</label>
                      <input type="tel" value={profileForm.contactPhone} onChange={e => setProfileForm(p => ({ ...p, contactPhone: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Company Website</label>
                      <input type="url" placeholder="https://" value={profileForm.companyWebsite} onChange={e => setProfileForm(p => ({ ...p, companyWebsite: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Currency</label>
                      <select value={profileForm.preferredCurrency} onChange={e => setProfileForm(p => ({ ...p, preferredCurrency: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                        <option value="NGN">NGN — Nigerian Naira</option>
                        <option value="USD">USD — US Dollar</option>
                        <option value="GBP">GBP — British Pound</option>
                        <option value="EUR">EUR — Euro</option>
                        <option value="GHS">GHS — Ghanaian Cedi</option>
                        <option value="KES">KES — Kenyan Shilling</option>
                        <option value="ZAR">ZAR — South African Rand</option>
                        <option value="EGP">EGP — Egyptian Pound</option>
                        <option value="ETB">ETB — Ethiopian Birr</option>
                        <option value="TZS">TZS — Tanzanian Shilling</option>
                        <option value="UGX">UGX — Ugandan Shilling</option>
                        <option value="RWF">RWF — Rwandan Franc</option>
                        <option value="XOF">XOF — West African CFA</option>
                        <option value="XAF">XAF — Central African CFA</option>
                        <option value="CAD">CAD — Canadian Dollar</option>
                        <option value="AUD">AUD — Australian Dollar</option>
                        <option value="INR">INR — Indian Rupee</option>
                        <option value="AED">AED — UAE Dirham</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-400 mb-1">Headquarters Address</label>
                    <textarea rows={2} value={profileForm.headquartersAddress} onChange={e => setProfileForm(p => ({ ...p, headquartersAddress: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                  </div>
                </div>

                {/* 2. Service Areas — edit */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-1">Service Areas</h3>
                  <p className="text-gray-400 text-sm mb-4">Select countries and states/provinces where you operate.</p>
                  <CountryStateSelector
                    selectedAreas={profileForm.serviceAreas}
                    onChange={areas => setProfileForm(p => ({ ...p, serviceAreas: areas }))}
                  />
                </div>

                {/* 3. Services Offered — edit */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-1">Services Offered</h3>
                  <p className="text-gray-400 text-sm mb-4">Select all delivery services you provide.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['Intracity Delivery','Intercity Delivery','Express Delivery','Cargo/Freight','Food Delivery','Grocery Delivery','Package Delivery','Document Delivery'] as string[]).map(svc => (
                      <label key={svc} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${profileForm.serviceCategories.includes(svc) ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                        <input
                          type="checkbox"
                          checked={profileForm.serviceCategories.includes(svc)}
                          onChange={e => setProfileForm(p => ({ ...p, serviceCategories: e.target.checked ? [...p.serviceCategories, svc] : p.serviceCategories.filter(s => s !== svc) }))}
                          className="rounded text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-sm">{svc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 4. Vehicle Fleet — edit */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-1">Vehicle Fleet</h3>
                  <p className="text-gray-400 text-sm mb-4">Enter the number of each vehicle type in your fleet. Set to 0 to remove.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {([
                      { key: 'wheelbarrow', label: 'Wheelbarrow', icon: '🛒' },
                      { key: 'bike', label: 'Bicycle', icon: '🚴' },
                      { key: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
                      { key: 'car', label: 'Car', icon: '🚗' },
                      { key: 'van', label: 'Van', icon: '🚐' },
                      { key: 'truck', label: 'Truck', icon: '🚚' },
                    ] as { key: string; label: string; icon: string }[]).map(({ key, label, icon }) => (
                      <div key={key} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{icon}</span>
                          <span className="text-sm font-medium text-white">{label}</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={profileForm.vehicleFleet[key] || 0}
                          onChange={e => setProfileForm(p => ({ ...p, vehicleFleet: { ...p.vehicleFleet, [key]: parseInt(e.target.value) || 0 } }))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Documents — edit */}
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-1">Documents</h3>
                  <p className="text-gray-400 text-sm mb-4">Upload new or replacement documents. Files already on record are shown.</p>
                  <div className="space-y-4">
                    {([
                      { type: 'registration' as const, label: 'Registration Documents', desc: 'Business registration, tax clearance, etc.', urls: profileForm.registrationDocUrls },
                      { type: 'insurance' as const, label: 'Insurance Documents', desc: 'Vehicle/liability insurance, etc.', urls: profileForm.insuranceDocUrls },
                      { type: 'fleet' as const, label: 'Fleet Documents', desc: 'Vehicle registration, fleet photos, etc.', urls: profileForm.fleetDocUrls },
                    ]).map(({ type, label, desc, urls }) => (
                      <div key={type} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-white">{label}</p>
                            <p className="text-xs text-gray-500">{desc}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${urls.length > 0 ? 'bg-emerald-900/40 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                            {urls.length > 0 ? `${urls.length} uploaded` : 'None'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <input type="file" id={`doc-upload-${type}`} className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => handleProfileDocUpload(e, type)} disabled={profileDocUploading === type} />
                          <label htmlFor={`doc-upload-${type}`} className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${profileDocUploading === type ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-600 text-white'}`}>
                            {profileDocUploading === type ? 'Uploading…' : 'Upload Files'}
                          </label>
                          {urls.length > 0 && (
                            <button type="button" className="text-red-400 hover:text-red-300 text-sm"
                              onClick={() => {
                                if (type === 'registration') setProfileForm(p => ({ ...p, registrationDocUrls: [] }))
                                else if (type === 'insurance') setProfileForm(p => ({ ...p, insuranceDocUrls: [] }))
                                else setProfileForm(p => ({ ...p, fleetDocUrls: [] }))
                              }}>
                              Clear All
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save / Cancel */}
                <div className="flex gap-3 pb-4">
                  <button onClick={submitEditProfile} disabled={profileLoading} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    {profileLoading ? 'Saving…' : 'Save All Changes'}
                  </button>
                  <button onClick={() => setEditingProfile(false)} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Action Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-lg font-bold mb-2">
              {confirmModal.action === 'terminate' ? 'Terminate Rider' : 'Suspend Rider'}
            </h3>
            <p className="text-gray-400 text-sm mb-1">
              {confirmModal.action === 'terminate'
                ? <>Are you sure you want to terminate <span className="text-white font-medium">{confirmModal.riderName}</span>? This action <span className="text-red-400 font-medium">cannot be undone</span>.</>
                : <>Are you sure you want to suspend <span className="text-white font-medium">{confirmModal.riderName}</span>?</>}
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  updateRiderStatus(confirmModal.riderId, confirmModal.action)
                  setConfirmModal(null)
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors text-white ${confirmModal.action === 'terminate' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
              >
                {confirmModal.action === 'terminate' ? 'Yes, Terminate' : 'Yes, Suspend'}
              </button>
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Rider Modal */}
      {showAddRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold">Add Rider</h3>
              <button
                onClick={() => { setShowAddRider(false); setAddRiderError(''); setAddRiderSuccess(''); setLicenseFile(null); setLicensePreview(null) }}
                className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              {addRiderError && (
                <div className="bg-red-900/40 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">{addRiderError}</div>
              )}
              {addRiderSuccess && (
                <div className="bg-green-900/40 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-sm">{addRiderSuccess}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={riderForm.full_name}
                    onChange={e => setRiderForm(p => ({ ...p, full_name: e.target.value }))}
                    placeholder="e.g. James Wilson"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Vehicle Type <span className="text-red-400">*</span></label>
                  <select
                    value={riderForm.vehicle_type}
                    onChange={e => setRiderForm(p => ({ ...p, vehicle_type: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Van">Van</option>
                    <option value="Car">Car</option>
                    <option value="Truck">Truck</option>
                    <option value="Tricycle">Tricycle</option>
                    <option value="Wheelbarrow">Wheelbarrow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Country <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={riderForm.country}
                    onChange={e => setRiderForm(p => ({ ...p, country: e.target.value }))}
                    placeholder="e.g. Nigeria"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">State / Region <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={riderForm.state}
                    onChange={e => setRiderForm(p => ({ ...p, state: e.target.value }))}
                    placeholder="e.g. Lagos"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    value={riderForm.city}
                    onChange={e => setRiderForm(p => ({ ...p, city: e.target.value }))}
                    placeholder="e.g. Ikeja"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Vehicle Make</label>
                  <input
                    type="text"
                    value={riderForm.vehicle_make}
                    onChange={e => setRiderForm(p => ({ ...p, vehicle_make: e.target.value }))}
                    placeholder="e.g. Honda"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    value={riderForm.vehicle_model}
                    onChange={e => setRiderForm(p => ({ ...p, vehicle_model: e.target.value }))}
                    placeholder="e.g. CB150"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Vehicle Year</label>
                  <input
                    type="number"
                    value={riderForm.vehicle_year}
                    onChange={e => setRiderForm(p => ({ ...p, vehicle_year: e.target.value }))}
                    placeholder="e.g. 2021"
                    min="1990"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">License Plate</label>
                  <input
                    type="text"
                    value={riderForm.license_plate}
                    onChange={e => setRiderForm(p => ({ ...p, license_plate: e.target.value }))}
                    placeholder="e.g. ABC-123-XY"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={riderForm.years_experience}
                    onChange={e => setRiderForm(p => ({ ...p, years_experience: e.target.value }))}
                    placeholder="e.g. 3"
                    min="0"
                    max="50"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">
                    Driver&apos;s License
                    <span className="ml-1 text-gray-500 font-normal">(JPG, PNG, WebP or PDF · max 5MB)</span>
                  </label>
                  <div
                    className="relative border-2 border-dashed border-gray-600 hover:border-emerald-500 rounded-lg p-4 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('license-upload')?.click()}
                  >
                    <input
                      id="license-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      className="sr-only"
                      onChange={handleLicenseFileChange}
                    />
                    {licenseFile ? (
                      <div className="flex items-center gap-3">
                        {licensePreview ? (
                          <img src={licensePreview} alt="License preview" className="h-16 w-24 object-cover rounded border border-gray-600 flex-shrink-0" />
                        ) : (
                          <div className="h-16 w-24 flex items-center justify-center bg-gray-700 rounded border border-gray-600 flex-shrink-0">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm text-white font-medium truncate">{licenseFile.name}</p>
                          <p className="text-xs text-gray-400">{(licenseFile.size / 1024).toFixed(0)} KB</p>
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); setLicenseFile(null); setLicensePreview(null) }}
                            className="text-xs text-red-400 hover:text-red-300 mt-1"
                          >Remove</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 py-2 text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-sm">Click to upload license photo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-700">
              <button
                onClick={submitAddRider}
                disabled={addRiderLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                {addRiderLoading ? 'Submitting…' : 'Add Rider'}
              </button>
              <button
                onClick={() => { setShowAddRider(false); setAddRiderError(''); setAddRiderSuccess(''); setLicenseFile(null); setLicensePreview(null) }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
