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
          className="text-sm sm:text-base md:text-lg text-white/85 mb-6 sm:mb-10 max-w-md leading-relaxed"
        >
          {slide.sub}
        </p>
        <button 
          data-anim 
          type="button"
          onClick={() => router.push('/products')}
          className="min-h-11 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-emerald-500 active:scale-95 dark:bg-sky-600 dark:hover:bg-sky-500 sm:px-10 sm:py-4 sm:text-base"
        >
          {slide.cta} 
        </button>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-4 right-4 sm:bottom-10 sm:left-auto sm:right-10 z-30 flex items-center justify-between sm:justify-end gap-4 sm:gap-8">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {HERO_SLIDES.map((_, i) => (
            i === current ? (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                title={`Go to slide ${i + 1}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-pressed="true"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2"
              >
                <span className="block h-1.5 w-10 rounded-full bg-emerald-400" aria-hidden />
              </button>
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                title={`Go to slide ${i + 1}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-pressed="false"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2"
              >
                <span className="block h-1.5 w-2 rounded-full bg-white/50" aria-hidden />
              </button>
            )
          ))}
        </div>
        
        <div className="hidden md:flex gap-2">
          <NavBtn icon="‹" onClick={prev} label="Previous slide" />
          <NavBtn icon="›" onClick={next} label="Next slide" />
        </div>
      </div>

      <div className="absolute right-4 top-5 z-30 font-mono text-[10px] tracking-widest text-white/70 sm:right-10 sm:top-8 sm:text-xs">
        {String(current + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
      </div>
    </div>
  );
}

function NavBtn({ icon, onClick, label }: { icon: string; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-90"
    >
      <span className="text-2xl mt-[-4px]">{icon}</span>
    </button>
  );
}