"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

// Register plugin safely for SSR environments
if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin);
}

interface Brand {
  name: string;
  bg: string;
  size: number;
  label: string;
  description: string;
  imageSrc: string;
}

const brands: Brand[] = [
  { name: "pg", bg: "#1B3A8C", size: 110, label: "P&G", description: "Procter & Gamble products", imageSrc: "/shop/p&g.png" },
  { name: "loreal", bg: "#f5d4dd", size: 110, label: "L'Oréal", description: "L'Oréal Paris cosmetics", imageSrc: "/shop/L’Oreal Paris.png" },
  { name: "coco", bg: "#E8001C", size: 110, label: "Coca-Cola", description: "Coca-Cola beverages", imageSrc: "/shop/coco.png" },
  { name: "kraft", bg: "white", size: 110, label: "Kraft", description: "Kraft dairy & food products", imageSrc: "/shop/kraft.png" },
  { name: "nestle", bg: "#D0021B", size: 110, label: "Nestlé", description: "Nestlé food and drinks", imageSrc: "/shop/nestle.webp" },
  { name: "pepsi", bg: "white", size: 110, label: "Pepsi", description: "Pepsi beverages", imageSrc: "/shop/pepsi.png" },
];

const W = 2000;
const H = 400;
const TRACK_GAP = 0.17;

const ShopBy: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  
  // Store timeline references to control them individually without pausing the whole app
  const timelines = useRef<gsap.core.Tween[]>([]);

  // 1. Build Curve Logic
  const buildCurve = (): string => {
    const padding = 120;
    const usableWidth = W - padding * 2;
    const xs = brands.map((_, i) => padding + i * (usableWidth / (brands.length - 1)));
    const ys = brands.map((_, i) => (i % 2 === 0 ? 120 : 260));
    let d = `M${xs[0]},${ys[0]}`;
    for (let i = 0; i < xs.length - 1; i++) {
      const cx = (xs[i] + xs[i + 1]) / 2;
      d += ` C ${cx},${ys[i]} ${cx},${ys[i + 1]} ${xs[i + 1]},${ys[i + 1]}`;
    }
    return d;
  };

  // 2. Optimized Animation Logic
  useGSAP(() => {
    const centerIndex = Math.floor(brands.length / 2);

    brands.forEach((_, i) => {
      const startPos = 0.5 + (i - centerIndex) * TRACK_GAP;
      
      const animateNode = (index: number, currentStart: number) => {
        const endPos = currentStart + TRACK_GAP;

        const tween = gsap.to(`.brand-node-${index}`, {
          duration: 8,
          ease: "none",
          motionPath: {
            path: "#factoryPath",
            align: "#factoryPath",
            alignOrigin: [0.5, 0.5],
            start: currentStart,
            end: endPos > 1 ? 1 : endPos,
          },
          onUpdate: function () {
            const progress = this.progress();
            const currentPathPos = currentStart + progress * (endPos - currentStart);
            const target = this.targets()[0];

            // Calculate proximity to center (0.5 on the path)
            const distFromCenter = Math.abs(currentPathPos - 0.5);
            const isMid = distFromCenter < 0.07;

            gsap.to(target, {
              scale: isMid ? 1.6 : 0.85,
              zIndex: isMid ? 50 : 10,
              borderRadius: isMid ? "12px" : "50%",
              duration: 0.4,
              overwrite: "auto",
            });
          },
          onComplete: () => animateNode(index, endPos >= 1 ? 0 : endPos),
        });

        timelines.current[index] = tween;
      };

      animateNode(i, startPos < 0 ? 1 + startPos : startPos);
    });
  }, { scope: containerRef });

  // 3. Interaction Handlers
  const handleTogglePause = (isPaused: boolean) => {
    timelines.current.forEach(tl => isPaused ? tl.pause() : tl.play());
  };

  return (
    <section ref={containerRef} className="w-full bg-slate-50 py-16 overflow-hidden flex flex-col items-center">
      <h2 className="text-4xl font-extrabold text-emerald-900 mb-12 tracking-tight">
        Shop by Factories
      </h2>

      <div className="relative" style={{ width: W, height: H }}>
        {/* SVG Path Layer */}
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <path 
            id="factoryPath" 
            d={buildCurve()} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeDasharray="8 8"
            className="text-emerald-800"
          />
        </svg>

        {/* Brand Nodes */}
        {brands.map((brand, i) => (
          <div
            key={brand.name}
            className={`brand-node-${i} absolute flex items-center justify-center cursor-pointer shadow-lg will-change-transform`}
            style={{
              width: brand.size,
              height: brand.size,
              backgroundColor: brand.bg,
              left: 0,
              top: 0,
            }}
            onMouseEnter={() => { setHovered(i); handleTogglePause(true); }}
            onMouseLeave={() => { setHovered(null); handleTogglePause(false); }}
            onClick={() => router.push(`/shop/${brand.name}`)}
          >
            <div className="relative w-[60%] h-[60%] pointer-events-none">
              <Image 
                src={brand.imageSrc} 
                alt={brand.label} 
                fill 
                className="object-contain"
                sizes="100px"
              />
            </div>

            {/* Tooltip */}
            {hovered === i && (
              <div className="absolute bottom-[120%] flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl min-w-[160px] text-center border border-slate-700">
                  <p className="font-bold text-sm leading-tight">{brand.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{brand.description}</p>
                </div>
                <div className="w-3 h-3 bg-slate-900 rotate-45 -mt-1.5 border-r border-b border-slate-700" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopBy;