'use client'

import { useState } from 'react'
import Image from 'next/image'

interface HeaderProps {
  onDownloadClick: () => void
}

export default function Header({ onDownloadClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Name */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Image 
              src="/logo_main.png" 
              alt="Fretiko Logo" 
              width={36}
              height={36} 
              className="rounded-lg object-cover sm:w-10 sm:h-10"
            />
            <h1 className="text-white text-xl sm:text-2xl font-bold">fretiko</h1>
          </div>

          {/* Right Side: Download + Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Download Button */}
            <button 
              onClick={onDownloadClick}
              className="flex items-center space-x-1 sm:space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-300 font-semibold text-xs sm:text-sm"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">Get</span>
            </button>

            {/* Hamburger Menu */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="mt-3 sm:mt-4 py-3 sm:py-4 border-t border-white/10">
            <ul className="space-y-3 sm:space-y-4">
              <li><a href="#about" className="text-white/70 hover:text-white transition-colors block text-sm sm:text-base">About</a></li>
              <li><a href="#services" className="text-white/70 hover:text-white transition-colors block text-sm sm:text-base">Services</a></li>
              <li><a href="#philosophy" className="text-white/70 hover:text-white transition-colors block text-sm sm:text-base">Philosophy</a></li>
              <li><a href="#contact" className="text-white/70 hover:text-white transition-colors block text-sm sm:text-base">Contact</a></li>
              <li><a href="#careers" className="text-white/70 hover:text-white transition-colors block text-sm sm:text-base">Careers</a></li>
              <li><a href="#blog" className="text-white/70 hover:text-white transition-colors block text-sm sm:text-base">Blog</a></li>
              <li><a href="#support" className="text-white/70 hover:text-white transition-colors block text-sm sm:text-base">Support</a></li>
            </ul>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
              <p className="text-white/40 text-xs sm:text-sm">&copy; 2024 fretiko. All rights reserved.</p>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
