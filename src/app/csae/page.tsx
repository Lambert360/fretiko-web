'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function CSAEStandards() {
  const [activeSection, setActiveSection] = useState('overview')

  const handleDownloadClick = () => {
    console.log('Download clicked')
  }

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'zero-tolerance', title: 'Zero-Tolerance Policy', icon: '🚫' },
    { id: 'prohibited', title: 'Prohibited Content', icon: '⚠️' },
    { id: 'detection', title: 'Detection & Reporting', icon: '🔍' },
    { id: 'compliance', title: 'Legal Compliance', icon: '⚖️' },
    { id: 'enforcement', title: 'Enforcement', icon: '🛡️' },
    { id: 'reporting', title: 'How to Report', icon: '📧' },
    { id: 'contact', title: 'Child Safety Contact', icon: '👶' }
  ]

  return (
    <main className="min-h-screen bg-black">
      <Header onDownloadClick={handleDownloadClick} />
      
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="neon-text text-4xl md:text-5xl font-bold mb-4">
            Child Safety Standards
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Fretiko&apos;s Standards Against Child Sexual Abuse and Exploitation (CSAE)
          </p>
          <p className="text-white/50 text-sm mt-4">
            Last updated: May 5, 2026
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
                  Fretiko is committed to maintaining a safe and secure platform that protects children from exploitation, abuse, and harm. We strictly prohibit any form of Child Sexual Abuse and Exploitation (CSAE) and take all necessary steps to prevent, detect, and report such content and activity on our platform.
                </p>
                <p>
                  These standards apply to all users of the Fretiko platform, including our mobile application and website. By using our Services, you agree to comply with these child safety standards.
                </p>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Our Commitment:</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/70">
                    <li>Zero-tolerance policy for CSAE content and behavior</li>
                    <li>Proactive detection and removal of harmful content</li>
                    <li>Cooperation with law enforcement and child protection organizations</li>
                    <li>Compliance with all applicable child safety laws</li>
                    <li>Dedicated child safety point of contact</li>
                    <li>Ongoing review and improvement of safety measures</li>
                  </ul>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Scope:</strong> These standards align with Google Play&apos;s Child Safety Standards policy and the Tech Coalition&apos;s best practices for combating online child sexual exploitation and abuse.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'zero-tolerance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Zero-Tolerance Policy</h2>
              <div className="text-white/80 space-y-4">
                <p>
                  Fretiko enforces a strict zero-tolerance policy against Child Sexual Abuse and Exploitation (CSAE) and Child Sexual Abuse Material (CSAM).
                </p>
                
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                  <h3 className="font-semibold text-red-300 mb-2">What is CSAE?</h3>
                  <p className="text-white/70 text-sm">
                    CSAE refers to child sexual abuse and exploitation, including content or behavior that sexually exploits, abuses, or endangers children. This includes grooming a child for sexual exploitation, sextorting a child, trafficking of a child for sex, or otherwise sexually exploiting a child.
                  </p>
                </div>

                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                  <h3 className="font-semibold text-red-300 mb-2">What is CSAM?</h3>
                  <p className="text-white/70 text-sm">
                    CSAM (Child Sexual Abuse Material) consists of any visual depiction, including photos, videos, and computer-generated imagery, involving the use of a minor engaging in sexually explicit conduct. CSAM is illegal and strictly prohibited on our platform.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Our Zero-Tolerance Commitment:</h3>
                  <ul className="list-disc list-inside space-y-1 text-white/70">
                    <li>Immediate removal of any CSAE-related content</li>
                    <li>Permanent ban of accounts involved in CSAE activities</li>
                    <li>Reporting to law enforcement and child protection agencies</li>
                    <li>Cooperation with investigations</li>
                    <li>No exceptions, warnings, or second chances for CSAE violations</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'prohibited' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Prohibited Content & Behavior</h2>
              <div className="text-white/80 space-y-4">
                <p>The following are strictly prohibited on the Fretiko platform:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🚫 Content Violations</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Sharing, uploading, or distributing any media that depicts CSAM</li>
                      <li>Any content that depicts, encourages, or facilitates child sexual abuse or exploitation</li>
                      <li>Content that sexualizes minors, even if fictional or computer-generated</li>
                      <li>Links to external CSAM or CSAE-related content</li>
                      <li>Any attempt to store or transmit CSAM through our platform</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🚫 Behavioral Violations</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Grooming, soliciting, or engaging minors in inappropriate conversations</li>
                      <li>Attempting to arrange meetings with minors for sexual purposes</li>
                      <li>Sextortion or coercion of children</li>
                      <li>Using the platform to facilitate child trafficking or exploitation</li>
                      <li>Inappropriate interactions between adults and minors that could lead to exploitation</li>
                      <li>Any attempt to use the platform to facilitate CSAE activities or networks</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🚫 Account & Platform Misuse</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Creating accounts using false age information to circumvent age restrictions</li>
                      <li>Allowing minors under 18 to use the platform (adult supervision does not exempt this rule)</li>
                      <li>Sharing platform access with minors</li>
                      <li>Using the platform to recruit or connect with minors on other platforms</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                  <p className="text-red-300 text-sm">
                    <strong>Note:</strong> This list is not exhaustive. Any behavior that puts children at risk or violates child safety laws is strictly prohibited.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'detection' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Detection & Reporting</h2>
              <div className="text-white/80 space-y-4">
                <p>To ensure compliance and prevent CSAE, Fretiko implements the following measures:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🔍 Content Moderation</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Automated systems to detect and flag potentially harmful content</li>
                      <li>Manual review of flagged content by trained trust and safety team members</li>
                      <li>Proactive monitoring of user-generated content</li>
                      <li>Hash-based detection of known CSAM</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">👥 User Reporting</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>In-app reporting mechanism for users to report suspected CSAE</li>
                      <li>Anonymous reporting options available</li>
                      <li>Reports reviewed promptly by our safety team</li>
                      <li>Confidentiality maintained for reporters</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🤝 Law Enforcement Cooperation</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Cooperation with global law enforcement agencies</li>
                      <li>Reporting to NCMEC (National Center for Missing & Exploited Children) when applicable</li>
                      <li>Preservation of evidence to support investigations</li>
                      <li>Prompt response to legal requests related to child safety</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📊 Data Preservation</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Relevant data preserved to support law enforcement investigations</li>
                      <li>Secure storage of evidence according to legal requirements</li>
                      <li>Proper chain of custody procedures for digital evidence</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'compliance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Legal Compliance</h2>
              <div className="text-white/80 space-y-4">
                <p>Fretiko adheres to all relevant local and international child protection laws, including:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🇺🇸 United States</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
                      <li>Children&apos;s Online Privacy Protection Act (COPPA)</li>
                      <li>PROTECT Act</li>
                      <li>18 U.S.C. § 2252A (CSAM statutes)</li>
                      <li>NCMEC reporting requirements</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🇪🇺 European Union</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
                      <li>General Data Protection Regulation (GDPR) - children&apos;s data</li>
                      <li>EU Child Sexual Abuse Material Directive</li>
                      <li>Digital Services Act (DSA) provisions</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🇬🇧 United Kingdom</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
                      <li>Online Safety Act</li>
                      <li>Protection of Children Act</li>
                      <li>Sexual Offences Act</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🇳🇬 Nigeria</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70 text-sm">
                      <li>Cybercrimes (Prohibition, Prevention, etc.) Act</li>
                      <li>Child&apos;s Rights Act</li>
                      <li>Nigerian Data Protection Regulation (NDPR)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">🌐 International Standards</h3>
                  <ul className="list-disc list-inside space-y-1 text-white/70">
                    <li>Tech Coalition Child Safety Standards</li>
                    <li>WePROTECT Global Alliance principles</li>
                    <li>UN Convention on the Rights of the Child</li>
                    <li>ITU Guidelines for Child Online Protection</li>
                  </ul>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Compliance Statement:</strong> Fretiko complies with applicable child protection laws in all jurisdictions where we operate. We regularly review and update our policies to align with evolving legal requirements.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'enforcement' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Enforcement Actions</h2>
              <div className="text-white/80 space-y-4">
                <p>When CSAE violations are detected, Fretiko takes the following actions:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">1️⃣ Immediate Content Removal</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>CSAE content is removed immediately upon detection</li>
                      <li>No prior notice is provided for CSAM removal</li>
                      <li>Content is preserved for law enforcement as required</li>
                      <li>Associated metadata is logged for investigation</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">2️⃣ Account Actions</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Immediate and permanent account suspension</li>
                      <li>Device and IP address flagged for enhanced monitoring</li>
                      <li>Associated accounts investigated and potentially suspended</li>
                      <li>Account data preserved for legal proceedings</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">3️⃣ Law Enforcement Reporting</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Reports filed with appropriate law enforcement agencies</li>
                      <li>Cybertip reports to NCMEC (for U.S. incidents)</li>
                      <li>Cooperation with international law enforcement as needed</li>
                      <li>Evidence provided according to legal requirements</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">4️⃣ No Appeals for CSAE</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Account suspensions for CSAE violations are final</li>
                      <li>No appeals process for confirmed CSAE violations</li>
                      <li>Users may contact us only to provide information for investigation</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                  <p className="text-red-300 text-sm">
                    <strong>Warning:</strong> CSAE violations may result in criminal prosecution. Fretiko cooperates fully with law enforcement and provides all necessary evidence for investigations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'reporting' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">How to Report CSAE</h2>
              <div className="text-white/80 space-y-4">
                <p>If you encounter any content or behavior that violates our CSAE standards, please report it immediately:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📱 In-App Reporting</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Use the &quot;Report&quot; button on any content or user profile</li>
                      <li>Select &quot;Child Safety&quot; as the report category</li>
                      <li>Provide detailed information about the violation</li>
                      <li>Include screenshots if possible</li>
                      <li>Reports are reviewed within 24 hours</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📧 Email Reporting</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Send reports to: <strong>childsafety@fretiko.com</strong></li>
                      <li>Include relevant details: usernames, content descriptions, timestamps</li>
                      <li>Mark subject line as: &quot;URGENT: CSAE Report&quot; for immediate attention</li>
                      <li>Do not include CSAM images in your report</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📞 External Resources</h3>
                    <p className="text-white/70 mb-2">If you or someone you know is in immediate danger, contact:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li><strong>Emergency Services:</strong> 911 (US) or your local emergency number</li>
                      <li><strong>NCMEC CyberTipline:</strong> 1-800-843-5678 or <a href="https://www.cybertipline.org" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">cybertipline.org</a></li>
                      <li><strong>Nigeria:</strong> Contact NAPTIP (National Agency for the Prohibition of Trafficking in Persons)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                  <p className="text-green-300 text-sm">
                    <strong>Confidentiality:</strong> All reports are handled confidentially. Your identity will be protected to the extent permitted by law.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Child Safety Contact</h2>
              <div className="text-white/80 space-y-4">
                <p>For any child safety concerns, authorities, parents, or users can contact our dedicated Child Safety Team:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">📧 Child Safety Team</h3>
                    <ul className="space-y-2 text-white/70">
                      <li><strong>Email:</strong> childsafety@fretiko.com</li>
                      <li><strong>Response Time:</strong> Within 24 hours</li>
                      <li><strong>For:</strong> CSAE reports, safety concerns</li>
                      <li><strong>Priority:</strong> Urgent (mark subject accordingly)</li>
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
                      <li>Child Safety Department</li>
                      <li>Port Harcourt, Nigeria</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">🤝 Law Enforcement</h3>
                    <ul className="space-y-2 text-white/70">
                      <li><strong>Email:</strong> childsafety@fretiko.com</li>
                      <li><strong>Subject:</strong> &quot;Law Enforcement Request&quot;</li>
                      <li><strong>Include:</strong> Badge number and jurisdiction</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Dedicated Team:</strong> Our Child Safety Team consists of trained professionals who specialize in handling CSAE-related matters. All communications are treated with the highest priority and confidentiality.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10 mt-4">
                  <h3 className="font-semibold text-white mb-2">Ongoing Commitment to Safety</h3>
                  <p className="text-white/70">
                    Fretiko continuously updates and strengthens its child protection measures in alignment with best practices and regulatory requirements. We work with child safety experts and advocacy groups to improve our policies and detection mechanisms.
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
              These standards are part of our commitment to creating a safe platform for all users.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/terms" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
