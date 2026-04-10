'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image'; 
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { slides } from '../utlis/utlity';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const animateIn = useCallback(() => {
    contextSafe(() => {
      const els = captionRef.current?.querySelectorAll('[data-anim]');
      if (!els) return;

      gsap.fromTo(els,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power3.out',
          clearProps: 'all' 
        }
      );
    })();
  }, [contextSafe]);

  const goTo = useCallback((idx: number) => {
    if (animating || idx === current) return;

    contextSafe(() => {
      setAnimating(true);
      const els = captionRef.current?.querySelectorAll('[data-anim]');
      
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrent(idx);
          setAnimating(false);
        }
      });

      tl.to(els || [], {
        y: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.in'
      });
    })();
  }, [animating, current, contextSafe]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    animateIn();
  }, [current, animateIn]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden bg-black" 
      style={{ height: '100vh', maxHeight: 900 }}
    >
      {/* Background Images Layer */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 will-change-opacity overflow-hidden"
          style={{ 
            opacity: i === current ? 1 : 0, 
            zIndex: i === current ? 1 : 0,
            transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <Image
            src={s.img}
            alt={s.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover transition-transform duration-[8000ms] ease-linear"
            style={{ 
              filter: 'brightness(0.7)',
              transform: i === current ? 'scale(1.05)' : 'scale(1.15)',
            }}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

      {/* Content Layer */}
      <div ref={captionRef} className="absolute bottom-16 left-8 md:left-16 z-20 max-w-xl">
        <span 
          data-anim 
          className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase mb-5 px-4 py-1.5 rounded-full bg-emerald-600 text-white shadow-xl"
        >
          {slide.tag}
        </span>
        <h1 
          data-anim 
          className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          {slide.title}
        </h1>
        <p 
          data-anim 
          className="text-lg text-white/70 mb-10 max-w-md leading-relaxed"
        >
          {slide.sub}
        </p>
        <button 
          data-anim 
          className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95"
        >
          {slide.cta} 
        </button>
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 right-10 z-30 flex items-center gap-8">
        <div className="flex gap-3">
          {slides.map((_, i) => (
            <button
            title='some'
              key={i}
              onClick={() => goTo(i)}
              className="h-1.5 transition-all duration-500 rounded-full"
              style={{ 
                width: i === current ? '40px' : '8px',
                background: i === current ? '#10b981' : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>
        
        <div className=" hidden md:flex gap-2">
          <NavBtn icon="‹" onClick={prev} label="Previous slide" />
          <NavBtn icon="›" onClick={next} label="Next slide" />
        </div>
      </div>

      <div className="absolute top-8 right-10 z-30 text-white/40 text-xs font-mono tracking-widest">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  );
}

function NavBtn({ icon, onClick, label }: { icon: string; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-12 h-12 rounded-full flex items-center justify-center text-white border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/20 transition-all active:scale-90"
    >
      <span className="text-2xl mt-[-4px]">{icon}</span>
    </button>
  );
}