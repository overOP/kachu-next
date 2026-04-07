'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { factories } from '../utlis/utlity';

// Register ScrollTrigger plugin safely for SSR environments

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
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '.section-header',
        start: 'top 90%',
      }
    });

    // 2. Batch Animation for Cards 
    ScrollTrigger.batch('.factory-card', {
      onEnter: (elements) => {
        gsap.fromTo(elements, 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.15, 
            ease: 'power3.out',
            overwrite: true 
          }
        );
      },
      start: 'top 85%',
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="py-24 px-6 md:px-12 bg-green-900 selection:bg-emerald-500/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="section-header text-center mb-20">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block text-emerald-500">
            Our Global Network
          </span>
          <h2 
            className="text-4xl md:text-6xl font-black text-white leading-tight" 
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Top Partner Factories
          </h2>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {factories.map((f) => (
            <div
              key={f.name}
              className="factory-card group relative rounded-[2rem] overflow-hidden cursor-pointer h-[340px] bg-neutral-900 shadow-2xl"
            >
              {/* Production-Ready Next.js Image */}
              <Image
                src={f.img}
                alt={`${f.name} factory facility`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-60 group-hover:opacity-100"
              />
              
              {/* Gradient Scrim for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

              {/* Card Content */}
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 
                  className="text-2xl font-black mb-2 leading-none" 
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {f.name}
                </h3>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/50">
                  <span>{f.country}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-400">{f.products} SKUs</span>
                </div>
              </div>

              {/* Hover Badge */}
              <div className="absolute top-6 right-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] font-bold text-white tracking-widest">
                  VIEW PROFILE
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}