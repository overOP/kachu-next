'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Move static data outside to prevent re-allocation on every render
const links = [
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Admin', href: '/admin' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Entrance animation for the whole bar
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'unset';
  }, [menuOpen]);

  const burgerLineBase = "block w-6 h-[1.5px] bg-[#2d8c5f] transition-all duration-300 ease-in-out";

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-8 h-16 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d8c5f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span className="font-bold text-xl tracking-tight text-[#2d8c5f]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Kachu Kart
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-[#2d8c5f] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center gap-3">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 w-52">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search Products..."
              className="bg-transparent text-sm text-gray-500 outline-none w-full placeholder-gray-400"
            />
          </div>

          {/* Login Button (Desktop) */}
          <button title="Login" className="w-9 h-9 rounded-full bg-gray-100 hidden border border-gray-200 md:flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Hamburger Button (Mobile Only) */}
          <button
            className="flex flex-col gap-[5px] p-2 bg-none border-none cursor-pointer md:hidden z-[70]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${burgerLineBase} ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`${burgerLineBase} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`${burgerLineBase} ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed inset-x-0 top-0 pt-20 pb-8 px-8 bg-white z-[55] shadow-xl border-b border-gray-100 transition-all duration-300 ease-in-out md:hidden ${
          menuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-xl font-semibold text-gray-800 hover:text-[#2d8c5f]"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 border-t border-gray-100">
             <button className="w-full py-3 bg-[#2d8c5f] text-white rounded-xl font-bold">
               Login / Sign Up
             </button>
          </div>
        </div>
      </div>

      {/* Background Overlay (dims content when menu is open) */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[50] md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}