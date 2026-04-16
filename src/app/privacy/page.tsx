'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('overview')

  const handleDownloadClick = () => {
    // Handle download click - could open modal or navigate to download page
    console.log('Download clicked')
  }

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'collection', title: 'Information We Collect', icon: '📊' },
    { id: 'usage', title: 'How We Use Your Information', icon: '🎯' },
    { id: 'sharing', title: 'Information Sharing', icon: '🤝' },
    { id: 'security', title: 'Data Security', icon: '🔒' },
    { id: 'rights', title: 'Your Rights', icon: '⚖️' },
    { id: 'cookies', title: 'Cookies & Tracking', icon: '🍪' },
    { id: 'international', title: 'International Data', icon: '🌍' },
    { id: 'children', title: 'Children\'s Privacy', icon: '👶' },
    { id: 'changes', title: 'Policy Changes', icon: '🔄' },
    { id: 'contact', title: 'Contact Us', icon: '📧' }
  ]

  return (
    <main className="min-h-screen bg-black">
      <Header onDownloadClick={handleDownloadClick} />
      
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="neon-text text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-white/50 text-sm mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="glass-effect rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`text-left p-3 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{section.icon}</span>
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="glass-effect rounded-2xl p-8">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <div className="text-white/80 space-y-4">
                <p>
                  Fretiko ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website fretiko.com and use our mobile application (the "Services").
                </p>
                <p>
                  By using our Services, you agree to the collection and use of information in accordance with this policy. If you disagree with any part of this policy, you should not use our Services.
                </p>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Key Points:</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/70">
                    <li>We collect information to provide and improve our Services</li>
                    <li>We never sell your personal information to third parties</li>
                    <li>You have control over your data and privacy settings</li>
                    <li>We use industry-standard security measures to protect your information</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'collection' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <div className="text-white/80 space-y-4">
                <p>We collect several types of information to provide and improve our Services:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔐 Personal Information</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Name and contact information (email, phone number)</li>
                      <li>Account credentials (username, password)</li>
                      <li>Profile information and preferences</li>
                      <li>Payment information (processed securely by Flutterwave)</li>
                      <li>Government-issued ID (for KYC verification when required)</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📱 Device & Usage Information</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Device type, operating system, and unique device identifiers</li>
                      <li>IP address and location information</li>
                      <li>App usage patterns and interactions</li>
                      <li>Performance data and crash reports</li>
                      <li>Shopping Credits transaction history</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📷 Content & Communications</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Photos, videos, and other content you upload</li>
                      <li>Messages and communications with other users</li>
                      <li>Reviews, ratings, and feedback</li>
                      <li>Social media connections and preferences</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🛍️ Transaction Data</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Product and service listings</li>
                      <li>Order history and delivery information</li>
                      <li>Shopping Credits balance and transactions</li>
                      <li>Payment processing data (via Flutterwave)</li>
                      <li>Service bookings and schedules</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📊 Marketing Data</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Email subscription preferences</li>
                      <li>Interaction with promotions, notifications, and ads</li>
                      <li>Live commerce participation and bidding history</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'usage' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <div className="text-white/80 space-y-4">
                <p>We use your information for specific purposes to provide our marketplace services:</p>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">🎯 Core Platform Services</h3>
                  <ul className="list-disc list-inside space-y-1 text-white/70">
                    <li>Provide and improve Platform services</li>
                    <li>Process transactions and manage Shopping Credits</li>
                    <li>Facilitate communication between Buyers and Vendors</li>
                    <li>Coordinate delivery services through Riders</li>
                    <li>Enable live commerce and bidding features</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">🔧 Personalization & Experience</h3>
                  <ul className="list-disc list-inside space-y-1 text-white/70">
                    <li>Personalize your experience and recommendations</li>
                    <li>Send notices, updates, and marketing messages (if consented)</li>
                    <li>Improve user interface and app functionality</li>
                    <li>Provide relevant product and service suggestions</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">�️ Safety & Compliance</h3>
                  <ul className="list-disc list-inside space-y-1 text-white/70">
                    <li>Comply with legal obligations, including anti-fraud, KYC, and regulatory requirements</li>
                    <li>Protect the rights, property, or safety of Fretiko, users, or third parties</li>
                    <li>Prevent fraudulent activities and enforce platform policies</li>
                    <li>Conduct background checks and risk assessments where required</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">� Payment Processing</h3>
                  <ul className="list-disc list-inside space-y-1 text-white/70">
                    <li>Process Shopping Credits transactions via Flutterwave</li>
                    <li>Handle commission deductions (10% from Vendors)</li>
                    <li>Manage payout requests and conversions</li>
                    <li>Maintain transaction records for regulatory compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sharing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
              <div className="text-white/80 space-y-4">
                <p>We may share your information with specific parties for platform operations:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🏢 Service Providers</h3>
                    <p className="text-white/70">We share information with trusted third-party service providers:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 mt-2">
                      <li><strong>Payment processors:</strong> Flutterwave for payment processing and Shopping Credits conversion</li>
                      <li><strong>Cloud hosting:</strong> Infrastructure and data storage services</li>
                      <li><strong>Analytics:</strong> Performance monitoring and user behavior analysis</li>
                      <li><strong>Customer support:</strong> Communication and help desk services</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">👥 Platform Users</h3>
                    <p className="text-white/70">Information is shared between platform participants:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 mt-2">
                      <li><strong>Vendors and Buyers:</strong> Relevant transaction data for fulfilling orders or services</li>
                      <li><strong>Delivery coordination:</strong> Rider information for delivery logistics</li>
                      <li><strong>Communication:</strong> Messages between transaction participants</li>
                      <li><strong>Reviews and ratings:</strong> Public feedback between users</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">⚖️ Legal Requirements</h3>
                    <p className="text-white/70">We may disclose information when required:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 mt-2">
                      <li>Court orders and legal proceedings</li>
                      <li>Government investigations and regulatory compliance</li>
                      <li>Anti-fraud and security requirements</li>
                      <li>Protection of rights, property, or safety</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔄 Business Transfers</h3>
                    <p className="text-white/70">Information may be transferred in business events:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 mt-2">
                      <li>If Fretiko is sold or merged</li>
                      <li>During asset acquisitions</li>
                      <li>With proper notice and data protection measures</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                  <p className="text-green-300 text-sm">
                    <strong>Important:</strong> We do not sell your personal data to third parties for marketing purposes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <div className="text-white/80 space-y-4">
                <p>We implement industry-standard security measures to protect your information:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔐 Technical Security</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>SSL/TLS encryption for data transmission</li>
                      <li>AES-256 encryption for data storage</li>
                      <li>Secure authentication protocols</li>
                      <li>Regular security audits and penetration testing</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🛡️ Access Controls</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Role-based access permissions</li>
                      <li>Multi-factor authentication for staff</li>
                      <li>Regular access reviews and audits</li>
                      <li>Background checks for employees</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📋 Compliance</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>GDPR compliance measures</li>
                      <li>CCPA compliance</li>
                      <li>Regular compliance training</li>
                      <li>Privacy by design principles</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔄 Data Management</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Regular data backups</li>
                      <li>Secure data disposal procedures</li>
                      <li>Data minimization practices</li>
                      <li>Retention policy enforcement</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Note:</strong> While we take reasonable measures to protect your information, no method of transmission over the internet is 100% secure.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'rights' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <div className="text-white/80 space-y-4">
                <p>You have the following rights regarding your personal information:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">👁️ Access Rights</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Request a copy of your personal information</li>
                      <li>Know what information we collect about you</li>
                      <li>Understand how we use your data</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">✏️ Correction Rights</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Update inaccurate personal information</li>
                      <li>Complete incomplete information</li>
                      <li>Request deletion of outdated data</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🗑️ Deletion Rights</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Request deletion of your personal information</li>
                      <li>Delete your account and associated data</li>
                      <li>Opt-out of data collection and processing</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🚫 Control Rights</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Opt-out of marketing communications</li>
                      <li>Control cookie and tracking preferences</li>
                      <li>Manage privacy settings in your account</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                  <p className="text-green-300 text-sm">
                    <strong>How to Exercise Your Rights:</strong> Contact us at privacy@fretiko.com or use the privacy settings in your account dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'cookies' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Cookies & Tracking</h2>
              <div className="text-white/80 space-y-4">
                <p>We use cookies and similar technologies to enhance your experience:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🍪 Essential Cookies</h3>
                    <p className="text-white/70">Required for basic website functionality:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 mt-2">
                      <li>User authentication and session management</li>
                      <li>Security and fraud prevention</li>
                      <li>Shopping cart and order processing</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📊 Analytics Cookies</h3>
                    <p className="text-white/70">Help us understand how you use our Services:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 mt-2">
                      <li>Page views and user behavior analysis</li>
                      <li>Performance monitoring and optimization</li>
                      <li>Error tracking and debugging</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🎯 Personalization Cookies</h3>
                    <p className="text-white/70">Provide personalized experiences:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 mt-2">
                      <li>Content recommendations</li>
                      <li>Remembered preferences and settings</li>
                      <li>Targeted features and promotions</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
                  <p className="text-orange-300 text-sm">
                    <strong>Cookie Control:</strong> You can manage cookie preferences through your browser settings or our privacy dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'international' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">International Data Transfers</h2>
              <div className="text-white/80 space-y-4">
                <p>Your information may be transferred and processed internationally:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🌍 Global Operations</h3>
                    <p className="text-white/70">We operate globally and may transfer data to:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 mt-2">
                      <li>Cloud service providers in multiple countries</li>
                      <li>International team members for support</li>
                      <li>Global analytics and monitoring services</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🛡️ Protection Measures</h3>
                    <p className="text-white/70">We ensure adequate protection through:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70 mt-2">
                      <li>Standard contractual clauses (SCCs)</li>
                      <li>Adequacy decisions for approved countries</li>
                      <li>Binding corporate rules (BCRs)</li>
                      <li>Regular compliance audits</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                  <p className="text-purple-300 text-sm">
                    <strong>Your Rights:</strong> Your privacy rights remain the same regardless of where your data is processed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'children' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
              <div className="text-white/80 space-y-4">
                <p>Our Services are intended for adults only:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">👶 Age Restrictions</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Users must be <strong>18 years or older</strong> to use the Platform</li>
                      <li>We do not knowingly collect personal information from anyone under 18</li>
                      <li>Accounts found to be under 18 will be terminated immediately</li>
                      <li>Some features may have higher age requirements</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">👪 Parental Controls</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Parents should monitor their children's internet usage</li>
                      <li>We do not provide parental control features</li>
                      <li>No special protections for underage users</li>
                      <li>Parents can report underage accounts for removal</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                  <p className="text-red-300 text-sm">
                    <strong>Strict Enforcement:</strong> We actively verify age when possible and will immediately terminate accounts of users under 18. This is a zero-tolerance policy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'changes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Policy Changes</h2>
              <div className="text-white/80 space-y-4">
                <p>We may update this Privacy Policy from time to time:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔄 Update Process</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>We will notify users of significant changes</li>
                      <li>Updated policy will be posted on our website</li>
                      <li>Email notifications for major changes</li>
                      <li>In-app notifications for active users</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📅 Effective Date</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Changes take effect immediately upon posting</li>
                      <li>Continued use indicates acceptance</li>
                      <li>Major changes may require explicit consent</li>
                      <li>Previous versions archived for reference</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Stay Informed:</strong> Check this page regularly for updates or subscribe to our newsletter for policy change notifications.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <div className="text-white/80 space-y-4">
                <p>If you have questions about this Privacy Policy or your rights:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📧 Privacy Questions</h3>
                    <ul className="space-y-2 text-white/70">
                      <li><strong>Email:</strong> support@fretiko.com</li>
                      <li><strong>Response Time:</strong> Within 30 days</li>
                      <li><strong>For:</strong> Privacy inquiries, data rights</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🏢 General Contact</h3>
                    <ul className="space-y-2 text-white/70">
                      <li><strong>Email:</strong> support@fretiko.com</li>
                      <li><strong>Phone:</strong> +234-8147308687</li>
                      <li><strong>Phone:</strong> +234-8162525349</li>
                      <li><strong>Hours:</strong> Mon-Fri, 9AM-6PM WAT</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📍 Mailing Address</h3>
                    <ul className="space-y-2 text-white/70">
                      <li>Fretiko Limited</li>
                      <li>Port Harcourt, Nigeria</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🛡️ Data Protection Officer</h3>
                    <ul className="space-y-2 text-white/70">
                      <li><strong>Email:</strong> support@fretiko.com</li>
                      <li><strong>For:</strong> GDPR/CCPA requests</li>
                      <li><strong>Response:</strong> Within 45 days</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                  <p className="text-green-300 text-sm">
                    <strong>Quick Response:</strong> For urgent privacy concerns, mark your email as "URGENT" and we will respond within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="glass-effect rounded-2xl p-6">
            <p className="text-white/60 mb-4">
              This Privacy Policy is part of our commitment to transparency and user privacy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/terms" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                Contact Us
              </Link>
              <Link href="/support" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                Support Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
