'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('overview')

  const handleDownloadClick = () => {
    // Handle download click - could open modal or navigate to download page
    console.log('Download clicked')
  }

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'acceptance', title: 'Acceptance of Terms', icon: '✅' },
    { id: 'services', title: 'Our Services', icon: '🚀' },
    { id: 'accounts', title: 'User Accounts', icon: '👤' },
    { id: 'conduct', title: 'User Conduct', icon: '📜' },
    { id: 'content', title: 'Content & Intellectual Property', icon: '📝' },
    { id: 'payments', title: 'Payments & Refunds', icon: '💳' },
    { id: 'privacy', title: 'Privacy', icon: '🔒' },
    { id: 'termination', title: 'Termination', icon: '🚫' },
    { id: 'disclaimers', title: 'Disclaimers', icon: '⚠️' },
    { id: 'liability', title: 'Limitation of Liability', icon: '🛡️' },
    { id: 'disputes', title: 'Dispute Resolution', icon: '⚖️' },
    { id: 'changes', title: 'Changes to Terms', icon: '🔄' },
    { id: 'contact', title: 'Contact', icon: '📧' }
  ]

  return (
    <main className="min-h-screen bg-black">
      <Header onDownloadClick={handleDownloadClick} />
      
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="neon-text text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            These terms govern your use of Fretiko's services and establish the rules for using our platform.
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
                  Welcome to Fretiko! These Terms of Service ("Terms") govern your access to and use of our mobile application, website, and related services (collectively, the "Services").
                </p>
                <p>
                  By using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our Services.
                </p>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">What's Included:</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/70">
                    <li>Social networking and content sharing features</li>
                    <li>E-commerce and marketplace functionality</li>
                    <li>Payment processing and financial services</li>
                    <li>Delivery and logistics coordination</li>
                    <li>Customer support and dispute resolution</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'acceptance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
              <div className="text-white/80 space-y-4">
                <p>By using our Services, you represent and warrant that:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">✅ Eligibility Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>You are at least <strong>18 years of age</strong> (or higher in your jurisdiction)</li>
                      <li>You have the legal capacity to enter into these Terms</li>
                      <li>You are not barred from using our Services under applicable laws</li>
                      <li>You will provide accurate and complete information</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📋 Agreement</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>You have read, understood, and agree to be bound by these Terms</li>
                      <li>You agree to comply with all applicable laws and regulations</li>
                      <li>You accept our Privacy Policy and other referenced policies</li>
                      <li>You acknowledge that this is a legally binding agreement</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                  <p className="text-yellow-300 text-sm">
                    <strong>Important:</strong> If you are using the Services on behalf of a company or organization, you represent and warrant that you have the authority to bind that entity to these Terms.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'services' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Our Services</h2>
              <div className="text-white/80 space-y-4">
                <p>Fretiko provides a comprehensive marketplace super-app including:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🛍️ E-commerce Marketplace</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Product browsing and discovery</li>
                      <li>Shopping cart and checkout with Shopping Credits</li>
                      <li>Order tracking and management</li>
                      <li>Product reviews and ratings</li>
                      <li>Live commerce bidding and auctions</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">👥 Social Networking</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>User profiles and connections</li>
                      <li>Content sharing and discovery</li>
                      <li>Messaging and communication</li>
                      <li>Social recommendations</li>
                      <li>Community features</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">💳 Financial Services</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Shopping Credits in-platform currency</li>
                      <li>Secure payment processing via Flutterwave</li>
                      <li>Transaction history and management</li>
                      <li>Shopping Credits to real currency conversion</li>
                      <li>Commission processing (10% from Vendors)</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🚚 Logistics & Delivery</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Delivery coordination through Riders</li>
                      <li>Real-time tracking and status updates</li>
                      <li>Delivery scheduling and management</li>
                      <li>Rider-Vendor-Buyer communication</li>
                      <li>Independent contractor delivery network</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Platform Role:</strong> Fretiko acts as a marketplace facilitator, connecting Buyers, Vendors, and Riders. We are not the seller or service provider for transactions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'accounts' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">User Accounts & Relationships</h2>
              <div className="text-white/80 space-y-4">
                <p>Fretiko connects different types of users on our marketplace platform:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">� General Users</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Users must be <strong>18 years or older</strong> to create accounts</li>
                      <li>Provide accurate, complete, and current information</li>
                      <li>Choose a strong password and keep it secure</li>
                      <li>Provide valid contact information</li>
                      <li>Verify email address when required</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🏪 Vendors (Sellers)</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li><strong>Independent Contractors:</strong> Vendors are independent contractors, not employees</li>
                      <li>No employment, agency, partnership, or joint venture relationship</li>
                      <li>Responsible for own taxes, insurance, licenses, and regulatory compliance</li>
                      <li>10% commission charged on all Platform transactions</li>
                      <li>Shopping Credits can be converted to real funds via Flutterwave</li>
                      <li>Generally no KYC required unless mandated by law or for fraud prevention</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🚚 Riders (Delivery Partners)</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li><strong>Independent Contractors:</strong> Riders are independent contractors or companies</li>
                      <li>No employment relationship with Fretiko</li>
                      <li>Responsible for own taxes, insurance, licenses, and regulatory compliance</li>
                      <li>Must provide own vehicles, devices, uniforms, and PPE</li>
                      <li>Payment per delivery or via agreed commission structure</li>
                      <li>Assume all risk during delivery operations</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🛡️ Account Security</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>You are responsible for maintaining account security</li>
                      <li>Immediately report unauthorized access or suspicious activity</li>
                      <li>Do not share account credentials with others</li>
                      <li>Keep contact information updated</li>
                      <li>Use two-factor authentication when available</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
                  <p className="text-orange-300 text-sm">
                    <strong>Important:</strong> Fretiko does not provide employment benefits or assume liability beyond what is specified in these agreements. All Vendors and Riders are independent contractors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'conduct' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">User Conduct</h2>
              <div className="text-white/80 space-y-4">
                <p>You agree to use our Services responsibly and in accordance with these guidelines:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">✅ Permitted Activities</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Use Services for personal, commercial purposes</li>
                      <li>Create and share original content</li>
                      <li>Engage with other users respectfully</li>
                      <li>Provide feedback and suggestions</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🚫 Prohibited Activities</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Violating any applicable laws or regulations</li>
                      <li>Infringing on intellectual property rights</li>
                      <li>Harassing, threatening, or abusing other users</li>
                      <li>Posting false, misleading, or fraudulent content</li>
                      <li>Attempting to gain unauthorized access to our systems</li>
                      <li>Using automated tools to access our Services</li>
                      <li>Interfering with or disrupting our Services</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
                  <p className="text-orange-300 text-sm">
                    <strong>Consequences:</strong> Violation of these conduct guidelines may result in account suspension, content removal, or legal action.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'content' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Content & Intellectual Property</h2>
              <div className="text-white/80 space-y-4">
                <p>Our Services involve various types of content and intellectual property:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📝 Your Content</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>You retain ownership of content you create and share</li>
                      <li>You grant us a license to use your content as described</li>
                      <li>You are responsible for the content you post</li>
                      <li>You must have the right to share any content you post</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🎯 Our License to Your Content</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Worldwide, non-exclusive, royalty-free license</li>
                      <li>Right to use, reproduce, modify, and distribute</li>
                      <li>Right to display and perform your content</li>
                      <li>License continues even after you delete your account</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🛡️ Our Content</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Our Services and original content are protected by intellectual property laws</li>
                      <li>You may not use our content without permission</li>
                      <li>Trademarks, logos, and brand elements are our property</li>
                      <li>Third-party content is used with permission</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                  <p className="text-purple-300 text-sm">
                    <strong>Copyright Policy:</strong> We respond to copyright infringement claims in accordance with the Digital Millennium Copyright Act (DMCA).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Payments & Shopping Credits</h2>
              <div className="text-white/80 space-y-4">
                <p>Our payment system uses Shopping Credits and Flutterwave integration:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">💳 Shopping Credits System</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li><strong>In-Platform Currency:</strong> Shopping Credits are used for all transactions</li>
                      <li><strong>Payment Processing:</strong> Handled securely by Flutterwave</li>
                      <li><strong>Conversion:</strong> Shopping Credits can be converted to real funds via Flutterwave</li>
                      <li><strong>Transaction Records:</strong> All transactions are recorded and tracked</li>
                      <li><strong>Regulatory Compliance:</strong> Records maintained for minimum 7 years</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🏪 Vendor Commission Structure</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li><strong>10% Commission:</strong> Fretiko charges 10% on all Platform transactions</li>
                      <li><strong>Automatic Deduction:</strong> Commissions deducted from Shopping Credits earned</li>
                      <li><strong>Fee Adjustments:</strong> Fretiko reserves right to adjust fees with prior notice</li>
                      <li><strong>Transparent Pricing:</strong> All fees clearly displayed before transactions</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔄 Refund Policy</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li><strong>14-Day Window:</strong> Refund requests must be submitted within 14 days</li>
                      <li><strong>Shopping Credits:</strong> Refunds credited back to user's account</li>
                      <li><strong>Conversion:</strong> Refunded Shopping Credits can be converted via Flutterwave</li>
                      <li><strong>Platform Only:</strong> Only Platform transactions covered by refund policy</li>
                      <li><strong>Dispute Resolution:</strong> Fretiko may mediate but not obligated to favor either party</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">⚠️ Payment Disputes</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li><strong>Third-Party Processor:</strong> Fretiko not liable for Flutterwave delays</li>
                      <li><strong>Evidence Required:</strong> Both parties must provide supporting documentation</li>
                      <li><strong>7-Day Response:</strong> Vendors given 7 days to respond to disputes</li>
                      <li><strong>Arbitration:</strong> Unresolved disputes may escalate to arbitration</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                  <p className="text-green-300 text-sm">
                    <strong>Payment Security:</strong> All payment processing is handled by Flutterwave, a secure payment processor. Fretiko does not store sensitive payment information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Privacy</h2>
              <div className="text-white/80 space-y-4">
                <p>Your privacy is important to us. Our privacy practices include:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📊 Data Collection</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>We collect information necessary to provide our Services</li>
                      <li>Data collection is limited to what's required</li>
                      <li>We are transparent about what we collect</li>
                      <li>You can control certain data collection preferences</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔒 Data Protection</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>We implement industry-standard security measures</li>
                      <li>Data is encrypted during transmission and storage</li>
                      <li>Access to data is strictly controlled</li>
                      <li>We regularly review and update our security practices</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">⚖️ Legal Compliance</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>We comply with applicable privacy laws</li>
                      <li>GDPR and CCPA compliance measures in place</li>
                      <li>Regular privacy audits and assessments</li>
                      <li>Privacy by design principles</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Full Policy:</strong> See our complete Privacy Policy for detailed information about our data practices.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'termination' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
              <div className="text-white/80 space-y-4">
                <p>These Terms continue until terminated by either party:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">👤 User Termination</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>You may terminate your account at any time</li>
                      <li>Delete your account through settings or contact us</li>
                      <li>Termination takes effect immediately upon deletion</li>
                      <li>Certain information may be retained for legal purposes</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🏢 Our Termination Rights</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>We may suspend or terminate accounts for violations</li>
                      <li>We can terminate for legal or regulatory reasons</li>
                      <li>We may discontinue Services with notice</li>
                      <li>Termination may be immediate for serious violations</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📋 Effect of Termination</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Access to Services is terminated immediately</li>
                  </ul>
                  </div>
                </div>

                <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
                  <p className="text-orange-300 text-sm">
                    <strong>Important:</strong> Even after termination, certain provisions of these Terms remain in effect, including intellectual property and liability limitations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'disclaimers' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Disclaimers</h2>
              <div className="text-white/80 space-y-4">
                <p>Our Services are provided "as is" with the following disclaimers:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">⚠️ No Warranties</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>We make no warranties about Service availability</li>
                      <li>No guarantees of uninterrupted or error-free operation</li>
                      <li>No warranties about accuracy or reliability of content</li>
                      <li>No warranties about third-party products or services</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔄 Service Changes</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>We may modify or discontinue Services at any time</li>
                      <li>We are not liable for service interruptions</li>
                      <li>Features may change without notice</li>
                      <li>We may update pricing and terms</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🌐 Third-Party Content</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>We are not responsible for third-party content</li>
                      <li>External links are not endorsed by us</li>
                      <li>User-generated content is not verified</li>
                      <li>We are not liable for third-party actions</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                  <p className="text-red-300 text-sm">
                    <strong>Use at Your Own Risk:</strong> Your use of our Services is at your own risk. We are not liable for any damages arising from your use.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'liability' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <div className="text-white/80 space-y-4">
                <p>Our liability is limited as follows:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🛡️ Liability Limitation</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Our total liability is limited to the amount you paid us</li>
                      <li>We are not liable for indirect, consequential, or punitive damages</li>
                      <li>We are not liable for lost profits or data</li>
                      <li>Some jurisdictions do not allow these limitations</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">⚠️ Damages Not Covered</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Loss of business or revenue</li>
                      <li>Loss of data or information</li>
                      <li>Computer damage or viruses</li>
                      <li>Emotional distress or reputational damage</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔧 Exceptions</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Liability for gross negligence or willful misconduct</li>
                      <li>Liability for personal injury or death</li>
                      <li>Liability for fraud or intentional wrongdoing</li>
                      <li>Mandatory legal requirements may apply</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                  <p className="text-purple-300 text-sm">
                    <strong>Legal Advice:</strong> These limitations may not apply in your jurisdiction. Consult legal advice for your specific situation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'disputes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Dispute Resolution</h2>
              <div className="text-white/80 space-y-4">
                <p>We prefer to resolve disputes amicably through the following process:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">💬 Informal Resolution</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Contact our support team first</li>
                      <li>Provide detailed information about the issue</li>
                      <li>Allow reasonable time for response</li>
                      <li>We will work in good faith to resolve issues</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">⚖️ Formal Dispute Resolution</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Mediation may be required for certain disputes</li>
                      <li>Arbitration may be available for some claims</li>
                      <li>Class action waivers may apply</li>
                      <li>Jury trial rights may be waived</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🏛️ Governing Law</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>These Terms are governed by applicable laws</li>
                      <li>Courts of appropriate jurisdiction have authority</li>
                      <li>International users may be subject to local laws</li>
                      <li>Legal proceedings may be expensive</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Recommendation:</strong> Most disputes can be resolved quickly through our support channels. Contact us before pursuing formal legal action.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'changes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
              <div className="text-white/80 space-y-4">
                <p>We may update these Terms from time to time:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔄 Update Process</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>We will post updated Terms on our website</li>
                      <li>Users will be notified of significant changes</li>
                      <li>Email notifications for major updates</li>
                      <li>In-app notifications for active users</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📅 Effective Date</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Changes take effect immediately upon posting</li>
                      <li>Continued use indicates acceptance</li>
                      <li>Major changes may require explicit consent</li>
                      <li>Previous versions are archived</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📋 What Can Change</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Service features and functionality</li>
                      <li>Fees and pricing structures</li>
                      <li>User obligations and responsibilities</li>
                      <li>Legal and regulatory requirements</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                  <p className="text-green-300 text-sm">
                    <strong>Stay Informed:</strong> Regularly check these Terms and our Privacy Policy for the most current information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <div className="text-white/80 space-y-4">
                <p>If you have questions about these Terms of Service:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📧 Legal Questions</h3>
                    <ul className="space-y-2 text-white/70">
                      <li><strong>Email:</strong> support@fretiko.com</li>
                      <li><strong>Response Time:</strong> Within 7 business days</li>
                      <li><strong>For:</strong> Terms interpretation, legal compliance</li>
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
                      <li>Legal Department</li>
                      <li>Port Harcourt, Nigeria</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📋 Document Requests</h3>
                    <ul className="space-y-2 text-white/70">
                      <li><strong>Email:</strong> support@fretiko.com</li>
                      <li><strong>For:</strong> Copies of agreements, policies</li>
                      <li><strong>Format:</strong> PDF or printed copies available</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                  <p className="text-yellow-300 text-sm">
                    <strong>Important:</strong> For urgent legal matters, mark your email as "URGENT LEGAL" and we will respond within 48 hours.
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
              By using Fretiko's Services, you agree to be bound by these Terms of Service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/privacy" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                Privacy Policy
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
