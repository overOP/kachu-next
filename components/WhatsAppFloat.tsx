"use client";

import { useState } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { buildWhatsAppUrl } from "@/lib/constants/contact";

const GREETING = "Hi! I have a question about Kachu Kart.";

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between bg-[#25D366] px-4 py-3">
            <span className="flex items-center gap-2 font-semibold text-white">
              <FaWhatsapp size={18} aria-hidden />
              Chat with us
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close WhatsApp chat"
              className="text-white/90 hover:text-white"
            >
              <FaTimes size={16} />
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 dark:text-zinc-300">
              कचु कार्टमा स्वागत छ! कचु कार्ट एउटा कृषि तथा दैनिक उपभोग्य वस्तु आपूर्तिकर्ता हो, जसले किसान र अन्य ग्राहकहरूलाई सामानहरू सिधै आपूर्ति गर्छ।
            </p>
            <a
              href={buildWhatsAppUrl(GREETING)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1ebd59]"
            >
              <FaWhatsapp size={16} aria-hidden />
              Start Chat
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1ebd59]"
      >
        {open ? <FaTimes size={22} /> : <FaWhatsapp size={26} />}
      </button>
    </div>
  );
}
