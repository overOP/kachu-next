'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}


const OWNER_DATA = {
  name: 'AJIT ADHIKARI',
  role: 'entrepreneur',
  signature: 'AJIT ADHIKARI ',
image:"/photo.jpeg",
  quote: "We aren't just moving products; we're architecting the infrastructure of modern commerce.",
  message: [
    "When we started this journey, the goal was simple: solve the friction between manufacturing and the end-user. Today, that vision has scaled into a robust ecosystem that prioritizes speed, logic, and absolute transparency.",
    "Our commitment is to build systems that don't just work, but excel under pressure. We believe in the power of efficient design—both in our software and our supply chain—to empower businesses globally."
  ]
};

export default function OwnerMessage() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax effect on the image
    gsap.to(imageRef.current, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Content revealing from the bottom
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      }
    });

    tl.from('.owner-text-reveal', {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out',
    })
    .from('.owner-quote-mark', {
      scale: 0,
      rotation: -45,
      duration: 0.8,
      ease: 'back.out(1.7)',
    }, '-=0.6');

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative py-24 lg:py-40 px-6 overflow-hidden bg-green-950">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-600/5 skew-x-12 translate-x-20" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden z-10 border border-white/10">
            <div ref={imageRef} className="relative h-[120%] w-full -top-[10%]">
              <Image
                src={OWNER_DATA.image}
                alt={OWNER_DATA.name}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
          
          {/* Floating Badge */}
          <div className="owner-text-reveal absolute -bottom-6 -right-6 md:right-10 bg-emerald-600 p-8 rounded-2xl z-20 shadow-2xl shadow-emerald-900/40">
            <p className="text-white font-black text-2xl tracking-tighter" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Est. 2024
            </p>
            <p className="text-emerald-100 text-[10px] uppercase tracking-widest font-bold">Kachu Kart</p>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="owner-quote-mark text-8xl text-emerald-500/20 font-serif absolute -top-10 left-0 hidden lg:block">
            “
          </div>
          
          <span className="owner-text-reveal text-emerald-500 font-bold tracking-[0.4em] uppercase text-[11px] mb-6 block">
            A Message from Leadership
          </span>

          <h2 
            className="owner-text-reveal text-3xl md:text-5xl font-black text-white mb-8 leading-[1.1]"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {OWNER_DATA.quote}
          </h2>

          <div className="owner-text-reveal space-y-6 text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
            {OWNER_DATA.message.map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>

          <div className="owner-text-reveal mt-12 pt-12 border-t border-white/10 flex items-center gap-6">
            <div className="flex flex-col">
              <span 
                className="text-2xl md:text-3xl text-emerald-400 italic mb-1" 
                style={{ fontFamily: 'Dancing Script, cursive' }}
              >
                {OWNER_DATA.signature}
              </span>
              <span className="text-white font-bold text-sm tracking-wide">{OWNER_DATA.name}</span>
              <span className="text-slate-500 text-xs uppercase tracking-widest mt-1">{OWNER_DATA.role}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}