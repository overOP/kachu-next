'use client';

import { useEffect } from 'react';

export function useLenis() {
  useEffect(() => {
let lenis: any = null;
    let raf: ((time: number) => void) | null = null;
    let gsap: any = null;
    let isMounted = true;

    async function setup() {
      const [{ default: Lenis }, gsapModule] = await Promise.all([
        import('lenis'),
        import('gsap'),
      ]);

      if (!isMounted) return;

      gsap = gsapModule.gsap ?? gsapModule.default ?? gsapModule;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      lenis.on('scroll', ScrollTrigger.update);

raf = (_time: number) => {
        lenis?.raf(_time * 1000);
      };

      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    setup();

    return () => {
      isMounted = false;
      if (raf && gsap?.ticker) {
        gsap.ticker.remove(raf);
      }
      lenis?.destroy();
    };
  }, []);
}
