'use client';

import Link from 'next/link';
import { Syne } from 'next/font/google';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import CatalogDownloadLink from '@/components/catalog/CatalogDownloadLink';

const syne = Syne({ subsets: ['latin'], weight: ['700', '800'] });

export default function Footer() {
  const footerData = [
    { title: 'Company', links: ['About', 'Products', 'Contact'] },
    {
      title: "Contact Us",
      contactItems: [
        {
          icon: <FaPhoneAlt size={14} aria-hidden />,
          label: "9876549087",
          href: "tel:+9779876549087",
        },
        {
          icon: <FaEnvelope size={14} aria-hidden />,
          label: "kachukart5@gmail.com",
          href: "mailto:kachukart5@gmail.com",
        },
        {
          icon: <FaPhoneAlt size={14} aria-hidden />,
          label: "9087462091",
          href: "tel:+9779087462091",
        },
      ],
    },
    { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'], hasCatalog: true },
  ];

  return (
    <footer className="bg-[#002018] dark:bg-zinc-950 text-white/70 py-16 px-4 sm:px-6 md:px-12 selection:bg-emerald-500/30 dark:selection:bg-sky-500/25">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-4 lg:gap-12 mb-16 sm:mb-20">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-5 rounded-3xl border border-white/8 bg-white/5 p-5 sm:p-6 lg:border-0 lg:bg-transparent lg:p-0">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-[#2d8c5f] dark:text-sky-400">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className={`${syne.className} font-bold text-xl tracking-tight text-[#2d8c5f] dark:text-sky-400`}>
                Kachu Kart
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs font-medium text-white/70 border-l border-emerald-500/20 dark:border-sky-500/25 pl-4">
              A trusted wholesale marketplace bridging the gap between global factories and savvy buyers.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <SocialIcon
                href="#"
                label="Kachu Kart on Facebook"
                icon={<FaFacebookF aria-hidden />}
                hoverColor="hover:bg-[#1877F2]"
              />
              <SocialIcon
                href="#"
                label="Kachu Kart on Instagram"
                icon={<FaInstagram aria-hidden />}
                hoverColor="hover:bg-[#E4405F]"
              />
              <SocialIcon
                href="#"
                label="Kachu Kart on X"
                icon={<FaXTwitter aria-hidden />}
                hoverColor="hover:bg-black"
              />
              <SocialIcon
                href="#"
                label="Contact Kachu Kart on WhatsApp"
                icon={<FaWhatsapp aria-hidden />}
                hoverColor="hover:bg-[#25D366]"
              />
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {footerData.map((col) => (
            <div key={col.title} className="flex flex-col gap-5 rounded-3xl border border-white/8 bg-white/5 p-5 sm:p-6 lg:border-0 lg:bg-transparent lg:p-0">
              <h4 className={`${syne.className} text-white text-xs uppercase tracking-[0.2em]`}>
                {col.title}
              </h4>
              <ul className={`flex gap-3 ${col.links ? "flex-row flex-wrap lg:flex-col" : "flex-col"}`}>
                {col.links?.map((link) => (
                  <li key={link}>
                    <Link 
                      href={`/${link.toLowerCase().replace(' ', '-')}`} 
                      className="inline-flex min-h-10 items-center rounded-full border border-white/15 bg-white/8 px-3 py-2 text-sm font-medium text-white/90 hover:text-emerald-300 dark:hover:text-sky-200 hover:border-emerald-400/40 dark:hover:border-sky-400/40 transition-all duration-300 lg:border-0 lg:bg-transparent lg:px-0 lg:py-1 lg:hover:translate-x-1"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
                {'hasCatalog' in col && col.hasCatalog ? (
                  <li>
                    <CatalogDownloadLink />
                  </li>
                ) : null}

                {/* Render Contact Items with Icons if they exist */}
                {col.contactItems?.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      className="group flex min-h-11 items-center gap-3 rounded-2xl border border-white/8 bg-white/6 px-3 py-3 text-sm font-medium text-white/90 transition-colors hover:text-emerald-300 dark:hover:text-sky-200 lg:border-0 lg:bg-transparent lg:px-0 lg:py-2"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110 dark:bg-sky-500/10 dark:text-sky-300">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 sm:pt-10 flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-xs uppercase tracking-widest font-bold text-white/80 order-2 sm:order-1">
            &copy; 2026 <span className="text-emerald-400 dark:text-sky-300">Kachu Kart</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 group cursor-default order-1 sm:order-2">
            <span className="text-xs uppercase tracking-widest font-bold text-white/80">Built by</span>
            <span className="min-h-10 inline-flex items-center rounded-md px-1 text-xs font-bold uppercase tracking-widest text-emerald-300 dark:text-sky-300">
              Yudeat
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  icon,
  hoverColor,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  hoverColor: string;
  /** Exposed to assistive tech (icon-only control) */
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white ${hoverColor} transition-all duration-300`}
    >
      <span className="text-lg">{icon}</span>
    </a>
  );
}