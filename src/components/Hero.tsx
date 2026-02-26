'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    category: "DIGITAL",
    title: "Style is not a display of wealth",
    quote: "It's a city — born in the digital realm. A place where freedom meets connection.",
    author: "fretiko philosophy",
    image: "/hero1.png"
  },
  {
    id: 2,
    category: "FREEDOM",
    title: "Not bound by limits",
    quote: "Not bound by roads or walls. Not defined by nations. Built on trust, trade, and togetherness.",
    author: "fretiko manifesto",
    image: "/hero2.png"
  },
  {
    id: 3,
    category: "LIFESTYLE",
    title: "Digital freedom",
    quote: "You are free. You are safe. You are limitless. You are whole. You are fretiko.",
    author: "fretiko promise",
    image: "/hero3.png"
  },
  {
    id: 4,
    category: "CONNECTION",
    title: "Connect everything",
    quote: "Connect with the world. Connect with your people. Connect with your purpose. Connect with yourself.",
    author: "fretiko vision",
    image: "/hero4.png"
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Full screen image */}
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>

            {/* Text overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="max-w-7xl mx-auto flex items-end justify-between">
                {/* Main content */}
                <div className="flex-1 max-w-2xl">
                  <div className="mb-3 sm:mb-4">
                    <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                      {slide.category}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-3 sm:mb-4 italic">
                    "{slide.quote}"
                  </p>
                  <p className="text-emerald-400 font-semibold uppercase tracking-wider text-xs sm:text-sm">
                    {slide.author}
                  </p>
                </div>

                {/* Right side content */}
                <div className="hidden lg:block w-80 ml-12">
                  <div className="space-y-6">
                    <div className="border-l-4 border-emerald-500 pl-4">
                      <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">Travel</h3>
                      <p className="text-white/80 text-sm">Explore new horizons and discover the unknown</p>
                    </div>
                    <div className="border-l-4 border-emerald-500 pl-4">
                      <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">Lifestyle</h3>
                      <p className="text-white/80 text-sm">Live your best life with purpose and intention</p>
                    </div>
                    <div className="border-l-4 border-emerald-500 pl-4">
                      <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">Fashion</h3>
                      <p className="text-white/80 text-sm">Express yourself through style and creativity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Glossy Dots at bottom */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
              i === currentSlide 
                ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-110' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Magazine header indicator */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-20">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="text-white/60 text-xs font-bold uppercase tracking-wider hidden sm:inline">Content Slider</span>
          <div className="flex space-x-2">
            {[...Array(slides.length)].map((_, i) => (
              <div
                key={i}
                className={`w-6 sm:w-8 h-1 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'bg-emerald-500' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
