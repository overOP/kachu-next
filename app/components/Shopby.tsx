"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Brand {
  name: string;
  bg: string;
  label: string;
  description: string;
  imageSrc: string;
}

const brands: Brand[] = [
  { name: "pg", bg: "#1B3A8C", label: "P&G", description: "Procter & Gamble industrial manufacturing", imageSrc: "/shop/p&g.png" },
  { name: "loreal", bg: "#f5d4dd", label: "L'Oréal", description: "L'Oréal Paris beauty production", imageSrc: "/shop/L’Oreal Paris.png" },
  { name: "coco", bg: "#E8001C", label: "Coca-Cola", description: "Coca-Cola bottling plant", imageSrc: "/shop/coco.png" },
  { name: "kraft", bg: "#FFFFFF", label: "Kraft", description: "Kraft dairy & food processing", imageSrc: "/shop/kraft.png" },
  { name: "nestle", bg: "#D0021B", label: "Nestlé", description: "Nestlé food and beverage systems", imageSrc: "/shop/nestle.webp" },
  { name: "pepsi", bg: "#FFFFFF", label: "Pepsi", description: "Pepsi global distribution hub", imageSrc: "/shop/pepsi.png" },
];

const ShopBy: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".brand-card");

    // Initial entrance animation
    gsap.from(cards, {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
    });

    // Hover effect setup (Individual card lift)
    cards.forEach((card) => {
      const overlay = card.querySelector(".green-overlay");
      const image = card.querySelector(".brand-image");

      const tl = gsap.timeline({ paused: true });
      tl.to(card, { y: -10, scale: 1.02, duration: 0.3, ease: "power2.out" })
        .to(overlay, { opacity: 1, duration: 0.2 }, 0)
        .to(image, { scale: 1.1, duration: 0.4 }, 0);

      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="w-full min-h-screen bg-emerald-50/30 py-24 px-6 md:px-12 flex flex-col items-center overflow-hidden"
    >
      {/* Header Section */}
      <div className="max-w-4xl text-center mb-16">
        <h3 className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4">
          Global Partners
        </h3>
        <h2 className="text-5xl md:text-6xl font-black text-emerald-950 mb-6 tracking-tighter">
          Shop by <span className="text-emerald-600">Factories</span>
        </h2>
        <div className="h-1 w-24 bg-emerald-500 mx-auto rounded-full" />
      </div>

      {/* Modern Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="brand-card group relative h-80 bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100 cursor-pointer flex flex-col items-center justify-center transition-shadow hover:shadow-2xl hover:shadow-emerald-200/50"
            onClick={() => router.push(`/shop/${brand.name}`)}
          >
            {/* Background Texture/Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-900">
                <path d="M2 20h20M5 20V8l7-4 7 4v12M9 20v-4h6v4" />
              </svg>
            </div>

            {/* Brand Image Container */}
            <div className="brand-image relative w-32 h-32 mb-6 z-10">
              <Image
                src={brand.imageSrc}
                alt={brand.label}
                fill
                className="object-contain"
                sizes="150px"
              />
            </div>

            {/* Content Container */}
            <div className="text-center px-8 z-10">
              <h4 className="text-xl font-bold text-emerald-900">{brand.label}</h4>
              <p className="text-sm text-emerald-600/70 mt-2 font-medium line-clamp-2">
                {brand.description}
              </p>
            </div>

            {/* Subtle Green Overlay on Hover */}
            <div className="green-overlay absolute inset-0 bg-gradient-to-t from-emerald-600/10 to-transparent opacity-0 pointer-events-none" />
            
            {/* Bottom Accent Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopBy;