'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { value: '500+', label: 'Products' },
  { value: '120+', label: 'Factories' },
  { value: '98%', label: 'Satisfaction' },
  { value: '24/7', label: 'Support' }, // Added a 4th to balance the grid
];

export default function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Title Animation
    gsap.from('.about-title', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-title',
        start: 'top 85%',
      },
    });

    // Content Block (Slide in)
    gsap.from('.about-content', {
      x: -40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 80%',
      },
    });

    // Image Block (Slide in)
    gsap.from('.about-image', {
      x: 40,
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-image',
        start: 'top 80%',
      },
    });

    // Stats Stagger
    gsap.from('.stat-item', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.stats-container',
        start: 'top 85%',
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 lg:py-32 px-6 md:px-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="about-title text-center mb-16 lg:mb-24">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-600 mb-4 block">
            Our Identity
          </span>
          <h2 
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            About Us
          </h2>
        </div>

        {/* Main Feature Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden bg-white shadow-2xl shadow-emerald-900/5 mb-16 lg:mb-24">
          
          {/* Text Content */}
          <div className="about-content p-8 md:p-16 flex flex-col justify-center order-2 lg:order-1">
            <h3 
              className="text-2xl md:text-3xl font-bold mb-6 text-slate-800 leading-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Welcome to Kachu Kart
            </h3>
            <div className="space-y-4 text-slate-500 text-sm md:text-base leading-relaxed">
              <p>
                Kachu Kart is your premier destination for a seamless and
                enjoyable online shopping experience. We bridge the gap between 
                top-tier manufacturers and savvy buyers.
              </p>
              <p>
                We believe shopping should be simple, fast, and reliable. 
                Whether you are seeking wholesale trends or everyday essentials, 
                our platform is architected for your absolute convenience.
              </p>
            </div>
            
            <button className="group mt-10 self-start bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/20">
              Explore Our Vision <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Optimized Image */}
          <div className="about-image relative min-h-[350px] lg:min-h-full order-1 lg:order-2 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=85"
              alt="Our manufacturing process"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Subtle Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent lg:from-white/20" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-container grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-item bg-white p-8 md:p-10 rounded-[1.5rem] border border-gray-100 text-center transition-hover hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
            >
              <div 
                className="text-3xl md:text-5xl font-black text-emerald-600 mb-2"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}