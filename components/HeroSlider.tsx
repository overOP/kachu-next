'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { HERO_SLIDES } from "@/lib/content/hero-slides";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export default function HeroSlider() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const animateIn = useCallback(() => {
    if (prefersReducedMotion) return;
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
  }, [contextSafe, prefersReducedMotion]);

  const goTo = useCallback((idx: number) => {
    if (animating || idx === current) return;
    if (prefersReducedMotion) {
      setCurrent(idx);
      return;
    }

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
  }, [animating, current, contextSafe, prefersReducedMotion]);

  const next = useCallback(() => goTo((current + 1) % HERO_SLIDES.length), [current, goTo]);
  const prev = () => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    animateIn();
  }, [current, animateIn]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, prefersReducedMotion]);

  const slide = HERO_SLIDES[current];

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-[520px] h-[78svh] max-h-[900px] sm:min-h-[600px] sm:h-[88svh] lg:h-[100vh] overflow-hidden bg-black"
    >
      {/* Background Images Layer */}
      {HERO_SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 will-change-opacity overflow-hidden ${i === current ? 'z-[1] opacity-100' : 'z-0 opacity-0'} ${prefersReducedMotion ? '' : 'transition-opacity duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]'}`}
        >
          <Image
            src={s.img}
            alt={s.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover brightness-[0.7] ${prefersReducedMotion ? "" : "transition-transform duration-[8000ms] ease-linear"} ${prefersReducedMotion ? "" : i === current ? "scale-105" : "scale-115"}`}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

      {/* Content Layer */}
      <div ref={captionRef} className="absolute bottom-24 left-4 right-4 sm:bottom-16 sm:left-8 sm:right-auto md:left-16 z-20 max-w-[min(100%,40rem)]">
        <span 
          data-anim 
          className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase mb-4 sm:mb-5 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-600 dark:bg-sky-600 text-white shadow-xl"
        >
          {slide.tag}
        </span>
        <h1 
          data-anim 
          className="font-syne text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 sm:mb-6 leading-[1.05] tracking-tight whitespace-pre-line"
        >
          {slide.title}
        </h1>
        <p 
          data-anim 
          className="text-sm sm:text-base md:text-lg text-white/70 mb-6 sm:mb-10 max-w-md leading-relaxed"
        >
          {slide.sub}
        </p>
        <button 
          data-anim 
          type="button"
          onClick={() => router.push('/products')}
          className="bg-emerald-600 hover:bg-emerald-500 dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all hover:scale-105 active:scale-95"
        >
          {slide.cta} 
        </button>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-4 right-4 sm:bottom-10 sm:left-auto sm:right-10 z-30 flex items-center justify-between sm:justify-end gap-4 sm:gap-8">
        <div className="flex gap-3">
          {HERO_SLIDES.map((_, i) => (
            i === current ? (
              <button
                key={i}
                onClick={() => goTo(i)}
                title={`Go to slide ${i + 1}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-pressed="true"
                className="h-1.5 w-10 bg-emerald-500 transition-all duration-500 rounded-full"
              />
            ) : (
              <button
                key={i}
                onClick={() => goTo(i)}
                title={`Go to slide ${i + 1}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-pressed="false"
                className="h-1.5 w-2 bg-white/30 transition-all duration-500 rounded-full"
              />
            )
          ))}
        </div>
        
        <div className="hidden md:flex gap-2">
          <NavBtn icon="‹" onClick={prev} label="Previous slide" />
          <NavBtn icon="›" onClick={next} label="Next slide" />
        </div>
      </div>

      <div className="absolute top-5 right-4 sm:top-8 sm:right-10 z-30 text-white/40 text-[10px] sm:text-xs font-mono tracking-widest">
        {String(current + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
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