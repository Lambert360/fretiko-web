'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import Header from '@/components/Header'
import DownloadModal from '@/components/DownloadModal'
import Link from 'next/link'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-black">
      <Header onDownloadClick={() => setIsModalOpen(true)} />
      <Hero />
      <DownloadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      {/* Services Section - Everything you need in one app */}
      <section id="features" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="neon-text text-4xl md:text-5xl font-bold mb-4">
              Everything you need in one app
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              The ultimate super-app experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-effect rounded-2xl p-8 card-hover text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 13c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/>
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-4">Social Shopping</h3>
              <p className="text-white/70 leading-relaxed">
                Shop with friends, share recommendations, and discover products through your social network.
              </p>
            </div>
            
            <div className="glass-effect rounded-2xl p-8 card-hover text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-pink rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-4">Social Network</h3>
              <p className="text-white/70 leading-relaxed">
                Connect with friends, share experiences, and build your digital community.
              </p>
            </div>
            
            <div className="glass-effect rounded-2xl p-8 card-hover text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-4">Instant Delivery</h3>
              <p className="text-white/70 leading-relaxed">
                Get your favorite products delivered in minutes with our lightning-fast service.
              </p>
            </div>
            
            <div className="glass-effect rounded-2xl p-8 card-hover text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-neon-cyan rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-4">Personalized Feed</h3>
              <p className="text-white/70 leading-relaxed">
                AI-powered recommendations that learn your preferences and shopping habits.
              </p>
            </div>
            
            <div className="glass-effect rounded-2xl p-8 card-hover text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-magenta to-neon-purple rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-4">Smart Payments</h3>
              <p className="text-white/70 leading-relaxed">
                Seamless checkout with multiple payment options and digital wallet integration.
              </p>
            </div>
            
            <div className="glass-effect rounded-2xl p-8 card-hover text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-4">Trending Insights</h3>
              <p className="text-white/70 leading-relaxed">
                Stay ahead with real-time trends and viral product discoveries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body Content Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="neon-text text-3xl md:text-4xl font-bold mb-6">
                Revolutionary Social Commerce
              </h3>
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                Fretiko seamlessly blends the best of social media with cutting-edge e-commerce, creating an ecosystem where discovery meets community.
              </p>
              <blockquote className="border-l-4 border-neon-cyan pl-6 text-white/70 italic text-lg">
                "The convergence of social interaction and shopping has never been more intuitive or engaging."
              </blockquote>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden glass-effect p-4">
                <img 
                  src="https://picsum.photos/seed/social1/600/400" 
                  alt="Social Commerce" 
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <div className="relative rounded-2xl overflow-hidden glass-effect p-4">
                <img 
                  src="/ballet.png" 
                  alt="Discovery Engine" 
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>
            <div className="order-2">
              <h3 className="neon-text text-3xl md:text-4xl font-bold mb-6">
                Personalized Discovery Engine
              </h3>
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                Our AI-powered recommendation system learns your preferences, curating products and content that truly matter to you and your social circle.
              </p>
              <blockquote className="border-l-4 border-neon-purple pl-6 text-white/70 italic text-lg">
                "It's like having a personal shopper who knows your friends' tastes too."
              </blockquote>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="neon-text text-3xl md:text-4xl font-bold mb-6">
                Community-Driven Shopping
              </h3>
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                Join millions of users who are reshaping the future of retail. Share reviews, create wishlists, and shop together in real-time.
              </p>
              <blockquote className="border-l-4 border-neon-pink pl-6 text-white/70 italic text-lg">
                "Shopping alone is so yesterday. Welcome to the era of social retail therapy."
              </blockquote>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden glass-effect p-4">
                <img 
                  src="https://picsum.photos/seed/community3/600/400" 
                  alt="Community Shopping" 
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-neon-cyan/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="neon-text text-4xl md:text-5xl font-bold mb-6">
            Ready to Join the Future?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Download Fretiko today and experience the next generation of social shopping
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              Download Now
            </button>
            <button className="px-8 py-4 rounded-full font-semibold text-white border-2 border-neon-cyan transition-all duration-300 hover:scale-105 hover:bg-neon-cyan hover:text-black">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/logo_main.png" 
                  alt="Fretiko Logo" 
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <span className="neon-text text-xl font-bold">Fretiko</span>
              </div>
              <p className="text-white/60 text-sm mb-6">
                The ultimate super-app for social media and online shopping.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-neon-cyan/20 transition-colors">
                  <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-neon-cyan/20 transition-colors">
                  <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 00-2.163-2.723c-.951-.595-2.136-.9-3.35-.9-2.49 0-4.588 2.118-4.588 4.688 0 .368.043.723.125 1.066-3.816-.196-7.203-2.055-9.479-4.878a4.742 4.742 0 00-.621 2.36c0 1.628.82 3.066 2.073 3.905a4.91 4.91 0 01-2.079-.576v.063c0 2.28 1.6 4.185 3.724 4.616a4.943 4.943 0 01-2.075.086c.584 1.84 2.274 3.183 4.278 3.222a9.912 9.912 0 01-6.15 2.13c-.399 0-.79-.023-1.175-.068a13.953 13.953 0 007.548 2.212c9.056 0 14.01-7.514 14.01-14.013 0-.213-.005-.426-.014-.637a10.049 10.049 0 002.323-2.574z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-neon-purple/20 transition-colors">
                  <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-neon-purple/20 transition-colors">
                  <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">Features</Link></li>
                <li><button onClick={() => setIsModalOpen(true)} className="text-white/60 hover:text-neon-cyan transition-colors">Download</button></li>
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">About</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-neon-cyan transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              © 2024 Fretiko. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
