import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const footerData = [
    { title: "Company", links: ["About", "Products", "Factories"] },
    {
      title: "Contact Us",
      contactItems: [
        { icon: <FaPhoneAlt size={14} />, label: "9876549087" },
        { icon: <FaEnvelope size={14} />, label: "logo@gmail.com" },
        { icon: <FaPhoneAlt size={14} />, label: "9087462091" },
      ],
    },
    { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] },
  ];

  return (
    <footer className="bg-[#002018] text-white/50 py-16 px-6 md:px-12 selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2d8c5f"
                strokeWidth="2.2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span
                className="font-bold text-xl tracking-tight text-[#2d8c5f]"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Kachu Kart
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs font-medium text-white/40 border-l border-emerald-500/20 pl-4">
              A trusted wholesale marketplace bridging the gap between global
              factories and savvy buyers.
            </p>
            <div className="flex gap-3 mt-2">
              <SocialIcon
                href="#"
                icon={<FaFacebookF />}
                hoverColor="hover:bg-[#1877F2]"
              />
              <SocialIcon
                href="#"
                icon={<FaInstagram />}
                hoverColor="hover:bg-[#E4405F]"
              />
              <SocialIcon
                href="#"
                icon={<FaXTwitter />}
                hoverColor="hover:bg-black"
              />
              <SocialIcon
                href="#"
                icon={<FaWhatsapp />}
                hoverColor="hover:bg-[#25D366]"
              />
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {footerData.map((col) => (
            <div key={col.title} className="flex flex-col gap-6">
              <h4
                className="text-white text-xs uppercase tracking-[0.2em]"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links?.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(" ", "-")}`}
                      className="text-sm font-medium hover:text-emerald-400 hover:translate-x-1 transition-all duration-300 inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}

                {/* Render Contact Items with Icons if they exist */}
                {col.contactItems?.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm font-medium group"
                  >
                    <span className="text-emerald-500 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="hover:text-emerald-400 cursor-pointer transition-colors">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[10px] uppercase tracking-widest font-bold">
            &copy; 2026 <span className="text-emerald-500">Kachu Kart</span>.
            All rights reserved.
          </p>
          <div className="flex items-center gap-2 group cursor-default">
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Built by
            </span>
            <Link
              href="https://theorigintech.com"
              className="text-[10px] uppercase tracking-widest text-emerald-400 group-hover:text-white transition-colors duration-500"
            >
              Origin Tech
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper component for cleaner social buttons
function SocialIcon({
  href,
  icon,
  hoverColor,
}: {
  href: string;
  icon: React.ReactNode;
  hoverColor: string;
}) {
  return (
    <a
      href={href}
      className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 ${hoverColor} transition-all duration-300`}
    >
      <span className="text-white text-lg">{icon}</span>
    </a>
  );
}
import React from "react";
