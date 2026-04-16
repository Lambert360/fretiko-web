'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'

interface PartnerData {
  id: string
  company_name: string
  partner_username: string
  contact_email: string
  contact_phone?: string
  service_areas: string[]
  partner_status: string
  verified_at: string
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
  recentDeliveries: any[]
  performanceMetrics: {
    weeklyDeliveries: number
    weeklyRevenue: number
    averageRating: number
    onTimeRate: number
    customerSatisfaction: number
  }
}

export default function PartnerDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = () => {
    const token = localStorage.getItem('partner_token')
    if (!token) {
      router.push('/partners/login')
      return
    }
    fetchDashboardData(token)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NGN', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
            {['overview', 'riders', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                <p className="text-green-400 text-sm">+12% from last month</p>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">Total Deliveries</h3>
                  <div className="text-emerald-400 text-2xl">📦</div>
                </div>
                <p className="text-3xl font-bold">{dashboardData.statistics.totalDeliveries}</p>
                <p className="text-green-400 text-sm">+8% from last month</p>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">Total Revenue</h3>
                  <div className="text-emerald-400 text-2xl">💰</div>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(dashboardData.statistics.totalRevenue)}</p>
                <p className="text-green-400 text-sm">+15% from last month</p>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">On-Time Rate</h3>
                  <div className="text-emerald-400 text-2xl">⏰</div>
                </div>
                <p className="text-3xl font-bold">{dashboardData.statistics.onTimeDeliveryRate}%</p>
                <p className="text-green-400 text-sm">+2% from last month</p>
              </div>
            </div>

            {/* Recent Deliveries */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Recent Deliveries</h2>
              <div className="space-y-4">
                {dashboardData.recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-semibold">{delivery.customerName}</p>
                      <p className="text-gray-400 text-sm">{delivery.deliveryAddress}</p>
                    </div>
                    <div className="text-right">
                      <p className={`px-3 py-1 rounded-full text-sm ${
                        delivery.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {delivery.status}
                      </p>
                      <p className="text-gray-400 text-sm">{delivery.riderName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'riders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Rider Management</h2>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                Add Rider
              </button>
            </div>
            
            <div className="glass-effect rounded-xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Vehicle Type</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Deliveries</th>
                      <th className="text-left py-3 px-4">Rating</th>
                      <th className="text-left py-3 px-4">On-Time Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock rider data */}
                    <tr className="border-b border-gray-800">
                      <td className="py-3 px-4">James Wilson</td>
                      <td className="py-3 px-4">Motorcycle</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4">156</td>
                      <td className="py-3 px-4">⭐ 4.8</td>
                      <td className="py-3 px-4">95.2%</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 px-4">Michael Brown</td>
                      <td className="py-3 px-4">Van</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4">142</td>
                      <td className="py-3 px-4">⭐ 4.6</td>
                      <td className="py-3 px-4">92.8%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Analytics Overview</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weekly Deliveries</span>
                    <span className="font-semibold">{dashboardData.performanceMetrics.weeklyDeliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weekly Revenue</span>
                    <span className="font-semibold">{formatCurrency(dashboardData.performanceMetrics.weeklyRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Rating</span>
                    <span className="font-semibold">⭐ {dashboardData.performanceMetrics.averageRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Customer Satisfaction</span>
                    <span className="font-semibold">{dashboardData.performanceMetrics.customerSatisfaction}%</span>
                  </div>
                </div>
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
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Settings</h2>
            
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                  <p className="text-white">{dashboardData.partner.company_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <p className="text-white">{dashboardData.partner.partner_username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                  <p className="text-white">{dashboardData.partner.contact_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Partner Since</label>
                  <p className="text-white">{formatDate(dashboardData.partner.verified_at)}</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-700">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
