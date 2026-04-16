'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'

export default function PartnershipPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Header onDownloadClick={() => {}} />
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Partner with Fretiko
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join our growing logistics network and expand your business reach
          </p>
          
          {/* Partnership Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PartnershipCard
              title="Become Our Logistics Partner"
              description="Join our delivery network and reach more customers with your fleet"
              features={[
                "Access to thousands of delivery requests",
                "Flexible scheduling and route optimization", 
                "Competitive compensation rates",
                "Real-time tracking and support"
              ]}
              onClick={() => router.push('/partnership/logistics')}
              icon="🚚"
              color="emerald"
            />
            <PartnershipCard
              title="Become a Partner"
              description="Explore other partnership opportunities and grow with us"
              features={[
                "Strategic business collaborations",
                "Technology integration partnerships",
                "Marketing and promotional opportunities",
                "Custom partnership solutions"
              ]}
              onClick={() => router.push('/partnership/general')}
              icon="🤝"
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Partner with Fretiko?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard
              icon="📈"
              title="Grow Your Business"
              description="Access our growing customer base and increase your delivery volume"
            />
            <BenefitCard
              icon="🛡️"
              title="Secure & Reliable"
              description="Built-in insurance coverage and secure payment processing"
            />
            <BenefitCard
              icon="📱"
              title="Easy Integration"
              description="Seamless integration with our mobile app and management tools"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of partners already growing with Fretiko
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/partnership/logistics')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Apply as Logistics Partner
            </button>
            <button
              onClick={() => router.push('/partnership/general')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore Other Partnerships
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

interface PartnershipCardProps {
  title: string
  description: string
  features: string[]
  onClick: () => void
  icon: string
  color: 'emerald' | 'blue'
}

function PartnershipCard({ title, description, features, onClick, icon, color }: PartnershipCardProps) {
  const colorClasses = {
    emerald: 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800',
    blue: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
  }

  return (
    <div 
      onClick={onClick}
      className="cursor-pointer transform transition-all duration-300 hover:scale-105"
    >
      <div className={`bg-gradient-to-br ${colorClasses[color]} p-8 rounded-2xl shadow-2xl`}>
        <div className="text-6xl mb-6 text-center">{icon}</div>
        <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
        <p className="text-gray-100 mb-6 text-center">{description}</p>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-300 mr-2">✓</span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <span className="bg-white/20 px-6 py-2 rounded-full text-sm font-semibold">
            Learn More →
          </span>
        </div>
      </div>
    </div>
  )
}

interface BenefitCardProps {
  icon: string
  title: string
  description: string
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
