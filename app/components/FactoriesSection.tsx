'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { factories } from '../utlis/utlity';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FactoriesSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // 1. Header Entrance
    gsap.from('.section-header', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
  
    });

    // 2. Card Entrance (Using stagger to match Products/ChooseUs sections)
    gsap.from('.factory-card', {
      y: 60,
      opacity: 0,
      duration: 1,
  
      ease: 'power4.out',
    
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="py-24 px-6 md:px-12 bg-emerald-50/30 selection:bg-emerald-500/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Aligned with the new Design Language */}
        <div className="section-header mb-20">
          <h3 className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4">
            Production Hubs
          </h3>
          <h2 className="text-5xl md:text-6xl font-black text-emerald-950 tracking-tighter">
            Top Partner <span className="text-emerald-600">Factories</span>
          </h2>
          <div className="h-1.5 w-20 bg-emerald-500 mt-6 rounded-full" />
        </div>

        {/* Responsive Grid */}
        <div className="factory-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {factories.map((f) => (
            <div
              key={f.name}
              className="factory-card group relative rounded-[2.5rem] overflow-hidden cursor-pointer h-[400px] bg-emerald-950 shadow-lg hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-500 hover:-translate-y-3"
            >
              {/* Background Image */}
              <Image
                src={f.img}
                alt={`${f.name} factory facility`}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-90"
              />
              
              {/* Gradient Scrim for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent transition-opacity duration-500 group-hover:opacity-60" />

              {/* Card Content */}
              <div className="absolute bottom-10 left-8 right-8 text-white">
                <div className="mb-4 inline-block bg-emerald-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {f.country}
                </div>
                <h3 className="text-3xl font-black mb-2 leading-tight tracking-tighter">
                  {f.name}
                </h3>
                <p className="text-emerald-300/80 text-xs font-bold uppercase tracking-widest">
                  {f.products} SKU Production Line
                </p>
              </div>

              {/* View Overlay - Consistent with Product Cards */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                 <div className="bg-white text-emerald-950 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transform translate-y-8 group-hover:translate-y-0 transition-transform">
                    View Profile
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}